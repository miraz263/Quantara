import time
from typing import Any, Dict, List, Optional
import uuid


def build_quantara_result(
    analysis_type: str,
    dataset_version_id: str,
    status: str,
    parameters: Dict[str, Any],
    tables: List[Dict[str, Any]],
    statistics: Dict[str, Any],
    summary: Optional[str] = None,
    diagnostics: Optional[List[Dict[str, Any]]] = None,
    charts: Optional[List[Dict[str, Any]]] = None,
    warnings: Optional[List[str]] = None,
    interpretation: Optional[str] = None,
    generated_code: Optional[Dict[str, str]] = None,
    start_time: Optional[float] = None
) -> Dict[str, Any]:
    """
    Standardized result builder for Quantara statistical outputs.
    Ensures frontend consumes uniform schema across all procedure types.
    """
    duration_ms = 0.0
    if start_time is not None:
        duration_ms = round((time.time() - start_time) * 1000, 2)

    return {
        "analysis_id": str(uuid.uuid4()),
        "analysis_type": analysis_type,
        "dataset_version_id": dataset_version_id,
        "status": status,
        "parameters": parameters,
        "summary": summary or f"{analysis_type.replace('_', ' ').title()} completed successfully.",
        "tables": tables,
        "statistics": statistics,
        "diagnostics": diagnostics or [],
        "charts": charts or [],
        "warnings": warnings or [],
        "interpretation": interpretation or "",
        "execution_metadata": {
            "engine": "Quantara Statistical Engine (Python/SciPy/Statsmodels)",
            "engine_version": "1.0.0",
            "duration_ms": duration_ms,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        },
        "generated_code": generated_code or {}
    }
