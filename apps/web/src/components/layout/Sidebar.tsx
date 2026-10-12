import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderKanban, 
  Database, 
  Calculator, 
  BarChart3, 
  Sparkles, 
  BookOpen, 
  Code2, 
  FolderArchive, 
  Users, 
  Settings, 
  Cpu, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentProjectId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  currentProjectId = 'proj-101'
}) => {
  const location = useLocation();

  const mainNav = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Projects', icon: FolderKanban, path: '/projects' },
    { label: 'Data', icon: Database, path: `/projects/${currentProjectId}/data` },
    { label: 'Analyze', icon: Calculator, path: `/projects/${currentProjectId}/analyze` },
    { label: 'Visualize', icon: BarChart3, path: `/projects/${currentProjectId}/visualize` },
    { label: 'AI Analyst', icon: Sparkles, path: `/projects/${currentProjectId}/ai`, accent: true },
    { label: 'Reports', icon: BookOpen, path: `/projects/${currentProjectId}/reports` },
    { label: 'Code', icon: Code2, path: `/projects/${currentProjectId}/code` },
    { label: 'Files', icon: FolderArchive, path: `/projects/${currentProjectId}/files` },
  ];

  const orgNav = [
    { label: 'Team', icon: Users, path: '/team' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside 
      className={`bg-quantara-950 border-r border-quantara-800 flex flex-col transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-quantara-900 bg-quantara-950">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-1.5 bg-blue-600 rounded-md shadow-md shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">QUANTARA</span>
              <span className="text-[10px] text-blue-400 font-mono tracking-wider uppercase">Quantitative AI</span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="text-quantara-400 hover:text-white p-1 rounded hover:bg-quantara-900 transition"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        <div>
          {!collapsed && (
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-quantara-500 mb-2">
              Workspace
            </h4>
          )}
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive: linkActive }) => {
                    const active = linkActive || isActive;
                    return `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      active
                        ? item.accent
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-blue-600 text-white shadow-md'
                        : item.accent
                        ? 'text-purple-300 hover:bg-purple-950/40 hover:text-white'
                        : 'text-quantara-300 hover:bg-quantara-900 hover:text-white'
                    }`;
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${item.accent && !isActive ? 'text-purple-400' : ''}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-quantara-500 mb-2">
              Organization
            </h4>
          )}
          <nav className="space-y-1">
            {orgNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-quantara-300 hover:bg-quantara-900 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer Profile */}
      {!collapsed && (
        <div className="p-3 border-t border-quantara-900 bg-quantara-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              SL
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">Dr. Sarah Lin</span>
              <span className="text-[10px] text-quantara-400 font-mono">Lead Statistician</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
