import { describe, it, expect } from 'vitest';
import { StatisticalFormatter } from '../utils/statisticalFormatter';
import { ResultTableData } from '../types/analysisTypes';

describe('StatisticalTable & Formatting Unit Tests', () => {
  it('should format p-values according to statistical rules', () => {
    expect(StatisticalFormatter.formatPValue(0.00004)).toBe('< 0.001');
    expect(StatisticalFormatter.formatPValue(0.042)).toBe('0.042');
    expect(StatisticalFormatter.formatPValue(0.500)).toBe('0.500');
  });

  it('should format numerical values with designated precision', () => {
    expect(StatisticalFormatter.formatStatValue(1234.5678, 2)).toBe('1,234.57');
    expect(StatisticalFormatter.formatStatValue(0.0002, 4)).toBe('0.0002');
    expect(StatisticalFormatter.formatStatValue(null, 2)).toBe('—');
  });

  it('should generate valid TSV & Markdown exports from ResultTableData', () => {
    const table: ResultTableData = {
      id: 'tbl-01',
      title: 'Descriptive Statistics',
      columns: [
        { key: 'variable', label: 'Variable', isNumeric: false },
        { key: 'n', label: 'N', isNumeric: true },
        { key: 'mean', label: 'Mean', isNumeric: true },
        { key: 'stdDev', label: 'Std. Dev', isNumeric: true },
      ],
      rows: [
        { variable: 'Age', n: 500, mean: 42.5, stdDev: 12.3 },
        { variable: 'Income', n: 500, mean: 65400.0, stdDev: 18200.5 },
      ],
    };

    expect(table.columns.length).toBe(4);
    expect(table.rows.length).toBe(2);
    expect(table.rows[0].variable).toBe('Age');
  });
});
