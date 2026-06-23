import { create } from 'zustand';

interface BookingState {
  propertyId: string | null;
  selectedBookingMoney: number | null;
  selectedDurationMonths: number | null;
  setBookingPlan: (propertyId: string, bookingMoney: number, durationMonths: number) => void;
  clearBookingPlan: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  propertyId: null,
  selectedBookingMoney: null,
  selectedDurationMonths: null,

  setBookingPlan: (propertyId, bookingMoney, durationMonths) => {
    set({
      propertyId,
      selectedBookingMoney: bookingMoney,
      selectedDurationMonths: durationMonths,
    });
  },

  clearBookingPlan: () => {
    set({
      propertyId: null,
      selectedBookingMoney: null,
      selectedDurationMonths: null,
    });
  },
}));
