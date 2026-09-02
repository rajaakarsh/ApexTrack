import React, { useState } from 'react';
import { formatDuration } from '../lib/utils';

interface LeaderboardItem {
  id: string;
  displayName: string;
  targetExam: string;
  streakDays: number;
  focusSeconds: number;
  questionsSolved: number;
}

const leaderboardData: LeaderboardItem[] = [
  { id: 'lb-1', displayName: 'Aryan Sharma', targetExam: 'JEE Advanced', streakDays: 24, focusSeconds: 28800, questionsSolved: 120 },
  { id: 'lb-2', displayName: 'Ananya Verma', targetExam: 'NEET', streakDays: 31, focusSeconds: 27000, questionsSolved: 145 },
  { id: 'lb-3', displayName: 'Rohan Gupta', targetExam: 'JEE Advanced', streakDays: 19, focusSeconds: 23400, questionsSolved: 85 },
  { id: 'lb-4', displayName: 'Sneha Patel', targetExam: 'GATE CS', streakDays: 15, focusSeconds: 21600, questionsSolved: 90 },
  { id: 'lb-5', displayName: 'Vikram Singh', targetExam: 'UPSC CSE', streakDays: 42, focusSeconds: 19800, questionsSolved: 60 },
];

export const Leaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly'>('daily');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Global Leaderboard</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Rankings based on pure focused study hours.</p>
        </div>

        {/* Timeframe selector */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              timeframe === 'daily' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              timeframe === 'weekly' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl bg-[#111111] border border-zinc-800/80 divide-y divide-zinc-800/60 overflow-hidden">
        {leaderboardData.map((item, index) => {
          const rank = index + 1;
          return (
            <div
              key={item.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-6 text-center font-mono font-bold text-xs ${
                    rank === 1
                      ? 'text-zinc-100'
                      : rank === 2
                      ? 'text-zinc-300'
                      : rank === 3
                      ? 'text-zinc-400'
                      : 'text-zinc-600'
                  }`}
                >
                  #{rank}
                </span>

                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-200">
                  {item.displayName.charAt(0)}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">{item.displayName}</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                    {item.targetExam} • {item.streakDays}d streak
                  </p>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs font-bold text-zinc-100">
                  {formatDuration(item.focusSeconds)}
                </span>
                <p className="text-[11px] text-zinc-500">{item.questionsSolved} questions</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
