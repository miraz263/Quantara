import React, { useState, useMemo } from 'react';
import { VariableItem } from '../types/analysisTypes';
import { Search, ArrowRight, ArrowLeft, AlertTriangle, Hash, Type, Calendar, Check } from 'lucide-react';

interface VariableSelectorProps {
  availableVariables: VariableItem[];
  selectedVariableNames: string[];
  onChangeSelected: (selected: string[]) => void;
  targetLabel?: string;
  allowCategoricalWarning?: boolean;
}

export const VariableSelector: React.FC<VariableSelectorProps> = ({
  availableVariables,
  selectedVariableNames,
  onChangeSelected,
  targetLabel = 'Variables to Analyze',
  allowCategoricalWarning = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'numeric' | 'categorical' | 'date'>('all');

  // Filter available variables
  const filteredAvailable = useMemo(() => {
    return availableVariables.filter((v) => {
      if (selectedVariableNames.includes(v.name)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesLabel = (v.label || '').toLowerCase().includes(q);
        if (!matchesName && !matchesLabel) return false;
      }

      if (filterType === 'numeric') {
        if (v.dataType !== 'integer' && v.dataType !== 'float') return false;
      } else if (filterType === 'categorical') {
        if (v.dataType !== 'string' && v.measure !== 'nominal' && v.measure !== 'ordinal') return false;
      } else if (filterType === 'date') {
        if (v.dataType !== 'date' && v.dataType !== 'datetime') return false;
      }

      return true;
    });
  }, [availableVariables, selectedVariableNames, searchQuery, filterType]);

  const selectedItems = useMemo(() => {
    return selectedVariableNames
      .map((name) => availableVariables.find((v) => v.name === name))
      .filter(Boolean) as VariableItem[];
  }, [availableVariables, selectedVariableNames]);

  const hasCategoricalInSelected = useMemo(() => {
    return selectedItems.some((v) => v.dataType === 'string' || v.measure === 'nominal');
  }, [selectedItems]);

  const handleAdd = (varName: string) => {
    if (!selectedVariableNames.includes(varName)) {
      onChangeSelected([...selectedVariableNames, varName]);
    }
  };

  const handleRemove = (varName: string) => {
    onChangeSelected(selectedVariableNames.filter((name) => name !== varName));
  };

  const handleAddAllFiltered = () => {
    const toAdd = filteredAvailable.map((v) => v.name);
    onChangeSelected([...selectedVariableNames, ...toAdd]);
  };

  const handleRemoveAll = () => {
    onChangeSelected([]);
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Categorical Warning */}
      {allowCategoricalWarning && hasCategoricalInSelected && (
        <div className="p-3 bg-amber-950/60 border border-amber-800 rounded-xl text-amber-300 text-xs flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Categorical variables selected. Descriptive mean/SD statistics are primarily intended for scale numeric variables.
          </span>
        </div>
      )}

      {/* Dual Column Transfer Box */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
        {/* Left List: Available Variables */}
        <div className="md:col-span-5 bg-quantara-950 border border-quantara-800 rounded-xl p-3 space-y-2 flex flex-col h-72">
          <div className="text-xs font-bold text-quantara-300 uppercase tracking-wider flex items-center justify-between">
            <span>Available Variables ({filteredAvailable.length})</span>
          </div>

          {/* Search & Filter */}
          <div className="space-y-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-quantara-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter variables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded pl-8 pr-2 py-1 text-xs outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-1 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2 py-0.5 rounded ${filterType === 'all' ? 'bg-blue-600 text-white font-bold' : 'bg-quantara-900 text-quantara-400'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType('numeric')}
                className={`px-2 py-0.5 rounded ${filterType === 'numeric' ? 'bg-blue-600 text-white font-bold' : 'bg-quantara-900 text-quantara-400'}`}
              >
                Numeric
              </button>
              <button
                type="button"
                onClick={() => setFilterType('categorical')}
                className={`px-2 py-0.5 rounded ${filterType === 'categorical' ? 'bg-blue-600 text-white font-bold' : 'bg-quantara-900 text-quantara-400'}`}
              >
                Categorical
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-quantara-800/60 border border-quantara-800/80 rounded bg-quantara-900/60">
            {filteredAvailable.length === 0 ? (
              <div className="p-4 text-center text-quantara-500 text-xs italic">No matching variables</div>
            ) : (
              filteredAvailable.map((v) => (
                <div
                  key={v.name}
                  onClick={() => handleAdd(v.name)}
                  className="p-2 hover:bg-quantara-800/60 transition cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-white group-hover:text-blue-400">{v.name}</div>
                    {v.label && <div className="text-[10px] text-quantara-400 truncate max-w-xs">{v.label}</div>}
                  </div>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-quantara-950 text-quantara-400 border border-quantara-800">
                    {v.measure}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center Transfer Buttons */}
        <div className="md:col-span-1 flex md:flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleAddAllFiltered}
            className="p-2 bg-quantara-900 hover:bg-quantara-800 border border-quantara-700 text-blue-400 rounded-lg transition"
            title="Add All Filtered Variables"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRemoveAll}
            className="p-2 bg-quantara-900 hover:bg-quantara-800 border border-quantara-700 text-quantara-400 rounded-lg transition"
            title="Remove All Selected Variables"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Right List: Selected Variables */}
        <div className="md:col-span-5 bg-quantara-950 border border-quantara-800 rounded-xl p-3 space-y-2 flex flex-col h-72">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-quantara-800 pb-2">
            <span>{targetLabel} ({selectedItems.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-quantara-800/60 border border-quantara-800/80 rounded bg-quantara-900/60">
            {selectedItems.length === 0 ? (
              <div className="p-8 text-center text-quantara-500 text-xs italic">
                Select variables from available list on the left
              </div>
            ) : (
              selectedItems.map((v) => (
                <div
                  key={v.name}
                  onClick={() => handleRemove(v.name)}
                  className="p-2 hover:bg-rose-950/30 transition cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-blue-400">{v.name}</div>
                    {v.label && <div className="text-[10px] text-quantara-400 truncate max-w-xs">{v.label}</div>}
                  </div>
                  <span className="text-[10px] text-rose-400 hover:underline">Remove</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
