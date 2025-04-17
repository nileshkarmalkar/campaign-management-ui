import React, { useState, useMemo } from 'react';
import { Typography, Button, Grid, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CampaignForm from './CampaignForm';
import { format } from 'date-fns';

const Campaigns = () => {
  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('campaignName');

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const searchValue = campaign[searchField]?.toString().toLowerCase() || '';
      return searchValue.includes(searchTerm.toLowerCase());
    });
  }, [campaigns, searchTerm, searchField]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchTerm(''); // Reset search term when changing search field
  };

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
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Search By</InputLabel>
          <Select
            value={searchField}
            onChange={handleSearchFieldChange}
            label="Search By"
          >
            <MenuItem value="campaignName">Campaign Name</MenuItem>
            <MenuItem value="campaignCode">Campaign Code</MenuItem>
            <MenuItem value="businessUnit">Business Unit</MenuItem>
            <MenuItem value="campaignType">Campaign Type</MenuItem>
            <MenuItem value="requestorName">Requestor Name</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Search Campaigns"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
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
          {filteredCampaigns.map((campaign, index) => (
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
