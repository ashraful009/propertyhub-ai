import axiosInstance from './axiosInstance';

export const getCompaniesApi = () => axiosInstance.get('/companies');
export const createCompanyApi = (data) => axiosInstance.post('/companies', data);
export const approveCompanyApi = (id, status) => axiosInstance.put(`/companies/${id}/status`, { status });
