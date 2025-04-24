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
    setSelectedSegment(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedSegment(null);
  };

  const handleSubmitForm = (formData) => {
    if (selectedSegment) {
      updateSegment({ ...formData, id: selectedSegment.id });
    } else {
      const newSegment = {
        ...formData,
        id: `segment-${Date.now()}`
      };
      addSegment(newSegment);
    }
    setShowForm(false);
    setSelectedSegment(null);
  };

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
          >
            Create Segment
          </Button>
        </Box>
      )}
      {showForm && (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <SegmentForm 
            onSubmit={handleSubmitForm} 
            onCancel={handleCancelForm}
            availableTriggers={triggers}
            availableSegments={segments}
            currentSegmentId={selectedSegment?.id}
            initialData={selectedSegment}
          />
        </Paper>
      )}
      {!showForm && (
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
                <Typography style={{ color: getStatusColor(segment.status) }}>
                  Status: {segment.status}
                </Typography>
                {segment.filters && segment.filters.root.conditions.length > 0 && (
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
