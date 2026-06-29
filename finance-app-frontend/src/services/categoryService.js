import axiosInstance from './api';

export const addCategory = async (userId, categoryData) => {
  return axiosInstance.post('/categories', categoryData, {
    params: { userId }
  });
};

export const getCategories = async (userId, type) => {
  return axiosInstance.get('/categories', {
    params: { userId, type }
  });
};

export const updateCategory = async (categoryId, categoryData) => {
  return axiosInstance.put(`/categories/${categoryId}`, categoryData);
};

export const deleteCategory = async (categoryId) => {
  return axiosInstance.delete(`/categories/${categoryId}`);
};
