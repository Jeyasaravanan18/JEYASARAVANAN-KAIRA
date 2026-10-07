export type LanguageCode = 'en' | 'hi' | 'ta' | 'es' | 'fr' | 'ar' | 'ja';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'AED';
export type EventFormat = 'in-person' | 'virtual' | 'hybrid';
export type TicketStatus = 'available' | 'limited' | 'sold-out';

export interface TicketTier {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  feeUsd: number;
  available: number;
  maxPerOrder: number;
  status: TicketStatus;
}

export interface Seat {
  id: string;
  section: string;
  row: string;
  number: number;
  status: 'available' | 'held' | 'sold';
  priceUsd: number;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  city: string;
  country: string;
  venue: string;
  timezone: string;
  startsAt: string;
  endsAt: string;
  language: string;
  format: EventFormat;
  accessibility: string[];
  image: string;
  summary: string;
  organizer: string;
  seated: boolean;
  tiers: TicketTier[];
  seats?: Seat[];
}

export interface CartLine {
  eventId: string;
  tierId: string;
  quantity: number;
  seatIds: string[];
}

export interface AddOn {
  id: string;
  labelKey: string;
  priceUsd: number;
}

export interface Booking {
  id: string;
  reference: string;
  eventId: string;
  lines: CartLine[];
  addOns: string[];
  attendee: {
    name: string;
    email: string;
    phone: string;
  };
  totalUsd: number;
  createdAt: string;
  status: 'upcoming' | 'past' | 'cancelled';
}
