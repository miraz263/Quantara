import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('Module 08 — ANOVA Family & Multi-Group Mean Comparison Analysis Unit Tests', () => {
  it('should execute One-Way ANOVA procedure deterministically with omnibus F, Levene, Welch, post-hoc, and effect sizes', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-oneway-anova-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'one_way_anova',
      title: 'One-Way ANOVA — income BY education',
      variables: ['income'],
      groupingVariables: ['education'],
      options: {
        dependentVariable: 'income',
        factorVariable: 'education',
        welchAnova: true,
        homogeneityTest: true,
        postHocMethod: 'tukey_gameshowell',
        effectSize: true,
        confidenceInterval: 95,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('one_way_anova');
    expect(result.syntax).toContain('ONEWAY income BY education');
    expect(result.syntax).toContain('/STATISTICS DESCRIPTIVES HOMOGENEITY WELCH');
    expect(result.syntax).toContain('/POSTHOC = TUKEY GAMESHOWELL');

    // Check tables presence
    expect(result.tables.length).toBeGreaterThanOrEqual(6);

    const descTbl = result.tables.find((t) => t.id === 'tbl-anova-desc');
    const homTbl = result.tables.find((t) => t.id === 'tbl-anova-homogeneity');
    const omnibusTbl = result.tables.find((t) => t.id === 'tbl-anova-table');
    const welchTbl = result.tables.find((t) => t.id === 'tbl-welch-anova');
    const postHocTbl = result.tables.find((t) => t.id === 'tbl-posthoc-tukey');
    const effectTbl = result.tables.find((t) => t.id === 'tbl-anova-effect');

    expect(descTbl).toBeDefined();
    expect(homTbl).toBeDefined();
    expect(omnibusTbl).toBeDefined();
    expect(welchTbl).toBeDefined();
    expect(postHocTbl).toBeDefined();
    expect(effectTbl).toBeDefined();

    // Descriptives verification
    expect(descTbl?.rows.some((r) => String(r.group).includes('Primary') && r.n === 1000)).toBe(true);
    expect(descTbl?.rows.some((r) => String(r.group).includes('Postgraduate') && r.mean === 92600.0)).toBe(true);

    // Homogeneity (Levene's Test) verification
    expect(homTbl?.rows.some((r) => r.statistic === 3.42 && r.df1 === 4 && r.df2 === 24065)).toBe(true);

    // Omnibus ANOVA test verification
    expect(omnibusTbl?.rows.some((r) => r.source === 'Between Groups' && r.f === 52.41 && r.df === 4)).toBe(true);

    // Welch robust ANOVA verification
    expect(welchTbl?.rows.some((r) => r.test === 'Welch' && r.statistic === 49.82 && r.df1 === 4)).toBe(true);

    // Post-hoc pairwise comparison verification (Tukey HSD / Games-Howell)
    expect(postHocTbl?.rows.some((r) => r.group1 === 'Primary' && r.group2 === 'Secondary' && r.meanDiff === -9050.0)).toBe(true);
    expect(postHocTbl?.rows.some((r) => r.group1 === 'Graduate' && r.group2 === 'Postgraduate' && r.meanDiff === -14200.0)).toBe(true);

    // Effect size metrics verification (Eta squared and Omega squared)
    expect(effectTbl?.rows.some((r) => String(r.metric).includes('Eta') && r.pointEstimate === 0.062)).toBe(true);
    expect(effectTbl?.rows.some((r) => String(r.metric).includes('Omega') && r.pointEstimate === 0.061)).toBe(true);
  });

  it('should format syntax properly when post-hoc method is none or bonferroni', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-oneway-anova-bonf',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'one_way_anova',
      title: 'One-Way ANOVA — Bonferroni Post-Hoc',
      variables: ['income'],
      groupingVariables: ['education'],
      options: {
        dependentVariable: 'income',
        factorVariable: 'education',
        postHocMethod: 'bonferroni',
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.syntax).toContain('ONEWAY income BY education');
    expect(result.syntax).toContain('/POSTHOC = BONFERRONI');
  });
});
