export type DatasetSourceType =
  | 'csv'
  | 'xlsx'
  | 'xls'
  | 'json'
  | 'parquet'
  | 'sav'
  | 'dta'
  | 'sas7bdat'
  | 'database'
  | 'api';

export type DatasetStatus =
  | 'uploading'
  | 'processing'
  | 'ready'
  | 'warning'
  | 'error'
  | 'archived';

export interface Dataset {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  sourceFileName?: string;
  sourceType: DatasetSourceType;
  format?: string;
  rowCount: number;
  columnCount: number;
  sizeBytes?: number;
  status: DatasetStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  version: number;
  tags: string[];
  isFavorite?: boolean;
  lastOpenedAt?: string;
}

export interface DatasetVersionInfo {
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  rowCount: number;
  columnCount: number;
  changes: string[];
}

export interface ColumnMetadataSummary {
  name: string;
  dataType: string;
  measurementLevel: 'nominal' | 'ordinal' | 'scale';
  nonNullCount: number;
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  exampleValues: (string | number)[];
}

export interface DatasetFilters {
  searchQuery: string;
  status?: DatasetStatus | 'all';
  sourceType?: DatasetSourceType | 'all';
  sizeCategory?: 'all' | 'small' | 'medium' | 'large';
  favoritesOnly?: boolean;
  owner?: string | 'all';
}

export type DatasetSortOption =
  | 'recently_updated'
  | 'recently_created'
  | 'recently_opened'
  | 'name_asc'
  | 'name_desc'
  | 'most_rows'
  | 'most_columns'
  | 'file_size'
  | 'version';

export interface ImportDatasetPayload {
  fileName: string;
  sourceType: DatasetSourceType;
  sizeBytes: number;
  description?: string;
  tags: string[];
  importMode: 'new' | 'replace' | 'new_version';
  config: {
    delimiter?: string;
    encoding?: string;
    headerRow?: number;
    sheetName?: string;
    valueLabels?: boolean;
    missingValueStrategy?: string;
  };
}

export interface UpdateDatasetPayload {
  name?: string;
  description?: string;
  tags?: string[];
  isFavorite?: boolean;
  status?: DatasetStatus;
}
