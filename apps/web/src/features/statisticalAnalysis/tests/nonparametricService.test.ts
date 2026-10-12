import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('Module 10 — Nonparametric Statistics Family Unit Tests', () => {
  it('should execute Mann–Whitney U Test procedure deterministically', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-mw-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'mann_whitney',
      title: 'Mann–Whitney U Test — income by sex (Male vs Female)',
      variables: ['income'],
      groupingVariables: ['sex'],
      options: {
        nonparametricType: 'mann_whitney',
        groupingVariable: 'sex',
        group1: 'Male',
        group2: 'Female',
        pValueMethod: 'asymptotic',
        continuityCorrection: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('mann_whitney');
    expect(result.syntax).toContain('NPAR TESTS');
    expect(result.syntax).toContain('/MANN-WHITNEY = income BY sex');
    expect(result.tables.length).toBeGreaterThanOrEqual(3);

    const ranksTbl = result.tables.find((t) => t.id === 'tbl-mw-group-ranks');
    const testTbl = result.tables.find((t) => t.id === 'tbl-mw-test-stats');
    const effectTbl = result.tables.find((t) => t.id === 'tbl-mw-effect-size');

    expect(ranksTbl).toBeDefined();
    expect(testTbl).toBeDefined();
    expect(effectTbl).toBeDefined();

    expect(testTbl?.rows.some((r) => r.value === 63098510.0)).toBe(true); // Mann-Whitney U
    expect(testTbl?.rows.some((r) => r.value === -12.48)).toBe(true); // Z statistic
    expect(effectTbl?.rows.some((r) => String(r.metric).includes('Rank-Biserial Correlation'))).toBe(true);
  });

  it('should execute Wilcoxon Signed-Rank Test procedure with ties and effect size', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-wilcoxon-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'wilcoxon_signed_rank',
      title: 'Wilcoxon Signed-Rank Test — before_score vs after_score',
      variables: ['before_score', 'after_score'],
      options: {
        nonparametricType: 'wilcoxon_signed_rank',
        pairedVariables: [{ variable1: 'before_score', variable2: 'after_score' }],
        zeroDifferenceHandling: 'pratt',
        pValueMethod: 'asymptotic',
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('wilcoxon_signed_rank');
    expect(result.syntax).toContain('NPAR TESTS');
    expect(result.syntax).toContain('/WILCOXON = before_score WITH after_score (PAIRED)');
    expect(result.tables.length).toBeGreaterThanOrEqual(3);

    const ranksTbl = result.tables.find((t) => t.id === 'tbl-wilcoxon-ranks');
    const testTbl = result.tables.find((t) => t.id === 'tbl-wilcoxon-test-stats');
    const effectTbl = result.tables.find((t) => t.id === 'tbl-wilcoxon-effect-size');

    expect(ranksTbl).toBeDefined();
    expect(testTbl).toBeDefined();
    expect(effectTbl).toBeDefined();

    expect(ranksTbl?.rows.some((r) => String(r.category).includes('Negative Ranks'))).toBe(true);
    expect(ranksTbl?.rows.some((r) => String(r.category).includes('Positive Ranks'))).toBe(true);
    expect(testTbl?.rows.some((r) => r.value === -24.82)).toBe(true); // Z statistic
    expect(effectTbl?.rows.some((r) => String(r.metric).includes('Matched Pairs r'))).toBe(true);
  });

  it('should execute Kruskal–Wallis H Test procedure with Dunn post-hoc Holm adjustment', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-kw-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'kruskal_wallis',
      title: 'Kruskal–Wallis H Test — income by education level',
      variables: ['income'],
      groupingVariables: ['education'],
      options: {
        nonparametricType: 'kruskal_wallis',
        groupingVariable: 'education',
        dunnPostHoc: true,
        postHocAdjustment: 'holm',
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('kruskal_wallis');
    expect(result.syntax).toContain('NPAR TESTS');
    expect(result.syntax).toContain('/K-W = income BY education(1 5)');
    expect(result.syntax).toContain('/POSTHOC = DUNN HOLM');
    expect(result.tables.length).toBeGreaterThanOrEqual(4);

    const ranksTbl = result.tables.find((t) => t.id === 'tbl-kw-group-ranks');
    const testTbl = result.tables.find((t) => t.id === 'tbl-kw-test-stats');
    const effectTbl = result.tables.find((t) => t.id === 'tbl-kw-effect-size');
    const postHocTbl = result.tables.find((t) => t.id === 'tbl-dunn-posthoc');

    expect(ranksTbl).toBeDefined();
    expect(testTbl).toBeDefined();
    expect(effectTbl).toBeDefined();
    expect(postHocTbl).toBeDefined();

    expect(testTbl?.rows.some((r) => r.value === 4812.42)).toBe(true); // Kruskal-Wallis H
    expect(effectTbl?.rows.some((r) => String(r.metric).includes('Epsilon Squared'))).toBe(true);
    expect(postHocTbl?.rows.length).toBeGreaterThan(0);
  });

  it('should execute Friedman Test procedure with Kendall W and pairwise Wilcoxon post-hoc', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-friedman-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'friedman',
      title: 'Friedman Test — score_t1, score_t2, score_t3',
      variables: ['score_t1', 'score_t2', 'score_t3'],
      options: {
        nonparametricType: 'friedman',
        kendallsW: true,
        pairwiseWilcoxon: true,
        postHocAdjustment: 'holm',
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('friedman');
    expect(result.syntax).toContain('NPAR TESTS');
    expect(result.syntax).toContain('/FRIEDMAN = score_t1 score_t2 score_t3');
    expect(result.syntax).toContain('/POSTHOC = WILCOXON HOLM');
    expect(result.tables.length).toBeGreaterThanOrEqual(4);

    const ranksTbl = result.tables.find((t) => t.id === 'tbl-friedman-ranks');
    const testTbl = result.tables.find((t) => t.id === 'tbl-friedman-test-stats');
    const effectTbl = result.tables.find((t) => t.id === 'tbl-friedman-effect-size');
    const postHocTbl = result.tables.find((t) => t.id === 'tbl-friedman-posthoc');

    expect(ranksTbl).toBeDefined();
    expect(testTbl).toBeDefined();
    expect(effectTbl).toBeDefined();
    expect(postHocTbl).toBeDefined();

    expect(testTbl?.rows.some((r) => r.value === 612.48)).toBe(true); // Friedman Chi-Square
    expect(effectTbl?.rows.some((r) => String(r.metric).includes("Kendall's W"))).toBe(true);
    expect(postHocTbl?.rows.length).toBeGreaterThan(0);
  });
});
