import React, { useState } from 'react';
import { BookOpen, FileText, Download, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ReportsPage: React.FC = () => {
  const [sections, setSections] = useState([
    { id: 'sec-1', title: '1. Executive Summary', content: 'This statistical report evaluates customer satisfaction factors across demographics using multiple linear regression and parametric hypothesis testing.' },
    { id: 'sec-2', title: '2. Methodology', content: 'Data was ingested from customer_satisfaction_study.csv containing 12,450 valid observations. Ordinary Least Squares (OLS) regression was fitted with residual normality checks (Shapiro-Wilk) and variance inflation factor (VIF) multicollinearity diagnostics.' },
    { id: 'sec-3', title: '3. Inferential Results', content: 'Annual household income demonstrated a strong, statistically significant positive effect on satisfaction scores (B = 0.000052, t = 86.67, p < 0.001, R² = 0.482).' }
  ]);

  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExportMessage(`Exporting research report as ${format.toUpperCase()}... File ready for download.`);
    setTimeout(() => setExportMessage(null), 4000);
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Quantara Academic & Scientific Report Builder
          </h1>
          <p className="text-xs text-quantara-400 mt-1">
            Construct APA 7, IEEE, or Harvard formatted statistical research reports with verified outputs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => handleExport('pdf')} variant="primary" size="sm">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </Button>
          <Button onClick={() => handleExport('docx')} variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5 text-blue-400" /> Export DOCX
          </Button>
          <Button onClick={() => handleExport('html')} variant="outline" size="sm">
            HTML
          </Button>
        </div>
      </div>

      {exportMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Report Editor Sections */}
      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <div key={sec.id} className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="text"
                className="bg-transparent text-sm font-bold text-white outline-none focus:border-blue-500 border-b border-transparent hover:border-quantara-700 font-sans"
                value={sec.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setSections(sections.map(s => s.id === sec.id ? { ...s, title: val } : s));
                }}
              />
              <button
                onClick={() => setSections(sections.filter(s => s.id !== sec.id))}
                className="text-quantara-500 hover:text-rose-400 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={3}
              className="w-full bg-quantara-950 border border-quantara-800 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-blue-500 font-sans leading-relaxed"
              value={sec.content}
              onChange={(e) => {
                const val = e.target.value;
                setSections(sections.map(s => s.id === sec.id ? { ...s, content: val } : s));
              }}
            />
          </div>
        ))}

        <button
          onClick={() => setSections([...sections, { id: `sec-${Date.now()}`, title: `${sections.length + 1}. New Section`, content: 'Enter section details...' }])}
          className="w-full py-3 border-2 border-dashed border-quantara-800 hover:border-blue-500 text-quantara-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4 text-blue-400" /> Add Section Block
        </button>
      </div>
    </div>
  );
};
