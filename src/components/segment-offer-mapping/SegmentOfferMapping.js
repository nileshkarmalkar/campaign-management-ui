import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';

const SegmentOfferMapping = () => {
  const { segmentOfferMappings = [], addSegmentOfferMapping, updateSegmentOfferMapping } = useAppContext();
  console.log('segmentOfferMappings:', segmentOfferMappings);
  const [formData, setFormData] = useState({
    segmentId: '',
    segmentName: '',
    offerId: '',
    offerName: '',
    startDate: null
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, startDate: date });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMapping = {
      ...formData,
      id: Date.now(),
      status: 'Created',
      endDate: null
    };
    addSegmentOfferMapping(newMapping);
    setFormData({
      segmentId: '',
      segmentName: '',
      offerId: '',
      offerName: '',
      startDate: null
    });
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
    return (segmentOfferMappings || []).filter(mapping => 
      mapping.segmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.segmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.offerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.offerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [segmentOfferMappings, searchTerm]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Segment-Offer Mapping
      </Typography>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Segment ID"
                name="segmentId"
                value={formData.segmentId}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Segment Name"
                name="segmentName"
                value={formData.segmentName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Offer ID"
                name="offerId"
                value={formData.offerId}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Offer Name"
                name="offerName"
                value={formData.offerName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Create Mapping
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <TextField
        fullWidth
        label="Search Mappings"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
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
                <TableCell>{format(mapping.startDate, 'MM/dd/yyyy')}</TableCell>
                <TableCell>{mapping.endDate ? format(mapping.endDate, 'MM/dd/yyyy') : '-'}</TableCell>
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
    </div>
  );
};

export default SegmentOfferMapping;
