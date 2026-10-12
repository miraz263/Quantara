import React from 'react';
import { ResultTableData } from '../types/analysisTypes';
import { StatisticalTable } from './StatisticalTable';

interface ResultTableProps {
  table: ResultTableData;
  decimals?: number;
}

export const ResultTable: React.FC<ResultTableProps> = ({ table, decimals = 2 }) => {
  return <StatisticalTable table={table} decimals={decimals} />;
};
