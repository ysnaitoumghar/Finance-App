import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, useTheme } from '@mui/material';
import { formatCurrency, formatPercentage } from '../../utils/currencyFormatter';

const BudgetChart = ({ data }) => {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Budget Utilization
          </Typography>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            height={200}
          >
            <Typography variant="body2" color="text.secondary">
              No budget data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return theme.palette.error.main;
    if (percentage >= 80) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Budget Utilization
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {data.map((item, index) => {
            const percentage = item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
            const remaining = item.budgeted - item.spent;
            const isOverBudget = remaining < 0;

            return (
              <Box key={index}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body 2" fontWeight="medium">
                    {item.category}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={isOverBudget ? 'error.main' : 'text.secondary'}
                    fontWeight="medium"
                  >
                    {formatCurrency(item.spent)} / {formatCurrency(item.budgeted)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(percentage, 100)}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getProgressColor(percentage),
                      borderRadius: 5
                    }
                  }}
                />
                <Box display="flex" justifyContent="space-between" mt={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {formatPercentage(percentage)} used
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={isOverBudget ? 'error.main' : 'success.main'}
                  >
                    {isOverBudget 
                      ? `Over by ${formatCurrency(Math.abs(remaining))}`
                      : `${formatCurrency(remaining)} remaining`
                    }
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
