export type MeasurementLevel = 'nominal' | 'ordinal' | 'scale';

export type DataType = 'integer' | 'float' | 'string' | 'boolean' | 'datetime';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'owner' | 'admin' | 'statistician' | 'researcher' | 'analyst' | 'reviewer' | 'viewer';
  avatar_url?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  organization_id?: string;
  owner_id?: string;
  name: string;
  description?: string;
  dataset_count: number;
  analysis_count: number;
  status: 'active' | 'archived' | 'completed';
  collaborator_count: number;
  updated_at: string;
  created_at: string;
}

export interface Variable {
  id: string;
  dataset_version_id: string;
  name: string;
  label?: string;
  description?: string;
  data_type: DataType;
  measurement_level: MeasurementLevel;
  categories?: { value: string | number; label: string; count?: number }[];
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
  type: 'histogram' | 'boxplot' | 'bar' | 'scatter' | 'line' | 'pie' | 'heatmap';
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
  statistics: Record<string, any>;
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

export interface DataQualityReport {
  overall_score: number; // e.g. 92
  completeness: number; // e.g. 94
  validity: number;     // e.g. 91
  consistency: number;  // e.g. 89
  duplicates: number;   // e.g. 98
  outliers: number;     // e.g. 86
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  reasoning_summary?: string[];
  verified_result?: QuantaraStatisticalResult;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'table' | 'chart' | 'result';
  data?: any;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  name: string;
  category: 'dataset' | 'report' | 'chart' | 'notebook' | 'code' | 'other';
  size_bytes: number;
  modified_at: string;
  owner_name: string;
}

export interface TeamMember {
  id: string;
  user: User;
  role: 'owner' | 'admin' | 'statistician' | 'researcher' | 'analyst' | 'reviewer' | 'viewer';
  joined_at: string;
}
