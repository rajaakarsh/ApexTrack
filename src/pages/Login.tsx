import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, ArrowRight, Sparkles, AlertCircle, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, continueAsGuest, isConfigured } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message || 'Failed to initialize Google login. Please try again.');
        setLoading(false);
      }
      // If no error, browser redirects to Google OAuth
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during Google login.');
      setLoading(false);
    }
  };

  const handleGuestEntry = () => {
    continueAsGuest();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Brand Header */}
      <div
        className="flex items-center gap-2.5 mb-8 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-slate-950 font-black shadow-glow group-hover:scale-105 transition-transform">
          <Zap className="w-6 h-6 fill-slate-950" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-wider uppercase text-slate-100">
            Apex<span className="text-brand-400">Track</span>
          </span>
          <p className="text-[11px] text-slate-400">Competitive Exam Operating System</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-6 relative z-10">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            Sign In to Your Cockpit
          </h2>
          <p className="text-xs text-slate-400">
            Securely access your preparation schedule, mock analytics, and study groups.
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Sign In Notice</span>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Configuration Notice (if .env keys are placeholder) */}
        {!isConfigured && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Supabase Setup Tip</span>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Add your Supabase credentials to <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">.env</code> to connect your live database. You can also explore instantly using Guest Mode.
              </p>
            </div>
          </div>
        )}

        {/* Primary Action: Google Sign In Button */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>{loading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase font-mono absolute">
            Or try without account
          </span>
        </div>

        {/* Guest Mode Action Card */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Local Guest Mode</p>
              <p className="text-[10px] text-slate-400">100% offline & private storage</p>
            </div>
          </div>
          <Button size="sm" variant="glow" onClick={handleGuestEntry} className="text-xs py-1 px-3">
            Enter <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          By signing in, you agree to secure end-to-end data synchronization for your competitive exam preparation.
        </p>
      </div>
    </div>
  );
};
