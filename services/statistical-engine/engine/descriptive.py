import time
import math
from typing import Any, Dict, List, Optional
import numpy as np
import pandas as pd
from scipy import stats

from .base import BaseStatisticalProcedure
from .normalizer import build_quantara_result


class DescriptiveStatisticsProcedure(BaseStatisticalProcedure):
    """
    Computes univariate descriptive statistics, percentiles, normality diagnostics,
    charts, and code generation for numeric variables.
    """

    def validate_inputs(self) -> None:
        variables = self.parameters.get("variables", [])
        if not variables:
            raise ValueError("At least one target variable must be selected for Descriptive Statistics.")
        for var in variables:
            if var not in self.df.columns:
                raise ValueError(f"Variable '{var}' not found in dataset.")

    def execute(self) -> Dict[str, Any]:
        start_time = time.time()
        self.validate_inputs()

        variables = self.parameters.get("variables", [])
        dataset_version_id = self.parameters.get("dataset_version_id", "00000000-0000-0000-0000-000000000000")
        
        table_rows = []
        overall_statistics = {}
        diagnostics = []
        charts = []
        warnings = []

        columns_header = [
            "Variable", "N Valid", "N Missing", "Mean", "Std Error",
            "Median", "Std Dev", "Variance", "Skewness", "Kurtosis",
            "Min", "Max", "IQR"
        ]

        for var in variables:
            series = pd.to_numeric(self.df[var], errors='coerce')
            valid_series = series.dropna()
            
            n_valid = int(len(valid_series))
            n_total = int(len(series))
            n_missing = int(n_total - n_valid)

            if n_valid == 0:
                warnings.append(f"Variable '{var}' contains no valid numerical values.")
                table_rows.append([var, 0, n_missing, None, None, None, None, None, None, None, None, None, None])
                continue

            arr = valid_series.to_numpy()
            mean_val = float(np.mean(arr))
            median_val = float(np.median(arr))
            std_val = float(np.std(arr, ddof=1)) if n_valid > 1 else 0.0
            var_val = float(np.var(arr, ddof=1)) if n_valid > 1 else 0.0
            se_val = float(std_val / math.sqrt(n_valid)) if n_valid > 0 else 0.0
            
            min_val = float(np.min(arr))
            max_val = float(np.max(arr))
            q25 = float(np.percentile(arr, 25))
            q75 = float(np.percentile(arr, 75))
            iqr_val = float(q75 - q25)

            skew_val = float(stats.skew(arr)) if n_valid > 2 else 0.0
            kurt_val = float(stats.kurtosis(arr)) if n_valid > 3 else 0.0

            # Shapiro-Wilk Normality test diagnostic
            if 3 <= n_valid <= 5000:
                shapiro_stat, shapiro_p = stats.shapiro(arr)
                is_normal = shapiro_p > 0.05
                diagnostics.append({
                    "name": f"Shapiro-Wilk Normality Test ({var})",
                    "status": "passed" if is_normal else "warning",
                    "statistic_value": round(float(shapiro_stat), 4),
                    "p_value": round(float(shapiro_p), 4),
                    "message": f"Distribution is {'approximately normal (p > 0.05)' if is_normal else 'non-normal (p <= 0.05)'}."
                })

            table_rows.append([
                var,
                n_valid,
                n_missing,
                round(mean_val, 4),
                round(se_val, 4),
                round(median_val, 4),
                round(std_val, 4),
                round(var_val, 4),
                round(skew_val, 4),
                round(kurt_val, 4),
                round(min_val, 4),
                round(max_val, 4),
                round(iqr_val, 4)
            ])

            overall_statistics[var] = {
                "n_valid": n_valid,
                "n_missing": n_missing,
                "mean": round(mean_val, 4),
                "median": round(median_val, 4),
                "std_dev": round(std_val, 4),
                "variance": round(var_val, 4),
                "min": round(min_val, 4),
                "max": round(max_val, 4),
                "q25": round(q25, 4),
                "q75": round(q75, 4),
                "iqr": round(iqr_val, 4),
                "skewness": round(skew_val, 4),
                "kurtosis": round(kurt_val, 4)
            }

            # Histogram & Boxplot ECharts data structure
            counts, bin_edges = np.histogram(arr, bins='auto')
            bin_labels = [f"{bin_edges[i]:.2f}-{bin_edges[i+1]:.2f}" for i in range(len(counts))]

            charts.append({
                "type": "histogram",
                "title": f"Distribution Histogram of {var}",
                "data": {
                    "categories": bin_labels,
                    "series": [
                        {
                            "name": var,
                            "data": [int(c) for c in counts]
                        }
                    ]
                }
            })

            charts.append({
                "type": "boxplot",
                "title": f"Box Plot of {var}",
                "data": {
                    "categories": [var],
                    "series": [
                        {
                            "name": var,
                            "data": [[round(min_val, 4), round(q25, 4), round(median_val, 4), round(q75, 4), round(max_val, 4)]]
                        }
                    ]
                }
            })

        python_code = f"""import pandas as pd
import numpy as np
from scipy import stats

# Read dataset
df = pd.read_parquet('dataset.parquet')

# Variables selected
variables = {variables}

# Compute descriptive statistics
descriptives = df[variables].describe(percentiles=[.25, .50, .75]).T
descriptives['skewness'] = df[variables].skew()
descriptives['kurtosis'] = df[variables].kurtosis()
print(descriptives)
"""

        r_code = f"""library(psych)

# Read dataset
df <- read.csv('dataset.csv')

# Compute descriptive statistics
describe(df[c({", ".join([f'"{v}"' for v in variables])})])
"""

        summary_text = (
            f"Descriptive statistics computed for {len(variables)} variable(s) "
            f"across {len(self.df)} total rows."
        )

        tables = [{
            "title": "Descriptive Statistics",
            "columns": columns_header,
            "rows": table_rows,
            "footnotes": [
                "Std Error = Standard Error of Mean",
                "IQR = Interquartile Range (75th Percentile - 25th Percentile)"
            ]
        }]

        return build_quantara_result(
            analysis_type="descriptive_statistics",
            dataset_version_id=dataset_version_id,
            status="completed" if not warnings else "warning",
            parameters=self.parameters,
            summary=summary_text,
            tables=tables,
            statistics=overall_statistics,
            diagnostics=diagnostics,
            charts=charts,
            warnings=warnings,
            interpretation=self._build_interpretation(overall_statistics),
            generated_code={"python": python_code, "r": r_code},
            start_time=start_time
        )

    def _build_interpretation(self, stats_map: Dict[str, Any]) -> str:
        lines = []
        for var, s in stats_map.items():
            if s.get("n_valid", 0) > 0:
                lines.append(
                    f"Variable **{var}** has a mean of {s['mean']:.4f} (SD = {s['std_dev']:.4f}) "
                    f"with median {s['median']:.4f}, ranging from {s['min']:.4f} to {s['max']:.4f}. "
                    f"Skewness is {s['skewness']:.4f}."
                )
        return "\n\n".join(lines)
