import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, alpha, useTheme } from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/currencyFormatter';

const SummaryCards = ({ summary, previousSummary }) => {
  const theme = useTheme();
  
  if (!summary) return null;

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const cards = [
    {
      title: 'Total Income',
      value: summary.income || 0,
      icon: <TrendingUpIcon />,
      color: 'success',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: calculateChange(summary.income, previousSummary?.income)
    },
    {
      title: 'Total Expenses',
      value: summary.expenses || 0,
      icon: <TrendingDownIcon />,
      color: 'error',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      change: calculateChange(summary.expenses, previousSummary?.expenses)
    },
    {
      title: 'Net Savings',
      value: summary.savings || 0,
      icon: <SavingsIcon />,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      change: calculateChange(summary.savings, previousSummary?.savings)
    },
    {
      title: 'Budget Remaining',
      value: summary.budgetRemaining || 0,
      icon: <AccountBalanceIcon />,
      color: 'info',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      change: null
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: '100%',
              background: card.gradient,
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
              }
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha('#ffffff', 0.2),
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {card.icon}
                </Box>
                {card.change !== null && (
                  <Chip
                    label={`${card.change > 0 ? '+' : ''}${card.change}%`}
                    sx={{
                      bgcolor: alpha('#ffffff', 0.2),
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                    size="small"
                    icon={card.change > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  />
                )}
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                {card.title}
              </Typography>
              <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5 }}>
                {formatCurrency(card.value)}
              </Typography>
              {card.change !== null && (
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  vs last month
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
