import React, { useState } from 'react';
import { Sliders, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface FactorLoadingRow {
  variable: string;
  primaryFactor: string;
  loadings: Record<string, number>;
  crossLoading?: boolean;
}

interface FactorLoadingMatrixViewProps {
  title?: string;
  subtitle?: string;
  factors: Array<{ id: string; defaultName: string }>;
  rows: FactorLoadingRow[];
  threshold?: number;
}

export const FactorLoadingMatrixView: React.FC<FactorLoadingMatrixViewProps> = ({
  title = 'Rotated Factor / Component Loading Matrix',
  subtitle = 'Pattern matrix coefficients representing unique factor-variable relationships',
  factors: initialFactors,
  rows,
  threshold = 0.30,
}) => {
  const [factors, setFactors] = useState(initialFactors);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [suppressSmall, setSuppressSmall] = useState(true);

  const handleSaveName = (id: string) => {
    if (tempName.trim()) {
      setFactors((prev) => prev.map((f) => (f.id === id ? { ...f, defaultName: tempName.trim() } : f)));
    }
    setEditingId(null);
    setTempName('');
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-quantara-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-lg">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
            <p className="text-[11px] text-quantara-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setSuppressSmall(!suppressSmall)}
            className={`px-3 py-1 rounded-lg border text-xs font-sans font-semibold transition ${
              suppressSmall ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-quantara-950 text-quantara-400 border-quantara-800'
            }`}
          >
            {suppressSmall ? `Suppressed (< .30)` : 'Showing All Loadings'}
          </button>
        </div>
      </div>

      {/* Factor Custom Renaming Headers */}
      <div className="flex items-center gap-2 text-xs bg-quantara-950 border border-quantara-800 p-3 rounded-xl font-mono">
        <span className="text-quantara-400 font-sans text-[11px] font-semibold">Semantic Factor Labels:</span>
        {factors.map((f) => (
          <div key={f.id} className="flex items-center gap-1.5 bg-quantara-900 border border-quantara-700 px-2.5 py-1 rounded-lg">
            {editingId === f.id ? (
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName(f.id)}
                className="bg-quantara-950 text-white border border-blue-500 rounded px-1 text-xs outline-none"
                autoFocus
              />
            ) : (
              <span className="font-bold text-white">{f.defaultName}</span>
            )}
            <button
              onClick={() => {
                setEditingId(f.id);
                setTempName(f.defaultName);
              }}
              className="text-quantara-400 hover:text-blue-400 transition"
              title="Rename Factor"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-quantara-800 bg-quantara-950">
        <table className="w-full text-xs text-left text-quantara-200">
          <thead className="bg-quantara-900 border-b border-quantara-800 font-semibold text-quantara-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Observed Variable Item</th>
              <th className="px-4 py-3 text-center">Primary Factor</th>
              {factors.map((f) => (
                <th key={f.id} className="px-4 py-3 text-right">{f.defaultName}</th>
              ))}
              <th className="px-4 py-3 text-center">Diagnostics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/60 font-mono">
            {rows.map((row, idx) => {
              const isCrossLoaded = row.crossLoading;

              return (
                <tr key={row.variable || idx} className="hover:bg-quantara-900/60 transition">
                  <td className="px-4 py-2.5 font-bold font-sans text-white text-xs">{row.variable}</td>
                  <td className="px-4 py-2.5 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      {row.primaryFactor}
                    </span>
                  </td>
                  {factors.map((f) => {
                    const val = row.loadings[f.id] !== undefined ? row.loadings[f.id] : 0;
                    const isSuppressed = suppressSmall && Math.abs(val) < threshold;

                    return (
                      <td
                        key={f.id}
                        className={`px-4 py-2.5 text-right font-bold ${
                          isSuppressed
                            ? 'text-quantara-600 font-normal'
                            : Math.abs(val) >= 0.7
                            ? 'text-emerald-400'
                            : Math.abs(val) >= 0.4
                            ? 'text-blue-400'
                            : 'text-quantara-300'
                        }`}
                      >
                        {isSuppressed ? '—' : val.toFixed(3)}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2.5 text-center font-sans">
                    {isCrossLoaded ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 inline-flex items-center gap-1" title="Substantial loading (> 0.40) on multiple factors">
                        <AlertCircle className="w-3 h-3 text-amber-400" /> Cross-loading
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-quantara-900 text-quantara-500 border border-quantara-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Clean
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
