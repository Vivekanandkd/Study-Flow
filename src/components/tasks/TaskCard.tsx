import React from 'react';
import { motion } from 'motion/react';
import { Check, Calendar, Clock, Edit3, Trash2, Tag } from 'lucide-react';
import { Task } from '../../models/types';
import { useApp } from '../../context/AppContext';
import { PriorityBadge } from '../common/Badge';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { toggleTask, subjects } = useApp();

  const subject = subjects.find(s => s.id === task.subjectId);

  // Due date formatting
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = task.dueDate === todayStr;
  const isOverdue = !task.completed && task.dueDate < todayStr;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative p-4 rounded-3xl border transition-all ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center transition-all shrink-0 ${
            task.completed
              ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-slate-800'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {subject && (
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg text-white shadow-xs"
                style={{ backgroundColor: subject.color }}
              >
                {subject.name}
              </span>
            )}

            <PriorityBadge priority={task.priority} size="sm" />

            {isToday && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Due Today
              </span>
            )}

            {isOverdue && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700 animate-pulse">
                Overdue
              </span>
            )}
          </div>

          <h4
            className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
              task.completed
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Meta details footer */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{task.dueDate}</span>
              </div>
            )}
            {task.dueTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.dueTime}</span>
              </div>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                <span className="text-[11px] text-slate-500 font-mono">
                  {task.tags.slice(0, 2).map(t => `#${t}`).join(' ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
