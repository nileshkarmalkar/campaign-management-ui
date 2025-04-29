import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoutes - Auth State:', {
      isAuthenticated,
      currentUser,
      location: location.pathname
    });
  }, [isAuthenticated, currentUser, location]);

  if (isAuthenticated === undefined) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering protected content');
  return children;
};

export default ProtectedRoutes;
