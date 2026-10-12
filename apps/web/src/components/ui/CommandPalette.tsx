import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderKanban, Database, Calculator, Sparkles, X, ArrowRight } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    { title: 'Go to Home Workspace', icon: FolderKanban, path: '/' },
    { title: 'Open Data View Grid', icon: Database, path: '/projects/proj-101/data' },
    { title: 'Run Statistical Analysis', icon: Calculator, path: '/projects/proj-101/analyze' },
    { title: 'Open AI Analyst Copilot', icon: Sparkles, path: '/projects/proj-101/ai' },
  ];

  const filtered = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-quantara-900 border border-quantara-700 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-scale-up">
        <div className="flex items-center px-4 border-b border-quantara-800 bg-quantara-950">
          <Search className="w-4 h-4 text-quantara-400 mr-3" />
          <input
            type="text"
            className="w-full bg-transparent text-slate-100 py-3.5 text-xs outline-none font-medium placeholder-quantara-500"
            placeholder="Search projects, datasets, procedures, or press ESC to exit..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-quantara-800 text-quantara-400 rounded">ESC</span>
        </div>

        <div className="p-2 max-h-72 overflow-y-auto divide-y divide-quantara-800/50">
          {filtered.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-quantara-800/70 text-xs text-slate-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">{item.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-quantara-500 group-hover:text-white transition" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
