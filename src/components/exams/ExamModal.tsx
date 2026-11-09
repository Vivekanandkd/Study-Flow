import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, BookOpen, Award, Plus, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Exam } from '../../models/types';
import { useApp } from '../../context/AppContext';
import { formatDateISO } from '../../services/nlpParserService';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  examToEdit?: Exam | null;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  examToEdit,
}) => {
  const { subjects, addExam, updateExam } = useApp();

  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [venue, setVenue] = useState('');
  const [notes, setNotes] = useState('');
  const [totalMarks, setTotalMarks] = useState<number | undefined>(100);
  const [syllabusInput, setSyllabusInput] = useState('');

  useEffect(() => {
    if (examToEdit) {
      setSubjectId(examToEdit.subjectId);
      setTitle(examToEdit.title);
      setExamDate(examToEdit.examDate);
      setExamTime(examToEdit.examTime || '');
      setVenue(examToEdit.venue || '');
      setNotes(examToEdit.notes || '');
      setTotalMarks(examToEdit.totalMarks || 100);
      setSyllabusInput(examToEdit.syllabusTopics?.join(', ') || '');
    } else {
      setSubjectId(subjects[0]?.id || '');
      setTitle('');
      // Default to 7 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setExamDate(formatDateISO(defaultDate));
      setExamTime('10:00 AM');
      setVenue('');
      setNotes('');
      setTotalMarks(100);
      setSyllabusInput('');
    }
  }, [examToEdit, isOpen, subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !title.trim() || !examDate) return;

    const parsedTopics = syllabusInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (examToEdit) {
      updateExam({
        ...examToEdit,
        subjectId,
        title: title.trim(),
        examDate,
        examTime: examTime || undefined,
        venue: venue || undefined,
        notes: notes || undefined,
        totalMarks: totalMarks ? Number(totalMarks) : undefined,
        syllabusTopics: parsedTopics,
      });
    } else {
      addExam({
        subjectId,
        title: title.trim(),
        examDate,
        examTime: examTime || undefined,
        venue: venue || undefined,
        notes: notes || undefined,
        totalMarks: totalMarks ? Number(totalMarks) : undefined,
        syllabusTopics: parsedTopics,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={examToEdit ? 'Edit Exam' : 'Schedule New Exam'}
      subtitle="Track exam dates, countdowns, and syllabus prep"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              Select Subject *
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
              Exam Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. End-Sem Theory, Midterm, Lab Viva"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Exam Date *
            </label>
            <input
              type="date"
              required
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Exam Time
            </label>
            <input
              type="text"
              value={examTime}
              onChange={e => setExamTime(e.target.value)}
              placeholder="e.g. 10:00 AM - 01:00 PM"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Venue & Total Marks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Exam Venue / Hall
            </label>
            <input
              type="text"
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder="e.g. Hall 402, CS Academic Block"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Total Marks
            </label>
            <input
              type="number"
              value={totalMarks || ''}
              onChange={e => setTotalMarks(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g. 100"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Syllabus units / topics */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Syllabus Topics Covered (Comma separated)
          </label>
          <input
            type="text"
            value={syllabusInput}
            onChange={e => setSyllabusInput(e.target.value)}
            placeholder="e.g. ER Models, Normalization, SQL, Indexing"
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Preparation Notes & Formula Reminders
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Important units to prioritize or professor tips..."
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
            {examToEdit ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {examToEdit ? 'Save Exam' : 'Schedule Exam'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
