import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

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
    const result = await dispatch(login({ username, password }));

    if (result.payload) {
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      navigate('/dashboard');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
      <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #184E77 0%, #1A759F 50%, #34A0A4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
      >
        <Container maxWidth="sm">
          <Paper
              elevation={10}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: '16px',
                background: '#ffffff',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #34A0A4 0%, #52B69A 100%)',
                },
              }}
          >
            {/* Logo/Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #34A0A4 0%, #52B69A 100%)',
                    mb: 2,
                    boxShadow: '0 8px 24px rgba(52, 160, 164, 0.3)',
                  }}
              >
                <Typography
                    sx={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#ffffff',
                    }}
                >
                  💰
                </Typography>
              </Box>

              <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#0D1B2A',
                    mb: 1,
                  }}
              >
                FinanceApp
              </Typography>

              <Typography
                  variant="body2"
                  sx={{
                    color: '#576B84',
                    fontSize: '14px',
                  }}
              >
                Welcome back! Sign in to your account
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: '12px',
                      border: '1px solid #FCA5A5',
                      backgroundColor: '#FEF2F2',
                      color: '#991B1B',
                      '& .MuiAlert-icon': {
                        color: '#DC2626',
                      },
                    }}
                >
                  {error}
                </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Username Field */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#0D1B2A',
                      mb: 1,
                    }}
                >
                  Username
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (validationErrors.username) {
                        setValidationErrors({
                          ...validationErrors,
                          username: '',
                        });
                      }
                    }}
                    error={!!validationErrors.username}
                    helperText={validationErrors.username}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={20} color="#34A0A4" />
                          </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#EFF6FF',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          boxShadow: '0 0 0 3px rgba(52, 160, 164, 0.1)',
                          '& fieldset': {
                            borderColor: '#34A0A4',
                            borderWidth: '2px',
                          },
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#9CA3AF',
                        opacity: 1,
                      },
                    }}
                />
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 1.5 }}>
                <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#0D1B2A',
                      mb: 1,
                    }}
                >
                  Password
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors({
                          ...validationErrors,
                          password: '',
                        });
                      }
                    }}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={20} color="#34A0A4" />
                          </InputAdornment>
                      ),
                      endAdornment: (
                          <InputAdornment
                              position="end"
                              onClick={handleTogglePassword}
                              sx={{ cursor: 'pointer' }}
                          >
                            {showPassword ? (
                                <EyeOff size={20} color="#9CA3AF" />
                            ) : (
                                <Eye size={20} color="#9CA3AF" />
                            )}
                          </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#EFF6FF',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          boxShadow: '0 0 0 3px rgba(52, 160, 164, 0.1)',
                          '& fieldset': {
                            borderColor: '#34A0A4',
                            borderWidth: '2px',
                          },
                        },
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#9CA3AF',
                        opacity: 1,
                      },
                    }}
                />
              </Box>

              {/* Remember Me & Forgot Password */}
              <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
              >
                <FormControlLabel
                    control={
                      <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          sx={{
                            color: '#34A0A4',
                            '&.Mui-checked': {
                              color: '#34A0A4',
                            },
                          }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: '#576B84' }}>
                        Remember me
                      </Typography>
                    }
                />
                <Link
                    to="/forgot-password"
                    style={{
                      textDecoration: 'none',
                    }}
                >
                  <Typography
                      variant="body2"
                      sx={{
                        color: '#34A0A4',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': {
                          color: '#1A759F',
                        },
                      }}
                  >
                    Forgot password?
                  </Typography>
                </Link>
              </Box>

              {/* Submit Button */}
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #34A0A4 0%, #1A759F 100%)',
                    boxShadow: '0 8px 24px rgba(52, 160, 164, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover:not(:disabled)': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(52, 160, 164, 0.4)',
                    },
                    '&:disabled': {
                      opacity: 0.7,
                    },
                  }}
              >
                {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      <span>Logging in...</span>
                    </Box>
                ) : (
                    'Sign In'
                )}
              </Button>
            </Box>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: '#576B84' }}>
                Don't have an account?{' '}
                <Link
                    to="/register"
                    style={{
                      textDecoration: 'none',
                    }}
                >
                  <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: '#34A0A4',
                        fontWeight: 700,
                        cursor: 'pointer',
                        '&:hover': {
                          color: '#1A759F',
                        },
                      }}
                  >
                    Create account
                  </Typography>
                </Link>
              </Typography>
            </Box>

            {/* Divider with Demo Text */}
            <Box
                sx={{
                  textAlign: 'center',
                  mt: 3,
                  pt: 3,
                  borderTop: '1px solid #E0E7FF',
                }}
            >
              <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                Demo: username / password
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
  );
}

export default Login;