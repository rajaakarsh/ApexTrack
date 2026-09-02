import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signInWithGoogle as supabaseSignInWithGoogle, signOut as supabaseSignOut, isSupabaseConfigured, User, Session } from '../lib/supabase';
import { profileService } from '../services/profileService';
import { useAppStore } from '../store/useAppStore';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('apextrack-guest-mode') === 'true';
  });

  const { loginWithAccount, logout: storeLogout } = useAppStore();
  const isConfigured = isSupabaseConfigured;

  useEffect(() => {
    let isMounted = true;

    // 1. Check existing session on application launch
    const checkInitialSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Error fetching Supabase session:', error.message);
        }

        if (currentSession?.user && isMounted) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsGuest(false);
          localStorage.setItem('apextrack-guest-mode', 'false');

          const profile = await profileService.getOrCreateProfile(currentSession.user);
          if (profile && isMounted) {
            loginWithAccount({
              id: profile.id,
              displayName: profile.displayName,
              email: profile.email,
              avatarUrl: profile.avatarUrl,
              targetExam: profile.targetExam || 'JEE Advanced',
              targetYear: profile.targetYear || 2026,
              examDate: profile.examDate || '2026-05-24',
              peerCode: profile.peerCode,
              isGuest: false,
            });
          }
        }
      } catch (err) {
        console.error('Initial session check error:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkInitialSession();

    // 2. Subscribe to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        console.log(`[Supabase Auth] State Change: ${event}`);

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsGuest(false);
          localStorage.setItem('apextrack-guest-mode', 'false');

          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            const profile = await profileService.getOrCreateProfile(currentSession.user);
            if (profile && isMounted) {
              loginWithAccount({
                id: profile.id,
                displayName: profile.displayName,
                email: profile.email,
                avatarUrl: profile.avatarUrl,
                targetExam: profile.targetExam || 'JEE Advanced',
                targetYear: profile.targetYear || 2026,
                examDate: profile.examDate || '2026-05-24',
                peerCode: profile.peerCode,
                isGuest: false,
              });
            }
          }
        } else {
          setSession(null);
          setUser(null);
          if (event === 'SIGNED_OUT') {
            storeLogout();
          }
        }

        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loginWithAccount, storeLogout]);

  const signInWithGoogle = async () => {
    await supabaseSignInWithGoogle();
  };

  const signOut = async () => {
    try {
      await supabaseSignOut();
      setUser(null);
      setSession(null);
      setIsGuest(false);
      localStorage.removeItem('apextrack-guest-mode');
      storeLogout();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('apextrack-guest-mode', 'true');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isGuest,
        isConfigured,
        signInWithGoogle,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
