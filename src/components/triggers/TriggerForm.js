import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Divider, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { generatePayload, logPayload } from '../../utils/payloadGenerator';
import PayloadViewer from '../PayloadViewer';
import { useAuth } from '../../context/AuthContext';

const TriggerForm = ({ onSubmit, onCancel, initialData = null }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(() => {
    const defaultData = {
      triggerName: '',
      description: '',
      type: 'event',
      status: 'active',
      conditions: [{
        field: 'triggerName',
        operator: '=',
        value: ''
      }]
    };

    if (initialData) {
      return {
        ...defaultData,
        ...initialData,
        conditions: initialData.conditions && initialData.conditions.length > 0
          ? initialData.conditions
          : defaultData.conditions
      };
    }

    return defaultData;
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [generatedPayload, setGeneratedPayload] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = generatePayload('trigger', formData, currentUser);
    logPayload(payload);
    setGeneratedPayload(payload);
    onSubmit(formData);
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Edit Trigger' : 'Create New Trigger'}
      </Typography>
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
              value={formData.type || ''}
              onChange={handleChange}
            >
              <MenuItem value="event">event</MenuItem>
              <MenuItem value="schedule">schedule</MenuItem>
              <MenuItem value="condition">condition</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status || 'active'}
              onChange={handleChange}
            >
              <MenuItem value="active">active</MenuItem>
              <MenuItem value="inactive">inactive</MenuItem>
              <MenuItem value="draft">draft</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Trigger Conditions</Typography>
          <Divider style={{ marginBottom: '20px' }} />
        </Grid>
          {formData.conditions && formData.conditions.map((condition, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Field</InputLabel>
                  <Select
                    name={`conditions.${index}.field`}
                    value={condition.field || ''}
                    onChange={(e) => {
                      const newConditions = [...formData.conditions];
                      newConditions[index].field = e.target.value;
                      setFormData({ ...formData, conditions: newConditions });
                    }}
                  >
                    <MenuItem value="deviceAge">deviceAge</MenuItem>
                    <MenuItem value="dataUsage">dataUsage</MenuItem>
                    <MenuItem value="triggerName">triggerName</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    name={`conditions.${index}.operator`}
                    value={condition.operator || '='}
                    onChange={(e) => {
                      const newConditions = [...formData.conditions];
                      newConditions[index].operator = e.target.value;
                      setFormData({ ...formData, conditions: newConditions });
                    }}
                  >
                    <MenuItem value="=">=</MenuItem>
                    <MenuItem value=">">{">"}</MenuItem>
                    <MenuItem value="<">{"<"}</MenuItem>
                    <MenuItem value=">=">{">="}</MenuItem>
                    <MenuItem value="<=">{"<="}</MenuItem>
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

export default TriggerForm;
