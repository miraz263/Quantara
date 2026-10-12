export type MeasurementLevel = 'nominal' | 'ordinal' | 'scale';

export type DataType = 'integer' | 'float' | 'string' | 'boolean' | 'datetime';

export interface CategoryValue {
  value: string | number;
  label: string;
  count?: number;
}

export interface Variable {
  id: string;
  dataset_version_id: string;
  name: string;
  label?: string;
  description?: string;
  data_type: DataType;
  measurement_level: MeasurementLevel;
  categories?: CategoryValue[];
  value_labels?: Record<string, string>;
  missing_values?: (string | number)[];
  format?: string;
  column_index: number;
}

export interface Dataset {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  file_type: 'csv' | 'xlsx' | 'json' | 'parquet';
  storage_path: string;
  row_count: number;
  column_count: number;
  created_at: string;
  updated_at: string;
  current_version_id?: string;
}

export interface DatasetVersion {
  id: string;
  dataset_id: string;
  version_number: number;
  parquet_path: string;
  row_count: number;
  column_count: number;
  checksum: string;
  created_at: string;
}

export interface Project {
  id: string;
  organization_id?: string;
  owner_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

// Statistical Result Abstraction
export interface ResultTable {
  title: string;
  columns: string[];
  rows: (string | number | boolean | null)[][];
  footnotes?: string[];
}

export interface DiagnosticCheck {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  statistic_value?: number;
  p_value?: number;
  message: string;
}

export interface ResultChartData {
  type: 'histogram' | 'boxplot' | 'bar' | 'scatter' | 'line' | 'pie';
  title: string;
  data: Record<string, any>;
  options?: Record<string, any>;
}

export interface ExecutionMetadata {
  engine: string;
  engine_version: string;
  duration_ms: number;
  timestamp: string;
}

export interface QuantaraStatisticalResult {
  analysis_id: string;
  analysis_type: string;
  dataset_version_id: string;
  status: 'completed' | 'failed' | 'warning';
  parameters: Record<string, any>;
  summary?: string;
  tables: ResultTable[];
  statistics: Record<string, number | string | Record<string, any>>;
  diagnostics?: DiagnosticCheck[];
  charts?: ResultChartData[];
  warnings?: string[];
  interpretation?: string;
  execution_metadata: ExecutionMetadata;
  generated_code?: {
    python?: string;
    r?: string;
    syntax?: string;
  };
}

export interface Analysis {
  id: string;
  project_id: string;
  dataset_version_id: string;
  name: string;
  analysis_type: string;
  parameters: Record<string, any>;
  result_data: QuantaraStatisticalResult;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  execution_time_ms?: number;
  created_by?: string;
  created_at: string;
}

export interface ProfileColumn {
  name: string;
  data_type: DataType;
  measurement_level: MeasurementLevel;
  total_count: number;
  valid_count: number;
  missing_count: number;
  missing_percentage: number;
  distinct_count: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  std?: number;
  median?: number;
  quartile_25?: number;
  quartile_75?: number;
  iqr?: number;
  skewness?: number;
  kurtosis?: number;
  top_categories?: { value: string; count: number; percentage: number }[];
  outlier_count?: number;
}

export interface DataProfile {
  dataset_id: string;
  row_count: number;
  column_count: number;
  total_missing_cells: number;
  missing_cell_percentage: number;
  duplicate_rows: number;
  columns: ProfileColumn[];
}
