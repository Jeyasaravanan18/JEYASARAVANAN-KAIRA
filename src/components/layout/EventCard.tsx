import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../lib/format/currency';
import { formatEventDate } from '../../lib/format/date';
import { useUiStore } from '../../store/ui';
import type { EventItem } from '../../types';
import { Badge } from '../ui/Feedback';

export function EventCard({ event, compact = false }: { event: EventItem; compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const { currency, localTime } = useUiStore();
  const zone = localTime ? Intl.DateTimeFormat().resolvedOptions().timeZone : event.timezone;
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`luxe-card group overflow-hidden border transition duration-300 hover:-translate-y-1 ${compact ? 'grid gap-4 p-3 md:grid-cols-[190px_1fr]' : ''}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img className="image-polish h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:saturate-[1.25]" src={event.image} alt={event.title} loading="lazy" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
        <span className="absolute bottom-3 start-3 rounded bg-white/90 px-2 py-1 text-xs font-bold text-[#172554]">{event.category}</span>
      </div>
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-2"><Badge>{t(`events.${event.format}`)}</Badge><Badge>{event.language}</Badge></div>
        <h2 className="premium-title text-xl font-semibold leading-tight"><Link to={`/events/${event.slug}`}>{event.title}</Link></h2>
        <p className="text-sm text-gray-600">{event.summary}</p>
        <p className="flex items-center gap-2 text-sm tabular"><Calendar className="h-4 w-4" strokeWidth={1.5} />{formatEventDate(event.startsAt, i18n.language, zone)}</p>
        <p className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" strokeWidth={1.5} />{event.city}, {event.country}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
          <span className="font-semibold tabular">{formatCurrency(event.tiers[0].priceUsd, currency, i18n.language)}</span>
          <div className="flex items-center gap-2">
            <Link className="rounded-full border border-ink px-3 py-2 text-sm font-semibold" to={`/events/${event.slug}`}>{t('actions.details')}</Link>
            <Link className="accent-action rounded-full border px-3 py-2 text-sm font-semibold" to={`/events/${event.slug}/book`}>{t('actions.book')}</Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
