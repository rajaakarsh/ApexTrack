import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getOrCreateUserProfile } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import { Zap, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithAccount } = useAppStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleOAuthCallback = async () => {
      try {
        // 1. Get session from URL (Supabase automatically exchanges hash/code)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session?.user) {
          // 2. Provision or retrieve profile from Supabase profiles table
          const profile = await getOrCreateUserProfile(session.user);

          if (profile && isMounted) {
            loginWithAccount({
              id: profile.id,
              displayName: profile.display_name,
              avatarUrl: profile.avatar_url,
              targetExam: profile.target_exam || 'JEE Advanced',
              targetYear: profile.target_year || 2026,
              examDate: profile.exam_date || '2026-05-24',
              peerCode: profile.peer_code,
              isGuest: false,
            });

            localStorage.setItem('apextrack-guest-mode', 'false');
            navigate('/app/dashboard', { replace: true });
          } else if (isMounted) {
            navigate('/app/dashboard', { replace: true });
          }
        } else {
          // If session is not immediately available, listen to onAuthStateChange once
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
              if (currentSession?.user && isMounted) {
                const userProfile = await getOrCreateUserProfile(currentSession.user);
                if (userProfile && isMounted) {
                  loginWithAccount({
                    id: userProfile.id,
                    displayName: userProfile.display_name,
                    avatarUrl: userProfile.avatar_url,
                    targetExam: userProfile.target_exam || 'JEE Advanced',
                    targetYear: userProfile.target_year || 2026,
                    examDate: userProfile.exam_date || '2026-05-24',
                    peerCode: userProfile.peer_code,
                    isGuest: false,
                  });
                }
                localStorage.setItem('apextrack-guest-mode', 'false');
                navigate('/app/dashboard', { replace: true });
              }
            }
          );

          // Timeout fallback in case of aborted auth
          setTimeout(() => {
            if (isMounted && !session) {
              setErrorMsg('Authentication timed out or was cancelled. Please try signing in again.');
              authListener.subscription.unsubscribe();
            }
          }, 8000);
        }
      } catch (err: any) {
        console.error('OAuth Callback Error:', err);
        if (isMounted) {
          setErrorMsg(err.message || 'Failed to authenticate with Google. Please try again.');
        }
      }
    };

    handleOAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, loginWithAccount]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl text-center space-y-6 relative z-10">
        {errorMsg ? (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">Authentication Failed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
            </div>

            <Button
              size="md"
              variant="glow"
              onClick={() => navigate('/login', { replace: true })}
              className="w-full text-xs font-bold"
            >
              Return to Sign In <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 text-slate-950 font-black flex items-center justify-center mx-auto shadow-glow-sm animate-pulse">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-100">Connecting Google Account</h3>
              <p className="text-xs text-slate-400">Verifying your session and setting up your workspace...</p>
            </div>

            <div className="flex justify-center pt-2">
              <div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
