export type ProjectStatus = 'active' | 'archived' | 'draft';
export type ProjectVisibility = 'private' | 'team' | 'organization';

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  ownerName: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
  datasetCount: number;
  analysisCount: number;
  visualizationCount: number;
  reportCount: number;
  tags: string[];
  thumbnail?: string;
}

export interface ProjectFilters {
  searchQuery: string;
  status?: ProjectStatus | 'all';
  visibility?: ProjectVisibility | 'all';
  owner?: string | 'all';
  updatedTimeframe?: 'all' | 'today' | 'this_week' | 'this_month' | 'older';
}

export type ProjectSortOption =
  | 'recently_updated'
  | 'recently_created'
  | 'recently_opened'
  | 'name_asc'
  | 'name_desc'
  | 'most_datasets'
  | 'most_analyses';

export interface CreateProjectDTO {
  name: string;
  description?: string;
  tags: string[];
  visibility: ProjectVisibility;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  tags?: string[];
  visibility?: ProjectVisibility;
  status?: ProjectStatus;
}
