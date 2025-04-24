import React from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { FilterConfig, ComparisonOperator } from '../utils/types';

interface CategoryFilterProps {
  config: FilterConfig;
  value: string[] | null;
  onChange: (value: string[], operator: ComparisonOperator) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ config, value, onChange }) => {
  if (!config.options) return null;

  const selectedValues = value || [];
  const operator = config.operator || 'in';

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const newValue = event.target.value;
    const updatedValue = operator === '=' ? [newValue as string] : newValue as string[];
    onChange(updatedValue, operator);
  };

  const handleCheckboxChange = (option: string) => {
    let newValue: string[];
    if (operator === '=') {
      newValue = [option];
    } else {
      newValue = selectedValues.includes(option)
        ? selectedValues.filter(v => v !== option)
        : [...selectedValues, option];
    }
    onChange(newValue, operator);
  };

  const handleOperatorChange = (event: SelectChangeEvent<ComparisonOperator>) => {
    const newOperator = event.target.value as ComparisonOperator;
    const newValue = newOperator === '=' ? (selectedValues.length > 0 ? [selectedValues[0]] : []) : selectedValues;
    onChange(newValue, newOperator);
  };

  const renderCheckboxes = () => (
    <FormGroup>
      {config.options?.map((option) => (
        <FormControlLabel
          key={String(option)}
          control={
            <Checkbox
              checked={selectedValues.includes(String(option))}
              onChange={() => handleCheckboxChange(String(option))}
            />
          }
          label={String(option)}
        />
      ))}
    </FormGroup>
  );

  const renderSelect = () => (
    <Select
      multiple={operator !== '='}
      value={operator === '=' ? (selectedValues[0] || '') : selectedValues}
      onChange={handleChange}
      input={<OutlinedInput />}
      renderValue={(selected) => {
        if (operator === '=') {
          return selected as string;
        }
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as string[]).map((value) => (
              <Chip key={value} label={value} size="small" />
            ))}
          </Box>
        );
      }}
      sx={{ width: '100%', mt: 1 }}
    >
      {config.options?.map((option) => (
        <MenuItem key={String(option)} value={String(option)}>
          {String(option)}
        </MenuItem>
      ))}
    </Select>
  );

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">
          {config.field}
        </Typography>
        <Select
          value={operator}
          onChange={handleOperatorChange}
          size="small"
        >
          <MenuItem value="=">Is Equal To</MenuItem>
          <MenuItem value="in">Includes</MenuItem>
          <MenuItem value="not_in">Excludes</MenuItem>
        </Select>
      </Box>

      {config.component === 'checkbox' ? renderCheckboxes() : renderSelect()}

      <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
        Selected: {selectedValues.length} of {config.options.length}
      </Typography>
    </Box>
  );
};

export default CategoryFilter;
