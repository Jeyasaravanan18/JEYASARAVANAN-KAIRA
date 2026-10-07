import { Suspense, lazy, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dirFor } from '../lib/i18n/config';
import { useUiStore } from '../store/ui';
import { Layout } from '../components/layout/Layout';
import { ErrorState, Skeleton } from '../components/ui/Feedback';

const Home = lazy(() => import('../routes/Home'));
const Events = lazy(() => import('../routes/Events'));
const EventDetail = lazy(() => import('../routes/EventDetail'));
const Booking = lazy(() => import('../routes/Booking'));
const Checkout = lazy(() => import('../routes/Checkout'));
const Confirmation = lazy(() => import('../routes/Confirmation'));
const MyBookings = lazy(() => import('../routes/MyBookings'));
const Auth = lazy(() => import('../routes/Auth'));
const Enterprise = lazy(() => import('../routes/Enterprise'));
const Help = lazy(() => import('../routes/Help'));
const StaticPage = lazy(() => import('../routes/StaticPage'));

function RouteError() {
  const { t } = useTranslation();
  return <ErrorState title={t('static.serverError')} retryLabel={t('actions.retry')} onRetry={() => window.location.reload()} />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'events', element: <Events /> },
      { path: 'events/:slug', element: <EventDetail /> },
      { path: 'events/:slug/book', element: <Booking /> },
      { path: 'checkout/:slug', element: <Checkout /> },
      { path: 'confirmation/:reference', element: <Confirmation /> },
      { path: 'bookings', element: <MyBookings /> },
      { path: 'auth', element: <Auth /> },
      { path: 'register', element: <Auth /> },
      { path: 'enterprise', element: <Enterprise /> },
      { path: 'help', element: <Help /> },
      { path: 'about', element: <StaticPage page="about" /> },
      { path: 'terms', element: <StaticPage page="terms" /> },
      { path: 'privacy', element: <StaticPage page="privacy" /> },
      { path: '*', element: <StaticPage page="notFound" /> },
    ],
  },
]);

export function App() {
  const { i18n } = useTranslation();
  const { language, dark } = useUiStore();

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = dirFor(language);
    document.documentElement.classList.toggle('dark', dark);
  }, [dark, i18n, language]);

  return (
    <Suspense fallback={<div className="container-grid py-20"><Skeleton className="h-96" /></div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
