import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useBookingStore } from '../store/booking';
import { events } from '../lib/mock/events';
import { Button } from '../components/ui/Button';

export default function Confirmation() {
  const { reference } = useParams();
  const { t } = useTranslation();
  const booking = useBookingStore((state) => state.bookings.find((item) => item.reference === reference));
  const event = events.find((item) => item.id === booking?.eventId);
  const [qr, setQr] = useState('');
  useEffect(() => { if (reference) void QRCode.toDataURL(reference).then(setQr); }, [reference]);
  const ics = event ? `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${event.startsAt.replace(/[-:]/g, '').replace('.000', '')}\nDTEND:${event.endsAt.replace(/[-:]/g, '').replace('.000', '')}\nEND:VEVENT\nEND:VCALENDAR` : '';
  return (
    <section className="container-grid py-12">
      <Helmet><title>{t('confirmation.title')} · {t('brand')}</title></Helmet>
      <h1 className="text-4xl font-semibold">{t('confirmation.title')}</h1>
      <p className="mt-4 text-xl tabular">{t('confirmation.reference')}: {reference}</p>
      {event ? <article className="luxe-card mt-8 border p-6"><h2 className="premium-title text-2xl font-semibold">{event.title}</h2>{qr ? <img className="mt-6 h-40 w-40 rounded-3xl border border-gray-200 p-3" src={qr} alt={t('confirmation.qr')} /> : null}<div className="mt-6 flex flex-wrap gap-3"><a className="inline-flex min-h-11 items-center rounded-full border border-ink px-5 font-semibold" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`} download={`${reference}.ics`}>{t('confirmation.calendar')}</a><Button onClick={() => window.print()}>{t('actions.print')}</Button><Button variant="secondary">{t('actions.share')}</Button></div></article> : null}
      <Link className="mt-8 inline-flex underline underline-offset-4" to="/bookings">{t('nav.bookings')}</Link>
    </section>
  );
}
