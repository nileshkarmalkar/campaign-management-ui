import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CampaignForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      requestorName: '',
      deploymentDate: null,
      deploymentEndDate: null,
      earliestListDueDate: null,
      campaignName: '',
      targetBases: '',
      segmentsPerBase: '',
      businessUnit: '',
      campaignType: '',
      campaignCode: '',
      subCampCode: '',
      medium: [],
      marcommPrime: '',
      listSizeRequested: '',
    }
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [dateErrors, setDateErrors] = useState({
    deploymentEndDate: '',
  });

  const validateDates = (newFormData) => {
    const errors = {
      deploymentEndDate: '',
    };

    if (newFormData.deploymentEndDate && newFormData.deploymentDate) {
      if (newFormData.deploymentEndDate < newFormData.deploymentDate) {
        errors.deploymentEndDate = 'End date must be after or equal to deployment date';
      }
    }

    setDateErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleDateChange = (name) => (date) => {
    const newFormData = { ...formData, [name]: date };
    setFormData(newFormData);
    validateDates(newFormData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateDates(formData)) {
      onSubmit(formData);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name of Requestor"
              name="requestorName"
              value={formData.requestorName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Campaign Deployment Date"
              value={formData.deploymentDate}
              onChange={handleDateChange('deploymentDate')}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Campaign Deployment End Date"
              value={formData.deploymentEndDate}
              onChange={handleDateChange('deploymentEndDate')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  error={!!dateErrors.deploymentEndDate}
                  helperText={dateErrors.deploymentEndDate}
                />
              )}
              minDate={formData.deploymentDate || null}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Earliest List Due Date"
              value={formData.earliestListDueDate}
              onChange={handleDateChange('earliestListDueDate')}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Campaign Name"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>How many Bases are you Targeting</InputLabel>
              <Select
                name="targetBases"
                value={formData.targetBases}
                onChange={handleChange}
                required
              >
                {[...Array(10)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Segments per Base</InputLabel>
              <Select
                name="segmentsPerBase"
                value={formData.segmentsPerBase}
                onChange={handleChange}
                required
              >
                <MenuItem value="1-6">1 to 6</MenuItem>
                <MenuItem value="7-20">7 to 20</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Business Unit</InputLabel>
              <Select
                name="businessUnit"
                value={formData.businessUnit}
                onChange={handleChange}
                required
              >
                <MenuItem value="FFH">FFH - Home Solutions</MenuItem>
                <MenuItem value="Mobility">Mobility - TELUS</MenuItem>
                <MenuItem value="Koodo">Koodo</MenuItem>
                <MenuItem value="EPP">EPP</MenuItem>
                <MenuItem value="PublicMobile">Public Mobile</MenuItem>
                <MenuItem value="Others">Others - Masterbrand, Health etc</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Campaign Type</InputLabel>
              <Select
                name="campaignType"
                value={formData.campaignType}
                onChange={handleChange}
                required
              >
                <MenuItem value="M&H">M&H</MenuItem>
                <MenuItem value="Cross-Sell">Cross-Sell</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="Loyalty">Loyalty</MenuItem>
                <MenuItem value="Upsell">Upsell</MenuItem>
                <MenuItem value="Retention">Retention</MenuItem>
                <MenuItem value="Acquisition">Acquisition</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Campaign Code"
              name="campaignCode"
              value={formData.campaignCode}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sub Camp Code (Optional)"
              name="subCampCode"
              value={formData.subCampCode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Medium/Channels</InputLabel>
              <Select
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                required
                multiple
              >
                <MenuItem value="EM">EM</MenuItem>
                <MenuItem value="DM">DM</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
                <MenuItem value="OB">OB</MenuItem>
                <MenuItem value="SocialMedia">Social Media / Digital</MenuItem>
                <MenuItem value="DataUpload">Data upload</MenuItem>
                <MenuItem value="AdHoc">Ad Hoc/Sizing</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marcomm Prime"
              name="marcommPrime"
              value={formData.marcommPrime}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="List Size Requested"
              name="listSizeRequested"
              type="number"
              value={formData.listSizeRequested}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {initialData ? 'Update' : 'Submit'}
            </Button>
            <Button onClick={onCancel} variant="outlined" style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
  );
};

export default CampaignForm;
