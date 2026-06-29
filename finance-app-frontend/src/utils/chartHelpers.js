export const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#2e7d32',
  warning: '#ed6c02',
  info: '#0288d1',
  categories: [
    '#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#0288d1',
    '#7b1fa2', '#c2185b', '#00695c', '#f57c00', '#455a64'
  ]
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

export const getChartConfig = (type) => {
  const baseConfig = {
    responsive: true,
    maintainAspectRatio: true,
  };

  switch (type) {
    case 'pie':
      return {
        ...baseConfig,
        innerRadius: 60,
        outerRadius: 80,
        paddingAngle: 5,
        label: false
      };
    case 'line':
      return {
        ...baseConfig,
        dot: { r: 4 },
        activeDot: { r: 6 },
        strokeWidth: 2
      };
    case 'bar':
      return {
        ...baseConfig,
        barSize: 40,
        radius: [4, 4, 0, 0]
      };
    default:
      return baseConfig;
  }
};
