import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class Variable(Base):
    __tablename__ = "variables"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_version_id = Column(String(36), ForeignKey("dataset_versions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    label = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    data_type = Column(String(50), nullable=False) # integer, float, string, boolean, datetime
    measurement_level = Column(String(50), nullable=False) # nominal, ordinal, scale
    categories = Column(JSON, nullable=True)
    value_labels = Column(JSON, nullable=True)
    missing_values = Column(JSON, nullable=True)
    format = Column(String(50), nullable=True)
    column_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    dataset_version = relationship("DatasetVersion", back_populates="variables")
