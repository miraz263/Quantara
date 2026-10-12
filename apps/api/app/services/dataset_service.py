import os
import hashlib
import uuid
from typing import Any, Dict, List, Tuple
import pandas as pd
from sqlalchemy.orm import Session

from app.config import settings
from app.models.dataset import Dataset, DatasetVersion
from app.models.variable import Variable
from engine.profiler import profile_dataset


def ingest_dataset_file(
    db: Session,
    project_id: str,
    file_name: str,
    file_type: str,
    file_bytes: bytes,
    description: str = ""
) -> Tuple[Dataset, DatasetVersion, Dict[str, Any]]:
    """
    Ingest uploaded CSV, XLSX, or JSON file into Quantara.
    1. Parse into Pandas DataFrame.
    2. Convert & save to Parquet format for fast DuckDB analytical query.
    3. Profile dataset & detect variable types/measurement levels.
    4. Store metadata in PostgreSQL/SQLite database.
    """
    dataset_id = str(uuid.uuid4())
    version_id = str(uuid.uuid4())
    
    dataset_dir = os.path.join(settings.STORAGE_DIR, dataset_id)
    os.makedirs(dataset_dir, exist_ok=True)
    
    raw_path = os.path.join(dataset_dir, f"raw_{file_name}")
    parquet_path = os.path.join(dataset_dir, f"version_1.parquet")

    # Save raw uploaded bytes
    with open(raw_path, "wb") as f:
        f.write(file_bytes)

    # Parse DataFrame
    try:
        if file_type.lower() == 'csv':
            df = pd.read_csv(raw_path)
        elif file_type.lower() in ['xlsx', 'xls']:
            df = pd.read_excel(raw_path)
        elif file_type.lower() == 'json':
            df = pd.read_json(raw_path)
        elif file_type.lower() == 'parquet':
            df = pd.read_parquet(raw_path)
        else:
            raise ValueError(f"Unsupported file type '{file_type}'. Supported: CSV, XLSX, JSON, Parquet.")
    except Exception as e:
        raise ValueError(f"Failed to parse dataset file: {str(e)}")

    row_count, column_count = df.shape
    if row_count == 0:
        raise ValueError("Uploaded dataset is empty (0 rows).")

    # Write standardized Parquet snapshot
    df.to_parquet(parquet_path, index=False)

    # Compute checksum
    hasher = hashlib.sha256()
    hasher.update(file_bytes)
    checksum = hasher.hexdigest()

    # Profile dataset
    profile = profile_dataset(df, dataset_id=dataset_id)

    # Create Dataset record
    dataset = Dataset(
        id=dataset_id,
        project_id=project_id,
        name=file_name.rsplit(".", 1)[0],
        description=description,
        file_type=file_type.lower(),
        storage_path=raw_path,
        row_count=row_count,
        column_count=column_count
    )
    db.add(dataset)

    # Create DatasetVersion record
    version = DatasetVersion(
        id=version_id,
        dataset_id=dataset_id,
        version_number=1,
        parquet_path=parquet_path,
        row_count=row_count,
        column_count=column_count,
        checksum=checksum
    )
    db.add(version)

    # Add Variable records from profile
    for col_info in profile["columns"]:
        variable = Variable(
            id=str(uuid.uuid4()),
            dataset_version_id=version_id,
            name=col_info["name"],
            label=col_info["name"].replace("_", " ").title(),
            data_type=col_info["data_type"],
            measurement_level=col_info["measurement_level"],
            categories=col_info.get("top_categories"),
            column_index=col_info["column_index"]
        )
        db.add(variable)

    db.commit()
    db.refresh(dataset)
    db.refresh(version)

    return dataset, version, profile
