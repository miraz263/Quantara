import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Sliders, Layers, Info, AlertTriangle, ShieldCheck, Sparkles, GitCommit } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface HierarchicalConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const HierarchicalConfigView: React.FC<HierarchicalConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>([
    'income', 'satisfaction', 'age', 'work_exp', 'quality_score', 'loyalty_index'
  ]);

  // Options State
  const [numberOfClusters, setNumberOfClusters] = useState<number>(4);
  const [linkageMethod, setLinkageMethod] = useState<'ward' | 'single' | 'complete' | 'average'>('ward');
  const [distanceMetric, setDistanceMetric] = useState<'squared_euclidean' | 'euclidean' | 'manhattan'>('squared_euclidean');
  const [standardizationMethod, setStandardizationMethod] = useState<'zscore' | 'minmax' | 'robust' | 'none'>('zscore');

  // Diagnostics Toggles
  const [silhouetteAnalysis, setSilhouetteAnalysis] = useState<boolean>(true);
  const [saveClusterVariable, setSaveClusterVariable] = useState<boolean>(true);

  const selectedItems = availableVariables.filter((v) => selectedVariables.includes(v.name));
  const hasCategorical = selectedItems.some((v) => v.measure === 'nominal' || v.dataType === 'string');
  const isValid = selectedVariables.length >= 2;

  const handleRun = () => {
    if (!isValid) return;

    onRunAnalysis({
      procedure: 'hierarchical',
      title: `Hierarchical Cluster Analysis (Ward's Linkage, Cut K=${numberOfClusters})`,
      variables: selectedVariables,
      options: {
        clusterProcedure: 'hierarchical',
        numberOfClusters,
        linkageMethod,
        distanceMetric,
        standardizationMethod,
        silhouetteAnalysis,
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
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 uppercase tracking-wider">
              Cluster Analysis (Module 13)
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Agglomerative Hierarchical Clustering</h1>
          </div>
          <p className="text-xs text-quantara-400 mt-1">
            Build nested hierarchical cluster tree with dendrogram cut at optimal K
          </p>
        </div>
      </div>

      {/* Conceptual Banner */}
      <div className="p-4 bg-purple-950/40 border border-purple-800/80 rounded-xl text-xs text-purple-200 space-y-1.5 leading-relaxed">
        <div className="font-bold text-purple-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-purple-400" />
          Agglomerative Hierarchical Clustering Guidelines
        </div>
        <p>
          Agglomerative clustering begins with N single-observation clusters and iteratively merges closest pairs based on linkage criterion.
          Ward's minimum variance linkage minimizes within-cluster sum of squares and is recommended for scale variables.
        </p>
      </div>

      {/* Variable Selection Section */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" /> Select Clustering Variables (Numeric Scale Metrics)
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
            <span>At least 2 numeric scale variables are required for Agglomerative Hierarchical Analysis.</span>
          </div>
        )}

        {hasCategorical && (
          <div className="p-3 bg-amber-950/50 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Warning: Selected variables contain categorical items. Distance metrics require numerical scale metrics.</span>
          </div>
        )}

        {/* Sample Info */}
        <div className="text-xs font-mono text-quantara-400 bg-quantara-950 p-3 rounded-xl border border-quantara-800 flex flex-wrap items-center justify-between gap-3">
          <div>Selected Variables: <span className="text-white font-bold">{selectedVariables.length}</span></div>
          <div>Observations N: <span className="text-white font-bold">2,432</span></div>
          <div>Tree Cut K: <span className="text-purple-400 font-bold">{numberOfClusters}</span></div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Linkage & Distance Settings */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" /> Linkage & Distance Criterion
          </h3>

          <div className="space-y-4 text-xs text-quantara-200">
            <div>
              <label className="block text-quantara-300 mb-1.5 font-medium">Linkage Method</label>
              <select
                value={linkageMethod}
                onChange={(e) => setLinkageMethod(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 font-mono text-xs outline-none focus:border-purple-500"
              >
                <option value="ward">Ward's Minimum Variance Method (Default — Min WCSS)</option>
                <option value="complete">Complete Linkage (Maximum Distance / Compact Clusters)</option>
                <option value="average">Average Linkage (UPGMA — Mean Inter-Cluster Distance)</option>
                <option value="single">Single Linkage (Minimum Distance / Nearest Neighbor)</option>
              </select>
            </div>

            <div>
              <label className="block text-quantara-300 mb-1.5 font-medium">Distance Metric</label>
              <select
                value={distanceMetric}
                onChange={(e) => setDistanceMetric(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 font-mono text-xs outline-none focus:border-purple-500"
              >
                <option value="squared_euclidean">Squared Euclidean Distance (Required for Ward's Method)</option>
                <option value="euclidean">Euclidean Distance (Straight Line Geometry)</option>
                <option value="manhattan">Manhattan / City Block Distance (L1 Norm)</option>
              </select>
            </div>

            <div>
              <label className="block text-quantara-300 mb-1.5 font-medium font-bold text-white">
                Dendrogram Cut Point (Target Clusters K)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={numberOfClusters}
                  onChange={(e) => setNumberOfClusters(parseInt(e.target.value))}
                  className="flex-1 accent-purple-500"
                />
                <span className="w-12 text-center bg-quantara-950 border border-quantara-700 text-white rounded py-1 font-mono font-bold">
                  {numberOfClusters}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Standardization & Derived Output */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Standardization & Derived Variable Options
          </h3>

          <div className="space-y-3 text-xs text-quantara-200">
            <div>
              <label className="block text-quantara-300 mb-1.5 font-medium">Variable Standardization Method</label>
              <select
                value={standardizationMethod}
                onChange={(e) => setStandardizationMethod(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 font-mono text-xs outline-none focus:border-purple-500"
              >
                <option value="zscore">Z-score (Mean = 0, SD = 1 — Recommended)</option>
                <option value="minmax">Min-Max Normalization ([0, 1] Range)</option>
                <option value="none">None (Raw Unit Metrics)</option>
              </select>
            </div>

            <div className="space-y-2 pt-3 border-t border-quantara-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={silhouetteAnalysis}
                  onChange={(e) => setSilhouetteAnalysis(e.target.checked)}
                  className="rounded border-quantara-700 text-purple-500 focus:ring-0"
                />
                <span>Calculate Silhouette Validation Scores for Cut Solution</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-white pt-1">
                <input
                  type="checkbox"
                  checked={saveClusterVariable}
                  onChange={(e) => setSaveClusterVariable(e.target.checked)}
                  className="rounded border-quantara-700 text-emerald-500 focus:ring-0"
                />
                <span>Save Hierarchical Cluster Membership Variable to Dataset</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-quantara-400 font-mono flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-purple-400" />
          <span>Agglomerative Tree Merger (Ward's Linkage + Sq Euclidean)</span>
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
            <Sparkles className="w-4 h-4 text-purple-300" />
          )}
          Run Hierarchical Clustering
        </Button>
      </div>
    </div>
  );
};
