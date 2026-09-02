import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/app/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col items-center justify-center p-4 select-none">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center justify-center mx-auto">
          T
        </div>
        <p className="text-xs text-zinc-500">Authenticating session...</p>
        <div className="flex justify-center pt-1">
          <div className="w-4 h-4 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};
