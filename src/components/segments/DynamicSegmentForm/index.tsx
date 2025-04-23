import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Grid, Paper, Button } from '@mui/material';
import { analyzeColumn, generateFilterConfig, generateChartData } from './utils/dataAnalyzer';
import { ColumnMetadata, FilterConfig, FilterState } from './utils/types';
import DataTable from './DataTable';
import FilterPanel from './FilterPanel';

interface DynamicSegmentFormProps {
  data: Record<string, any>[];
  onSubmit: (filters: FilterState, filteredData: Record<string, any>[]) => void;
}

const DynamicSegmentForm: React.FC<DynamicSegmentFormProps> = ({ data, onSubmit }) => {
  const [columns, setColumns] = useState<ColumnMetadata[]>([]);
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({});

  useEffect(() => {
    if (data.length > 0) {
      const analyzedColumns = Object.keys(data[0]).map(key => analyzeColumn(key, data.map(item => item[key])));
      setColumns(analyzedColumns);
      
      const configs = analyzedColumns.map(column => generateFilterConfig(column));
      setFilterConfigs(configs);

      const initialFilterState: FilterState = {};
      configs.forEach(config => {
        initialFilterState[config.field] = { type: config.type, value: null };
      });
      setFilterState(initialFilterState);
    }
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filterState).every(([field, filter]) => {
        if (filter.value === null) return true;
        
        switch (filter.type) {
          case 'numeric':
            const [min, max] = filter.value as [number, number];
            return row[field] >= min && row[field] <= max;
          case 'categorical':
            return (filter.value as string[]).includes(row[field]);
          case 'boolean':
            return row[field] === filter.value;
          default:
            return true;
        }
      });
    });
  }, [data, filterState]);

  const handleFilterChange = (field: string, value: any) => {
    setFilterState(prevState => ({
      ...prevState,
      [field]: { ...prevState[field], value }
    }));
  };

  const handleSubmit = () => {
    onSubmit(filterState, filteredData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dynamic Segment Creator
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <DataTable data={filteredData} columns={columns} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FilterPanel
            filterConfigs={filterConfigs}
            filterState={filterState}
            onFilterChange={handleFilterChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Segment
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DynamicSegmentForm;
