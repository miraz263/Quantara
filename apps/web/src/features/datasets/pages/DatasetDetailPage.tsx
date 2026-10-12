import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dataset, ColumnMetadataSummary, DatasetVersionInfo } from '../types/datasetTypes';
import { DatasetService } from '../services/datasetService';
import { ColumnSummaryTable } from '../components/ColumnSummaryTable';
import { DatasetVersionTable } from '../components/DatasetVersionTable';
import {
  FileSpreadsheet,
  Eye,
  Download,
  History,
  Settings,
  ArrowLeft,
  Star,
  Clock,
  CheckCircle2,
  Trash2,
  Edit3,
  Database,
  Layers,
  Sliders,
  Table,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const DatasetDetailPage: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [columns, setColumns] = useState<ColumnMetadataSummary[]>([]);
  const [versions, setVersions] = useState<DatasetVersionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'columns' | 'versions' | 'settings'>('overview');

  // Form states for settings tab
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (!datasetId || !projectId) return;
      try {
        const ds = await DatasetService.getDataset(projectId, datasetId);
        if (ds) {
          setDataset(ds);
          setEditName(ds.name);
          setEditDesc(ds.description || '');
        }
        const cols = await DatasetService.getColumnSummaries(datasetId);
        setColumns(cols);

        const vers = await DatasetService.getDatasetVersions(datasetId);
        setVersions(vers);
      } catch (err) {
        console.error('Failed to load dataset detail:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [projectId, datasetId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-quantara-400 bg-quantara-950">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-xs font-sans">Loading dataset details...</span>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="p-8 bg-quantara-950 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Dataset Not Found</h3>
        <button
          onClick={() => navigate(`/projects/${projectId}/datasets`)}
          className="px-4 py-2 bg-quantara-800 text-xs text-white rounded-lg border border-quantara-700"
        >
          Return to Datasets List
        </button>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const updated = await DatasetService.updateDataset(dataset.id, {
        name: editName,
        description: editDesc,
      });
      setDataset(updated);
      alert('Dataset details updated successfully.');
    } catch (err) {
      alert('Failed to update dataset details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete dataset "${dataset.name}"?`)) {
      await DatasetService.deleteDataset(dataset.id);
      navigate(`/projects/${projectId}/datasets`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Top Breadcrumbs & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-quantara-400">
        <button
          onClick={() => navigate(`/projects/${projectId}/datasets`)}
          className="flex items-center gap-1.5 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Project Datasets
        </button>

        {/* Data Editor Action Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={() => navigate(`/projects/${projectId}/datasets/${datasetId}/data`)}
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-white" /> Open Data Editor
          </Button>

          <button
            onClick={() => navigate(`/projects/${projectId}/datasets/${datasetId}/data/view`)}
            className="px-3 py-1.5 bg-quantara-900 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-1.5"
            title="Open Data View tab directly"
          >
            <Table className="w-3.5 h-3.5 text-blue-400" /> Data View
          </button>

          <button
            onClick={() => navigate(`/projects/${projectId}/datasets/${datasetId}/data/variables`)}
            className="px-3 py-1.5 bg-quantara-900 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-1.5"
            title="Open Variable View dictionary tab directly"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" /> Variable View
          </button>
        </div>
      </div>

      {/* Dataset Header Card */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xl flex-shrink-0">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{dataset.name}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-quantara-800 text-quantara-300 border border-quantara-700 uppercase">
                  {dataset.sourceType}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  v{dataset.version}.0
                </span>
              </div>
              <p className="text-xs text-quantara-300 mt-1 max-w-2xl leading-relaxed">
                {dataset.description || 'No description provided for this dataset.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={() => navigate(`/projects/${projectId}/datasets/${datasetId}/data`)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2 shadow-lg"
            >
              <Database className="w-4 h-4" /> Open Data Editor
            </Button>
          </div>
        </div>

        {/* Quick Spec Pills */}
        <div className="pt-4 border-t border-quantara-800/80 flex flex-wrap gap-4 text-xs font-mono text-quantara-300">
          <div>
            <span className="text-quantara-500 font-sans text-[11px] block">Total Rows:</span>
            <span className="font-bold text-white">{dataset.rowCount.toLocaleString()}</span>
          </div>
          <div className="border-r border-quantara-800 pr-4" />
          <div>
            <span className="text-quantara-500 font-sans text-[11px] block">Variables:</span>
            <span className="font-bold text-white">{dataset.columnCount}</span>
          </div>
          <div className="border-r border-quantara-800 pr-4" />
          <div>
            <span className="text-quantara-500 font-sans text-[11px] block">Size:</span>
            <span className="font-bold text-white">{((dataset.sizeBytes || 0) / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
          <div className="border-r border-quantara-800 pr-4" />
          <div>
            <span className="text-quantara-500 font-sans text-[11px] block">Owner:</span>
            <span className="font-sans text-white">{dataset.createdBy}</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-quantara-800 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Overview & Profiling
        </button>
        <button
          onClick={() => setActiveTab('columns')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'columns'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Variables & Schema ({columns.length})
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'versions'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Version History ({versions.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'settings'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Dataset Settings
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <ColumnSummaryTable columns={columns} />
        </div>
      )}

      {activeTab === 'columns' && (
        <ColumnSummaryTable columns={columns} />
      )}

      {activeTab === 'versions' && (
        <DatasetVersionTable
          versions={versions}
          currentVersion={dataset.version}
        />
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Metadata Edit Form */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-quantara-800 pb-3">
              <Edit3 className="w-4 h-4 text-blue-400" /> Update Dataset Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-quantara-300 mb-1">Dataset Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-quantara-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  variant="primary"
                  size="sm"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Metadata'}
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-quantara-900 border border-rose-950 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 border-b border-rose-950 pb-3">
              <Trash2 className="w-4 h-4" /> Danger Zone
            </h3>
            <p className="text-xs text-quantara-400">
              Permanently delete this dataset snapshot and associated column dictionary metadata. This action cannot be reversed.
            </p>
            <div>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-semibold transition"
              >
                Delete Dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
