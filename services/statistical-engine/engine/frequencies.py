import time
from typing import Any, Dict, List, Optional
import pandas as pd

from .base import BaseStatisticalProcedure
from .normalizer import build_quantara_result


class FrequenciesProcedure(BaseStatisticalProcedure):
    """
    Computes frequency distribution tables, counts, percentages, valid percentages,
    cumulative percentages, and bar charts for categorical or ordinal variables.
    """

    def validate_inputs(self) -> None:
        variables = self.parameters.get("variables", [])
        if not variables:
            raise ValueError("At least one target variable must be selected for Frequency Analysis.")
        for var in variables:
            if var not in self.df.columns:
                raise ValueError(f"Variable '{var}' not found in dataset.")

    def execute(self) -> Dict[str, Any]:
        start_time = time.time()
        self.validate_inputs()

        variables = self.parameters.get("variables", [])
        dataset_version_id = self.parameters.get("dataset_version_id", "00000000-0000-0000-0000-000000000000")

        tables = []
        overall_stats = {}
        charts = []
        warnings = []

        for var in variables:
            series = self.df[var]
            total_n = len(series)

            counts = series.value_counts(dropna=False)
            val_counts = series.value_counts(dropna=True)
            valid_n = len(series.dropna())
            missing_n = total_n - valid_n

            rows = []
            cum_percent = 0.0

            # Sort categories (if numeric or string)
            sorted_categories = sorted(counts.index, key=lambda x: (pd.isna(x), str(x)))

            cat_labels = []
            cat_counts = []

            for cat in sorted_categories:
                count = int(counts[cat])
                is_missing = pd.isna(cat)
                
                cat_str = "Missing" if is_missing else str(cat)
                percent = round((count / total_n) * 100.0, 2)

                if is_missing:
                    valid_percent = None
                    cum_str = ""
                else:
                    valid_pct_val = round((count / valid_n) * 100.0, 2) if valid_n > 0 else 0.0
                    valid_percent = valid_pct_val
                    cum_percent += valid_pct_val
                    cum_str = f"{round(cum_percent, 2):.2f}%"
                    cat_labels.append(cat_str)
                    cat_counts.append(count)

                rows.append([
                    cat_str,
                    count,
                    f"{percent:.2f}%",
                    f"{valid_percent:.2f}%" if valid_percent is not None else "",
                    cum_str
                ])

            rows.append([
                "Total Valid",
                valid_n,
                f"{round((valid_n / total_n) * 100.0, 2):.2f}%",
                "100.00%",
                "100.00%"
            ])

            if missing_n > 0:
                rows.append([
                    "Total Missing",
                    missing_n,
                    f"{round((missing_n / total_n) * 100.0, 2):.2f}%",
                    "",
                    ""
                ])

            rows.append([
                "Total System",
                total_n,
                "100.00%",
                "",
                ""
            ])

            tables.append({
                "title": f"Frequencies: {var}",
                "columns": ["Value Category", "Frequency", "Percent", "Valid Percent", "Cumulative Percent"],
                "rows": rows
            })

            overall_stats[var] = {
                "total_n": total_n,
                "valid_n": valid_n,
                "missing_n": missing_n,
                "num_categories": len(val_counts)
            }

            # Chart data for frequency bar chart
            charts.append({
                "type": "bar",
                "title": f"Frequency Distribution of {var}",
                "data": {
                    "categories": cat_labels,
                    "series": [
                        {
                            "name": "Frequency",
                            "data": cat_counts
                        }
                    ]
                }
            })

        python_code = f"""import pandas as pd

df = pd.read_parquet('dataset.parquet')
variables = {variables}

for var in variables:
    print(f"=== Frequencies for {{var}} ===")
    freq = df[var].value_counts(dropna=False).reset_index()
    freq.columns = ['Category', 'Frequency']
    freq['Percent'] = (freq['Frequency'] / len(df)) * 100
    print(freq)
"""

        return build_quantara_result(
            analysis_type="frequency_distribution",
            dataset_version_id=dataset_version_id,
            status="completed",
            parameters=self.parameters,
            summary=f"Frequency analysis completed for {len(variables)} variable(s).",
            tables=tables,
            statistics=overall_stats,
            charts=charts,
            warnings=warnings,
            generated_code={"python": python_code},
            start_time=start_time
        )
