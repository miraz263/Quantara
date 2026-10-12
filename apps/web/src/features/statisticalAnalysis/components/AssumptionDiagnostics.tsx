import React from 'react';
import { ShieldCheck, AlertCircle, Info, Activity } from 'lucide-react';

interface AssumptionDiagnosticsProps {
  procedure: string;
  leveneF?: number;
  leveneP?: number;
  shapiroW?: number;
  shapiroP?: number;
}

export const AssumptionDiagnostics: React.FC<AssumptionDiagnosticsProps> = ({
  procedure,
  leveneF = 14.82,
  leveneP = 0.0002,
  shapiroW = 0.984,
  shapiroP = 0.124,
}) => {
  const isLeveneSignificant = leveneP < 0.05;
  const isNormalityViolation = shapiroP < 0.05;

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          Statistical Assumption Diagnostics & Variance Equality
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-quantara-950 text-quantara-400 border border-quantara-800">
          Rule-Based Diagnostic Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Levene's Test Diagnostic */}
        <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span>Levene's Test (Homogeneity of Variances)</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isLeveneSignificant ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              F = {leveneF.toFixed(2)}, p {leveneP < 0.001 ? '< .001' : `= ${leveneP.toFixed(3)}`}
            </span>
          </div>

          <p className="text-quantara-400 text-[11px] leading-relaxed">
            {isLeveneSignificant
              ? 'The variance-equality diagnostic indicates evidence of unequal group variances (p < .05). Consider the Welch t-test result (Equal Variances Not Assumed).'
              : 'Equal variance assumption appears satisfied across groups (p ≥ .05). Standard Student t-test results may be interpreted.'}
          </p>

          <div className="pt-2 border-t border-quantara-800/60 flex items-center gap-1.5 text-[10px] text-quantara-400 font-mono">
            <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span>Diagnostic recommendation is rule-based and transparent.</span>
          </div>
        </div>

        {/* Normality Diagnostic */}
        <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span>Shapiro-Wilk Normality Diagnostic</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isNormalityViolation ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              W = {shapiroW.toFixed(3)}, p {shapiroP < 0.001 ? '< .001' : `= ${shapiroP.toFixed(3)}`}
            </span>
          </div>

          <p className="text-quantara-400 text-[11px] leading-relaxed">
            {isNormalityViolation
              ? 'Significant departure from normality detected (p < .05). For robust inference in non-normal distributions or small N, consider non-parametric Mann-Whitney / Wilcoxon procedures.'
              : 'No significant departure from normality observed (p ≥ .05). Distributional assumptions for parametric t-test are met.'}
          </p>

          <div className="pt-2 border-t border-quantara-800/60 flex items-center gap-1.5 text-[10px] text-quantara-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Central Limit Theorem applies for large sample sizes (N &gt; 30).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
