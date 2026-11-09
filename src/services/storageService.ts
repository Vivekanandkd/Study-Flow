import { Exam, StudyDump, StudySession, Subject, Task, UserProfile, UserSettings } from '../models/types';
import { formatDateISO } from './nlpParserService';

const STORAGE_KEYS = {
  SUBJECTS: 'studyflow_subjects',
  TASKS: 'studyflow_tasks',
  EXAMS: 'studyflow_exams',
  SESSIONS: 'studyflow_sessions',
  DUMPS: 'studyflow_dumps',
  PROFILE: 'studyflow_profile',
  SETTINGS: 'studyflow_settings',
  INITIALIZED: 'studyflow_initialized_v1',
};

// Helper to get relative date string YYYY-MM-DD
function getRelativeDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return formatDateISO(d);
}

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-dbms',
    name: 'DBMS',
    code: 'CS-301',
    color: '#3B82F6', // Blue
    credits: 4,
    createdAt: new Date().toISOString(),
    topics: [
      { id: 'top-dbms-1', subjectId: 'sub-dbms', name: 'ER Diagrams & Relational Model', completed: true },
      { id: 'top-dbms-2', subjectId: 'sub-dbms', name: 'Relational Algebra & Calculus', completed: true },
      { id: 'top-dbms-3', subjectId: 'sub-dbms', name: 'Complex SQL Queries & Joins', completed: true },
      { id: 'top-dbms-4', subjectId: 'sub-dbms', name: 'Normalization (1NF, 2NF, 3NF, BCNF)', completed: false },
      { id: 'top-dbms-5', subjectId: 'sub-dbms', name: 'Transactions & ACID Properties', completed: false },
      { id: 'top-dbms-6', subjectId: 'sub-dbms', name: 'Indexing & B+ Trees', completed: false },
    ],
  },
  {
    id: 'sub-java',
    name: 'Java',
    code: 'CS-302',
    color: '#F97316', // Orange
    credits: 4,
    createdAt: new Date().toISOString(),
    topics: [
      { id: 'top-java-1', subjectId: 'sub-java', name: 'OOP Fundamentals & Classes', completed: true },
      { id: 'top-java-2', subjectId: 'sub-java', name: 'Inheritance & Interfaces', completed: true },
      { id: 'top-java-3', subjectId: 'sub-java', name: 'Exception Handling & Custom Exceptions', completed: true },
      { id: 'top-java-4', subjectId: 'sub-java', name: 'Collections Framework (List, Set, Map)', completed: false },
      { id: 'top-java-5', subjectId: 'sub-java', name: 'Multithreading & Synchronization', completed: false },
      { id: 'top-java-6', subjectId: 'sub-java', name: 'Streams API & Functional Lambdas', completed: false },
    ],
  },
  {
    id: 'sub-daa',
    name: 'DAA',
    code: 'CS-303',
    color: '#8B5CF6', // Purple
    credits: 4,
    createdAt: new Date().toISOString(),
    topics: [
      { id: 'top-daa-1', subjectId: 'sub-daa', name: 'Asymptotic Notation & Recurrences', completed: true },
      { id: 'top-daa-2', subjectId: 'sub-daa', name: 'Divide and Conquer (Merge/Quick Sort)', completed: true },
      { id: 'top-daa-3', subjectId: 'sub-daa', name: 'Greedy Algorithms (Huffman, MST)', completed: true },
      { id: 'top-daa-4', subjectId: 'sub-daa', name: 'Dynamic Programming (0/1 Knapsack, LCS)', completed: false },
      { id: 'top-daa-5', subjectId: 'sub-daa', name: 'Backtracking (N-Queens, Graph Coloring)', completed: false },
      { id: 'top-daa-6', subjectId: 'sub-daa', name: 'NP-Completeness & Approximation', completed: false },
    ],
  },
  {
    id: 'sub-ds',
    name: 'Data Structures',
    code: 'CS-201',
    color: '#10B981', // Emerald
    credits: 3,
    createdAt: new Date().toISOString(),
    topics: [
      { id: 'top-ds-1', subjectId: 'sub-ds', name: 'Arrays & Dynamic Arrays', completed: true },
      { id: 'top-ds-2', subjectId: 'sub-ds', name: 'Singly & Doubly Linked Lists', completed: true },
      { id: 'top-ds-3', subjectId: 'sub-ds', name: 'Stacks, Queues & Monotonic Queues', completed: true },
      { id: 'top-ds-4', subjectId: 'sub-ds', name: 'Binary Search Trees & AVL Trees', completed: true },
      { id: 'top-ds-5', subjectId: 'sub-ds', name: 'Heaps & Priority Queues', completed: false },
      { id: 'top-ds-6', subjectId: 'sub-ds', name: 'Graph Traversals (BFS, DFS, Dijkstra)', completed: false },
    ],
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Complete DBMS Normalization 3NF & BCNF practice questions',
    description: 'Solve textbook exercises 14.1 through 14.18 before seminar discussion.',
    subjectId: 'sub-dbms',
    priority: 'high',
    dueDate: getRelativeDate(0), // Today!
    dueTime: '17:00',
    completed: false,
    createdAt: new Date().toISOString(),
    tags: ['DBMS', 'Normalization', 'Practice'],
  },
  {
    id: 'task-2',
    title: 'DAA Backtracking problem set: N-Queens & Hamiltonian Cycle',
    description: 'Implement recursive solution with state space tree visualization.',
    subjectId: 'sub-daa',
    priority: 'high',
    dueDate: getRelativeDate(0), // Today!
    dueTime: '21:00',
    completed: false,
    createdAt: new Date().toISOString(),
    tags: ['DAA', 'Backtracking'],
  },
  {
    id: 'task-3',
    title: 'Implement Java Multithreading Producer-Consumer with BlockingQueue',
    description: 'Lab 5 assignment: handle synchronization locks and wait/notify conditions.',
    subjectId: 'sub-java',
    priority: 'medium',
    dueDate: getRelativeDate(1), // Tomorrow
    dueTime: '18:00',
    completed: false,
    createdAt: new Date().toISOString(),
    tags: ['Java', 'Multithreading', 'Lab'],
  },
  {
    id: 'task-4',
    title: 'Revise Dijkstra and Bellman-Ford shortest path algorithms',
    description: 'Review time complexities and negative cycle detection criteria.',
    subjectId: 'sub-ds',
    priority: 'medium',
    dueDate: getRelativeDate(2),
    dueTime: '15:30',
    completed: false,
    createdAt: new Date().toISOString(),
    tags: ['Data Structures', 'Graphs'],
  },
  {
    id: 'task-5',
    title: 'Prepare SQL Indexing & B+ Trees presentation slides',
    description: 'Group presentation on clustered vs non-clustered indexing structures.',
    subjectId: 'sub-dbms',
    priority: 'low',
    dueDate: getRelativeDate(4),
    completed: false,
    createdAt: new Date().toISOString(),
    tags: ['DBMS', 'Presentation'],
  },
  {
    id: 'task-6',
    title: 'Submit Java Collections framework comparison report',
    description: 'Benchmark ArrayList vs LinkedList vs HashMap lookup times.',
    subjectId: 'sub-java',
    priority: 'medium',
    dueDate: getRelativeDate(-1),
    completed: true,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    tags: ['Java', 'Report'],
  },
  {
    id: 'task-7',
    title: 'DAA Divide & Conquer Merge Sort master theorem proofs',
    description: 'Write out the 3 cases and recurrence tree expansion in notes.',
    subjectId: 'sub-daa',
    priority: 'high',
    dueDate: getRelativeDate(-1),
    completed: true,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    tags: ['DAA', 'Proof'],
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    subjectId: 'sub-dbms',
    title: 'DBMS End-Semester Theory Exam',
    examDate: getRelativeDate(12), // 12 days left! Matching user prompt
    examTime: '10:00 AM',
    venue: 'Hall 402, CS Block',
    notes: 'Covers Units 1 to 5: ER modeling, SQL, Normalization, ACID, and Concurrency control.',
    totalMarks: 100,
    syllabusTopics: ['ER Models', 'Relational Algebra', 'SQL Queries', 'Normalization', 'Indexing'],
  },
  {
    id: 'exam-2',
    subjectId: 'sub-daa',
    title: 'DAA Mid-Term Assessment',
    examDate: getRelativeDate(5), // 5 days left
    examTime: '02:00 PM',
    venue: 'Auditorium C',
    notes: 'Focus on recurrence solving, greedy algorithms, and 0/1 knapsack dynamic programming.',
    totalMarks: 50,
    syllabusTopics: ['Asymptotic Analysis', 'Divide & Conquer', 'Greedy Techniques', 'Dynamic Programming'],
  },
  {
    id: 'exam-3',
    subjectId: 'sub-java',
    title: 'Java OOP Lab Practical & Viva',
    examDate: getRelativeDate(19),
    examTime: '09:00 AM',
    venue: 'Computer Lab 3',
    notes: 'Coding exam on Collections, Generics, and Multi-threading followed by 10 min viva.',
    totalMarks: 50,
    syllabusTopics: ['OOP Design', 'Collections', 'Exceptions', 'Threads & Locks'],
  },
];

export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 'sess-1',
    subjectId: 'sub-dbms',
    topicName: 'Normalization (3NF to BCNF decompositions)',
    date: getRelativeDate(0), // Today
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    notes: 'Focus on finding candidate keys and testing for lossless join decomposition.',
    completed: false,
  },
  {
    id: 'sess-2',
    subjectId: 'sub-daa',
    topicName: 'Dynamic Programming: Longest Common Subsequence',
    date: getRelativeDate(0), // Today
    startTime: '19:00',
    endTime: '20:30',
    durationMinutes: 90,
    notes: 'Draw 2D DP matrix and reconstruct path.',
    completed: false,
  },
  {
    id: 'sess-3',
    subjectId: 'sub-ds',
    topicName: 'Graph BFS & Dijkstra implementation',
    date: getRelativeDate(-1),
    startTime: '16:00',
    endTime: '17:15',
    durationMinutes: 75,
    notes: 'Tested on competitive programming platform with 100% test cases passing.',
    completed: true,
  },
];

export const INITIAL_DUMPS: StudyDump[] = [
  {
    id: 'dump-1',
    rawText: 'Complete DAA backtracking tomorrow',
    detectedTask: 'Complete DAA backtracking',
    detectedSubject: 'DAA',
    detectedPriority: 'medium',
    detectedDeadline: 'Tomorrow',
    detectedKeywords: ['backtracking'],
    createdAt: new Date().toISOString(),
    convertedToTaskId: 'task-2',
  },
  {
    id: 'dump-2',
    rawText: 'I need to complete DBMS normalization tomorrow',
    detectedTask: 'Complete DBMS normalization',
    detectedSubject: 'DBMS',
    detectedPriority: 'medium',
    detectedDeadline: 'Tomorrow',
    detectedKeywords: ['normalization'],
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  streakCount: 5,
  longestStreak: 14,
  lastActiveDate: getRelativeDate(0),
  activeDates: [
    getRelativeDate(-4),
    getRelativeDate(-3),
    getRelativeDate(-2),
    getRelativeDate(-1),
    getRelativeDate(0),
  ],
};

export const INITIAL_SETTINGS: UserSettings = {
  theme: 'light',
  soundEnabled: true,
};

// Storage helper functions
export const storageService = {
  initializeIfNeeded(): void {
    if (typeof window === 'undefined') return;
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      this.resetToDefaults();
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  },

  resetToDefaults(): void {
    this.saveSubjects(INITIAL_SUBJECTS);
    this.saveTasks(INITIAL_TASKS);
    this.saveExams(INITIAL_EXAMS);
    this.saveSessions(INITIAL_SESSIONS);
    this.saveDumps(INITIAL_DUMPS);
    this.saveProfile(INITIAL_PROFILE);
    this.saveSettings(INITIAL_SETTINGS);
  },

  // Subjects
  getSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  },
  saveSubjects(subjects: Subject[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  // Tasks
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },
  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Exams
  getExams(): Exam[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return data ? JSON.parse(data) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  },
  saveExams(exams: Exam[]): void {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  },

  // Sessions
  getSessions(): StudySession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  },
  saveSessions(sessions: StudySession[]): void {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  // Dumps
  getDumps(): StudyDump[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DUMPS);
      return data ? JSON.parse(data) : INITIAL_DUMPS;
    } catch {
      return INITIAL_DUMPS;
    }
  },
  saveDumps(dumps: StudyDump[]): void {
    localStorage.setItem(STORAGE_KEYS.DUMPS, JSON.stringify(dumps));
  },

  // Profile
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  },
  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  // Settings
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
      const themeFromHtml = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      return { ...INITIAL_SETTINGS, theme: themeFromHtml };
    } catch {
      return INITIAL_SETTINGS;
    }
  },
  saveSettings(settings: UserSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    localStorage.setItem('studyflow_theme', settings.theme);
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Clear completed tasks
  clearCompletedTasks(): void {
    const tasks = this.getTasks().filter(t => !t.completed);
    this.saveTasks(tasks);
  },

  // Clear all data
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.DUMPS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  },

  // Export / Import
  exportAllData(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      subjects: this.getSubjects(),
      tasks: this.getTasks(),
      exams: this.getExams(),
      sessions: this.getSessions(),
      dumps: this.getDumps(),
      profile: this.getProfile(),
      settings: this.getSettings(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.subjects)) this.saveSubjects(data.subjects);
      if (Array.isArray(data.tasks)) this.saveTasks(data.tasks);
      if (Array.isArray(data.exams)) this.saveExams(data.exams);
      if (Array.isArray(data.sessions)) this.saveSessions(data.sessions);
      if (Array.isArray(data.dumps)) this.saveDumps(data.dumps);
      if (data.profile) this.saveProfile(data.profile);
      if (data.settings) this.saveSettings(data.settings);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },
};
