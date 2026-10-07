import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Field, Input, Textarea } from '../components/ui/Form';
import { Accordion } from '../components/ui/Overlays';

export default function Help() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  return (
    <section className="container-grid grid gap-12 py-12 lg:grid-cols-2">
      <Helmet><title>{t('help.title')} · {t('brand')}</title></Helmet>
      <div>
        <h1 className="mb-6 text-4xl font-semibold">{t('help.title')}</h1>
        <Input placeholder={t('help.search')} className="mb-8 w-full" />
        <Accordion items={[{ title: t('detail.refunds'), content: t('chat.refund') }, { title: t('detail.accessibility'), content: t('chat.accessibility') }, { title: t('static.cookies'), content: t('static.consent') }]} />
      </div>
      <form className="luxe-card grid h-max gap-4 border p-6" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
        <h2 className="text-2xl font-semibold">{t('help.contact')}</h2>
        {sent ? <p className="text-success">{t('help.success')}</p> : null}
        <Field label={t('checkout.email')}><Input type="email" required /></Field>
        <Field label={t('help.message')}><Textarea required /></Field>
        <Button type="submit">{t('actions.send')}</Button>
      </form>
    </section>
  );
}
