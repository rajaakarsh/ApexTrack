import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useSyllabusStore } from '../store/useSyllabusStore';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { profile, completeOnboarding } = useAppStore();
  const { setThemeMode } = useSettingsStore();
  const { loadExamSyllabus } = useSyllabusStore();

  const [step, setStep] = useState(1);

  // Form State
  const [displayName, setDisplayName] = useState(profile.displayName || 'Aspirant');
  const [targetExam, setTargetExam] = useState(profile.targetExam || 'JEE Advanced');
  const [targetYear, setTargetYear] = useState(profile.targetYear || 2026);
  const [examDate, setExamDate] = useState(profile.examDate || '2026-05-24');

  const examsList = [
    'JEE Advanced',
    'JEE Main',
    'NEET',
    'GATE CS',
    'GATE EC',
    'UPSC CSE',
    'CAT',
    'SSC CGL',
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete Onboarding
      setThemeMode('dark');
      loadExamSyllabus(targetExam);

      completeOnboarding({
        displayName,
        targetExam,
        targetYear: Number(targetYear),
        examDate,
      });

      navigate('/app/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-sm flex items-center justify-center mx-auto">
            T
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">Setup Your Workspace</h1>
          <p className="text-xs text-zinc-400">Step {step} of 3</p>
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-zinc-200 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step Cards */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-zinc-800 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-zinc-100">What should we call you?</h2>
                <p className="text-xs text-zinc-400">Your display name across the cockpit and study rooms.</p>
              </div>

              <Input
                label="Your Name / Handle"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoFocus
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-zinc-100">Which exam are you targeting?</h2>
                <p className="text-xs text-zinc-400">We will load the comprehensive syllabus automatically.</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {examsList.map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => setTargetExam(exam)}
                    className={`p-3 rounded-lg border text-left text-xs font-medium transition-colors ${
                      targetExam === exam
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-zinc-100">When is your D-Day?</h2>
                <p className="text-xs text-zinc-400">Powers the countdown engine and milestone planner.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Target Year"
                  type="number"
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                />
                <Input
                  label="Exam Date"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            {step > 1 ? (
              <Button size="sm" variant="ghost" onClick={handleBack} className="gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
            ) : (
              <div />
            )}

            <Button size="sm" variant="primary" onClick={handleNext} className="gap-1.5 text-xs font-semibold">
              <span>{step === 3 ? 'Launch Workspace' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
