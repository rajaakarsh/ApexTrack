import { supabase } from '../lib/supabase';
import { UserSettings } from '../types';

export const settingsService = {
  async fetchSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        themeMode: data.theme_mode,
        accentColor: data.accent_color,
        fontFamily: data.font_family,
        backgroundImage: data.background_image || 'none',
        backgroundOpacity: Number(data.background_opacity) || 0.15,
        dayRolloverHour: Number(data.day_rollover_hour) || 6,
        showCountdown: Boolean(data.show_countdown),
        enableFocusSounds: Boolean(data.enable_focus_sounds),
        pomodoroFocusMins: Number(data.pomodoro_focus_mins) || 25,
        pomodoroBreakMins: Number(data.pomodoro_break_mins) || 5,
      };
    } catch (err) {
      console.warn('Error fetching settings from Supabase:', err);
      return null;
    }
  },

  async saveSettings(userId: string, settings: UserSettings): Promise<void> {
    try {
      await supabase.from('user_settings').upsert({
        user_id: userId,
        theme_mode: settings.themeMode,
        accent_color: settings.accentColor,
        font_family: settings.fontFamily,
        background_image: settings.backgroundImage,
        background_opacity: settings.backgroundOpacity,
        day_rollover_hour: settings.dayRolloverHour,
        show_countdown: settings.showCountdown,
        enable_focus_sounds: settings.enableFocusSounds,
        pomodoro_focus_mins: settings.pomodoroFocusMins,
        pomodoro_break_mins: settings.pomodoroBreakMins,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Error saving settings in Supabase:', err);
    }
  },
};
