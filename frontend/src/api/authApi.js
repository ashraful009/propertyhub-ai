import axiosInstance from './axiosInstance';

export const loginApi = (credentials) => axiosInstance.post('/auth/login', credentials);
export const registerApi = (userData) => axiosInstance.post('/auth/register', userData);
export const verifyOtpApi = (data) => axiosInstance.post('/auth/verify-otp', data);
export const logoutApi = () => axiosInstance.post('/auth/logout');
export const getMeApi = () => axiosInstance.get('/auth/me');
