import { describe, expect, it } from 'vitest';
import { calculatePrice } from '../lib/booking/pricing';
import { events, addOns } from '../lib/mock/events';

describe('price calculation', () => {
  it('applies fees, tax, add-ons, and TEAM10 discount', () => {
    const event = events[0];
    const result = calculatePrice(event, [{ eventId: event.id, tierId: 'standard', quantity: 2, seatIds: [] }], [addOns[0]], 'TEAM10');
    expect(result.subtotalUsd).toBe(event.tiers[0].priceUsd * 2);
    expect(result.feesUsd).toBe(event.tiers[0].feeUsd * 2);
    expect(result.discountUsd).toBeGreaterThan(0);
    expect(result.totalUsd).toBeGreaterThan(result.subtotalUsd);
  });
});
