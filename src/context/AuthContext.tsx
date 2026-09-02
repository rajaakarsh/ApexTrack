import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signInWithGoogle as supabaseSignInWithGoogle, signOut as supabaseSignOut, getOrCreateUserProfile, isSupabaseConfigured } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
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

  const { setProfile, loginWithAccount, logout: storeLogout } = useAppStore();
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    // 1. Check current session on startup
    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Error fetching Supabase session:', error.message);
        }

        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            setIsGuest(false);
            localStorage.setItem('apextrack-guest-mode', 'false');

            // Fetch and sync profile
            const userProfile = await getOrCreateUserProfile(initialSession.user);
            if (userProfile && mounted) {
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
          } else {
            setSession(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // 2. Subscribe to Supabase Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        console.log(`[Supabase Auth] Event: ${event}`);

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsGuest(false);
          localStorage.setItem('apextrack-guest-mode', 'false');

          if (event === 'SIGNED_IN') {
            const userProfile = await getOrCreateUserProfile(currentSession.user);
            if (userProfile && mounted) {
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
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loginWithAccount, storeLogout]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabaseSignInWithGoogle();
      if (error) {
        return { error };
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
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
