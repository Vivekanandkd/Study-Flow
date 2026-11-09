import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Trash2,
} from 'lucide-react';
import { Task, TaskFilter } from '../../models/types';
import { useApp } from '../../context/AppContext';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { EmptyState } from '../common/EmptyState';

export const TasksView: React.FC = () => {
  const { tasks, deleteTask, clearCompletedTasks, openDumpModal } = useApp();

  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isClearCompletedOpen, setIsClearCompletedOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering and sorting
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Filter tabs
        if (activeFilter === 'pending' && task.completed) return false;
        if (activeFilter === 'completed' && !task.completed) return false;
        if (activeFilter === 'high' && task.priority !== 'high') return false;
        if (activeFilter === 'today' && task.dueDate !== todayStr) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchTag = task.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          // Incompleted tasks first, then by date
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'priority') {
          const pOrder = { high: 1, medium: 2, low: 3 };
          return pOrder[a.priority] - pOrder[b.priority];
        }
        return a.title.localeCompare(b.title);
      });
  }, [tasks, activeFilter, searchQuery, sortBy, todayStr]);

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const highPriorityCount = tasks.filter(t => !t.completed && t.priority === 'high').length;
  const dueTodayCount = tasks.filter(t => !t.completed && t.dueDate === todayStr).length;

  const filters: { id: TaskFilter; label: string; count: number; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Tasks', count: tasks.length, icon: null },
    { id: 'pending', label: 'Pending', count: pendingCount, icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'today', label: 'Due Today', count: dueTodayCount, icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'high', label: 'High Priority', count: highPriorityCount, icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { id: 'completed', label: 'Completed', count: completedCount, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Study Tasks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your assignments, problem sets, and revision goals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openDumpModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-bold border border-amber-500/20 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Study Dump</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filters.map(f => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks or tags..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs"
          />
        </div>

        {/* Sort and Clear buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'dueDate' | 'priority' | 'title')}
              className="text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={() => setIsClearCompletedOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Clear all completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done</span>
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-indigo-500" />}
          title={
            searchQuery
              ? 'No matching tasks'
              : activeFilter === 'completed'
              ? 'No completed tasks yet'
              : activeFilter === 'today'
              ? 'No tasks due today'
              : 'All clear! No tasks found.'
          }
          description={
            searchQuery
              ? 'Try adjusting your search terms or filters.'
              : 'Add a new study assignment or use the smart Study Dump to auto-extract tasks from your syllabus!'
          }
          action={{
            label: 'Add Task',
            onClick: () => {
              setEditingTask(null);
              setIsModalOpen(true);
            },
            icon: <Plus className="w-4 h-4" />,
          }}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={t => {
                  setEditingTask(t);
                  setIsModalOpen(true);
                }}
                onDelete={id => setDeletingTaskId(id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(deletingTaskId)}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={() => {
          if (deletingTaskId) deleteTask(deletingTaskId);
        }}
        title="Delete Task"
        message="Are you sure you want to delete this study task? This action cannot be undone."
      />

      {/* Clear Completed Confirmation */}
      <ConfirmationDialog
        isOpen={isClearCompletedOpen}
        onClose={() => setIsClearCompletedOpen(false)}
        onConfirm={clearCompletedTasks}
        title="Clear Completed Tasks"
        message={`This will remove ${completedCount} completed task(s) from your workspace. Continue?`}
        confirmLabel="Clear Tasks"
      />
    </div>
  );
};
