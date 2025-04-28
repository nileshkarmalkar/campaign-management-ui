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
  if (!data.length) {
    return (
      <Typography variant="body1" color="textSecondary" align="center">
        No data available
      </Typography>
    );
  }

  const formatValue = (value: any, type: ColumnMetadata['type']) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'numeric':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return dayjs(value, 'YYYY-MM-DD', true).isValid() 
          ? dayjs(value).format('MMM D, YYYY')
          : value;
      default:
        return String(value);
    }
  };

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
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
              >
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column.name}`}>
                    {formatValue(row[column.name], column.type)}
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
