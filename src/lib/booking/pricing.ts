import type { AddOn, CartLine, EventItem } from '../../types';

export interface PriceBreakdown {
  subtotalUsd: number;
  feesUsd: number;
  taxUsd: number;
  discountUsd: number;
  addOnsUsd: number;
  totalUsd: number;
}

export function calculatePrice(event: EventItem, lines: CartLine[], addOns: AddOn[], discountCode?: string): PriceBreakdown {
  const subtotalUsd = lines.reduce((sum, line) => {
    const tier = event.tiers.find((item) => item.id === line.tierId);
    const ticketCount = line.quantity + line.seatIds.length;
    return sum + (tier ? tier.priceUsd * ticketCount : 0);
  }, 0);
  const feesUsd = lines.reduce((sum, line) => {
    const tier = event.tiers.find((item) => item.id === line.tierId);
    return sum + (tier ? tier.feeUsd * (line.quantity + line.seatIds.length) : 0);
  }, 0);
  const addOnsUsd = addOns.reduce((sum, item) => sum + item.priceUsd, 0);
  const discountUsd = discountCode?.toUpperCase() === 'TEAM10' ? (subtotalUsd + addOnsUsd) * 0.1 : 0;
  const taxable = Math.max(subtotalUsd + feesUsd + addOnsUsd - discountUsd, 0);
  const taxUsd = taxable * 0.0825;
  return {
    subtotalUsd,
    feesUsd,
    addOnsUsd,
    discountUsd,
    taxUsd,
    totalUsd: taxable + taxUsd,
  };
}
