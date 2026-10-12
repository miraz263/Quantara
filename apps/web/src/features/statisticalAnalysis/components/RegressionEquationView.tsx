import React, { useState } from 'react';
import { Copy, Check, Calculator, Sparkles } from 'lucide-react';

interface ParameterCoeff {
  parameter: string;
  b: number;
}

interface RegressionEquationViewProps {
  dependentVariable: string;
  coefficients: ParameterCoeff[];
  rSquared?: number;
  adjustedRSquared?: number;
}

export const RegressionEquationView: React.FC<RegressionEquationViewProps> = ({
  dependentVariable,
  coefficients,
  rSquared,
  adjustedRSquared,
}) => {
  const [copied, setCopied] = useState(false);

  // Format the equation string: y_hat = b0 + b1*X1 + b2*X2 ...
  const constantObj = coefficients.find((c) => c.parameter.toLowerCase().includes('constant') || c.parameter.toLowerCase().includes('intercept'));
  const predictors = coefficients.filter((c) => !c.parameter.toLowerCase().includes('constant') && !c.parameter.toLowerCase().includes('intercept'));

  const b0Str = constantObj ? constantObj.b.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';

  const predictorTerms = predictors.map((p) => {
    const sign = p.b >= 0 ? '+' : '-';
    const absB = Math.abs(p.b).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const cleanParam = p.parameter.replace(/\s*\(.*?\)/g, ''); // strip units in parentheses for equation
    return `${sign} ${absB}(${cleanParam})`;
  });

  const equationStr = `ŷ_${dependentVariable} = ${b0Str} ${predictorTerms.join(' ')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(equationStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-lg">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Estimated Regression Model Equation</h3>
            <p className="text-[11px] text-quantara-400">
              Parametric empirical formula derived from unstandardized coefficients ($B$)
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-quantara-950 hover:bg-quantara-800 border border-quantara-700 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow"
          title="Copy equation string"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
          <span>{copied ? 'Copied' : 'Copy Equation'}</span>
        </button>
      </div>

      {/* Main Equation Render Box */}
      <div className="p-4 bg-quantara-950 border border-blue-900/50 rounded-xl font-mono text-sm text-blue-200 tracking-wide overflow-x-auto shadow-inner flex items-center justify-between gap-4">
        <span>{equationStr}</span>
        {rSquared !== undefined && (
          <span className="text-xs text-quantara-400 font-sans font-semibold bg-quantara-900 px-2.5 py-1 rounded border border-quantara-800 whitespace-nowrap">
            R² = <span className="text-emerald-400 font-bold">{rSquared.toFixed(3)}</span>
          </span>
        )}
      </div>

      {/* Equation Explanatory Note */}
      <div className="text-[11px] text-quantara-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>
          Holding other predictors constant, a 1-unit increase in any predictor changes predicted ŷ by its respective unstandardized coefficient B.
        </span>
      </div>
    </div>
  );
};
