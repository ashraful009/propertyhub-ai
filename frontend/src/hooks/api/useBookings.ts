import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookingService } from '../../services/booking.service';
import toast from 'react-hot-toast';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => BookingService.getBookings(),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BookingService.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['customerDashboard'] });
    },
    onError: (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
      toast.error(error.response?.data?.error || 'Failed to create booking');
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => BookingService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['vendorDashboard'] });
    },
    onError: (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
      toast.error(error.response?.data?.error || 'Failed to update booking status');
    },
  });
};
