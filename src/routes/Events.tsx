import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LayoutGrid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { listEvents } from '../lib/api/events';
import { events as allEvents } from '../lib/mock/events';
import type { EventItem } from '../types';
import { Button } from '../components/ui/Button';
import { Checkbox, Input, Select, Switch } from '../components/ui/Form';
import { EmptyState, ErrorState, Skeleton } from '../components/ui/Feedback';
import { EventCard } from '../components/layout/EventCard';
import { useUiStore } from '../store/ui';

export default function Events() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [grid, setGrid] = useState(true);
  const { localTime, setLocalTime } = useUiStore();
  const categories = useMemo(() => [...new Set(allEvents.map((event) => event.category))], []);
  const cities = useMemo(() => [...new Set(allEvents.map((event) => event.city))], []);
  const load = () => {
    setLoading(true); setError(false);
    listEvents(params).then(setItems).catch(() => setError(true)).finally(() => setLoading(false));
  };
  useEffect(load, [params]);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };
  return (
    <>
      <Helmet><title>{t('events.title')} · {t('brand')}</title></Helmet>
      <div className="container-grid py-12">
        <div className="rich-strip mb-8 grid gap-6 rounded-[32px] border border-gray-200 p-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="label premium-copy">{t('brand')}</p>
            <h1 className="premium-title mt-2 text-5xl font-extrabold">{t('events.title')}</h1>
            <p className="premium-copy mt-3 max-w-2xl">{t('home.subtitle')}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[categories.length, cities.length, allEvents.length].map((value, index) => <div key={index} className="luxe-card border px-4 py-3"><p className="premium-title text-2xl font-extrabold tabular">{value}</p></div>)}
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="luxe-card h-max border p-5 lg:sticky lg:top-28">
          <h1 className="premium-title mb-5 text-2xl font-semibold">{t('events.filters')}</h1>
          <div className="grid gap-4">
            <Input value={params.get('q') ?? ''} onChange={(event) => update('q', event.target.value)} placeholder={t('actions.search')} />
            <Select value={params.get('category') ?? ''} onChange={(event) => update('category', event.target.value)}><option value="">{t('events.category')}</option>{categories.map((item) => <option key={item}>{item}</option>)}</Select>
            <Select value={params.get('city') ?? ''} onChange={(event) => update('city', event.target.value)}><option value="">{t('events.city')}</option>{cities.map((item) => <option key={item}>{item}</option>)}</Select>
            <Select value={params.get('format') ?? ''} onChange={(event) => update('format', event.target.value)}><option value="">{t('events.format')}</option><option value="in-person">{t('events.in-person')}</option><option value="virtual">{t('events.virtual')}</option><option value="hybrid">{t('events.hybrid')}</option></Select>
            <Input type="range" min="0" max="1000" aria-label={t('events.price')} />
            <Checkbox label={t('detail.accessibility')} />
            <Switch checked={localTime} onChange={setLocalTime} label={t('common.localTime')} />
            <Button variant="secondary" onClick={() => setParams({})}>{t('actions.clear')}</Button>
          </div>
        </aside>
        <section>
          <div className="luxe-surface mb-6 flex flex-wrap items-center justify-between gap-3 border p-5">
            <div>
              <p className="label premium-copy">{t('brand')}</p>
              <h1 className="premium-title text-4xl font-semibold">{t('events.title')}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant={grid ? 'primary' : 'secondary'} onClick={() => setGrid(true)} aria-label={t('events.grid')}><LayoutGrid className="h-4 w-4" strokeWidth={1.5} /></Button>
              <Button variant={!grid ? 'primary' : 'secondary'} onClick={() => setGrid(false)} aria-label={t('events.list')}><List className="h-4 w-4" strokeWidth={1.5} /></Button>
            </div>
          </div>
          {loading ? <div className="grid gap-6 md:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-96" />)}</div> : null}
          {error ? <ErrorState title={t('common.error')} retryLabel={t('actions.retry')} onRetry={load} /> : null}
          {!loading && !error && items.length === 0 ? <EmptyState title={t('common.empty')} /> : null}
          {!loading && !error ? <div className={grid ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' : 'grid gap-4'}>{items.slice(0, 12).map((event) => <EventCard key={event.id} event={event} compact={!grid} />)}</div> : null}
          <div className="mt-8 flex justify-center gap-2"><Button variant="secondary">1</Button><Button variant="secondary">2</Button><Button variant="secondary">3</Button></div>
        </section>
        </div>
      </div>
    </>
  );
}
