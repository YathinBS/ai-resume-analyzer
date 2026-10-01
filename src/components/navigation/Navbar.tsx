import React from 'react';
import { Sun, Moon, LogOut, User as UserIcon, LayoutDashboard, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white hover:opacity-90 transition-opacity focus:outline-none"
        >
          ResumeAI
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'landing' ? 'text-slate-900 dark:text-white font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              if (currentView !== 'landing') onNavigate('landing');
              setTimeout(() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              if (currentView !== 'landing') onNavigate('landing');
              setTimeout(() => {
                const el = document.getElementById('features');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            Features
          </button>
          <button
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'demo')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'dashboard' ? 'text-slate-900 dark:text-white font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('demo')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'demo' ? 'text-slate-900 dark:text-white font-semibold' : ''
            }`}
          >
            Sample Report
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions + theme toggle */}
        <div className="flex items-center gap-2.5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onNavigate('analyze')}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-500" />}
              >
                Analyze Resume
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onNavigate('dashboard')}
                leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
              >
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Button>
              <button
                onClick={async () => {
                  await logout();
                  onNavigate('landing');
                }}
                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onOpenAuth('login')}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => onOpenAuth('register')}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
