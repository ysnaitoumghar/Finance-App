import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Divider, useTheme, alpha } from '@mui/material';
import { formatCurrency } from '../../utils/currencyFormatter';
import { COLORS } from '../../theme';

const ReportPreview = React.forwardRef(({ data, dateRange }, ref) => {
  const theme = useTheme();

  if (!data) return null;

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px' }}>
      <Typography variant="h4" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, textAlign: 'center', mb: 1 }}>
        Financial Report
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', textAlign: 'center', mb: 0.5 }}>
        {dateRange?.label || 'Custom Date Range'}
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', textAlign: 'center', mb: 4 }}>
        Generated on {new Date().toLocaleDateString()}
      </Typography>

      <Divider sx={{ mb: 4, borderColor: COLORS.panelBorder }} />

      <Typography variant="h5" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
        Summary
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(COLORS.emerald, 0.1), border: `1px solid ${COLORS.panelBorder}`, borderRadius: '12px' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                Total Income
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: COLORS.emerald, fontFamily: 'JetBrains Mono, monospace' }}>
                {formatCurrency(data.summary?.income || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(COLORS.red, 0.1), border: `1px solid ${COLORS.panelBorder}`, borderRadius: '12px' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                Total Expenses
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: COLORS.red, fontFamily: 'JetBrains Mono, monospace' }}>
                {formatCurrency(data.summary?.expenses || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(COLORS.gold, 0.1), border: `1px solid ${COLORS.panelBorder}`, borderRadius: '12px' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                Net Savings
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: COLORS.gold, fontFamily: 'JetBrains Mono, monospace' }}>
                {formatCurrency(data.summary?.savings || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(COLORS.amber, 0.1), border: `1px solid ${COLORS.panelBorder}`, borderRadius: '12px' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                Budget Remaining
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: COLORS.amber, fontFamily: 'JetBrains Mono, monospace' }}>
                {formatCurrency(data.summary?.budgetRemaining || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4, borderColor: COLORS.panelBorder }} />

      <Typography variant="h5" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
        Expenses by Category
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        {data.byCategory?.map((item, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            py={1}
            sx={{ borderBottom: `1px solid ${COLORS.panelBorder}` }}
          >
            <Typography variant="body1" sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{item.category}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: COLORS.text, fontFamily: 'JetBrains Mono, monospace' }}>
              {formatCurrency(item.amount)} ({(item.percentage || 0).toFixed(1)}%)
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 4, borderColor: COLORS.panelBorder }} />

      <Typography variant="h5" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
        Budget Status
      </Typography>
      
      <Box>
        {data.budgetStatus?.map((item, index) => {
          const percentage = (item.budgeted || 0) > 0 ? (item.spent / item.budgeted) * 100 : 0;
          const remaining = (item.budgeted || 0) - item.spent;
          
          return (
            <Box 
              key={index} 
              display="flex" 
              justifyContent="space-between" 
              py={1}
              sx={{ borderBottom: `1px solid ${COLORS.panelBorder}` }}
            >
              <Typography variant="body1" sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{item.category}</Typography>
              <Typography 
                variant="body1" 
                sx={{
                  fontWeight: 600,
                  color: remaining < 0 ? COLORS.red : COLORS.text,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {formatCurrency(item.spent)} / {formatCurrency(item.budgeted)}
                ({percentage.toFixed(1)}%)
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
});

ReportPreview.displayName = 'ReportPreview';

export default ReportPreview;
