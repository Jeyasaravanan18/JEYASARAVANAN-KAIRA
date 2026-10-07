import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function StaticPage({ page }: { page: 'about' | 'terms' | 'privacy' | 'notFound' }) {
  const { t } = useTranslation();
  return (
    <section className="container-grid py-20">
      <Helmet><title>{t(`static.${page}`)} · {t('brand')}</title></Helmet>
      <p className="label">{t('brand')}</p>
      <h1 className="mt-4 text-5xl font-semibold">{t(`static.${page}`)}</h1>
      <div className="mt-8 max-w-3xl space-y-4 text-gray-600">
        <p>{t('home.subtitle')}</p>
        <p>{t('static.consent')}</p>
      </div>
    </section>
  );
}
