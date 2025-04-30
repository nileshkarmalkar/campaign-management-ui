import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Campaigns from './components/campaigns/Campaigns';
import Segments from './components/segments/Segments';
import Offers from './components/offers/Offers';
import Communications from './components/communications/Communications';
import Triggers from './components/triggers/Triggers';
import SegmentOfferMapping from './components/segment-offer-mapping/SegmentOfferMapping';
import CampaignWorkflow from './components/workflow/CampaignWorkflow';
import Login from './components/auth/Login';
import ProtectedRoutes from './components/auth/ProtectedRoutes';
import './App.css';

const ThemedApp = () => {
  const { theme } = useTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoutes>
                    <Layout />
                  </ProtectedRoutes>
                }
              >
                <Route index element={<Navigate to="/segments" replace />} />
                <Route path="segments" element={<Segments />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="offers" element={<Offers />} />
                <Route path="communications" element={<Communications />} />
                <Route path="triggers" element={<Triggers />} />
                <Route path="segment-offer-mapping" element={<SegmentOfferMapping />} />
                <Route path="workflow" element={<CampaignWorkflow />} />
              </Route>
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </MuiThemeProvider>
  );
};

function App() {
  console.log('App component rendering');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} dateLibInstance={dayjs}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
