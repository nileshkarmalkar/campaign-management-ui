import React, { useState } from 'react';
import { Typography, Button, Grid, Paper } from '@mui/material';
import CampaignForm from './CampaignForm';
import { format } from 'date-fns';

const Campaigns = () => {
  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const handleAddCampaign = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSubmitForm = (formData) => {
    setCampaigns([...campaigns, formData]);
    setShowForm(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Campaigns
      </Typography>
      {!showForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCampaign}
          style={{ marginBottom: '20px' }}
        >
          Add New Campaign
        </Button>
      )}
      {showForm ? (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <CampaignForm onSubmit={handleSubmitForm} onCancel={handleCancelForm} />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((campaign, index) => (
            <Grid item xs={12} key={index}>
              <Paper style={{ padding: '20px' }}>
                <Typography variant="h6">{campaign.campaignName}</Typography>
                <Typography>Requestor: {campaign.requestorName}</Typography>
                <Typography>Deployment Date: {campaign.deploymentDate ? format(campaign.deploymentDate, 'MMMM d, yyyy') : ''}</Typography>
                <Typography>Business Unit: {campaign.businessUnit}</Typography>
                <Typography>Campaign Type: {campaign.campaignType}</Typography>
                <Typography>List Size Requested: {campaign.listSizeRequested}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Campaigns;
