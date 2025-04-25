import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Box, CircularProgress } from '@mui/material';
import { generatePayload, logPayload } from '../../utils/payloadGenerator';
import PayloadViewer from '../PayloadViewer';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import DynamicSegmentForm from './DynamicSegmentForm/index.tsx';

const SegmentForm = ({ onSubmit, onCancel, availableTriggers = [], availableSegments = [], currentSegmentId = null, initialData = null }) => {
  const { currentUser } = useAuth();
  const { addSegment, updateSegment } = useAppContext();
  const [formData, setFormData] = useState({
    segmentName: initialData?.segmentName || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
    triggers: initialData?.triggers || [],
    existingSegments: initialData?.existingSegments || []
  });
  const [generatedPayload, setGeneratedPayload] = useState(null);
  const [dynamicFilters, setDynamicFilters] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDynamicFilterSubmit = (filters, data) => {
    setDynamicFilters(filters);
    setFilteredData(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const segmentData = {
      ...formData,
      filters: dynamicFilters,
      filteredAccounts: filteredData?.map(d => d.accountId) || []
    };
    
    const payload = generatePayload('segment', segmentData, currentUser);
    logPayload(payload);
    setGeneratedPayload(payload);

    try {
      if (initialData) {
        await updateSegment({ ...segmentData, id: currentSegmentId });
      } else {
        await addSegment(segmentData);
      }
      onSubmit(segmentData);
    } catch (err) {
      console.error('Error saving segment:', err);
      setError('Failed to save segment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Edit Segment' : 'Create New Segment'}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Segment Name"
              name="segmentName"
              value={formData.segmentName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Filter Configuration
            </Typography>
            <DynamicSegmentForm
              onSubmit={handleDynamicFilterSubmit}
              initialFilters={initialData?.filters}
              initialFilteredData={initialData?.filteredAccounts}
            />
          </Box>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {initialData ? 'Update' : 'Create Segment'}
            </Button>
            <Button 
              onClick={onCancel} 
              variant="outlined" 
              sx={{ ml: 2 }}
              disabled={isLoading}
            >
              Cancel
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

export default SegmentForm;
