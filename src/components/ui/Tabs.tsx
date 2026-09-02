import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pill' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pill',
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 p-1 rounded-xl',
        variant === 'pill' ? 'bg-slate-900/90 border border-slate-800' : 'border-b border-slate-800',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors z-10 select-none',
              isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
          >
            {isActive && variant === 'pill' && (
              <motion.div
                layoutId="active-tab-bg"
                className="absolute inset-0 bg-brand-500 rounded-lg -z-10 shadow-sm shadow-brand-500/30"
                transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              />
            )}
            {tab.icon && <span className="w-3.5 h-3.5 flex items-center">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
