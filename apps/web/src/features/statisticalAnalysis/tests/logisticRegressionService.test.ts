import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('Module 15 — Logistic Regression Family Unit Tests', () => {
  it('should execute Binary Logistic Regression procedure deterministically', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-logistic-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'logistic_regression',
      title: 'Binary Logistic Regression — Default Status Prediction',
      variables: ['default_status', 'income', 'age', 'spending_score', 'loyalty_score'],
      options: {
        logisticProcedure: 'binary',
        dependentVariable: 'default_status',
        predictorVariables: ['income', 'age', 'spending_score', 'loyalty_score'],
        classificationCutoff: 0.50,
        validation: 'cross_validation',
        includeOddsRatios: true,
        includeConfidenceIntervals: true,
        includeROC: true,
        includeCalibration: true,
        includeMarginalEffects: true,
        includeVIF: true,
        includeInfluence: true,
        savePredictions: true,
        saveProbabilities: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('logistic_regression');
    expect(result.syntax).toContain('LOGISTIC REGRESSION VARIABLES default_status');
    expect(result.syntax).toContain('/METHOD=ENTER income age spending_score loyalty_score');
    expect(result.syntax).toContain('/CLASSCUT(0.50)');

    expect(result.tables.length).toBeGreaterThanOrEqual(8);

    const summaryTbl = result.tables.find((t) => t.id === 'tbl-logit-summary');
    const encodingTbl = result.tables.find((t) => t.id === 'tbl-logit-encoding');
    const modelSummaryTbl = result.tables.find((t) => t.id === 'tbl-logit-model-summary');
    const omnibusTbl = result.tables.find((t) => t.id === 'tbl-logit-omnibus');
    const hosmerTbl = result.tables.find((t) => t.id === 'tbl-logit-hosmer');
    const coefTbl = result.tables.find((t) => t.id === 'tbl-logit-variables-in-equation');
    const classificationTbl = result.tables.find((t) => t.id === 'tbl-logit-classification');
    const rocCoordsTbl = result.tables.find((t) => t.id === 'tbl-logit-roc-coords');
    const ameTbl = result.tables.find((t) => t.id === 'tbl-logit-marginal-effects');

    expect(summaryTbl).toBeDefined();
    expect(encodingTbl).toBeDefined();
    expect(modelSummaryTbl).toBeDefined();
    expect(omnibusTbl).toBeDefined();
    expect(hosmerTbl).toBeDefined();
    expect(coefTbl).toBeDefined();
    expect(classificationTbl).toBeDefined();
    expect(rocCoordsTbl).toBeDefined();
    expect(ameTbl).toBeDefined();

    expect(summaryTbl?.rows.some((r) => r.status === 'Selected Cases Included in Analysis' && r.n === 1250)).toBe(true);
    expect(modelSummaryTbl?.rows.some((r) => r.step === 1 && r.nagelkerke === 0.452)).toBe(true);
    expect(omnibusTbl?.rows.some((r) => r.level === 'Step 1 (Overall Model)' && r.chiSquare === 341.8)).toBe(true);
    expect(coefTbl?.rows.some((r) => r.variable === 'age' && r.expB === 1.0427)).toBe(true);
    expect(classificationTbl?.rows.some((r) => r.observed === 'Overall Percentage' && r.pctCorrect === 89.52)).toBe(true);
  });
});
