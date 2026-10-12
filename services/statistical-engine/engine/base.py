from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import pandas as pd


class BaseStatisticalProcedure(ABC):
    """
    Abstract Base Class for all Quantara statistical procedures.
    Ensures every calculation is deterministic, reproducible, and standardized.
    """
    
    def __init__(self, df: pd.DataFrame, parameters: Dict[str, Any]):
        self.df = df
        self.parameters = parameters

    @abstractmethod
    def validate_inputs(self) -> None:
        """Validate input variables, data types, and parameters before calculation."""
        pass

    @abstractmethod
    def execute(self) -> Dict[str, Any]:
        """Execute deterministic calculation using Pandas, NumPy, SciPy, or Statsmodels."""
        pass
