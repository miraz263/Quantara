from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel


class DatasetResponse(BaseModel):
    id: str
    project_id: str
    name: str
    description: Optional[str] = None
    file_type: str
    row_count: int
    column_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DatasetVersionResponse(BaseModel):
    id: str
    dataset_id: str
    version_number: int
    parquet_path: str
    row_count: int
    column_count: int
    checksum: str
    created_at: datetime

    class Config:
        from_attributes = True


class DataPreviewResponse(BaseModel):
    columns: List[str]
    rows: List[List[Any]]
    total_rows: int
    total_columns: int
