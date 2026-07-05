import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/slices/authSlice';
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
  Link,
  CircularProgress,
  GlobalStyles,
} from '@mui/material';
import {
  PersonOutline,
  MailOutline,
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

// ---- Password strength helper -------------------------------------------
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: COLORS.textFaint };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map = [
    { label: 'Too short', color: COLORS.red },
    { label: 'Weak', color: COLORS.red },
    { label: 'Fair', color: '#E0A03B' },
    { label: 'Good', color: COLORS.emerald },
    { label: 'Strong', color: COLORS.emerald },
  ];
  return { score, ...map[score] };
}

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const strength = useMemo(() => getStrength(password), [password]);
  const passwordsMismatch =
      touched.confirmPassword && confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    const result = await dispatch(register({ username, email, password }));
    if (!result.error) {
      navigate('/login');
    }
  };

  return (
      <>
        {/* Fonts + keyframes. Move the @import into your global stylesheet/index.html in production. */}
        <GlobalStyles
            styles={{
              '@import':
                  "url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap')",
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
              '@keyframes sparklePulse': {
                '0%, 100%': { opacity: 0.35 },
                '50%': { opacity: 0.9 },
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
                // ledger grid
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
                // vignette
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse at 50% 20%, ${COLORS.bgVignette} 0%, ${COLORS.bg} 70%)`,
              },
            }}
        >
          {/* faint rising sparkline, purely decorative */}
          <Box
              component="svg"
              viewBox="0 0 400 200"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '140%', sm: '70%' },
                maxWidth: 700,
                opacity: 0.15,
                pointerEvents: 'none',
              }}
          >
            <polyline
                points="0,180 40,160 80,170 120,120 160,140 200,80 240,100 280,50 320,65 360,20 400,35"
                fill="none"
                stroke={COLORS.emerald}
                strokeWidth="2"
            />
          </Box>

          <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
            <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  animation: 'riseIn 0.6s ease-out',
                }}
            >
              {/* Brand mark */}
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
                  Open an account
                </Typography>
                <Typography
                    align="center"
                    sx={{ color: COLORS.textDim, fontSize: 14, mb: 1.5 }}
                >
                  Track, budget, and grow — in one place.
                </Typography>

                {/* gold hairline signature */}
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

                {(error || formError) && (
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
                      {formError || error}
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
                      onChange={(e) => setUsername(e.target.value)}
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
                      id="email"
                      label="Email address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <MailOutline sx={{ color: COLORS.textFaint, fontSize: 20 }} />
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
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined sx={{ color: COLORS.textFaint, fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                  onClick={() => setShowPassword((s) => !s)}
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

                  {/* Strength meter */}
                  {password.length > 0 && (
                      <Box sx={{ mt: 0.75, mb: 0.5, px: 0.25 }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {[0, 1, 2, 3].map((i) => (
                              <Box
                                  key={i}
                                  sx={{
                                    height: 3,
                                    flex: 1,
                                    borderRadius: 2,
                                    bgcolor: i < strength.score ? strength.color : 'rgba(255,255,255,0.08)',
                                    transition: 'background-color 0.25s ease',
                                  }}
                              />
                          ))}
                        </Box>
                        <Typography
                            sx={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: 11,
                              color: strength.color,
                              mt: 0.5,
                            }}
                        >
                          {strength.label}
                        </Typography>
                      </Box>
                  )}

                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm password"
                      type={showConfirm ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                      error={passwordsMismatch}
                      helperText={passwordsMismatch ? 'Passwords do not match' : ' '}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined sx={{ color: COLORS.textFaint, fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                  onClick={() => setShowConfirm((s) => !s)}
                                  edge="end"
                                  size="small"
                                  sx={{ color: COLORS.textFaint }}
                                  aria-label="toggle confirm password visibility"
                              >
                                {showConfirm ? (
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

                  <Button
                      type="submit"
                      fullWidth
                      disabled={loading}
                      sx={{
                        mt: 2,
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
                        'Create account'
                    )}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Link
                        component={RouterLink}
                        to="/login"
                        sx={{
                          fontSize: 14,
                          color: COLORS.textDim,
                          textDecoration: 'none',
                          '& span': { color: COLORS.gold },
                          '&:hover': { color: COLORS.text },
                        }}
                    >
                      Already have an account? <span>Log in</span>
                    </Link>
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

export default Register;