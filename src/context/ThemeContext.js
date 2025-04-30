import React, { createContext, useContext, useMemo } from 'react';
import { createTheme } from '@mui/material';

const ThemeContext = createContext();

const telusTheme = {
  palette: {
    primary: {
      main: '#4B286D',
      light: '#7C5AA6',
      dark: '#2A1347',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#2B8000',
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
  }
};

const genericTheme = {
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 300,
      color: '#333333'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      color: '#333333'
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      color: '#333333'
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      color: '#333333'
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
      color: '#333333'
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#333333'
    }
  }
};

const commonComponents = {
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
};

export const ThemeProvider = ({ children }) => {
  const useBranding = window._env_?.REACT_APP_USE_TELUS_BRANDING === 'true';
  
  const theme = useMemo(() => {
    const baseTheme = useBranding ? telusTheme : genericTheme;
    return createTheme({
      ...baseTheme,
      components: commonComponents
    });
  }, [useBranding]);

  const value = useMemo(() => ({
    theme,
    useBranding
  }), [theme, useBranding]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
