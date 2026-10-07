import { Link, NavLink, Outlet } from 'react-router-dom';
import { Globe2, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { languages } from '../../lib/i18n/config';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import type { CurrencyCode, LanguageCode } from '../../types';
import { Button } from '../ui/Button';
import { Select, Switch } from '../ui/Form';
import { Chatbot } from '../../features/chat/Chatbot';

const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AED'];

export function Layout() {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();
  const { language, currency, dark, setCurrency, setDark, setLanguage } = useUiStore();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:bg-paper focus:p-3">{t('actions.continue')}</a>
      <header className="header-panel sticky top-0 z-40">
        <div className="container-grid grid gap-3 py-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="shrink-0 text-xl font-extrabold tracking-tight">{t('brand')}</Link>
            {user ? <Button variant="tertiary" className="lg:hidden" onClick={signOut}>{t('nav.signout')}</Button> : <Link to="/register" className="accent-action inline-flex min-h-11 items-center rounded border px-4 text-sm font-semibold lg:hidden">{t('account.create')}</Link>}
          </div>
          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm font-semibold lg:justify-center lg:gap-5" aria-label="Primary">
            <NavLink className="whitespace-nowrap rounded px-2 py-2" to="/events">{t('nav.events')}</NavLink>
            <NavLink className="whitespace-nowrap rounded px-2 py-2" to="/enterprise">{t('nav.enterprise')}</NavLink>
            <NavLink className="whitespace-nowrap rounded px-2 py-2" to="/help">{t('nav.help')}</NavLink>
            <NavLink className="whitespace-nowrap rounded px-2 py-2" to="/bookings">{t('nav.bookings')}</NavLink>
          </nav>
          <div className="grid grid-cols-[auto_minmax(0,1fr)_92px_auto] items-center gap-2 sm:flex sm:flex-wrap lg:justify-end">
            <Globe2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <Select aria-label={t('common.language')} value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)} className="w-32">
              {languages.map((item) => <option key={item.code} value={item.code}>{item.nativeName}</option>)}
            </Select>
            <Select aria-label={t('common.currency')} value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="w-24">
              {currencies.map((item) => <option key={item} value={item}>{item}</option>)}
            </Select>
            <Button variant="secondary" className="theme-toggle h-11 shrink-0 px-3 sm:px-4" onClick={() => setDark(!dark)} aria-label={t('common.dark')}>
              {dark ? <Sun className="h-4 w-4" strokeWidth={1.5} /> : <Moon className="h-4 w-4" strokeWidth={1.5} />}
              <span className="hidden sm:inline">{t('common.dark')}</span>
            </Button>
            {user ? <Button variant="tertiary" className="hidden lg:inline-flex" onClick={signOut}>{t('nav.signout')}</Button> : <div className="hidden items-center gap-2 lg:flex"><Link to="/auth" className="inline-flex min-h-11 items-center rounded-full border border-ink px-5 text-sm font-semibold">{t('nav.signin')}</Link><Link to="/register" className="accent-action inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold">{t('account.create')}</Link></div>}
          </div>
        </div>
      </header>
      <main id="content">
        <Outlet />
      </main>
      <footer className="mt-24 border-t border-gray-200">
        <div className="container-grid grid gap-8 py-12 md:grid-cols-4">
          <div><p className="text-xl font-extrabold">{t('brand')}</p><p className="mt-3 text-sm text-gray-600">{t('home.subtitle')}</p></div>
          <Link to="/about">{t('static.about')}</Link>
          <Link to="/terms">{t('static.terms')}</Link>
          <Link to="/privacy">{t('static.privacy')}</Link>
          <Switch checked={dark} onChange={setDark} label={t('common.dark')} />
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}
