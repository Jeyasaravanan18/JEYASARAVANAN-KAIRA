import type { CurrencyCode } from '../../types';

export const rates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.2,
  JPY: 149.4,
  AED: 3.67,
};

export function convertFromUsd(amountUsd: number, currency: CurrencyCode): number {
  return amountUsd * rates[currency];
}

export function formatCurrency(amountUsd: number, currency: CurrencyCode, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(convertFromUsd(amountUsd, currency));
}
