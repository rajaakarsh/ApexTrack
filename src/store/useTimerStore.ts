import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FocusSession, TimerMode } from '../types';
import { generateId } from '../lib/utils';
import { soundEngine } from '../lib/audio';

interface TimerState {
  mode: TimerMode;
  isRunning: boolean;
  isPaused: boolean;
  secondsLeft: number;
  secondsElapsed: number;
  pomodoroPhase: 'focus' | 'break';
  customDurationMins: number;
  activeSubject: string;
  activeTaskId?: string;
  sessionNotes: string;
  ambientSound: 'none' | 'binaural' | 'rain' | 'brown' | 'lofi';
  ambientVolume: number;
  zenModeOpen: boolean;
  summaryModalOpen: boolean;
  lastCompletedSession: FocusSession | null;
  sessions: FocusSession[];

  // Actions
  setMode: (mode: TimerMode) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setCustomDuration: (mins: number) => void;
  setActiveSubject: (subject: string) => void;
  setActiveTaskId: (taskId?: string) => void;
  setSessionNotes: (notes: string) => void;
  setAmbientSound: (sound: 'none' | 'binaural' | 'rain' | 'brown' | 'lofi') => void;
  setAmbientVolume: (volume: number) => void;
  setZenModeOpen: (open: boolean) => void;
  setSummaryModalOpen: (open: boolean) => void;
  logCompletedSession: (data?: Partial<FocusSession>) => void;
  deleteSession: (id: string) => void;
  clearSessions: () => void;
}

const todayStr = new Date().toISOString().split('T')[0];

const initialSessions: FocusSession[] = [
  {
    id: 'fs-1',
    subject: 'Physics',
    durationSeconds: 3600, // 60 mins
    mode: 'pomodoro',
    date: todayStr,
    startTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: 'Covered Rotational Dynamics moment of inertia calculations.',
    qualityRating: 5,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'fs-2',
    subject: 'Chemistry',
    durationSeconds: 2700, // 45 mins
    mode: 'flow',
    date: todayStr,
    startTime: new Date(Date.now() - 3600000 * 3).toISOString(),
    endTime: new Date(Date.now() - 3600000 * 2.25).toISOString(),
    notes: 'Thermodynamics entropy problem solving.',
    qualityRating: 4,
    createdAt: new Date(Date.now() - 3600000 * 2.25).toISOString(),
  },
  {
    id: 'fs-3',
    subject: 'Mathematics',
    durationSeconds: 4500, // 75 mins
    mode: 'pomodoro',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 86400000 - 3600000 * 4).toISOString(),
    endTime: new Date(Date.now() - 86400000 - 3600000 * 2.75).toISOString(),
    notes: 'Definite integrals PYQ solving.',
    qualityRating: 5,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'fs-4',
    subject: 'Physics',
    durationSeconds: 5400, // 90 mins
    mode: 'flow',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 86400000 * 2 - 3600000 * 3).toISOString(),
    endTime: new Date(Date.now() - 86400000 * 2 - 3600000 * 1.5).toISOString(),
    notes: 'Work Power Energy revision.',
    qualityRating: 4,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'fs-5',
    subject: 'Chemistry',
    durationSeconds: 3600, // 60 mins
    mode: 'pomodoro',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 86400000 * 3 - 3600000 * 4).toISOString(),
    endTime: new Date(Date.now() - 86400000 * 3 - 3600000 * 3).toISOString(),
    notes: 'GOC and inductive effect practice.',
    qualityRating: 5,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'pomodoro',
      isRunning: false,
      isPaused: false,
      secondsLeft: 25 * 60,
      secondsElapsed: 0,
      pomodoroPhase: 'focus',
      customDurationMins: 30,
      activeSubject: 'Physics',
      sessionNotes: '',
      ambientSound: 'none',
      ambientVolume: 0.5,
      zenModeOpen: false,
      summaryModalOpen: false,
      lastCompletedSession: null,
      sessions: initialSessions,

      setMode: (mode) => {
        let initialSeconds = 25 * 60;
        if (mode === 'flow') {
          initialSeconds = 0;
        } else if (mode === 'custom') {
          initialSeconds = get().customDurationMins * 60;
        }
        set({
          mode,
          isRunning: false,
          isPaused: false,
          secondsLeft: initialSeconds,
          secondsElapsed: 0,
          pomodoroPhase: 'focus',
        });
      },

      startTimer: () => {
        const { ambientSound, ambientVolume } = get();
        if (ambientSound !== 'none') {
          soundEngine.playAmbient(ambientSound, ambientVolume);
        }
        set({ isRunning: true, isPaused: false });
      },

      pauseTimer: () => {
        soundEngine.stopAmbient();
        set({ isPaused: true });
      },

      resumeTimer: () => {
        const { ambientSound, ambientVolume } = get();
        if (ambientSound !== 'none') {
          soundEngine.playAmbient(ambientSound, ambientVolume);
        }
        set({ isPaused: false });
      },

      stopTimer: () => {
        soundEngine.stopAmbient();
        const { mode, secondsElapsed } = get();
        const duration = secondsElapsed;

        if (duration >= 30) {
          // Log session if lasted at least 30s
          const newSession: FocusSession = {
            id: generateId(),
            subject: get().activeSubject,
            durationSeconds: duration,
            mode,
            date: new Date().toISOString().split('T')[0],
            startTime: new Date(Date.now() - duration * 1000).toISOString(),
            endTime: new Date().toISOString(),
            notes: get().sessionNotes,
            linkedTaskId: get().activeTaskId,
            qualityRating: 4,
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            isRunning: false,
            isPaused: false,
            summaryModalOpen: true,
            lastCompletedSession: newSession,
            sessions: [newSession, ...state.sessions],
            secondsElapsed: 0,
          }));
        } else {
          get().resetTimer();
        }
      },

      resetTimer: () => {
        soundEngine.stopAmbient();
        const { mode, customDurationMins } = get();
        let resetSecs = 25 * 60;
        if (mode === 'flow') resetSecs = 0;
        if (mode === 'custom') resetSecs = customDurationMins * 60;

        set({
          isRunning: false,
          isPaused: false,
          secondsLeft: resetSecs,
          secondsElapsed: 0,
          pomodoroPhase: 'focus',
        });
      },

      tick: () => {
        const { mode, secondsLeft, secondsElapsed, isRunning, isPaused, pomodoroPhase } = get();
        if (!isRunning || isPaused) return;

        if (mode === 'flow') {
          set({
            secondsElapsed: secondsElapsed + 1,
            secondsLeft: secondsLeft + 1,
          });
        } else {
          // Countdown
          if (secondsLeft > 1) {
            set({
              secondsLeft: secondsLeft - 1,
              secondsElapsed: secondsElapsed + 1,
            });
          } else {
            // Timer expired
            soundEngine.playTimerChime();
            soundEngine.stopAmbient();

            if (mode === 'pomodoro') {
              if (pomodoroPhase === 'focus') {
                // Switch to break
                const breakSecs = 5 * 60;
                set({
                  pomodoroPhase: 'break',
                  secondsLeft: breakSecs,
                  isRunning: false,
                });
                get().stopTimer();
              } else {
                // Break ended -> back to focus
                set({
                  pomodoroPhase: 'focus',
                  secondsLeft: 25 * 60,
                  isRunning: false,
                });
              }
            } else {
              get().stopTimer();
            }
          }
        }
      },

      setCustomDuration: (mins) =>
        set({
          customDurationMins: mins,
          secondsLeft: mins * 60,
        }),

      setActiveSubject: (activeSubject) => set({ activeSubject }),
      setActiveTaskId: (activeTaskId) => set({ activeTaskId }),
      setSessionNotes: (sessionNotes) => set({ sessionNotes }),

      setAmbientSound: (ambientSound) => {
        const { isRunning, isPaused, ambientVolume } = get();
        set({ ambientSound });
        if (isRunning && !isPaused) {
          soundEngine.playAmbient(ambientSound, ambientVolume);
        }
      },

      setAmbientVolume: (ambientVolume) => {
        const { ambientSound, isRunning, isPaused } = get();
        set({ ambientVolume });
        if (isRunning && !isPaused && ambientSound !== 'none') {
          soundEngine.playAmbient(ambientSound, ambientVolume);
        }
      },

      setZenModeOpen: (zenModeOpen) => set({ zenModeOpen }),
      setSummaryModalOpen: (summaryModalOpen) => set({ summaryModalOpen }),

      logCompletedSession: (data) => {
        const { lastCompletedSession } = get();
        if (!lastCompletedSession) return;

        const updated = { ...lastCompletedSession, ...data };
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === updated.id ? updated : s)),
          lastCompletedSession: null,
          summaryModalOpen: false,
        }));
      },

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: 'apextrack-timer-store',
      partialize: (state) => ({
        sessions: state.sessions,
        activeSubject: state.activeSubject,
        customDurationMins: state.customDurationMins,
        ambientSound: state.ambientSound,
        ambientVolume: state.ambientVolume,
      }),
    }
  )
);
