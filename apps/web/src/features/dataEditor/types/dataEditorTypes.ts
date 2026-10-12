export type DataType = 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'datetime';
export type MeasureLevel = 'nominal' | 'ordinal' | 'scale';
export type VariableRole = 'input' | 'target' | 'both' | 'none' | 'partition' | 'frequency' | 'weight' | 'id';
export type Alignment = 'left' | 'center' | 'right' | 'auto';

export interface Variable {
  id: string;
  datasetId: string;
  name: string;
  label?: string;
  dataType: DataType;
  measure: MeasureLevel;
  width?: number;
  decimals?: number;
  valueLabels?: Record<string, string>; // e.g. { "1": "Male", "2": "Female" }
  missingValues?: string[]; // e.g. ["99", "999", "N/A"]
  role: VariableRole;
  alignment?: Alignment;
  columnIndex: number;
  createdAt: string;
  updatedAt: string;
  isHidden?: boolean;
  isFrozen?: boolean;
  description?: string;
  format?: string;
}

export type CellValue = string | number | boolean | null | undefined;

export interface DataRow {
  _rowId: string;
  _rowNumber: number;
  [key: string]: CellValue;
}

export interface RangeSelection {
  startRow: number;
  endRow: number;
  startCol: string;
  endCol: string;
}

export interface CellSelectionInfo {
  rowIndex: number;
  colId: string;
  selectedCellCount: number;
  selectedRowIds: string[];
  selectedColIds: string[];
  rangeSelection?: RangeSelection;
}

export interface FilterCondition {
  colId: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'greater_than_or_equals'
    | 'less_than'
    | 'less_than_or_equals'
    | 'contains'
    | 'starts_with'
    | 'ends_with'
    | 'between'
    | 'is_null'
    | 'is_not_null';
  value: string | number;
  valueTo?: string | number;
}

export interface SortCondition {
  colId: string;
  direction: 'asc' | 'desc';
}

export interface EditorSaveStatus {
  state: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSavedAt?: string;
}

export interface ValueLabelItem {
  value: string;
  label: string;
}

export interface MissingValueConfig {
  type: 'none' | 'discrete' | 'range';
  discreteValues?: string[];
  rangeFrom?: number;
  rangeTo?: number;
}
