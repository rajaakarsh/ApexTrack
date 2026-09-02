import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { user, loading, isGuest } = useAuth();
  const location = useLocation();

  // Show clean minimal loader while Supabase is checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col justify-center items-center p-4 select-none">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center justify-center mx-auto">
            T
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
              Track
            </h2>
            <p className="text-xs text-zinc-500">Checking authentication session...</p>
          </div>

          <div className="flex justify-center pt-1">
            <div className="w-4 h-4 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
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
