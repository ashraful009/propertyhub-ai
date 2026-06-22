import apiClient from '../config/axios';
import type { AdminDashboardData, IVendorApplication, ApiSuccessResponse, IPolicy, IProperty } from '../types/shared.types';

export const AdminService = {
  getDashboard: async (): Promise<AdminDashboardData> => {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminDashboardData>>('/admin/dashboard');
    return data.data;
  },

  getVendorApplications: async (): Promise<IVendorApplication[]> => {
    const { data } = await apiClient.get<ApiSuccessResponse<IVendorApplication[]>>('/admin/vendor-applications');
    return data.data;
  },

  reviewApplication: async (id: string, status: 'APPROVED' | 'REJECTED', user_id: string): Promise<IVendorApplication> => {
    const { data } = await apiClient.put<ApiSuccessResponse<IVendorApplication>>(`/admin/vendor-applications/${id}/status`, { status, user_id });
    return data.data;
  },

  getPendingProperties: async (): Promise<IProperty[]> => {
    const { data } = await apiClient.get<ApiSuccessResponse<IProperty[]>>('/admin/property-requests');
    return data.data;
  },

  reviewPropertyRequest: async (id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> => {
    await apiClient.put<ApiSuccessResponse<void>>(`/admin/property-requests/${id}/review`, { status });
  },

  getPolicies: async (type?: string): Promise<IPolicy[]> => {
    const { data } = await apiClient.get<ApiSuccessResponse<IPolicy[]>>(`/vendor-policy/policies${type ? `?type=${type}` : ''}`);
    return data.data;
  },

  createPolicy: async (payload: { policy_type: string; title: string; content: string; is_mandatory?: boolean }): Promise<IPolicy> => {
    const { data } = await apiClient.post<ApiSuccessResponse<IPolicy>>('/vendor-policy/policies', payload);
    return data.data;
  },

  updatePolicy: async (id: string, payload: { title: string; content: string }): Promise<IPolicy> => {
    const { data } = await apiClient.put<ApiSuccessResponse<IPolicy>>(`/vendor-policy/policies/${id}`, payload);
    return data.data;
  },

  deletePolicy: async (id: string): Promise<void> => {
    await apiClient.delete<ApiSuccessResponse<void>>(`/vendor-policy/policies/${id}`);
  },
};
