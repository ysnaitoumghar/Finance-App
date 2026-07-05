import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addBudget } from '../../redux/slices/budgetSlice';
import * as categoryService from '../../services/categoryService';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  InputAdornment,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  CalendarMonth,
  CalendarToday,
  NotificationsActive,
  CheckCircle,
} from '@mui/icons-material';

const COLORS = {
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

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: COLORS.fieldBg,
    color: COLORS.text,
    fontFamily: 'Inter, sans-serif',
    '& fieldset': { borderColor: COLORS.fieldBorder },
    '&:hover fieldset': { borderColor: COLORS.goldSoft },
    '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
  },
  '& .MuiInputLabel-root': {
    color: COLORS.textFaint,
    fontFamily: 'Inter, sans-serif',
    '&.Mui-focused': { color: COLORS.gold },
  },
};

// Alert threshold color: calm green while low, gold as it climbs, red near the limit
function alertColor(pct) {
  if (pct < 60) return COLORS.emerald;
  if (pct < 85) return COLORS.amber;
  return COLORS.red;
}

function BudgetForm({ userId, onBudgetAdded }) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [justCreated, setJustCreated] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    limitAmount: '',
    period: 'MONTHLY',
    alertPercentage: 80,
  });

  useEffect(() => {
    fetchCategoriesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchCategoriesList = async () => {
    setCategoriesLoading(true);
    try {
      const response = await categoryService.getCategories(userId, 'EXPENSE');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePeriodChange = (e, newPeriod) => {
    if (newPeriod) setFormData((prev) => ({ ...prev, period: newPeriod }));
  };

  const handleAlertSlider = (e, value) => {
    setFormData((prev) => ({ ...prev, alertPercentage: value }));
  };

  const alertPct = alertColor(Number(formData.alertPercentage) || 0);

  const isValid = useMemo(() => {
    const amt = Number(formData.limitAmount);
    return amt > 0;
  }, [formData.limitAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await dispatch(addBudget({ userId, budgetData: formData })).unwrap?.() ??
      (await dispatch(addBudget({ userId, budgetData: formData })));
      setFormData({
        categoryId: '',
        limitAmount: '',
        period: 'MONTHLY',
        alertPercentage: 80,
      });
      setJustCreated(true);
      setTimeout(() => setJustCreated(false), 2500);
      if (onBudgetAdded) onBudgetAdded();
    } catch (error) {
      console.error('Error adding budget:', error);
      setSubmitError('Could not create the budget. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            mb: 3,
            bgcolor: COLORS.panel,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${COLORS.panelBorder}`,
            borderRadius: '16px',
          }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
              sx={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 600,
                fontSize: 20,
                color: COLORS.text,
              }}
          >
            Create budget
          </Typography>
          {justCreated && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: COLORS.emerald }}>
                <CheckCircle fontSize="small" />
                <Typography sx={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                  Budget created
                </Typography>
              </Box>
          )}
        </Box>

        {submitError && (
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
              {submitError}
            </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Category */}
          {categoriesLoading ? (
              <Skeleton
                  variant="rounded"
                  height={56}
                  sx={{ mt: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}
              />
          ) : (
              <Select
                  fullWidth
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{ mt: 1, mb: 1, ...fieldSx['& .MuiOutlinedInput-root'] }}
                  MenuProps={{
                    PaperProps: {
                      sx: { bgcolor: '#131A29', border: `1px solid ${COLORS.panelBorder}` },
                    },
                  }}
                  inputProps={{
                    sx: { color: COLORS.text, fontFamily: 'Inter, sans-serif' },
                  }}
              >
                <MenuItem value="" sx={{ color: COLORS.textDim }}>
                  All categories (optional)
                </MenuItem>
                {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id} sx={{ color: COLORS.text }}>
                      {cat.name}
                    </MenuItem>
                ))}
              </Select>
          )}
          {!categoriesLoading && categories.length === 0 && (
              <Typography sx={{ fontSize: 12, color: COLORS.textFaint, mb: 1, ml: 0.5 }}>
                No expense categories yet — this budget will apply across all spending.
              </Typography>
          )}

          {/* Amount */}
          <TextField
              fullWidth
              margin="normal"
              name="limitAmount"
              label="Limit amount"
              type="number"
              value={formData.limitAmount}
              onChange={handleInputChange}
              required
              error={formData.limitAmount !== '' && !isValid}
              helperText={formData.limitAmount !== '' && !isValid ? 'Enter an amount greater than 0' : ' '}
              inputProps={{ step: '0.01', min: 0 }}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: COLORS.textFaint, fontFamily: 'Inter, sans-serif' }}>
                        $
                      </Typography>
                    </InputAdornment>
                ),
              }}
              sx={fieldSx}
          />

          {/* Period — segmented control instead of a bare dropdown */}
          <Typography sx={{ fontSize: 12, color: COLORS.textFaint, mt: 1.5, mb: 0.75, ml: 0.25 }}>
            Period
          </Typography>
          <ToggleButtonGroup
              fullWidth
              exclusive
              value={formData.period}
              onChange={handlePeriodChange}
              sx={{
                mb: 1,
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  color: COLORS.textDim,
                  borderColor: COLORS.fieldBorder,
                  gap: 0.75,
                  '&.Mui-selected': {
                    color: '#0A0E17',
                    bgcolor: COLORS.gold,
                    '&:hover': { bgcolor: COLORS.gold },
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                },
              }}
          >
            <ToggleButton value="MONTHLY">
              <CalendarMonth fontSize="small" /> Monthly
            </ToggleButton>
            <ToggleButton value="YEARLY">
              <CalendarToday fontSize="small" /> Yearly
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Alert threshold — slider with a live color preview */}
          <Box sx={{ mt: 2.5, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <NotificationsActive sx={{ fontSize: 16, color: COLORS.textFaint }} />
              <Typography sx={{ fontSize: 12, color: COLORS.textFaint }}>
                Alert me at
              </Typography>
              <Typography
                  sx={{
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: alertPct,
                    ml: 'auto',
                  }}
              >
                {formData.alertPercentage}%
              </Typography>
            </Box>
            <Slider
                value={Number(formData.alertPercentage)}
                onChange={handleAlertSlider}
                min={1}
                max={100}
                sx={{
                  color: alertPct,
                  height: 4,
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                    bgcolor: alertPct,
                    boxShadow: `0 0 0 4px ${COLORS.goldSoft}`,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: `0 0 0 6px ${COLORS.goldSoft}`,
                    },
                  },
                  '& .MuiSlider-rail': { bgcolor: 'rgba(255,255,255,0.08)' },
                }}
            />
            <Typography sx={{ fontSize: 11, color: COLORS.textFaint, mt: 0.25 }}>
              We'll notify you once spending crosses this share of the limit.
            </Typography>
          </Box>

          <Button
              type="submit"
              fullWidth
              disabled={!isValid || submitting}
              sx={{
                mt: 2,
                py: 1.2,
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
                },
                '&.Mui-disabled': {
                  background: 'rgba(212, 175, 55, 0.2)',
                  color: 'rgba(10,14,23,0.5)',
                },
              }}
          >
            {submitting ? <CircularProgress size={20} sx={{ color: '#0A0E17' }} /> : 'Create budget'}
          </Button>
        </Box>
      </Paper>
  );
}

export default BudgetForm;