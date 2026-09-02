import { supabase } from '../lib/supabase';
import { ChapterProgressStatus } from '../types';

export const syllabusService = {
  async fetchSyllabusProgress(userId: string): Promise<Record<string, ChapterProgressStatus>> {
    try {
      const { data, error } = await supabase
        .from('syllabus_progress')
        .select('*')
        .eq('user_id', userId);

      if (error || !data) return {};

      const progressMap: Record<string, ChapterProgressStatus> = {};
      data.forEach((row: any) => {
        progressMap[row.chapter_id] = row.status as ChapterProgressStatus;
      });
      return progressMap;
    } catch (err) {
      console.warn('Error fetching syllabus progress from Supabase:', err);
      return {};
    }
  },

  async saveChapterStatus(
    userId: string,
    chapterId: string,
    status: ChapterProgressStatus
  ): Promise<void> {
    try {
      await supabase.from('syllabus_progress').upsert({
        user_id: userId,
        chapter_id: chapterId,
        status,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Error saving chapter status in Supabase:', err);
    }
  },
};
