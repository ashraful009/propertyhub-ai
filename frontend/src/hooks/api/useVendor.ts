import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VendorService } from '../../services/vendor.service';
import toast from 'react-hot-toast';

export const useSubmitVendorApplication = () => {
  return useMutation({
    mutationFn: VendorService.submitApplication,
    onSuccess: () => {
      toast.success('Vendor application submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    },
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: VendorService.createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create property');
    },
  });
};
