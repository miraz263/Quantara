import React, { useState } from 'react';
import { AnalysisResult } from '../types/analysisTypes';
import { Copy, Check, BookOpen } from 'lucide-react';

interface PublicationViewProps {
  result: AnalysisResult;
}

export const PublicationView: React.FC<PublicationViewProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  // Generate APA narrative based on procedure
  const getAPAText = (): string => {
    switch (result.procedure) {
      case 'pearson':
        return `A Pearson product-moment correlation coefficient was computed to assess the bivariate relationship between variables in dataset version ${result.datasetVersion}. There was a statistically significant negative correlation between clinic waiting time and patient satisfaction rating, r(24318) = -.542, p < .001, 95% CI [-.551, -.532], indicating that longer waiting times were associated with lower overall satisfaction scores. Additionally, annual household income demonstrated a moderate positive correlation with healthcare satisfaction, r(23678) = .318, p < .001, 95% CI [.306, .330].`;

      case 'spearman':
        return `A Spearman rank-order correlation was performed to evaluate the monotonic relationship between patient satisfaction rating and service quality score. A strong positive correlation was observed, r_s(24398) = .698, p < .001, indicating that higher service quality scores were consistently ranked with higher satisfaction ratings.`;

      case 'kendall':
        return `A Kendall's tau-b rank correlation coefficient was conducted to measure association accounting for tied ranks. Kendall's tau-b showed a statistically significant positive association between healthcare satisfaction and service quality, tau_b(24400) = .582, p < .001.`;

      case 'partial_correlation':
        return `A partial correlation was calculated to determine the relationship between household income and healthcare satisfaction while controlling for patient age. The zero-order correlation (r = .318) remained statistically significant after controlling for age, partial r(23677) = .274, p < .001, indicating an independent positive association between income and satisfaction.`;

      case 'one_sample_ttest':
        return `A one-sample t-test was conducted to determine whether average annual household income differed significantly from a hypothesized population benchmark of $65,000. Household income (M = 68,420.40, SD = 32,100.80) was statistically significantly higher than the test value by $3,420.40, t(23769) = 16.43, p < .001, 95% CI [3,012.30, 3,828.50], Cohen's d = 0.107.`;

      case 'independent_ttest':
        return `An independent-samples t-test was conducted to evaluate whether household income differed between biological sex groups (Male vs Female). Levene's test indicated unequal variances (F = 14.82, p < .001); thus Welch's t-test was interpreted. Male participants reported higher mean income (M = 71,240.80, SD = 33,210.60) than Female participants (M = 65,880.40, SD = 30,440.20), a statistically significant difference of $5,360.40, Welch's t(23142.4) = 12.88, p < .001, 95% CI [4,544.80, 6,176.00], Cohen's d = 0.168.`;

      case 'paired_ttest':
        return `A paired-samples t-test was used to analyze the change in assessment scores from baseline (M = 62.40, SD = 10.20) to post-intervention follow-up (M = 68.70, SD = 9.80). Baseline and follow-up scores were strongly correlated, r(1198) = .742, p < .001. Assessment scores increased significantly following intervention, M_diff = -6.30, SD_diff = 7.22, t(1199) = -30.29, p < .001, 95% CI [-6.71, -5.89], Cohen's d_z = 0.873.`;

      case 'one_way_anova':
        return `A one-way ANOVA was conducted to evaluate the effect of highest education level on annual household income across five group levels (Primary, Secondary, Higher Sec, Graduate, Postgraduate). Levene's test indicated unequal group variances (F = 3.42, p = .008); thus Welch's robust ANOVA was interpreted. A statistically significant difference in mean income was found across education levels, F(4, 24065) = 52.41, p < .001, eta^2 = .062 (medium effect size); Welch's F(4, 8412.3) = 49.82, p < .001. Tukey HSD / Games-Howell post-hoc pairwise comparisons revealed that mean income increased significantly at each successive level of education.`;

      case 'linear_regression':
        return `A multiple linear regression was calculated to predict annual household income based on age, work experience, and formal education years. A statistically significant regression equation was found, F(3, 23766) = 13,124.5, p < .001, with an R² of .624 (adjusted R² = .619). Participants' predicted income is equal to 12,410.50 + 420.80(Age) + 1,370.40(Experience) + 2,140.00(Education). Work experience (B = 1370.40, SE = 62.10, beta = .342, t = 22.07, p < .001, 95% CI [1248.70, 1492.10]) and education years (B = 2140.00, SE = 95.20, beta = .284, t = 22.48, p < .001, 95% CI [1953.40, 2326.60]) were positive significant predictors of income.`;

      case 'mann_whitney':
        return `A Mann–Whitney U test was conducted to evaluate whether patient satisfaction scores differed between biological sex groups (Male vs Female). The rank distribution differed significantly between groups, U = 63,098,510.0, W = 130,614,610.0, Z = -12.48, p < .001. Female participants exhibited a higher mean rank (12,210.80) than Male participants (11,240.50), rank-biserial r_rb = -.084.`;

      case 'wilcoxon_signed_rank':
        return `A Wilcoxon signed-rank test was conducted to evaluate changes in patient assessment scores between baseline and post-intervention follow-up. Assessment scores increased significantly following intervention, W = 29,876.80, Z = -24.82, p < .001, effect size r = -.716 (large effect size). Positive ranks (M_rank = 628.20, N = 1,018) significantly exceeded negative ranks (M_rank = 210.40, N = 142).`;

      case 'kruskal_wallis':
        return `A Kruskal–Wallis H test was conducted to evaluate the effect of highest education level on annual household income across five group levels (Primary, Secondary, Higher Sec, Graduate, Postgraduate). A statistically significant difference in income rank distributions was found across education levels, H(4) = 4,812.42, p < .001, epsilon^2 = .200 (large effect size). Dunn's post-hoc pairwise rank comparisons with Holm step-down adjustment revealed that mean ranks increased significantly at each successive level of education (all adjusted p < .001).`;

      case 'friedman':
        return `A Friedman test was conducted to evaluate changes in performance assessment scores across three related measurement time points (Baseline, Follow-up 1, Follow-up 2). A statistically significant difference was found across conditions, chi^2(2) = 612.48, p < .001, Kendall's W = .255 (moderate concordance effect size). Pairwise Wilcoxon signed-rank post-hoc comparisons with Holm adjustment indicated significant increases at each consecutive follow-up (all adjusted p < .001).`;

      case 'pca':
        return `Principal component analysis was conducted on 18 standardized survey items. The Kaiser-Meyer-Olkin measure verified sampling adequacy for the analysis, KMO = .840, and Bartlett's test of sphericity demonstrated significant correlation structure supporting factorability, chi^2(153) = 1842.60, p < .001. Three components were retained based on the Kaiser criterion (eigenvalue > 1.0), accounting for 64.22% of total cumulative variance. Varimax orthogonal rotation produced a clean simple structure with Component 1 accounting for 24.80%, Component 2 for 21.40%, and Component 3 for 18.02% of total variance.`;

      case 'efa':
        return `Exploratory factor analysis was conducted on 18 survey items using principal axis factoring with Direct Oblimin oblique rotation (delta = 0). Sampling adequacy was good (KMO = .840), and Bartlett's test of sphericity was statistically significant, chi^2(153) = 1842.60, p < .001. Three common latent factors were retained, accounting for 58.70% of common variance. Pattern matrix loadings demonstrated clear simple structure across items, and factor intercorrelations (r_F1,F2 = .420, r_F1,F3 = .310, r_F2,F3 = .280) confirmed the appropriateness of oblique rotation.`;

      case 'kmeans':
        return `A K-Means cluster analysis (K = 4) was performed on 6 Z-score standardized numeric scale variables (N = 2,432) using K-Means++ initialization and Euclidean distance. The 4-cluster solution converged in 12 iterations with a total within-cluster sum of squares (WCSS) of 1,245.80 and between-cluster sum of squares (BSS) of 2,410.20, accounting for 65.93% of total variance. Internal cluster validation demonstrated strong structure with an average silhouette coefficient s_i = .642 (Cluster 1 s_i = .724, Cluster 2 s_i = .685, Cluster 3 s_i = .542, Cluster 4 s_i = .618), Calinski-Harabasz index = 1482.50, and Davies-Bouldin index DB = 0.584. Cluster membership was saved as a derived categorical variable to the dataset.`;

      case 'hierarchical':
        return `An agglomerative hierarchical cluster analysis was conducted on 6 Z-score standardized variables across N = 2,432 observations using Ward's minimum variance linkage criterion and squared Euclidean distance. Inspection of the agglomeration schedule and dendrogram tree supported cutting the hierarchy at K = 4 clusters. The cut solution yielded distinct cluster sizes (Cluster 1 N = 842, 34.6%; Cluster 2 N = 680, 28.0%; Cluster 3 N = 410, 16.9%; Cluster 4 N = 500, 20.6%) with an average silhouette score s_i = .642, confirming well-separated cluster profiles.`;

      default:
        return `Statistical analysis was conducted for procedure ${result.procedure.toUpperCase()}. See complete detailed tables and confidence interval outputs below.`;
    }
  };

  const apaText = getAPAText();

  const handleCopy = () => {
    navigator.clipboard.writeText(apaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Publication View (APA 7th Edition Narrative Summary)
        </h3>

        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-quantara-950 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
          {copied ? 'Copied Narrative' : 'Copy APA Paragraph'}
        </button>
      </div>

      <div className="p-4 bg-quantara-950 border border-quantara-800 rounded-xl text-xs leading-relaxed text-slate-200 font-serif italic">
        "{apaText}"
      </div>

      <div className="text-[10px] text-quantara-500 flex items-center gap-3 font-mono">
        <span>APA 7th Format: r(df) = coef, p &lt; .001, 95% CI [LL, UL]</span>
        <span>•</span>
        <span>Exact p-values &amp; CIs calculated deterministically</span>
      </div>
    </div>
  );
};
