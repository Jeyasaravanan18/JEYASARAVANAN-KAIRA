import { Form, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Building2, Search, ShieldCheck, Sparkles } from 'lucide-react';
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
  const heroImages = events.slice(4, 8);
  return (
    <>
      <Helmet><title>{t('brand')} · {t('nav.home')}</title></Helmet>
      <section className="container-grid luxe-surface mt-8 grid gap-12 overflow-hidden border p-5 md:p-8 lg:grid-cols-12 lg:p-10">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="lg:col-span-7">
          <p className="label premium-copy">{t('brand')}</p>
          <h1 className="display mt-4 text-5xl font-extrabold text-ink md:text-7xl lg:text-8xl">{t('home.title')}</h1>
          <p className="premium-copy mt-8 max-w-2xl text-xl">{t('home.subtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="soft-pill inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 accent-sage" strokeWidth={1.5} />{t('home.stats')}</span>
            <span className="soft-pill inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold"><Sparkles className="h-4 w-4 accent-gold" strokeWidth={1.5} />{t('home.featured')}</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="grid gap-4 lg:col-span-5">
          <div className="grid grid-cols-5 gap-3">
            <img className="image-polish col-span-3 aspect-[4/5] h-full w-full object-cover" src={heroImages[0].image} alt={heroImages[0].title} />
            <div className="col-span-2 grid gap-3">
              <img className="image-polish aspect-square w-full object-cover" src={heroImages[1].image} alt={heroImages[1].title} />
              <img className="image-polish aspect-square w-full object-cover" src={heroImages[2].image} alt={heroImages[2].title} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <img className="image-polish col-span-2 aspect-[16/7] w-full object-cover" src={heroImages[3].image} alt={heroImages[3].title} />
            <div className="grid place-items-center border border-[color:var(--color-gold)] bg-[color:var(--color-premium-soft)] p-4 text-center">
              <p className="premium-title text-3xl font-extrabold tabular">32</p>
              <p className="label premium-copy">{t('events.title')}</p>
            </div>
          </div>
        </motion.div>
        <Form
          className="luxe-card grid gap-3 border p-4 lg:col-span-12 lg:grid-cols-[1fr_1fr_auto]"
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
      <section className="container-grid grid gap-4 border-b border-gray-200 py-10 md:grid-cols-4">
        {[['32', t('events.title')], ['10', t('events.city')], ['7', t('common.language')], ['6', t('common.currency')]].map(([value, label], index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="premium-band border p-5">
            <p className="premium-title text-4xl font-extrabold tabular">{value}</p>
            <p className="label premium-copy mt-2">{label}</p>
          </motion.div>
        ))}
      </section>
      <section className="container-grid py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="premium-title text-4xl font-semibold">{t('home.featured')}</h2>
          <Link className="premium-copy hidden items-center gap-2 font-semibold underline underline-offset-4 md:inline-flex" to="/events">{t('nav.events')}<ArrowRight className="h-4 w-4" strokeWidth={1.5} /></Link>
        </div>
        <div className="organic-grid grid gap-6 md:grid-cols-3">{events.slice(0, 6).map((event) => <EventCard key={event.id} event={event} />)}</div>
      </section>
      <section className="container-grid grid gap-12 border-y border-gray-200 py-24 lg:grid-cols-2">
        <div>
          <h2 className="premium-title mb-8 text-3xl font-semibold">{t('home.categories')}</h2>
          <ul className="grid gap-3">{categories.map((category, index) => <li key={category}><Link className="premium-band flex justify-between border p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--color-accent)] hover:shadow-overlay" to={`/events?category=${category}`}><span className="font-semibold">{category}</span><span className={index % 3 === 0 ? 'accent-gold' : index % 3 === 1 ? 'accent-plum' : 'accent-sage'}>{events.filter((event) => event.category === category).length}</span></Link></li>)}</ul>
        </div>
        <div>
          <h2 className="premium-title mb-8 text-3xl font-semibold">{t('home.cities')}</h2>
          <div className="luxe-card border p-2"><table className="w-full text-sm"><tbody>{cities.map((city) => <tr key={city} className="border-b border-gray-200 last:border-b-0"><td className="py-4 ps-4 font-semibold">{city}</td><td className="premium-copy py-4 pe-4 text-end">{events.filter((event) => event.city === city).length}</td></tr>)}</tbody></table></div>
        </div>
      </section>
      <section className="container-grid py-24">
        <div className="luxe-surface grid gap-8 overflow-hidden border p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div><p className="label premium-copy flex items-center gap-2"><Building2 className="h-4 w-4" strokeWidth={1.5} />{t('nav.enterprise')}</p><h2 className="premium-title mt-4 text-4xl font-semibold">{t('home.enterpriseTitle')}</h2><p className="premium-copy mt-4">{t('home.enterpriseCopy')}</p><Button className="mt-8" onClick={() => navigate('/enterprise')}>{t('nav.enterprise')}</Button></div>
          <img className="image-polish aspect-[4/3] h-full w-full object-cover" src={events[9].image} alt={events[9].title} />
        </div>
        <p className="premium-title mt-12 border-y border-gray-200 py-8 text-center text-xl font-semibold">{t('home.stats')}</p>
      </section>
    </>
  );
}
