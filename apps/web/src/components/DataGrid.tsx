import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useQuantaraStore } from '../store/useQuantaraStore';
import { Hash, AlignLeft, Calendar, ToggleLeft, Layers } from 'lucide-react';

export const DataGrid: React.FC = () => {
  const { previewData, variables, activeDataset } = useQuantaraStore();

  const columnDefs = useMemo<ColDef[]>(() => {
    if (!previewData || !previewData.columns) return [];

    return previewData.columns.map((colName, idx) => {
      const varMeta = variables.find(v => v.name === colName);
      const data_type = varMeta?.data_type || 'string';
      const level = varMeta?.measurement_level || 'scale';

      return {
        headerName: colName,
        field: colName,
        sortable: true,
        filter: true,
        resizable: true,
        headerComponentParams: {
          template: `
            <div class="ag-cell-label-container" role="presentation">
              <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
              <div ref="eLabel" class="ag-header-cell-label" role="presentation">
                <span class="ag-header-cell-text" ref="eText"></span>
              </div>
            </div>
          `
        },
        cellRenderer: (params: any) => {
          const val = params.value;
          if (val === null || val === undefined) {
            return <span className="text-quantara-500 italic font-mono text-xs">. (missing)</span>;
          }
          return <span>{String(val)}</span>;
        }
      };
    });
  }, [previewData, variables]);

  const rowData = useMemo(() => {
    if (!previewData || !previewData.rows) return [];
    return previewData.rows.map((rowArray) => {
      const rowObj: Record<string, any> = {};
      previewData.columns.forEach((col, i) => {
        rowObj[col] = rowArray[i];
      });
      return rowObj;
    });
  }, [previewData]);

  if (!activeDataset) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-quantara-950 text-quantara-400">
        <Layers className="w-12 h-12 text-quantara-600 mb-3" />
        <h3 className="text-lg font-semibold text-slate-200">No Active Dataset</h3>
        <p className="text-xs max-w-md mt-1 text-quantara-400">
          Upload or select a dataset from the top navigation bar to explore tabular observations.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-quantara-950">
      {/* Grid Status Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-quantara-900 border-b border-quantara-800 text-xs text-quantara-300">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-200">Data View</span>
          <span>Showing {rowData.length} of {activeDataset.row_count} total rows</span>
          <span>{variables.length} variables</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-blue-950 border border-blue-800 text-blue-400 rounded text-[11px] font-mono">
            Mode: Data Matrix
          </span>
        </div>
      </div>

      {/* AG Grid Container */}
      <div className="flex-1 ag-theme-alpine-dark w-full h-full">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          paginationPageSize={50}
          rowSelection="multiple"
          animateRows={true}
          defaultColDef={{
            flex: 1,
            minWidth: 120,
            editable: false,
          }}
        />
      </div>
    </div>
  );
};
