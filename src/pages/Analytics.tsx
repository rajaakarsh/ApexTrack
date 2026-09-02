import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { BarChart3, Clock, CheckCircle2, Flame, Award } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';
import { useTaskStore } from '../store/useTaskStore';
import { useQuestionStore } from '../store/useQuestionStore';
import { useMockStore } from '../store/useMockStore';
import { formatDuration } from '../lib/utils';

export const Analytics: React.FC = () => {
  const { sessions } = useTimerStore();
  const { tasks } = useTaskStore();
  const { logs } = useQuestionStore();
  const { mockTests } = useMockStore();

  // Compute last 7 days study hours
  const getLast7DaysData = () => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const daySessions = sessions.filter((s) => s.date === dateStr);
      const daySeconds = daySessions.reduce((acc, s) => acc + s.durationSeconds, 0);
      const hours = Number((daySeconds / 3600).toFixed(1));

      const dayQuestions = logs[dateStr]?.solvedCount || 0;

      result.push({
        day: dayName,
        date: dateStr,
        hours,
        questions: dayQuestions,
      });
    }
    return result;
  };

  const weeklyData = getLast7DaysData();
  const totalFocusSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalQuestionsSolved = Object.values(logs).reduce((acc, l) => acc + l.solvedCount, 0);
  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">Performance Analytics</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Study time, question throughput, and preparation metrics.</p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111111] border border-zinc-800/80">
          <p className="text-xs text-zinc-500 font-medium">Total Focus Time</p>
          <h3 className="text-xl font-bold font-mono text-zinc-100 mt-1">
            {formatDuration(totalFocusSeconds)}
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-[#111111] border border-zinc-800/80">
          <p className="text-xs text-zinc-500 font-medium">Tasks Completed</p>
          <h3 className="text-xl font-bold font-mono text-zinc-100 mt-1">
            {completedTasksCount} <span className="text-xs text-zinc-600 font-normal">/ {tasks.length}</span>
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-[#111111] border border-zinc-800/80">
          <p className="text-xs text-zinc-500 font-medium">Questions Solved</p>
          <h3 className="text-xl font-bold font-mono text-zinc-100 mt-1">
            {totalQuestionsSolved}
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-[#111111] border border-zinc-800/80">
          <p className="text-xs text-zinc-500 font-medium">Mock Tests Logged</p>
          <h3 className="text-xl font-bold font-mono text-zinc-100 mt-1">
            {mockTests.length}
          </h3>
        </div>
      </div>

      {/* 7-Day Focus Time Chart */}
      <div className="p-6 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
          <h3 className="text-xs font-semibold text-zinc-200">Weekly Focus Hours (Last 7 Days)</h3>
          <span className="text-[11px] font-mono text-zinc-500">Unit: Hours</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="day" stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
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
              <Bar dataKey="hours" fill="#E5E5E5" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Question Solving Throughput Chart */}
      <div className="p-6 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
          <h3 className="text-xs font-semibold text-zinc-200">Daily Questions Solved</h3>
          <span className="text-[11px] font-mono text-zinc-500">Unit: Questions</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="day" stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
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
                dataKey="questions"
                stroke="#FAFAFA"
                strokeWidth={2}
                dot={{ fill: '#111111', stroke: '#FAFAFA', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
