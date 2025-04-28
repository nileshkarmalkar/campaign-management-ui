import React from 'react';
import { Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField, Checkbox, ListItemText } from '@mui/material';
import { FilterConfig, FilterState, ComparisonOperator } from '../utils/types';

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

  const handleOperatorChange = (field: string, newOperator: ComparisonOperator) => {
    // When operator changes, reset value and apply new operator
    onFilterChange(field, null, newOperator);
  };

  const renderOperatorSelect = (config: FilterConfig, currentOperator: ComparisonOperator) => {
    const operators = getOperatorsForType(config);
    
    return (
      <FormControl size="small" sx={{ width: '100%' }}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={currentOperator}
          label="Operator"
          onChange={(e) => handleOperatorChange(config.field, e.target.value as ComparisonOperator)}
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

  const renderValueInput = (config: FilterConfig, currentValue: any, currentOperator: ComparisonOperator) => {
    const handleChange = (value: any) => {
      onFilterChange(config.field, value, currentOperator);
    };

    if (currentOperator === 'between') {
      return (
        <Box display="flex" justifyContent="space-between">
          <TextField
            size="small"
            value={Array.isArray(currentValue) ? currentValue[0] || '' : ''}
            onChange={(e) => handleChange([e.target.value, currentValue?.[1] || ''])}
            placeholder="From"
            sx={{ width: '48%' }}
          />
          <TextField
            size="small"
            value={Array.isArray(currentValue) ? currentValue[1] || '' : ''}
            onChange={(e) => handleChange([currentValue?.[0] || '', e.target.value])}
            placeholder="To"
            sx={{ width: '48%' }}
          />
        </Box>
      );
    }

    if (config.type === 'categorical') {
      return (
        <Select
          multiple
          value={Array.isArray(currentValue) ? currentValue : []}
          onChange={(e) => handleChange(e.target.value)}
          renderValue={(selected) => (Array.isArray(selected) ? selected.join(', ') : '')}
          sx={{ width: '100%' }}
        >
          {config.options?.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={Array.isArray(currentValue) && currentValue.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      );
    }

    return (
      <TextField
        size="small"
        value={currentValue || ''}
        onChange={(e) => handleChange(e.target.value)}
        sx={{ width: '100%' }}
      />
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 3 }}>
        Filter Configuration
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: '4fr 3fr 5fr',
        columnGap: '24px',
        rowGap: '16px',
        '& .MuiInputBase-root': {
          height: '40px',
          '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.15)'
          }
        },
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center'
        },
        '& .MuiMenuItem-root': {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minHeight: '32px'
        },
        '& .MuiCheckbox-root': {
          padding: '4px'
        },
        '& .MuiFormLabel-root': {
          transform: 'translate(14px, 8px) scale(1)'
        },
        '& .MuiInputLabel-shrink': {
          transform: 'translate(14px, -9px) scale(0.75)'
        }
      }}>
        {/* Header */}
        <Typography sx={{ 
          fontWeight: 500, 
          color: 'text.secondary',
          fontSize: '0.875rem',
          pl: 1
        }}>
          Attribute
        </Typography>
        <Typography sx={{ 
          fontWeight: 500, 
          color: 'text.secondary',
          fontSize: '0.875rem',
          pl: 1
        }}>
          Operator
        </Typography>
        <Typography sx={{ 
          fontWeight: 500, 
          color: 'text.secondary',
          fontSize: '0.875rem',
          pl: 1
        }}>
          Value
        </Typography>

        {/* Filter rows */}
        {filterConfigs.map((config) => {
          const currentFilter = filterState.activeFilters[config.field];
          const currentValue = currentFilter?.value;
          const currentOperator = currentFilter?.operator || '=';

          return (
            <React.Fragment key={config.field}>
              <Typography 
                noWrap 
                sx={{ 
                  fontWeight: 500,
                  color: 'text.primary',
                  '&::first-letter': { textTransform: 'uppercase' },
                  alignSelf: 'center',
                  pl: 1,
                  fontSize: '0.875rem'
                }}
              >
                {config.field}
              </Typography>
              <Box>
                {renderOperatorSelect(config, currentOperator)}
              </Box>
              <Box>
                {renderValueInput(config, currentValue, currentOperator)}
              </Box>
            </React.Fragment>
          );
        })}
      </Box>
    </Paper>
  );
};

export default FilterPanel;
