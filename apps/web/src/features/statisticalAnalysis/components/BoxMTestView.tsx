import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface BoxMTestViewProps {
  boxMValue: number;
  approxF: number;
  df1: number;
  df2: number;
  pValue: string;
}

export const BoxMTestView: React.FC<BoxMTestViewProps> = ({
  boxMValue = 48.20,
  approxF = 3.12,
  df1 = 30,
  df2 = 842104.5,
  pValue = '.002',
}) => {
  const isSig = pValue === '< .001' || parseFloat(pValue.replace('<', '').trim()) < 0.05;

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-2xl space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-violet-400" /> Box's Test of Equality of Covariance Matrices
        </h4>
        <span className="text-[11px] font-mono text-quantara-400">Multivariate Homogeneity Test</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl">
          <div className="text-[10px] text-quantara-400 font-sans uppercase">Box's M</div>
          <div className="text-sm font-bold text-white mt-1">{boxMValue.toFixed(2)}</div>
        </div>

        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl">
          <div className="text-[10px] text-quantara-400 font-sans uppercase">Approx. F</div>
          <div className="text-sm font-bold text-white mt-1">{approxF.toFixed(2)}</div>
        </div>

        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl">
          <div className="text-[10px] text-quantara-400 font-sans uppercase">df1</div>
          <div className="text-sm font-bold text-white mt-1">{df1}</div>
        </div>

        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl">
          <div className="text-[10px] text-quantara-400 font-sans uppercase">df2</div>
          <div className="text-sm font-bold text-white mt-1">{df2.toLocaleString()}</div>
        </div>

        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl">
          <div className="text-[10px] text-quantara-400 font-sans uppercase">Sig. (p)</div>
          <div className={`text-sm font-bold mt-1 ${isSig ? 'text-amber-400' : 'text-emerald-400'}`}>{pValue}</div>
        </div>
      </div>

      <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl text-xs text-quantara-300 flex items-start gap-2 italic font-sans leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block not-italic">Methodological Diagnostic Note:</span>
          Box's M tests the null hypothesis that group covariance matrices are equal. Box's M is notoriously sensitive to sample size and departures from multivariate normality. When sample sizes are equal, linear discriminant analysis (LDA) remains robust to violations.
        </div>
      </div>
    </div>
  );
};
