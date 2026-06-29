import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { fetchAllAnalytics, setDateRange } from '../../redux/slices/analyticsSlice';
import SummaryCards from '../../components/Analytics/SummaryCards';
import { ArrowForward } from '@mui/icons-material';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { analyticsData, loading, error } = useSelector((state) => state.analytics);

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

  const summary = analyticsData.summary;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's your financial overview
          </Typography>
        </Box>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => navigate('/analytics')}
        >
          View Analytics
        </Button>
      </Box>

      {loading && !summary ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={() => navigate('/expenses')}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Recent Expenses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage your expenses
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={() => navigate('/budgets')}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Budget Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your budget progress
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={() => navigate('/income')}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Income Sources
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your income streams
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={() => navigate('/reports')}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generate and export reports
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
