import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert
} from '@mui/material';
import { Campaign, Segment, LocalOffer, Message, NotificationsActive, WorkOutline, DeleteOutline, CloudDownload, ExitToApp } from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Workflow', icon: <WorkOutline />, path: '/workflow', requiredPermission: 'read' },
  { text: 'Campaigns', icon: <Campaign />, path: '/campaigns', requiredPermission: 'write' },
  { text: 'Triggers', icon: <NotificationsActive />, path: '/triggers', requiredPermission: 'write' },
  { text: 'Segments', icon: <Segment />, path: '/segments', requiredPermission: 'write' },
  { text: 'Offers', icon: <LocalOffer />, path: '/segment-offer-mapping', requiredPermission: 'write' },
  { text: 'Communications', icon: <Message />, path: '/communications', requiredPermission: 'write' },
];

const Layout = () => {
  const { clearAllData, loadSampleData, error, isBigQueryInitialized } = useAppContext();
  const { currentUser, checkPermission, logout } = useAuth();
  const { useBranding } = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleClearData = () => {
    setOpenDialog(true);
  };

  const handleConfirmClear = () => {
    clearAllData();
    setOpenDialog(false);
  };

  const handleCancelClear = () => {
    setOpenDialog(false);
  };

  const handleLoadSampleData = () => {
    loadSampleData();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Campaign Management
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {currentUser?.name} ({currentUser?.role})
          </Typography>
          {checkPermission('modify') && (
            <>
              <Button
                color="inherit"
                startIcon={<CloudDownload />}
                onClick={handleLoadSampleData}
                sx={{ ml: 2 }}
              >
                Load Sample Data
              </Button>
              <Button
                color="inherit"
                startIcon={<DeleteOutline />}
                onClick={handleClearData}
                sx={{ ml: 2 }}
              >
                Clear All Data
              </Button>
            </>
          )}
          <Button
            color="inherit"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              checkPermission(item.requiredPermission) && (
                <ListItem button key={item.text} component={RouterLink} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {!isBigQueryInitialized && (
          <Alert severity="info" sx={{ mb: 2 }}>
            BigQuery is initializing. Some features may be temporarily unavailable.
          </Alert>
        )}
        <Outlet />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCancelClear}
      >
        <DialogTitle>Clear All Data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete all campaigns, triggers, segments, and mappings. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClear}>Cancel</Button>
          <Button onClick={handleConfirmClear} color="error" variant="contained">
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;
