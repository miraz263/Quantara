import React, { useState, useMemo } from 'react';
import { Variable, DataType, MeasureLevel, VariableRole, Alignment } from '../types/dataEditorTypes';
import { ValueLabelsModal } from './ValueLabelsModal';
import { MissingValuesModal } from './MissingValuesModal';
import { TypeChangeWarningModal } from './TypeChangeWarningModal';
import { Search, Sliders, Tag, HelpCircle, Plus, Trash2, Hash, Type, Check, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface VariableGridViewProps {
  variables: Variable[];
  onUpdateVariable: (variableId: string, changes: Partial<Variable>) => void;
  onAddVariable: () => void;
  onDeleteVariable: (variableId: string) => void;
}

export const VariableGridView: React.FC<VariableGridViewProps> = ({
  variables,
  onUpdateVariable,
  onAddVariable,
  onDeleteVariable,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal states
  const [valueLabelsVar, setValueLabelsVar] = useState<Variable | null>(null);
  const [missingValuesVar, setMissingValuesVar] = useState<Variable | null>(null);
  const [typeWarningVar, setTypeWarningVar] = useState<{ varObj: Variable; newType: DataType } | null>(null);

  // Filtered variables
  const filteredVariables = useMemo(() => {
    return variables.filter((v) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesLabel = (v.label || '').toLowerCase().includes(q);
        const matchesType = v.dataType.toLowerCase().includes(q);
        const matchesMeasure = v.measure.toLowerCase().includes(q);
        if (!matchesName && !matchesLabel && !matchesType && !matchesMeasure) return false;
      }

      if (filterType === 'numeric') {
        if (v.dataType !== 'integer' && v.dataType !== 'float') return false;
      } else if (filterType === 'categorical') {
        if (v.dataType !== 'string' && v.measure !== 'nominal' && v.measure !== 'ordinal') return false;
      } else if (filterType === 'scale') {
        if (v.measure !== 'scale') return false;
      } else if (filterType === 'ordinal') {
        if (v.measure !== 'ordinal') return false;
      } else if (filterType === 'nominal') {
        if (v.measure !== 'nominal') return false;
      }

      return true;
    });
  }, [variables, searchQuery, filterType]);

  const handleTypeSelect = (variable: Variable, targetType: DataType) => {
    if (variable.dataType === targetType) return;
    if (variable.dataType === 'string' && (targetType === 'integer' || targetType === 'float')) {
      setTypeWarningVar({ varObj: variable, newType: targetType });
    } else {
      onUpdateVariable(variable.id, { dataType: targetType });
    }
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-4 font-sans overflow-y-auto space-y-4">
      {/* Search & Filter Header Bar */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-quantara-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search variables by name, label, data type, or measurement level..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg pl-9 pr-4 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {/* Filter Pills & Add Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-quantara-950 border border-quantara-700 text-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
          >
            <option value="all">All Variable Types ({variables.length})</option>
            <option value="numeric">Numeric Only</option>
            <option value="categorical">Categorical Only</option>
            <option value="scale">Scale (Continuous)</option>
            <option value="ordinal">Ordinal (Ranked)</option>
            <option value="nominal">Nominal (Categorical)</option>
          </select>

          <Button
            onClick={onAddVariable}
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Variable
          </Button>
        </div>
      </div>

      {/* Variable Dictionary Table */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-2xl flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold text-[11px] border-b border-quantara-800 tracking-wider font-mono">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 font-mono">Width</th>
                <th className="py-3 px-3 font-mono">Decimals</th>
                <th className="py-3 px-3">Measure</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Missing</th>
                <th className="py-3 px-3">Values</th>
                <th className="py-3 px-3">Align</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quantara-800/80 text-slate-200">
              {filteredVariables.map((v, idx) => (
                <tr key={v.id} className="hover:bg-quantara-800/40 transition group">
                  <td className="py-2.5 px-3 text-quantara-500 font-mono text-[11px]">{idx + 1}</td>

                  {/* Name */}
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => onUpdateVariable(v.id, { name: e.target.value })}
                      className="bg-transparent hover:bg-quantara-950 border border-transparent hover:border-quantara-700 focus:border-blue-500 text-blue-400 font-mono font-bold rounded px-2 py-1 outline-none text-xs w-28"
                    />
                  </td>

                  {/* Label */}
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={v.label || ''}
                      placeholder="Add variable label..."
                      onChange={(e) => onUpdateVariable(v.id, { label: e.target.value })}
                      className="bg-transparent hover:bg-quantara-950 border border-transparent hover:border-quantara-700 focus:border-blue-500 text-white rounded px-2 py-1 outline-none text-xs w-48 font-sans"
                    />
                  </td>

                  {/* Type */}
                  <td className="py-2.5 px-3 font-mono">
                    <select
                      value={v.dataType}
                      onChange={(e) => handleTypeSelect(v, e.target.value as DataType)}
                      className="bg-quantara-950 border border-quantara-700 text-white rounded px-2 py-1 text-xs outline-none focus:border-blue-500 font-mono"
                    >
                      <option value="string">String</option>
                      <option value="integer">Integer</option>
                      <option value="float">Float</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                      <option value="datetime">DateTime</option>
                    </select>
                  </td>

                  {/* Width */}
                  <td className="py-2.5 px-3 font-mono">
                    <input
                      type="number"
                      min={40}
                      max={500}
                      value={v.width || 120}
                      onChange={(e) => onUpdateVariable(v.id, { width: parseInt(e.target.value) || 120 })}
                      className="bg-quantara-950 border border-quantara-700 text-white rounded px-2 py-1 text-xs w-16 text-center outline-none focus:border-blue-500 font-mono"
                    />
                  </td>

                  {/* Decimals */}
                  <td className="py-2.5 px-3 font-mono">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      disabled={v.dataType !== 'integer' && v.dataType !== 'float'}
                      value={v.decimals ?? (v.dataType === 'float' ? 2 : 0)}
                      onChange={(e) => onUpdateVariable(v.id, { decimals: parseInt(e.target.value) || 0 })}
                      className="bg-quantara-950 border border-quantara-700 text-white rounded px-2 py-1 text-xs w-14 text-center outline-none focus:border-blue-500 disabled:opacity-40 font-mono"
                    />
                  </td>

                  {/* Measure Level */}
                  <td className="py-2.5 px-3">
                    <select
                      value={v.measure}
                      onChange={(e) => onUpdateVariable(v.id, { measure: e.target.value as MeasureLevel })}
                      className={`border rounded px-2 py-1 text-xs outline-none font-semibold ${
                        v.measure === 'scale'
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : v.measure === 'ordinal'
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      <option value="scale">Scale (Continuous)</option>
                      <option value="ordinal">Ordinal (Ranked)</option>
                      <option value="nominal">Nominal (Categorical)</option>
                    </select>
                  </td>

                  {/* Role */}
                  <td className="py-2.5 px-3">
                    <select
                      value={v.role}
                      onChange={(e) => onUpdateVariable(v.id, { role: e.target.value as VariableRole })}
                      className="bg-quantara-950 border border-quantara-700 text-quantara-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500 capitalize"
                    >
                      <option value="input">Input</option>
                      <option value="target">Target</option>
                      <option value="both">Both</option>
                      <option value="none">None</option>
                      <option value="partition">Partition</option>
                      <option value="frequency">Frequency</option>
                      <option value="weight">Weight</option>
                      <option value="id">ID</option>
                    </select>
                  </td>

                  {/* Missing Values */}
                  <td className="py-2.5 px-3 font-mono">
                    <button
                      onClick={() => setMissingValuesVar(v)}
                      className="px-2 py-1 bg-quantara-950 hover:bg-quantara-800 border border-quantara-700 text-quantara-300 hover:text-white rounded text-[11px] transition flex items-center gap-1 font-mono"
                    >
                      <HelpCircle className="w-3 h-3 text-rose-400" />
                      {v.missingValues && v.missingValues.length > 0
                        ? `${v.missingValues.length} code(s)`
                        : 'None'}
                    </button>
                  </td>

                  {/* Value Labels */}
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => setValueLabelsVar(v)}
                      className="px-2 py-1 bg-quantara-950 hover:bg-quantara-800 border border-quantara-700 text-quantara-300 hover:text-white rounded text-[11px] transition flex items-center gap-1 font-mono"
                    >
                      <Tag className="w-3 h-3 text-amber-400" />
                      {v.valueLabels && Object.keys(v.valueLabels).length > 0
                        ? `${Object.keys(v.valueLabels).length} label(s)`
                        : 'None'}
                    </button>
                  </td>

                  {/* Alignment */}
                  <td className="py-2.5 px-3">
                    <select
                      value={v.alignment || 'left'}
                      onChange={(e) => onUpdateVariable(v.id, { alignment: e.target.value as Alignment })}
                      className="bg-quantara-950 border border-quantara-700 text-quantara-300 rounded px-1.5 py-1 text-[11px] outline-none capitalize"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onDeleteVariable(v.id)}
                      className="p-1 text-quantara-500 hover:text-rose-400 hover:bg-rose-950/60 rounded transition"
                      title="Delete Variable"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {valueLabelsVar && (
        <ValueLabelsModal
          variable={valueLabelsVar}
          onSave={(labels) => {
            onUpdateVariable(valueLabelsVar.id, { valueLabels: labels });
            setValueLabelsVar(null);
          }}
          onClose={() => setValueLabelsVar(null)}
        />
      )}

      {missingValuesVar && (
        <MissingValuesModal
          variable={missingValuesVar}
          onSave={(missingValues) => {
            onUpdateVariable(missingValuesVar.id, { missingValues });
            setMissingValuesVar(null);
          }}
          onClose={() => setMissingValuesVar(null)}
        />
      )}

      {typeWarningVar && (
        <TypeChangeWarningModal
          varName={typeWarningVar.varObj.name}
          fromType={typeWarningVar.varObj.dataType}
          toType={typeWarningVar.newType}
          onConfirm={() => {
            onUpdateVariable(typeWarningVar.varObj.id, { dataType: typeWarningVar.newType });
            setTypeWarningVar(null);
          }}
          onCancel={() => setTypeWarningVar(null)}
        />
      )}
    </div>
  );
};
