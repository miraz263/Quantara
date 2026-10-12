import unittest
import pandas as pd
import numpy as np
from scipy import stats

from engine.descriptive import DescriptiveStatisticsProcedure
from engine.profiler import profile_dataset


class TestDescriptiveStatistics(unittest.TestCase):

    def setUp(self):
        np.random.seed(42)
        self.data = {
            "income": [45000, 52000, 61000, 48000, 75000, 82000, 39000, 58000, 64000, 91000],
            "satisfaction": [4, 5, 3, 4, 5, 2, 4, 3, 5, 4],
            "group": ["A", "A", "B", "B", "A", "B", "A", "B", "A", "B"]
        }
        self.df = pd.DataFrame(self.data)

    def test_descriptive_numerical_accuracy(self):
        params = {
            "variables": ["income", "satisfaction"],
            "dataset_version_id": "test-v1-uuid"
        }
        proc = DescriptiveStatisticsProcedure(self.df, params)
        result = proc.execute()

        self.assertEqual(result["status"], "completed")
        self.assertEqual(len(result["tables"]), 1)

        stats_map = result["statistics"]
        
        # Verify exact Mean & Std Dev for income
        expected_income_mean = np.mean(self.data["income"])
        expected_income_std = np.std(self.data["income"], ddof=1)
        
        self.assertAlmostEqual(stats_map["income"]["mean"], round(expected_income_mean, 4))
        self.assertAlmostEqual(stats_map["income"]["std_dev"], round(expected_income_std, 4))
        self.assertEqual(stats_map["income"]["n_valid"], 10)
        self.assertEqual(stats_map["income"]["min"], 39000)
        self.assertEqual(stats_map["income"]["max"], 91000)

        # Verify charts generated
        self.assertGreaterEqual(len(result["charts"]), 2)
        self.assertEqual(result["charts"][0]["type"], "histogram")

    def test_profiler_numerical_accuracy(self):
        profile = profile_dataset(self.df, dataset_id="ds-101")
        self.assertEqual(profile["row_count"], 10)
        self.assertEqual(profile["column_count"], 3)
        self.assertEqual(profile["total_missing_cells"], 0)

        income_col = next(c for c in profile["columns"] if c["name"] == "income")
        self.assertEqual(income_col["measurement_level"], "scale")
        self.assertEqual(income_col["data_type"], "integer")
        self.assertEqual(income_col["valid_count"], 10)


if __name__ == "__main__":
    unittest.main()
