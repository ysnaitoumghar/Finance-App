import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Paper, FormControlLabel, Checkbox, useTheme, Grid, GlobalStyles } from '@mui/material';
import { fetchAllAnalytics, setDateRange } from '../../redux/slices/analyticsSlice';
import { useToast } from '../../components/common/Toast';
import DateRangeFilter from '../../components/analytics/DateRangeFilter';
import ExportButtons from '../../components/Reports/ExportButtons';
import ReportPreview from '../../components/Reports/ReportPreview';
import { SummaryCardSkeleton, ChartSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';
import { Description as DescriptionIcon } from '@mui/icons-material';
import { COLORS } from '../../theme';

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const { analyticsData, loading, analyticsError, selectedDateRange } = useSelector((state) => state.analytics);
  const reportRef = useRef(null);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      error('Please login to view reports');
      return;
    }

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
    }))
      .unwrap()
      .then(() => {
        success('Report data loaded successfully');
      })
      .catch((err) => {
        error('Failed to load report data');
      });
  }, [dispatch]);

  const handleDateRangeChange = (range) => {
    const userId = localStorage.getItem('userId');
    dispatch(setDateRange(range));
    
    dispatch(fetchAllAnalytics({
      userId,
      startDate: range.startDate,
      endDate: range.endDate
    }))
      .unwrap()
      .then(() => {
        success('Report updated for selected date range');
      })
      .catch((err) => {
        error('Failed to update report');
      });
  };

  const reportData = {
    summary: analyticsData.summary,
    byCategory: analyticsData.byCategory,
    budgetStatus: analyticsData.budgetStatus,
    trend: analyticsData.trend
  };

  if (loading && !analyticsData.summary) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Reports
        </Typography>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <SummaryCardSkeleton />
            </Grid>
          ))}
          {[...Array(2)].map((_, i) => (
            <Grid item xs={12} md={6} key={i}>
              <ChartSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (analyticsError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <EmptyState
          title="Error Loading Reports"
          description={analyticsError}
          size="large"
        />
      </Container>
    );
  }

  const hasData = analyticsData.summary && (
    analyticsData.summary.income > 0 || 
    analyticsData.summary.expenses > 0 ||
    analyticsData.summary.savings > 0
  );

  if (!hasData) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Reports
        </Typography>
        <DateRangeFilter onApply={handleDateRangeChange} onQuickSelect={handleDateRangeChange} />
        <Paper sx={{ mt: 4 }}>
          <EmptyState
            icon={<DescriptionIcon />}
            title="No Report Data"
            description="Add expenses and income to generate financial reports."
            size="large"
          />
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <GlobalStyles
          styles={{
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
            py: 4,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(${COLORS.panelBorder} 1px, transparent 1px),
                             linear-gradient(90deg, ${COLORS.panelBorder} 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              opacity: 0.25,
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
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
      <Typography variant="h4" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 1 }}>
        Reports
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', mb: 4 }}>
        Generate and export financial reports
      </Typography>

      <DateRangeFilter onApply={handleDateRangeChange} onQuickSelect={handleDateRangeChange} />

      <Box sx={{ mt: 3, mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              sx={{
                color: COLORS.goldSoft,
                '&.Mui-checked': { color: COLORS.gold },
              }}
            />
          }
          label={<Typography sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>Include Charts in Report</Typography>}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeTransactions}
              onChange={(e) => setIncludeTransactions(e.target.checked)}
              sx={{
                color: COLORS.goldSoft,
                '&.Mui-checked': { color: COLORS.gold },
              }}
            />
          }
          label={<Typography sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>Include Transaction Details</Typography>}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <ExportButtons 
          data={reportData} 
          reportRef={reportRef} 
          type="summary"
        />
      </Box>

      <Paper 
        ref={reportRef}
        sx={{ 
          p: 4,
          bgcolor: COLORS.panel,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: '16px',
          boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
        }}
      >
        <ReportPreview data={reportData} dateRange={dateRange} />
      </Paper>
        </Container>
      </Box>
    </>
  );
};

export default ReportsPage;
