import apiClient from '../config/axios';
import type { VendorDashboardData, IProperty, ApiSuccessResponse } from '../types/shared.types';

export const VendorService = {
  getDashboard: async (): Promise<VendorDashboardData> => {
    const { data } = await apiClient.get<ApiSuccessResponse<VendorDashboardData>>('/vendor/dashboard');
    return data.data;
  },

  createProperty: async (formData: FormData): Promise<IProperty> => {
    const { data } = await apiClient.post<ApiSuccessResponse<IProperty>>('/vendor/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  updateProperty: async (id: string, propertyData: any): Promise<IProperty> => {
    const { data } = await apiClient.put<ApiSuccessResponse<IProperty>>(`/vendor/properties/${id}`, propertyData);
    return data.data;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await apiClient.delete<ApiSuccessResponse<void>>(`/vendor/properties/${id}`);
  },

  submitApplication: async (payload: any): Promise<any> => {
    const { data } = await apiClient.post<ApiSuccessResponse<any>>('/customer/vendor-apply', payload);
    return data.data;
  },

  getPolicy: async (): Promise<string> => {
    const { data } = await apiClient.get<ApiSuccessResponse<string>>('/vendor-policy/policy');
    return data.data;
  },
};
