import React, { useState } from 'react';
import { Plus, BookOpen, Layers, CheckCircle2, Award } from 'lucide-react';
import { Subject } from '../../models/types';
import { useApp } from '../../context/AppContext';
import { SubjectCard } from './SubjectCard';
import { SubjectModal } from './SubjectModal';
import { SubjectDetailModal } from './SubjectDetailModal';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { EmptyState } from '../common/EmptyState';

export const SubjectsView: React.FC = () => {
  const { subjects, deleteSubject } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubjectId, setDeletingSubjectId] = useState<string | null>(null);

  // Calculate totals
  const totalCredits = subjects.reduce((sum, s) => sum + (s.credits || 0), 0);
  const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);
  const completedTopics = subjects.reduce(
    (sum, s) => sum + s.topics.filter(t => t.completed).length,
    0
  );
  const overallCoverage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handleCardClick = (sub: Subject) => {
    setSelectedSubject(sub);
    setIsDetailOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Subjects & Syllabus
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track syllabus progress, curriculum topics, and course completion.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Courses
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {subjects.length}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Syllabus Done
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {overallCoverage}%
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Topics
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {completedTopics}/{totalTopics}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Credits
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {totalCredits}
          </span>
        </div>
      </div>

      {/* Grid of Subjects */}
      {subjects.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8 text-indigo-500" />}
          title="No Subjects Added Yet"
          description="Add your enrolled college courses (DBMS, Java, DAA, Data Structures...) to track your syllabus completion."
          action={{
            label: 'Add First Subject',
            onClick: handleOpenAdd,
            icon: <Plus className="w-4 h-4" />,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {subjects.map(sub => (
            <SubjectCard
              key={sub.id}
              subject={sub}
              onClick={() => handleCardClick(sub)}
            />
          ))}
        </div>
      )}

      {/* Subject Detail Drawer / Modal */}
      <SubjectDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSubject(null);
        }}
        subject={selectedSubject}
        onEditSubject={handleOpenEdit}
        onDeleteSubject={id => setDeletingSubjectId(id)}
      />

      {/* Create / Edit Subject Modal */}
      <SubjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSubject(null);
          // If we edited the currently selected subject, refresh it
          if (editingSubject && selectedSubject?.id === editingSubject.id) {
            const refreshed = subjects.find(s => s.id === editingSubject.id) || null;
            setSelectedSubject(refreshed);
          }
        }}
        subjectToEdit={editingSubject}
      />

      {/* Delete Subject Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(deletingSubjectId)}
        onClose={() => setDeletingSubjectId(null)}
        onConfirm={() => {
          if (deletingSubjectId) deleteSubject(deletingSubjectId);
        }}
        title="Delete Subject"
        message="Are you sure you want to remove this subject? Associated tasks will be kept as unassigned."
      />
    </div>
  );
};
