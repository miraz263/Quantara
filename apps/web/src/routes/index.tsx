import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Home } from '../pages/Home';
import { ProjectsPage } from '../features/projects/pages/ProjectsPage';
import { ProjectWorkspaceLayout } from '../features/projects/pages/ProjectWorkspaceLayout';
import { ProjectOverviewTab } from '../features/projects/pages/ProjectOverviewTab';
import { ProjectDatasetsTab } from '../features/projects/pages/ProjectDatasetsTab';
import { ProjectAnalysesTab } from '../features/projects/pages/ProjectAnalysesTab';
import { ProjectVisualizationsTab } from '../features/projects/pages/ProjectVisualizationsTab';
import { ProjectReportsTab } from '../features/projects/pages/ProjectReportsTab';
import { ProjectFilesTab } from '../features/projects/pages/ProjectFilesTab';
import { ProjectActivityTab } from '../features/projects/pages/ProjectActivityTab';
import { ProjectSettingsTab } from '../features/projects/pages/ProjectSettingsTab';

import { DatasetDetailPage } from '../features/datasets/pages/DatasetDetailPage';
import { DatasetImportPage } from '../features/datasets/pages/DatasetImportPage';
import { DataEditorPage } from '../features/dataEditor/pages/DataEditorPage';

import { ProfileWorkspaceLayout } from '../features/dataProfiling/components/ProfileWorkspaceLayout';
import { ProfileOverviewPage } from '../features/dataProfiling/pages/ProfileOverviewPage';
import { ProfileVariablesPage } from '../features/dataProfiling/pages/ProfileVariablesPage';
import { ProfileVariableDetailPage } from '../features/dataProfiling/pages/ProfileVariableDetailPage';
import { ProfileMissingPage } from '../features/dataProfiling/pages/ProfileMissingPage';
import { ProfileOutliersPage } from '../features/dataProfiling/pages/ProfileOutliersPage';
import { ProfileDuplicatesPage } from '../features/dataProfiling/pages/ProfileDuplicatesPage';
import { ProfileQualityPage } from '../features/dataProfiling/pages/ProfileQualityPage';

import { DataWorkspacePage } from '../pages/DataWorkspacePage';
import { AnalyzeWorkspacePage } from '../pages/AnalyzeWorkspacePage';
import { VisualizeWorkspacePage } from '../pages/VisualizeWorkspacePage';
import { AIAnalystPage } from '../pages/AIAnalystPage';
import { ReportsPage } from '../pages/ReportsPage';
import { CodePage } from '../pages/CodePage';
import { FilesPage } from '../pages/FilesPage';
import { TeamPage } from '../pages/TeamPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <ProjectsPage /> },
      {
        path: 'projects/:projectId',
        element: <ProjectWorkspaceLayout />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: 'overview', element: <ProjectOverviewTab /> },
          { path: 'datasets', element: <ProjectDatasetsTab /> },
          { path: 'datasets/import', element: <DatasetImportPage /> },
          { path: 'datasets/:datasetId', element: <DatasetDetailPage /> },
          { path: 'datasets/:datasetId/data', element: <DataEditorPage /> },
          { path: 'datasets/:datasetId/data/view', element: <DataEditorPage /> },
          { path: 'datasets/:datasetId/data/variables', element: <DataEditorPage /> },
          { path: 'datasets/:datasetId/analyze', element: <AnalyzeWorkspacePage /> },

          {
            path: 'datasets/:datasetId/profile',
            element: <ProfileWorkspaceLayout />,
            children: [
              { index: true, element: <Navigate to="overview" replace /> },
              { path: 'overview', element: <ProfileOverviewPage /> },
              { path: 'variables', element: <ProfileVariablesPage /> },
              { path: 'variables/:variableId', element: <ProfileVariableDetailPage /> },
              { path: 'missing', element: <ProfileMissingPage /> },
              { path: 'outliers', element: <ProfileOutliersPage /> },
              { path: 'duplicates', element: <ProfileDuplicatesPage /> },
              { path: 'quality', element: <ProfileQualityPage /> }
            ]
          },

          { path: 'analyses', element: <ProjectAnalysesTab /> },
          { path: 'visualizations', element: <ProjectVisualizationsTab /> },
          { path: 'reports', element: <ProjectReportsTab /> },
          { path: 'files', element: <ProjectFilesTab /> },
          { path: 'activity', element: <ProjectActivityTab /> },
          { path: 'settings', element: <ProjectSettingsTab /> },
          { path: 'data', element: <DataWorkspacePage /> },
          { path: 'analyze', element: <AnalyzeWorkspacePage /> },
          { path: 'visualize', element: <VisualizeWorkspacePage /> },
          { path: 'ai', element: <AIAnalystPage /> },
          { path: 'code', element: <CodePage /> }
        ]
      },
      { path: 'team', element: <TeamPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
