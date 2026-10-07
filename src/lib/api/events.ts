import { events } from '../mock/events';
import type { EventItem } from '../../types';

function wait<T>(value: T): Promise<T> {
  const latency = 220 + Math.random() * 420;
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (Math.random() < 0.025) {
        reject(new Error('mock_error'));
      } else {
        resolve(value);
      }
    }, latency);
  });
}

export async function listEvents(filters: URLSearchParams): Promise<EventItem[]> {
  const query = filters.get('q')?.toLowerCase() ?? '';
  const city = filters.get('city') ?? '';
  const category = filters.get('category') ?? '';
  const format = filters.get('format') ?? '';
  const result = events.filter((event) => {
    const textMatch = !query || `${event.title} ${event.city} ${event.category}`.toLowerCase().includes(query);
    return textMatch && (!city || event.city === city) && (!category || event.category === category) && (!format || event.format === format);
  });
  return wait(result);
}

export async function getEvent(slug: string): Promise<EventItem> {
  const event = events.find((item) => item.slug === slug || item.id === slug);
  if (!event) {
    throw new Error('not_found');
  }
  return wait(event);
}
