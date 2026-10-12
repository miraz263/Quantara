import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { DatasetSourceType } from '../types/datasetTypes';

interface ImportDropzoneProps {
  onFileSelected: (file: { name: string; size: number; sourceType: DatasetSourceType }) => void;
}

export const ImportDropzone: React.FC<ImportDropzoneProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; sourceType: DatasetSourceType } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectSourceType = (fileName: string): DatasetSourceType => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'csv': return 'csv';
      case 'xlsx': return 'xlsx';
      case 'xls': return 'xls';
      case 'sav': return 'sav';
      case 'dta': return 'dta';
      case 'sas7bdat': return 'sas7bdat';
      case 'parquet': return 'parquet';
      case 'json': return 'json';
      default: return 'csv';
    }
  };

  const handleFileChange = (file: File) => {
    const sourceType = detectSourceType(file.name);
    const fileObj = {
      name: file.name,
      size: file.size,
      sourceType
    };
    setSelectedFile(fileObj);
    onFileSelected(fileObj);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDemoSelect = (filename: string, size: number) => {
    const sourceType = detectSourceType(filename);
    const fileObj = { name: filename, size, sourceType };
    setSelectedFile(fileObj);
    onFileSelected(fileObj);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Drag & Drop Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-4 ${
          isDragging
            ? 'border-blue-500 bg-blue-950/20'
            : selectedFile
            ? 'border-emerald-500/80 bg-emerald-950/10'
            : 'border-quantara-700 bg-quantara-900/60 hover:border-quantara-500 hover:bg-quantara-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.sav,.dta,.sas7bdat,.parquet,.json"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">{selectedFile.name}</h4>
            <p className="text-xs text-quantara-400 font-mono">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Format detected: <span className="uppercase text-emerald-400 font-bold">{selectedFile.sourceType}</span>
            </p>
            <span className="text-xs text-blue-400 font-medium hover:underline pt-2">Click or drag another file to replace</span>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-full bg-quantara-800 text-blue-400 border border-quantara-700">
              <UploadCloud className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Choose a dataset file or drag & drop here</h4>
              <p className="text-xs text-quantara-400 mt-1">
                Supported statistical & tabular formats: <strong className="text-slate-200">CSV, XLSX, SPSS (.sav), Stata (.dta), SAS (.sas7bdat), Parquet, JSON</strong>
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-lg transition"
            >
              Browse Local Files
            </button>
          </>
        )}
      </div>

      {/* Preset Demo Files Section */}
      <div className="bg-quantara-950/80 border border-quantara-800 rounded-xl p-4">
        <div className="text-xs font-bold text-quantara-300 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Or load a preset benchmark dataset for testing:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleDemoSelect('clinical_trial_patients_v2.sav', 14500000)}
            className="p-3 bg-quantara-900 border border-quantara-800 hover:border-blue-500/80 rounded-lg text-left transition group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-blue-400">
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              clinical_trial_patients.sav
            </div>
            <div className="text-[11px] text-quantara-400 mt-1 font-mono">
              SPSS Dataset • 14.5 MB • 12.4k rows
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSelect('global_economic_indicators_2025.csv', 8200000)}
            className="p-3 bg-quantara-900 border border-quantara-800 hover:border-emerald-500/80 rounded-lg text-left transition group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-emerald-400">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              economic_indicators.csv
            </div>
            <div className="text-[11px] text-quantara-400 mt-1 font-mono">
              CSV Dataset • 8.2 MB • 45.0k rows
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSelect('fintech_transactions_q3.parquet', 32000000)}
            className="p-3 bg-quantara-900 border border-quantara-800 hover:border-amber-500/80 rounded-lg text-left transition group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-amber-400">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              fintech_transactions.parquet
            </div>
            <div className="text-[11px] text-quantara-400 mt-1 font-mono">
              Apache Parquet • 32.0 MB • 185k rows
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
