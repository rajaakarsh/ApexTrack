import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Menu, Clock, Bell, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../context/AuthContext';
import { useSettingsStore } from '../../store/useSettingsStore';
import { usePeerStore } from '../../store/usePeerStore';
import { Button } from '../ui/Button';
import { calculateExamCountdown } from '../../lib/utils';

export interface TopbarProps {
  onOpenQuickTask: () => void;
  onToggleMobileNav: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenQuickTask, onToggleMobileNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAppStore();
  const { user, isGuest } = useAuth();
  const { settings } = useSettingsStore();
  const { incomingNudges, dismissNudge } = usePeerStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const countdown = calculateExamCountdown(profile.examDate);

  const getPageTitle = (pathname: string) => {
    if (pathname.includes('planner')) return 'Planner';
    if (pathname.includes('targets')) return 'Targets';
    if (pathname.includes('timer')) return 'Focus';
    if (pathname.includes('syllabus')) return 'Syllabus';
    if (pathname.includes('analytics')) return 'Analytics';
    if (pathname.includes('mocks')) return 'Mock Tests';
    if (pathname.includes('error-log')) return 'Error Log';
    if (pathname.includes('daily-questions')) return 'Daily Questions';
    if (pathname.includes('peers')) return 'Peers';
    if (pathname.includes('groups')) return 'Study Groups';
    if (pathname.includes('leaderboard')) return 'Leaderboard';
    if (pathname.includes('settings')) return 'Settings';
    return 'Overview';
  };

  const title = getPageTitle(location.pathname);
  const avatarUrl = profile.avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = profile.displayName || user?.user_metadata?.full_name || 'Aspirant';

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-[#0A0A0A] px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-sm font-semibold text-zinc-100">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Exam Countdown Pill */}
        {settings.showCountdown && (
          <div
            onClick={() => navigate('/app/settings')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:border-zinc-700 cursor-pointer transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono font-medium text-zinc-100">{countdown.days}d</span>
            <span className="text-zinc-500">to {profile.targetExam}</span>
          </div>
        )}

        {/* Quick Add Task Button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={onOpenQuickTask}
          className="gap-1.5 text-xs h-7.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
          <kbd className="hidden md:inline text-[9px] font-mono text-zinc-500 bg-zinc-800 px-1 py-0.2 rounded border border-zinc-700 ml-1">
            ⌘K
          </kbd>
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {incomingNudges.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-zinc-100" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#111111] border border-zinc-800 p-4 shadow-xl z-50 text-zinc-100 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
                <span>Notifications</span>
                <span className="text-[10px] text-zinc-500 font-mono">{incomingNudges.length}</span>
              </div>

              {incomingNudges.length === 0 ? (
                <p className="text-xs text-zinc-500 py-2 text-center">No notifications</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {incomingNudges.map((nudge) => (
                    <div
                      key={nudge.id}
                      className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-start justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-medium text-zinc-200">{nudge.from}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{nudge.message}</p>
                      </div>
                      <button
                        onClick={() => dismissNudge(nudge.id)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div
          onClick={() => navigate('/app/settings')}
          className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-xs font-medium text-zinc-200 cursor-pointer hover:border-zinc-500 transition-colors"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>{displayName.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </div>
    </header>
  );
};
