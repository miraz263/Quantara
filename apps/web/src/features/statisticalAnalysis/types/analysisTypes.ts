export type ProcedureType =
  | 'descriptives'
  | 'frequencies'
  | 'explore'
  | 'crosstabs'
  | 'pearson'
  | 'spearman'
  | 'kendall'
  | 'partial_correlation'
  | 'one_sample_ttest'
  | 'independent_ttest'
  | 'paired_ttest'
  | 'one_way_anova'
  | 'linear_regression'
  | 'mann_whitney'
  | 'wilcoxon_signed_rank'
  | 'kruskal_wallis'
  | 'friedman'
  | 'pca'
  | 'efa'
  | 'kmeans'
  | 'hierarchical'
  | 'discriminant'
  | 'logistic_regression';

export interface VariableItem {
  name: string;
  label?: string;
  dataType: 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'datetime';
  measure: 'nominal' | 'ordinal' | 'scale';
}

export interface AnalysisRequest {
  id: string;
  datasetId: string;
  datasetVersion: number;
  procedure: ProcedureType;
  title: string;
  variables: string[];
  groupingVariables?: string[];
  options: {
    // Central Tendency
    mean?: boolean;
    median?: boolean;
    mode?: boolean;

    // Dispersion
    stdDev?: boolean;
    variance?: boolean;
    range?: boolean;
    minimum?: boolean;
    maximum?: boolean;

    // Position & Distribution
    quartiles?: boolean;
    percentiles?: number[];
    skewness?: boolean;
    kurtosis?: boolean;

    // Precision & Confidence
    decimals?: number;
    confidenceInterval?: number;

    // Frequencies specific
    displayFrequencyTable?: boolean;
    chartType?: 'bar' | 'pie' | 'histogram' | 'none';
    sortByFrequency?: boolean;

    // Crosstabs specific
    rowVariables?: string[];
    columnVariables?: string[];
    showCounts?: boolean;
    showRowPercents?: boolean;
    showColPercents?: boolean;
    showTotalPercents?: boolean;
    showTotals?: boolean;

    // Correlation specific (Module 06)
    correlationMethod?: 'pearson' | 'spearman' | 'kendall';
    missingStrategy?: 'pairwise' | 'listwise';
    significanceType?: 'two_tailed' | 'one_tailed';
    confidenceLevel?: number;
    triangle?: 'full' | 'lower' | 'upper';
    showAPA?: boolean;
    controlVariables?: string[];
    showScatterPlot?: boolean;
    showHeatmap?: boolean;

    // t-Test specific (Module 07)
    testType?: 'one_sample' | 'independent' | 'paired';
    testValue?: number;
    groupingVariable?: string;
    group1?: string | number;
    group2?: string | number;
    pairedVariables?: Array<{ variable1: string; variable2: string }>;
    tail?: 'two_sided' | 'less' | 'greater';
    equalVariance?: 'assumed' | 'not_assumed' | 'both';
    effectSize?: boolean;
    assumptionChecks?: boolean;

    // ANOVA specific (Module 08)
    dependentVariable?: string;
    factorVariable?: string;
    includedGroups?: string[];
    welchAnova?: boolean;
    anovaMethod?: 'standard' | 'welch' | 'both';
    postHocMethod?: 'none' | 'tukey' | 'games_howell' | 'bonferroni' | 'holm' | 'tukey_gameshowell';
    alpha?: number;
    effectSizes?: boolean;
    homogeneityTest?: boolean;
    normalityDiagnostics?: boolean;

    // Regression specific (Module 09)
    predictors?: string[];
    includeIntercept?: boolean;
    entryMethod?: 'enter';
    collinearityDiagnostics?: boolean;
    residualDiagnostics?: boolean;
    influenceDiagnostics?: boolean;
    saveDiagnostics?: boolean;
    showPlots?: boolean;
    residualVsPredictedPlot?: boolean;
    actualVsPredictedPlot?: boolean;
    histogramResiduals?: boolean;
    qqPlotResiduals?: boolean;

    // Nonparametric specific (Module 10)
    nonparametricType?: 'mann_whitney' | 'wilcoxon_signed_rank' | 'kruskal_wallis' | 'friedman';
    pValueMethod?: 'automatic' | 'exact' | 'asymptotic';
    continuityCorrection?: boolean;
    zeroDifferenceHandling?: 'wilcox' | 'pratt' | 'zsplit';
    postHocAdjustment?: 'none' | 'bonferroni' | 'holm';
    dunnPostHoc?: boolean;
    pairwiseWilcoxonPostHoc?: boolean;
    pairwiseWilcoxon?: boolean;
    kendallsW?: boolean;
    relatedConditions?: string[];

    // Factor Analysis & Dimension Reduction (Module 11)
    extractionMethod?: 'pca' | 'principal_axis' | 'maximum_likelihood';
    standardizeVariables?: boolean;
    retentionMethod?: 'fixed' | 'eigenvalue_gt_1' | 'scree' | 'parallel_analysis';
    numberOfFactors?: number;
    rotationMethod?: 'none' | 'varimax' | 'quartimax' | 'equamax' | 'oblimin' | 'promax';
    factorScoresEnabled?: boolean;
    factorScoresMethod?: 'regression' | 'bartlett' | 'anderson_rubin';
    kmoDiagnostic?: boolean;
    bartlettDiagnostic?: boolean;
    antiImageDiagnostic?: boolean;
    loadingThreshold?: number;
    suppressSmallLoadings?: boolean;
    sortLoadingsByPrimary?: boolean;

    // Cluster Analysis (Module 13)
    clusterProcedure?: 'kmeans' | 'hierarchical' | 'agglomerative';
    standardizationMethod?: 'none' | 'zscore' | 'minmax' | 'robust';
    distanceMetric?: 'euclidean' | 'squared_euclidean' | 'manhattan' | 'minkowski' | 'cosine';
    linkageMethod?: 'single' | 'complete' | 'average' | 'ward';
    numberOfClusters?: number;
    minClusters?: number;
    maxClusters?: number;
    initializationMethod?: 'kmeans_plus_plus' | 'random';
    randomSeed?: number;
    maxIterations?: number;
    convergenceTolerance?: number;
    missingMethod?: 'listwise' | 'impute' | 'available_case';
    silhouetteAnalysis?: boolean;
    elbowMethod?: boolean;
    calinskiHarabasz?: boolean;
    daviesBouldin?: boolean;
    saveClusterVariable?: boolean;
    clusterVariableName?: string;

    // Discriminant Analysis (Module 14)
    discriminantProcedure?: 'linear_discriminant' | 'multiple_discriminant';
    predictorVariables?: string[];
    priorMethod?: 'equal' | 'proportional' | 'custom';
    customPriors?: Record<string, number>;
    validation?: 'none' | 'cross_validation' | 'leave_one_out';
    classificationProbabilityThreshold?: number;
    saveClassification?: boolean;
    savePredictedGroup?: boolean;
    savePosteriorProbabilities?: boolean;
    saveDiscriminantScores?: boolean;
    savePredictedGroupVariable?: string;
    saveDiscriminantScorePrefix?: string;
    boxMTest?: boolean;
    unstandardizedCoefficients?: boolean;
    standardizedCoefficients?: boolean;
    structureMatrix?: boolean;
    fisherClassificationFunctions?: boolean;
    caseLevelClassification?: boolean;
    casewisePosteriorProbabilities?: boolean;
    groupCentroids?: boolean;

    // Logistic Regression Family (Module 15)
    logisticProcedure?: 'binary' | 'multinomial' | 'ordinal';
    categoricalPredictors?: Array<{ variable: string; codingMethod: 'indicator' | 'effect' | 'helmert' | 'polynomial'; referenceCategory: string }>;
    referenceCategories?: Record<string, string>;
    codingMethod?: 'indicator' | 'effect' | 'helmert' | 'polynomial';
    classificationCutoff?: number;
    includeOddsRatios?: boolean;
    includeConfidenceIntervals?: boolean;
    includeROC?: boolean;
    includeCalibration?: boolean;
    includeMarginalEffects?: boolean;
    includeVIF?: boolean;
    includeInfluence?: boolean;
    savePredictions?: boolean;
    saveProbabilities?: boolean;
    saveResiduals?: boolean;
  };
  createdAt: string;
}

export interface CorrelationCell {
  var1: string;
  var2: string;
  coefficient: number;
  pValue: number;
  n: number;
  ciLower?: number;
  ciUpper?: number;
  df?: number;
  significanceStar: string;
}

export interface CorrelationMatrixData {
  variables: string[];
  cells: Record<string, Record<string, CorrelationCell>>;
  method: 'pearson' | 'spearman' | 'kendall' | 'partial';
  controlVariables?: string[];
  missingStrategy: 'pairwise' | 'listwise';
  significanceType: 'two_tailed' | 'one_tailed';
}

export interface ResultColumn {
  key: string;
  label: string;
  isNumeric?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface ResultRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ResultTableData {
  id: string;
  title: string;
  columns: ResultColumn[];
  rows: ResultRow[];
  footnotes?: string[];
}

export interface ResultChartData {
  id: string;
  type: 'histogram' | 'bar' | 'pie' | 'boxplot' | 'scatter';
  title: string;
  categories?: string[];
  values?: number[];
  extraConfig?: Record<string, any>;
}

export interface AnalysisWarning {
  id: string;
  severity: 'info' | 'warning';
  message: string;
}

export interface AnalysisResult {
  id: string;
  analysisId: string;
  datasetId: string;
  datasetVersion: number;
  procedure: ProcedureType;
  title: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  executionTimeMs?: number;

  tables: ResultTableData[];
  charts: ResultChartData[];
  warnings: AnalysisWarning[];
  syntax: string;

  createdAt: string;
}
