import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

const CustomDatePicker = ({ label, value, onChange, required = false, error = false, helperText = '', minDate = null }) => {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      slotProps={{
        textField: {
          fullWidth: true,
          required: required,
          error: error,
          helperText: helperText
        }
      }}
      minDate={minDate}
    />
  );
};

export default CustomDatePicker;
