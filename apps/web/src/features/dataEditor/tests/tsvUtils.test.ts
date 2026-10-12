import { describe, it, expect } from 'vitest';
import { TSVUtils } from '../utils/tsvUtils';

describe('TSVUtils Unit Tests', () => {
  it('should parse tab-separated string into matrix', () => {
    const rawTSV = "Age\tIncome\tSatisfaction\n25\t50000\t4.5\n30\t65000\t4.8";
    const parsed = TSVUtils.parseTSV(rawTSV, true);

    expect(parsed.headers).toEqual(['Age', 'Income', 'Satisfaction']);
    expect(parsed.rowCount).toBe(2);
    expect(parsed.colCount).toBe(3);
    expect(parsed.rows[0]).toEqual(['25', '50000', '4.5']);
  });

  it('should auto-generate column headers when hasHeader is false', () => {
    const rawTSV = "25\t50000\n30\t65000";
    const parsed = TSVUtils.parseTSV(rawTSV, false);

    expect(parsed.headers).toEqual(['Col_1', 'Col_2']);
    expect(parsed.rowCount).toBe(2);
    expect(parsed.rows[1]).toEqual(['30', '65000']);
  });

  it('should format rows to TSV string', () => {
    const headers = ['id', 'name', 'score'];
    const rows = [
      { id: 1, name: 'Alice', score: 95.5 },
      { id: 2, name: 'Bob', score: 88.0 },
    ];

    const tsv = TSVUtils.formatTSV(headers, rows);
    expect(tsv).toBe("id\tname\tscore\n1\tAlice\t95.5\n2\tBob\t88");
  });

  it('should handle empty TSV input gracefully', () => {
    const parsed = TSVUtils.parseTSV('', true);
    expect(parsed.rowCount).toBe(0);
    expect(parsed.headers).toEqual([]);
  });
});
