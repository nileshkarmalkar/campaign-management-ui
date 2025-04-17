import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Typography, Button, Grid, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import CampaignForm from './CampaignForm';
import { format } from 'date-fns';

const Campaigns = () => {
  const [showForm, setShowForm] = useState(false);
  const { campaigns, addCampaign, updateCampaign, triggers, mapTriggerToCampaign } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('campaignName');
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedTriggers, setSelectedTriggers] = useState([]);


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
    if (selectedCampaign) {
      updateCampaign({ ...formData, id: selectedCampaign.id, mappedTriggers: selectedCampaign.mappedTriggers });
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

  const handleMapTriggers = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedTriggers(campaign.mappedTriggers || []);
    setShowMapDialog(true);
  };

  const handleMapDialogClose = () => {
    setShowMapDialog(false);
    setSelectedCampaign(null);
    setSelectedTriggers([]);
  };

  const handleTriggerSelectionChange = (event) => {
    setSelectedTriggers(event.target.value);
  };

  const handleMapDialogSubmit = () => {
    // Update all selected triggers to map to this campaign
    selectedTriggers.forEach(triggerId => {
      mapTriggerToCampaign(triggerId, selectedCampaign.id);
    });
    handleMapDialogClose();
  };

  const getMappedTriggersForCampaign = (campaign) => {
    return triggers.filter(trigger => trigger.mappedCampaignId === campaign.id);
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
                <Typography>Business Unit: {campaign.businessUnit}</Typography>
                <Typography>Campaign Type: {campaign.campaignType}</Typography>
                <Typography>List Size Requested: {campaign.listSizeRequested}</Typography>
                <Typography>
                  Mapped Triggers: {getMappedTriggersForCampaign(campaign).length > 0 
                    ? getMappedTriggersForCampaign(campaign).map(t => t.triggerName).join(', ') 
                    : 'None'}
                </Typography>
                <Button
                  onClick={() => handleMapTriggers(campaign)}
                  variant="outlined"
                  color="primary"
                  style={{ marginTop: '10px' }}
                >
                  Map Triggers
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={showMapDialog} onClose={handleMapDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Map Triggers to Campaign</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Triggers</InputLabel>
            <Select
              multiple
              value={selectedTriggers}
              onChange={handleTriggerSelectionChange}
              renderValue={(selected) => selected.map(id => triggers.find(t => t.id === id)?.triggerName || '').filter(Boolean).join(', ')}
            >
              {triggers.map((trigger) => (
                <MenuItem key={trigger.id} value={trigger.id}>
                  {trigger.triggerName} ({trigger.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMapDialogClose}>Cancel</Button>
          <Button onClick={handleMapDialogSubmit} variant="contained" color="primary">
            Save Mapping
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Campaigns;
