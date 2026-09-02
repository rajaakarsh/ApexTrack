import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg select-none transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400';

    const variants = {
      primary:
        'bg-zinc-100 text-zinc-950 hover:bg-white border border-transparent shadow-sm',
      glow:
        'bg-zinc-100 text-zinc-950 hover:bg-white border border-transparent shadow-sm',
      secondary:
        'bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-100',
      outline:
        'bg-transparent border border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100',
      ghost:
        'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60',
      danger:
        'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/30',
    };

    const sizes = {
      sm: 'h-7 px-2.5 text-[11px]',
      md: 'h-8.5 px-3.5 text-xs',
      lg: 'h-10 px-4 text-xs font-semibold',
      icon: 'h-8 w-8 p-0 text-xs',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5 flex-shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
