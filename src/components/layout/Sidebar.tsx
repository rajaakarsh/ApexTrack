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
  LogOut,
  Flame,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none',
        isActive
          ? 'bg-zinc-800 text-zinc-100 font-semibold'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
      )
    }
  >
    <span className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors flex items-center justify-center">
      {icon}
    </span>
    <span>{label}</span>
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
    <aside className="w-60 flex-shrink-0 h-screen sticky top-0 bg-[#0A0A0A] border-r border-zinc-800/80 flex flex-col justify-between p-3.5 z-30 select-none overflow-y-auto">
      <div className="space-y-6">
        {/* Brand */}
        <div
          className="flex items-center justify-between px-2 pt-1.5 cursor-pointer"
          onClick={() => navigate('/app/dashboard')}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center justify-center">
              T
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-100">
              Track
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{profile.streakCount}d</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-4">
          {/* Group: WORKSPACE */}
          <div className="space-y-0.5">
            <p className="px-3 pb-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              Workspace
            </p>
            <NavItem to="/app/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" />
            <NavItem to="/app/planner" icon={<CheckSquare className="w-4 h-4" />} label="Planner" />
            <NavItem to="/app/timer" icon={<Timer className="w-4 h-4" />} label="Focus" />
            <NavItem to="/app/targets" icon={<Target className="w-4 h-4" />} label="Targets" />
            <NavItem to="/app/syllabus" icon={<BookOpen className="w-4 h-4" />} label="Syllabus" />
          </div>

          {/* Group: ANALYTICS */}
          <div className="space-y-0.5">
            <p className="px-3 pb-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              Analytics
            </p>
            <NavItem to="/app/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
            <NavItem to="/app/mocks" icon={<FileText className="w-4 h-4" />} label="Mock Tests" />
            <NavItem to="/app/error-log" icon={<AlertOctagon className="w-4 h-4" />} label="Error Log" />
            <NavItem to="/app/daily-questions" icon={<HelpCircle className="w-4 h-4" />} label="Daily Questions" />
          </div>

          {/* Group: COMMUNITY */}
          <div className="space-y-0.5">
            <p className="px-3 pb-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              Community
            </p>
            <NavItem to="/app/peers" icon={<Users className="w-4 h-4" />} label="Peers" />
            <NavItem to="/app/groups" icon={<Shield className="w-4 h-4" />} label="Study Groups" />
            <NavItem to="/app/leaderboard" icon={<Trophy className="w-4 h-4" />} label="Leaderboard" />
          </div>

          {/* Group: SYSTEM */}
          <div className="space-y-0.5">
            <p className="px-3 pb-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              System
            </p>
            <NavItem to="/app/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
          </div>
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="pt-3 border-t border-zinc-800/80">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900/60 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-zinc-300">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-zinc-200 truncate">{displayName}</p>
              <p className="text-[10px] text-zinc-500 truncate">{email || profile.peerCode}</p>
            </div>
          </div>

          {isGuest ? (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono font-medium">
              Guest
            </span>
          ) : (
            <button
              onClick={handleSignOut}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
