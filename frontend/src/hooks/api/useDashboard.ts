import { useQuery, useMutation } from '@tanstack/react-query';
import { CustomerService } from '../../services/customer.service';
import { VendorService } from '../../services/vendor.service';
import { AdminService } from '../../services/admin.service';

export const useCustomerDashboard = () => {
  return useQuery({
    queryKey: ['customerDashboard'],
    queryFn: () => CustomerService.getDashboard(),
  });
};

export const useVendorDashboard = () => {
  return useQuery({
    queryKey: ['vendorDashboard'],
    queryFn: () => VendorService.getDashboard(),
  });
};

export const useSendReminder = () => {
  return useMutation({
    mutationFn: VendorService.sendReminder,
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => AdminService.getDashboard(),
  });
};
