import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { user, loading, isGuest } = useAuth();
  const location = useLocation();

  // Show full-screen loader while Supabase is checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-slate-950 font-black flex items-center justify-center mx-auto shadow-glow-sm animate-pulse">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>

          <div>
            <h2 className="text-base font-extrabold tracking-wider uppercase text-slate-100">
              Apex<span className="text-brand-400">Track</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Checking session & loading workspace...</p>
          </div>

          <div className="flex justify-center pt-2">
            <div className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated and not in guest mode, redirect to login
  if (!user && !isGuest) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
