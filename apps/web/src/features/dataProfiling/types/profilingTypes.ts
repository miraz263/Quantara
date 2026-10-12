export interface DataQualityScore {
  overall: number;
  completeness: number;
  validity: number;
  uniqueness: number;
  consistency: number;
  issues: number;
  criticalIssues: number;
  warnings: number;
}

export interface QualityIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'good';
  variableName?: string;
  title: string;
  description: string;
  metric?: number;
  metricLabel?: string;
  recommendation?: string;
}

export interface VariableProfile {
  id: string;
  name: string;
  label?: string;
  dataType: 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'datetime';
  measure: 'nominal' | 'ordinal' | 'scale';
  totalCount: number;
  nonNullCount: number;
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  uniquePercentage: number;
  qualityStatus: 'good' | 'warning' | 'critical';
  
  // Numeric Stats
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  variance?: number;
  iqr?: number;
  q1?: number;
  q3?: number;
  skewness?: number;
  kurtosis?: number;
  outlierCount?: number;

  // Categorical Stats
  topCategories?: Array<{ category: string; count: number; percentage: number }>;

  // Flags
  isConstant?: boolean;
  isNearConstant?: boolean;
  isHighCardinality?: boolean;
  hasTypeAnomaly?: boolean;
  anomalyDescription?: string;
}

export interface MissingProfile {
  totalCells: number;
  missingCells: number;
  missingPercentage: number;
  completeRows: number;
  rowsWithMissing: number;
  variablesWithMissingCount: number;
  variableMissingList: Array<{
    variableName: string;
    missingCount: number;
    missingPercentage: number;
    completeCount: number;
    pattern: string;
    severity: 'good' | 'warning' | 'critical';
  }>;
  patterns: Array<{
    patternName: string;
    rowCount: number;
    percentage: number;
    variables: string[];
  }>;
}

export interface OutlierItem {
  id: string;
  variableName: string;
  rowNumber: number;
  rowId: string;
  value: number;
  expectedRange: string;
  method: 'IQR Rule' | 'Z-Score' | 'Modified Z-Score' | 'Percentile';
  severity: 'extreme' | 'moderate';
}

export interface OutlierProfile {
  totalOutliers: number;
  affectedVariablesCount: number;
  extremeCount: number;
  outlierList: OutlierItem[];
}

export interface DuplicateGroup {
  groupId: string;
  matchKey: string;
  rowCount: number;
  matchingRowNumbers: number[];
  matchingRowIds: string[];
  sampleValues: Record<string, any>;
}

export interface DuplicateProfile {
  duplicateRowsCount: number;
  duplicateGroupsCount: number;
  uniqueRowsCount: number;
  groups: DuplicateGroup[];
}

export interface ValidationRule {
  id: string;
  variableName: string;
  ruleType: 'between' | 'greater_than' | 'less_than' | 'not_null' | 'regex';
  min?: number;
  max?: number;
  value?: any;
  pattern?: string;
}

export interface ProfileSnapshot {
  id: string;
  datasetId: string;
  datasetVersion: number;
  createdAt: string;
  qualityScore: number;
  rowCount: number;
  columnCount: number;
  missingPercentage: number;
  duplicateCount: number;
  outlierCount: number;
  issueCount: number;
}

export interface DatasetProfile {
  datasetId: string;
  datasetName: string;
  datasetVersion: number;
  lastProfiledAt: string;
  status: 'analysis_ready' | 'needs_attention' | 'poor_quality' | 'profiling';
  rowCount: number;
  columnCount: number;
  
  qualityScore: DataQualityScore;
  
  numericVariablesCount: number;
  categoricalVariablesCount: number;
  dateVariablesCount: number;
  booleanVariablesCount: number;

  missingCellsCount: number;
  missingPercentage: number;
  duplicateRowsCount: number;
  outliersCount: number;
  constantVariablesCount: number;
  highCardinalityVariablesCount: number;

  issues: QualityIssue[];
}
