import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProcedureType, VariableItem, AnalysisRequest, AnalysisResult } from '../types/analysisTypes';
import { StatisticalService } from '../services/statisticalService';
import { AnalysisSidebar } from '../components/AnalysisSidebar';
import { DescriptivesConfigView } from './DescriptivesConfigView';
import { FrequenciesConfigView } from './FrequenciesConfigView';
import { ExploreConfigView } from './ExploreConfigView';
import { CrosstabsConfigView } from './CrosstabsConfigView';
import { PearsonConfigView } from './PearsonConfigView';
import { SpearmanConfigView } from './SpearmanConfigView';
import { KendallConfigView } from './KendallConfigView';
import { PartialConfigView } from './PartialConfigView';
import { OneSampleTTestConfigView } from './OneSampleTTestConfigView';
import { IndependentTTestConfigView } from './IndependentTTestConfigView';
import { PairedTTestConfigView } from './PairedTTestConfigView';
import { OneWayANOVAConfigView } from './OneWayANOVAConfigView';
import { LinearRegressionConfigView } from './LinearRegressionConfigView';
import { MannWhitneyConfigView } from './MannWhitneyConfigView';
import { WilcoxonSignedRankConfigView } from './WilcoxonSignedRankConfigView';
import { KruskalWallisConfigView } from './KruskalWallisConfigView';
import { FriedmanConfigView } from './FriedmanConfigView';
import { PCAConfigView } from './PCAConfigView';
import { EFAConfigView } from './EFAConfigView';
import { KMeansConfigView } from './KMeansConfigView';
import { HierarchicalConfigView } from './HierarchicalConfigView';
import { DiscriminantConfigView } from './DiscriminantConfigView';
import { LogisticConfigView } from './LogisticConfigView';
import { AnalysisResultView } from './AnalysisResultView';
import { BarChart2, RefreshCw, History, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const AnalyzeWorkspacePage: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();

  const [activeProcedure, setActiveProcedure] = useState<ProcedureType>('descriptives');
  const [variables, setVariables] = useState<VariableItem[]>([]);
  const [loadingVars, setLoadingVars] = useState(true);

  // Active result state
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadInitialData = useCallback(async () => {
    setLoadingVars(true);
    try {
      const available = await StatisticalService.getAvailableVariables(datasetId);
      setVariables(available);

      const history = await StatisticalService.listAnalyses(datasetId);
      setSavedAnalyses(history);
    } catch (err) {
      console.error('Failed to load analyze workspace variables:', err);
    } finally {
      setLoadingVars(false);
    }
  }, [datasetId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleRunAnalysis = async (requestPayload: Partial<AnalysisRequest>) => {
    setIsSubmitting(true);
    try {
      const fullRequest: AnalysisRequest = {
        id: `ana-${Date.now()}`,
        datasetId: datasetId || 'ds-001',
        datasetVersion: 3,
        procedure: requestPayload.procedure || activeProcedure,
        title: requestPayload.title || `${activeProcedure.toUpperCase()} Analysis`,
        variables: requestPayload.variables || [],
        groupingVariables: requestPayload.groupingVariables,
        options: requestPayload.options || {},
        createdAt: new Date().toISOString(),
      };

      const result = await StatisticalService.runAnalysis(fullRequest);
      setActiveResult(result);
      const updatedHistory = await StatisticalService.listAnalyses(datasetId);
      setSavedAnalyses(updatedHistory);
    } catch (err) {
      alert('Failed to execute statistical procedure.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveResult = async (result: AnalysisResult) => {
    const updatedHistory = await StatisticalService.listAnalyses(datasetId);
    setSavedAnalyses(updatedHistory);
  };

  const handleDuplicateResult = async (result: AnalysisResult) => {
    const duplicated = await StatisticalService.duplicateAnalysis(result.id);
    setActiveResult(duplicated);
    const updatedHistory = await StatisticalService.listAnalyses(datasetId);
    setSavedAnalyses(updatedHistory);
  };

  const handleDeleteResult = async (resultId: string) => {
    await StatisticalService.deleteAnalysis(resultId);
    if (activeResult?.id === resultId) {
      setActiveResult(null);
    }
    const updatedHistory = await StatisticalService.listAnalyses(datasetId);
    setSavedAnalyses(updatedHistory);
  };

  return (
    <div className="flex h-full bg-quantara-950 font-sans overflow-hidden">
      {/* Procedure Sidebar */}
      <AnalysisSidebar
        activeProcedure={activeProcedure}
        onSelectProcedure={(proc) => {
          setActiveProcedure(proc);
          setActiveResult(null);
        }}
      />

      {/* Main Analysis Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeResult ? (
          <AnalysisResultView
            result={activeResult}
            onBackToConfig={() => setActiveResult(null)}
            onSaveResult={handleSaveResult}
            onDuplicateResult={handleDuplicateResult}
            onDeleteResult={handleDeleteResult}
          />
        ) : loadingVars ? (
          <div className="flex flex-col items-center justify-center h-full text-quantara-400">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
            <span className="text-xs">Initializing statistical engine workspace...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col justify-between">
            {/* Top Config Form View */}
            <div>
              {activeProcedure === 'descriptives' && (
                <DescriptivesConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'frequencies' && (
                <FrequenciesConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'explore' && (
                <ExploreConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'crosstabs' && (
                <CrosstabsConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'pearson' && (
                <PearsonConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'spearman' && (
                <SpearmanConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'kendall' && (
                <KendallConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'partial_correlation' && (
                <PartialConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'one_sample_ttest' && (
                <OneSampleTTestConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'independent_ttest' && (
                <IndependentTTestConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'paired_ttest' && (
                <PairedTTestConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'one_way_anova' && (
                <OneWayANOVAConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'linear_regression' && (
                <LinearRegressionConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'mann_whitney' && (
                <MannWhitneyConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'wilcoxon_signed_rank' && (
                <WilcoxonSignedRankConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'kruskal_wallis' && (
                <KruskalWallisConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'friedman' && (
                <FriedmanConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'pca' && (
                <PCAConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'efa' && (
                <EFAConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'kmeans' && (
                <KMeansConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'hierarchical' && (
                <HierarchicalConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'discriminant' && (
                <DiscriminantConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
              {activeProcedure === 'logistic_regression' && (
                <LogisticConfigView
                  availableVariables={variables}
                  onRunAnalysis={handleRunAnalysis}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            {/* Bottom Saved Recent Analyses History Bar */}
            {savedAnalyses.length > 0 && (
              <div className="p-6 border-t border-quantara-800 bg-quantara-900/60 max-w-5xl mx-auto w-full space-y-3">
                <div className="flex items-center justify-between text-xs text-quantara-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-white">
                    <History className="w-4 h-4 text-blue-400" /> Recent Statistical Output History ({savedAnalyses.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {savedAnalyses.slice(0, 6).map((res) => (
                    <button
                      key={res.id}
                      onClick={() => setActiveResult(res)}
                      className="p-3 bg-quantara-950 border border-quantara-800 hover:border-blue-500/80 rounded-xl text-left transition group space-y-1"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 truncate">
                        {res.title}
                      </div>
                      <div className="text-[10px] text-quantara-400 font-mono flex items-center justify-between">
                        <span className="uppercase">{res.procedure}</span>
                        <span>{new Date(res.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
