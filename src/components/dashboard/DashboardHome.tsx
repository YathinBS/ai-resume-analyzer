import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Layers,
  ChevronRight,
  Clock,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Analysis } from '../../types';
import { Button } from '../ui/Button';

interface DashboardHomeProps {
  onNavigate: (tab: string, analysisId?: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalResumes: 0,
    avgAtsScore: 0,
    avgJobMatch: 0,
    skillsImproved: 0,
  });
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, analysesData] = await Promise.all([
          api.getStats().catch(() => ({ totalAnalyses: 0, totalResumes: 0, avgAtsScore: 0, avgJobMatch: 0, skillsImproved: 0 })),
          api.getAnalysisHistory().catch(() => []),
        ]);
        setStats(statsData);
        if (analysesData && analysesData.length > 0) {
          setRecentAnalyses(analysesData.slice(0, 4));
        } else {
          setRecentAnalyses([]);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      label: 'Resumes Analyzed',
      value: stats.totalAnalyses.toString(),
      trend: stats.totalAnalyses > 0 ? `${stats.totalAnalyses} audits conducted` : 'No checks yet',
      icon: <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      label: 'Average ATS Score',
      value: stats.totalAnalyses > 0 ? `${stats.avgAtsScore}%` : '—',
      trend: stats.totalAnalyses > 0 ? (stats.avgAtsScore >= 80 ? 'Optimal score range' : 'Improvements needed') : 'Awaiting first analysis',
      icon: <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      label: 'Average Job Match',
      value: stats.totalAnalyses > 0 ? `${stats.avgJobMatch}%` : '—',
      trend: stats.totalAnalyses > 0 ? (stats.avgJobMatch >= 85 ? 'Strong alignment' : 'Moderate alignment') : 'Awaiting job comparison',
      icon: <FileCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      label: 'Actionable Suggestions',
      value: stats.skillsImproved.toString(),
      trend: stats.skillsImproved > 0 ? `${stats.skillsImproved} recommendations` : 'Generated on analysis',
      icon: <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Engineer'} 👋
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Let's improve your resume and get you closer to your next opportunity.
          </p>
        </div>
        <div className="shrink-0">
          <Button
            size="md"
            onClick={() => onNavigate('analyze')}
            leftIcon={<Sparkles className="w-4 h-4 text-indigo-400" />}
          >
            Analyze New Resume
          </Button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.label}
              </span>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                {card.icon}
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight tabular-nums">
                {card.value}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                {card.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Analyses Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Resume Audits
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Access your previous ATS analyses, score breakdowns, and recommendations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentAnalyses.length === 0 && !isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">No analyses yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Upload your first resume and compare it against target roles to see complete ATS insights.
            </p>
            <div className="pt-2">
              <Button size="sm" onClick={() => onNavigate('analyze')}>
                Analyze First Resume
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentAnalyses.map((a) => (
              <div
                key={a.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {a.jobTitle}
                    </h3>
                    {a.isDemo && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Demo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[200px]">{a.resumeFileName}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">ATS Score</span>
                    <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {a.atsScore}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Job Match</span>
                    <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {a.jobMatchScore}%
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigate('analysis-detail', a.id)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
