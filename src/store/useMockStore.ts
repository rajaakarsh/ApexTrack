import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MockTest } from '../types';
import { generateId } from '../lib/utils';

interface MockState {
  mockTests: MockTest[];
  
  // Actions
  addMockTest: (data: Omit<MockTest, 'id' | 'createdAt'>) => MockTest;
  updateMockTest: (id: string, updates: Partial<MockTest>) => void;
  deleteMockTest: (id: string) => void;
  
  // KPIs & Calculations
  getStats: () => {
    totalTests: number;
    bestScore: number;
    avgScore: number;
    avgPercentage: number;
    avgAccuracy: number;
    recentTrend: number; // difference between last 2 tests
  };
}

const initialMockTests: MockTest[] = [
  {
    id: 'mt-1',
    testName: 'All India Open Mock Test #1',
    category: 'Full Length',
    date: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0],
    maxMarks: 300,
    obtainedMarks: 165,
    targetScore: 210,
    attemptedQuestions: 62,
    correctQuestions: 46,
    subjectScores: [
      { subject: 'Physics', marks: 58, maxMarks: 100 },
      { subject: 'Chemistry', marks: 62, maxMarks: 100 },
      { subject: 'Mathematics', marks: 45, maxMarks: 100 },
    ],
    notes: 'Time ran out during complex numbers in Maths. Chemistry was strong.',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'mt-2',
    testName: 'Major Test Series - Part Test 3',
    category: 'Sectional',
    date: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
    maxMarks: 300,
    obtainedMarks: 182,
    targetScore: 210,
    attemptedQuestions: 66,
    correctQuestions: 51,
    subjectScores: [
      { subject: 'Physics', marks: 66, maxMarks: 100 },
      { subject: 'Chemistry', marks: 68, maxMarks: 100 },
      { subject: 'Mathematics', marks: 48, maxMarks: 100 },
    ],
    notes: 'Improved Physics mechanics accuracy. Need to work on Integral Calculus speed.',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'mt-3',
    testName: 'Grand Full Syllabus Simulation #2',
    category: 'Full Length',
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    maxMarks: 300,
    obtainedMarks: 204,
    targetScore: 220,
    attemptedQuestions: 70,
    correctQuestions: 57,
    subjectScores: [
      { subject: 'Physics', marks: 74, maxMarks: 100 },
      { subject: 'Chemistry', marks: 72, maxMarks: 100 },
      { subject: 'Mathematics', marks: 58, maxMarks: 100 },
    ],
    notes: 'Crossed the 200 mark barrier! Accuracy was 81.4%.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export const useMockStore = create<MockState>()(
  persist(
    (set, get) => ({
      mockTests: initialMockTests,

      addMockTest: (data) => {
        const newMock: MockTest = {
          ...data,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          mockTests: [newMock, ...state.mockTests].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          ),
        }));
        return newMock;
      },

      updateMockTest: (id, updates) => {
        set((state) => ({
          mockTests: state.mockTests.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },

      deleteMockTest: (id) => {
        set((state) => ({
          mockTests: state.mockTests.filter((m) => m.id !== id),
        }));
      },

      getStats: () => {
        const { mockTests } = get();
        if (mockTests.length === 0) {
          return {
            totalTests: 0,
            bestScore: 0,
            avgScore: 0,
            avgPercentage: 0,
            avgAccuracy: 0,
            recentTrend: 0,
          };
        }

        const scores = mockTests.map((m) => m.obtainedMarks);
        const bestScore = Math.max(...scores);
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / mockTests.length);
        
        const percentages = mockTests.map((m) => (m.obtainedMarks / m.maxMarks) * 100);
        const avgPercentage = Math.round(percentages.reduce((a, b) => a + b, 0) / mockTests.length);

        const accuracies = mockTests
          .filter((m) => (m.attemptedQuestions || 0) > 0)
          .map((m) => ((m.correctQuestions || 0) / (m.attemptedQuestions || 1)) * 100);
        const avgAccuracy =
          accuracies.length > 0
            ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
            : 0;

        const sorted = [...mockTests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const recentTrend =
          sorted.length >= 2
            ? sorted[sorted.length - 1].obtainedMarks - sorted[sorted.length - 2].obtainedMarks
            : 0;

        return {
          totalTests: mockTests.length,
          bestScore,
          avgScore,
          avgPercentage,
          avgAccuracy,
          recentTrend,
        };
      },
    }),
    {
      name: 'apextrack-mock-store',
    }
  )
);
