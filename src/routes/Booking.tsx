import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
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
  const seconds = holdUntil ? Math.max(0, Math.floor((new Date(holdUntil).getTime() - Date.now()) / 1000)) : 0;
  return (
    <section className="container-grid py-12">
      <Helmet><title>{t('booking.title')} · {t('brand')}</title></Helmet>
      <div className="premium-band mb-8 flex flex-wrap justify-between gap-4 border p-5"><div><p className="label premium-copy">{event.title}</p><h1 className="premium-title text-4xl font-semibold">{t('booking.title')}</h1></div><p className="tabular">{t('booking.hold')} {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</p></div>
      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-4">{event.tiers.map((tier) => {
          const line = lineFor(tier.id);
          return <article key={tier.id} className="luxe-card border p-5"><div className="flex justify-between gap-4"><div><h2 className="premium-title text-xl font-semibold">{tier.name}</h2><p className="text-sm text-gray-600">{tier.description}</p></div><p className="font-semibold tabular">{formatCurrency(tier.priceUsd, currency, i18n.language)}</p></div><div className="mt-5 flex items-center gap-3"><Button variant="secondary" onClick={() => setLine({ ...line, quantity: Math.max(0, line.quantity - 1) })}><Minus className="h-4 w-4" strokeWidth={1.5} /></Button><span className="w-8 text-center tabular">{line.quantity}</span><Button variant="secondary" onClick={() => setLine({ ...line, quantity: Math.min(tier.maxPerOrder, line.quantity + 1) })}><Plus className="h-4 w-4" strokeWidth={1.5} /></Button><span className="text-sm text-gray-600">{t('booking.limit')} {tier.maxPerOrder}</span></div></article>;
        })}</div>
        <aside className="grid gap-4">
          {event.seated ? <div className="luxe-card border p-5"><h2 className="premium-title mb-4 text-2xl font-semibold">{t('booking.seatMap')}</h2><svg viewBox="0 0 360 300" className="w-full rounded-3xl border border-gray-200 bg-paper" role="grid" aria-label={t('booking.seatMap')}>{event.seats?.map((seat, index) => { const line = lineFor('standard'); const selected = line.seatIds.includes(seat.id); const x = 28 + (index % 6) * 52; const y = 34 + Math.floor(index / 6) * 42; return <rect key={seat.id} tabIndex={seat.status === 'available' ? 0 : -1} role="gridcell" aria-label={`${seat.section} ${seat.row}${seat.number} ${seat.status}`} x={x} y={y} width="30" height="26" rx="8" className={selected ? 'fill-ink stroke-ink' : seat.status === 'available' ? 'fill-paper stroke-ink' : 'fill-gray-200 stroke-gray-400'} onClick={() => seat.status === 'available' && toggleSeat(event.id, 'standard', seat.id)} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && seat.status === 'available') toggleSeat(event.id, 'standard', seat.id); }} />; })}</svg><div className="mt-4 flex flex-wrap gap-4 text-sm"><span>{t('booking.available')}</span><span>{t('booking.held')}</span><span>{t('booking.sold')}</span><span>{t('booking.selected')}</span></div></div> : null}
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
