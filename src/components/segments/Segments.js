import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Typography, Button, Grid, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import SegmentForm from './SegmentForm';

const Segments = () => {
  const [showForm, setShowForm] = useState(false);
  const { segments, addSegment, updateSegment, triggers } = useAppContext();
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

  const handleSubmitForm = (formData) => {
    if (selectedSegment) {
      updateSegment({ ...formData, id: selectedSegment.id });
      setShowEditForm(false);
      setSelectedSegment(null);
    } else {
      addSegment(formData);
      setShowForm(false);
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSegment}
          style={{ marginBottom: '20px' }}
        >
          Add New Segment
        </Button>
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
                  <IconButton onClick={() => handleEditSegment(segment)} color="primary">
                    <EditIcon />
                  </IconButton>
                </Box>
                <Typography>Description: {segment.description}</Typography>
                <Typography>Estimated Size: {segment.estimatedSize}</Typography>
                <Typography>Refresh Frequency: {segment.refreshFrequency}</Typography>
                <Typography style={{ color: getStatusColor(segment.status) }}>
                  Status: {segment.status}
                </Typography>
                <Typography>Brand: {segment.brand.join(', ')}</Typography>
                <Typography>Line of Business: {segment.lineOfBusiness.join(', ')}</Typography>
                <Typography>Account Type: {segment.accountType.join(', ')}</Typography>
                <Typography>Account Sub-type: {segment.accountSubType.join(', ')}</Typography>
                <Typography>Number of Subscribers: {segment.numberOfSubscribers}</Typography>
                <Typography>Geography: {segment.geography.join(', ')}</Typography>
                <Typography>MSF Amount: ${segment.msfAmount}</Typography>
                <Typography>Triggers: {segment.triggers.map(t => triggers.find(trigger => trigger.id === t)?.triggerName).join(', ')}</Typography>
                <Typography>Existing Segments: {segment.existingSegments.map(s => segments.find(seg => seg.id === s)?.segmentName).join(', ')}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Segments;
