from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class VariableUpdate(BaseModel):
    label: Optional[str] = None
    description: Optional[str] = None
    data_type: Optional[str] = None
    measurement_level: Optional[str] = None
    missing_values: Optional[List[Any]] = None


class VariableResponse(BaseModel):
    id: str
    dataset_version_id: str
    name: str
    label: Optional[str] = None
    description: Optional[str] = None
    data_type: str
    measurement_level: str
    categories: Optional[List[Any]] = None
    value_labels: Optional[Dict[str, str]] = None
    missing_values: Optional[List[Any]] = None
    column_index: int

    class Config:
        from_attributes = True
