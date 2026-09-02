import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserSettings } from '../types';
import { generatePeerCode } from '../lib/utils';

interface AppState {
  profile: UserProfile;
  isOnboarded: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt?: string;
  mergeModalOpen: boolean;
  
  // Actions
  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  loginAsGuest: () => void;
  loginWithAccount: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'synced' | 'error') => void;
  setMergeModalOpen: (open: boolean) => void;
  updateLiveStatus: (status: 'focusing' | 'idle' | 'offline', subject?: string) => void;
}

const defaultProfile: UserProfile = {
  id: 'guest-user-1',
  displayName: 'Aspirant',
  targetExam: 'JEE Advanced',
  targetYear: 2026,
  examDate: '2026-05-24',
  peerCode: generatePeerCode(),
  liveStatus: 'idle',
  streakCount: 14,
  isGuest: true,
  createdAt: new Date().toISOString(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      isOnboarded: false,
      isAuthenticated: false,
      isGuest: true,
      syncStatus: 'idle',
      mergeModalOpen: false,

      setProfile: (updated) =>
        set((state) => ({
          profile: { ...state.profile, ...updated },
        })),

      completeOnboarding: (data) =>
        set((state) => ({
          isOnboarded: true,
          profile: {
            ...state.profile,
            ...data,
            peerCode: state.profile.peerCode || generatePeerCode(),
          },
        })),

      loginAsGuest: () =>
        set({
          isGuest: true,
          isAuthenticated: false,
        }),

      loginWithAccount: (profileData) =>
        set((state) => ({
          isAuthenticated: true,
          isGuest: false,
          profile: {
            ...state.profile,
            ...profileData,
            isGuest: false,
          },
        })),

      logout: () =>
        set({
          isAuthenticated: false,
          isGuest: true,
          profile: defaultProfile,
          isOnboarded: false,
        }),

      setSyncStatus: (status) =>
        set({
          syncStatus: status,
          lastSyncedAt: status === 'synced' ? new Date().toISOString() : undefined,
        }),

      setMergeModalOpen: (open) => set({ mergeModalOpen: open }),

      updateLiveStatus: (status, subject) =>
        set((state) => ({
          profile: {
            ...state.profile,
            liveStatus: status,
            currentSubject: subject,
          },
        })),
    }),
    {
      name: 'apextrack-app-store',
    }
  )
);
