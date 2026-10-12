import React, { useState, useMemo } from 'react';
import { AnalysisResult } from '../types/analysisTypes';
import { StatisticalTable } from '../components/StatisticalTable';
import { ResultOutlineTree, OutlineItem } from '../components/ResultOutlineTree';
import { DistributionChart } from '../../dataProfiling/components/DistributionChart';
import { SyntaxViewer } from '../components/SyntaxViewer';
import { CodeGenModal } from '../components/CodeGenModal';
import { PublicationView } from '../components/PublicationView';
import { CorrelationHeatmap } from '../components/CorrelationHeatmap';
import { ScatterTrendPlot } from '../components/ScatterTrendPlot';
import { MeanComparisonChart } from '../components/MeanComparisonChart';
import { PairedPlotChart } from '../components/PairedPlotChart';
import { AssumptionDiagnostics } from '../components/AssumptionDiagnostics';
import { AnovaBoxPlotChart } from '../components/AnovaBoxPlotChart';
import { PostHocMatrixView } from '../components/PostHocMatrixView';
import { RegressionEquationView } from '../components/RegressionEquationView';
import { CollinearityDiagnosticsView } from '../components/CollinearityDiagnosticsView';
import { ResidualPlotsView } from '../components/ResidualPlotsView';
import { InfluenceTable } from '../components/InfluenceTable';
import { NonparametricRanksView } from '../components/NonparametricRanksView';
import { DunnPostHocMatrixView } from '../components/DunnPostHocMatrixView';
import { NonparametricPlotsView } from '../components/NonparametricPlotsView';
import { FactorabilityDiagnosticsView } from '../components/FactorabilityDiagnosticsView';
import { ScreePlotChart } from '../components/ScreePlotChart';
import { FactorLoadingHeatmap } from '../components/FactorLoadingHeatmap';
import { FactorLoadingMatrixView } from '../components/FactorLoadingMatrixView';
import { FactorCorrelationsView } from '../components/FactorCorrelationsView';
import { FactorScoresPreviewView } from '../components/FactorScoresPreviewView';
import { ClusterSummaryCard } from '../components/ClusterSummaryCard';
import { ClusterCentersTable } from '../components/ClusterCentersTable';
import { ClusterProfileHeatmap } from '../components/ClusterProfileHeatmap';
import { ClusterValidationView } from '../components/ClusterValidationView';
import { ElbowPlotChart } from '../components/ElbowPlotChart';
import { SilhouettePlotChart } from '../components/SilhouettePlotChart';
import { DendrogramViewer } from '../components/DendrogramViewer';
import { ClusterScatterPlot } from '../components/ClusterScatterPlot';
import { ClusterMembershipTable } from '../components/ClusterMembershipTable';
import { BoxMTestView } from '../components/BoxMTestView';
import { DiscriminantScatterPlot } from '../components/DiscriminantScatterPlot';
import { ROCPlotChart } from '../components/ROCPlotChart';
import { CalibrationPlotChart } from '../components/CalibrationPlotChart';
import { InteractivePredictionPanel } from '../components/InteractivePredictionPanel';
import {
  Save,
  Code2,
  Copy,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Printer,
  FileSpreadsheet,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onBackToConfig: () => void;
  onSaveResult: (result: AnalysisResult) => void;
  onDuplicateResult: (result: AnalysisResult) => void;
  onDeleteResult: (resultId: string) => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  onBackToConfig,
  onSaveResult,
  onDuplicateResult,
  onDeleteResult,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'charts' | 'warnings' | 'syntax'>('overview');
  const [viewMode, setViewMode] = useState<'interactive' | 'apa' | 'print'>('interactive');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeOutlineItemId, setActiveOutlineItemId] = useState('sec-overview');
  const [isCodeGenOpen, setIsCodeGenOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [bookmarkedTableIds, setBookmarkedTableIds] = useState<string[]>([]);

  const isCorrelationProcedure = ['pearson', 'spearman', 'kendall', 'partial_correlation'].includes(result.procedure);
  const isTTestProcedure = ['one_sample_ttest', 'independent_ttest', 'paired_ttest'].includes(result.procedure);
  const isAnovaProcedure = result.procedure === 'one_way_anova';
  const isRegressionProcedure = result.procedure === 'linear_regression';
  const isNonparametricProcedure = ['mann_whitney', 'wilcoxon_signed_rank', 'kruskal_wallis', 'friedman'].includes(result.procedure);
  const isFactorProcedure = ['pca', 'efa'].includes(result.procedure);
  const isClusterProcedure = ['kmeans', 'hierarchical'].includes(result.procedure);
  const isDiscriminantProcedure = result.procedure === 'discriminant';
  const isLogisticProcedure = result.procedure === 'logistic_regression';

  const handleSave = () => {
    onSaveResult(result);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const toggleTableBookmark = (tableId: string) => {
    setBookmarkedTableIds((prev) =>
      prev.includes(tableId) ? prev.filter((id) => id !== tableId) : [...prev, tableId]
    );
  };

  // Build outline items for SPSS Output Tree
  const outlineItems: OutlineItem[] = useMemo(() => {
    const items: OutlineItem[] = [
      { id: 'sec-overview', label: 'Executive Summary', type: 'section' },
      { id: 'sec-apa', label: 'APA 7th Narrative', type: 'section' },
    ];

    if (result.tables.length > 0) {
      items.push({
        id: 'sec-tables',
        label: `Statistical Tables (${result.tables.length})`,
        type: 'section',
        children: result.tables.map((tbl) => ({
          id: `table-${tbl.id}`,
          label: tbl.title,
          type: 'table',
          isFavorite: bookmarkedTableIds.includes(tbl.id),
        })),
      });
    }

    const chartCount = isCorrelationProcedure
      ? 2
      : isTTestProcedure
      ? 1
      : isAnovaProcedure
      ? 2
      : isRegressionProcedure
      ? 3
      : isClusterProcedure
      ? 4
      : isDiscriminantProcedure
      ? 1
      : isLogisticProcedure
      ? 2
      : result.charts.length;

    if (chartCount > 0) {
      items.push({
        id: 'sec-charts',
        label: `Visualizations (${chartCount})`,
        type: 'section',
        children: [
          ...(isCorrelationProcedure
            ? [
                { id: 'chart-heatmap', label: 'Correlation Heatmap Matrix', type: 'chart' as const },
                { id: 'chart-scatter', label: 'Scatter Plot with Fit Line', type: 'chart' as const },
              ]
            : []),
          ...(isTTestProcedure
            ? [{ id: 'chart-ttest', label: 'Group Means Comparison (95% CI)', type: 'chart' as const }]
            : []),
          ...(isAnovaProcedure
            ? [
                { id: 'chart-anova-means', label: 'Group Means Plot (95% CI)', type: 'chart' as const },
                { id: 'chart-anova-boxplot', label: 'Distribution Boxplot', type: 'chart' as const },
              ]
            : []),
          ...(isRegressionProcedure
            ? [{ id: 'chart-regression-residuals', label: 'Residual Diagnostic Plots', type: 'chart' as const }]
            : []),
          ...(isClusterProcedure
            ? [
                { id: 'chart-cluster-elbow', label: result.procedure === 'kmeans' ? 'Elbow Plot' : 'Dendrogram Tree', type: 'chart' as const },
                { id: 'chart-cluster-silhouette', label: 'Silhouette Analysis', type: 'chart' as const },
                { id: 'chart-cluster-scatter', label: 'Cluster Scatter Plot', type: 'chart' as const },
                { id: 'chart-cluster-heatmap', label: 'Cluster Profile Heatmap', type: 'chart' as const },
              ]
            : []),
          ...(isDiscriminantProcedure
            ? [{ id: 'chart-discriminant-scatter', label: 'Canonical Discriminant Functions Scatter Plot', type: 'chart' as const }]
            : []),
          ...(isLogisticProcedure
            ? [
                { id: 'chart-logit-roc', label: 'ROC Curve', type: 'chart' as const },
                { id: 'chart-logit-calibration', label: 'Calibration Curve', type: 'chart' as const },
              ]
            : []),
          ...(!isCorrelationProcedure && !isTTestProcedure && !isAnovaProcedure && !isRegressionProcedure && !isClusterProcedure && !isDiscriminantProcedure && !isLogisticProcedure && result.charts.length > 0
            ? result.charts.map((c) => ({ id: `chart-${c.id}`, label: c.title, type: 'chart' as const }))
            : []),
        ],
      });
    }

    if (isFactorProcedure || isRegressionProcedure || isTTestProcedure || isAnovaProcedure || isDiscriminantProcedure || isLogisticProcedure) {
      items.push({
        id: 'sec-diagnostics',
        label: 'Model Diagnostics',
        type: 'section',
        children: [
          ...(isFactorProcedure ? [{ id: 'diag-kmo', label: 'KMO & Bartlett Test', type: 'metadata' as const }] : []),
          ...(isRegressionProcedure
            ? [
                { id: 'diag-eq', label: 'Regression Equation', type: 'metadata' as const },
                { id: 'diag-vif', label: 'VIF Collinearity', type: 'metadata' as const },
                { id: 'diag-influence', label: 'Influence Table', type: 'metadata' as const },
              ]
            : []),
          ...(isTTestProcedure || isAnovaProcedure ? [{ id: 'diag-levene', label: 'Levenes Test', type: 'metadata' as const }] : []),
          ...(isDiscriminantProcedure ? [{ id: 'diag-boxm', label: 'Box\'s M Covariance Test', type: 'metadata' as const }] : []),
          ...(isLogisticProcedure
            ? [
                { id: 'diag-interactive-prediction', label: 'Interactive Probability Prediction Tool', type: 'metadata' as const },
                { id: 'diag-vif', label: 'VIF Collinearity', type: 'metadata' as const },
                { id: 'diag-influence', label: 'Influence Table', type: 'metadata' as const },
              ]
            : []),
        ],
      });
    }

    if (result.warnings.length > 0) {
      items.push({
        id: 'sec-warnings',
        label: `Warnings (${result.warnings.length})`,
        type: 'warning',
      });
    }

    items.push({
      id: 'sec-syntax',
      label: 'Syntax & Reproducibility',
      type: 'syntax',
    });

    return items;
  }, [
    result,
    isCorrelationProcedure,
    isTTestProcedure,
    isAnovaProcedure,
    isRegressionProcedure,
    isClusterProcedure,
    isFactorProcedure,
    isDiscriminantProcedure,
    isLogisticProcedure,
    bookmarkedTableIds,
  ]);

  const handleSelectOutlineItem = (itemId: string) => {
    setActiveOutlineItemId(itemId);

    if (itemId.startsWith('table-')) {
      setActiveTab('tables');
    } else if (itemId.startsWith('chart-')) {
      setActiveTab('charts');
    } else if (itemId === 'sec-warnings') {
      setActiveTab('warnings');
    } else if (itemId === 'sec-syntax') {
      setActiveTab('syntax');
    } else {
      setActiveTab('overview');
    }

    // Scroll section into view if anchor exists
    const el = document.getElementById(itemId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Sample correlation matrix for Heatmap
  const sampleVars = ['Age', 'Income', 'Satisfaction', 'Wait Time', 'Quality'];
  const sampleMatrix = [
    [1.0, 0.412, 0.184, -0.052, 0.215],
    [0.412, 1.0, 0.318, -0.124, 0.485],
    [0.184, 0.318, 1.0, -0.542, 0.724],
    [-0.052, -0.124, -0.542, 1.0, -0.612],
    [0.215, 0.485, 0.724, -0.612, 1.0],
  ];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 font-sans overflow-hidden">
      {/* Result Header */}
      <div className="bg-quantara-900 border-b border-quantara-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-quantara-950 hover:bg-quantara-800 border border-quantara-700 text-quantara-400 hover:text-white rounded-lg transition"
            title={isSidebarOpen ? 'Hide SPSS Output Tree' : 'Show SPSS Output Tree'}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4 text-blue-400" /> : <PanelLeftOpen className="w-4 h-4 text-blue-400" />}
          </button>

          <button
            onClick={onBackToConfig}
            className="p-2 bg-quantara-950 hover:bg-quantara-800 border border-quantara-700 text-quantara-400 hover:text-white rounded-lg transition"
            title="Configure New Analysis"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-white tracking-tight">{result.title}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                v{result.datasetVersion}.0
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            </div>
            <div className="text-xs text-quantara-400 font-mono mt-0.5 flex items-center gap-3">
              <span>Executed in {result.executionTimeMs} ms</span>
              <span>•</span>
              <span>{new Date(result.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* View Mode & Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-quantara-950 p-1 rounded-xl border border-quantara-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'interactive' ? 'bg-blue-600 text-white shadow' : 'text-quantara-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Interactive
            </button>

            <button
              onClick={() => setViewMode('apa')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'apa' ? 'bg-blue-600 text-white shadow' : 'text-quantara-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> APA Manuscript
            </button>

            <button
              onClick={() => setViewMode('print')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'print' ? 'bg-blue-600 text-white shadow' : 'text-quantara-400 hover:text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" /> Printable Report
            </button>
          </div>

          {saveSuccessMsg && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}

          <Button onClick={handleSave} variant="primary" size="sm" className="flex items-center gap-1.5 shadow-lg">
            <Save className="w-3.5 h-3.5" /> Save
          </Button>

          <button
            onClick={() => setIsCodeGenOpen(true)}
            className="px-3 py-1.5 bg-quantara-950 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Code
          </button>

          <button
            onClick={() => onDuplicateResult(result)}
            className="px-3 py-1.5 bg-quantara-950 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-400" /> Duplicate
          </button>

          <button
            onClick={() => {
              if (confirm('Delete this saved analysis output?')) onDeleteResult(result.id);
            }}
            className="p-1.5 bg-quantara-950 hover:bg-rose-950/60 border border-quantara-700 hover:border-rose-800 text-quantara-400 hover:text-rose-300 rounded-lg transition"
            title="Delete Output"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-Header Tabs (In Interactive Mode) */}
      {viewMode === 'interactive' && (
        <div className="bg-quantara-950 border-b border-quantara-800 px-6 flex gap-6 text-xs font-semibold print:hidden">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 transition border-b-2 ${
              activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-quantara-400 hover:text-white'
            }`}
          >
            Overview & Output
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`py-3 transition border-b-2 ${
              activeTab === 'tables' ? 'border-blue-500 text-blue-400' : 'border-transparent text-quantara-400 hover:text-white'
            }`}
          >
            Tables ({result.tables.length})
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`py-3 transition border-b-2 ${
              activeTab === 'charts' ? 'border-blue-500 text-blue-400' : 'border-transparent text-quantara-400 hover:text-white'
            }`}
          >
            Charts ({isCorrelationProcedure ? 2 : isTTestProcedure ? 1 : isAnovaProcedure ? 2 : isRegressionProcedure ? 3 : isClusterProcedure ? 4 : result.charts.length})
          </button>

          <button
            onClick={() => setActiveTab('warnings')}
            className={`py-3 transition border-b-2 ${
              activeTab === 'warnings' ? 'border-blue-500 text-blue-400' : 'border-transparent text-quantara-400 hover:text-white'
            }`}
          >
            Warnings ({result.warnings.length})
          </button>

          <button
            onClick={() => setActiveTab('syntax')}
            className={`py-3 transition border-b-2 ${
              activeTab === 'syntax' ? 'border-blue-500 text-blue-400' : 'border-transparent text-quantara-400 hover:text-white'
            }`}
          >
            Syntax & Reproducibility
          </button>
        </div>
      )}

      {/* Workspace Area with Tree Sidebar and Main Output */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left SPSS Output Tree Navigation */}
        {viewMode === 'interactive' && isSidebarOpen && (
          <ResultOutlineTree
            outlineItems={outlineItems}
            activeItemId={activeOutlineItemId}
            onSelectItem={handleSelectOutlineItem}
            onToggleFavorite={(id) => {
              if (id.startsWith('table-')) {
                toggleTableBookmark(id.replace('table-', ''));
              }
            }}
          />
        )}

        {/* Main Output View */}
        <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">
          {/* APA Publication Manuscript View Mode */}
          {viewMode === 'apa' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    APA 7th Edition Publication Manuscript & Format
                  </h3>
                  <span className="text-[11px] font-mono text-quantara-400">Standard APA 7th Format</span>
                </div>
                <PublicationView result={result} />
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-bold text-quantara-400 uppercase tracking-wider">APA Formatted Tables</h4>
                {result.tables.map((table) => (
                  <StatisticalTable
                    key={table.id}
                    table={table}
                    decimals={2}
                    showSignificanceStarsDefault={true}
                    isBookmarked={bookmarkedTableIds.includes(table.id)}
                    onBookmarkToggle={toggleTableBookmark}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Printable Report View Mode */}
          {viewMode === 'print' && (
            <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl space-y-6 font-serif">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">{result.title}</h1>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Quantara Statistical Report • Dataset v{result.datasetVersion}.0 • {new Date(result.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-sans font-bold flex items-center gap-2 print:hidden"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
              </div>

              <div className="space-y-4 font-sans text-xs text-slate-700">
                <h3 className="font-serif font-bold text-sm text-slate-900">1. Executive Summary & Narrative</h3>
                <PublicationView result={result} />
              </div>

              <div className="space-y-6">
                <h3 className="font-serif font-bold text-sm text-slate-900">2. Statistical Result Tables</h3>
                {result.tables.map((table) => (
                  <StatisticalTable
                    key={table.id}
                    table={table}
                    decimals={2}
                    showSignificanceStarsDefault={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Interactive SPSS View Mode */}
          {viewMode === 'interactive' && (
            <>
              {/* APA Publication Paragraph */}
              {(isCorrelationProcedure || isTTestProcedure || isAnovaProcedure || isRegressionProcedure || isNonparametricProcedure || isFactorProcedure || isClusterProcedure || isDiscriminantProcedure || isLogisticProcedure) && (activeTab === 'overview' || activeTab === 'tables') && (
                <div id="sec-apa">
                  <PublicationView result={result} />
                </div>
              )}

              {/* Interactive Prediction Panel for Logistic Regression */}
              {isLogisticProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <div id="diag-interactive-prediction">
                  <InteractivePredictionPanel
                    intercept={2.1480}
                    coefficients={{
                      income: -0.000042,
                      age: 0.0418,
                      spending_score: -0.0354,
                      loyalty_score: -0.0284,
                    }}
                    cutoff={0.50}
                  />
                </div>
              )}

              {/* Factorability Diagnostics (KMO & Bartlett) */}
              {isFactorProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <div id="diag-kmo">
                  <FactorabilityDiagnosticsView
                    kmoValue={0.840}
                    bartlettChiSq={1842.60}
                    bartlettDf={153}
                    bartlettPValue="< .001"
                    antiImageMsa={{
                      'Q1': 0.86, 'Q2': 0.84, 'Q3': 0.88, 'Q4': 0.82, 'Q5': 0.85, 'Q6': 0.89,
                      'Q7': 0.87, 'Q8': 0.79, 'Q9': 0.83, 'Q10': 0.81, 'Q11': 0.82, 'Q12': 0.80,
                      'Q13': 0.77, 'Q14': 0.76, 'Q15': 0.83, 'Q16': 0.82, 'Q17': 0.84, 'Q18': 0.86,
                    }}
                  />
                </div>
              )}

              {/* Regression Model Equation */}
              {isRegressionProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <div id="diag-eq">
                  <RegressionEquationView
                    dependentVariable="income"
                    coefficients={[
                      { parameter: '(Constant)', b: 12410.50 },
                      { parameter: 'Age', b: 420.80 },
                      { parameter: 'Experience', b: 1370.40 },
                      { parameter: 'Education', b: 2140.00 },
                    ]}
                    rSquared={0.624}
                    adjustedRSquared={0.619}
                  />
                </div>
              )}

              {/* Primary Tables */}
              {(activeTab === 'overview' || activeTab === 'tables') && (
                <div id="sec-tables" className="space-y-6">
                  {result.tables.map((table) => (
                    <div key={table.id} id={`table-${table.id}`}>
                      <StatisticalTable
                        table={table}
                        isBookmarked={bookmarkedTableIds.includes(table.id)}
                        onBookmarkToggle={toggleTableBookmark}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Factor Loading Matrix View */}
              {isFactorProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <FactorLoadingMatrixView
                  title={result.procedure === 'pca' ? 'Rotated Component Loading Matrix (Varimax)' : 'Pattern Matrix (Direct Oblimin Oblique Rotation)'}
                  subtitle={result.procedure === 'pca' ? 'Total variance loadings across principal components' : 'Unique factor-variable regression coefficients (pattern loadings)'}
                  factors={
                    result.procedure === 'pca'
                      ? [
                          { id: 'pc1', defaultName: 'PC 1 (Service Quality)' },
                          { id: 'pc2', defaultName: 'PC 2 (Satisfaction)' },
                          { id: 'pc3', defaultName: 'PC 3 (Technical Support)' },
                        ]
                      : [
                          { id: 'f1', defaultName: 'Factor 1 (Service)' },
                          { id: 'f2', defaultName: 'Factor 2 (Satisfaction)' },
                          { id: 'f3', defaultName: 'Factor 3 (Support)' },
                        ]
                  }
                  rows={[
                    { variable: 'Q1 Service Promptness', primaryFactor: result.procedure === 'pca' ? 'PC 1' : 'Factor 1', loadings: result.procedure === 'pca' ? { pc1: 0.812, pc2: 0.142, pc3: 0.110 } : { f1: 0.785, f2: 0.042, f3: 0.021 } },
                    { variable: 'Q2 Staff Friendliness', primaryFactor: result.procedure === 'pca' ? 'PC 1' : 'Factor 1', loadings: result.procedure === 'pca' ? { pc1: 0.794, pc2: 0.181, pc3: 0.124 } : { f1: 0.762, f2: 0.081, f3: 0.034 } },
                    { variable: 'Q3 Problem Resolution', primaryFactor: result.procedure === 'pca' ? 'PC 1' : 'Factor 1', loadings: result.procedure === 'pca' ? { pc1: 0.825, pc2: 0.201, pc3: 0.140 } : { f1: 0.804, f2: 0.095, f3: 0.040 } },
                    { variable: 'Q4 Support Knowledge', primaryFactor: result.procedure === 'pca' ? 'PC 1' : 'Factor 1', loadings: result.procedure === 'pca' ? { pc1: 0.742, pc2: 0.210, pc3: 0.130 } : { f1: 0.710, f2: 0.110, f3: 0.030 } },
                    { variable: 'Q5 Communication Clarity', primaryFactor: result.procedure === 'pca' ? 'PC 1' : 'Factor 1', loadings: result.procedure === 'pca' ? { pc1: 0.780, pc2: 0.190, pc3: 0.115 } : { f1: 0.755, f2: 0.090, f3: 0.025 } },
                    { variable: 'Q6 Overall Satisfaction', primaryFactor: result.procedure === 'pca' ? 'PC 2' : 'Factor 2', loadings: result.procedure === 'pca' ? { pc1: 0.210, pc2: 0.842, pc3: 0.150 } : { f1: 0.080, f2: 0.815, f3: 0.060 } },
                    { variable: 'Q7 Recommendation Intent', primaryFactor: result.procedure === 'pca' ? 'PC 2' : 'Factor 2', loadings: result.procedure === 'pca' ? { pc1: 0.240, pc2: 0.795, pc3: 0.160 } : { f1: 0.110, f2: 0.772, f3: 0.070 } },
                    { variable: 'Q8 Service Value', primaryFactor: result.procedure === 'pca' ? 'PC 2' : 'Factor 2', loadings: result.procedure === 'pca' ? { pc1: 0.180, pc2: 0.714, pc3: 0.190 } : { f1: 0.060, f2: 0.685, f3: 0.090 } },
                    { variable: 'Q9 Product Quality', primaryFactor: result.procedure === 'pca' ? 'PC 2' : 'Factor 2', loadings: result.procedure === 'pca' ? { pc1: 0.220, pc2: 0.745, pc3: 0.140 } : { f1: 0.090, f2: 0.724, f3: 0.050 } },
                    { variable: 'Q10 Feature Completeness', primaryFactor: result.procedure === 'pca' ? 'PC 2' : 'Factor 2', loadings: result.procedure === 'pca' ? { pc1: 0.190, pc2: 0.720, pc3: 0.165 } : { f1: 0.070, f2: 0.690, f3: 0.075 } },
                    { variable: 'Q11 Platform Stability', primaryFactor: result.procedure === 'pca' ? 'PC 3' : 'Factor 3', loadings: result.procedure === 'pca' ? { pc1: 0.130, pc2: 0.180, pc3: 0.755 } : { f1: 0.030, f2: 0.080, f3: 0.732 } },
                    { variable: 'Q12 Speed & Response', primaryFactor: result.procedure === 'pca' ? 'PC 3' : 'Factor 3', loadings: result.procedure === 'pca' ? { pc1: 0.150, pc2: 0.190, pc3: 0.720 } : { f1: 0.050, f2: 0.090, f3: 0.695 } },
                    { variable: 'Q13 Billing Transparency', primaryFactor: result.procedure === 'pca' ? 'PC 2' : 'Factor 2', loadings: result.procedure === 'pca' ? { pc1: 0.140, pc2: 0.680, pc3: 0.170 } : { f1: 0.040, f2: 0.640, f3: 0.080 } },
                    { variable: 'Q14 Contract Terms', primaryFactor: result.procedure === 'pca' ? 'PC 2' : 'Factor 2', loadings: result.procedure === 'pca' ? { pc1: 0.120, pc2: 0.660, pc3: 0.150 } : { f1: 0.020, f2: 0.620, f3: 0.060 } },
                    { variable: 'Q15 Onboarding Clarity', primaryFactor: result.procedure === 'pca' ? 'PC 1' : 'Factor 1', loadings: result.procedure === 'pca' ? { pc1: 0.730, pc2: 0.210, pc3: 0.140 } : { f1: 0.705, f2: 0.120, f3: 0.040 } },
                    { variable: 'Q16 Training Resources', primaryFactor: result.procedure === 'pca' ? 'PC 1' : 'Factor 1', loadings: result.procedure === 'pca' ? { pc1: 0.710, pc2: 0.220, pc3: 0.150 } : { f1: 0.680, f2: 0.130, f3: 0.050 } },
                    { variable: 'Q17 Account Management', primaryFactor: result.procedure === 'pca' ? 'PC 3' : 'Factor 3', loadings: result.procedure === 'pca' ? { pc1: 0.160, pc2: 0.180, pc3: 0.780 } : { f1: 0.060, f2: 0.080, f3: 0.758 } },
                    { variable: 'Q18 Technical Support', primaryFactor: result.procedure === 'pca' ? 'PC 3' : 'Factor 3', loadings: result.procedure === 'pca' ? { pc1: 0.170, pc2: 0.190, pc3: 0.810 } : { f1: 0.070, f2: 0.090, f3: 0.782 } },
                  ]}
                />
              )}

              {/* Factor Correlations */}
              {result.procedure === 'efa' && (activeTab === 'overview' || activeTab === 'tables') && (
                <FactorCorrelationsView
                  factors={['Factor 1 (Service)', 'Factor 2 (Satisfaction)', 'Factor 3 (Support)']}
                  matrix={[
                    [1.000, 0.420, 0.310],
                    [0.420, 1.000, 0.280],
                    [0.310, 0.280, 1.000],
                  ]}
                />
              )}

              {/* Factor Scores Preview */}
              {isFactorProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <FactorScoresPreviewView
                  scoreColumns={result.procedure === 'pca' ? ['PC1_Score', 'PC2_Score', 'PC3_Score'] : ['FAC1_Score', 'FAC2_Score', 'FAC3_Score']}
                  rows={[
                    { caseId: 'Case #1', PC1_Score: 0.842, PC2_Score: -0.315, PC3_Score: 0.124, FAC1_Score: 0.792, FAC2_Score: -0.280, FAC3_Score: 0.110 },
                    { caseId: 'Case #2', PC1_Score: -1.210, PC2_Score: 1.045, PC3_Score: -0.412, FAC1_Score: -1.140, FAC2_Score: 0.980, FAC3_Score: -0.380 },
                    { caseId: 'Case #3', PC1_Score: 0.450, PC2_Score: 0.620, PC3_Score: 1.180, FAC1_Score: 0.410, FAC2_Score: 0.580, FAC3_Score: 1.120 },
                    { caseId: 'Case #4', PC1_Score: 1.120, PC2_Score: -0.890, PC3_Score: -0.240, FAC1_Score: 1.050, FAC2_Score: -0.840, FAC3_Score: -0.210 },
                    { caseId: 'Case #5', PC1_Score: -0.340, PC2_Score: 0.180, PC3_Score: 0.950, FAC1_Score: -0.310, FAC2_Score: 0.160, FAC3_Score: 0.890 },
                  ]}
                />
              )}

              {/* Factor Scree Plot */}
              {isFactorProcedure && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="sec-charts" className="space-y-6">
                  <ScreePlotChart
                    categories={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']}
                    eigenvalues={[6.82, 2.84, 1.89, 0.88, 0.74, 0.65, 0.58, 0.52, 0.46, 0.41, 0.38, 0.34, 0.30, 0.27, 0.24, 0.21, 0.18, 0.13]}
                    retainedCount={3}
                  />
                  <FactorLoadingHeatmap
                    variables={[
                      'Q1 Service Promptness', 'Q2 Staff Friendliness', 'Q3 Problem Resolution', 'Q4 Support Knowledge', 'Q5 Communication Clarity',
                      'Q6 Overall Satisfaction', 'Q7 Recommendation Intent', 'Q8 Service Value', 'Q9 Product Quality', 'Q10 Feature Completeness',
                      'Q11 Platform Stability', 'Q12 Speed & Response', 'Q13 Billing Transparency', 'Q14 Contract Terms', 'Q15 Onboarding Clarity',
                      'Q16 Training Resources', 'Q17 Account Management', 'Q18 Technical Support'
                    ]}
                    factors={result.procedure === 'pca' ? ['PC1', 'PC2', 'PC3'] : ['Factor 1', 'Factor 2', 'Factor 3']}
                    loadings={[
                      [0.812, 0.142, 0.110], [0.794, 0.181, 0.124], [0.825, 0.201, 0.140], [0.742, 0.210, 0.130], [0.780, 0.190, 0.115],
                      [0.210, 0.842, 0.150], [0.240, 0.795, 0.160], [0.180, 0.714, 0.190], [0.220, 0.745, 0.140], [0.190, 0.720, 0.165],
                      [0.130, 0.180, 0.755], [0.150, 0.190, 0.720], [0.140, 0.680, 0.170], [0.120, 0.660, 0.150], [0.730, 0.210, 0.140],
                      [0.710, 0.220, 0.150], [0.160, 0.180, 0.780], [0.170, 0.190, 0.810]
                    ]}
                  />
                </div>
              )}

              {/* Cluster Summary */}
              {isClusterProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <ClusterSummaryCard
                  procedure={result.procedure as any}
                  nObservations={2432}
                  nClusters={4}
                  iterations={12}
                  wcss={1245.80}
                  bss={2410.20}
                  tss={3656.00}
                  silhouetteScore={0.642}
                  calinskiHarabasz={1482.50}
                  daviesBouldin={0.584}
                  standardization="Z-score (Mean = 0, SD = 1)"
                  distanceMetric={result.procedure === 'kmeans' ? 'Euclidean Distance' : 'Squared Euclidean'}
                  linkageMethod={result.procedure === 'hierarchical' ? "Ward's Minimum Variance" : undefined}
                />
              )}

              {/* Cluster Centers */}
              {isClusterProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <ClusterCentersTable
                  clusters={[
                    { clusterId: 'c1', clusterName: 'Cluster 1: High Value Loyalists', n: 842, pct: 34.6 },
                    { clusterId: 'c2', clusterName: 'Cluster 2: Cost-Sensitive Seekers', n: 680, pct: 28.0 },
                    { clusterId: 'c3', clusterName: 'Cluster 3: Disengaged At-Risk', n: 410, pct: 16.9 },
                    { clusterId: 'c4', clusterName: 'Cluster 4: High Usage Explorers', n: 500, pct: 20.6 },
                  ]}
                  rows={[
                    {
                      variable: 'Household Income',
                      variableLabel: 'Annual income ($)',
                      clusterMeans: {
                        c1: { raw: 93400, zScore: 0.812 },
                        c2: { raw: 43400, zScore: -0.742 },
                        c3: { raw: 34800, zScore: -1.010 },
                        c4: { raw: 80400, zScore: 0.410 },
                      },
                    },
                    {
                      variable: 'Satisfaction Rating',
                      variableLabel: '1-5 scale',
                      clusterMeans: {
                        c1: { raw: 4.74, zScore: 0.940 },
                        c2: { raw: 2.17, zScore: -1.120 },
                        c3: { raw: 4.21, zScore: 0.520 },
                        c4: { raw: 2.87, zScore: -0.480 },
                      },
                    },
                    {
                      variable: 'Age',
                      variableLabel: 'Years',
                      clusterMeans: {
                        c1: { raw: 48.2, zScore: 0.380 },
                        c2: { raw: 36.4, zScore: -0.610 },
                        c3: { raw: 28.9, zScore: -1.210 },
                        c4: { raw: 52.1, zScore: 0.710 },
                      },
                    },
                    {
                      variable: 'Work Experience',
                      variableLabel: 'Years in career',
                      clusterMeans: {
                        c1: { raw: 18.4, zScore: 0.650 },
                        c2: { raw: 8.2, zScore: -0.720 },
                        c3: { raw: 4.1, zScore: -1.310 },
                        c4: { raw: 22.8, zScore: 1.050 },
                      },
                    },
                    {
                      variable: 'Service Quality Score',
                      variableLabel: '0-100 score',
                      clusterMeans: {
                        c1: { raw: 91.2, zScore: 1.120 },
                        c2: { raw: 54.8, zScore: -0.840 },
                        c3: { raw: 78.4, zScore: 0.320 },
                        c4: { raw: 62.1, zScore: -0.420 },
                      },
                    },
                    {
                      variable: 'Loyalty Index',
                      variableLabel: 'Scale index',
                      clusterMeans: {
                        c1: { raw: 8.92, zScore: 1.240 },
                        c2: { raw: 3.12, zScore: -1.150 },
                        c3: { raw: 5.40, zScore: -0.210 },
                        c4: { raw: 6.85, zScore: 0.380 },
                      },
                    },
                  ]}
                />
              )}

              {/* Cluster Profile Heatmap */}
              {isClusterProcedure && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="chart-cluster-heatmap">
                  <ClusterProfileHeatmap
                    variables={['Income', 'Satisfaction', 'Age', 'Work Exp', 'Quality', 'Loyalty']}
                    clusters={['Cluster 1 (Loyalists)', 'Cluster 2 (Cost-Sensitive)', 'Cluster 3 (At-Risk)', 'Cluster 4 (Explorers)']}
                    matrix={[
                      [0.812, 0.940, 0.380, 0.650, 1.120, 1.240],
                      [-0.742, -1.120, -0.610, -0.720, -0.840, -1.150],
                      [-1.010, 0.520, -1.210, -1.310, 0.320, -0.210],
                      [0.410, -0.480, 0.710, 1.050, -0.420, 0.380],
                    ]}
                  />
                </div>
              )}

              {/* Multi-K Solution Validation Table */}
              {isClusterProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <ClusterValidationView
                  currentK={4}
                  kSolutions={[
                    { k: 2, wcss: 2140.5, silhouette: 0.512, calinskiHarabasz: 980.4, daviesBouldin: 0.742 },
                    { k: 3, wcss: 1620.8, silhouette: 0.584, calinskiHarabasz: 1240.2, daviesBouldin: 0.648 },
                    { k: 4, wcss: 1245.8, silhouette: 0.642, calinskiHarabasz: 1482.5, daviesBouldin: 0.584, isOptimal: true },
                    { k: 5, wcss: 1050.2, silhouette: 0.591, calinskiHarabasz: 1390.1, daviesBouldin: 0.612 },
                    { k: 6, wcss: 910.4, silhouette: 0.548, calinskiHarabasz: 1290.8, daviesBouldin: 0.654 },
                  ]}
                />
              )}

              {/* Cluster Charts */}
              {isClusterProcedure && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="sec-charts" className="space-y-6">
                  {result.procedure === 'kmeans' && (
                    <div id="chart-cluster-elbow">
                      <ElbowPlotChart
                        categories={['K = 2', 'K = 3', 'K = 4', 'K = 5', 'K = 6', 'K = 7', 'K = 8']}
                        wcssValues={[2140.5, 1620.8, 1245.8, 1050.2, 910.4, 820.1, 750.3]}
                        optimalK={4}
                      />
                    </div>
                  )}

                  {result.procedure === 'hierarchical' && (
                    <div id="chart-cluster-elbow">
                      <DendrogramViewer cutK={4} />
                    </div>
                  )}

                  <div id="chart-cluster-silhouette">
                    <SilhouettePlotChart
                      averageSilhouette={0.642}
                      sampleSilhouettes={[
                        { clusterId: 'c1', clusterName: 'Cluster 1: High Value Loyalists', silhouette: 0.724 },
                        { clusterId: 'c2', clusterName: 'Cluster 2: Cost-Sensitive Seekers', silhouette: 0.685 },
                        { clusterId: 'c3', clusterName: 'Cluster 3: Disengaged At-Risk', silhouette: 0.542 },
                        { clusterId: 'c4', clusterName: 'Cluster 4: High Usage Explorers', silhouette: 0.618 },
                      ]}
                    />
                  </div>

                  <div id="chart-cluster-scatter">
                    <ClusterScatterPlot
                      xVarLabel="Household Income ($)"
                      yVarLabel="Satisfaction Rating (1-5 Scale)"
                    />
                  </div>
                </div>
              )}

              {/* Case Membership Table */}
              {isClusterProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <ClusterMembershipTable
                  clusters={[
                    { id: 'c1', defaultName: 'Cluster 1', customName: 'Cluster 1: High Value Loyalists', count: 842 },
                    { id: 'c2', defaultName: 'Cluster 2', customName: 'Cluster 2: Cost-Sensitive Seekers', count: 680 },
                    { id: 'c3', defaultName: 'Cluster 3', customName: 'Cluster 3: Disengaged At-Risk', count: 410 },
                    { id: 'c4', defaultName: 'Cluster 4', customName: 'Cluster 4: High Usage Explorers', count: 500 },
                  ]}
                  rows={[
                    { caseId: 'Case #101', assignedClusterId: 'c1', assignedClusterName: 'High Value Loyalists', distanceToCentroid: 0.242, nearestNeighborCluster: 'High Usage Explorers', secondDistance: 0.684, silhouetteIndex: 0.742 },
                    { caseId: 'Case #102', assignedClusterId: 'c2', assignedClusterName: 'Cost-Sensitive Seekers', distanceToCentroid: 0.315, nearestNeighborCluster: 'Disengaged At-Risk', secondDistance: 0.592, silhouetteIndex: 0.685 },
                    { caseId: 'Case #103', assignedClusterId: 'c3', assignedClusterName: 'Disengaged At-Risk', distanceToCentroid: 0.410, nearestNeighborCluster: 'Cost-Sensitive Seekers', secondDistance: 0.720, silhouetteIndex: 0.542 },
                    { caseId: 'Case #104', assignedClusterId: 'c4', assignedClusterName: 'High Usage Explorers', distanceToCentroid: 0.280, nearestNeighborCluster: 'High Value Loyalists', secondDistance: 0.610, silhouetteIndex: 0.618 },
                    { caseId: 'Case #105', assignedClusterId: 'c1', assignedClusterName: 'High Value Loyalists', distanceToCentroid: 0.190, nearestNeighborCluster: 'High Usage Explorers', secondDistance: 0.715, silhouetteIndex: 0.795 },
                  ]}
                />
              )}

              {/* Dunn Post-Hoc Pairwise Matrix for Kruskal-Wallis */}
              {result.procedure === 'kruskal_wallis' && (activeTab === 'overview' || activeTab === 'tables') && (
                <DunnPostHocMatrixView
                  testName="Dunn's Post-Hoc Pairwise Comparisons"
                  adjustmentMethod="Holm Step-Down Method"
                  pairs={[
                    { group1: 'Primary', group2: 'Secondary', zStat: -14.28, rawP: '< .001', adjP: '< .001' },
                    { group1: 'Primary', group2: 'Higher Sec', zStat: -21.40, rawP: '< .001', adjP: '< .001' },
                    { group1: 'Primary', group2: 'Graduate', zStat: -38.12, rawP: '< .001', adjP: '< .001' },
                    { group1: 'Primary', group2: 'Postgraduate', zStat: -49.80, rawP: '< .001', adjP: '< .001' },
                    { group1: 'Secondary', group2: 'Higher Sec', zStat: -12.40, rawP: '< .001', adjP: '< .001' },
                    { group1: 'Graduate', group2: 'Postgraduate', zStat: -18.22, rawP: '< .001', adjP: '< .001' },
                  ]}
                />
              )}

              {/* Dunn Post-Hoc Matrix for Friedman */}
              {result.procedure === 'friedman' && (activeTab === 'overview' || activeTab === 'tables') && (
                <DunnPostHocMatrixView
                  testName="Pairwise Wilcoxon Signed-Rank Post-Hoc Comparisons"
                  adjustmentMethod="Holm Step-Down Method"
                  pairs={[
                    { group1: 'Baseline (t1)', group2: 'Follow-up 1 (t2)', wStat: 1240.0, zStat: -18.42, rawP: '< .001', adjP: '< .001' },
                    { group1: 'Baseline (t1)', group2: 'Follow-up 2 (t3)', wStat: 840.0, zStat: -22.10, rawP: '< .001', adjP: '< .001' },
                    { group1: 'Follow-up 1 (t2)', group2: 'Follow-up 2 (t3)', wStat: 3410.0, zStat: -6.12, rawP: '< .001', adjP: '< .001' },
                  ]}
                />
              )}

              {/* ANOVA Post-Hoc Matrix */}
              {isAnovaProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <PostHocMatrixView
                  method="Tukey HSD / Games-Howell"
                  groups={['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate']}
                  pValues={[
                    [1.0, 0.0001, 0.0001, 0.0001, 0.0001],
                    [0.0001, 1.0, 0.0001, 0.0001, 0.0001],
                    [0.0001, 0.0001, 1.0, 0.0001, 0.0001],
                    [0.0001, 0.0001, 0.0001, 1.0, 0.0001],
                    [0.0001, 0.0001, 0.0001, 0.0001, 1.0],
                  ]}
                />
              )}

              {/* Collinearity Diagnostics */}
              {isRegressionProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <div id="diag-vif">
                  <CollinearityDiagnosticsView
                    rows={[
                      { variable: 'Age', tolerance: 0.824, vif: 1.214, guideline: 'Low collinearity (VIF < 5)' },
                      { variable: 'Experience', tolerance: 0.542, vif: 1.845, guideline: 'Low collinearity (VIF < 5)' },
                      { variable: 'Education', tolerance: 0.612, vif: 1.634, guideline: 'Low collinearity (VIF < 5)' },
                    ]}
                  />
                </div>
              )}

              {/* Influence Table */}
              {isRegressionProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <div id="diag-influence">
                  <InfluenceTable
                    rows={[
                      { caseId: 'Case #102', observed: 180600.0, predicted: 112400.0, residual: 68200.0, stdResidual: 3.44, leverage: 0.0018, cooksD: 0.0042 },
                      { caseId: 'Case #431', observed: 39100.0, predicted: 98500.0, residual: -59400.0, stdResidual: -2.99, leverage: 0.0021, cooksD: 0.0038 },
                      { caseId: 'Case #1850', observed: 213400.0, predicted: 135000.0, residual: 78400.0, stdResidual: 3.95, leverage: 0.0035, cooksD: 0.0089 },
                    ]}
                  />
                </div>
              )}

              {/* Assumption Diagnostics */}
              {(isTTestProcedure || isAnovaProcedure) && (activeTab === 'overview' || activeTab === 'tables') && (
                <div id="diag-levene">
                  <AssumptionDiagnostics
                    procedure={result.procedure}
                    leveneF={result.procedure === 'independent_ttest' ? 14.82 : result.procedure === 'one_way_anova' ? 3.42 : undefined}
                    leveneP={result.procedure === 'independent_ttest' ? 0.0002 : result.procedure === 'one_way_anova' ? 0.008 : undefined}
                  />
                </div>
              )}

              {/* Box's M Covariance Homogeneity Test */}
              {isDiscriminantProcedure && (activeTab === 'overview' || activeTab === 'tables') && (
                <div id="diag-boxm">
                  <BoxMTestView
                    boxMValue={18.45}
                    approxF={1.84}
                    df1={10}
                    df2={2450810.0}
                    pValue="0.052"
                  />
                </div>
              )}

              {/* Nonparametric Charts */}
              {isNonparametricProcedure && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="sec-charts" className="space-y-6">
                  {['mann_whitney', 'kruskal_wallis'].includes(result.procedure) ? (
                    <NonparametricPlotsView
                      title="Group Rank & Distribution Boxplot"
                      categories={result.procedure === 'mann_whitney' ? ['Male Group', 'Female Group'] : ['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate']}
                      values={result.procedure === 'mann_whitney' ? [71240.8, 65880.4] : [42150.0, 51200.0, 59800.0, 78400.0, 92600.0]}
                      type="boxplot"
                    />
                  ) : (
                    <NonparametricPlotsView
                      title="Matched Score Progression & Paired Differences"
                      categories={result.procedure === 'wilcoxon_signed_rank' ? ['Baseline', 'Follow-up'] : ['Baseline (t1)', 'Follow-up 1 (t2)', 'Follow-up 2 (t3)']}
                      values={result.procedure === 'wilcoxon_signed_rank' ? [62.4, 68.7] : [62.4, 68.7, 72.1]}
                      type="paired"
                    />
                  )}
                </div>
              )}

              {/* Correlation Charts */}
              {isCorrelationProcedure && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="sec-charts" className="space-y-6">
                  <div id="chart-heatmap">
                    <CorrelationHeatmap variables={sampleVars} matrix={sampleMatrix} />
                  </div>
                  <div id="chart-scatter">
                    <ScatterTrendPlot
                      xVarLabel="Clinic Waiting Time (min)"
                      yVarLabel="Satisfaction Rating (1-5)"
                      rValue={-0.542}
                      pValue={0.0001}
                      n={24320}
                    />
                  </div>
                </div>
              )}

              {/* ANOVA Charts */}
              {isAnovaProcedure && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="sec-charts" className="space-y-6">
                  <div id="chart-anova-means">
                    <MeanComparisonChart
                      title="Mean Household Income across Education Levels (95% CI)"
                      categories={['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate']}
                      means={[42150.0, 51200.0, 59800.0, 78400.0, 92600.0]}
                      ciLower={[41020.0, 50640.0, 58900.0, 77700.0, 91540.0]}
                      ciUpper={[43280.0, 51760.0, 60700.0, 79100.0, 93660.0]}
                    />
                  </div>
                  <div id="chart-anova-boxplot">
                    <AnovaBoxPlotChart
                      title="Household Income Distribution & Outlier Box Plot by Education"
                      categories={['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate']}
                    />
                  </div>
                </div>
              )}

              {/* Regression Charts */}
              {isRegressionProcedure && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="chart-regression-residuals">
                  <ResidualPlotsView rSquared={0.624} stdError={19840.2} />
                </div>
              )}

              {/* t-Test Charts */}
              {result.procedure === 'one_sample_ttest' && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="chart-ttest">
                  <MeanComparisonChart
                    title="One-Sample Mean vs Test Value (65,000)"
                    categories={['Household Income']}
                    means={[68420.4]}
                    ciLower={[68012.3]}
                    ciUpper={[68828.5]}
                    testValueRef={65000}
                  />
                </div>
              )}

              {result.procedure === 'independent_ttest' && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="chart-ttest">
                  <MeanComparisonChart
                    title="Independent Group Means: Male vs Female"
                    categories={['Male Group', 'Female Group']}
                    means={[71240.8, 65880.4]}
                    ciLower={[70636.6, 65332.4]}
                    ciUpper={[71845.0, 66428.4]}
                  />
                </div>
              )}

              {result.procedure === 'paired_ttest' && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="chart-ttest">
                  <PairedPlotChart
                    title="Paired Measurement Change (Baseline vs Follow-up Score)"
                    var1Label="Baseline Assessment (62.4)"
                    var2Label="Follow-up Assessment (68.7)"
                    mean1={62.4}
                    mean2={68.7}
                  />
                </div>
              )}

              {/* Discriminant Scatter Plot */}
              {isDiscriminantProcedure && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="chart-discriminant-scatter">
                  <DiscriminantScatterPlot
                    func1Label="Function 1 (84.6% Var, R_c = 0.767)"
                    func2Label="Function 2 (15.4% Var, R_c = 0.454)"
                  />
                </div>
              )}

              {/* Logistic ROC and Calibration Charts */}
              {isLogisticProcedure && (activeTab === 'overview' || activeTab === 'charts') && (
                <div id="sec-charts" className="space-y-6">
                  <div id="chart-logit-roc">
                    <ROCPlotChart auc={0.884} ciLower={0.842} ciUpper={0.926} />
                  </div>
                  <div id="chart-logit-calibration">
                    <CalibrationPlotChart brierScore={0.084} />
                  </div>
                </div>
              )}

              {/* Standard Procedure Charts */}
              {!isCorrelationProcedure && !isTTestProcedure && !isAnovaProcedure && !isRegressionProcedure && !isNonparametricProcedure && !isDiscriminantProcedure && !isLogisticProcedure && (activeTab === 'overview' || activeTab === 'charts') && result.charts.length > 0 && (
                <div id="sec-charts" className="space-y-6">
                  {result.charts.map((chart) => (
                    <div key={chart.id} id={`chart-${chart.id}`} className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-3">
                      <h4 className="text-sm font-bold text-white border-b border-quantara-800 pb-3">{chart.title}</h4>
                      <DistributionChart categories={chart.categories || []} values={chart.values || []} color="#3b82f6" />
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings Section */}
              {(activeTab === 'overview' || activeTab === 'warnings') && result.warnings.length > 0 && (
                <div id="sec-warnings" className="space-y-3">
                  <h4 className="text-xs font-bold text-quantara-400 uppercase tracking-wider">Statistical Warnings</h4>
                  {result.warnings.map((w) => (
                    <div key={w.id} className="p-4 bg-blue-950/40 border border-blue-800/80 rounded-xl text-xs text-blue-200 flex items-center gap-2.5 font-medium">
                      <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span>{w.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Syntax Section */}
              {(activeTab === 'overview' || activeTab === 'syntax') && (
                <div id="sec-syntax">
                  <SyntaxViewer syntax={result.syntax} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Code Generator Modal */}
      {isCodeGenOpen && <CodeGenModal result={result} onClose={() => setIsCodeGenOpen(false)} />}
    </div>
  );
};
