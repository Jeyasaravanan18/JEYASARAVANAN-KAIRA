import { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      {children}
      {error ? <span className="text-sm text-error">{error}</span> : null}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input ref={ref} {...props} className={clsx('min-h-11 rounded-2xl border border-gray-200 bg-paper px-4 text-ink placeholder:text-gray-400', props.className)} />
));
Input.displayName = 'Input';

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx('min-h-28 rounded-2xl border border-gray-200 bg-paper px-4 py-3 text-ink placeholder:text-gray-400', props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative">
      <select {...props} className={clsx('min-h-11 w-full appearance-none rounded-2xl border border-gray-200 bg-paper px-4 pe-10 text-ink', props.className)} />
      <ChevronDown aria-hidden className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2" strokeWidth={1.5} />
    </span>
  );
}

export function Checkbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-sm">
      <input type="checkbox" className="h-4 w-4 accent-ink" {...props} />
      <span>{label}</span>
    </label>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <button type="button" aria-pressed={checked} onClick={() => onChange(!checked)} className="inline-flex min-h-11 items-center gap-3 text-sm">
      <span className={clsx('relative h-6 w-10 rounded border border-ink', checked && 'bg-ink')}>
        <span className={clsx('absolute top-1 h-4 w-4 rounded-sm bg-ink transition', checked ? 'end-1 bg-paper' : 'start-1')} />
      </span>
      {label}
    </button>
  );
}
