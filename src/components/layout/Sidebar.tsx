import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Timer,
  BookOpen,
  FileText,
  AlertOctagon,
  HelpCircle,
  BarChart3,
  Users,
  Shield,
  Trophy,
  Settings,
  Flame,
  Zap,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 select-none',
        isActive
          ? 'bg-brand-500/15 text-brand-400 font-bold border border-brand-500/30 shadow-sm shadow-brand-500/10'
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
      )
    }
  >
    <div className="flex items-center gap-3">
      <span className="w-4 h-4 text-current transition-transform duration-200 group-hover:scale-110 flex items-center justify-center">
        {icon}
      </span>
      <span className="tracking-wide">{label}</span>
    </div>
    {badge !== undefined && (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold border border-slate-700">
        {badge}
      </span>
    )}
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAppStore();
  const { user, isGuest, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = profile.displayName || user?.user_metadata?.full_name || 'Aspirant';
  const email = user?.email;
  const avatarUrl = profile.avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 bg-[#090d16]/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between p-4 z-30 select-none overflow-y-auto">
      {/* Brand & Exam Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-400 flex items-center justify-center text-slate-950 font-black shadow-glow-sm">
              <Zap className="w-4.5 h-4.5 fill-slate-950" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-wider text-slate-100 uppercase">
                Apex<span className="text-brand-400">Track</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Study Operating System</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-300 text-[11px] font-bold font-mono shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{profile.streakCount}d</span>
          </div>
        </div>

        {/* Target Exam Pill */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-widest">Active Target</p>
            <p className="text-xs font-bold text-slate-100 truncate mt-0.5">{profile.targetExam} {profile.targetYear}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5 pt-1">
          {/* Section: WORKSPACE */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Workspace</p>
            <NavItem to="/app/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
            <NavItem to="/app/planner" icon={<CheckSquare className="w-4 h-4" />} label="Planner & Tasks" />
            <NavItem to="/app/targets" icon={<Target className="w-4 h-4" />} label="Targets" />
            <NavItem to="/app/timer" icon={<Timer className="w-4 h-4" />} label="Focus Timer" />
            <NavItem to="/app/syllabus" icon={<BookOpen className="w-4 h-4" />} label="Syllabus Tracker" />
          </div>

          {/* Section: ANALYTICS */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Analytics</p>
            <NavItem to="/app/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Focus Analytics" />
            <NavItem to="/app/mocks" icon={<FileText className="w-4 h-4" />} label="Mock Tests" />
            <NavItem to="/app/error-log" icon={<AlertOctagon className="w-4 h-4" />} label="Mistake Log" />
            <NavItem to="/app/daily-questions" icon={<HelpCircle className="w-4 h-4" />} label="Daily Questions" />
          </div>

          {/* Section: COMMUNITY */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Community</p>
            <NavItem to="/app/peers" icon={<Users className="w-4 h-4" />} label="Accountability Peers" />
            <NavItem to="/app/groups" icon={<Shield className="w-4 h-4" />} label="Study Groups" />
            <NavItem to="/app/leaderboard" icon={<Trophy className="w-4 h-4" />} label="Leaderboard" />
          </div>

          {/* Section: SYSTEM */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">System</p>
            <NavItem to="/app/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
          </div>
        </nav>
      </div>

      {/* User Footer Card & Real Sign Out */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs text-brand-400">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-100 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{email || profile.peerCode}</p>
            </div>
          </div>

          {isGuest ? (
            <span className="text-[9px] px-2 py-0.5 rounded font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono flex-shrink-0">
              GUEST
            </span>
          ) : (
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex-shrink-0"
              title="Sign Out of Supabase"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
