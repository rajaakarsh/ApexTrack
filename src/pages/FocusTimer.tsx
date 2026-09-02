import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTimerStore } from '../store/useTimerStore';
import { useAuth } from '../context/AuthContext';
import { focusService } from '../services/focusService';
import { soundEngine } from '../lib/audio';
import { formatTimerClock, formatDuration } from '../lib/utils';
import { fireCelebrationConfetti } from '../components/ui/Confetti';
import { FocusSession, TimerMode } from '../types';

export const FocusTimer: React.FC = () => {
  const { user, isGuest } = useAuth();
  const {
    secondsLeft,
    isRunning,
    isPaused,
    mode,
    activeSubject,
    sessions,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setMode,
    setActiveSubject,
    logCompletedSession,
  } = useTimerStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSound, setSelectedSound] = useState<'binaural' | 'rain' | 'brown' | 'lofi' | 'none'>('none');
  const [volume, setVolume] = useState(0.5);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const todaySeconds = todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0);

  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'General'];

  const handleSoundChange = (sound: 'binaural' | 'rain' | 'brown' | 'lofi' | 'none') => {
    setSelectedSound(sound);
    soundEngine.playAmbient(sound, volume);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.playAmbient(selectedSound, newVol);
  };

  const handleCompleteSession = async () => {
    fireCelebrationConfetti();
    const duration = mode === 'pomodoro' ? 25 * 60 : 30 * 60;
    const newSession: FocusSession = {
      id: 'fs-' + Date.now(),
      subject: activeSubject,
      durationSeconds: duration,
      mode,
      date: todayStr,
      startTime: new Date(Date.now() - duration * 1000).toISOString(),
      endTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    logCompletedSession(newSession);

    if (user && !isGuest) {
      await focusService.saveFocusSession(user.id, newSession);
    }

    resetTimer();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Deep Work Engine</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Focus without distractions.</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Toggle Zen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus Clock Block */}
      <div className="rounded-2xl bg-[#111111] border border-zinc-800 p-8 sm:p-12 text-center space-y-8">
        {/* Mode Selector */}
        <div className="inline-flex items-center p-1 rounded-lg bg-zinc-900 border border-zinc-800">
          {(['pomodoro', 'flow', 'custom'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3.5 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                mode === m
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {m === 'pomodoro' ? '25m Pomodoro' : m === 'flow' ? 'Flow Stopwatch' : 'Custom'}
            </button>
          ))}
        </div>

        {/* Large Timer Digits */}
        <div className="space-y-2">
          <div className="text-6xl sm:text-7xl font-bold font-mono tracking-tight text-zinc-100 select-none">
            {formatTimerClock(secondsLeft)}
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            {isRunning ? (isPaused ? 'SESSION PAUSED' : 'DEEP FOCUS ACTIVE') : 'READY'}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <Button size="lg" variant="primary" onClick={startTimer} className="px-8 text-xs font-semibold gap-2">
              <Play className="w-4 h-4 fill-current" /> Start Focus
            </Button>
          ) : isPaused ? (
            <Button size="lg" variant="primary" onClick={resumeTimer} className="px-8 text-xs font-semibold gap-2">
              <Play className="w-4 h-4 fill-current" /> Resume
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={pauseTimer} className="px-8 text-xs font-semibold gap-2">
              <Pause className="w-4 h-4 fill-current" /> Pause
            </Button>
          )}

          {isRunning && (
            <>
              <Button size="icon" variant="outline" onClick={resetTimer} title="Reset Timer">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCompleteSession} className="text-xs">
                Log Session ✓
              </Button>
            </>
          )}
        </div>

        {/* Subject Dropdown Selector */}
        <div className="max-w-xs mx-auto pt-4 border-t border-zinc-800/60 flex items-center justify-center gap-2">
          <span className="text-xs text-zinc-500">Subject:</span>
          <select
            value={activeSubject}
            onChange={(e) => setActiveSubject(e.target.value)}
            className="h-8 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ambient Synthesizer & Daily History */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Synthesizer Card */}
        <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
            <span>Focus Audio Synthesizer</span>
            {selectedSound !== 'none' ? (
              <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-600" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'none', label: 'Mute' },
              { id: 'binaural', label: '40Hz Gamma' },
              { id: 'rain', label: 'Rain / Pink' },
              { id: 'brown', label: 'Deep Brown' },
              { id: 'lofi', label: 'Warm Lo-Fi' },
            ].map((sound) => (
              <button
                key={sound.id}
                type="button"
                onClick={() => handleSoundChange(sound.id as any)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                  selectedSound === sound.id
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                    : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {sound.label}
              </button>
            ))}
          </div>

          {selectedSound !== 'none' && (
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[10px] text-zinc-500">Vol</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg accent-zinc-200"
              />
            </div>
          )}
        </div>

        {/* Today's Focus History */}
        <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
            <span>Today's Focus</span>
            <span className="font-mono text-zinc-400">{formatDuration(todaySeconds)}</span>
          </div>

          <p className="text-xs text-zinc-500">
            {todaySessions.length} completed session{todaySessions.length === 1 ? '' : 's'} today.
          </p>

          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {todaySessions.length === 0 ? (
              <p className="text-xs text-zinc-600 italic py-2">No focus sessions recorded yet.</p>
            ) : (
              todaySessions.map((sess) => (
                <div
                  key={sess.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 text-xs text-zinc-300"
                >
                  <span className="font-medium">{sess.subject}</span>
                  <span className="font-mono text-zinc-500">{formatDuration(sess.durationSeconds)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
