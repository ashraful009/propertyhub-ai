import { useMutation } from '@tanstack/react-query';
import { PaymentService } from '../../services/payment.service';
import toast from 'react-hot-toast';

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: PaymentService.createCheckoutSession,
    onSuccess: (data) => {

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Failed to initialize payment');
    },
  });
};

export const useGetReceipt = () => {
  return useMutation({
    mutationFn: PaymentService.getReceipt,
    onSuccess: (data) => {

      if (data.receipt_url) {
        window.open(data.receipt_url, '_blank');
        toast.success('Receipt generated successfully');
      }
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Failed to get receipt');
    },
  });
};
