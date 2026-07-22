import axiosInstance from './axiosInstance';

export const getPropertiesApi = (params) => axiosInstance.get('/properties', { params });
export const getPropertyByIdApi = (id) => axiosInstance.get(`/properties/${id}`);
export const createPropertyApi = (formData) => axiosInstance.post('/properties', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updatePropertyApi = (id, data) => axiosInstance.put(`/properties/${id}`, data);
export const deletePropertyApi = (id) => axiosInstance.delete(`/properties/${id}`);
export const updatePropertyStatusApi = (id, status) => axiosInstance.put(`/properties/${id}/status`, { status });
