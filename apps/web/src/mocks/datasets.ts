import { Dataset, Variable } from '../types';

export const MOCK_PREVIEW_GRID = {
  columns: ['ID', 'Age', 'Gender', 'Income', 'Education', 'Satisfaction', 'Purchase Frequency', 'Region'],
  rows: [
    ['1001', 25, 'Male', 42000, 'Bachelor', 8, 12, 'North'],
    ['1002', 34, 'Female', 58000, 'Master', 9, 15, 'South'],
    ['1003', 28, 'Female', 39000, 'Bachelor', 6, 8, 'East'],
    ['1004', 45, 'Male', 72000, 'PhD', 9, 20, 'North'],
    ['1005', 52, 'Male', 92000, 'Master', 10, 24, 'West'],
    ['1006', 38, 'Female', 64000, 'Bachelor', 8, 14, 'South'],
    ['1007', 41, 'Male', 71000, 'Master', 9, 18, 'North'],
    ['1008', 23, 'Female', 31000, 'High School', 5, 5, 'East']
  ],
  total_rows: 12450,
  total_columns: 8
};

export const MOCK_VARIABLE_VIEW_LIST: Variable[] = [
  {
    id: 'v-1',
    dataset_version_id: 'ver-101',
    name: 'id',
    label: 'Respondent Unique Identifier',
    data_type: 'string',
    measurement_level: 'nominal',
    column_index: 0
  },
  {
    id: 'v-2',
    dataset_version_id: 'ver-101',
    name: 'age',
    label: 'Age',
    data_type: 'integer',
    measurement_level: 'scale',
    column_index: 1
  },
  {
    id: 'v-3',
    dataset_version_id: 'ver-101',
    name: 'gender',
    label: 'Gender',
    data_type: 'string',
    measurement_level: 'nominal',
    categories: [
      { value: 'Male', label: 'Male', count: 6100 },
      { value: 'Female', label: 'Female', count: 6350 }
    ],
    column_index: 2
  },
  {
    id: 'v-4',
    dataset_version_id: 'ver-101',
    name: 'income',
    label: 'Annual Household Income ($)',
    data_type: 'float',
    measurement_level: 'scale',
    column_index: 3
  },
  {
    id: 'v-5',
    dataset_version_id: 'ver-101',
    name: 'education',
    label: 'Highest Educational Attainment',
    data_type: 'string',
    measurement_level: 'ordinal',
    categories: [
      { value: 'High School', label: 'High School', count: 2100 },
      { value: 'Bachelor', label: 'Bachelor Degree', count: 6400 },
      { value: 'Master', label: 'Master Degree', count: 3250 },
      { value: 'PhD', label: 'Doctorate', count: 700 }
    ],
    column_index: 4
  },
  {
    id: 'v-6',
    dataset_version_id: 'ver-101',
    name: 'satisfaction',
    label: 'Customer Satisfaction (1-10 Scale)',
    data_type: 'integer',
    measurement_level: 'scale',
    column_index: 5
  },
  {
    id: 'v-7',
    dataset_version_id: 'ver-101',
    name: 'purchase_freq',
    label: 'Annual Purchase Frequency',
    data_type: 'integer',
    measurement_level: 'scale',
    column_index: 6
  },
  {
    id: 'v-8',
    dataset_version_id: 'ver-101',
    name: 'region',
    label: 'Geographic Sales Region',
    data_type: 'string',
    measurement_level: 'nominal',
    column_index: 7
  }
];
