import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  CheckSquare,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { calculateDaysLeft } from '../exams/ExamCard';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    closeSearchModal,
    tasks,
    subjects,
    exams,
    dumps,
    setActiveTab,
    toggleTask,
    openDumpModal,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open search
        if (isSearchModalOpen) {
          closeSearchModal();
        } else {
          // Open
          const searchBtn = document.querySelector('[aria-label="Search"]') as HTMLButtonElement;
          searchBtn?.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, closeSearchModal]);

  useEffect(() => {
    if (isSearchModalOpen) {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        matchedTasks: [],
        matchedSubjects: [],
        matchedExams: [],
        matchedDumps: [],
        total: 0,
      };
    }

    const matchedTasks = tasks.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.tags?.some(tag => tag.toLowerCase().includes(q))
    );

    const matchedSubjects = subjects.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.code?.toLowerCase().includes(q) ||
        s.topics.some(tp => tp.name.toLowerCase().includes(q))
    );

    const matchedExams = exams.filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        e.notes?.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q) ||
        e.syllabusTopics?.some(st => st.toLowerCase().includes(q))
    );

    const matchedDumps = dumps.filter(
      d =>
        d.rawText.toLowerCase().includes(q) ||
        d.detectedTask.toLowerCase().includes(q) ||
        d.detectedKeywords.some(k => k.toLowerCase().includes(q))
    );

    const total =
      matchedTasks.length + matchedSubjects.length + matchedExams.length + matchedDumps.length;

    return { matchedTasks, matchedSubjects, matchedExams, matchedDumps, total };
  }, [query, tasks, subjects, exams, dumps]);

  const handleNavigate = (tab: 'home' | 'tasks' | 'subjects' | 'planner' | 'insights') => {
    setActiveTab(tab);
    closeSearchModal();
  };

  return (
    <Modal
      isOpen={isSearchModalOpen}
      onClose={closeSearchModal}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-500" />
          <span>Global Search</span>
        </div>
      }
      subtitle="Search tasks, subjects, syllabus topics, exams, and study dumps"
    >
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type keyword, subject (DBMS, DAA), topic (Normalization), or tag..."
            className="w-full pl-12 pr-10 py-3 text-sm sm:text-base rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results view */}
        {!query.trim() ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <p className="font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Quick keyboard search enabled
            </p>
            <p>Try searching for "DBMS", "Normalization", "Exam", or "Backtracking"</p>
          </div>
        ) : searchResults.total === 0 ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            No matches found for "{query}".
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Matched Tasks */}
            {searchResults.matchedTasks.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                  Tasks ({searchResults.matchedTasks.length})
                </span>
                <div className="space-y-1.5">
                  {searchResults.matchedTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => handleNavigate('tasks')}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="min-w-0 pr-3">
                        <strong className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {t.title}
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Due: {t.dueDate} • Priority: {t.priority}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Subjects */}
            {searchResults.matchedSubjects.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                  Subjects ({searchResults.matchedSubjects.length})
                </span>
                <div className="space-y-1.5">
                  {searchResults.matchedSubjects.map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleNavigate('subjects')}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        <div>
                          <strong className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                            {s.name} ({s.code || 'Course'})
                          </strong>
                          <span className="text-[11px] text-slate-500">
                            {s.topics.length} syllabus topics
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Exams */}
            {searchResults.matchedExams.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  Exams ({searchResults.matchedExams.length})
                </span>
                <div className="space-y-1.5">
                  {searchResults.matchedExams.map(ex => {
                    const countdown = calculateDaysLeft(ex.examDate);
                    return (
                      <div
                        key={ex.id}
                        onClick={() => handleNavigate('home')}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <strong className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                            {ex.title}
                          </strong>
                          <span className="text-[11px] text-slate-500">
                            Date: {ex.examDate} {ex.venue ? `• ${ex.venue}` : ''}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${countdown.statusColor}`}
                        >
                          {countdown.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Matched Dumps */}
            {searchResults.matchedDumps.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Study Dumps ({searchResults.matchedDumps.length})
                </span>
                <div className="space-y-1.5">
                  {searchResults.matchedDumps.map(d => (
                    <div
                      key={d.id}
                      onClick={() => {
                        closeSearchModal();
                        openDumpModal(d.rawText);
                      }}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <strong className="block text-xs font-semibold text-slate-900 dark:text-white truncate">
                          "{d.rawText}"
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          {d.detectedSubject || 'General'} • Priority: {d.detectedPriority}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
                        Open Dump
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
