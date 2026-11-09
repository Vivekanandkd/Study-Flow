import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Tag, Trash2, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../common/EmptyState';
import { PriorityBadge } from '../common/Badge';

export const StudyDumpVault: React.FC = () => {
  const { dumps, convertDumpToTask, deleteDump, openDumpModal } = useApp();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Study Dump Vault
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quickly captured thoughts, syllabus topics, and notes ready to convert into tasks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openDumpModal()}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
        >
          + New Dump
        </button>
      </div>

      {dumps.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-8 h-8 text-amber-500" />}
          title="No Study Dumps Yet"
          description="Dump messy syllabus topics, exam dates, or sudden reminders. We'll extract actionable tasks automatically!"
          action={{
            label: 'Try Study Dump',
            onClick: () => openDumpModal(),
            icon: <Sparkles className="w-4 h-4" />,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <AnimatePresence>
            {dumps.map(dump => {
              const isConverted = Boolean(dump.convertedToTaskId);
              return (
                <motion.div
                  key={dump.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {dump.detectedSubject && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            {dump.detectedSubject}
                          </span>
                        )}
                        <PriorityBadge priority={dump.detectedPriority} size="sm" />
                        {isConverted && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Converted
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteDump(dump.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                        title="Delete dump"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      {dump.detectedTask}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-3">
                      "{dump.rawText}"
                    </p>

                    {dump.detectedDeadline && (
                      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Deadline: <strong className="text-slate-700 dark:text-slate-300">{dump.detectedDeadline}</strong></span>
                      </div>
                    )}

                    {dump.detectedKeywords && dump.detectedKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {dump.detectedKeywords.map(kw => (
                          <span
                            key={kw}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isConverted && (
                    <button
                      type="button"
                      onClick={() => convertDumpToTask(dump.id)}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors"
                    >
                      <span>Convert to Task</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
