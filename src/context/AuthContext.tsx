import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../lib/api';
import { DEMO_USER } from '../data/demoData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, targetRole?: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('resumeai_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    const savedToken = localStorage.getItem('resumeai_token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      setToken(savedToken);
    } catch (err) {
      console.warn('Session verification failed:', err);
      // If server returned 401 or token is invalid, clear storage
      localStorage.removeItem('resumeai_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password, rememberMe });
      localStorage.setItem('resumeai_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, targetRole?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, password, targetRole });
      localStorage.setItem('resumeai_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setIsLoading(true);
    try {
      // Login with demo account credentials
      const res = await api.login({ email: DEMO_USER.email, password: 'demo12345' });
      localStorage.setItem('resumeai_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (err) {
      // Fallback local setting if network offline
      setUser(DEMO_USER);
      setToken('demo-token-mock');
      localStorage.setItem('resumeai_token', 'demo-token-mock');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Backend logout call completed with note:', e);
    }
    localStorage.removeItem('resumeai_token');
    sessionStorage.removeItem('resumeai_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    const updated = await api.updateProfile(data);
    setUser(updated);
  };

  const refreshUser = async () => {
    const currentUser = await api.getCurrentUser();
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
