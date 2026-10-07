import { useEffect, useState } from 'react';
import { getEvent } from '../lib/api/events';
import type { EventItem } from '../types';

export function useEvent(slug: string | undefined) {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = () => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    getEvent(slug).then(setEvent).catch(() => setError(true)).finally(() => setLoading(false));
  };
  useEffect(load, [slug]);
  return { event, loading, error, reload: load };
}
