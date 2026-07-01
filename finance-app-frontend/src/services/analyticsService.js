import axiosInstance from './api';

export const getSummary = (userId, startDate, endDate) => {
  return axiosInstance.get('/analytics/summary', {
    params: { userId, startDate, endDate }
  });
};

export const getByCategory = (userId, startDate, endDate) => {
  return axiosInstance.get('/analytics/by-category', {
    params: { userId, startDate, endDate }
  });
};

export const getTrend = (userId, startDate, endDate) => {
  return axiosInstance.get('/analytics/trend', {
    params: { userId, startDate, endDate }
  });
};

export const getBudgetStatus = (userId, startDate, endDate) => {
  return axiosInstance.get('/analytics/budget-status', {
    params: { userId, startDate, endDate }
  });
};

export const getAllAnalytics = async (userId, startDate, endDate) => {
  try {
    const [summary, category, trend, budget, expenses] = await Promise.all([
      getSummary(userId, startDate, endDate),
      getByCategory(userId, startDate, endDate),
      getTrend(userId, startDate, endDate),
      getBudgetStatus(userId, startDate, endDate),
      axiosInstance.get('/expenses', { params: { userId, startDate, endDate } }),
    ]);

    return {
      summary: summary.data,
      categoryBreakdown: category.data,
      monthlyTrends: trend.data,
      budgetStatus: budget.data,
      recentTransactions: expenses.data || [],
    };
  } catch (error) {
    throw error;
  }
};
