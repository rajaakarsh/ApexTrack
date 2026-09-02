import { supabase } from '../lib/supabase';
import { Target } from '../types';

export const targetService = {
  async fetchTargets(userId: string): Promise<Target[]> {
    try {
      const { data, error } = await supabase
        .from('targets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description || undefined,
        category: row.category,
        subject: row.subject || undefined,
        startDate: row.start_date,
        targetDate: row.target_date,
        currentProgress: Number(row.current_progress) || 0,
        maxProgress: Number(row.max_progress) || 100,
        isCompleted: Boolean(row.is_completed),
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.warn('Error fetching targets from Supabase:', err);
      return [];
    }
  },

  async createTarget(userId: string, target: Target): Promise<void> {
    try {
      await supabase.from('targets').insert({
        id: target.id,
        user_id: userId,
        title: target.title,
        description: target.description,
        category: target.category,
        subject: target.subject,
        start_date: target.startDate,
        target_date: target.targetDate,
        current_progress: target.currentProgress,
        max_progress: target.maxProgress,
        is_completed: target.isCompleted,
        created_at: target.createdAt,
      });
    } catch (err) {
      console.warn('Error creating target in Supabase:', err);
    }
  },

  async updateTarget(userId: string, targetId: string, updates: Partial<Target>): Promise<void> {
    try {
      const payload: any = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.subject !== undefined) payload.subject = updates.subject;
      if (updates.currentProgress !== undefined) payload.current_progress = updates.currentProgress;
      if (updates.maxProgress !== undefined) payload.max_progress = updates.maxProgress;
      if (updates.isCompleted !== undefined) payload.is_completed = updates.isCompleted;

      await supabase.from('targets').update(payload).eq('id', targetId).eq('user_id', userId);
    } catch (err) {
      console.warn('Error updating target in Supabase:', err);
    }
  },

  async deleteTarget(userId: string, targetId: string): Promise<void> {
    try {
      await supabase.from('targets').delete().eq('id', targetId).eq('user_id', userId);
    } catch (err) {
      console.warn('Error deleting target in Supabase:', err);
    }
  },
};
