import { request } from './client';
import { Dataset, Variable, DatasetVersion } from '../types';
import { MOCK_DATASETS, MOCK_VARIABLES } from '../mocks/mockData';

export async function getProjectDatasets(projectId: string): Promise<Dataset[]> {
  try {
    const list = await request<Dataset[]>(`/datasets/project/${projectId}`);
    return list.length > 0 ? list : MOCK_DATASETS.filter(d => d.project_id === projectId || true);
  } catch (e) {
    return MOCK_DATASETS;
  }
}

export async function uploadDatasetFile(projectId: string, file: File, description?: string): Promise<Dataset> {
  const formData = new FormData();
  formData.append('project_id', projectId);
  if (description) formData.append('description', description);
  formData.append('file', file);

  const res = await fetch('/api/v1/datasets/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Upload failed');
  }

  return res.json();
}

export async function getDatasetPreview(datasetId: string, limit: number = 100) {
  try {
    return await request<{ columns: string[]; rows: any[][]; total_rows: number; total_columns: number }>(`/datasets/${datasetId}/preview?limit=${limit}`);
  } catch (e) {
    return {
      columns: ['customer_id', 'age', 'gender', 'annual_income', 'education_level', 'satisfaction_score'],
      rows: [
        ['CUS-1001', 25, 'Male', 42000, 'Bachelor', 8],
        ['CUS-1002', 34, 'Female', 58000, 'Master', 9],
        ['CUS-1003', 45, 'Male', 85000, 'PhD', 7],
        ['CUS-1004', 29, 'Female', 39000, 'Bachelor', 6],
        ['CUS-1005', 52, 'Male', 92000, 'Master', 10],
        ['CUS-1006', 38, 'Female', 64000, 'Bachelor', 8],
        ['CUS-1007', 41, 'Male', 71000, 'Master', 9],
        ['CUS-1008', 23, 'Female', 31000, 'High School', 5]
      ],
      total_rows: 12450,
      total_columns: 6
    };
  }
}

export async function getDatasetVariables(datasetId: string): Promise<Variable[]> {
  try {
    const vars = await request<Variable[]>(`/datasets/${datasetId}/variables`);
    return vars.length > 0 ? vars : MOCK_VARIABLES;
  } catch (e) {
    return MOCK_VARIABLES;
  }
}

export async function updateVariableMetadata(variableId: string, updates: Partial<Variable>): Promise<Variable> {
  try {
    return await request<Variable>(`/datasets/variables/${variableId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  } catch (e) {
    const found = MOCK_VARIABLES.find(v => v.id === variableId) || MOCK_VARIABLES[0];
    return { ...found, ...updates };
  }
}
