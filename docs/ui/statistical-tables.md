# Quantara — Universal Statistical Table System Documentation

## Overview

The `StatisticalTable` system is Quantara's universal tabular renderer used across Modules 01–13 (Descriptives, Crosstabs, Correlation, t-Tests, ANOVA, Regression, Nonparametrics, Factor Analysis, and Cluster Analysis). It provides statistical rigor, precision formatting, publication exports, and analyst annotations.

---

## Features & Capabilities

### 1. Statistical Precision Control
- **Decimal Selector**: Toggle precision dynamically between $0, 1, 2, 3, 4,$ or $5$ decimal places across all numeric cells.
- **P-Value Formatting**: Standardized $p$-value representation ($p < .001$, exact decimal representation, zero-leading suppression).

### 2. Significance Star Notation
- **Toggle Button**: Enable/disable significance stars in table headers and cells.
- **Notation Standard**:
  - `*` : $p < .05$
  - `**` : $p < .01$
  - `***` : $p < .001$

### 3. Column Visibility Toggle
- Interactive column dropdown allowing analysts to hide/show specific table columns without modifying underlying analytical data.

### 4. Search & Filter
- Real-time text search filter box to isolate specific variables, parameters, or categories within large tables.

### 5. Analyst Annotation System
- Modal dialog for attaching notes, interpretations, or analytical warnings directly to a table card.
- Annotations render in styled serif blocks alongside statistical output.

### 6. Export & Copy Options
- **Copy TSV**: Tab-separated format ready for direct pasting into Microsoft Excel or Google Sheets.
- **Copy Markdown**: GitHub-flavored markdown table string for documentation.
- **Export CSV**: Instant file download (`.csv`) with full precision preservation.

---

## Technical Integration

```tsx
import { StatisticalTable } from '../components/StatisticalTable';

<StatisticalTable
  table={tableData}
  decimals={2}
  showSignificanceStarsDefault={true}
  isBookmarked={false}
  onBookmarkToggle={(tableId) => handleBookmark(tableId)}
/>
```
