import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Checkbox, ListItemText, FormControlLabel, Typography, Divider, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { generatePayload, logPayload } from '../../utils/payloadGenerator';
import PayloadViewer from '../PayloadViewer';

const CampaignForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      requestorName: '',
      deploymentDate: null,
      deploymentEndDate: null,
      campaignName: '',
      targetBases: '',
      segmentsPerBase: '',
      businessUnit: [],
      campaignType: '',
      campaignCode: '',
      subCampCode: '',
      medium: [],
      marcommPrime: '',
      brand: [],
      lineOfBusiness: [],
      contractStrategyWaiver: false,
      contractStrategyWaiverReason: '',
      contractExpiryDuration: '',
      language: [],
      prepaidPostpaid: [],
      byod: false,
      mtm: false,
      renewalWindow: {
        operator: '=',
        value: ''
      },
      contactStrategyRule: {
        operator: '=',
        value: ''
      }
    }
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  const [generatedPayload, setGeneratedPayload] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateDates(formData)) {
      const payload = generatePayload('campaign', formData);
      logPayload(payload);
      setGeneratedPayload(payload);
      onSubmit(formData);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Campaign Metadata</Typography>
            <Divider />
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
          <Grid item xs={12}>
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
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Campaign Deployment End Date"
              value={formData.deploymentEndDate}
              onChange={handleDateChange('deploymentEndDate')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!dateErrors.deploymentEndDate,
                  helperText: dateErrors.deploymentEndDate
                }
              }}
              minDate={formData.deploymentDate || null}
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
                multiple
                name="businessUnit"
                value={formData.businessUnit}
                onChange={handleChange}
                input={<OutlinedInput label="Business Unit" />}
                renderValue={(selected) => selected.join(', ')}
                required
              >
                {['FFH - Home Solutions', 'Mobility - TELUS', 'Koodo', 'EPP', 'PublicMobile', 'Others - Masterbrand, Health etc'].map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    <Checkbox checked={formData.businessUnit.indexOf(unit) > -1} />
                    <ListItemText primary={unit} />
                  </MenuItem>
                ))}
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
          <Grid item xs={12}>
            <Typography variant="h6">Inclusion Criteria</Typography>
            <Divider />
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
              <InputLabel>Contract Expiry Duration</InputLabel>
              <Select
                name="contractExpiryDuration"
                value={formData.contractExpiryDuration}
                onChange={handleChange}
              >
                <MenuItem value="1">1 month</MenuItem>
                <MenuItem value="3">3 months</MenuItem>
                <MenuItem value="6">6 months</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                multiple
                name="language"
                value={formData.language}
                onChange={handleChange}
                input={<OutlinedInput label="Language" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {['English', 'French'].map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    <Checkbox checked={formData.language.indexOf(lang) > -1} />
                    <ListItemText primary={lang} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Prepaid/Postpaid</InputLabel>
              <Select
                multiple
                name="prepaidPostpaid"
                value={formData.prepaidPostpaid}
                onChange={handleChange}
                input={<OutlinedInput label="Prepaid/Postpaid" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {['Prepaid', 'Postpaid'].map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={formData.prepaidPostpaid.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.byod}
                  onChange={(e) => handleChange({
                    target: {
                      name: 'byod',
                      value: e.target.checked
                    }
                  })}
                  name="byod"
                />
              }
              label="BYOD"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.mtm}
                  onChange={(e) => handleChange({
                    target: {
                      name: 'mtm',
                      value: e.target.checked
                    }
                  })}
                  name="mtm"
                />
              }
              label="MTM"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Exclusion Criteria</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Renewal Window Operator</InputLabel>
              <Select
                name="renewalWindow.operator"
                value={formData.renewalWindow.operator}
                onChange={handleChange}
              >
                <MenuItem value="=">=</MenuItem>
                <MenuItem value="<=">≤</MenuItem>
                <MenuItem value=">=">≥</MenuItem>
                <MenuItem value="between">Between</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Renewal Window Value (Days)"
              name="renewalWindow.value"
              type="number"
              value={formData.renewalWindow.value}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Contact Strategy Rule Operator</InputLabel>
              <Select
                name="contactStrategyRule.operator"
                value={formData.contactStrategyRule.operator}
                onChange={handleChange}
              >
                <MenuItem value="=">=</MenuItem>
                <MenuItem value="<=">≤</MenuItem>
                <MenuItem value=">=">≥</MenuItem>
                <MenuItem value="between">Between</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Strategy Rule Value (Days)"
              name="contactStrategyRule.value"
              type="number"
              value={formData.contactStrategyRule.value}
              onChange={handleChange}
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

export default CampaignForm;
