import { Variable, DataRow } from '../types/dataEditorTypes';

export const INITIAL_MOCK_VARIABLES: Variable[] = [
  {
    id: 'var-1',
    datasetId: 'ds-001',
    name: 'patient_id',
    label: 'Patient Identifier Code',
    dataType: 'string',
    measure: 'nominal',
    role: 'id',
    alignment: 'left',
    width: 120,
    columnIndex: 0,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
    isFrozen: true
  },
  {
    id: 'var-2',
    datasetId: 'ds-001',
    name: 'age',
    label: 'Patient Age in Years',
    dataType: 'integer',
    measure: 'scale',
    role: 'input',
    alignment: 'right',
    width: 90,
    decimals: 0,
    columnIndex: 1,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-3',
    datasetId: 'ds-001',
    name: 'sex',
    label: 'Biological Sex at Birth',
    dataType: 'integer',
    measure: 'nominal',
    role: 'input',
    alignment: 'center',
    width: 110,
    valueLabels: { '1': 'Male', '2': 'Female', '3': 'Non-binary' },
    columnIndex: 2,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-4',
    datasetId: 'ds-001',
    name: 'education',
    label: 'Highest Completed Education Level',
    dataType: 'integer',
    measure: 'ordinal',
    role: 'input',
    alignment: 'left',
    width: 140,
    valueLabels: { '1': 'Primary', '2': 'Secondary', '3': 'Higher Sec', '4': 'Graduate', '5': 'Postgraduate' },
    missingValues: ['99', '999'],
    columnIndex: 3,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-5',
    datasetId: 'ds-001',
    name: 'marital_status',
    label: 'Marital Status',
    dataType: 'string',
    measure: 'nominal',
    role: 'input',
    alignment: 'left',
    width: 130,
    valueLabels: { 'Single': 'Single', 'Married': 'Married', 'Divorced': 'Divorced', 'Widowed': 'Widowed' },
    columnIndex: 4,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-6',
    datasetId: 'ds-001',
    name: 'income',
    label: 'Annual Household Income (USD)',
    dataType: 'float',
    measure: 'scale',
    role: 'input',
    alignment: 'right',
    width: 130,
    decimals: 2,
    columnIndex: 5,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-7',
    datasetId: 'ds-001',
    name: 'employment',
    label: 'Current Employment Status',
    dataType: 'string',
    measure: 'nominal',
    role: 'input',
    alignment: 'left',
    width: 140,
    columnIndex: 6,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-8',
    datasetId: 'ds-001',
    name: 'region',
    label: 'Geographic Region Code',
    dataType: 'string',
    measure: 'nominal',
    role: 'partition',
    alignment: 'center',
    width: 110,
    columnIndex: 7,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-9',
    datasetId: 'ds-001',
    name: 'satisfaction',
    label: 'Overall Healthcare Satisfaction Rating',
    dataType: 'integer',
    measure: 'ordinal',
    role: 'target',
    alignment: 'center',
    width: 120,
    valueLabels: { '1': 'Very Dissatisfied', '2': 'Dissatisfied', '3': 'Neutral', '4': 'Satisfied', '5': 'Very Satisfied' },
    columnIndex: 8,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-10',
    datasetId: 'ds-001',
    name: 'service_quality',
    label: 'Service Quality Score (1-10)',
    dataType: 'float',
    measure: 'scale',
    role: 'input',
    alignment: 'right',
    width: 120,
    decimals: 1,
    columnIndex: 9,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-11',
    datasetId: 'ds-001',
    name: 'waiting_time',
    label: 'Clinic Waiting Time (minutes)',
    dataType: 'float',
    measure: 'scale',
    role: 'input',
    alignment: 'right',
    width: 120,
    decimals: 1,
    columnIndex: 10,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-12',
    datasetId: 'ds-001',
    name: 'treatment_type',
    label: 'Primary Treatment Protocol Assigned',
    dataType: 'string',
    measure: 'nominal',
    role: 'input',
    alignment: 'left',
    width: 150,
    columnIndex: 11,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-13',
    datasetId: 'ds-001',
    name: 'treatment_success',
    label: 'Treatment Outcome Successful',
    dataType: 'boolean',
    measure: 'nominal',
    role: 'target',
    alignment: 'center',
    width: 130,
    columnIndex: 12,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-14',
    datasetId: 'ds-001',
    name: 'visit_date',
    label: 'Date of Initial Intake Consultation',
    dataType: 'date',
    measure: 'scale',
    role: 'input',
    alignment: 'center',
    width: 130,
    columnIndex: 13,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'var-15',
    datasetId: 'ds-001',
    name: 'follow_up',
    label: 'Scheduled Follow-Up Timestamp',
    dataType: 'datetime',
    measure: 'scale',
    role: 'input',
    alignment: 'center',
    width: 160,
    columnIndex: 14,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  }
];

// Generator function for ~500 realistic rows
export const generateMockRows = (count: number = 500): DataRow[] => {
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const employments = ['Full-time', 'Part-time', 'Self-employed', 'Unemployed', 'Retired'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  const treatments = ['Protocol A (Standard)', 'Protocol B (Advanced)', 'Protocol C (Placebo)', 'Protocol D (Immuno)'];

  const rows: DataRow[] = [];

  for (let i = 1; i <= count; i++) {
    const isMissing = i % 17 === 0;
    const isUserMissing = i % 23 === 0;

    rows.push({
      _rowId: `row-${i}`,
      _rowNumber: i,
      patient_id: `P-${100000 + i}`,
      age: 20 + (i * 7) % 62,
      sex: (i % 2) + 1, // 1: Male, 2: Female
      education: isUserMissing ? 99 : (i % 5) + 1,
      marital_status: maritalStatuses[i % maritalStatuses.length],
      income: isMissing ? null : parseFloat((35000 + (i * 1420) % 95000).toFixed(2)),
      employment: employments[i % employments.length],
      region: regions[i % regions.length],
      satisfaction: (i % 5) + 1,
      service_quality: parseFloat((4.0 + (i * 0.3) % 6.0).toFixed(1)),
      waiting_time: parseFloat((10.0 + (i * 1.5) % 55.0).toFixed(1)),
      treatment_type: treatments[i % treatments.length],
      treatment_success: i % 3 !== 0,
      visit_date: `2025-0${(i % 9) + 1}-15`,
      follow_up: `2025-11-20 14:${(i * 5) % 60 < 10 ? '0' : ''}${(i * 5) % 60}`
    });
  }

  return rows;
};
