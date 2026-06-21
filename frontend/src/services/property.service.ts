import apiClient from '../config/axios';
import type { IProperty, ApiSuccessResponse } from '../types/shared.types';

export const PropertyService = {
  getAllProperties: async (): Promise<IProperty[]> => {
    const { data } = await apiClient.get<ApiSuccessResponse<IProperty[]>>('/properties');
    return data.data;
  },

  searchProperties: async (filters: any): Promise<IProperty[]> => {
    const params = new URLSearchParams(filters).toString();
    const { data } = await apiClient.get<ApiSuccessResponse<IProperty[]>>(`/search/properties?${params}`);
    return data.data;
  },

  compareProperties: async (ids: string[]): Promise<IProperty[]> => {
    const { data } = await apiClient.get<ApiSuccessResponse<IProperty[]>>(`/compare/properties?ids=${ids.join(',')}`);
    return data.data;
  },
};
