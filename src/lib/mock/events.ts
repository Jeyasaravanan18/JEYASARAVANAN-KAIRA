import type { EventItem, Seat } from '../../types';

const cities = [
  ['New York', 'United States', 'Pier 36'],
  ['London', 'United Kingdom', 'Barbican Centre'],
  ['Mumbai', 'India', 'Jio World Convention Centre'],
  ['Tokyo', 'Japan', 'Tokyo International Forum'],
  ['Dubai', 'United Arab Emirates', 'Museum of the Future'],
  ['Paris', 'France', 'Le Centquatre'],
  ['Barcelona', 'Spain', 'CCIB Barcelona'],
  ['Singapore', 'Singapore', 'Marina Bay Sands Expo'],
  ['Berlin', 'Germany', 'Kraftwerk Berlin'],
  ['Toronto', 'Canada', 'Evergreen Brick Works'],
] as const;

const categories = ['Design', 'Finance', 'Climate', 'Music', 'Technology', 'Food', 'Health', 'Education'];
const timezones: Record<string, string> = {
  'New York': 'America/New_York',
  London: 'Europe/London',
  Mumbai: 'Asia/Kolkata',
  Tokyo: 'Asia/Tokyo',
  Dubai: 'Asia/Dubai',
  Paris: 'Europe/Paris',
  Barcelona: 'Europe/Madrid',
  Singapore: 'Asia/Singapore',
  Berlin: 'Europe/Berlin',
  Toronto: 'America/Toronto',
};

function makeSeats(seed: number): Seat[] {
  return Array.from({ length: 36 }, (_, index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 6));
    const number = (index % 6) + 1;
    return {
      id: `s-${seed}-${row}${number}`,
      section: index < 18 ? 'Orchestra' : 'Balcony',
      row,
      number,
      status: index % 11 === 0 ? 'sold' : index % 7 === 0 ? 'held' : 'available',
      priceUsd: index < 18 ? 180 : 120,
    };
  });
}

export const events: EventItem[] = Array.from({ length: 32 }, (_, index) => {
  const city = cities[index % cities.length];
  const category = categories[index % categories.length];
  const month = 10 + (index % 3);
  const day = 10 + index;
  const seated = index % 3 === 0;
  const title = `${category} Assembly ${city[0]}`;
  return {
    id: `evt-${index + 1}`,
    slug: `${category.toLowerCase()}-assembly-${city[0].toLowerCase().replace(/\s/g, '-')}-${index + 1}`,
    title,
    category,
    city: city[0],
    country: city[1],
    venue: city[2],
    timezone: timezones[city[0]],
    startsAt: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T09:30:00.000Z`,
    endsAt: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T17:00:00.000Z`,
    language: ['English', 'Hindi', 'Tamil', 'Spanish', 'French', 'Arabic', 'Japanese'][index % 7],
    format: index % 5 === 0 ? 'virtual' : index % 4 === 0 ? 'hybrid' : 'in-person',
    accessibility: ['Step-free access', 'Captioning', 'Quiet room'].slice(0, (index % 3) + 1),
    image: `https://images.unsplash.com/photo-${[
      '1511578314322-379afb476865',
      '1492684223066-81342ee5ff30',
      '1505373877841-8d25f7d46678',
      '1511795409834-ef04bbd61622',
    ][index % 4]}?auto=format&fit=crop&w=1200&q=80`,
    summary: `A focused programme for ${category.toLowerCase()} leaders, operators, and teams planning international work.`,
    organizer: ['Assembly Studio', 'Northstar Events', 'Civic Forum', 'Atlas Programmes'][index % 4],
    seated,
    tiers: [
      { id: 'standard', name: 'Standard', description: 'Main programme access', priceUsd: 120 + index * 3, feeUsd: 9, available: 120 - index, maxPerOrder: 6, status: 'available' },
      { id: 'pro', name: 'Professional', description: 'Priority entry and lounge access', priceUsd: 220 + index * 4, feeUsd: 14, available: 35, maxPerOrder: 4, status: index % 5 === 0 ? 'limited' : 'available' },
      { id: 'group', name: 'Group', description: 'Eight seats with invoice support', priceUsd: 760 + index * 6, feeUsd: 35, available: 10, maxPerOrder: 2, status: index % 9 === 0 ? 'sold-out' : 'available' },
    ],
    seats: seated ? makeSeats(index + 1) : undefined,
  };
});

export const addOns = [
  { id: 'parking', labelKey: 'checkout.addons.parking', priceUsd: 28 },
  { id: 'merch', labelKey: 'checkout.addons.merch', priceUsd: 42 },
  { id: 'assistance', labelKey: 'checkout.addons.assistance', priceUsd: 0 },
];
