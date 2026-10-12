export class StatisticalFormatter {
  static formatStatValue(val: unknown, decimals: number = 2): string {
    if (val === null || val === undefined || val === '') return '—';
    if (typeof val === 'number') {
      if (isNaN(val)) return 'NaN';
      return val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return String(val);
  }

  static formatPercentage(val: number, decimals: number = 1): string {
    if (isNaN(val)) return '0.0%';
    return `${val.toFixed(decimals)}%`;
  }

  static formatPValue(pVal: number): string {
    if (pVal < 0.001) return '< 0.001';
    return pVal.toFixed(3);
  }
}
