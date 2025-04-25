import React, { useState } from 'react';
<<<<<<< Updated upstream
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, InputAdornment, Typography, Box } from '@mui/material';
import { generatePayload, logPayload } from '../../utils/payloadGenerator';
import PayloadViewer from '../PayloadViewer';
import { useAuth } from '../../context/AuthContext';

const SegmentForm = ({ onSubmit, onCancel, availableTriggers = [], availableSegments = [], currentSegmentId = null, initialData = null }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(
    initialData || {
      segmentName: '',
      description: '',
      status: 'active',
      source: '',
      brand: [],
      lineOfBusiness: [],
      accountType: [],
      accountSubType: [],
      numberOfSubscribers: '',
      geography: [],
      msfAmount: {
        operator: '>=',
        value1: '',
        value2: ''
      },
      triggers: [],
      existingSegments: []
    }
  );
=======
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
>>>>>>> Stashed changes

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('msfAmount.')) {
      const [, field] = name.split('.');
      setFormData({
        ...formData,
        msfAmount: { ...formData.msfAmount, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const [generatedPayload, setGeneratedPayload] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
<<<<<<< Updated upstream
    const payload = generatePayload('segment', formData, currentUser);
    logPayload(payload);
    setGeneratedPayload(payload);
    onSubmit(formData);
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

>>>>>>> Stashed changes
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
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select
              multiple
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              input={<OutlinedInput label="Brand" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {['TELUS', 'Koodo'].map((brand) => (
                <MenuItem key={brand} value={brand}>
                  <Checkbox checked={formData.brand.indexOf(brand) > -1} />
                  <ListItemText primary={brand} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Line of Business</InputLabel>
            <Select
              multiple
              name="lineOfBusiness"
              value={formData.lineOfBusiness}
              onChange={handleChange}
              input={<OutlinedInput label="Line of Business" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {['Mobility', 'Home Solution', 'Subscription on Demand'].map((lob) => (
                <MenuItem key={lob} value={lob}>
                  <Checkbox checked={formData.lineOfBusiness.indexOf(lob) > -1} />
                  <ListItemText primary={lob} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Account Type</InputLabel>
            <Select
              multiple
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              input={<OutlinedInput label="Account Type" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {['Business', 'Corporate', 'Consumer'].map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox checked={formData.accountType.indexOf(type) > -1} />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Account Sub-type</InputLabel>
            <Select
              multiple
              name="accountSubType"
              value={formData.accountSubType}
              onChange={handleChange}
              input={<OutlinedInput label="Account Sub-type" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {['Residential', 'Other'].map((subType) => (
                <MenuItem key={subType} value={subType}>
                  <Checkbox checked={formData.accountSubType.indexOf(subType) > -1} />
                  <ListItemText primary={subType} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Number of subscribers</InputLabel>
            <Select
              name="numberOfSubscribers"
              value={formData.numberOfSubscribers}
              onChange={handleChange}
            >
              {['1', '2', '3', '4', '5', '5+'].map((num) => (
                <MenuItem key={num} value={num}>{num}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Geography</InputLabel>
            <Select
              multiple
              name="geography"
              value={formData.geography}
              onChange={handleChange}
              input={<OutlinedInput label="Geography" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'].map((province) => (
                <MenuItem key={province} value={province}>
                  <Checkbox checked={formData.geography.indexOf(province) > -1} />
                  <ListItemText primary={province} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>MSF Amount</InputLabel>
                <Select
                  name="msfAmount.operator"
                  value={formData.msfAmount.operator}
                  onChange={handleChange}
                  input={<OutlinedInput label="MSF Amount" />}
                >
                  <MenuItem value=">=">≥</MenuItem>
                  <MenuItem value="<=">≤</MenuItem>
                  <MenuItem value="between">Between</MenuItem>
                  <MenuItem value="=">Equal to</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={formData.msfAmount.operator === 'between' ? 4 : 8}>
              <TextField
                fullWidth
                label={formData.msfAmount.operator === 'between' ? "From" : "Amount"}
                name="msfAmount.value1"
                type="number"
                value={formData.msfAmount.value1}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            {formData.msfAmount.operator === 'between' && (
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="To"
                  name="msfAmount.value2"
                  type="number"
                  value={formData.msfAmount.value2}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
<<<<<<< Updated upstream
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Triggers</InputLabel>
            <Select
              multiple
              name="triggers"
              value={formData.triggers}
              onChange={handleChange}
              input={<OutlinedInput label="Triggers" />}
              renderValue={(selected) => selected.map(id => availableTriggers.find(t => t.id === id)?.triggerName).join(', ')}
            >
              {availableTriggers.map((trigger) => (
                <MenuItem key={trigger.id} value={trigger.id}>
                  <Checkbox checked={formData.triggers.indexOf(trigger.id) > -1} />
                  <ListItemText primary={`${trigger.triggerName} (${trigger.type})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Existing Segments</InputLabel>
            <Select
              multiple
              name="existingSegments"
              value={formData.existingSegments}
              onChange={handleChange}
              input={<OutlinedInput label="Existing Segments" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableSegments
                .filter(segment => segment.id !== currentSegmentId)
                .map((segment) => (
                  <MenuItem key={segment.id} value={segment.id}>
                    <Checkbox checked={formData.existingSegments.indexOf(segment.id) > -1} />
                    <ListItemText primary={segment.segmentName} />
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
              onChange={handleChange}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Submit'}
          </Button>
          <Button onClick={onCancel} variant="outlined" style={{ marginLeft: '10px' }}>
=======

        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filter Configuration
          </Typography>
          <DynamicSegmentForm
            onSubmit={handleDynamicFilterSubmit}
            initialFilters={initialData?.filters}
            initialFilteredData={initialData?.filteredAccounts}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            {initialData ? 'Update' : 'Create Segment'}
          </Button>
          <Button 
            onClick={onCancel} 
            variant="outlined" 
            sx={{ ml: 2 }}
            disabled={isLoading}
          >
>>>>>>> Stashed changes
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
