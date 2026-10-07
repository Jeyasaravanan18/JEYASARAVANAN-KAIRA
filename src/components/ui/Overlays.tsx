import { X } from 'lucide-react';
import { Button } from './Button';

export function Dialog({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/20 p-4" role="presentation">
      <div className="w-full max-w-lg rounded bg-paper p-6 shadow-overlay" role="dialog" aria-modal="true" aria-label={title}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button type="button" variant="tertiary" onClick={onClose} aria-label={title}><X className="h-5 w-5" strokeWidth={1.5} /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="grid gap-2 border-y border-gray-200 py-4 sm:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-3 text-sm">
          <span className={`grid h-7 w-7 place-items-center rounded border ${index <= current ? 'border-ink bg-ink text-paper' : 'border-gray-200'}`}>{index + 1}</span>
          <span className={index === current ? 'font-semibold' : 'text-gray-600'}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function Accordion({ items }: { items: { title: string; content: string }[] }) {
  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {items.map((item) => (
        <details key={item.title} className="py-4">
          <summary className="cursor-pointer font-semibold">{item.title}</summary>
          <p className="mt-3 text-sm text-gray-600">{item.content}</p>
        </details>
      ))}
    </div>
  );
}
