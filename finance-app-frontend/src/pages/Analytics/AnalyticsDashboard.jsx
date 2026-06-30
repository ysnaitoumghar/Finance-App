import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Grid, Typography, Alert, Tabs, Tab, Paper } from '@mui/material';
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

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const { analyticsData, loading, error: analyticsError, selectedDateRange } = useSelector((state) => state.analytics);
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
  }, [dispatch, success, error]);

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Financial Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Track your spending, income, and budget performance
      </Typography>

      <DateRangeFilter onApply={handleDateRangeChange} onQuickSelect={handleDateRangeChange} />

      <SummaryCards summary={analyticsData.summary} />

      <Paper sx={{ mt: 4, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
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
  );
};

export default AnalyticsDashboard;
