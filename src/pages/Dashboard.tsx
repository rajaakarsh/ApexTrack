import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  ArrowRight,
  Plus,
  Play,
  Pause,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PriorityBadge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import { useTaskStore } from '../store/useTaskStore';
import { useTimerStore } from '../store/useTimerStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useMockStore } from '../store/useMockStore';
import { useErrorStore } from '../store/useErrorStore';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { calculateExamCountdown, formatDuration, formatTimerClock } from '../lib/utils';
import { fireCelebrationConfetti } from '../components/ui/Confetti';
import { TaskStatus } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { profile } = useAppStore();
  const { tasks, setTaskStatus } = useTaskStore();
  const { sessions, isRunning, isPaused, secondsLeft, mode, startTimer, pauseTimer, resumeTimer } = useTimerStore();
  const { subjects, getOverallProgress, getSubjectProgress } = useSyllabusStore();
  const { mockTests } = useMockStore();
  const { getWeakestSubjectAndChapter } = useErrorStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const completedTasks = todayTasks.filter((t) => t.status === 'done');
  const taskCompletionPct =
    todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 0;

  // Focus time today
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const todaySeconds = todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0);

  // Overall Syllabus Progress
  const overallSyllabusPct = getOverallProgress();
  const countdown = calculateExamCountdown(profile.examDate);
  const weakestArea = getWeakestSubjectAndChapter();

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleToggleTask = async (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    setTaskStatus(taskId, nextStatus);

    if (nextStatus === 'done') {
      fireCelebrationConfetti();
    }

    if (user && !isGuest) {
      await taskService.updateTask(user.id, taskId, {
        status: nextStatus,
        completedAt: nextStatus === 'done' ? new Date().toISOString() : undefined,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800/80 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            {greeting}, {profile.displayName || 'Aspirant'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • {countdown.days} days until {profile.targetExam}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate('/app/planner')}
            className="text-xs"
          >
            Open Planner
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              startTimer();
              navigate('/app/timer');
            }}
            className="text-xs gap-1.5"
          >
            <Play className="w-3 h-3 fill-current" /> Start Focus
          </Button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#111111] border border-zinc-800/80">
          <p className="text-xs text-zinc-500 font-medium">Focus Time</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-xl font-bold font-mono text-zinc-100">{formatDuration(todaySeconds)}</h3>
            <span className="text-[11px] text-zinc-500 font-mono">Goal: 6h</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111111] border border-zinc-800/80">
          <p className="text-xs text-zinc-500 font-medium">Tasks Completed</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-xl font-bold font-mono text-zinc-100">
              {completedTasks.length} <span className="text-xs text-zinc-600 font-normal">/ {todayTasks.length}</span>
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">{taskCompletionPct}%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111111] border border-zinc-800/80">
          <p className="text-xs text-zinc-500 font-medium">Syllabus Progress</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-xl font-bold font-mono text-zinc-100">{overallSyllabusPct}%</h3>
            <span className="text-[11px] text-zinc-500 font-mono">{subjects.length} subjects</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Today's Tasks & Syllabus */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Tasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200">Today's Tasks</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate('/app/planner')}
                className="text-xs text-zinc-400"
              >
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#111111] border border-zinc-800/80 text-center space-y-2">
                <p className="text-xs text-zinc-500">No tasks planned for today.</p>
                <Button size="sm" variant="secondary" onClick={() => navigate('/app/planner')}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
                </Button>
              </div>
            ) : (
              <div className="rounded-xl bg-[#111111] border border-zinc-800/80 divide-y divide-zinc-800/60 overflow-hidden">
                {todayTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-zinc-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task.id, task.status)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                          task.status === 'done'
                            ? 'bg-zinc-200 border-zinc-200 text-zinc-950 font-bold text-[10px]'
                            : 'border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        {task.status === 'done' && '✓'}
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-medium truncate ${
                            task.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-200'
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {task.subject} • {task.estimatedDuration}m
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Syllabus Progress Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200">Syllabus Overview</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate('/app/syllabus')}
                className="text-xs text-zinc-400"
              >
                Manage <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="rounded-xl bg-[#111111] border border-zinc-800/80 p-5 space-y-4">
              {subjects.map((subj) => {
                const prog = getSubjectProgress(subj.id);
                return (
                  <div key={subj.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-300">{subj.name}</span>
                      <span className="font-mono text-zinc-500">{prog}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-zinc-200 rounded-full transition-all duration-300"
                        style={{ width: `${prog}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Focus Timer & Weakness Diagnostic */}
        <div className="space-y-8">
          {/* Minimal Focus Timer Card */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200">Focus Session</h3>
            <div className="rounded-xl bg-[#111111] border border-zinc-800/80 p-5 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-4xl font-bold font-mono tracking-tight text-zinc-100">
                  {formatTimerClock(secondsLeft)}
                </span>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">
                  {mode} • {isRunning ? (isPaused ? 'Paused' : 'Active') : 'Idle'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                {!isRunning ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      startTimer();
                      navigate('/app/timer');
                    }}
                    className="w-full text-xs"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Start Focus
                  </Button>
                ) : isPaused ? (
                  <Button size="sm" variant="primary" onClick={resumeTimer} className="w-full text-xs">
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Resume
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={pauseTimer} className="w-full text-xs">
                    <Pause className="w-3.5 h-3.5 mr-1.5 fill-current" /> Pause
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Weakness Diagnostic Alert */}
          {weakestArea.totalErrors > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-200">Focus Area</h3>
              <div className="rounded-xl bg-[#111111] border border-zinc-800/80 p-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
                  <AlertOctagon className="w-4 h-4 text-zinc-400" />
                  <span>{weakestArea.weakestChapter}</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Identified from {weakestArea.totalErrors} errors in {weakestArea.weakestSubject}.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/app/error-log')}
                  className="w-full text-xs mt-1"
                >
                  Review Error Log
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
