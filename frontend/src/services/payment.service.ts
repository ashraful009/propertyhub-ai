import apiClient from '../config/axios';
import type { ApiSuccessResponse } from '../types/shared.types';

export const PaymentService = {
  createCheckoutSession: async (payload: { booking_id: string; milestone_id?: string; amount: number; description?: string }): Promise<{ checkout_url: string }> => {
    const { data } = await apiClient.post<ApiSuccessResponse<{ checkout_url: string }>>('/payment/create-session', payload);
    return data.data;
  },

  verifyPayment: async (session_id: string): Promise<void> => {
    await apiClient.post<ApiSuccessResponse<void>>('/payment/verify', { session_id });
  },
};
