from typing import List, Optional
import pandas as pd
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.dataset import Dataset, DatasetVersion
from app.models.variable import Variable
from app.schemas.dataset import DatasetResponse, DatasetVersionResponse, DataPreviewResponse
from app.schemas.variable import VariableResponse, VariableUpdate
from app.services.dataset_service import ingest_dataset_file
from engine.profiler import profile_dataset

router = APIRouter()


@router.post("/upload", response_model=DatasetResponse)
async def upload_dataset(
    project_id: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_bytes = await file.read()
    file_name = file.filename or "dataset.csv"
    ext = file_name.rsplit(".", 1)[-1].lower() if "." in file_name else "csv"

    try:
        dataset, version, profile = ingest_dataset_file(
            db=db,
            project_id=project_id,
            file_name=file_name,
            file_type=ext,
            file_bytes=file_bytes,
            description=description or ""
        )
        return dataset
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to ingest dataset file: {str(e)}"
        )


@router.get("/project/{project_id}", response_model=List[DatasetResponse])
def get_project_datasets(project_id: str, db: Session = Depends(get_db)):
    return db.query(Dataset).filter(Dataset.project_id == project_id).order_by(Dataset.created_at.desc()).all()


@router.get("/{dataset_id}", response_model=DatasetResponse)
def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    return dataset


@router.get("/{dataset_id}/version", response_model=DatasetVersionResponse)
def get_latest_version(dataset_id: str, db: Session = Depends(get_db)):
    version = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == dataset_id).order_by(DatasetVersion.version_number.desc()).first()
    if not version:
        raise HTTPException(status_code=404, detail="Dataset version not found.")
    return version


@router.get("/{dataset_id}/preview", response_model=DataPreviewResponse)
def preview_dataset(dataset_id: str, limit: int = 100, db: Session = Depends(get_db)):
    version = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == dataset_id).order_by(DatasetVersion.version_number.desc()).first()
    if not version:
        raise HTTPException(status_code=404, detail="Dataset version not found.")

    try:
        df = pd.read_parquet(version.parquet_path)
        preview_df = df.head(limit)
        
        # Format rows cleanly for JSON response
        rows = preview_df.where(pd.notnull(preview_df), None).values.tolist()
        
        return {
            "columns": list(preview_df.columns),
            "rows": rows,
            "total_rows": int(version.row_count),
            "total_columns": int(version.column_count)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read parquet data: {str(e)}")


@router.get("/{dataset_id}/variables", response_model=List[VariableResponse])
def get_dataset_variables(dataset_id: str, db: Session = Depends(get_db)):
    version = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == dataset_id).order_by(DatasetVersion.version_number.desc()).first()
    if not version:
        raise HTTPException(status_code=404, detail="Dataset version not found.")

    return db.query(Variable).filter(Variable.dataset_version_id == version.id).order_by(Variable.column_index.asc()).all()


@router.patch("/variables/{variable_id}", response_model=VariableResponse)
def update_variable(variable_id: str, var_in: VariableUpdate, db: Session = Depends(get_db)):
    variable = db.query(Variable).filter(Variable.id == variable_id).first()
    if not variable:
        raise HTTPException(status_code=404, detail="Variable not found.")

    if var_in.label is not None:
        variable.label = var_in.label
    if var_in.description is not None:
        variable.description = var_in.description
    if var_in.data_type is not None:
        variable.data_type = var_in.data_type
    if var_in.measurement_level is not None:
        variable.measurement_level = var_in.measurement_level
    if var_in.missing_values is not None:
        variable.missing_values = var_in.missing_values

    db.commit()
    db.refresh(variable)
    return variable


@router.get("/{dataset_id}/profile")
def get_dataset_profile(dataset_id: str, db: Session = Depends(get_db)):
    version = db.query(DatasetVersion).filter(DatasetVersion.dataset_id == dataset_id).order_by(DatasetVersion.version_number.desc()).first()
    if not version:
        raise HTTPException(status_code=404, detail="Dataset version not found.")

    df = pd.read_parquet(version.parquet_path)
    return profile_dataset(df, dataset_id=dataset_id)
