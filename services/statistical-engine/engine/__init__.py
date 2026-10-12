from typing import Any, Dict
import pandas as pd

from .base import BaseStatisticalProcedure
from .descriptive import DescriptiveStatisticsProcedure
from .frequencies import FrequenciesProcedure
from .profiler import profile_dataset


PROCEDURE_REGISTRY = {
    "descriptive_statistics": DescriptiveStatisticsProcedure,
    "descriptives": DescriptiveStatisticsProcedure,
    "frequencies": FrequenciesProcedure,
    "frequency_distribution": FrequenciesProcedure,
}


def run_statistical_procedure(
    df: pd.DataFrame,
    procedure_name: str,
    parameters: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Central dispatcher to execute deterministic statistical procedures.
    """
    procedure_cls = PROCEDURE_REGISTRY.get(procedure_name.lower())
    if not procedure_cls:
        raise ValueError(
            f"Unsupported statistical procedure '{procedure_name}'. "
            f"Supported procedures: {list(PROCEDURE_REGISTRY.keys())}"
        )
    
    procedure = procedure_cls(df=df, parameters=parameters)
    return procedure.execute()
