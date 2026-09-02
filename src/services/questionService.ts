import { supabase } from '../lib/supabase';
import { DailyQuestionLog } from '../types';

export const questionService = {
  async fetchDailyQuestions(userId: string): Promise<Record<string, DailyQuestionLog>> {
    try {
      const { data, error } = await supabase
        .from('daily_question_logs')
        .select('*')
        .eq('user_id', userId);

      if (error || !data) return {};

      const logs: Record<string, DailyQuestionLog> = {};
      data.forEach((row: any) => {
        logs[row.date] = {
          id: `q-${row.date}`,
          date: row.date,
          solvedCount: row.solved_count || 0,
          targetCount: row.target_count || 50,
          subjectBreakdown: row.subject_breakdown || {
            Physics: 0,
            Chemistry: 0,
            Mathematics: 0,
          },
        };
      });

      return logs;
    } catch (err) {
      console.warn('Error fetching daily questions from Supabase:', err);
      return {};
    }
  },

  async saveDailyQuestionLog(userId: string, log: DailyQuestionLog): Promise<void> {
    try {
      await supabase.from('daily_question_logs').upsert({
        user_id: userId,
        date: log.date,
        solved_count: log.solvedCount,
        target_count: log.targetCount,
        subject_breakdown: log.subjectBreakdown,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Error saving daily questions in Supabase:', err);
    }
  },
};
