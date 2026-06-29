import axiosInstance from './api';

export const createBudget = async (userId, budgetData) => {
  return axiosInstance.post('/budgets', budgetData, {
    params: { userId }
  });
};

export const getBudgets = async (userId) => {
  return axiosInstance.get('/budgets', {
    params: { userId }
  });
};

export const getBudgetStatus = async (budgetId) => {
  return axiosInstance.get(`/budgets/${budgetId}/status`);
};

export const updateBudget = async (budgetId, budgetData) => {
  return axiosInstance.put(`/budgets/${budgetId}`, budgetData);
};

export const deleteBudget = async (budgetId) => {
  return axiosInstance.delete(`/budgets/${budgetId}`);
};
