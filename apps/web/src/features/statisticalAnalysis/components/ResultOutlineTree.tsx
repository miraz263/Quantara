import React, { useState } from 'react';
import { ChevronRight, ChevronDown, BookOpen, Star, Filter, Search, Layers, FileText, BarChart2, AlertCircle, Code2, Terminal } from 'lucide-react';

export interface OutlineItem {
  id: string;
  label: string;
  type: 'section' | 'table' | 'chart' | 'warning' | 'syntax' | 'code' | 'metadata';
  icon?: any;
  isFavorite?: boolean;
  children?: OutlineItem[];
}

interface ResultOutlineTreeProps {
  outlineItems: OutlineItem[];
  activeItemId: string;
  onSelectItem: (itemId: string) => void;
  onToggleFavorite?: (itemId: string) => void;
}

export const ResultOutlineTree: React.FC<ResultOutlineTreeProps> = ({
  outlineItems,
  activeItemId,
  onSelectItem,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'sec-tables': true,
    'sec-charts': true,
    'sec-diagnostics': true,
    'sec-code': true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getIconForType = (type: OutlineItem['type']) => {
    switch (type) {
      case 'table':
        return FileText;
      case 'chart':
        return BarChart2;
      case 'warning':
        return AlertCircle;
      case 'syntax':
        return Terminal;
      case 'code':
        return Code2;
      default:
        return Layers;
    }
  };

  const renderItem = (item: OutlineItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedNodes[item.id] ?? true;
    const isSelected = activeItemId === item.id;
    const ItemIcon = item.icon || getIconForType(item.type);

    if (searchQuery.trim() && !item.label.toLowerCase().includes(searchQuery.toLowerCase())) {
      if (!hasChildren || !item.children?.some((c) => c.label.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return null;
      }
    }

    return (
      <div key={item.id} className="space-y-0.5">
        <div
          onClick={() => onSelectItem(item.id)}
          className={`group flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer text-xs transition ${
            isSelected
              ? 'bg-blue-600 text-white font-bold shadow'
              : 'hover:bg-quantara-800 text-quantara-200'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 truncate">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(item.id, e)}
                className="p-0.5 hover:text-white text-quantara-400"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-3.5" />
            )}
            <ItemIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
            <span className="truncate">{item.label}</span>
          </div>

          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
              className={`p-1 opacity-0 group-hover:opacity-100 transition ${
                item.isFavorite ? 'opacity-100 text-amber-400' : 'text-quantara-500 hover:text-amber-300'
              }`}
              title="Bookmark Output Item"
            >
              <Star className={`w-3 h-3 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-quantara-900 border-r border-quantara-800 flex flex-col h-full font-sans select-none">
      {/* Header */}
      <div className="p-3 border-b border-quantara-800 space-y-2.5">
        <div className="text-[10px] font-bold text-quantara-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-white font-sans">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" /> SPSS Output Tree
          </span>
          <span className="font-mono text-quantara-500">v3.0</span>
        </div>

        <div className="relative">
          <Search className="w-3 h-3 text-quantara-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Filter outline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg pl-7 pr-2 py-1 text-[11px] outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {outlineItems.map((item) => renderItem(item, 0))}
      </div>
    </div>
  );
};
