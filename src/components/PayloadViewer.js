import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const PayloadViewer = ({ payload }) => {
  if (!payload) return null;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Generated Payload
      </Typography>
      <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {JSON.stringify(payload, null, 2)}
      </Box>
    </Paper>
  );
};

export default PayloadViewer;
