import React from 'react';
import ReactECharts from 'echarts-for-react';
import { DataQualityScore } from '../types/profilingTypes';
import { ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface QualityGaugeProps {
  score: DataQualityScore;
}

export const QualityGauge: React.FC<QualityGaugeProps> = ({ score }) => {
  const getScoreColor = (val: number) => {
    if (val >= 90) return '#10b981'; // Emerald
    if (val >= 75) return '#3b82f6'; // Blue
    if (val >= 60) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const mainColor = getScoreColor(score.overall);

  const option = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: mainColor,
        },
        progress: {
          show: true,
          width: 14,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, '#1e293b']],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 36,
          borderRadius: 8,
          offsetCenter: [0, '5%'],
          fontSize: 34,
          fontWeight: 'bolder',
          formatter: '{value}%',
          color: '#ffffff',
          fontFamily: 'monospace',
        },
        data: [
          {
            value: score.overall,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Overall Data Quality Index
        </h3>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
          ● Analysis Ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Gauge Ring Chart */}
        <div className="h-44 relative flex items-center justify-center">
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        </div>

        {/* Sub-Metric Score Bars */}
        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="flex justify-between text-quantara-300 font-sans font-medium mb-1">
              <span>Completeness</span>
              <strong className="text-white font-mono">{score.completeness}%</strong>
            </div>
            <div className="w-full bg-quantara-950 rounded-full h-2 overflow-hidden p-0.5 border border-quantara-800">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${score.completeness}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-quantara-300 font-sans font-medium mb-1">
              <span>Validity</span>
              <strong className="text-white font-mono">{score.validity}%</strong>
            </div>
            <div className="w-full bg-quantara-950 rounded-full h-2 overflow-hidden p-0.5 border border-quantara-800">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${score.validity}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-quantara-300 font-sans font-medium mb-1">
              <span>Uniqueness</span>
              <strong className="text-white font-mono">{score.uniqueness}%</strong>
            </div>
            <div className="w-full bg-quantara-950 rounded-full h-2 overflow-hidden p-0.5 border border-quantara-800">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${score.uniqueness}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-quantara-300 font-sans font-medium mb-1">
              <span>Consistency</span>
              <strong className="text-white font-mono">{score.consistency}%</strong>
            </div>
            <div className="w-full bg-quantara-950 rounded-full h-2 overflow-hidden p-0.5 border border-quantara-800">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${score.consistency}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
