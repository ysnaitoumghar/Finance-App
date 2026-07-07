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
import { COLORS } from '../../theme';

const SummaryCards = ({ summary, previousSummary }) => {
  const theme = useTheme();
  
  if (!summary) return null;

  const calculateChange = (current, previous) => {
    if (previous === null || previous === undefined || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const cards = [
    {
      title: 'Total Income',
      value: summary.income || 0,
      icon: <TrendingUpIcon />,
      color: 'success',
      gradient: `linear-gradient(135deg, ${COLORS.emerald} 0%, #1a9c6e 100%)`,
      change: calculateChange(summary.income, previousSummary?.income)
    },
    {
      title: 'Total Expenses',
      value: summary.expenses || 0,
      icon: <TrendingDownIcon />,
      color: 'error',
      gradient: `linear-gradient(135deg, ${COLORS.red} 0%, #b93c40 100%)`,
      change: calculateChange(summary.expenses, previousSummary?.expenses)
    },
    {
      title: 'Net Savings',
      value: summary.savings || 0,
      icon: <SavingsIcon />,
      color: 'primary',
      gradient: `linear-gradient(135deg, ${COLORS.gold} 0%, #b8942a 100%)`,
      change: calculateChange(summary.savings, previousSummary?.savings)
    },
    {
      title: 'Budget Remaining',
      value: summary.budgetRemaining || 0,
      icon: <AccountBalanceIcon />,
      color: 'info',
      gradient: `linear-gradient(135deg, ${COLORS.amber} 0%, #a67c2e 100%)`,
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
              borderRadius: '16px',
              boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
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
                      fontFamily: 'JetBrains Mono, monospace',
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                    size="small"
                    icon={card.change > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  />
                )}
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                {card.title}
              </Typography>
              <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5, fontFamily: 'JetBrains Mono, monospace' }}>
                {formatCurrency(card.value)}
              </Typography>
              {card.change !== null && (
                <Typography variant="caption" sx={{ opacity: 0.8, fontFamily: 'Inter, sans-serif' }}>
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
