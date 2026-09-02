import React, { useState } from 'react';
import { Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useTargetStore } from '../store/useTargetStore';
import { useAuth } from '../context/AuthContext';
import { targetService } from '../services/targetService';
import { Target as TargetType, TargetCategory } from '../types';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const Targets: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { targets, addTarget, updateProgress, toggleCompleted, deleteTarget } = useTargetStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TargetCategory>('weekly');
  const [subject, setSubject] = useState('Physics');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [maxProgress, setMaxProgress] = useState(100);

  const handleSaveTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTarget: TargetType = {
      id: 'tg-' + Date.now(),
      title,
      description,
      category,
      subject,
      startDate: new Date().toISOString().split('T')[0],
      targetDate,
      currentProgress: 0,
      maxProgress: Number(maxProgress),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    addTarget(newTarget);

    if (user && !isGuest) {
      await targetService.createTarget(user.id, newTarget);
    }

    setTitle('');
    setDescription('');
    setModalOpen(false);
  };

  const handleToggle = async (id: string, isCompleted: boolean) => {
    toggleCompleted(id);
    if (!isCompleted) {
      fireCelebrationConfetti();
    }
    if (user && !isGuest) {
      await targetService.updateTarget(user.id, id, { isCompleted: !isCompleted });
    }
  };

  const handleProgressChange = async (id: string, newProg: number) => {
    updateProgress(id, newProg);
    if (user && !isGuest) {
      await targetService.updateTarget(user.id, id, { currentProgress: newProg });
    }
  };

  const handleDelete = async (id: string) => {
    deleteTarget(id);
    if (user && !isGuest) {
      await targetService.deleteTarget(user.id, id);
    }
  };

  const weeklyTargets = targets.filter((t) => t.category === 'weekly');
  const longTermTargets = targets.filter((t) => t.category === 'long_term');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Milestones & Targets</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Track weekly sprints and long-term milestones.</p>
        </div>

        <Button size="sm" variant="primary" onClick={() => setModalOpen(true)} className="text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Target
        </Button>
      </div>

      {/* Weekly Sprints */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
          <span>Weekly Targets</span>
          <span className="text-[11px] font-mono text-zinc-500">{weeklyTargets.length}</span>
        </div>

        {weeklyTargets.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 italic">No weekly sprint targets created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {weeklyTargets.map((target) => {
              const pct = Math.round((target.currentProgress / target.maxProgress) * 100);
              return (
                <div
                  key={target.id}
                  className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          target.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-200'
                        }`}
                      >
                        {target.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {target.subject} • Deadline: {target.targetDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggle(target.id, target.isCompleted)}
                        className="p-1 text-zinc-400 hover:text-zinc-100"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${target.isCompleted ? 'text-zinc-200' : 'text-zinc-600'}`}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(target.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Progress</span>
                      <span>
                        {target.currentProgress} / {target.maxProgress} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-zinc-200 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => handleProgressChange(target.id, Math.max(0, target.currentProgress - 5))}
                      className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 hover:text-zinc-200"
                    >
                      -5
                    </button>
                    <button
                      onClick={() =>
                        handleProgressChange(target.id, Math.min(target.maxProgress, target.currentProgress + 5))
                      }
                      className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 hover:text-zinc-200"
                    >
                      +5
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Long-Term Goals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
          <span>Long-Term Milestones</span>
          <span className="text-[11px] font-mono text-zinc-500">{longTermTargets.length}</span>
        </div>

        {longTermTargets.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 italic">No long-term milestones created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {longTermTargets.map((target) => {
              const pct = Math.round((target.currentProgress / target.maxProgress) * 100);
              return (
                <div
                  key={target.id}
                  className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          target.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-200'
                        }`}
                      >
                        {target.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {target.subject} • Target Date: {target.targetDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggle(target.id, target.isCompleted)}
                        className="p-1 text-zinc-400 hover:text-zinc-100"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${target.isCompleted ? 'text-zinc-200' : 'text-zinc-600'}`}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(target.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Progress</span>
                      <span>
                        {target.currentProgress} / {target.maxProgress} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-zinc-200 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Target Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Milestone / Target"
      >
        <form onSubmit={handleSaveTarget} className="space-y-4 pt-1">
          <Input
            label="Target Title"
            placeholder="e.g. Finish Complete Calculus Modules"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TargetCategory)}
                className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                <option value="weekly">Weekly Target</option>
                <option value="long_term">Long-Term Milestone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Goal Target Value"
              type="number"
              min={1}
              value={maxProgress}
              onChange={(e) => setMaxProgress(Number(e.target.value))}
            />

            <Input
              label="Deadline Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Target
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
