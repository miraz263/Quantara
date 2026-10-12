import { describe, it, expect } from 'vitest';
import { DataEditorService } from '../services/dataEditorService';

describe('DataEditorService Unit Tests', () => {
  it('should fetch initial variables and mock rows', async () => {
    const variables = await DataEditorService.getVariables();
    expect(variables.length).toBeGreaterThan(0);
    expect(variables.some((v) => v.name === 'patient_id')).toBe(true);

    const { rows, totalCount } = await DataEditorService.getRows('ds-001', 0, 50);
    expect(rows.length).toBe(50);
    expect(totalCount).toBeGreaterThanOrEqual(500);
  });

  it('should filter rows by condition', async () => {
    const { rows } = await DataEditorService.getRows('ds-001', 0, 100, {
      colId: 'age',
      operator: 'greater_than',
      value: 50,
    });

    expect(rows.every((r) => Number(r.age) > 50)).toBe(true);
  });

  it('should sort rows by numerical column', async () => {
    const { rows } = await DataEditorService.getRows('ds-001', 0, 50, undefined, {
      colId: 'age',
      direction: 'asc',
    });

    for (let i = 0; i < rows.length - 1; i++) {
      expect(Number(rows[i].age)).toBeLessThanOrEqual(Number(rows[i + 1].age));
    }
  });

  it('should update cell value', async () => {
    const { rows } = await DataEditorService.getRows('ds-001', 0, 10);
    const targetRow = rows[0];

    const updated = await DataEditorService.updateCell('ds-001', targetRow._rowId, 'age', 99);
    expect(updated.age).toBe(99);
  });

  it('should insert a new row', async () => {
    const { totalCount: initialCount } = await DataEditorService.getRows('ds-001');
    const newRow = await DataEditorService.insertRow('ds-001', 0);

    expect(newRow._rowId).toBeDefined();
    expect(newRow._rowNumber).toBe(1);

    const { totalCount: afterCount } = await DataEditorService.getRows('ds-001');
    expect(afterCount).toBe(initialCount + 1);
  });

  it('should delete rows', async () => {
    const { rows } = await DataEditorService.getRows('ds-001', 0, 5);
    const idToDelete = rows[0]._rowId;

    const success = await DataEditorService.deleteRows('ds-001', [idToDelete]);
    expect(success).toBe(true);

    const { rows: updatedRows } = await DataEditorService.getRows('ds-001', 0, 10);
    expect(updatedRows.some((r) => r._rowId === idToDelete)).toBe(false);
  });

  it('should add, update, and delete a variable', async () => {
    // Add
    const created = await DataEditorService.addVariable('ds-001', {
      name: 'systolic_bp',
      label: 'Systolic Blood Pressure',
      dataType: 'integer',
      measure: 'scale',
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe('systolic_bp');

    // Update
    const updated = await DataEditorService.updateVariable('ds-001', created.id, {
      label: 'Updated Systolic BP',
      decimals: 1,
    });
    expect(updated.label).toBe('Updated Systolic BP');

    // Delete
    const success = await DataEditorService.deleteVariables('ds-001', [created.id]);
    expect(success).toBe(true);

    const variables = await DataEditorService.getVariables('ds-001');
    expect(variables.some((v) => v.id === created.id)).toBe(false);
  });

  it('should execute find and replace across cells', async () => {
    const affected = await DataEditorService.findAndReplace('ds-001', 'Single', 'Unmarried', 'marital_status');
    expect(affected).toBeGreaterThan(0);
  });
});
