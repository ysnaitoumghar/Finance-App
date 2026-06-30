import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, TextField, Button, Chip, useTheme, alpha } from '@mui/material';
import { CalendarToday as CalendarIcon, Clear as ClearIcon } from '@mui/icons-material';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

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
    <Card sx={{ mb: 3 }}>
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
                    size: 'small'
                  }
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
                    size: 'small'
                  }
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
                sx={{ flex: 1 }}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 2, alignSelf: 'center' }}>
            Quick Select:
          </Typography>
          {Object.values(dateRanges).map((range, index) => (
            <Chip
              key={index}
              label={range.label}
              onClick={() => handleQuickSelect(range)}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
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
