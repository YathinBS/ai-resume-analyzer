export interface User {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  preferredIndustry?: string;
  avatarUrl?: string;
  createdAt: string;
  preferences?: {
    emailNotifications: boolean;
    analysisNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface ResumeSection {
  title: string;
  content: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  parsedText: string;
  sections?: {
    contact?: string;
    summary?: string;
    skills?: string[];
    experience?: string[];
    education?: string[];
    certifications?: string[];
    projects?: string[];
  };
  lastScore?: number;
}

export interface Recommendation {
  id: string;
  category: 'Impact & Metrics' | 'Keywords & ATS' | 'Formatting & Structure' | 'Experience Relevance' | 'Grammar & Clarity';
  problem: string;
  whyItMatters: string;
  currentBullet?: string;
  suggestedImprovement: string;
  impactScore?: string;
}

export interface ScoreBreakdownItem {
  name: string;
  score: number;
  explanation: string;
  status: 'excellent' | 'good' | 'warning' | 'needs-improvement';
}

export interface Analysis {
  id: string;
  userId: string;
  resumeId: string;
  resumeFileName: string;
  jobTitle: string;
  jobDescription: string;
  createdAt: string;
  atsScore: number;
  jobMatchScore: number;
  keywordScore: number;
  skillScore: number;
  scoreBreakdown: {
    atsCompatibility: ScoreBreakdownItem;
    contentQuality: ScoreBreakdownItem;
    keywordOptimization: ScoreBreakdownItem;
    formatting: ScoreBreakdownItem;
    experienceRelevance: ScoreBreakdownItem;
    skillsMatch: ScoreBreakdownItem;
  };
  strengths: string[];
  areasToImprove: string[];
  matchedSkills: string[];
  missingSkills: string[];
  recommendedSkills: string[];
  keywords: {
    matched: string[];
    missing: string[];
    overused: string[];
  };
  recommendations: Recommendation[];
  executiveSummary: string;
  isDemo?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
