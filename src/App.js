import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Campaigns from './components/campaigns/Campaigns';
import Segments from './components/segments/Segments';
import Offers from './components/offers/Offers';
import Communications from './components/communications/Communications';
import Triggers from './components/triggers/Triggers';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <AppProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/segments" element={<Segments />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/communications" element={<Communications />} />
          <Route path="/triggers" element={<Triggers />} />
            <Route path="/" element={<Navigate to="/campaigns" replace />} />
          </Routes>
        </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </AppProvider>
  );
}

export default App;
