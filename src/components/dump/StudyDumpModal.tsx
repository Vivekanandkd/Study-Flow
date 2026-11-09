import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  Bookmark,
  Calendar,
  AlertCircle,
  Tag,
  BookOpen,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { parseStudyDumpLocally } from '../../services/nlpParserService';
import { ParsedDumpResult, TaskPriority } from '../../models/types';
import { PriorityBadge } from '../common/Badge';

export const StudyDumpModal: React.FC = () => {
  const {
    isDumpModalOpen,
    closeDumpModal,
    dumpInitialText,
    subjects,
    addTask,
    saveDumpNote,
  } = useApp();

  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<ParsedDumpResult | null>(null);

  // Editable parsed fields
  const [editableTask, setEditableTask] = useState('');
  const [editableSubjectName, setEditableSubjectName] = useState('');
  const [editablePriority, setEditablePriority] = useState<TaskPriority>('medium');
  const [editableDeadline, setEditableDeadline] = useState('');

  useEffect(() => {
    if (isDumpModalOpen) {
      const initial = dumpInitialText || '';
      setInput(initial);
      if (initial.trim()) {
        const result = parseStudyDumpLocally(initial, subjects);
        setParsed(result);
        setEditableTask(result.task);
        setEditableSubjectName(result.subjectName || '');
        setEditablePriority(result.priority);
        setEditableDeadline(result.deadline || 'Tomorrow');
      } else {
        setParsed(null);
      }
    }
  }, [isDumpModalOpen, dumpInitialText, subjects]);

  const handleInputChange = (text: string) => {
    setInput(text);
    if (!text.trim()) {
      setParsed(null);
      return;
    }
    const result = parseStudyDumpLocally(text, subjects);
    setParsed(result);
    setEditableTask(result.task);
    setEditableSubjectName(result.subjectName || '');
    setEditablePriority(result.priority);
    setEditableDeadline(result.deadline || 'Tomorrow');
  };

  const handleSampleClick = (sample: string) => {
    handleInputChange(sample);
  };

  const handleCreateTask = () => {
    if (!editableTask.trim()) return;

    // Resolve subject
    let subjectId: string | undefined;
    if (editableSubjectName) {
      const matched = subjects.find(
        s => s.name.toLowerCase() === editableSubjectName.trim().toLowerCase()
      );
      if (matched) {
        subjectId = matched.id;
      }
    }

    addTask({
      title: editableTask.trim(),
      subjectId,
      priority: editablePriority,
      dueDate: parsed?.formattedDate || new Date().toISOString().split('T')[0],
      tags: parsed?.keywords || [],
      isFromDump: true,
    });

    closeDumpModal();
  };

  const handleSaveNote = () => {
    if (!input.trim() || !parsed) return;
    saveDumpNote(input, {
      ...parsed,
      task: editableTask,
      subjectName: editableSubjectName || undefined,
      priority: editablePriority,
      deadline: editableDeadline,
    });
    closeDumpModal();
  };

  const samplePrompts = [
    'Complete DAA backtracking tomorrow',
    'I need to complete DBMS normalization tomorrow',
    'Urgent Java OOP assignment due on Friday',
    'Revise Data Structures Dijkstra algorithm tonight',
  ];

  return (
    <Modal
      isOpen={isDumpModalOpen}
      onClose={closeDumpModal}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Study Dump (Instant Local NLP)</span>
        </div>
      }
      subtitle="Type your chaotic thoughts or syllabus notes. Our local pattern engine turns it into an organized task."
    >
      <div className="space-y-5">
        {/* Input box */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Dump Your Thought / Assignment
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={input}
              onChange={e => handleInputChange(e.target.value)}
              placeholder="e.g. I need to complete DBMS normalization tomorrow, or urgent Java lab submission next Friday..."
              className="w-full px-4 py-3 text-base rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Try an example:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map(sample => (
              <button
                key={sample}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-800 dark:bg-slate-800 dark:hover:bg-amber-950/60 dark:hover:text-amber-300 text-slate-600 dark:text-slate-400 transition-colors text-left"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        {/* Parsed Output Card */}
        <AnimatePresence>
          {parsed && input.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-5 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Detected Breakdown (Locally Extracted)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant local parser
                </span>
              </div>

              {/* Detected fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Task */}
                <div className="sm:col-span-2 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    TASK TITLE
                  </label>
                  <input
                    type="text"
                    value={editableTask}
                    onChange={e => setEditableTask(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none focus:border-b focus:border-amber-500"
                  />
                </div>

                {/* Subject */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    value={editableSubjectName}
                    onChange={e => setEditableSubjectName(e.target.value)}
                    placeholder="e.g. DBMS, DAA, Java"
                    className="w-full text-sm font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none focus:border-b focus:border-amber-500"
                  />
                </div>

                {/* Deadline */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    DEADLINE
                  </label>
                  <input
                    type="text"
                    value={editableDeadline}
                    onChange={e => setEditableDeadline(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none focus:border-b focus:border-amber-500"
                  />
                </div>

                {/* Priority */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    PRIORITY
                  </label>
                  <div className="flex gap-2 mt-1">
                    {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEditablePriority(p)}
                        className={`text-xs px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                          editablePriority === p
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detected Keywords */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-purple-500" />
                    KEYWORDS
                  </label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {parsed.keywords.length > 0 ? (
                      parsed.keywords.map(kw => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-mono"
                        >
                          #{kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No syllabus tags detected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: [Create Task] [Save Note] */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreateTask}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/25 active:scale-98 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-xs active:scale-98 transition-all"
                >
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  Save Note
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
