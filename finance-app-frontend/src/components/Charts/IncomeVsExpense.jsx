import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import { formatCurrency } from '../../utils/currencyFormatter';
import { COLORS } from '../../theme';

const IncomeVsExpense = ({ data }) => {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <Card sx={{ height: 400, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
            Income vs Expenses
          </Typography>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            height={300}
          >
            <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
              No comparison data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const chartData = (data || []).map(item => ({
    month: item.month,
    income: item.income || 0,
    expenses: item.expenses || 0
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: COLORS.panel,
            backdropFilter: 'blur(20px)',
            p: 1.5,
            borderRadius: '10px',
            boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)',
            border: `1px solid ${COLORS.panelBorder}`,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text, fontFamily: 'Inter, sans-serif', mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color, fontFamily: 'JetBrains Mono, monospace', display: 'block' }}
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
    <Card sx={{ height: 400, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
          Income vs Expenses
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.panelBorder} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke={COLORS.textDim}
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              stroke={COLORS.textDim}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="income" 
              fill={COLORS.emerald}
              name="Income"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              fill={COLORS.red}
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
