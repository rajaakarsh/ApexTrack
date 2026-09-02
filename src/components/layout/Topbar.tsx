import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  Play,
  Pause,
  Cloud,
  CloudOff,
  Bell,
  Sparkles,
  Menu,
  Clock,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../context/AuthContext';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTimerStore } from '../../store/useTimerStore';
import { usePeerStore } from '../../store/usePeerStore';
import { Button } from '../ui/Button';
import { calculateExamCountdown, formatTimerClock } from '../../lib/utils';

export interface TopbarProps {
  onOpenQuickTask: () => void;
  onToggleMobileNav: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenQuickTask, onToggleMobileNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, setMergeModalOpen } = useAppStore();
  const { user, isGuest, signOut } = useAuth();
  const { settings } = useSettingsStore();
  const { isRunning, isPaused, secondsLeft, mode, startTimer, pauseTimer, resumeTimer } = useTimerStore();
  const { incomingNudges, dismissNudge } = usePeerStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const countdown = calculateExamCountdown(profile.examDate);

  // Derive route title
  const getPageTitle = (pathname: string) => {
    if (pathname.includes('planner')) return { title: 'Study Planner', desc: 'Manage and prioritize your daily preparation tasks' };
    if (pathname.includes('targets')) return { title: 'Preparation Targets', desc: 'Weekly sprints and long-term milestones' };
    if (pathname.includes('timer')) return { title: 'Deep Work Focus Timer', desc: 'Structured focus blocks with ambient sound synthesis' };
    if (pathname.includes('syllabus')) return { title: 'Syllabus Tracker', desc: 'Hierarchical progress tracking across all subjects' };
    if (pathname.includes('analytics')) return { title: 'Focus Analytics', desc: 'Comprehensive study momentum and consistency heatmaps' };
    if (pathname.includes('mocks')) return { title: 'Mock Test Analytics', desc: 'Score trajectories and accuracy evaluations' };
    if (pathname.includes('error-log')) return { title: 'Mistake & Error Log', desc: 'Diagnose weak areas and conceptual pitfalls' };
    if (pathname.includes('daily-questions')) return { title: 'Daily Questions Tracker', desc: 'Solve volume throughput and subject consistency' };
    if (pathname.includes('peers')) return { title: 'Accountability Peers', desc: 'Live partner study statuses and high-fives' };
    if (pathname.includes('groups')) return { title: 'Study Groups', desc: 'Collaborative cohort rooms and leaderboards' };
    if (pathname.includes('leaderboard')) return { title: 'Global Leaderboard', desc: 'Rankings based on pure focused study hours' };
    if (pathname.includes('settings')) return { title: 'System Settings', desc: 'Themes, typography, wallpapers, and backups' };
    return { title: 'Dashboard', desc: 'Track your preparation and stay consistent.' };
  };

  const pageInfo = getPageTitle(location.pathname);
  const avatarUrl = profile.avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = profile.displayName || user?.user_metadata?.full_name || 'Aspirant';

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090d16]/85 backdrop-blur-2xl px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle & Page Title Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-slate-100 leading-tight">{pageInfo.title}</h2>
          <p className="text-[11px] text-slate-400 leading-tight truncate max-w-xs md:max-w-md">{pageInfo.desc}</p>
        </div>
      </div>

      {/* Right: Actions, Countdown, Quick Timer, Notifications, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Exam Countdown Pill */}
        {settings.showCountdown && (
          <div
            onClick={() => navigate('/app/settings')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all duration-150"
            title="Click to configure exam date in Settings"
          >
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-extrabold text-slate-100 font-mono text-sm tracking-tight text-brand-400">
                {countdown.days}d
              </span>
              <span className="text-[11px] text-slate-400">to {profile.targetExam}</span>
            </div>
          </div>
        )}

        {/* Quick Timer Control Widget */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase font-mono block leading-none font-bold">
              {mode} {isRunning ? (isPaused ? 'Paused' : 'Active') : 'Idle'}
            </span>
            <span className="text-xs font-bold font-mono text-slate-100">
              {formatTimerClock(secondsLeft)}
            </span>
          </div>

          {!isRunning ? (
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-6 w-6 text-brand-400 hover:bg-brand-500/20"
              onClick={() => {
                startTimer();
                navigate('/app/timer');
              }}
            >
              <Play className="w-3 h-3 fill-current" />
            </Button>
          ) : isPaused ? (
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-6 w-6 text-emerald-400 hover:bg-emerald-500/20"
              onClick={resumeTimer}
            >
              <Play className="w-3 h-3 fill-current" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-6 w-6 text-amber-400 hover:bg-amber-500/20"
              onClick={pauseTimer}
            >
              <Pause className="w-3 h-3 fill-current" />
            </Button>
          )}
        </div>

        {/* Quick Add Task Button */}
        <Button
          size="sm"
          variant="glow"
          onClick={onOpenQuickTask}
          className="gap-1.5 text-xs font-bold shadow-glow-sm h-8 px-3"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </Button>

        {/* Cloud Sync Status */}
        {isGuest ? (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 text-xs transition-colors"
            title="Running in local guest mode. Click to sign in with Google."
          >
            <CloudOff className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline text-[11px] font-medium text-amber-400">Guest Mode</span>
          </button>
        ) : (
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs"
            title={`Authenticated as ${user?.email}`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px] font-medium">Google Synced</span>
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {incomingNudges.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-dropdown p-4 shadow-2xl z-50 text-slate-100 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Peer Nudges & Alerts</span>
                <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  {incomingNudges.length} New
                </span>
              </div>

              {incomingNudges.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No new notifications</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {incomingNudges.map((nudge) => (
                    <div
                      key={nudge.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-semibold text-brand-300">{nudge.from}</p>
                        <p className="text-xs text-slate-300 mt-0.5">{nudge.message}</p>
                      </div>
                      <button
                        onClick={() => dismissNudge(nudge.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-200"
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

        {/* Profile Avatar Trigger */}
        <div
          onClick={() => navigate('/app/settings')}
          className="w-8 h-8 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center font-bold text-xs text-brand-400 border border-slate-700 cursor-pointer hover:border-brand-500 transition-colors"
          title="Account Settings"
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
