import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { differenceInDays, differenceInWeeks, differenceInCalendarDays, eachDayOfInterval, isSunday, parseISO, startOfDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatTimerClock(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function generatePeerCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'APEX-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function calculateExamCountdown(targetDateStr: string) {
  try {
    const today = startOfDay(new Date());
    const target = startOfDay(parseISO(targetDateStr));

    if (isNaN(target.getTime())) {
      return { days: 0, weeks: 0, sundays: 0, sleeps: 0, isPast: false };
    }

    const diffDays = differenceInCalendarDays(target, today);
    if (diffDays <= 0) {
      return { days: 0, weeks: 0, sundays: 0, sleeps: 0, isPast: true };
    }

    const diffWeeks = differenceInWeeks(target, today);
    const daysInterval = eachDayOfInterval({ start: today, end: target });
    const sundays = daysInterval.filter(d => isSunday(d)).length;

    return {
      days: diffDays,
      weeks: diffWeeks,
      sundays: sundays,
      sleeps: diffDays, // 1 sleep per night remaining
      isPast: false
    };
  } catch {
    return { days: 0, weeks: 0, sundays: 0, sleeps: 0, isPast: false };
  }
}

export function calculateRealityCheckLoss(targetDateStr: string, wastedHoursPerDay: number): { lostHours: number; lostFullStudyDays: number } {
  const { days } = calculateExamCountdown(targetDateStr);
  const lostHours = Math.round(days * wastedHoursPerDay);
  const lostFullStudyDays = Math.round(lostHours / 8); // Assuming an 8-hour rigorous study day
  return { lostHours, lostFullStudyDays };
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
