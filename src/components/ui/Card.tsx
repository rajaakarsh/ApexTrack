import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  glass = true,
  hoverable = false,
  glow = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 border transition-all duration-200',
        glass ? 'bg-slate-900/60 backdrop-blur-md border-slate-800/80 shadow-glass' : 'bg-slate-900 border-slate-800',
        hoverable && 'hover:border-slate-700 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer',
        glow && 'border-brand-500/30 shadow-glow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('text-base font-semibold text-slate-100 flex items-center gap-2', className)} {...props}>
    {children}
  </h3>
);
