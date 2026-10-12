import math
from typing import Any, Dict, List, Optional
import numpy as np
import pandas as pd
from scipy import stats


def profile_dataset(df: pd.DataFrame, dataset_id: str = "") -> Dict[str, Any]:
    """
    In-depth data profiling service for ingested tabular datasets.
    Infers measurement levels, detects data types, missing values, outliers,
    and distribution characteristics.
    """
    total_rows, total_cols = df.shape
    total_cells = total_rows * total_cols
    
    missing_cells = int(df.isna().sum().sum())
    missing_pct = round((missing_cells / total_cells) * 100.0, 2) if total_cells > 0 else 0.0
    duplicate_rows = int(df.duplicated().sum())

    columns_profile = []

    for idx, col_name in enumerate(df.columns):
        series = df[col_name]
        valid_series = series.dropna()
        
        valid_count = int(len(valid_series))
        missing_count = int(total_rows - valid_count)
        missing_col_pct = round((missing_count / total_rows) * 100.0, 2) if total_rows > 0 else 0.0
        distinct_count = int(series.nunique(dropna=True))

        # Infer Data Type
        if pd.api.types.is_integer_dtype(series):
            inferred_type = 'integer'
        elif pd.api.types.is_float_dtype(series):
            inferred_type = 'float'
        elif pd.api.types.is_bool_dtype(series):
            inferred_type = 'boolean'
        elif pd.api.types.is_datetime64_any_dtype(series):
            inferred_type = 'datetime'
        else:
            inferred_type = 'string'

        # Infer Measurement Level: nominal, ordinal, scale
        if inferred_type in ['integer', 'float']:
            if distinct_count <= 5 and distinct_count < total_rows * 0.05:
                measurement_level = 'ordinal'
            else:
                measurement_level = 'scale'
        else:
            if distinct_count <= 10:
                measurement_level = 'nominal'
            else:
                measurement_level = 'nominal'

        col_dict: Dict[str, Any] = {
            "name": str(col_name),
            "data_type": inferred_type,
            "measurement_level": measurement_level,
            "column_index": idx,
            "total_count": total_rows,
            "valid_count": valid_count,
            "missing_count": missing_count,
            "missing_percentage": missing_col_pct,
            "distinct_count": distinct_count,
        }

        # Numeric stats & outlier detection
        if inferred_type in ['integer', 'float'] and valid_count > 0:
            numeric_arr = pd.to_numeric(valid_series, errors='coerce').dropna().to_numpy()
            if len(numeric_arr) > 0:
                min_val = float(np.min(numeric_arr))
                max_val = float(np.max(numeric_arr))
                mean_val = float(np.mean(numeric_arr))
                std_val = float(np.std(numeric_arr, ddof=1)) if len(numeric_arr) > 1 else 0.0
                median_val = float(np.median(numeric_arr))
                q25 = float(np.percentile(numeric_arr, 25))
                q75 = float(np.percentile(numeric_arr, 75))
                iqr = float(q75 - q25)

                # Outlier detection using IQR rule
                lower_bound = q25 - 1.5 * iqr
                upper_bound = q75 + 1.5 * iqr
                outliers = numeric_arr[(numeric_arr < lower_bound) | (numeric_arr > upper_bound)]
                outlier_count = int(len(outliers))

                skew_val = float(stats.skew(numeric_arr)) if len(numeric_arr) > 2 else 0.0
                kurt_val = float(stats.kurtosis(numeric_arr)) if len(numeric_arr) > 3 else 0.0

                col_dict.update({
                    "min": round(min_val, 4),
                    "max": round(max_val, 4),
                    "mean": round(mean_val, 4),
                    "std": round(std_val, 4),
                    "median": round(median_val, 4),
                    "quartile_25": round(q25, 4),
                    "quartile_75": round(q75, 4),
                    "iqr": round(iqr, 4),
                    "skewness": round(skew_val, 4),
                    "kurtosis": round(kurt_val, 4),
                    "outlier_count": outlier_count
                })

        # Top categories for string or nominal/ordinal
        top_cats = []
        if valid_count > 0:
            top_counts = valid_series.value_counts().head(5)
            for cat_val, cnt in top_counts.items():
                top_cats.append({
                    "value": str(cat_val),
                    "count": int(cnt),
                    "percentage": round((cnt / valid_count) * 100.0, 2)
                })
        col_dict["top_categories"] = top_cats

        columns_profile.append(col_dict)

    return {
        "dataset_id": dataset_id,
        "row_count": total_rows,
        "column_count": total_cols,
        "total_missing_cells": missing_cells,
        "missing_cell_percentage": missing_pct,
        "duplicate_rows": duplicate_rows,
        "columns": columns_profile
    }
