import { supabase } from '../lib/supabase';
import { FocusSession } from '../types';

export const focusService = {
  async fetchFocusSessions(userId: string): Promise<FocusSession[]> {
    try {
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        subject: row.subject,
        durationSeconds: row.duration_seconds,
        mode: row.mode,
        date: row.date,
        startTime: row.start_time,
        endTime: row.end_time,
        notes: row.notes || undefined,
        linkedTaskId: row.linked_task_id || undefined,
        qualityRating: row.quality_rating || undefined,
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.warn('Error fetching focus sessions from Supabase:', err);
      return [];
    }
  },

  async saveFocusSession(userId: string, session: FocusSession): Promise<void> {
    try {
      await supabase.from('focus_sessions').insert({
        id: session.id,
        user_id: userId,
        subject: session.subject,
        duration_seconds: session.durationSeconds,
        mode: session.mode,
        date: session.date,
        start_time: session.startTime,
        end_time: session.endTime,
        notes: session.notes,
        linked_task_id: session.linkedTaskId,
        quality_rating: session.qualityRating,
        created_at: session.createdAt,
      });
    } catch (err) {
      console.warn('Error saving focus session in Supabase:', err);
    }
  },
};
