import os
import sys
import unittest
import io

api_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
services_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../services/statistical-engine"))
sys.path.insert(0, api_path)
sys.path.insert(0, services_path)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestQuantaraAPI(unittest.TestCase):

    def test_health_check(self):
        res = client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "ok")

    def test_readiness_check(self):
        res = client.get("/ready")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "ready")

    def test_project_and_dataset_workflow(self):
        # 1. Create project
        proj_res = client.post("/api/v1/projects/", json={"name": "Medical Study A", "description": "Biostatistical analysis"})
        self.assertEqual(proj_res.status_code, 200)
        project_id = proj_res.json()["id"]

        # 2. Upload CSV dataset
        csv_data = (
            "patient_id,age,bmi,satisfaction,treated\n"
            "P001,45,24.5,5,1\n"
            "P002,52,28.1,4,1\n"
            "P003,39,22.0,3,0\n"
            "P004,61,31.4,5,1\n"
            "P005,48,26.7,4,0\n"
            "P006,55,29.3,2,1\n"
            "P007,42,23.8,4,0\n"
            "P008,59,30.1,5,1\n"
        )
        file_obj = io.BytesIO(csv_data.encode("utf-8"))
        
        upload_res = client.post(
            "/api/v1/datasets/upload",
            data={"project_id": project_id, "description": "Test CSV upload"},
            files={"file": ("clinical_trial.csv", file_obj, "text/csv")}
        )
        if upload_res.status_code != 200:
            print("UPLOAD ERROR DETAIL:", upload_res.json())
        self.assertEqual(upload_res.status_code, 200)
        dataset_id = upload_res.json()["id"]

        # 3. Fetch preview
        preview_res = client.get(f"/api/v1/datasets/{dataset_id}/preview")
        self.assertEqual(preview_res.status_code, 200)
        self.assertEqual(preview_res.json()["total_rows"], 8)
        self.assertEqual(len(preview_res.json()["columns"]), 5)

        # 4. Fetch variables
        vars_res = client.get(f"/api/v1/datasets/{dataset_id}/variables")
        self.assertEqual(vars_res.status_code, 200)
        variables = vars_res.json()
        self.assertEqual(len(variables), 5)

        # 5. Fetch version
        ver_res = client.get(f"/api/v1/datasets/{dataset_id}/version")
        version_id = ver_res.json()["id"]

        # 6. Run Descriptive Statistics
        run_res = client.post(
            "/api/v1/analyses/run",
            json={
                "project_id": project_id,
                "dataset_version_id": version_id,
                "procedure_name": "descriptive_statistics",
                "parameters": {"variables": ["age", "bmi", "satisfaction"]}
            }
        )
        self.assertEqual(run_res.status_code, 200)
        result_data = run_res.json()["result_data"]
        self.assertEqual(result_data["status"], "completed")
        self.assertIn("age", result_data["statistics"])
        self.assertEqual(result_data["statistics"]["age"]["n_valid"], 8)


if __name__ == "__main__":
    unittest.main()
