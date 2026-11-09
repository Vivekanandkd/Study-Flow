import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  BookOpen,
  ArrowRight,
  CalendarDays,
  Check,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';
import { calculateDaysLeft } from '../exams/ExamCard';
import { TaskModal } from '../tasks/TaskModal';
import { SessionModal } from '../planner/SessionModal';
import { SubjectModal } from '../subjects/SubjectModal';
import { ExamModal } from '../exams/ExamModal';
import { StudyDumpVault } from '../dump/StudyDumpVault';

export const DashboardView: React.FC = () => {
  const {
    profile,
    tasks,
    subjects,
    exams,
    toggleTask,
    openDumpModal,
    setActiveTab,
  } = useApp();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Formatted date string
  const todayDate = new Date();
  const formattedDate = todayDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const todayStr = todayDate.toISOString().split('T')[0];

  // Tasks today
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const todayCompleted = todayTasks.filter(t => t.completed).length;
  const todayTotal = todayTasks.length;
  const todayPercent = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  // Closest upcoming exam
  const sortedExams = [...exams]
    .filter(e => e.examDate >= todayStr)
    .sort((a, b) => a.examDate.localeCompare(b.examDate));
  const nextExam = sortedExams[0];
  const nextExamCountdown = nextExam ? calculateDaysLeft(nextExam.examDate) : null;
  const nextExamSubject = nextExam ? subjects.find(s => s.id === nextExam.subjectId) : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Greeting & Date Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>{formattedDate}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {getGreeting()}, <span className="text-indigo-600 dark:text-indigo-400">{profile.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            "Turn study chaos into a clear plan."
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openDumpModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Study Dump</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSessionModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Plan Session</span>
          </button>
        </div>
      </div>

      {/* 2. Urgent Exam Banner (Display: "DBMS — 12 days left") */}
      {nextExam && nextExamCountdown && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm ${
            nextExamCountdown.isUrgent
              ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
              : 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-900/50'
          }`}
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`p-2.5 rounded-2xl shrink-0 ${
                nextExamCountdown.isUrgent
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Upcoming Exam Milestone
                </span>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${nextExamCountdown.statusColor}`}
                >
                  {nextExamCountdown.label}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {nextExamSubject?.name ? `${nextExamSubject.name} — ` : ''}{nextExam.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Exam on <strong>{nextExam.examDate}</strong> {nextExam.examTime ? `at ${nextExam.examTime}` : ''} {nextExam.venue ? `(${nextExam.venue})` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('planner')}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto shadow-xs"
          >
            <span>View in Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* 3. Key Metrics: Today's Progress, Streak, and Subject Quick Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Today's Progress Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Today's Progress
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {todayCompleted}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {todayTotal} {todayTotal === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {todayPercent === 100 && todayTotal > 0
                ? '🎉 All caught up for today!'
                : todayTotal === 0
                ? 'No deadlines scheduled today.'
                : `${todayTotal - todayCompleted} tasks remaining`}
            </p>
          </div>

          <CircularProgress
            value={todayPercent}
            size={90}
            strokeWidth={9}
            color="#4F46E5"
            subtext={`${todayCompleted}/${todayTotal}`}
          />
        </div>

        {/* Study Streak Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Study Momentum
              </span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
                  {profile.streakCount}
                </span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  Days Streak
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shadow-xs">
              <Flame className="w-7 h-7 fill-rose-500 animate-pulse" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Personal Best: <strong>{profile.longestStreak} days</strong></span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">Active Today 🔥</span>
          </div>
        </div>

        {/* Registered Subjects Overview */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Coursework
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {subjects.length}
                </span>
                <span className="text-sm font-semibold text-slate-400">Subjects</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(true)}
              className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
            >
              + Add
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
            {subjects.slice(0, 4).map(s => (
              <span
                key={s.id}
                onClick={() => setActiveTab('subjects')}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white cursor-pointer hover:opacity-90 transition-opacity shadow-xs"
                style={{ backgroundColor: s.color }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Prominent Study Dump Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/10 border border-amber-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-xl bg-amber-500 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Study Dump (Instant Local NLP)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Got messy thoughts or sudden syllabus panic? Dump it here!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Type naturally like: <em>"Complete DAA backtracking tomorrow"</em> or <em>"I need to complete DBMS normalization tomorrow"</em>.
              Our local keyword parser extracts the task, subject, priority, and deadline instantly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openDumpModal()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/30 active:scale-95 transition-all whitespace-nowrap"
          >
            Open Study Dump
          </button>
        </div>
      </div>

      {/* 5. Today's Tasks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Today's Tasks ({todayTasks.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tasks due today. Click checkbox to complete.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No tasks due today</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              You are all caught up for the day! Add an assignment or study ahead.
            </p>
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(true)}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              + Create Task
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map(task => {
              const subject = subjects.find(s => s.id === task.subjectId);
              return (
                <div
                  key={task.id}
                  className={`p-3.5 sm:p-4 rounded-3xl border flex items-center justify-between gap-3 transition-all ${
                    task.completed
                      ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                      : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                        task.completed
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-500'
                      }`}
                      aria-label="Toggle task"
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        {subject && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-xs"
                            style={{ backgroundColor: subject.color }}
                          >
                            {subject.name}
                          </span>
                        )}
                        {task.priority === 'high' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            High Priority
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-semibold truncate block ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </div>

                  {task.dueTime && (
                    <span className="text-xs text-slate-500 font-mono shrink-0">
                      {task.dueTime}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Study Dump Vault Preview */}
      <div className="pt-2">
        <StudyDumpVault />
      </div>

      {/* Modals */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <SessionModal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} />
      <SubjectModal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} />
      <ExamModal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} />
    </div>
  );
};
