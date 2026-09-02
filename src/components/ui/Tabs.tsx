import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800/80',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-3 py-1 rounded-md text-xs font-medium transition-colors select-none flex items-center gap-1.5',
              isActive
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded font-mono',
                  isActive ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-500'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
