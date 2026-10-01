import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Bell, Shield, Smartphone, Trash2, Sun, Moon, Laptop } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [emailNotifs, setEmailNotifs] = useState(user?.preferences?.emailNotifications ?? true);
  const [analysisNotifs, setAnalysisNotifs] = useState(user?.preferences?.analysisNotifications ?? true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    try {
      await api.updateSettings({
        emailNotifications: emailNotifs,
        analysisNotifications: analysisNotifs,
        theme,
      });
      toast.success('Preferences saved successfully');
    } catch (err) {
      toast.error('Failed to save preferences');
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.deleteAccount();
      toast.info('Account deleted. We hope to see you again!');
      setIsDeleteModalOpen(false);
      await logout();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
          Configure notifications, appearance themes, active devices, and privacy.
        </p>
      </div>

      {/* Appearance Theme */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Interface Theme
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select your preferred display mode.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800 shadow-2xs font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs">Light Mode</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800 shadow-2xs font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span className="text-xs">Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Notification Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Control when and how you receive alerts regarding your resume analyses.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                Email Notifications
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Receive summaries when an ATS analysis completes or when new target role recommendations are generated.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="mt-1 rounded border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-start justify-between gap-4 cursor-pointer pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                Analysis Readiness Alerts
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                In-app notification badge when background document extraction finishes.
              </span>
            </div>
            <input
              type="checkbox"
              checked={analysisNotifs}
              onChange={(e) => setAnalysisNotifs(e.target.checked)}
              className="mt-1 rounded border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <Button size="sm" onClick={handleSavePreferences} isLoading={isSavingPrefs}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Security & Active Sessions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Security & Active Sessions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Devices currently authorized to access your account via JWT credentials.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-slate-400" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Current Web Browser Session
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Active Now · Port 3000 Web Client
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
              Current Device
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await logout();
              toast.info('Signed out of this device.');
            }}
          >
            Sign Out Now
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              await logout();
              toast.info('Logged out from all sessions.');
            }}
          >
            Log Out From All Devices
          </Button>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-rose-700 dark:text-rose-400">
            Danger Zone
          </h2>
          <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-0.5">
            Permanently delete your user profile, stored resumes, and analysis history. This action is irreversible.
          </p>
        </div>

        <Button
          size="sm"
          variant="danger"
          onClick={() => setIsDeleteModalOpen(true)}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Your Account?"
        description="This will permanently purge all uploaded resume files, extracted texts, and generated ATS analysis history from the database."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
            Are you sure you want to proceed?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeleteAccount}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
