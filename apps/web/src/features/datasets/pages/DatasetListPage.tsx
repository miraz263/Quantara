import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dataset, DatasetFilters, DatasetSortOption } from '../types/datasetTypes';
import { DatasetService } from '../services/datasetService';
import { DatasetCard } from '../components/DatasetCard';
import { DatasetTable } from '../components/DatasetTable';
import { DatasetFilterToolbar } from '../components/DatasetFilterToolbar';
import { ImportStepper } from '../components/ImportStepper';
import { FileSpreadsheet, UploadCloud, Layers, Database, HardDrive, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const DatasetListPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [filters, setFilters] = useState<DatasetFilters>({
    searchQuery: '',
    status: 'all',
    sourceType: 'all',
    sizeCategory: 'all',
    favoritesOnly: false,
  });

  const [sort, setSort] = useState<DatasetSortOption>('recently_updated');

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const data = await DatasetService.getDatasets(projectId, filters, sort);
      setDatasets(data);
    } catch (err) {
      console.error('Failed to fetch datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, [projectId, filters, sort]);

  const handleFavoriteToggle = async (dataset: Dataset) => {
    await DatasetService.toggleFavorite(dataset.id);
    fetchDatasets();
  };

  const handleDuplicate = async (dataset: Dataset) => {
    await DatasetService.duplicateDataset(dataset.id);
    fetchDatasets();
  };

  const handleArchive = async (dataset: Dataset) => {
    await DatasetService.archiveDataset(dataset.id);
    fetchDatasets();
  };

  const handleDelete = async (dataset: Dataset) => {
    if (confirm(`Are you sure you want to delete "${dataset.name}"? This action cannot be undone.`)) {
      await DatasetService.deleteDataset(dataset.id);
      fetchDatasets();
    }
  };

  // Metrics summary
  const totalRows = datasets.reduce((acc, d) => acc + d.rowCount, 0);
  const totalBytes = datasets.reduce((acc, d) => acc + (d.sizeBytes || 0), 0);
  const formattedStorage = (totalBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-quantara-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            Project Dataset Repository
          </h2>
          <p className="text-xs text-quantara-400 mt-1">
            Ingested tabular datasets, SPSS/Stata files, and statistical snapshot views.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" /> Import New Dataset
          </Button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-lg">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-quantara-400 font-medium">Total Datasets</div>
            <div className="text-lg font-bold text-white font-mono">{datasets.length}</div>
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-quantara-400 font-medium">Total Record Rows</div>
            <div className="text-lg font-bold text-white font-mono">{totalRows.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-950/80 border border-indigo-800 text-indigo-400 rounded-lg">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-quantara-400 font-medium">Storage Footprint</div>
            <div className="text-lg font-bold text-white font-mono">{formattedStorage} MB</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <DatasetFilterToolbar
        filters={filters}
        onFilterChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={datasets.length}
      />

      {/* Main Content Area */}
      {isImportModalOpen ? (
        <div className="relative">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="text-xs text-quantara-400 hover:text-white transition"
            >
              ← Back to list
            </button>
          </div>
          <ImportStepper
            projectId={projectId || 'proj-001'}
            onComplete={() => {
              setIsImportModalOpen(false);
              fetchDatasets();
            }}
            onCancel={() => setIsImportModalOpen(false)}
          />
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-quantara-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-xs">Loading dataset metadata catalog...</span>
        </div>
      ) : datasets.length === 0 ? (
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <Layers className="w-12 h-12 text-quantara-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Datasets Found</h3>
          <p className="text-xs text-quantara-400">
            No datasets match your active filter criteria, or no data files have been imported to this project yet.
          </p>
          <Button onClick={() => setIsImportModalOpen(true)} variant="primary" size="sm">
            <UploadCloud className="w-4 h-4" /> Import First Dataset
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {datasets.map((d) => (
            <DatasetCard
              key={d.id}
              dataset={d}
              onFavoriteToggle={handleFavoriteToggle}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onPreview={() => navigate(`/projects/${projectId || d.projectId}/datasets/${d.id}/data`)}
              onViewDetails={() => navigate(`/projects/${projectId || d.projectId}/datasets/${d.id}`)}
            />
          ))}
        </div>
      ) : (
        <DatasetTable
          datasets={datasets}
          onFavoriteToggle={handleFavoriteToggle}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onPreview={(d) => navigate(`/projects/${projectId || d.projectId}/datasets/${d.id}/data`)}
          onViewDetails={(d) => navigate(`/projects/${projectId || d.projectId}/datasets/${d.id}`)}
        />
      )}
    </div>
  );
};
