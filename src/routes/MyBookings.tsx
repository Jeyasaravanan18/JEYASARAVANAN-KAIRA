import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useBookingStore } from '../store/booking';
import { events } from '../lib/mock/events';
import { EmptyState } from '../components/ui/Feedback';
import { Button } from '../components/ui/Button';

export default function MyBookings() {
  const { t } = useTranslation();
  const bookings = useBookingStore((state) => state.bookings);
  return (
    <section className="container-grid py-12">
      <Helmet><title>{t('nav.bookings')} · {t('brand')}</title></Helmet>
      <h1 className="mb-8 text-4xl font-semibold">{t('nav.bookings')}</h1>
      {bookings.length === 0 ? <EmptyState title={t('account.noBookings')} /> : <div className="grid gap-4">{bookings.map((booking) => { const event = events.find((item) => item.id === booking.eventId); return <article key={booking.id} className="luxe-card grid gap-4 border p-5 md:grid-cols-[1fr_auto]"><div><p className="label">{booking.reference}</p><h2 className="premium-title text-xl font-semibold">{event?.title}</h2><p className="text-sm text-gray-600">{booking.attendee.email}</p></div><div className="flex gap-3"><Button variant="secondary">{t('actions.cancel')}</Button><Button variant="secondary">{t('actions.transfer')}</Button><Link className="accent-action inline-flex min-h-11 items-center rounded-full border px-5 font-semibold" to={`/confirmation/${booking.reference}`}>{t('actions.details')}</Link></div></article>; })}</div>}
    </section>
  );
}
