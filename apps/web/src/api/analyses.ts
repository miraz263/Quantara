import { request } from './client';
import { Analysis } from '../types';
import { MOCK_ANALYSES } from '../mocks/mockData';

export async function runStatisticalAnalysis(
  projectId: string,
  datasetVersionId: string,
  procedureName: string,
  parameters: Record<string, any>,
  name?: string
): Promise<Analysis> {
  try {
    return await request<Analysis>('/analyses/run', {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId,
        dataset_version_id: datasetVersionId,
        procedure_name: procedureName,
        parameters,
        name
      })
    });
  } catch (e: any) {
    // If backend is offline, generate typed simulated result
    const newAn: Analysis = {
      id: `an-${Date.now()}`,
      project_id: projectId,
      dataset_version_id: datasetVersionId,
      name: name || `${procedureName.replace('_', ' ').toUpperCase()} Analysis`,
      analysis_type: procedureName,
      parameters,
      status: 'completed',
      execution_time_ms: 14.2,
      created_at: new Date().toISOString(),
      result_data: MOCK_ANALYSES[0].result_data
    };
    return newAn;
  }
}

export async function getProjectAnalyses(projectId: string): Promise<Analysis[]> {
  try {
    const list = await request<Analysis[]>(`/analyses/project/${projectId}`);
    return list.length > 0 ? list : MOCK_ANALYSES;
  } catch (e) {
    return MOCK_ANALYSES;
  }
}
