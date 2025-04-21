import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  InputAdornment,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import SegmentOfferMappingForm from './SegmentOfferMappingForm';

const SegmentOfferMapping = () => {
  const { segmentOfferMappings = [], addSegmentOfferMapping, updateSegmentOfferMapping, segments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('segmentName');
  const [showForm, setShowForm] = useState(false);

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
    return (segmentOfferMappings || []).filter(mapping => {
      const searchValue = mapping[searchField]?.toString().toLowerCase() || '';
      return searchValue.includes(searchTerm.toLowerCase());
    });
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Segment ID</TableCell>
                <TableCell>Segment Name</TableCell>
                <TableCell>Offer ID</TableCell>
                <TableCell>Offer Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>{mapping.segmentId}</TableCell>
                  <TableCell>{mapping.segmentName}</TableCell>
                  <TableCell>{mapping.offerId}</TableCell>
                  <TableCell>{mapping.offerName}</TableCell>
                  <TableCell>{mapping.status}</TableCell>
                  <TableCell>{mapping.startDate ? format(new Date(mapping.startDate), 'MM/dd/yyyy') : '-'}</TableCell>
                  <TableCell>{mapping.endDate ? format(new Date(mapping.endDate), 'MM/dd/yyyy') : '-'}</TableCell>
                  <TableCell>
                    {mapping.status === 'Created' && (
                      <Button onClick={() => handleStatusChange(mapping.id, 'Live')}>
                        Set Live
                      </Button>
                    )}
                    {mapping.status === 'Live' && (
                      <Button onClick={() => handleStatusChange(mapping.id, 'Sunset')}>
                        Sunset
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default SegmentOfferMapping;
