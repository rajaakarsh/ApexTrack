import { supabase, User } from '../lib/supabase';
import { UserProfile } from '../types';
import { generatePeerCode } from '../lib/utils';

export const profileService = {
  // Fetch user profile from public.profiles
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        displayName: data.display_name,
        email: data.email,
        avatarUrl: data.avatar_url,
        targetExam: data.target_exam || 'JEE Advanced',
        targetYear: data.target_year || 2026,
        examDate: data.exam_date || '2026-05-24',
        peerCode: data.peer_code || generatePeerCode(),
        liveStatus: data.live_status || 'idle',
        streakCount: data.streak_count || 1,
        isGuest: false,
        createdAt: data.created_at,
      };
    } catch (err) {
      console.warn('Profile fetch error:', err);
      return null;
    }
  },

  // Ensure or create user profile on login
  async getOrCreateProfile(user: User): Promise<UserProfile> {
    const existing = await this.getProfile(user.id);
    if (existing) return existing;

    const meta = user.user_metadata || {};
    const displayName =
      meta.full_name ||
      meta.name ||
      user.email?.split('@')[0] ||
      'Aspirant';
    const avatarUrl = meta.avatar_url || meta.picture || undefined;

    const newProfileRow = {
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

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(newProfileRow)
        .select()
        .single();

      if (data && !error) {
        return {
          id: data.id,
          displayName: data.display_name,
          email: data.email,
          avatarUrl: data.avatar_url,
          targetExam: data.target_exam,
          targetYear: data.target_year,
          examDate: data.exam_date,
          peerCode: data.peer_code,
          liveStatus: data.live_status,
          streakCount: data.streak_count,
          isGuest: false,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn('Could not upsert profile into Supabase:', err);
    }

    return {
      id: user.id,
      displayName,
      email: user.email,
      avatarUrl,
      targetExam: 'JEE Advanced',
      targetYear: 2026,
      examDate: '2026-05-24',
      peerCode: newProfileRow.peer_code,
      liveStatus: 'idle',
      streakCount: 1,
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
  },

  // Update profile details
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.displayName) payload.display_name = updates.displayName;
      if (updates.targetExam) payload.target_exam = updates.targetExam;
      if (updates.targetYear) payload.target_year = updates.targetYear;
      if (updates.examDate) payload.exam_date = updates.examDate;
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
      if (updates.liveStatus) payload.live_status = updates.liveStatus;
      if (updates.streakCount !== undefined) payload.streak_count = updates.streakCount;

      await supabase.from('profiles').update(payload).eq('id', userId);
    } catch (err) {
      console.warn('Update profile error:', err);
    }
  },
};
