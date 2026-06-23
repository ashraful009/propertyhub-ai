import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '../../services/admin.service';
import toast from 'react-hot-toast';

export const useVendorApplications = () => {
  return useQuery({
    queryKey: ['vendorApplications'],
    queryFn: () => AdminService.getVendorApplications(),
  });
};

export const useReviewApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, user_id }: { id: string; status: 'APPROVED' | 'REJECTED'; user_id: string }) =>
      AdminService.reviewApplication(id, status, user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorApplications'] });
      toast.success('Application reviewed successfully');
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Failed to review application');
    },
  });
};

export const usePolicies = (type?: string) => {
  return useQuery({
    queryKey: ['policies', type],
    queryFn: () => AdminService.getPolicies(type),
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminService.createPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Policy created successfully');
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Failed to create policy');
    },
  });
};

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) => AdminService.updatePolicy(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Policy updated successfully');
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Failed to update policy');
    },
  });
};

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminService.deletePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Policy deleted successfully');
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Failed to delete policy');
    },
  });
};
