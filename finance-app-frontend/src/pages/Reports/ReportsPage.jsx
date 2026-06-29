import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Paper, FormControlLabel, Checkbox, useTheme } from '@mui/material';
import { fetchAllAnalytics, setDateRange } from '../../redux/slices/analyticsSlice';
import DateRangeFilter from '../../components/Analytics/DateRangeFilter';
import ExportButtons from '../../components/Reports/ExportButtons';
import ReportPreview from '../../components/Reports/ReportPreview';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { analyticsData, loading, error, selectedDateRange } = useSelector((state) => state.analytics);
  const reportRef = useRef(null);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const defaultRange = getDateRanges().thisMonth;
    dispatch(setDateRange({
      startDate: formatDate(defaultRange.start),
      endDate: formatDate(defaultRange.end),
      label: defaultRange.label
    }));
    dispatch(fetchAllAnalytics({
      userId,
      startDate: formatDate(defaultRange.start),
      endDate: formatDate(defaultRange.end)
    }));
  }, [dispatch]);

  const handleDateRangeChange = (range) => {
    const userId = localStorage.getItem('userId');
    dispatch(setDateRange(range));
    dispatch(fetchAllAnalytics({
      userId,
      startDate: range.startDate,
      endDate: range.endDate
    }));
  };

  const reportData = {
    summary: analyticsData.summary,
    byCategory: analyticsData.byCategory,
    budgetStatus: analyticsData.budgetStatus,
    trend: analyticsData.trend
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Reports
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Generate and export financial reports
      </Typography>

      <DateRangeFilter onApply={handleDateRangeChange} onQuickSelect={handleDateRangeChange} />

      <Box sx={{ mt: 3, mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
            />
          }
          label="Include Charts in Report"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeTransactions}
              onChange={(e) => setIncludeTransactions(e.target.checked)}
            />
          }
          label="Include Transaction Details"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <ExportButtons 
          data={reportData} 
          reportRef={reportRef} 
          type="summary"
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <Typography>Loading report data...</Typography>
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, bgcolor: 'error.light' }}>
          <Typography color="error.main">{error}</Typography>
        </Paper>
      ) : (
        <Paper 
          ref={reportRef}
          sx={{ 
            p: 4,
            bgcolor: 'background.paper',
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          <ReportPreview data={reportData} dateRange={selectedDateRange} />
        </Paper>
      )}
    </Container>
  );
};

export default ReportsPage;
