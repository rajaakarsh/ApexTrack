import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Clock,
  Database,
  Download,
  Upload,
  Calendar,
  AlertTriangle,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Cloud,
  Moon,
  Sun,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTaskStore } from '../store/useTaskStore';
import { useTargetStore } from '../store/useTargetStore';
import { useTimerStore } from '../store/useTimerStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useMockStore } from '../store/useMockStore';
import { useErrorStore } from '../store/useErrorStore';
import { useQuestionStore } from '../store/useQuestionStore';
import { AccentColor, FontFamily, ThemeMode } from '../types';
import { exportTasksToICS } from '../lib/icsExport';
import { downloadFile } from '../lib/utils';

export const Settings: React.FC = () => {
  const { profile, setProfile, logout, setMergeModalOpen } = useAppStore();
  const {
    settings,
    setThemeMode,
    setAccentColor,
    setFontFamily,
    setBackgroundImage,
    setBackgroundOpacity,
    setDayRolloverHour,
    setShowCountdown,
    setEnableFocusSounds,
    setPomodoroMins,
    resetToDefaults,
  } = useSettingsStore();

  const taskStore = useTaskStore();
  const targetStore = useTargetStore();
  const timerStore = useTimerStore();
  const syllabusStore = useSyllabusStore();
  const mockStore = useMockStore();
  const errorStore = useErrorStore();
  const questionStore = useQuestionStore();

  // Profile local state
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [targetExam, setTargetExam] = useState(profile.targetExam);
  const [targetYear, setTargetYear] = useState(profile.targetYear);
  const [examDate, setExamDate] = useState(profile.examDate);
  const [profileSaved, setProfileSaved] = useState(false);

  // Danger modal state
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [dangerAction, setDangerAction] = useState<'reset_data' | 'reset_syllabus' | 'logout'>('reset_data');

  // Wallpaper presets
  const wallpapers = [
    { id: 'none', label: 'Pure Dark (No Wallpaper)', url: 'none' },
    {
      id: 'mesh',
      label: 'Deep Cosmic Mesh',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=80',
    },
    {
      id: 'minimal-desk',
      label: 'Moody Study Workspace',
      url: 'https://images.unsplash.com/photo-1507842229450-7f2824e5257b?w=1920&auto=format&fit=crop&q=80',
    },
    {
      id: 'aurora',
      label: 'Neon Aurora Glow',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=80',
    },
  ];

  const accents: { id: AccentColor; label: string; color: string }[] = [
    { id: 'emerald', label: 'Emerald Neon', color: 'bg-emerald-500' },
    { id: 'indigo', label: 'Electric Indigo', color: 'bg-indigo-500' },
    { id: 'cyan', label: 'Cyber Cyan', color: 'bg-cyan-500' },
    { id: 'amber', label: 'Sunset Amber', color: 'bg-amber-500' },
    { id: 'rose', label: 'Crimson Rose', color: 'bg-rose-500' },
    { id: 'violet', label: 'Ultra Violet', color: 'bg-purple-500' },
  ];

  const themes: { id: ThemeMode; label: string; desc: string }[] = [
    { id: 'dark', label: 'Dark Slate', desc: 'Balanced high contrast (#090d16)' },
    { id: 'oled', label: 'Pure OLED Black', desc: 'Maximum battery saver & pitch black' },
    { id: 'slate', label: 'Deep Indigo Slate', desc: 'Soft tinted background' },
    { id: 'light', label: 'Daylight Mode', desc: 'Clean high visibility' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      displayName,
      targetExam,
      targetYear: Number(targetYear),
      examDate,
    });
    syllabusStore.loadExamSyllabus(targetExam);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  // Export Full JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      profile,
      settings,
      tasks: taskStore.tasks,
      targets: targetStore.targets,
      sessions: timerStore.sessions,
      syllabus: syllabusStore.subjects,
      mockTests: mockStore.mockTests,
      errorLogs: errorStore.errorLogs,
      dailyQuestions: questionStore.logs,
    };

    downloadFile(
      JSON.stringify(backupData, null, 2),
      `ApexTrack_Full_Backup_${profile.targetExam.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    );
  };

  // Import JSON Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.tasks) taskStore.importTasks(data.tasks);
        if (data.profile) setProfile(data.profile);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const navigate = useNavigate();
  const { signOut: authSignOut } = useAuth();

  const handleConfirmDanger = async () => {
    if (dangerAction === 'reset_data') {
      taskStore.clearTasks();
      timerStore.clearSessions();
      alert('Local activity data cleared.');
    } else if (dangerAction === 'reset_syllabus') {
      syllabusStore.loadExamSyllabus(profile.targetExam);
      alert('Syllabus progress reset to template default.');
    } else if (dangerAction === 'logout') {
      await authSignOut();
      navigate('/login');
    }
    setDangerModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-brand-400" />
          Operating System Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Customize themes, target examinations, audio defaults, and cloud sync backups.
        </p>
      </div>

      {/* Section 1: Target Exam & Profile */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Clock className="w-4 h-4 text-brand-400" />
            <span>Target Exam & Aspirant Profile</span>
          </CardTitle>
          {profileSaved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </CardHeader>

        <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Aspirant Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Exam</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="JEE Main">JEE Main</option>
                <option value="NEET">NEET</option>
                <option value="GATE CS">GATE Computer Science</option>
                <option value="GATE EC">GATE Electronics</option>
                <option value="UPSC CSE">UPSC Civil Services</option>
                <option value="CAT">CAT (IIM Entrance)</option>
                <option value="SSC CGL">SSC CGL</option>
                <option value="Custom Exam">Custom Exam</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Year"
              type="number"
              min={2025}
              max={2032}
              value={targetYear}
              onChange={(e) => setTargetYear(Number(e.target.value))}
              required
            />

            <Input
              label="D-Day Exam Date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="glow" size="sm" className="text-xs">
              Save Profile & Exam Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Section 2: Appearance & Theming */}
      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Appearance & Theme System</span>
          </CardTitle>
        </CardHeader>

        {/* Theme Mode */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">Theme Background Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((th) => (
              <div
                key={th.id}
                onClick={() => setThemeMode(th.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  settings.themeMode === th.id
                    ? 'bg-slate-800 border-brand-500 shadow-glow-sm text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{th.label}</h4>
                  <p className="text-[10px] text-slate-400">{th.desc}</p>
                </div>
                {settings.themeMode === th.id && <Check className="w-4 h-4 text-brand-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Accent Color Palette */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-medium text-slate-300">Accent Glow Palette</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {accents.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setAccentColor(acc.id)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  settings.accentColor === acc.id
                    ? 'bg-slate-800 border-brand-500 shadow-glow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className={`w-5 h-5 rounded-full ${acc.color} shadow-sm`} />
                <span className="text-[10px] font-semibold text-slate-300">{acc.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Typography Font */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-medium text-slate-300">Typography Font</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Outfit', 'Inter', 'Plus Jakarta Sans', 'JetBrains Mono'] as FontFamily[]).map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => setFontFamily(font)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  settings.fontFamily === font
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

        {/* Wallpaper Background */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-medium text-slate-300">Ambient Wallpaper</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {wallpapers.map((wp) => (
              <button
                key={wp.id}
                type="button"
                onClick={() => setBackgroundImage(wp.url)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                  settings.backgroundImage === wp.url
                    ? 'bg-slate-800 border-brand-500 text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{wp.label}</span>
                {settings.backgroundImage === wp.url && <Check className="w-3.5 h-3.5 text-brand-400" />}
              </button>
            ))}
          </div>

          {settings.backgroundImage !== 'none' && (
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Wallpaper Opacity:</span>
                <span className="font-mono font-bold">{Math.round(settings.backgroundOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.5}
                step={0.05}
                value={settings.backgroundOpacity}
                onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Section 3: Productivity Rules */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Productivity & Day Rollover Rules</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Day Rollover Hour</label>
            <p className="text-[11px] text-slate-400 mb-2">Hour when daily streak and task counters reset.</p>
            <select
              value={settings.dayRolloverHour}
              onChange={(e) => setDayRolloverHour(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value={4}>4:00 AM (Night Owl)</option>
              <option value={5}>5:00 AM</option>
              <option value={6}>6:00 AM (Default Standard)</option>
              <option value={7}>7:00 AM</option>
              <option value={0}>12:00 AM (Midnight)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Top Bar Exam Countdown</label>
            <p className="text-[11px] text-slate-400 mb-2">Show persistent days & Sundays remaining widget.</p>
            <Button
              size="sm"
              variant={settings.showCountdown ? 'glow' : 'outline'}
              onClick={() => setShowCountdown(!settings.showCountdown)}
              className="w-full text-xs"
            >
              {settings.showCountdown ? 'Countdown Enabled ✓' : 'Countdown Hidden'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Section 4: Data Management & Backups */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>
            <Database className="w-4 h-4 text-sky-400" />
            <span>Data Management & Backup Portability</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            size="md"
            variant="outline"
            onClick={handleExportJSON}
            className="flex flex-col items-center p-4 h-auto gap-2 text-xs text-slate-200 hover:border-slate-600"
          >
            <Download className="w-5 h-5 text-brand-400" />
            <span className="font-bold">Export JSON Backup</span>
            <span className="text-[10px] text-slate-400 text-center font-normal">Full study history backup</span>
          </Button>

          <label className="p-4 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/40 hover:border-slate-600 cursor-pointer transition-all flex flex-col items-center gap-2 text-xs text-slate-200 text-center">
            <Upload className="w-5 h-5 text-sky-400" />
            <span className="font-bold">Restore from JSON</span>
            <span className="text-[10px] text-slate-400 font-normal">Import previous backup</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <Button
            size="md"
            variant="outline"
            onClick={() => exportTasksToICS(taskStore.tasks, profile.targetExam)}
            className="flex flex-col items-center p-4 h-auto gap-2 text-xs text-slate-200 hover:border-slate-600"
          >
            <Calendar className="w-5 h-5 text-amber-400" />
            <span className="font-bold">Export .ICS Calendar</span>
            <span className="text-[10px] text-slate-400 text-center font-normal">Sync with Google/Apple</span>
          </Button>
        </div>

        {/* Cloud Sync trigger */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold text-slate-200">Supabase Cloud Sync Status</h5>
            <p className="text-[11px] text-slate-400">
              {profile.isGuest ? 'Running locally in Guest Mode.' : 'Authenticated & Synced.'}
            </p>
          </div>
          <Button size="sm" variant="glow" onClick={() => setMergeModalOpen(true)} className="text-xs">
            <Cloud className="w-3.5 h-3.5 mr-1.5" />
            {profile.isGuest ? 'Connect Cloud Account' : 'Sync Now'}
          </Button>
        </div>
      </Card>

      {/* Section 5: Danger Zone */}
      <Card className="border-rose-500/30 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" /> Danger Zone
        </div>
        <p className="text-xs text-slate-400">
          Destructive actions that cannot be undone. Always export a JSON backup first.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setDangerAction('reset_data');
              setDangerModalOpen(true);
            }}
            className="text-xs"
          >
            Clear Tasks & Sessions
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setDangerAction('reset_syllabus');
              setDangerModalOpen(true);
            }}
            className="text-xs"
          >
            Reset Syllabus Progress
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setDangerAction('logout');
              setDangerModalOpen(true);
            }}
            className="text-xs"
          >
            Log Out & Reset OS
          </Button>
        </div>
      </Card>

      {/* Danger Confirmation Modal */}
      <Modal
        isOpen={dangerModalOpen}
        onClose={() => setDangerModalOpen(false)}
        title="Confirm Destructive Action"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-slate-300">
            Are you sure you want to proceed with this action? This will overwrite or delete the selected local data.
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setDangerModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDanger}>
              Yes, Execute Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
