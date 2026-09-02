import React from 'react';
import { cn } from '../../lib/utils';
import { Priority, TaskStatus } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700/60',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-lg gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border tracking-wide uppercase',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'sm',
}) => {
  const map: Record<Priority, { variant: 'danger' | 'warning' | 'info'; label: string; dot: string }> = {
    high: { variant: 'danger', label: 'High', dot: 'bg-rose-400' },
    medium: { variant: 'warning', label: 'Medium', dot: 'bg-amber-400' },
    low: { variant: 'info', label: 'Low', dot: 'bg-sky-400' },
  };

  const info = map[priority];

  return (
    <Badge variant={info.variant} size={size} className="capitalize">
      <span className={cn('w-1.5 h-1.5 rounded-full inline-block mr-1', info.dot)} />
      {info.label}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: TaskStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  const map: Record<TaskStatus, { variant: 'default' | 'warning' | 'success'; label: string }> = {
    todo: { variant: 'default', label: 'To Do' },
    in_progress: { variant: 'warning', label: 'In Progress' },
    done: { variant: 'success', label: 'Done' },
  };

  const info = map[status];
  return <Badge variant={info.variant} size={size}>{info.label}</Badge>;
};
