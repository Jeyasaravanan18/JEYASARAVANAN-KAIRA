import { describe, expect, it } from 'vitest';
import { formatCurrency } from '../lib/format/currency';
import { formatEventDate } from '../lib/format/date';

describe('intl formatting', () => {
  it('formats currencies and zoned dates', () => {
    expect(formatCurrency(100, 'JPY', 'ja')).toContain('￥');
    expect(formatEventDate('2026-10-10T09:30:00.000Z', 'en', 'Asia/Tokyo')).toContain('GMT');
  });
});
