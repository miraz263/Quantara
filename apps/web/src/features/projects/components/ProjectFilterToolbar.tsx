import React from 'react';
import { ProjectFilters, ProjectSortOption, ProjectStatus, ProjectVisibility } from '../types/projectTypes';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, RotateCcw } from 'lucide-react';

interface ProjectFilterToolbarProps {
  filters: ProjectFilters;
  onFilterChange: (filters: ProjectFilters) => void;
  sort: ProjectSortOption;
  onSortChange: (sort: ProjectSortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onReset: () => void;
}

export const ProjectFilterToolbar: React.FC<ProjectFilterToolbarProps> = ({
  filters,
  onFilterChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onReset
}) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 shadow-lg space-y-3 font-sans text-xs">
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-quantara-400 absolute left-3 top-2.5" />
          <input
            type="text"
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-blue-500 font-medium placeholder-quantara-500"
            placeholder="Search projects by name, description, owner, or tags..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          />
        </div>

        {/* Filter & Sort Dropdowns */}
        <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
          {/* Status Filter */}
          <select
            className="bg-quantara-950 border border-quantara-700 text-white rounded-lg px-2.5 py-2 text-xs outline-none focus:border-blue-500 font-medium"
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Visibility Filter */}
          <select
            className="bg-quantara-950 border border-quantara-700 text-white rounded-lg px-2.5 py-2 text-xs outline-none focus:border-blue-500 font-medium"
            value={filters.visibility || 'all'}
            onChange={(e) => onFilterChange({ ...filters, visibility: e.target.value as any })}
          >
            <option value="all">Visibility: All</option>
            <option value="private">Private</option>
            <option value="team">Team</option>
            <option value="organization">Organization</option>
          </select>

          {/* Updated Timeframe Filter */}
          <select
            className="bg-quantara-950 border border-quantara-700 text-white rounded-lg px-2.5 py-2 text-xs outline-none focus:border-blue-500 font-medium"
            value={filters.updatedTimeframe || 'all'}
            onChange={(e) => onFilterChange({ ...filters, updatedTimeframe: e.target.value as any })}
          >
            <option value="all">Updated: All</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="older">Older</option>
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-quantara-950 border border-quantara-700 rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
            <select
              className="bg-transparent text-white text-xs outline-none cursor-pointer font-medium"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as ProjectSortOption)}
            >
              <option value="recently_updated" className="bg-quantara-900">Recently Updated</option>
              <option value="recently_created" className="bg-quantara-900">Recently Created</option>
              <option value="recently_opened" className="bg-quantara-900">Recently Opened</option>
              <option value="name_asc" className="bg-quantara-900">Name A-Z</option>
              <option value="name_desc" className="bg-quantara-900">Name Z-A</option>
              <option value="most_datasets" className="bg-quantara-900">Most Datasets</option>
              <option value="most_analyses" className="bg-quantara-900">Most Analyses</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-quantara-950 border border-quantara-700 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-quantara-400 hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-quantara-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="p-2 text-quantara-400 hover:text-white rounded-lg hover:bg-quantara-800 transition"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
