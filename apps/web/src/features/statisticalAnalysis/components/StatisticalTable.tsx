import React, { useState, useMemo } from 'react';
import { ResultTableData, ResultColumn, ResultRow } from '../types/analysisTypes';
import { StatisticalFormatter } from '../utils/statisticalFormatter';
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  Sliders,
  Star,
  MessageSquare,
  FileDown,
  Search,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Sparkles,
} from 'lucide-react';

export interface StatisticalTableProps {
  table: ResultTableData;
  decimals?: number;
  showSignificanceStarsDefault?: boolean;
  onBookmarkToggle?: (tableId: string) => void;
  isBookmarked?: boolean;
}

export const StatisticalTable: React.FC<StatisticalTableProps> = ({
  table,
  decimals = 2,
  showSignificanceStarsDefault = true,
  onBookmarkToggle,
  isBookmarked = false,
}) => {
  // Precision state
  const [activeDecimals, setActiveDecimals] = useState<number>(decimals);
  // Significance stars state
  const [showSigStars, setShowSigStars] = useState<boolean>(showSignificanceStarsDefault);
  // Column visibility state
  const [hiddenColKeys, setHiddenColKeys] = useState<string[]>([]);
  // Table search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Analyst note state
  const [analystNote, setAnalystNote] = useState<string>('');
  const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false);
  const [tempNote, setTempNote] = useState<string>('');
  // Collapse state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  // Copy success indicator
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Filter columns
  const visibleColumns = useMemo(() => {
    return table.columns.filter((c) => !hiddenColKeys.includes(c.key));
  }, [table.columns, hiddenColKeys]);

  // Filter rows by search
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return table.rows;
    const q = searchQuery.toLowerCase().trim();
    return table.rows.filter((r) =>
      Object.values(r).some((val) => String(val ?? '').toLowerCase().includes(q))
    );
  }, [table.rows, searchQuery]);

  // Format value helper
  const formatCellValue = (val: any, col: ResultColumn): string => {
    if (val === null || val === undefined || val === '') return '—';
    if (!col.isNumeric || typeof val !== 'number') return String(val);

    let formatted = StatisticalFormatter.formatStatValue(val, activeDecimals);

    // Significance stars check (if p-value or sig column)
    if (showSigStars && (col.key === 'pValue' || col.key === 'sig' || col.key === 'p')) {
      if (val < 0.001) formatted += '***';
      else if (val < 0.01) formatted += '**';
      else if (val < 0.05) formatted += '*';
    }

    return formatted;
  };

  // Copy Handlers
  const handleCopyTSV = () => {
    const headers = visibleColumns.map((c) => c.label).join('\t');
    const rowLines = filteredRows.map((r) =>
      visibleColumns.map((c) => formatCellValue(r[c.key], c)).join('\t')
    );
    const content = `${table.title}\n${headers}\n${rowLines.join('\n')}`;
    navigator.clipboard.writeText(content);
    setCopiedFormat('TSV');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopyMarkdown = () => {
    const headers = visibleColumns.map((c) => c.label).join(' | ');
    const sep = visibleColumns.map(() => '---').join(' | ');
    const rowLines = filteredRows.map((r) =>
      visibleColumns.map((c) => formatCellValue(r[c.key], c)).join(' | ')
    );
    const content = `### ${table.title}\n\n| ${headers} |\n| ${sep} |\n| ${rowLines.join(' |\n| ')} |`;
    navigator.clipboard.writeText(content);
    setCopiedFormat('Markdown');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Export handlers
  const handleExportCSV = () => {
    const headers = visibleColumns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',');
    const rowLines = filteredRows.map((r) =>
      visibleColumns.map((c) => `"${formatCellValue(r[c.key], c).replace(/"/g, '""')}"`).join(',')
    );
    const blob = new Blob([`${headers}\n${rowLines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${table.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`;
    link.click();
  };

  const toggleColumnHide = (key: string) => {
    if (hiddenColKeys.includes(key)) {
      setHiddenColKeys(hiddenColKeys.filter((k) => k !== key));
    } else {
      if (visibleColumns.length > 1) {
        setHiddenColKeys([...hiddenColKeys, key]);
      }
    }
  };

  const handleSaveNote = () => {
    setAnalystNote(tempNote.trim());
    setIsNoteOpen(false);
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl overflow-hidden shadow-2xl space-y-3 p-5 font-sans">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-quantara-800 rounded text-quantara-400 hover:text-white transition"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">{table.title}</h4>
              {onBookmarkToggle && (
                <button
                  onClick={() => onBookmarkToggle(table.id)}
                  className={`p-1 transition ${isBookmarked ? 'text-amber-400' : 'text-quantara-500 hover:text-amber-300'}`}
                  title="Bookmark Table"
                >
                  <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                </button>
              )}
            </div>
            {table.footnotes && table.footnotes[0] && (
              <p className="text-[11px] text-quantara-400 mt-0.5 italic">{table.footnotes[0]}</p>
            )}
          </div>
        </div>

        {/* 2. Controls Toolbar */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3 h-3 text-quantara-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-quantara-950 border border-quantara-700 text-white rounded-lg pl-7 pr-2 py-1 text-[11px] outline-none focus:border-blue-500 font-medium w-32"
            />
          </div>

          {/* Significance Star Toggle */}
          <button
            onClick={() => setShowSigStars(!showSigStars)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1 ${
              showSigStars ? 'bg-amber-950/60 border-amber-600 text-amber-300' : 'bg-quantara-950 border-quantara-700 text-quantara-400 hover:text-white'
            }`}
            title="Toggle Significance Stars (*p<.05, **p<.01, ***p<.001)"
          >
            <Sparkles className="w-3 h-3" />
            <span>Stars</span>
          </button>

          {/* Decimals Selector */}
          <div className="flex items-center gap-1 bg-quantara-950 px-2 py-1 rounded-lg border border-quantara-700 text-[11px] font-mono text-quantara-400">
            <span>Dec:</span>
            <select
              value={activeDecimals}
              onChange={(e) => setActiveDecimals(parseInt(e.target.value) || 2)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              {[0, 1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d} className="bg-quantara-900 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Column Visibility Selector */}
          <div className="relative group">
            <button className="p-1.5 bg-quantara-950 hover:bg-quantara-800 border border-quantara-700 text-quantara-300 hover:text-white rounded-lg transition">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block w-48 bg-quantara-950 border border-quantara-700 rounded-xl shadow-2xl p-2 z-50 text-[11px] space-y-1">
              <div className="font-bold text-quantara-400 uppercase tracking-wider px-2 py-1 border-b border-quantara-800">
                Visible Columns
              </div>
              {table.columns.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-quantara-900 rounded cursor-pointer text-white"
                >
                  <input
                    type="checkbox"
                    checked={!hiddenColKeys.includes(col.key)}
                    onChange={() => toggleColumnHide(col.key)}
                    className="rounded border-quantara-700 text-blue-500"
                  />
                  <span className="truncate">{col.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Copy Actions */}
          <button
            onClick={handleCopyMarkdown}
            className="px-2.5 py-1 bg-quantara-950 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-[11px] font-semibold transition border border-quantara-700 flex items-center gap-1.5"
            title="Copy as Markdown Table"
          >
            {copiedFormat ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
            {copiedFormat ? `Copied ${copiedFormat}` : 'Copy'}
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="p-1.5 bg-quantara-950 hover:bg-quantara-800 border border-quantara-700 text-quantara-300 hover:text-white rounded-lg transition"
            title="Export CSV File"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Analyst Note Modal Launcher */}
          <button
            onClick={() => {
              setTempNote(analystNote);
              setIsNoteOpen(true);
            }}
            className={`p-1.5 rounded-lg border transition ${
              analystNote
                ? 'bg-purple-950/60 border-purple-600 text-purple-300'
                : 'bg-quantara-950 border-quantara-700 text-quantara-400 hover:text-white'
            }`}
            title="Add Analyst Note / Annotation"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Analyst Note Display Box */}
      {analystNote && !isCollapsed && (
        <div className="p-3 bg-purple-950/40 border border-purple-800/80 rounded-xl text-xs text-purple-200 flex items-start gap-2 italic font-serif">
          <MessageSquare className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-sans font-bold uppercase tracking-wider text-[10px] text-purple-300 block not-italic">
              Analyst Annotation:
            </span>
            "{analystNote}"
          </div>
        </div>
      )}

      {/* 4. Table Body Container */}
      {!isCollapsed && (
        <div className="overflow-x-auto border border-quantara-800/60 rounded-xl">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-quantara-950 text-quantara-300 uppercase font-semibold text-[11px] border-b border-quantara-800 tracking-wider font-mono">
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-3 px-4 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-quantara-800/70 text-slate-200 font-mono">
              {filteredRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-quantara-800/40 transition">
                  {visibleColumns.map((col) => {
                    const formatted = formatCellValue(row[col.key], col);

                    return (
                      <td
                        key={col.key}
                        className={`py-3 px-4 ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        } ${
                          col.key === 'variable' || col.key === 'category' || col.key === 'parameter'
                            ? 'font-sans font-bold text-white'
                            : ''
                        }`}
                      >
                        {formatted}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Footnotes */}
      {!isCollapsed && table.footnotes && table.footnotes.length > 0 && (
        <div className="pt-2 border-t border-quantara-800/60 text-[11px] text-quantara-400 italic space-y-0.5">
          {table.footnotes.map((fn, idx) => (
            <div key={idx}>* {fn}</div>
          ))}
        </div>
      )}

      {/* Analyst Note Modal */}
      {isNoteOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Add Analyst Annotation for "{table.title}"
            </h3>

            <textarea
              rows={4}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Enter interpretation, notes, or analytical guidance..."
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl p-3 text-xs outline-none focus:border-purple-500 font-serif leading-relaxed"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-quantara-800">
              <button
                onClick={() => setIsNoteOpen(false)}
                className="px-3 py-1.5 bg-quantara-800 hover:bg-quantara-700 text-quantara-300 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition shadow-lg"
              >
                Save Annotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
