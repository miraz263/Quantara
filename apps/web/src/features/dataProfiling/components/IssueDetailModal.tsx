import React from 'react';
import { QualityIssue } from '../types/profilingTypes';
import { X, AlertCircle, AlertTriangle, Info, ArrowRight, Database } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface IssueDetailModalProps {
  issue: QualityIssue;
  onNavigateToDataEditor: (variableName?: string) => void;
  onClose: () => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onNavigateToDataEditor,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-quantara-950 border-b border-quantara-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {issue.severity === 'critical' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : issue.severity === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            ) : (
              <Info className="w-5 h-5 text-blue-400" />
            )}
            <div>
              <h3 className="font-bold text-sm text-white">{issue.title}</h3>
              {issue.variableName && (
                <span className="text-xs text-quantara-400 font-mono">
                  Variable: <strong className="text-blue-400 font-bold">{issue.variableName}</strong>
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-quantara-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Description */}
          <div className="bg-quantara-950 p-3.5 rounded-xl border border-quantara-800 space-y-1">
            <div className="text-[11px] font-semibold text-quantara-400 uppercase tracking-wider">
              Issue Diagnostics
            </div>
            <p className="text-quantara-200 leading-relaxed font-sans">{issue.description}</p>
          </div>

          {/* Metric Pill */}
          {issue.metric !== undefined && (
            <div className="flex items-center justify-between p-3 bg-quantara-950 rounded-xl border border-quantara-800">
              <span className="text-quantara-400 font-medium">{issue.metricLabel || 'Measured Metric'}:</span>
              <span className="text-base font-bold text-white font-mono">{issue.metric}</span>
            </div>
          )}

          {/* Recommendation */}
          {issue.recommendation && (
            <div className="p-3.5 bg-blue-950/40 border border-blue-800/80 rounded-xl space-y-1 text-blue-200">
              <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                Recommended Action
              </div>
              <p className="leading-relaxed">{issue.recommendation}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-quantara-950 border-t border-quantara-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quantara-800 hover:bg-quantara-700 text-white text-xs rounded-lg transition border border-quantara-700 font-medium"
          >
            Close
          </button>

          <Button
            onClick={() => onNavigateToDataEditor(issue.variableName)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" /> Inspect in Data Editor <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
