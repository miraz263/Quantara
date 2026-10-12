import React from 'react';
import { DatasetSourceType, ImportDatasetPayload } from '../types/datasetTypes';
import { Settings, Sliders, Database, FileSpreadsheet } from 'lucide-react';

interface ImportConfigurationProps {
  sourceType: DatasetSourceType;
  config: ImportDatasetPayload['config'];
  onChange: (config: ImportDatasetPayload['config']) => void;
  description?: string;
  onDescriptionChange: (desc: string) => void;
  tags?: string[];
  onTagsChange: (tags: string[]) => void;
}

export const ImportConfiguration: React.FC<ImportConfigurationProps> = ({
  sourceType,
  config,
  onChange,
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
}) => {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-quantara-950/80 border border-quantara-800 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-quantara-800 pb-3">
          <Sliders className="w-4 h-4 text-blue-400" />
          Ingestion & Format Parsing Configuration
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Delimiter (CSV/Text) */}
          {(sourceType === 'csv' || sourceType === 'json') && (
            <div>
              <label className="block font-semibold text-quantara-300 mb-1">
                Column Delimiter
              </label>
              <select
                value={config.delimiter || ','}
                onChange={(e) => onChange({ ...config, delimiter: e.target.value })}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded-lg p-2 outline-none focus:border-blue-500 font-mono"
              >
                <option value=",">Comma ( , )</option>
                <option value=";">Semicolon ( ; )</option>
                <option value="\t">Tab ( \t )</option>
                <option value="|">Pipe ( | )</option>
              </select>
            </div>
          )}

          {/* Encoding */}
          <div>
            <label className="block font-semibold text-quantara-300 mb-1">
              Text Encoding
            </label>
            <select
              value={config.encoding || 'utf-8'}
              onChange={(e) => onChange({ ...config, encoding: e.target.value })}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded-lg p-2 outline-none focus:border-blue-500 font-mono"
            >
              <option value="utf-8">UTF-8 (Standard)</option>
              <option value="latin1">ISO-8859-1 (Latin-1)</option>
              <option value="cp1252">Windows-1252</option>
              <option value="ascii">ASCII</option>
            </select>
          </div>

          {/* Sheet Selection (Excel) */}
          {(sourceType === 'xlsx' || sourceType === 'xls') && (
            <div>
              <label className="block font-semibold text-quantara-300 mb-1">
                Worksheet Name
              </label>
              <select
                value={config.sheetName || 'Sheet1'}
                onChange={(e) => onChange({ ...config, sheetName: e.target.value })}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded-lg p-2 outline-none focus:border-blue-500 font-mono"
              >
                <option value="Sheet1">Sheet 1 (Active Data)</option>
                <option value="Demographics">Demographics</option>
                <option value="Raw_Responses">Raw_Responses</option>
              </select>
            </div>
          )}

          {/* Header Row Index */}
          <div>
            <label className="block font-semibold text-quantara-300 mb-1">
              Header Line Row
            </label>
            <input
              type="number"
              min={1}
              value={config.headerRow || 1}
              onChange={(e) => onChange({ ...config, headerRow: parseInt(e.target.value) || 1 })}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded-lg p-2 outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Missing Values Strategy */}
          <div>
            <label className="block font-semibold text-quantara-300 mb-1">
              Missing Value Handler
            </label>
            <select
              value={config.missingValueStrategy || 'nan'}
              onChange={(e) => onChange({ ...config, missingValueStrategy: e.target.value })}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded-lg p-2 outline-none focus:border-blue-500"
            >
              <option value="nan">Treat NA / empty / null as NaN</option>
              <option value="zero">Fill missing numerical values with 0</option>
              <option value="drop">Drop rows with any missing values</option>
              <option value="preserve">Keep raw blank string representations</option>
            </select>
          </div>
        </div>

        {/* Statistical Value Labels (SPSS/Stata/SAS) */}
        {(sourceType === 'sav' || sourceType === 'dta' || sourceType === 'sas7bdat') && (
          <div className="pt-3 border-t border-quantara-800">
            <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={config.valueLabels !== false}
                onChange={(e) => onChange({ ...config, valueLabels: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Parse and map statistical categorical value labels (e.g. 1 = "Strongly Agree")
            </label>
          </div>
        )}
      </div>

      {/* Dataset Metadata Information */}
      <div className="bg-quantara-950/80 border border-quantara-800 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-white border-b border-quantara-800 pb-3">
          Dataset Metadata & Description
        </h4>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-quantara-300 mb-1">
              Description / Research Context
            </label>
            <textarea
              rows={2}
              value={description || ''}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Add description of study parameters, sampling method, or data source..."
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded-lg p-2.5 outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div>
            <label className="block font-semibold text-quantara-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags?.join(', ') || ''}
              onChange={(e) => onTagsChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              placeholder="e.g. survey, 2025, healthcare, clinical"
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded-lg p-2.5 outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
