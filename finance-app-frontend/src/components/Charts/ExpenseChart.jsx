import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import { CHART_COLORS } from '../../utils/chartHelpers';
import { formatCurrency } from '../../utils/currencyFormatter';
import { COLORS } from '../../theme';

const ExpenseChart = ({ data }) => {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <Card sx={{ height: 400, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
            Expenses by Category
          </Typography>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            height={300}
          >
            <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
              No expense data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const chartData = (data || []).map((item, index) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
    color: CHART_COLORS.categories[index % CHART_COLORS.categories.length]
  }));

  const CustomTooltip = ({ active, payload }) => {
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
          <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>
            {payload[0].name}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace' }}>
            {formatCurrency(payload[0].value)}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace' }}>
            {payload[0].payload.percentage.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mt={2}>
        {payload.map((entry, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: entry.color
              }}
            />
            <Typography variant="caption" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Card sx={{ height: 400, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
          Expenses by Category
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
