import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  InputAdornment,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import SegmentOfferMappingForm from './SegmentOfferMappingForm';

const SegmentOfferMapping = () => {
  const { segmentOfferMappings = [], addSegmentOfferMapping, updateSegmentOfferMapping, segments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('segmentName');
  const [showForm, setShowForm] = useState(false);

  console.log('segmentOfferMappings:', segmentOfferMappings);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchTerm('');
  };

  const handleAddMapping = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleStatusChange = (id, newStatus) => {
    const mappingToUpdate = segmentOfferMappings.find(mapping => mapping.id === id);
    if (mappingToUpdate) {
      const updatedMapping = {
        ...mappingToUpdate,
        status: newStatus,
        ...(newStatus === 'Sunset' && { endDate: new Date() })
      };
      updateSegmentOfferMapping(updatedMapping);
    }
  };

  const filteredMappings = useMemo(() => {
    const filtered = (segmentOfferMappings || []).filter(mapping => {
      const searchValue = mapping[searchField]?.toString().toLowerCase() || '';
      return searchValue.includes(searchTerm.toLowerCase());
    });
    console.log('filteredMappings:', filtered);
    return filtered;
  }, [segmentOfferMappings, searchTerm, searchField]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Segment-Offer Mapping
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
            <MenuItem value="offerName">Offer Name</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Search Mappings"
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
          onClick={handleAddMapping}
          style={{ marginBottom: '20px' }}
        >
          Add New Mapping
        </Button>
      )}
      {showForm ? (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <SegmentOfferMappingForm
            onSubmit={(formData) => {
              addSegmentOfferMapping(formData);
              setShowForm(false);
            }}
            onCancel={handleCloseForm}
            segments={segments}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredMappings.map((mapping) => (
            <Grid item xs={12} key={mapping.id}>
              <Paper style={{ padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{mapping.segmentName} - {mapping.offerName}</Typography>
                  <IconButton onClick={() => handleStatusChange(mapping.id, mapping.status === 'Created' ? 'Live' : 'Sunset')} color="primary">
                    <EditIcon />
                  </IconButton>
                </Box>
                <Typography>Segment ID: {mapping.segmentId}</Typography>
                <Typography>Offer ID: {mapping.offerId}</Typography>
                <Typography>Status: {mapping.status}</Typography>
                <Typography>Start Date: {mapping.startDate ? format(new Date(mapping.startDate), 'MM/dd/yyyy') : '-'}</Typography>
                <Typography>End Date: {mapping.endDate ? format(new Date(mapping.endDate), 'MM/dd/yyyy') : '-'}</Typography>
                {mapping.status === 'Created' && (
                  <Button onClick={() => handleStatusChange(mapping.id, 'Live')} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    Set Live
                  </Button>
                )}
                {mapping.status === 'Live' && (
                  <Button onClick={() => handleStatusChange(mapping.id, 'Sunset')} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
                    Sunset
                  </Button>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default SegmentOfferMapping;
