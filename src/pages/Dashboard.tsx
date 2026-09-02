import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckSquare,
  Timer,
  BookOpen,
  FileText,
  AlertOctagon,
  HelpCircle,
  TrendingUp,
  Flame,
  Play,
  Pause,
  ArrowRight,
  Plus,
  Users,
  Target as TargetIcon,
  ShieldCheck,
  Zap,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { PriorityBadge, StatusBadge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import { useTaskStore } from '../store/useTaskStore';
import { useTimerStore } from '../store/useTimerStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useMockStore } from '../store/useMockStore';
import { useErrorStore } from '../store/useErrorStore';
import { useQuestionStore } from '../store/useQuestionStore';
import { usePeerStore } from '../store/usePeerStore';
import { calculateExamCountdown, calculateRealityCheckLoss, formatDuration, formatTimerClock } from '../lib/utils';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAppStore();
  const { tasks, setTaskStatus } = useTaskStore();
  const { sessions, isRunning, isPaused, secondsLeft, mode, startTimer, pauseTimer, resumeTimer } = useTimerStore();
  const { subjects, getOverallProgress, getSubjectProgress } = useSyllabusStore();
  const { mockTests, getStats } = useMockStore();
  const { getWeakestSubjectAndChapter } = useErrorStore();
  const { getTodayLog, getStreak } = useQuestionStore();
  const { peers } = usePeerStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const completedTasks = todayTasks.filter((t) => t.status === 'done');
  const taskCompletionPct =
    todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 0;

  // Focus time today
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const todaySeconds = todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const dailyStudyGoalSeconds = 6 * 3600; // 6 hours
  const studyProgressPct = Math.min(100, Math.round((todaySeconds / dailyStudyGoalSeconds) * 100));

  // Countdown & Reality Check
  const countdown = calculateExamCountdown(profile.examDate);
  const realityCheck = calculateRealityCheckLoss(profile.examDate, 2);

  // Questions today
  const todayQuestions = getTodayLog();
  const questionsStreak = getStreak();
  const questionsPct = Math.min(
    100,
    Math.round((todayQuestions.solvedCount / todayQuestions.targetCount) * 100)
  );

  // Mock stats
  const mockStats = getStats();
  const recentMock = mockTests[mockTests.length - 1];

  // Weakest error
  const weakestArea = getWeakestSubjectAndChapter();

  // Overall Syllabus Progress
  const overallSyllabusPct = getOverallProgress();

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    setTaskStatus(taskId, nextStatus as any);
    if (nextStatus === 'done') {
      fireCelebrationConfetti();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Greeting & Motivational Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Welcome Banner */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 shadow-glass relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-brand-400 bg-brand-500/15 border border-brand-500/30 px-3 py-1 rounded-full">
                {profile.targetExam} {profile.targetYear} Cockpit
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {greeting} 👋 <span className="text-brand-400">{profile.displayName}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Let's make today's preparation count. You have <span className="text-brand-300 font-bold font-mono">{countdown.days} days</span> ({countdown.sundays} Sundays) remaining before D-Day.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 relative z-10">
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Days to Exam</span>
              <span className="text-xl font-black font-mono text-slate-100 mt-0.5 block">{countdown.days}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Sundays Left</span>
              <span className="text-xl font-black font-mono text-slate-100 mt-0.5 block">{countdown.sundays}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Sleeps Left</span>
              <span className="text-xl font-black font-mono text-slate-100 mt-0.5 block">{countdown.sleeps}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Prep Streak</span>
              <span className="text-xl font-black font-mono text-amber-400 mt-0.5 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-current" /> {profile.streakCount}d
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Reality-Check Card */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-glass flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Reality-Check
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-amber-500/30">
              2h/day leak
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              If you waste just 2 hours every day before your exam, you will permanently lose:
            </p>
            <p className="text-3xl font-black font-mono text-amber-300 tracking-tight">
              {realityCheck.lostHours} Hours
            </p>
            <p className="text-[11px] text-slate-400">
              Equal to forfeiting <span className="text-amber-200 font-bold">{realityCheck.lostFullStudyDays} full 8-hour study days</span> forever.
            </p>
          </div>

          <Button
            size="sm"
            variant="glow"
            onClick={() => {
              startTimer();
              navigate('/app/timer');
            }}
            className="w-full text-xs font-bold gap-1.5 shadow-glow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Start Deep Work Session
          </Button>
        </div>
      </div>

      {/* 4 Primary Responsive Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Focus Time Today */}
        <Card hoverable onClick={() => navigate('/app/timer')} className="flex items-center justify-between p-5">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Focused Today</p>
            <h4 className="text-2xl font-black font-mono text-slate-100">{formatDuration(todaySeconds)}</h4>
            <p className="text-[11px] text-slate-400">Goal: 6h 00m ({studyProgressPct}%)</p>
          </div>
          <ProgressRing progress={studyProgressPct} size={54} strokeWidth={5} colorClass="text-brand-500">
            <span className="text-[10px] font-mono font-bold text-slate-100">{studyProgressPct}%</span>
          </ProgressRing>
        </Card>

        {/* Card 2: Daily Tasks Completed */}
        <Card hoverable onClick={() => navigate('/app/planner')} className="flex items-center justify-between p-5">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Tasks Completed</p>
            <h4 className="text-2xl font-black font-mono text-slate-100">
              {completedTasks.length} <span className="text-xs text-slate-500 font-normal">/ {todayTasks.length}</span>
            </h4>
            <p className="text-[11px] text-slate-400">{taskCompletionPct}% completed</p>
          </div>
          <ProgressRing progress={taskCompletionPct} size={54} strokeWidth={5} colorClass="text-sky-400">
            <span className="text-[10px] font-mono font-bold text-slate-100">{taskCompletionPct}%</span>
          </ProgressRing>
        </Card>

        {/* Card 3: Study Streak */}
        <Card hoverable onClick={() => navigate('/app/daily-questions')} className="flex items-center justify-between p-5">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Current Streak</p>
            <h4 className="text-2xl font-black font-mono text-amber-400 flex items-center gap-1.5">
              <Flame className="w-5 h-5 fill-current" /> {profile.streakCount} Days
            </h4>
            <p className="text-[11px] text-slate-400">Top 5% consistency</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Flame className="w-6 h-6 fill-current" />
          </div>
        </Card>

        {/* Card 4: Overall Syllabus Readiness */}
        <Card hoverable onClick={() => navigate('/app/syllabus')} className="flex items-center justify-between p-5">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Syllabus Readiness</p>
            <h4 className="text-2xl font-black font-mono text-slate-100">{overallSyllabusPct}%</h4>
            <p className="text-[11px] text-slate-400">{subjects.length} Subjects Tracked</p>
          </div>
          <ProgressRing progress={overallSyllabusPct} size={54} strokeWidth={5} colorClass="text-purple-400">
            <span className="text-[10px] font-mono font-bold text-slate-100">{overallSyllabusPct}%</span>
          </ProgressRing>
        </Card>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Tasks & Syllabus Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                <CheckSquare className="w-4 h-4 text-brand-400" />
                <span>Today's Study Tasks</span>
                <span className="text-xs text-slate-400 font-mono font-normal">
                  ({completedTasks.length}/{todayTasks.length} Done)
                </span>
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={() => navigate('/app/planner')} className="text-xs font-semibold">
                Open Planner <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>

            {todayTasks.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-xs text-slate-400">No tasks scheduled for today yet.</p>
                <Button size="sm" variant="glow" onClick={() => navigate('/app/planner')}>
                  <Plus className="w-4 h-4 mr-1" /> Add Your First Task
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {todayTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task.id, task.status)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                          task.status === 'done'
                            ? 'bg-brand-500 border-brand-500 text-slate-950 font-black text-xs shadow-sm'
                            : 'border-slate-600 hover:border-brand-500'
                        }`}
                      >
                        {task.status === 'done' && '✓'}
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${
                            task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          <span className="text-brand-400 font-medium">{task.subject}</span>
                          <span>•</span>
                          <span>{task.estimatedDuration}m</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Subject-Wise Syllabus Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>
                <BookOpen className="w-4 h-4 text-brand-400" />
                <span>Syllabus Breakdown</span>
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={() => navigate('/app/syllabus')} className="text-xs font-semibold">
                View Full Tree <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>

            <div className="space-y-4 pt-1">
              {subjects.map((subj) => {
                const prog = getSubjectProgress(subj.id);
                return (
                  <div key={subj.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{subj.name}</span>
                      <span className="font-mono font-bold text-slate-300">{prog}%</span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${prog}%`,
                          backgroundColor: subj.color || '#10b981',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Quick Focus Timer Launcher & Analytics Summary */}
        <div className="space-y-6">
          {/* Quick Focus Timer Card */}
          <Card className="p-5 space-y-4 border-brand-500/30 shadow-glow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Timer className="w-4 h-4 text-brand-400" /> Focus Engine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-brand-500/20 text-brand-300 uppercase">
                {mode} Mode
              </span>
            </div>

            <div className="text-center py-2 space-y-1">
              <span className="text-4xl font-black font-mono text-slate-100 tracking-tight">
                {formatTimerClock(secondsLeft)}
              </span>
              <p className="text-xs text-slate-400">
                {isRunning ? (isPaused ? 'Paused' : 'Focus Session Active') : 'Ready for next study block'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isRunning ? (
                <Button
                  size="sm"
                  variant="glow"
                  onClick={() => {
                    startTimer();
                    navigate('/app/timer');
                  }}
                  className="w-full text-xs font-bold"
                >
                  <Play className="w-3.5 h-3.5 fill-current mr-1.5" /> Start Timer
                </Button>
              ) : isPaused ? (
                <Button size="sm" variant="glow" onClick={resumeTimer} className="w-full text-xs font-bold">
                  <Play className="w-3.5 h-3.5 fill-current mr-1.5" /> Resume
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={pauseTimer} className="w-full text-xs font-bold text-amber-300">
                  <Pause className="w-3.5 h-3.5 fill-current mr-1.5" /> Pause
                </Button>
              )}
            </div>
          </Card>

          {/* Mock Test Trajectory Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Mock Performance</span>
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={() => navigate('/app/mocks')} className="text-xs">
                Details
              </Button>
            </CardHeader>

            {mockTests.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No mock tests logged yet.</p>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Latest Test:</span>
                    <span className="font-bold text-slate-100 truncate">{recentMock.testName}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-2xl font-black font-mono text-brand-400">
                      {recentMock.obtainedMarks} <span className="text-xs text-slate-400">/ {recentMock.maxMarks}</span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {Math.round((recentMock.obtainedMarks / recentMock.maxMarks) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Avg Score</span>
                    <span className="font-mono font-bold text-slate-200">{mockStats.avgScore}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Avg Accuracy</span>
                    <span className="font-mono font-bold text-slate-200">{mockStats.avgAccuracy}%</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Weakest Area Alert */}
          <Card className="border-rose-500/30">
            <div className="flex items-center gap-2 mb-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4" /> Mistake Warning
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-300">
                Weakest Chapter: <span className="text-rose-300 font-bold">{weakestArea.weakestChapter}</span> ({weakestArea.weakestSubject})
              </p>
              <p className="text-[11px] text-slate-400">
                Identified from {weakestArea.totalErrors} logged mistakes. Review key concepts before the next test.
              </p>
              <Button
                size="sm"
                variant="danger"
                onClick={() => navigate('/app/error-log')}
                className="w-full text-xs mt-2"
              >
                Review Mistake Log
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
