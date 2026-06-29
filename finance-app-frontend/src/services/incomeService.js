import axiosInstance from './api';

export const addIncome = async (userId, incomeData) => {
  return axiosInstance.post('/income', incomeData, {
    params: { userId }
  });
};

export const getIncomes = async (userId, startDate, endDate) => {
  return axiosInstance.get('/income', {
    params: { userId, startDate, endDate }
  });
};

export const updateIncome = async (incomeId, incomeData) => {
  return axiosInstance.put(`/income/${incomeId}`, incomeData);
};

export const deleteIncome = async (incomeId) => {
  return axiosInstance.delete(`/income/${incomeId}`);
};
