import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Target, TargetCategory } from '../types';
import { generateId } from '../lib/utils';

interface TargetState {
  targets: Target[];
  activeCategory: TargetCategory;
  
  // Actions
  addTarget: (targetData: Omit<Target, 'id' | 'createdAt'>) => Target;
  updateTarget: (id: string, updates: Partial<Target>) => void;
  deleteTarget: (id: string) => void;
  updateProgress: (id: string, newProgress: number) => void;
  toggleCompleted: (id: string) => void;
  setActiveCategory: (cat: TargetCategory) => void;
}

const today = new Date();
const nextWeek = new Date(Date.now() + 7 * 86400000);
const nextMonth = new Date(Date.now() + 60 * 86400000);

const initialTargets: Target[] = [
  {
    id: 'tg-1',
    title: 'Complete 120 Physics Mechanics Advanced Questions',
    description: 'Solve rotational dynamics and conservation of energy questions.',
    category: 'weekly',
    subject: 'Physics',
    startDate: today.toISOString().split('T')[0],
    targetDate: nextWeek.toISOString().split('T')[0],
    currentProgress: 65,
    maxProgress: 120,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tg-2',
    title: 'Complete Full Organic Chemistry Revision (GOC to Carbonyl)',
    description: 'Create short notes summary for all 45 named reactions.',
    category: 'weekly',
    subject: 'Chemistry',
    startDate: today.toISOString().split('T')[0],
    targetDate: nextWeek.toISOString().split('T')[0],
    currentProgress: 3,
    maxProgress: 5,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tg-3',
    title: 'Master Entire Integral Calculus & Differential Equations',
    description: 'Reach 85%+ accuracy in all topic-wise mock tests.',
    category: 'long_term',
    subject: 'Mathematics',
    startDate: today.toISOString().split('T')[0],
    targetDate: nextMonth.toISOString().split('T')[0],
    currentProgress: 40,
    maxProgress: 100,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tg-4',
    title: 'Cross 220+ Score Threshold in Full Length Mock Tests',
    description: 'Maintain negative marking under 15 marks per test.',
    category: 'long_term',
    subject: 'All Subjects',
    startDate: today.toISOString().split('T')[0],
    targetDate: nextMonth.toISOString().split('T')[0],
    currentProgress: 198,
    maxProgress: 240,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
];

export const useTargetStore = create<TargetState>()(
  persist(
    (set) => ({
      targets: initialTargets,
      activeCategory: 'weekly',

      addTarget: (targetData) => {
        const newTarget: Target = {
          ...targetData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ targets: [newTarget, ...state.targets] }));
        return newTarget;
      },

      updateTarget: (id, updates) => {
        set((state) => ({
          targets: state.targets.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTarget: (id) => {
        set((state) => ({
          targets: state.targets.filter((t) => t.id !== id),
        }));
      },

      updateProgress: (id, newProgress) => {
        set((state) => ({
          targets: state.targets.map((t) => {
            if (t.id === id) {
              const clamped = Math.max(0, Math.min(newProgress, t.maxProgress));
              const isCompleted = clamped >= t.maxProgress;
              return { ...t, currentProgress: clamped, isCompleted };
            }
            return t;
          }),
        }));
      },

      toggleCompleted: (id) => {
        set((state) => ({
          targets: state.targets.map((t) => {
            if (t.id === id) {
              const nextState = !t.isCompleted;
              return {
                ...t,
                isCompleted: nextState,
                currentProgress: nextState ? t.maxProgress : t.currentProgress,
              };
            }
            return t;
          }),
        }));
      },

      setActiveCategory: (activeCategory) => set({ activeCategory }),
    }),
    {
      name: 'apextrack-targets-store',
    }
  )
);
