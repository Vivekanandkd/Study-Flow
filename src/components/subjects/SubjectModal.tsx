import React, { useState, useEffect } from 'react';
import { BookOpen, Hash, Award, Palette, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Subject } from '../../models/types';
import { useApp } from '../../context/AppContext';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: Subject | null;
}

const COLOR_PRESETS = [
  '#3B82F6', // Blue (DBMS)
  '#F97316', // Orange (Java)
  '#8B5CF6', // Purple (DAA)
  '#10B981', // Emerald (Data Structures)
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#EF4444', // Red
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  subjectToEdit,
}) => {
  const { addSubject, updateSubject } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [credits, setCredits] = useState<number>(4);

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name);
      setCode(subjectToEdit.code || '');
      setColor(subjectToEdit.color || COLOR_PRESETS[0]);
      setCredits(subjectToEdit.credits || 4);
    } else {
      setName('');
      setCode('');
      setColor(COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]);
      setCredits(4);
    }
  }, [subjectToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (subjectToEdit) {
      updateSubject({
        ...subjectToEdit,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        color,
        credits: Number(credits) || 3,
      });
    } else {
      addSubject({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        color,
        credits: Number(credits) || 3,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={subjectToEdit ? 'Edit Subject' : 'Add New Subject'}
      subtitle="Organize your syllabus, topics, and coursework"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            Subject Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. DBMS, Java, DAA, Data Structures"
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium"
            autoFocus
          />
        </div>

        {/* Code & Credits */}
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              Course Code
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="e.g. CS-301"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white text-sm font-medium uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Credits
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={credits}
              onChange={e => setCredits(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white text-sm font-medium"
            />
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-indigo-500" />
            Subject Color
          </label>
          <div className="flex flex-wrap gap-2.5">
            {COLOR_PRESETS.map(c => {
              const isSelected = color === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-xs"
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
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
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            {subjectToEdit ? 'Save Changes' : 'Create Subject'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
