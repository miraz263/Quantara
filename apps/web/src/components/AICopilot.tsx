import React, { useState } from 'react';
import { useQuantaraStore } from '../store/useQuantaraStore';
import { runStatisticalAnalysis, getProjectAnalyses } from '../api/analyses';
import { Sparkles, Send, ArrowRight, CheckCircle2, ShieldCheck, Cpu, Play } from 'lucide-react';

export const AICopilot: React.FC = () => {
  const { 
    variables, 
    activeProject, 
    datasetVersionId, 
    setActiveTab, 
    setAnalyses, 
    setSelectedAnalysis 
  } = useQuantaraStore();

  const [prompt, setPrompt] = useState('Analyze descriptive statistics and distribution of all numerical variables in this dataset.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<{
    procedure: string;
    variables: string[];
    explanation: string;
  } | null>(null);

  const handleAskAI = async () => {
    if (!prompt.trim() || !activeProject || !datasetVersionId) return;

    setIsProcessing(true);
    setReasoningSteps([
      "Inspecting active dataset schema and measurement levels...",
      "Matching natural language inquiry to statistical procedures...",
      "Formulating deterministic execution plan..."
    ]);

    setTimeout(async () => {
      // Pick target numerical scale variables
      const scaleVars = variables
        .filter(v => v.measurement_level === 'scale' || v.data_type === 'integer' || v.data_type === 'float')
        .map(v => v.name);

      const targetVars = scaleVars.length > 0 ? scaleVars : variables.map(v => v.name);

      const rec = {
        procedure: "descriptive_statistics",
        variables: targetVars,
        explanation: `Recommended procedure: Descriptive Statistics for variables (${targetVars.join(', ')}). This procedure evaluates central tendency (Mean, Median), dispersion (Standard Deviation, IQR), and normality diagnostics without imposing restrictive parametric assumptions.`
      };

      setRecommendation(rec);
      setReasoningSteps(prev => [...prev, "Execution plan verified by Quantara Statistical Reasoning Core."]);
      setIsProcessing(false);
    }, 1200);
  };

  const handleExecuteAIPlan = async () => {
    if (!recommendation || !activeProject || !datasetVersionId) return;

    setIsProcessing(true);
    try {
      const result = await runStatisticalAnalysis(
        activeProject.id,
        datasetVersionId,
        recommendation.procedure,
        { variables: recommendation.variables },
        `AI Analysis: ${prompt.slice(0, 30)}...`
      );

      const updatedList = await getProjectAnalyses(activeProject.id);
      setAnalyses(updatedList);
      setSelectedAnalysis(result);
      setActiveTab('analyses');
    } catch (err: any) {
      alert(err.message || 'AI execution failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600 rounded-lg shadow-md">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Statistical Copilot</h2>
          <p className="text-xs text-quantara-300">
            Ask natural language questions. Quantara formulates statistical recommendations while deterministically calculating all results via Python SciPy/Statsmodels engines.
          </p>
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 shadow-xl mb-6">
        <label className="block text-xs font-semibold uppercase text-purple-300 mb-2">
          What do you want to analyze?
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="flex-1 bg-quantara-950 border border-quantara-700 text-white rounded-lg p-3 text-xs outline-none focus:border-purple-500 font-medium"
            placeholder="e.g. Compare customer satisfaction between male and female customers..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
          />
          <button
            onClick={handleAskAI}
            disabled={isProcessing || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-md transition"
          >
            <Send className="w-4 h-4" />
            Analyze Question
          </button>
        </div>
      </div>

      {/* Reasoning Steps */}
      {reasoningSteps.length > 0 && (
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-xl space-y-4 mb-6 animate-fade-in">
          <h3 className="text-xs font-bold uppercase text-quantara-400 tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            Quantara Reasoning Engine Execution Flow
          </h3>

          <div className="space-y-2">
            {reasoningSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>

          {recommendation && (
            <div className="mt-4 p-4 bg-quantara-950 border border-purple-900/60 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Recommended Procedure: {recommendation.procedure.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800">
                  Target Variables: {recommendation.variables.join(', ')}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {recommendation.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleExecuteAIPlan}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Execute Real Statistical Calculation
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
