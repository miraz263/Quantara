import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, ShieldCheck, Cpu, User, Play, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const AIAnalystPage: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Analyze whether income affects customer satisfaction.'
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      text: "I'll inspect the dataset and determine an appropriate statistical method for your research question.",
      plan: [
        'Inspect variables (income, satisfaction)',
        'Check missing values (0 missing cells found)',
        'Check parametric assumptions (residual normality passed)',
        'Run Pearson bivariate correlation',
        'Run OLS multiple linear regression model'
      ],
      result: 'Income is positively associated with customer satisfaction (Pearson r = 0.62, p < .001, OLS B = 0.000052). For every $10,000 increase in annual income, satisfaction score increases by 0.52 points.'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: `msg-${Date.now()}`, sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: "I've analyzed your question and formulated a recommended analytical procedure.",
        plan: [
          'Inspect target variable schemas',
          'Evaluate distribution skewness & variance equality',
          'Execute deterministic statistical procedure'
        ],
        result: 'Statistical calculation verified by Quantara Statistical Core: Target relationship is statistically significant (p < 0.01).'
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 max-w-5xl mx-auto w-full p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Analyst
              <Badge variant="purple">DEMO MODE</Badge>
            </h1>
            <p className="text-xs text-quantara-400 mt-0.5">
              Ask questions about your data. Quantara formulates analysis plans and verifies results via backend statistical engines.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs font-sans ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}

            <div className={`max-w-2xl space-y-3 rounded-2xl p-4 shadow-xl ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-quantara-900 border border-quantara-800 text-slate-200 rounded-tl-none'
            }`}>
              <p className="leading-relaxed">{m.text}</p>

              {m.plan && (
                <div className="mt-3 p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    Analysis Plan
                  </span>
                  <div className="space-y-1">
                    {m.plan.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {m.result && (
                <div className="p-3 bg-purple-950/60 border border-purple-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Statistical Result (Quantara Core)
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed pt-1 font-mono">
                    {m.result}
                  </p>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
                SL
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-purple-400 font-mono">
            <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
            <span>Quantara AI Analyst is formulating execution plan...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="bg-quantara-900 border border-quantara-800 rounded-xl p-2 flex items-center gap-2 shadow-xl">
        <input
          type="text"
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-quantara-500 outline-none font-medium"
          placeholder="Ask AI Analyst a question about your variables (e.g. Find variables correlated with satisfaction)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition"
        >
          <Send className="w-3.5 h-3.5" />
          Send
        </button>
      </form>
    </div>
  );
};
