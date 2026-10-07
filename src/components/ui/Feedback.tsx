import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from './Button';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl bg-gray-200 ${className}`} />;
}

export function EmptyState({ title }: { title: string }) {
  return (
    <div className="luxe-card grid min-h-64 place-items-center border p-8 text-center">
      <Inbox className="mx-auto mb-4 h-8 w-8" strokeWidth={1.5} />
      <p className="font-semibold">{title}</p>
    </div>
  );
}

export function ErrorState({ title, onRetry, retryLabel }: { title: string; onRetry?: () => void; retryLabel: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-3xl border border-error p-8 text-center">
      <AlertCircle className="mx-auto mb-4 h-8 w-8 text-error" strokeWidth={1.5} />
      <p className="mb-4 font-semibold">{title}</p>
      {onRetry ? <Button variant="secondary" onClick={onRetry}>{retryLabel}</Button> : null}
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">{children}</span>;
}
