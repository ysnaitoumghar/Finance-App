import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Select, FormControl, InputLabel, Chip, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';

const DateRangeFilter = ({ onApply, onQuickSelect }) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('thisMonth');

  const dateRanges = getDateRanges();

  const handleQuickSelect = (rangeKey) => {
    setSelectedQuickFilter(rangeKey);
    const range = dateRanges[rangeKey];
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
    setSelectedQuickFilter('thisMonth');
    handleQuickSelect('thisMonth');
  };

  return (
    <Box sx={{ mb: 3 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
              setSelectedQuickFilter('custom');
            }}
            slotProps={{ textField: { size: 'small', sx: { minWidth: 180 } } }}
          />
          
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue);
              setSelectedQuickFilter('custom');
            }}
            slotProps={{ textField: { size: 'small', sx: { minWidth: 180 } } }}
          />
          
          <Button 
            variant="contained" 
            onClick={handleApply}
            disabled={!startDate || !endDate}
            size="small"
          >
            Apply
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleClear}
            size="small"
          >
            Clear
          </Button>
        </Box>
        
        <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
          {Object.entries(dateRanges).map(([key, range]) => (
            <Chip
              key={key}
              label={range.label}
              onClick={() => handleQuickSelect(key)}
              variant={selectedQuickFilter === key ? 'filled' : 'outlined'}
              color={selectedQuickFilter === key ? 'primary' : 'default'}
              size="small"
              clickable
            />
          ))}
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default DateRangeFilter;
