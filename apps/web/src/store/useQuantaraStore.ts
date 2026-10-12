import { create } from 'zustand';
import { Project, Dataset, Variable, Analysis } from '../types';

export type { Project, Dataset, Variable, Analysis };

export interface AnalysisResult {
  id: string;
  name: string;
  analysis_type: string;
  result_data: any;
  execution_time_ms?: number;
  created_at: string;
}

interface QuantaraState {
  // Navigation
  activeTab: 'data_view' | 'variable_view' | 'analyses' | 'visualize' | 'ai_copilot';
  setActiveTab: (tab: 'data_view' | 'variable_view' | 'analyses' | 'visualize' | 'ai_copilot') => void;

  // Active Project & Dataset
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  
  activeDataset: Dataset | null;
  setActiveDataset: (dataset: Dataset | null) => void;
  
  datasetVersionId: string | null;
  setDatasetVersionId: (versionId: string | null) => void;

  // Datasets list
  datasets: Dataset[];
  setDatasets: (datasets: Dataset[]) => void;

  // Variables
  variables: Variable[];
  setVariables: (variables: Variable[]) => void;

  // Preview Data
  previewData: { columns: string[]; rows: any[][]; total_rows: number } | null;
  setPreviewData: (data: { columns: string[]; rows: any[][]; total_rows: number } | null) => void;

  // Analyses
  analyses: Analysis[];
  setAnalyses: (analyses: Analysis[]) => void;
  selectedAnalysis: Analysis | null;
  setSelectedAnalysis: (analysis: Analysis | null) => void;

  // Modals
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isAnalysisModalOpen: boolean;
  setIsAnalysisModalOpen: (open: boolean) => void;
}

export const useQuantaraStore = create<QuantaraState>((set) => ({
  activeTab: 'data_view',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),

  activeDataset: null,
  setActiveDataset: (dataset) => set({ activeDataset: dataset }),

  datasetVersionId: null,
  setDatasetVersionId: (versionId) => set({ datasetVersionId: versionId }),

  datasets: [],
  setDatasets: (datasets) => set({ datasets }),

  variables: [],
  setVariables: (variables) => set({ variables }),

  previewData: null,
  setPreviewData: (previewData) => set({ previewData }),

  analyses: [],
  setAnalyses: (analyses) => set({ analyses }),
  selectedAnalysis: null,
  setSelectedAnalysis: (analysis) => set({ selectedAnalysis: analysis }),

  isUploadModalOpen: false,
  setIsUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
  isAnalysisModalOpen: false,
  setIsAnalysisModalOpen: (open) => set({ isAnalysisModalOpen: open }),
}));
