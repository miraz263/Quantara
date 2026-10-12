import { Dataset, ColumnMetadataSummary, DatasetVersionInfo } from '../types/datasetTypes';

export const INITIAL_MOCK_DATASETS: Dataset[] = [
  {
    id: 'ds-patient-survey',
    projectId: 'healthcare-survey-2026',
    name: 'patient_survey.csv',
    description: 'Patient satisfaction survey, hospital outcome metrics, readmission risk indicators, and demographic profiles.',
    sourceFileName: 'patient_survey.csv',
    sourceType: 'csv',
    format: 'CSV Tabular Text',
    rowCount: 24582,
    columnCount: 47,
    sizeBytes: 19293798, // 18.4 MB
    status: 'ready',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdBy: 'Dr. Sarah Khan',
    version: 3,
    tags: ['healthcare', 'patient-survey', 'satisfaction'],
    isFavorite: true,
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: 'ds-customer-churn',
    projectId: 'customer-satisfaction-study',
    name: 'customer_satisfaction_study.csv',
    description: '12,450 observations of customer survey data containing annual household income, age, region, and satisfaction scores.',
    sourceFileName: 'customer_satisfaction_study.csv',
    sourceType: 'csv',
    format: 'CSV Tabular Text',
    rowCount: 12450,
    columnCount: 8,
    sizeBytes: 4520000, // 4.5 MB
    status: 'ready',
    createdAt: '2026-09-15T10:05:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdBy: 'Ahmed Rahman',
    version: 1,
    tags: ['market-research', 'customer-survey'],
    isFavorite: true,
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'ds-gdp-time-series',
    projectId: 'gdp-economic-growth',
    name: 'gdp_macro_series.parquet',
    description: 'Quarterly macroeconomic growth time series containing GDP, CPI inflation rates, interest rates, and trade balances from 1980 to 2026.',
    sourceFileName: 'gdp_macro_series.parquet',
    sourceType: 'parquet',
    format: 'Apache Parquet Columnar',
    rowCount: 420,
    columnCount: 18,
    sizeBytes: 1240000, // 1.2 MB
    status: 'ready',
    createdAt: '2026-07-10T14:30:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    createdBy: 'Tanvir Hasan',
    version: 2,
    tags: ['macroeconomics', 'time-series', 'gdp'],
    isFavorite: false,
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'ds-clinical-spss',
    projectId: 'healthcare-survey-2026',
    name: 'clinical_trial_outcomes.sav',
    description: 'SPSS dataset with embedded value labels and missing value definitions for Phase III oncology clinical trial.',
    sourceFileName: 'clinical_trial_outcomes.sav',
    sourceType: 'sav',
    format: 'IBM SPSS Statistics Data',
    rowCount: 3216,
    columnCount: 34,
    sizeBytes: 8520000, // 8.5 MB
    status: 'ready',
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    createdBy: 'Dr. Sarah Khan',
    version: 1,
    tags: ['spss', 'oncology', 'clinical-trial'],
    isFavorite: true
  },
  {
    id: 'ds-stata-panel',
    projectId: 'gdp-economic-growth',
    name: 'firm_panel_data.dta',
    description: 'Stata panel dataset tracking corporate capital investment across manufacturing firms.',
    sourceFileName: 'firm_panel_data.dta',
    sourceType: 'dta',
    format: 'Stata Dataset v17',
    rowCount: 18500,
    columnCount: 22,
    sizeBytes: 14500000, // 14.5 MB
    status: 'warning',
    createdAt: '2026-09-02T16:00:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    createdBy: 'Tanvir Hasan',
    version: 1,
    tags: ['stata', 'panel-data', 'corporate-finance']
  },
  {
    id: 'ds-sas-quality',
    projectId: 'quality-control-six-sigma',
    name: 'manufacturing_defects.sas7bdat',
    description: 'SAS binary dataset recording physical measurement tolerances and defect frequencies across assembly lines.',
    sourceFileName: 'manufacturing_defects.sas7bdat',
    sourceType: 'sas7bdat',
    format: 'SAS 7+ Binary Dataset',
    rowCount: 52000,
    columnCount: 14,
    sizeBytes: 38400000, // 38.4 MB
    status: 'ready',
    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-06-30T17:00:00Z',
    createdBy: 'Ahmed Rahman',
    version: 2,
    tags: ['sas', 'quality-control', 'six-sigma']
  }
];

export const MOCK_COLUMN_SUMMARIES: ColumnMetadataSummary[] = [
  {
    name: 'patient_id',
    dataType: 'string',
    measurementLevel: 'nominal',
    nonNullCount: 24582,
    missingCount: 0,
    missingPercentage: 0.0,
    uniqueCount: 24582,
    exampleValues: ['P000001', 'P000002', 'P000003', 'P000004']
  },
  {
    name: 'age',
    dataType: 'integer',
    measurementLevel: 'scale',
    nonNullCount: 24501,
    missingCount: 81,
    missingPercentage: 0.33,
    uniqueCount: 74,
    exampleValues: [42, 35, 51, 29]
  },
  {
    name: 'sex',
    dataType: 'string',
    measurementLevel: 'nominal',
    nonNullCount: 24582,
    missingCount: 0,
    missingPercentage: 0.0,
    uniqueCount: 2,
    exampleValues: ['Male', 'Female']
  },
  {
    name: 'annual_income',
    dataType: 'float',
    measurementLevel: 'scale',
    nonNullCount: 23940,
    missingCount: 642,
    missingPercentage: 2.61,
    uniqueCount: 11400,
    exampleValues: [42000.0, 58000.0, 39000.0, 72000.0]
  },
  {
    name: 'education_level',
    dataType: 'string',
    measurementLevel: 'ordinal',
    nonNullCount: 24450,
    missingCount: 132,
    missingPercentage: 0.54,
    uniqueCount: 4,
    exampleValues: ['High School', 'Bachelor', 'Master', 'PhD']
  },
  {
    name: 'satisfaction',
    dataType: 'integer',
    measurementLevel: 'scale',
    nonNullCount: 24530,
    missingCount: 52,
    missingPercentage: 0.21,
    uniqueCount: 10,
    exampleValues: [8, 9, 6, 10]
  }
];

export const MOCK_DATASET_VERSIONS: Record<string, DatasetVersionInfo[]> = {
  'ds-patient-survey': [
    { versionNumber: 3, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), createdBy: 'Dr. Sarah Khan', rowCount: 24582, columnCount: 47, changes: ['Removed 3 obsolete temporary variables', 'Imputed missing zip codes'] },
    { versionNumber: 2, createdAt: '2026-10-05T14:20:00Z', createdBy: 'Dr. Sarah Khan', rowCount: 24582, columnCount: 50, changes: ['Cleaned extreme outlier values in annual income', 'Added satisfaction_score_norm'] },
    { versionNumber: 1, createdAt: '2026-10-01T10:00:00Z', createdBy: 'Dr. Sarah Khan', rowCount: 24600, columnCount: 50, changes: ['Initial dataset ingestion from survey CSV'] }
  ]
};
