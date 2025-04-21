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
  DialogContentText
} from '@mui/material';
import { Campaign, Segment, LocalOffer, Message, NotificationsActive, WorkOutline, DeleteOutline } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Workflow', icon: <WorkOutline />, path: '/workflow' },
  { text: 'Campaigns', icon: <Campaign />, path: '/campaigns' },
  { text: 'Triggers', icon: <NotificationsActive />, path: '/triggers' },
  { text: 'Segments', icon: <Segment />, path: '/segments' },
  { text: 'Offers', icon: <LocalOffer />, path: '/segment-offer-mapping' },
  { text: 'Communications', icon: <Message />, path: '/communications' },
];

const Layout = ({ children }) => {
  const { clearAllData } = useAppContext();
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Campaign Management
          </Typography>
          <Button
            color="error"
            startIcon={<DeleteOutline />}
            onClick={handleClearData}
            variant="contained"
            sx={{ ml: 2 }}
          >
            Clear All Data
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
              <ListItem button key={item.text} component={RouterLink} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
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
