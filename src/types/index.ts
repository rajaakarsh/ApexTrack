export type ExamType =
  | 'JEE Advanced'
  | 'JEE Main'
  | 'NEET'
  | 'GATE CS'
  | 'GATE EC'
  | 'GATE ME'
  | 'UPSC CSE'
  | 'CAT'
  | 'SSC CGL'
  | 'Custom';

export type ThemeMode = 'dark' | 'slate' | 'oled' | 'light';
export type AccentColor = 'emerald' | 'indigo' | 'cyan' | 'amber' | 'rose' | 'violet';
export type FontFamily = 'Outfit' | 'Inter' | 'Plus Jakarta Sans' | 'JetBrains Mono';

export interface UserProfile {
  id: string;
  displayName: string;
  targetExam: string;
  targetYear: number;
  examDate: string; // YYYY-MM-DD
  avatarUrl?: string;
  peerCode: string;
  liveStatus: 'focusing' | 'idle' | 'offline';
  currentSubject?: string;
  streakCount: number;
  isGuest?: boolean;
  createdAt: string;
}

export interface UserSettings {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  backgroundImage: string;
  backgroundOpacity: number;
  dayRolloverHour: number; // e.g. 6 (6 AM)
  showCountdown: boolean;
  enableFocusSounds: boolean;
  pomodoroFocusMins: number;
  pomodoroBreakMins: number;
}

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  subject: string;
  priority: Priority;
  status: TaskStatus;
  date: string; // YYYY-MM-DD
  estimatedDuration: number; // in minutes
  linkedChapterId?: string;
  completedAt?: string;
  createdAt: string;
}

export type TargetCategory = 'weekly' | 'long_term';

export interface Target {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  category: TargetCategory;
  subject?: string;
  startDate: string; // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD
  currentProgress: number;
  maxProgress: number;
  isCompleted: boolean;
  createdAt: string;
}

export type TimerMode = 'flow' | 'pomodoro' | 'custom';

export interface FocusSession {
  id: string;
  userId?: string;
  subject: string;
  durationSeconds: number;
  mode: TimerMode;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO
  endTime: string; // ISO
  notes?: string;
  linkedTaskId?: string;
  qualityRating?: number; // 1 to 5
  createdAt: string;
}

export type ChapterProgressStatus = 'not_started' | 'learning' | 'revision' | 'completed';
export type ResourceType = 'book' | 'notes' | 'video' | 'website' | 'other';

export interface ChapterResource {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
}

export interface SyllabusChapter {
  id: string;
  name: string;
  status: ChapterProgressStatus;
  subtopics: string[];
  resources: ChapterResource[];
  notes?: string;
  lastRevisedAt?: string;
}

export interface SyllabusUnit {
  id: string;
  name: string;
  chapters: SyllabusChapter[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  units: SyllabusUnit[];
}

export interface MockSubjectScore {
  subject: string;
  marks: number;
  maxMarks: number;
}

export interface MockTest {
  id: string;
  userId?: string;
  testName: string;
  category: 'Full Length' | 'Sectional' | 'Chapterwise';
  date: string; // YYYY-MM-DD
  maxMarks: number;
  obtainedMarks: number;
  targetScore?: number;
  attemptedQuestions?: number;
  correctQuestions?: number;
  subjectScores: MockSubjectScore[];
  notes?: string;
  createdAt: string;
}

export type MistakeType = 'conceptual' | 'calculation' | 'silly_mistake' | 'formula' | 'time_management';

export interface ErrorLog {
  id: string;
  userId?: string;
  subject: string;
  chapter: string;
  topic?: string;
  mistakeType: MistakeType;
  description: string;
  correctiveAction?: string;
  linkedMockId?: string;
  date: string; // YYYY-MM-DD
  isMastered: boolean;
  createdAt: string;
}

export interface DailyQuestionLog {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  targetCount: number;
  solvedCount: number;
  subjectBreakdown: Record<string, number>;
}

export interface PeerConnection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  peerProfile: {
    id: string;
    displayName: string;
    targetExam: string;
    avatarUrl?: string;
    liveStatus: 'focusing' | 'idle' | 'offline';
    currentSubject?: string;
    todayFocusMinutes: number;
    tasksCompleted: number;
    totalTasks: number;
    questionsSolved: number;
  };
  createdAt: string;
}

export type GroupRole = 'owner' | 'admin' | 'member';

export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  targetExam: string;
  inviteCode: string;
  ownerId: string;
  userRole?: GroupRole;
  membersCount: number;
  members?: {
    id: string;
    displayName: string;
    role: GroupRole;
    avatarUrl?: string;
    todayFocusMinutes: number;
    weeklyFocusHours: number;
    streakCount: number;
    liveStatus: 'focusing' | 'idle' | 'offline';
  }[];
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  targetExam: string;
  todayStudySeconds: number;
  weeklyStudySeconds: number;
  questionsSolved: number;
  streakCount: number;
  liveStatus: 'focusing' | 'idle' | 'offline';
  isCurrentUser?: boolean;
}
