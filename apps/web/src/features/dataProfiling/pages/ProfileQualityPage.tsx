import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DatasetProfile, QualityIssue, ValidationRule } from '../types/profilingTypes';
import { ProfilingService } from '../services/profilingService';
import { RuleBuilderModal } from '../components/RuleBuilderModal';
import { IssueDetailModal } from '../components/IssueDetailModal';
import { ShieldCheck, Plus, AlertCircle, AlertTriangle, Info, CheckCircle2, Database, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ProfileQualityPage: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<QualityIssue | null>(null);
  const [customRules, setCustomRules] = useState<ValidationRule[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await ProfilingService.getProfile(datasetId);
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile for quality checks:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [datasetId]);

  if (loading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-quantara-400">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-xs">Evaluating data validation rules...</span>
      </div>
    );
  }

  const handleAddRule = (rule: ValidationRule) => {
    setCustomRules([...customRules, rule]);
    setIsRuleModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Top Header & Rule Builder Action */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Consolidated Quality Issue Center & Rule Engine
          </h3>
          <p className="text-xs text-quantara-400 mt-0.5">
            Automated verification of invalid values, range bounds, type anomalies, and constant flags.
          </p>
        </div>

        <Button
          onClick={() => setIsRuleModalOpen(true)}
          variant="primary"
          size="sm"
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Custom Validation Rule
        </Button>
      </div>

      {/* Custom Rules List if present */}
      {customRules.length > 0 && (
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Active User-Defined Validation Rules ({customRules.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {customRules.map((r) => (
              <span
                key={r.id}
                className="px-3 py-1.5 bg-blue-950/80 border border-blue-800 text-blue-300 rounded-lg text-xs font-mono font-semibold flex items-center gap-2"
              >
                <span>{r.variableName}:</span>
                <span className="text-white">{r.ruleType}</span>
                {r.min !== undefined && <span>(Min: {r.min}, Max: {r.max})</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Issue Cards Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-quantara-400 uppercase tracking-wider">
          Diagnostic Issues & Quality Recommendations
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className="bg-quantara-900 border border-quantara-800 hover:border-quantara-700 rounded-xl p-5 shadow-xl transition cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                      issue.severity === 'critical'
                        ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                        : issue.severity === 'warning'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                        : 'bg-blue-950/80 text-blue-400 border-blue-800'
                    }`}
                  >
                    {issue.severity}
                  </span>

                  {issue.variableName && (
                    <span className="text-xs font-mono font-bold text-blue-400">{issue.variableName}</span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                  {issue.title}
                </h4>
                <p className="text-xs text-quantara-300 leading-relaxed font-sans">{issue.description}</p>
              </div>

              <div className="pt-3 border-t border-quantara-800 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>View Full Recommendation</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {isRuleModalOpen && (
        <RuleBuilderModal
          variableNames={['age', 'income', 'education', 'satisfaction', 'service_quality', 'waiting_time']}
          onAddRule={handleAddRule}
          onClose={() => setIsRuleModalOpen(false)}
        />
      )}

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onNavigateToDataEditor={() => {
            setSelectedIssue(null);
            navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data`);
          }}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
};
