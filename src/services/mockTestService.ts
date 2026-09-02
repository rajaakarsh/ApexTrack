import { supabase } from '../lib/supabase';
import { MockTest } from '../types';

export const mockTestService = {
  async fetchMockTests(userId: string): Promise<MockTest[]> {
    try {
      const { data, error } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error || !data) return [];

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        testName: row.test_name,
        category: row.category,
        date: row.date,
        maxMarks: row.max_marks,
        obtainedMarks: row.obtained_marks,
        targetScore: row.target_score || undefined,
        attemptedQuestions: row.attempted_questions || undefined,
        correctQuestions: row.correct_questions || undefined,
        subjectScores: row.subject_scores || [],
        notes: row.notes || undefined,
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.warn('Error fetching mock tests from Supabase:', err);
      return [];
    }
  },

  async createMockTest(userId: string, mock: MockTest): Promise<void> {
    try {
      await supabase.from('mock_tests').insert({
        id: mock.id,
        user_id: userId,
        test_name: mock.testName,
        category: mock.category,
        date: mock.date,
        max_marks: mock.maxMarks,
        obtained_marks: mock.obtainedMarks,
        target_score: mock.targetScore,
        attempted_questions: mock.attemptedQuestions,
        correct_questions: mock.correctQuestions,
        subject_scores: mock.subjectScores,
        notes: mock.notes,
        created_at: mock.createdAt,
      });
    } catch (err) {
      console.warn('Error creating mock test in Supabase:', err);
    }
  },

  async deleteMockTest(userId: string, mockId: string): Promise<void> {
    try {
      await supabase.from('mock_tests').delete().eq('id', mockId).eq('user_id', userId);
    } catch (err) {
      console.warn('Error deleting mock test in Supabase:', err);
    }
  },
};
