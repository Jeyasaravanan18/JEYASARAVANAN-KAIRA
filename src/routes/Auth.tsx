import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Form';

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
type AuthForm = z.infer<typeof schema>;

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((state) => state.signIn);
  const initialMode = useMemo(() => (location.pathname.includes('register') ? 'create' : 'signin'), [location.pathname]);
  const [mode, setMode] = useState<'signin' | 'create' | 'forgot'>(initialMode);
  const { register, handleSubmit, formState: { errors } } = useForm<AuthForm>({ resolver: zodResolver(schema) });
  const submit = (data: AuthForm) => { signIn(data.email); navigate('/bookings'); };
  return (
    <section className="container-grid grid min-h-[70vh] place-items-center py-12">
      <Helmet><title>{t('account.title')} · {t('brand')}</title></Helmet>
      <form onSubmit={handleSubmit(submit)} className="luxe-card grid w-full max-w-md gap-5 border p-6">
        <h1 className="premium-title text-3xl font-semibold">{t(`account.${mode}`)}</h1>
        <Field label={t('checkout.email')} error={errors.email ? t('validation.email') : undefined}><Input type="email" {...register('email')} /></Field>
        {mode !== 'forgot' ? <Field label={t('account.password')} error={errors.password ? t('validation.min') : undefined}><Input type="password" {...register('password')} /></Field> : null}
        <Button type="submit">{t('actions.continue')}</Button>
        <Button type="button" variant="secondary" onClick={() => signIn('work@example.com', 'Work Account')}>{t('account.work')}</Button>
        <div className="flex justify-between text-sm"><button type="button" className="underline" onClick={() => setMode(mode === 'create' ? 'signin' : 'create')}>{mode === 'create' ? t('account.signin') : t('account.create')}</button><button type="button" className="underline" onClick={() => setMode('forgot')}>{t('account.forgot')}</button></div>
      </form>
    </section>
  );
}
