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
import { FilterConfig } from '../utils/types';

interface BooleanFilterProps {
  config: FilterConfig;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

const BooleanFilter: React.FC<BooleanFilterProps> = ({ config, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const chartData = [
    { name: 'True', value: 1, color: '#4caf50' },
    { name: 'False', value: 1, color: '#f44336' }
  ];

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {config.field}
      </Typography>

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
  );
};

export default BooleanFilter;
