import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { FloatingActionButton } from './components/common/FloatingActionButton';
import { Snackbar } from './components/common/Snackbar';
import { StudyDumpModal } from './components/dump/StudyDumpModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { SettingsModal } from './components/settings/SettingsModal';

import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { PlannerView } from './components/planner/PlannerView';
import { InsightsView } from './components/insights/InsightsView';

import { TaskModal } from './components/tasks/TaskModal';
import { SubjectModal } from './components/subjects/SubjectModal';
import { SessionModal } from './components/planner/SessionModal';
import { ExamModal } from './components/exams/ExamModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  // Global modals triggered by FAB
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && <DashboardView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'subjects' && <SubjectsView />}
        {activeTab === 'planner' && <PlannerView />}
        {activeTab === 'insights' && <InsightsView />}
      </main>

      {/* Floating Action Button (Speed dial) */}
      <FloatingActionButton
        onAddTask={() => setIsTaskModalOpen(true)}
        onAddSubject={() => setIsSubjectModalOpen(true)}
        onAddExam={() => setIsExamModalOpen(true)}
        onAddSession={() => setIsSessionModalOpen(true)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Toast Alert System */}
      <Snackbar />

      {/* Global Modals */}
      <StudyDumpModal />
      <GlobalSearchModal />
      <SettingsModal />

      {/* FAB Modals */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <SubjectModal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} />
      <SessionModal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} />
      <ExamModal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
