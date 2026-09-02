import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ErrorLog, MistakeType } from '../types';
import { generateId } from '../lib/utils';

interface ErrorState {
  errorLogs: ErrorLog[];
  searchQuery: string;
  selectedSubject: string;
  selectedMistakeType: MistakeType | 'all';
  
  // Actions
  addErrorLog: (data: Omit<ErrorLog, 'id' | 'createdAt'>) => ErrorLog;
  updateErrorLog: (id: string, updates: Partial<ErrorLog>) => void;
  deleteErrorLog: (id: string) => void;
  toggleMastered: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSubject: (subject: string) => void;
  setSelectedMistakeType: (type: MistakeType | 'all') => void;
  
  // Analytics
  getMistakeDistribution: () => Record<MistakeType, number>;
  getWeakestSubjectAndChapter: () => { weakestSubject: string; weakestChapter: string; totalErrors: number };
}

const initialErrors: ErrorLog[] = [
  {
    id: 'err-1',
    subject: 'Physics',
    chapter: 'Rotational Motion',
    topic: 'Rolling with Slipping',
    mistakeType: 'conceptual',
    description: 'Forgot that friction direction reverses when instantaneous velocity at contact point is negative.',
    correctiveAction: 'Draw velocity vectors of COM and r*omega explicitly before writing torque equations.',
    linkedMockId: 'mt-2',
    date: new Date(Date.now() - 86400000 * 11).toISOString().split('T')[0],
    isMastered: false,
    createdAt: new Date(Date.now() - 86400000 * 11).toISOString(),
  },
  {
    id: 'err-2',
    subject: 'Chemistry',
    chapter: 'Ionic Equilibrium',
    topic: 'Buffer Solution pH',
    mistakeType: 'formula',
    description: 'Used salt/acid ratio upside down in Henderson-Hasselbalch equation under exam pressure.',
    correctiveAction: 'Memorize: pH = pKa + log([Conjugate Base] / [Acid]). Acid is always in the denominator.',
    linkedMockId: 'mt-1',
    date: new Date(Date.now() - 86400000 * 19).toISOString().split('T')[0],
    isMastered: true,
    createdAt: new Date(Date.now() - 86400000 * 19).toISOString(),
  },
  {
    id: 'err-3',
    subject: 'Mathematics',
    chapter: 'Definite Integration',
    topic: 'King Property Substitutions',
    mistakeType: 'calculation',
    description: 'Missed a factor of 1/2 when adding I + I = 2I.',
    correctiveAction: 'Double check final line when dividing both sides by 2.',
    linkedMockId: 'mt-3',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    isMastered: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'err-4',
    subject: 'Physics',
    chapter: 'Electrostatics',
    topic: 'Conductors & Induced Charges',
    mistakeType: 'silly_mistake',
    description: 'Marked option B instead of C after solving correctly on rough sheet.',
    correctiveAction: 'Pause for 1 second to confirm option letter matches derived answer before bubbling/clicking.',
    linkedMockId: 'mt-3',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    isMastered: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'err-5',
    subject: 'Mathematics',
    chapter: 'Complex Numbers',
    topic: 'Cube Roots of Unity',
    mistakeType: 'time_management',
    description: 'Spent 7 minutes on a single 4-mark geometry question instead of skipping to easier calculus.',
    correctiveAction: '2-Minute Rule: If no clear algebraic path in 120 seconds, flag and move forward.',
    linkedMockId: 'mt-1',
    date: new Date(Date.now() - 86400000 * 19).toISOString().split('T')[0],
    isMastered: true,
    createdAt: new Date(Date.now() - 86400000 * 19).toISOString(),
  },
];

export const useErrorStore = create<ErrorState>()(
  persist(
    (set, get) => ({
      errorLogs: initialErrors,
      searchQuery: '',
      selectedSubject: 'all',
      selectedMistakeType: 'all',

      addErrorLog: (data) => {
        const newErr: ErrorLog = {
          ...data,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ errorLogs: [newErr, ...state.errorLogs] }));
        return newErr;
      },

      updateErrorLog: (id, updates) => {
        set((state) => ({
          errorLogs: state.errorLogs.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      deleteErrorLog: (id) => {
        set((state) => ({
          errorLogs: state.errorLogs.filter((e) => e.id !== id),
        }));
      },

      toggleMastered: (id) => {
        set((state) => ({
          errorLogs: state.errorLogs.map((e) =>
            e.id === id ? { ...e, isMastered: !e.isMastered } : e
          ),
        }));
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedSubject: (selectedSubject) => set({ selectedSubject }),
      setSelectedMistakeType: (selectedMistakeType) => set({ selectedMistakeType }),

      getMistakeDistribution: () => {
        const { errorLogs } = get();
        const dist: Record<MistakeType, number> = {
          conceptual: 0,
          calculation: 0,
          silly_mistake: 0,
          formula: 0,
          time_management: 0,
        };
        errorLogs.forEach((err) => {
          if (dist[err.mistakeType] !== undefined) {
            dist[err.mistakeType]++;
          }
        });
        return dist;
      },

      getWeakestSubjectAndChapter: () => {
        const { errorLogs } = get();
        if (errorLogs.length === 0) {
          return { weakestSubject: 'N/A', weakestChapter: 'N/A', totalErrors: 0 };
        }

        const subjectCounts: Record<string, number> = {};
        const chapterCounts: Record<string, number> = {};

        errorLogs.forEach((err) => {
          subjectCounts[err.subject] = (subjectCounts[err.subject] || 0) + 1;
          chapterCounts[err.chapter] = (chapterCounts[err.chapter] || 0) + 1;
        });

        let weakestSubj = 'Physics';
        let maxSubjCount = -1;
        Object.entries(subjectCounts).forEach(([subj, count]) => {
          if (count > maxSubjCount) {
            maxSubjCount = count;
            weakestSubj = subj;
          }
        });

        let weakestChap = 'Rotational Motion';
        let maxChapCount = -1;
        Object.entries(chapterCounts).forEach(([chap, count]) => {
          if (count > maxChapCount) {
            maxChapCount = count;
            weakestChap = chap;
          }
        });

        return {
          weakestSubject: weakestSubj,
          weakestChapter: weakestChap,
          totalErrors: errorLogs.length,
        };
      },
    }),
    {
      name: 'apextrack-error-store',
    }
  )
);
