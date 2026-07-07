import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { COLORS } from '../../theme';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <AppBar position="static" sx={{ bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${COLORS.panelBorder}` }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text }}>
          Finance App
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>Welcome, {username}</Typography>
          <Button 
            sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', '&:hover': { color: COLORS.gold } }} 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', '&:hover': { color: COLORS.gold } }} 
            onClick={() => navigate('/budgets')}
          >
            Budgets
          </Button>
          <Button 
            sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', '&:hover': { color: COLORS.gold } }} 
            onClick={() => navigate('/groups')}
          >
            Groups
          </Button>
          <Button 
            sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', '&:hover': { color: COLORS.gold } }} 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
