import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Exam,
  NavTab,
  ParsedDumpResult,
  StudyDump,
  StudySession,
  Subject,
  Task,
  Topic,
  UserProfile,
  UserSettings,
} from '../models/types';
import { formatDateISO } from '../services/nlpParserService';
import { storageService } from '../services/storageService';
import { fireConfetti, playChimeSound } from '../utils/audioAndConfetti';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  // State
  subjects: Subject[];
  tasks: Task[];
  exams: Exam[];
  sessions: StudySession[];
  dumps: StudyDump[];
  profile: UserProfile;
  settings: UserSettings;
  // Modals & Panels
  isDumpModalOpen: boolean;
  openDumpModal: (initialText?: string) => void;
  closeDumpModal: () => void;
  dumpInitialText: string;
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  // Toasts
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  // Tasks CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  // Subjects CRUD
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'topics'>) => Subject;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  addTopic: (subjectId: string, topicName: string) => void;
  deleteTopic: (subjectId: string, topicId: string) => void;
  toggleTopic: (subjectId: string, topicId: string) => void;
  // Exams CRUD
  addExam: (exam: Omit<Exam, 'id'>) => Exam;
  updateExam: (exam: Exam) => void;
  deleteExam: (id: string) => void;
  // Sessions CRUD
  addSession: (session: Omit<StudySession, 'id' | 'completed'>) => StudySession;
  updateSession: (session: StudySession) => void;
  deleteSession: (id: string) => void;
  toggleSession: (id: string) => void;
  // Dumps
  saveDumpNote: (rawText: string, parsed: ParsedDumpResult) => StudyDump;
  convertDumpToTask: (dumpId: string) => Task | null;
  deleteDump: (id: string) => void;
  // Profile & Settings
  updateProfileName: (name: string) => void;
  toggleTheme: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  clearCompletedTasks: () => void;
  resetToDefaults: () => void;
  clearAllData: () => void;
  // Analytics helpers
  getSubjectProgress: (subjectId: string) => { topicProgress: number; taskProgress: number; overallProgress: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [dumps, setDumps] = useState<StudyDump[]>([]);
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [settings, setSettings] = useState<UserSettings>(storageService.getSettings());

  // Modals
  const [isDumpModalOpen, setIsDumpModalOpen] = useState(false);
  const [dumpInitialText, setDumpInitialText] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Initialize storage once on mount
  useEffect(() => {
    storageService.initializeIfNeeded();
    setSubjects(storageService.getSubjects());
    setTasks(storageService.getTasks());
    setExams(storageService.getExams());
    setSessions(storageService.getSessions());
    setDumps(storageService.getDumps());
    setProfile(storageService.getProfile());
    const initialSettings = storageService.getSettings();
    setSettings(initialSettings);

    // Apply theme
    if (initialSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(current => (current?.id === id ? null : current));
    }, 3200);
  };

  // Streak update helper
  const checkAndUpdateStreak = () => {
    const today = formatDateISO(new Date());
    setProfile(prev => {
      const activeDates = new Set(prev.activeDates || []);
      const wasActiveToday = activeDates.has(today);

      if (!wasActiveToday) {
        activeDates.add(today);
        const newStreak = prev.streakCount + 1;
        const newLongest = Math.max(newStreak, prev.longestStreak);
        const updated: UserProfile = {
          ...prev,
          streakCount: newStreak,
          longestStreak: newLongest,
          lastActiveDate: today,
          activeDates: Array.from(activeDates),
        };
        storageService.saveProfile(updated);
        showToast(`🔥 Streak continued! ${newStreak} days on fire!`, 'success');
        return updated;
      }
      return prev;
    });
  };

  // TASKS
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    storageService.saveTasks(updated);
    showToast(`Task "${newTask.title}" added!`, 'success');
    return newTask;
  };

  const updateTask = (updatedTask: Task) => {
    const updated = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updated);
    storageService.saveTasks(updated);
    showToast('Task updated', 'info');
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    storageService.saveTasks(updated);
    showToast('Task deleted', 'info');
  };

  const toggleTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;

    const willBeCompleted = !target.completed;
    const updated = tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    setTasks(updated);
    storageService.saveTasks(updated);

    if (willBeCompleted) {
      if (settings.soundEnabled) playChimeSound();
      fireConfetti();
      checkAndUpdateStreak();
      showToast('Task marked complete! 🎯', 'success');
    } else {
      showToast('Task marked incomplete', 'info');
    }
  };

  // SUBJECTS
  const addSubject = (subjectData: Omit<Subject, 'id' | 'createdAt' | 'topics'>): Subject => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      topics: [],
    };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    storageService.saveSubjects(updated);
    showToast(`Subject "${newSubject.name}" created`, 'success');
    return newSubject;
  };

  const updateSubject = (updatedSubject: Subject) => {
    const updated = subjects.map(s => (s.id === updatedSubject.id ? updatedSubject : s));
    setSubjects(updated);
    storageService.saveSubjects(updated);
    showToast('Subject updated', 'info');
  };

  const deleteSubject = (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    storageService.saveSubjects(updated);
    // Unassign tasks from this subject
    const updatedTasks = tasks.map(t => (t.subjectId === id ? { ...t, subjectId: undefined } : t));
    setTasks(updatedTasks);
    storageService.saveTasks(updatedTasks);
    showToast('Subject removed', 'info');
  };

  const addTopic = (subjectId: string, topicName: string) => {
    if (!topicName.trim()) return;
    const updated = subjects.map(s => {
      if (s.id === subjectId) {
        const newTopic: Topic = {
          id: `top-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          subjectId,
          name: topicName.trim(),
          completed: false,
        };
        return {
          ...s,
          topics: [...s.topics, newTopic],
        };
      }
      return s;
    });
    setSubjects(updated);
    storageService.saveSubjects(updated);
    showToast('Topic added', 'success');
  };

  const deleteTopic = (subjectId: string, topicId: string) => {
    const updated = subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          topics: s.topics.filter(tp => tp.id !== topicId),
        };
      }
      return s;
    });
    setSubjects(updated);
    storageService.saveSubjects(updated);
  };

  const toggleTopic = (subjectId: string, topicId: string) => {
    let completedNow = false;
    const updated = subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          topics: s.topics.map(tp => {
            if (tp.id === topicId) {
              completedNow = !tp.completed;
              return { ...tp, completed: completedNow };
            }
            return tp;
          }),
        };
      }
      return s;
    });
    setSubjects(updated);
    storageService.saveSubjects(updated);
    if (completedNow) {
      if (settings.soundEnabled) playChimeSound();
      fireConfetti();
      checkAndUpdateStreak();
      showToast('Topic mastered! 📚', 'success');
    }
  };

  // EXAMS
  const addExam = (examData: Omit<Exam, 'id'>): Exam => {
    const newExam: Exam = {
      ...examData,
      id: `exam-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...exams, newExam];
    setExams(updated);
    storageService.saveExams(updated);
    showToast(`Exam "${newExam.title}" scheduled!`, 'success');
    return newExam;
  };

  const updateExam = (updatedExam: Exam) => {
    const updated = exams.map(e => (e.id === updatedExam.id ? updatedExam : e));
    setExams(updated);
    storageService.saveExams(updated);
    showToast('Exam updated', 'info');
  };

  const deleteExam = (id: string) => {
    const updated = exams.filter(e => e.id !== id);
    setExams(updated);
    storageService.saveExams(updated);
    showToast('Exam removed', 'info');
  };

  // SESSIONS
  const addSession = (sessionData: Omit<StudySession, 'id' | 'completed'>): StudySession => {
    const newSession: StudySession = {
      ...sessionData,
      id: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      completed: false,
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    storageService.saveSessions(updated);
    showToast('Study session planned!', 'success');
    return newSession;
  };

  const updateSession = (updatedSession: StudySession) => {
    const updated = sessions.map(s => (s.id === updatedSession.id ? updatedSession : s));
    setSessions(updated);
    storageService.saveSessions(updated);
    showToast('Session updated', 'info');
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    storageService.saveSessions(updated);
    showToast('Session removed', 'info');
  };

  const toggleSession = (id: string) => {
    const target = sessions.find(s => s.id === id);
    if (!target) return;
    const willBeCompleted = !target.completed;
    const updated = sessions.map(s => (s.id === id ? { ...s, completed: willBeCompleted } : s));
    setSessions(updated);
    storageService.saveSessions(updated);
    if (willBeCompleted) {
      if (settings.soundEnabled) playChimeSound();
      fireConfetti();
      checkAndUpdateStreak();
      showToast('Study session completed! Great focus! ⚡', 'success');
    }
  };

  // STUDY DUMP
  const saveDumpNote = (rawText: string, parsed: ParsedDumpResult): StudyDump => {
    const newDump: StudyDump = {
      id: `dump-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      rawText,
      detectedTask: parsed.task || rawText,
      detectedSubject: parsed.subjectName,
      detectedPriority: parsed.priority,
      detectedDeadline: parsed.deadline,
      detectedKeywords: parsed.keywords,
      createdAt: new Date().toISOString(),
    };
    const updated = [newDump, ...dumps];
    setDumps(updated);
    storageService.saveDumps(updated);
    showToast('Saved to Study Dump vault! 📝', 'success');
    return newDump;
  };

  const convertDumpToTask = (dumpId: string): Task | null => {
    const targetDump = dumps.find(d => d.id === dumpId);
    if (!targetDump) return null;

    let subId = subjects.find(s => s.name.toLowerCase() === targetDump.detectedSubject?.toLowerCase())?.id;
    if (!subId && targetDump.detectedSubject) {
      // Create subject automatically if it doesn't exist
      const createdSub = addSubject({
        name: targetDump.detectedSubject,
        code: targetDump.detectedSubject.slice(0, 4).toUpperCase(),
        color: '#4F46E5',
      });
      subId = createdSub.id;
    }

    const newTask = addTask({
      title: targetDump.detectedTask,
      subjectId: subId,
      priority: targetDump.detectedPriority,
      dueDate: formatDateISO(new Date(Date.now() + 86400000)), // tomorrow default
      tags: targetDump.detectedKeywords,
      isFromDump: true,
    });

    const updatedDumps = dumps.map(d => (d.id === dumpId ? { ...d, convertedToTaskId: newTask.id } : d));
    setDumps(updatedDumps);
    storageService.saveDumps(updatedDumps);
    showToast('Converted dump into active task! 🚀', 'success');
    return newTask;
  };

  const deleteDump = (id: string) => {
    const updated = dumps.filter(d => d.id !== id);
    setDumps(updated);
    storageService.saveDumps(updated);
    showToast('Dump note deleted', 'info');
  };

  // PROFILE & SETTINGS
  const updateProfileName = (name: string) => {
    const updated = { ...profile, name };
    setProfile(updated);
    storageService.saveProfile(updated);
    showToast('Profile updated', 'success');
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...settings, theme: newTheme as 'light' | 'dark' };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  const setSoundEnabled = (enabled: boolean) => {
    const updated = { ...settings, soundEnabled: enabled };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  const clearCompletedTasks = () => {
    const remaining = tasks.filter(t => !t.completed);
    setTasks(remaining);
    storageService.saveTasks(remaining);
    showToast('Cleaned up completed tasks', 'info');
  };

  const resetToDefaults = () => {
    storageService.resetToDefaults();
    setSubjects(storageService.getSubjects());
    setTasks(storageService.getTasks());
    setExams(storageService.getExams());
    setSessions(storageService.getSessions());
    setDumps(storageService.getDumps());
    setProfile(storageService.getProfile());
    setSettings(storageService.getSettings());
    showToast('Reset to demo sample data', 'info');
  };

  const clearAllData = () => {
    storageService.clearAllData();
    setSubjects([]);
    setTasks([]);
    setExams([]);
    setSessions([]);
    setDumps([]);
    setProfile({
      name: 'Student',
      streakCount: 0,
      longestStreak: 0,
      lastActiveDate: formatDateISO(new Date()),
      activeDates: [],
    });
    showToast('All app data wiped', 'warning');
  };

  // Progress calculator
  const getSubjectProgress = (subjectId: string) => {
    const sub = subjects.find(s => s.id === subjectId);
    if (!sub) return { topicProgress: 0, taskProgress: 0, overallProgress: 0 };

    const topicTotal = sub.topics.length;
    const topicDone = sub.topics.filter(t => t.completed).length;
    const topicProgress = topicTotal > 0 ? Math.round((topicDone / topicTotal) * 100) : 0;

    const subTasks = tasks.filter(t => t.subjectId === subjectId);
    const taskTotal = subTasks.length;
    const taskDone = subTasks.filter(t => t.completed).length;
    const taskProgress = taskTotal > 0 ? Math.round((taskDone / taskTotal) * 100) : 0;

    let overallProgress = 0;
    if (topicTotal > 0 && taskTotal > 0) {
      overallProgress = Math.round(topicProgress * 0.6 + taskProgress * 0.4);
    } else if (topicTotal > 0) {
      overallProgress = topicProgress;
    } else if (taskTotal > 0) {
      overallProgress = taskProgress;
    }

    return { topicProgress, taskProgress, overallProgress };
  };

  const openDumpModal = (initialText = '') => {
    setDumpInitialText(initialText);
    setIsDumpModalOpen(true);
  };

  const closeDumpModal = () => {
    setIsDumpModalOpen(false);
    setDumpInitialText('');
  };

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        subjects,
        tasks,
        exams,
        sessions,
        dumps,
        profile,
        settings,
        isDumpModalOpen,
        openDumpModal,
        closeDumpModal,
        dumpInitialText,
        isSearchModalOpen,
        openSearchModal,
        closeSearchModal,
        isSettingsModalOpen,
        openSettingsModal,
        closeSettingsModal,
        toast,
        showToast,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        addSubject,
        updateSubject,
        deleteSubject,
        addTopic,
        deleteTopic,
        toggleTopic,
        addExam,
        updateExam,
        deleteExam,
        addSession,
        updateSession,
        deleteSession,
        toggleSession,
        saveDumpNote,
        convertDumpToTask,
        deleteDump,
        updateProfileName,
        toggleTheme,
        setSoundEnabled,
        clearCompletedTasks,
        resetToDefaults,
        clearAllData,
        getSubjectProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
