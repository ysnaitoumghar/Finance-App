import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, useTheme } from '@mui/material';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatPercentage } from '../../utils/chartHelpers';
import { COLORS } from '../../theme';

const BudgetChart = ({ data }) => {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <Card sx={{ bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
            Budget Utilization
          </Typography>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            height={200}
          >
            <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
              No budget data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return COLORS.red;
    if (percentage >= 80) return COLORS.amber;
    return COLORS.emerald;
  };

  return (
    <Card sx={{ bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
          Budget Utilization
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {data.map((item, index) => {
            const percentage = (item.budgeted || 0) > 0 ? (item.spent / item.budgeted) * 100 : 0;
            const remaining = (item.budgeted || 0) - item.spent;
            const isOverBudget = remaining < 0;

            return (
              <Box key={index}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>
                    {item.category}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: isOverBudget ? COLORS.red : COLORS.textDim,
                      fontWeight: 600,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
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
                    bgcolor: 'rgba(255,255,255,0.08)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getProgressColor(percentage),
                      borderRadius: 5
                    }
                  }}
                />
                <Box display="flex" justifyContent="space-between" mt={0.5}>
                  <Typography variant="caption" sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace' }}>
                    {formatPercentage(percentage)} used
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{
                      color: isOverBudget ? COLORS.red : COLORS.emerald,
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 600,
                    }}
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
