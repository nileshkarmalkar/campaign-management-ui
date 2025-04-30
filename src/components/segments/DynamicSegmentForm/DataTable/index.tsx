import React from 'react';
import dayjs from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { ColumnMetadata } from '../utils/types';

interface DataTableProps {
  data: Record<string, any>[];
  columns: ColumnMetadata[];
}

const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary" align="center">
        No data available
      </Typography>
    );
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(v => formatValue(v)).join(', ');
      }
      if (value instanceof Date) {
        return dayjs(value).format('MMM D, YYYY');
      }
      return JSON.stringify(value);
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    return String(value);
  };

  const processedData = data.map(row => {
    const processedRow: Record<string, string> = {};
    Object.entries(row).forEach(([key, value]) => {
      processedRow[key] = formatValue(value);
    });
    return processedRow;
  });

  return (
    <Paper elevation={2}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.name}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: 'background.paper'
                  }}
                >
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {processedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
              >
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column.name}`}>
                    {row[column.name]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTable;
