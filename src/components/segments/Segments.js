import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Typography, Button, Grid, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box, IconButton, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import SegmentForm from './SegmentForm';

const Segments = () => {
  const [showForm, setShowForm] = useState(false);
  const { segments, addSegment, updateSegment, triggers, isBigQueryInitialized, isLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('segmentName');
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);

  const filteredSegments = useMemo(() => {
    return segments.filter(segment => {
      const searchValue = segment[searchField]?.toString().toLowerCase() || '';
      return searchValue.includes(searchTerm.toLowerCase());
    });
  }, [segments, searchTerm, searchField]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchTerm('');
  };

  const handleAddSegment = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (selectedSegment) {
        await updateSegment({ ...formData, id: selectedSegment.id });
      } else {
        await addSegment(formData);
      }
      setShowForm(false);
      setSelectedSegment(null);
    } catch (error) {
      console.error('Error saving segment:', error);
      // Error handling is done in SegmentForm
    }
  };

  const handleEditSegment = (segment) => {
    setSelectedSegment(segment);
    setShowEditForm(true);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setSelectedSegment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4caf50';
      case 'inactive':
        return '#f44336';
      case 'draft':
        return '#ff9800';
      default:
        return '#000000';
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Segments
      </Typography>

      {!isBigQueryInitialized && (
        <Alert severity="info" sx={{ mb: 2 }}>
          BigQuery integration is initializing. Some features may be temporarily unavailable.
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Search By</InputLabel>
          <Select
            value={searchField}
            onChange={handleSearchFieldChange}
            label="Search By"
          >
            <MenuItem value="segmentName">Segment Name</MenuItem>
            <MenuItem value="type">Segment Type</MenuItem>
            <MenuItem value="source">Data Source</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Search Segments"
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
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSegment}
            disabled={isLoading}
          >
            Create Segment
          </Button>
        </Box>
      )}
      {showForm || showEditForm ? (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <SegmentForm 
            onSubmit={handleSubmitForm} 
            onCancel={showEditForm ? handleCancelEdit : handleCancelForm}
            availableTriggers={triggers}
            availableSegments={segments}
            currentSegmentId={selectedSegment?.id}
            initialData={selectedSegment}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredSegments.map((segment) => (
            <Grid item xs={12} key={segment.id}>
              <Paper style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{segment.segmentName}</Typography>
                  <IconButton onClick={() => handleEditSegment(segment)} color="primary" disabled={isLoading}>
                    <EditIcon />
                  </IconButton>
                </Box>
                <Typography>Description: {segment.description}</Typography>
                <Typography style={{ color: getStatusColor(segment.status) }}>
                  Status: {segment.status}
                </Typography>
                {segment.filters && (
                  <Typography>
                    Dynamic Filters: {JSON.stringify(segment.filters)}
                  </Typography>
                )}
                {segment.filteredAccounts && (
                  <Typography>
                    Filtered Accounts: {segment.filteredAccounts.length}
                  </Typography>
                )}
                {segment.triggers && Array.isArray(segment.triggers) && segment.triggers.length > 0 && (
                  <Typography>
                    Triggers: {segment.triggers.map(t => {
                      const trigger = triggers.find(trigger => trigger.id === t);
                      return trigger ? `${trigger.triggerName} (${trigger.type})` : '';
                    }).filter(Boolean).join(', ')}
                  </Typography>
                )}
                {segment.existingSegments && Array.isArray(segment.existingSegments) && segment.existingSegments.length > 0 && (
                  <Typography>
                    Existing Segments: {segment.existingSegments.map(s => segments.find(seg => seg.id === s)?.segmentName).filter(Boolean).join(', ')}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Segments;
