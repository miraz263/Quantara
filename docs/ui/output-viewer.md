# Quantara — SPSS-Style Output Viewer Documentation

## Overview

The **Quantara Output Viewer** is an interactive, hierarchical results navigation system modeled after classic SPSS Output Viewers and modern analytical IDEs. It organizes statistical results into expandable nodes, interactive tables, diagnostic plots, and publication manuscript paragraphs.

---

## Architecture & Layout

The Output Viewer consists of three main view modes:

1. **Interactive SPSS View**:
   - **Left Sidebar**: `ResultOutlineTree` providing tree navigation across Executive Summary, APA 7th Narrative, Statistical Tables, Visualizations, Assumption Diagnostics, Warnings, and Syntax.
   - **Search & Filter**: Outline filter box for quickly jumping to specific table titles or procedure metrics.
   - **Bookmarks**: Star (`★`) favorite output nodes for quick reference.
   - **Smooth Anchor Scroll**: Clicking any item in the tree smoothly scrolls the main viewport to that section.

2. **APA 7th Manuscript Mode**:
   - Auto-generated APA 7th edition manuscript paragraphs with statistical notation (e.g. *t*(498) = 4.21, *p* < .001, *d* = 0.42).
   - Clean, formatted APA tables with standard borders and footnote notation.

3. **Printable Report Mode**:
   - Optimized report layout formatted for PDF export or browser printing (`Ctrl + P`).
   - Standard headers, section numbering, and print page breaks.

---

## Outline Nodes Hierarchy

```
Output Tree Root
├── Executive Summary
├── APA 7th Narrative
├── Statistical Tables
│   ├── Table 1: Descriptives
│   └── Table 2: Model Coefficients
├── Visualizations & Charts
│   ├── Correlation Heatmap
│   └── Scatter Plot with Fit Line
├── Model Diagnostics
│   ├── KMO & Bartlett Test
│   └── VIF Collinearity
├── Statistical Warnings
└── Syntax & Reproducibility
```
