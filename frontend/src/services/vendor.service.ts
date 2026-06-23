import apiClient from '../config/axios';
import type { VendorDashboardData, IProperty, ApiSuccessResponse } from '../types/shared.types';

export const VendorService = {
  getDashboard: async (): Promise<VendorDashboardData> => {
    const { data } = await apiClient.get<ApiSuccessResponse<VendorDashboardData>>('/vendor/dashboard');
    return data.data;
  },

  sendReminder: async (customerId: string): Promise<void> => {
    await apiClient.post<ApiSuccessResponse<void>>(`/vendor/customers/${customerId}/remind`);
  },

  getProperties: async (): Promise<IProperty[]> => {
    const { data } = await apiClient.get<ApiSuccessResponse<IProperty[]>>('/vendor/properties');
    return data.data;
  },

  getPropertyById: async (id: string): Promise<IProperty> => {
    const { data } = await apiClient.get<ApiSuccessResponse<IProperty>>(`/vendor/properties/${id}`);
    return data.data;
  },

  createProperty: async (formData: FormData): Promise<IProperty> => {
    const { data } = await apiClient.post<ApiSuccessResponse<IProperty>>('/vendor/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  updateProperty: async (id: string, propertyData: any /* eslint-disable-line @typescript-eslint/no-explicit-any */): Promise<IProperty> => {
    const { data } = await apiClient.put<ApiSuccessResponse<IProperty>>(`/vendor/properties/${id}`, propertyData);
    return data.data;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await apiClient.delete<ApiSuccessResponse<void>>(`/vendor/properties/${id}`);
  },

  submitApplication: async (payload: any): Promise<any /* eslint-disable-line @typescript-eslint/no-explicit-any */> => {
    const { data } = await apiClient.post<ApiSuccessResponse<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>>('/customer/vendor-apply', payload);
    return data.data;
  },

  getPolicy: async (): Promise<string> => {
    const { data } = await apiClient.get<ApiSuccessResponse<string>>('/vendor-policy/policy');
    return data.data;
  },
};
