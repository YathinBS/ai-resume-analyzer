import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './components/ui/Toast';
import { Navbar } from './components/navigation/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AuthModal } from './components/auth/AuthModal';
import { ChatbotWidget } from './components/chat/ChatbotWidget';

function AppContent() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'demo'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [initialDashboardTab, setInitialDashboardTab] = useState('dashboard');
  const [initialAnalysisId, setInitialAnalysisId] = useState<string | undefined>(undefined);

  const { isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const toast = useToast();

  // If user signs out while on private dashboard, redirect immediately to landing view
  useEffect(() => {
    if (!isAuthenticated && view === 'dashboard') {
      setView('landing');
    }
  }, [isAuthenticated, view]);

  const handleSignOut = async () => {
    try {
      await logout();
      setView('landing');
      toast.info('You have been signed out successfully.', 'Signed Out');
    } catch (e) {
      setView('landing');
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot-password') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setInitialDashboardTab('analyze');
      setView('dashboard');
    } else {
      handleOpenAuth('register');
    }
  };

  const handleExploreDemo = () => {
    setInitialDashboardTab('analysis-detail');
    setInitialAnalysisId('demo');
    setView('dashboard');
  };

  const handleNavigate = (targetView: string) => {
    if (targetView === 'landing') {
      setView('landing');
    } else if (targetView === 'dashboard') {
      if (isAuthenticated) {
        setInitialDashboardTab('dashboard');
        setView('dashboard');
      } else {
        handleOpenAuth('login');
      }
    } else if (targetView === 'demo') {
      handleExploreDemo();
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
      {view === 'landing' ? (
        <>
          <Navbar
            currentView={view}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
          <LandingPage
            onGetStarted={handleGetStarted}
            onSignIn={() => handleOpenAuth('login')}
            onExploreDemo={handleExploreDemo}
          />
        </>
      ) : (
        <DashboardLayout
          initialTab={initialDashboardTab}
          initialAnalysisId={initialAnalysisId}
          onNavigateHome={() => setView('landing')}
          onSignOut={handleSignOut}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => {
          setView('dashboard');
        }}
      />

      {/* Floating AI Career & ATS Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
