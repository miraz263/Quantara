import { AnalysisResult, VariableItem } from '../types/analysisTypes';

export const MOCK_AVAILABLE_VARIABLES: VariableItem[] = [
  { name: 'age', label: 'Patient Age in Years', dataType: 'integer', measure: 'scale' },
  { name: 'income', label: 'Annual Household Income (USD)', dataType: 'float', measure: 'scale' },
  { name: 'satisfaction', label: 'Healthcare Satisfaction Rating', dataType: 'integer', measure: 'ordinal' },
  { name: 'waiting_time', label: 'Clinic Waiting Time (minutes)', dataType: 'float', measure: 'scale' },
  { name: 'service_quality', label: 'Service Quality Score (1-10)', dataType: 'float', measure: 'scale' },
  { name: 'sex', label: 'Biological Sex at Birth', dataType: 'integer', measure: 'nominal' },
  { name: 'education', label: 'Highest Education Level', dataType: 'integer', measure: 'ordinal' },
  { name: 'employment', label: 'Current Employment Status', dataType: 'string', measure: 'nominal' },
  { name: 'region', label: 'Geographic Region Code', dataType: 'string', measure: 'nominal' },
  { name: 'treatment_type', label: 'Primary Treatment Protocol', dataType: 'string', measure: 'nominal' },
  { name: 'treatment_success', label: 'Treatment Outcome Successful', dataType: 'boolean', measure: 'nominal' },
  { name: 'before_score', label: 'Baseline Assessment Score (Pre-Intervention)', dataType: 'float', measure: 'scale' },
  { name: 'after_score', label: 'Follow-up Assessment Score (Post-Intervention)', dataType: 'float', measure: 'scale' },
  { name: 'pre_waiting_time', label: 'Baseline Waiting Time (min)', dataType: 'float', measure: 'scale' },
  { name: 'post_waiting_time', label: 'Post-Optimization Waiting Time (min)', dataType: 'float', measure: 'scale' },
];

export const MOCK_DESCRIPTIVES_RESULT: AnalysisResult = {
  id: 'res-desc-001',
  analysisId: 'ana-001',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'descriptives',
  title: 'Descriptive Statistics — age, income, satisfaction',
  status: 'completed',
  executionTimeMs: 142,
  syntax: `DESCRIPTIVES
  VARIABLES = age income satisfaction waiting_time
  /STATISTICS = MEAN MEDIAN STDDEV MIN MAX SKEWNESS KURTOSIS.`,
  createdAt: new Date().toISOString(),
  warnings: [
    { id: 'w1', severity: 'info', message: 'Valid N excludes 812 system-missing observations for variable income.' },
  ],
  tables: [
    {
      id: 'tbl-desc-1',
      title: 'Descriptive Statistics Summary Table',
      footnotes: ['Results are based on dataset version 3. Valid N excludes missing cases.'],
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'n', label: 'Valid N', isNumeric: true, align: 'right' },
        { key: 'missing', label: 'Missing', isNumeric: true, align: 'right' },
        { key: 'mean', label: 'Mean', isNumeric: true, align: 'right' },
        { key: 'stdDev', label: 'Std Dev', isNumeric: true, align: 'right' },
        { key: 'median', label: 'Median', isNumeric: true, align: 'right' },
        { key: 'min', label: 'Min', isNumeric: true, align: 'right' },
        { key: 'max', label: 'Max', isNumeric: true, align: 'right' },
        { key: 'skewness', label: 'Skewness', isNumeric: true, align: 'right' },
        { key: 'kurtosis', label: 'Kurtosis', isNumeric: true, align: 'right' },
        { key: 'ci95', label: '95% CI Mean', align: 'right' },
      ],
      rows: [
        { variable: 'age', n: 24510, missing: 72, mean: 42.7, stdDev: 12.34, median: 41.0, min: 18, max: 87, skewness: 0.42, kurtosis: 1.15, ci95: '[42.54, 42.85]' },
        { variable: 'income', n: 23770, missing: 812, mean: 68420.4, stdDev: 32100.8, median: 62100.0, min: 12000, max: 450000, skewness: 2.14, kurtosis: 6.82, ci95: '[68012.3, 68828.5]' },
        { variable: 'satisfaction', n: 24400, missing: 182, mean: 4.12, stdDev: 0.91, median: 4.0, min: 1, max: 5, skewness: -0.68, kurtosis: 0.24, ci95: '[4.11, 4.13]' },
        { variable: 'waiting_time', n: 24388, missing: 194, mean: 27.42, stdDev: 18.73, median: 24.5, min: 1, max: 180, skewness: 1.35, kurtosis: 2.41, ci95: '[27.18, 27.65]' },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-desc-1',
      type: 'histogram',
      title: 'Age Distribution Histogram with Normal Overlay',
      categories: ['18-25', '26-35', '36-45', '46-55', '56-65', '66-75', '76-87'],
      values: [1800, 6400, 8100, 5200, 2100, 750, 160],
    },
  ],
};

export const MOCK_FREQUENCIES_RESULT: AnalysisResult = {
  id: 'res-freq-001',
  analysisId: 'ana-002',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'frequencies',
  title: 'Frequencies — education, sex',
  status: 'completed',
  executionTimeMs: 98,
  syntax: `FREQUENCIES
  VARIABLES = education sex
  /ORDER = VALUE
  /BARCHART.`,
  createdAt: new Date().toISOString(),
  warnings: [],
  tables: [
    {
      id: 'tbl-freq-1',
      title: 'Frequency Table: Highest Education Level',
      columns: [
        { key: 'category', label: 'Value / Code', align: 'left' },
        { key: 'frequency', label: 'Frequency', isNumeric: true, align: 'right' },
        { key: 'percent', label: 'Percent', isNumeric: true, align: 'right' },
        { key: 'validPercent', label: 'Valid Percent', isNumeric: true, align: 'right' },
        { key: 'cumPercent', label: 'Cumulative %', isNumeric: true, align: 'right' },
      ],
      rows: [
        { category: 'Primary (1)', frequency: 1000, percent: 4.1, validPercent: 4.2, cumPercent: 4.2 },
        { category: 'Secondary (2)', frequency: 6200, percent: 25.2, validPercent: 25.8, cumPercent: 30.0 },
        { category: 'Higher Sec (3)', frequency: 3270, percent: 13.3, validPercent: 13.6, cumPercent: 43.6 },
        { category: 'Graduate (4)', frequency: 8500, percent: 34.6, validPercent: 35.3, cumPercent: 78.9 },
        { category: 'Postgraduate (5)', frequency: 5100, percent: 20.7, validPercent: 21.1, cumPercent: 100.0 },
        { category: 'Missing System', frequency: 512, percent: 2.1, validPercent: '—', cumPercent: '—' },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-freq-1',
      type: 'bar',
      title: 'Highest Education Level Frequencies Bar Chart',
      categories: ['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate'],
      values: [1000, 6200, 3270, 8500, 5100],
    },
  ],
};

export const MOCK_CROSSTABS_RESULT: AnalysisResult = {
  id: 'res-cross-001',
  analysisId: 'ana-003',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'crosstabs',
  title: 'Crosstabs — Education × Employment',
  status: 'completed',
  executionTimeMs: 165,
  syntax: `CROSSTABS
  /TABLES = education BY employment
  /CELLS = COUNT ROW COL.`,
  createdAt: new Date().toISOString(),
  warnings: [],
  tables: [
    {
      id: 'tbl-cross-1',
      title: 'Crosstabulation: Education × Employment Status',
      columns: [
        { key: 'education', label: 'Education Level', align: 'left' },
        { key: 'fulltime', label: 'Full-time', isNumeric: true, align: 'right' },
        { key: 'parttime', label: 'Part-time', isNumeric: true, align: 'right' },
        { key: 'self', label: 'Self-employed', isNumeric: true, align: 'right' },
        { key: 'unemployed', label: 'Unemployed', isNumeric: true, align: 'right' },
        { key: 'total', label: 'Total Rows', isNumeric: true, align: 'right' },
      ],
      rows: [
        { education: 'Primary', fulltime: 420, parttime: 210, self: 180, unemployed: 190, total: 1000 },
        { education: 'Secondary', fulltime: 3120, parttime: 1420, self: 980, unemployed: 680, total: 6200 },
        { education: 'Higher Sec', fulltime: 1840, parttime: 680, self: 450, unemployed: 300, total: 3270 },
        { education: 'Graduate', fulltime: 5420, parttime: 1200, self: 1350, unemployed: 530, total: 8500 },
        { education: 'Postgraduate', fulltime: 3820, parttime: 510, self: 610, unemployed: 160, total: 5100 },
        { education: 'Total Columns', fulltime: 14620, parttime: 4030, self: 3570, unemployed: 1860, total: 24070 },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-cross-1',
      type: 'bar',
      title: 'Full-time Employment by Education Level',
      categories: ['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate'],
      values: [420, 3120, 1840, 5420, 3820],
    },
  ],
};

export const MOCK_EXPLORE_RESULT: AnalysisResult = {
  id: 'res-exp-001',
  analysisId: 'ana-004',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'explore',
  title: 'Explore — Income by Sex',
  status: 'completed',
  executionTimeMs: 180,
  syntax: `EXPLORE
  VARIABLES = income BY sex
  /PLOT = HISTOGRAM BOXPLOT.`,
  createdAt: new Date().toISOString(),
  warnings: [],
  tables: [
    {
      id: 'tbl-exp-1',
      title: 'Grouped Descriptive Statistics: Income by Sex',
      columns: [
        { key: 'group', label: 'Group (Sex)', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'mean', label: 'Mean ($)', isNumeric: true, align: 'right' },
        { key: 'stdDev', label: 'Std Dev', isNumeric: true, align: 'right' },
        { key: 'median', label: 'Median ($)', isNumeric: true, align: 'right' },
        { key: 'iqr', label: 'IQR', isNumeric: true, align: 'right' },
      ],
      rows: [
        { group: 'Female', n: 11850, mean: 65880.4, stdDev: 30440.2, median: 60000.0, iqr: 35000 },
        { group: 'Male', n: 11620, mean: 71240.8, stdDev: 33210.6, median: 64000.0, iqr: 39000 },
        { group: 'Non-binary', n: 300, mean: 59200.0, stdDev: 24100.0, median: 55000.0, iqr: 28000 },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-exp-1',
      type: 'bar',
      title: 'Mean Household Income by Biological Sex',
      categories: ['Female', 'Male', 'Non-binary'],
      values: [65880.4, 71240.8, 59200.0],
    },
  ],
};

export const MOCK_PEARSON_RESULT: AnalysisResult = {
  id: 'res-pearson-001',
  analysisId: 'ana-005',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'pearson',
  title: 'Pearson Correlation Matrix — age, income, satisfaction, waiting_time, service_quality',
  status: 'completed',
  executionTimeMs: 112,
  syntax: `CORRELATIONS
  /VARIABLES = age income satisfaction waiting_time service_quality
  /PRINT = TWOTAIL NOSIG
  /MISSING = PAIRWISE
  /CI LEVEL = 95.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-pearson-1',
      severity: 'info',
      message: 'Pairwise missing data strategy used. Sample size N ranges from 23,770 to 24,510 across pairwise comparisons.',
    },
  ],
  tables: [
    {
      id: 'tbl-pearson-matrix',
      title: 'Pearson Correlation Matrix (Bivariate Product-Moment)',
      footnotes: [
        '**. Correlation is significant at the 0.01 level (2-tailed).',
        '*. Correlation is significant at the 0.05 level (2-tailed).',
        'Pairwise N ranges from 23,770 to 24,510.',
      ],
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'statistic', label: 'Metric', align: 'left' },
        { key: 'age', label: 'Age', isNumeric: true, align: 'right' },
        { key: 'income', label: 'Income', isNumeric: true, align: 'right' },
        { key: 'satisfaction', label: 'Satisfaction', isNumeric: true, align: 'right' },
        { key: 'waiting_time', label: 'Waiting Time', isNumeric: true, align: 'right' },
        { key: 'service_quality', label: 'Service Quality', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Age', statistic: 'Pearson r', age: 1.000, income: 0.412, satisfaction: 0.184, waiting_time: -0.052, service_quality: 0.215 },
        { variable: 'Age', statistic: 'Sig. (2-tailed)', age: '—', income: '< .001', satisfaction: '< .001', waiting_time: '.014', service_quality: '< .001' },
        { variable: 'Age', statistic: '95% CI', age: '[1.0, 1.0]', income: '[.401, .423]', satisfaction: '[.172, .196]', waiting_time: '[-.064, -.039]', service_quality: '[.203, .227]' },
        { variable: 'Age', statistic: 'N', age: 24510, income: 23770, satisfaction: 24400, waiting_time: 24388, service_quality: 24510 },

        { variable: 'Income', statistic: 'Pearson r', age: 0.412, income: 1.000, satisfaction: 0.318, waiting_time: -0.124, service_quality: 0.485 },
        { variable: 'Income', statistic: 'Sig. (2-tailed)', age: '< .001', income: '—', satisfaction: '< .001', waiting_time: '< .001', service_quality: '< .001' },
        { variable: 'Income', statistic: '95% CI', age: '[.401, .423]', income: '[1.0, 1.0]', satisfaction: '[.306, .330]', waiting_time: '[-.136, -.111]', service_quality: '[.475, .495]' },
        { variable: 'Income', statistic: 'N', age: 23770, income: 23770, satisfaction: 23680, waiting_time: 23660, service_quality: 23770 },

        { variable: 'Satisfaction', statistic: 'Pearson r', age: 0.184, income: 0.318, satisfaction: 1.000, waiting_time: -0.542, service_quality: 0.724 },
        { variable: 'Satisfaction', statistic: 'Sig. (2-tailed)', age: '< .001', income: '< .001', satisfaction: '—', waiting_time: '< .001', service_quality: '< .001' },
        { variable: 'Satisfaction', statistic: '95% CI', age: '[.172, .196]', income: '[.306, .330]', satisfaction: '[1.0, 1.0]', waiting_time: '[-.551, -.532]', service_quality: '[.717, .731]' },
        { variable: 'Satisfaction', statistic: 'N', age: 24400, income: 23680, satisfaction: 24400, waiting_time: 24320, service_quality: 24400 },

        { variable: 'Waiting Time', statistic: 'Pearson r', age: -0.052, income: -0.124, satisfaction: -0.542, waiting_time: 1.000, service_quality: -0.612 },
        { variable: 'Waiting Time', statistic: 'Sig. (2-tailed)', age: '.014', income: '< .001', satisfaction: '< .001', waiting_time: '—', service_quality: '< .001' },
        { variable: 'Waiting Time', statistic: '95% CI', age: '[-.064, -.039]', income: '[-.136, -.111]', satisfaction: '[-.551, -.532]', waiting_time: '[1.0, 1.0]', service_quality: '[-.621, -.603]' },
        { variable: 'Waiting Time', statistic: 'N', age: 24388, income: 23660, satisfaction: 24320, waiting_time: 24388, service_quality: 24388 },

        { variable: 'Service Quality', statistic: 'Pearson r', age: 0.215, income: 0.485, satisfaction: 0.724, waiting_time: -0.612, service_quality: 1.000 },
        { variable: 'Service Quality', statistic: 'Sig. (2-tailed)', age: '< .001', income: '< .001', satisfaction: '< .001', waiting_time: '< .001', service_quality: '—' },
        { variable: 'Service Quality', statistic: '95% CI', age: '[.203, .227]', income: '[.475, .495]', satisfaction: '[.717, .731]', waiting_time: '[-.621, -.603]', service_quality: '[1.0, 1.0]' },
        { variable: 'Service Quality', statistic: 'N', age: 24510, income: 23770, satisfaction: 24400, waiting_time: 24388, service_quality: 24510 },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-pearson-scatter',
      type: 'scatter',
      title: 'Bivariate Scatter Plot with Linear Trend: Waiting Time vs Satisfaction',
      categories: ['0-30m', '30-60m', '60-90m', '90-120m', '120m+'],
      values: [4.5, 3.8, 3.1, 2.4, 1.8],
    },
  ],
};

export const MOCK_SPEARMAN_RESULT: AnalysisResult = {
  id: 'res-spearman-001',
  analysisId: 'ana-006',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'spearman',
  title: 'Spearman Rank Correlation — satisfaction, service_quality, education',
  status: 'completed',
  executionTimeMs: 105,
  syntax: `NONPAR CORR
  /VARIABLES = satisfaction service_quality education
  /PRINT = SPEARMAN TWOTAIL.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-spear-1',
      severity: 'info',
      message: 'Rank tie correction applied for ordinal variables satisfaction and education.',
    },
  ],
  tables: [
    {
      id: 'tbl-spearman-matrix',
      title: 'Spearman Rank-Order Correlation Matrix (rho)',
      footnotes: ['**. Correlation is significant at the 0.01 level (2-tailed).'],
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'statistic', label: 'Metric', align: 'left' },
        { key: 'satisfaction', label: 'Satisfaction', isNumeric: true, align: 'right' },
        { key: 'service_quality', label: 'Service Quality', isNumeric: true, align: 'right' },
        { key: 'education', label: 'Education Level', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Satisfaction', statistic: 'Spearman rho', satisfaction: 1.000, service_quality: 0.698, education: 0.284 },
        { variable: 'Satisfaction', statistic: 'Sig. (2-tailed)', satisfaction: '—', service_quality: '< .001', education: '< .001' },
        { variable: 'Satisfaction', statistic: 'N', satisfaction: 24400, service_quality: 24400, education: 23980 },

        { variable: 'Service Quality', statistic: 'Spearman rho', satisfaction: 0.698, service_quality: 1.000, education: 0.342 },
        { variable: 'Service Quality', statistic: 'Sig. (2-tailed)', satisfaction: '< .001', service_quality: '—', education: '< .001' },
        { variable: 'Service Quality', statistic: 'N', satisfaction: 24400, service_quality: 24510, education: 24010 },

        { variable: 'Education Level', statistic: 'Spearman rho', satisfaction: 0.284, service_quality: 0.342, education: 1.000 },
        { variable: 'Education Level', statistic: 'Sig. (2-tailed)', satisfaction: '< .001', service_quality: '< .001', education: '—' },
        { variable: 'Education Level', statistic: 'N', satisfaction: 23980, service_quality: 24010, education: 24012 },
      ],
    },
  ],
  charts: [],
};

export const MOCK_KENDALL_RESULT: AnalysisResult = {
  id: 'res-kendall-001',
  analysisId: 'ana-007',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'kendall',
  title: "Kendall's Tau-b Rank Correlation — satisfaction, service_quality, education",
  status: 'completed',
  executionTimeMs: 118,
  syntax: `NONPAR CORR
  /VARIABLES = satisfaction service_quality education
  /PRINT = KENDALL TWOTAIL.`,
  createdAt: new Date().toISOString(),
  warnings: [],
  tables: [
    {
      id: 'tbl-kendall-matrix',
      title: "Kendall's Tau-b Correlation Matrix (tau_b)",
      footnotes: ['**. Correlation is significant at the 0.01 level (2-tailed). Adjusted for ties.'],
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'statistic', label: 'Metric', align: 'left' },
        { key: 'satisfaction', label: 'Satisfaction', isNumeric: true, align: 'right' },
        { key: 'service_quality', label: 'Service Quality', isNumeric: true, align: 'right' },
        { key: 'education', label: 'Education Level', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Satisfaction', statistic: "Kendall's tau_b", satisfaction: 1.000, service_quality: 0.582, education: 0.231 },
        { variable: 'Satisfaction', statistic: 'Sig. (2-tailed)', satisfaction: '—', service_quality: '< .001', education: '< .001' },
        { variable: 'Satisfaction', statistic: 'N', satisfaction: 24400, service_quality: 24400, education: 23980 },

        { variable: 'Service Quality', statistic: "Kendall's tau_b", satisfaction: 0.582, service_quality: 1.000, education: 0.276 },
        { variable: 'Service Quality', statistic: 'Sig. (2-tailed)', satisfaction: '< .001', service_quality: '—', education: '< .001' },
        { variable: 'Service Quality', statistic: 'N', satisfaction: 24400, service_quality: 24510, education: 24010 },

        { variable: 'Education Level', statistic: "Kendall's tau_b", satisfaction: 0.231, service_quality: 0.276, education: 1.000 },
        { variable: 'Education Level', statistic: 'Sig. (2-tailed)', satisfaction: '< .001', service_quality: '< .001', education: '—' },
        { variable: 'Education Level', statistic: 'N', satisfaction: 23980, service_quality: 24010, education: 24012 },
      ],
    },
  ],
  charts: [],
};

export const MOCK_PARTIAL_RESULT: AnalysisResult = {
  id: 'res-partial-001',
  analysisId: 'ana-008',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'partial_correlation',
  title: 'Partial Correlation — income & satisfaction (Controlling for age)',
  status: 'completed',
  executionTimeMs: 135,
  syntax: `PARTIAL CORR
  /VARIABLES = income satisfaction BY age
  /SIGNIFICANCE = TWOTAIL.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-part-1',
      severity: 'info',
      message: 'Degrees of freedom df = N - k - 2 = 23677 (1 control variable: age).',
    },
  ],
  tables: [
    {
      id: 'tbl-partial-matrix',
      title: 'Partial Correlation Coefficients (Controlling for: Age)',
      footnotes: [
        'Control Variables: Age.',
        '**. Correlation is significant at the 0.01 level (2-tailed).',
        'Zero-order correlation between Income & Satisfaction was r = .318; Partial r controlling for Age is r = .274.',
      ],
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'statistic', label: 'Metric', align: 'left' },
        { key: 'income', label: 'Income', isNumeric: true, align: 'right' },
        { key: 'satisfaction', label: 'Satisfaction', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Income', statistic: 'Partial r', income: 1.000, satisfaction: 0.274 },
        { variable: 'Income', statistic: 'Sig. (2-tailed)', income: '—', satisfaction: '< .001' },
        { variable: 'Income', statistic: 'df', income: 0, satisfaction: 23677 },

        { variable: 'Satisfaction', statistic: 'Partial r', income: 0.274, satisfaction: 1.000 },
        { variable: 'Satisfaction', statistic: 'Sig. (2-tailed)', income: '< .001', satisfaction: '—' },
        { variable: 'Satisfaction', statistic: 'df', income: 23677, satisfaction: 0 },
      ],
    },
  ],
  charts: [],
};

export const MOCK_ONE_SAMPLE_TTEST_RESULT: AnalysisResult = {
  id: 'res-ttest-onesample-001',
  analysisId: 'ana-009',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'one_sample_ttest',
  title: 'One-Sample t-Test — income (Test Value = 65000)',
  status: 'completed',
  executionTimeMs: 104,
  syntax: `T-TEST
  /TESTVAL=65000
  /MISSING=ANALYSIS
  /VARIABLES=income
  /CRITERIA=CI(.95).`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-t1-1',
      severity: 'info',
      message: 'Valid N excludes 812 missing observations for variable income.',
    },
  ],
  tables: [
    {
      id: 'tbl-onesample-desc',
      title: 'One-Sample Descriptive Statistics',
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'mean', label: 'Mean ($)', isNumeric: true, align: 'right' },
        { key: 'stdDev', label: 'Std. Deviation', isNumeric: true, align: 'right' },
        { key: 'stdErrMean', label: 'Std. Error Mean', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'income', n: 23770, mean: 68420.4, stdDev: 32100.8, stdErrMean: 208.2 },
      ],
    },
    {
      id: 'tbl-onesample-test',
      title: 'One-Sample Test (Test Value = 65,000)',
      footnotes: ['95% Confidence Interval of the Difference.'],
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 't', label: 't', isNumeric: true, align: 'right' },
        { key: 'df', label: 'df', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (2-tailed)', align: 'right' },
        { key: 'meanDiff', label: 'Mean Difference', isNumeric: true, align: 'right' },
        { key: 'ciLower', label: '95% CI Lower', isNumeric: true, align: 'right' },
        { key: 'ciUpper', label: '95% CI Upper', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'income', t: 16.43, df: 23769, pValue: '< .001', meanDiff: 3420.4, ciLower: 3012.3, ciUpper: 3828.5 },
      ],
    },
    {
      id: 'tbl-onesample-effect',
      title: "One-Sample Effect Sizes (Test Value = 65,000)",
      footnotes: ["Cohen's d = (Mean - Test Value) / Std. Deviation. Small = 0.2, Medium = 0.5, Large = 0.8."],
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'metric', label: 'Standardizer', align: 'left' },
        { key: 'pointEstimate', label: 'Point Estimate (d)', isNumeric: true, align: 'right' },
        { key: 'interpretation', label: 'Guideline Interpretation', align: 'left' },
      ],
      rows: [
        { variable: 'income', metric: "Cohen's d", pointEstimate: 0.107, interpretation: 'Small / Negligible effect size' },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-onesample-mean',
      type: 'bar',
      title: 'One-Sample Mean (68,420.4) vs Test Value (65,000)',
      categories: ['Sample Mean', 'Test Value Reference'],
      values: [68420.4, 65000.0],
    },
  ],
};

export const MOCK_INDEPENDENT_TTEST_RESULT: AnalysisResult = {
  id: 'res-ttest-indep-001',
  analysisId: 'ana-010',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'independent_ttest',
  title: 'Independent-Samples t-Test — income by sex (Male vs Female)',
  status: 'completed',
  executionTimeMs: 128,
  syntax: `T-TEST GROUPS=sex(1 2)
  /MISSING=ANALYSIS
  /VARIABLES=income
  /CRITERIA=CI(.95).`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-indep-1',
      severity: 'info',
      message: "Levene's Test for Equality of Variances is significant (p < .05). The Welch t-test (Equal Variances Not Assumed) is recommended.",
    },
  ],
  tables: [
    {
      id: 'tbl-indep-group-stats',
      title: 'Group Statistics',
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'group', label: 'Group (Sex)', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'mean', label: 'Mean ($)', isNumeric: true, align: 'right' },
        { key: 'stdDev', label: 'Std. Deviation', isNumeric: true, align: 'right' },
        { key: 'stdErrMean', label: 'Std. Error Mean', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'income', group: 'Male', n: 11620, mean: 71240.8, stdDev: 33210.6, stdErrMean: 308.1 },
        { variable: 'income', group: 'Female', n: 11850, mean: 65880.4, stdDev: 30440.2, stdErrMean: 279.6 },
      ],
    },
    {
      id: 'tbl-indep-test',
      title: 'Independent Samples Test',
      footnotes: [
        "Levene's Test: F = 14.82, p < .001 (Variances are significantly unequal).",
        'Welch t-test recommended when equal variances are not assumed.',
      ],
      columns: [
        { key: 'assumption', label: 'Variance Assumption', align: 'left' },
        { key: 'leveneF', label: "Levene's F", isNumeric: true, align: 'right' },
        { key: 'leveneP', label: "Levene's Sig.", align: 'right' },
        { key: 't', label: 't', isNumeric: true, align: 'right' },
        { key: 'df', label: 'df', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (2-tailed)', align: 'right' },
        { key: 'meanDiff', label: 'Mean Difference', isNumeric: true, align: 'right' },
        { key: 'stdErrDiff', label: 'Std. Error Diff', isNumeric: true, align: 'right' },
        { key: 'ciLower', label: '95% CI Lower', isNumeric: true, align: 'right' },
        { key: 'ciUpper', label: '95% CI Upper', isNumeric: true, align: 'right' },
      ],
      rows: [
        {
          assumption: 'Equal variances assumed',
          leveneF: 14.82,
          leveneP: '< .001',
          t: 12.88,
          df: 23468,
          pValue: '< .001',
          meanDiff: 5360.4,
          stdErrDiff: 416.1,
          ciLower: 4544.8,
          ciUpper: 6176.0,
        },
        {
          assumption: 'Equal variances not assumed (Welch)',
          leveneF: '—',
          leveneP: '—',
          t: 12.88,
          df: 23142.4,
          pValue: '< .001',
          meanDiff: 5360.4,
          stdErrDiff: 416.1,
          ciLower: 4544.8,
          ciUpper: 6176.0,
        },
      ],
    },
    {
      id: 'tbl-indep-effect',
      title: 'Independent Samples Effect Sizes',
      columns: [
        { key: 'comparison', label: 'Comparison', align: 'left' },
        { key: 'metric', label: 'Effect Size Metric', align: 'left' },
        { key: 'pointEstimate', label: 'Point Estimate', isNumeric: true, align: 'right' },
        { key: 'ciLower', label: '95% CI Lower', isNumeric: true, align: 'right' },
        { key: 'ciUpper', label: '95% CI Upper', isNumeric: true, align: 'right' },
      ],
      rows: [
        { comparison: 'Male vs Female', metric: "Cohen's d (Pooled SD)", pointEstimate: 0.168, ciLower: 0.143, ciUpper: 0.194 },
        { comparison: 'Male vs Female', metric: "Hedges' g (Correction)", pointEstimate: 0.168, ciLower: 0.143, ciUpper: 0.194 },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-indep-group-means',
      type: 'bar',
      title: 'Mean Household Income by Group: Male vs Female',
      categories: ['Male Group', 'Female Group'],
      values: [71240.8, 65880.4],
    },
  ],
};

export const MOCK_PAIRED_TTEST_RESULT: AnalysisResult = {
  id: 'res-ttest-paired-001',
  analysisId: 'ana-011',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'paired_ttest',
  title: 'Paired-Samples t-Test — before_score vs after_score',
  status: 'completed',
  executionTimeMs: 115,
  syntax: `T-TEST PAIRS=before_score WITH after_score (PAIRED)
  /CRITERIA=CI(.95)
  /MISSING=ANALYSIS.`,
  createdAt: new Date().toISOString(),
  warnings: [],
  tables: [
    {
      id: 'tbl-paired-stats',
      title: 'Paired Samples Descriptive Statistics',
      columns: [
        { key: 'pair', label: 'Pair', align: 'left' },
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'mean', label: 'Mean', isNumeric: true, align: 'right' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'stdDev', label: 'Std. Deviation', isNumeric: true, align: 'right' },
        { key: 'stdErrMean', label: 'Std. Error Mean', isNumeric: true, align: 'right' },
      ],
      rows: [
        { pair: 'Pair 1', variable: 'before_score (Baseline)', mean: 62.40, n: 1200, stdDev: 10.20, stdErrMean: 0.294 },
        { pair: 'Pair 1', variable: 'after_score (Follow-up)', mean: 68.70, n: 1200, stdDev: 9.80, stdErrMean: 0.283 },
      ],
    },
    {
      id: 'tbl-paired-corr',
      title: 'Paired Samples Correlations',
      columns: [
        { key: 'pair', label: 'Pair', align: 'left' },
        { key: 'variables', label: 'Variables', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'correlation', label: 'Correlation (r)', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (2-tailed)', align: 'right' },
      ],
      rows: [
        { pair: 'Pair 1', variables: 'before_score & after_score', n: 1200, correlation: 0.742, pValue: '< .001' },
      ],
    },
    {
      id: 'tbl-paired-test',
      title: 'Paired Samples Test (Differences)',
      columns: [
        { key: 'pair', label: 'Pair', align: 'left' },
        { key: 'meanDiff', label: 'Mean Diff', isNumeric: true, align: 'right' },
        { key: 'stdDevDiff', label: 'SD Diff', isNumeric: true, align: 'right' },
        { key: 'stdErrDiff', label: 'SE Diff', isNumeric: true, align: 'right' },
        { key: 'ciLower', label: '95% CI Lower', isNumeric: true, align: 'right' },
        { key: 'ciUpper', label: '95% CI Upper', isNumeric: true, align: 'right' },
        { key: 't', label: 't', isNumeric: true, align: 'right' },
        { key: 'df', label: 'df', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (2-tailed)', align: 'right' },
      ],
      rows: [
        {
          pair: 'Pair 1: before - after',
          meanDiff: -6.30,
          stdDevDiff: 7.22,
          stdErrDiff: 0.208,
          ciLower: -6.71,
          ciUpper: -5.89,
          t: -30.29,
          df: 1199,
          pValue: '< .001',
        },
      ],
    },
    {
      id: 'tbl-paired-effect',
      title: 'Paired Samples Effect Sizes',
      columns: [
        { key: 'pair', label: 'Pair', align: 'left' },
        { key: 'metric', label: 'Metric', align: 'left' },
        { key: 'pointEstimate', label: 'Cohen\'s dz', isNumeric: true, align: 'right' },
        { key: 'interpretation', label: 'Guideline Interpretation', align: 'left' },
      ],
      rows: [
        { pair: 'Pair 1', metric: "Cohen's dz (Mean Diff / SD Diff)", pointEstimate: 0.873, interpretation: 'Large effect size (d > 0.8)' },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-paired-means',
      type: 'bar',
      title: 'Paired Mean Change: Baseline (62.4) vs Follow-up (68.7)',
      categories: ['Baseline Score', 'Follow-up Score'],
      values: [62.4, 68.7],
    },
  ],
};

export const MOCK_ONE_WAY_ANOVA_RESULT: AnalysisResult = {
  id: 'res-anova-oneway-001',
  analysisId: 'ana-012',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'one_way_anova',
  title: 'One-Way ANOVA — income by education level',
  status: 'completed',
  executionTimeMs: 148,
  syntax: `ONEWAY income BY education
  /STATISTICS DESCRIPTIVES HOMOGENEITY WELCH
  /POSTHOC = TUKEY GAMESHOWELL BONFERRONI
  /MISSING = ANALYSIS.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-anova-1',
      severity: 'info',
      message: "Levene's Test for Homogeneity of Variances is significant (p = .008 < .05). Welch ANOVA and Games-Howell post-hoc are recommended.",
    },
  ],
  tables: [
    {
      id: 'tbl-anova-desc',
      title: 'Group Descriptive Statistics (Income by Education Level)',
      columns: [
        { key: 'group', label: 'Education Level', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'mean', label: 'Mean ($)', isNumeric: true, align: 'right' },
        { key: 'stdDev', label: 'Std. Deviation', isNumeric: true, align: 'right' },
        { key: 'stdErr', label: 'Std. Error', isNumeric: true, align: 'right' },
        { key: 'ciLower', label: '95% CI Lower', isNumeric: true, align: 'right' },
        { key: 'ciUpper', label: '95% CI Upper', isNumeric: true, align: 'right' },
        { key: 'min', label: 'Min', isNumeric: true, align: 'right' },
        { key: 'max', label: 'Max', isNumeric: true, align: 'right' },
      ],
      rows: [
        { group: 'Primary (1)', n: 1000, mean: 42150.0, stdDev: 18200.0, stdErr: 575.5, ciLower: 41020.0, ciUpper: 43280.0, min: 12000, max: 98000 },
        { group: 'Secondary (2)', n: 6200, mean: 51200.0, stdDev: 22400.0, stdErr: 284.5, ciLower: 50640.0, ciUpper: 51760.0, min: 14000, max: 145000 },
        { group: 'Higher Sec (3)', n: 3270, mean: 59800.0, stdDev: 26100.0, stdErr: 456.4, ciLower: 58900.0, ciUpper: 60700.0, min: 16000, max: 180000 },
        { group: 'Graduate (4)', n: 8500, mean: 78400.0, stdDev: 32800.0, stdErr: 355.8, ciLower: 77700.0, ciUpper: 79100.0, min: 20000, max: 350000 },
        { group: 'Postgraduate (5)', n: 5100, mean: 92600.0, stdDev: 38500.0, stdErr: 539.1, ciLower: 91540.0, ciUpper: 93660.0, min: 25000, max: 450000 },
        { group: 'Overall Total', n: 24070, mean: 68420.4, stdDev: 32100.8, stdErr: 206.9, ciLower: 68015.0, ciUpper: 68825.8, min: 12000, max: 450000 },
      ],
    },
    {
      id: 'tbl-anova-homogeneity',
      title: 'Test of Homogeneity of Variances (Levene Test)',
      footnotes: ['Based on Mean. Test indicates evidence of unequal group variances (p < .05).'],
      columns: [
        { key: 'variable', label: 'Variable', align: 'left' },
        { key: 'statistic', label: "Levene's Statistic", isNumeric: true, align: 'right' },
        { key: 'df1', label: 'df1', isNumeric: true, align: 'right' },
        { key: 'df2', label: 'df2', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig.', align: 'right' },
      ],
      rows: [
        { variable: 'income', statistic: 3.42, df1: 4, df2: 24065, pValue: '.008' },
      ],
    },
    {
      id: 'tbl-anova-table',
      title: 'One-Way ANOVA Table (Omnibus Test)',
      footnotes: ['SS = Sum of Squares, MS = Mean Square. F(4, 24065) = 52.41, p < .001.'],
      columns: [
        { key: 'source', label: 'Source of Variation', align: 'left' },
        { key: 'ss', label: 'Sum of Squares', isNumeric: true, align: 'right' },
        { key: 'df', label: 'df', isNumeric: true, align: 'right' },
        { key: 'ms', label: 'Mean Square', isNumeric: true, align: 'right' },
        { key: 'f', label: 'F', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig.', align: 'right' },
      ],
      rows: [
        { source: 'Between Groups', ss: 148200000000, df: 4, ms: 37050000000, f: 52.41, pValue: '< .001' },
        { source: 'Within Groups', ss: 2240000000000, df: 24065, ms: 93081238, f: '—', pValue: '—' },
        { source: 'Total', ss: 2388200000000, df: 24069, ms: '—', f: '—', pValue: '—' },
      ],
    },
    {
      id: 'tbl-welch-anova',
      title: 'Robust Tests of Equality of Means (Welch ANOVA)',
      footnotes: ['Asymptotically F distributed. Recommended when variances are unequal.'],
      columns: [
        { key: 'test', label: 'Test', align: 'left' },
        { key: 'statistic', label: 'Welch Statistic (F)', isNumeric: true, align: 'right' },
        { key: 'df1', label: 'df1 (Num)', isNumeric: true, align: 'right' },
        { key: 'df2', label: 'df2 (Denom)', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig.', align: 'right' },
      ],
      rows: [
        { test: 'Welch', statistic: 49.82, df1: 4, df2: 8412.3, pValue: '< .001' },
      ],
    },
    {
      id: 'tbl-posthoc-tukey',
      title: 'Post-Hoc Pairwise Comparisons (Tukey HSD / Games-Howell)',
      footnotes: [
        '*. The mean difference is significant at the 0.05 level.',
        'Adjusted p-values account for familywise error rate.',
      ],
      columns: [
        { key: 'group1', label: '(I) Group', align: 'left' },
        { key: 'group2', label: '(J) Group', align: 'left' },
        { key: 'meanDiff', label: 'Mean Difference (I-J)', isNumeric: true, align: 'right' },
        { key: 'stdErr', label: 'Std. Error', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Adjusted Sig. (p)', align: 'right' },
        { key: 'ciLower', label: '95% CI Lower', isNumeric: true, align: 'right' },
        { key: 'ciUpper', label: '95% CI Upper', isNumeric: true, align: 'right' },
      ],
      rows: [
        { group1: 'Primary', group2: 'Secondary', meanDiff: -9050.0, stdErr: 642.1, pValue: '< .001', ciLower: -10850.0, ciUpper: -7250.0 },
        { group1: 'Primary', group2: 'Higher Sec', meanDiff: -17650.0, stdErr: 734.2, pValue: '< .001', ciLower: -19710.0, ciUpper: -15590.0 },
        { group1: 'Primary', group2: 'Graduate', meanDiff: -36250.0, stdErr: 676.4, pValue: '< .001', ciLower: -38140.0, ciUpper: -34360.0 },
        { group1: 'Primary', group2: 'Postgraduate', meanDiff: -50450.0, stdErr: 788.1, pValue: '< .001', ciLower: -52650.0, ciUpper: -48250.0 },

        { group1: 'Secondary', group2: 'Higher Sec', meanDiff: -8600.0, stdErr: 537.4, pValue: '< .001', ciLower: -10100.0, ciUpper: -7100.0 },
        { group1: 'Secondary', group2: 'Graduate', meanDiff: -27200.0, stdErr: 455.2, pValue: '< .001', ciLower: -28470.0, ciUpper: -25930.0 },
        { group1: 'Secondary', group2: 'Postgraduate', meanDiff: -41400.0, stdErr: 609.8, pValue: '< .001', ciLower: -43105.0, ciUpper: -39695.0 },

        { group1: 'Higher Sec', group2: 'Graduate', meanDiff: -18600.0, stdErr: 578.1, pValue: '< .001', ciLower: -20220.0, ciUpper: -16980.0 },
        { group1: 'Higher Sec', group2: 'Postgraduate', meanDiff: -32800.0, stdErr: 706.5, pValue: '< .001', ciLower: -34775.0, ciUpper: -30825.0 },

        { group1: 'Graduate', group2: 'Postgraduate', meanDiff: -14200.0, stdErr: 645.8, pValue: '< .001', ciLower: -16005.0, ciUpper: -12395.0 },
      ],
    },
    {
      id: 'tbl-anova-effect',
      title: 'ANOVA Effect Sizes (Omnibus Variance Explained)',
      columns: [
        { key: 'metric', label: 'Effect Size Metric', align: 'left' },
        { key: 'pointEstimate', label: 'Point Estimate', isNumeric: true, align: 'right' },
        { key: 'interpretation', label: 'Guideline Interpretation', align: 'left' },
      ],
      rows: [
        { metric: 'Eta Squared (η²)', pointEstimate: 0.062, interpretation: 'Medium effect size (η² ≈ 0.06)' },
        { metric: 'Omega Squared (ω²)', pointEstimate: 0.061, interpretation: 'Medium effect size (ω² ≈ 0.06)' },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-anova-means',
      type: 'bar',
      title: 'Mean Household Income across Education Levels',
      categories: ['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate'],
      values: [42150.0, 51200.0, 59800.0, 78400.0, 92600.0],
    },
  ],
};

export const MOCK_LINEAR_REGRESSION_RESULT: AnalysisResult = {
  id: 'res-regression-linear-001',
  analysisId: 'ana-013',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'linear_regression',
  title: 'Multiple Linear Regression — income on age, experience, education',
  status: 'completed',
  executionTimeMs: 162,
  syntax: `REGRESSION
  /MISSING LISTWISE
  /STATISTICS COEFF OUTS R ANOVA COLLIN TOL DIAG
  /DEPENDENT income
  /METHOD=ENTER age experience education
  /PLOT=SCATTER(*ZRESID,*ZPRED) HISTOGRAM(ZRESID) NORMPROB(ZRESID).`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-reg-1',
      severity: 'info',
      message: 'Listwise deletion applied for missing data. 23,770 complete observations included in the regression model.',
    },
    {
      id: 'w-reg-2',
      severity: 'info',
      message: 'Collinearity diagnostics: All VIF statistics are below 2.0 (No severe multicollinearity detected).',
    },
  ],
  tables: [
    {
      id: 'tbl-regression-summary',
      title: 'Model Fit Summary',
      footnotes: [
        'a. Predictors: (Constant), Age, Experience, Education Years',
        'b. Dependent Variable: Household Income ($)',
      ],
      columns: [
        { key: 'model', label: 'Model', align: 'left' },
        { key: 'r', label: 'R', isNumeric: true, align: 'right' },
        { key: 'rSquared', label: 'R²', isNumeric: true, align: 'right' },
        { key: 'adjustedRSquared', label: 'Adjusted R²', isNumeric: true, align: 'right' },
        { key: 'stdError', label: 'Std. Error of Estimate', isNumeric: true, align: 'right' },
        { key: 'n', label: 'Valid N', isNumeric: true, align: 'right' },
      ],
      rows: [
        { model: '1', r: 0.790, rSquared: 0.624, adjustedRSquared: 0.619, stdError: 19840.2, n: 23770 },
      ],
    },
    {
      id: 'tbl-regression-anova',
      title: 'ANOVA Table (Overall Model Significance Test)',
      footnotes: [
        'a. Dependent Variable: Household Income ($)',
        'b. Predictors: (Constant), Age, Experience, Education Years',
      ],
      columns: [
        { key: 'source', label: 'Source of Variation', align: 'left' },
        { key: 'ss', label: 'Sum of Squares', isNumeric: true, align: 'right' },
        { key: 'df', label: 'df', isNumeric: true, align: 'right' },
        { key: 'ms', label: 'Mean Square', isNumeric: true, align: 'right' },
        { key: 'f', label: 'F', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (p)', align: 'right' },
      ],
      rows: [
        { source: 'Regression', ss: 1482000000000, df: 3, ms: 494000000000, f: 13124.5, pValue: '< .001' },
        { source: 'Residual', ss: 894000000000, df: 23766, ms: 37616763, f: '—', pValue: '—' },
        { source: 'Total', ss: 2376000000000, df: 23769, ms: '—', f: '—', pValue: '—' },
      ],
    },
    {
      id: 'tbl-regression-coefficients',
      title: 'Regression Coefficients & Standardized Betas',
      footnotes: ['a. Dependent Variable: Household Income ($)'],
      columns: [
        { key: 'parameter', label: 'Model Parameter', align: 'left' },
        { key: 'b', label: 'Unstandardized B', isNumeric: true, align: 'right' },
        { key: 'stdErr', label: 'Std. Error', isNumeric: true, align: 'right' },
        { key: 'beta', label: 'Standardized Beta (β)', isNumeric: true, align: 'right' },
        { key: 't', label: 't', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (p)', align: 'right' },
        { key: 'ciLower', label: '95% CI Lower', isNumeric: true, align: 'right' },
        { key: 'ciUpper', label: '95% CI Upper', isNumeric: true, align: 'right' },
      ],
      rows: [
        { parameter: '(Constant)', b: 12410.50, stdErr: 842.10, beta: '—', t: 14.74, pValue: '< .001', ciLower: 10760.0, ciUpper: 14061.0 },
        { parameter: 'Age (years)', b: 420.80, stdErr: 28.40, beta: 0.215, t: 14.82, pValue: '< .001', ciLower: 365.1, ciUpper: 476.5 },
        { parameter: 'Experience (years)', b: 1370.40, stdErr: 62.10, beta: 0.342, t: 22.07, pValue: '< .001', ciLower: 1248.7, ciUpper: 1492.1 },
        { parameter: 'Education (years)', b: 2140.00, stdErr: 95.20, beta: 0.284, t: 22.48, pValue: '< .001', ciLower: 1953.4, ciUpper: 2326.6 },
      ],
    },
    {
      id: 'tbl-regression-collinearity',
      title: 'Collinearity Diagnostics (Tolerance & VIF)',
      footnotes: ['VIF < 5: Low concern; VIF 5–10: Moderate concern; VIF > 10: High concern.'],
      columns: [
        { key: 'variable', label: 'Predictor Variable', align: 'left' },
        { key: 'tolerance', label: 'Tolerance (1/VIF)', isNumeric: true, align: 'right' },
        { key: 'vif', label: 'Variance Inflation Factor (VIF)', isNumeric: true, align: 'right' },
        { key: 'guideline', label: 'Diagnostic Interpretation', align: 'left' },
      ],
      rows: [
        { variable: 'Age', tolerance: 0.824, vif: 1.214, guideline: 'Low collinearity (VIF < 5)' },
        { variable: 'Experience', tolerance: 0.542, vif: 1.845, guideline: 'Low collinearity (VIF < 5)' },
        { variable: 'Education', tolerance: 0.612, vif: 1.634, guideline: 'Low collinearity (VIF < 5)' },
      ],
    },
    {
      id: 'tbl-regression-residuals-stats',
      title: 'Residuals Summary Statistics',
      columns: [
        { key: 'metric', label: 'Metric', align: 'left' },
        { key: 'min', label: 'Minimum', isNumeric: true, align: 'right' },
        { key: 'max', label: 'Maximum', isNumeric: true, align: 'right' },
        { key: 'mean', label: 'Mean', isNumeric: true, align: 'right' },
        { key: 'stdDev', label: 'Std. Deviation', isNumeric: true, align: 'right' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
      ],
      rows: [
        { metric: 'Predicted Value ($)', min: 21400.0, max: 142500.0, mean: 68420.4, stdDev: 24980.2, n: 23770 },
        { metric: 'Residual ($)', min: -54200.0, max: 89200.0, mean: 0.0, stdDev: 19839.8, n: 23770 },
        { metric: 'Std. Predicted Value', min: -1.88, max: 2.97, mean: 0.00, stdDev: 1.00, n: 23770 },
        { metric: 'Std. Residual', min: -2.73, max: 4.49, mean: 0.00, stdDev: 1.00, n: 23770 },
      ],
    },
    {
      id: 'tbl-regression-influence',
      title: 'Outlier & Influence Diagnostics (Potentially Unusual Cases)',
      footnotes: ['Cases with |Std. Residual| > 2.5 or Cook\'s Distance > 4/N. Diagnostic guidelines, not automatic deletions.'],
      columns: [
        { key: 'caseId', label: 'Case ID', align: 'left' },
        { key: 'observed', label: 'Observed Outcome ($)', isNumeric: true, align: 'right' },
        { key: 'predicted', label: 'Predicted ($)', isNumeric: true, align: 'right' },
        { key: 'residual', label: 'Residual ($)', isNumeric: true, align: 'right' },
        { key: 'stdResidual', label: 'Std. Residual', isNumeric: true, align: 'right' },
        { key: 'leverage', label: 'Leverage (h)', isNumeric: true, align: 'right' },
        { key: 'cooksD', label: "Cook's D", isNumeric: true, align: 'right' },
      ],
      rows: [
        { caseId: 'Case #102', observed: 180600.0, predicted: 112400.0, residual: 68200.0, stdResidual: 3.44, leverage: 0.0018, cooksD: 0.0042 },
        { caseId: 'Case #431', observed: 39100.0, predicted: 98500.0, residual: -59400.0, stdResidual: -2.99, leverage: 0.0021, cooksD: 0.0038 },
        { caseId: 'Case #1850', observed: 213400.0, predicted: 135000.0, residual: 78400.0, stdResidual: 3.95, leverage: 0.0035, cooksD: 0.0089 },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-regression-actual-vs-pred',
      type: 'scatter',
      title: 'Actual vs Predicted Household Income',
      categories: ['20k', '40k', '60k', '80k', '100k', '120k', '140k'],
      values: [22000, 41000, 59000, 81000, 99000, 122000, 139000],
    },
  ],
};

export const MOCK_MANN_WHITNEY_RESULT: AnalysisResult = {
  id: 'res-nonpar-mw-001',
  analysisId: 'ana-014',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'mann_whitney',
  title: 'Mann–Whitney U Test — satisfaction by sex (Male vs Female)',
  status: 'completed',
  executionTimeMs: 114,
  syntax: `NPAR TESTS
  /MANN-WHITNEY = satisfaction BY sex(1 2)
  /MISSING ANALYSIS.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-mw-1',
      severity: 'info',
      message: 'Asymptotic normal approximation used with continuity correction. Group sizes N1 = 11,620 and N2 = 11,850.',
    },
  ],
  tables: [
    {
      id: 'tbl-mw-group-ranks',
      title: 'Group Rank Statistics (Satisfaction Rating by Sex)',
      columns: [
        { key: 'group', label: 'Group (Sex)', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'median', label: 'Median Score', isNumeric: true, align: 'right' },
        { key: 'meanRank', label: 'Mean Rank', isNumeric: true, align: 'right' },
        { key: 'sumRanks', label: 'Sum of Ranks', isNumeric: true, align: 'right' },
      ],
      rows: [
        { group: 'Male', n: 11620, median: 4.0, meanRank: 11240.50, sumRanks: 130614610.0 },
        { group: 'Female', n: 11850, median: 4.0, meanRank: 12210.80, sumRanks: 144697980.0 },
        { group: 'Total', n: 23470, median: 4.0, meanRank: '—', sumRanks: '—' },
      ],
    },
    {
      id: 'tbl-mw-test-stats',
      title: 'Mann–Whitney U Test Statistics',
      footnotes: [
        'a. Grouping Variable: Biological Sex (Male vs Female)',
        'b. Asymptotic 2-tailed significance with continuity correction.',
      ],
      columns: [
        { key: 'statistic', label: 'Test Statistic Parameter', align: 'left' },
        { key: 'value', label: 'Value', isNumeric: true, align: 'right' },
      ],
      rows: [
        { statistic: 'Mann–Whitney U', value: 63098510.0 },
        { statistic: 'Wilcoxon W (Rank Sum)', value: 130614610.0 },
        { statistic: 'Standardized Z', value: -12.48 },
        { statistic: 'Asymptotic Sig. (2-tailed p)', value: '< .001' },
      ],
    },
    {
      id: 'tbl-mw-effect-size',
      title: 'Nonparametric Effect Sizes',
      footnotes: [
        'Rank-biserial r_rb = 1 - (2U / (N1*N2)). Correlation r = Z / sqrt(N).',
      ],
      columns: [
        { key: 'metric', label: 'Effect Size Metric', align: 'left' },
        { key: 'pointEstimate', label: 'Point Estimate', isNumeric: true, align: 'right' },
        { key: 'interpretation', label: 'Guideline Interpretation', align: 'left' },
      ],
      rows: [
        { metric: 'Rank-Biserial Correlation (r_rb)', pointEstimate: -0.084, interpretation: 'Small / Negligible effect size' },
        { metric: 'Correlation Effect Size (r = Z / √N)', pointEstimate: -0.081, interpretation: 'Small / Negligible effect size' },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-mw-box',
      type: 'boxplot',
      title: 'Group Rank & Distribution Comparison: Male vs Female',
      categories: ['Male Group', 'Female Group'],
      values: [4.0, 4.0],
    },
  ],
};

export const MOCK_WILCOXON_SIGNED_RANK_RESULT: AnalysisResult = {
  id: 'res-nonpar-wilcoxon-001',
  analysisId: 'ana-015',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'wilcoxon_signed_rank',
  title: 'Wilcoxon Signed-Rank Test — before_score vs after_score',
  status: 'completed',
  executionTimeMs: 108,
  syntax: `NPAR TESTS
  /WILCOXON = before_score WITH after_score (PAIRED)
  /MISSING ANALYSIS.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-wil-1',
      severity: 'info',
      message: '40 zero-difference pairs detected and handled using standard ranking convention. 1,160 non-zero pairs analyzed.',
    },
  ],
  tables: [
    {
      id: 'tbl-wilcoxon-ranks',
      title: 'Paired Signed Ranks Summary',
      footnotes: [
        'a. after_score < before_score (Negative Ranks)',
        'b. after_score > before_score (Positive Ranks)',
        'c. after_score = before_score (Ties / Zero Differences)',
      ],
      columns: [
        { key: 'category', label: 'Rank Category', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'meanRank', label: 'Mean Rank', isNumeric: true, align: 'right' },
        { key: 'sumRanks', label: 'Sum of Ranks', isNumeric: true, align: 'right' },
      ],
      rows: [
        { category: 'Negative Ranks (After < Before)', n: 142, meanRank: 210.40, sumRanks: 29876.80 },
        { category: 'Positive Ranks (After > Before)', n: 1018, meanRank: 628.20, sumRanks: 639507.20 },
        { category: 'Ties (Zero Differences)', n: 40, meanRank: '—', sumRanks: '—' },
        { category: 'Total Matched Pairs', n: 1200, meanRank: '—', sumRanks: '—' },
      ],
    },
    {
      id: 'tbl-wilcoxon-test-stats',
      title: 'Wilcoxon Signed-Rank Test Statistics',
      footnotes: ['Based on negative ranks sum W. Asymptotic 2-tailed significance.'],
      columns: [
        { key: 'statistic', label: 'Test Statistic Parameter', align: 'left' },
        { key: 'value', label: 'Value', isNumeric: true, align: 'right' },
      ],
      rows: [
        { statistic: 'Wilcoxon Signed-Rank W', value: 29876.80 },
        { statistic: 'Standardized Z Statistic', value: -24.82 },
        { statistic: 'Asymptotic Sig. (2-tailed p)', value: '< .001' },
      ],
    },
    {
      id: 'tbl-wilcoxon-effect-size',
      title: 'Matched Pairs Effect Size',
      footnotes: ['Effect size r = Z / sqrt(N). Large effect when r > 0.5.'],
      columns: [
        { key: 'metric', label: 'Effect Size Metric', align: 'left' },
        { key: 'pointEstimate', label: 'Point Estimate', isNumeric: true, align: 'right' },
        { key: 'interpretation', label: 'Guideline Interpretation', align: 'left' },
      ],
      rows: [
        { metric: 'Matched Pairs r (Z / √N)', pointEstimate: -0.716, interpretation: 'Large effect size (r > 0.5)' },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-wilcoxon-paired',
      type: 'boxplot',
      title: 'Paired Score Difference Distribution (Baseline vs Follow-up)',
      categories: ['Baseline (62.4)', 'Follow-up (68.7)'],
      values: [62.4, 68.7],
    },
  ],
};

export const MOCK_KRUSKAL_WALLIS_RESULT: AnalysisResult = {
  id: 'res-nonpar-kw-001',
  analysisId: 'ana-016',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'kruskal_wallis',
  title: 'Kruskal–Wallis H Test — income by education level',
  status: 'completed',
  executionTimeMs: 142,
  syntax: `NPAR TESTS
  /K-W = income BY education(1 5)
  /POSTHOC = DUNN HOLM
  /MISSING ANALYSIS.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-kw-1',
      severity: 'info',
      message: 'Tie correction applied to Kruskal–Wallis H statistic due to identical income observations.',
    },
  ],
  tables: [
    {
      id: 'tbl-kw-group-ranks',
      title: 'Group Rank & Median Summary (Income by Education)',
      columns: [
        { key: 'group', label: 'Education Level', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'median', label: 'Median Income ($)', isNumeric: true, align: 'right' },
        { key: 'meanRank', label: 'Mean Rank', isNumeric: true, align: 'right' },
        { key: 'sumRanks', label: 'Sum of Ranks', isNumeric: true, align: 'right' },
      ],
      rows: [
        { group: 'Primary', n: 1000, median: 42150.0, meanRank: 5240.10, sumRanks: 5240100.0 },
        { group: 'Secondary', n: 6200, median: 51200.0, meanRank: 8420.50, sumRanks: 52207100.0 },
        { group: 'Higher Sec', n: 3270, median: 59800.0, meanRank: 11240.80, sumRanks: 36757416.0 },
        { group: 'Graduate', n: 8500, median: 78400.0, meanRank: 15420.20, sumRanks: 131071700.0 },
        { group: 'Postgraduate', n: 5100, median: 92600.0, meanRank: 19840.60, sumRanks: 101187060.0 },
        { group: 'Overall Total', n: 24070, median: 68420.4, meanRank: '—', sumRanks: '—' },
      ],
    },
    {
      id: 'tbl-kw-test-stats',
      title: 'Kruskal–Wallis Test Statistics (Omnibus Fit)',
      footnotes: [
        'a. Grouping Variable: Education Level (5 Groups)',
        'b. Kruskal–Wallis H is asymptotically Chi-Square distributed.',
      ],
      columns: [
        { key: 'statistic', label: 'Test Statistic Parameter', align: 'left' },
        { key: 'value', label: 'Value', isNumeric: true, align: 'right' },
      ],
      rows: [
        { statistic: 'Kruskal–Wallis H (Chi-Square)', value: 4812.42 },
        { statistic: 'Degrees of Freedom (df)', value: 4 },
        { statistic: 'Asymptotic Sig. (p-value)', value: '< .001' },
      ],
    },
    {
      id: 'tbl-kw-effect-size',
      title: 'Kruskal–Wallis Effect Sizes',
      footnotes: ['Epsilon squared ε² = H / ((N² - 1) / (N + 1)).'],
      columns: [
        { key: 'metric', label: 'Effect Size Metric', align: 'left' },
        { key: 'pointEstimate', label: 'Point Estimate', isNumeric: true, align: 'right' },
        { key: 'interpretation', label: 'Guideline Interpretation', align: 'left' },
      ],
      rows: [
        { metric: 'Epsilon Squared (ε²)', pointEstimate: 0.200, interpretation: 'Large effect size (ε² > 0.14)' },
        { metric: 'Eta Squared H (η²_H)', pointEstimate: 0.199, interpretation: 'Large effect size' },
      ],
    },
    {
      id: 'tbl-dunn-posthoc',
      title: 'Dunn\'s Post-Hoc Pairwise Rank Comparisons',
      footnotes: [
        '*. Significance level: p < .05.',
        'Adjusted p-values control familywise error rate using Holm step-down method.',
      ],
      columns: [
        { key: 'group1', label: '(I) Group', align: 'left' },
        { key: 'group2', label: '(J) Group', align: 'left' },
        { key: 'meanDiff', label: 'Mean Rank Diff (I-J)', isNumeric: true, align: 'right' },
        { key: 'zStat', label: 'Z Statistic', isNumeric: true, align: 'right' },
        { key: 'rawP', label: 'Unadjusted p', align: 'right' },
        { key: 'adjP', label: 'Holm Adjusted p', align: 'right' },
      ],
      rows: [
        { group1: 'Primary', group2: 'Secondary', meanDiff: -3180.4, zStat: -14.28, rawP: '< .001', adjP: '< .001' },
        { group1: 'Primary', group2: 'Higher Sec', meanDiff: -6000.7, zStat: -21.40, rawP: '< .001', adjP: '< .001' },
        { group1: 'Primary', group2: 'Graduate', meanDiff: -10180.1, zStat: -38.12, rawP: '< .001', adjP: '< .001' },
        { group1: 'Primary', group2: 'Postgraduate', meanDiff: -14600.5, zStat: -49.80, rawP: '< .001', adjP: '< .001' },
        { group1: 'Secondary', group2: 'Higher Sec', meanDiff: -2820.3, zStat: -12.40, rawP: '< .001', adjP: '< .001' },
        { group1: 'Graduate', group2: 'Postgraduate', meanDiff: -4420.4, zStat: -18.22, rawP: '< .001', adjP: '< .001' },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-kw-box',
      type: 'boxplot',
      title: 'Income Rank & Distribution Boxplot by Education Level',
      categories: ['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate'],
      values: [42150.0, 51200.0, 59800.0, 78400.0, 92600.0],
    },
  ],
};

export const MOCK_FRIEDMAN_RESULT: AnalysisResult = {
  id: 'res-nonpar-friedman-001',
  analysisId: 'ana-017',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'friedman',
  title: 'Friedman Test — score_t1, score_t2, score_t3',
  status: 'completed',
  executionTimeMs: 122,
  syntax: `NPAR TESTS
  /FRIEDMAN = score_t1 score_t2 score_t3
  /POSTHOC = WILCOXON HOLM
  /MISSING ANALYSIS.`,
  createdAt: new Date().toISOString(),
  warnings: [],
  tables: [
    {
      id: 'tbl-friedman-ranks',
      title: 'Friedman Repeated-Measures Rank Summary',
      columns: [
        { key: 'condition', label: 'Condition / Measurement', align: 'left' },
        { key: 'n', label: 'Valid N', isNumeric: true, align: 'right' },
        { key: 'median', label: 'Median Score', isNumeric: true, align: 'right' },
        { key: 'meanRank', label: 'Mean Rank (1-3)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { condition: 'Condition 1: Baseline (score_t1)', n: 1200, median: 62.40, meanRank: 1.42 },
        { condition: 'Condition 2: Follow-up 1 (score_t2)', n: 1200, median: 68.70, meanRank: 2.18 },
        { condition: 'Condition 3: Follow-up 2 (score_t3)', n: 1200, median: 72.10, meanRank: 2.40 },
      ],
    },
    {
      id: 'tbl-friedman-test-stats',
      title: 'Friedman Test Statistics (Repeated Measures Fit)',
      footnotes: ['a. 3 Repeated Conditions (k = 3), Matched N = 1,200.'],
      columns: [
        { key: 'statistic', label: 'Test Statistic Parameter', align: 'left' },
        { key: 'value', label: 'Value', isNumeric: true, align: 'right' },
      ],
      rows: [
        { statistic: 'Friedman Chi-Square (χ²)', value: 612.48 },
        { statistic: 'Degrees of Freedom (df)', value: 2 },
        { statistic: 'Asymptotic Sig. (p-value)', value: '< .001' },
      ],
    },
    {
      id: 'tbl-friedman-effect-size',
      title: 'Kendall\'s W Concordance Effect Size',
      footnotes: ['Kendall\'s W ranges from 0 (no agreement/effect) to 1 (perfect agreement).'],
      columns: [
        { key: 'metric', label: 'Effect Size Metric', align: 'left' },
        { key: 'pointEstimate', label: 'Point Estimate', isNumeric: true, align: 'right' },
        { key: 'interpretation', label: 'Guideline Interpretation', align: 'left' },
      ],
      rows: [
        { metric: 'Kendall\'s W Concordance', pointEstimate: 0.255, interpretation: 'Moderate agreement / effect size' },
      ],
    },
    {
      id: 'tbl-friedman-posthoc',
      title: 'Pairwise Wilcoxon Signed-Rank Post-Hoc Comparisons',
      footnotes: ['Adjusted p-values control familywise error rate using Holm step-down method.'],
      columns: [
        { key: 'cond1', label: 'Condition 1', align: 'left' },
        { key: 'cond2', label: 'Condition 2', align: 'left' },
        { key: 'wStat', label: 'Wilcoxon W', isNumeric: true, align: 'right' },
        { key: 'zStat', label: 'Z Statistic', isNumeric: true, align: 'right' },
        { key: 'rawP', label: 'Unadjusted p', align: 'right' },
        { key: 'adjP', label: 'Holm Adjusted p', align: 'right' },
      ],
      rows: [
        { cond1: 'Baseline (t1)', cond2: 'Follow-up 1 (t2)', wStat: 1240.0, zStat: -18.42, rawP: '< .001', adjP: '< .001' },
        { cond1: 'Baseline (t1)', cond2: 'Follow-up 2 (t3)', wStat: 840.0, zStat: -22.10, rawP: '< .001', adjP: '< .001' },
        { cond1: 'Follow-up 1 (t2)', cond2: 'Follow-up 2 (t3)', wStat: 3410.0, zStat: -6.12, rawP: '< .001', adjP: '< .001' },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-friedman-connected',
      type: 'boxplot',
      title: 'Repeated Measures Condition Score Progression',
      categories: ['Baseline (t1)', 'Follow-up 1 (t2)', 'Follow-up 2 (t3)'],
      values: [62.4, 68.7, 72.1],
    },
  ],
};

export const MOCK_PCA_RESULT: AnalysisResult = {
  id: 'res-factor-pca-001',
  analysisId: 'ana-018',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'pca',
  title: 'Principal Component Analysis — 18 Employee Survey Items',
  status: 'completed',
  executionTimeMs: 165,
  syntax: `FACTOR
  /VARIABLES q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 q16 q17 q18
  /MISSING LISTWISE
  /ANALYSIS q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 q16 q17 q18
  /PRINT INITIAL EXTRACTION ROTATION KMO BARTLETT
  /FORMAT SORT BLANK(.30)
  /CRITERIA MINEIGEN(1) ITERATE(25)
  /EXTRACTION PC
  /ROTATION VARIMAX
  /SAVE REG(ALL).`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-pca-1',
      severity: 'info',
      message: 'Kaiser criterion (eigenvalue > 1.0) retained 3 principal components explaining 64.22% of total cumulative variance.',
    },
  ],
  tables: [
    {
      id: 'tbl-pca-kmo-bartlett',
      title: 'KMO and Bartlett\'s Test of Sphericity',
      columns: [
        { key: 'metric', label: 'Sampling Adequacy / Sphericity Metric', align: 'left' },
        { key: 'value', label: 'Value / Statistic', align: 'right' },
      ],
      rows: [
        { metric: 'Kaiser–Meyer–Olkin (KMO) Measure of Sampling Adequacy', value: 0.840 },
        { metric: 'Bartlett\'s Test of Sphericity — Approx. Chi-Square (χ²)', value: 1842.60 },
        { metric: 'Bartlett\'s Test — Degrees of Freedom (df)', value: 153 },
        { metric: 'Bartlett\'s Test — Asymptotic Sig. (p-value)', value: '< .001' },
      ],
      footnotes: ['KMO ≥ 0.80 indicates Good sampling adequacy under general guidelines.'],
    },
    {
      id: 'tbl-pca-communalities',
      title: 'PCA Communalities (Total Variance Accounted For)',
      columns: [
        { key: 'variable', label: 'Observed Variable Item', align: 'left' },
        { key: 'initial', label: 'Initial', isNumeric: true, align: 'right' },
        { key: 'extraction', label: 'Extracted (h²)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Q1 Service Promptness', initial: 1.000, extraction: 0.724 },
        { variable: 'Q2 Staff Friendliness', initial: 1.000, extraction: 0.685 },
        { variable: 'Q3 Problem Resolution', initial: 1.000, extraction: 0.741 },
        { variable: 'Q4 Support Knowledge', initial: 1.000, extraction: 0.612 },
        { variable: 'Q5 Communication Clarity', initial: 1.000, extraction: 0.690 },
        { variable: 'Q6 Overall Satisfaction', initial: 1.000, extraction: 0.784 },
        { variable: 'Q7 Recommendation Intent', initial: 1.000, extraction: 0.710 },
        { variable: 'Q8 Service Value', initial: 1.000, extraction: 0.582 },
        { variable: 'Q9 Product Quality', initial: 1.000, extraction: 0.635 },
        { variable: 'Q10 Feature Completeness', initial: 1.000, extraction: 0.595 },
        { variable: 'Q11 Platform Stability', initial: 1.000, extraction: 0.620 },
        { variable: 'Q12 Speed & Response', initial: 1.000, extraction: 0.575 },
        { variable: 'Q13 Billing Transparency', initial: 1.000, extraction: 0.540 },
        { variable: 'Q14 Contract Terms', initial: 1.000, extraction: 0.510 },
        { variable: 'Q15 Onboarding Clarity', initial: 1.000, extraction: 0.640 },
        { variable: 'Q16 Training Resources', initial: 1.000, extraction: 0.610 },
        { variable: 'Q17 Account Management', initial: 1.000, extraction: 0.670 },
        { variable: 'Q18 Technical Support', initial: 1.000, extraction: 0.710 },
      ],
    },
    {
      id: 'tbl-pca-variance-explained',
      title: 'Total Variance Explained (Principal Components)',
      columns: [
        { key: 'component', label: 'Component', align: 'left' },
        { key: 'initEigen', label: 'Initial Eigenvalue', isNumeric: true, align: 'right' },
        { key: 'initPct', label: '% of Variance', isNumeric: true, align: 'right' },
        { key: 'initCum', label: 'Cumulative %', isNumeric: true, align: 'right' },
        { key: 'rotEigen', label: 'Rotated Sums of Squared Loadings', isNumeric: true, align: 'right' },
        { key: 'rotPct', label: 'Rotated % Var', isNumeric: true, align: 'right' },
        { key: 'rotCum', label: 'Rotated Cum %', isNumeric: true, align: 'right' },
      ],
      rows: [
        { component: 'Component 1', initEigen: 6.824, initPct: 37.91, initCum: 37.91, rotEigen: 4.464, rotPct: 24.80, rotCum: 24.80 },
        { component: 'Component 2', initEigen: 2.842, initPct: 15.79, initCum: 53.70, rotEigen: 3.852, rotPct: 21.40, rotCum: 46.20 },
        { component: 'Component 3', initEigen: 1.894, initPct: 10.52, initCum: 64.22, rotEigen: 3.244, rotPct: 18.02, rotCum: 64.22 },
        { component: 'Component 4', initEigen: 0.880, initPct: 4.89, initCum: 69.11, rotEigen: '—', rotPct: '—', rotCum: '—' },
        { component: 'Component 5', initEigen: 0.740, initPct: 4.11, initCum: 73.22, rotEigen: '—', rotPct: '—', rotCum: '—' },
      ],
      footnotes: ['Extraction Method: Principal Component Analysis. Rotation Method: Varimax with Kaiser Normalization.'],
    },
    {
      id: 'tbl-pca-component-matrix',
      title: 'Rotated Component Matrix (Varimax Orthogonal Rotation)',
      columns: [
        { key: 'variable', label: 'Observed Variable Item', align: 'left' },
        { key: 'primaryFactor', label: 'Primary', align: 'center' },
        { key: 'pc1', label: 'PC 1 (Service Quality)', isNumeric: true, align: 'right' },
        { key: 'pc2', label: 'PC 2 (Satisfaction)', isNumeric: true, align: 'right' },
        { key: 'pc3', label: 'PC 3 (Technical Support)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Q1 Service Promptness', primaryFactor: 'PC 1', pc1: 0.812, pc2: 0.142, pc3: 0.110 },
        { variable: 'Q2 Staff Friendliness', primaryFactor: 'PC 1', pc1: 0.794, pc2: 0.181, pc3: 0.124 },
        { variable: 'Q3 Problem Resolution', primaryFactor: 'PC 1', pc1: 0.825, pc2: 0.201, pc3: 0.140 },
        { variable: 'Q4 Support Knowledge', primaryFactor: 'PC 1', pc1: 0.742, pc2: 0.210, pc3: 0.130 },
        { variable: 'Q5 Communication Clarity', primaryFactor: 'PC 1', pc1: 0.780, pc2: 0.190, pc3: 0.115 },
        { variable: 'Q6 Overall Satisfaction', primaryFactor: 'PC 2', pc1: 0.210, pc2: 0.842, pc3: 0.150 },
        { variable: 'Q7 Recommendation Intent', primaryFactor: 'PC 2', pc1: 0.240, pc2: 0.795, pc3: 0.160 },
        { variable: 'Q8 Service Value', primaryFactor: 'PC 2', pc1: 0.180, pc2: 0.714, pc3: 0.190 },
        { variable: 'Q9 Product Quality', primaryFactor: 'PC 2', pc1: 0.220, pc2: 0.745, pc3: 0.140 },
        { variable: 'Q10 Feature Completeness', primaryFactor: 'PC 2', pc1: 0.190, pc2: 0.720, pc3: 0.165 },
        { variable: 'Q11 Platform Stability', primaryFactor: 'PC 3', pc1: 0.130, pc2: 0.180, pc3: 0.755 },
        { variable: 'Q12 Speed & Response', primaryFactor: 'PC 3', pc1: 0.150, pc2: 0.190, pc3: 0.720 },
        { variable: 'Q13 Billing Transparency', primaryFactor: 'PC 2', pc1: 0.140, pc2: 0.680, pc3: 0.170 },
        { variable: 'Q14 Contract Terms', primaryFactor: 'PC 2', pc1: 0.120, pc2: 0.660, pc3: 0.150 },
        { variable: 'Q15 Onboarding Clarity', primaryFactor: 'PC 1', pc1: 0.730, pc2: 0.210, pc3: 0.140 },
        { variable: 'Q16 Training Resources', primaryFactor: 'PC 1', pc1: 0.710, pc2: 0.220, pc3: 0.150 },
        { variable: 'Q17 Account Management', primaryFactor: 'PC 3', pc1: 0.160, pc2: 0.180, pc3: 0.780 },
        { variable: 'Q18 Technical Support', primaryFactor: 'PC 3', pc1: 0.170, pc2: 0.190, pc3: 0.810 },
      ],
      footnotes: ['Loadings below 0.30 suppressed for presentation.'],
    },
    {
      id: 'tbl-pca-factor-scores',
      title: 'Component Score Preview (First 5 Cases)',
      columns: [
        { key: 'caseId', label: 'Observation ID', align: 'left' },
        { key: 'pc1', label: 'PC1_Score', isNumeric: true, align: 'right' },
        { key: 'pc2', label: 'PC2_Score', isNumeric: true, align: 'right' },
        { key: 'pc3', label: 'PC3_Score', isNumeric: true, align: 'right' },
      ],
      rows: [
        { caseId: 'Case #1', pc1: 0.842, pc2: -0.315, pc3: 0.124 },
        { caseId: 'Case #2', pc1: -1.210, pc2: 1.045, pc3: -0.412 },
        { caseId: 'Case #3', pc1: 0.450, pc2: 0.620, pc3: 1.180 },
        { caseId: 'Case #4', pc1: 1.120, pc2: -0.890, pc3: -0.240 },
        { caseId: 'Case #5', pc1: -0.340, pc2: 0.180, pc3: 0.950 },
      ],
      footnotes: ['Scores estimated via OLS Regression method (Mean = 0, Variance = 1).'],
    },
  ],
  charts: [
    {
      id: 'cht-pca-scree',
      type: 'scatter',
      title: 'Scree Plot — Principal Component Eigenvalues',
      categories: ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC6', 'PC7', 'PC8', 'PC9', 'PC10', 'PC11', 'PC12', 'PC13', 'PC14', 'PC15', 'PC16', 'PC17', 'PC18'],
      values: [6.82, 2.84, 1.89, 0.88, 0.74, 0.65, 0.58, 0.52, 0.46, 0.41, 0.38, 0.34, 0.30, 0.27, 0.24, 0.21, 0.18, 0.13],
    },
  ],
};

export const MOCK_EFA_RESULT: AnalysisResult = {
  id: 'res-factor-efa-001',
  analysisId: 'ana-019',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'efa',
  title: 'Exploratory Factor Analysis (PAF / Oblimin) — 18 Employee Survey Items',
  status: 'completed',
  executionTimeMs: 185,
  syntax: `FACTOR
  /VARIABLES q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 q16 q17 q18
  /MISSING LISTWISE
  /ANALYSIS q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 q16 q17 q18
  /PRINT INITIAL EXTRACTION ROTATION KMO BARTLETT REPR
  /FORMAT SORT BLANK(.30)
  /CRITERIA FACTORS(3) ITERATE(25)
  /EXTRACTION PAF
  /ROTATION OBLIMIN
  /SAVE REG(ALL).`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-efa-1',
      severity: 'info',
      message: 'Principal Axis Factoring with Direct Oblimin oblique rotation retained 3 common latent factors accounting for 58.70% of common variance.',
    },
  ],
  tables: [
    {
      id: 'tbl-efa-kmo-bartlett',
      title: 'KMO and Bartlett\'s Test of Sphericity',
      columns: [
        { key: 'metric', label: 'Sampling Adequacy / Sphericity Metric', align: 'left' },
        { key: 'value', label: 'Value / Statistic', align: 'right' },
      ],
      rows: [
        { metric: 'Kaiser–Meyer–Olkin (KMO) Measure of Sampling Adequacy', value: 0.840 },
        { metric: 'Bartlett\'s Test of Sphericity — Approx. Chi-Square (χ²)', value: 1842.60 },
        { metric: 'Bartlett\'s Test — Degrees of Freedom (df)', value: 153 },
        { metric: 'Bartlett\'s Test — Asymptotic Sig. (p-value)', value: '< .001' },
      ],
      footnotes: ['KMO ≥ 0.80 indicates Good sampling adequacy under general guidelines.'],
    },
    {
      id: 'tbl-efa-communalities',
      title: 'EFA Communalities (Shared Common Variance)',
      columns: [
        { key: 'variable', label: 'Observed Variable Item', align: 'left' },
        { key: 'initial', label: 'Initial (R²)', isNumeric: true, align: 'right' },
        { key: 'extraction', label: 'Extracted (h²)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Q1 Service Promptness', initial: 0.680, extraction: 0.642 },
        { variable: 'Q2 Staff Friendliness', initial: 0.650, extraction: 0.610 },
        { variable: 'Q3 Problem Resolution', initial: 0.710, extraction: 0.684 },
        { variable: 'Q4 Support Knowledge', initial: 0.580, extraction: 0.532 },
        { variable: 'Q5 Communication Clarity', initial: 0.640, extraction: 0.605 },
        { variable: 'Q6 Overall Satisfaction', initial: 0.740, extraction: 0.712 },
        { variable: 'Q7 Recommendation Intent', initial: 0.690, extraction: 0.654 },
        { variable: 'Q8 Service Value', initial: 0.520, extraction: 0.490 },
        { variable: 'Q9 Product Quality', initial: 0.610, extraction: 0.580 },
        { variable: 'Q10 Feature Completeness', initial: 0.560, extraction: 0.525 },
        { variable: 'Q11 Platform Stability', initial: 0.590, extraction: 0.560 },
        { variable: 'Q12 Speed & Response', initial: 0.550, extraction: 0.518 },
        { variable: 'Q13 Billing Transparency', initial: 0.480, extraction: 0.445 },
        { variable: 'Q14 Contract Terms', initial: 0.460, extraction: 0.420 },
        { variable: 'Q15 Onboarding Clarity', initial: 0.620, extraction: 0.590 },
        { variable: 'Q16 Training Resources', initial: 0.590, extraction: 0.555 },
        { variable: 'Q17 Account Management', initial: 0.630, extraction: 0.602 },
        { variable: 'Q18 Technical Support', initial: 0.680, extraction: 0.650 },
      ],
      footnotes: ['Initial communalities estimated using squared multiple correlations (SMC).'],
    },
    {
      id: 'tbl-efa-variance-explained',
      title: 'Factor Extraction & Variance Summary',
      columns: [
        { key: 'factor', label: 'Factor', align: 'left' },
        { key: 'initEigen', label: 'Initial Eigenvalue', isNumeric: true, align: 'right' },
        { key: 'initPct', label: '% of Variance', isNumeric: true, align: 'right' },
        { key: 'initCum', label: 'Cumulative %', isNumeric: true, align: 'right' },
        { key: 'pafEigen', label: 'PAF Sums of Squared Loadings', isNumeric: true, align: 'right' },
        { key: 'pafPct', label: 'Factor % Var', isNumeric: true, align: 'right' },
        { key: 'pafCum', label: 'Factor Cum %', isNumeric: true, align: 'right' },
      ],
      rows: [
        { factor: 'Factor 1', initEigen: 6.824, initPct: 37.91, initCum: 37.91, pafEigen: 5.785, pafPct: 32.14, pafCum: 32.14 },
        { factor: 'Factor 2', initEigen: 2.842, initPct: 15.79, initCum: 53.70, pafEigen: 2.732, pafPct: 15.18, pafCum: 47.32 },
        { factor: 'Factor 3', initEigen: 1.894, initPct: 10.52, initCum: 64.22, pafEigen: 2.048, pafPct: 11.38, pafCum: 58.70 },
      ],
      footnotes: ['Extraction Method: Principal Axis Factoring. When factors are correlated, sums of squared loadings cannot be added to obtain a total variance.'],
    },
    {
      id: 'tbl-efa-pattern-matrix',
      title: 'Pattern Matrix (Direct Oblimin Oblique Rotation)',
      columns: [
        { key: 'variable', label: 'Observed Variable Item', align: 'left' },
        { key: 'primaryFactor', label: 'Primary', align: 'center' },
        { key: 'f1', label: 'Factor 1 (Service)', isNumeric: true, align: 'right' },
        { key: 'f2', label: 'Factor 2 (Satisfaction)', isNumeric: true, align: 'right' },
        { key: 'f3', label: 'Factor 3 (Support)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Q1 Service Promptness', primaryFactor: 'Factor 1', f1: 0.785, f2: 0.042, f3: 0.021 },
        { variable: 'Q2 Staff Friendliness', primaryFactor: 'Factor 1', f1: 0.762, f2: 0.081, f3: 0.034 },
        { variable: 'Q3 Problem Resolution', primaryFactor: 'Factor 1', f1: 0.804, f2: 0.095, f3: 0.040 },
        { variable: 'Q4 Support Knowledge', primaryFactor: 'Factor 1', f1: 0.710, f2: 0.110, f3: 0.030 },
        { variable: 'Q5 Communication Clarity', primaryFactor: 'Factor 1', f1: 0.755, f2: 0.090, f3: 0.025 },
        { variable: 'Q6 Overall Satisfaction', primaryFactor: 'Factor 2', f1: 0.080, f2: 0.815, f3: 0.060 },
        { variable: 'Q7 Recommendation Intent', primaryFactor: 'Factor 2', f1: 0.110, f2: 0.772, f3: 0.070 },
        { variable: 'Q8 Service Value', primaryFactor: 'Factor 2', f1: 0.060, f2: 0.685, f3: 0.090 },
        { variable: 'Q9 Product Quality', primaryFactor: 'Factor 2', f1: 0.090, f2: 0.724, f3: 0.050 },
        { variable: 'Q10 Feature Completeness', primaryFactor: 'Factor 2', f1: 0.070, f2: 0.690, f3: 0.075 },
        { variable: 'Q11 Platform Stability', primaryFactor: 'Factor 3', f1: 0.030, f2: 0.080, f3: 0.732 },
        { variable: 'Q12 Speed & Response', primaryFactor: 'Factor 3', f1: 0.050, f2: 0.090, f3: 0.695 },
        { variable: 'Q13 Billing Transparency', primaryFactor: 'Factor 2', f1: 0.040, f2: 0.640, f3: 0.080 },
        { variable: 'Q14 Contract Terms', primaryFactor: 'Factor 2', f1: 0.020, f2: 0.620, f3: 0.060 },
        { variable: 'Q15 Onboarding Clarity', primaryFactor: 'Factor 1', f1: 0.705, f2: 0.120, f3: 0.040 },
        { variable: 'Q16 Training Resources', primaryFactor: 'Factor 1', f1: 0.680, f2: 0.130, f3: 0.050 },
        { variable: 'Q17 Account Management', primaryFactor: 'Factor 3', f1: 0.060, f2: 0.080, f3: 0.758 },
        { variable: 'Q18 Technical Support', primaryFactor: 'Factor 3', f1: 0.070, f2: 0.090, f3: 0.782 },
      ],
      footnotes: ['Pattern matrix represents unique contribution of factor to variable (regression coefficients).'],
    },
    {
      id: 'tbl-efa-structure-matrix',
      title: 'Structure Matrix (Factor-Variable Correlations)',
      columns: [
        { key: 'variable', label: 'Observed Variable Item', align: 'left' },
        { key: 'f1', label: 'Factor 1', isNumeric: true, align: 'right' },
        { key: 'f2', label: 'Factor 2', isNumeric: true, align: 'right' },
        { key: 'f3', label: 'Factor 3', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Q1 Service Promptness', f1: 0.810, f2: 0.372, f3: 0.264 },
        { variable: 'Q2 Staff Friendliness', f1: 0.795, f2: 0.401, f3: 0.270 },
        { variable: 'Q3 Problem Resolution', f1: 0.835, f2: 0.432, f3: 0.289 },
        { variable: 'Q6 Overall Satisfaction', f1: 0.422, f2: 0.840, f3: 0.312 },
        { variable: 'Q7 Recommendation Intent', f1: 0.434, f2: 0.812, f3: 0.318 },
        { variable: 'Q11 Platform Stability', f1: 0.280, f2: 0.320, f3: 0.765 },
        { variable: 'Q18 Technical Support', f1: 0.310, f2: 0.340, f3: 0.812 },
      ],
      footnotes: ['Structure matrix represents zero-order correlations between factors and variables.'],
    },
    {
      id: 'tbl-efa-factor-correlations',
      title: 'Factor Correlation Matrix (Oblique Inter-Factor Correlations)',
      columns: [
        { key: 'factor', label: 'Factor Name', align: 'left' },
        { key: 'f1', label: 'Factor 1', isNumeric: true, align: 'right' },
        { key: 'f2', label: 'Factor 2', isNumeric: true, align: 'right' },
        { key: 'f3', label: 'Factor 3', isNumeric: true, align: 'right' },
      ],
      rows: [
        { factor: 'Factor 1 (Service)', f1: 1.000, f2: 0.420, f3: 0.310 },
        { factor: 'Factor 2 (Satisfaction)', f1: 0.420, f2: 1.000, f3: 0.280 },
        { factor: 'Factor 3 (Support)', f1: 0.310, f2: 0.280, f3: 1.000 },
      ],
      footnotes: ['Inter-factor correlation values > 0.32 confirm suitability of oblique rotation.'],
    },
    {
      id: 'tbl-efa-factor-scores',
      title: 'Factor Score Preview (First 5 Cases)',
      columns: [
        { key: 'caseId', label: 'Observation ID', align: 'left' },
        { key: 'fac1', label: 'FAC1_Score', isNumeric: true, align: 'right' },
        { key: 'fac2', label: 'FAC2_Score', isNumeric: true, align: 'right' },
        { key: 'fac3', label: 'FAC3_Score', isNumeric: true, align: 'right' },
      ],
      rows: [
        { caseId: 'Case #1', fac1: 0.792, fac2: -0.280, fac3: 0.110 },
        { caseId: 'Case #2', fac1: -1.140, fac2: 0.980, fac3: -0.380 },
        { caseId: 'Case #3', fac1: 0.410, fac2: 0.580, fac3: 1.120 },
        { caseId: 'Case #4', fac1: 1.050, fac2: -0.840, fac3: -0.210 },
        { caseId: 'Case #5', fac1: -0.310, fac2: 0.160, fac3: 0.890 },
      ],
      footnotes: ['Scores estimated via Regression method.'],
    },
  ],
  charts: [
    {
      id: 'cht-efa-scree',
      type: 'scatter',
      title: 'Scree Plot — Common Factor Eigenvalues',
      categories: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18'],
      values: [6.82, 2.84, 1.89, 0.88, 0.74, 0.65, 0.58, 0.52, 0.46, 0.41, 0.38, 0.34, 0.30, 0.27, 0.24, 0.21, 0.18, 0.13],
    },
  ],
};

export const MOCK_KMEANS_RESULT: AnalysisResult = {
  id: 'res-cluster-kmeans-001',
  analysisId: 'ana-020',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'kmeans',
  title: 'K-Means Clustering (K=4, K-Means++, Seed=42) — Customer Segmentation',
  status: 'completed',
  executionTimeMs: 145,
  syntax: `QUICK CLUSTER
  Age Income SpendingScore VisitFrequency Satisfaction Tenure
  /CRITERIA=CLUSTER(4) MXITER(100) CONVERGE(0)
  /METHOD=KMEANS
  /PRINT=INITIAL FINAL ANOVA CLUSTER
  /SAVE=CLUSTER.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-km-1',
      severity: 'info',
      message: 'K-Means algorithm converged successfully in 17 iterations using K-Means++ initialization (Random Seed: 42). All 1,842 observations assigned.',
    },
  ],
  tables: [
    {
      id: 'tbl-kmeans-summary',
      title: 'K-Means Clustering Execution Summary',
      columns: [
        { key: 'metric', label: 'Clustering Specification / Parameter', align: 'left' },
        { key: 'value', label: 'Value / Output', align: 'right' },
      ],
      rows: [
        { metric: 'Requested Number of Clusters (K)', value: 4 },
        { metric: 'Initialization Method', value: 'K-Means++' },
        { metric: 'Random Seed (Deterministic)', value: 42 },
        { metric: 'Convergence Status', value: 'Converged (17 iterations)' },
        { metric: 'Within-Cluster Sum of Squares (WCSS / Inertia)', value: 1245.80 },
        { metric: 'Between-Cluster Sum of Squares (BSS)', value: 2180.40 },
        { metric: 'Total Sum of Squares (TSS)', value: 3426.20 },
        { metric: 'BSS / TSS Variance Ratio', value: '63.64%' },
        { metric: 'Overall Average Silhouette Score', value: 0.642 },
      ],
      footnotes: ['Standardization: Z-Score (Mean = 0, SD = 1). Distance Metric: Euclidean.'],
    },
    {
      id: 'tbl-kmeans-sizes',
      title: 'Cluster Size & Distribution',
      columns: [
        { key: 'cluster', label: 'Assigned Cluster', align: 'left' },
        { key: 'label', label: 'Segment Name (Customizable)', align: 'left' },
        { key: 'n', label: 'Observations (N)', isNumeric: true, align: 'right' },
        { key: 'percent', label: 'Percentage (%)', isNumeric: true, align: 'right' },
        { key: 'avgSilhouette', label: 'Mean Silhouette (s_i)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { cluster: 'Cluster 1', label: 'Budget Shoppers', n: 421, percent: 22.86, avgSilhouette: 0.680 },
        { cluster: 'Cluster 2', label: 'Loyal Value Segment', n: 513, percent: 27.85, avgSilhouette: 0.655 },
        { cluster: 'Cluster 3', label: 'High-Spender VIPs', n: 384, percent: 20.85, avgSilhouette: 0.612 },
        { cluster: 'Cluster 4', label: 'Occasional Visitors', n: 524, percent: 28.44, avgSilhouette: 0.628 },
        { cluster: 'Total Sample', label: 'Full Dataset', n: 1842, percent: 100.00, avgSilhouette: 0.642 },
      ],
    },
    {
      id: 'tbl-kmeans-centroids-raw',
      title: 'Final Cluster Centroids (Raw Means)',
      columns: [
        { key: 'variable', label: 'Clustering Variable', align: 'left' },
        { key: 'c1', label: 'Cluster 1 (Budget)', isNumeric: true, align: 'right' },
        { key: 'c2', label: 'Cluster 2 (Loyal)', isNumeric: true, align: 'right' },
        { key: 'c3', label: 'Cluster 3 (High-Spender)', isNumeric: true, align: 'right' },
        { key: 'c4', label: 'Cluster 4 (Occasional)', isNumeric: true, align: 'right' },
        { key: 'overall', label: 'Overall Sample Mean', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Age (Years)', c1: 25.2, c2: 41.3, c3: 56.8, c4: 33.1, overall: 38.6 },
        { variable: 'Income ($)', c1: 42100.0, c2: 71400.0, c3: 94200.0, c4: 55800.0, overall: 65200.0 },
        { variable: 'Spending Score (1-100)', c1: 28.4, c2: 64.2, c3: 88.5, c4: 42.1, overall: 54.8 },
        { variable: 'Visit Frequency (per mo)', c1: 1.8, c2: 6.4, c3: 12.1, c4: 3.2, overall: 5.7 },
        { variable: 'Satisfaction (1-5)', c1: 3.1, c2: 4.4, c3: 4.7, c4: 3.6, overall: 3.9 },
        { variable: 'Tenure (Months)', c1: 14.2, c2: 48.6, c3: 84.1, c4: 26.4, overall: 42.5 },
      ],
    },
    {
      id: 'tbl-kmeans-centroids-std',
      title: 'Final Cluster Centroids (Z-Score Standardized Means)',
      columns: [
        { key: 'variable', label: 'Clustering Variable', align: 'left' },
        { key: 'c1', label: 'Cluster 1', isNumeric: true, align: 'right' },
        { key: 'c2', label: 'Cluster 2', isNumeric: true, align: 'right' },
        { key: 'c3', label: 'Cluster 3', isNumeric: true, align: 'right' },
        { key: 'c4', label: 'Cluster 4', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'Age', c1: -1.08, c2: 0.22, c3: 1.47, c4: -0.44 },
        { variable: 'Income', c1: -0.84, c2: 0.23, c3: 1.06, c4: -0.34 },
        { variable: 'Spending Score', c1: -1.14, c2: 0.41, c3: 1.46, c4: -0.55 },
        { variable: 'Visit Frequency', c1: -0.92, c2: 0.16, c3: 1.51, c4: -0.59 },
        { variable: 'Satisfaction', c1: -0.98, c2: 0.61, c3: 0.98, c4: -0.37 },
        { variable: 'Tenure', c1: -0.95, c2: 0.21, c3: 1.40, c4: -0.54 },
      ],
      footnotes: ['Values represent standard deviations from overall sample mean (Z = 0).'],
    },
    {
      id: 'tbl-kmeans-validation',
      title: 'Cluster Validation Metrics & K Comparison',
      columns: [
        { key: 'k', label: 'Clusters (K)', isNumeric: true, align: 'left' },
        { key: 'wcss', label: 'WCSS (Inertia)', isNumeric: true, align: 'right' },
        { key: 'silhouette', label: 'Avg Silhouette (s_i)', isNumeric: true, align: 'right' },
        { key: 'calinski', label: 'Calinski-Harabasz Index', isNumeric: true, align: 'right' },
        { key: 'davies', label: 'Davies-Bouldin Index', isNumeric: true, align: 'right' },
        { key: 'status', label: 'Candidate Solution', align: 'center' },
      ],
      rows: [
        { k: 2, wcss: 2140.50, silhouette: 0.512, calinski: 980.40, davies: 0.842, status: 'Alternative' },
        { k: 3, wcss: 1610.20, silhouette: 0.584, calinski: 1240.10, davies: 0.695, status: 'Alternative' },
        { k: 4, wcss: 1245.80, silhouette: 0.642, calinski: 1482.50, davies: 0.584, status: 'Selected Solution (Optimal)' },
        { k: 5, wcss: 1040.10, silhouette: 0.605, calinski: 1410.80, davies: 0.630, status: 'Alternative' },
        { k: 6, wcss: 890.40, silhouette: 0.562, calinski: 1350.20, davies: 0.685, status: 'Alternative' },
      ],
      footnotes: ['Higher Silhouette & Calinski-Harabasz indicate better separation. Lower Davies-Bouldin indicates better separation.'],
    },
    {
      id: 'tbl-kmeans-membership',
      title: 'Cluster Membership & Centroid Distance Preview (First 5 Cases)',
      columns: [
        { key: 'caseId', label: 'Observation ID', align: 'left' },
        { key: 'assignedCluster', label: 'Assigned Cluster', align: 'center' },
        { key: 'distance', label: 'Distance to Center', isNumeric: true, align: 'right' },
        { key: 'stdDistance', label: 'Standardized Distance', isNumeric: true, align: 'right' },
      ],
      rows: [
        { caseId: 'Case #10001', assignedCluster: 'Cluster 2', distance: 1.42, stdDistance: 0.85 },
        { caseId: 'Case #10002', assignedCluster: 'Cluster 1', distance: 0.82, stdDistance: 0.49 },
        { caseId: 'Case #10003', assignedCluster: 'Cluster 4', distance: 1.16, stdDistance: 0.70 },
        { caseId: 'Case #10004', assignedCluster: 'Cluster 3', distance: 1.95, stdDistance: 1.18 },
        { caseId: 'Case #10005', assignedCluster: 'Cluster 2', distance: 0.94, stdDistance: 0.56 },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-kmeans-elbow',
      type: 'scatter',
      title: 'Elbow Method — WCSS (Inertia) vs Number of Clusters (K)',
      categories: ['K=2', 'K=3', 'K=4', 'K=5', 'K=6', 'K=7', 'K=8', 'K=9', 'K=10'],
      values: [2140.5, 1610.2, 1245.8, 1040.1, 890.4, 780.2, 700.1, 630.5, 570.2],
    },
  ],
};

export const MOCK_HIERARCHICAL_RESULT: AnalysisResult = {
  id: 'res-cluster-hierarchical-001',
  analysisId: 'ana-021',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'hierarchical',
  title: 'Agglomerative Hierarchical Clustering (Ward / Sq Euclidean) — Customer Segmentation',
  status: 'completed',
  executionTimeMs: 192,
  syntax: `CLUSTER
  /HIERARCHICAL=Age Income SpendingScore VisitFrequency Satisfaction Tenure
  /METHOD WARD
  /MEASURE=SEUCLID
  /PRINT SCHEDULE
  /PLOT DENDROGRAM.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-hc-1',
      severity: 'info',
      message: 'Agglomerative hierarchical clustering completed using Ward\'s minimum variance method and Squared Euclidean distance on 1,842 observations.',
    },
  ],
  tables: [
    {
      id: 'tbl-hier-summary',
      title: 'Hierarchical Clustering Overview',
      columns: [
        { key: 'metric', label: 'Specification Parameter', align: 'left' },
        { key: 'value', label: 'Value / Output', align: 'right' },
      ],
      rows: [
        { metric: 'Agglomerative Linkage Method', value: 'Ward\'s Minimum Variance Method' },
        { metric: 'Distance Metric', value: 'Squared Euclidean Distance' },
        { metric: 'Data Standardization', value: 'Z-Score (Mean = 0, SD = 1)' },
        { metric: 'Selected Cluster Cut (K)', value: 4 },
        { metric: 'Valid Sample Size (N)', value: 1842 },
        { metric: 'Average Silhouette Score at K=4', value: 0.628 },
        { metric: 'Calinski-Harabasz Index', value: 1410.20 },
        { metric: 'Davies-Bouldin Index', value: 0.612 },
      ],
    },
    {
      id: 'tbl-hier-agglomeration',
      title: 'Agglomeration Schedule (First 8 Merge Stages)',
      columns: [
        { key: 'stage', label: 'Stage', isNumeric: true, align: 'left' },
        { key: 'c1', label: 'Cluster Combined 1', align: 'left' },
        { key: 'c2', label: 'Cluster Combined 2', align: 'left' },
        { key: 'coef', label: 'Merge Coefficients (Distance)', isNumeric: true, align: 'right' },
        { key: 'nextStage', label: 'Next Stage', isNumeric: true, align: 'right' },
      ],
      rows: [
        { stage: 1, c1: 'Obs #102', c2: 'Obs #480', coef: 0.012, nextStage: 14 },
        { stage: 2, c1: 'Obs #54', c2: 'Obs #891', coef: 0.018, nextStage: 22 },
        { stage: 3, c1: 'Obs #312', c2: 'Obs #614', coef: 0.024, nextStage: 18 },
        { stage: 4, c1: 'Obs #14', c2: 'Obs #982', coef: 0.031, nextStage: 25 },
        { stage: 5, c1: 'Obs #720', c2: 'Obs #1140', coef: 0.039, nextStage: 30 },
        { stage: 6, c1: 'Obs #412', c2: 'Obs #815', coef: 0.048, nextStage: 33 },
        { stage: 7, c1: 'Obs #95', c2: 'Obs #512', coef: 0.057, nextStage: 38 },
        { stage: 8, c1: 'Obs #620', c2: 'Obs #1240', coef: 0.068, nextStage: 42 },
      ],
      footnotes: ['Agglomeration schedule shows step-by-step hierarchical cluster merging.'],
    },
    {
      id: 'tbl-hier-cluster-sizes',
      title: 'Hierarchical Cluster Membership at K=4 Cut',
      columns: [
        { key: 'cluster', label: 'Cluster Branch', align: 'left' },
        { key: 'n', label: 'Observations (N)', isNumeric: true, align: 'right' },
        { key: 'percent', label: 'Percentage (%)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { cluster: 'Cluster Branch 1', n: 415, percent: 22.53 },
        { cluster: 'Cluster Branch 2', n: 520, percent: 28.23 },
        { cluster: 'Cluster Branch 3', n: 390, percent: 21.17 },
        { cluster: 'Cluster Branch 4', n: 517, percent: 28.07 },
        { cluster: 'Total Sample', n: 1842, percent: 100.00 },
      ],
    },
  ],
  charts: [
    {
      id: 'cht-hier-dendrogram',
      type: 'scatter',
      title: 'Hierarchical Clustering Dendrogram Tree',
      categories: ['Node 1', 'Node 2', 'Node 3', 'Node 4'],
      values: [0.012, 0.048, 0.125, 0.380],
    },
  ],
};

export const MOCK_DISCRIMINANT_RESULT: AnalysisResult = {
  id: 'res-discrim-001',
  analysisId: 'ana-015',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'discriminant',
  title: 'Discriminant Analysis (LDA) — Target Segment Prediction',
  status: 'completed',
  executionTimeMs: 245,
  syntax: `DISCRIMINANT
  /GROUPS=target_segment(1 3)
  /VARIABLES=income age spending_score loyalty_score
  /SELECT=ALL
  /STATISTICS=MEAN STDDEV UNIVF BOXM EIGEN RAW STAN GIS CORR TABLE
  /METHOD=DIRECT
  /PRIORS=EQUAL
  /CLASSIFY=NONMISSING POOLED.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-discrim-1',
      severity: 'info',
      message: "Box's M test (M = 18.45, p = .052) indicates equality of covariance matrices across target groups (p > .05). Pooled within-groups covariance matrix is appropriate.",
    },
    {
      id: 'w-discrim-2',
      severity: 'info',
      message: 'Canonical Function 1 accounts for 84.6% of the variance (Wilks\' Lambda = 0.327, p < .001). Overall classification accuracy is 87.4% (86.2% cross-validated).',
    },
  ],
  tables: [
    {
      id: 'tbl-discrim-summary',
      title: 'Analysis Case Processing Summary',
      columns: [
        { key: 'status', label: 'Case Processing Status', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'percent', label: 'Percent (%)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { status: 'Valid Cases Included in Analysis', n: 1250, percent: 96.15 },
        { status: 'Excluded (Missing or Out-of-Range Group Code)', n: 50, percent: 3.85 },
        { status: 'Total Cases Analyzed', n: 1300, percent: 100.00 },
      ],
    },
    {
      id: 'tbl-discrim-group-stats',
      title: 'Group Statistics',
      columns: [
        { key: 'group', label: 'Target Group Segment', align: 'left' },
        { key: 'variable', label: 'Predictor Variable', align: 'left' },
        { key: 'mean', label: 'Mean', isNumeric: true, align: 'right' },
        { key: 'stdDev', label: 'Std. Deviation', isNumeric: true, align: 'right' },
        { key: 'nValid', label: 'Valid N (Unweighted)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { group: 'Segment A (Budget)', variable: 'income', mean: 38450.2, stdDev: 8210.4, nValid: 410 },
        { group: 'Segment A (Budget)', variable: 'age', mean: 29.4, stdDev: 5.8, nValid: 410 },
        { group: 'Segment A (Budget)', variable: 'spending_score', mean: 34.2, stdDev: 11.2, nValid: 410 },
        { group: 'Segment A (Budget)', variable: 'loyalty_score', mean: 42.1, stdDev: 14.5, nValid: 410 },
        { group: 'Segment B (Standard)', variable: 'income', mean: 68200.8, stdDev: 12400.1, nValid: 440 },
        { group: 'Segment B (Standard)', variable: 'age', mean: 41.2, stdDev: 8.4, nValid: 440 },
        { group: 'Segment B (Standard)', variable: 'spending_score', mean: 58.6, stdDev: 12.8, nValid: 440 },
        { group: 'Segment B (Standard)', variable: 'loyalty_score', mean: 65.4, stdDev: 15.2, nValid: 440 },
        { group: 'Segment C (Premium)', variable: 'income', mean: 115400.5, stdDev: 22100.3, nValid: 400 },
        { group: 'Segment C (Premium)', variable: 'age', mean: 48.6, stdDev: 9.2, nValid: 400 },
        { group: 'Segment C (Premium)', variable: 'spending_score', mean: 88.4, stdDev: 9.8, nValid: 400 },
        { group: 'Segment C (Premium)', variable: 'loyalty_score', mean: 89.2, stdDev: 10.1, nValid: 400 },
        { group: 'Total Sample', variable: 'income', mean: 73540.0, stdDev: 34120.0, nValid: 1250 },
        { group: 'Total Sample', variable: 'age', mean: 39.7, stdDev: 11.2, nValid: 1250 },
        { group: 'Total Sample', variable: 'spending_score', mean: 60.1, stdDev: 24.8, nValid: 1250 },
        { group: 'Total Sample', variable: 'loyalty_score', mean: 65.4, stdDev: 23.1, nValid: 1250 },
      ],
    },
    {
      id: 'tbl-discrim-equality-tests',
      title: 'Tests of Equality of Group Means',
      columns: [
        { key: 'variable', label: 'Predictor Variable', align: 'left' },
        { key: 'wilksLambda', label: "Wilks' Lambda", isNumeric: true, align: 'right' },
        { key: 'f', label: 'F Statistic', isNumeric: true, align: 'right' },
        { key: 'df1', label: 'df1', isNumeric: true, align: 'right' },
        { key: 'df2', label: 'df2', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (p-value)', align: 'right' },
      ],
      rows: [
        { variable: 'income', wilksLambda: 0.442, f: 789.21, df1: 2, df2: 1247, pValue: '< .001' },
        { variable: 'spending_score', wilksLambda: 0.518, f: 580.45, df1: 2, df2: 1247, pValue: '< .001' },
        { variable: 'age', wilksLambda: 0.684, f: 288.12, df1: 2, df2: 1247, pValue: '< .001' },
        { variable: 'loyalty_score', wilksLambda: 0.562, f: 486.30, df1: 2, df2: 1247, pValue: '< .001' },
      ],
      footnotes: ['Tests univariate equality of group means for each predictor across target segments.'],
    },
    {
      id: 'tbl-discrim-box-m',
      title: 'Box\'s M Test of Equality of Covariance Matrices',
      columns: [
        { key: 'statistic', label: 'Diagnostic Parameter', align: 'left' },
        { key: 'value', label: 'Value', isNumeric: true, align: 'right' },
      ],
      rows: [
        { statistic: 'Box\'s M', value: 18.45 },
        { statistic: 'F Approx.', value: 1.84 },
        { statistic: 'df1', value: 10 },
        { statistic: 'df2', value: 2450810.0 },
        { statistic: 'Sig. (p-value)', value: 0.052 },
      ],
      footnotes: ['Null hypothesis: Pooled within-groups covariance matrices are equal across groups (p > .05 supports homoscedasticity).'],
    },
    {
      id: 'tbl-discrim-eigenvalues',
      title: 'Eigenvalues and Canonical Correlations',
      columns: [
        { key: 'function', label: 'Function', align: 'left' },
        { key: 'eigenvalue', label: 'Eigenvalue', isNumeric: true, align: 'right' },
        { key: 'pctVar', label: '% of Variance', isNumeric: true, align: 'right' },
        { key: 'cumPct', label: 'Cumulative %', isNumeric: true, align: 'right' },
        { key: 'canonicalCorr', label: 'Canonical Correlation (R_c)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { function: 'Function 1', eigenvalue: 1.428, pctVar: 84.6, cumPct: 84.6, canonicalCorr: 0.767 },
        { function: 'Function 2', eigenvalue: 0.260, pctVar: 15.4, cumPct: 100.0, canonicalCorr: 0.454 },
      ],
      footnotes: ['First 2 canonical discriminant functions were used in the analysis.'],
    },
    {
      id: 'tbl-discrim-wilks-lambda',
      title: 'Wilks\' Lambda Significance Tests',
      columns: [
        { key: 'testFunc', label: 'Test of Function(s)', align: 'left' },
        { key: 'wilksLambda', label: 'Wilks\' Lambda', isNumeric: true, align: 'right' },
        { key: 'chiSquare', label: 'Chi-square', isNumeric: true, align: 'right' },
        { key: 'df', label: 'df', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (p-value)', align: 'right' },
      ],
      rows: [
        { testFunc: '1 through 2', wilksLambda: 0.327, f: 0, chiSquare: 1392.4, df: 8, pValue: '< .001' },
        { testFunc: '2', wilksLambda: 0.793, f: 0, chiSquare: 288.5, df: 3, pValue: '< .001' },
      ],
      footnotes: ['Evaluates the statistical significance of sequential canonical discriminant functions.'],
    },
    {
      id: 'tbl-discrim-std-coeff',
      title: 'Standardized Canonical Discriminant Function Coefficients',
      columns: [
        { key: 'variable', label: 'Predictor Variable', align: 'left' },
        { key: 'func1', label: 'Function 1', isNumeric: true, align: 'right' },
        { key: 'func2', label: 'Function 2', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'income', func1: 0.684, func2: -0.215 },
        { variable: 'spending_score', func1: 0.412, func2: 0.845 },
        { variable: 'age', func1: 0.315, func2: -0.410 },
        { variable: 'loyalty_score', func1: 0.528, func2: 0.182 },
      ],
    },
    {
      id: 'tbl-discrim-structure-matrix',
      title: 'Structure Matrix (Pooled Within-Groups Correlations)',
      columns: [
        { key: 'variable', label: 'Predictor Variable', align: 'left' },
        { key: 'func1', label: 'Function 1', isNumeric: true, align: 'right' },
        { key: 'func2', label: 'Function 2', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'income', func1: 0.792, func2: -0.180 },
        { variable: 'loyalty_score', func1: 0.621, func2: 0.120 },
        { variable: 'spending_score', func1: 0.540, func2: 0.812 },
        { variable: 'age', func1: 0.485, func2: -0.560 },
      ],
      footnotes: ['Pooled within-groups correlations between discriminating variables and standardized canonical discriminant functions. Variables ordered by absolute size of correlation within function.'],
    },
    {
      id: 'tbl-discrim-unstd-coeff',
      title: 'Canonical Discriminant Function Coefficients (Unstandardized)',
      columns: [
        { key: 'variable', label: 'Predictor Variable', align: 'left' },
        { key: 'func1', label: 'Function 1', isNumeric: true, align: 'right' },
        { key: 'func2', label: 'Function 2', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'income', func1: 0.000042, func2: -0.000013 },
        { variable: 'spending_score', func1: 0.0354, func2: 0.0726 },
        { variable: 'age', func1: 0.0398, func2: -0.0518 },
        { variable: 'loyalty_score', func1: 0.0387, func2: 0.0134 },
        { variable: '(Constant)', func1: -7.824, func2: -1.240 },
      ],
      footnotes: ['Unstandardized coefficients are used to calculate discriminant scores for individual cases.'],
    },
    {
      id: 'tbl-discrim-centroids',
      title: 'Functions at Group Centroids',
      columns: [
        { key: 'group', label: 'Target Group Segment', align: 'left' },
        { key: 'func1', label: 'Function 1', isNumeric: true, align: 'right' },
        { key: 'func2', label: 'Function 2', isNumeric: true, align: 'right' },
      ],
      rows: [
        { group: 'Segment A (Budget)', func1: -1.452, func2: 0.185 },
        { group: 'Segment B (Standard)', func1: 0.112, func2: -0.528 },
        { group: 'Segment C (Premium)', func1: 1.364, func2: 0.380 },
      ],
      footnotes: ['Unstandardized canonical discriminant functions evaluated at group means (centroids).'],
    },
    {
      id: 'tbl-discrim-fisher-funcs',
      title: 'Fisher\'s Linear Discriminant Functions (Classification Coefficients)',
      columns: [
        { key: 'variable', label: 'Predictor Variable', align: 'left' },
        { key: 'groupA', label: 'Segment A (Budget)', isNumeric: true, align: 'right' },
        { key: 'groupB', label: 'Segment B (Standard)', isNumeric: true, align: 'right' },
        { key: 'groupC', label: 'Segment C (Premium)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'income', groupA: 0.00038, groupB: 0.00062, groupC: 0.00098 },
        { variable: 'spending_score', groupA: 0.124, groupB: 0.285, groupC: 0.492 },
        { variable: 'age', groupA: 0.412, groupB: 0.584, groupC: 0.690 },
        { variable: 'loyalty_score', groupA: 0.210, groupB: 0.380, groupC: 0.540 },
        { variable: '(Constant)', groupA: -18.42, groupB: -38.60, groupC: -78.10 },
      ],
      footnotes: ['Fisher\'s linear classification functions assign a case to the group with the highest classification score.'],
    },
    {
      id: 'tbl-discrim-classification',
      title: 'Classification Results (Original & Leave-One-Out Cross-Validated)',
      columns: [
        { key: 'sampleType', label: 'Sample Type', align: 'left' },
        { key: 'actualGroup', label: 'Actual Target Group', align: 'left' },
        { key: 'predA', label: 'Pred. A (Budget)', isNumeric: true, align: 'right' },
        { key: 'predB', label: 'Pred. B (Standard)', isNumeric: true, align: 'right' },
        { key: 'predC', label: 'Pred. C (Premium)', isNumeric: true, align: 'right' },
        { key: 'total', label: 'Total N', isNumeric: true, align: 'right' },
      ],
      rows: [
        { sampleType: 'Original Count', actualGroup: 'Segment A (Budget)', predA: 372, predB: 34, predC: 4, total: 410 },
        { sampleType: 'Original Count', actualGroup: 'Segment B (Standard)', predB: 388, predA: 28, predC: 24, total: 440 },
        { sampleType: 'Original Count', actualGroup: 'Segment C (Premium)', predC: 368, predA: 2, predB: 30, total: 400 },
        { sampleType: 'Original %', actualGroup: 'Segment A (Budget)', predA: 90.7, predB: 8.3, predC: 1.0, total: 100.0 },
        { sampleType: 'Original %', actualGroup: 'Segment B (Standard)', predB: 88.2, predA: 6.4, predC: 5.5, total: 100.0 },
        { sampleType: 'Original %', actualGroup: 'Segment C (Premium)', predC: 92.0, predA: 0.5, predB: 7.5, total: 100.0 },
        { sampleType: 'Cross-Validated Count', actualGroup: 'Segment A (Budget)', predA: 368, predB: 38, predC: 4, total: 410 },
        { sampleType: 'Cross-Validated Count', actualGroup: 'Segment B (Standard)', predB: 382, predA: 32, predC: 26, total: 440 },
        { sampleType: 'Cross-Validated Count', actualGroup: 'Segment C (Premium)', predC: 362, predA: 4, predB: 34, total: 400 },
        { sampleType: 'Cross-Validated %', actualGroup: 'Segment A (Budget)', predA: 89.8, predB: 9.3, predC: 1.0, total: 100.0 },
        { sampleType: 'Cross-Validated %', actualGroup: 'Segment B (Standard)', predB: 86.8, predA: 7.3, predC: 5.9, total: 100.0 },
        { sampleType: 'Cross-Validated %', actualGroup: 'Segment C (Premium)', predC: 90.5, predA: 1.0, predB: 8.5, total: 100.0 },
      ],
      footnotes: [
        '87.4% of original grouped cases correctly classified.',
        '86.2% of cross-validated grouped cases correctly classified (Leave-one-out classification).',
      ],
    },
  ],
  charts: [
    {
      id: 'cht-discrim-scatter',
      type: 'scatter',
      title: 'Canonical Discriminant Functions Scatter Plot (Function 1 vs Function 2)',
      categories: ['Segment A (Budget)', 'Segment B (Standard)', 'Segment C (Premium)'],
      values: [1.428, 0.260],
    },
  ],
};

export const MOCK_LOGISTIC_REGRESSION_RESULT: AnalysisResult = {
  id: 'res-logit-001',
  analysisId: 'ana-016',
  datasetId: 'ds-001',
  datasetVersion: 3,
  procedure: 'logistic_regression',
  title: 'Binary Logistic Regression — Default Status Prediction',
  status: 'completed',
  executionTimeMs: 185,
  syntax: `LOGISTIC REGRESSION VARIABLES default_status
  /METHOD=ENTER income age spending_score loyalty_score sex
  /CONTRAST(sex)=Indicator(1)
  /CLASSCUT(0.50)
  /PRINT=CI(95) GOODFIT ITER(20)
  /CRITERIA=PIN(.05) POUT(.10) ITERATE(20)
  /SAVE=PRED PROB.`,
  createdAt: new Date().toISOString(),
  warnings: [
    {
      id: 'w-logit-1',
      severity: 'info',
      message: 'Model converged after 6 iterations. Nagelkerke R² = 0.452, Area Under ROC Curve (AUC) = 0.884.',
    },
    {
      id: 'w-logit-2',
      severity: 'info',
      message: 'Hosmer-Lemeshow Goodness-of-Fit test (χ² = 7.42, p = .491) indicates adequate model fit (p > .05).',
    },
  ],
  tables: [
    {
      id: 'tbl-logit-summary',
      title: 'Analysis Case Processing Summary',
      columns: [
        { key: 'status', label: 'Unweighted Cases', align: 'left' },
        { key: 'n', label: 'N', isNumeric: true, align: 'right' },
        { key: 'percent', label: 'Percent (%)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { status: 'Selected Cases Included in Analysis', n: 1250, percent: 96.15 },
        { status: 'Missing / Excluded Cases', n: 50, percent: 3.85 },
        { status: 'Total Sample Size', n: 1300, percent: 100.00 },
      ],
    },
    {
      id: 'tbl-logit-encoding',
      title: 'Dependent Variable Encoding',
      columns: [
        { key: 'original', label: 'Original Value (Target Outcome)', align: 'left' },
        { key: 'internal', label: 'Internal Parameter Value', isNumeric: true, align: 'right' },
      ],
      rows: [
        { original: 'No (Non-Default)', internal: 0 },
        { original: 'Yes (Default)', internal: 1 },
      ],
    },
    {
      id: 'tbl-logit-model-summary',
      title: 'Model Summary & Goodness of Fit',
      columns: [
        { key: 'step', label: 'Step', isNumeric: true, align: 'left' },
        { key: 'neg2LL', label: '-2 Log Likelihood', isNumeric: true, align: 'right' },
        { key: 'coxSnell', label: 'Cox & Snell R²', isNumeric: true, align: 'right' },
        { key: 'nagelkerke', label: 'Nagelkerke R²', isNumeric: true, align: 'right' },
        { key: 'mcfadden', label: 'McFadden R²', isNumeric: true, align: 'right' },
        { key: 'aic', label: 'AIC', isNumeric: true, align: 'right' },
        { key: 'bic', label: 'BIC', isNumeric: true, align: 'right' },
      ],
      rows: [
        { step: 1, neg2LL: 842.15, coxSnell: 0.338, nagelkerke: 0.452, mcfadden: 0.286, aic: 852.15, bic: 877.80 },
      ],
      footnotes: ['Estimation terminated at iteration number 6 because log-likelihood changed by less than .00001.'],
    },
    {
      id: 'tbl-logit-omnibus',
      title: 'Omnibus Tests of Model Coefficients',
      columns: [
        { key: 'level', label: 'Model Test', align: 'left' },
        { key: 'chiSquare', label: 'Chi-square (χ²)', isNumeric: true, align: 'right' },
        { key: 'df', label: 'df', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (p-value)', align: 'right' },
      ],
      rows: [
        { level: 'Step 1 (Overall Model)', chiSquare: 341.80, df: 4, pValue: '< .001' },
        { level: 'Block 1', chiSquare: 341.80, df: 4, pValue: '< .001' },
        { level: 'Model Improvement vs Null', chiSquare: 341.80, df: 4, pValue: '< .001' },
      ],
    },
    {
      id: 'tbl-logit-hosmer',
      title: 'Hosmer and Lemeshow Test',
      columns: [
        { key: 'step', label: 'Step', isNumeric: true, align: 'left' },
        { key: 'chiSquare', label: 'Chi-square (χ²)', isNumeric: true, align: 'right' },
        { key: 'df', label: 'df', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (p-value)', align: 'right' },
      ],
      rows: [
        { step: 1, chiSquare: 7.42, df: 8, pValue: 0.491 },
      ],
      footnotes: ['p > .05 indicates that model predictions do not significantly differ from observed frequencies.'],
    },
    {
      id: 'tbl-logit-variables-in-equation',
      title: 'Variables in the Equation',
      columns: [
        { key: 'variable', label: 'Predictor Variable', align: 'left' },
        { key: 'b', label: 'B (Coef)', isNumeric: true, align: 'right' },
        { key: 'se', label: 'Std. Error', isNumeric: true, align: 'right' },
        { key: 'wald', label: 'Wald χ²', isNumeric: true, align: 'right' },
        { key: 'df', label: 'df', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (p-value)', align: 'right' },
        { key: 'expB', label: 'Exp(B) [Odds Ratio]', isNumeric: true, align: 'right' },
        { key: 'ciLower', label: '95% CI Lower', isNumeric: true, align: 'right' },
        { key: 'ciUpper', label: '95% CI Upper', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'income', b: -0.000042, se: 0.000008, wald: 27.56, df: 1, pValue: '< .001', expB: 0.999958, ciLower: 0.999942, ciUpper: 0.999974 },
        { variable: 'age', b: 0.0418, se: 0.0109, wald: 14.70, df: 1, pValue: '< .001', expB: 1.0427, ciLower: 1.0206, ciUpper: 1.0653 },
        { variable: 'spending_score', b: -0.0354, se: 0.0062, wald: 32.60, df: 1, pValue: '< .001', expB: 0.9652, ciLower: 0.9536, ciUpper: 0.9770 },
        { variable: 'loyalty_score', b: -0.0284, se: 0.0058, wald: 23.97, df: 1, pValue: '< .001', expB: 0.9720, ciLower: 0.9610, ciUpper: 0.9831 },
        { variable: 'Constant', b: 2.1480, se: 0.4850, wald: 19.62, df: 1, pValue: '< .001', expB: 8.5677, ciLower: 0, ciUpper: 0 },
      ],
      footnotes: ['Variable(s) entered on step 1: income, age, spending_score, loyalty_score.'],
    },
    {
      id: 'tbl-logit-classification',
      title: 'Classification Table (Cutoff c = 0.50)',
      columns: [
        { key: 'observed', label: 'Observed Outcome', align: 'left' },
        { key: 'pred0', label: 'Predicted No (0)', isNumeric: true, align: 'right' },
        { key: 'pred1', label: 'Predicted Yes (1)', isNumeric: true, align: 'right' },
        { key: 'pctCorrect', label: 'Percentage Correct (%)', isNumeric: true, align: 'right' },
      ],
      rows: [
        { observed: 'No (0)', pred0: 821, pred1: 72, pctCorrect: 91.94 },
        { observed: 'Yes (1)', pred1: 298, pred0: 59, pctCorrect: 83.47 },
        { observed: 'Overall Percentage', pred0: 0, pred1: 0, pctCorrect: 89.52 },
      ],
      footnotes: ['The cut value is .500.'],
    },
    {
      id: 'tbl-logit-roc-coords',
      title: 'ROC Curve Coordinates & Performance Benchmarks',
      columns: [
        { key: 'cutoff', label: 'Cutoff Threshold', isNumeric: true, align: 'left' },
        { key: 'sens', label: 'Sensitivity (TPR)', isNumeric: true, align: 'right' },
        { key: 'spec', label: 'Specificity (TNR)', isNumeric: true, align: 'right' },
        { key: 'youden', label: 'Youden\'s J Index', isNumeric: true, align: 'right' },
        { key: 'ppv', label: 'PPV (Precision)', isNumeric: true, align: 'right' },
        { key: 'npv', label: 'NPV', isNumeric: true, align: 'right' },
      ],
      rows: [
        { cutoff: 0.10, sens: 0.985, spec: 0.542, youden: 0.527, ppv: 0.442, npv: 0.992 },
        { cutoff: 0.30, sens: 0.912, spec: 0.814, youden: 0.726, ppv: 0.678, npv: 0.958 },
        { cutoff: 0.50, sens: 0.835, spec: 0.919, youden: 0.754, ppv: 0.805, npv: 0.933 },
        { cutoff: 0.70, sens: 0.684, spec: 0.965, youden: 0.649, ppv: 0.885, npv: 0.884 },
      ],
      footnotes: ['Optimal threshold by Youden\'s J index is c = 0.485.'],
    },
    {
      id: 'tbl-logit-marginal-effects',
      title: 'Average Marginal Effects (AME)',
      columns: [
        { key: 'variable', label: 'Predictor Variable', align: 'left' },
        { key: 'ame', label: 'AME (dPr/dX)', isNumeric: true, align: 'right' },
        { key: 'stdErr', label: 'Std. Error', isNumeric: true, align: 'right' },
        { key: 'zStat', label: 'z', isNumeric: true, align: 'right' },
        { key: 'pValue', label: 'Sig. (p-value)', align: 'right' },
        { key: 'ciLower', label: '95% CI Lower', isNumeric: true, align: 'right' },
        { key: 'ciUpper', label: '95% CI Upper', isNumeric: true, align: 'right' },
      ],
      rows: [
        { variable: 'income ($10k)', ame: -0.0054, stdErr: 0.0011, zStat: -4.91, pValue: '< .001', ciLower: -0.0076, ciUpper: -0.0032 },
        { variable: 'age (years)', ame: 0.0058, stdErr: 0.0015, zStat: 3.87, pValue: '< .001', ciLower: 0.0029, ciUpper: 0.0087 },
        { variable: 'spending_score', ame: -0.0049, stdErr: 0.0009, zStat: -5.44, pValue: '< .001', ciLower: -0.0067, ciUpper: -0.0031 },
        { variable: 'loyalty_score', ame: -0.0039, stdErr: 0.0008, zStat: -4.88, pValue: '< .001', ciLower: -0.0055, ciUpper: -0.0023 },
      ],
      footnotes: ['Marginal effects represent the change in predicted outcome probability per 1-unit increase in the predictor.'],
    },
  ],
  charts: [
    {
      id: 'cht-logit-roc',
      type: 'bar',
      title: 'Receiver Operating Characteristic (ROC) Curve (AUC = 0.884)',
      categories: ['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'],
      values: [0.0, 0.72, 0.84, 0.89, 0.93, 0.96, 0.98, 0.99, 1.0],
    },
  ],
};







