import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Users,
  Award,
  Flame,
  Copy,
  Check,
  Crown,
  LogOut,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useGroupStore } from '../store/useGroupStore';
import { useAppStore } from '../store/useAppStore';

export const Groups: React.FC = () => {
  const { profile } = useAppStore();
  const { groups, activeGroupId, setActiveGroupId, createGroup, joinGroup, leaveGroup } = useGroupStore();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  // Form State
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupExam, setGroupExam] = useState(profile.targetExam);
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    createGroup(groupName.trim(), groupDesc.trim(), groupExam);
    setGroupName('');
    setGroupDesc('');
    setCreateModalOpen(false);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    joinGroup(joinCode.trim());
    setJoinCode('');
    setJoinModalOpen(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-400" />
            Study Groups & Cohorts
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Form collaborative accountability cohorts, share group leaderboards, and foster competitive excellence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button size="sm" variant="outline" onClick={() => setJoinModalOpen(true)} className="text-xs">
            Join Group by Code
          </Button>
          <Button size="sm" variant="glow" onClick={() => setCreateModalOpen(true)} className="gap-1.5 text-xs">
            <Plus className="w-4 h-4" /> Create Cohort
          </Button>
        </div>
      </div>

      {/* Group Switcher Tabs */}
      {groups.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {groups.map((grp) => {
            const isActive = grp.id === activeGroup?.id;
            return (
              <button
                key={grp.id}
                onClick={() => setActiveGroupId(grp.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-500 text-slate-950 shadow-glow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{grp.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {grp.membersCount} Members
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Group Dashboard */}
      {activeGroup ? (
        <div className="space-y-6">
          {/* Group Overview Banner */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
                  {activeGroup.targetExam} Cohort
                </span>
                <span className="text-xs text-slate-400 font-mono">Role: {activeGroup.userRole?.toUpperCase()}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-100">{activeGroup.name}</h3>
              <p className="text-xs text-slate-300 max-w-xl">{activeGroup.description || 'Dedicated study cohort.'}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-mono">Cohort Code</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-mono font-bold text-brand-400">{activeGroup.inviteCode}</span>
                  <button
                    onClick={() => handleCopyCode(activeGroup.inviteCode)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {activeGroup.userRole !== 'owner' && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => leaveGroup(activeGroup.id)}
                  className="text-xs"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" /> Leave
                </Button>
              )}
            </div>
          </div>

          {/* Group Leaderboard & Member Roster */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Award className="w-4 h-4 text-brand-400" />
                <span>Cohort Focus Leaderboard (Weekly)</span>
              </CardTitle>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Today Focus</th>
                    <th className="py-3 px-4">Weekly Focus</th>
                    <th className="py-3 px-4">Streak</th>
                    <th className="py-3 px-4">Live Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeGroup.members?.map((member, index) => {
                    const isFocusing = member.liveStatus === 'focusing';
                    return (
                      <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold font-mono">
                          {index === 0 ? (
                            <span className="text-amber-400 flex items-center gap-1 font-extrabold">
                              🥇 #1
                            </span>
                          ) : index === 1 ? (
                            <span className="text-slate-300 font-bold">🥈 #2</span>
                          ) : index === 2 ? (
                            <span className="text-amber-600 font-bold">🥉 #3</span>
                          ) : (
                            <span className="text-slate-400">#{index + 1}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                              {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt={member.displayName} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-bold flex items-center justify-center h-full text-brand-400">
                                  {member.displayName[0]}
                                </span>
                              )}
                            </div>
                            <span className="font-semibold text-slate-100">{member.displayName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {member.role === 'owner' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                              <Crown className="w-3 h-3" /> Owner
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono text-slate-400 bg-slate-800">
                              Member
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-brand-400">
                          {Math.floor(member.todayFocusMinutes / 60)}h {member.todayFocusMinutes % 60}m
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-100">
                          {member.weeklyFocusHours.toFixed(1)} Hours
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-400 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-current" /> {member.streakCount}d
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              isFocusing
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isFocusing ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}
                            />
                            {isFocusing ? 'Focusing' : 'Idle'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="py-16 text-center space-y-3">
          <p className="text-sm text-slate-400">You haven't created or joined any study groups yet.</p>
          <div className="flex justify-center gap-3">
            <Button size="sm" variant="glow" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Create a Cohort
            </Button>
            <Button size="sm" variant="outline" onClick={() => setJoinModalOpen(true)}>
              Join with Code
            </Button>
          </div>
        </Card>
      )}

      {/* Modal: Create Group */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Study Cohort">
        <form onSubmit={handleCreate} className="space-y-4 pt-1">
          <Input
            label="Cohort Name"
            placeholder="e.g. JEE Advanced Top 500 Sprint"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Target Competitive Exam"
            placeholder="e.g. JEE Advanced"
            value={groupExam}
            onChange={(e) => setGroupExam(e.target.value)}
            required
          />

          <Textarea
            label="Cohort Mission / Description"
            placeholder="Daily 8+ hours deep work accountability, weekly syllabus targets, and mock review..."
            value={groupDesc}
            onChange={(e) => setGroupDesc(e.target.value)}
            rows={2}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              Launch Cohort
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Join Group */}
      <Modal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} title="Join Existing Study Cohort">
        <form onSubmit={handleJoin} className="space-y-4 pt-1">
          <Input
            label="Group Invite Code"
            placeholder="e.g. APEX-IITB"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            required
            autoFocus
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              Join Cohort
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
