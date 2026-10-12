import React, { useEffect } from 'react';
import { useQuantaraStore } from '../store/useQuantaraStore';
import { getProjects, createProject } from '../api/projects';
import { getProjectDatasets, getDatasetPreview, getDatasetVariables } from '../api/datasets';
import { getProjectAnalyses } from '../api/analyses';
import { Navigation } from '../components/Navigation';
import { DataGrid } from '../components/DataGrid';
import { VariableManager } from '../components/VariableManager';
import { ResultsViewer } from '../components/ResultsViewer';
import { AICopilot } from '../components/AICopilot';
import { DatasetUploadModal } from '../components/DatasetUploadModal';
import { AnalysisModal } from '../components/AnalysisModal';

export const ProjectDetail: React.FC = () => {
  const { 
    activeTab, 
    activeProject, 
    setActiveProject, 
    setDatasets, 
    activeDataset, 
    setActiveDataset, 
    setDatasetVersionId, 
    setPreviewData, 
    setVariables, 
    setAnalyses 
  } = useQuantaraStore();

  useEffect(() => {
    async function initProject() {
      try {
        const projects = await getProjects();
        let proj = projects[0];
        if (!proj) {
          proj = await createProject("Quantitative Research Study A", "Default biostatistical and econometric project workspace");
        }
        setActiveProject(proj);

        // Fetch datasets
        const dsets = await getProjectDatasets(proj.id);
        setDatasets(dsets);

        if (dsets.length > 0) {
          const ds = dsets[0];
          setActiveDataset(ds);

          const preview = await getDatasetPreview(ds.id);
          setPreviewData(preview);

          const vars = await getDatasetVariables(ds.id);
          setVariables(vars);

          setDatasetVersionId('ver-101');
        }

        // Fetch analyses
        const analysesList = await getProjectAnalyses(proj.id);
        setAnalyses(analysesList);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    }
    initProject();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-quantara-950 text-slate-100 overflow-hidden">
      <Navigation />

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'data_view' && <DataGrid />}
        {activeTab === 'variable_view' && <VariableManager />}
        {activeTab === 'analyses' && <ResultsViewer />}
        {activeTab === 'visualize' && <ResultsViewer />}
        {activeTab === 'ai_copilot' && <AICopilot />}
      </main>

      <DatasetUploadModal />
      <AnalysisModal />
    </div>
  );
};
