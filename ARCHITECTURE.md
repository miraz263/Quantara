# QUANTARA ARCHITECTURE DOCUMENTATION

> **QUANTARA — AI-Powered Quantitative Intelligence**  
> *From Data to Discovery.*

---

## 1. Executive Summary & Architectural Goals

Quantara is an AI-native statistical, data science, econometrics, biostatistics, quality analytics, and quantitative intelligence platform. It bridges the gap between natural language statistical recommendations (Beginner workflow) and full deterministic statistical control, syntax, and diagnostic depth (Expert workflow).

### Key Architectural Directives
1. **Deterministic Calculation Core**: LLMs and AI reasoning layers **never** calculate statistical results (p-values, test statistics, confidence intervals, coefficients). All calculations are executed by deterministic, verified statistical engines (NumPy, SciPy, Statsmodels, Pandas, Polars, DuckDB, Scikit-learn).
2. **Modular Monolith**: Initial deployment is structured as a clean, highly cohesive monorepo. Interfaces between API, Statistical Engine, and Data Processing layers are decoupled, enabling effortless microservice or distributed service extraction (e.g. Go control plane, Rust compute node, R runtime) in future phases.
3. **Standardized Result Interchange**: Every statistical procedure emits a unified Quantara Statistical Standard JSON response containing tables, summary statistics, model diagnostics, warnings, publication metadata, and reproducibility manifests.
4. **Reproducibility First**: All analytical outputs are strictly bound to immutable `dataset_version` snapshots, execution parameters, software/engine version tags, and code representations.

---

## 2. System Topology & Infrastructure

```text
                                  +-----------------------+
                                  |   React + TS Frontend |
                                  |   (Vite, AG Grid,     |
                                  |    Apache ECharts)    |
                                  +-----------+-----------+
                                              | HTTPS / WebSockets
                                              v
                                  +-----------------------+
                                  |   FastAPI API Gateway |
                                  |   (Async REST, Auth,  |
                                  |    Route Controllers) |
                                  +-----------+-----------+
                                              |
                +-----------------------------+-----------------------------+
                |                                                           |
                v                                                           v
  +---------------------------+                               +---------------------------+
  |  PostgreSQL Metadata Store|                               | Quantara Statistical Engine|
  |  (Users, Orgs, Projects,  |                               | (NumPy, SciPy, Statsmodels|
  |   Variables, Analyses)    |                               |  Scikit-learn, DuckDB)    |
  +---------------------------+                               +---------------------------+
                |                                                           |
                v                                                           v
  +---------------------------+                               +---------------------------+
  | Redis / Async Task Queue  |                               | Parquet / Storage Engine  |
  | (Job Queue, Health, PubSub|                               | (Arrow, DuckDB, File Storage|
  +---------------------------+                               +---------------------------+
```

---

## 3. Monorepo Layout

```text
quantara/
│
├── apps/
│   ├── web/                        # React 18 + Vite + TypeScript + Tailwind CSS
│   │   ├── src/
│   │   │   ├── components/         # Shared UI, Data Grid, Visualizations
│   │   │   ├── features/           # Workspace, Data View, Variable View, Analyze, AI
│   │   │   ├── store/              # Zustand state stores
│   │   │   ├── api/                # TanStack Query REST client hooks
│   │   │   └── types/              # Frontend TypeScript models
│   │   └── package.json
│   │
│   └── api/                        # FastAPI Backend Application
│       ├── app/
│       │   ├── api/v1/             # REST endpoints (auth, projects, datasets, analysis)
│       │   ├── core/               # Config, security, database session
│       │   ├── models/             # SQLAlchemy ORM models
│       │   ├── schemas/            # Pydantic request/response validation schemas
│       │   └── services/           # Business logic, dataset ingestion, profiler
│       └── main.py
│
├── services/
│   └── statistical-engine/         # Deterministic Statistical Execution Engine
│       ├── engine/
│       │   ├── descriptive/        # Mean, Median, Variance, Skewness, Kurtosis, Percentiles
│       │   ├── frequencies/        # Frequency tables, Cumulative %, Percentiles
│       │   ├── crosstabs/          # Contingency tables, Chi-Square, Cramer's V, Phi
│       │   ├── correlation/        # Pearson, Spearman, Kendall Tau, Covariance
│       │   ├── t_tests/            # One-sample, Independent, Paired
│       │   ├── anova/              # One-way, Two-way, ANCOVA, Post-hoc tests
│       │   ├── regression/         # OLS Linear, Multiple, Polynomial, Residuals
│       │   ├── logistic/           # Binary, Multinomial, Odds Ratios
│       │   ├── nonparametric/      # Mann-Whitney, Wilcoxon, Kruskal-Wallis, Friedman
│       │   └── profiler/           # Data Profiling, Missing value, Outlier, Distribution
│       ├── normalizer/             # Standardized Result Formatter
│       └── tests/                  # Numerical correctness unit tests (verifying against SciPy)
│
├── packages/
│   └── shared-types/               # JSON Schema & TypeScript definitions for API & Results
│
├── infrastructure/
│   └── docker/                     # Dockerfiles & service configurations
│
├── docs/                           # System Documentation
├── docker-compose.yml
├── .env.example
├── README.md
└── ARCHITECTURE.md
```

---

## 4. Database Schema (PostgreSQL)

```sql
-- Core User & Auth Schema
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Datasets & Storage Schema
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_type VARCHAR(50) NOT NULL, -- csv, xlsx, json, parquet
    storage_path TEXT NOT NULL,
    row_count INT NOT NULL DEFAULT 0,
    column_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE dataset_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    parquet_path TEXT NOT NULL,
    row_count INT NOT NULL,
    column_count INT NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE variables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_version_id UUID REFERENCES dataset_versions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    label VARCHAR(255),
    description TEXT,
    data_type VARCHAR(50) NOT NULL, -- integer, float, string, boolean, datetime
    measurement_level VARCHAR(50) NOT NULL, -- nominal, ordinal, scale
    categories JSONB,
    value_labels JSONB,
    missing_values JSONB,
    format VARCHAR(50),
    column_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis & Results Schema
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    dataset_version_id UUID REFERENCES dataset_versions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    analysis_type VARCHAR(100) NOT NULL, -- descriptive, frequency, crosstab, t_test, anova, regression
    parameters JSONB NOT NULL,
    result_data JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed', -- pending, processing, completed, failed
    execution_time_ms FLOAT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 5. Standardized Statistical Result Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "QuantaraStatisticalResult",
  "type": "object",
  "properties": {
    "analysis_id": { "type": "string", "format": "uuid" },
    "analysis_type": { "type": "string" },
    "dataset_version_id": { "type": "string", "format": "uuid" },
    "status": { "type": "string", "enum": ["completed", "failed", "warning"] },
    "parameters": { "type": "object" },
    "summary": { "type": "string" },
    "tables": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "columns": { "type": "array", "items": { "type": "string" } },
          "rows": { "type": "array", "items": { "type": "array" } },
          "footnotes": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["title", "columns", "rows"]
      }
    },
    "statistics": { "type": "object" },
    "diagnostics": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "status": { "type": "string", "enum": ["passed", "failed", "warning"] },
          "value": { "type": "number" },
          "p_value": { "type": "number" },
          "message": { "type": "string" }
        }
      }
    },
    "charts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "title": { "type": "string" },
          "data": { "type": "object" },
          "options": { "type": "object" }
        }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } },
    "interpretation": { "type": "string" },
    "execution_metadata": {
      "type": "object",
      "properties": {
        "engine": { "type": "string" },
        "engine_version": { "type": "string" },
        "duration_ms": { "type": "number" }
      }
    }
  },
  "required": ["analysis_type", "status", "parameters", "tables", "statistics", "execution_metadata"]
}
```

---

## 6. Security, Observability & Error Standards

1. **Authentication & Authorization**: JWT token auth stored securely with bcrypt password hashing.
2. **File Processing Sandbox**: Ingested files (CSV, XLSX, JSON) are parsed inside isolated memory buffers using strict tabular schema enforcement. Uploaded files are never executed.
3. **Structured Errors**: Every error returns a standardized schema:
```json
{
  "error": {
    "code": "INSUFFICIENT_OBSERVATIONS",
    "message": "The selected variable contains fewer than 2 valid numerical observations required for calculation.",
    "request_id": "qt_9a8b7c6d",
    "details": { "variable": "income", "valid_count": 1 }
  }
}
```
4. **Health Checks**: `/health` (liveness check) and `/ready` (database + DuckDB connectivity check).

---

## 7. Frontend Design System Guidelines

- **Typography**: Inter / JetBrains Mono for syntax and numeric data alignment.
- **Palette**: Slate/Zinc dark & light theme with high-contrast statistical data tables.
- **Layout**: High density, dual Data View / Variable View tabs, side panel statistical parameters, expandable diagnostic outputs.
- **Components**: AG Grid Community / Enterprise-compatible data grid, ECharts dynamic interactive charting.
