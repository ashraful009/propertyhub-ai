import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InstallmentService } from '../../services/installment.service';
import toast from 'react-hot-toast';

export const useInstallmentSchedule = (booking_id: string | null) => {
  return useQuery({
    queryKey: ['installments', booking_id],
    queryFn: () => InstallmentService.getInstallmentSchedule(booking_id!),
    enabled: !!booking_id,
  });
};

export const useGenerateInstallments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ booking_id, totalDue, totalInstallments }: { booking_id: string; totalDue: number; totalInstallments: number }) =>
      InstallmentService.generateInstallments(booking_id, totalDue, totalInstallments),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['installments', variables.booking_id] });
      toast.success('Installment schedule generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to generate installments');
    },
  });
};
