import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, BarChart2, PieChart, MoreVertical, CheckCircle2, RefreshCw, AlertCircle, Keyboard, Info, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { EditorSaveStatus } from '../types/dataEditorTypes';

interface DataEditorHeaderProps {
  datasetName: string;
  version: number;
  rowCount: number;
  colCount: number;
  saveStatus: EditorSaveStatus;
  onSave: () => void;
  onOpenShortcuts: () => void;
  onOpenInfo: () => void;
}

export const DataEditorHeader: React.FC<DataEditorHeaderProps> = ({
  datasetName,
  version,
  rowCount,
  colCount,
  saveStatus,
  onSave,
  onOpenShortcuts,
  onOpenInfo,
}) => {
  const navigate = useNavigate();
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const renderSaveBadge = () => {
    switch (saveStatus.state) {
      case 'saved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </span>
        );
      case 'saving':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/80 border border-blue-800 px-2.5 py-1 rounded-full">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
          </span>
        );
      case 'unsaved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-800 px-2.5 py-1 rounded-full">
            ● Unsaved changes
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-800 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" /> Save failed
          </span>
        );
    }
  };

  return (
    <div className="bg-quantara-950 border-b border-quantara-800 px-6 py-3 flex items-center justify-between font-sans">
      {/* Left Title & Status */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(datasetId ? `/projects/${projectId || 'proj-001'}/datasets/${datasetId}` : `/projects/${projectId || 'proj-001'}/datasets`)}
          className="p-1.5 rounded-lg bg-quantara-900 hover:bg-quantara-800 text-quantara-400 hover:text-white transition border border-quantara-800 flex items-center gap-1.5 text-xs font-medium"
          title="Back to Dataset Details"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dataset Details</span>
        </button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-white tracking-tight">{datasetName}</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
              v{version}.0
            </span>
            {renderSaveBadge()}
          </div>
          <div className="text-xs text-quantara-400 font-mono mt-0.5">
            {rowCount.toLocaleString()} cases × {colCount} variables
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <Button
          onClick={onSave}
          disabled={saveStatus.state === 'saving'}
          variant={saveStatus.state === 'unsaved' ? 'primary' : 'outline'}
          size="sm"
          className="flex items-center gap-1.5"
        >
          {saveStatus.state === 'saving' ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {saveStatus.state === 'unsaved' ? 'Save Changes' : 'Save'}
        </Button>

        <button
          onClick={() => navigate(datasetId ? `/projects/${projectId || 'proj-001'}/datasets/${datasetId}/analyze` : `/projects/${projectId || 'proj-001'}/analyze`)}
          className="px-3 py-1.5 bg-quantara-900 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-1.5"
        >
          <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
          Analyze
        </button>

        <button
          onClick={() => navigate(`/projects/${projectId || 'proj-001'}/visualize`)}
          className="px-3 py-1.5 bg-quantara-900 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-1.5"
        >
          <PieChart className="w-3.5 h-3.5 text-emerald-400" />
          Visualize
        </button>

        {/* More Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="p-1.5 rounded-lg bg-quantara-900 hover:bg-quantara-800 text-quantara-400 hover:text-white transition border border-quantara-800"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMoreOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-quantara-900 border border-quantara-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onOpenInfo();
                }}
                className="w-full text-left px-3 py-2 text-quantara-200 hover:bg-quantara-800 hover:text-white flex items-center gap-2 transition"
              >
                <Info className="w-3.5 h-3.5 text-blue-400" /> Dataset Information
              </button>
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onOpenShortcuts();
                }}
                className="w-full text-left px-3 py-2 text-quantara-200 hover:bg-quantara-800 hover:text-white flex items-center gap-2 transition"
              >
                <Keyboard className="w-3.5 h-3.5 text-amber-400" /> Keyboard Shortcuts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
