import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PeerConnection } from '../types';
import { generateId } from '../lib/utils';

interface PeerState {
  peers: PeerConnection[];
  pendingRequests: PeerConnection[];
  incomingNudges: { id: string; from: string; message: string; timestamp: string }[];

  // Actions
  sendPeerRequest: (peerCode: string) => boolean;
  acceptPeerRequest: (connectionId: string) => void;
  rejectPeerRequest: (connectionId: string) => void;
  removePeer: (connectionId: string) => void;
  sendNudge: (peerId: string, message: string) => void;
  dismissNudge: (nudgeId: string) => void;
}

const initialPeers: PeerConnection[] = [
  {
    id: 'pc-1',
    requesterId: 'current-user',
    receiverId: 'peer-user-101',
    status: 'accepted',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    peerProfile: {
      id: 'peer-user-101',
      displayName: 'Aryan Sharma',
      targetExam: 'JEE Advanced',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      liveStatus: 'focusing',
      currentSubject: 'Organic Chemistry',
      todayFocusMinutes: 285,
      tasksCompleted: 4,
      totalTasks: 5,
      questionsSolved: 65,
    },
  },
  {
    id: 'pc-2',
    requesterId: 'peer-user-102',
    receiverId: 'current-user',
    status: 'accepted',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    peerProfile: {
      id: 'peer-user-102',
      displayName: 'Ananya Verma',
      targetExam: 'NEET',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      liveStatus: 'focusing',
      currentSubject: 'Genetics & Evolution',
      todayFocusMinutes: 340,
      tasksCompleted: 6,
      totalTasks: 6,
      questionsSolved: 90,
    },
  },
  {
    id: 'pc-3',
    requesterId: 'current-user',
    receiverId: 'peer-user-103',
    status: 'accepted',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    peerProfile: {
      id: 'peer-user-103',
      displayName: 'Rohan Gupta',
      targetExam: 'JEE Advanced',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      liveStatus: 'idle',
      currentSubject: 'Calculus',
      todayFocusMinutes: 190,
      tasksCompleted: 2,
      totalTasks: 4,
      questionsSolved: 40,
    },
  },
];

export const usePeerStore = create<PeerState>()(
  persist(
    (set, get) => ({
      peers: initialPeers,
      pendingRequests: [],
      incomingNudges: [
        {
          id: 'n-1',
          from: 'Aryan Sharma',
          message: '🔥 Great study streak! Let’s crush the rotation test this Sunday.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ],

      sendPeerRequest: (peerCode) => {
        const cleanCode = peerCode.trim().toUpperCase();
        if (!cleanCode.startsWith('APEX-') || cleanCode.length < 8) {
          return false;
        }

        const newPeer: PeerConnection = {
          id: generateId(),
          requesterId: 'current-user',
          receiverId: generateId(),
          status: 'accepted',
          createdAt: new Date().toISOString(),
          peerProfile: {
            id: generateId(),
            displayName: `Peer (${cleanCode})`,
            targetExam: 'JEE Advanced',
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanCode}`,
            liveStatus: 'focusing',
            currentSubject: 'Physics',
            todayFocusMinutes: 120,
            tasksCompleted: 3,
            totalTasks: 4,
            questionsSolved: 35,
          },
        };

        set((state) => ({ peers: [newPeer, ...state.peers] }));
        return true;
      },

      acceptPeerRequest: (connectionId) => {
        set((state) => ({
          pendingRequests: state.pendingRequests.filter((p) => p.id !== connectionId),
          peers: [
            ...state.peers,
            ...state.pendingRequests
              .filter((p) => p.id === connectionId)
              .map((p) => ({ ...p, status: 'accepted' as const })),
          ],
        }));
      },

      rejectPeerRequest: (connectionId) => {
        set((state) => ({
          pendingRequests: state.pendingRequests.filter((p) => p.id !== connectionId),
        }));
      },

      removePeer: (connectionId) => {
        set((state) => ({
          peers: state.peers.filter((p) => p.id !== connectionId),
        }));
      },

      sendNudge: (peerId, message) => {
        // Broadcast / notify
        console.log(`Nudge sent to ${peerId}: ${message}`);
      },

      dismissNudge: (nudgeId) => {
        set((state) => ({
          incomingNudges: state.incomingNudges.filter((n) => n.id !== nudgeId),
        }));
      },
    }),
    {
      name: 'apextrack-peer-store',
    }
  )
);
