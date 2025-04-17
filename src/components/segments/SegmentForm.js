import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SegmentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    segmentName: '',
    description: '',
    type: '',
    criteria: '',
    status: 'active',
    estimatedSize: '',
    source: '',
    refreshFrequency: 'daily'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
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
          <FormControl fullWidth required>
            <InputLabel>Segment Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItem value="demographic">Demographic</MenuItem>
              <MenuItem value="behavioral">Behavioral</MenuItem>
              <MenuItem value="geographic">Geographic</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Segment Criteria"
            name="criteria"
            value={formData.criteria}
            onChange={handleChange}
            required
            multiline
            rows={2}
            helperText="Enter the criteria/rules for segment membership"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Estimated Size"
            name="estimatedSize"
            type="number"
            value={formData.estimatedSize}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Data Source</InputLabel>
            <Select
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <MenuItem value="crm">CRM</MenuItem>
              <MenuItem value="analytics">Analytics</MenuItem>
              <MenuItem value="thirdParty">Third Party</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Refresh Frequency</InputLabel>
            <Select
              name="refreshFrequency"
              value={formData.refreshFrequency}
              onChange={handleChange}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
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
            Submit
          </Button>
          <Button onClick={onCancel} variant="outlined" style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SegmentForm;
