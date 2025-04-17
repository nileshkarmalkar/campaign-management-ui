import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Typography, Button, Grid, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box, IconButton, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import CampaignForm from './CampaignForm';
import { format } from 'date-fns';

const Campaigns = () => {
  const [showForm, setShowForm] = useState(false);
  const { campaigns, addCampaign, updateCampaign } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('campaignName');
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

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
    setSearchTerm('');
  };

  const handleAddCampaign = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSubmitForm = (formData) => {
    if (selectedCampaign) {
      updateCampaign({ ...formData, id: selectedCampaign.id });
      setShowEditForm(false);
      setSelectedCampaign(null);
    } else {
      addCampaign(formData);
      setShowForm(false);
    }
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowEditForm(true);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setSelectedCampaign(null);
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
      {showForm || showEditForm ? (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <CampaignForm 
            onSubmit={handleSubmitForm} 
            onCancel={showEditForm ? handleCancelEdit : handleCancelForm}
            initialData={selectedCampaign}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredCampaigns.map((campaign, index) => (
            <Grid item xs={12} key={index}>
              <Paper style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{campaign.campaignName}</Typography>
                  <IconButton onClick={() => handleEditCampaign(campaign)} color="primary">
                    <EditIcon />
                  </IconButton>
                </Box>
                <Typography>Requestor: {campaign.requestorName}</Typography>
                <Typography>Deployment Date: {campaign.deploymentDate ? format(campaign.deploymentDate, 'MMMM d, yyyy') : ''}</Typography>
                <Typography>Deployment End Date: {campaign.deploymentEndDate ? format(campaign.deploymentEndDate, 'MMMM d, yyyy') : ''}</Typography>
                <Typography>Business Unit: {campaign.businessUnit}</Typography>
                <Typography>Campaign Type: {campaign.campaignType}</Typography>
                <Typography>Campaign Code: {campaign.campaignCode}</Typography>
                <Typography>Sub Camp Code: {campaign.subCampCode}</Typography>
                <Typography>Marcomm Prime: {campaign.marcommPrime}</Typography>
                <Typography>
                  Brand: {campaign.brand.map(b => (
                    <Chip key={b} label={b} style={{marginRight: '5px'}} />
                  ))}
                </Typography>
                <Typography>
                  Line of Business: {campaign.lineOfBusiness.map(lob => (
                    <Chip key={lob} label={lob} style={{marginRight: '5px'}} />
                  ))}
                </Typography>
                <Typography>Contract Expiry Duration: {campaign.contractExpiryDuration} month(s)</Typography>
                <Typography>
                  Language: {campaign.language.map(lang => (
                    <Chip key={lang} label={lang} style={{marginRight: '5px'}} />
                  ))}
                </Typography>
                <Typography>Contract Strategy Waiver: {campaign.contractStrategyWaiver ? 'Yes' : 'No'}</Typography>
                {campaign.contractStrategyWaiver && (
                  <Typography>Contract Strategy Waiver Reason: {campaign.contractStrategyWaiverReason}</Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Campaigns;
