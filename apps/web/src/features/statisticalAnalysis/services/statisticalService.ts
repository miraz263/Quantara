import { AnalysisRequest, AnalysisResult, VariableItem } from '../types/analysisTypes';
import {
  MOCK_AVAILABLE_VARIABLES,
  MOCK_DESCRIPTIVES_RESULT,
  MOCK_FREQUENCIES_RESULT,
  MOCK_CROSSTABS_RESULT,
  MOCK_EXPLORE_RESULT,
  MOCK_PEARSON_RESULT,
  MOCK_SPEARMAN_RESULT,
  MOCK_KENDALL_RESULT,
  MOCK_PARTIAL_RESULT,
  MOCK_ONE_SAMPLE_TTEST_RESULT,
  MOCK_INDEPENDENT_TTEST_RESULT,
  MOCK_PAIRED_TTEST_RESULT,
  MOCK_ONE_WAY_ANOVA_RESULT,
  MOCK_LINEAR_REGRESSION_RESULT,
  MOCK_MANN_WHITNEY_RESULT,
  MOCK_WILCOXON_SIGNED_RANK_RESULT,
  MOCK_KRUSKAL_WALLIS_RESULT,
  MOCK_FRIEDMAN_RESULT,
  MOCK_PCA_RESULT,
  MOCK_EFA_RESULT,
  MOCK_KMEANS_RESULT,
  MOCK_HIERARCHICAL_RESULT,
  MOCK_DISCRIMINANT_RESULT,
  MOCK_LOGISTIC_REGRESSION_RESULT,
} from '../mocks/mockAnalysisData';

let savedAnalysesStore: AnalysisResult[] = [
  { ...MOCK_DESCRIPTIVES_RESULT },
  { ...MOCK_FREQUENCIES_RESULT },
  { ...MOCK_CROSSTABS_RESULT },
  { ...MOCK_EXPLORE_RESULT },
  { ...MOCK_PEARSON_RESULT },
  { ...MOCK_SPEARMAN_RESULT },
  { ...MOCK_KENDALL_RESULT },
  { ...MOCK_PARTIAL_RESULT },
  { ...MOCK_ONE_SAMPLE_TTEST_RESULT },
  { ...MOCK_INDEPENDENT_TTEST_RESULT },
  { ...MOCK_PAIRED_TTEST_RESULT },
  { ...MOCK_ONE_WAY_ANOVA_RESULT },
  { ...MOCK_LINEAR_REGRESSION_RESULT },
  { ...MOCK_MANN_WHITNEY_RESULT },
  { ...MOCK_WILCOXON_SIGNED_RANK_RESULT },
  { ...MOCK_KRUSKAL_WALLIS_RESULT },
  { ...MOCK_FRIEDMAN_RESULT },
  { ...MOCK_PCA_RESULT },
  { ...MOCK_EFA_RESULT },
  { ...MOCK_KMEANS_RESULT },
  { ...MOCK_HIERARCHICAL_RESULT },
  { ...MOCK_DISCRIMINANT_RESULT },
  { ...MOCK_LOGISTIC_REGRESSION_RESULT },
];

export class StatisticalService {
  static async getAvailableVariables(datasetId?: string): Promise<VariableItem[]> {
    await new Promise((res) => setTimeout(res, 20));
    return [...MOCK_AVAILABLE_VARIABLES];
  }

  static async runAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
    // Simulate deterministic engine processing queue -> running -> completed
    await new Promise((res) => setTimeout(res, 150));

    let baseResult: AnalysisResult;

    switch (request.procedure) {
      case 'frequencies':
        baseResult = { ...MOCK_FREQUENCIES_RESULT };
        break;
      case 'crosstabs':
        baseResult = { ...MOCK_CROSSTABS_RESULT };
        break;
      case 'explore':
        baseResult = { ...MOCK_EXPLORE_RESULT };
        break;
      case 'pearson':
        baseResult = { ...MOCK_PEARSON_RESULT };
        break;
      case 'spearman':
        baseResult = { ...MOCK_SPEARMAN_RESULT };
        break;
      case 'kendall':
        baseResult = { ...MOCK_KENDALL_RESULT };
        break;
      case 'partial_correlation':
        baseResult = { ...MOCK_PARTIAL_RESULT };
        break;
      case 'one_sample_ttest':
        baseResult = { ...MOCK_ONE_SAMPLE_TTEST_RESULT };
        break;
      case 'independent_ttest':
        baseResult = { ...MOCK_INDEPENDENT_TTEST_RESULT };
        break;
      case 'paired_ttest':
        baseResult = { ...MOCK_PAIRED_TTEST_RESULT };
        break;
      case 'one_way_anova':
        baseResult = { ...MOCK_ONE_WAY_ANOVA_RESULT };
        break;
      case 'linear_regression':
        baseResult = { ...MOCK_LINEAR_REGRESSION_RESULT };
        break;
      case 'mann_whitney':
        baseResult = { ...MOCK_MANN_WHITNEY_RESULT };
        break;
      case 'wilcoxon_signed_rank':
        baseResult = { ...MOCK_WILCOXON_SIGNED_RANK_RESULT };
        break;
      case 'kruskal_wallis':
        baseResult = { ...MOCK_KRUSKAL_WALLIS_RESULT };
        break;
      case 'friedman':
        baseResult = { ...MOCK_FRIEDMAN_RESULT };
        break;
      case 'pca':
        baseResult = { ...MOCK_PCA_RESULT };
        break;
      case 'efa':
        baseResult = { ...MOCK_EFA_RESULT };
        break;
      case 'kmeans':
        baseResult = { ...MOCK_KMEANS_RESULT };
        break;
      case 'hierarchical':
        baseResult = { ...MOCK_HIERARCHICAL_RESULT };
        break;
      case 'discriminant':
        baseResult = { ...MOCK_DISCRIMINANT_RESULT };
        break;
      case 'logistic_regression':
        baseResult = { ...MOCK_LOGISTIC_REGRESSION_RESULT };
        break;
      case 'descriptives':
      default:
        baseResult = { ...MOCK_DESCRIPTIVES_RESULT };
        break;
    }

    const now = new Date().toISOString();

    // Dynamically update syntax if variables provided
    let dynamicSyntax = baseResult.syntax;
    if (request.variables && request.variables.length > 0) {
      if (request.procedure === 'pearson') {
        dynamicSyntax = `CORRELATIONS\n  /VARIABLES = ${request.variables.join(' ')}\n  /PRINT = ${(request.options.significanceType || 'two_tailed').toUpperCase() === 'ONE_TAILED' ? 'ONETAIL' : 'TWOTAIL'} NOSIG\n  /MISSING = ${(request.options.missingStrategy || 'pairwise').toUpperCase()}\n  /CI LEVEL = ${request.options.confidenceLevel || 95}.`;
      } else if (request.procedure === 'spearman') {
        dynamicSyntax = `NONPAR CORR\n  /VARIABLES = ${request.variables.join(' ')}\n  /PRINT = SPEARMAN ${(request.options.significanceType || 'two_tailed').toUpperCase() === 'ONE_TAILED' ? 'ONETAIL' : 'TWOTAIL'}.`;
      } else if (request.procedure === 'kendall') {
        dynamicSyntax = `NONPAR CORR\n  /VARIABLES = ${request.variables.join(' ')}\n  /PRINT = KENDALL ${(request.options.significanceType || 'two_tailed').toUpperCase() === 'ONE_TAILED' ? 'ONETAIL' : 'TWOTAIL'}.`;
      } else if (request.procedure === 'partial_correlation') {
        const controls = request.options.controlVariables || ['age'];
        dynamicSyntax = `PARTIAL CORR\n  /VARIABLES = ${request.variables.join(' ')} BY ${controls.join(' ')}\n  /SIGNIFICANCE = ${(request.options.significanceType || 'two_tailed').toUpperCase() === 'ONE_TAILED' ? 'ONETAIL' : 'TWOTAIL'}.`;
      } else if (request.procedure === 'one_sample_ttest') {
        const val = request.options.testValue !== undefined ? request.options.testValue : 0;
        dynamicSyntax = `T-TEST\n  /TESTVAL=${val}\n  /MISSING=ANALYSIS\n  /VARIABLES=${request.variables.join(' ')}\n  /CRITERIA=CI(${ (request.options.confidenceInterval || 95) / 100 }).`;
      } else if (request.procedure === 'independent_ttest') {
        const grpVar = request.options.groupingVariable || 'sex';
        const g1 = request.options.group1 ?? 1;
        const g2 = request.options.group2 ?? 2;
        dynamicSyntax = `T-TEST GROUPS=${grpVar}(${g1} ${g2})\n  /MISSING=ANALYSIS\n  /VARIABLES=${request.variables.join(' ')}\n  /CRITERIA=CI(${ (request.options.confidenceInterval || 95) / 100 }).`;
      } else if (request.procedure === 'paired_ttest') {
        const pairs = request.options.pairedVariables || [{ variable1: 'before_score', variable2: 'after_score' }];
        const pairStr = pairs.map((p) => `${p.variable1} WITH ${p.variable2} (PAIRED)`).join('\n  ');
        dynamicSyntax = `T-TEST PAIRS=${pairStr}\n  /CRITERIA=CI(${ (request.options.confidenceInterval || 95) / 100 })\n  /MISSING=ANALYSIS.`;
      } else if (request.procedure === 'one_way_anova') {
        const factor = request.options.factorVariable || 'education';
        const postHoc = (request.options.postHocMethod || 'tukey').toUpperCase().replace(/_/g, ' ');
        dynamicSyntax = `ONEWAY ${request.variables.join(' ')} BY ${factor}\n  /STATISTICS DESCRIPTIVES HOMOGENEITY WELCH\n  /POSTHOC = ${postHoc}\n  /MISSING = ANALYSIS.`;
      } else if (request.procedure === 'linear_regression') {
        const depVar = request.options.dependentVariable || request.variables[0] || 'income';
        const preds = request.options.predictors && request.options.predictors.length > 0 ? request.options.predictors : request.variables.filter((v) => v !== depVar);
        const intercept = request.options.includeIntercept === false ? '\n  /NOORIGIN' : '';
        dynamicSyntax = `REGRESSION\n  /MISSING LISTWISE\n  /STATISTICS COEFF OUTS R ANOVA COLLIN TOL DIAG\n  /DEPENDENT ${depVar}\n  /METHOD=ENTER ${preds.join(' ')}${intercept}\n  /PLOT=SCATTER(*ZRESID,*ZPRED) HISTOGRAM(ZRESID) NORMPROB(ZRESID).`;
      } else if (request.procedure === 'mann_whitney') {
        const grp = request.options.groupingVariable || 'sex';
        dynamicSyntax = `NPAR TESTS\n  /MANN-WHITNEY = ${request.variables.join(' ')} BY ${grp}(1 2)\n  /MISSING ANALYSIS.`;
      } else if (request.procedure === 'wilcoxon_signed_rank') {
        const pairs = request.options.pairedVariables || [{ variable1: 'before_score', variable2: 'after_score' }];
        const pairStr = pairs.map((p) => `${p.variable1} WITH ${p.variable2} (PAIRED)`).join('\n  ');
        dynamicSyntax = `NPAR TESTS\n  /WILCOXON = ${pairStr}\n  /MISSING ANALYSIS.`;
      } else if (request.procedure === 'kruskal_wallis') {
        const factor = request.options.factorVariable || 'education';
        const adj = (request.options.postHocAdjustment || 'holm').toUpperCase();
        dynamicSyntax = `NPAR TESTS\n  /K-W = ${request.variables.join(' ')} BY ${factor}(1 5)\n  /POSTHOC = DUNN ${adj}\n  /MISSING ANALYSIS.`;
      } else if (request.procedure === 'friedman') {
        const conds = request.options.relatedConditions || request.variables;
        const adj = (request.options.postHocAdjustment || 'holm').toUpperCase();
        dynamicSyntax = `NPAR TESTS\n  /FRIEDMAN = ${conds.join(' ')}\n  /POSTHOC = WILCOXON ${adj}\n  /MISSING ANALYSIS.`;
      } else if (request.procedure === 'pca') {
        const rot = (request.options.rotationMethod || 'varimax').toUpperCase();
        const thresh = request.options.loadingThreshold || 0.30;
        dynamicSyntax = `FACTOR\n  /VARIABLES ${request.variables.join(' ')}\n  /MISSING LISTWISE\n  /ANALYSIS ${request.variables.join(' ')}\n  /PRINT INITIAL EXTRACTION ROTATION KMO BARTLETT\n  /FORMAT SORT BLANK(${thresh.toFixed(2)})\n  /CRITERIA MINEIGEN(1) ITERATE(25)\n  /EXTRACTION PC\n  /ROTATION ${rot}\n  /SAVE REG(ALL).`;
      } else if (request.procedure === 'efa') {
        const ext = request.options.extractionMethod === 'maximum_likelihood' ? 'ML' : 'PAF';
        const rot = (request.options.rotationMethod || 'oblimin').toUpperCase();
        const numFacs = request.options.numberOfFactors || 3;
        const thresh = request.options.loadingThreshold || 0.30;
        dynamicSyntax = `FACTOR\n  /VARIABLES ${request.variables.join(' ')}\n  /MISSING LISTWISE\n  /ANALYSIS ${request.variables.join(' ')}\n  /PRINT INITIAL EXTRACTION ROTATION KMO BARTLETT REPR\n  /FORMAT SORT BLANK(${thresh.toFixed(2)})\n  /CRITERIA FACTORS(${numFacs}) ITERATE(25)\n  /EXTRACTION ${ext}\n  /ROTATION ${rot}\n  /SAVE REG(ALL).`;
      } else if (request.procedure === 'kmeans') {
        const k = request.options.numberOfClusters || 4;
        const seed = request.options.randomSeed || 42;
        const init = (request.options.initializationMethod || 'kmeans_plus_plus').toUpperCase();
        dynamicSyntax = `QUICK CLUSTER ${request.variables.join(' ')}\n  /MISSING=LISTWISE\n  /CRITERIA=CLUSTERS(${k}) MXITER(100) CONVERGE(0.0001)\n  /METHOD=${init}\n  /SEED=${seed}\n  /PRINT INITIAL CLUSTER DISTAN ANOVA\n  /SAVE CLUSTER(cluster_membership) DISTANCE(distance_to_centroid).`;
      } else if (request.procedure === 'hierarchical') {
        const k = request.options.numberOfClusters || 4;
        const method = (request.options.linkageMethod || 'ward').toUpperCase();
        const dist = request.options.distanceMetric === 'squared_euclidean' ? 'SEUCLID' : 'EUCLID';
        dynamicSyntax = `CLUSTER ${request.variables.join(' ')}\n  /METHOD ${method}\n  /MEASURE ${dist}\n  /PRINT SCHEDULE CLUSTER(${k})\n  /PLOT DENDROGRAM VICINIT\n  /SAVE CLUSTERS(${k}).`;
      } else if (request.procedure === 'discriminant') {
        const grp = request.options.groupingVariable || 'target_segment';
        const priors = (request.options.priorMethod || 'equal').toUpperCase();
        const val = request.options.validation === 'leave_one_out' ? ' /CLASSIFY=CROSSVALID' : '';
        const boxm = request.options.boxMTest ? ' BOXM' : '';
        dynamicSyntax = `DISCRIMINANT\n  /GROUPS=${grp}(1 3)\n  /VARIABLES=${request.variables.join(' ')}\n  /SELECT=ALL\n  /STATISTICS=MEAN STDDEV UNIVF${boxm} EIGEN RAW STAN GIS CORR TABLE\n  /METHOD=DIRECT\n  /PRIORS=${priors}${val}\n  /CLASSIFY=NONMISSING POOLED.`;
      } else if (request.procedure === 'logistic_regression') {
        const depVar = request.options.dependentVariable || request.variables[0] || 'default_status';
        const preds = request.options.predictorVariables || request.variables.filter((v) => v !== depVar);
        const cutoff = request.options.classificationCutoff || 0.50;
        dynamicSyntax = `LOGISTIC REGRESSION VARIABLES ${depVar}\n  /METHOD=ENTER ${preds.join(' ')}\n  /CLASSCUT(${cutoff.toFixed(2)})\n  /PRINT=CI(95) GOODFIT ITER(20)\n  /CRITERIA=PIN(.05) POUT(.10) ITERATE(20)\n  /SAVE=PRED PROB.`;
      }
    }

    const newResult: AnalysisResult = {
      ...baseResult,
      id: `res-${Date.now()}`,
      analysisId: request.id || `ana-${Date.now()}`,
      datasetId: request.datasetId || 'ds-001',
      datasetVersion: request.datasetVersion || 3,
      procedure: request.procedure,
      title: request.title || `${request.procedure.toUpperCase()} — ${request.variables.join(', ')}`,
      syntax: dynamicSyntax,
      createdAt: now,
      executionTimeMs: 125,
    };

    savedAnalysesStore = [newResult, ...savedAnalysesStore];
    return { ...newResult };
  }

  static async getAnalysisResult(analysisId: string): Promise<AnalysisResult | null> {
    await new Promise((res) => setTimeout(res, 30));
    const found = savedAnalysesStore.find((a) => a.id === analysisId || a.analysisId === analysisId);
    return found ? { ...found } : null;
  }

  static async listAnalyses(datasetId?: string): Promise<AnalysisResult[]> {
    await new Promise((res) => setTimeout(res, 30));
    return [...savedAnalysesStore];
  }

  static async deleteAnalysis(analysisId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 30));
    savedAnalysesStore = savedAnalysesStore.filter((a) => a.id !== analysisId && a.analysisId !== analysisId);
    return true;
  }

  static async duplicateAnalysis(analysisId: string): Promise<AnalysisResult> {
    const target = await this.getAnalysisResult(analysisId);
    if (!target) throw new Error(`Analysis ${analysisId} not found.`);

    const now = new Date().toISOString();
    const copy: AnalysisResult = {
      ...target,
      id: `res-${Date.now()}`,
      analysisId: `ana-${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: now,
    };

    savedAnalysesStore = [copy, ...savedAnalysesStore];
    return { ...copy };
  }
}
