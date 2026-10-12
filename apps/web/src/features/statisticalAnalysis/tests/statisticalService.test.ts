import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('StatisticalService Unit Tests', () => {
  it('should fetch available variables', async () => {
    const vars = await StatisticalService.getAvailableVariables('ds-001');
    expect(vars.length).toBeGreaterThan(0);
    expect(vars.some((v) => v.name === 'age')).toBe(true);
  });

  it('should execute Descriptive Statistics procedure deterministically', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-test-01',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'descriptives',
      title: 'Descriptive Statistics — age, income',
      variables: ['age', 'income'],
      options: { mean: true, median: true, stdDev: true, confidenceInterval: 95 },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.tables.length).toBeGreaterThan(0);
    expect(result.syntax).toContain('DESCRIPTIVES');
    expect(result.executionTimeMs).toBeGreaterThan(0);
  });

  it('should execute Frequencies procedure with frequency tables and valid percents', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-test-02',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'frequencies',
      title: 'Frequencies — education',
      variables: ['education'],
      options: { displayFrequencyTable: true, chartType: 'bar' },
      createdAt: new Date().toISOString(),
    });

    expect(result.procedure).toBe('frequencies');
    expect(result.tables[0].columns.some((c) => c.key === 'validPercent')).toBe(true);
    expect(result.charts.length).toBeGreaterThan(0);
  });

  it('should execute Crosstabs procedure with 2-way contingency table', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-test-03',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'crosstabs',
      title: 'Crosstabs — Education × Employment',
      variables: ['education', 'employment'],
      options: { showCounts: true, showRowPercents: true },
      createdAt: new Date().toISOString(),
    });

    expect(result.procedure).toBe('crosstabs');
    expect(result.tables[0].rows.length).toBeGreaterThan(0);
  });

  it('should execute Explore procedure with grouped descriptives', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-test-04',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'explore',
      title: 'Explore — Income by Sex',
      variables: ['income'],
      groupingVariables: ['sex'],
      options: {},
      createdAt: new Date().toISOString(),
    });

    expect(result.procedure).toBe('explore');
    expect(result.tables[0].rows.some((r) => r.group === 'Female')).toBe(true);
  });

  it('should list, duplicate, and delete analysis results', async () => {
    const list = await StatisticalService.listAnalyses('ds-001');
    expect(list.length).toBeGreaterThan(0);

    const target = list[0];
    const duplicated = await StatisticalService.duplicateAnalysis(target.id);
    expect(duplicated.title).toContain('Copy');

    const success = await StatisticalService.deleteAnalysis(duplicated.id);
    expect(success).toBe(true);
  });
});
