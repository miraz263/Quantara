import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Calculator, RefreshCw, BarChart2, Hash, Layers, Sparkles, X } from 'lucide-react';

export const TransformMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const TRANSFORMS = [
    { id: 'compute', title: 'Compute Variable', icon: Calculator, desc: 'Calculate new values using algebraic or logical formulas' },
    { id: 'recode', title: 'Recode into Same/New Variables', icon: RefreshCw, desc: 'Reassign categorical or numeric range codes' },
    { id: 'autorecode', title: 'Automatic Recode', icon: Sparkles, desc: 'Convert string values to consecutive numeric integer codes' },
    { id: 'count', title: 'Count Values within Cases', icon: Hash, desc: 'Count occurrences of specific values across variables' },
    { id: 'rank', title: 'Rank Cases', icon: BarChart2, desc: 'Create rank scores, normal scores, or percentiles' },
    { id: 'standardize', title: 'Standardize (Z-Scores)', icon: Layers, desc: 'Transform variables to mean=0 and std-dev=1' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-quantara-950 border border-quantara-700 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
        Transform
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-quantara-900 border border-quantara-700 rounded-xl shadow-2xl py-1 z-50 text-xs font-sans">
          <div className="px-3 py-2 text-[10px] font-bold text-quantara-400 uppercase tracking-wider border-b border-quantara-800">
            Statistical Transformations
          </div>
          {TRANSFORMS.map((tf) => {
            const Icon = tf.icon;
            return (
              <button
                key={tf.id}
                onClick={() => {
                  setIsOpen(false);
                  setActiveModal(tf.title);
                }}
                className="w-full text-left px-3 py-2 text-quantara-200 hover:bg-quantara-800 hover:text-white flex items-center gap-2.5 transition group"
              >
                <Icon className="w-4 h-4 text-indigo-400 group-hover:text-blue-400" />
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-white">{tf.title}</div>
                  <div className="text-[10px] text-quantara-400 line-clamp-1">{tf.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal for Transformation Placeholder */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-indigo-950 border border-indigo-800 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{activeModal}</h3>
              <p className="text-xs text-quantara-400 mt-1">
                This statistical transformation engine interface will be activated in upcoming statistical modeling modules.
              </p>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
