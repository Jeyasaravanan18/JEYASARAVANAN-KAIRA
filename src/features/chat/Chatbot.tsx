import { FormEvent, useEffect, useRef, useState } from 'react';
import { MessageSquare, Minus, Send, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { events } from '../../lib/mock/events';
import { useChatStore } from '../../store/chat';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Form';

function answer(input: string, t: (key: string) => string) {
  const text = input.toLowerCase();
  if (/refund|cancel/.test(text)) return t('chat.refund');
  if (/access|wheel|caption/.test(text)) return t('chat.accessibility');
  if (/currency|language/.test(text)) return t('chat.currency');
  if (/human|agent|person/.test(text)) return t('chat.human');
  if (/asm-|booking|reference/.test(text)) return t('chat.status');
  if (/price|ticket/.test(text)) return `${t('chat.found')} ${events.slice(0, 2).map((event) => event.title).join(', ')}`;
  if (/event|city|design|music|finance|tokyo|mumbai|london/.test(text)) return `${t('chat.found')} ${events.slice(0, 3).map((event) => `${event.title} (${event.city})`).join('; ')}`;
  return t('chat.fallback');
}

export function Chatbot() {
  const { t, i18n } = useTranslation();
  const { open, setOpen, messages, addMessage, clear } = useChatStore();
  const [value, setValue] = useState('');
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) input.current?.focus(); else launcher.current?.focus(); }, [open]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [setOpen]);
  const send = (event?: FormEvent) => {
    event?.preventDefault();
    if (!value.trim()) return;
    addMessage({ id: crypto.randomUUID(), role: 'user', text: value, createdAt: new Date().toISOString() });
    const response = answer(value, t);
    setValue('');
    window.setTimeout(() => addMessage({ id: crypto.randomUUID(), role: 'assistant', text: response, createdAt: new Date().toISOString() }), 350);
  };
  return (
    <div className="chatbot no-print">
      <button ref={launcher} type="button" onClick={() => setOpen(true)} className="accent-action fixed bottom-5 end-5 z-50 grid h-14 w-14 place-items-center rounded-full border shadow-overlay" aria-label={t('chat.assistant')}>
        <MessageSquare className="h-6 w-6" strokeWidth={1.5} /><span className="absolute end-2 top-2 h-2 w-2 rounded bg-error" />
      </button>
      {open ? <section role="dialog" aria-modal="true" aria-label={t('chat.assistant')} className="floating-panel fixed bottom-5 end-5 z-50 flex h-[min(560px,calc(100vh-40px))] w-[min(380px,calc(100vw-32px))] flex-col bg-paper ring-1 ring-gray-200">
        <header className="flex items-center justify-between border-b border-gray-200 p-4"><div><h2 className="font-semibold">{t('chat.assistant')}</h2><p className="text-xs text-gray-600">{i18n.language.toUpperCase()} · {t('common.automated')}</p></div><div className="flex gap-2"><Button variant="tertiary" onClick={() => setOpen(false)}><Minus className="h-5 w-5" strokeWidth={1.5} /></Button><Button variant="tertiary" onClick={() => setOpen(false)}><X className="h-5 w-5" strokeWidth={1.5} /></Button></div></header>
        <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">{messages.map((message) => <p key={message.id} className={`max-w-[85%] rounded-3xl border border-gray-200 p-3 text-sm ${message.role === 'user' ? 'ms-auto bg-gray-50' : ''}`}><span>{message.text}</span><time className="mt-1 block text-xs text-gray-600">{new Date(message.createdAt).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</time></p>)}</div>
        <div className="flex flex-wrap gap-2 border-t border-gray-200 p-3">{['events', 'prices', 'refund', 'human'].map((key) => <button key={key} className="rounded-full border border-gray-200 px-3 py-1 text-xs" onClick={() => setValue(t(`chat.quick.${key}`))}>{t(`chat.quick.${key}`)}</button>)}<button className="rounded-full border border-gray-200 px-3 py-1 text-xs" onClick={clear}>{t('actions.clear')}</button></div>
        <form onSubmit={send} className="flex gap-2 p-3"><Input ref={input} value={value} onChange={(event) => setValue(event.target.value)} placeholder={t('chat.placeholder')} className="flex-1" /><Button type="submit" aria-label={t('actions.send')}><Send className="h-4 w-4" strokeWidth={1.5} /></Button></form>
      </section> : null}
    </div>
  );
}
