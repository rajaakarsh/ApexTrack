import React, { useState } from 'react';
import { Copy, Check, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePeerStore } from '../store/usePeerStore';
import { useAppStore } from '../store/useAppStore';

export const Peers: React.FC = () => {
  const { profile } = useAppStore();
  const { peers, sendPeerRequest, sendNudge } = usePeerStore();
  const [copied, setCopied] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [nudgedPeerId, setNudgedPeerId] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.peerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectPeer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    sendPeerRequest(inviteCodeInput.trim().toUpperCase());
    setInviteCodeInput('');
  };

  const handleSendNudge = (peerId: string) => {
    sendNudge(peerId, 'High-five! Keep studying strong!');
    setNudgedPeerId(peerId);
    setTimeout(() => setNudgedPeerId(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Accountability Peers</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Live partner study statuses and high-fives.</p>
      </div>

      {/* Code & Connect Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Your Peer Code */}
        <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-3">
          <h3 className="text-xs font-semibold text-zinc-200">Your Peer Code</h3>
          <p className="text-xs text-zinc-400">Share with study partners to connect.</p>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-mono font-bold text-zinc-100 flex-1">
              {profile.peerCode}
            </div>
            <Button size="sm" variant="secondary" onClick={handleCopyCode}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {/* Connect to Partner */}
        <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-3">
          <h3 className="text-xs font-semibold text-zinc-200">Connect to Partner</h3>
          <form onSubmit={handleConnectPeer} className="flex items-center gap-2">
            <Input
              placeholder="e.g. APEX-7821"
              value={inviteCodeInput}
              onChange={(e) => setInviteCodeInput(e.target.value)}
              required
            />
            <Button size="sm" variant="primary" type="submit" className="h-9">
              <UserPlus className="w-3.5 h-3.5 mr-1" /> Connect
            </Button>
          </form>
        </div>
      </div>

      {/* Connected Peers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
          <span>Connected Partners</span>
          <span className="text-[11px] font-mono text-zinc-500">{peers.length}</span>
        </div>

        <div className="rounded-xl bg-[#111111] border border-zinc-800/80 divide-y divide-zinc-800/60 overflow-hidden">
          {peers.map((peer) => {
            const profileData = peer.peerProfile || {
              displayName: 'Partner',
              liveStatus: 'idle',
              targetExam: 'JEE Advanced',
              currentSubject: 'Physics',
            };
            return (
              <div
                key={peer.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-200">
                    {profileData.displayName?.charAt(0) || 'P'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-200">{profileData.displayName}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          profileData.liveStatus === 'focusing'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {profileData.liveStatus === 'focusing' ? 'Focusing' : 'Idle'}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {profileData.currentSubject ? `Studying ${profileData.currentSubject}` : 'Online'} • {profileData.targetExam}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendNudge(peer.id)}
                    className="text-xs"
                  >
                    {nudgedPeerId === peer.id ? 'High-Five Sent! ✋' : 'Send Nudge ✋'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
