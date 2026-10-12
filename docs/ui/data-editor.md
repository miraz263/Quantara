# Quantara — Data Editor Documentation

## Overview

The **Quantara Data Editor** is a high-performance, spreadsheet-inspired data management workspace designed for quantitative analysts and data scientists. It provides an intuitive dual-view mode:

1. **Data View**: AG Grid community engine rendering raw numerical values, user-defined value labels (e.g. `1 = Male, 2 = Female`), inline cell editing, range selection, cell coordinates, undo/redo, search/replace, and TSV copy/paste.
2. **Variable View**: SPSS-inspired variable dictionary grid for configuring Variable Name, Data Type, Width, Decimals, Variable Label, Value Labels mapping, Missing Values rules, Alignment, Measure Level (Nominal, Ordinal, Scale), and Variable Role.

---

## Key Features

### Data View
- **Spreadsheet Operations**: Cell range selection, inline value editing, keyboard navigation (`Arrow Keys`, `Tab`, `Enter`).
- **Value Labels Toggle**: Switch between raw values (`1`, `2`) and user labels (`● Male`, `● Female`) in real-time.
- **Copy / Paste**: Full TSV parser supporting clipboard operations to/from Excel, SPSS, and R.
- **Formula & Coordinates Bar**: Shows active cell location (`R12:C3`) and raw value.
- **Row & Variable Operations**: Insert rows, delete rows, append variables, reorder columns, freeze key columns.

### Variable View
- **Data Types**: `string`, `integer`, `float`, `boolean`, `date`, `datetime`.
- **Type Safety Safeguards**: Modal warnings when modifying data types to prevent data truncation.
- **Value Labels Modal**: Modal dialog for defining integer/string value label maps.
- **Missing Values Modal**: Discrete missing values configuration (`99, 999, NA`).
- **Measurement Scale**: `Nominal` (categorical), `Ordinal` (ranked), `Scale` (continuous numerical).
- **Variable Role**: `Input`, `Target`, `Both`, `None`, `Partition`, `Frequency`, `Weight`, `ID`.

---

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + Z` / `Cmd + Z` | Undo last data edit |
| `Ctrl + Y` / `Cmd + Y` | Redo data edit |
| `Ctrl + C` / `Cmd + C` | Copy selected cell range as TSV |
| `Ctrl + V` / `Cmd + V` | Paste TSV contents into grid |
| `Ctrl + F` / `Cmd + F` | Open Find & Replace Dialog |
