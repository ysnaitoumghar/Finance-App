import axiosInstance from './api';

export const createSharedExpense = async (groupId, expenseData) => {
  return axiosInstance.post('/shared-expenses', expenseData, {
    params: { groupId }
  });
};

export const getSharedExpenses = async (groupId) => {
  return axiosInstance.get('/shared-expenses', {
    params: { groupId }
  });
};

export const settleExpense = async (splitId) => {
  return axiosInstance.post(`/shared-expenses/splits/${splitId}/settle`);
};

export const getAmountOwed = async (userId, groupId) => {
  return axiosInstance.get('/shared-expenses/owed', {
    params: { userId, groupId }
  });
};
