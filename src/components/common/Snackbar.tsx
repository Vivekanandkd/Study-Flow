import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Snackbar: React.FC = () => {
  const { toast } = useApp();

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 pointer-events-none flex flex-col items-end">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-800 dark:border-slate-200'
                : toast.type === 'warning'
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-indigo-600 text-white border-indigo-700'
            }`}
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
            )}
            {toast.type === 'warning' && (
              <AlertCircle className="w-5 h-5 text-white shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-indigo-200 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
