import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Sliders, Layers, Info, AlertTriangle, ShieldCheck, Sparkles, Cpu, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface KMeansConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const KMeansConfigView: React.FC<KMeansConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>([
    'income', 'satisfaction', 'age', 'work_exp', 'quality_score', 'loyalty_index'
  ]);

  // Options State
  const [numberOfClusters, setNumberOfClusters] = useState<number>(4);
  const [standardizationMethod, setStandardizationMethod] = useState<'zscore' | 'minmax' | 'robust' | 'none'>('zscore');
  const [initializationMethod, setInitializationMethod] = useState<'kmeans_plus_plus' | 'random'>('kmeans_plus_plus');
  const [randomSeed, setRandomSeed] = useState<number>(42);
  const [maxIterations, setMaxIterations] = useState<number>(100);
  const [convergenceTolerance, setConvergenceTolerance] = useState<number>(0.0001);

  // Diagnostics & Validation Toggles
  const [silhouetteAnalysis, setSilhouetteAnalysis] = useState<boolean>(true);
  const [elbowMethod, setElbowMethod] = useState<boolean>(true);
  const [calinskiHarabasz, setCalinskiHarabasz] = useState<boolean>(true);
  const [daviesBouldin, setDaviesBouldin] = useState<boolean>(true);
  const [saveClusterVariable, setSaveClusterVariable] = useState<boolean>(true);

  // Check if any non-scale categorical variable is selected to warn user
  const selectedItems = availableVariables.filter((v) => selectedVariables.includes(v.name));
  const hasCategorical = selectedItems.some((v) => v.measure === 'nominal' || v.dataType === 'string');
  const isValid = selectedVariables.length >= 2;

  const handleRun = () => {
    if (!isValid) return;

    onRunAnalysis({
      procedure: 'kmeans',
      title: `K-Means Cluster Analysis (K=${numberOfClusters}, ${selectedVariables.length} Vars)`,
      variables: selectedVariables,
      options: {
        clusterProcedure: 'kmeans',
        numberOfClusters,
        standardizationMethod,
        initializationMethod,
        randomSeed,
        maxIterations,
        convergenceTolerance,
        silhouetteAnalysis,
        elbowMethod,
        calinskiHarabasz,
        daviesBouldin,
        saveClusterVariable,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase tracking-wider">
              Cluster Analysis (Module 13)
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">K-Means Clustering Analysis</h1>
          </div>
          <p className="text-xs text-quantara-400 mt-1">
            Partition observations into K distinct centroids optimizing within-cluster sum of squares (WCSS)
          </p>
        </div>
      </div>

      {/* Conceptual Banner */}
      <div className="p-4 bg-indigo-950/40 border border-indigo-800/80 rounded-xl text-xs text-indigo-200 space-y-1.5 leading-relaxed">
        <div className="font-bold text-indigo-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-400" />
          K-Means Clustering Method Guidelines
        </div>
        <p>
          K-Means partitions N observations into K clusters using deterministic K-Means++ initialization and Euclidean distance.
          Variables are standardized to Z-scores by default so magnitude differences (e.g. Income vs Satisfaction) do not distort cluster distance.
        </p>
      </div>

      {/* Variable Selection Section */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" /> Select Clustering Variables (Numeric Scale Metrics)
        </h3>

        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={selectedVariables}
          onChangeSelected={setSelectedVariables}
        />

        {/* Validation Warnings */}
        {!isValid && (
          <div className="p-3 bg-amber-950/50 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>At least 2 numeric scale variables are required for K-Means cluster analysis.</span>
          </div>
        )}

        {hasCategorical && (
          <div className="p-3 bg-amber-950/50 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Warning: Selected variables contain categorical/nominal items. K-Means Euclidean distance requires numerical scale metrics.</span>
          </div>
        )}

        {/* Sample Info */}
        <div className="text-xs font-mono text-quantara-400 bg-quantara-950 p-3 rounded-xl border border-quantara-800 flex flex-wrap items-center justify-between gap-3">
          <div>Selected Variables: <span className="text-white font-bold">{selectedVariables.length}</span></div>
          <div>Observations: <span className="text-white font-bold">2,432</span></div>
          <div>Target Clusters K: <span className="text-indigo-400 font-bold">{numberOfClusters}</span></div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solution Parameters */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" /> K-Means Algorithm Parameters
          </h3>

          <div className="space-y-4 text-xs text-quantara-200">
            <div>
              <label className="block text-quantara-300 mb-1.5 font-medium">Number of Clusters (K)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={numberOfClusters}
                  onChange={(e) => setNumberOfClusters(parseInt(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <span className="w-12 text-center bg-quantara-950 border border-quantara-700 text-white rounded py-1 font-mono font-bold">
                  {numberOfClusters}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-quantara-300 mb-1.5 font-medium">Variable Standardization Method</label>
              <select
                value={standardizationMethod}
                onChange={(e) => setStandardizationMethod(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 font-mono text-xs outline-none focus:border-indigo-500"
              >
                <option value="zscore">Z-score (Mean = 0, SD = 1 — Recommended)</option>
                <option value="minmax">Min-Max Normalization ([0, 1] Range)</option>
                <option value="robust">Robust Scaling (Median & IQR)</option>
                <option value="none">None (Raw Unit Metrics)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-quantara-800">
              <div>
                <label className="block text-quantara-300 mb-1 font-medium">Initialization</label>
                <select
                  value={initializationMethod}
                  onChange={(e) => setInitializationMethod(e.target.value as any)}
                  className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 font-mono text-xs outline-none focus:border-indigo-500"
                >
                  <option value="kmeans_plus_plus">K-Means++ (Smart Seeding)</option>
                  <option value="random">Random Initialization</option>
                </select>
              </div>

              <div>
                <label className="block text-quantara-300 mb-1 font-medium">Random Seed</label>
                <input
                  type="number"
                  value={randomSeed}
                  onChange={(e) => setRandomSeed(parseInt(e.target.value) || 42)}
                  className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 font-mono text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Validation & Output Diagnostics */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Internal Validation & Diagnostics
          </h3>

          <div className="space-y-2.5 text-xs text-quantara-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={silhouetteAnalysis}
                onChange={(e) => setSilhouetteAnalysis(e.target.checked)}
                className="rounded border-quantara-700 text-indigo-500 focus:ring-0"
              />
              <span>Silhouette Coefficient Analysis (s_i Per Cluster & Average)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={elbowMethod}
                onChange={(e) => setElbowMethod(e.target.checked)}
                className="rounded border-quantara-700 text-indigo-500 focus:ring-0"
              />
              <span>Elbow Method Curve (WCSS vs K Multi-Solution Evaluation)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={calinskiHarabasz}
                onChange={(e) => setCalinskiHarabasz(e.target.checked)}
                className="rounded border-quantara-700 text-indigo-500 focus:ring-0"
              />
              <span>Calinski-Harabasz Variance Ratio Index</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={daviesBouldin}
                onChange={(e) => setDaviesBouldin(e.target.checked)}
                className="rounded border-quantara-700 text-indigo-500 focus:ring-0"
              />
              <span>Davies-Bouldin Separation Index</span>
            </label>

            <div className="pt-3 border-t border-quantara-800">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                <input
                  type="checkbox"
                  checked={saveClusterVariable}
                  onChange={(e) => setSaveClusterVariable(e.target.checked)}
                  className="rounded border-quantara-700 text-emerald-500 focus:ring-0"
                />
                <span>Generate & Save Derived Cluster Membership Variable to Dataset</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-quantara-400 font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Deterministic K-Means Engine (Lloyd's Algorithm + Seed {randomSeed})</span>
        </div>

        <Button
          onClick={handleRun}
          disabled={!isValid || isSubmitting}
          variant="primary"
          size="lg"
          className="flex items-center gap-2 shadow-xl px-6"
        >
          {isSubmitting ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-300" />
          )}
          Run K-Means Cluster Analysis
        </Button>
      </div>
    </div>
  );
};
