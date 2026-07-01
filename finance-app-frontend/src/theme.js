import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#52B69A',   // Ocean Mist
      main: '#34A0A4',    // Tropical Teal
      medium: '#168AAD',  // Bondi Blue
      dark: '#1A759F',    // Cerulean
      darker: '#1E6091', // Baltic Blue
      accent: '#184E77',  // Yale Blue
    },
    text: {
      primary: '#0D1B2A',
      secondary: '#576B84',
      disabled: '#9CA3AF',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    success: {
      main: '#52B69A',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    divider: '#E0E7FF',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
      color: '#0D1B2A',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E0E7FF',
          padding: '24px',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          backgroundColor: '#34A0A4',
          '&:hover': {
            backgroundColor: '#1A759F',
          },
        },
        outlined: {
          backgroundColor: '#F8FAFC',
          border: '1px solid #168AAD',
          color: '#1A759F',
          '&:hover': {
            backgroundColor: '#E0E7FF',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: '#E0E7FF',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
  spacing: 8,
});

export default theme;
