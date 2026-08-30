import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from google.genai import types

from models import RawSiteUpdate, StructuredSiteUpdate, ProcessedUpdateResponse, MatchedActivity
from linker import ScheduleLinker

load_dotenv()

app = FastAPI(title="AIrchitect Schedule Auto-Sync API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI & FAISS Linker
API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("REACT_APP_GEMINI_API_KEY") or ""
client = genai.Client(api_key=API_KEY) if API_KEY else None
linker = ScheduleLinker()

@app.get("/")
def read_root():
    return {"message": "AIrchitect Schedule AI Extraction & FAISS Linker Service is Running"}

@app.post("/api/extract", response_model=StructuredSiteUpdate)
async def extract_site_update(payload: RawSiteUpdate):
    """
    Parses unstructured / voice transcripts from site supervisors into strict structured JSON.
    """
    if not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="raw_text cannot be empty.")
    
    if not client:
        # Fallback heuristic parser if no API key provided
        return StructuredSiteUpdate(
            activity_summary=payload.raw_text,
            progress_percentage=100 if "finish" in payload.raw_text.lower() or "complete" in payload.raw_text.lower() else 50,
            work_status="Completed" if "finish" in payload.raw_text.lower() or "complete" in payload.raw_text.lower() else "In Progress",
            discipline="Civil" if "concrete" in payload.raw_text.lower() or "trench" in payload.raw_text.lower() else "Piping",
            crew_size=5,
            issues_or_blockers="Weather delay" if "rain" in payload.raw_text.lower() else None
        )

    prompt = f"""
    Extract structured construction progress metrics from this site supervisor update:
    "{payload.raw_text}"
    
    Ensure strict adherence to the schema: activity summary, progress % (0-100), work status, discipline, crew size, quantity, and blockers.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=StructuredSiteUpdate,
            ),
        )
        return StructuredSiteUpdate.model_validate_json(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Extraction failed: {str(e)}")

@app.post("/api/process-update", response_model=ProcessedUpdateResponse)
async def process_full_update(payload: RawSiteUpdate):
    """
    Full Pipeline: Extract messy site text -> FAISS semantic match -> Produce structured schedule delta.
    """
    # Step 1: LLM Extraction
    structured_update = await extract_site_update(payload)
    
    # Step 2: FAISS Semantic Search
    search_query = f"{structured_update.discipline.value}: {structured_update.activity_summary}"
    match = linker.match(search_query)
    
    matched_activity = MatchedActivity(
        activity_id=match["activity_id"],
        activity_name=match["activity_name"],
        similarity_score=match["similarity_score"],
        discipline=match["discipline"],
        planned_start=match["planned_start"],
        planned_finish=match["planned_finish"],
        previous_progress=20,  # Simulated baseline
        new_progress=structured_update.progress_percentage
    )

    return ProcessedUpdateResponse(
        raw_input=payload.raw_text,
        structured_update=structured_update,
        matched_schedule_activity=matched_activity,
        status_message=f"Successfully linked update to WBS {matched_activity.activity_id} ({matched_activity.activity_name}) with {matched_activity.similarity_score}% confidence."
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
