import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Grid, Typography, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { fetchAllAnalytics, setDateRange } from '../../redux/slices/analyticsSlice';
import SummaryCards from '../../components/Analytics/SummaryCards';
import DateRangeFilter from '../../components/Analytics/DateRangeFilter';
import ExpenseChart from '../../components/Charts/ExpenseChart';
import TrendChart from '../../components/Charts/TrendChart';
import IncomeVsExpense from '../../components/Charts/IncomeVsExpense';
import BudgetChart from '../../components/Charts/BudgetChart';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { analyticsData, loading, error, selectedDateRange } = useSelector((state) => state.analytics);
  const [tabValue, setTabValue] = React.useState(0);

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading && !analyticsData.summary) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Financial Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Track your spending, income, and budget performance
      </Typography>

      <DateRangeFilter onApply={handleDateRangeChange} onQuickSelect={handleDateRangeChange} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <SummaryCards summary={analyticsData.summary} />

      <Box sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label="Expenses" />
          <Tab label="Income" />
          <Tab label="Budget" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
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
      </Box>
    </Container>
  );
};

export default AnalyticsDashboard;
