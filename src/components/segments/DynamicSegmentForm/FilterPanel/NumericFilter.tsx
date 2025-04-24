import React from 'react';
import { Box, Typography, Slider } from '@mui/material';
import { FilterConfig } from '../utils/types';

interface NumericRange {
  min: number;
  max: number;
  buckets: Array<{
    start: number;
    end: number;
    count: number;
  }>;
}

interface NumericFilterProps {
  config: FilterConfig;
  value: [number, number] | null;
  onChange: (value: [number, number]) => void;
}

const NumericFilter: React.FC<NumericFilterProps> = ({ config, value, onChange }) => {
  if (!config.range) return null;

  const range = config.range as NumericRange;
  const { min, max, buckets } = range;
  const currentValue = value || [min, max];

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      onChange([newValue[0], newValue[1]]);
    }
  };

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {config.field}
      </Typography>

      <Box sx={{ px: 1 }}>
        <Slider
          value={currentValue}
          onChange={handleSliderChange}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          marks={[
            { value: min, label: Math.round(min).toString() },
            { value: max, label: Math.round(max).toString() }
          ]}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="textSecondary">
          Selected range: {Math.round(currentValue[0])} - {Math.round(currentValue[1])}
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
