import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import { ArrowUpward, ArrowDownward, TrendingUp, TrendingDown } from '@mui/icons-material';
import { formatCurrency } from '../../utils/currencyFormatter';

const SummaryCard = ({ title, value, comparison, color, icon: Icon }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        boxShadow: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {formatCurrency(value)}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}20`,
              color: color
            }}
          >
            <Icon />
          </Box>
        </Box>
        
        {comparison && (
          <Box display="flex" alignItems="center" mt={2}>
            {comparison.trend === 'up' ? (
              <ArrowUpward 
                sx={{ 
                  fontSize: 16, 
                  mr: 0.5,
                  color: comparison.value > 0 ? 'success.main' : 'error.main'
                }} 
              />
            ) : comparison.trend === 'down' ? (
              <ArrowDownward 
                sx={{ 
                  fontSize: 16, 
                  mr: 0.5,
                  color: comparison.value < 0 ? 'success.main' : 'error.main'
                }} 
              />
            ) : null}
            <Typography variant="body2" color="text.secondary">
              {comparison.percentage}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const SummaryCards = ({ summary, previousSummary }) => {
  const theme = useTheme();
  
  if (!summary) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ height: 140, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ width: '100%', height: 60, bgcolor: 'grey.200', borderRadius: 1, mb: 2 }} />
                <Box sx={{ width: '60%', height: 32, bgcolor: 'grey.200', borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  const incomeComparison = previousSummary ? {
    trend: summary.income > previousSummary.income ? 'up' : 'down',
    percentage: Math.abs(((summary.income - previousSummary.income) / previousSummary.income) * 100).toFixed(1),
    value: summary.income - previousSummary.income
  } : null;

  const expenseComparison = previousSummary ? {
    trend: summary.expenses > previousSummary.expenses ? 'up' : 'down',
    percentage: Math.abs(((summary.expenses - previousSummary.expenses) / previousSummary.expenses) * 100).toFixed(1),
    value: summary.expenses - previousSummary.expenses
  } : null;

  const savingsComparison = previousSummary ? {
    trend: summary.savings > previousSummary.savings ? 'up' : 'down',
    percentage: Math.abs(((summary.savings - previousSummary.savings) / previousSummary.savings) * 100).toFixed(1),
    value: summary.savings - previousSummary.savings
  } : null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Total Income"
          value={summary.income || 0}
          comparison={incomeComparison}
          color={theme.palette.success.main}
          icon={TrendingUp}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Total Expenses"
          value={summary.expenses || 0}
          comparison={expenseComparison}
          color={theme.palette.error.main}
          icon={TrendingDown}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Net Savings"
          value={summary.savings || 0}
          comparison={savingsComparison}
          color={theme.palette.primary.main}
          icon={TrendingUp}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Budget Remaining"
          value={summary.budgetRemaining || 0}
          comparison={null}
          color={theme.palette.info.main}
          icon={TrendingUp}
        />
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
