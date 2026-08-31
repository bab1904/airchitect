import { pipeline, env } from '@xenova/transformers';

// Configure environment for robust cross-platform execution
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface ScheduleItemRecord {
  Activity_ID: string;
  WBS_Path: string;
  Discipline: string;
  Description: string;
  Planned_Start: string;
  Planned_End: string;
  embedding?: number[];
}

export interface MatchResult {
  activityId: string;
  wbsPath: string;
  discipline: string;
  description: string;
  plannedStart: string;
  plannedEnd: string;
  similarityScore: number;
}

// In-memory store
let scheduleMemoryStore: ScheduleItemRecord[] = [];
let extractorInstance: any = null;

/**
 * Singleton pipeline loader for 'Xenova/all-MiniLM-L6-v2'
 */
async function getExtractor() {
  if (!extractorInstance) {
    extractorInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractorInstance;
}

/**
 * 3. Generate dense vector embedding for input text using 'Xenova/all-MiniLM-L6-v2'
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data as Float32Array);
}

/**
 * Cosine similarity between two normalized vectors (Inner Product)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Find top-K closest schedule items for a given query embedding
 */
export function findMatches(queryEmbedding: number[], topK: number = 3): MatchResult[] {
  if (scheduleMemoryStore.length === 0) {
    throw new Error("Schedule store is empty. Please call seedScheduleStore() first.");
  }

  const scored = scheduleMemoryStore.map((item) => {
    const similarity = item.embedding ? cosineSimilarity(queryEmbedding, item.embedding) : 0;
    return {
      activityId: item.Activity_ID,
      wbsPath: item.WBS_Path,
      discipline: item.Discipline,
      description: item.Description,
      plannedStart: item.Planned_Start,
      plannedEnd: item.Planned_End,
      similarityScore: Math.round(similarity * 10000) / 100 // Percentage with 2 decimals
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return scored.slice(0, topK);
}

/**
 * Search helper: converts query text to embedding and returns top matches
 */
export async function searchScheduleByText(queryText: string, topK: number = 3): Promise<MatchResult[]> {
  const queryEmbedding = await generateEmbedding(queryText);
  return findMatches(queryEmbedding, topK);
}

/**
 * Fallback static CSV content for browser & Node environments
 */
const DEFAULT_CSV_CONTENT = `Activity_ID,WBS_Path,Discipline,Description,Planned_Start,Planned_End
ACT-CIV-1010,INFRA.BRDG.SUB.EXC,Civil,Bulk Earthwork & Trench Excavation for Pier P-01 Foundation,2026-09-01,2026-09-05
ACT-CIV-1020,INFRA.BRDG.SUB.PCC,Civil,Plain Cement Concrete Blinding Layer (PCC M15) 100mm Thick,2026-09-06,2026-09-08
ACT-CIV-1030,INFRA.BRDG.SUB.REB,Civil,Fabrication and Tying of Heavy Rebar Cage for Pile Cap PC-01,2026-09-09,2026-09-13
ACT-CIV-1040,INFRA.BRDG.SUB.FOR,Civil,Modular Steel Shuttering & Formwork Erection for Pier Shaft,2026-09-14,2026-09-17
ACT-CIV-1050,INFRA.BRDG.SUB.CON,Civil,Mass Concrete Pouring (Grade M40 Self-Compacting) for Pier Shaft,2026-09-18,2026-09-19
ACT-CIV-1060,INFRA.BRDG.SUB.CUR,Civil,Continuous Wet Burlap Curing & Temperature Monitoring (7 Days),2026-09-20,2026-09-27
ACT-CIV-1070,INFRA.BRDG.SUP.CAP,Civil,Staging Erection & Cast-in-situ Concrete Pour for Pier Cap,2026-09-28,2026-10-03
ACT-CIV-1080,INFRA.BRDG.SUP.BEA,Civil,Pot-PTFE Elastomeric Bearing Pad Alignment and Grouting,2026-10-04,2026-10-06
ACT-CIV-1090,INFRA.BRDG.SUP.GIR,Civil,Precast Prestressed Concrete (PSC) I-Girder Tandem Crane Erection,2026-10-07,2026-10-11
ACT-CIV-1100,INFRA.BRDG.SUP.DEK,Civil,Reinforced Concrete Deck Slab Casting (Span 1 to 2),2026-10-12,2026-10-16
ACT-CIV-1110,INFRA.DRAIN.CUL.BOX,Civil,Precast RCC Box Culvert Segment Placement & Joint Sealing (Line C-1),2026-09-15,2026-09-20
ACT-CIV-1120,INFRA.DRAIN.SWD.CAS,Civil,Cast-in-place Stormwater U-Drain Channel Construction with Gratings,2026-09-21,2026-09-26
ACT-CIV-1130,INFRA.RETW.GEO.PAN,Civil,Reinforced Earth (RE) Wall Precast Facing Panel Placement with Geogrid,2026-09-27,2026-10-04
ACT-CIV-1140,INFRA.RETW.BAC.COM,Civil,Granular Select Fill Backfilling with Heavy Vibratory Roller Compaction,2026-10-05,2026-10-09
ACT-CIV-1150,INFRA.ROAD.SUB.GRB,Civil,Granular Sub-Base (GSB) Layer Spreading and Motor Grader Profiling,2026-10-10,2026-10-14
ACT-CIV-1160,INFRA.ROAD.BAS.WMM,Civil,Wet Mix Macadam (WMM) Base Course Laying with Sensor Paver,2026-10-15,2026-10-18
ACT-CIV-1170,INFRA.ROAD.SUR.DBM,Civil,Dense Bituminous Macadam (DBM) Binder Course Paving (75mm Thick),2026-10-19,2026-10-22
ACT-CIV-1180,INFRA.ROAD.SUR.BCP,Civil,Bituminous Concrete (BC) Wearing Surface Course Asphalt Paving (40mm),2026-10-23,2026-10-25
ACT-CIV-1190,INFRA.UTIL.SLV.DRL,Civil,Horizontal Directional Drilling (HDD) & Utility Duct Conduit Sleeving,2026-10-26,2026-10-29
ACT-CIV-1200,INFRA.ROAD.SAF.BAR,Civil,W-Beam Crash Barrier Erection, Kerb Stone Painting & Road Signage,2026-10-30,2026-11-03`;

/**
 * 4. Seed Schedule Vector Store from CSV
 */
export async function seedScheduleStore(customCsvText?: string): Promise<ScheduleItemRecord[]> {
  let csvData = customCsvText || '';

  if (!csvData && typeof window === 'undefined') {
    try {
      // Node.js environment
      const fs = await import('fs');
      const path = await import('path');
      const csvPath = path.resolve(process.cwd(), 'data/synthetic/schedule_l5.csv');
      if (fs.existsSync(csvPath)) {
        csvData = fs.readFileSync(csvPath, 'utf-8');
      }
    } catch {
      // Fallback
    }
  }

  if (!csvData) {
    csvData = DEFAULT_CSV_CONTENT;
  }

  // Parse CSV
  const lines = csvData.trim().split('\n').filter((l: string) => l.trim().length > 0);
  const rows = lines.slice(1); // skip header

  const parsedRecords: ScheduleItemRecord[] = rows.map((line: string) => {
    const parts = line.split(',');
    return {
      Activity_ID: parts[0]?.trim() || '',
      WBS_Path: parts[1]?.trim() || '',
      Discipline: parts[2]?.trim() || '',
      Description: parts[3]?.trim() || '',
      Planned_Start: parts[4]?.trim() || '',
      Planned_End: parts[5]?.trim() || '',
    };
  });

  // Generate embeddings for Description column
  for (const record of parsedRecords) {
    record.embedding = await generateEmbedding(record.Description);
  }

  scheduleMemoryStore = parsedRecords;
  return scheduleMemoryStore;
}

export function getScheduleStore(): ScheduleItemRecord[] {
  return scheduleMemoryStore;
}
