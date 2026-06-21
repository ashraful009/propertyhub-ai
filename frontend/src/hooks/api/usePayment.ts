import { useMutation } from '@tanstack/react-query';
import { PaymentService } from '../../services/payment.service';
import toast from 'react-hot-toast';

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: PaymentService.createCheckoutSession,
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to initialize payment');
    },
  });
};
