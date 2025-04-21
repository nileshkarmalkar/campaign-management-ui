import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Divider, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { generatePayload, logPayload } from '../../utils/payloadGenerator';

const TriggerForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      triggerName: '',
      description: '',
      type: '',
      status: 'active',
      conditions: [{
        field: 'triggerName',
        operator: '=',
        value: ''
      }]
    }
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = generatePayload('trigger', formData);
    logPayload(payload);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Trigger Details</Typography>
          <Divider style={{ marginBottom: '20px' }} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Trigger Name"
            name="triggerName"
            value={formData.triggerName}
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
            <InputLabel>Trigger Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItem value="event">Event Based</MenuItem>
              <MenuItem value="schedule">Schedule Based</MenuItem>
              <MenuItem value="condition">Condition Based</MenuItem>
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
          <Typography variant="h6">Trigger Conditions</Typography>
          <Divider style={{ marginBottom: '20px' }} />
        </Grid>
          {formData.conditions.map((condition, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Field</InputLabel>
                  <Select
                    name={`conditions.${index}.field`}
                    value={condition.field}
                    onChange={(e) => {
                      const newConditions = [...formData.conditions];
                      newConditions[index].field = e.target.value;
                      setFormData({ ...formData, conditions: newConditions });
                    }}
                  >
                    <MenuItem value="triggerName">Trigger Name</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    name={`conditions.${index}.operator`}
                    value={condition.operator}
                    onChange={(e) => {
                      const newConditions = [...formData.conditions];
                      newConditions[index].operator = e.target.value;
                      setFormData({ ...formData, conditions: newConditions });
                    }}
                  >
                    <MenuItem value="=">=</MenuItem>
                    <MenuItem value="contains">Contains</MenuItem>
                    <MenuItem value="like">Like</MenuItem>
                    <MenuItem value="not in">Not In</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Value"
                  name={`conditions.${index}.value`}
                  value={condition.value}
                  onChange={(e) => {
                    const newConditions = [...formData.conditions];
                    newConditions[index].value = e.target.value;
                    setFormData({ ...formData, conditions: newConditions });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={1} container alignItems="center">
                {index === formData.conditions.length - 1 ? (
                  <IconButton
                    onClick={() => {
                      setFormData({
                        ...formData,
                        conditions: [
                          ...formData.conditions,
                          { field: 'triggerName', operator: '=', value: '' }
                        ]
                      });
                    }}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      const newConditions = formData.conditions.filter((_, i) => i !== index);
                      setFormData({ ...formData, conditions: newConditions });
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Grid>
            </React.Fragment>
          ))}
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

export default TriggerForm;
