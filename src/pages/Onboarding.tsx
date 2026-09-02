import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Timer,
  BarChart3,
  Users,
  Palette,
  Sparkles,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { AccentColor, FontFamily, ThemeMode } from '../types';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { profile, completeOnboarding } = useAppStore();
  const { settings, setAccentColor, setThemeMode, setFontFamily, setDayRolloverHour } = useSettingsStore();
  const { loadExamSyllabus } = useSyllabusStore();

  const [step, setStep] = useState(1);

  // Form State
  const [displayName, setDisplayName] = useState(profile.displayName || 'Aspirant');
  const [targetExam, setTargetExam] = useState(profile.targetExam || 'JEE Advanced');
  const [targetYear, setTargetYear] = useState(profile.targetYear || 2026);
  const [examDate, setExamDate] = useState(profile.examDate || '2026-05-24');

  // Preferences State
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>(settings.accentColor);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(settings.themeMode);
  const [selectedFont, setSelectedFont] = useState<FontFamily>(settings.fontFamily);
  const [rolloverHour, setRollover] = useState(settings.dayRolloverHour || 6);

  const examsList = [
    'JEE Advanced',
    'JEE Main',
    'NEET',
    'GATE CS',
    'GATE EC',
    'UPSC CSE',
    'CAT',
    'SSC CGL',
    'Custom Exam',
  ];

  const accents: { id: AccentColor; label: string; color: string }[] = [
    { id: 'emerald', label: 'Emerald Neon', color: 'bg-emerald-500' },
    { id: 'indigo', label: 'Electric Indigo', color: 'bg-indigo-500' },
    { id: 'cyan', label: 'Cyber Cyan', color: 'bg-cyan-500' },
    { id: 'amber', label: 'Sunset Amber', color: 'bg-amber-500' },
    { id: 'rose', label: 'Crimson Rose', color: 'bg-rose-500' },
    { id: 'violet', label: 'Ultra Violet', color: 'bg-purple-500' },
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete Onboarding
      setAccentColor(selectedAccent);
      setThemeMode(selectedTheme);
      setFontFamily(selectedFont);
      setDayRolloverHour(rolloverHour);
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-brand-500 text-slate-950 font-black flex items-center justify-center shadow-glow-sm">
          <Zap className="w-5 h-5 fill-slate-950" />
        </div>
        <span className="text-sm font-extrabold uppercase tracking-wider text-slate-100">
          Apex<span className="text-brand-400">Track</span> Setup
        </span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-brand-500 shadow-glow-sm' : i < step ? 'w-3 bg-brand-600' : 'w-3 bg-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">Step {step} of 5</span>
        </div>

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 1: Student Profile */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-100">Student Profile & Goal</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure your target competitive examination and deadline.
                </p>
              </div>

              <Input
                label="Your Display Name"
                placeholder="e.g. Aryan"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Target Examination</label>
                <div className="grid grid-cols-3 gap-2">
                  {examsList.map((exam) => (
                    <button
                      key={exam}
                      type="button"
                      onClick={() => setTargetExam(exam)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        targetExam === exam
                          ? 'bg-brand-500/20 border-brand-500 text-brand-300 shadow-glow-sm'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Target Year"
                  type="number"
                  min={2025}
                  max={2030}
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                />

                <Input
                  label="Target Exam Date"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Feature Introduction */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-100">How ApexTrack Accelerates Your Prep</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Four core systems designed to give you a structural unfair advantage.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">Syllabus Tracker</h4>
                  <p className="text-[11px] text-slate-400">
                    Subject → Unit → Chapter progress tracking with resource links.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Timer className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">Deep Work Engine</h4>
                  <p className="text-[11px] text-slate-400">
                    Flow & Pomodoro sessions with built-in 40Hz binaural beats.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">Mock & Mistake Analytics</h4>
                  <p className="text-[11px] text-slate-400">
                    Track test trajectories and isolate conceptual & silly errors.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">Peer Accountability</h4>
                  <p className="text-[11px] text-slate-400">
                    Real-time presence, study cohorts, and shared leaderboards.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Study Preferences */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-100">Productivity Preferences</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tune your day rollover and ambient study habits.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Day Rollover Hour</label>
                <p className="text-[11px] text-slate-400 mb-2">
                  When do you want your daily streak and tasks to reset? (Useful for night-owl study sessions).
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 5, 6].map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => setRollover(hour)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        rolloverHour === hour
                          ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {hour}:00 AM
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Show Countdown Widget in Top Bar</span>
                  <span className="text-xs text-brand-400 font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                  <span className="text-xs font-semibold text-slate-200">Procedural Ambient Sounds</span>
                  <span className="text-xs text-brand-400 font-bold">Enabled</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Personalization & Accent */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-100">Personalize Your Operating System</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your preferred color theme and typography.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">Accent Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {accents.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedAccent(acc.id)}
                      className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                        selectedAccent === acc.id
                          ? 'bg-slate-800 border-brand-500 text-slate-100 shadow-glow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${acc.color}`} />
                      <span>{acc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">Typography Font</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Outfit', 'Inter', 'Plus Jakarta Sans', 'JetBrains Mono'] as FontFamily[]).map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => setSelectedFont(font)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedFont === font
                          ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Peer Accountability & Readiness */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/30">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100">You're Ready to Master Your Prep</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your personalized study workspace has been initialized with the official {targetExam} syllabus.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 max-w-sm mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold text-slate-100">{displayName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Exam:</span>
                  <span className="font-bold text-brand-400">{targetExam} {targetYear}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Exam Date:</span>
                  <span className="font-mono text-slate-200">{examDate}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
          {step > 1 ? (
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          ) : (
            <div />
          )}

          <Button variant="glow" size="md" onClick={handleNext} className="gap-1.5 text-xs">
            <span>{step === 5 ? 'Launch Study Cockpit' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
