import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, Receipt as TransactionsIcon, AccountBalance as BudgetsIcon, Flag as GoalsIcon, AccountBalanceWallet as AccountsIcon, Assessment as ReportsIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Transactions', icon: <TransactionsIcon />, path: '/transactions' },
  { text: 'Budgets', icon: <BudgetsIcon />, path: '/budgets' },
  { text: 'Analytics', icon: <ReportsIcon />, path: '/analytics' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Groups', icon: <ReportsIcon />, path: '/groups' },
];

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: '#184E77',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1100,
        display: { xs: open ? 'block' : 'none', md: 'block' },
        transition: 'transform 0.3s ease',
      }}
    >
      {isMobile && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}
      
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 700,
            mb: 4,
          }}
        >
          FinanceApp
        </Box>
        
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    backgroundColor: isActive ? '#34A0A4' : 'transparent',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: isActive ? '#34A0A4' : 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: isActive ? 600 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
