import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, InputBase, IconButton, Badge, Avatar, Typography, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon, Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { logout } from '../../redux/slices/authSlice';
import { COLORS } from '../../theme';

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

  const handleLogout = async () => {
    await dispatch(logout());
    handleMenuClose();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: COLORS.panel,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${COLORS.panelBorder}`,
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
            sx={{ mr: 2, color: COLORS.text }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            color: COLORS.text,
            fontFamily: 'Fraunces, serif',
            fontWeight: 600,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Finance App
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: COLORS.fieldBg,
            borderRadius: '10px',
            px: 2,
            py: 1,
            mx: 2,
            width: { xs: '100%', sm: 300 },
            border: `1px solid ${COLORS.fieldBorder}`,
            '&:hover': {
              borderColor: COLORS.goldSoft,
            },
          }}
        >
          <SearchIcon sx={{ color: COLORS.textFaint, mr: 1 }} />
          <InputBase
            placeholder="Search transactions..."
            sx={{
              flex: 1,
              color: COLORS.text,
              fontFamily: 'Inter, sans-serif',
              '& input::placeholder': {
                color: COLORS.textFaint,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton sx={{ color: COLORS.text }}>
            <Badge badgeContent={3} sx={{ '& .MuiBadge-badge': { backgroundColor: COLORS.red } }}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Avatar
            onClick={handleAvatarClick}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(212, 175, 55, 0.2)',
              color: COLORS.gold,
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              border: `1px solid ${COLORS.goldSoft}`,
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
        PaperProps={{
          sx: {
            backgroundColor: COLORS.panel,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${COLORS.panelBorder}`,
            borderRadius: '12px',
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: COLORS.text,
            fontFamily: 'Inter, sans-serif',
            '&:hover': {
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1, color: COLORS.textDim }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
