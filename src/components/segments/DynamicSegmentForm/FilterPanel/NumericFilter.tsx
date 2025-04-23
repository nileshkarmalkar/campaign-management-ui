import React from 'react';
import { Box, Typography, Slider } from '@mui/material';
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

interface NumericFilterProps {
  config: FilterConfig;
  value: [number, number] | null;
  onChange: (value: [number, number]) => void;
}

const NumericFilter: React.FC<NumericFilterProps> = ({ config, value, onChange }) => {
  if (!config.range) return null;

  const { min, max, buckets } = config.range;
  const currentValue = value || [min, max];

  const chartData = buckets.map(bucket => ({
    name: `${bucket.start.toFixed(0)}-${bucket.end.toFixed(0)}`,
    count: bucket.count,
    isSelected: bucket.start >= currentValue[0] && bucket.end <= currentValue[1]
  }));

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    onChange(newValue as [number, number]);
  };

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {config.field}
      </Typography>
      
      <Box sx={{ height: 100, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={1}
              angle={-45}
              textAnchor="end"
            />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="count" fill="#bdbdbd">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isSelected ? '#2196f3' : '#bdbdbd'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ px: 1 }}>
        <Slider
          value={currentValue}
          onChange={handleSliderChange}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          marks={[
            { value: min, label: min.toFixed(0) },
            { value: max, label: max.toFixed(0) }
          ]}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="textSecondary">
          Selected range: {currentValue[0].toFixed(0)} - {currentValue[1].toFixed(0)}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Count: {buckets.reduce((sum, bucket) => 
            bucket.start >= currentValue[0] && bucket.end <= currentValue[1] 
              ? sum + bucket.count 
              : sum, 
            0
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default NumericFilter;
