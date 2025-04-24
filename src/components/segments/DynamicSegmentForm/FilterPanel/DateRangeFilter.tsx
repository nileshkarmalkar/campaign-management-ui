import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, TextField, FormHelperText, Tooltip as MuiTooltip, Button } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FilterConfig, DateRangeBucket } from '../utils/types';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface DateRangeFilterProps {
  config: FilterConfig;
  value: [string | number, string | number] | null;
  onChange: (value: [string, string]) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ config, value, onChange }) => {
  const [error, setError] = useState<string | null>(null);
  const isValidRange = config.range && (typeof config.range.min === 'string' || typeof config.range.min === 'number') && (typeof config.range.max === 'string' || typeof config.range.max === 'number');
  
  const { min = '', max = '', buckets = [] } = config.range || {};
  const [startDate, endDate] = value || [min, max];

  const formatDate = (date: string | number): string => {
    return typeof date === 'number' ? dayjs(date).format('YYYY-MM-DD') : date;
  };

  const stringStartDate = formatDate(startDate);
  const stringEndDate = formatDate(endDate);
  const stringMin = formatDate(min);
  const stringMax = formatDate(max);

  useEffect(() => {
    if (!isValidRange) return;
    
    if (stringStartDate > stringEndDate) {
      setError('Start date cannot be after end date');
    } else if (stringStartDate < stringMin || stringEndDate > stringMax) {
      setError('Selected dates are outside the allowed range');
    } else {
      setError(null);
    }
  }, [stringStartDate, stringEndDate, stringMin, stringMax, isValidRange]);

  const chartData = useMemo(() => {
    if (!isValidRange) return [];
    
    return (buckets as DateRangeBucket[]).map(bucket => ({
      name: `${bucket.start}-${bucket.end}`,
      count: bucket.count,
      isSelected: dayjs(bucket.start).isSameOrAfter(stringStartDate) && dayjs(bucket.end).isSameOrBefore(stringEndDate),
      tooltipLabel: `${dayjs(bucket.start).format('MMM D, YYYY')} - ${dayjs(bucket.end).format('MMM D, YYYY')}`
    }));
  }, [buckets, stringStartDate, stringEndDate, isValidRange]);

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = event.target.value;
    onChange([newStartDate, stringEndDate]);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    onChange([stringStartDate, newEndDate]);
  };

  const handleReset = () => {
    onChange([stringMin, stringMax]);
  };

  if (!isValidRange) {
    return null;
  }

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        tooltipLabel: string;
        count: number;
      };
    }>;
  }

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="body2">{data.tooltipLabel}</Typography>
          <Typography variant="body2">Count: {data.count}</Typography>
        </Box>
      );
    }
    return null;
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
            <Tooltip content={<CustomTooltip />} />
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1, display: 'flex', gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={stringStartDate}
              onChange={handleStartDateChange}
              error={!!error && (stringStartDate > stringEndDate || stringStartDate < stringMin)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: stringMin,
                max: stringMax
              }}
              helperText={`Min: ${dayjs(stringMin).format('MMM D, YYYY')}`}
              sx={{ flex: 1 }}
            />
            <TextField
              label="End Date"
              type="date"
              value={stringEndDate}
              onChange={handleEndDateChange}
              error={!!error && (stringEndDate < stringStartDate || stringEndDate > stringMax)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: stringMin,
                max: stringMax
              }}
              helperText={`Max: ${dayjs(stringMax).format('MMM D, YYYY')}`}
              sx={{ flex: 1 }}
            />
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={handleReset}
            sx={{ minWidth: 100 }}
          >
            Reset Range
          </Button>
        </Box>
        {error && (
          <FormHelperText error>{error}</FormHelperText>
        )}
      </Box>
    </Box>
  );
};

export default DateRangeFilter;
