import React from 'react';
import { Typography, Button, Grid, Paper } from '@mui/material';

const Offers = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Offers
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 3 }}>
        Add New Offer
      </Button>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Offer list with segment mappings will go here */}
        </Grid>
      </Paper>
    </div>
  );
};

export default Offers;
