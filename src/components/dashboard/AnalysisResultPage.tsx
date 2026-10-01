import React, { useEffect, useState } from 'react';
import { Analysis } from '../../types';
import { api } from '../../lib/api';
import { ScoreCircle } from '../ui/ScoreCircle';
import { ProgressBar } from '../ui/ProgressBar';
import { RecommendationCard } from '../ui/RecommendationCard';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Copy,
  Layers,
  Search,
  Check,
  Zap,
} from 'lucide-react';

interface AnalysisResultPageProps {
  analysisId: string;
  onBack: () => void;
  onAnalyzeAnother: () => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({
  analysisId,
  onBack,
  onAnalyzeAnother,
}) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function loadAnalysis() {
      setIsLoading(true);
      try {
        if (analysisId === 'demo') {
          const demo = await api.getDemoAnalysis();
          setAnalysis(demo);
        } else {
          const data = await api.getAnalysis(analysisId);
          setAnalysis(data);
        }
      } catch (err: any) {
        toast.error('Failed to load analysis results');
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalysis();
  }, [analysisId]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto dark:border-slate-800 dark:border-t-white" />
        <p className="text-sm text-slate-500">Loading comprehensive resume intelligence...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-sm text-slate-500">Analysis could not be found.</p>
        <Button onClick={onBack}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(analysis.executiveSummary);
      setCopiedSummary(true);
      toast.success('Executive summary copied to clipboard');
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch (e) {
      toast.error('Unable to copy');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalImportantSkills = (analysis.matchedSkills?.length || 0) + (analysis.missingSkills?.length || 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 print:p-0 print:m-0">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-1 print:hidden"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Resume Analysis Results
            </h1>
            {analysis.isDemo && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Sample Report
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Target Role: <span className="font-semibold text-slate-900 dark:text-slate-200">{analysis.jobTitle}</span> · Resume: <span className="font-mono">{analysis.resumeFileName}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopySummary}
            leftIcon={copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedSummary ? 'Copied' : 'Copy Summary'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Export / Print
          </Button>
          <Button
            size="sm"
            onClick={onAnalyzeAnother}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Analyze Another Job
          </Button>
        </div>
      </div>

      {/* Top 4 Circular Score Overviews */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          <ScoreCircle
            score={analysis.atsScore}
            label="ATS Compatibility"
            sublabel="Formatting & Parseability"
            colorScheme="emerald"
          />
          <ScoreCircle
            score={analysis.jobMatchScore}
            label="Job Match Score"
            sublabel="Target Role Alignment"
            colorScheme="indigo"
          />
          <ScoreCircle
            score={analysis.keywordScore}
            label="Keyword Optimization"
            sublabel="Vocabulary & Term Density"
            colorScheme="primary"
          />
          <ScoreCircle
            score={analysis.skillScore}
            label="Skills Match"
            sublabel="Tech Stack Overlap"
            colorScheme="amber"
          />
        </div>

        {/* Executive Summary */}
        {analysis.executiveSummary && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-4 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              Executive Evaluation Summary:
            </span>
            {analysis.executiveSummary}
          </div>
        )}
      </div>

      {/* Section 8: RESUME SCORE BREAKDOWN */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Resume Score Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Granular breakdown of evaluation criteria evaluated against modern applicant tracking systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <ProgressBar
            label="ATS Compatibility"
            score={analysis.scoreBreakdown?.atsCompatibility?.score || analysis.atsScore}
            explanation={analysis.scoreBreakdown?.atsCompatibility?.explanation}
            status={analysis.scoreBreakdown?.atsCompatibility?.status || 'excellent'}
          />
          <ProgressBar
            label="Content Quality"
            score={analysis.scoreBreakdown?.contentQuality?.score || 82}
            explanation={analysis.scoreBreakdown?.contentQuality?.explanation}
            status={analysis.scoreBreakdown?.contentQuality?.status || 'good'}
          />
          <ProgressBar
            label="Keyword Optimization"
            score={analysis.scoreBreakdown?.keywordOptimization?.score || analysis.keywordScore}
            explanation={analysis.scoreBreakdown?.keywordOptimization?.explanation}
            status={analysis.scoreBreakdown?.keywordOptimization?.status || 'excellent'}
          />
          <ProgressBar
            label="Formatting & Layout"
            score={analysis.scoreBreakdown?.formatting?.score || 90}
            explanation={analysis.scoreBreakdown?.formatting?.explanation}
            status={analysis.scoreBreakdown?.formatting?.status || 'excellent'}
          />
          <ProgressBar
            label="Experience Relevance"
            score={analysis.scoreBreakdown?.experienceRelevance?.score || analysis.jobMatchScore}
            explanation={analysis.scoreBreakdown?.experienceRelevance?.explanation}
            status={analysis.scoreBreakdown?.experienceRelevance?.status || 'good'}
          />
          <ProgressBar
            label="Skills Match"
            score={analysis.scoreBreakdown?.skillsMatch?.score || analysis.skillScore}
            explanation={analysis.scoreBreakdown?.skillsMatch?.explanation}
            status={analysis.scoreBreakdown?.skillsMatch?.status || 'excellent'}
          />
        </div>
      </div>

      {/* Section 10: SKILL GAP ANALYSIS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Skill Gap Analysis
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparison between your verified skills and target job technical requirements.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            Matches {analysis.matchedSkills?.length || 18} of {totalImportantSkills || 21} important skills
          </div>
        </div>

        {/* Matched Skills */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Matched Skills ({analysis.matchedSkills?.length || 0})
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis.matchedSkills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Missing Skills ({analysis.missingSkills?.length || 0})
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Skills */}
        {analysis.recommendedSkills && analysis.recommendedSkills.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Recommended High-Leverage Additions
            </span>
            <div className="flex flex-wrap gap-2">
              {analysis.recommendedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 11: KEYWORD OPTIMIZATION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Keyword Optimization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ATS engines parse and score specific vocabulary keywords. Understand exactly why this score was generated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Matched Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.keywords?.matched?.map((kw) => (
                <span
                  key={kw}
                  className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Missing High-Value Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.keywords?.missing?.map((kw) => (
                <span
                  key={kw}
                  className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-100/60 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Overused / Passive Phrasing
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.keywords?.overused?.map((kw) => (
                <span
                  key={kw}
                  className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 9: AI FEEDBACK: Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Verified Strengths
            </h2>
          </div>
          <ul className="space-y-2.5">
            {analysis.strengths?.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Areas to Improve
            </h2>
          </div>
          <ul className="space-y-2.5">
            {analysis.areasToImprove?.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 12: RESUME IMPROVEMENT RECOMMENDATIONS CARDS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Actionable Bullet Improvements ({analysis.recommendations?.length || 0})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Generated based on your actual resume experience and the target job description.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {analysis.recommendations?.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </div>
    </div>
  );
};
