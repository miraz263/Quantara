import { Variable, DataRow, CellValue, FilterCondition, SortCondition } from '../types/dataEditorTypes';
import { INITIAL_MOCK_VARIABLES, generateMockRows } from '../mocks/mockEditorData';

let variablesStore: Variable[] = [...INITIAL_MOCK_VARIABLES];
let rowsStore: DataRow[] = generateMockRows(500);

export class DataEditorService {
  static async getVariables(datasetId?: string): Promise<Variable[]> {
    await new Promise((res) => setTimeout(res, 20));
    return [...variablesStore].sort((a, b) => a.columnIndex - b.columnIndex);
  }

  static async getRows(
    datasetId?: string,
    offset: number = 0,
    limit: number = 100,
    filter?: FilterCondition,
    sort?: SortCondition
  ): Promise<{ rows: DataRow[]; totalCount: number }> {
    await new Promise((res) => setTimeout(res, 30));
    let result = [...rowsStore];

    // Apply Filter
    if (filter && filter.colId) {
      result = result.filter((row) => {
        const val = row[filter.colId];
        if (filter.operator === 'is_null') return val === null || val === undefined || val === '';
        if (filter.operator === 'is_not_null') return val !== null && val !== undefined && val !== '';
        
        if (val === null || val === undefined) return false;
        const strVal = String(val).toLowerCase();
        const targetVal = String(filter.value).toLowerCase();

        switch (filter.operator) {
          case 'equals':
            return strVal === targetVal;
          case 'not_equals':
            return strVal !== targetVal;
          case 'contains':
            return strVal.includes(targetVal);
          case 'greater_than':
            return Number(val) > Number(filter.value);
          case 'less_than':
            return Number(val) < Number(filter.value);
          default:
            return true;
        }
      });
    }

    // Apply Sort
    if (sort && sort.colId) {
      result.sort((a, b) => {
        const valA = a[sort.colId];
        const valB = b[sort.colId];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sort.direction === 'asc' ? valA - valB : valB - valA;
        }
        return sort.direction === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    const totalCount = result.length;
    const paginated = result.slice(offset, offset + limit);
    return { rows: paginated, totalCount };
  }

  static async updateCell(datasetId: string, rowId: string, colId: string, value: CellValue): Promise<DataRow> {
    await new Promise((res) => setTimeout(res, 20));
    const idx = rowsStore.findIndex((r) => r._rowId === rowId);
    if (idx === -1) throw new Error(`Row ${rowId} not found.`);

    const updatedRow = {
      ...rowsStore[idx],
      [colId]: value,
    };
    rowsStore[idx] = updatedRow;
    return { ...updatedRow };
  }

  static async insertRow(datasetId: string, position: number = 0): Promise<DataRow> {
    await new Promise((res) => setTimeout(res, 30));
    const newRowId = `row-${Date.now()}`;
    const newRowNumber = position + 1;

    const newRow: DataRow = {
      _rowId: newRowId,
      _rowNumber: newRowNumber,
    };

    // Initialize blank cell values for all variables
    variablesStore.forEach((v) => {
      newRow[v.name] = null;
    });

    rowsStore.splice(position, 0, newRow);

    // Re-index row numbers
    rowsStore.forEach((r, idx) => {
      r._rowNumber = idx + 1;
    });

    return { ...newRow };
  }

  static async deleteRows(datasetId: string, rowIds: string[]): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 30));
    rowsStore = rowsStore.filter((r) => !rowIds.includes(r._rowId));
    
    // Re-index row numbers
    rowsStore.forEach((r, idx) => {
      r._rowNumber = idx + 1;
    });

    return true;
  }

  static async addVariable(datasetId: string, variable: Partial<Variable>): Promise<Variable> {
    await new Promise((res) => setTimeout(res, 30));
    const maxIndex = variablesStore.reduce((max, v) => Math.max(max, v.columnIndex), 0);
    const varName = variable.name || `var_${variablesStore.length + 1}`;

    const newVar: Variable = {
      id: `var-${Date.now()}`,
      datasetId: datasetId || 'ds-001',
      name: varName,
      label: variable.label || `Label for ${varName}`,
      dataType: variable.dataType || 'string',
      measure: variable.measure || 'nominal',
      role: variable.role || 'input',
      alignment: variable.alignment || 'left',
      width: variable.width || 120,
      columnIndex: maxIndex + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    variablesStore.push(newVar);

    // Initialize column values in rows
    rowsStore.forEach((r) => {
      r[newVar.name] = null;
    });

    return { ...newVar };
  }

  static async updateVariable(datasetId: string, variableId: string, changes: Partial<Variable>): Promise<Variable> {
    await new Promise((res) => setTimeout(res, 30));
    const idx = variablesStore.findIndex((v) => v.id === variableId);
    if (idx === -1) throw new Error(`Variable ${variableId} not found.`);

    const oldName = variablesStore[idx].name;
    const newName = changes.name || oldName;

    // If variable name changed, update row keys
    if (changes.name && changes.name !== oldName) {
      // Validate unique name
      if (variablesStore.some((v) => v.id !== variableId && v.name === changes.name)) {
        throw new Error(`Variable name "${changes.name}" already exists.`);
      }

      rowsStore.forEach((r) => {
        r[newName] = r[oldName];
        delete r[oldName];
      });
    }

    const updated = {
      ...variablesStore[idx],
      ...changes,
      name: newName,
      updatedAt: new Date().toISOString(),
    };

    variablesStore[idx] = updated;
    return { ...updated };
  }

  static async deleteVariables(datasetId: string, variableIds: string[]): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 30));
    const varsToDelete = variablesStore.filter((v) => variableIds.includes(v.id));

    varsToDelete.forEach((v) => {
      rowsStore.forEach((r) => {
        delete r[v.name];
      });
    });

    variablesStore = variablesStore.filter((v) => !variableIds.includes(v.id));
    return true;
  }

  static async findAndReplace(
    datasetId: string,
    findVal: string,
    replaceVal: string,
    colId?: string
  ): Promise<number> {
    await new Promise((res) => setTimeout(res, 40));
    let affectedCount = 0;

    rowsStore.forEach((row) => {
      const keysToSearch = colId ? [colId] : variablesStore.map((v) => v.name);

      keysToSearch.forEach((key) => {
        const val = row[key];
        if (val !== null && val !== undefined && String(val) === findVal) {
          row[key] = replaceVal;
          affectedCount++;
        }
      });
    });

    return affectedCount;
  }

  static async save(datasetId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 100));
    return true;
  }
}
