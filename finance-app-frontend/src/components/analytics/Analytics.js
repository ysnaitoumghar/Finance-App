import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { COLORS as THEME_COLORS } from '../../theme';

const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];

function Analytics({ analytics }) {
  const chartData = Object.entries(analytics?.byCategory || {}).map(([category, amount]) => ({
    name: category,
    value: parseFloat(amount) || 0
  }));

  return (
    <Paper sx={{ p: 3, bgcolor: THEME_COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${THEME_COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: THEME_COLORS.text, mb: 2 }}>
        Expense Analytics
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ color: THEME_COLORS.textDim, fontFamily: 'Inter, sans-serif', mb: 0.5 }}>
          Total Expenses
        </Typography>
        <Typography variant="h4" sx={{ color: THEME_COLORS.gold, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
          ₹{parseFloat(analytics?.totalExpense || 0).toFixed(2)}
        </Typography>
      </Box>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body1" sx={{ color: THEME_COLORS.textDim, fontFamily: 'Inter, sans-serif', textAlign: 'center', mt: 2 }}>
          No expense data available
        </Typography>
      )}
    </Paper>
  );
}

export default Analytics;
