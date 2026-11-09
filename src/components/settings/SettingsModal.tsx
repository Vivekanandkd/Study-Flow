import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  User,
  GraduationCap,
  Info,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    closeSettingsModal,
    settings,
    toggleTheme,
    setSoundEnabled,
    profile,
    updateProfileName,
    clearCompletedTasks,
    resetToDefaults,
    clearAllData,
    showToast,
  } = useApp();

  const [studentName, setStudentName] = useState(profile.name);
  const [isWipeOpen, setIsWipeOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isClearCompletedOpen, setIsClearCompletedOpen] = useState(false);

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    updateProfileName(studentName.trim());
  };

  const handleExportData = () => {
    try {
      const json = storageService.exportAllData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('StudyFlow backup exported! 📥', 'success');
    } catch {
      showToast('Export failed', 'warning');
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = storageService.importData(content);
        if (success) {
          showToast('Data imported successfully! Reloading...', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          showToast('Invalid backup JSON file', 'warning');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        maxWidth="lg"
        title={
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <span>Preferences & Settings</span>
          </div>
        }
        subtitle="Manage display, sound, local storage, and student profile"
      >
        <div className="space-y-6">
          {/* Profile Name */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              Student Profile Name
            </label>
            <form onSubmit={handleNameSave} className="flex gap-2">
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Enter your name..."
                className="flex-1 px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Save
              </button>
            </form>
          </div>

          {/* Theme & Audio Toggles */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Appearance & Sounds
            </span>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  {settings.theme === 'dark' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <strong className="text-sm font-semibold text-slate-900 dark:text-white block">
                    Dark Mode
                  </strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Currently: {settings.theme === 'dark' ? 'Dark' : 'Light'} theme
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <strong className="text-sm font-semibold text-slate-900 dark:text-white block">
                    Audio Chimes
                  </strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Play celebratory tone on task & study completion
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSoundEnabled(!settings.soundEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Backup & Data Actions */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Data & Storage
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-indigo-500" />
                <span>Export Backup</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer shadow-xs">
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsClearCompletedOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-slate-400" />
                  Clear Completed Tasks
                </span>
                <span className="text-[11px] text-slate-400">Cleans up checked items</span>
              </button>

              <button
                type="button"
                onClick={() => setIsResetOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  Reset to College Demo Data
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400">Restore demo</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWipeOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 hover:bg-rose-100/50 text-xs font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  Clear All Data
                </span>
                <span className="text-[11px] text-rose-500 font-bold">Wipe local storage</span>
              </button>
            </div>
          </div>

          {/* About StudyFlow */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 border border-indigo-500/20 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>About StudyFlow v1.0.0</span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              "Turn study chaos into a clear plan."
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed as a modern student productivity suite with local NLP parsing, syllabus
              tracking (DBMS, Java, DAA, Data Structures), exam countdowns, study timers, and zero
              cloud/server dependencies.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <span>Client-Side LocalStorage</span> • <span>React 19 + TypeScript</span> • <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={isClearCompletedOpen}
        onClose={() => setIsClearCompletedOpen(false)}
        onConfirm={clearCompletedTasks}
        title="Clear Completed Tasks"
        message="Are you sure you want to remove all completed tasks?"
        confirmLabel="Clear"
      />

      <ConfirmationDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={resetToDefaults}
        title="Reset to Sample College Data"
        message="This will re-seed DBMS, Java, DAA, Data Structures, upcoming exams, and study sessions."
        confirmLabel="Reset Data"
        isDanger={false}
      />

      <ConfirmationDialog
        isOpen={isWipeOpen}
        onClose={() => setIsWipeOpen(false)}
        onConfirm={clearAllData}
        title="Wipe All Data"
        message="This will delete all subjects, tasks, exams, and notes permanently from local storage. Are you sure?"
        confirmLabel="Wipe Everything"
      />
    </>
  );
};
