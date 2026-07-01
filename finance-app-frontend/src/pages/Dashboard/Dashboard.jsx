import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Card, CardContent, alpha, useTheme, Select, MenuItem, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { fetchExpenses } from '../../redux/slices/expenseSlice';
import { useToast } from '../../components/common/Toast';
import { SummaryCardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';
import { formatCurrency } from '../../utils/currencyFormatter';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { expenses, loading, error: expensesError } = useSelector((state) => state.expenses);
  const { userId } = useSelector((state) => state.auth);
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState('October 2023');

  useEffect(() => {
    if (!userId) {
      error('Please login to view dashboard');
      return;
    }

    const defaultRange = getDateRanges().thisMonth;
    dispatch(fetchExpenses({
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
  }, [dispatch, success, error, userId]);

  // Calculate summary data from expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalIncome = 0; // Will be implemented when income endpoint is ready
  const savings = totalIncome - totalExpenses;
  const budgetRemaining = 5000 - totalExpenses; // Placeholder budget

  const summaryCardData = [
    {
      title: 'Total Monthly Spending',
      value: totalExpenses,
      trend: 12.5,
      color: '#EF4444',
      icon: '💰',
      gradient: 'linear-gradient(135deg, rgba(82, 182, 154, 0.08) 0%, rgba(82, 182, 154, 0.02) 100%)'
    },
    {
      title: 'Total Income',
      value: totalIncome,
      trend: 8.2,
      color: '#52B69A',
      icon: '💵',
      gradient: 'linear-gradient(135deg, rgba(82, 182, 154, 0.08) 0%, rgba(82, 182, 154, 0.02) 100%)'
    },
    {
      title: 'Savings',
      value: savings,
      trend: 15.3,
      color: '#34A0A4',
      icon: '🏦',
      gradient: 'linear-gradient(135deg, rgba(52, 160, 164, 0.08) 0%, rgba(52, 160, 164, 0.02) 100%)'
    },
    {
      title: 'Budget Remaining',
      value: budgetRemaining,
      trend: -5.1,
      color: '#1A759F',
      icon: '📊',
      gradient: 'linear-gradient(135deg, rgba(26, 117, 159, 0.08) 0%, rgba(26, 117, 159, 0.02) 100%)'
    }
  ];

  if (loading && expenses.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Spending Dashboard
        </Typography>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <SummaryCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (expensesError) {
    return (
      <Box sx={{ p: 3 }}>
        <EmptyState
          title="Error Loading Dashboard"
          description={expensesError}
          size="large"
        />
      </Box>
    );
  }

  const hasData = expenses.length > 0;

  const recentTransactions = expenses.slice(0, 5);

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Row 1: Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h2" fontWeight={700} color="#0D1B2A">
          Spending Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E0E7FF',
              },
            }}
          >
            <MenuItem value="October 2023">October 2023</MenuItem>
            <MenuItem value="September 2023">September 2023</MenuItem>
            <MenuItem value="August 2023">August 2023</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {hasData ? (
        <>
          {/* Row 2: Summary Cards */}
          <Grid container spacing={3} mb={4}>
            {summaryCardData.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    background: card.gradient,
                    border: '1px solid #E0E7FF',
                    borderRadius: 3,
                    p: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="body2" color="#576B84" fontWeight={500}>
                      {card.title}
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: alpha(card.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" fontWeight={700} color="#0D1B2A" mb={1}>
                    {formatCurrency(card.value)}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {card.trend > 0 ? (
                      <TrendingUpIcon sx={{ color: '#52B69A', fontSize: '1rem' }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: '#EF4444', fontSize: '1rem' }} />
                    )}
                    <Typography variant="body2" color={card.trend > 0 ? '#52B69A' : '#EF4444'} fontWeight={600}>
                      {Math.abs(card.trend)}%
                    </Typography>
                    <Typography variant="body2" color="#576B84">
                      vs last month
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Row 3: Two Column Layout */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E7FF' }}>
                <Typography variant="h6" fontWeight={700} color="#0D1B2A" mb={3}>
                  Top Categories
                </Typography>
                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="body2" color="#576B84">
                    Chart component placeholder
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E7FF' }}>
                <Typography variant="h6" fontWeight={700} color="#0D1B2A" mb={3}>
                  Budget Overview
                </Typography>
                <Box>
                  {[1, 2, 3].map((item) => (
                    <Box key={item} mb={3}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" fontWeight={600} color="#0D1B2A">
                          Category {item}
                        </Typography>
                        <Typography variant="body2" color="#576B84">
                          ${item * 100} / ${item * 200}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#E0E7FF',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${item * 30}%`,
                            backgroundColor: item === 1 ? '#52B69A' : item === 2 ? '#F59E0B' : '#EF4444',
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Row 4: Recent Transactions */}
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E7FF', mb: 4 }}>
            <Typography variant="h6" fontWeight={700} color="#0D1B2A" mb={3}>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Account</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((txn, index) => (
                      <TableRow
                        key={txn.id || index}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#F8FAFC' : '#FFFFFF',
                          '&:hover': { backgroundColor: '#E0E7FF' },
                        }}
                      >
                        <TableCell>{new Date(txn.expenseDate || txn.date).toLocaleDateString()}</TableCell>
                        <TableCell>{txn.description}</TableCell>
                        <TableCell>{txn.category?.name || 'Uncategorized'}</TableCell>
                        <TableCell>{txn.paymentMethod || 'Cash'}</TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: '#EF4444',
                            fontWeight: 600,
                          }}
                        >
                          -{formatCurrency(txn.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="#576B84">
                          No recent transactions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Row 5: Two Column */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E7FF' }}>
                <Typography variant="h6" fontWeight={700} color="#0D1B2A" mb={3}>
                  Spending Trend
                </Typography>
                <Box height={250} display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="body2" color="#576B84">
                    Line chart placeholder
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E7FF' }}>
                <Typography variant="h6" fontWeight={700} color="#0D1B2A" mb={3}>
                  Financial Goals
                </Typography>
                <Box>
                  {[1, 2].map((goal) => (
                    <Box key={goal} mb={3}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: alpha('#34A0A4', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                          }}
                        >
                          🎯
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={600} color="#0D1B2A">
                            Goal {goal}
                          </Typography>
                          <Typography variant="caption" color="#576B84">
                            Target: ${goal * 1000}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#E0E7FF',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${goal * 40}%`,
                            backgroundColor: '#34A0A4',
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="#576B84" mt={0.5} display="block">
                        {goal * 40}% complete
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <Card sx={{ mt: 4, p: 3, borderRadius: 3, border: '1px solid #E0E7FF' }}>
          <EmptyState
            title="No Financial Data Yet"
            description="Start by adding your first expense or income to see your financial dashboard come to life."
            actionText="Add Expense"
            onAction={() => navigate('/expenses')}
            size="large"
          />
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;
