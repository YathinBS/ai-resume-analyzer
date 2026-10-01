import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { Resume, Analysis } from '../../types';
import {
  User as UserIcon,
  ShieldCheck,
  FileText,
  TrendingUp,
  Briefcase,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface ProfilePageProps {
  onNavigateToAnalyze?: () => void;
  onNavigateToAnalysis?: (analysisId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateToAnalyze,
  onNavigateToAnalysis,
}) => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [preferredIndustry, setPreferredIndustry] = useState(user?.preferredIndustry || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // User's own tested resumes and analyses
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [userAnalyses, setUserAnalyses] = useState<Analysis[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTargetRole(user.targetRole || '');
      setPreferredIndustry(user.preferredIndustry || '');
    }
  }, [user]);

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      setIsLoadingData(true);
      try {
        const [resumes, analyses] = await Promise.all([
          api.getResumes().catch(() => []),
          api.getAnalysisHistory().catch(() => []),
        ]);
        // Strict tenant isolation: show ONLY resumes and analyses belonging to this authenticated user
        setUserResumes((resumes || []).filter((r) => r.userId === user.id));
        setUserAnalyses((analyses || []).filter((a) => a.userId === user.id));
      } catch (err) {
        console.error('Failed to load user resume history:', err);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadUserData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateUser({ name, targetRole, preferredIndustry });
      toast.success('Profile details updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getInitials = (n?: string) => {
    if (!n || !n.trim()) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Active';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  // Profile-specific analytics calculated solely from their tested resumes
  const totalAudits = userAnalyses.length;
  const avgScore =
    totalAudits > 0
      ? Math.round(userAnalyses.reduce((acc, curr) => acc + (curr.atsScore || 0), 0) / totalAudits)
      : null;
  const highestScore =
    totalAudits > 0
      ? Math.max(...userAnalyses.map((a) => a.atsScore || 0))
      : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My Profile & Tested Resumes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
          View your verified account profile, career focus, and complete personal testing history.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xl flex items-center justify-center shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {user?.name || 'Registered Candidate'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Member since {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {onNavigateToAnalyze && (
          <Button
            size="sm"
            onClick={onNavigateToAnalyze}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
          >
            Test New Resume
          </Button>
        )}
      </div>

      {/* TESTED RESUMES & SCORE HISTORY (User-Isolated Data) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Your Tested Resumes & Score History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strictly showing resumes and ATS audit reports tested under your account.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-fit">
            {userResumes.length} {userResumes.length === 1 ? 'Resume' : 'Resumes'} Tested
          </span>
        </div>

        {/* 4 User Performance Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Resumes Stored</span>
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-1 block">
              {userResumes.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Analyses Run</span>
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-1 block">
              {totalAudits}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Avg ATS Score</span>
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white mt-1 block">
              {avgScore !== null ? `${avgScore}%` : '—'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Best ATS Score</span>
            <span className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 mt-1 block">
              {highestScore !== null ? `${highestScore}%` : '—'}
            </span>
          </div>
        </div>

        {/* Tested Resumes List */}
        {isLoadingData ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-2 dark:border-slate-700 dark:border-t-white" />
            Loading your tested resumes...
          </div>
        ) : userResumes.length === 0 ? (
          <div className="py-10 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Resumes Tested Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Upload your resume and test it against target job descriptions to see your scores and recommendations recorded here.
              </p>
            </div>
            {onNavigateToAnalyze && (
              <Button size="sm" onClick={onNavigateToAnalyze} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Test Your First Resume
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tested Files ({userResumes.length})
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
              {userResumes.map((resume) => {
                // Find matching analysis for this resume if exists
                const matchingAnalysis = userAnalyses.find(
                  (a) => a.resumeId === resume.id || a.resumeFileName === resume.fileName
                );
                const score = resume.lastScore || matchingAnalysis?.atsScore;

                return (
                  <div
                    key={resume.id}
                    className="p-4 bg-white dark:bg-slate-900 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {resume.fileName}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Tested {formatDate(resume.uploadedAt)}</span>
                          {matchingAnalysis && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[200px]">Target: {matchingAnalysis.jobTitle}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      {score !== undefined && score !== null ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold">
                          <span
                            className={
                              score >= 80
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : score >= 65
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }
                          >
                            {score}% ATS
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Awaiting Test</span>
                      )}

                      {matchingAnalysis && onNavigateToAnalysis ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onNavigateToAnalysis(matchingAnalysis.id)}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          View Report
                        </Button>
                      ) : onNavigateToAnalyze ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onNavigateToAnalyze}
                        >
                          Test Against Job
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Profile Details Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Personal & Career Information
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            This information customizes AI suggestions according to your targeted seniority.
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              helperText="Account primary email (verified)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Target Role"
              placeholder="e.g. Software Engineer, Product Manager"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
            <Input
              label="Preferred Industry"
              placeholder="e.g. Technology, Finance, Healthcare"
              value={preferredIndustry}
              onChange={(e) => setPreferredIndustry(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isUpdatingProfile}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Change Password
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ensure your account is protected with a secure password.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <Input
            label="Current Password"
            type="password"
            showPasswordToggle
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            type="password"
            showPasswordToggle
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            showPasswordToggle
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="secondary" isLoading={isUpdatingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
