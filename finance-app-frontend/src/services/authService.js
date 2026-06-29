import axiosInstance from './api';

export const register = async (userData) => {
  return axiosInstance.post('/auth/register', userData);
};

export const login = async (credentials) => {
  return axiosInstance.post('/auth/login', credentials);
};

export const logout = async () => {
  return axiosInstance.post('/auth/logout');
};
