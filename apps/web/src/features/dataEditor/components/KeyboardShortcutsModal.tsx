import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'S'], desc: 'Save dataset state changes' },
  { keys: ['Ctrl', 'Z'], desc: 'Undo last edit operation' },
  { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Redo last undone operation' },
  { keys: ['Ctrl', 'F'], desc: 'Open Find & Replace panel' },
  { keys: ['Enter'], desc: 'Commit cell edit / move to row below' },
  { keys: ['Tab'], desc: 'Move focus to next cell' },
  { keys: ['Shift', 'Tab'], desc: 'Move focus to previous cell' },
  { keys: ['Esc'], desc: 'Cancel active cell inline editing' },
  { keys: ['Delete'], desc: 'Clear contents of selected cell(s)' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-quantara-950 border-b border-quantara-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Keyboard className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Data Editor Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="text-quantara-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 text-xs">
          <p className="text-quantara-300">
            Speed up scientific data editing and grid navigation with these standard desktop keybindings:
          </p>

          <div className="bg-quantara-950 border border-quantara-800 rounded-xl divide-y divide-quantara-800/80 max-h-72 overflow-y-auto">
            {SHORTCUTS.map((sc, i) => (
              <div key={i} className="p-3 flex items-center justify-between">
                <span className="text-slate-200 font-medium">{sc.desc}</span>
                <div className="flex items-center gap-1">
                  {sc.keys.map((k) => (
                    <kbd
                      key={k}
                      className="px-2 py-1 bg-quantara-800 border border-quantara-700 text-quantara-200 rounded font-mono text-[11px] shadow-inner"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-quantara-950 border-t border-quantara-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
