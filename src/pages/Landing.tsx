import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Timer,
  BarChart3,
  AlertOctagon,
  CheckSquare,
  Users,
  Shield,
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useAppStore();
  const [wastedHours, setWastedHours] = useState(2);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'syllabus' | 'timer' | 'mocks' | 'errors'>('timer');

  const handleStartGuest = () => {
    loginAsGuest();
    navigate('/onboarding');
  };

  const handleStartFree = () => {
    navigate('/login');
  };

  const lostStudyHours = Math.round(wastedHours * 180); // 180 days approx
  const lostFullDays = Math.round(lostStudyHours / 8);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 overflow-x-hidden">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-glow-sm">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-wider uppercase text-slate-100">
                Apex<span className="text-emerald-400">Track</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                STUDY OS v2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-slate-300 hover:text-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
            <Button size="sm" variant="glow" onClick={handleStartGuest}>
              Open Dashboard
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        {/* Glow backdrop blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Productivity Operating System for Competitive Exams</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-[1.1]">
          Master Your Preparation. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
            One Focused Dashboard.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Unify your daily tasks, deep work focus sessions, hierarchical syllabus completion, mock test score analytics, error log, and peer accountability into a single high-performance cockpit.
        </p>

        {/* Exam Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-xl mx-auto">
          {['JEE Main & Advanced', 'NEET', 'GATE CS / EC', 'UPSC CSE', 'CAT', 'SSC CGL'].map((exam) => (
            <span
              key={exam}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            >
              {exam}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Button size="lg" variant="glow" onClick={handleStartFree} className="w-full sm:w-auto shadow-glow">
            Start Free with Cloud Sync
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" variant="secondary" onClick={handleStartGuest} className="w-full sm:w-auto">
            Try Without Account (Guest Mode)
          </Button>
        </div>

        {/* Interactive Dashboard Preview Mockup */}
        <div className="mt-14 relative rounded-2xl border border-slate-700/80 bg-slate-950/80 shadow-2xl p-3 sm:p-5 backdrop-blur-xl max-w-5xl mx-auto overflow-hidden">
          {/* Mock Window Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline">apextrack.study/app/dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono font-bold">
                ● LIVE PRESENCE
              </span>
            </div>
          </div>

          {/* Interactive Mock Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Card 1: Exam Countdown & Focus Progress */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">D-Day Countdown</span>
                <span className="text-xs font-mono font-bold text-emerald-400">JEE ADVANCED 2026</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-lg font-black font-mono text-slate-100 block">182</span>
                  <span className="text-[10px] text-slate-400 uppercase">Days Left</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-lg font-black font-mono text-slate-100 block">26</span>
                  <span className="text-[10px] text-slate-400 uppercase">Sundays</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-lg font-black font-mono text-emerald-400 block">14d</span>
                  <span className="text-[10px] text-slate-400 uppercase">Streak</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Today Focused:</span>
                <span className="font-bold text-slate-100 font-mono">5h 45m / 6h Goal</span>
              </div>
            </div>

            {/* Card 2: Deep Work Timer & Audio */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Deep Work Engine</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  POMODORO ACTIVE
                </span>
              </div>
              <div className="text-center py-2">
                <span className="text-3xl font-black font-mono tracking-wider text-emerald-400">18:42</span>
                <p className="text-xs text-slate-400 mt-1">Focusing on: Rotational Motion (Physics)</p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">🎧 40Hz Gamma Beats</span>
                <span className="text-emerald-400 font-semibold">Session 3 of 4</span>
              </div>
            </div>

            {/* Card 3: Mock Performance Trajectory */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mock Analytics</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +22 Marks
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Recent Score:</span>
                  <span className="font-bold font-mono text-slate-100">204 / 300 (68%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full w-[68%]" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Accuracy: 81.4%</span>
                  <span>Target: 220 Marks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Reality-Check Interactive Section */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>The Reality Check Calculator</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            How Much Time Will Distractions Cost Your Rank?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Small daily time leaks compound into hundreds of lost hours before your exam day.
          </p>

          {/* Slider */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">Wasted Time per Day:</span>
              <span className="text-amber-400 font-bold font-mono text-base">{wastedHours} Hours / day</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={wastedHours}
              onChange={(e) => setWastedHours(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>30 mins (Quick social media)</span>
              <span>6 Hours (Heavy procrastination)</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-left space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Dynamic Calculation</p>
              <p className="text-sm font-semibold">
                If you waste <span className="text-amber-300 underline font-bold">{wastedHours} hours/day</span> over 6 months, you will permanently lose:
              </p>
              <p className="text-2xl font-black font-mono text-amber-300 pt-1">
                {lostStudyHours} Study Hours{' '}
                <span className="text-xs font-normal text-amber-200/80">({lostFullDays} full 8-hour study days)</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Engineered for Competitive Rigor
          </h2>
          <p className="text-sm text-slate-400">
            Every feature is designed specifically to eliminate friction and maximize high-yield study momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card hoverable className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Hierarchical Syllabus Tracker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subject → Unit → Chapter → Subtopic tracking with progress states (Learning, Revision, Completed) and integrated learning resources.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card hoverable className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Deep Work Engine & Audio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Flow mode, customizable Pomodoro cycles, procedural 40Hz binaural beats, and background audio to enter deep focus effortlessly.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card hoverable className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Mock Score Trajectory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log test scores, subject breakdowns, accuracy rates, and visualize your progress trajectory towards your target score.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card hoverable className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Mistake & Error Log</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tag errors by conceptual, calculation, formula, and silly mistakes. Identify weakest chapters before they cost you in the final exam.
            </p>
          </Card>

          {/* Feature 5 */}
          <Card hoverable className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Kanban Study Planner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag-and-drop daily study tasks with duration estimates, subject filters, and calendar export for external syncing.
            </p>
          </Card>

          {/* Feature 6 */}
          <Card hoverable className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Peer Accountability & Presence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect with serious study partners, see live focus statuses, send nudges, create study cohorts, and compete on leaderboards.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Ready to Take Full Control of Your Preparation?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Get started immediately. No credit card required. Works 100% locally or synced to the cloud.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" variant="glow" onClick={handleStartGuest}>
              Open ApexTrack Now (Guest Mode)
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Create Cloud Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-400">
        <p>© 2026 ApexTrack Study Operating System. Built for competitive exam excellence.</p>
      </footer>
    </div>
  );
};
