import axiosInstance from './axiosInstance';

export const getPoliciesApi = () => axiosInstance.get('/policies');
export const updatePolicyApi = (id, data) => axiosInstance.put(`/policies/${id}`, data);
export const getBookingPoliciesApi = () => axiosInstance.get('/booking-policies');
