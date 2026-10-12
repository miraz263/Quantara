import time
import uuid
from typing import List
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.analysis import Analysis
from app.models.dataset import DatasetVersion
from app.schemas.analysis import AnalysisRunRequest, AnalysisResponse
from engine import run_statistical_procedure

router = APIRouter()


@router.post("/run", response_model=AnalysisResponse)
def run_analysis(req: AnalysisRunRequest, db: Session = Depends(get_db)):
    version = db.query(DatasetVersion).filter(DatasetVersion.id == req.dataset_version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Target dataset version not found.")

    try:
        df = pd.read_parquet(version.parquet_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load dataset version Parquet: {str(e)}")

    start_t = time.time()
    params = req.parameters
    params["dataset_version_id"] = req.dataset_version_id

    try:
        result_json = run_statistical_procedure(
            df=df,
            procedure_name=req.procedure_name,
            parameters=params
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Statistical engine error during procedure '{req.procedure_name}': {str(e)}"
        )

    exec_time_ms = round((time.time() - start_t) * 1000, 2)
    analysis_name = req.name or f"{req.procedure_name.replace('_', ' ').title()} - {time.strftime('%H:%M:%S')}"

    analysis_rec = Analysis(
        id=result_json["analysis_id"],
        project_id=req.project_id,
        dataset_version_id=req.dataset_version_id,
        name=analysis_name,
        analysis_type=req.procedure_name,
        parameters=req.parameters,
        result_data=result_json,
        status="completed",
        execution_time_ms=exec_time_ms
    )
    db.add(analysis_rec)
    db.commit()
    db.refresh(analysis_rec)

    return analysis_rec


@router.get("/project/{project_id}", response_model=List[AnalysisResponse])
def get_project_analyses(project_id: str, db: Session = Depends(get_db)):
    return db.query(Analysis).filter(Analysis.project_id == project_id).order_by(Analysis.created_at.desc()).all()


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis result not found.")
    return analysis
