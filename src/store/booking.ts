import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking, CartLine } from '../types';

interface BookingState {
  lines: CartLine[];
  addOns: string[];
  discountCode: string;
  bookings: Booking[];
  holdUntil: string | null;
  setLine: (line: CartLine) => void;
  removeLine: (eventId: string, tierId: string) => void;
  toggleSeat: (eventId: string, tierId: string, seatId: string) => void;
  toggleAddOn: (id: string) => void;
  setDiscountCode: (code: string) => void;
  beginHold: () => void;
  clearCart: () => void;
  addBooking: (booking: Booking) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      lines: [],
      addOns: [],
      discountCode: '',
      bookings: [],
      holdUntil: null,
      setLine: (line) =>
        set((state) => ({
          lines: [...state.lines.filter((item) => !(item.eventId === line.eventId && item.tierId === line.tierId)), line].filter((item) => item.quantity > 0 || item.seatIds.length > 0),
        })),
      removeLine: (eventId, tierId) => set((state) => ({ lines: state.lines.filter((item) => !(item.eventId === eventId && item.tierId === tierId)) })),
      toggleSeat: (eventId, tierId, seatId) =>
        set((state) => {
          const current = state.lines.find((item) => item.eventId === eventId && item.tierId === tierId) ?? { eventId, tierId, quantity: 0, seatIds: [] };
          const seatIds = current.seatIds.includes(seatId) ? current.seatIds.filter((id) => id !== seatId) : [...current.seatIds, seatId];
          return { lines: [...state.lines.filter((item) => !(item.eventId === eventId && item.tierId === tierId)), { ...current, seatIds }] };
        }),
      toggleAddOn: (id) => set((state) => ({ addOns: state.addOns.includes(id) ? state.addOns.filter((item) => item !== id) : [...state.addOns, id] })),
      setDiscountCode: (discountCode) => set({ discountCode }),
      beginHold: () => set({ holdUntil: new Date(Date.now() + 600_000).toISOString() }),
      clearCart: () => set({ lines: [], addOns: [], discountCode: '', holdUntil: null }),
      addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
    }),
    { name: 'assembly-booking' },
  ),
);
