import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useQuantaraStore } from '../store/useQuantaraStore';
import { 
  BookOpen, 
  FileText, 
  BarChart2, 
  Code2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Copy,
  Check
} from 'lucide-react';

export const ResultsViewer: React.FC = () => {
  const { analyses, selectedAnalysis, setSelectedAnalysis } = useQuantaraStore();
  const [activeViewTab, setActiveViewTab] = useState<'tables' | 'charts' | 'code' | 'interpretation'>('tables');
  const [copiedCode, setCopiedCode] = useState(false);

  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-quantara-950 text-quantara-400">
        <BookOpen className="w-12 h-12 text-quantara-600 mb-3" />
        <h3 className="text-lg font-semibold text-slate-200">Output Viewer Empty</h3>
        <p className="text-xs max-w-md mt-1 text-quantara-400">
          No statistical analyses have been executed yet. Click "Run Analysis" from the navigation header to compute real statistical results.
        </p>
      </div>
    );
  }

  const currentAnalysis = selectedAnalysis || analyses[0];
  const resData = currentAnalysis?.result_data || {};

  const handleCopyCode = () => {
    if (resData.generated_code?.python) {
      navigator.clipboard.writeText(resData.generated_code.python);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="flex h-full bg-quantara-950 text-slate-100 overflow-hidden">
      {/* Left Output Tree Navigator */}
      <div className="w-72 bg-quantara-900 border-r border-quantara-800 flex flex-col">
        <div className="p-3 bg-quantara-950 border-b border-quantara-800">
          <h3 className="text-xs font-bold uppercase text-quantara-400 tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Output Log ({analyses.length})
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {analyses.map((a) => {
            const isSelected = currentAnalysis.id === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setSelectedAnalysis(a)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition flex flex-col gap-1 border ${
                  isSelected 
                    ? 'bg-blue-950/80 border-blue-700 text-white font-semibold' 
                    : 'bg-quantara-950/50 border-quantara-800 text-quantara-300 hover:bg-quantara-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{a.name}</span>
                  <span className="text-[10px] text-quantara-500 font-mono">
                    {a.execution_time_ms ? `${a.execution_time_ms}ms` : ''}
                  </span>
                </div>
                <span className="text-[10px] text-quantara-400 capitalize">
                  {a.analysis_type.replace('_', ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Output Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
        {/* Header Summary Card */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{currentAnalysis.name}</h2>
              <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-mono font-medium">
                {resData.status?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-quantara-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {resData.execution_metadata?.duration_ms || currentAnalysis.execution_time_ms} ms
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Deterministic Engine v1.0
              </span>
            </div>
          </div>

          <p className="text-xs text-quantara-300 mt-2 bg-quantara-950 p-3 rounded border border-quantara-800 font-mono">
            {resData.summary}
          </p>

          {/* Diagnostics Alerts */}
          {resData.diagnostics && resData.diagnostics.length > 0 && (
            <div className="mt-3 space-y-2">
              {resData.diagnostics.map((diag: any, idx: number) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded text-xs flex items-center gap-2 border ${
                    diag.status === 'passed'
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-amber-950/40 border-amber-800 text-amber-300'
                  }`}
                >
                  {diag.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold">{diag.name}: </span>
                    <span>{diag.message}</span>
                    {diag.p_value !== undefined && (
                      <span className="font-mono text-[11px] ml-2 text-quantara-400">
                        (Statistic = {diag.statistic_value}, p = {diag.p_value})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Output View Tabs */}
        <div className="flex items-center gap-2 border-b border-quantara-800 pb-2">
          <button
            onClick={() => setActiveViewTab('tables')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeViewTab === 'tables' 
                ? 'bg-blue-600 text-white' 
                : 'bg-quantara-900 text-quantara-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Statistical Tables ({resData.tables?.length || 0})
          </button>

          <button
            onClick={() => setActiveViewTab('charts')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeViewTab === 'charts' 
                ? 'bg-blue-600 text-white' 
                : 'bg-quantara-900 text-quantara-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Interactive Diagrams ({resData.charts?.length || 0})
          </button>

          <button
            onClick={() => setActiveViewTab('interpretation')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeViewTab === 'interpretation' 
                ? 'bg-blue-600 text-white' 
                : 'bg-quantara-900 text-quantara-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Interpretation
          </button>

          <button
            onClick={() => setActiveViewTab('code')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeViewTab === 'code' 
                ? 'bg-blue-600 text-white' 
                : 'bg-quantara-900 text-quantara-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Python Code Export
          </button>
        </div>

        {/* Tab 1: Tables */}
        {activeViewTab === 'tables' && (
          <div className="space-y-6">
            {resData.tables?.map((table: any, tIdx: number) => (
              <div key={tIdx} className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-lg">
                <div className="px-5 py-3 bg-quantara-950 border-b border-quantara-800 font-bold text-xs text-white">
                  {table.title}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="bg-quantara-950 text-quantara-400 font-semibold border-b border-quantara-800">
                        {table.columns.map((c: string, cIdx: number) => (
                          <th key={cIdx} className="py-2.5 px-4">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-quantara-800 text-slate-200">
                      {table.rows.map((row: any[], rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-quantara-800/40 transition">
                          {row.map((cell: any, cellIdx: number) => (
                            <td key={cellIdx} className="py-2.5 px-4 whitespace-nowrap">
                              {cell === null || cell === undefined ? '.' : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {table.footnotes && table.footnotes.length > 0 && (
                  <div className="p-3 bg-quantara-950 text-[11px] text-quantara-400 border-t border-quantara-800 space-y-1">
                    {table.footnotes.map((fn: string, fnIdx: number) => (
                      <p key={fnIdx}>* {fn}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Interactive Charts */}
        {activeViewTab === 'charts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resData.charts?.map((chart: any, cIdx: number) => {
              const option = {
                title: { text: chart.title, textStyle: { color: '#f0f4f8', fontSize: 13 } },
                tooltip: { trigger: 'axis' },
                xAxis: { 
                  type: 'category', 
                  data: chart.data.categories,
                  axisLine: { lineStyle: { color: '#486581' } },
                  axisLabel: { color: '#9fb3c8', fontSize: 10 }
                },
                yAxis: { 
                  type: 'value',
                  axisLine: { lineStyle: { color: '#486581' } },
                  splitLine: { lineStyle: { color: '#1b324a' } },
                  axisLabel: { color: '#9fb3c8', fontSize: 10 }
                },
                series: chart.data.series.map((s: any) => ({
                  name: s.name,
                  type: chart.type === 'histogram' || chart.type === 'bar' ? 'bar' : 'bar',
                  data: s.data,
                  itemStyle: { color: '#2563eb' }
                })),
                backgroundColor: 'transparent'
              };

              return (
                <div key={cIdx} className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 shadow-lg">
                  <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Interpretation */}
        {activeViewTab === 'interpretation' && (
          <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-3">Natural Language Interpretation</h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
              {resData.interpretation || "No natural language interpretation produced for this run."}
            </div>
          </div>
        )}

        {/* Tab 4: Code Export */}
        {activeViewTab === 'code' && (
          <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono">Python Code Snippet (Pandas / SciPy)</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-quantara-800 hover:bg-quantara-700 text-xs text-slate-200 rounded border border-quantara-700 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-quantara-950 p-4 rounded-lg text-xs font-mono text-blue-300 border border-quantara-800 overflow-x-auto">
              {resData.generated_code?.python || '# Code generation unavailable'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
