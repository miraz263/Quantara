import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VariableProfile } from '../types/profilingTypes';
import { ProfilingService } from '../services/profilingService';
import { Search, Filter, Hash, Type, Eye, ArrowUpDown, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export const ProfileVariablesPage: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();

  const [variables, setVariables] = useState<VariableProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'missing' | 'unique' | 'outliers'>('name');

  useEffect(() => {
    const loadVars = async () => {
      setLoading(true);
      try {
        const data = await ProfilingService.getVariableProfiles(datasetId);
        setVariables(data);
      } catch (err) {
        console.error('Failed to load variable profiles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVars();
  }, [datasetId]);

  const filtered = useMemo(() => {
    let res = [...variables];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      res = res.filter((v) => v.name.toLowerCase().includes(q) || (v.label || '').toLowerCase().includes(q));
    }

    if (filterType === 'numeric') {
      res = res.filter((v) => v.dataType === 'integer' || v.dataType === 'float');
    } else if (filterType === 'categorical') {
      res = res.filter((v) => v.dataType === 'string' || v.measure === 'nominal' || v.measure === 'ordinal');
    } else if (filterType === 'has_missing') {
      res = res.filter((v) => v.missingCount > 0);
    } else if (filterType === 'has_outliers') {
      res = res.filter((v) => (v.outlierCount || 0) > 0);
    } else if (filterType === 'warning') {
      res = res.filter((v) => v.qualityStatus === 'warning' || v.qualityStatus === 'critical');
    }

    res.sort((a, b) => {
      if (sortBy === 'missing') return b.missingPercentage - a.missingPercentage;
      if (sortBy === 'unique') return b.uniqueCount - a.uniqueCount;
      if (sortBy === 'outliers') return (b.outlierCount || 0) - (a.outlierCount || 0);
      return a.name.localeCompare(b.name);
    });

    return res;
  }, [variables, searchQuery, filterType, sortBy]);

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Search & Filter Toolbar */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-quantara-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search variable profiles by name or label..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-quantara-950 border border-quantara-700 text-white rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 font-medium"
          >
            <option value="all">All Variables ({variables.length})</option>
            <option value="numeric">Numeric Only</option>
            <option value="categorical">Categorical Only</option>
            <option value="has_missing">Has Missing Values</option>
            <option value="has_outliers">Has Outliers</option>
            <option value="warning">Quality Warnings / Critical</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-quantara-950 border border-quantara-700 text-white rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 font-medium"
          >
            <option value="name">Sort by Name</option>
            <option value="missing">Sort by Missing %</option>
            <option value="unique">Sort by Unique Count</option>
            <option value="outliers">Sort by Outliers Count</option>
          </select>
        </div>
      </div>

      {/* Variables Profile Table */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-quantara-400">Loading variable profiles...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold text-[11px] border-b border-quantara-800 tracking-wider font-mono">
                  <th className="py-3.5 px-4">Variable Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Measure</th>
                  <th className="py-3.5 px-4">Missing %</th>
                  <th className="py-3.5 px-4">Unique</th>
                  <th className="py-3.5 px-4">Min</th>
                  <th className="py-3.5 px-4">Max</th>
                  <th className="py-3.5 px-4">Mean / Mode</th>
                  <th className="py-3.5 px-4">Quality</th>
                  <th className="py-3.5 px-4 text-right font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-quantara-800/80 text-slate-200 font-mono">
                {filtered.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() =>
                      navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/profile/variables/${v.id}`)
                    }
                    className="hover:bg-quantara-800/40 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-sans font-bold text-white group-hover:text-blue-400">
                      <div>
                        <span>{v.name}</span>
                        {v.label && <div className="text-[11px] text-quantara-400 font-normal font-sans">{v.label}</div>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 uppercase text-[11px] text-quantara-300 font-bold">{v.dataType}</td>

                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          v.measure === 'scale'
                            ? 'bg-blue-950 text-blue-300 border-blue-800'
                            : v.measure === 'ordinal'
                            ? 'bg-purple-950 text-purple-300 border-purple-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {v.measure}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {v.missingCount > 0 ? (
                        <span className="text-amber-400 font-bold">
                          {v.missingPercentage}% ({v.missingCount.toLocaleString()})
                        </span>
                      ) : (
                        <span className="text-quantara-500 font-normal">0%</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">{v.uniqueCount.toLocaleString()}</td>

                    <td className="py-3.5 px-4 text-quantara-300">{v.min !== undefined ? v.min : '—'}</td>

                    <td className="py-3.5 px-4 text-quantara-300">{v.max !== undefined ? v.max : '—'}</td>

                    <td className="py-3.5 px-4 font-sans text-quantara-200">
                      {v.mean !== undefined
                        ? v.mean.toLocaleString()
                        : v.topCategories && v.topCategories.length > 0
                        ? v.topCategories[0].category
                        : '—'}
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      {v.qualityStatus === 'good' && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Good
                        </span>
                      )}
                      {v.qualityStatus === 'warning' && (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Warning
                        </span>
                      )}
                      {v.qualityStatus === 'critical' && (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Critical
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/profile/variables/${v.id}`
                          );
                        }}
                        className="px-2.5 py-1 bg-quantara-800 hover:bg-quantara-700 text-blue-300 rounded text-[11px] font-semibold transition border border-quantara-700 flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3 h-3" /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
