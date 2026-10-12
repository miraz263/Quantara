import { describe, it, expect } from 'vitest';
import { ProfilingService } from '../services/profilingService';

describe('ProfilingService Unit Tests', () => {
  it('should fetch dataset profile summary', async () => {
    const profile = await ProfilingService.getProfile('ds-001');
    expect(profile.datasetName).toBeDefined();
    expect(profile.rowCount).toBe(24582);
    expect(profile.columnCount).toBe(47);
    expect(profile.qualityScore.overall).toBe(92);
    expect(profile.issues.length).toBeGreaterThan(0);
  });

  it('should fetch variable profiles', async () => {
    const vars = await ProfilingService.getVariableProfiles('ds-001');
    expect(vars.length).toBeGreaterThan(0);
    expect(vars.some((v) => v.name === 'income')).toBe(true);
  });

  it('should fetch individual variable profile detail', async () => {
    const incomeVar = await ProfilingService.getVariableProfile('ds-001', 'income');
    expect(incomeVar).not.toBeNull();
    expect(incomeVar?.name).toBe('income');
    expect(incomeVar?.mean).toBe(68500.4);
    expect(incomeVar?.outlierCount).toBe(218);
  });

  it('should fetch missingness profile metrics and patterns', async () => {
    const missing = await ProfilingService.getMissingProfile('ds-001');
    expect(missing.missingPercentage).toBe(3.8);
    expect(missing.variableMissingList.length).toBeGreaterThan(0);
    expect(missing.patterns.length).toBeGreaterThan(0);
  });

  it('should fetch outlier profile items', async () => {
    const outliers = await ProfilingService.getOutlierProfile('ds-001');
    expect(outliers.totalOutliers).toBe(318);
    expect(outliers.outlierList.length).toBeGreaterThan(0);
  });

  it('should fetch duplicate profile groups', async () => {
    const duplicates = await ProfilingService.getDuplicateProfile('ds-001');
    expect(duplicates.duplicateRowsCount).toBe(124);
    expect(duplicates.groups.length).toBeGreaterThan(0);
  });

  it('should refresh profile snapshot', async () => {
    const snap = await ProfilingService.refreshProfile('ds-001');
    expect(snap.id).toBeDefined();
    expect(snap.qualityScore).toBe(92);
    expect(snap.createdAt).toBeDefined();
  });
});
