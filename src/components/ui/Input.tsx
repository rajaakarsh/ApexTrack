import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-zinc-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-9 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 px-3 transition-colors',
              'focus:outline-none focus:border-zinc-600 focus:bg-zinc-900',
              leftIcon ? 'pl-9' : '',
              rightIcon ? 'pr-9' : '',
              error ? 'border-rose-500/50 focus:border-rose-500' : '',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-zinc-500 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-[11px] text-rose-400">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-zinc-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-zinc-300">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 p-3 transition-colors',
            'focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 min-h-[80px]',
            error ? 'border-rose-500/50 focus:border-rose-500' : '',
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-400">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-zinc-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
