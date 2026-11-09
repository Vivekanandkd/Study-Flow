import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Edit3, Trash2, Award, BookOpen } from 'lucide-react';
import { Exam } from '../../models/types';
import { useApp } from '../../context/AppContext';

interface ExamCardProps {
  exam: Exam;
  onEdit: (exam: Exam) => void;
  onDelete: (id: string) => void;
}

export function calculateDaysLeft(examDateStr: string): {
  days: number;
  label: string;
  isUrgent: boolean;
  isPast: boolean;
  statusColor: string;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = examDateStr.split('-').map(Number);
  const examDate = new Date(y, m - 1, d);
  examDate.setHours(0, 0, 0, 0);

  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: diffDays,
      label: 'Exam Concluded',
      isUrgent: false,
      isPast: true,
      statusColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    };
  }
  if (diffDays === 0) {
    return {
      days: 0,
      label: 'TODAY!',
      isUrgent: true,
      isPast: false,
      statusColor: 'bg-rose-500 text-white animate-pulse',
    };
  }
  if (diffDays === 1) {
    return {
      days: 1,
      label: 'Tomorrow!',
      isUrgent: true,
      isPast: false,
      statusColor: 'bg-rose-500 text-white animate-pulse',
    };
  }
  if (diffDays <= 3) {
    return {
      days: diffDays,
      label: `${diffDays} days left`,
      isUrgent: true,
      isPast: false,
      statusColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700',
    };
  }
  if (diffDays <= 7) {
    return {
      days: diffDays,
      label: `${diffDays} days left`,
      isUrgent: false,
      isPast: false,
      statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700',
    };
  }
  return {
    days: diffDays,
    label: `${diffDays} days left`,
    isUrgent: false,
    isPast: false,
    statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700',
  };
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onEdit, onDelete }) => {
  const { subjects } = useApp();
  const subject = subjects.find(s => s.id === exam.subjectId);
  const countdown = calculateDaysLeft(exam.examDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-5 rounded-3xl border transition-all ${
        countdown.isUrgent
          ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {subject && (
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-lg text-white shadow-xs"
              style={{ backgroundColor: subject.color }}
            >
              {subject.name}
            </span>
          )}
          <span
            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full shadow-xs ${countdown.statusColor}`}
          >
            {countdown.label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(exam)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit exam"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(exam.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete exam"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
        {subject?.name ? `${subject.name} — ` : ''}{exam.title}
      </h3>

      {exam.notes && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
          {exam.notes}
        </p>
      )}

      {/* Meta details */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1 font-medium">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          {exam.examDate}
        </span>
        {exam.examTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {exam.examTime}
          </span>
        )}
        {exam.venue && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {exam.venue}
          </span>
        )}
        {exam.totalMarks && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold ml-auto">
            <Award className="w-3.5 h-3.5" />
            {exam.totalMarks} Marks
          </span>
        )}
      </div>

      {/* Syllabus checklist preview */}
      {exam.syllabusTopics && exam.syllabusTopics.length > 0 && (
        <div className="mt-3 pt-2 flex flex-wrap gap-1">
          {exam.syllabusTopics.map(st => (
            <span
              key={st}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
            >
              • {st}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};
