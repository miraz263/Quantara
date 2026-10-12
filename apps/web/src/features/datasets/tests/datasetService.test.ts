import { describe, it, expect } from 'vitest';
import { DatasetService } from '../services/datasetService';

describe('DatasetService Unit Tests', () => {
  it('should fetch all mock datasets', async () => {
    const datasets = await DatasetService.getDatasets();
    expect(datasets.length).toBeGreaterThan(0);
  });

  it('should filter datasets by search query', async () => {
    const results = await DatasetService.getDatasets(undefined, { searchQuery: 'Clinical', favoritesOnly: false });
    expect(results.every(d => d.name.toLowerCase().includes('clinical') || d.description?.toLowerCase().includes('clinical'))).toBe(true);
  });

  it('should filter datasets by format/sourceType', async () => {
    const csvDatasets = await DatasetService.getDatasets(undefined, { searchQuery: '', sourceType: 'csv' });
    expect(csvDatasets.every(d => d.sourceType === 'csv')).toBe(true);
  });

  it('should filter datasets by status', async () => {
    const readyDatasets = await DatasetService.getDatasets(undefined, { searchQuery: '', status: 'ready' });
    expect(readyDatasets.every(d => d.status === 'ready')).toBe(true);
  });

  it('should sort datasets by row count descending', async () => {
    const sorted = await DatasetService.getDatasets(undefined, undefined, 'most_rows');
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].rowCount).toBeGreaterThanOrEqual(sorted[i + 1].rowCount);
    }
  });

  it('should import a new dataset', async () => {
    const imported = await DatasetService.importDataset('proj-001', {
      fileName: 'survey_results_2025.csv',
      sourceType: 'csv',
      sizeBytes: 1500000,
      description: 'Customer survey dataset',
      tags: ['survey', '2025'],
      importMode: 'new',
      config: { delimiter: ',' }
    });

    expect(imported.id).toBeDefined();
    expect(imported.name).toBe('survey_results_2025.csv');
    expect(imported.sourceType).toBe('csv');

    const fetched = await DatasetService.getDataset('proj-001', imported.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.name).toBe('survey_results_2025.csv');
  });

  it('should toggle dataset favorite status', async () => {
    const datasets = await DatasetService.getDatasets();
    const target = datasets[0];
    const initialFav = target.isFavorite || false;

    const updated = await DatasetService.toggleFavorite(target.id);
    expect(updated.isFavorite).toBe(!initialFav);
  });

  it('should duplicate a dataset', async () => {
    const target = (await DatasetService.getDatasets())[0];
    const duplicated = await DatasetService.duplicateDataset(target.id);

    expect(duplicated.name).toBe(`copy_${target.name}`);
    expect(duplicated.id).not.toBe(target.id);
  });

  it('should archive a dataset', async () => {
    const target = (await DatasetService.getDatasets())[0];
    const archived = await DatasetService.archiveDataset(target.id);

    expect(archived.status).toBe('archived');
  });

  it('should delete a dataset', async () => {
    const imported = await DatasetService.importDataset('proj-001', {
      fileName: 'to_be_deleted.csv',
      sourceType: 'csv',
      sizeBytes: 100,
      tags: [],
      importMode: 'new',
      config: {}
    });

    const success = await DatasetService.deleteDataset(imported.id);
    expect(success).toBe(true);

    const fetched = await DatasetService.getDataset('proj-001', imported.id);
    expect(fetched).toBeNull();
  });

  it('should retrieve column metadata summaries and dataset versions', async () => {
    const target = (await DatasetService.getDatasets())[0];
    const columns = await DatasetService.getColumnSummaries(target.id);
    expect(columns.length).toBeGreaterThan(0);
    expect(columns[0].name).toBeDefined();

    const versions = await DatasetService.getDatasetVersions(target.id);
    expect(versions.length).toBeGreaterThan(0);
  });
});
