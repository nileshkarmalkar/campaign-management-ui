import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Typography, Button, Grid, Paper, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box, IconButton, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DynamicSegmentForm from './DynamicSegmentForm';

const Segments = () => {
  const [showForm, setShowForm] = useState(false);
  const { segments, addSegment, updateSegment, availableTables, handleTableSelect, loadSampleSegments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('segmentName');
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeSegments = async () => {
      setIsLoading(true);
      try {
        if (availableTables.length === 0) {
          await loadSampleSegments();
        } else {
          await handleTableSelect(availableTables[0]);
        }
      } catch (error) {
        console.error('Failed to initialize segments:', error);
        setError('Failed to load segments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSegments();
  }, [availableTables, handleTableSelect, loadSampleSegments]);

  const filteredSegments = useMemo(() => {
    if (!segments) return [];
    return segments.filter(segment => {
      if (!segment) return false;
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
    setSelectedSegment(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedSegment(null);
  };

  const handleSubmitForm = useCallback((filters, filteredData, name, description) => {
    const segmentData = {
      id: selectedSegment ? selectedSegment.id : `segment-${Date.now()}`,
      segmentName: name,
      description: description,
      status: 'active', // You might want to add a status field to the form
      filters: filters,
      filteredAccounts: filteredData.length,
    };

    if (selectedSegment) {
      updateSegment(segmentData);
    } else {
      addSegment(segmentData);
    }
    setShowForm(false);
    setSelectedSegment(null);
  }, [selectedSegment, updateSegment, addSegment]);

  const handleEditSegment = (segment) => {
    setSelectedSegment(segment);
    setShowForm(true);
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
            <MenuItem value="description">Description</MenuItem>
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
            {isLoading ? 'Loading...' : 'Create Segment'}
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      )}
      {showForm && (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          {availableTables.length > 0 ? (
            <DynamicSegmentForm 
              onSubmit={handleSubmitForm} 
              onCancel={handleCancelForm}
              availableTables={availableTables}
              initialFilters={selectedSegment?.filters}
              initialFilteredData={selectedSegment?.filteredAccounts}
              initialName={selectedSegment?.segmentName}
              initialDescription={selectedSegment?.description}
            />
          ) : (
            <Typography>No tables available. Please check your BigQuery configuration.</Typography>
          )}
        </Paper>
      )}
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : !showForm ? (
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
                <Typography>Description: {segment.description || 'No description available'}</Typography>
                <Typography style={{ color: getStatusColor(segment.status) }}>
                  Status: {segment.status || 'Unknown'}
                </Typography>
                {segment.filters && segment.filters.root && segment.filters.root.conditions && segment.filters.root.conditions.length > 0 && (
                  <Paper variant="outlined" sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Filter Conditions
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Match {segment.filters.root.operator === 'AND' ? 'ALL' : 'ANY'} of the following conditions:
                    </Typography>
                    {segment.filters.root.conditions.map((condition, index) => (
                      <Typography key={index} sx={{ 
                        ml: 2, 
                        fontSize: '0.9rem',
                        py: 0.5,
                        borderLeft: '2px solid',
                        borderColor: 'primary.light',
                        pl: 2,
                        mb: 1
                      }}>
                        • {condition.field.replace(/([A-Z])/g, ' $1').toLowerCase()} {
                          (() => {
                            switch (condition.operator) {
                              case '=': return 'is equal to';
                              case '!=': return 'is not equal to';
                              case '>': return 'is greater than';
                              case '>=': return 'is greater than or equal to';
                              case '<': return 'is less than';
                              case '<=': return 'is less than or equal to';
                              case 'between': return 'is between';
                              case 'contains': return 'contains';
                              case 'not_contains': return 'does not contain';
                              case 'in': return 'is any of';
                              case 'not_in': return 'is not any of';
                              default: return condition.operator;
                            }
                          })()
                        } {
                          (() => {
                            if (Array.isArray(condition.value)) {
                              if (condition.operator === 'between') {
                                return `${condition.value[0]} and ${condition.value[1]}`;
                              }
                              return condition.value.join(', ');
                            }
                            if (typeof condition.value === 'boolean') {
                              return condition.value ? 'true' : 'false';
                            }
                            if (condition.type === 'date') {
                              return new Date(condition.value).toLocaleDateString();
                            }
                            return condition.value;
                          })()
                        }
                      </Typography>
                    ))}
                    <Box sx={{ 
                      mt: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: 'success.light',
                      color: 'success.contrastText',
                      py: 1,
                      px: 2,
                      borderRadius: 1
                    }}>
                      <Typography variant="body2">
                        Matching Accounts: {segment.filteredAccounts?.length || 0}
                      </Typography>
                    </Box>
                  </Paper>
                )}
                {segment.triggers && Array.isArray(segment.triggers) && segment.triggers.length > 0 && (
                  <Typography>
                    Triggers: {segment.triggers.join(', ')}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </div>
  );
};

export default Segments;
