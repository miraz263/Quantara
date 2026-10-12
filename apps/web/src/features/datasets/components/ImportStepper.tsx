import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImportDropzone } from './ImportDropzone';
import { ImportConfiguration } from './ImportConfiguration';
import { ImportPreview } from './ImportPreview';
import { DatasetService } from '../services/datasetService';
import { DatasetSourceType, ImportDatasetPayload, ColumnMetadataSummary } from '../types/datasetTypes';
import { Check, ArrowRight, ArrowLeft, UploadCloud, RefreshCw, Sparkles, FileSpreadsheet, Layers } from 'lucide-react';
import { MOCK_COLUMN_SUMMARIES } from '../mocks/datasetsMock';

interface ImportStepperProps {
  projectId: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

const STEPS = [
  { number: 1, title: 'Select File', description: 'Upload statistical data file' },
  { number: 2, title: 'Configure Ingestion', description: 'Encoding, delimiter & options' },
  { number: 3, title: 'Schema & Preview', description: 'Inspect inferred variables' },
  { number: 4, title: 'Processing', description: 'Snapshotting to Parquet' },
  { number: 5, title: 'Ready', description: 'Dataset registered' },
];

export const ImportStepper: React.FC<ImportStepperProps> = ({ projectId, onComplete, onCancel }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // File state
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; sourceType: DatasetSourceType } | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>(['imported']);
  const [config, setConfig] = useState<ImportDatasetPayload['config']>({
    delimiter: ',',
    encoding: 'utf-8',
    headerRow: 1,
    valueLabels: true,
    missingValueStrategy: 'nan',
  });

  const [importedDatasetId, setImportedDatasetId] = useState<string | null>(null);

  const handleNext = async () => {
    if (currentStep === 3) {
      // Trigger import processing simulation
      setCurrentStep(4);
      setIsSubmitting(true);
      setProgressPercent(10);

      const interval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 95;
          }
          return prev + 25;
        });
      }, 200);

      try {
        if (!selectedFile) return;
        const newDs = await DatasetService.importDataset(projectId, {
          fileName: selectedFile.name,
          sourceType: selectedFile.sourceType,
          sizeBytes: selectedFile.size,
          description,
          tags,
          importMode: 'new',
          config,
        });

        setTimeout(() => {
          clearInterval(interval);
          setProgressPercent(100);
          setImportedDatasetId(newDs.id);
          setIsSubmitting(false);
          setCurrentStep(5);
        }, 1000);
      } catch (err) {
        clearInterval(interval);
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl shadow-2xl overflow-hidden font-sans max-w-4xl mx-auto my-6">
      {/* Header Stepper Bar */}
      <div className="bg-quantara-950 p-6 border-b border-quantara-800">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <React.Fragment key={step.number}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition font-mono ${
                      isCompleted
                        ? 'bg-emerald-500 text-black'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-950'
                        : 'bg-quantara-800 text-quantara-400 border border-quantara-700'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                  </div>
                  <div className="hidden md:block">
                    <div className={`text-xs font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-quantara-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-[10px] text-quantara-500">{step.description}</div>
                  </div>
                </div>

                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-quantara-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Body Area */}
      <div className="p-6">
        {currentStep === 1 && (
          <ImportDropzone
            onFileSelected={(file) => {
              setSelectedFile(file);
            }}
          />
        )}

        {currentStep === 2 && selectedFile && (
          <ImportConfiguration
            sourceType={selectedFile.sourceType}
            config={config}
            onChange={setConfig}
            description={description}
            onDescriptionChange={setDescription}
            tags={tags}
            onTagsChange={setTags}
          />
        )}

        {currentStep === 3 && selectedFile && (
          <ImportPreview
            fileName={selectedFile.name}
            columns={MOCK_COLUMN_SUMMARIES}
          />
        )}

        {currentStep === 4 && (
          <div className="py-16 text-center space-y-6 max-w-md mx-auto">
            <div className="relative w-16 h-16 mx-auto">
              <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Ingesting & Registering Dataset...</h3>
              <p className="text-xs text-quantara-400 mt-1">
                Validating schema integrity, generating Arrow columnar layout, and saving snapshot.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-quantara-950 border border-quantara-800 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs font-mono text-quantara-400">{progressPercent}% Completed</div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="py-12 text-center space-y-5 max-w-md mx-auto">
            <div className="w-16 h-16 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Dataset Successfully Imported!</h3>
              <p className="text-xs text-quantara-400 mt-1">
                <span className="text-slate-200 font-semibold">{selectedFile?.name}</span> has been converted to an optimized columnar format and is ready for statistical analysis.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (onComplete) onComplete();
                  else navigate(`/projects/${projectId}/datasets`);
                }}
                className="px-4 py-2 bg-quantara-800 hover:bg-quantara-700 text-white text-xs font-semibold rounded-lg border border-quantara-700 transition"
              >
                Back to Datasets List
              </button>
              <button
                onClick={() => {
                  if (importedDatasetId) {
                    navigate(`/projects/${projectId}/datasets/${importedDatasetId}`);
                  } else {
                    navigate(`/projects/${projectId}/data`);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg transition flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" /> Open Dataset Details
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      {currentStep < 4 && (
        <div className="bg-quantara-950 p-4 border-t border-quantara-800 flex items-center justify-between">
          <button
            onClick={currentStep === 1 ? onCancel : handlePrev}
            className="px-4 py-2 text-xs font-semibold text-quantara-300 hover:text-white transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> {currentStep === 1 ? 'Cancel' : 'Previous Step'}
          </button>

          <button
            disabled={currentStep === 1 && !selectedFile}
            onClick={handleNext}
            className={`px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg transition ${
              currentStep === 1 && !selectedFile
                ? 'bg-quantara-800 text-quantara-500 cursor-not-allowed border border-quantara-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {currentStep === 3 ? 'Start Ingestion' : 'Next Step'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
