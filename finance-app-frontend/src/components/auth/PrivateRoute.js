import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, GlobalStyles } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const COLORS = {
  bg: '#0A0E17',
  gold: '#D4AF37',
  textDim: '#8B95A7',
};

// Full-screen branded loader shown only while auth status is still resolving
// (e.g. verifying a stored token). If your authSlice has no such flag yet,
// this path simply never renders and behavior is unchanged.
function AuthResolving() {
  return (
      <>
        <GlobalStyles
            styles={{
              '@keyframes pulseMark': {
                '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.08)' },
              },
              '@keyframes sweepLine': {
                '0%': { backgroundPosition: '-120px 0' },
                '100%': { backgroundPosition: '120px 0' },
              },
            }}
        />
        <Box
            role="status"
            aria-live="polite"
            sx={{
              minHeight: '100vh',
              width: '100%',
              bgcolor: COLORS.bg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
        >
          <TrendingUp
              sx={{
                color: COLORS.gold,
                fontSize: 32,
                animation: 'pulseMark 1.4s ease-in-out infinite',
              }}
          />
          <Box
              sx={{
                width: 120,
                height: 2,
                borderRadius: 2,
                overflow: 'hidden',
                background:
                    'linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.9) 50%, rgba(212,175,55,0) 100%)',
                backgroundSize: '120px 100%',
                animation: 'sweepLine 1.2s linear infinite',
              }}
          />
          <Typography
              sx={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                letterSpacing: '0.15em',
                color: COLORS.textDim,
                textTransform: 'uppercase',
              }}
          >
            Verifying session
          </Typography>
        </Box>
      </>
  );
}

function PrivateRoute({ children }) {
  const { isAuthenticated, loading, authChecking } = useSelector((state) => state.auth);

  // Covers whichever flag name your slice uses for "still resolving auth".
  const isResolving = Boolean(authChecking ?? loading);

  if (isResolving) {
    return <AuthResolving />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;