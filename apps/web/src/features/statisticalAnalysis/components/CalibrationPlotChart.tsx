import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Sliders } from 'lucide-react';

interface CalibrationPlotChartProps {
  title?: string;
  brierScore?: number;
  groups?: Array<{ meanPredicted: number; observedRate: number; n: number }>;
}

export const CalibrationPlotChart: React.FC<CalibrationPlotChartProps> = ({
  title = 'Logistic Model Calibration Curve (Observed vs Predicted Probability)',
  brierScore = 0.084,
  groups = [
    { meanPredicted: 0.04, observedRate: 0.05, n: 125 },
    { meanPredicted: 0.14, observedRate: 0.16, n: 125 },
    { meanPredicted: 0.25, observedRate: 0.23, n: 125 },
    { meanPredicted: 0.36, observedRate: 0.38, n: 125 },
    { meanPredicted: 0.48, observedRate: 0.47, n: 125 },
    { meanPredicted: 0.59, observedRate: 0.61, n: 125 },
    { meanPredicted: 0.71, observedRate: 0.69, n: 125 },
    { meanPredicted: 0.82, observedRate: 0.84, n: 125 },
    { meanPredicted: 0.93, observedRate: 0.92, n: 125 },
  ],
}) => {
  const points = groups.map((g) => [g.meanPredicted, g.observedRate]);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      subtext: `Brier Score = ${brierScore.toFixed(4)} (Ideal = 0.000)`,
      left: 'center',
      textStyle: { color: '#f3f4f6', fontSize: 13, fontWeight: 'bold' },
      subtextStyle: { color: '#60a5fa', fontSize: 11, fontWeight: '600' },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      textStyle: { color: '#f3f4f6', fontSize: 12 },
      formatter: (params: any) => {
        if (params.seriesName === 'Perfect Calibration') return 'Perfect Calibration (Ideal 45° Line)';
        const [pred, obs] = params.value;
        return `<b>Decile Bin</b><br/>Mean Predicted: ${(pred * 100).toFixed(1)}%<br/>Observed Rate: ${(obs * 100).toFixed(1)}%`;
      },
    },
    grid: { left: '10%', right: '10%', bottom: '15%', top: '20%', containLabel: true },
    xAxis: {
      name: 'Mean Predicted Probability',
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
      name: 'Observed Event Rate',
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
        name: 'Model Calibration',
        type: 'line',
        smooth: false,
        data: points,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: '#3b82f6', width: 2.5 },
        itemStyle: { color: '#60a5fa', borderColor: '#1e3a8a', borderWidth: 1.5 },
      },
      {
        name: 'Perfect Calibration',
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
          <Sliders className="w-4 h-4 text-blue-400" /> Model Calibration Diagnostics
        </h4>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-blue-950/80 border border-blue-800 text-blue-300 font-bold rounded-lg">
            Brier Score: {brierScore.toFixed(4)}
          </span>
        </div>
      </div>
      <ReactECharts option={option} style={{ height: '320px', width: '100%' }} />
    </div>
  );
};
