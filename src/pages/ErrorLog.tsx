import React, { useState } from 'react';
import { Plus, CheckCircle2, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useErrorStore } from '../store/useErrorStore';
import { useAuth } from '../context/AuthContext';
import { errorLogService } from '../services/errorLogService';
import { ErrorLog as ErrorLogType, MistakeType } from '../types';

export const ErrorLog: React.FC = () => {
  const { user, isGuest } = useAuth();
  const {
    errorLogs,
    addErrorLog,
    toggleMastered,
    deleteErrorLog,
    getWeakestSubjectAndChapter,
    getMistakeDistribution,
  } = useErrorStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');
  const [topic, setTopic] = useState('');
  const [mistakeType, setMistakeType] = useState<MistakeType>('conceptual');
  const [description, setDescription] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');

  const weakest = getWeakestSubjectAndChapter();
  const typeBreakdown = getMistakeDistribution();

  const handleSaveError = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !chapter.trim()) return;

    const newError: ErrorLogType = {
      id: 'err-' + Date.now(),
      subject,
      chapter,
      topic: topic || undefined,
      mistakeType,
      description,
      correctiveAction: correctiveAction || undefined,
      date: new Date().toISOString().split('T')[0],
      isMastered: false,
      createdAt: new Date().toISOString(),
    };

    addErrorLog(newError);

    if (user && !isGuest) {
      await errorLogService.createErrorLog(user.id, newError);
    }

    setChapter('');
    setTopic('');
    setDescription('');
    setCorrectiveAction('');
    setModalOpen(false);
  };

  const handleToggleMastered = async (id: string, isMastered: boolean) => {
    toggleMastered(id);
    if (user && !isGuest) {
      await errorLogService.updateErrorLog(user.id, id, { isMastered: !isMastered });
    }
  };

  const handleDelete = async (id: string) => {
    deleteErrorLog(id);
    if (user && !isGuest) {
      await errorLogService.deleteErrorLog(user.id, id);
    }
  };

  const mistakeLabels: Record<MistakeType, string> = {
    conceptual: 'Conceptual',
    calculation: 'Calculation',
    silly_mistake: 'Silly / Read Error',
    formula: 'Formula Recall',
    time_management: 'Time Management',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Error & Mistake Log</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Diagnose and eliminate recurring conceptual errors.</p>
        </div>

        <Button size="sm" variant="primary" onClick={() => setModalOpen(true)} className="text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Log Mistake
        </Button>
      </div>

      {/* Weakness Diagnostic Cards */}
      {weakest.totalErrors > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <ShieldAlert className="w-4 h-4 text-zinc-400" />
              <span>Primary Weakness</span>
            </div>
            <p className="text-sm font-bold text-zinc-100">{weakest.weakestChapter}</p>
            <p className="text-xs text-zinc-500">
              {weakest.totalErrors} logged mistake{weakest.totalErrors === 1 ? '' : 's'} in {weakest.weakestSubject}.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-2">
            <p className="text-xs font-semibold text-zinc-200">Mistake Categories</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(typeBreakdown).map(([type, count]) => (
                <span
                  key={type}
                  className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono"
                >
                  {mistakeLabels[type as MistakeType] || type}: {String(count)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Logs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
          <span>Logged Errors</span>
          <span className="text-[11px] font-mono text-zinc-500">{errorLogs.length}</span>
        </div>

        {errorLogs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs text-zinc-500">No errors logged yet. Stay disciplined!</p>
            <Button size="sm" variant="secondary" onClick={() => setModalOpen(true)}>
              Log a Mistake
            </Button>
          </div>
        ) : (
          <div className="rounded-xl bg-[#111111] border border-zinc-800/80 divide-y divide-zinc-800/60 overflow-hidden">
            {errorLogs.map((err) => (
              <div
                key={err.id}
                className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-zinc-200">{err.chapter}</span>
                    {err.topic && <span className="text-xs text-zinc-500">• {err.topic}</span>}
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                      {mistakeLabels[err.mistakeType]}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{err.subject}</span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{err.description}</p>

                  {err.correctiveAction && (
                    <p className="text-xs text-zinc-400 pt-1 font-mono">
                      Rule: {err.correctiveAction}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleMastered(err.id, err.isMastered)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                      err.isMastered
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {err.isMastered ? 'Mastered ✓' : 'Mark Mastered'}
                  </button>

                  <button
                    onClick={() => handleDelete(err.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Mistake / Weakness">
        <form onSubmit={handleSaveError} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
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

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Mistake Type</label>
              <select
                value={mistakeType}
                onChange={(e) => setMistakeType(e.target.value as MistakeType)}
                className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                <option value="conceptual">Conceptual Error</option>
                <option value="calculation">Calculation Mistake</option>
                <option value="silly_mistake">Silly / Read Error</option>
                <option value="formula">Formula Recall</option>
                <option value="time_management">Time Management</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Chapter"
              placeholder="e.g. Rotational Dynamics"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              required
            />
            <Input
              label="Topic (Optional)"
              placeholder="e.g. Moment of Inertia"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <Input
            label="What went wrong?"
            placeholder="e.g. Forgot parallel axis theorem distance term"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            label="Corrective Action / Rule"
            placeholder="e.g. Always write down axis equation before substituting values"
            value={correctiveAction}
            onChange={(e) => setCorrectiveAction(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Error
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
