import React, { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material';

const SegmentOfferMappingForm = ({ open, handleClose, addSegmentOfferMapping }) => {
  const [formData, setFormData] = useState({
    segmentId: '',
    segmentName: '',
    offerId: '',
    offerName: '',
    startDate: null
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
    handleClose();
    setFormData({
      segmentId: '',
      segmentName: '',
      offerId: '',
      offerName: '',
      startDate: null
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Segment-Offer Mapping</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Segment ID"
                name="segmentId"
                value={formData.segmentId}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Segment Name"
                name="segmentName"
                value={formData.segmentName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Offer ID"
                name="offerId"
                value={formData.offerId}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Offer Name"
                name="offerName"
                value={formData.offerName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Mapping
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SegmentOfferMappingForm;
