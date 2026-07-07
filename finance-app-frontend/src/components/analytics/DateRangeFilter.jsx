import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, TextField, Button, Chip, useTheme, alpha } from '@mui/material';
import { CalendarToday as CalendarIcon, Clear as ClearIcon } from '@mui/icons-material';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { COLORS } from '../../theme';

const DateRangeFilter = ({ onApply, onQuickSelect }) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const dateRanges = getDateRanges();

  const handleQuickSelect = (range) => {
    setStartDate(range.start);
    setEndDate(range.end);
    if (onQuickSelect) {
      onQuickSelect({
        startDate: formatDate(range.start),
        endDate: formatDate(range.end),
        label: range.label
      });
    }
  };

  const handleApply = () => {
    if (startDate && endDate && onApply) {
      onApply({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        label: 'Custom Range'
      });
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Card sx={{ mb: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: {
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
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: {
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
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={handleApply}
                disabled={!startDate || !endDate}
                startIcon={<CalendarIcon />}
                sx={{
                  flex: 1,
                  background: `linear-gradient(90deg, ${COLORS.gold}, #E8C766)`,
                  color: '#0A0E17',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '10px',
                  boxShadow: `0 8px 24px -8px ${COLORS.goldSoft}`,
                  '&:hover': {
                    background: `linear-gradient(90deg, #E8C766, ${COLORS.gold})`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 12px 28px -8px ${COLORS.goldSoft}`,
                  },
                }}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                startIcon={<ClearIcon />}
                sx={{
                  color: COLORS.textDim,
                  borderColor: COLORS.fieldBorder,
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': {
                    borderColor: COLORS.gold,
                    backgroundColor: 'rgba(212, 175, 55, 0.08)',
                    color: COLORS.gold,
                  },
                }}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" sx={{ mr: 2, alignSelf: 'center', color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
            Quick Select:
          </Typography>
          {Object.values(dateRanges).map((range, index) => (
            <Chip
              key={index}
              label={range.label}
              onClick={() => handleQuickSelect(range)}
              sx={{
                bgcolor: alpha(COLORS.gold, 0.1),
                color: COLORS.gold,
                fontFamily: 'Inter, sans-serif',
                '&:hover': {
                  bgcolor: alpha(COLORS.gold, 0.2),
                },
                cursor: 'pointer'
              }}
              size="small"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DateRangeFilter;
