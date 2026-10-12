import React, { useState } from 'react';
import { useQuantaraStore, Variable } from '../store/useQuantaraStore';
import { updateVariableMetadata } from '../api/datasets';
import { Sliders, Save, CheckCircle2, Tag, Layers, BarChart2 } from 'lucide-react';

export const VariableManager: React.FC = () => {
  const { variables, setVariables, activeDataset } = useQuantaraStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Variable>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleEdit = (variable: Variable) => {
    setEditingId(variable.id);
    setEditForm({
      label: variable.label || '',
      data_type: variable.data_type,
      measurement_level: variable.measurement_level,
    });
  };

  const handleSave = async (id: string) => {
    try {
      const updated = await updateVariableMetadata(id, editForm);
      setVariables(variables.map(v => v.id === id ? { ...v, ...updated } : v));
      setEditingId(null);
      setSavedMessage(`Variable '${updated.name}' updated successfully.`);
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update variable metadata');
    }
  };

  if (!activeDataset) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-quantara-950 text-quantara-400">
        <Sliders className="w-12 h-12 text-quantara-600 mb-3" />
        <h3 className="text-lg font-semibold text-slate-200">No Active Dataset</h3>
        <p className="text-xs max-w-md mt-1 text-quantara-400">
          Upload or select a dataset to inspect and configure variable schemas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            Variable View (Data Dictionary)
          </h2>
          <p className="text-xs text-quantara-300 mt-1">
            Configure variable labels, measurement levels (Nominal, Ordinal, Scale), and data types for dataset: <span className="text-slate-200 font-semibold">{activeDataset.name}</span>
          </p>
        </div>

        {savedMessage && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded text-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedMessage}</span>
          </div>
        )}
      </div>

      <div className="bg-quantara-900 border border-quantara-800 rounded-lg overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold border-b border-quantara-800">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Label</th>
              <th className="py-3 px-4">Data Type</th>
              <th className="py-3 px-4">Measurement Level</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800 text-slate-200">
            {variables.map((v, i) => {
              const isEditing = editingId === v.id;
              return (
                <tr key={v.id} className="hover:bg-quantara-800/50 transition">
                  <td className="py-3 px-4 font-mono text-quantara-500">{i + 1}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-blue-400">{v.name}</td>
                  <td className="py-3 px-4">
                    {isEditing ? (
                      <input
                        type="text"
                        className="bg-quantara-950 border border-quantara-700 text-white rounded px-2 py-1 w-full text-xs outline-none focus:border-blue-500"
                        value={editForm.label || ''}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                      />
                    ) : (
                      <span>{v.label || v.name}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {isEditing ? (
                      <select
                        className="bg-quantara-950 border border-quantara-700 text-white rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
                        value={editForm.data_type || v.data_type}
                        onChange={(e) => setEditForm({ ...editForm, data_type: e.target.value as any })}
                      >
                        <option value="integer">integer</option>
                        <option value="float">float</option>
                        <option value="string">string</option>
                        <option value="boolean">boolean</option>
                        <option value="datetime">datetime</option>
                      </select>
                    ) : (
                      <span className="px-2 py-0.5 bg-quantara-800 border border-quantara-700 text-quantara-300 rounded font-mono text-[11px]">
                        {v.data_type}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {isEditing ? (
                      <select
                        className="bg-quantara-950 border border-quantara-700 text-white rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
                        value={editForm.measurement_level || v.measurement_level}
                        onChange={(e) => setEditForm({ ...editForm, measurement_level: e.target.value as any })}
                      >
                        <option value="nominal">Nominal (Categorical)</option>
                        <option value="ordinal">Ordinal (Ranked)</option>
                        <option value="scale">Scale (Continuous Numeric)</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        v.measurement_level === 'scale' 
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : v.measurement_level === 'ordinal'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}>
                        {v.measurement_level.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(v.id)}
                        className="flex items-center gap-1 ml-auto px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(v)}
                        className="px-2.5 py-1 bg-quantara-800 hover:bg-quantara-700 text-quantara-300 rounded text-xs transition border border-quantara-700"
                      >
                        Edit Schema
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
