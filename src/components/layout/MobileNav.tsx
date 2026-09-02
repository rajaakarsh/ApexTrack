import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  BookOpen,
  FileText,
  Users,
  Settings,
  X,
  Target,
  AlertOctagon,
  HelpCircle,
  BarChart3,
  Shield,
  Trophy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { profile } = useAppStore();

  const links = [
    { to: '/app/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/app/planner', label: 'Planner', icon: <CheckSquare className="w-5 h-5" /> },
    { to: '/app/targets', label: 'Targets', icon: <Target className="w-5 h-5" /> },
    { to: '/app/timer', label: 'Focus Timer', icon: <Timer className="w-5 h-5" /> },
    { to: '/app/syllabus', label: 'Syllabus', icon: <BookOpen className="w-5 h-5" /> },
    { to: '/app/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/app/mocks', label: 'Mock Tests', icon: <FileText className="w-5 h-5" /> },
    { to: '/app/error-log', label: 'Mistake Log', icon: <AlertOctagon className="w-5 h-5" /> },
    { to: '/app/daily-questions', label: 'Daily Questions', icon: <HelpCircle className="w-5 h-5" /> },
    { to: '/app/peers', label: 'Peers', icon: <Users className="w-5 h-5" /> },
    { to: '/app/groups', label: 'Study Groups', icon: <Shield className="w-5 h-5" /> },
    { to: '/app/leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { to: '/app/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Slide-over Drawer for mobile navigation */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-72 max-w-[80vw] bg-[#090d16] border-r border-slate-800 p-5 flex flex-col justify-between z-10 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                      Apex<span className="text-brand-400">Track</span>
                    </h2>
                    <p className="text-[10px] text-slate-400 font-mono">{profile.targetExam}</p>
                  </div>
                  <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5 mt-4">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                          isActive
                            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 font-bold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                        )
                      }
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Bar on Small Screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800 z-30 flex items-center justify-around px-2">
        <NavLink
          to="/app/dashboard"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium p-1 rounded-lg',
              isActive ? 'text-brand-400 font-bold' : 'text-slate-400'
            )
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/app/planner"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium p-1 rounded-lg',
              isActive ? 'text-brand-400 font-bold' : 'text-slate-400'
            )
          }
        >
          <CheckSquare className="w-5 h-5" />
          <span>Planner</span>
        </NavLink>

        <NavLink
          to="/app/timer"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium p-1 rounded-lg',
              isActive ? 'text-brand-400 font-bold' : 'text-slate-400'
            )
          }
        >
          <Timer className="w-5 h-5" />
          <span>Focus</span>
        </NavLink>

        <NavLink
          to="/app/syllabus"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium p-1 rounded-lg',
              isActive ? 'text-brand-400 font-bold' : 'text-slate-400'
            )
          }
        >
          <BookOpen className="w-5 h-5" />
          <span>Syllabus</span>
        </NavLink>

        <NavLink
          to="/app/analytics"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium p-1 rounded-lg',
              isActive ? 'text-brand-400 font-bold' : 'text-slate-400'
            )
          }
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analytics</span>
        </NavLink>
      </div>
    </>
  );
};
