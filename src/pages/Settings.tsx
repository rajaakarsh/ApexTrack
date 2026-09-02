import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Moon, Sun, LogOut, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTaskStore } from '../store/useTaskStore';
import { useTimerStore } from '../store/useTimerStore';
import { useMockStore } from '../store/useMockStore';
import { useErrorStore } from '../store/useErrorStore';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest, signOut } = useAuth();
  const { profile, setProfile } = useAppStore();
  const { settings, setThemeMode } = useSettingsStore();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [targetExam, setTargetExam] = useState(profile.targetExam);
  const [targetYear, setTargetYear] = useState(profile.targetYear);
  const [examDate, setExamDate] = useState(profile.examDate);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      displayName,
      targetExam,
      targetYear: Number(targetYear),
      examDate,
    });

    if (user && !isGuest) {
      await profileService.updateProfile(user.id, {
        displayName,
        targetExam,
        targetYear: Number(targetYear),
        examDate,
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportBackup = () => {
    const backupData = {
      profile,
      settings,
      tasks: useTaskStore.getState().tasks,
      sessions: useTimerStore.getState().sessions,
      mockTests: useMockStore.getState().mockTests,
      errorLogs: useErrorStore.getState().errorLogs,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apextrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">System Settings</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Manage your exam profile, preferences, and backups.</p>
      </div>

      {/* Target Profile Card */}
      <div className="p-6 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
          <h3 className="text-xs font-semibold text-zinc-200">Aspirant Profile</h3>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Target Examination</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="JEE Main">JEE Main</option>
                <option value="NEET">NEET</option>
                <option value="GATE CS">GATE CS</option>
                <option value="GATE EC">GATE EC</option>
                <option value="UPSC CSE">UPSC CSE</option>
                <option value="CAT">CAT</option>
                <option value="SSC CGL">SSC CGL</option>
              </select>
            </div>

            <Input
              label="Target Exam Date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" variant="primary" type="submit" className="text-xs">
              Save Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Appearance & Theming */}
      <div className="p-6 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-5">
        <div className="pb-3 border-b border-zinc-800/60">
          <h3 className="text-xs font-semibold text-zinc-200">Appearance Mode</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setThemeMode('dark');
              document.documentElement.removeAttribute('data-theme');
            }}
            className={`p-4 rounded-xl border text-left transition-colors flex items-center justify-between ${
              settings.themeMode === 'dark'
                ? 'bg-zinc-800/80 border-zinc-600 text-zinc-100'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-zinc-300" />
              <div>
                <p className="text-xs font-semibold">Minimal Dark</p>
                <p className="text-[10px] text-zinc-500">Pure monochrome dark</p>
              </div>
            </div>
            {settings.themeMode === 'dark' && <Check className="w-4 h-4 text-zinc-100" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('light');
              document.documentElement.setAttribute('data-theme', 'light');
            }}
            className={`p-4 rounded-xl border text-left transition-colors flex items-center justify-between ${
              settings.themeMode === 'light'
                ? 'bg-zinc-800/80 border-zinc-600 text-zinc-100'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-zinc-300" />
              <div>
                <p className="text-xs font-semibold">Clean Light</p>
                <p className="text-[10px] text-zinc-500">Daylight minimal</p>
              </div>
            </div>
            {settings.themeMode === 'light' && <Check className="w-4 h-4 text-zinc-100" />}
          </button>
        </div>
      </div>

      {/* Data Backup & Export */}
      <div className="p-6 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-4">
        <div className="pb-3 border-b border-zinc-800/60">
          <h3 className="text-xs font-semibold text-zinc-200">Data Portability</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Download a complete JSON backup of all your study data.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary" onClick={handleExportBackup} className="text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export JSON Backup
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-xl bg-[#111111] border border-rose-500/20 space-y-4">
        <div className="pb-3 border-b border-zinc-800/60">
          <h3 className="text-xs font-semibold text-rose-400">Danger Zone</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-200">Sign Out of Session</p>
            <p className="text-[11px] text-zinc-500">Revoke active session credentials on this device.</p>
          </div>
          <Button size="sm" variant="danger" onClick={handleSignOut} className="text-xs gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
