import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Send,
  Flame,
  CheckSquare,
  HelpCircle,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { usePeerStore } from '../store/usePeerStore';
import { useAppStore } from '../store/useAppStore';

export const Peers: React.FC = () => {
  const { profile } = useAppStore();
  const { peers, sendPeerRequest, removePeer, sendNudge } = usePeerStore();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [peerCodeInput, setPeerCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [nudgeModalPeer, setNudgeModalPeer] = useState<string | null>(null);
  const [nudgeMessage, setNudgeMessage] = useState('🔥 Stay dialed in! Let’s crush today’s focus goal.');
  const [nudgeSent, setNudgeSent] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.peerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerCodeInput.trim()) return;

    sendPeerRequest(peerCodeInput);
    setPeerCodeInput('');
    setAddModalOpen(false);
  };

  const handleSendNudge = () => {
    if (nudgeModalPeer) {
      sendNudge(nudgeModalPeer, nudgeMessage);
      setNudgeSent(true);
      setTimeout(() => {
        setNudgeSent(false);
        setNudgeModalPeer(null);
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Peer Accountability Network
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect with competitive study partners, track real-time focus states, and push each other forward.
          </p>
        </div>

        <Button size="sm" variant="glow" onClick={() => setAddModalOpen(true)} className="gap-1.5 text-xs">
          <UserPlus className="w-4 h-4" /> Add Peer by Code
        </Button>
      </div>

      {/* Your Invite Code Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Your Personal Peer Code</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black font-mono text-brand-400 tracking-wider">
              {profile.peerCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Share this code with fellow aspirants to link your preparation cockpits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">Live Status</span>
            <span className="text-xs font-bold text-brand-400 flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              {profile.liveStatus === 'focusing' ? 'Deep Work' : 'Online'}
            </span>
          </div>
        </div>
      </div>

      {/* Connected Peers Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Connected Study Partners ({peers.length})
        </h3>

        {peers.length === 0 ? (
          <Card className="py-12 text-center space-y-2">
            <p className="text-sm text-slate-400">No peers connected yet.</p>
            <Button size="sm" variant="glow" onClick={() => setAddModalOpen(true)}>
              <UserPlus className="w-4 h-4 mr-1" /> Add Your First Peer
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {peers.map((peer) => {
              const p = peer.peerProfile;
              const isFocusing = p.liveStatus === 'focusing';
              return (
                <Card key={peer.id} className="p-5 space-y-4 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                        {p.avatarUrl ? (
                          <img src={p.avatarUrl} alt={p.displayName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center font-bold text-brand-400">
                            {p.displayName[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">{p.displayName}</h4>
                        <span className="text-[11px] text-brand-400 font-mono font-medium">
                          {p.targetExam}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removePeer(peer.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400"
                      title="Remove connection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Live Study Status Pill */}
                  <div
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isFocusing
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isFocusing ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                        }`}
                      />
                      <span className="font-semibold">
                        {isFocusing ? `Focusing: ${p.currentSubject || 'Deep Work'}` : 'Idle / Offline'}
                      </span>
                    </div>
                    {isFocusing && (
                      <span className="text-[10px] font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Peer Daily Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Focus</span>
                      <span className="font-bold font-mono text-slate-100">
                        {Math.floor(p.todayFocusMinutes / 60)}h {p.todayFocusMinutes % 60}m
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Tasks</span>
                      <span className="font-bold font-mono text-slate-100">
                        {p.tasksCompleted}/{p.totalTasks}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Questions</span>
                      <span className="font-bold font-mono text-amber-400">{p.questionsSolved} Qs</span>
                    </div>
                  </div>

                  {/* Nudge Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNudgeModalPeer(p.displayName);
                    }}
                    className="w-full text-xs font-semibold gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Encouragement Nudge
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add Peer by Code */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Connect with Study Partner"
        description="Enter your friend's unique ApexTrack peer invite code."
      >
        <form onSubmit={handleSendRequest} className="space-y-4 pt-1">
          <Input
            label="Peer Invite Code"
            placeholder="e.g. APEX-7X9K"
            value={peerCodeInput}
            onChange={(e) => setPeerCodeInput(e.target.value.toUpperCase())}
            required
            autoFocus
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              Send Connection Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Send Nudge */}
      <Modal
        isOpen={Boolean(nudgeModalPeer)}
        onClose={() => setNudgeModalPeer(null)}
        title={`Send Nudge to ${nudgeModalPeer}`}
      >
        <div className="space-y-4 pt-1">
          {nudgeSent ? (
            <div className="py-6 text-center space-y-2">
              <span className="text-3xl">🔥</span>
              <h4 className="text-sm font-bold text-slate-100">Nudge Delivered!</h4>
              <p className="text-xs text-slate-400">Your study partner will receive this notification.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">Preset High-Yield Nudges</label>
                {[
                  '🔥 Keep up the incredible streak! Let’s crush this study block.',
                  '⚡ Time to lock in! 45 minutes of pure uninterrupted deep focus.',
                  '☕ Great session! Remember to drink water and take a 5m breather.',
                  '📚 Mock test simulation this Sunday. Ready to test our readiness?',
                ].map((msg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNudgeMessage(msg)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors ${
                      nudgeMessage === msg
                        ? 'bg-brand-500/15 border-brand-500 text-slate-100 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setNudgeModalPeer(null)}>
                  Cancel
                </Button>
                <Button variant="glow" onClick={handleSendNudge}>
                  Send Nudge
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
