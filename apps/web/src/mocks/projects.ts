import { Project } from '../types';

export const MOCK_PROJECTS_LIST: Project[] = [
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction Study',
    description: 'Biostatistical and econometric evaluation of customer retention, Net Promoter Score, and revenue impact across demographics.',
    dataset_count: 3,
    analysis_count: 14,
    status: 'active',
    collaborator_count: 4,
    updated_at: '2026-10-07T09:30:00Z',
    created_at: '2026-09-15T10:00:00Z'
  },
  {
    id: 'healthcare-survey',
    name: 'Healthcare Survey 2026',
    description: 'Phase III clinical outcome trial evaluating drug efficacy, dosage response curves, and patient survival metrics.',
    dataset_count: 2,
    analysis_count: 8,
    status: 'active',
    collaborator_count: 6,
    updated_at: '2026-10-06T16:45:00Z',
    created_at: '2026-08-20T11:00:00Z'
  },
  {
    id: 'gdp-growth',
    name: 'GDP & Economic Growth',
    description: 'Time series econometrics, ARDL cointegration, and vector autoregression (VAR) modeling of inflation and interest rates.',
    dataset_count: 5,
    analysis_count: 22,
    status: 'completed',
    collaborator_count: 3,
    updated_at: '2026-10-04T12:15:00Z',
    created_at: '2026-07-10T14:30:00Z'
  },
  {
    id: 'quality-control',
    name: 'Quality Control Analysis',
    description: 'Six Sigma process capability (Cp, Cpk) and Shewhart X-bar control chart monitoring for industrial defect reduction.',
    dataset_count: 1,
    analysis_count: 6,
    status: 'active',
    collaborator_count: 2,
    updated_at: '2026-10-02T08:10:00Z',
    created_at: '2026-09-01T09:00:00Z'
  }
];
