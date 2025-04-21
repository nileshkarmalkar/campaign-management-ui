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
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import SegmentOfferMappingForm from './SegmentOfferMappingForm';

const SegmentOfferMapping = () => {
  const { segmentOfferMappings = [], addSegmentOfferMapping, updateSegmentOfferMapping } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search Mappings"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add New Mapping
        </Button>
      </Box>
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
      <SegmentOfferMappingForm
        open={openForm}
        handleClose={handleCloseForm}
        addSegmentOfferMapping={addSegmentOfferMapping}
      />
    </div>
  );
};

export default SegmentOfferMapping;
