import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHome } from './DashboardHome';
import { AnalyzePage } from './AnalyzePage';
import { AnalysisResultPage } from './AnalysisResultPage';
import { AnalysisHistoryPage } from './AnalysisHistoryPage';
import { MyResumesPage } from './MyResumesPage';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { ChatbotPage } from '../chat/ChatbotPage';
import { Menu, Sun, Moon, Sparkles, ChevronRight, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface DashboardLayoutProps {
  initialTab?: string;
  initialAnalysisId?: string;
  onNavigateHome: () => void;
  onSignOut?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  initialTab = 'dashboard',
  initialAnalysisId,
  onNavigateHome,
  onSignOut,
}) => {
  const [currentTab, setCurrentTab] = useState<string>(initialTab);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | undefined>(initialAnalysisId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOutAction = async () => {
    setIsUserMenuOpen(false);
    if (onSignOut) {
      onSignOut();
    } else {
      await logout();
      onNavigateHome();
    }
  };

  const handleTabChange = (tab: string, analysisId?: string) => {
    setCurrentTab(tab);
    if (analysisId) {
      setActiveAnalysisId(analysisId);
    }
  };

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Overview';
      case 'analyze':
        return 'Analyze Resume';
      case 'coach':
        return 'AI Career Coach';
      case 'resumes':
        return 'My Resumes';
      case 'history':
        return 'Analysis History';
      case 'profile':
        return 'Profile Management';
      case 'settings':
        return 'Application Settings';
      case 'analysis-detail':
        return 'Analysis Report';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => handleTabChange(tab)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onSignOut={handleSignOutAction}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Contextual Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <button
                onClick={onNavigateHome}
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                ResumeAI
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => handleTabChange('dashboard')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-bold">
                {getBreadcrumbTitle()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick action button */}
            {currentTab !== 'analyze' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleTabChange('analyze')}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
              >
                <span className="hidden sm:inline">New Analysis</span>
                <span className="sm:hidden">Analyze</span>
              </Button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Avatar & Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-700 transition-all"
                title="Account menu"
              >
                {user?.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user?.name || 'Account'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || ''}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleTabChange('profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleTabChange('settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={handleSignOutAction}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Header Sign Out Button */}
            <button
              onClick={handleSignOutAction}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
              title="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-xs">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Body Content View */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardHome onNavigate={(tab, aId) => handleTabChange(tab, aId)} />
          )}

          {currentTab === 'analyze' && (
            <AnalyzePage
              onAnalysisComplete={(id) => handleTabChange('analysis-detail', id)}
            />
          )}

          {currentTab === 'coach' && <ChatbotPage />}

          {currentTab === 'analysis-detail' && (
            <AnalysisResultPage
              analysisId={activeAnalysisId || 'demo'}
              onBack={() => handleTabChange('dashboard')}
              onAnalyzeAnother={() => handleTabChange('analyze')}
            />
          )}

          {currentTab === 'resumes' && (
            <MyResumesPage
              onAnalyzeResume={(resId) => handleTabChange('analyze')}
            />
          )}

          {currentTab === 'history' && (
            <AnalysisHistoryPage
              onViewAnalysis={(id) => handleTabChange('analysis-detail', id)}
              onAnalyzeNew={() => handleTabChange('analyze')}
            />
          )}

          {currentTab === 'profile' && <ProfilePage />}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};
