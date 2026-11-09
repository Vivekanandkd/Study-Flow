import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit3,
  Calendar,
  ListTodo,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Subject } from '../../models/types';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';

interface SubjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  isOpen,
  onClose,
  subject,
  onEditSubject,
  onDeleteSubject,
}) => {
  const { toggleTopic, addTopic, deleteTopic, tasks, getSubjectProgress, exams } = useApp();
  const [newTopicName, setNewTopicName] = useState('');

  if (!subject) return null;

  const { topicProgress, overallProgress } = getSubjectProgress(subject.id);
  const completedTopicsCount = subject.topics.filter(t => t.completed).length;
  const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
  const subjectExams = exams.filter(e => e.subjectId === subject.id);

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    addTopic(subject.id, newTopicName);
    setNewTopicName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full shadow-xs"
            style={{ backgroundColor: subject.color }}
          />
          <span>{subject.name}</span>
          {subject.code && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {subject.code}
            </span>
          )}
        </div>
      }
      subtitle={`Course Syllabus & Progress Tracker • ${subject.credits || 3} Credits`}
    >
      <div className="space-y-6">
        {/* Progress Overview Card */}
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Syllabus Mastery
              </span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {topicProgress}% <span className="text-xs font-normal text-slate-500">completed</span>
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {completedTopicsCount}
              </span>{' '}
              of {subject.topics.length} topics covered
            </div>
          </div>
          <ProgressBar value={topicProgress} color={subject.color} height="h-2.5" />
        </div>

        {/* Topics Checklist Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Syllabus Topics
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Click checkbox to mark covered
            </span>
          </div>

          {/* Add Topic Input */}
          <form onSubmit={handleAddTopic} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTopicName}
              onChange={e => setNewTopicName(e.target.value)}
              placeholder="Add syllabus topic (e.g. Normalization 1NF to BCNF)..."
              className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1 shadow-sm shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Topics List */}
          {subject.topics.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              No topics added yet. Add syllabus units or chapters above!
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <AnimatePresence>
                {subject.topics.map(topic => (
                  <motion.div
                    key={topic.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      topic.completed
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/50'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleTopic(subject.id, topic.id)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0"
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                          topic.completed
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {topic.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          topic.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {topic.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTopic(subject.id, topic.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                      title="Remove topic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Linked Exams */}
        {subjectExams.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              Scheduled Exams
            </h4>
            <div className="space-y-2">
              {subjectExams.map(ex => (
                <div
                  key={ex.id}
                  className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-xs flex items-center justify-between"
                >
                  <div>
                    <strong className="text-slate-900 dark:text-white font-semibold block">
                      {ex.title}
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400">
                      Date: {ex.examDate} {ex.venue ? `• ${ex.venue}` : ''}
                    </span>
                  </div>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {ex.examDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linked Tasks */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ListTodo className="w-3.5 h-3.5 text-indigo-500" />
            Active Tasks ({subjectTasks.length})
          </h4>
          {subjectTasks.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No tasks assigned to this subject yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {subjectTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <span className={task.completed ? 'line-through text-slate-400' : 'font-medium'}>
                    {task.title}
                  </span>
                  <span className="text-slate-400">{task.dueDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onDeleteSubject(subject.id);
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-2 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Subject</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onEditSubject(subject);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Info</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
