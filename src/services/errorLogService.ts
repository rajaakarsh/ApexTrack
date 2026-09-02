import { supabase } from '../lib/supabase';
import { ErrorLog } from '../types';

export const errorLogService = {
  async fetchErrorLogs(userId: string): Promise<ErrorLog[]> {
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        subject: row.subject,
        chapter: row.chapter,
        topic: row.topic || undefined,
        mistakeType: row.mistake_type,
        description: row.description,
        correctiveAction: row.corrective_action || undefined,
        linkedMockId: row.linked_mock_id || undefined,
        date: row.date,
        isMastered: Boolean(row.is_mastered),
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.warn('Error fetching error logs from Supabase:', err);
      return [];
    }
  },

  async createErrorLog(userId: string, errorLog: ErrorLog): Promise<void> {
    try {
      await supabase.from('error_logs').insert({
        id: errorLog.id,
        user_id: userId,
        subject: errorLog.subject,
        chapter: errorLog.chapter,
        topic: errorLog.topic,
        mistake_type: errorLog.mistakeType,
        description: errorLog.description,
        corrective_action: errorLog.correctiveAction,
        linked_mock_id: errorLog.linkedMockId,
        date: errorLog.date,
        is_mastered: errorLog.isMastered,
        created_at: errorLog.createdAt,
      });
    } catch (err) {
      console.warn('Error creating error log in Supabase:', err);
    }
  },

  async updateErrorLog(userId: string, id: string, updates: Partial<ErrorLog>): Promise<void> {
    try {
      const payload: any = {};
      if (updates.subject !== undefined) payload.subject = updates.subject;
      if (updates.chapter !== undefined) payload.chapter = updates.chapter;
      if (updates.topic !== undefined) payload.topic = updates.topic;
      if (updates.mistakeType !== undefined) payload.mistake_type = updates.mistakeType;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.correctiveAction !== undefined) payload.corrective_action = updates.correctiveAction;
      if (updates.isMastered !== undefined) payload.is_mastered = updates.isMastered;

      await supabase.from('error_logs').update(payload).eq('id', id).eq('user_id', userId);
    } catch (err) {
      console.warn('Error updating error log in Supabase:', err);
    }
  },

  async deleteErrorLog(userId: string, id: string): Promise<void> {
    try {
      await supabase.from('error_logs').delete().eq('id', id).eq('user_id', userId);
    } catch (err) {
      console.warn('Error deleting error log in Supabase:', err);
    }
  },
};
