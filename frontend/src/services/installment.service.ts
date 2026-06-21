import apiClient from '../config/axios';
import type { InstallmentPreview, InstallmentSchedule, ApiSuccessResponse, IInstallmentPlan } from '../types/shared.types';

export const InstallmentService = {
  previewInstallment: async (totalDue: number, totalInstallments: number): Promise<InstallmentPreview> => {
    const { data } = await apiClient.post<ApiSuccessResponse<InstallmentPreview>>('/installments/preview', { totalDue, totalInstallments });
    return data.data;
  },

  generateInstallments: async (booking_id: string, totalDue: number, totalInstallments: number): Promise<IInstallmentPlan> => {
    const { data } = await apiClient.post<ApiSuccessResponse<IInstallmentPlan>>('/installments/generate', { booking_id, totalDue, totalInstallments });
    return data.data;
  },

  getInstallmentSchedule: async (booking_id: string): Promise<InstallmentSchedule> => {
    const { data } = await apiClient.get<ApiSuccessResponse<InstallmentSchedule>>(`/installments/schedule/${booking_id}`);
    return data.data;
  },
};
