import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { QuickTaskModal } from './QuickTaskModal';
import { MergeDataModal } from './MergeDataModal';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTimerStore } from '../../store/useTimerStore';

export const AppLayout: React.FC = () => {
  const { settings } = useSettingsStore();
  const { tick } = useTimerStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quickTaskOpen, setQuickTaskOpen] = useState(false);

  // Global Timer Tick (1s interval)
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  // Global Keyboard Shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickTaskOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set Theme, Accent, and Font on root container
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.themeMode);
    document.documentElement.setAttribute('data-accent', settings.accentColor);
    document.documentElement.style.setProperty('--font-sans', `'${settings.fontFamily}', system-ui, sans-serif`);
  }, [settings.themeMode, settings.accentColor, settings.fontFamily]);

  return (
    <div
      className="min-h-screen bg-[var(--bg-main)] text-slate-100 flex relative selection:bg-brand-500/30 selection:text-brand-300"
      data-theme={settings.themeMode}
      data-accent={settings.accentColor}
    >
      {/* Optional Custom Background Wallpaper Overlay */}
      {settings.backgroundImage && settings.backgroundImage !== 'none' && (
        <div
          className="fixed inset-0 pointer-events-none bg-cover bg-center z-0 transition-opacity duration-300"
          style={{
            backgroundImage: `url(${settings.backgroundImage})`,
            opacity: settings.backgroundOpacity || 0.15,
          }}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block z-20">
        <Sidebar />
      </div>

      {/* Mobile Nav Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6 z-10">
        <Topbar
          onOpenQuickTask={() => setQuickTaskOpen(true)}
          onToggleMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <QuickTaskModal isOpen={quickTaskOpen} onClose={() => setQuickTaskOpen(false)} />
      <MergeDataModal />
    </div>
  );
};
