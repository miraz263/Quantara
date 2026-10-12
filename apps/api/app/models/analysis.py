import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    dataset_version_id = Column(String(36), ForeignKey("dataset_versions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    analysis_type = Column(String(100), nullable=False)
    parameters = Column(JSON, nullable=False)
    result_data = Column(JSON, nullable=False)
    status = Column(String(50), default="completed")
    execution_time_ms = Column(Float, nullable=True)
    created_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="analyses")
    dataset_version = relationship("DatasetVersion", back_populates="analyses")
