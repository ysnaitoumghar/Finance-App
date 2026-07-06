import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Card, CardContent, alpha, useTheme, Select, MenuItem, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, GlobalStyles } from '@mui/material';
import { fetchExpenses } from '../../redux/slices/expenseSlice';
import { useToast } from '../../components/common/Toast';
import { SummaryCardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import { getDateRanges, formatDate } from '../../utils/dateHelpers';
import { formatCurrency } from '../../utils/currencyFormatter';
import { COLORS } from '../../theme';

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
        console.error('Dashboard load error:', err);
        error('Failed to load dashboard data');
      });
  }, [dispatch, userId, success, error]);

  // Calculate summary data from expenses
  const totalExpenses = (expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalIncome = 0; // Will be implemented when income endpoint is ready
  const savings = totalIncome - totalExpenses;
  const budgetRemaining = 5000 - totalExpenses; // Placeholder budget

  const summaryCardData = [
    {
      title: 'Total Monthly Spending',
      value: totalExpenses,
      trend: 12.5,
      color: COLORS.red,
      icon: '💰',
      gradient: 'linear-gradient(135deg, rgba(229, 72, 77, 0.12) 0%, rgba(229, 72, 77, 0.04) 100%)'
    },
    {
      title: 'Total Income',
      value: totalIncome,
      trend: 8.2,
      color: COLORS.emerald,
      icon: '💵',
      gradient: 'linear-gradient(135deg, rgba(47, 191, 143, 0.12) 0%, rgba(47, 191, 143, 0.04) 100%)'
    },
    {
      title: 'Savings',
      value: savings,
      trend: 15.3,
      color: COLORS.gold,
      icon: '🏦',
      gradient: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)'
    },
    {
      title: 'Budget Remaining',
      value: budgetRemaining,
      trend: -5.1,
      color: COLORS.amber,
      icon: '📊',
      gradient: 'linear-gradient(135deg, rgba(224, 160, 59, 0.12) 0%, rgba(224, 160, 59, 0.04) 100%)'
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
    <>
      <GlobalStyles
          styles={{
            '@keyframes drawLine': {
              '0%': { transform: 'scaleX(0)', opacity: 0 },
              '100%': { transform: 'scaleX(1)', opacity: 1 },
            },
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
            p: 3,
            maxWidth: 1400,
            mx: 'auto',
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
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Row 1: Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h2" fontWeight={600} sx={{ fontFamily: 'Fraunces, serif', color: COLORS.text }}>
              Spending Dashboard
            </Typography>
            <FormControl sx={{ minWidth: 150 }}>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                sx={{
                  borderRadius: '10px',
                  bgcolor: COLORS.fieldBg,
                  color: COLORS.text,
                  fontFamily: 'Inter, sans-serif',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.fieldBorder,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.goldSoft,
                  },
                  '& .MuiSelect-icon': { color: COLORS.textDim },
                }}
              >
                <MenuItem value="October 2023" sx={{ color: COLORS.text }}>October 2023</MenuItem>
                <MenuItem value="September 2023" sx={{ color: COLORS.text }}>September 2023</MenuItem>
                <MenuItem value="August 2023" sx={{ color: COLORS.text }}>August 2023</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Gold hairline divider */}
          <Box
              sx={{
                height: '2px',
                width: '100%',
                mb: 4,
                background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
                transformOrigin: 'center',
                animation: 'drawLine 0.8s ease-out both',
              }}
          />

      {hasData ? (
        <>
          {/* Row 2: Summary Cards */}
          <Grid container spacing={3} mb={4}>
            {summaryCardData.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    bgcolor: COLORS.panel,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${COLORS.panelBorder}`,
                    borderRadius: '16px',
                    p: 3,
                    height: '100%',
                    boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 28px 70px -20px rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      {card.title}
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: alpha(card.color, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: COLORS.text, mb: 1 }}>
                    {formatCurrency(card.value)}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {card.trend > 0 ? (
                      <TrendingUpIcon sx={{ color: COLORS.emerald, fontSize: '1rem' }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: COLORS.red, fontSize: '1rem' }} />
                    )}
                    <Typography variant="body2" sx={{ color: card.trend > 0 ? COLORS.emerald : COLORS.red, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                      {Math.abs(card.trend)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
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
              <Card sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
                <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 3 }}>
                  Top Categories
                </Typography>
                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                    Chart component placeholder
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
                <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 3 }}>
                  Budget Overview
                </Typography>
                <Box>
                  {[1, 2, 3].map((item) => {
                    const pct = item * 30;
                    const barColor = pct < 60 ? COLORS.emerald : pct < 85 ? COLORS.amber : COLORS.red;
                    return (
                      <Box key={item} mb={3}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>
                            Category {item}
                          </Typography>
                          <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace' }}>
                            ${item * 100} / ${item * 200}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${pct}%`,
                              backgroundColor: barColor,
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Row 4: Recent Transactions */}
          <Card sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', mb: 4, boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
            <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 3 }}>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table sx={{ '& .MuiTableCell-root': { borderBottom: `1px solid ${COLORS.panelBorder}` } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</TableCell>
                    <TableCell sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</TableCell>
                    <TableCell sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</TableCell>
                    <TableCell sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</TableCell>
                    <TableCell align="right" sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((txn, index) => (
                      <TableRow
                        key={txn.id || index}
                        sx={{
                          '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' },
                        }}
                      >
                        <TableCell sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{new Date(txn.expenseDate || txn.date).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{txn.description}</TableCell>
                        <TableCell sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{txn.category?.name || 'Uncategorized'}</TableCell>
                        <TableCell sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{txn.paymentMethod || 'Cash'}</TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: COLORS.red,
                            fontWeight: 600,
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        >
                          -{formatCurrency(txn.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
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
              <Card sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
                <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 3 }}>
                  Spending Trend
                </Typography>
                <Box height={250} display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                    Line chart placeholder
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
                <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 3 }}>
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
                            backgroundColor: alpha(COLORS.gold, 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                          }}
                        >
                          🎯
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>
                            Goal {goal}
                          </Typography>
                          <Typography variant="caption" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                            Target: ${goal * 1000}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${goal * 40}%`,
                            backgroundColor: COLORS.gold,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', mt: 0.5, display: 'block' }}>
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
        <Card sx={{ mt: 4, p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
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
      </Box>
    </>
  );
};

export default Dashboard;
