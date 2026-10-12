from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel


class AnalysisRunRequest(BaseModel):
    project_id: str
    dataset_version_id: str
    name: Optional[str] = None
    procedure_name: str # descriptive_statistics, frequencies, etc.
    parameters: Dict[str, Any]


class AnalysisResponse(BaseModel):
    id: str
    project_id: str
    dataset_version_id: str
    name: str
    analysis_type: str
    parameters: Dict[str, Any]
    result_data: Dict[str, Any]
    status: str
    execution_time_ms: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
