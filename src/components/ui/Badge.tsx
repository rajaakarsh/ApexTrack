import React from 'react';
import { cn } from '../../lib/utils';
import { Priority, TaskStatus } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700/50',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    outline: 'bg-transparent text-zinc-400 border border-zinc-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const map = {
    high: { label: 'High', variant: 'danger' as const },
    medium: { label: 'Medium', variant: 'warning' as const },
    low: { label: 'Low', variant: 'default' as const },
  };
  const { label, variant } = map[priority] || map.medium;
  return <Badge variant={variant}>{label}</Badge>;
};

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const map = {
    todo: { label: 'To Do', variant: 'outline' as const },
    in_progress: { label: 'In Progress', variant: 'info' as const },
    done: { label: 'Done', variant: 'success' as const },
  };
  const { label, variant } = map[status] || map.todo;
  return <Badge variant={variant}>{label}</Badge>;
};
