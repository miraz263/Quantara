import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImportStepper } from '../components/ImportStepper';
import { FileSpreadsheet, ArrowLeft } from 'lucide-react';

export const DatasetImportPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <button
            onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets`)}
            className="flex items-center gap-1.5 text-xs text-quantara-400 hover:text-white transition font-medium mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Datasets
          </button>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            Import & Register Dataset
          </h2>
          <p className="text-xs text-quantara-400 mt-1">
            Convert raw CSV, Excel, SPSS (.sav), Stata (.dta), or SAS (.sas7bdat) files into optimized Arrow / Parquet snapshots.
          </p>
        </div>
      </div>

      <ImportStepper
        projectId={projectId || 'proj-001'}
        onComplete={() => navigate(`/projects/${projectId || 'proj-001'}/datasets`)}
        onCancel={() => navigate(`/projects/${projectId || 'proj-001'}/datasets`)}
      />
    </div>
  );
};
