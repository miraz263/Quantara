import React, { useState } from 'react';
import { Calculator, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface InteractivePredictionPanelProps {
  intercept?: number;
  coefficients?: Record<string, number>;
  cutoff?: number;
}

export const InteractivePredictionPanel: React.FC<InteractivePredictionPanelProps> = ({
  intercept = -4.85,
  coefficients = {
    age: 0.042,
    income: 0.000025,
    satisfaction: -0.68,
    work_exp: 0.015,
  },
  cutoff = 0.50,
}) => {
  const [inputs, setInputs] = useState<Record<string, number>>({
    age: 42,
    income: 85000,
    satisfaction: 4,
    work_exp: 10,
  });

  const handleInputChange = (varName: string, val: number) => {
    setInputs((prev) => ({ ...prev, [varName]: val }));
  };

  // Compute Logit η = β0 + Σ βi * Xi
  let eta = intercept;
  Object.entries(coefficients).forEach(([varName, beta]) => {
    const val = inputs[varName] !== undefined ? inputs[varName] : 0;
    eta += beta * val;
  });

  // Probability p = 1 / (1 + exp(-η))
  const probability = 1 / (1 + Math.exp(-eta));
  const isPositiveClass = probability >= cutoff;

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" /> Interactive Probability Prediction Tool
        </h4>
        <span className="text-[11px] text-quantara-400 font-medium">
          Fitted Model Logit Evaluation ($p = \frac{"{"}1{"}"}{"{"}1 + e^{"{"}-\eta{"}"}{"}"}$)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Predictor Input Controls */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-quantara-300 uppercase tracking-wider">Predictor Value Inputs</h5>
          <div className="space-y-2.5">
            {Object.keys(coefficients).map((varName) => (
              <div key={varName} className="flex items-center justify-between gap-3 text-xs bg-quantara-950 p-2.5 rounded-xl border border-quantara-800">
                <span className="font-semibold text-quantara-200 capitalize">{varName.replace(/_/g, ' ')}:</span>
                <input
                  type="number"
                  value={inputs[varName] !== undefined ? inputs[varName] : ''}
                  onChange={(e) => handleInputChange(varName, parseFloat(e.target.value) || 0)}
                  className="w-28 bg-quantara-900 border border-quantara-700 text-white rounded-lg px-2.5 py-1 text-right outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Computed Prediction Outcome */}
        <div className="bg-quantara-950/80 border border-quantara-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h5 className="text-xs font-bold text-quantara-300 uppercase tracking-wider mb-2">Model Prediction Output</h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-quantara-400">
                <span>Linear Predictor ($\eta$):</span>
                <span className="font-mono text-white font-bold">{eta.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between text-quantara-400">
                <span>Classification Threshold:</span>
                <span className="font-mono text-white font-bold">{cutoff.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-quantara-900 border border-quantara-700 rounded-xl space-y-2 text-center">
            <div className="text-[11px] font-bold text-quantara-400 uppercase tracking-wider">
              Predicted Outcome Probability ($P(Y=1)$)
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {(probability * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-quantara-300">
              Raw Probability: <span className="font-mono text-white font-bold">{probability.toFixed(4)}</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold ${
            isPositiveClass
              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
              : 'bg-blue-950/80 border-blue-700 text-blue-300'
          }`}>
            {isPositiveClass ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-blue-400" />}
            <span>Predicted Class: {isPositiveClass ? '1 (Yes / Positive Outcome)' : '0 (No / Negative Outcome)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
