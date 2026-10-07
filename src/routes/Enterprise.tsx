import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Field, Input, Textarea } from '../components/ui/Form';

const schema = z.object({ company: z.string().min(2), headcount: z.coerce.number().min(1), dates: z.string().min(2), budget: z.string().min(2), requirements: z.string().min(10) });
type EnterpriseForm = z.infer<typeof schema>;

export default function Enterprise() {
  const { t } = useTranslation();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<EnterpriseForm>({ resolver: zodResolver(schema) });
  return (
    <section className="container-grid py-12">
      <Helmet><title>{t('enterprise.title')} · {t('brand')}</title></Helmet>
      <h1 className="display mb-10 text-5xl font-extrabold md:text-7xl">{t('enterprise.title')}</h1>
      {done ? <p className="border border-success p-6 text-success">{t('enterprise.success')}</p> : <form className="grid max-w-3xl gap-5" onSubmit={handleSubmit(() => setDone(true))}>
        <Field label={t('enterprise.company')} error={errors.company?.message}><Input {...register('company')} /></Field>
        <Field label={t('enterprise.headcount')} error={errors.headcount?.message}><Input type="number" {...register('headcount')} /></Field>
        <Field label={t('enterprise.dates')} error={errors.dates?.message}><Input {...register('dates')} /></Field>
        <Field label={t('enterprise.budget')} error={errors.budget?.message}><Input {...register('budget')} /></Field>
        <Field label={t('enterprise.requirements')} error={errors.requirements?.message}><Textarea {...register('requirements')} /></Field>
        <Field label={t('enterprise.file')}><Input type="file" /></Field>
        <Button type="submit">{t('actions.send')}</Button>
      </form>}
    </section>
  );
}
