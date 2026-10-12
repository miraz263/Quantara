import React, { useState } from 'react';
import { Search, BarChart2, Hash, Layers, Sliders, Lock, Sparkles, HelpCircle, Target } from 'lucide-react';
import { ProcedureType } from '../types/analysisTypes';

interface AnalysisSidebarProps {
  activeProcedure: ProcedureType;
  onSelectProcedure: (proc: ProcedureType) => void;
}

export const AnalysisSidebar: React.FC<AnalysisSidebarProps> = ({ activeProcedure, onSelectProcedure }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const MODULE_05_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'descriptives', title: 'Descriptive Statistics', desc: 'Mean, SD, Median, Min, Max, Skewness & CIs', icon: BarChart2 },
    { id: 'frequencies', title: 'Frequencies', desc: 'Frequency tables, percentages & cumulative %', icon: Hash },
    { id: 'explore', title: 'Explore & Grouped Summaries', desc: 'Grouped descriptives, histograms & boxplots', icon: Layers },
    { id: 'crosstabs', title: 'Crosstabs (Cross-tabulation)', desc: '2-way contingency tables, row/col percentages', icon: Sliders },
  ];

  const MODULE_06_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'pearson', title: 'Pearson Correlation', desc: 'Bivariate product-moment linear correlation (r)', icon: Sliders },
    { id: 'spearman', title: 'Spearman Rank Correlation', desc: 'Non-parametric rank correlation (rho)', icon: Sliders },
    { id: 'kendall', title: "Kendall's Tau-b", desc: 'Rank correlation for tied ranks (tau_b)', icon: Sliders },
    { id: 'partial_correlation', title: 'Partial Correlation', desc: 'Correlation controlling for covariates', icon: Sliders },
  ];

  const MODULE_07_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'one_sample_ttest', title: 'One-Sample t-Test', desc: 'Compare sample mean against test value (μ₀)', icon: BarChart2 },
    { id: 'independent_ttest', title: 'Independent-Samples t-Test', desc: 'Compare 2 group means with Levene & Welch', icon: Layers },
    { id: 'paired_ttest', title: 'Paired-Samples t-Test', desc: 'Compare 2 related measurements (Pre vs Post)', icon: Sliders },
  ];

  const MODULE_08_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'one_way_anova', title: 'One-Way ANOVA & Post-Hoc', desc: 'Multi-group mean comparison with Welch & Tukey HSD', icon: Layers },
  ];

  const MODULE_09_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'linear_regression', title: 'Linear & Multiple Regression', desc: 'OLS model, R², ANOVA fit, VIF & residual diagnostics', icon: BarChart2 },
  ];

  const MODULE_10_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'mann_whitney', title: 'Mann–Whitney U Test', desc: '2 independent groups rank comparison with U & r_rb', icon: Layers },
    { id: 'wilcoxon_signed_rank', title: 'Wilcoxon Signed-Rank Test', desc: '2 related/paired samples rank comparison with W & Z', icon: Sliders },
    { id: 'kruskal_wallis', title: 'Kruskal–Wallis H Test', desc: '≥ 3 independent groups rank test with Dunn post-hoc', icon: Layers },
    { id: 'friedman', title: 'Friedman Test', desc: '≥ 3 related conditions repeated rank test with Kendall W', icon: BarChart2 },
  ];

  const MODULE_11_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'pca', title: 'Principal Component Analysis (PCA)', desc: 'Dimension reduction & component extraction', icon: Sliders },
    { id: 'efa', title: 'Exploratory Factor Analysis (EFA)', desc: 'Latent factor modeling with PAF & Oblimin/Varimax', icon: Layers },
  ];

  const MODULE_13_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'kmeans', title: 'K-Means Clustering', desc: 'Fast partitioning into K centroids with K-Means++ & Z-score', icon: Layers },
    { id: 'hierarchical', title: 'Hierarchical Clustering', desc: "Agglomerative tree merger with Ward's linkage & dendrogram", icon: Sliders },
  ];

  const MODULE_14_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'discriminant', title: 'Discriminant Analysis (LDA / MDA)', desc: 'Group classification, canonical functions & Wilks Lambda', icon: Target },
  ];

  const MODULE_15_PROCEDURES: Array<{ id: ProcedureType; title: string; desc: string; icon: any }> = [
    { id: 'logistic_regression', title: 'Logistic Regression Family', desc: 'Binary, Multinomial & Ordinal logit models with ROC/AUC', icon: Target },
  ];

  const COMING_SOON_CATEGORIES = [
    { name: 'ADVANCED REGRESSION', items: ['GLM', 'Ridge & Lasso', 'Robust Regression', 'Mixed-Effects'] },
    { name: 'COMPARE MEANS (ADVANCED)', items: ['Two-Way ANOVA', 'ANCOVA', 'MANOVA', 'Repeated Measures'] },
    { name: 'ADVANCED NONPARAMETRIC', items: ['Sign Test', 'Median Test', 'Cochran Q', 'McNemar Test'] },
    { name: 'ADVANCED LATENT MODELS', items: ['Confirmatory Factor Analysis (CFA)', 'Latent Class Analysis (LCA)'] },
  ];

  return (
    <div className="w-80 bg-quantara-900 border-r border-quantara-800 flex flex-col h-full font-sans">
      {/* Search Header */}
      <div className="p-4 border-b border-quantara-800 space-y-3">
        <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span>Statistical Procedures</span>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-quantara-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search procedure..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {/* Module 15 Logistic Regression */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
            LOGISTIC REGRESSION (MODULE 15)
          </div>
          <div className="space-y-1">
            {MODULE_15_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module 14 Discriminant Analysis */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">
            DISCRIMINANT & CLASSIFICATION (MODULE 14)
          </div>
          <div className="space-y-1">
            {MODULE_14_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-violet-400 group-hover:text-violet-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-violet-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module 05 Procedures */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
            DESCRIPTIVES & SUMMARY (MODULE 05)
          </div>
          <div className="space-y-1">
            {MODULE_05_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-blue-400 group-hover:text-blue-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module 06 Correlation Procedures */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
            CORRELATION & ASSOCIATION (MODULE 06)
          </div>
          <div className="space-y-1">
            {MODULE_06_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module 07 Compare Means / t-Tests */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
            COMPARE MEANS — t-TEST FAMILY (MODULE 07)
          </div>
          <div className="space-y-1">
            {MODULE_07_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module 08 ANOVA Family */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">
            COMPARE MEANS — ANOVA FAMILY (MODULE 08)
          </div>
          <div className="space-y-1">
            {MODULE_08_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-purple-400 group-hover:text-purple-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-purple-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module 09 Regression Procedures */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">
            REGRESSION ANALYSIS (MODULE 09)
          </div>
          <div className="space-y-1">
            {MODULE_09_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-rose-400 group-hover:text-rose-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-rose-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module 10 Nonparametric Procedures */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
            NONPARAMETRIC STATISTICS (MODULE 10)
          </div>
          <div className="space-y-1">
            {MODULE_10_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-amber-400 group-hover:text-amber-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module 11 Factor Analysis & Dimension Reduction Procedures */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
            DIMENSION REDUCTION & FACTOR (MODULE 11)
          </div>
          <div className="space-y-1">
            {MODULE_11_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-cyan-400 group-hover:text-cyan-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-cyan-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module 13 Cluster Analysis Procedures */}
        <div>
          <div className="px-2 py-1 text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">
            CLUSTER ANALYSIS (MODULE 13)
          </div>
          <div className="space-y-1">
            {MODULE_13_PROCEDURES.filter((p) =>
              searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((proc) => {
              const Icon = proc.icon;
              const isSelected = activeProcedure === proc.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => onSelectProcedure(proc.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-lg font-bold'
                      : 'hover:bg-quantara-800 text-quantara-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-violet-400 group-hover:text-violet-300'}`} />
                  <div>
                    <div className="font-semibold">{proc.title}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-violet-100' : 'text-quantara-400'}`}>
                      {proc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Future Disabled Procedures */}
        {COMING_SOON_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <div className="px-2 py-1 text-[10px] font-bold text-quantara-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-quantara-600" /> {cat.name}
            </div>
            <div className="space-y-0.5">
              {cat.items.map((item) => (
                <div
                  key={item}
                  className="px-2.5 py-1.5 text-quantara-500 text-[11px] rounded flex items-center justify-between opacity-70 cursor-not-allowed"
                >
                  <span>{item}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-quantara-950 text-quantara-600 border border-quantara-800">
                    Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
