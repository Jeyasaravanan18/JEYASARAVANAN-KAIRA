import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEvent } from '../hooks/useEvent';
import { formatCurrency } from '../lib/format/currency';
import { formatEventDate } from '../lib/format/date';
import { events } from '../lib/mock/events';
import { useUiStore } from '../store/ui';
import { Accordion } from '../components/ui/Overlays';
import { Badge, ErrorState, Skeleton } from '../components/ui/Feedback';
import { Button } from '../components/ui/Button';
import { EventCard } from '../components/layout/EventCard';

export default function EventDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { event, loading, error, reload } = useEvent(slug);
  const { currency, localTime } = useUiStore();
  if (loading) return <div className="container-grid py-12"><Skeleton className="h-[640px]" /></div>;
  if (error || !event) return <div className="container-grid py-12"><ErrorState title={t('common.error')} retryLabel={t('actions.retry')} onRetry={reload} /></div>;
  const zone = localTime ? Intl.DateTimeFormat().resolvedOptions().timeZone : event.timezone;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Event', name: event.title, startDate: event.startsAt, endDate: event.endsAt, eventAttendanceMode: event.format, location: { '@type': 'Place', name: event.venue, address: `${event.city}, ${event.country}` } };
  return (
    <>
      <Helmet><title>{event.title} · {t('brand')}</title><script type="application/ld+json">{JSON.stringify(jsonLd)}</script></Helmet>
      <section className="container-grid grid gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap gap-2"><Badge>{event.category}</Badge><Badge>{t(`events.${event.format}`)}</Badge></div>
          <h1 className="display premium-title mt-5 text-5xl font-extrabold md:text-7xl">{event.title}</h1>
          <p className="premium-copy mt-6 max-w-3xl text-xl">{event.summary}</p>
          <div className="premium-band mt-8 grid gap-3 border p-5 text-sm tabular md:grid-cols-2">
            <p className="flex gap-2"><Calendar className="h-4 w-4" strokeWidth={1.5} />{formatEventDate(event.startsAt, i18n.language, zone)}</p>
            <p className="flex gap-2"><MapPin className="h-4 w-4" strokeWidth={1.5} />{event.venue}, {event.city}</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-[1.5fr_0.8fr]">
            <img src={event.image} alt={event.title} className="image-polish aspect-[16/10] h-full w-full object-cover" />
            <div className="grid gap-4">
              <img src={events[2].image} alt={events[2].title} className="image-polish aspect-[4/3] w-full object-cover" />
              <img src={events[5].image} alt={events[5].title} className="image-polish aspect-[4/3] w-full object-cover" />
            </div>
          </div>
          <section className="mt-16"><h2 className="premium-title mb-6 text-3xl font-semibold">{t('detail.agenda')}</h2><div className="luxe-card divide-y divide-gray-200 border">{['09:30 Opening briefing', '11:00 Operator panels', '14:00 Roundtables', '16:30 Closing notes'].map((item) => <p key={item} className="px-5 py-4 tabular">{item}</p>)}</div></section>
          <section className="mt-16"><h2 className="premium-title mb-6 text-3xl font-semibold">{t('detail.tickets')}</h2><table className="luxe-card w-full border text-sm"><tbody>{event.tiers.map((tier) => <tr key={tier.id} className="border-b border-gray-200"><td className="py-4 ps-5 font-semibold">{tier.name}<p className="font-normal text-gray-600">{tier.description}</p></td><td>{tier.available}</td><td className="pe-5 text-end tabular">{formatCurrency(tier.priceUsd, currency, i18n.language)}</td></tr>)}</tbody></table></section>
          <section className="mt-16"><h2 className="premium-title mb-6 text-3xl font-semibold">{t('detail.policies')}</h2><Accordion items={[{ title: t('detail.refunds'), content: t('chat.refund') }, { title: t('detail.accessibility'), content: t('chat.accessibility') }, { title: t('detail.age'), content: 'Guests under 16 require an adult attendee.' }]} /></section>
          <section className="mt-16"><h2 className="premium-title mb-6 text-3xl font-semibold">{t('detail.venue')}</h2><div className="premium-band grid aspect-[16/7] place-items-center border text-gray-600">{t('detail.map')}</div></section>
        </div>
        <aside className="luxe-card h-max border p-5 lg:sticky lg:top-28 lg:col-span-4">
          <h2 className="premium-title text-2xl font-semibold">{t('detail.summary')}</h2>
          <p className="mt-3 text-gray-600">{event.organizer}</p>
          <p className="mt-6 text-3xl font-semibold tabular">{formatCurrency(event.tiers[0].priceUsd, currency, i18n.language)}</p>
          <Link to={`/events/${event.slug}/book`} className="accent-action mt-6 inline-flex min-h-11 w-full items-center justify-center rounded border px-4 font-semibold">{t('actions.book')}</Link>
        </aside>
      </section>
      <section className="container-grid py-16"><h2 className="premium-title mb-8 text-3xl font-semibold">{t('detail.related')}</h2><div className="grid gap-6 md:grid-cols-3">{events.filter((item) => item.category === event.category && item.id !== event.id).slice(0, 3).map((item) => <EventCard key={item.id} event={item} />)}</div></section>
    </>
  );
}
