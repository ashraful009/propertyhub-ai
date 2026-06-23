import apiClient from '../config/axios';
import type { CustomerDashboardData, ApiSuccessResponse } from '../types/shared.types';

export const CustomerService = {
  getDashboard: async (): Promise<CustomerDashboardData> => {
    const { data } = await apiClient.get<ApiSuccessResponse<CustomerDashboardData>>('/customer/dashboard');
    return data.data;
  },

  requestCancellation: async (booking_id: string): Promise<unknown> => {
    const { data } = await apiClient.post<ApiSuccessResponse<unknown>>('/refunds/cancel', { booking_id });
    return data.data;
  },
};
