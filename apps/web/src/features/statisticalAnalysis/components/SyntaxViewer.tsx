import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface SyntaxViewerProps {
  syntax: string;
}

export const SyntaxViewer: React.FC<SyntaxViewerProps> = ({ syntax }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(syntax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-quantara-950 border border-quantara-800 rounded-2xl p-5 shadow-2xl space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2 text-blue-400 font-bold font-sans">
          <Terminal className="w-4 h-4" />
          <span>Reproducibility Command Syntax</span>
        </div>

        <button
          onClick={handleCopy}
          className="px-2.5 py-1 bg-quantara-900 hover:bg-quantara-800 text-quantara-300 hover:text-white rounded text-xs transition border border-quantara-700 flex items-center gap-1 font-sans font-semibold"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied Syntax' : 'Copy Syntax'}
        </button>
      </div>

      <pre className="p-4 bg-quantara-900 border border-quantara-800/80 rounded-xl text-blue-300 overflow-x-auto leading-relaxed">
        {syntax}
      </pre>
    </div>
  );
};
