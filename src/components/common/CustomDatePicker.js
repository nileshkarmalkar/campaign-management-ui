import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

const CustomDatePicker = ({ label, value, onChange, required = false, error = false, helperText = '', minDate = null }) => {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      minDate={minDate}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};

export default CustomDatePicker;
