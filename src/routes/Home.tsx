import { Form, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Building2, CalendarDays, Globe2, MapPinned, Search, ShieldCheck, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { events } from '../lib/mock/events';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Form';
import { EventCard } from '../components/layout/EventCard';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const categories = [...new Set(events.map((event) => event.category))];
  const cities = [...new Set(events.map((event) => event.city))];
  const hero = events[4];
  const spotlight = events.slice(8, 11);

  return (
    <>
      <Helmet><title>{t('brand')} · {t('nav.home')}</title></Helmet>

      <section className="home-stage relative overflow-hidden">
        <img className="absolute inset-0 h-full w-full object-cover" src={hero.image} alt={hero.title} />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent" />
        <div className="container-grid relative z-10 grid min-h-[760px] content-center gap-10 py-20 lg:grid-cols-[1fr_420px]">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-5xl">
            <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">{t('brand')}</p>
            <h1 className="display mt-7 text-5xl font-extrabold text-white md:text-7xl lg:text-8xl">{t('home.title')}</h1>
            <p className="mt-7 max-w-2xl text-xl text-white/82">{t('home.subtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur"><ShieldCheck className="h-4 w-4" strokeWidth={1.5} />{t('home.stats')}</span>
              <Link to="/events" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-ink">{t('nav.events')}<ArrowRight className="h-4 w-4" strokeWidth={1.5} /></Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.08 }} className="hidden gap-4 lg:grid">
            {spotlight.map((event, index) => (
              <Link key={event.id} to={`/events/${event.slug}`} className={`home-floating-card ${index === 1 ? 'ms-12' : ''}`}>
                <img src={event.image} alt={event.title} />
                <div>
                  <p>{event.category}</p>
                  <h2>{event.city}</h2>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container-grid relative z-20 -mt-24">
        <Form
          className="search-dock grid gap-3 border p-4 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            navigate(`/events?q=${encodeURIComponent(String(data.get('q') ?? ''))}&city=${encodeURIComponent(String(data.get('city') ?? ''))}`);
          }}
        >
          <Input name="q" placeholder={t('home.what')} />
          <Select name="city"><option value="">{t('home.where')}</option>{cities.map((city) => <option key={city}>{city}</option>)}</Select>
          <Button type="submit"><Search className="h-4 w-4" strokeWidth={1.5} />{t('actions.search')}</Button>
        </Form>
      </section>

      <section className="container-grid grid gap-4 py-16 md:grid-cols-4">
        {[
          ['32', t('events.title'), Ticket, 'tile-indigo'],
          ['10', t('events.city'), MapPinned, 'tile-emerald'],
          ['7', t('common.language'), Globe2, 'tile-gold'],
          ['6', t('common.currency'), CalendarDays, 'tile-violet'],
        ].map(([value, label, Icon, tile], index) => (
          <motion.div key={String(label)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6 }} transition={{ delay: index * 0.06 }} className={`color-tile border p-6 ${tile}`}>
            {typeof Icon !== 'string' ? <Icon className="mb-8 h-7 w-7" strokeWidth={1.5} /> : null}
            <p className="text-5xl font-extrabold tabular">{String(value)}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] opacity-80">{String(label)}</p>
          </motion.div>
        ))}
      </section>

      <section className="home-band py-24">
        <div className="container-grid">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="label premium-copy">{t('brand')}</p>
              <h2 className="premium-title mt-3 text-5xl font-extrabold">{t('home.featured')}</h2>
            </div>
            <Link className="hidden items-center gap-2 font-semibold underline underline-offset-4 md:inline-flex" to="/events">{t('nav.events')}<ArrowRight className="h-4 w-4" strokeWidth={1.5} /></Link>
          </div>
          <div className="organic-grid grid gap-6 md:grid-cols-3">{events.slice(0, 6).map((event) => <EventCard key={event.id} event={event} />)}</div>
        </div>
      </section>

      <section className="container-grid grid gap-10 py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rich-panel">
          <p className="label premium-copy">{t('home.categories')}</p>
          <h2 className="mt-3 text-4xl font-extrabold text-ink">{t('home.categories')}</h2>
          <div className="mt-8 grid gap-3">
            {categories.map((category, index) => (
              <Link key={category} className={`category-ribbon ${index % 3 === 0 ? 'ribbon-gold' : index % 3 === 1 ? 'ribbon-sage' : 'ribbon-violet'}`} to={`/events?category=${category}`}>
                <span>{category}</span>
                <strong>{events.filter((event) => event.category === category).length}</strong>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="label premium-copy">{t('home.cities')}</p>
          <h2 className="premium-title mt-3 text-4xl font-extrabold">{t('home.cities')}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {cities.slice(0, 8).map((city, index) => (
              <Link key={city} to={`/events?city=${city}`} className="city-card">
                <img src={events[index].image} alt={city} />
                <div>
                  <h3>{city}</h3>
                  <p>{events.filter((event) => event.city === city).length} {t('events.title')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-grid py-24">
        <div className="enterprise-showcase">
          <div>
            <p className="label flex items-center gap-2 text-white/70"><Building2 className="h-4 w-4" strokeWidth={1.5} />{t('nav.enterprise')}</p>
            <h2 className="mt-4 max-w-3xl text-5xl font-extrabold text-white">{t('home.enterpriseTitle')}</h2>
            <p className="mt-5 max-w-2xl text-lg text-white/76">{t('home.enterpriseCopy')}</p>
            <Button className="mt-8 bg-white text-ink hover:bg-white/90" onClick={() => navigate('/enterprise')}>{t('nav.enterprise')}</Button>
          </div>
          <img src={events[9].image} alt={events[9].title} />
        </div>
      </section>
    </>
  );
}
