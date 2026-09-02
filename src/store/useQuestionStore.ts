import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyQuestionLog } from '../types';

interface QuestionState {
  dailyTarget: number;
  logs: Record<string, DailyQuestionLog>; // dateStr -> Log
  
  // Actions
  setDailyTarget: (target: number) => void;
  addQuestions: (count: number, subject: string, dateStr?: string) => void;
  setQuestionsForSubject: (count: number, subject: string, dateStr?: string) => void;
  resetTodayQuestions: () => void;
  importQuestionLogs: (logs: Record<string, DailyQuestionLog>) => void;
  
  // Helpers
  getTodayLog: () => DailyQuestionLog;
  getStreak: () => number;
  getWeeklyHistory: () => { date: string; solved: number; target: number }[];
}

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set, get) => ({
      dailyTarget: 50,
      logs: {},

      importQuestionLogs: (logs) => set({ logs }),

      setDailyTarget: (dailyTarget) => {
        const today = getTodayStr();
        set((state) => {
          const currentLog = state.logs[today] || {
            id: `q-${today}`,
            date: today,
            targetCount: dailyTarget,
            solvedCount: 0,
            subjectBreakdown: {},
          };
          return {
            dailyTarget,
            logs: {
              ...state.logs,
              [today]: { ...currentLog, targetCount: dailyTarget },
            },
          };
        });
      },

      addQuestions: (count, subject, dateStr) => {
        const targetDate = dateStr || getTodayStr();
        const { dailyTarget, logs } = get();
        const currentLog = logs[targetDate] || {
          id: `q-${targetDate}`,
          date: targetDate,
          targetCount: dailyTarget,
          solvedCount: 0,
          subjectBreakdown: {},
        };

        const currentSubjectCount = currentLog.subjectBreakdown[subject] || 0;
        const newSubjectCount = Math.max(0, currentSubjectCount + count);
        const newBreakdown = {
          ...currentLog.subjectBreakdown,
          [subject]: newSubjectCount,
        };
        const newTotal = Object.values(newBreakdown).reduce((a, b) => a + b, 0);

        set((state) => ({
          logs: {
            ...state.logs,
            [targetDate]: {
              ...currentLog,
              solvedCount: newTotal,
              subjectBreakdown: newBreakdown,
            },
          },
        }));
      },

      setQuestionsForSubject: (count, subject, dateStr) => {
        const targetDate = dateStr || getTodayStr();
        const { dailyTarget, logs } = get();
        const currentLog = logs[targetDate] || {
          id: `q-${targetDate}`,
          date: targetDate,
          targetCount: dailyTarget,
          solvedCount: 0,
          subjectBreakdown: {},
        };

        const newBreakdown = {
          ...currentLog.subjectBreakdown,
          [subject]: Math.max(0, count),
        };
        const newTotal = Object.values(newBreakdown).reduce((a, b) => a + b, 0);

        set((state) => ({
          logs: {
            ...state.logs,
            [targetDate]: {
              ...currentLog,
              solvedCount: newTotal,
              subjectBreakdown: newBreakdown,
            },
          },
        }));
      },

      resetTodayQuestions: () => {
        const today = getTodayStr();
        set((state) => {
          const current = state.logs[today];
          if (!current) return state;
          return {
            logs: {
              ...state.logs,
              [today]: {
                ...current,
                solvedCount: 0,
                subjectBreakdown: {},
              },
            },
          };
        });
      },

      getTodayLog: () => {
        const today = getTodayStr();
        const { logs, dailyTarget } = get();
        return (
          logs[today] || {
            id: `q-${today}`,
            date: today,
            targetCount: dailyTarget,
            solvedCount: 0,
            subjectBreakdown: {},
          }
        );
      },

      getStreak: () => {
        const { logs, dailyTarget } = get();
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 60; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const log = logs[dateStr];

          if (log && log.solvedCount >= (log.targetCount || dailyTarget) * 0.6 && log.solvedCount > 0) {
            streak++;
          } else if (i === 0) {
            continue;
          } else {
            break;
          }
        }
        return streak;
      },

      getWeeklyHistory: () => {
        const { logs, dailyTarget } = get();
        const result: { date: string; solved: number; target: number }[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const log = logs[dateStr];
          result.push({
            date: dateStr,
            solved: log?.solvedCount || 0,
            target: log?.targetCount || dailyTarget,
          });
        }
        return result;
      },
    }),
    {
      name: 'apextrack-question-store',
    }
  )
);
