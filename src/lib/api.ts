import { Analysis, Resume, User } from '../types';

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';
const API_BASE = `${rawApiUrl}/api`;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('resumeai_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  async register(data: { name: string; email: string; password: string; targetRole?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async login(data: { email: string; password: string; rememberMe?: boolean }): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async logout(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // User
  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/users/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/users/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateSettings(data: { emailNotifications?: boolean; analysisNotifications?: boolean; theme?: string }): Promise<User> {
    const res = await fetch(`${API_BASE}/users/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteAccount(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Resumes
  async uploadResume(formData: FormData): Promise<Resume> {
    const res = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse(res);
  },

  async uploadResumeText(data: { text: string; fileName: string }): Promise<Resume> {
    const res = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getResumes(): Promise<Resume[]> {
    const res = await fetch(`${API_BASE}/resumes`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getResume(id: string): Promise<Resume> {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async renameResume(id: string, fileName: string): Promise<Resume> {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ fileName }),
    });
    return handleResponse(res);
  },

  async deleteResume(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Analysis
  async analyzeResume(data: {
    resumeId?: string;
    resumeText?: string;
    fileName?: string;
    jobDescription: string;
  }): Promise<Analysis> {
    const res = await fetch(`${API_BASE}/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getAnalysisHistory(): Promise<Analysis[]> {
    const res = await fetch(`${API_BASE}/analysis`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getAnalysis(id: string): Promise<Analysis> {
    const res = await fetch(`${API_BASE}/analysis/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getDemoAnalysis(): Promise<Analysis> {
    const res = await fetch(`${API_BASE}/analysis/demo`);
    return handleResponse(res);
  },

  async deleteAnalysis(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/analysis/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Stats
  async getStats(): Promise<{
    totalAnalyses: number;
    totalResumes: number;
    avgAtsScore: number;
    avgJobMatch: number;
    skillsImproved: number;
  }> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getPublicStats(): Promise<{
    resumesChecked: number;
    resumesStored: number;
    avgAtsScore: number;
    skillsEvaluated: number;
    aiEngine: string;
  }> {
    const res = await fetch(`${API_BASE}/stats/public`);
    return handleResponse(res);
  },

  // AI Career & ATS Chatbot
  async sendChatMessage(
    messages: { role: 'user' | 'assistant' | 'model'; content: string }[],
    context?: string
  ): Promise<{ reply: string }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ messages, context }),
    });
    return handleResponse(res);
  },
};
