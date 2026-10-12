import React, { useState } from 'react';
import { AnalysisResult } from '../types/analysisTypes';
import { X, Code2, Copy, Check, Terminal } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface CodeGenModalProps {
  result: AnalysisResult;
  onClose: () => void;
}

export const CodeGenModal: React.FC<CodeGenModalProps> = ({ result, onClose }) => {
  const [lang, setLang] = useState<'python' | 'r'>('python');
  const [copied, setCopied] = useState(false);

  const generatePythonCode = () => {
    if (result.procedure === 'linear_regression') {
      return `# Quantara Statistical Engine - Generated Python Script (Linear Regression)
import pandas as pd
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
y = df["income"]
X = sm.add_constant(df[["age", "experience", "education"]])

model = sm.OLS(y, X).fit()
print("=== REGRESSION MODEL SUMMARY ===")
print(model.summary())
`;
    }
    if (result.procedure === 'mann_whitney') {
      return `# Quantara Statistical Engine - Generated Python Script (Mann-Whitney U)
import pandas as pd
import scipy.stats as stats

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
g1 = df[df["sex"] == "Male"]["satisfaction"].dropna()
g2 = df[df["sex"] == "Female"]["satisfaction"].dropna()

res = stats.mannwhitneyu(g1, g2, alternative='two-sided')
print("=== MANN-WHITNEY U TEST ===")
print(f"U statistic: {res.statistic}")
print(f"p-value: {res.pvalue}")
`;
    }
    if (result.procedure === 'wilcoxon_signed_rank') {
      return `# Quantara Statistical Engine - Generated Python Script (Wilcoxon Signed-Rank)
import pandas as pd
import scipy.stats as stats

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
x = df["before_score"].dropna()
y = df["after_score"].dropna()

res = stats.wilcoxon(x, y, zero_method='pratt')
print("=== WILCOXON SIGNED-RANK TEST ===")
print(f"W statistic: {res.statistic}")
print(f"p-value: {res.pvalue}")
`;
    }
    if (result.procedure === 'kruskal_wallis') {
      return `# Quantara Statistical Engine - Generated Python Script (Kruskal-Wallis H)
import pandas as pd
import scipy.stats as stats
import scikit_posthocs as sp

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
groups = [group["income"].values for name, group in df.groupby("education")]

h_stat, p_val = stats.kruskal(*groups)
print(f"Kruskal-Wallis H: {h_stat:.3f}, p: {p_val}")

print("\n=== DUNN POST-HOC TEST (HOLM) ===")
print(sp.posthoc_dunn(df, val_col='income', group_col='education', p_adjust='holm'))
`;
    }
    if (result.procedure === 'friedman') {
      return `# Quantara Statistical Engine - Generated Python Script (Friedman Test)
import pandas as pd
import scipy.stats as stats

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
t1, t2, t3 = df["score_t1"], df["score_t2"], df["score_t3"]

chi2, p_val = stats.friedmanchisquare(t1, t2, t3)
print(f"Friedman Chi-Square: {chi2:.3f}, p: {p_val}")
`;
    }

    if (result.procedure === 'pca') {
      return `# Quantara Statistical Engine - Generated Python Script (Principal Component Analysis)
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
items = [f"q{i}" for i in range(1, 19)]
X = df[items].dropna()

# Standardize variables (Z-score)
X_scaled = StandardScaler().fit_transform(X)

# Fit OLS PCA model with 3 components
pca = PCA(n_components=3)
scores = pca.fit_transform(X_scaled)

print("=== EXPLAINED VARIANCE RATIO ===")
print(pca.explained_variance_ratio_)
print("\n=== COMPONENT LOADINGS ===")
loadings = pd.DataFrame(pca.components_.T, index=items, columns=['PC1', 'PC2', 'PC3'])
print(loadings)
`;
    }
    if (result.procedure === 'efa') {
      return `# Quantara Statistical Engine - Generated Python Script (Exploratory Factor Analysis)
import pandas as pd
from factor_analyzer import FactorAnalyzer

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
items = [f"q{i}" for i in range(1, 19)]
X = df[items].dropna()

# Fit EFA model with PAF extraction and Direct Oblimin rotation
fa = FactorAnalyzer(n_factors=3, method='pa', rotation='oblimin')
fa.fit(X)

print("=== COMMUNAILITIES ===")
print(fa.get_communalities())
print("\n=== PATTERN MATRIX LOADINGS ===")
print(pd.DataFrame(fa.loadings_, index=items, columns=['F1', 'F2', 'F3']))
`;
    }
    if (result.procedure === 'kmeans') {
      return `# Quantara Statistical Engine - Generated Python Script (K-Means Clustering)
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
vars_cluster = ["income", "satisfaction", "age", "work_exp", "quality_score", "loyalty_index"]
X = df[vars_cluster].dropna()

# Standardize features (Z-Score)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Fit K-Means model with K-Means++ initialization & fixed seed (42)
kmeans = KMeans(n_clusters=4, init='k-means++', random_state=42, n_init=10)
labels = kmeans.fit_predict(X_scaled)

print("=== K-MEANS CENTROIDS (STANDARDIZED) ===")
centroids = pd.DataFrame(kmeans.cluster_centers_, columns=vars_cluster)
print(centroids)

print(f"\nWithin-Cluster SS (Inertia): {kmeans.inertia_:.2f}")
print(f"Average Silhouette Score: {silhouette_score(X_scaled, labels):.3f}")
print(f"Calinski-Harabasz Index: {calinski_harabasz_score(X_scaled, labels):.1f}")
print(f"Davies-Bouldin Index: {davies_bouldin_score(X_scaled, labels):.3f}")
`;
    }
    if (result.procedure === 'hierarchical') {
      return `# Quantara Statistical Engine - Generated Python Script (Hierarchical Clustering)
import pandas as pd
import scipy.cluster.hierarchy as sch
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import AgglomerativeClustering

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
vars_cluster = ["income", "satisfaction", "age", "work_exp", "quality_score", "loyalty_index"]
X = df[vars_cluster].dropna()

# Standardize features (Z-Score)
X_scaled = StandardScaler().fit_transform(X)

# Perform Agglomerative Hierarchical Clustering with Ward's linkage
hc = AgglomerativeClustering(n_clusters=4, metric='euclidean', linkage='ward')
labels = hc.fit_predict(X_scaled)

print("=== CLUSTER SIZES ===")
print(pd.Series(labels).value_counts())
`;
    }
    if (result.procedure === 'discriminant') {
      return `# Quantara Statistical Engine - Generated Python Script (Linear Discriminant Analysis - LDA)
import pandas as pd
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.model_selection import LeaveOneOut, cross_val_score
from sklearn.metrics import classification_report

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
X = df[["income", "age", "spending_score", "loyalty_score"]].dropna()
y = df.loc[X.index, "target_segment"]

# Fit Linear Discriminant Analysis (LDA)
lda = LinearDiscriminantAnalysis(solver='svd', store_covariance=True)
X_lda = lda.fit_transform(X, y)

print("=== CANONICAL EIGENVALUES & EXPLAINED VARIANCE ===")
print(f"Explained Variance Ratio: {lda.explained_variance_ratio_}")

print("\n=== STANDARDIZED DISCRIMINANT COEFFICIENTS ===")
print(pd.DataFrame(lda.scalings_, index=["income", "age", "spending_score", "loyalty_score"], columns=[f"LD{i+1}" for i in range(lda.scalings_.shape[1])]))

print("\n=== CLASSIFICATION REPORT ===")
y_pred = lda.predict(X)
print(classification_report(y, y_pred))

# Leave-One-Out Cross-Validation
loo_scores = cross_val_score(lda, X, y, cv=LeaveOneOut())
print(f"Cross-Validated Accuracy (LOOCV): {loo_scores.mean() * 100:.2f}%")
`;
    }
    if (result.procedure === 'logistic_regression') {
      return `# Quantara Statistical Engine - Generated Python Script (Binary Logistic Regression)
import pandas as pd
import numpy as np
import statsmodels.api as sm
from sklearn.metrics import classification_report, roc_auc_score

df = pd.read_parquet("clinical_trial_patients_v3.parquet")
y = df["default_status"]
X = df[["income", "age", "spending_score", "loyalty_score"]]

# Add constant for intercept term β0
X_const = sm.add_constant(X)

# Fit Logistic Regression Model (Maximum Likelihood)
logit_model = sm.Logit(y, X_const).fit()

print("=== LOGISTIC REGRESSION MODEL SUMMARY ===")
print(logit_model.summary())

# Odds Ratios & 95% Confidence Intervals
params = logit_model.params
conf = logit_model.conf_int()
conf['Odds Ratio'] = params
conf.columns = ['2.5%', '97.5%', 'Odds Ratio']
odds_ratios = np.exp(conf[['Odds Ratio', '2.5%', '97.5%']])

print("\n=== ODDS RATIOS & 95% CONFIDENCE INTERVALS ===")
print(odds_ratios)

# Predictions & ROC AUC Evaluation
pred_probs = logit_model.predict(X_const)
print(f"\nROC AUC Score: {roc_auc_score(y, pred_probs):.4f}")
`;
    }

    return `# Quantara Statistical Engine - Generated Python Script
import pandas as pd
import scipy.stats as stats

df = pd.read_parquet("clinical_trial_patients_v2.parquet")
vars_to_analyze = ["age", "income", "satisfaction"]

print("=== DESCRIPTIVE STATISTICS SUMMARY ===")
desc = df[vars_to_analyze].describe().T
print(desc)
`;
  };

  const generateRCode = () => {
    if (result.procedure === 'pca') {
      return `# Quantara Statistical Engine - Generated R Script (PCA)
library(arrow)

df <- read_parquet("clinical_trial_patients_v3.parquet")
items <- paste0("q", 1:18)
X <- na.omit(df[, items])

pca_res <- prcomp(X, scale. = TRUE)
summary(pca_res)

# Varimax rotation on first 3 components
varimax_res <- varimax(pca_res$rotation[, 1:3])
print(varimax_res$loadings)
`;
    }
    if (result.procedure === 'efa') {
      return `# Quantara Statistical Engine - Generated R Script (EFA)
library(arrow)
library(psych)

df <- read_parquet("clinical_trial_patients_v3.parquet")
items <- paste0("q", 1:18)
X <- na.omit(df[, items])

fa_res <- fa(X, nfactors = 3, fm = "pa", rotate = "oblimin")
print(fa_res)
print(fa_res$Structure)
print(fa_res$Phi) # Factor correlation matrix
`;
    }
    if (result.procedure === 'kmeans') {
      return `# Quantara Statistical Engine - Generated R Script (K-Means Clustering)
library(arrow)
library(cluster)

df <- read_parquet("clinical_trial_patients_v3.parquet")
vars_cluster <- c("income", "satisfaction", "age", "work_exp", "quality_score", "loyalty_index")
X <- na.omit(df[, vars_cluster])
X_scaled <- scale(X)

set.seed(42)
km_res <- kmeans(X_scaled, centers = 4, nstart = 25)

print("=== CLUSTER CENTROIDS ===")
print(km_res$centers)

cat("\nWithin-Cluster SS:", sum(km_res$withinss), "\n")
cat("Between-Cluster SS:", km_res$betweenss, "\n")
cat("BSS / Total SS:", round((km_res$betweenss / km_res$totss) * 100, 1), "%\n")

# Silhouette evaluation
sil <- silhouette(km_res$cluster, dist(X_scaled))
cat("Average Silhouette:", mean(sil[, 3]), "\n")
`;
    }
    if (result.procedure === 'hierarchical') {
      return `# Quantara Statistical Engine - Generated R Script (Hierarchical Clustering)
library(arrow)

df <- read_parquet("clinical_trial_patients_v3.parquet")
vars_cluster <- c("income", "satisfaction", "age", "work_exp", "quality_score", "loyalty_index")
X <- na.omit(df[, vars_cluster])
X_scaled <- scale(X)

# Compute Ward's minimum variance hierarchical tree
d <- dist(X_scaled, method = "euclidean")
hc_res <- hclust(d, method = "ward.D2")

# Cut tree into 4 clusters
cluster_groups <- cutree(hc_res, k = 4)
table(cluster_groups)

plot(hc_res, main = "Dendrogram (Ward's Linkage)")
rect.hclust(hc_res, k = 4, border = "red")
`;
    }
    if (result.procedure === 'linear_regression') {
      return `# Quantara Statistical Engine - Generated R Script (Linear Regression)
library(arrow)
library(car)

df <- read_parquet("clinical_trial_patients_v3.parquet")
model <- lm(income ~ age + experience + education, data = df)
print(summary(model))
print(vif(model))
`;
    }
    if (result.procedure === 'mann_whitney') {
      return `# Quantara Statistical Engine - Generated R Script (Mann-Whitney U)
library(arrow)

df <- read_parquet("clinical_trial_patients_v3.parquet")
res <- wilcox.test(satisfaction ~ sex, data = df, exact = FALSE)
print(res)
`;
    }
    if (result.procedure === 'wilcoxon_signed_rank') {
      return `# Quantara Statistical Engine - Generated R Script (Wilcoxon Signed-Rank)
library(arrow)

df <- read_parquet("clinical_trial_patients_v3.parquet")
res <- wilcox.test(df$before_score, df$after_score, paired = TRUE)
print(res)
`;
    }
    if (result.procedure === 'kruskal_wallis') {
      return `# Quantara Statistical Engine - Generated R Script (Kruskal-Wallis H)
library(arrow)
library(dunn.test)

df <- read_parquet("clinical_trial_patients_v3.parquet")
res <- kruskal.test(income ~ education, data = df)
print(res)

cat("\n=== DUNN POST-HOC TEST (HOLM) ===\n")
dunn.test(df$income, df$education, method = "holm")
`;
    }
    if (result.procedure === 'friedman') {
      return `# Quantara Statistical Engine - Generated R Script (Friedman Test)
library(arrow)

df <- read_parquet("clinical_trial_patients_v3.parquet")
mat <- as.matrix(df[, c("score_t1", "score_t2", "score_t3")])
res <- friedman.test(mat)
print(res)
`;
    }
    if (result.procedure === 'discriminant') {
      return `# Quantara Statistical Engine - Generated R Script (Linear Discriminant Analysis)
library(arrow)
library(MASS)

df <- read_parquet("clinical_trial_patients_v3.parquet")
df_clean <- na.omit(df[, c("target_segment", "income", "age", "spending_score", "loyalty_score")])

# Fit LDA model using MASS::lda
lda_model <- lda(target_segment ~ income + age + spending_score + loyalty_score, data = df_clean, CV = FALSE)

print("=== DISCRIMINANT MODEL SUMMARY ===")
print(lda_model)

# Standardized Canonical Coefficients
print("\n=== CANONICAL DISCRIMINANT COEFFICIENTS (LDs) ===")
print(lda_model$scaling)

# Leave-One-Out Cross-Validation
lda_cv <- lda(target_segment ~ income + age + spending_score + loyalty_score, data = df_clean, CV = TRUE)
conf_mat <- table(Actual = df_clean$target_segment, Predicted = lda_cv$class)
print("\n=== CROSS-VALIDATED CONFUSION MATRIX ===")
print(conf_mat)
cat("Cross-Validated Accuracy:", round(sum(diag(conf_mat)) / sum(conf_mat) * 100, 2), "%\n")
`;
    }
    if (result.procedure === 'logistic_regression') {
      return `# Quantara Statistical Engine - Generated R Script (Binary Logistic Regression)
library(arrow)

df <- read_parquet("clinical_trial_patients_v3.parquet")

# Fit Logistic Regression Model (GLM Binomial)
model <- glm(default_status ~ income + age + spending_score + loyalty_score, data = df, family = binomial(link = "logit"))

print("=== LOGISTIC REGRESSION MODEL SUMMARY ===")
summary(model)

# Odds Ratios & 95% Confidence Intervals
cat("\n=== ODDS RATIOS & 95% CONFIDENCE INTERVALS ===\n")
or_table <- exp(cbind(OR = coef(model), confint(model)))
print(or_table)

# Predicted Probabilities & Classification Table (Cutoff = 0.50)
pred_probs <- predict(model, type = "response")
pred_classes <- ifelse(pred_probs >= 0.50, 1, 0)
conf_matrix <- table(Actual = df$default_status, Predicted = pred_classes)

cat("\n=== CONFUSION MATRIX (Cutoff c = 0.50) ===\n")
print(conf_matrix)
cat("Model Accuracy:", round(sum(diag(conf_matrix)) / sum(conf_matrix) * 100, 2), "%\n")
`;
    }

    return `# Quantara Statistical Engine - Generated R Script
library(arrow)
df <- read_parquet("clinical_trial_patients_v2.parquet")
summary(df)
`;
  };

  const codeText = lang === 'python' ? generatePythonCode() : generateRCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-quantara-950 border-b border-quantara-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Generated Executable Code (Reproducibility)</h3>
          </div>
          <button onClick={onClose} className="text-quantara-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Switcher */}
        <div className="p-4 bg-quantara-950 border-b border-quantara-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setLang('python')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                lang === 'python' ? 'bg-blue-600 text-white' : 'bg-quantara-900 text-quantara-400 hover:text-white'
              }`}
            >
              Python (pandas / scipy)
            </button>

            <button
              onClick={() => setLang('r')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                lang === 'r' ? 'bg-blue-600 text-white' : 'bg-quantara-900 text-quantara-400 hover:text-white'
              }`}
            >
              R (arrow / psych)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-quantara-900 hover:bg-quantara-800 text-quantara-300 hover:text-white rounded-lg text-xs font-semibold transition border border-quantara-700 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
            {copied ? 'Copied Script' : 'Copy Code'}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-5 font-mono text-xs overflow-x-auto max-h-96">
          <pre className="p-4 bg-quantara-950 border border-quantara-800 rounded-xl text-emerald-300 leading-relaxed">
            {codeText}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-quantara-950 border-t border-quantara-800 flex justify-end">
          <Button onClick={onClose} variant="primary" size="sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
