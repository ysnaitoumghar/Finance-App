import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, Card, CardContent, alpha, useTheme } from '@mui/material';
import { fetchAllAnalytics, setDateRange } from '../../redux/slices/analyticsSlice';
import { useToast } from '../../components/common/Toast';
import SummaryCards from '../../components/analytics/SummaryCards';
import { SummaryCardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { 
  ArrowForward as ArrowForwardIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  AttachMoney as AttachMoneyIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { analyticsData, loading, analyticsError } = useSelector((state) => state.analytics);
  const theme = useTheme();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      error('Please login to view dashboard');
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
        success('Dashboard data loaded successfully');
      })
      .catch((err) => {
        error('Failed to load dashboard data');
      });
  }, [dispatch, success, error]);

  const quickActions = [
    {
      title: 'Expenses',
      description: 'View and manage your expenses',
      icon: <ReceiptIcon />,
      color: theme.palette.error.main,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      route: '/expenses'
    },
    {
      title: 'Budgets',
      description: 'Track your budget progress',
      icon: <AccountBalanceWalletIcon />,
      color: theme.palette.warning.main,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      route: '/budgets'
    },
    {
      title: 'Income',
      description: 'Manage your income streams',
      icon: <AttachMoneyIcon />,
      color: theme.palette.success.main,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      route: '/income'
    },
    {
      title: 'Reports',
      description: 'Generate and export reports',
      icon: <AssessmentIcon />,
      color: theme.palette.primary.main,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      route: '/reports'
    }
  ];

  if (loading && !analyticsData.summary) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <SummaryCardSkeleton />
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
          title="Error Loading Dashboard"
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
        <Box>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Welcome Back!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your financial overview for this month
          </Typography>
        </Box>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/analytics')}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          View Full Analytics
        </Button>
      </Box>

      {hasData ? (
        <>
          <SummaryCards summary={analyticsData.summary} />

          <Typography variant="h5" fontWeight="bold" sx={{ mt: 6, mb: 3 }}>
            Quick Actions
          </Typography>

          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: action.gradient,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    }
                  }}
                  onClick={() => navigate(action.route)}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha('#ffffff', 0.2),
                        backdropFilter: 'blur(10px)',
                        width: 'fit-content',
                        mb: 2
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Card sx={{ mt: 4 }}>
          <EmptyState
            icon={<AssessmentIcon />}
            title="No Financial Data Yet"
            description="Start by adding your first expense or income to see your financial dashboard come to life."
            actionText="Add Expense"
            onAction={() => navigate('/expenses')}
            size="large"
          />
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;
