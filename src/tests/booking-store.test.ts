import { describe, expect, it } from 'vitest';
import { useBookingStore } from '../store/booking';

describe('booking store', () => {
  it('sets quantities and toggles add-ons', () => {
    useBookingStore.getState().clearCart();
    useBookingStore.getState().setLine({ eventId: 'evt-1', tierId: 'standard', quantity: 2, seatIds: [] });
    useBookingStore.getState().toggleAddOn('parking');
    expect(useBookingStore.getState().lines[0].quantity).toBe(2);
    expect(useBookingStore.getState().addOns).toContain('parking');
  });
});
