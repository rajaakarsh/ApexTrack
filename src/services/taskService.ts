import { supabase } from '../lib/supabase';
import { Task } from '../types';

export const taskService = {
  async fetchTasks(userId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        description: row.description || undefined,
        subject: row.subject,
        priority: row.priority,
        status: row.status,
        date: row.date,
        estimatedDuration: row.estimated_duration,
        linkedChapterId: row.linked_chapter_id || undefined,
        completedAt: row.completed_at || undefined,
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.warn('Error fetching tasks from Supabase:', err);
      return [];
    }
  },

  async createTask(userId: string, task: Task): Promise<void> {
    try {
      await supabase.from('tasks').insert({
        id: task.id,
        user_id: userId,
        title: task.title,
        description: task.description,
        subject: task.subject,
        priority: task.priority,
        status: task.status,
        date: task.date,
        estimated_duration: task.estimatedDuration,
        linked_chapter_id: task.linkedChapterId,
        completed_at: task.completedAt,
        created_at: task.createdAt,
      });
    } catch (err) {
      console.warn('Error creating task in Supabase:', err);
    }
  },

  async updateTask(userId: string, taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const payload: any = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.subject !== undefined) payload.subject = updates.subject;
      if (updates.priority !== undefined) payload.priority = updates.priority;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.date !== undefined) payload.date = updates.date;
      if (updates.estimatedDuration !== undefined) payload.estimated_duration = updates.estimatedDuration;
      if (updates.completedAt !== undefined) payload.completed_at = updates.completedAt;

      await supabase.from('tasks').update(payload).eq('id', taskId).eq('user_id', userId);
    } catch (err) {
      console.warn('Error updating task in Supabase:', err);
    }
  },

  async deleteTask(userId: string, taskId: string): Promise<void> {
    try {
      await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', userId);
    } catch (err) {
      console.warn('Error deleting task in Supabase:', err);
    }
  },
};
