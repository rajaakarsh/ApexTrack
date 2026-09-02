import React, { useState } from 'react';
import {
  FileText,
  Plus,
  TrendingUp,
  Award,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useMockStore } from '../store/useMockStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { MockSubjectScore, MockTest } from '../types';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const MockTests: React.FC = () => {
  const { mockTests, addMockTest, updateMockTest, deleteMockTest, getStats } = useMockStore();
  const { subjects } = useSyllabusStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMock, setEditingMock] = useState<MockTest | null>(null);

  // Form State
  const [testName, setTestName] = useState('');
  const [category, setCategory] = useState<'Full Length' | 'Sectional' | 'Chapterwise'>('Full Length');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [maxMarks, setMaxMarks] = useState(300);
  const [obtainedMarks, setObtainedMarks] = useState(180);
  const [targetScore, setTargetScore] = useState(210);
  const [attempted, setAttempted] = useState(65);
  const [correct, setCorrect] = useState(50);
  const [notes, setNotes] = useState('');
  const [subjectScores, setSubjectScores] = useState<MockSubjectScore[]>([
    { subject: 'Physics', marks: 60, maxMarks: 100 },
    { subject: 'Chemistry', marks: 65, maxMarks: 100 },
    { subject: 'Mathematics', marks: 55, maxMarks: 100 },
  ]);

  const stats = getStats();

  const handleOpenAdd = () => {
    setEditingMock(null);
    setTestName('');
    setCategory('Full Length');
    setDate(new Date().toISOString().split('T')[0]);
    setMaxMarks(300);
    setObtainedMarks(180);
    setTargetScore(210);
    setAttempted(65);
    setCorrect(50);
    setNotes('');
    setSubjectScores(
      subjects.slice(0, 3).map((s) => ({ subject: s.name, marks: 60, maxMarks: 100 }))
    );
    setModalOpen(true);
  };

  const handleOpenEdit = (mock: MockTest) => {
    setEditingMock(mock);
    setTestName(mock.testName);
    setCategory(mock.category);
    setDate(mock.date);
    setMaxMarks(mock.maxMarks);
    setObtainedMarks(mock.obtainedMarks);
    setTargetScore(mock.targetScore || mock.maxMarks * 0.7);
    setAttempted(mock.attemptedQuestions || 60);
    setCorrect(mock.correctQuestions || 45);
    setNotes(mock.notes || '');
    setSubjectScores(mock.subjectScores || []);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    if (editingMock) {
      updateMockTest(editingMock.id, {
        testName: testName.trim(),
        category,
        date,
        maxMarks: Number(maxMarks),
        obtainedMarks: Number(obtainedMarks),
        targetScore: Number(targetScore),
        attemptedQuestions: Number(attempted),
        correctQuestions: Number(correct),
        subjectScores,
        notes: notes.trim() || undefined,
      });
    } else {
      addMockTest({
        testName: testName.trim(),
        category,
        date,
        maxMarks: Number(maxMarks),
        obtainedMarks: Number(obtainedMarks),
        targetScore: Number(targetScore),
        attemptedQuestions: Number(attempted),
        correctQuestions: Number(correct),
        subjectScores,
        notes: notes.trim() || undefined,
      });
      fireCelebrationConfetti();
    }

    setModalOpen(false);
  };

  const handleSubjectScoreChange = (index: number, marks: number) => {
    const updated = [...subjectScores];
    updated[index].marks = marks;
    setSubjectScores(updated);
    const sum = updated.reduce((a, b) => a + Number(b.marks || 0), 0);
    setObtainedMarks(sum);
  };

  // Trajectory chart data
  const trajectoryData = mockTests.map((m) => ({
    name: m.testName.length > 15 ? m.testName.substring(0, 15) + '...' : m.testName,
    date: m.date,
    Score: m.obtainedMarks,
    Target: m.targetScore || m.maxMarks * 0.7,
    Max: m.maxMarks,
    Accuracy: m.attemptedQuestions ? Math.round(((m.correctQuestions || 0) / m.attemptedQuestions) * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400" />
            Mock Test Score & Accuracy Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log full-length simulations, evaluate subject strengths, and track your performance trajectory.
          </p>
        </div>

        <Button size="sm" variant="glow" onClick={handleOpenAdd} className="gap-1.5 text-xs">
          <Plus className="w-4 h-4" /> Log Mock Test
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tests Taken</span>
          <h4 className="text-2xl font-black font-mono text-slate-100 mt-0.5">{stats.totalTests}</h4>
          <p className="text-[11px] text-slate-400 mt-1">Full & Part Tests</p>
        </Card>

        <Card>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Best Score</span>
          <h4 className="text-2xl font-black font-mono text-brand-400 mt-0.5">{stats.bestScore}</h4>
          <p className="text-[11px] text-slate-400 mt-1">Peak Performance</p>
        </Card>

        <Card>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Average Score</span>
          <h4 className="text-2xl font-black font-mono text-slate-200 mt-0.5">{stats.avgScore}</h4>
          <p className="text-[11px] text-slate-400 mt-1">{stats.avgPercentage}% of Max Marks</p>
        </Card>

        <Card>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Average Accuracy</span>
          <h4 className="text-2xl font-black font-mono text-sky-400 mt-0.5">{stats.avgAccuracy}%</h4>
          <p className="text-[11px] text-slate-400 mt-1">Correct / Attempted</p>
        </Card>

        <Card>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Recent Trend</span>
          <h4
            className={`text-2xl font-black font-mono mt-0.5 flex items-center gap-1 ${
              stats.recentTrend >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {stats.recentTrend >= 0 ? `+${stats.recentTrend}` : stats.recentTrend} Marks
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">vs Previous Test</p>
        </Card>
      </div>

      {/* Trajectory Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <span>Score Progression vs Target Threshold</span>
          </CardTitle>
        </CardHeader>

        <div className="h-72 w-full pt-4">
          {mockTests.length === 0 ? (
            <p className="text-xs text-slate-500 py-12 text-center">Log your first mock test to see your trajectory.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 'dataMax + 20']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Score"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="Target"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Historical Mock Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Mock Test History & Breakdown</span>
          </CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Test Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Subject Breakdown</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockTests.map((mock) => {
                const pct = Math.round((mock.obtainedMarks / mock.maxMarks) * 100);
                const accuracy = mock.attemptedQuestions
                  ? Math.round(((mock.correctQuestions || 0) / mock.attemptedQuestions) * 100)
                  : 0;

                return (
                  <tr key={mock.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100">{mock.testName}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {mock.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{mock.date}</td>
                    <td className="py-3 px-4 font-bold font-mono text-brand-400">
                      {mock.obtainedMarks} <span className="text-slate-500 font-normal">/ {mock.maxMarks}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{pct}%</td>
                    <td className="py-3 px-4 font-mono text-sky-400 font-bold">{accuracy}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {mock.subjectScores?.map((sc, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono"
                          >
                            {sc.subject.substring(0, 4)}: {sc.marks}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(mock)}
                        className="p-1 rounded text-slate-400 hover:text-slate-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMockTest(mock.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMock ? 'Edit Mock Test' : 'Log New Mock Test Score'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <Input
            label="Mock Test Name"
            placeholder="e.g. All India Open Mock Test #4"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="Full Length">Full Length Simulation</option>
                <option value="Sectional">Sectional / Major Test</option>
                <option value="Chapterwise">Chapterwise Test</option>
              </select>
            </div>

            <Input
              label="Test Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Max Marks"
              type="number"
              min={10}
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              required
            />

            <Input
              label="Obtained Score"
              type="number"
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(Number(e.target.value))}
              required
            />

            <Input
              label="Target Goal Score"
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Attempted Questions"
              type="number"
              min={0}
              value={attempted}
              onChange={(e) => setAttempted(Number(e.target.value))}
            />

            <Input
              label="Correct Questions"
              type="number"
              min={0}
              value={correct}
              onChange={(e) => setCorrect(Number(e.target.value))}
            />
          </div>

          {/* Subject-Wise Marks Grid */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-medium text-slate-300">Subject Breakdown</label>
            <div className="grid grid-cols-3 gap-2">
              {subjectScores.map((sc, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-300 block">{sc.subject}</span>
                  <input
                    type="number"
                    placeholder="Marks"
                    value={sc.marks}
                    onChange={(e) => handleSubjectScoreChange(idx, Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-brand-400 font-mono font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          <Textarea
            label="Key Takeaways & Reflections (Optional)"
            placeholder="e.g. Lost 12 marks in silly algebra calculations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              {editingMock ? 'Update Scorecard' : 'Save Scorecard'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
