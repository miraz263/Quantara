import React, { useState } from 'react';
import { useQuantaraStore } from '../store/useQuantaraStore';
import { runStatisticalAnalysis, getProjectAnalyses } from '../api/analyses';
import { X, Play, Calculator, CheckSquare, Square, AlertCircle } from 'lucide-react';

export const AnalysisModal: React.FC = () => {
  const { 
    isAnalysisModalOpen, 
    setIsAnalysisModalOpen, 
    variables, 
    activeProject, 
    datasetVersionId,
    setActiveTab,
    setAnalyses,
    setSelectedAnalysis
  } = useQuantaraStore();

  const [procedure, setProcedure] = useState<string>('descriptive_statistics');
  const [selectedVars, setSelectedVars] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAnalysisModalOpen) return null;

  const toggleVar = (name: string) => {
    if (selectedVars.includes(name)) {
      setSelectedVars(selectedVars.filter(v => v !== name));
    } else {
      setSelectedVars([...selectedVars, name]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedVars.length === variables.length) {
      setSelectedVars([]);
    } else {
      setSelectedVars(variables.map(v => v.name));
    }
  };

  const handleRun = async () => {
    if (selectedVars.length === 0) {
      setErrorMessage("Please select at least one variable to analyze.");
      return;
    }
    if (!activeProject || !datasetVersionId) {
      setErrorMessage("Missing project or dataset version context.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await runStatisticalAnalysis(
        activeProject.id,
        datasetVersionId,
        procedure,
        { variables: selectedVars }
      );

      // Refresh analyses list
      const updatedList = await getProjectAnalyses(activeProject.id);
      setAnalyses(updatedList);
      setSelectedAnalysis(result);

      setIsAnalysisModalOpen(false);
      setActiveTab('analyses');
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to execute statistical procedure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-quantara-900 border border-quantara-700 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-quantara-950 border-b border-quantara-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Run Statistical Procedure</h3>
          </div>
          <button 
            onClick={() => setIsAnalysisModalOpen(false)}
            className="text-quantara-400 hover:text-white p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Procedure Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase text-quantara-400 mb-2">
              Select Procedure
            </label>
            <select
              className="w-full bg-quantara-950 border border-quantara-700 text-slate-100 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
            >
              <option value="descriptive_statistics">Descriptive Statistics (Mean, SD, Median, Normality, Charts)</option>
              <option value="frequencies">Frequency Distribution (Counts, Percentages, Valid %, Bar Charts)</option>
            </select>
          </div>

          {/* Variable Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase text-quantara-400">
                Select Variables ({selectedVars.length} of {variables.length})
              </label>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                {selectedVars.length === variables.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-52 overflow-y-auto bg-quantara-950 border border-quantara-800 rounded-lg p-3 divide-y divide-quantara-900">
              {variables.length === 0 ? (
                <p className="text-xs text-quantara-500 italic">No variables detected in active dataset.</p>
              ) : (
                variables.map((v) => {
                  const isChecked = selectedVars.includes(v.name);
                  return (
                    <div
                      key={v.id}
                      onClick={() => toggleVar(v.name)}
                      className="flex items-center justify-between py-2 px-1 cursor-pointer hover:bg-quantara-900/60 rounded px-2 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4 text-quantara-600" />
                        )}
                        <span className="text-xs font-medium text-slate-200">{v.name}</span>
                        {v.label && <span className="text-[11px] text-quantara-400">({v.label})</span>}
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 bg-quantara-800 text-quantara-300 rounded border border-quantara-700">
                        {v.measurement_level}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-quantara-950 border-t border-quantara-800">
          <button
            type="button"
            onClick={() => setIsAnalysisModalOpen(false)}
            className="px-4 py-2 text-xs text-quantara-300 hover:text-white transition font-medium"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleRun}
            disabled={isSubmitting || selectedVars.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-md transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isSubmitting ? 'Calculating...' : 'Run Statistical Engine'}
          </button>
        </div>
      </div>
    </div>
  );
};
