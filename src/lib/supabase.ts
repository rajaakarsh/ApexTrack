import { createClient, User } from '@supabase/supabase-js';
import { generatePeerCode } from './utils';

// Read from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sample-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sample-anon-key';

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    !url.includes('sample-project') &&
    !url.includes('your-project') &&
    key !== 'your-anon-key-here' &&
    key !== 'sample-anon-key'
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

// Google OAuth Sign In
export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    console.warn(
      'Supabase is not yet configured with real API keys in .env. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { data, error };
}

// Sign Out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get or create user profile in public.profiles table
export async function getOrCreateUserProfile(user: User) {
  if (!user) return null;

  try {
    // 1. Try to fetch existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile && !fetchError) {
      return existingProfile;
    }

    // 2. Extract Google metadata
    const meta = user.user_metadata || {};
    const displayName =
      meta.full_name ||
      meta.name ||
      user.email?.split('@')[0] ||
      'Aspirant';
    const avatarUrl = meta.avatar_url || meta.picture || undefined;

    const newProfile = {
      id: user.id,
      email: user.email,
      display_name: displayName,
      avatar_url: avatarUrl,
      target_exam: 'JEE Advanced',
      target_year: 2026,
      exam_date: '2026-05-24',
      peer_code: generatePeerCode(),
      live_status: 'idle',
      streak_count: 1,
      updated_at: new Date().toISOString(),
    };

    // 3. Insert new profile into Supabase
    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .upsert(newProfile)
      .select()
      .single();

    if (insertError) {
      console.warn('Could not insert profile to Supabase database:', insertError.message);
      return newProfile;
    }

    return inserted || newProfile;
  } catch (err) {
    console.error('Error in getOrCreateUserProfile:', err);
    return null;
  }
}
