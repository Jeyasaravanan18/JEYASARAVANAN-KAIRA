import { forwardRef } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'accent';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', ...props }, ref) => (
  <button
    ref={ref}
    className={clsx(
      'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
      variant === 'primary' && 'accent-action border',
      variant === 'accent' && 'accent-action border',
      variant === 'secondary' && 'border border-ink bg-paper text-ink hover:bg-gray-50',
      variant === 'tertiary' && 'min-h-0 px-0 py-0 underline underline-offset-4',
      className,
    )}
    {...props}
  />
));
Button.displayName = 'Button';
