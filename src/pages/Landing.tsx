import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Timer, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col justify-between p-6 sm:p-12">
      {/* Top Nav */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center justify-center">
            T
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Track</span>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button size="sm" variant="primary" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-3xl mx-auto w-full text-center space-y-8 my-auto py-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <span>Competitive Exam Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            A calm, focused operating system for serious exam preparation.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Plan study schedules, track syllabus coverage, run deep focus sessions, and diagnose weaknesses without distraction.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button size="lg" variant="primary" onClick={() => navigate('/login')} className="gap-2">
            <span>Start Preparing</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/onboarding')}>
            Explore Features
          </Button>
        </div>

        {/* 3 Core Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left">
          <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-zinc-200">Daily Study Planner</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              List-first task management with duration estimation and ICS calendar export.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <Timer className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-zinc-200">Deep Work Engine</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Pomodoro & Flow timers with procedural 40Hz Gamma and ambient sound synthesizer.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-zinc-200">Weakness Diagnostics</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Error log categorization and mock test score progression trajectories.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full pt-8 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
        <p>© {new Date().getFullYear()} Track. Built for high performance.</p>
        <p>PostgreSQL & Supabase Auth</p>
      </footer>
    </div>
  );
};
