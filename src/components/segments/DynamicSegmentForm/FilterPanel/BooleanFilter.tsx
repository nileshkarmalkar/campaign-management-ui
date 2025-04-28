import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FilterConfig, ComparisonOperator } from '../utils/types';

interface BooleanFilterProps {
  config: FilterConfig;
  value: boolean | null;
  onChange: (value: boolean, operator: ComparisonOperator) => void;
}

const BooleanFilter: React.FC<BooleanFilterProps> = ({ config, value, onChange }) => {
  const operator = config.operator || '=';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked, operator);
  };

  const handleOperatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOperator = event.target.checked ? '=' : '!=';
    onChange(value === null ? true : value, newOperator);
  };

  const chartData = [
    { name: 'True', value: 1, color: '#4caf50' },
    { name: 'False', value: 1, color: '#f44336' }
  ];

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">
          {config.field}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={operator === '='}
              onChange={handleOperatorChange}
              color="primary"
            />
          }
          label={operator === '=' ? 'Is' : 'Is Not'}
        />
      </Box>

      <Box sx={{ height: 100, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={value === (entry.name === 'True') ? 1 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={value === true}
              onChange={handleChange}
              color="primary"
            />
          }
          label={value ? 'True' : 'False'}
        />
      </Box>
    </Box>
  );
};

export default BooleanFilter;
