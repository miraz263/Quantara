import React from 'react';
import { AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export interface CollinearityRow {
  variable: string;
  tolerance: number;
  vif: number;
  guideline?: string;
}

interface CollinearityDiagnosticsViewProps {
  rows: CollinearityRow[];
}

export const CollinearityDiagnosticsView: React.FC<CollinearityDiagnosticsViewProps> = ({ rows }) => {
  const hasHighVif = rows.some((r) => r.vif > 10);
  const hasModVif = rows.some((r) => r.vif >= 5 && r.vif <= 10);

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Collinearity Diagnostics (Tolerance & VIF)</h3>
            <p className="text-[11px] text-quantara-400">
              Evaluates variance inflation factors among predictor variables (VIF = 1 / Tolerance)
            </p>
          </div>
        </div>

        {/* Severity Status Badge */}
        {hasHighVif ? (
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> High Multicollinearity (VIF &gt; 10)
          </span>
        ) : hasModVif ? (
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-950/80 border border-amber-800 text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Moderate Multicollinearity (VIF 5–10)
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Low Collinearity Concern (All VIF &lt; 5)
          </span>
        )}
      </div>

      {/* Table of VIF & Tolerance */}
      <div className="overflow-x-auto rounded-xl border border-quantara-800 bg-quantara-950">
        <table className="w-full text-xs text-left text-quantara-200">
          <thead className="bg-quantara-900 border-b border-quantara-800 font-semibold text-quantara-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Predictor Variable</th>
              <th className="px-4 py-3 text-right">Tolerance (1/VIF)</th>
              <th className="px-4 py-3 text-right">VIF (Variance Inflation Factor)</th>
              <th className="px-4 py-3 text-left">Diagnostic Guideline Interpretation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/60 font-mono">
            {rows.map((row) => {
              const isHigh = row.vif > 10;
              const isMod = row.vif >= 5 && row.vif <= 10;
              return (
                <tr key={row.variable} className="hover:bg-quantara-900/60 transition">
                  <td className="px-4 py-2.5 font-bold font-sans text-white">{row.variable}</td>
                  <td className="px-4 py-2.5 text-right">{row.tolerance.toFixed(3)}</td>
                  <td className="px-4 py-2.5 text-right font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] border ${
                        isHigh
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : isMod
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {row.vif.toFixed(3)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-sans text-[11px] text-quantara-400">
                    {row.guideline || (isHigh ? 'High concern (VIF > 10)' : isMod ? 'Potential concern (VIF 5-10)' : 'Low concern (VIF < 5)')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Threshold Legend Footer */}
      <div className="p-3 bg-quantara-950 border border-quantara-800/80 rounded-xl text-[11px] text-quantara-400 space-y-1">
        <div className="font-semibold text-quantara-300 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Diagnostic Threshold Guidelines
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[10px]">
          <span className="text-emerald-400 font-medium">• VIF &lt; 5: Low/moderate collinearity concern</span>
          <span className="text-amber-400 font-medium">• VIF 5–10: Potential collinearity concern</span>
          <span className="text-rose-400 font-medium">• VIF &gt; 10: Severe multicollinearity concern</span>
        </div>
      </div>
    </div>
  );
};
