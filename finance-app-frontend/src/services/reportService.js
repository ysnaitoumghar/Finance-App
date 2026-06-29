import axiosInstance from './api';

export const exportPDF = (data) => {
  return axiosInstance.post('/reports/export-pdf', data, {
    responseType: 'blob'
  });
};

export const exportCSV = (data) => {
  return axiosInstance.post('/reports/export-csv', data, {
    responseType: 'blob'
  });
};
