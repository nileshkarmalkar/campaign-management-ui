import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Button, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { AppProvider } from './context/AppContext';
import { loadSampleData } from './utils/sampleData';
import Layout from './components/layout/Layout';
import Campaigns from './components/campaigns/Campaigns';
import Segments from './components/segments/Segments';
import Communications from './components/communications/Communications';
import Triggers from './components/triggers/Triggers';
import SegmentOfferMapping from './components/segment-offer-mapping/SegmentOfferMapping';
import CampaignWorkflow from './components/workflow/CampaignWorkflow';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B286D', // TELUS purple
      light: '#7C5AA6',
      dark: '#2A1347',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#2B8000', // TELUS green
      light: '#66B100',
      dark: '#1F5C00',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#FFFFFF',
      paper: '#F7F7F8'
    },
    text: {
      primary: '#2A2C2E',
      secondary: '#4B286D'
    }
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 300,
      color: '#4B286D'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      color: '#4B286D'
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      color: '#2A2C2E'
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      color: '#2A2C2E'
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
      color: '#2A2C2E'
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#2A2C2E'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 20px'
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px'
        }
      }
    }
  }
});

function App() {
  const handleLoadSampleData = () => {
    loadSampleData();
    window.location.reload();
  };

  return (
    <AppProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} dateLibInstance={dayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HashRouter>
            <Layout>
              <Box sx={{ position: 'fixed', top: 80, right: 20, zIndex: 9999 }}>
                <Button onClick={handleLoadSampleData} variant="contained" color="primary">
                  Load Sample Data
                </Button>
              </Box>
              <Routes>
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/segments" element={<Segments />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/triggers" element={<Triggers />} />
          <Route path="/segment-offer-mapping" element={<SegmentOfferMapping />} />
          <Route path="/workflow" element={<CampaignWorkflow />} />
          <Route path="/" element={<Navigate to="/workflow" replace />} />
          </Routes>
        </Layout>
          </HashRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </AppProvider>
  );
}

export default App;
