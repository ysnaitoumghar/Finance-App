import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, InputBase, IconButton, Badge, Avatar, Typography, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon, Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { logout } from '../../redux/slices/authSlice';

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { username } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/login');
  };

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
            onClick={handleAvatarClick}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#34A0A4',
              cursor: 'pointer',
            }}
          >
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </Avatar>
        </Box>
      </Toolbar>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
