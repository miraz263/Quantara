import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('Module 14 — Discriminant Analysis Unit Tests', () => {
  it('should execute Linear Discriminant Analysis (LDA) procedure deterministically', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-discriminant-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'discriminant',
      title: 'Discriminant Analysis (LDA) — Target Segment Prediction',
      variables: ['income', 'age', 'spending_score', 'loyalty_score'],
      groupingVariables: ['target_segment'],
      options: {
        groupingVariable: 'target_segment',
        predictors: ['income', 'age', 'spending_score', 'loyalty_score'],
        priorMethod: 'equal',
        validation: 'leave_one_out',
        boxMTest: true,
        unstandardizedCoefficients: true,
        standardizedCoefficients: true,
        structureMatrix: true,
        groupCentroids: true,
        fisherClassificationFunctions: true,
        casewisePosteriorProbabilities: true,
        savePredictedGroup: true,
        savePosteriorProbabilities: true,
        saveDiscriminantScores: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('discriminant');
    expect(result.syntax).toContain('DISCRIMINANT');
    expect(result.syntax).toContain('/GROUPS=target_segment(1 3)');
    expect(result.syntax).toContain('/VARIABLES=income age spending_score loyalty_score');
    expect(result.syntax).toContain('/PRIORS=EQUAL');
    expect(result.syntax).toContain('/CLASSIFY=CROSSVALID');

    expect(result.tables.length).toBeGreaterThanOrEqual(10);

    const summaryTbl = result.tables.find((t) => t.id === 'tbl-discrim-summary');
    const groupStatsTbl = result.tables.find((t) => t.id === 'tbl-discrim-group-stats');
    const equalityTestsTbl = result.tables.find((t) => t.id === 'tbl-discrim-equality-tests');
    const boxMTbl = result.tables.find((t) => t.id === 'tbl-discrim-box-m');
    const eigenvaluesTbl = result.tables.find((t) => t.id === 'tbl-discrim-eigenvalues');
    const wilksLambdaTbl = result.tables.find((t) => t.id === 'tbl-discrim-wilks-lambda');
    const stdCoeffTbl = result.tables.find((t) => t.id === 'tbl-discrim-std-coeff');
    const structureMatrixTbl = result.tables.find((t) => t.id === 'tbl-discrim-structure-matrix');
    const unstdCoeffTbl = result.tables.find((t) => t.id === 'tbl-discrim-unstd-coeff');
    const centroidsTbl = result.tables.find((t) => t.id === 'tbl-discrim-centroids');
    const fisherTbl = result.tables.find((t) => t.id === 'tbl-discrim-fisher-funcs');
    const classificationTbl = result.tables.find((t) => t.id === 'tbl-discrim-classification');

    expect(summaryTbl).toBeDefined();
    expect(groupStatsTbl).toBeDefined();
    expect(equalityTestsTbl).toBeDefined();
    expect(boxMTbl).toBeDefined();
    expect(eigenvaluesTbl).toBeDefined();
    expect(wilksLambdaTbl).toBeDefined();
    expect(stdCoeffTbl).toBeDefined();
    expect(structureMatrixTbl).toBeDefined();
    expect(unstdCoeffTbl).toBeDefined();
    expect(centroidsTbl).toBeDefined();
    expect(fisherTbl).toBeDefined();
    expect(classificationTbl).toBeDefined();

    expect(summaryTbl?.rows.some((r) => r.status === 'Valid Cases Included in Analysis' && r.n === 1250)).toBe(true);
    expect(eigenvaluesTbl?.rows.some((r) => r.function === 'Function 1' && r.eigenvalue === 1.428)).toBe(true);
    expect(wilksLambdaTbl?.rows.some((r) => r.testFunc === '1 through 2' && r.wilksLambda === 0.327)).toBe(true);
    expect(boxMTbl?.rows.some((r) => r.statistic === "Box's M" && r.value === 18.45)).toBe(true);
    expect(classificationTbl?.footnotes?.some((f) => f.includes('87.4%'))).toBe(true);
  });
});
