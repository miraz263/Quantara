from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Quantara API Gateway",
        "version": "1.0.0"
    }


@router.get("/ready")
def readiness_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ready",
            "database": "connected",
            "statistical_engine": "ready"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection error: {str(e)}")
