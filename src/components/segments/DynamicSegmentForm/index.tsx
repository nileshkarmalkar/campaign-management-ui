import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Typography, Grid, Paper, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box } from '@mui/material';
import { FilterOperator } from './utils/types';
import { analyzeColumn, generateFilterConfig } from './utils/dataAnalyzer';
import { ColumnMetadata, FilterConfig, FilterState, FilterGroup, FilterCondition, ComparisonOperator } from './utils/types';
import dayjs from 'dayjs';
import DataTable from './DataTable';
import FilterPanel from './FilterPanel';
import dataService from '../../../services/bigquery';

interface DynamicSegmentFormProps {
  onSubmit: (filters: FilterState, filteredData: Record<string, any>[]) => void;
  initialFilters?: FilterState;
  initialFilteredData?: Record<string, any>[];
}

const DynamicSegmentForm: React.FC<DynamicSegmentFormProps> = ({ onSubmit, initialFilters, initialFilteredData }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<ColumnMetadata[]>([]);
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([]);
  const [filterState, setFilterState] = useState<FilterState>(initialFilters || {
    root: { operator: 'AND', conditions: [] },
    activeFilters: {}
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    setError(null);
    try {
      const result = await dataService.listTables();
      setTables(result);
      if (result.length > 0 && !selectedTable) {
        setSelectedTable(result[0]);
      }
    } catch (err) {
      setError('Failed to fetch tables');
      console.error(err);
    }
  }, [selectedTable]);

  // Initial fetch when component mounts
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Poll for table updates every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchTables, 30000);
    return () => clearInterval(intervalId);
  }, [fetchTables]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTable) return;
      setIsLoading(true);
      setError(null);
      try {
        await dataService.setCurrentTable(selectedTable);
        const result = await dataService.getCustomerData(1000);
        setData(result);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTable]);

  useEffect(() => {
    if (data.length > 0) {
      const analyzedColumns = Object.keys(data[0]).map(key => analyzeColumn(key, data.map(item => item[key])));
      setColumns(analyzedColumns);
      
      const configs = analyzedColumns.map(column => generateFilterConfig(column));
      setFilterConfigs(configs);

      const initialActiveFilters: FilterState['activeFilters'] = {};
      configs.forEach(config => {
        initialActiveFilters[config.field] = { type: config.type, value: null, operator: '=' };
      });
      setFilterState(prevState => ({
        ...prevState,
        activeFilters: initialActiveFilters
      }));
    }
  }, [data]);

  const evaluateCondition = useCallback(
    (row: Record<string, any>, condition: FilterCondition | FilterGroup): boolean => {
      if ('operator' in condition && 'conditions' in condition) {
        const filterGroup = condition as FilterGroup;
        return filterGroup.operator === 'AND'
          ? filterGroup.conditions.every(subCondition => evaluateCondition(row, subCondition))
          : filterGroup.conditions.some(subCondition => evaluateCondition(row, subCondition));
      }

      const filterCondition = condition as FilterCondition;
      const { field, operator, value } = filterCondition;
      const rowValue = row[field];
      const isDateValue = dayjs(rowValue, 'YYYY-MM-DD', true).isValid();
      const compareDate = (a: string, b: string, op: string): boolean => {
        const dateA = dayjs(a);
        const dateB = dayjs(b);
        switch (op) {
          case '=': return dateA.isSame(dateB);
          case '!=': return !dateA.isSame(dateB);
          case '>': return dateA.isAfter(dateB);
          case '>=': return dateA.isAfter(dateB) || dateA.isSame(dateB);
          case '<': return dateA.isBefore(dateB);
          case '<=': return dateA.isBefore(dateB) || dateA.isSame(dateB);
          default: return false;
        }
      };

      if (isDateValue) {
        switch (operator) {
          case '=':
          case '!=':
          case '>':
          case '>=':
          case '<':
          case '<=':
            return compareDate(rowValue, value, operator);
          case 'between':
            if (Array.isArray(value) && value.length === 2) {
              const date = dayjs(rowValue);
              return date.isAfter(dayjs(value[0])) && date.isBefore(dayjs(value[1]));
            }
            return false;
          default:
            return false;
        }
      } else {
        switch (operator) {
          case '=':
            return rowValue === value;
          case '!=':
            return rowValue !== value;
          case '>':
            return rowValue > value;
          case '>=':
            return rowValue >= value;
          case '<':
            return rowValue < value;
          case '<=':
            return rowValue <= value;
          case 'between':
            if (Array.isArray(value) && value.length === 2) {
              return rowValue >= value[0] && rowValue <= value[1];
            }
            return false;
          case 'contains':
            return String(rowValue).includes(String(value));
          case 'not_contains':
            return !String(rowValue).includes(String(value));
          case 'in':
            return Array.isArray(value) && value.includes(rowValue);
          case 'not_in':
            return Array.isArray(value) && !value.includes(rowValue);
          default:
            return true;
        }
      }
    },
    []
  );

  const filteredData = useMemo(() => {
    return data.filter(row => 
      filterState.root.operator === 'AND'
        ? filterState.root.conditions.every(condition => evaluateCondition(row, condition))
        : filterState.root.conditions.some(condition => evaluateCondition(row, condition))
    );
  }, [data, filterState, evaluateCondition]);

  const handleFilterChange = (field: string, value: any, operator: ComparisonOperator) => {
    setFilterState(prevState => {
      const currentFilter = prevState.activeFilters[field];
      let newActiveFilters = { ...prevState.activeFilters };

      // If operator is changing, reset the value
      if (operator !== currentFilter.operator) {
        newActiveFilters[field] = {
          ...currentFilter,
          value: null,
          operator: operator,
          type: currentFilter.type
        };
      } else {
        // If value is changing, keep the current operator
        newActiveFilters[field] = {
          ...currentFilter,
          value: value,
          operator: currentFilter.operator,
          type: currentFilter.type
        };
      }

      // Build conditions from active filters
      const newConditions = Object.entries(newActiveFilters)
        .filter(([, filter]) => {
          if (filter.value === null) return false;
          if (Array.isArray(filter.value) && filter.value.length === 0) return false;
          return true;
        })
        .map(([field, filter]) => ({
          field,
          type: filter.type,
          operator: filter.operator,
          value: filter.value
        }));

      console.log('New filter state:', {
        field,
        value,
        operator,
        conditions: newConditions
      });

      return {
        root: {
          ...prevState.root,
          conditions: newConditions
        },
        activeFilters: newActiveFilters
      };
    });
  };

  // Add a reset button to clear all filters
  const handleResetFilters = () => {
    const initialActiveFilters: FilterState['activeFilters'] = {};
    filterConfigs.forEach(config => {
      initialActiveFilters[config.field] = { type: config.type, value: null, operator: '=' };
    });
    setFilterState({
      root: { operator: 'AND', conditions: [] },
      activeFilters: initialActiveFilters
    });
  };

  const handleRootOperatorChange = (event: SelectChangeEvent<FilterOperator>) => {
    const newOperator = event.target.value as FilterOperator;
    setFilterState(prevState => ({
      ...prevState,
      root: {
        ...prevState.root,
        operator: newOperator
      }
    }));
  };

  const handleSubmit = () => {
    onSubmit(filterState, filteredData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Dynamic Filtering
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Define filters to select accounts for your segment
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Table</InputLabel>
          <Select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            label="Table"
          >
            {tables.map((table) => (
              <MenuItem key={table} value={table}>{table}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {isLoading && <Typography>Loading data...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Data Preview ({filteredData.length} records)
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel size="small">Filter Logic</InputLabel>
                <Select
                  size="small"
                  value={filterState.root.operator}
                  onChange={handleRootOperatorChange}
                  label="Filter Logic"
                >
                  <MenuItem value="AND">Match ALL Filters (AND)</MenuItem>
                  <MenuItem value="OR">Match ANY Filter (OR)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <DataTable data={filteredData} columns={columns} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filter Configuration
            </Typography>
            <FilterPanel
              filterConfigs={filterConfigs}
              filterState={filterState}
              onFilterChange={handleFilterChange}
            />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResetFilters}
          size="large"
        >
          Reset Filters
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          size="large"
        >
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default DynamicSegmentForm;
