import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles, CheckSquare, BookOpen, Clock, Calendar, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FloatingActionButtonProps {
  onAddTask: () => void;
  onAddSubject: () => void;
  onAddExam: () => void;
  onAddSession: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onAddTask,
  onAddSubject,
  onAddExam,
  onAddSession,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openDumpModal } = useApp();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const actions = [
    {
      label: 'Study Dump (NLP)',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      onClick: () => {
        setIsOpen(false);
        openDumpModal();
      },
      color: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-100',
    },
    {
      label: 'New Task',
      icon: <CheckSquare className="w-5 h-5 text-indigo-500" />,
      onClick: () => {
        setIsOpen(false);
        onAddTask();
      },
      color: 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-100',
    },
    {
      label: 'Plan Study Session',
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      onClick: () => {
        setIsOpen(false);
        onAddSession();
      },
      color: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100',
    },
    {
      label: 'Add Subject',
      icon: <BookOpen className="w-5 h-5 text-purple-500" />,
      onClick: () => {
        setIsOpen(false);
        onAddSubject();
      },
      color: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-900 dark:text-purple-100',
    },
    {
      label: 'Schedule Exam',
      icon: <Calendar className="w-5 h-5 text-rose-500" />,
      onClick: () => {
        setIsOpen(false);
        onAddExam();
      },
      color: 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-900 dark:text-rose-100',
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bottom-20 sm:bottom-8 right-5 z-40 flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="flex flex-col items-end gap-2.5 mb-2"
          >
            {actions.map((act, idx) => (
              <motion.button
                key={act.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: (actions.length - idx) * 0.03 }}
                type="button"
                onClick={act.onClick}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 transition-all transform active:scale-95 ${act.color}`}
              >
                <span className="text-sm font-semibold whitespace-nowrap">{act.label}</span>
                <span className="p-1 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-sm">{act.icon}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-600/35 flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900"
        aria-label="Quick Actions"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </motion.div>
      </motion.button>
    </div>
  );
};
