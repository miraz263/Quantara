import React from 'react';
import { Settings, Save, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-quantara-950 p-8 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
      <div className="border-b border-quantara-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Quantara System Preferences
        </h1>
        <p className="text-xs text-quantara-400 mt-1">
          Configure computational precision, theme preferences, and default statistical options.
        </p>
      </div>

      <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white mb-3">Theme Preferences</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-md">
              <Moon className="w-4 h-4" /> Dark Scientific Mode (Default)
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-quantara-950 border border-quantara-800 text-quantara-400 hover:text-white rounded-lg text-xs font-semibold">
              <Sun className="w-4 h-4" /> Light Mode
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-quantara-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Statistical Engine Defaults</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">
                Default Confidence Level Alpha
              </label>
              <select className="bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 font-mono">
                <option value="0.95">95% (Alpha = 0.05)</option>
                <option value="0.99">99% (Alpha = 0.01)</option>
                <option value="0.90">90% (Alpha = 0.10)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">
                Decimal Floating Precision Display
              </label>
              <select className="bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 font-mono">
                <option value="4">4 Decimal Places (e.g. 0.0001)</option>
                <option value="3">3 Decimal Places (e.g. 0.001)</option>
                <option value="6">6 Decimal Places (e.g. 0.000001)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-quantara-800 flex justify-end">
          <Button variant="primary" size="md">
            <Save className="w-4 h-4" /> Save System Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
