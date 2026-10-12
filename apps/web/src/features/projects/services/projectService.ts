import { Project, ProjectFilters, ProjectSortOption, CreateProjectDTO, UpdateProjectDTO } from '../types/projectTypes';
import { INITIAL_MOCK_PROJECTS } from '../mocks/projectsMock';

// In-memory persistent store during session for seamless interactive demonstration
let projectsStore: Project[] = [...INITIAL_MOCK_PROJECTS];

export class ProjectService {
  static async getProjects(filters?: ProjectFilters, sort?: ProjectSortOption): Promise<Project[]> {
    await new Promise(res => setTimeout(res, 50)); // Simulated async latency
    let result = [...projectsStore];

    if (filters) {
      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.ownerName.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        );
      }

      if (filters.status && filters.status !== 'all') {
        result = result.filter(p => p.status === filters.status);
      }

      if (filters.visibility && filters.visibility !== 'all') {
        result = result.filter(p => p.visibility === filters.visibility);
      }

      if (filters.owner && filters.owner !== 'all') {
        result = result.filter(p => p.ownerName === filters.owner);
      }

      if (filters.updatedTimeframe && filters.updatedTimeframe !== 'all') {
        const now = Date.now();
        result = result.filter(p => {
          const updatedTime = new Date(p.updatedAt).getTime();
          const diffHours = (now - updatedTime) / (1000 * 60 * 60);
          if (filters.updatedTimeframe === 'today') return diffHours <= 24;
          if (filters.updatedTimeframe === 'this_week') return diffHours <= 24 * 7;
          if (filters.updatedTimeframe === 'this_month') return diffHours <= 24 * 30;
          if (filters.updatedTimeframe === 'older') return diffHours > 24 * 30;
          return true;
        });
      }
    }

    if (sort) {
      result.sort((a, b) => {
        switch (sort) {
          case 'recently_updated':
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          case 'recently_created':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'recently_opened':
            return (new Date(b.lastOpenedAt || b.updatedAt).getTime()) - (new Date(a.lastOpenedAt || a.updatedAt).getTime());
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'most_datasets':
            return b.datasetCount - a.datasetCount;
          case 'most_analyses':
            return b.analysisCount - a.analysisCount;
          default:
            return 0;
        }
      });
    }

    return result;
  }

  static async getProject(id: string): Promise<Project | null> {
    await new Promise(res => setTimeout(res, 30));
    const found = projectsStore.find(p => p.id === id);
    if (found) {
      found.lastOpenedAt = new Date().toISOString();
      return { ...found };
    }
    return null;
  }

  static async createProject(data: CreateProjectDTO): Promise<Project> {
    await new Promise(res => setTimeout(res, 50));
    const now = new Date().toISOString();
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      ownerId: 'u-2',
      ownerName: 'Ahmed Rahman',
      status: 'active',
      visibility: data.visibility || 'team',
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now,
      datasetCount: 0,
      analysisCount: 0,
      visualizationCount: 0,
      reportCount: 0,
      tags: data.tags || ['new']
    };
    projectsStore = [newProject, ...projectsStore];
    return { ...newProject };
  }

  static async updateProject(id: string, updates: UpdateProjectDTO): Promise<Project> {
    await new Promise(res => setTimeout(res, 40));
    const idx = projectsStore.findIndex(p => p.id === id);
    if (idx === -1) throw new Error(`Project ${id} not found.`);

    const updated = {
      ...projectsStore[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    projectsStore[idx] = updated;
    return { ...updated };
  }

  static async duplicateProject(id: string): Promise<Project> {
    await new Promise(res => setTimeout(res, 50));
    const target = projectsStore.find(p => p.id === id);
    if (!target) throw new Error(`Project ${id} not found.`);

    const now = new Date().toISOString();
    const copyProject: Project = {
      ...target,
      id: `proj-${Date.now()}`,
      name: `${target.name} — Copy`,
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now
    };
    projectsStore = [copyProject, ...projectsStore];
    return { ...copyProject };
  }

  static async archiveProject(id: string): Promise<Project> {
    return this.updateProject(id, { status: 'archived' });
  }

  static async deleteProject(id: string): Promise<boolean> {
    await new Promise(res => setTimeout(res, 40));
    projectsStore = projectsStore.filter(p => p.id !== id);
    return true;
  }
}
