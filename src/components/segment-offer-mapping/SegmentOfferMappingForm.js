import React, { useState } from 'react';
import { 
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAppContext } from '../../context/AppContext';
import { generatePayload, logPayload } from '../../utils/payloadGenerator';
import PayloadViewer from '../PayloadViewer';

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

  const [generatedPayload, setGeneratedPayload] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const submitData = {
      ...formData,
      id: Date.now(),
      status: 'Created',
      endDate: null
    };
    const payload = generatePayload('offer', submitData);
    logPayload(payload);
    setGeneratedPayload(payload);
    onSubmit(submitData);
    setFormData({
      segmentId: '',
      segmentName: '',
      offerId: '',
      offerName: '',
      startDate: null
    });
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Create New Segment-Offer Mapping
      </Typography>
      <form onSubmit={handleSubmit}>
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
          <DatePicker
            label="Start Date"
            value={formData.startDate}
            onChange={(newValue) => {
              setFormData({ ...formData, startDate: newValue });
            }}
            renderInput={(params) => <TextField {...params} fullWidth required />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="End Date"
            value={formData.endDate}
            onChange={(newValue) => {
              setFormData({ ...formData, endDate: newValue });
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
            minDate={formData.startDate || null}
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
      {generatedPayload && (
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Generated Payload
          </Typography>
          <PayloadViewer payload={generatedPayload} />
        </Box>
      )}
    </>
  );
};

export default SegmentOfferMappingForm;
