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
