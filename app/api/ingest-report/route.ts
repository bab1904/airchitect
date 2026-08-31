import { GoogleGenAI, Type } from '@google/genai';
import { seedScheduleStore, searchScheduleByText, getScheduleStore } from '../../../lib/vector-store';

const getApiKey = (): string => {
  return process.env.GEMINI_API_KEY || 
         process.env.VITE_GEMINI_API_KEY || 
         process.env.REACT_APP_GEMINI_API_KEY || 
         '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey: apiKey || 'PLACEHOLDER_KEY' });

const hasValidApiKey = (): boolean => {
  const key = getApiKey();
  return Boolean(key && key !== 'PLACEHOLDER_KEY' && key.length > 10);
};

export interface IngestReportRequest {
  fieldReport?: string;
  report?: string;
  text?: string;
}

export interface ExtractedEvent {
  raw_description: string;
  discipline: string;
  start_time: string;
  end_time: string;
}

export interface IngestReportResponse {
  success: boolean;
  raw_input: string;
  extracted_event: ExtractedEvent;
  candidate_matches: Array<{
    activityId: string;
    wbsPath: string;
    discipline: string;
    description: string;
    plannedStart: string;
    plannedEnd: string;
    similarityScore: number;
  }>;
  reconciliation: {
    matched_L5_ID: string;
    matched_activity_name: string;
    confidence_score: number;
    reasoning: string;
  };
}

/**
 * Helper: Fallback heuristic extraction if Gemini key is absent
 */
function fallbackExtraction(reportText: string): ExtractedEvent {
  const t = reportText.toLowerCase();
  let discipline = "Civil";
  if (t.includes('pipe') || t.includes('welding') || t.includes('hydrotest') || t.includes('spool')) {
    discipline = "Piping";
  } else if (t.includes('cable') || t.includes('transformer') || t.includes('electrical') || t.includes('lighting')) {
    discipline = "Electrical";
  }

  // Extract time patterns like 08:30 or 8:30 AM or 16:00
  const timeMatches = reportText.match(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\b/g) || [];
  const startTime = timeMatches[0] || "08:00";
  const endTime = timeMatches[1] || "17:00";

  return {
    raw_description: reportText.replace(/^(supervisor\s*notes?|site\s*diary|daily\s*log)[\s:\-]*/i, '').trim(),
    discipline,
    start_time: startTime,
    end_time: endTime
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: IngestReportRequest = await req.json().catch(() => ({}));
    const fieldReport = body.fieldReport || body.report || body.text || '';

    if (!fieldReport || typeof fieldReport !== 'string' || fieldReport.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required 'fieldReport' string in request body." 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // -------------------------------------------------------------
    // Step 2: Use @google/genai to extract structured JSON
    // -------------------------------------------------------------
    let extractedEvent: ExtractedEvent;

    if (hasValidApiKey()) {
      try {
        const extractionResponse = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `You are an expert construction site clerk. Extract structured data from this field diary report:
"${fieldReport}"

Extract:
1. raw_description: A clean, concise summary of the core physical construction activity performed.
2. discipline: The primary engineering discipline (e.g., Civil, Piping, Electrical, Mechanical).
3. start_time: The activity start time (e.g., "08:30", "08:00 AM", or "N/A").
4. end_time: The activity completion time (e.g., "16:00", "05:00 PM", or "N/A").`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                raw_description: { type: Type.STRING },
                discipline: { type: Type.STRING },
                start_time: { type: Type.STRING },
                end_time: { type: Type.STRING }
              },
              required: ["raw_description", "discipline", "start_time", "end_time"]
            }
          }
        });

        extractedEvent = JSON.parse(extractionResponse.text || "{}");
      } catch (err) {
        console.warn("Gemini extraction failed, using fallback parser:", err);
        extractedEvent = fallbackExtraction(fieldReport);
      }
    } else {
      extractedEvent = fallbackExtraction(fieldReport);
    }

    // -------------------------------------------------------------
    // Step 3: Pass raw_description to vector store to find top 3 matches
    // -------------------------------------------------------------
    if (getScheduleStore().length === 0) {
      await seedScheduleStore();
    }

    const candidateMatches = await searchScheduleByText(
      extractedEvent.raw_description || fieldReport, 
      3
    );

    // -------------------------------------------------------------
    // Step 4: Second prompt to Gemini API for final Arbitration
    // -------------------------------------------------------------
    let reconciliation = {
      matched_L5_ID: candidateMatches[0]?.activityId || "ACT-CIV-1010",
      matched_activity_name: candidateMatches[0]?.description || "General Civil Work",
      confidence_score: candidateMatches[0] ? Math.min(candidateMatches[0].similarityScore / 100, 0.99) : 0.85,
      reasoning: `Vector cosine similarity matched with ${candidateMatches[0]?.similarityScore}% confidence against Primavera WBS item.`
    };

    if (hasValidApiKey() && candidateMatches.length > 0) {
      try {
        const arbitrationPrompt = `You are a Primavera P6 Schedule Controller for a major civil project.
We extracted this site event:
${JSON.stringify(extractedEvent, null, 2)}

Our vector search identified the following top 3 candidate schedule activities:
${JSON.stringify(candidateMatches, null, 2)}

Arbitrate and select the single best matching Activity_ID. Provide:
1. matched_L5_ID: The selected Activity_ID (e.g., "${candidateMatches[0].activityId}")
2. matched_activity_name: The exact description of the matched activity.
3. confidence_score: A float between 0.0 and 1.0 indicating your certainty.
4. reasoning: A concise 1-2 sentence engineering justification.`;

        const arbitrationResponse = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: arbitrationPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                matched_L5_ID: { type: Type.STRING },
                matched_activity_name: { type: Type.STRING },
                confidence_score: { type: Type.NUMBER },
                reasoning: { type: Type.STRING }
              },
              required: ["matched_L5_ID", "matched_activity_name", "confidence_score", "reasoning"]
            }
          }
        });

        const parsedArbitration = JSON.parse(arbitrationResponse.text || "{}");
        if (parsedArbitration.matched_L5_ID) {
          reconciliation = parsedArbitration;
        }
      } catch (err) {
        console.warn("Gemini arbitration failed, using top vector match:", err);
      }
    }

    // -------------------------------------------------------------
    // Step 5: Return the final reconciled JSON payload
    // -------------------------------------------------------------
    const responsePayload: IngestReportResponse = {
      success: true,
      raw_input: fieldReport,
      extracted_event: extractedEvent,
      candidate_matches: candidateMatches,
      reconciliation
    };

    return new Response(JSON.stringify(responsePayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error: any) {
    console.error("Ingest report API error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error?.message || "Internal server error while processing field report." 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
