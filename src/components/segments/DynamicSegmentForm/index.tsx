<<<<<<< HEAD
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface DynamicSegmentFormProps {
  onSubmit: (filters: any, data: any) => void;
  initialFilters?: any;
  initialFilteredData?: any[];
}

const DynamicSegmentForm: React.FC<DynamicSegmentFormProps> = ({
  onSubmit,
  initialFilters,
  initialFilteredData
}) => {
  const [filters, setFilters] = useState(initialFilters || null);
  const [filteredData, setFilteredData] = useState(initialFilteredData || []);

  const handleSubmit = () => {
    // For now, just pass empty data
    onSubmit({}, []);
  };

  return (
    <Box>
      <Typography variant="body1" gutterBottom>
        Dynamic segmentation feature is under development.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Apply Filters
      </Button>
    </Box>
=======
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Typography, Grid, Paper, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, TextField } from '@mui/material';
import { FilterOperator } from './utils/types';
import { analyzeColumn, generateFilterConfig } from './utils/dataAnalyzer';
import { ColumnMetadata, FilterConfig, FilterState, FilterGroup, FilterCondition, ComparisonOperator } from './utils/types';
import dayjs from 'dayjs';
import DataTable from './DataTable';
import FilterPanel from './FilterPanel';
import dataService from '../../../services/bigquery';

interface DynamicSegmentFormProps {
  onSubmit: (filters: FilterState, filteredData: Record<string, any>[], name: string, description: string) => void;
  initialFilters?: FilterState;
  initialFilteredData?: Record<string, any>[];
  initialName?: string;
  initialDescription?: string;
  availableTables: string[];
}

const DynamicSegmentForm: React.FC<DynamicSegmentFormProps> = ({ onSubmit, initialFilters, initialFilteredData, initialName, initialDescription, availableTables }) => {
  const [name, setName] = useState<string>(initialName || '');
  const [description, setDescription] = useState<string>(initialDescription || '');
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

  useEffect(() => {
    if (availableTables.length > 0 && !selectedTable) {
      setSelectedTable(availableTables[0]);
    }
  }, [availableTables, selectedTable]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTable) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await dataService.getTableData(selectedTable, 1000);
        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          throw new Error(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (selectedTable === 'customer_data' || selectedTable === 'churn_data') {
          // If using sample data tables, don't show error
          setError(null);
        } else {
          setError('Failed to fetch data. Please try again.');
        }
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
    onSubmit(filterState, filteredData, name, description);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Segment Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Segment Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </Box>
      
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
            {availableTables.map((table) => (
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
>>>>>>> feature/dynamic-segmentation
  );
};

export default DynamicSegmentForm;
