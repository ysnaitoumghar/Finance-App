import React from 'react';
import { Box, AppBar, Toolbar, InputBase, IconButton, Badge, Avatar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon, Menu as MenuIcon } from '@mui/icons-material';

const Header = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E0E7FF',
        boxShadow: 'none',
        ml: { md: '240px' },
        width: { md: 'calc(100% - 240px)' },
        zIndex: 1000,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMenuClick}
            sx={{ mr: 2, color: '#0D1B2A' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            color: '#0D1B2A',
            fontWeight: 700,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          FinanceApp
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: 2,
            px: 2,
            py: 1,
            mx: 2,
            width: { xs: '100%', sm: 300 },
          }}
        >
          <SearchIcon sx={{ color: '#576B84', mr: 1 }} />
          <InputBase
            placeholder="Search transactions..."
            sx={{
              flex: 1,
              color: '#0D1B2A',
              '& input::placeholder': {
                color: '#576B84',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton sx={{ color: '#0D1B2A' }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#34A0A4',
              cursor: 'pointer',
            }}
          >
            JD
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
