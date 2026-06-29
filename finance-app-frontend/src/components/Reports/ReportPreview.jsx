import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Divider, useTheme } from '@mui/material';
import { formatCurrency } from '../../utils/currencyFormatter';

const ReportPreview = React.forwardRef(({ data, dateRange }, ref) => {
  const theme = useTheme();

  if (!data) return null;

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: 'background.paper' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
        Financial Report
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom align="center">
        {dateRange?.label || 'Custom Date Range'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom align="center" sx={{ mb: 4 }}>
        Generated on {new Date().toLocaleDateString()}
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h5" gutterBottom fontWeight="bold">
        Summary
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: `${theme.palette.success.main}10` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Income
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.success.main}>
                {formatCurrency(data.summary?.income || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: `${theme.palette.error.main}10` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Expenses
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.error.main}>
                {formatCurrency(data.summary?.expenses || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: `${theme.palette.primary.main}10` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Net Savings
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.primary.main}>
                {formatCurrency(data.summary?.savings || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: `${theme.palette.info.main}10` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Budget Remaining
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.info.main}>
                {formatCurrency(data.summary?.budgetRemaining || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h5" gutterBottom fontWeight="bold">
        Expenses by Category
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        {data.byCategory?.map((item, index) => (
          <Box 
            key={index} 
            display="flex" 
            justifyContent="space-between" 
            py={1}
            borderBottom="1px solid"
            borderColor="divider"
          >
            <Typography variant="body1">{item.category}</Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatCurrency(item.amount)} ({item.percentage.toFixed(1)}%)
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h5" gutterBottom fontWeight="bold">
        Budget Status
      </Typography>
      
      <Box>
        {data.budgetStatus?.map((item, index) => {
          const percentage = item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
          const remaining = item.budgeted - item.spent;
          
          return (
            <Box 
              key={index} 
              display="flex" 
              justifyContent="space-between" 
              py={1}
              borderBottom="1px solid"
              borderColor="divider"
            >
              <Typography variant="body1">{item.category}</Typography>
              <Typography 
                variant="body1" 
                fontWeight="medium"
                color={remaining < 0 ? 'error.main' : 'text.primary'}
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
