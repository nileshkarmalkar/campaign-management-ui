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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { FilterConfig } from '../utils/types';

interface CategoryFilterProps {
  config: FilterConfig;
  value: string[] | null;
  onChange: (value: string[]) => void;
}

const COLORS = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#607d8b'];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ config, value, onChange }) => {
  if (!config.options) return null;

  const selectedValues = value || [];

  const chartData = config.options.map((option, index) => ({
    name: String(option),
    value: 1,
    color: COLORS[index % COLORS.length],
    isSelected: selectedValues.includes(String(option))
  }));

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = event.target.value as string[];
    onChange(newValue);
  };

  const handleCheckboxChange = (option: string) => {
    const newValue = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValue);
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
      multiple
      value={selectedValues}
      onChange={handleChange}
      input={<OutlinedInput />}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(selected as string[]).map((value) => (
            <Chip key={value} label={value} size="small" />
          ))}
        </Box>
      )}
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
      <Typography variant="subtitle2" gutterBottom>
        {config.field}
      </Typography>

      <Box sx={{ height: 150, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={50}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={entry.isSelected ? 1 : 0.3}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {config.component === 'checkbox' ? renderCheckboxes() : renderSelect()}

      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
        Selected: {selectedValues.length} of {config.options.length}
      </Typography>
    </Box>
  );
};

export default CategoryFilter;
