import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Target } from 'lucide-react';

interface ROCPlotChartProps {
  title?: string;
  auc?: number;
  ciLower?: number;
  ciUpper?: number;
  coordinates?: Array<[number, number]>;
}

export const ROCPlotChart: React.FC<ROCPlotChartProps> = ({
  title = 'Receiver Operating Characteristic (ROC) Curve',
  auc = 0.884,
  ciLower = 0.842,
  ciUpper = 0.926,
  coordinates = [
    [0.0, 0.0],
    [0.02, 0.28],
    [0.05, 0.54],
    [0.08, 0.72],
    [0.12, 0.82],
    [0.18, 0.89],
    [0.25, 0.93],
    [0.35, 0.96],
    [0.50, 0.98],
    [0.70, 0.99],
    [1.0, 1.0],
  ],
}) => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      subtext: `AUC = ${auc.toFixed(3)} (95% CI: ${ciLower.toFixed(3)} – ${ciUpper.toFixed(3)})`,
      left: 'center',
      textStyle: { color: '#f3f4f6', fontSize: 13, fontWeight: 'bold' },
      subtextStyle: { color: '#10b981', fontSize: 11, fontWeight: '600' },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      textStyle: { color: '#f3f4f6', fontSize: 12 },
      formatter: (params: any) => {
        if (params.seriesName === 'Reference Line') return 'Chance Level (AUC = 0.50)';
        const [fpr, tpr] = params.value;
        const spec = (1 - fpr).toFixed(3);
        return `<b>ROC Point</b><br/>1 - Specificity (FPR): ${fpr.toFixed(3)}<br/>Specificity: ${spec}<br/>Sensitivity (TPR): ${tpr.toFixed(3)}`;
      },
    },
    grid: { left: '10%', right: '10%', bottom: '15%', top: '20%', containLabel: true },
    xAxis: {
      name: '1 - Specificity (False Positive Rate)',
      nameLocation: 'middle',
      nameGap: 30,
      min: 0,
      max: 1,
      type: 'value',
      axisLine: { lineStyle: { color: '#4b5563' } },
      splitLine: { lineStyle: { color: '#374151', type: 'dashed' } },
      axisLabel: { color: '#9ca3af', fontSize: 10 },
    },
    yAxis: {
      name: 'Sensitivity (True Positive Rate)',
      nameLocation: 'middle',
      nameGap: 35,
      min: 0,
      max: 1,
      type: 'value',
      axisLine: { lineStyle: { color: '#4b5563' } },
      splitLine: { lineStyle: { color: '#374151', type: 'dashed' } },
      axisLabel: { color: '#9ca3af', fontSize: 10 },
    },
    series: [
      {
        name: 'ROC Curve',
        type: 'line',
        smooth: true,
        data: coordinates,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#10b981', width: 3 },
        itemStyle: { color: '#34d399', borderColor: '#065f46', borderWidth: 1 },
        areaStyle: { color: 'rgba(16, 185, 129, 0.15)' },
      },
      {
        name: 'Reference Line',
        type: 'line',
        data: [
          [0, 0],
          [1, 1],
        ],
        lineStyle: { color: '#6b7280', type: 'dashed', width: 1.5 },
        symbol: 'none',
      },
    ],
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" /> Model Diagnostic ROC & Discrimination
        </h4>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold rounded-lg">
            AUC: {auc.toFixed(3)}
          </span>
        </div>
      </div>
      <ReactECharts option={option} style={{ height: '320px', width: '100%' }} />
    </div>
  );
};
