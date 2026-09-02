import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, continueAsGuest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setErrorMsg(err.message || 'An error occurred during authentication.');
      setLoading(false);
    }
  };

  const handleGuestEntry = () => {
    continueAsGuest();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Brand */}
        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-sm flex items-center justify-center mx-auto">
            T
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">Welcome back</h1>
          <p className="text-xs text-zinc-400">Continue your preparation on Track.</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Action Card */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-zinc-800 space-y-4">
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full h-10 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center pt-2">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-[#111111] px-2 text-[10px] text-zinc-500 uppercase font-mono absolute">
              or
            </span>
          </div>

          <button
            type="button"
            onClick={handleGuestEntry}
            className="w-full h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <span>Explore as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-zinc-500">
          Encrypted authentication powered by Supabase Auth.
        </p>
      </div>
    </div>
  );
};
