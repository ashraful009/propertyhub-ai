import axiosInstance from './axiosInstance';

export const getBookingsApi = (params) => axiosInstance.get('/bookings', { params });
export const getBookingByIdApi = (id) => axiosInstance.get(`/bookings/${id}`);
export const createBookingApi = (data) => axiosInstance.post('/bookings', data);
export const cancelBookingApi = (id, reason) => axiosInstance.post(`/bookings/${id}/cancel`, { reason });
export const checkoutBookingApi = (data) => axiosInstance.post('/checkout', data);
