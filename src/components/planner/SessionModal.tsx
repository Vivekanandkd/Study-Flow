import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Calendar, AlignLeft, Check, Plus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { StudySession } from '../../models/types';
import { useApp } from '../../context/AppContext';
import { formatDateISO } from '../../services/nlpParserService';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionToEdit?: StudySession | null;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  sessionToEdit,
}) => {
  const { subjects, addSession, updateSession } = useApp();

  const [subjectId, setSubjectId] = useState('');
  const [topicName, setTopicName] = useState('');
  const [date, setDate] = useState(formatDateISO(new Date()));
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:30');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (sessionToEdit) {
      setSubjectId(sessionToEdit.subjectId);
      setTopicName(sessionToEdit.topicName);
      setDate(sessionToEdit.date);
      setStartTime(sessionToEdit.startTime);
      setEndTime(sessionToEdit.endTime);
      setNotes(sessionToEdit.notes || '');
    } else {
      setSubjectId(subjects[0]?.id || '');
      setTopicName('');
      setDate(formatDateISO(new Date()));
      setStartTime('16:00');
      setEndTime('17:30');
      setNotes('');
    }
  }, [sessionToEdit, isOpen, subjects]);

  // Calculate duration in minutes
  const calculateDuration = (start: string, end: string): number => {
    try {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff <= 0) diff += 24 * 60; // rollover overnight
      return diff;
    } catch {
      return 60;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !topicName.trim() || !date) return;

    const duration = calculateDuration(startTime, endTime);

    if (sessionToEdit) {
      updateSession({
        ...sessionToEdit,
        subjectId,
        topicName: topicName.trim(),
        date,
        startTime,
        endTime,
        durationMinutes: duration,
        notes: notes.trim() || undefined,
      });
    } else {
      addSession({
        subjectId,
        topicName: topicName.trim(),
        date,
        startTime,
        endTime,
        durationMinutes: duration,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  const selectedSubject = subjects.find(s => s.id === subjectId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={sessionToEdit ? 'Edit Study Session' : 'Plan Study Session'}
      subtitle="Schedule dedicated time for focused topic revision"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject & Topic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              Subject *
            </label>
            <select
              required
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code || 'Course'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Topic / Chapter *
            </label>
            <input
              type="text"
              required
              value={topicName}
              onChange={e => setTopicName(e.target.value)}
              placeholder="e.g. Normalization 1NF to BCNF, Backtracking"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Syllabus Topic Quick Select if available */}
        {selectedSubject && selectedSubject.topics.length > 0 && (
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
              Or pick from {selectedSubject.name} syllabus topics:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {selectedSubject.topics.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTopicName(t.name)}
                  className={`text-xs px-2.5 py-1 rounded-xl transition-colors border ${
                    topicName === t.name
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-300'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date, Start Time, End Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              Start Time *
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              End Time *
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5 text-slate-500" />
            Session Goals & Preparation Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Solve 5 textbook recurrence relation proofs, implement recursive calls..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            {sessionToEdit ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {sessionToEdit ? 'Save Session' : 'Plan Session'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
