import { Dataset, DatasetFilters, DatasetSortOption, ImportDatasetPayload, UpdateDatasetPayload, ColumnMetadataSummary, DatasetVersionInfo } from '../types/datasetTypes';
import { INITIAL_MOCK_DATASETS, MOCK_COLUMN_SUMMARIES, MOCK_DATASET_VERSIONS } from '../mocks/datasetsMock';

let datasetsStore: Dataset[] = [...INITIAL_MOCK_DATASETS];

export class DatasetService {
  static async getDatasets(projectId?: string, filters?: DatasetFilters, sort?: DatasetSortOption): Promise<Dataset[]> {
    await new Promise(res => setTimeout(res, 50));
    let result = [...datasetsStore];

    if (projectId) {
      result = result.filter(d => d.projectId === projectId);
    }

    if (filters) {
      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(d =>
          d.name.toLowerCase().includes(q) ||
          (d.description && d.description.toLowerCase().includes(q)) ||
          (d.sourceFileName && d.sourceFileName.toLowerCase().includes(q)) ||
          d.tags.some(t => t.toLowerCase().includes(q)) ||
          d.sourceType.toLowerCase().includes(q)
        );
      }

      if (filters.status && filters.status !== 'all') {
        result = result.filter(d => d.status === filters.status);
      }

      if (filters.sourceType && filters.sourceType !== 'all') {
        result = result.filter(d => d.sourceType === filters.sourceType);
      }

      if (filters.favoritesOnly) {
        result = result.filter(d => d.isFavorite);
      }

      if (filters.owner && filters.owner !== 'all') {
        result = result.filter(d => d.createdBy === filters.owner);
      }

      if (filters.sizeCategory && filters.sizeCategory !== 'all') {
        result = result.filter(d => {
          const bytes = d.sizeBytes || 0;
          if (filters.sizeCategory === 'small') return bytes <= 5 * 1024 * 1024;
          if (filters.sizeCategory === 'medium') return bytes > 5 * 1024 * 1024 && bytes <= 25 * 1024 * 1024;
          if (filters.sizeCategory === 'large') return bytes > 25 * 1024 * 1024;
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
          case 'most_rows':
            return b.rowCount - a.rowCount;
          case 'most_columns':
            return b.columnCount - a.columnCount;
          case 'file_size':
            return (b.sizeBytes || 0) - (a.sizeBytes || 0);
          case 'version':
            return b.version - a.version;
          default:
            return 0;
        }
      });
    }

    return result;
  }

  static async getDataset(projectId: string, datasetId: string): Promise<Dataset | null> {
    await new Promise(res => setTimeout(res, 30));
    const found = datasetsStore.find(d => d.id === datasetId || d.name === datasetId);
    if (found) {
      found.lastOpenedAt = new Date().toISOString();
      return { ...found };
    }
    return null;
  }

  static async importDataset(projectId: string, payload: ImportDatasetPayload): Promise<Dataset> {
    await new Promise(res => setTimeout(res, 80));
    const now = new Date().toISOString();
    const newDataset: Dataset = {
      id: `ds-${Date.now()}`,
      projectId,
      name: payload.fileName,
      description: payload.description || `Imported dataset from ${payload.fileName}`,
      sourceFileName: payload.fileName,
      sourceType: payload.sourceType,
      format: payload.sourceType.toUpperCase(),
      rowCount: 12450,
      columnCount: 18,
      sizeBytes: payload.sizeBytes || 4500000,
      status: 'ready',
      createdAt: now,
      updatedAt: now,
      createdBy: 'Dr. Sarah Khan',
      version: 1,
      tags: payload.tags || ['imported'],
      isFavorite: false,
      lastOpenedAt: now
    };
    datasetsStore = [newDataset, ...datasetsStore];
    return { ...newDataset };
  }

  static async updateDataset(datasetId: string, payload: UpdateDatasetPayload): Promise<Dataset> {
    await new Promise(res => setTimeout(res, 40));
    const idx = datasetsStore.findIndex(d => d.id === datasetId);
    if (idx === -1) throw new Error(`Dataset ${datasetId} not found.`);

    const updated = {
      ...datasetsStore[idx],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    datasetsStore[idx] = updated;
    return { ...updated };
  }

  static async toggleFavorite(datasetId: string): Promise<Dataset> {
    const found = datasetsStore.find(d => d.id === datasetId);
    if (!found) throw new Error(`Dataset ${datasetId} not found.`);
    return this.updateDataset(datasetId, { isFavorite: !found.isFavorite });
  }

  static async duplicateDataset(datasetId: string): Promise<Dataset> {
    await new Promise(res => setTimeout(res, 50));
    const target = datasetsStore.find(d => d.id === datasetId);
    if (!target) throw new Error(`Dataset ${datasetId} not found.`);

    const now = new Date().toISOString();
    const copy: Dataset = {
      ...target,
      id: `ds-${Date.now()}`,
      name: `copy_${target.name}`,
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now,
      version: 1
    };
    datasetsStore = [copy, ...datasetsStore];
    return { ...copy };
  }

  static async archiveDataset(datasetId: string): Promise<Dataset> {
    return this.updateDataset(datasetId, { status: 'archived' });
  }

  static async deleteDataset(datasetId: string): Promise<boolean> {
    await new Promise(res => setTimeout(res, 40));
    datasetsStore = datasetsStore.filter(d => d.id !== datasetId);
    return true;
  }

  static async getColumnSummaries(datasetId: string): Promise<ColumnMetadataSummary[]> {
    await new Promise(res => setTimeout(res, 20));
    return MOCK_COLUMN_SUMMARIES;
  }

  static async getDatasetVersions(datasetId: string): Promise<DatasetVersionInfo[]> {
    await new Promise(res => setTimeout(res, 20));
    return MOCK_DATASET_VERSIONS[datasetId] || [
      { versionNumber: 1, createdAt: new Date().toISOString(), createdBy: 'Dr. Sarah Khan', rowCount: 12450, columnCount: 18, changes: ['Initial import'] }
    ];
  }
}
