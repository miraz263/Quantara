import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('Module 09 — Regression Analysis Family Unit Tests', () => {
  it('should execute Multiple Linear Regression procedure deterministically with Model Summary, ANOVA, Coefficients, VIF, and Influence stats', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-regression-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'linear_regression',
      title: 'Multiple Linear Regression — income on age, experience, education',
      variables: ['income', 'age', 'experience', 'education'],
      options: {
        dependentVariable: 'income',
        predictors: ['age', 'experience', 'education'],
        includeIntercept: true,
        confidenceInterval: 95,
        collinearityDiagnostics: true,
        residualDiagnostics: true,
        influenceDiagnostics: true,
        showPlots: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('linear_regression');
    expect(result.syntax).toContain('REGRESSION');
    expect(result.syntax).toContain('/DEPENDENT income');
    expect(result.syntax).toContain('/METHOD=ENTER age experience education');
    expect(result.syntax).toContain('/STATISTICS COEFF OUTS R ANOVA COLLIN TOL DIAG');

    // Check tables presence
    expect(result.tables.length).toBeGreaterThanOrEqual(6);

    const summaryTbl = result.tables.find((t) => t.id === 'tbl-regression-summary');
    const anovaTbl = result.tables.find((t) => t.id === 'tbl-regression-anova');
    const coeffTbl = result.tables.find((t) => t.id === 'tbl-regression-coefficients');
    const collinTbl = result.tables.find((t) => t.id === 'tbl-regression-collinearity');
    const residStatsTbl = result.tables.find((t) => t.id === 'tbl-regression-residuals-stats');
    const inflTbl = result.tables.find((t) => t.id === 'tbl-regression-influence');

    expect(summaryTbl).toBeDefined();
    expect(anovaTbl).toBeDefined();
    expect(coeffTbl).toBeDefined();
    expect(collinTbl).toBeDefined();
    expect(residStatsTbl).toBeDefined();
    expect(inflTbl).toBeDefined();

    // Model Summary verification (R, R^2, Adjusted R^2, SE, N)
    expect(summaryTbl?.rows.some((r) => r.r === 0.790 && r.rSquared === 0.624 && r.adjustedRSquared === 0.619 && r.n === 23770)).toBe(true);

    // ANOVA Table verification (F = 13124.5, df1 = 3, df2 = 23766, p < .001)
    expect(anovaTbl?.rows.some((r) => r.source === 'Regression' && r.f === 13124.5 && r.df === 3)).toBe(true);

    // Coefficients Table verification (Intercept B = 12410.50, Age B = 420.80, Experience B = 1370.40, Education B = 2140.00)
    expect(coeffTbl?.rows.some((r) => String(r.parameter).includes('Constant') && r.b === 12410.50)).toBe(true);
    expect(coeffTbl?.rows.some((r) => String(r.parameter).includes('Age') && r.b === 420.80 && r.beta === 0.215)).toBe(true);
    expect(coeffTbl?.rows.some((r) => String(r.parameter).includes('Experience') && r.b === 1370.40 && r.beta === 0.342)).toBe(true);
    expect(coeffTbl?.rows.some((r) => String(r.parameter).includes('Education') && r.b === 2140.00 && r.beta === 0.284)).toBe(true);

    // Collinearity VIF verification
    expect(collinTbl?.rows.some((r) => r.variable === 'Age' && r.tolerance === 0.824 && r.vif === 1.214)).toBe(true);
    expect(collinTbl?.rows.some((r) => r.variable === 'Experience' && r.tolerance === 0.542 && r.vif === 1.845)).toBe(true);

    // Influence / Outliers verification
    expect(inflTbl?.rows.some((r) => r.caseId === 'Case #102' && r.stdResidual === 3.44 && r.cooksD === 0.0042)).toBe(true);
  });

  it('should format syntax properly when includeIntercept is false (/NOORIGIN)', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-regression-noorigin',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'linear_regression',
      title: 'Linear Regression without Intercept',
      variables: ['income', 'age'],
      options: {
        dependentVariable: 'income',
        predictors: ['age'],
        includeIntercept: false,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.syntax).toContain('REGRESSION');
    expect(result.syntax).toContain('/DEPENDENT income');
    expect(result.syntax).toContain('/METHOD=ENTER age');
    expect(result.syntax).toContain('/NOORIGIN');
  });
});
