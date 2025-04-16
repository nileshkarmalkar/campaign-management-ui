import React from 'react';
import { Typography, Button, Grid, Paper } from '@mui/material';

const Segments = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Segments
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button variant="contained" color="primary">
            Add New Segment
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary">
            Update Rules
          </Button>
        </Grid>
      </Grid>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Segment list with trigger events will go here */}
        </Grid>
      </Paper>
    </div>
  );
};

export default Segments;
