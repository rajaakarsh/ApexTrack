import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Priority, Task, TaskStatus } from '../types';
import { generateId } from '../lib/utils';

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  selectedSubject: string;
  selectedPriority: Priority | 'all';
  selectedDate: string; // YYYY-MM-DD
  
  // Actions
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  setSearchQuery: (q: string) => void;
  setSelectedSubject: (subject: string) => void;
  setSelectedPriority: (priority: Priority | 'all') => void;
  setSelectedDate: (date: string) => void;
  clearTasks: () => void;
  importTasks: (tasks: Task[]) => void;
}

const todayStr = new Date().toISOString().split('T')[0];

const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Solve 25 Rotation Dynamics Problems (HC Verma Ch 10)',
    description: 'Focus on rolling with slipping and angular momentum conservation.',
    subject: 'Physics',
    priority: 'high',
    status: 'in_progress',
    date: todayStr,
    estimatedDuration: 90,
    linkedChapterId: 'p-rbd',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 't-2',
    title: 'Revise GOC Reaction Intermediates & Carbocation Stability',
    description: 'Summarize named rearrangements (Pinacol-Pinacolone & Wagner-Meerwein).',
    subject: 'Chemistry',
    priority: 'high',
    status: 'todo',
    date: todayStr,
    estimatedDuration: 60,
    linkedChapterId: 'c-goc',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 't-3',
    title: 'Definite Integration PYQs 2021-2024 Practice',
    description: 'Solve King property and Leibniz integral rule questions.',
    subject: 'Mathematics',
    priority: 'medium',
    status: 'todo',
    date: todayStr,
    estimatedDuration: 75,
    linkedChapterId: 'm-integral',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 't-4',
    title: 'Electrostatics Gauss Law Formula Notes Revision',
    description: 'Review field of hollow and solid charged spheres.',
    subject: 'Physics',
    priority: 'low',
    status: 'done',
    date: todayStr,
    estimatedDuration: 30,
    linkedChapterId: 'p-electrostatics',
    completedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      searchQuery: '',
      selectedSubject: 'all',
      selectedPriority: 'all',
      selectedDate: todayStr,

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      setTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  completedAt: status === 'done' ? new Date().toISOString() : undefined,
                }
              : t
          ),
        }));
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedSubject: (selectedSubject) => set({ selectedSubject }),
      setSelectedPriority: (selectedPriority) => set({ selectedPriority }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      clearTasks: () => set({ tasks: [] }),
      importTasks: (tasks) => set({ tasks }),
    }),
    {
      name: 'apextrack-tasks-store',
    }
  )
);
