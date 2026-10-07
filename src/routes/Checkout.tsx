import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useEvent } from '../hooks/useEvent';
import { addOns } from '../lib/mock/events';
import { calculatePrice } from '../lib/booking/pricing';
import { formatCurrency } from '../lib/format/currency';
import { useBookingStore } from '../store/booking';
import { useUiStore } from '../store/ui';
import { Button } from '../components/ui/Button';
import { Checkbox, Field, Input, Select } from '../components/ui/Form';
import { Stepper } from '../components/ui/Overlays';
import { ErrorState, Skeleton } from '../components/ui/Feedback';

const schema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().min(7), card: z.string().optional(), method: z.string() });
type CheckoutForm = z.infer<typeof schema>;

function luhn(value: string) {
  const digits = value.replace(/\D/g, '').split('').reverse().map(Number);
  const sum = digits.reduce((acc, digit, index) => acc + (index % 2 ? Math.floor((digit * 2) / 10) + ((digit * 2) % 10) : digit), 0);
  return digits.length >= 12 && sum % 10 === 0;
}

export default function Checkout() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { event, loading, error, reload } = useEvent(slug);
  const { lines, addOns: selectedAddOns, toggleAddOn, discountCode, setDiscountCode, addBooking, clearCart } = useBookingStore();
  const { currency } = useUiStore();
  const [step, setStep] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({ resolver: zodResolver(schema), defaultValues: { method: 'card' } });
  const chosenAddOns = addOns.filter((item) => selectedAddOns.includes(item.id));
  const breakdown = useMemo(() => event ? calculatePrice(event, lines.filter((line) => line.eventId === event.id), chosenAddOns, discountCode) : null, [chosenAddOns, discountCode, event, lines]);
  if (loading) return <div className="container-grid py-12"><Skeleton className="h-96" /></div>;
  if (error || !event || !breakdown) return <div className="container-grid py-12"><ErrorState title={t('common.error')} retryLabel={t('actions.retry')} onRetry={reload} /></div>;
  const submit = (data: CheckoutForm) => {
    if (data.method === 'card' && !luhn(data.card ?? '')) return;
    const reference = `ASM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    addBooking({ id: crypto.randomUUID(), reference, eventId: event.id, lines: lines.filter((line) => line.eventId === event.id), addOns: selectedAddOns, attendee: { name: data.name, email: data.email, phone: data.phone }, totalUsd: breakdown.totalUsd, createdAt: new Date().toISOString(), status: 'upcoming' });
    clearCart();
    navigate(`/confirmation/${reference}`);
  };
  return (
    <section className="container-grid py-12">
      <Helmet><title>{t('checkout.title')} · {t('brand')}</title></Helmet>
      <h1 className="premium-title mb-6 text-4xl font-semibold">{t('checkout.title')}</h1>
      <Stepper steps={[t('checkout.attendee'), t('checkout.addons.title'), t('checkout.payment'), t('checkout.review')]} current={step} />
      <form className="grid gap-10 py-8 lg:grid-cols-[1fr_360px]" onSubmit={handleSubmit(submit)}>
        <div className="luxe-card grid gap-6 border p-5">
          {step === 0 ? <div className="grid gap-4"><Field label={t('checkout.name')} error={errors.name?.message}><Input {...register('name')} /></Field><Field label={t('checkout.email')} error={errors.email ? t('validation.email') : undefined}><Input type="email" {...register('email')} /></Field><Field label={t('checkout.phone')} error={errors.phone?.message}><Input {...register('phone')} /></Field></div> : null}
          {step === 1 ? <div className="grid gap-2">{addOns.map((item) => <Checkbox key={item.id} label={`${t(item.labelKey)} · ${formatCurrency(item.priceUsd, currency, i18n.language)}`} checked={selectedAddOns.includes(item.id)} onChange={() => toggleAddOn(item.id)} />)}</div> : null}
          {step === 2 ? <div className="grid gap-4"><Field label={t('checkout.method')}><Select {...register('method')}><option value="card">{t('checkout.card')}</option><option value="upi">{t('checkout.upi')}</option><option value="bank">{t('checkout.bank')}</option><option value="invoice">{t('checkout.invoice')}</option></Select></Field><Field label={t('checkout.card')} error={errors.card?.message}><Input inputMode="numeric" {...register('card')} placeholder="4242 4242 4242 4242" /></Field></div> : null}
          {step === 3 ? <div className="grid gap-4"><p className="premium-title text-xl font-semibold">{event.title}</p><Field label={t('checkout.code')}><Input value={discountCode} onChange={(event) => setDiscountCode(event.target.value)} /></Field></div> : null}
          <div className="flex gap-3"><Button type="button" variant="secondary" onClick={() => setStep(Math.max(0, step - 1))}>{t('actions.back')}</Button>{step < 3 ? <Button type="button" onClick={() => setStep(step + 1)}>{t('actions.continue')}</Button> : <Button type="submit">{t('checkout.place')}</Button>}</div>
        </div>
        <aside className="luxe-card h-max border p-5">
          {[['checkout.subtotal', breakdown.subtotalUsd], ['checkout.fees', breakdown.feesUsd], ['checkout.tax', breakdown.taxUsd], ['checkout.discount', -breakdown.discountUsd], ['checkout.total', breakdown.totalUsd]].map(([key, value]) => <p key={key} className="flex justify-between border-b border-gray-200 py-3"><span>{t(String(key))}</span><span className="tabular">{formatCurrency(Number(value), currency, i18n.language)}</span></p>)}
        </aside>
      </form>
    </section>
  );
}
