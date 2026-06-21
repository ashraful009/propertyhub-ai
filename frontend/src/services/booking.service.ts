import apiClient from '../config/axios';
import type { IBooking, ApiSuccessResponse } from '../types/shared.types';

export const BookingService = {
  createBooking: async (payload: { property_id: string; vendor_id: string; booking_amount: number }): Promise<IBooking> => {
    const { data } = await apiClient.post<ApiSuccessResponse<IBooking>>('/bookings', payload);
    return data.data;
  },

  getBookings: async (): Promise<IBooking[]> => {
    const { data } = await apiClient.get<ApiSuccessResponse<IBooking[]>>('/bookings');
    return data.data;
  },

  updateBookingStatus: async (id: string, status: string): Promise<IBooking> => {
    const { data } = await apiClient.put<ApiSuccessResponse<IBooking>>(`/bookings/${id}/status`, { status });
    return data.data;
  },
};
