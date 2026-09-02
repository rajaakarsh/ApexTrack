import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useQuestionStore } from '../store/useQuestionStore';
import { useAuth } from '../context/AuthContext';
import { questionService } from '../services/questionService';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const DailyQuestions: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { logs, addQuestions, setDailyTarget } = useQuestionStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs[todayStr] || {
    id: `q-${todayStr}`,
    date: todayStr,
    solvedCount: 0,
    targetCount: 50,
    subjectBreakdown: { Physics: 0, Chemistry: 0, Mathematics: 0 },
  };

  const [targetInput, setTargetInput] = useState(todayLog.targetCount);
  const [selectedSubject, setSelectedSubject] = useState('Physics');

  const handleIncrement = async (amount: number) => {
    addQuestions(amount, selectedSubject, todayStr);
    if (todayLog.solvedCount + amount >= todayLog.targetCount && todayLog.solvedCount < todayLog.targetCount) {
      fireCelebrationConfetti();
    }

    if (user && !isGuest) {
      const updatedLog = {
        ...todayLog,
        solvedCount: todayLog.solvedCount + amount,
        subjectBreakdown: {
          ...todayLog.subjectBreakdown,
          [selectedSubject]: (todayLog.subjectBreakdown[selectedSubject] || 0) + amount,
        },
      };
      await questionService.saveDailyQuestionLog(user.id, updatedLog);
    }
  };

  const handleUpdateTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    setDailyTarget(Number(targetInput));
    if (user && !isGuest) {
      const updatedLog = {
        ...todayLog,
        targetCount: Number(targetInput),
      };
      await questionService.saveDailyQuestionLog(user.id, updatedLog);
    }
  };

  const pct = Math.round((todayLog.solvedCount / todayLog.targetCount) * 100) || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Daily Questions Solved</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Track daily problem-solving volume and consistency.</p>
      </div>

      {/* Main Counter Card */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#111111] border border-zinc-800 text-center space-y-6">
        <div className="space-y-1">
          <div className="text-5xl sm:text-6xl font-bold font-mono text-zinc-100">
            {todayLog.solvedCount}
            <span className="text-xl text-zinc-600 font-normal"> / {todayLog.targetCount}</span>
          </div>
          <p className="text-xs text-zinc-500 font-mono">{pct}% OF DAILY GOAL</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-zinc-200 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>

        {/* Increment Widgets */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-zinc-400">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-8 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button size="md" variant="secondary" onClick={() => handleIncrement(1)} className="text-xs">
              +1 Solved
            </Button>
            <Button size="md" variant="secondary" onClick={() => handleIncrement(5)} className="text-xs">
              +5 Solved
            </Button>
            <Button size="md" variant="primary" onClick={() => handleIncrement(10)} className="text-xs font-semibold">
              +10 Solved
            </Button>
          </div>
        </div>
      </div>

      {/* Target Setting & Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Set Target Form */}
        <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-4">
          <h3 className="text-xs font-semibold text-zinc-200">Adjust Daily Target</h3>
          <form onSubmit={handleUpdateTarget} className="space-y-3">
            <Input
              label="Target Count"
              type="number"
              min={5}
              max={500}
              value={targetInput}
              onChange={(e) => setTargetInput(Number(e.target.value))}
            />
            <Button size="sm" variant="secondary" type="submit" className="w-full text-xs">
              Update Goal
            </Button>
          </form>
        </div>

        {/* Subject Breakdown */}
        <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-3">
          <h3 className="text-xs font-semibold text-zinc-200">Today's Subject Breakdown</h3>
          <div className="space-y-2 pt-1">
            {Object.entries(todayLog.subjectBreakdown || {}).map(([subj, count]) => (
              <div
                key={subj}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 text-xs text-zinc-300 font-mono"
              >
                <span>{subj}</span>
                <span className="font-semibold text-zinc-100">{Number(count)} solved</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
