import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('Module 07 — t-Test Family & Mean Comparison Analysis Unit Tests', () => {
  it('should execute One-Sample t-Test procedure deterministically', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-onesample-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'one_sample_ttest',
      title: 'One-Sample t-Test — income (Test Value = 65000)',
      variables: ['income'],
      options: {
        testType: 'one_sample',
        testValue: 65000,
        confidenceInterval: 95,
        tail: 'two_sided',
        effectSize: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('one_sample_ttest');
    expect(result.syntax).toContain('T-TEST');
    expect(result.syntax).toContain('/TESTVAL=65000');
    expect(result.syntax).toContain('/VARIABLES=income');

    // Tables check
    expect(result.tables.length).toBeGreaterThanOrEqual(3);
    const descTbl = result.tables.find((t) => t.id === 'tbl-onesample-desc');
    const testTbl = result.tables.find((t) => t.id === 'tbl-onesample-test');
    const effectTbl = result.tables.find((t) => t.id === 'tbl-onesample-effect');

    expect(descTbl).toBeDefined();
    expect(testTbl).toBeDefined();
    expect(effectTbl).toBeDefined();

    expect(testTbl?.rows.some((r) => r.t === 16.43)).toBe(true);
    expect(testTbl?.rows.some((r) => r.meanDiff === 3420.4)).toBe(true);
    expect(effectTbl?.rows.some((r) => String(r.metric).includes("Cohen's d"))).toBe(true);
  });

  it('should execute Independent-Samples t-Test procedure with Levene and Welch results', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-indep-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'independent_ttest',
      title: 'Independent-Samples t-Test — income by sex (Male vs Female)',
      variables: ['income'],
      groupingVariables: ['sex'],
      options: {
        testType: 'independent',
        groupingVariable: 'sex',
        group1: 'Male',
        group2: 'Female',
        equalVariance: 'both',
        confidenceInterval: 95,
        effectSize: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.procedure).toBe('independent_ttest');
    expect(result.syntax).toContain('T-TEST GROUPS=sex(Male Female)');
    expect(result.tables.length).toBeGreaterThanOrEqual(3);

    const groupTbl = result.tables.find((t) => t.id === 'tbl-indep-group-stats');
    const testTbl = result.tables.find((t) => t.id === 'tbl-indep-test');
    const effectTbl = result.tables.find((t) => t.id === 'tbl-indep-effect');

    expect(groupTbl).toBeDefined();
    expect(testTbl).toBeDefined();
    expect(effectTbl).toBeDefined();

    // Check Levene test and Welch row presence
    expect(testTbl?.rows.some((r) => String(r.assumption).includes('Equal variances assumed'))).toBe(true);
    expect(testTbl?.rows.some((r) => String(r.assumption).includes('Equal variances not assumed (Welch)'))).toBe(true);
    expect(testTbl?.rows.some((r) => r.leveneF === 14.82)).toBe(true);
  });

  it('should execute Paired-Samples t-Test procedure with paired statistics and dz effect size', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-paired-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'paired_ttest',
      title: 'Paired-Samples t-Test — before_score vs after_score',
      variables: ['before_score', 'after_score'],
      options: {
        testType: 'paired',
        pairedVariables: [{ variable1: 'before_score', variable2: 'after_score' }],
        confidenceInterval: 95,
        effectSize: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.procedure).toBe('paired_ttest');
    expect(result.syntax).toContain('T-TEST PAIRS=before_score WITH after_score (PAIRED)');
    expect(result.tables.length).toBeGreaterThanOrEqual(4);

    const pairedStatsTbl = result.tables.find((t) => t.id === 'tbl-paired-stats');
    const pairedCorrTbl = result.tables.find((t) => t.id === 'tbl-paired-corr');
    const pairedTestTbl = result.tables.find((t) => t.id === 'tbl-paired-test');
    const pairedEffectTbl = result.tables.find((t) => t.id === 'tbl-paired-effect');

    expect(pairedStatsTbl).toBeDefined();
    expect(pairedCorrTbl).toBeDefined();
    expect(pairedTestTbl).toBeDefined();
    expect(pairedEffectTbl).toBeDefined();

    expect(pairedTestTbl?.rows.some((r) => r.meanDiff === -6.3)).toBe(true);
    expect(pairedEffectTbl?.rows.some((r) => String(r.metric).includes("Cohen's dz"))).toBe(true);
  });
});
