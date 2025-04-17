import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Typography, Button, Grid, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TriggerForm from './TriggerForm';

const Triggers = () => {
  const [showForm, setShowForm] = useState(false);
  const { triggers, addTrigger, campaigns } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('triggerName');
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState('');


  const filteredTriggers = useMemo(() => {
    return triggers.filter(trigger => {
      const searchValue = trigger[searchField]?.toString().toLowerCase() || '';
      return searchValue.includes(searchTerm.toLowerCase());
    });
  }, [triggers, searchTerm, searchField]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchTerm('');
  };

  const handleAddTrigger = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSubmitForm = (formData) => {
    addTrigger(formData);
    setShowForm(false);
  };

  const handleMapTrigger = (trigger) => {
    setSelectedTrigger(trigger);
    setShowMapDialog(true);
  };

  const handleMapDialogClose = () => {
    setShowMapDialog(false);
    setSelectedTrigger(null);
    setSelectedCampaign('');
  };

  const handleMapDialogSubmit = () => {
    // Note: We're not updating the trigger here because the mapping is stored in the campaign
    // You might want to add a function in AppContext to update the campaign's mapped triggers
    handleMapDialogClose();
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Triggers
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Search By</InputLabel>
          <Select
            value={searchField}
            onChange={handleSearchFieldChange}
            label="Search By"
          >
            <MenuItem value="triggerName">Trigger Name</MenuItem>
            <MenuItem value="type">Trigger Type</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Search Triggers"
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
          onClick={handleAddTrigger}
          style={{ marginBottom: '20px' }}
        >
          Add New Trigger
        </Button>
      )}
      {showForm ? (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <TriggerForm onSubmit={handleSubmitForm} onCancel={handleCancelForm} />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredTriggers.map((trigger) => (
            <Grid item xs={12} key={trigger.id}>
              <Paper style={{ padding: '20px' }}>
                <Typography variant="h6">{trigger.triggerName}</Typography>
                <Typography>Type: {trigger.type}</Typography>
                <Typography>Status: {trigger.status}</Typography>
                <Typography>Mapped Campaign: {trigger.mappedCampaign || 'Not mapped'}</Typography>
                <Button onClick={() => handleMapTrigger(trigger)} variant="outlined" style={{ marginTop: '10px' }}>
                  Map to Campaign
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={showMapDialog} onClose={handleMapDialogClose}>
        <DialogTitle>Map Trigger to Campaign</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Campaign</InputLabel>
            <Select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              label="Select Campaign"
            >
              {campaigns.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>{campaign.campaignName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMapDialogClose}>Cancel</Button>
          <Button onClick={handleMapDialogSubmit} variant="contained" color="primary">Map</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Triggers;
