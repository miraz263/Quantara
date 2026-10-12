import { request } from './client';
import { Project } from '../types';
import { MOCK_PROJECTS } from '../mocks/mockData';

export async function getProjects(): Promise<Project[]> {
  try {
    const list = await request<Project[]>('/projects/');
    return list.length > 0 ? list : MOCK_PROJECTS;
  } catch (e) {
    return MOCK_PROJECTS;
  }
}

export async function createProject(name: string, description?: string): Promise<Project> {
  try {
    return await request<Project>('/projects/', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
  } catch (e) {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      dataset_count: 0,
      analysis_count: 0,
      status: 'active',
      collaborator_count: 1,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    return newProj;
  }
}

export async function getProjectById(projectId: string): Promise<Project> {
  try {
    return await request<Project>(`/projects/${projectId}`);
  } catch (e) {
    const found = MOCK_PROJECTS.find(p => p.id === projectId);
    return found || MOCK_PROJECTS[0];
  }
}
