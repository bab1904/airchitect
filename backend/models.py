from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class WorkStatusEnum(str, Enum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    BLOCKED = "Blocked"

class DisciplineEnum(str, Enum):
    CIVIL = "Civil"
    PIPING = "Piping"
    ELECTRICAL = "Electrical"
    INSTRUMENTATION = "Instrumentation"
    GENERAL = "General"

class RawSiteUpdate(BaseModel):
    raw_text: str = Field(..., description="Messy voice transcription or text message from site supervisor")
    supervisor_name: Optional[str] = Field(default="Site Supervisor", description="Name or role of reporter")
    timestamp: Optional[str] = Field(default=None, description="Optional ISO timestamp")

class StructuredSiteUpdate(BaseModel):
    activity_summary: str = Field(..., description="Cleaned, standardized summary of the work performed")
    progress_percentage: int = Field(..., ge=0, le=100, description="Estimated completion percentage (0-100)")
    work_status: WorkStatusEnum = Field(..., description="Current status of the work item")
    discipline: DisciplineEnum = Field(..., description="Inferred engineering discipline")
    crew_size: Optional[int] = Field(default=None, description="Number of workers mentioned")
    quantity_completed: Optional[float] = Field(default=None, description="Numerical quantity installed or completed")
    unit_of_measure: Optional[str] = Field(default=None, description="Unit of measurement (e.g., m3, joints, meters)")
    issues_or_blockers: Optional[str] = Field(default=None, description="Any delays, weather disruptions, or material shortages")

class MatchedActivity(BaseModel):
    activity_id: str
    activity_name: str
    similarity_score: float
    discipline: str
    planned_start: str
    planned_finish: str
    previous_progress: int
    new_progress: int

class ProcessedUpdateResponse(BaseModel):
    raw_input: str
    structured_update: StructuredSiteUpdate
    matched_schedule_activity: MatchedActivity
    status_message: str
