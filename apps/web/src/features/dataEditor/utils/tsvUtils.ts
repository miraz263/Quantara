export interface TSVParseResult {
  headers: string[];
  rows: string[][];
  rowCount: number;
  colCount: number;
}

export class TSVUtils {
  /**
   * Parses a Tab-Separated Values (TSV) string into headers and data matrix
   */
  static parseTSV(tsvText: string, hasHeader: boolean = false): TSVParseResult {
    if (!tsvText || !tsvText.trim()) {
      return { headers: [], rows: [], rowCount: 0, colCount: 0 };
    }

    const lines = tsvText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .filter((line) => line.length > 0);

    const matrix = lines.map((line) => line.split('\t'));
    const colCount = Math.max(...matrix.map((r) => r.length), 0);

    if (hasHeader && matrix.length > 0) {
      const headers = matrix[0];
      const rows = matrix.slice(1);
      return {
        headers,
        rows,
        rowCount: rows.length,
        colCount,
      };
    }

    const generatedHeaders = Array.from({ length: colCount }, (_, i) => `Col_${i + 1}`);
    return {
      headers: generatedHeaders,
      rows: matrix,
      rowCount: matrix.length,
      colCount,
    };
  }

  /**
   * Formats headers and data rows into a TSV string
   */
  static formatTSV(headers: string[], rows: Record<string, any>[]): string {
    const headerLine = headers.join('\t');
    const dataLines = rows.map((row) =>
      headers.map((h) => (row[h] !== undefined && row[h] !== null ? String(row[h]) : '')).join('\t')
    );
    return [headerLine, ...dataLines].join('\n');
  }

  /**
   * Formats a 2D matrix into a TSV string
   */
  static formatMatrixToTSV(matrix: (string | number | boolean | null | undefined)[][]): string {
    return matrix
      .map((row) => row.map((cell) => (cell !== undefined && cell !== null ? String(cell) : '')).join('\t'))
      .join('\n');
  }
}
