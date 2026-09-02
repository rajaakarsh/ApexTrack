import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

interface StudyGroupItem {
  id: string;
  name: string;
  targetExam: string;
  membersCount: number;
  weeklyHoursGoal: number;
}

const initialGroups: StudyGroupItem[] = [
  { id: 'g-1', name: 'JEE 2026 Top 1000 Aspirants', targetExam: 'JEE Advanced', membersCount: 18, weeklyHoursGoal: 45 },
  { id: 'g-2', name: 'NEET 2026 680+ Cohort', targetExam: 'NEET', membersCount: 24, weeklyHoursGoal: 40 },
  { id: 'g-3', name: 'GATE CS 2026 Algo & Systems', targetExam: 'GATE CS', membersCount: 12, weeklyHoursGoal: 30 },
  { id: 'g-4', name: 'UPSC CSE 2026 GS Mains Writers', targetExam: 'UPSC CSE', membersCount: 15, weeklyHoursGoal: 50 },
];

export const Groups: React.FC = () => {
  const [groups, setGroups] = useState<StudyGroupItem[]>(initialGroups);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [targetExam, setTargetExam] = useState('JEE Advanced');

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    const newGroup: StudyGroupItem = {
      id: 'g-' + Date.now(),
      name: groupName,
      targetExam,
      membersCount: 1,
      weeklyHoursGoal: 40,
    };
    setGroups([newGroup, ...groups]);
    setGroupName('');
    setModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Study Groups & Cohorts</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Collaborative exam rooms and group leaderboards.</p>
        </div>

        <Button size="sm" variant="primary" onClick={() => setModalOpen(true)} className="text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Create Group
        </Button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs font-semibold text-zinc-200">{group.name}</h3>
                <span className="text-[10px] text-zinc-500 font-mono">{group.targetExam}</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">{group.membersCount} members</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
              <span className="text-[11px] text-zinc-500">
                Weekly Target: {group.weeklyHoursGoal} hrs
              </span>
              <Button size="sm" variant="secondary" onClick={() => alert(`Joined ${group.name}!`)}>
                Join Room
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Study Group">
        <form onSubmit={handleCreateGroup} className="space-y-4 pt-1">
          <Input
            label="Group Name"
            placeholder="e.g. JEE 2026 99%ile Cohort"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Target Exam</label>
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
            >
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="JEE Main">JEE Main</option>
              <option value="NEET">NEET</option>
              <option value="GATE CS">GATE CS</option>
              <option value="UPSC CSE">UPSC CSE</option>
              <option value="CAT">CAT</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Group
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
