import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccentColor, FontFamily, ThemeMode, UserSettings } from '../types';

interface SettingsState {
  settings: UserSettings;
  setThemeMode: (theme: ThemeMode) => void;
  setAccentColor: (accent: AccentColor) => void;
  setFontFamily: (font: FontFamily) => void;
  setBackgroundImage: (bg: string) => void;
  setBackgroundOpacity: (opacity: number) => void;
  setDayRolloverHour: (hour: number) => void;
  setShowCountdown: (show: boolean) => void;
  setEnableFocusSounds: (enable: boolean) => void;
  setPomodoroMins: (focus: number, breakMins: number) => void;
  resetToDefaults: () => void;
}

const defaultSettings: UserSettings = {
  themeMode: 'dark',
  accentColor: 'emerald',
  fontFamily: 'Outfit',
  backgroundImage: 'none',
  backgroundOpacity: 0.15,
  dayRolloverHour: 6,
  showCountdown: true,
  enableFocusSounds: true,
  pomodoroFocusMins: 25,
  pomodoroBreakMins: 5,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      setThemeMode: (themeMode) =>
        set((state) => ({ settings: { ...state.settings, themeMode } })),

      setAccentColor: (accentColor) =>
        set((state) => ({ settings: { ...state.settings, accentColor } })),

      setFontFamily: (fontFamily) =>
        set((state) => ({ settings: { ...state.settings, fontFamily } })),

      setBackgroundImage: (backgroundImage) =>
        set((state) => ({ settings: { ...state.settings, backgroundImage } })),

      setBackgroundOpacity: (backgroundOpacity) =>
        set((state) => ({ settings: { ...state.settings, backgroundOpacity } })),

      setDayRolloverHour: (dayRolloverHour) =>
        set((state) => ({ settings: { ...state.settings, dayRolloverHour } })),

      setShowCountdown: (showCountdown) =>
        set((state) => ({ settings: { ...state.settings, showCountdown } })),

      setEnableFocusSounds: (enableFocusSounds) =>
        set((state) => ({ settings: { ...state.settings, enableFocusSounds } })),

      setPomodoroMins: (pomodoroFocusMins, pomodoroBreakMins) =>
        set((state) => ({
          settings: { ...state.settings, pomodoroFocusMins, pomodoroBreakMins },
        })),

      resetToDefaults: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'apextrack-settings-store',
    }
  )
);
