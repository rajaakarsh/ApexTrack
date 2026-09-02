import { Task } from '../types';
import { downloadFile } from './utils';

export function exportTasksToICS(tasks: Task[], examName: string = 'Preparation') {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ApexTrack//StudyOS//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:ApexTrack - ${examName} Study Schedule`,
    'X-WR-TIMEZONE:UTC'
  ];

  tasks.forEach(task => {
    const cleanId = task.id.replace(/[^a-zA-Z0-9]/g, '');
    const cleanDate = task.date.replace(/-/g, '');
    const durationMins = task.estimatedDuration || 60;
    
    // Create standard ICS VEVENT
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:apextrack-${cleanId}@apextrack.study`);
    lines.push(`DTSTAMP:${cleanDate}T000000Z`);
    lines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
    lines.push(`SUMMARY:[${task.subject}] ${task.title}`);
    lines.push(`DESCRIPTION:Priority: ${task.priority.toUpperCase()}\\nStatus: ${task.status}\\nDuration: ${durationMins} mins\\n${task.description ? task.description.replace(/\n/g, '\\n') : ''}`);
    lines.push(`CATEGORIES:${task.subject},Study`);
    lines.push(`STATUS:${task.status === 'done' ? 'COMPLETED' : 'CONFIRMED'}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  const icsContent = lines.join('\r\n');
  downloadFile(icsContent, `ApexTrack_Study_Tasks_${new Date().toISOString().split('T')[0]}.ics`, 'text/calendar;charset=utf-8');
}
