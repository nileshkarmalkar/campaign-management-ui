import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/segments" replace />} />
                  <Route path="segments" element={<Segments />} />
                  <Route path="campaigns" element={<Campaigns />} />
                  <Route path="offers" element={<Offers />} />
                  <Route path="communications" element={<Communications />} />
                  <Route path="triggers" element={<Triggers />} />
                  <Route path="segment-offer-mapping" element={<SegmentOfferMapping />} />
                  <Route path="workflow" element={<CampaignWorkflow />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
