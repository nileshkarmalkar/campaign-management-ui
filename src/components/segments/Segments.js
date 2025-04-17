import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Typography, Button, Grid, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SegmentForm from './SegmentForm';

const Segments = () => {
  const [showForm, setShowForm] = useState(false);
  const { segments, addSegment } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('segmentName');

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
    addSegment(formData);
    setShowForm(false);
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
      {showForm ? (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <SegmentForm onSubmit={handleSubmitForm} onCancel={handleCancelForm} />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredSegments.map((segment) => (
            <Grid item xs={12} key={segment.id}>
              <Paper style={{ padding: '20px' }}>
                <Typography variant="h6">{segment.segmentName}</Typography>
                <Typography>Type: {segment.type}</Typography>
                <Typography>Description: {segment.description}</Typography>
                <Typography>Estimated Size: {segment.estimatedSize}</Typography>
                <Typography>Data Source: {segment.source}</Typography>
                <Typography>Refresh Frequency: {segment.refreshFrequency}</Typography>
                <Typography style={{ color: getStatusColor(segment.status) }}>
                  Status: {segment.status}
                </Typography>
                <Typography style={{ marginTop: '10px' }}>
                  Criteria: {segment.criteria}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Segments;
