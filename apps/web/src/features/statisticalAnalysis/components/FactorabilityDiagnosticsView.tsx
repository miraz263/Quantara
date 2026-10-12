import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface FactorabilityDiagnosticsViewProps {
  kmoValue?: number;
  bartlettChiSq?: number;
  bartlettDf?: number;
  bartlettPValue?: string | number;
  antiImageMsa?: Record<string, number>;
}

export const FactorabilityDiagnosticsView: React.FC<FactorabilityDiagnosticsViewProps> = ({
  kmoValue = 0.84,
  bartlettChiSq = 1842.60,
  bartlettDf = 153,
  bartlettPValue = '< .001',
  antiImageMsa,
}) => {
  const getKmoLabel = (val: number) => {
    if (val >= 0.9) return { text: 'Marvelous (KMO ≥ .90)', bg: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
    if (val >= 0.8) return { text: 'Meritorious / Good (KMO ≥ .80)', bg: 'bg-blue-950 text-blue-300 border-blue-800' };
    if (val >= 0.7) return { text: 'Middling / Acceptable (KMO ≥ .70)', bg: 'bg-indigo-950 text-indigo-300 border-indigo-800' };
    if (val >= 0.6) return { text: 'Mediocre / Marginal (KMO ≥ .60)', bg: 'bg-amber-950 text-amber-300 border-amber-800' };
    return { text: 'Unacceptable / Concern (KMO < .60)', bg: 'bg-rose-950 text-rose-300 border-rose-800' };
  };

  const kmoBadge = getKmoLabel(kmoValue);
  const isBartlettSig = String(bartlettPValue).includes('<') || parseFloat(String(bartlettPValue)) < 0.05;

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Factorability & Sampling Adequacy Diagnostics</h3>
            <p className="text-[11px] text-quantara-400">
              Evaluates matrix factorability prior to component or factor extraction
            </p>
          </div>
        </div>
        <span className="text-[10px] text-quantara-400 uppercase tracking-wider font-semibold">
          Kaiser-Meyer-Olkin & Bartlett
        </span>
      </div>

      {/* Main KMO & Bartlett Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KMO Card */}
        <div className="bg-quantara-950 border border-quantara-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-quantara-300 uppercase tracking-wider">Overall KMO Measure</span>
            <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${kmoBadge.bg}`}>
              {kmoBadge.text}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <div className="text-3xl font-mono font-bold text-white tracking-tight">{kmoValue.toFixed(3)}</div>
            <div className="text-xs text-quantara-400">
              Target threshold: <span className="font-mono text-quantara-200">≥ 0.60</span>
            </div>
          </div>

          <p className="text-[11px] text-quantara-400 leading-relaxed border-t border-quantara-800/80 pt-2.5">
            General guideline — KMO measure of <span className="text-white font-semibold font-mono">{kmoValue.toFixed(2)}</span> indicates that patterns of correlations are relatively compact and variables share substantial common variance.
          </p>
        </div>

        {/* Bartlett's Test Card */}
        <div className="bg-quantara-950 border border-quantara-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-quantara-300 uppercase tracking-wider">Bartlett's Test of Sphericity</span>
            {isBartlettSig ? (
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Statistically Significant
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Not Significant
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-center pt-1">
            <div className="bg-quantara-900 p-2 rounded-lg border border-quantara-800">
              <div className="text-[10px] text-quantara-400 font-sans">Chi-Square (χ²)</div>
              <div className="text-sm font-bold text-blue-400 mt-0.5">{bartlettChiSq.toLocaleString()}</div>
            </div>
            <div className="bg-quantara-900 p-2 rounded-lg border border-quantara-800">
              <div className="text-[10px] text-quantara-400 font-sans">Degrees of Freedom</div>
              <div className="text-sm font-bold text-quantara-200 mt-0.5">{bartlettDf}</div>
            </div>
            <div className="bg-quantara-900 p-2 rounded-lg border border-quantara-800">
              <div className="text-[10px] text-quantara-400 font-sans">p-value</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{bartlettPValue}</div>
            </div>
          </div>

          <p className="text-[11px] text-quantara-400 leading-relaxed border-t border-quantara-800/80 pt-2.5">
            The test statistic provides evidence against the null hypothesis of an identity correlation matrix (p &lt; .001), supporting matrix factorability.
          </p>
        </div>
      </div>

      {/* Anti-Image MSA Preview if provided */}
      {antiImageMsa && Object.keys(antiImageMsa).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-quantara-300 uppercase tracking-wider">Anti-Image Correlation Matrix (Diagonal MSA Values)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-mono">
            {Object.entries(antiImageMsa).map(([item, val]) => (
              <div key={item} className="p-2 bg-quantara-950 border border-quantara-800 rounded-lg flex items-center justify-between">
                <span className="font-sans font-semibold text-quantara-300 text-[11px]">{item}</span>
                <span className={`font-bold ${val >= 0.7 ? 'text-emerald-400' : val >= 0.6 ? 'text-blue-400' : 'text-amber-400'}`}>
                  {val.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
