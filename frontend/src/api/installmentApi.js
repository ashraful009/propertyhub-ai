import axiosInstance from './axiosInstance';

export const getInstallmentsApi = (bookingId) => axiosInstance.get(`/installments/booking/${bookingId}`);
export const setupInstallmentPlanApi = (data) => axiosInstance.post('/installments/setup', data);
export const createInstallmentPaymentSessionApi = (installmentId) => axiosInstance.post(`/installments/${installmentId}/payment-session`);
export const confirmInstallmentPaymentApi = (data) => axiosInstance.post('/installments/confirm', data);
