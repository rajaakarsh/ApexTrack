import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Flame,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useQuestionStore } from '../store/useQuestionStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const DailyQuestions: React.FC = () => {
  const {
    dailyTarget,
    setDailyTarget,
    addQuestions,
    setQuestionsForSubject,
    resetTodayQuestions,
    getTodayLog,
    getStreak,
    getWeeklyHistory,
    logs,
  } = useQuestionStore();

  const { subjects } = useSyllabusStore();

  const [customTarget, setCustomTarget] = useState(dailyTarget);
  const [selectedSubj, setSelectedSubj] = useState(subjects[0]?.name || 'Physics');
  const [inputCount, setInputCount] = useState(5);

  const todayLog = getTodayLog();
  const streak = getStreak();
  const weeklyHistory = getWeeklyHistory();

  const completionPct = Math.min(
    100,
    Math.round((todayLog.solvedCount / todayLog.targetCount) * 100)
  );

  const handleAdd = (count: number, subjName: string) => {
    addQuestions(count, subjName);
    if (todayLog.solvedCount + count >= todayLog.targetCount) {
      fireCelebrationConfetti();
    }
  };

  const handleUpdateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    setDailyTarget(Number(customTarget));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            Daily Questions Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log your question solving throughput by subject, maintain your solve streak, and build exam speed.
          </p>
        </div>

        {/* Target Form */}
        <form onSubmit={handleUpdateTarget} className="flex items-center gap-2">
          <Input
            type="number"
            min={10}
            max={300}
            value={customTarget}
            onChange={(e) => setCustomTarget(Number(e.target.value))}
            className="w-24 text-xs font-mono"
          />
          <Button size="sm" variant="outline" type="submit" className="text-xs">
            Set Target
          </Button>
        </form>
      </div>

      {/* Overview Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Today Solved */}
        <Card className="flex items-center justify-between p-6">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Today's Solved</span>
            <h4 className="text-3xl font-black font-mono text-slate-100 mt-1">
              {todayLog.solvedCount} <span className="text-xs text-slate-400 font-normal">/ {todayLog.targetCount}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">{completionPct}% of daily goal achieved</p>
          </div>

          <ProgressRing progress={completionPct} size={72} strokeWidth={7} colorClass="text-amber-400">
            <span className="text-xs font-mono font-bold">{completionPct}%</span>
          </ProgressRing>
        </Card>

        {/* Card 2: Streak */}
        <Card className="flex items-center justify-between p-6">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Solve Streak</span>
            <h4 className="text-3xl font-black font-mono text-amber-400 mt-1 flex items-center gap-1.5">
              <Flame className="w-6 h-6 fill-current" /> {streak} Days
            </h4>
            <p className="text-xs text-slate-400 mt-1">≥ 60% daily target maintained</p>
          </div>
        </Card>

        {/* Card 3: 7-Day Total */}
        <Card className="flex items-center justify-between p-6">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">7-Day Total Solved</span>
            <h4 className="text-3xl font-black font-mono text-brand-400 mt-1">
              {weeklyHistory.reduce((a, b) => a + b.solved, 0)} Qs
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Avg {(weeklyHistory.reduce((a, b) => a + b.solved, 0) / 7).toFixed(0)} questions/day
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Counter Grid By Subject */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Plus className="w-4 h-4 text-brand-400" />
            <span>Log Questions Solved (Subject Wise)</span>
          </CardTitle>
          <button
            onClick={resetTodayQuestions}
            className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Today
          </button>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {subjects.map((subj) => {
            const count = todayLog.subjectBreakdown[subj.name] || 0;
            return (
              <div
                key={subj.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{subj.name}</span>
                  <span className="text-sm font-black font-mono text-brand-400">{count} Solved</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdd(1, subj.name)}
                    className="flex-1 text-xs font-mono"
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdd(5, subj.name)}
                    className="flex-1 text-xs font-mono"
                  >
                    +5
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdd(10, subj.name)}
                    className="flex-1 text-xs font-mono"
                  >
                    +10
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 7-Day Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <span>Last 7 Days Question Solving Throughput</span>
          </CardTitle>
        </CardHeader>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyHistory}>
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="solved" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Questions Solved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
