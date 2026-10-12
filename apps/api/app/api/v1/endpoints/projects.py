import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter()


@router.post("/", response_model=ProjectResponse)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    # Default system user for development if no user specified
    system_user = db.query(User).first()
    if not system_user:
        system_user = User(
            id=str(uuid.uuid4()),
            email="researcher@quantara.ai",
            hashed_password="hashed_demo_pass",
            full_name="Quantara Researcher",
            role="admin"
        )
        db.add(system_user)
        db.commit()
        db.refresh(system_user)

    project = Project(
        id=str(uuid.uuid4()),
        owner_id=system_user.id,
        name=project_in.name,
        description=project_in.description
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.created_at.desc()).all()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    return project
