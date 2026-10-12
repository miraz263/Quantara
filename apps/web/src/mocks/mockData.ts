import { Project, Dataset, Variable, Analysis, TeamMember, ProjectFile, DataQualityReport } from '../types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-101',
    name: 'Customer Satisfaction & Churn Analysis',
    description: 'Biostatistical and econometric evaluation of customer retention, Net Promoter Score, and revenue impact across demographics.',
    dataset_count: 3,
    analysis_count: 14,
    status: 'active',
    collaborator_count: 4,
    updated_at: '2026-10-07T09:30:00Z',
    created_at: '2026-09-15T10:00:00Z'
  },
  {
    id: 'proj-102',
    name: 'Healthcare Survey 2026 Clinical Trial',
    description: 'Phase III clinical outcome trial evaluating drug efficacy, dosage response curves, and patient survival metrics.',
    dataset_count: 2,
    analysis_count: 8,
    status: 'active',
    collaborator_count: 6,
    updated_at: '2026-10-06T16:45:00Z',
    created_at: '2026-08-20T11:00:00Z'
  },
  {
    id: 'proj-103',
    name: 'GDP & Macroeconomic Growth Forecasting',
    description: 'Time series econometrics, ARDL cointegration, and vector autoregression (VAR) modeling of inflation and interest rates.',
    dataset_count: 5,
    analysis_count: 22,
    status: 'completed',
    collaborator_count: 3,
    updated_at: '2026-10-04T12:15:00Z',
    created_at: '2026-07-10T14:30:00Z'
  }
];

export const MOCK_DATASETS: Dataset[] = [
  {
    id: 'ds-101',
    project_id: 'proj-101',
    name: 'customer_satisfaction_study.csv',
    description: '12,450 observations of customer survey data containing income, age, region, and satisfaction metrics.',
    file_type: 'csv',
    storage_path: '/tmp/quantara_storage/ds-101/version_1.parquet',
    row_count: 12450,
    column_count: 8,
    created_at: '2026-09-15T10:05:00Z',
    updated_at: '2026-09-15T10:05:00Z',
    current_version_id: 'ver-101'
  },
  {
    id: 'ds-102',
    project_id: 'proj-101',
    name: 'telecom_churn_cohorts.parquet',
    description: 'Panel dataset tracking monthly retention over 24 billing periods.',
    file_type: 'parquet',
    storage_path: '/tmp/quantara_storage/ds-102/version_1.parquet',
    row_count: 8500,
    column_count: 12,
    created_at: '2026-09-20T14:20:00Z',
    updated_at: '2026-09-20T14:20:00Z',
    current_version_id: 'ver-102'
  }
];

export const MOCK_VARIABLES: Variable[] = [
  {
    id: 'var-1',
    dataset_version_id: 'ver-101',
    name: 'customer_id',
    label: 'Customer Unique Identifier',
    data_type: 'string',
    measurement_level: 'nominal',
    column_index: 0
  },
  {
    id: 'var-2',
    dataset_version_id: 'ver-101',
    name: 'age',
    label: 'Respondent Age (Years)',
    data_type: 'integer',
    measurement_level: 'scale',
    column_index: 1
  },
  {
    id: 'var-3',
    dataset_version_id: 'ver-101',
    name: 'gender',
    label: 'Gender Category',
    data_type: 'string',
    measurement_level: 'nominal',
    categories: [
      { value: 'Male', label: 'Male', count: 6100 },
      { value: 'Female', label: 'Female', count: 6350 }
    ],
    column_index: 2
  },
  {
    id: 'var-4',
    dataset_version_id: 'ver-101',
    name: 'annual_income',
    label: 'Household Income ($ USD)',
    data_type: 'float',
    measurement_level: 'scale',
    column_index: 3
  },
  {
    id: 'var-5',
    dataset_version_id: 'ver-101',
    name: 'education_level',
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
    id: 'var-6',
    dataset_version_id: 'ver-101',
    name: 'satisfaction_score',
    label: 'Customer Satisfaction Score (1-10 Scale)',
    data_type: 'integer',
    measurement_level: 'scale',
    column_index: 5
  },
  {
    id: 'var-7',
    dataset_version_id: 'ver-101',
    name: 'nps_category',
    label: 'Net Promoter Score Group',
    data_type: 'string',
    measurement_level: 'nominal',
    categories: [
      { value: 'Detractor', label: 'Detractor (0-6)', count: 2400 },
      { value: 'Passive', label: 'Passive (7-8)', count: 4100 },
      { value: 'Promoter', label: 'Promoter (9-10)', count: 5950 }
    ],
    column_index: 6
  }
];

export const MOCK_ANALYSES: Analysis[] = [
  {
    id: 'an-201',
    project_id: 'proj-101',
    dataset_version_id: 'ver-101',
    name: 'Multiple Linear Regression: Income & Age on Satisfaction',
    analysis_type: 'regression',
    parameters: {
      dependent_variable: 'satisfaction_score',
      independent_variables: ['annual_income', 'age']
    },
    status: 'completed',
    execution_time_ms: 12.4,
    created_at: '2026-10-07T08:15:00Z',
    result_data: {
      analysis_id: 'an-201',
      analysis_type: 'regression',
      dataset_version_id: 'ver-101',
      status: 'completed',
      parameters: { dependent: 'satisfaction_score', predictors: ['annual_income', 'age'] },
      summary: 'OLS Linear Regression completed with R² = 0.482 (F(2, 12447) = 5792.1, p < 0.001). Annual income is a statistically significant positive predictor.',
      tables: [
        {
          title: 'Model Summary',
          columns: ['Model', 'R', 'R Square', 'Adjusted R Square', 'Std. Error of the Estimate'],
          rows: [['1', '0.694', '0.482', '0.482', '0.812']]
        },
        {
          title: 'ANOVA Table',
          columns: ['Model Source', 'Sum of Squares', 'df', 'Mean Square', 'F', 'Sig. (p)'],
          rows: [
            ['Regression', '7634.12', '2', '3817.06', '5792.10', '< .001'],
            ['Residual', '8203.45', '12447', '0.659', '', ''],
            ['Total', '15837.57', '12449', '', '', '']
          ]
        },
        {
          title: 'Coefficients',
          columns: ['Model Predictor', 'Unstandardized B', 'Std. Error', 'Standardized Beta', 't', 'Sig. (p)', 'VIF'],
          rows: [
            ['(Constant)', '3.421', '0.084', '', '40.72', '< .001', ''],
            ['annual_income', '0.000052', '0.0000006', '0.612', '86.67', '< .001', '1.04'],
            ['age', '0.024', '0.0018', '0.148', '13.33', '< .001', '1.04']
          ]
        }
      ],
      statistics: { r2: 0.482, adj_r2: 0.482, f_stat: 5792.1 },
      diagnostics: [
        { name: 'Multicollinearity (VIF)', status: 'passed', statistic_value: 1.04, message: 'No severe multicollinearity detected (all VIF < 5.0).' },
        { name: 'Residual Normality (Shapiro-Wilk)', status: 'passed', statistic_value: 0.989, p_value: 0.12, message: 'Residuals conform to normal distribution.' }
      ],
      charts: [
        {
          type: 'scatter',
          title: 'Residuals vs Fitted Values',
          data: {
            categories: ['Fitted 4.5', 'Fitted 5.5', 'Fitted 6.5', 'Fitted 7.5', 'Fitted 8.5'],
            series: [{ name: 'Residuals', data: [-0.2, 0.1, -0.4, 0.3, 0.05] }]
          }
        }
      ],
      interpretation: 'For every $10,000 increase in annual income, customer satisfaction increases by 0.52 points (p < 0.001), holding age constant. Age is also a statistically significant positive predictor (B = 0.024, p < 0.001).',
      execution_metadata: {
        engine: 'Quantara Statistical Engine (Python/Statsmodels)',
        engine_version: '1.0.0',
        duration_ms: 12.4,
        timestamp: '2026-10-07 08:15:00 UTC'
      },
      generated_code: {
        python: `import pandas as pd\nimport statsmodels.api as sm\n\ndf = pd.read_parquet('customer_satisfaction.parquet')\nX = sm.add_constant(df[['annual_income', 'age']])\ny = df['satisfaction_score']\n\nmodel = sm.OLS(y, X).fit()\nprint(model.summary())`,
        r: `df <- read.csv('customer_satisfaction.csv')\nmodel <- lm(satisfaction_score ~ annual_income + age, data = df)\nsummary(model)`
      }
    }
  }
];

export const MOCK_QUALITY_REPORT: DataQualityReport = {
  overall_score: 92,
  completeness: 94,
  validity: 91,
  consistency: 89,
  duplicates: 98,
  outliers: 86
};

export const MOCK_FILES: ProjectFile[] = [
  { id: 'f-1', project_id: 'proj-101', name: 'customer_satisfaction_study.csv', category: 'dataset', size_bytes: 1420500, modified_at: '2026-10-07T09:10:00Z', owner_name: 'Dr. Sarah Lin' },
  { id: 'f-2', project_id: 'proj-101', name: 'regression_model_report.pdf', category: 'report', size_bytes: 3820000, modified_at: '2026-10-06T14:30:00Z', owner_name: 'Alex Rivera' },
  { id: 'f-3', project_id: 'proj-101', name: 'income_vs_satisfaction_chart.png', category: 'chart', size_bytes: 450000, modified_at: '2026-10-05T11:20:00Z', owner_name: 'Dr. Sarah Lin' }
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'tm-1', user: { id: 'u-1', email: 'sarah.lin@quantara.ai', full_name: 'Dr. Sarah Lin', role: 'owner', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }, role: 'owner', joined_at: '2026-01-15T00:00:00Z' },
  { id: 'tm-2', user: { id: 'u-2', email: 'alex.rivera@quantara.ai', full_name: 'Alex Rivera', role: 'statistician' }, role: 'statistician', joined_at: '2026-03-01T00:00:00Z' },
  { id: 'tm-3', user: { id: 'u-3', email: 'elena.rostova@quantara.ai', full_name: 'Elena Rostova', role: 'analyst' }, role: 'analyst', joined_at: '2026-05-10T00:00:00Z' }
];
