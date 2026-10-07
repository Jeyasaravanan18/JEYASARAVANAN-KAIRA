import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Armchair, Clock3, Minus, Plus, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useEvent } from '../hooks/useEvent';
import { useBookingStore } from '../store/booking';
import { useUiStore } from '../store/ui';
import { formatCurrency } from '../lib/format/currency';
import { calculatePrice } from '../lib/booking/pricing';
import { Button } from '../components/ui/Button';
import { ErrorState, Skeleton } from '../components/ui/Feedback';

export default function Booking() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { event, loading, error, reload } = useEvent(slug);
  const { lines, setLine, toggleSeat, beginHold, holdUntil } = useBookingStore();
  const { currency } = useUiStore();
  useEffect(() => { beginHold(); }, [beginHold]);
  if (loading) return <div className="container-grid py-12"><Skeleton className="h-96" /></div>;
  if (error || !event) return <div className="container-grid py-12"><ErrorState title={t('common.error')} retryLabel={t('actions.retry')} onRetry={reload} /></div>;
  const lineFor = (tierId: string) => lines.find((line) => line.eventId === event.id && line.tierId === tierId) ?? { eventId: event.id, tierId, quantity: 0, seatIds: [] };
  const eventLines = lines.filter((line) => line.eventId === event.id);
  const selectedTickets = eventLines.reduce((sum, line) => sum + line.quantity + line.seatIds.length, 0);
  const breakdown = calculatePrice(event, eventLines, []);
  const selectedSeatIds = eventLines.flatMap((line) => line.seatIds);
  const seconds = holdUntil ? Math.max(0, Math.floor((new Date(holdUntil).getTime() - Date.now()) / 1000)) : 0;
  return (
    <section className="container-grid py-12">
      <Helmet><title>{t('booking.title')} · {t('brand')}</title></Helmet>
      <div className="rich-strip mb-8 grid gap-6 rounded-[32px] border border-gray-200 p-6 md:grid-cols-[1fr_320px]">
        <div><p className="label premium-copy">{event.title}</p><h1 className="premium-title mt-2 text-4xl font-semibold">{t('booking.title')}</h1><p className="premium-copy mt-3 max-w-2xl">{event.venue}, {event.city} · {event.category}</p></div>
        <div className="luxe-card grid content-center gap-3 border p-5">
          <p className="flex items-center gap-2 text-sm font-semibold"><Clock3 className="h-4 w-4 accent-sage" strokeWidth={1.5} />{t('booking.hold')}</p>
          <p className="premium-title text-4xl font-extrabold tabular">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</p>
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-4">{event.tiers.map((tier, index) => {
          const line = lineFor(tier.id);
          return <motion.article initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} key={tier.id} className="luxe-card border p-5"><div className="flex justify-between gap-4"><div className="flex gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--color-premium-soft)]"><Ticket className="h-5 w-5 accent-sage" strokeWidth={1.5} /></span><div><h2 className="premium-title text-xl font-semibold">{tier.name}</h2><p className="text-sm text-gray-600">{tier.description}</p></div></div><p className="font-semibold tabular">{formatCurrency(tier.priceUsd, currency, i18n.language)}</p></div><div className="mt-5 flex flex-wrap items-center gap-3"><Button variant="secondary" onClick={() => setLine({ ...line, quantity: Math.max(0, line.quantity - 1) })}><Minus className="h-4 w-4" strokeWidth={1.5} /></Button><span className="grid h-10 min-w-10 place-items-center rounded-full bg-[color:var(--color-premium-soft)] text-center font-semibold tabular">{line.quantity}</span><Button variant="secondary" onClick={() => setLine({ ...line, quantity: Math.min(tier.maxPerOrder, line.quantity + 1) })}><Plus className="h-4 w-4" strokeWidth={1.5} /></Button><span className="text-sm text-gray-600">{t('booking.limit')} {tier.maxPerOrder}</span></div></motion.article>;
        })}</div>
        <aside className="grid gap-4">
          {event.seated ? <div className="luxe-card border p-5"><div className="mb-4 flex items-center justify-between gap-4"><div><p className="label premium-copy">Interactive venue</p><h2 className="premium-title text-2xl font-semibold">{t('booking.seatMap')}</h2></div><Armchair className="h-6 w-6 accent-sage" strokeWidth={1.5} /></div><svg viewBox="0 0 420 390" className="venue-map w-full rounded-3xl border border-gray-200" role="grid" aria-label={t('booking.seatMap')}>
            <path d="M86 54 Q210 20 334 54 L318 94 Q210 70 102 94 Z" fill="var(--color-accent)" opacity="0.96" />
            <text x="210" y="67" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">STAGE</text>
            <path d="M58 132 Q210 78 362 132" fill="none" stroke="var(--color-gold)" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
            <path d="M74 174 Q210 126 346 174" fill="none" stroke="var(--color-sage)" strokeWidth="2" strokeDasharray="6 8" opacity="0.65" />
            <text x="50" y="122" fill="var(--color-premium-muted)" fontSize="12" fontWeight="700">LEFT</text>
            <text x="344" y="122" fill="var(--color-premium-muted)" fontSize="12" fontWeight="700">RIGHT</text>
            <text x="190" y="126" fill="var(--color-premium-muted)" fontSize="12" fontWeight="700">CENTER</text>
            {event.seats?.map((seat, index) => {
              const line = lineFor('standard');
              const selected = line.seatIds.includes(seat.id);
              const col = index % 6;
              const row = Math.floor(index / 6);
              const centerOffset = col - 2.5;
              const x = 210 + centerOffset * 48 + centerOffset * row * 4;
              const y = 156 + row * 34 + Math.abs(centerOffset) * 5;
              const rotate = centerOffset * 2.6;
              const seatClass = selected ? 'seat-selected' : seat.status === 'available' ? 'seat-available' : seat.status === 'held' ? 'seat-held' : 'seat-sold';
              return <g key={seat.id} transform={`translate(${x} ${y}) rotate(${rotate})`} tabIndex={seat.status === 'available' ? 0 : -1} role="gridcell" aria-label={`${seat.section} ${seat.row}${seat.number} ${seat.status}`} onClick={() => seat.status === 'available' && toggleSeat(event.id, 'standard', seat.id)} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && seat.status === 'available') toggleSeat(event.id, 'standard', seat.id); }}>
                <rect x="-15" y="-12" width="30" height="24" rx="9" className={seatClass} strokeWidth="2" />
                <path d="M-10 12 H10" className={seatClass} strokeWidth="4" strokeLinecap="round" />
                {selected ? <circle cx="11" cy="-9" r="5" fill="white" /> : null}
              </g>;
            })}
            <path d="M92 344 Q210 374 328 344" fill="none" stroke="var(--color-gray-200)" strokeWidth="18" strokeLinecap="round" />
            <text x="210" y="352" textAnchor="middle" fill="var(--color-premium-muted)" fontSize="12" fontWeight="700">ENTRY</text>
          </svg><div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {[['seat-available', t('booking.available')], ['seat-selected', t('booking.selected')], ['seat-held', t('booking.held')], ['seat-sold', t('booking.sold')]].map(([klass, label]) => <span key={label} className="soft-pill inline-flex items-center gap-2 px-3 py-2"><span className={`h-3 w-3 rounded-full ${klass === 'seat-available' ? 'bg-[color:var(--color-sage)]' : klass === 'seat-selected' ? 'bg-[color:var(--color-accent-strong)]' : klass === 'seat-held' ? 'bg-[color:var(--color-gold)]' : 'bg-gray-300'}`} />{label}</span>)}
          </div>{selectedSeatIds.length > 0 ? <div className="mt-4"><p className="label premium-copy mb-2">{t('booking.selected')}</p><div className="flex flex-wrap gap-2">{selectedSeatIds.map((id) => <span key={id} className="soft-pill px-3 py-1 text-xs font-semibold">{id.split('-').pop()}</span>)}</div></div> : null}</div> : null}
          <div className="luxe-card border p-5 lg:sticky lg:top-28">
            <p className="label premium-copy">{t('detail.summary')}</p>
            <h2 className="premium-title mt-2 text-2xl font-semibold">{event.title}</h2>
            <div className="mt-5 space-y-3 text-sm">
              {event.tiers.map((tier) => {
                const line = lineFor(tier.id);
                if (line.quantity === 0 && line.seatIds.length === 0) return null;
                return <p key={tier.id} className="flex justify-between gap-4"><span>{tier.name} x {line.quantity + line.seatIds.length}</span><span className="tabular">{formatCurrency(tier.priceUsd * line.quantity + line.seatIds.length * tier.priceUsd, currency, i18n.language)}</span></p>;
              })}
              {selectedTickets === 0 ? <p className="premium-copy">{t('booking.quantity')} 0</p> : null}
            </div>
            <div className="mt-5 border-t border-gray-200 pt-4">
              <p className="flex justify-between font-semibold"><span>{t('checkout.total')}</span><span className="tabular">{formatCurrency(breakdown.totalUsd, currency, i18n.language)}</span></p>
            </div>
            <Link to={`/checkout/${event.slug}`} className={`mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full border px-5 font-semibold ${selectedTickets > 0 ? 'accent-action' : 'pointer-events-none border-gray-200 bg-gray-200 text-gray-600'}`}>{t('booking.checkout')}</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
