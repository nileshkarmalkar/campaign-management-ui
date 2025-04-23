import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Box } from '@mui/material';
import { generatePayload, logPayload } from '../../utils/payloadGenerator';
import PayloadViewer from '../PayloadViewer';
import { useAuth } from '../../context/AuthContext';
import DynamicSegmentForm from './DynamicSegmentForm';

const sampleData = [
  {
    accountId: "12345",
    msf: 75.99,
    tenure: 24,
    brand: "TELUS",
    lineOfBusiness: "Mobility",
    accountType: "Consumer",
    accountSubType: "Postpaid",
    numberOfSubscribers: 2,
    geography: "Ontario",
    isActive: true
  },
  {
    accountId: "12346",
    msf: 125.99,
    tenure: 12,
    brand: "Koodo",
    lineOfBusiness: "Home Solution",
    accountType: "Business",
    accountSubType: "Other",
    numberOfSubscribers: 1,
    geography: "British Columbia",
    isActive: false
  }
];

const SegmentForm = ({ onSubmit, onCancel, availableTriggers = [], availableSegments = [], currentSegmentId = null, initialData = null }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    segmentName: '',
    description: '',
    status: 'active',
    triggers: [],
    existingSegments: []
  });
  const [generatedPayload, setGeneratedPayload] = useState(null);
  const [dynamicFilters, setDynamicFilters] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const handleBasicInfoChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDynamicFilterSubmit = (filters, filtered) => {
    setDynamicFilters(filters);
    setFilteredData(filtered);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const segmentData = {
      ...formData,
      filters: dynamicFilters,
      filteredAccounts: filteredData?.map(d => d.accountId) || []
    };
    
    const payload = generatePayload('segment', segmentData, currentUser);
    logPayload(payload);
    setGeneratedPayload(payload);
    onSubmit(segmentData);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Edit Segment' : 'Create New Segment'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Segment Name"
              name="segmentName"
              value={formData.segmentName}
              onChange={handleBasicInfoChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleBasicInfoChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Triggers</InputLabel>
              <Select
                name="triggers"
                value={formData.triggers}
                onChange={handleBasicInfoChange}
                multiple
              >
                {availableTriggers.map((trigger) => (
                  <MenuItem key={trigger.id} value={trigger.id}>
                    {trigger.triggerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleBasicInfoChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, mb: 4 }}>
          <DynamicSegmentForm
            data={sampleData}
            onSubmit={handleDynamicFilterSubmit}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Create Segment'}
          </Button>
          <Button 
            onClick={onCancel} 
            variant="outlined" 
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </form>

      {generatedPayload && (
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Generated Payload
          </Typography>
          <PayloadViewer payload={generatedPayload} />
        </Box>
      )}
    </Box>
  );
};

export default SegmentForm;
