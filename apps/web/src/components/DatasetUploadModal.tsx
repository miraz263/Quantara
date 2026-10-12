import React, { useState } from 'react';
import { useQuantaraStore } from '../store/useQuantaraStore';
import { uploadDatasetFile, getProjectDatasets, getDatasetPreview, getDatasetVariables } from '../api/datasets';
import { X, UploadCloud, FileSpreadsheet, AlertCircle } from 'lucide-react';

export const DatasetUploadModal: React.FC = () => {
  const { 
    isUploadModalOpen, 
    setIsUploadModalOpen, 
    activeProject,
    setDatasets,
    setActiveDataset,
    setDatasetVersionId,
    setPreviewData,
    setVariables
  } = useQuantaraStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isUploadModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }
    if (!activeProject) {
      setErrorMessage("No active project found context.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const newDataset = await uploadDatasetFile(activeProject.id, selectedFile, description);
      
      // Refresh datasets list
      const datasetList = await getProjectDatasets(activeProject.id);
      setDatasets(datasetList);
      setActiveDataset(newDataset);

      // Load preview & variables
      const preview = await getDatasetPreview(newDataset.id);
      setPreviewData(preview);

      const vars = await getDatasetVariables(newDataset.id);
      setVariables(vars);

      setDatasetVersionId('ver-101');

      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setDescription('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-quantara-900 border border-quantara-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-quantara-950 border-b border-quantara-800">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-slate-100 text-base">Import Analytical Dataset</h3>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(false)}
            className="text-quantara-400 hover:text-white p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="border-2 border-dashed border-quantara-700 hover:border-blue-500 rounded-xl p-8 text-center bg-quantara-950/50 transition cursor-pointer relative">
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json,.parquet"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileSpreadsheet className="w-10 h-10 mx-auto text-blue-400 mb-2" />
            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                <p className="text-xs text-quantara-400 font-mono mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Click or drag file to import into Quantara
                </p>
                <p className="text-[11px] text-quantara-400 mt-1">
                  Supported formats: CSV, XLSX, JSON, Parquet
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">
              Dataset Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Clinical Trial Phase 3 Customer Satisfaction Data"
              className="w-full bg-quantara-950 border border-quantara-700 text-slate-100 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-quantara-950 border-t border-quantara-800">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(false)}
            className="px-4 py-2 text-xs text-quantara-300 hover:text-white transition font-medium"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-md transition"
          >
            <UploadCloud className="w-4 h-4" />
            {isUploading ? 'Ingesting...' : 'Import Dataset'}
          </button>
        </div>
      </div>
    </div>
  );
};
