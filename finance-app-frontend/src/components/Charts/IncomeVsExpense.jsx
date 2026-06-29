import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import { formatCurrency } from '../../utils/currencyFormatter';

const IncomeVsExpense = ({ data }) => {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <Card sx={{ height: 400, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Income vs Expenses
          </Typography>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            height={300}
          >
            <Typography variant="body2" color="text.secondary">
              No comparison data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    month: item.month,
    income: item.income || 0,
    expenses: item.expenses || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            borderRadius: 1,
            boxShadow: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              color={entry.color}
              sx={{ display: 'block' }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: 400, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Income vs Expenses
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke={theme.palette.text.secondary}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              stroke={theme.palette.text.secondary}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="income" 
              fill={theme.palette.success.main}
              name="Income"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              fill={theme.palette.error.main}
              name="Expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeVsExpense;
