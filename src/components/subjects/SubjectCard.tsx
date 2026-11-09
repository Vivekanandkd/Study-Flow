import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle, Clock, ChevronRight, Award } from 'lucide-react';
import { Subject } from '../../models/types';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  const { getSubjectProgress, tasks, exams } = useApp();

  const { topicProgress } = getSubjectProgress(subject.id);
  const completedTopics = subject.topics.filter(t => t.completed).length;
  const totalTopics = subject.topics.length;
  const pendingTasks = tasks.filter(t => t.subjectId === subject.id && !t.completed).length;
  const upcomingExams = exams.filter(e => e.subjectId === subject.id).length;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={onClick}
      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Top accent color bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
        style={{ backgroundColor: subject.color }}
      />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm"
              style={{ backgroundColor: subject.color }}
            >
              {subject.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {subject.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subject.code && <span className="font-mono font-medium">{subject.code}</span>}
                {subject.credits && (
                  <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <Award className="w-3 h-3" />
                    {subject.credits} cr
                  </span>
                )}
              </div>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        {/* Topic Progress Bar */}
        <div className="my-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-500 dark:text-slate-400">Syllabus Completion</span>
            <span className="font-bold text-slate-900 dark:text-white">{topicProgress}%</span>
          </div>
          <ProgressBar value={topicProgress} color={subject.color} height="h-2" />
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <strong className="text-slate-700 dark:text-slate-300">{completedTopics}</strong>/{totalTopics} topics
        </span>

        {pendingTasks > 0 ? (
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            {pendingTasks} {pendingTasks === 1 ? 'task' : 'tasks'}
          </span>
        ) : (
          <span className="text-slate-400">All tasks done</span>
        )}

        {upcomingExams > 0 && (
          <span className="text-rose-500 dark:text-rose-400 font-semibold">
            {upcomingExams} exam
          </span>
        )}
      </div>
    </motion.div>
  );
};
