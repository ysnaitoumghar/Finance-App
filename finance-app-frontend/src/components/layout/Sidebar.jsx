import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme, Typography } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, Receipt as TransactionsIcon, AccountBalance as BudgetsIcon, Flag as GoalsIcon, AccountBalanceWallet as AccountsIcon, Assessment as ReportsIcon, TrendingUp } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { COLORS } from '../../theme';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Transactions', icon: <TransactionsIcon />, path: '/transactions' },
  { text: 'Budgets', icon: <BudgetsIcon />, path: '/budgets' },
  { text: 'Analytics', icon: <ReportsIcon />, path: '/analytics' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Groups', icon: <AccountsIcon />, path: '/groups' },
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
        backgroundColor: COLORS.panel,
        backdropFilter: 'blur(20px)',
        borderRight: `1px solid ${COLORS.panelBorder}`,
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
          <IconButton onClick={onClose} sx={{ color: COLORS.text }}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}
      
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 4,
          }}
        >
          <TrendingUp sx={{ color: COLORS.gold, fontSize: 24 }} />
          <Typography
            sx={{
              color: COLORS.text,
              fontFamily: 'Fraunces, serif',
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            Finance App
          </Typography>
        </Box>
        
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: '10px',
                    mx: 0.5,
                    py: 1.5,
                    color: isActive ? COLORS.text : COLORS.textDim,
                    fontFamily: 'Inter, sans-serif',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'rgba(212, 175, 55, 0.08)',
                      color: COLORS.text,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isActive ? '3px' : 0,
                      height: '60%',
                      backgroundColor: COLORS.gold,
                      borderRadius: '0 2px 2px 0',
                      transition: 'all 0.2s ease',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: isActive ? 600 : 500,
                        fontSize: 14,
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
