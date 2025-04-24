import React from 'react';
import { Paper, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FilterConfig, FilterState, ComparisonOperator } from '../utils/types';
import NumericFilter from './NumericFilter';
import CategoryFilter from './CategoryFilter';
import BooleanFilter from './BooleanFilter';
import DateRangeFilter from './DateRangeFilter';

interface FilterPanelProps {
  filterConfigs: FilterConfig[];
  filterState: FilterState;
  onFilterChange: (field: string, value: any, operator: ComparisonOperator) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filterConfigs,
  filterState,
  onFilterChange,
}) => {
  const getOperatorsForType = (config: FilterConfig): ComparisonOperator[] => {
    switch (config.type) {
      case 'numeric':
        return ['=', '!=', '>', '>=', '<', '<=', 'between'];
      case 'categorical':
        return ['in', 'not_in'];
      case 'boolean':
        return ['=', '!='];
      case 'date':
        return ['=', '!=', '>', '>=', '<', '<=', 'between'];
      default:
        return ['=', '!=', 'contains', 'not_contains'];
    }
  };

  const renderOperatorSelect = (config: FilterConfig, currentOperator: ComparisonOperator) => {
    const operators = getOperatorsForType(config);
    
    return (
      <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={currentOperator}
          label="Operator"
          onChange={(e) => onFilterChange(config.field, filterState.activeFilters[config.field].value, e.target.value as ComparisonOperator)}
        >
          {operators.map((op) => (
            <MenuItem key={op} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderFilter = (config: FilterConfig) => {
    const currentFilter = filterState.activeFilters[config.field];
    const currentValue = currentFilter?.value;
    const currentOperator = currentFilter?.operator || '=';

    const handleChange = (value: any) => {
      onFilterChange(config.field, value, currentOperator);
    };

    const handleOperatorChange = (newOperator: ComparisonOperator) => {
      onFilterChange(config.field, currentValue, newOperator);
    };

    const FilterComponent = (() => {
      switch (config.component) {
        case 'slider':
          return NumericFilter;
        case 'checkbox':
        case 'select':
        case 'multi-select':
          return CategoryFilter;
        case 'switch':
          return BooleanFilter;
        case 'date-range':
          return DateRangeFilter;
        default:
          return null;
      }
    })();

    return (
      <Grid container spacing={2} alignItems="center" key={config.field}>
        <Grid item xs={3}>
          <Typography>{config.field}</Typography>
        </Grid>
        <Grid item xs={3}>
          {renderOperatorSelect(config, currentOperator)}
        </Grid>
        <Grid item xs={6}>
          {FilterComponent && (
            <FilterComponent
              config={config}
              value={currentValue}
              onChange={handleChange}
            />
          )}
        </Grid>
      </Grid>
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Box sx={{ mt: 2 }}>
        {filterConfigs.map(renderFilter)}
      </Box>
    </Paper>
  );
};

export default FilterPanel;
