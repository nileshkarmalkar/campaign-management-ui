import React from 'react';
import { Typography, Button, Grid, Paper } from '@mui/material';

const Communications = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Communications
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button variant="contained" color="primary">
            Add Creative Code
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary">
            Manage Variables
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary">
            Set List Size Limits
          </Button>
        </Grid>
      </Grid>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Creative Codes and Templates
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Manage communication templates, creative codes, and variable fields.
              Multiple offers can be mapped to the same creative.
            </Typography>
          </Grid>
          {/* Communication templates and creative codes list will go here */}
        </Grid>
      </Paper>
      <Paper sx={{ p: 2, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Communication Journey Settings
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Configure sequenced communication journeys and manage campaign-level settings
            </Typography>
          </Grid>
          {/* Journey settings and configurations will go here */}
        </Grid>
      </Paper>
    </div>
  );
};

export default Communications;
