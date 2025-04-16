import React from 'react';
import { Typography, Button, Grid } from '@mui/material';

const Campaigns = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Campaigns
      </Typography>
      <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Add New Campaign
      </Button>
      <Grid container spacing={3}>
        {/* Campaign list will go here */}
      </Grid>
    </div>
  );
};

export default Campaigns;
