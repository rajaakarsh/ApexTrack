import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const rawSupabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

// Check if valid credentials are provided
export const isSupabaseConfigured = Boolean(
  rawSupabaseUrl &&
  rawSupabaseKey &&
  rawSupabaseUrl.startsWith('https://') &&
  !rawSupabaseUrl.includes('placeholder') &&
  !rawSupabaseUrl.includes('your-project-ref')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing or incomplete environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.'
  );
}

// Fallback dummy credentials to prevent createClient from throwing at module initialization time
const supabaseUrl = isSupabaseConfigured ? rawSupabaseUrl! : 'https://placeholder.supabase.co';
const supabasePublishableKey = isSupabaseConfigured ? rawSupabaseKey! : 'sb_publishable_dummy_key';

// Centralized Supabase client instance
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Google OAuth Sign In
export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase URL or Publishable Key is not configured. Please add your Supabase project credentials to .env.local.'
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });

  if (error) {
    console.error('[Supabase Auth] Google OAuth error:', error);
    throw error;
  }

  return data;
}

// Sign Out
export async function signOut() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('[Supabase Auth] Sign out error:', error);
    throw error;
  }
}

export type { User, Session };