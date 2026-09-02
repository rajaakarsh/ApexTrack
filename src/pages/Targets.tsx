import React, { useState } from 'react';
import {
  Target as TargetIcon,
  Plus,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit2,
  Award,
  Archive,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { useTargetStore } from '../store/useTargetStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { Target, TargetCategory } from '../types';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const Targets: React.FC = () => {
  const {
    targets,
    activeCategory,
    setActiveCategory,
    addTarget,
    updateTarget,
    deleteTarget,
    updateProgress,
    toggleCompleted,
  } = useTargetStore();

  const { subjects } = useSyllabusStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [maxProgress, setMaxProgress] = useState(100);
  const [currentProgress, setCurrentProgress] = useState(0);

  const activeTargets = targets.filter((t) => t.category === activeCategory && !t.isCompleted);
  const completedTargets = targets.filter((t) => t.category === activeCategory && t.isCompleted);

  const handleOpenAdd = () => {
    setEditingTarget(null);
    setTitle('');
    setDescription('');
    setSubject('All Subjects');
    const defaultDays = activeCategory === 'weekly' ? 7 : 30;
    setTargetDate(new Date(Date.now() + defaultDays * 86400000).toISOString().split('T')[0]);
    setMaxProgress(activeCategory === 'weekly' ? 100 : 250);
    setCurrentProgress(0);
    setModalOpen(true);
  };

  const handleOpenEdit = (target: Target) => {
    setEditingTarget(target);
    setTitle(target.title);
    setDescription(target.description || '');
    setSubject(target.subject || 'All Subjects');
    setTargetDate(target.targetDate);
    setMaxProgress(target.maxProgress);
    setCurrentProgress(target.currentProgress);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTarget) {
      updateTarget(editingTarget.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        subject,
        targetDate,
        maxProgress: Number(maxProgress),
        currentProgress: Number(currentProgress),
      });
    } else {
      addTarget({
        title: title.trim(),
        description: description.trim() || undefined,
        category: activeCategory,
        subject,
        startDate: new Date().toISOString().split('T')[0],
        targetDate,
        currentProgress: Number(currentProgress),
        maxProgress: Number(maxProgress),
        isCompleted: false,
      });
    }

    setModalOpen(false);
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    toggleCompleted(id);
    if (!currentlyCompleted) {
      fireCelebrationConfetti();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <TargetIcon className="w-6 h-6 text-brand-400" />
            Preparation Targets & Milestones
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Set ambitious weekly sprints and long-term exam milestones to drive structured consistency.
          </p>
        </div>

        <Button size="sm" variant="glow" onClick={handleOpenAdd} className="gap-1.5 text-xs">
          <Plus className="w-4 h-4" /> Add {activeCategory === 'weekly' ? 'Weekly Target' : 'Long-Term Target'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            id: 'weekly',
            label: 'Weekly Sprint Targets',
            badge: targets.filter((t) => t.category === 'weekly' && !t.isCompleted).length,
          },
          {
            id: 'long_term',
            label: 'Long-Term Exam Targets',
            badge: targets.filter((t) => t.category === 'long_term' && !t.isCompleted).length,
          },
        ]}
        activeTab={activeCategory}
        onChange={(id) => setActiveCategory(id as TargetCategory)}
      />

      {/* Active Targets Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Active Targets ({activeTargets.length})
        </h3>

        {activeTargets.length === 0 ? (
          <Card className="py-12 text-center space-y-2">
            <p className="text-sm text-slate-400">No active {activeCategory} targets set yet.</p>
            <Button size="sm" variant="glow" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1" /> Create First Target
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTargets.map((target) => {
              const pct = Math.min(100, Math.round((target.currentProgress / target.maxProgress) * 100));
              return (
                <Card key={target.id} className="space-y-4 relative overflow-hidden">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold font-mono text-brand-400 uppercase tracking-wider bg-brand-500/10 px-2 py-0.5 rounded">
                        {target.subject || 'All Subjects'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{target.title}</h4>
                      {target.description && (
                        <p className="text-xs text-slate-400 leading-relaxed">{target.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(target)}
                        className="p-1 rounded text-slate-400 hover:text-slate-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTarget(target.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar & Slider */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">
                        Progress: <strong className="text-slate-100">{target.currentProgress}</strong> / {target.maxProgress}
                      </span>
                      <span className="text-brand-400 font-bold">{pct}%</span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* Quick increment buttons */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateProgress(target.id, target.currentProgress + 1)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => updateProgress(target.id, target.currentProgress + 5)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => updateProgress(target.id, target.currentProgress + 10)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                        >
                          +10
                        </button>
                      </div>

                      <Button
                        size="sm"
                        variant={pct >= 100 ? 'glow' : 'outline'}
                        onClick={() => handleToggle(target.id, false)}
                        className="text-[11px] py-0.5 h-7"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Achieved
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" /> Target: {target.targetDate}
                    </span>
                    <span>Started: {target.startDate}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Targets Archive */}
      {completedTargets.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Achieved Targets Archive ({completedTargets.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedTargets.map((target) => (
              <div
                key={target.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-emerald-500/20 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 line-through">{target.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Completed: {target.maxProgress}/{target.maxProgress} ({target.subject || 'All'})
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleToggle(target.id, true)}
                  className="text-[10px] h-6 px-2 text-slate-400 hover:text-slate-200"
                >
                  Reopen
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTarget ? 'Edit Target' : `Create ${activeCategory === 'weekly' ? 'Weekly' : 'Long-Term'} Target`}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <Input
            label="Target Goal Title"
            placeholder="e.g. Finish 150 Physics Mechanics Advanced Questions"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="All Subjects">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Target Deadline Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Current Progress"
              type="number"
              min={0}
              value={currentProgress}
              onChange={(e) => setCurrentProgress(Number(e.target.value))}
            />

            <Input
              label="Target Goal Amount"
              type="number"
              min={1}
              value={maxProgress}
              onChange={(e) => setMaxProgress(Number(e.target.value))}
              required
            />
          </div>

          <Textarea
            label="Description & Strategy (Optional)"
            placeholder="Breakdown of question sets or daily checkpoints..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              {editingTarget ? 'Update Target' : 'Save Target'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
