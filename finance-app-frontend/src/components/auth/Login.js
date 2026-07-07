import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  GlobalStyles,
} from '@mui/material';
import {
  PersonOutline,
  LockOutlined,
  Visibility,
  VisibilityOff,
  TrendingUp,
} from '@mui/icons-material';

// ---- Design tokens -----------------------------------------------------
const COLORS = {
  bg: '#0A0E17',
  bgVignette: '#0D1220',
  panel: 'rgba(19, 26, 41, 0.72)',
  panelBorder: 'rgba(212, 175, 55, 0.18)',
  gold: '#D4AF37',
  goldSoft: 'rgba(212, 175, 55, 0.35)',
  emerald: '#2FBF8F',
  red: '#E5484D',
  text: '#E8ECF1',
  textDim: '#8B95A7',
  textFaint: '#5A6478',
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    if (password.length < 6 && password) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    try {
      const result = await dispatch(login({ username, password }));

      if (result.payload && rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      // Navigation is handled by useEffect when isAuthenticated updates
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
      <>
        <GlobalStyles
            styles={{
              '@keyframes drawLine': {
                '0%': { transform: 'scaleX(0)', opacity: 0 },
                '100%': { transform: 'scaleX(1)', opacity: 1 },
              },
              '@keyframes riseIn': {
                '0%': { transform: 'translateY(16px)', opacity: 0 },
                '100%': { transform: 'translateY(0)', opacity: 1 },
              },
              '@keyframes floatGrid': {
                '0%': { backgroundPosition: '0px 0px' },
                '100%': { backgroundPosition: '0px -48px' },
              },
            }}
        />

        <Box
            sx={{
              minHeight: '100vh',
              width: '100%',
              bgcolor: COLORS.bg,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(${COLORS.panelBorder} 1px, transparent 1px),
                               linear-gradient(90deg, ${COLORS.panelBorder} 1px, transparent 1px)`,
                backgroundSize: '48px 48px',
                opacity: 0.35,
                animation: 'floatGrid 12s linear infinite',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse at 50% 20%, ${COLORS.bgVignette} 0%, ${COLORS.bg} 70%)`,
              },
            }}
        >
          <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
            <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  animation: 'riseIn 0.6s ease-out',
                }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp sx={{ color: COLORS.gold, fontSize: 22 }} />
                <Typography
                    sx={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12,
                      letterSpacing: '0.2em',
                      color: COLORS.textDim,
                      textTransform: 'uppercase',
                    }}
                >
                  Finance App
                </Typography>
              </Box>

              <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3.5, sm: 5 },
                    width: '100%',
                    bgcolor: COLORS.panel,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${COLORS.panelBorder}`,
                    borderRadius: '18px',
                    boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
                  }}
              >
                <Typography
                    component="h1"
                    align="center"
                    sx={{
                      fontFamily: 'Fraunces, serif',
                      fontWeight: 600,
                      fontSize: { xs: 26, sm: 30 },
                      color: COLORS.text,
                      mb: 0.5,
                    }}
                >
                  Welcome back
                </Typography>
                <Typography
                    align="center"
                    sx={{ color: COLORS.textDim, fontSize: 14, mb: 1.5 }}
                >
                  Sign in to access your ledger
                </Typography>

                <Box
                    sx={{
                      height: '2px',
                      width: 56,
                      mx: 'auto',
                      mb: 3,
                      background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
                      transformOrigin: 'center',
                      animation: 'drawLine 0.8s ease-out 0.2s both',
                    }}
                />

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                          mb: 2,
                          bgcolor: 'rgba(229, 72, 77, 0.1)',
                          color: '#FF8A8D',
                          border: '1px solid rgba(229, 72, 77, 0.25)',
                          '& .MuiAlert-icon': { color: '#FF8A8D' },
                        }}
                    >
                      {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (validationErrors.username) {
                          setValidationErrors({ ...validationErrors, username: '' });
                        }
                      }}
                      error={!!validationErrors.username}
                      helperText={validationErrors.username}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutline sx={{ color: COLORS.textFaint, fontSize: 20 }} />
                            </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                  />

                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors({ ...validationErrors, password: '' });
                        }
                      }}
                      error={!!validationErrors.password}
                      helperText={validationErrors.password}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined sx={{ color: COLORS.textFaint, fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                  onClick={handleTogglePassword}
                                  edge="end"
                                  size="small"
                                  sx={{ color: COLORS.textFaint }}
                                  aria-label="toggle password visibility"
                              >
                                {showPassword ? (
                                    <VisibilityOff fontSize="small" />
                                ) : (
                                    <Visibility fontSize="small" />
                                )}
                              </IconButton>
                            </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 2 }}>
                    <FormControlLabel
                        control={
                          <Checkbox
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              sx={{
                                color: COLORS.goldSoft,
                                '&.Mui-checked': { color: COLORS.gold },
                              }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: 13, color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                            Remember me
                          </Typography>
                        }
                    />
                  </Box>

                  <Button
                      type="submit"
                      fullWidth
                      disabled={loading}
                      sx={{
                        mt: 1,
                        mb: 2,
                        py: 1.3,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: 15,
                        textTransform: 'none',
                        color: '#0A0E17',
                        borderRadius: '10px',
                        background: `linear-gradient(90deg, ${COLORS.gold}, #E8C766)`,
                        boxShadow: `0 8px 24px -8px ${COLORS.goldSoft}`,
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        '&:hover': {
                          background: `linear-gradient(90deg, #E8C766, ${COLORS.gold})`,
                          transform: 'translateY(-1px)',
                          boxShadow: `0 12px 28px -8px ${COLORS.goldSoft}`,
                        },
                        '&.Mui-disabled': {
                          background: 'rgba(212, 175, 55, 0.25)',
                          color: 'rgba(10,14,23,0.6)',
                        },
                      }}
                  >
                    {loading ? (
                        <CircularProgress size={20} sx={{ color: '#0A0E17' }} />
                    ) : (
                        'Sign in'
                    )}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <RouterLink
                        to="/register"
                        style={{ textDecoration: 'none' }}
                    >
                      <Typography
                          sx={{
                            fontSize: 14,
                            color: COLORS.textDim,
                            fontFamily: 'Inter, sans-serif',
                            '& span': { color: COLORS.gold },
                            '&:hover': { color: COLORS.text },
                          }}
                      >
                        No account? <span>Create one</span>
                      </Typography>
                    </RouterLink>
                  </Box>
                </Box>
              </Paper>

              <Typography
                  sx={{
                    mt: 3,
                    fontSize: 12,
                    color: COLORS.textFaint,
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '0.05em',
                  }}
              >
                256-BIT ENCRYPTED · YOUR DATA STAYS YOURS
              </Typography>
            </Box>
          </Container>
        </Box>
      </>
  );
}

// Shared TextField styling for the dark glass theme
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: 'rgba(255,255,255,0.03)',
    color: COLORS.text,
    fontFamily: 'Inter, sans-serif',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: COLORS.goldSoft },
    '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
  },
  '& .MuiInputLabel-root': {
    color: COLORS.textFaint,
    fontFamily: 'Inter, sans-serif',
    '&.Mui-focused': { color: COLORS.gold },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
  },
};

export default Login;