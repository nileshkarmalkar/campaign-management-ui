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
      </Grid>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Communication templates and creative codes will go here */}
        </Grid>
      </Paper>
    </div>
  );
};

export default Communications;
