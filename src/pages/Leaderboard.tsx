import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Flame,
  Clock,
  Sparkles,
  Crown,
  Medal,
  Calendar,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { useAppStore } from '../store/useAppStore';
import { useTimerStore } from '../store/useTimerStore';
import { useQuestionStore } from '../store/useQuestionStore';
import { LeaderboardEntry } from '../types';

export const Leaderboard: React.FC = () => {
  const { profile } = useAppStore();
  const { sessions } = useTimerStore();
  const { getTodayLog } = useQuestionStore();

  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');
  const [examFilter, setExamFilter] = useState('All');

  // Compute current user's today and weekly seconds
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySeconds = sessions
    .filter((s) => s.date === todayStr)
    .reduce((a, b) => a + b.durationSeconds, 0);

  const weeklySeconds = sessions.reduce((a, b) => a + b.durationSeconds, 0);
  const todayQuestions = getTodayLog().solvedCount;

  // Mock global leaderboard dataset
  const globalEntries: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'u-1',
      displayName: 'Aryan Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      targetExam: 'JEE Advanced',
      todayStudySeconds: 28800, // 8h
      weeklyStudySeconds: 180000, // 50h
      questionsSolved: 120,
      streakCount: 28,
      liveStatus: 'focusing',
    },
    {
      rank: 2,
      userId: 'u-2',
      displayName: 'Aditya Birla',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      targetExam: 'JEE Advanced',
      todayStudySeconds: 27000, // 7.5h
      weeklyStudySeconds: 165000, // 45.8h
      questionsSolved: 95,
      streakCount: 22,
      liveStatus: 'focusing',
    },
    {
      rank: 3,
      userId: 'u-3',
      displayName: 'Ananya Verma',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      targetExam: 'NEET',
      todayStudySeconds: 25200, // 7h
      weeklyStudySeconds: 158000, // 43.8h
      questionsSolved: 110,
      streakCount: 19,
      liveStatus: 'focusing',
    },
    {
      rank: 4,
      userId: 'current-user',
      displayName: `${profile.displayName} (You)`,
      targetExam: profile.targetExam,
      todayStudySeconds: Math.max(todaySeconds, 19800), // ~5.5h
      weeklyStudySeconds: Math.max(weeklySeconds, 138000), // ~38.3h
      questionsSolved: Math.max(todayQuestions, 42),
      streakCount: profile.streakCount,
      liveStatus: profile.liveStatus,
      isCurrentUser: true,
    },
    {
      rank: 5,
      userId: 'u-5',
      displayName: 'Tanmay Bhattacharya',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      targetExam: 'GATE CS',
      todayStudySeconds: 18000, // 5h
      weeklyStudySeconds: 125000,
      questionsSolved: 50,
      streakCount: 14,
      liveStatus: 'idle',
    },
    {
      rank: 6,
      userId: 'u-6',
      displayName: 'Kavya Pillai',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      targetExam: 'UPSC CSE',
      todayStudySeconds: 16200, // 4.5h
      weeklyStudySeconds: 115000,
      questionsSolved: 60,
      streakCount: 11,
      liveStatus: 'idle',
    },
    {
      rank: 7,
      userId: 'u-7',
      displayName: 'Rishi Kapoor',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      targetExam: 'CAT',
      todayStudySeconds: 14400, // 4h
      weeklyStudySeconds: 98000,
      questionsSolved: 75,
      streakCount: 8,
      liveStatus: 'idle',
    },
  ];

  const filteredEntries = globalEntries.filter(
    (e) => examFilter === 'All' || e.targetExam === examFilter
  );

  const topThree = filteredEntries.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Competitive Study Leaderboards
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Rankings based on pure focused study hours and solved throughput. Daily reset at 6:00 AM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs
            tabs={[
              { id: 'daily', label: 'Daily Leaderboard' },
              { id: 'weekly', label: 'Weekly Leaderboard' },
            ]}
            activeTab={period}
            onChange={(p) => setPeriod(p as 'daily' | 'weekly')}
          />
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 p-5 rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-glass text-center space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-slate-400/20 text-slate-300 font-black text-sm flex items-center justify-center mx-auto border border-slate-400/40">
              #2
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-400 mx-auto overflow-hidden">
              {topThree[1].avatarUrl && (
                <img src={topThree[1].avatarUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{topThree[1].displayName}</h4>
              <span className="text-[10px] text-slate-400 font-mono">{topThree[1].targetExam}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Study Time</span>
              <span className="text-base font-black font-mono text-slate-100">
                {period === 'daily'
                  ? `${(topThree[1].todayStudySeconds / 3600).toFixed(1)} Hours`
                  : `${(topThree[1].weeklyStudySeconds / 3600).toFixed(1)} Hours`}
              </span>
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="order-1 md:order-2 p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/40 shadow-glow text-center space-y-3 relative overflow-hidden flex flex-col justify-between -mt-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 font-black text-base flex items-center justify-center mx-auto border border-amber-500/60 shadow-glow-sm">
              <Crown className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-amber-400 mx-auto overflow-hidden shadow-glow-sm">
              {topThree[0].avatarUrl && (
                <img src={topThree[0].avatarUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-100">{topThree[0].displayName}</h4>
              <span className="text-xs text-amber-400 font-mono font-semibold">{topThree[0].targetExam}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30">
              <span className="text-[10px] text-amber-300 uppercase font-mono block font-bold">Top Ranker Time</span>
              <span className="text-xl font-black font-mono text-amber-300">
                {period === 'daily'
                  ? `${(topThree[0].todayStudySeconds / 3600).toFixed(1)} Hours`
                  : `${(topThree[0].weeklyStudySeconds / 3600).toFixed(1)} Hours`}
              </span>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3 md:order-3 p-5 rounded-3xl bg-slate-900/80 border border-amber-900/40 shadow-glass text-center space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-amber-800/20 text-amber-600 font-black text-sm flex items-center justify-center mx-auto border border-amber-700/40">
              #3
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-amber-700 mx-auto overflow-hidden">
              {topThree[2].avatarUrl && (
                <img src={topThree[2].avatarUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{topThree[2].displayName}</h4>
              <span className="text-[10px] text-slate-400 font-mono">{topThree[2].targetExam}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Study Time</span>
              <span className="text-base font-black font-mono text-slate-100">
                {period === 'daily'
                  ? `${(topThree[2].todayStudySeconds / 3600).toFixed(1)} Hours`
                  : `${(topThree[2].weeklyStudySeconds / 3600).toFixed(1)} Hours`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Award className="w-4 h-4 text-brand-400" />
            <span>Aspirant Standings</span>
          </CardTitle>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Examinations</option>
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="NEET">NEET</option>
              <option value="GATE CS">GATE CS</option>
              <option value="UPSC CSE">UPSC CSE</option>
              <option value="CAT">CAT</option>
            </select>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Aspirant</th>
                <th className="py-3 px-4">Target Exam</th>
                <th className="py-3 px-4">Focus Time</th>
                <th className="py-3 px-4">Questions Solved</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEntries.map((entry) => {
                const hours =
                  period === 'daily'
                    ? (entry.todayStudySeconds / 3600).toFixed(1)
                    : (entry.weeklyStudySeconds / 3600).toFixed(1);

                return (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-brand-500/10 hover:bg-brand-500/15 border-l-4 border-l-brand-500 font-semibold'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold font-mono">
                      {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                          {entry.avatarUrl ? (
                            <img src={entry.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center font-bold text-brand-400 text-xs">
                              {entry.displayName[0]}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-100">{entry.displayName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{entry.targetExam}</td>
                    <td className="py-3 px-4 font-mono font-bold text-brand-400">{hours} Hours</td>
                    <td className="py-3 px-4 font-mono text-amber-400">{entry.questionsSolved} Qs</td>
                    <td className="py-3 px-4 font-mono text-amber-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" /> {entry.streakCount}d
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full ${
                          entry.liveStatus === 'focusing'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            entry.liveStatus === 'focusing' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                        {entry.liveStatus === 'focusing' ? 'Focusing' : 'Idle'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
