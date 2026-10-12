# QUANTARA — AI-Powered Quantitative Intelligence Platform

> **From Data to Discovery.**

Quantara is an AI-native statistical, data science, research, econometrics, biostatistics, quality analytics, and quantitative intelligence platform. It bridges the gap between natural language statistical recommendations (Beginner workflow) and full deterministic statistical control, syntax, and diagnostic depth (Expert workflow).

---

## Architecture Principles

1. **Deterministic Calculation Core**: LLMs and AI reasoning layers **never** invent or calculate statistical results (p-values, test statistics, confidence intervals, coefficients). All calculations are executed by deterministic, verified statistical engines (NumPy, SciPy, Statsmodels, Pandas, Polars, DuckDB, Scikit-learn).
2. **Standardized Result Interchange**: Every procedure emits a standardized JSON format containing tables, summary statistics, model diagnostics, warnings, and reproducibility manifests.
3. **Reproducibility First**: All analytical outputs are strictly bound to immutable `dataset_version` snapshots, execution parameters, software/engine version tags, and generated Python/R code representations.

---

## Monorepo Layout

```text
quantara/
│
├── apps/
│   ├── web/                        # React 18 + Vite + TypeScript + AG Grid + ECharts
│   └── api/                        # FastAPI Backend Application & REST Controllers
│
├── services/
│   └── statistical-engine/         # Deterministic Statistical Execution Engine
│       ├── engine/
│       │   ├── descriptive.py      # Mean, Median, Variance, Skewness, Kurtosis, Min, Max, Normality
│       │   ├── frequencies.py      # Counts, Percentages, Valid %, Cumulative %, Bar charts
│       │   └── profiler.py         # Data Profiling & Measurement Level detection
│       └── tests/                  # Numerical correctness unit tests
│
├── packages/
│   └── shared-types/               # Shared TypeScript models and JSON Schemas
│
├── ARCHITECTURE.md                 # System Topology & Infrastructure Spec
├── ROADMAP.md                      # Implementation Milestones
├── docker-compose.yml
└── README.md
```

---

## Quick Start & Local Development

### 1. Run Backend API Tests & Statistical Validation
```bash
PYTHONPATH=apps/api:services/statistical-engine python3 -m unittest discover -s services/statistical-engine/tests
PYTHONPATH=apps/api:services/statistical-engine python3 -m unittest discover -s apps/api/tests
```

### 2. Start Backend API (FastAPI)
```bash
PYTHONPATH=apps/api:services/statistical-engine python3 apps/api/app/main.py
```
API Documentation will be live at `http://localhost:8000/docs`.

### 3. Build & Run Frontend Application (React 18 + Vite)
```bash
cd apps/web
npm install
npm run build
npm run dev
```
Frontend Workstation will be live at `http://localhost:3000`.

---

## Verification & Definition of Done

- [x] Application shell & dark theme scientific UI
- [x] Authentic database storage (PostgreSQL/SQLite)
- [x] Dataset upload & ingestion (CSV, XLSX, JSON, Parquet)
- [x] In-depth Data Profiling & Measurement Level inference
- [x] High-density AG Grid Data View
- [x] SPSS-style Variable View (Data Dictionary editor)
- [x] Deterministic Descriptive Statistics & Frequency Distribution
- [x] Apache ECharts interactive diagrams & box plots
- [x] Diagnostic checks (Shapiro-Wilk normality test, sample sizes)
- [x] Natural language interpretation & Python code generator
- [x] Automated unit and integration test suite passing cleanly
# Quantara
