import React, { useState } from 'react';
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
  SvgIcon
} from '@mui/material';
import { Campaign, Segment, LocalOffer, Message, NotificationsActive, WorkOutline, DeleteOutline } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Workflow', icon: <WorkOutline />, path: '/workflow', requiredPermission: 'read' },
  { text: 'Campaigns', icon: <Campaign />, path: '/campaigns', requiredPermission: 'write' },
  { text: 'Triggers', icon: <NotificationsActive />, path: '/triggers', requiredPermission: 'write' },
  { text: 'Segments', icon: <Segment />, path: '/segments', requiredPermission: 'write' },
  { text: 'Offers', icon: <LocalOffer />, path: '/segment-offer-mapping', requiredPermission: 'write' },
  { text: 'Communications', icon: <Message />, path: '/communications', requiredPermission: 'write' },
];

const TelusLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 400 80">
    <text x="10" y="60" fontFamily="Arial Black" fontSize="60" fill="#4B286D">TELUS</text>
  </SvgIcon>
);

const Layout = ({ children }) => {
  const { clearAllData } = useAppContext();
  const { currentUser, checkPermission } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);

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

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#FFFFFF' }}>
        <Toolbar>
          <TelusLogo sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#4B286D' }}>
            Campaign Management
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#4B286D', mr: 2 }}>
            {currentUser?.name} ({currentUser?.role})
          </Typography>
          {checkPermission('modify') && (
            <Button
              color="secondary"
              startIcon={<DeleteOutline />}
              onClick={handleClearData}
              variant="contained"
              sx={{ ml: 2 }}
            >
              Clear All Data
            </Button>
          )}
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
            bgcolor: '#F7F7F8',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              checkPermission(item.requiredPermission) && (
                <ListItem button key={item.text} component={RouterLink} to={item.path}>
                  <ListItemIcon sx={{ color: '#4B286D' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} sx={{ color: '#2A2C2E' }} />
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#FFFFFF' }}>
        <Toolbar />
        {children}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCancelClear}
        PaperProps={{
          style: {
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#4B286D' }}>Clear All Data?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#2A2C2E' }}>
            This will permanently delete all campaigns, triggers, segments, and mappings. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClear} sx={{ color: '#4B286D' }}>Cancel</Button>
          <Button onClick={handleConfirmClear} color="secondary" variant="contained">
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;
