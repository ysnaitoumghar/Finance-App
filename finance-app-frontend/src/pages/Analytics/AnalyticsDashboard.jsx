import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Grid, Typography, Alert, Tabs, Tab, Paper, GlobalStyles } from '@mui/material';
import { fetchAllAnalytics, setDateRange } from '../../redux/slices/analyticsSlice';
import { useToast } from '../../components/common/Toast';
import SummaryCards from '../../components/analytics/SummaryCards';
import DateRangeFilter from '../../components/analytics/DateRangeFilter';
import ExpenseChart from '../../components/Charts/ExpenseChart';
import TrendChart from '../../components/Charts/TrendChart';
import IncomeVsExpense from '../../components/Charts/IncomeVsExpense';
import BudgetChart from '../../components/Charts/BudgetChart';
import { SummaryCardSkeleton, ChartSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { COLORS } from '../../theme';

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const { analyticsData, loading, error: analyticsError, dateRange } = useSelector((state) => state.analytics);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      error('Please login to view analytics');
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
        success('Analytics data loaded successfully');
      })
      .catch((err) => {
        error('Failed to load analytics data');
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
        success('Analytics updated for selected date range');
      })
      .catch((err) => {
        error('Failed to update analytics');
      });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading && !analyticsData.summary) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Financial Analytics
        </Typography>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <SummaryCardSkeleton />
            </Grid>
          ))}
          {[...Array(4)].map((_, i) => (
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
        <Alert severity="error" sx={{ mb: 3 }}>
          {analyticsError}
        </Alert>
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
          Financial Analytics
        </Typography>
        <DateRangeFilter onApply={handleDateRangeChange} onQuickSelect={handleDateRangeChange} />
        <Paper sx={{ mt: 4 }}>
          <EmptyState
            icon={<TrendingUpIcon />}
            title="No Analytics Data"
            description="Start adding expenses and income to see your financial analytics here."
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
        Financial Analytics
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', mb: 4 }}>
        Track your spending, income, and budget performance
      </Typography>

      <DateRangeFilter onApply={handleDateRangeChange} onQuickSelect={handleDateRangeChange} />

      <SummaryCards summary={analyticsData.summary} />

      <Paper sx={{ mt: 4, overflow: 'hidden', bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: `1px solid ${COLORS.panelBorder}`,
            '& .MuiTab-root': {
              color: COLORS.textDim,
              fontFamily: 'Inter, sans-serif',
              textTransform: 'none',
              '&.Mui-selected': {
                color: COLORS.gold,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.gold,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Expenses" />
          <Tab label="Income" />
          <Tab label="Budget" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TrendChart data={analyticsData.trend} />
              </Grid>
              <Grid item xs={12} md={6}>
                <IncomeVsExpense data={analyticsData.trend} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ExpenseChart data={analyticsData.byCategory} />
              </Grid>
              <Grid item xs={12} md={6}>
                <BudgetChart data={analyticsData.budgetStatus} />
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ExpenseChart data={analyticsData.byCategory} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TrendChart data={analyticsData.trend} />
              </Grid>
            </Grid>
          )}

          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <IncomeVsExpense data={analyticsData.trend} />
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <BudgetChart data={analyticsData.budgetStatus} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ExpenseChart data={analyticsData.byCategory} />
              </Grid>
            </Grid>
          )}
        </Box>
        </Paper>
        </Container>
      </Box>
    </>
  );
};

export default AnalyticsDashboard;
