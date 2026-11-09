export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskFilter = 'all' | 'pending' | 'completed' | 'high' | 'today';
export type NavTab = 'home' | 'tasks' | 'subjects' | 'planner' | 'insights';

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  completed: boolean;
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // Tailwind hex or preset color
  iconName?: string;
  credits?: number;
  topics: Topic[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subjectId?: string;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  tags?: string[];
  isFromDump?: boolean;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  examDate: string; // YYYY-MM-DD
  examTime?: string; // HH:mm
  venue?: string;
  notes?: string;
  totalMarks?: number;
  syllabusTopics?: string[];
}

export interface StudySession {
  id: string;
  subjectId: string;
  topicName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  notes?: string;
  completed: boolean;
}

export interface StudyDump {
  id: string;
  rawText: string;
  detectedTask: string;
  detectedSubject?: string;
  detectedPriority: TaskPriority;
  detectedDeadline?: string;
  detectedKeywords: string[];
  createdAt: string;
  convertedToTaskId?: string;
}

export interface UserProfile {
  name: string;
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string;
  activeDates: string[]; // YYYY-MM-DD array
}

export interface UserSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
}

export interface ParsedDumpResult {
  task: string;
  subjectName?: string;
  subjectId?: string;
  priority: TaskPriority;
  deadline?: string; // formatted text or YYYY-MM-DD
  formattedDate?: string;
  keywords: string[];
}
