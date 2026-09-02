import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StudyGroup } from '../types';
import { generateId, generatePeerCode } from '../lib/utils';

interface GroupState {
  groups: StudyGroup[];
  activeGroupId?: string;

  // Actions
  createGroup: (name: string, description: string, targetExam: string) => StudyGroup;
  joinGroup: (inviteCode: string) => boolean;
  leaveGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  setActiveGroupId: (id?: string) => void;
}

const initialGroups: StudyGroup[] = [
  {
    id: 'grp-1',
    name: 'IIT Bombay CSE Cohort 2026',
    description: 'Relentless daily 8+ hours deep work accountability for JEE Advanced top 500 aspirants.',
    targetExam: 'JEE Advanced',
    inviteCode: 'APEX-IITB',
    ownerId: 'current-user',
    userRole: 'owner',
    membersCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    members: [
      {
        id: 'current-user',
        displayName: 'Aspirant (You)',
        role: 'owner',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        todayFocusMinutes: 225,
        weeklyFocusHours: 38.5,
        streakCount: 14,
        liveStatus: 'focusing',
      },
      {
        id: 'm-2',
        displayName: 'Aarav Mehta',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        todayFocusMinutes: 310,
        weeklyFocusHours: 44.0,
        streakCount: 21,
        liveStatus: 'focusing',
      },
      {
        id: 'm-3',
        displayName: 'Priya Sundaram',
        role: 'member',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        todayFocusMinutes: 180,
        weeklyFocusHours: 32.0,
        streakCount: 9,
        liveStatus: 'idle',
      },
      {
        id: 'm-4',
        displayName: 'Devraj Singh',
        role: 'member',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        todayFocusMinutes: 260,
        weeklyFocusHours: 36.5,
        streakCount: 12,
        liveStatus: 'focusing',
      },
    ],
  },
  {
    id: 'grp-2',
    name: 'Physics Irodov & Krotov Solving Syndicate',
    description: 'Weekly Olympiad & Advanced level physics problem discussions.',
    targetExam: 'JEE Advanced',
    inviteCode: 'APEX-PHYS',
    ownerId: 'm-2',
    userRole: 'member',
    membersCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    members: [
      {
        id: 'm-2',
        displayName: 'Aarav Mehta',
        role: 'owner',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        todayFocusMinutes: 310,
        weeklyFocusHours: 44.0,
        streakCount: 21,
        liveStatus: 'focusing',
      },
      {
        id: 'current-user',
        displayName: 'Aspirant (You)',
        role: 'member',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        todayFocusMinutes: 225,
        weeklyFocusHours: 38.5,
        streakCount: 14,
        liveStatus: 'focusing',
      },
    ],
  },
];

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groups: initialGroups,
      activeGroupId: initialGroups[0]?.id,

      createGroup: (name, description, targetExam) => {
        const newGroup: StudyGroup = {
          id: generateId(),
          name,
          description,
          targetExam,
          inviteCode: generatePeerCode(),
          ownerId: 'current-user',
          userRole: 'owner',
          membersCount: 1,
          createdAt: new Date().toISOString(),
          members: [
            {
              id: 'current-user',
              displayName: 'Aspirant (You)',
              role: 'owner',
              todayFocusMinutes: 0,
              weeklyFocusHours: 0,
              streakCount: 1,
              liveStatus: 'idle',
            },
          ],
        };
        set((state) => ({
          groups: [newGroup, ...state.groups],
          activeGroupId: newGroup.id,
        }));
        return newGroup;
      },

      joinGroup: (inviteCode) => {
        const clean = inviteCode.trim().toUpperCase();
        if (clean.length < 6) return false;

        const joinedGroup: StudyGroup = {
          id: generateId(),
          name: `Cohort (${clean})`,
          description: 'Collaborative peer group joined via invite code.',
          targetExam: 'JEE Advanced',
          inviteCode: clean,
          ownerId: 'group-creator',
          userRole: 'member',
          membersCount: 5,
          createdAt: new Date().toISOString(),
          members: [
            {
              id: 'current-user',
              displayName: 'Aspirant (You)',
              role: 'member',
              todayFocusMinutes: 120,
              weeklyFocusHours: 18.5,
              streakCount: 7,
              liveStatus: 'focusing',
            },
            {
              id: 'm-creator',
              displayName: 'Group Leader',
              role: 'owner',
              todayFocusMinutes: 240,
              weeklyFocusHours: 35.0,
              streakCount: 19,
              liveStatus: 'focusing',
            },
          ],
        };

        set((state) => ({
          groups: [joinedGroup, ...state.groups],
          activeGroupId: joinedGroup.id,
        }));
        return true;
      },

      leaveGroup: (groupId) => {
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== groupId),
          activeGroupId:
            state.activeGroupId === groupId
              ? state.groups.find((g) => g.id !== groupId)?.id
              : state.activeGroupId,
        }));
      },

      deleteGroup: (groupId) => {
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== groupId),
          activeGroupId:
            state.activeGroupId === groupId
              ? state.groups.find((g) => g.id !== groupId)?.id
              : state.activeGroupId,
        }));
      },

      setActiveGroupId: (activeGroupId) => set({ activeGroupId }),
    }),
    {
      name: 'apextrack-group-store',
    }
  )
);
