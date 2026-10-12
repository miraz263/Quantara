import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('Module 06 — Correlation & Association Analysis Unit Tests', () => {
  it('should execute Pearson Correlation procedure deterministically', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-pearson-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'pearson',
      title: 'Pearson Correlation Matrix — age, income, satisfaction',
      variables: ['age', 'income', 'satisfaction'],
      options: {
        missingStrategy: 'pairwise',
        significanceType: 'two_tailed',
        confidenceLevel: 95,
        showAPA: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('pearson');
    expect(result.tables.length).toBeGreaterThan(0);
    expect(result.syntax).toContain('CORRELATIONS');
    expect(result.syntax).toContain('/MISSING = PAIRWISE');
    expect(result.syntax).toContain('/CI LEVEL = 95');

    // Verify correlation matrix table structure
    const matrixTbl = result.tables[0];
    expect(matrixTbl.title).toContain('Pearson Correlation Matrix');
    expect(matrixTbl.rows.length).toBeGreaterThan(0);
    expect(matrixTbl.rows.some((r) => r.statistic === 'Pearson r')).toBe(true);
  });

  it('should execute Spearman Rank Correlation procedure', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-spearman-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'spearman',
      title: 'Spearman Rank Correlation — satisfaction, service_quality',
      variables: ['satisfaction', 'service_quality'],
      options: {
        missingStrategy: 'pairwise',
        significanceType: 'two_tailed',
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.procedure).toBe('spearman');
    expect(result.syntax).toContain('NONPAR CORR');
    expect(result.syntax).toContain('/PRINT = SPEARMAN');
    expect(result.tables[0].rows.some((r) => r.statistic === 'Spearman rho')).toBe(true);
  });

  it('should execute Kendall Tau-b procedure', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-kendall-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'kendall',
      title: 'Kendall Tau-b — satisfaction, service_quality',
      variables: ['satisfaction', 'service_quality'],
      options: {
        significanceType: 'two_tailed',
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.procedure).toBe('kendall');
    expect(result.syntax).toContain('NONPAR CORR');
    expect(result.syntax).toContain('/PRINT = KENDALL');
    expect(result.tables[0].rows.some((r) => String(r.statistic).includes("Kendall's tau_b"))).toBe(true);
  });

  it('should execute Partial Correlation procedure with control variables', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-partial-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'partial_correlation',
      title: 'Partial Correlation — income & satisfaction BY age',
      variables: ['income', 'satisfaction'],
      options: {
        controlVariables: ['age'],
        significanceType: 'two_tailed',
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.procedure).toBe('partial_correlation');
    expect(result.syntax).toContain('PARTIAL CORR');
    expect(result.syntax).toContain('/VARIABLES = income satisfaction BY age');
    expect(result.tables[0].rows.some((r) => r.statistic === 'Partial r')).toBe(true);
    expect(result.tables[0].rows.some((r) => r.statistic === 'df')).toBe(true);
  });
});
