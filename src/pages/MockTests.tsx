import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useMockStore } from '../store/useMockStore';
import { useAuth } from '../context/AuthContext';
import { mockTestService } from '../services/mockTestService';
import { MockTest } from '../types';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const MockTests: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { mockTests, addMockTest, deleteMockTest } = useMockStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [testName, setTestName] = useState('');
  const [category, setCategory] = useState<'Full Length' | 'Sectional' | 'Chapterwise'>('Full Length');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [maxMarks, setMaxMarks] = useState(300);
  const [obtainedMarks, setObtainedMarks] = useState(210);
  const [targetScore, setTargetScore] = useState(250);
  const [notes, setNotes] = useState('');

  // Subject marks breakdown
  const [physMarks, setPhysMarks] = useState(70);
  const [chemMarks, setChemMarks] = useState(75);
  const [mathMarks, setMathMarks] = useState(65);

  const handleSaveMock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const newMock: MockTest = {
      id: 'mt-' + Date.now(),
      testName,
      category,
      date,
      maxMarks: Number(maxMarks),
      obtainedMarks: Number(obtainedMarks),
      targetScore: Number(targetScore),
      subjectScores: [
        { subject: 'Physics', marks: Number(physMarks), maxMarks: 100 },
        { subject: 'Chemistry', marks: Number(chemMarks), maxMarks: 100 },
        { subject: 'Mathematics', marks: Number(mathMarks), maxMarks: 100 },
      ],
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    };

    addMockTest(newMock);
    fireCelebrationConfetti();

    if (user && !isGuest) {
      await mockTestService.createMockTest(user.id, newMock);
    }

    setTestName('');
    setNotes('');
    setModalOpen(false);
  };

  const handleDelete = async (mockId: string) => {
    deleteMockTest(mockId);
    if (user && !isGuest) {
      await mockTestService.deleteMockTest(user.id, mockId);
    }
  };

  const trajectory = mockTests.map((m) => ({
    name: m.testName,
    date: m.date,
    score: m.obtainedMarks,
    target: m.targetScore || 220,
    pct: Math.round((m.obtainedMarks / m.maxMarks) * 100),
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Mock Test Analytics</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Log test scorecards and track your trajectory.</p>
        </div>

        <Button size="sm" variant="primary" onClick={() => setModalOpen(true)} className="text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Log Scorecard
        </Button>
      </div>

      {/* Trajectory Chart */}
      {trajectory.length > 0 && (
        <div className="p-6 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
            <h3 className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-400" />
              Score Progression vs Target
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Marks Scored</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="date" stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#262626',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#FAFAFA',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Obtained Score"
                  stroke="#FAFAFA"
                  strokeWidth={2}
                  dot={{ fill: '#111111', stroke: '#FAFAFA', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Mock Tests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
          <span>Logged Scorecards</span>
          <span className="text-[11px] font-mono text-zinc-500">{mockTests.length}</span>
        </div>

        {mockTests.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs text-zinc-500">No mock tests logged yet.</p>
            <Button size="sm" variant="secondary" onClick={() => setModalOpen(true)}>
              Log Your First Mock Test
            </Button>
          </div>
        ) : (
          <div className="rounded-xl bg-[#111111] border border-zinc-800/80 divide-y divide-zinc-800/60 overflow-hidden">
            {mockTests.map((mock) => {
              const pct = Math.round((mock.obtainedMarks / mock.maxMarks) * 100);
              return (
                <div
                  key={mock.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-zinc-200 truncate">{mock.testName}</h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                        {mock.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">{mock.date}</p>

                    {mock.subjectScores && mock.subjectScores.length > 0 && (
                      <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-zinc-400">
                        {mock.subjectScores.map((subj, idx) => (
                          <span key={idx}>
                            {subj.subject}: {subj.marks}/{subj.maxMarks}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-zinc-100">
                        {mock.obtainedMarks} <span className="text-xs text-zinc-600">/ {mock.maxMarks}</span>
                      </span>
                      <p className="text-[11px] text-zinc-500">{pct}%</p>
                    </div>

                    <button
                      onClick={() => handleDelete(mock.id)}
                      className="p-1.5 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mock Test Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Mock Test Scorecard">
        <form onSubmit={handleSaveMock} className="space-y-4 pt-1">
          <Input
            label="Test Name"
            placeholder="e.g. Allen Leader Test 04"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                <option value="Full Length">Full Length</option>
                <option value="Sectional">Sectional</option>
                <option value="Chapterwise">Chapterwise</option>
              </select>
            </div>

            <Input
              label="Date of Test"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Max Marks"
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
            />
            <Input
              label="Obtained Score"
              type="number"
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(Number(e.target.value))}
            />
            <Input
              label="Target Score"
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <p className="text-xs font-medium text-zinc-300">Subject Breakdown</p>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Physics (Marks)"
                type="number"
                value={physMarks}
                onChange={(e) => setPhysMarks(Number(e.target.value))}
              />
              <Input
                label="Chemistry (Marks)"
                type="number"
                value={chemMarks}
                onChange={(e) => setChemMarks(Number(e.target.value))}
              />
              <Input
                label="Mathematics (Marks)"
                type="number"
                value={mathMarks}
                onChange={(e) => setMathMarks(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Scorecard
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
