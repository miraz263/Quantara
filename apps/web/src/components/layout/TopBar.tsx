import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Bell, User as UserIcon, Command } from 'lucide-react';

export const TopBar: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const navigate = useNavigate();

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiQuery.trim()) {
      navigate(`/projects/proj-101/ai?query=${encodeURIComponent(aiQuery)}`);
    }
  };

  return (
    <header className="bg-quantara-950 border-b border-quantara-800 text-slate-200 px-6 py-2.5 flex items-center justify-between shadow-sm z-20">
      {/* Global AI Search Field */}
      <form onSubmit={handleAiSearchSubmit} className="flex-1 max-w-2xl">
        <div className="relative flex items-center">
          <Sparkles className="w-4 h-4 text-purple-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            className="w-full bg-quantara-900 border border-quantara-800 rounded-xl pl-9 pr-24 py-2 text-xs text-white placeholder-quantara-400 outline-none focus:border-purple-500 transition shadow-inner font-medium"
            placeholder="What do you want to analyze? (e.g. Compare customer satisfaction by gender)..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
          />
          <div className="absolute right-2 flex items-center gap-1">
            <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 bg-quantara-950 text-quantara-400 text-[10px] font-mono rounded border border-quantara-800">
              <Command className="w-3 h-3" /> K
            </span>
          </div>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button
          className="relative text-quantara-400 hover:text-white p-2 rounded-lg hover:bg-quantara-900 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-quantara-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 shadow-md cursor-pointer">
            <div className="w-full h-full bg-quantara-950 rounded-full flex items-center justify-center font-bold text-xs text-slate-100">
              SL
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
