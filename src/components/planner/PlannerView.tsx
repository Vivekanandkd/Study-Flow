import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Check,
  Edit3,
  Trash2,
  CalendarDays,
} from 'lucide-react';
import { StudySession, Task } from '../../models/types';
import { useApp } from '../../context/AppContext';
import { PomodoroTimer } from './PomodoroTimer';
import { SessionModal } from './SessionModal';
import { TaskModal } from '../tasks/TaskModal';
import { ExamModal } from '../exams/ExamModal';
import { calculateDaysLeft } from '../exams/ExamCard';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { EmptyState } from '../common/EmptyState';

export const PlannerView: React.FC = () => {
  const {
    sessions,
    tasks,
    exams,
    subjects,
    toggleSession,
    deleteSession,
    toggleTask,
  } = useApp();

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Group tasks
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const upcomingTasks = tasks.filter(t => t.dueDate > todayStr);

  // Group sessions
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const upcomingSessions = sessions.filter(s => s.date > todayStr);

  // Sorted exams
  const upcomingExams = [...exams].sort((a, b) => a.examDate.localeCompare(b.examDate));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Study Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize daily focus blocks, upcoming coursework, and exam milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditingSession(null);
              setIsSessionModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Plan Session</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Pomodoro Focus Timer & Exam Countdown Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <PomodoroTimer />
        </div>

        {/* Upcoming Exams Countdown Mini-Widget */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-rose-500" />
                Exam Countdown
              </h3>
              <button
                type="button"
                onClick={() => setIsExamModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                + Add
              </button>
            </div>

            {upcomingExams.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No upcoming exams scheduled.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {upcomingExams.slice(0, 3).map(exam => {
                  const subject = subjects.find(s => s.id === exam.subjectId);
                  const countdown = calculateDaysLeft(exam.examDate);
                  return (
                    <div
                      key={exam.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <strong className="block text-slate-900 dark:text-white font-bold truncate">
                          {subject?.name ? `${subject.name} — ` : ''}{exam.title}
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {exam.examDate}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${countdown.statusColor}`}
                      >
                        {countdown.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 text-center">
            Stay ahead of exam schedules with daily revision
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Study Sessions vs Today/Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Scheduled Study Sessions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Study Sessions
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingSession(null);
                setIsSessionModalOpen(true);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
            >
              + Add Session
            </button>
          </div>

          {/* Today's Sessions */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Today's Schedule ({todaySessions.length})
            </h3>

            {todaySessions.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                No study sessions planned for today. Click "+ Add Session" to book a study block.
              </p>
            ) : (
              <div className="space-y-2.5">
                {todaySessions.map(session => {
                  const subject = subjects.find(s => s.id === session.subjectId);
                  return (
                    <motion.div
                      key={session.id}
                      layout
                      className={`p-4 rounded-3xl border transition-all ${
                        session.completed
                          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => toggleSession(session.id)}
                            className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                              session.completed
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-500'
                            }`}
                            aria-label="Toggle complete"
                          >
                            {session.completed && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {subject && (
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-xs"
                                  style={{ backgroundColor: subject.color }}
                                >
                                  {subject.name}
                                </span>
                              )}
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {session.startTime} - {session.endTime} ({session.durationMinutes}m)
                              </span>
                            </div>
                            <h4
                              className={`text-sm font-bold ${
                                session.completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {session.topicName}
                            </h4>
                            {session.notes && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                {session.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSession(session);
                              setIsSessionModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingSessionId(session.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Upcoming Sessions ({upcomingSessions.length})
              </h3>
              <div className="space-y-2">
                {upcomingSessions.map(session => {
                  const subject = subjects.find(s => s.id === session.subjectId);
                  return (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        {subject && (
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                        )}
                        <div>
                          <strong className="text-slate-900 dark:text-white block font-semibold">
                            {session.topicName}
                          </strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {session.date} • {session.startTime} ({session.durationMinutes} mins)
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeletingSessionId(session.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Today's Tasks & Upcoming Tasks */}
        <div className="space-y-5">
          {/* Today's Tasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Today's Tasks ({todayTasks.length})
              </h2>
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
              >
                + Add Task
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500 font-medium">No tasks due today. All caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.map(t => {
                  const subject = subjects.find(s => s.id === t.subjectId);
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(t.id)}
                        className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                            t.completed
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                        >
                          {t.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`truncate font-medium ${
                            t.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {t.title}
                        </span>
                      </button>
                      {subject && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded text-white shrink-0 ml-2"
                          style={{ backgroundColor: subject.color }}
                        >
                          {subject.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Tasks */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-amber-500" />
              Upcoming Tasks ({upcomingTasks.length})
            </h2>

            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                No future deadlines set.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {upcomingTasks.map(t => {
                  const subject = subjects.find(s => s.id === t.subjectId);
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(t.id)}
                        className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                            t.completed
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                        >
                          {t.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`truncate font-medium ${
                            t.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {t.title}
                        </span>
                      </button>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {t.dueDate}
                        </span>
                        {subject && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: subject.color }}
                          >
                            {subject.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Modal */}
      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => {
          setIsSessionModalOpen(false);
          setEditingSession(null);
        }}
        sessionToEdit={editingSession}
      />

      {/* Quick Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      {/* Quick Exam Modal */}
      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(deletingSessionId)}
        onClose={() => setDeletingSessionId(null)}
        onConfirm={() => {
          if (deletingSessionId) deleteSession(deletingSessionId);
        }}
        title="Delete Session"
        message="Are you sure you want to remove this study block?"
      />
    </div>
  );
};
