import React, { useState } from 'react';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Square,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Headphones,
  Sliders,
  Flame,
  Star,
  Zap,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useTimerStore } from '../store/useTimerStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useTaskStore } from '../store/useTaskStore';
import { useAppStore } from '../store/useAppStore';
import { TimerMode } from '../types';
import { formatDuration, formatTimerClock } from '../lib/utils';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const FocusTimer: React.FC = () => {
  const { profile, updateLiveStatus } = useAppStore();
  const {
    mode,
    setMode,
    isRunning,
    isPaused,
    secondsLeft,
    secondsElapsed,
    pomodoroPhase,
    customDurationMins,
    setCustomDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    activeSubject,
    setActiveSubject,
    activeTaskId,
    setActiveTaskId,
    sessionNotes,
    setSessionNotes,
    ambientSound,
    setAmbientSound,
    ambientVolume,
    setAmbientVolume,
    zenModeOpen,
    setZenModeOpen,
    summaryModalOpen,
    setSummaryModalOpen,
    lastCompletedSession,
    logCompletedSession,
    sessions,
  } = useTimerStore();

  const { subjects } = useSyllabusStore();
  const { tasks } = useTaskStore();

  // Session save form state
  const [qualityRating, setQualityRating] = useState(5);
  const [reflection, setReflection] = useState('');

  const handleStart = () => {
    startTimer();
    updateLiveStatus('focusing', activeSubject);
  };

  const handlePause = () => {
    pauseTimer();
    updateLiveStatus('idle', activeSubject);
  };

  const handleResume = () => {
    resumeTimer();
    updateLiveStatus('focusing', activeSubject);
  };

  const handleStop = () => {
    stopTimer();
    updateLiveStatus('idle');
  };

  const handleReset = () => {
    resetTimer();
    updateLiveStatus('idle');
  };

  const handleSaveSession = () => {
    logCompletedSession({
      qualityRating,
      notes: reflection || sessionNotes,
    });
    fireCelebrationConfetti();
    setSummaryModalOpen(false);
  };

  // Progress Calculation
  let progressPct = 0;
  if (mode === 'pomodoro') {
    const total = pomodoroPhase === 'focus' ? 25 * 60 : 5 * 60;
    progressPct = Math.min(100, Math.round(((total - secondsLeft) / total) * 100));
  } else if (mode === 'custom') {
    const total = customDurationMins * 60;
    progressPct = Math.min(100, Math.round(((total - secondsLeft) / total) * 100));
  } else {
    // Flow mode: circular loop per hour
    progressPct = Math.min(100, Math.round(((secondsElapsed % 3600) / 3600) * 100));
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const todaySeconds = todaySessions.reduce((a, b) => a + b.durationSeconds, 0);

  const ambientOptions: { id: 'none' | 'binaural' | 'rain' | 'brown' | 'lofi'; label: string; desc: string }[] = [
    { id: 'none', label: 'Off', desc: 'Silence' },
    { id: 'binaural', label: '40Hz Gamma Beats', desc: 'Deep scientific focus' },
    { id: 'rain', label: 'Rain & Nature', desc: 'Soft soothing frequency' },
    { id: 'brown', label: 'Brown Noise', desc: 'ADHD block & relaxation' },
    { id: 'lofi', label: 'Lo-Fi Warm Synth', desc: 'Warm acoustic drone' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <TimerIcon className="w-6 h-6 text-brand-400" />
            Deep Work Focus Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immerse yourself in structured study blocks with audio synthesis and session logging.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-400">Today Focused:</span>
            <span className="font-mono font-bold text-brand-400">{formatDuration(todaySeconds)}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setZenModeOpen(true)}
            className="text-xs gap-1.5"
            title="Fullscreen Zen Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Zen Mode
          </Button>
        </div>
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex justify-center">
        <Tabs
          tabs={[
            { id: 'pomodoro', label: 'Pomodoro (25m/5m)' },
            { id: 'flow', label: 'Flow Stopwatch' },
            { id: 'custom', label: 'Custom Countdown' },
          ]}
          activeTab={mode}
          onChange={(newMode) => setMode(newMode as TimerMode)}
        />
      </div>

      {/* Main Timer Display Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timer Gauge & Controls */}
        <Card className="lg:col-span-2 flex flex-col items-center justify-center p-8 sm:p-12 relative overflow-hidden space-y-6 text-center">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Phase Badge */}
          {mode === 'pomodoro' && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                pomodoroPhase === 'focus'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              }`}
            >
              {pomodoroPhase === 'focus' ? '⚡ Focus Interval' : '☕ Rest Interval'}
            </span>
          )}

          {/* Large Circular Gauge */}
          <div className="relative py-4">
            <ProgressRing
              progress={progressPct}
              size={260}
              strokeWidth={12}
              colorClass={pomodoroPhase === 'break' ? 'text-sky-400' : 'text-brand-500'}
            >
              <div className="space-y-1">
                <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-100">
                  {formatTimerClock(mode === 'flow' ? secondsElapsed : secondsLeft)}
                </span>
                <p className="text-xs font-medium text-slate-400">
                  {isRunning ? (isPaused ? 'PAUSED' : 'DEEP FOCUSING') : 'READY'}
                </p>
              </div>
            </ProgressRing>
          </div>

          {/* Subject & Linked Task Selector */}
          <div className="w-full max-w-md grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 text-left">Subject</label>
              <select
                value={activeSubject}
                onChange={(e) => setActiveSubject(e.target.value)}
                disabled={isRunning}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 disabled:opacity-50"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 text-left">Linked Task (Optional)</label>
              <select
                value={activeTaskId || ''}
                onChange={(e) => setActiveTaskId(e.target.value || undefined)}
                disabled={isRunning}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 disabled:opacity-50 truncate"
              >
                <option value="">None (General Study)</option>
                {tasks.filter((t) => t.status !== 'done').map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Duration Slider (if custom mode) */}
          {mode === 'custom' && !isRunning && (
            <div className="w-full max-w-md space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Duration:</span>
                <span className="text-brand-400 font-bold">{customDurationMins} Minutes</span>
              </div>
              <input
                type="range"
                min={5}
                max={180}
                step={5}
                value={customDurationMins}
                onChange={(e) => setCustomDuration(Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              size="icon"
              variant="outline"
              onClick={handleReset}
              className="w-12 h-12 rounded-2xl"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5 text-slate-400" />
            </Button>

            {!isRunning ? (
              <Button
                size="lg"
                variant="glow"
                onClick={handleStart}
                className="px-8 py-3.5 text-base gap-2 rounded-2xl shadow-glow"
              >
                <Play className="w-5 h-5 fill-current" /> Start Deep Work
              </Button>
            ) : isPaused ? (
              <Button
                size="lg"
                variant="glow"
                onClick={handleResume}
                className="px-8 py-3.5 text-base gap-2 rounded-2xl shadow-glow"
              >
                <Play className="w-5 h-5 fill-current" /> Resume
              </Button>
            ) : (
              <Button
                size="lg"
                variant="secondary"
                onClick={handlePause}
                className="px-8 py-3.5 text-base gap-2 rounded-2xl border-amber-500/40 text-amber-300"
              >
                <Pause className="w-5 h-5 fill-current" /> Pause
              </Button>
            )}

            {isRunning && (
              <Button
                size="icon"
                variant="danger"
                onClick={handleStop}
                className="w-12 h-12 rounded-2xl"
                title="Finish & Save Session"
              >
                <Square className="w-5 h-5 fill-current" />
              </Button>
            )}
          </div>
        </Card>

        {/* Right 1 Col: Ambient Audio Synthesizer & Today's Log */}
        <div className="space-y-6">
          {/* Ambient Sound Synthesizer */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-brand-400" /> Ambient Audio Generator
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Web Audio API</span>
            </div>

            <div className="space-y-2">
              {ambientOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setAmbientSound(opt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    ambientSound === opt.id
                      ? 'bg-brand-500/15 border-brand-500 text-slate-100 shadow-glow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{opt.label}</h5>
                    <p className="text-[10px] text-slate-400">{opt.desc}</p>
                  </div>
                  {ambientSound === opt.id && (
                    <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                  )}
                </div>
              ))}
            </div>

            {/* Volume Control */}
            {ambientSound !== 'none' && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> Volume
                  </span>
                  <span className="font-mono">{Math.round(ambientVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(Number(e.target.value))}
                  className="w-full accent-brand-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </Card>

          {/* Today's Logged Sessions */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Today's Timeline ({todaySessions.length})
              </span>
              <span className="text-xs font-mono font-bold text-brand-400">
                {formatDuration(todaySeconds)}
              </span>
            </div>

            {todaySessions.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No focus sessions recorded today.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{session.subject}</span>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{session.notes || 'Focused session'}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-brand-400">{formatDuration(session.durationSeconds)}</span>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Fullscreen Zen Mode Overlay */}
      {zenModeOpen && (
        <div className="fixed inset-0 z-50 bg-[#090d16] flex flex-col justify-between p-8 sm:p-12 text-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              <span>ZEN DEEP FOCUS — {activeSubject.toUpperCase()}</span>
            </div>

            <button
              onClick={() => setZenModeOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center space-y-6 max-w-lg mx-auto">
            <span className="text-7xl sm:text-8xl md:text-9xl font-black font-mono text-brand-400 tracking-tighter">
              {formatTimerClock(mode === 'flow' ? secondsElapsed : secondsLeft)}
            </span>

            <p className="text-sm text-slate-400 italic">
              "The discipline you practice today is the rank you celebrate tomorrow."
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              {!isRunning ? (
                <Button size="lg" variant="glow" onClick={handleStart} className="px-8 py-4 text-base">
                  <Play className="w-5 h-5 fill-current mr-2" /> Start
                </Button>
              ) : isPaused ? (
                <Button size="lg" variant="glow" onClick={handleResume} className="px-8 py-4 text-base">
                  <Play className="w-5 h-5 fill-current mr-2" /> Resume
                </Button>
              ) : (
                <Button size="lg" variant="secondary" onClick={handlePause} className="px-8 py-4 text-base">
                  <Pause className="w-5 h-5 fill-current mr-2" /> Pause
                </Button>
              )}

              {isRunning && (
                <Button size="lg" variant="danger" onClick={handleStop} className="px-8 py-4 text-base">
                  <Square className="w-5 h-5 fill-current mr-2" /> Finish
                </Button>
              )}
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 font-mono">
            Sound: {ambientSound.toUpperCase()} • Press Esc or click Minimize to exit
          </div>
        </div>
      )}

      {/* Session Save Reflection Modal */}
      <Modal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        title="Session Completed! 🎉"
        description="Reflect on your focus quality and log your progress."
      >
        <div className="space-y-4 pt-1">
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Subject:</span>
              <h4 className="text-base font-bold text-slate-100">{lastCompletedSession?.subject}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Duration:</span>
              <h4 className="text-xl font-black font-mono text-brand-400">
                {formatDuration(lastCompletedSession?.durationSeconds || 0)}
              </h4>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Focus Quality Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setQualityRating(star)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500 transition-colors"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= qualityRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Session Notes & Key Concepts Mastered"
            placeholder="e.g. Solved 15 Rotational Dynamics moment of inertia problems, reviewed parallel axis theorem..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setSummaryModalOpen(false)}>
              Discard
            </Button>
            <Button variant="glow" onClick={handleSaveSession}>
              Save to Analytics
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
