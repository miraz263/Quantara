import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('Module 11 — Factor Analysis & Dimension Reduction Unit Tests', () => {
  it('should execute Principal Component Analysis (PCA) procedure deterministically', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-pca-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'pca',
      title: 'Principal Component Analysis — 18 Items',
      variables: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18'],
      options: {
        extractionMethod: 'pca',
        standardizeVariables: true,
        retentionMethod: 'eigenvalue_gt_1',
        rotationMethod: 'varimax',
        kmoDiagnostic: true,
        bartlettDiagnostic: true,
        factorScoresEnabled: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('pca');
    expect(result.syntax).toContain('FACTOR');
    expect(result.syntax).toContain('/EXTRACTION PC');
    expect(result.syntax).toContain('/ROTATION VARIMAX');
    expect(result.tables.length).toBeGreaterThanOrEqual(4);

    const kmoTbl = result.tables.find((t) => t.id === 'tbl-pca-kmo-bartlett');
    const commTbl = result.tables.find((t) => t.id === 'tbl-pca-communalities');
    const varTbl = result.tables.find((t) => t.id === 'tbl-pca-variance-explained');
    const matrixTbl = result.tables.find((t) => t.id === 'tbl-pca-component-matrix');
    const scoresTbl = result.tables.find((t) => t.id === 'tbl-pca-factor-scores');

    expect(kmoTbl).toBeDefined();
    expect(commTbl).toBeDefined();
    expect(varTbl).toBeDefined();
    expect(matrixTbl).toBeDefined();
    expect(scoresTbl).toBeDefined();

    expect(kmoTbl?.rows.some((r) => r.value === 0.84)).toBe(true); // KMO
    expect(kmoTbl?.rows.some((r) => r.value === 1842.6)).toBe(true); // Bartlett Chi-Square
    expect(varTbl?.rows.some((r) => r.initEigen === 6.824)).toBe(true); // First eigenvalue
    expect(matrixTbl?.rows.some((r) => r.pc1 === 0.812)).toBe(true); // Component loading
  });

  it('should execute Exploratory Factor Analysis (EFA / PAF / Oblimin) with Oblique Factor Correlations', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-efa-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'efa',
      title: 'Exploratory Factor Analysis — 18 Items',
      variables: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18'],
      options: {
        extractionMethod: 'principal_axis',
        retentionMethod: 'fixed',
        numberOfFactors: 3,
        rotationMethod: 'oblimin',
        kmoDiagnostic: true,
        bartlettDiagnostic: true,
        factorScoresEnabled: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('efa');
    expect(result.syntax).toContain('FACTOR');
    expect(result.syntax).toContain('/EXTRACTION PAF');
    expect(result.syntax).toContain('/ROTATION OBLIMIN');
    expect(result.tables.length).toBeGreaterThanOrEqual(5);

    const commTbl = result.tables.find((t) => t.id === 'tbl-efa-communalities');
    const varTbl = result.tables.find((t) => t.id === 'tbl-efa-variance-explained');
    const patternTbl = result.tables.find((t) => t.id === 'tbl-efa-pattern-matrix');
    const structTbl = result.tables.find((t) => t.id === 'tbl-efa-structure-matrix');
    const factorCorrTbl = result.tables.find((t) => t.id === 'tbl-efa-factor-correlations');

    expect(commTbl).toBeDefined();
    expect(varTbl).toBeDefined();
    expect(patternTbl).toBeDefined();
    expect(structTbl).toBeDefined();
    expect(factorCorrTbl).toBeDefined();

    expect(patternTbl?.rows.some((r) => r.f1 === 0.785)).toBe(true); // Pattern loading
    expect(factorCorrTbl?.rows.some((r) => r.f2 === 0.42)).toBe(true); // Oblique factor correlation
  });
});
