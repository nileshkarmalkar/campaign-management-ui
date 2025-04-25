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

<<<<<<< Updated upstream
  const handleSubmitForm = (formData) => {
    if (selectedSegment) {
      updateSegment({ ...formData, id: selectedSegment.id });
      setShowEditForm(false);
      setSelectedSegment(null);
    } else {
      addSegment(formData);
      setShowForm(false);
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSegment}
          style={{ marginBottom: '20px' }}
        >
          Add New Segment
        </Button>
=======
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
>>>>>>> Stashed changes
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
                <Typography>
                  Brand: {Array.isArray(segment.brand) 
                    ? segment.brand.join(', ')
                    : segment.brand}
                </Typography>
                <Typography>
                  Line of Business: {Array.isArray(segment.lineOfBusiness)
                    ? segment.lineOfBusiness.join(', ')
                    : segment.lineOfBusiness}
                </Typography>
                <Typography>
                  Account Type: {Array.isArray(segment.accountType)
                    ? segment.accountType.join(', ')
                    : segment.accountType}
                </Typography>
                <Typography>
                  Account Sub-type: {Array.isArray(segment.accountSubType)
                    ? segment.accountSubType.join(', ')
                    : segment.accountSubType}
                </Typography>
                {segment.numberOfSubscribers && (
                  <Typography>Number of Subscribers: {segment.numberOfSubscribers}</Typography>
                )}
                <Typography>
                  Geography: {Array.isArray(segment.geography)
                    ? segment.geography.join(', ')
                    : segment.geography}
                </Typography>
                {segment.msfAmount && (
                  <Typography>
                    MSF Amount: {(() => {
                      const { operator, value1, value2 } = segment.msfAmount;
                      switch (operator) {
                        case '>=':
                          return `≥ $${value1}`;
                        case '<=':
                          return `≤ $${value1}`;
                        case '=':
                          return `= $${value1}`;
                        case 'between':
                          return `$${value1} - $${value2}`;
                        default:
                          return 'Not specified';
                      }
                    })()}
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
