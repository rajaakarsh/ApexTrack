import React, { useState } from 'react';
import {
  AlertOctagon,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  BrainCircuit,
  Calculator,
  Clock,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useErrorStore } from '../store/useErrorStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useMockStore } from '../store/useMockStore';
import { ErrorLog as ErrorLogType, MistakeType } from '../types';

export const ErrorLog: React.FC = () => {
  const {
    errorLogs,
    addErrorLog,
    updateErrorLog,
    deleteErrorLog,
    toggleMastered,
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    selectedMistakeType,
    setSelectedMistakeType,
    getMistakeDistribution,
    getWeakestSubjectAndChapter,
  } = useErrorStore();

  const { subjects } = useSyllabusStore();
  const { mockTests } = useMockStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingError, setEditingError] = useState<ErrorLogType | null>(null);

  // Form State
  const [subject, setSubject] = useState(subjects[0]?.name || 'Physics');
  const [chapter, setChapter] = useState('Rotational Motion');
  const [topic, setTopic] = useState('');
  const [mistakeType, setMistakeType] = useState<MistakeType>('conceptual');
  const [description, setDescription] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [linkedMockId, setLinkedMockId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const distribution = getMistakeDistribution();
  const weakestInfo = getWeakestSubjectAndChapter();

  const mistakeTypesList: { id: MistakeType; label: string; color: string; icon: React.ReactNode }[] = [
    { id: 'conceptual', label: 'Conceptual Error', color: '#ec4899', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'calculation', label: 'Calculation Mistake', color: '#f59e0b', icon: <Calculator className="w-4 h-4" /> },
    { id: 'silly_mistake', label: 'Silly / Bubbling Mistake', color: '#f43f5e', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'formula', label: 'Formula Recall Mistake', color: '#38bdf8', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'time_management', label: 'Time Management / Rush', color: '#a855f7', icon: <Clock className="w-4 h-4" /> },
  ];

  const chartData = [
    { name: 'Conceptual', count: distribution.conceptual, fill: '#ec4899' },
    { name: 'Calculation', count: distribution.calculation, fill: '#f59e0b' },
    { name: 'Silly Mistake', count: distribution.silly_mistake, fill: '#f43f5e' },
    { name: 'Formula', count: distribution.formula, fill: '#38bdf8' },
    { name: 'Time Mgmt', count: distribution.time_management, fill: '#a855f7' },
  ];

  const handleOpenAdd = () => {
    setEditingError(null);
    setSubject(subjects[0]?.name || 'Physics');
    setChapter('');
    setTopic('');
    setMistakeType('conceptual');
    setDescription('');
    setCorrectiveAction('');
    setLinkedMockId('');
    setDate(new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleOpenEdit = (err: ErrorLogType) => {
    setEditingError(err);
    setSubject(err.subject);
    setChapter(err.chapter);
    setTopic(err.topic || '');
    setMistakeType(err.mistakeType);
    setDescription(err.description);
    setCorrectiveAction(err.correctiveAction || '');
    setLinkedMockId(err.linkedMockId || '');
    setDate(err.date);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !chapter.trim()) return;

    if (editingError) {
      updateErrorLog(editingError.id, {
        subject,
        chapter: chapter.trim(),
        topic: topic.trim() || undefined,
        mistakeType,
        description: description.trim(),
        correctiveAction: correctiveAction.trim() || undefined,
        linkedMockId: linkedMockId || undefined,
        date,
      });
    } else {
      addErrorLog({
        subject,
        chapter: chapter.trim(),
        topic: topic.trim() || undefined,
        mistakeType,
        description: description.trim(),
        correctiveAction: correctiveAction.trim() || undefined,
        linkedMockId: linkedMockId || undefined,
        date,
        isMastered: false,
      });
    }

    setModalOpen(false);
  };

  // Filtered
  const filtered = errorLogs.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || e.subject === selectedSubject;
    const matchesType = selectedMistakeType === 'all' || e.mistakeType === selectedMistakeType;
    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-400" />
            Error & Mistake Log
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn mock test errors and practice slip-ups into high-retention learning milestones.
          </p>
        </div>

        <Button size="sm" variant="glow" onClick={handleOpenAdd} className="gap-1.5 text-xs">
          <Plus className="w-4 h-4" /> Log Mistake
        </Button>
      </div>

      {/* Weakness Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-rose-500/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Weakest Chapter</span>
          <h4 className="text-xl font-black text-rose-400 mt-0.5">{weakestInfo.weakestChapter}</h4>
          <p className="text-[11px] text-slate-400 mt-1">{weakestInfo.weakestSubject}</p>
        </Card>

        <Card>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Logged Errors</span>
          <h4 className="text-2xl font-black font-mono text-slate-100 mt-0.5">{errorLogs.length}</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            {errorLogs.filter((e) => e.isMastered).length} Mastered & Resolved
          </p>
        </Card>

        <Card>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Top Mistake Category</span>
          <h4 className="text-xl font-black text-amber-400 mt-0.5 capitalize">
            {Object.entries(distribution).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace('_', ' ') || 'None'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">Most frequent reason for lost marks</p>
        </Card>
      </div>

      {/* Mistake Distribution Chart & Filter */}
      <Card>
        <CardHeader>
          <CardTitle>
            <BrainCircuit className="w-4 h-4 text-brand-400" />
            <span>Mistake Category Distribution</span>
          </CardTitle>
        </CardHeader>

        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search mistakes, topics or chapters..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedMistakeType}
              onChange={(e) => setSelectedMistakeType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Mistake Types</option>
              <option value="conceptual">Conceptual</option>
              <option value="calculation">Calculation</option>
              <option value="silly_mistake">Silly Mistake</option>
              <option value="formula">Formula Recall</option>
              <option value="time_management">Time Management</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Mistake Entries List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="py-12 text-center text-xs text-slate-500">
            No mistakes found matching your filters.
          </Card>
        ) : (
          filtered.map((err) => {
            const typeInfo = mistakeTypesList.find((m) => m.id === err.mistakeType);
            return (
              <Card
                key={err.id}
                className={`p-4 space-y-3 transition-all ${
                  err.isMastered ? 'opacity-70 bg-slate-950/60 border-slate-800' : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider"
                        style={{ backgroundColor: `${typeInfo?.color}20`, color: typeInfo?.color }}
                      >
                        {typeInfo?.label}
                      </span>
                      <span className="text-xs font-semibold text-brand-400">{err.subject}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs font-bold text-slate-200">{err.chapter}</span>
                      {err.topic && (
                        <>
                          <span className="text-slate-500">•</span>
                          <span className="text-xs text-slate-400 font-mono">{err.topic}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-medium pt-1">
                      {err.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Button
                      size="sm"
                      variant={err.isMastered ? 'glow' : 'outline'}
                      onClick={() => toggleMastered(err.id)}
                      className="text-[11px] h-7 px-2.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {err.isMastered ? 'Mastered ✓' : 'Mark Resolved'}
                    </Button>

                    <button
                      onClick={() => handleOpenEdit(err)}
                      className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteErrorLog(err.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {err.correctiveAction && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-brand-500/20 text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-brand-400 font-bold flex-shrink-0">Action / Rule:</span>
                    <span>{err.correctiveAction}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  <span>Logged on: {err.date}</span>
                  {err.linkedMockId && <span>Linked to Mock Test #{err.linkedMockId}</span>}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingError ? 'Edit Logged Mistake' : 'Log a Study Mistake'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Chapter Name"
              placeholder="e.g. Rotational Motion"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Topic / Question ID (Optional)"
              placeholder="e.g. Rolling with Slipping Q24"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Mistake Classification</label>
              <select
                value={mistakeType}
                onChange={(e) => setMistakeType(e.target.value as MistakeType)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="conceptual">Conceptual Error</option>
                <option value="calculation">Calculation Mistake</option>
                <option value="silly_mistake">Silly Mistake / Bubbling</option>
                <option value="formula">Formula Recall Error</option>
                <option value="time_management">Time Management / Rush</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Mistake Description"
            placeholder="Describe what went wrong and why..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={2}
          />

          <Textarea
            label="Corrective Rule / Key Takeaway"
            placeholder="e.g. Always write out force & torque balance equations separately before solving..."
            value={correctiveAction}
            onChange={(e) => setCorrectiveAction(e.target.value)}
            rows={2}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Linked Mock Test (Optional)</label>
              <select
                value={linkedMockId}
                onChange={(e) => setLinkedMockId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="">None (Practice Error)</option>
                {mockTests.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.testName} ({m.date})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              {editingError ? 'Update Mistake Log' : 'Save Mistake Log'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
