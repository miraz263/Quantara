import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from '../ui/CommandPalette';

export const AppShell: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { projectId } = useParams<{ projectId?: string }>();

  return (
    <div className="flex h-screen w-screen bg-quantara-950 text-slate-100 overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        currentProjectId={projectId || 'proj-101'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>

      {/* Keyboard Command Palette */}
      <CommandPalette />
    </div>
  );
};
