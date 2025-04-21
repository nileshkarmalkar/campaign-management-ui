import React, { useState } from 'react';
import { 
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import DatePickerWrapper from '../campaigns/DatePickerWrapper';

const SegmentOfferMappingForm = ({ onSubmit, onCancel }) => {
  const { segments } = useAppContext();
  const [formData, setFormData] = useState({
    segmentId: '',
    segmentName: '',
    offerId: '',
    offerName: '',
    startDate: null,
    endDate: null
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSegmentChange = (event) => {
    const selectedSegment = segments.find(s => s.id === event.target.value);
    if (selectedSegment) {
      setFormData({
        ...formData,
        segmentId: selectedSegment.id.toString(),
        segmentName: selectedSegment.segmentName
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now(),
      status: 'Created',
      endDate: null
    });
    setFormData({
      segmentId: '',
      segmentName: '',
      offerId: '',
      offerName: '',
      startDate: null
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Create New Segment-Offer Mapping
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Select Segment</InputLabel>
            <Select
              value={formData.segmentId}
              onChange={handleSegmentChange}
              label="Select Segment"
            >
              {segments.map((segment) => (
                <MenuItem key={segment.id} value={segment.id}>
                  {segment.segmentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Segment Name"
            name="segmentName"
            value={formData.segmentName}
            InputProps={{
              readOnly: true,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Offer ID"
            name="offerId"
            value={formData.offerId}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Offer Name"
            name="offerName"
            value={formData.offerName}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePickerWrapper
            label="Start Date"
            value={formData.startDate}
            onChange={(newValue) => {
              setFormData({ ...formData, startDate: newValue });
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePickerWrapper
            label="End Date"
            value={formData.endDate}
            onChange={(newValue) => {
              setFormData({ ...formData, endDate: newValue });
            }}
            minDate={formData.startDate}
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={onCancel} style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create Mapping
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SegmentOfferMappingForm;
