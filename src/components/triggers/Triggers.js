import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Typography, Button, Grid, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import TriggerForm from './TriggerForm';

const Triggers = () => {
  const [showForm, setShowForm] = useState(false);
  const { triggers, addTrigger, updateTrigger } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('triggerName');
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState(null);

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
    if (selectedTrigger) {
      updateTrigger({ ...formData, id: selectedTrigger.id });
      setShowEditForm(false);
      setSelectedTrigger(null);
    } else {
      addTrigger(formData);
      setShowForm(false);
    }
  };

  const handleEditTrigger = (trigger) => {
    setSelectedTrigger(trigger);
    setShowEditForm(true);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setSelectedTrigger(null);
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
      {showForm || showEditForm ? (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <TriggerForm 
            onSubmit={handleSubmitForm} 
            onCancel={showEditForm ? handleCancelEdit : handleCancelForm}
            initialData={selectedTrigger}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredTriggers.map((trigger) => (
            <Grid item xs={12} key={trigger.id}>
              <Paper style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{trigger.triggerName}</Typography>
                  <IconButton onClick={() => handleEditTrigger(trigger)} color="primary">
                    <EditIcon />
                  </IconButton>
                </Box>
                <Typography>Type: {trigger.type}</Typography>
                <Typography>Status: {trigger.status}</Typography>
                <Typography>Description: {trigger.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Triggers;
