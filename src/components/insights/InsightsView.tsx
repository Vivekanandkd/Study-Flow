import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';
import { ProgressBar } from '../common/ProgressBar';

export const InsightsView: React.FC = () => {
  const { tasks, subjects, profile, sessions } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Weekly productivity calculation (last 7 days)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const dayLabel = daysOfWeek[d.getDay()];

    // Count tasks completed on this date or due on this date and completed
    const count = tasks.filter(t => {
      if (!t.completed) return false;
      const completedDate = t.completedAt ? t.completedAt.split('T')[0] : t.dueDate;
      return completedDate === iso;
    }).length;

    // Study minutes logged on this day
    const studyMins = sessions
      .filter(s => s.date === iso && s.completed)
      .reduce((sum, s) => sum + s.durationMinutes, 0);

    return {
      date: iso,
      day: dayLabel,
      tasksDone: count,
      studyMinutes: studyMins,
      isToday: i === 6,
    };
  });

  const maxTasksInWeek = Math.max(...last7DaysData.map(d => d.tasksDone), 4);

  // Priority distribution
  const highTasks = tasks.filter(t => t.priority === 'high').length;
  const medTasks = tasks.filter(t => t.priority === 'medium').length;
  const lowTasks = tasks.filter(t => t.priority === 'low').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Productivity Insights
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics on your study habits, syllabus mastery, and momentum.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Total Tasks
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalTasks}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Completed
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {completedTasks}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Pending
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {pendingTasks}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Study Streak
            </span>
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <Flame className="w-6 h-6 fill-rose-500" />
              {profile.streakCount}d
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Weekly Productivity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tasks accomplished over the last 7 days
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              Last 7 Days
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
            {last7DaysData.map(item => {
              const heightPercent = Math.max(8, (item.tasksDone / maxTasksInWeek) * 100);
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip value */}
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 opacity-90 group-hover:scale-110 transition-transform">
                    {item.tasksDone}
                  </span>

                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800/80 rounded-2xl h-40 flex items-end p-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`w-full rounded-xl transition-all ${
                        item.isToday
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-500 shadow-sm shadow-indigo-500/30'
                          : 'bg-gradient-to-t from-indigo-400 to-indigo-300 dark:from-indigo-700 dark:to-indigo-500'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs font-semibold ${
                      item.isToday
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Completion Ring & Priority Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Completion Rate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Total coursework completion ratio
            </p>

            <div className="flex justify-center my-2">
              <CircularProgress
                value={completionPercentage}
                size={130}
                strokeWidth={12}
                color="#4F46E5"
                subtext="Resolved"
              />
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block text-[10px]">
              Task Priority Split
            </span>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> High Priority
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{highTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{medTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{lowTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress Breakdowns */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Course Syllabus Progress
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown across your registered semester courses
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {subjects.map(subject => {
            const completedTopics = subject.topics.filter(t => t.completed).length;
            const totalTopics = subject.topics.length;
            const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
            const subTasks = tasks.filter(t => t.subjectId === subject.id);
            const doneTasks = subTasks.filter(t => t.completed).length;

            return (
              <div
                key={subject.id}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <strong className="text-sm font-bold text-slate-900 dark:text-white">
                      {subject.name}
                    </strong>
                    {subject.code && (
                      <span className="text-xs text-slate-500 font-mono">({subject.code})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {completedTopics}/{totalTopics} topics
                    </span>
                    <span>
                      {doneTasks}/{subTasks.length} tasks
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {pct}%
                    </span>
                  </div>
                </div>

                <ProgressBar value={pct} color={subject.color} height="h-2.5" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Consistency Heatmap */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Study Consistency
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current streak: <strong className="text-rose-600 dark:text-rose-400">{profile.streakCount} days</strong> • Longest streak: {profile.longestStreak} days
              </p>
            </div>
          </div>
        </div>

        {/* 28-day activity dots grid */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {Array.from({ length: 28 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (27 - i));
            const iso = d.toISOString().split('T')[0];
            const isActive = profile.activeDates?.includes(iso);
            const isToday = i === 27;

            return (
              <div
                key={iso}
                className="flex flex-col items-center gap-1 group relative"
                title={`${iso}: ${isActive ? 'Active Study Day' : 'Rest day'}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-rose-500 text-white font-bold shadow-xs'
                      : isToday
                      ? 'border-2 border-dashed border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isActive ? (
                    <Flame className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <span className="text-[10px]">{d.getDate()}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
