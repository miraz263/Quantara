import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Copy, Play, Check } from 'lucide-react';

export const CodePage: React.FC = () => {
  const [language, setLanguage] = useState<'python' | 'r' | 'sql'>('python');
  const [copied, setCopied] = useState(false);

  const snippets = {
    python: `import pandas as pd
import numpy as np
import statsmodels.api as sm
from scipy import stats

# Read Quantara dataset
df = pd.read_parquet('customer_satisfaction.parquet')

# Fit OLS Multiple Linear Regression
X = sm.add_constant(df[['annual_income', 'age']])
y = df['satisfaction_score']

model = sm.OLS(y, X).fit()
print(model.summary())
`,
    r: `library(psych)
library(stats)

# Ingest Quantara dataset
df <- read.csv('customer_satisfaction.csv')

# Fit Multiple Linear Regression
model <- lm(satisfaction_score ~ annual_income + age, data = df)
summary(model)
`,
    sql: `SELECT 
    gender,
    education_level,
    COUNT(*) AS respondent_count,
    ROUND(AVG(annual_income), 2) AS mean_income,
    ROUND(AVG(satisfaction_score), 2) AS mean_satisfaction
FROM customer_satisfaction
GROUP BY gender, education_level
ORDER BY mean_satisfaction DESC;
`
  };

  const [code, setCode] = useState(snippets.python);

  const handleLangChange = (newLang: 'python' | 'r' | 'sql') => {
    setLanguage(newLang);
    setCode(snippets[newLang]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 overflow-hidden">
      {/* Editor Sub-Header */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-quantara-900 border-b border-quantara-800 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white">Monaco Statistical Code Editor</span>
          <span className="text-quantara-500">|</span>
          <button
            onClick={() => handleLangChange('python')}
            className={`px-3 py-1 rounded font-mono font-semibold transition ${language === 'python' ? 'bg-blue-600 text-white' : 'text-quantara-400 hover:text-white'}`}
          >
            Python
          </button>
          <button
            onClick={() => handleLangChange('r')}
            className={`px-3 py-1 rounded font-mono font-semibold transition ${language === 'r' ? 'bg-blue-600 text-white' : 'text-quantara-400 hover:text-white'}`}
          >
            R
          </button>
          <button
            onClick={() => handleLangChange('sql')}
            className={`px-3 py-1 rounded font-mono font-semibold transition ${language === 'sql' ? 'bg-blue-600 text-white' : 'text-quantara-400 hover:text-white'}`}
          >
            SQL
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-quantara-800 hover:bg-quantara-700 text-slate-200 rounded border border-quantara-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={() => alert("Backend code execution sandbox environment initialized.")}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded shadow-sm transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Execute Code
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full h-full">
        <Editor
          height="100%"
          language={language === 'sql' ? 'sql' : 'python'}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true
          }}
        />
      </div>
    </div>
  );
};
