import axiosInstance from './api';

export const addExpense = async (userId, expenseData) => {
  return axiosInstance.post('/expenses', expenseData, {
    params: { userId }
  });
};

export const getExpenses = async (userId, startDate, endDate) => {
  return axiosInstance.get('/expenses', {
    params: { userId, startDate, endDate }
  });
};

export const getExpenseAnalytics = async (userId, startDate, endDate) => {
  return axiosInstance.get('/expenses/analytics', {
    params: { userId, startDate, endDate }
  });
};

export const updateExpense = async (expenseId, expenseData) => {
  return axiosInstance.put(`/expenses/${expenseId}`, expenseData);
};

export const deleteExpense = async (expenseId) => {
  return axiosInstance.delete(`/expenses/${expenseId}`);
};
