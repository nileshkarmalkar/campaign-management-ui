import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { FilterConfig, FilterState } from '../utils/types';
import NumericFilter from './NumericFilter';
import CategoryFilter from './CategoryFilter';
import BooleanFilter from './BooleanFilter';

interface FilterPanelProps {
  filterConfigs: FilterConfig[];
  filterState: FilterState;
  onFilterChange: (field: string, value: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filterConfigs,
  filterState,
  onFilterChange,
}) => {
  const renderFilter = (config: FilterConfig) => {
    const currentValue = filterState[config.field]?.value;

    switch (config.component) {
      case 'slider':
        return (
          <NumericFilter
            key={config.field}
            config={config}
            value={currentValue}
            onChange={(value) => onFilterChange(config.field, value)}
          />
        );
      case 'checkbox':
      case 'select':
        return (
          <CategoryFilter
            key={config.field}
            config={config}
            value={currentValue}
            onChange={(value) => onFilterChange(config.field, value)}
          />
        );
      case 'switch':
        return (
          <BooleanFilter
            key={config.field}
            config={config}
            value={currentValue}
            onChange={(value) => onFilterChange(config.field, value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      {filterConfigs.map(renderFilter)}
    </Paper>
  );
};

export default FilterPanel;
