import React from 'react';
import { Search, Filter, Star, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { DatasetFilters, DatasetSortOption, DatasetSourceType, DatasetStatus } from '../types/datasetTypes';

interface DatasetFilterToolbarProps {
  filters: DatasetFilters;
  onFilterChange: (filters: DatasetFilters) => void;
  sort: DatasetSortOption;
  onSortChange: (sort: DatasetSortOption) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  totalCount: number;
}

export const DatasetFilterToolbar: React.FC<DatasetFilterToolbarProps> = ({
  filters,
  onFilterChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
}) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 space-y-3 shadow-lg font-sans">
      {/* Top Bar: Search & Primary Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-quantara-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search datasets by name, description, tag, or format..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-500 font-medium placeholder-quantara-500"
          />
        </div>

        {/* Controls: Favorites Toggle, Sort, View Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Favorite filter toggle */}
          <button
            onClick={() => onFilterChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              filters.favoritesOnly
                ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                : 'bg-quantara-950 border-quantara-700 text-quantara-300 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filters.favoritesOnly ? 'fill-amber-400 text-amber-400' : 'text-quantara-400'}`} />
            Favorites
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-quantara-950 border border-quantara-700 rounded-lg px-2.5 py-1.5 text-xs text-quantara-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-quantara-400 mr-1.5" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as DatasetSortOption)}
              className="bg-transparent text-white text-xs outline-none cursor-pointer pr-2 font-medium"
            >
              <option value="recently_updated" className="bg-quantara-900 text-white">Recently Updated</option>
              <option value="recently_created" className="bg-quantara-900 text-white">Recently Created</option>
              <option value="name_asc" className="bg-quantara-900 text-white">Name (A-Z)</option>
              <option value="name_desc" className="bg-quantara-900 text-white">Name (Z-A)</option>
              <option value="most_rows" className="bg-quantara-900 text-white">Most Rows</option>
              <option value="most_columns" className="bg-quantara-900 text-white">Most Variables</option>
              <option value="file_size" className="bg-quantara-900 text-white">File Size</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-quantara-950 border border-quantara-700 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-quantara-800 text-blue-400' : 'text-quantara-400 hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1 rounded ${viewMode === 'table' ? 'bg-quantara-800 text-blue-400' : 'text-quantara-400 hover:text-white'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-3 pt-2 border-t border-quantara-800/60 text-xs text-quantara-400 flex-wrap">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-quantara-400 uppercase">
          <Filter className="w-3.5 h-3.5 text-quantara-400" /> Filters:
        </div>

        {/* Format Select */}
        <select
          value={filters.sourceType || 'all'}
          onChange={(e) => onFilterChange({ ...filters, sourceType: e.target.value as DatasetSourceType | 'all' })}
          className="bg-quantara-950 border border-quantara-700 rounded-md px-2 py-1 text-xs text-quantara-200 outline-none focus:border-blue-500"
        >
          <option value="all">All Formats</option>
          <option value="csv">CSV</option>
          <option value="xlsx">Excel (.xlsx)</option>
          <option value="sav">SPSS (.sav)</option>
          <option value="dta">Stata (.dta)</option>
          <option value="sas7bdat">SAS (.sas7bdat)</option>
          <option value="parquet">Parquet</option>
          <option value="json">JSON</option>
        </select>

        {/* Status Select */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as DatasetStatus | 'all' })}
          className="bg-quantara-950 border border-quantara-700 rounded-md px-2 py-1 text-xs text-quantara-200 outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="ready">Ready</option>
          <option value="warning">Warning / Issues</option>
          <option value="processing">Processing</option>
          <option value="archived">Archived</option>
        </select>

        {/* Size Select */}
        <select
          value={filters.sizeCategory || 'all'}
          onChange={(e) => onFilterChange({ ...filters, sizeCategory: e.target.value as 'all' | 'small' | 'medium' | 'large' })}
          className="bg-quantara-950 border border-quantara-700 rounded-md px-2 py-1 text-xs text-quantara-200 outline-none focus:border-blue-500"
        >
          <option value="all">All Sizes</option>
          <option value="small">Small (&lt; 5 MB)</option>
          <option value="medium">Medium (5 - 25 MB)</option>
          <option value="large">Large (&gt; 25 MB)</option>
        </select>

        {/* Results Counter */}
        <div className="ml-auto text-xs text-quantara-400 font-mono">
          Showing <span className="font-semibold text-white">{totalCount}</span> datasets
        </div>
      </div>
    </div>
  );
};
