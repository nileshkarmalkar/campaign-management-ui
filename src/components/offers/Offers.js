import React from 'react';
import { Typography, Button, Grid, Paper } from '@mui/material';

const Offers = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Offers
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button variant="contained" color="primary">
            Add New Offer
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary">
            Manage Mappings
          </Button>
        </Grid>
      </Grid>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Offer list with segment mappings will go here */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Maximum list size and offer assignments can be managed here
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Offers;
