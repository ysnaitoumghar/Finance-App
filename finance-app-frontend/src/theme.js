import { createTheme } from '@mui/material/styles';

// Ledger Design System Palette
const COLORS = {
  bg: '#0A0E17',
  bgVignette: '#0D1220',
  panel: 'rgba(19, 26, 41, 0.72)',
  panelBorder: 'rgba(212, 175, 55, 0.18)',
  gold: '#D4AF37',
  goldSoft: 'rgba(212, 175, 55, 0.35)',
  emerald: '#2FBF8F',
  amber: '#E0A03B',
  red: '#E5484D',
  text: '#E8ECF1',
  textDim: '#8B95A7',
  textFaint: '#5A6478',
  fieldBg: 'rgba(255,255,255,0.03)',
  fieldBorder: 'rgba(255,255,255,0.1)',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: COLORS.bg,
      paper: COLORS.panel,
    },
    primary: {
      main: COLORS.gold,
      light: '#E8C766',
      dark: '#B8942E',
    },
    secondary: {
      main: COLORS.emerald,
    },
    error: {
      main: COLORS.red,
    },
    warning: {
      main: COLORS.amber,
    },
    success: {
      main: COLORS.emerald,
    },
    text: {
      primary: COLORS.text,
      secondary: COLORS.textDim,
      disabled: COLORS.textFaint,
    },
    divider: COLORS.panelBorder,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
      color: COLORS.text,
    },
    h3: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
      color: COLORS.text,
    },
    h4: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
      color: COLORS.text,
    },
    h5: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
      color: COLORS.text,
    },
    h6: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
      color: COLORS.text,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"JetBrains Mono", monospace',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.panel,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: '16px',
          boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
          padding: '24px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        },
        containedPrimary: {
          background: `linear-gradient(90deg, ${COLORS.gold}, #E8C766)`,
          color: '#0A0E17',
          boxShadow: `0 8px 24px -8px ${COLORS.goldSoft}`,
          '&:hover': {
            background: `linear-gradient(90deg, #E8C766, ${COLORS.gold})`,
            transform: 'translateY(-1px)',
            boxShadow: `0 12px 28px -8px ${COLORS.goldSoft}`,
          },
        },
        outlined: {
          borderColor: COLORS.panelBorder,
          color: COLORS.text,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderColor: COLORS.goldSoft,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: COLORS.fieldBg,
            color: COLORS.text,
            fontFamily: '"Inter", sans-serif',
            '& fieldset': { borderColor: COLORS.fieldBorder },
            '&:hover fieldset': { borderColor: COLORS.goldSoft },
            '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
          },
          '& .MuiInputLabel-root': {
            color: COLORS.textFaint,
            fontFamily: '"Inter", sans-serif',
            '&.Mui-focused': { color: COLORS.gold },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.08)',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.panel,
          backdropFilter: 'blur(20px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.panel,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${COLORS.panelBorder}`,
        },
      },
    },
  },
  spacing: 8,
});

export default theme;
export { COLORS };
