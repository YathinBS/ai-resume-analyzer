import React from 'react';
import {
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AnalysisMockupProps {
  onSignIn?: () => void;
  onGetStarted?: () => void;
}

export const AnalysisMockup: React.FC<AnalysisMockupProps> = ({
  onSignIn,
  onGetStarted,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Top Header Mockup Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>ATS Intelligence Engine</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] font-medium text-amber-700 dark:text-amber-400">
          <Lock className="w-3 h-3" />
          <span>Login Required for Live Score</span>
        </div>
      </div>

      {/* Preview Card Content */}
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Candidate Intelligence</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Resume Score Overview & Skill Breakdown Board
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Create an account or sign in to upload your resume. Your scores, keyword matches, and personalized skill breakdowns are strictly private to your verified profile.
          </p>
        </div>

        {/* 3 Core Breakdown Pillars Preview */}
        <div className="space-y-2.5">
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  ATS Compatibility Score & Job Match
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Calculated against your specific target role description
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0 font-medium">
              [🔒 Locked]
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Skill Gap & Missing Keywords Detection
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Exact terminology recruiters and ATS filters search for
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0 font-medium">
              [🔒 Locked]
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Actionable Bullet Point Rewrites
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Quantified metric improvements and high-impact phrasing
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0 font-medium">
              [🔒 Locked]
            </span>
          </div>
        </div>

        {/* CTA Unlock Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button
            size="md"
            className="w-full sm:w-auto flex-1"
            onClick={onSignIn}
            leftIcon={<Lock className="w-4 h-4" />}
          >
            Sign In to Unlock Board
          </Button>
          <Button
            size="md"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onGetStarted}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Free Account
          </Button>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            100% Private Candidate Isolation
          </span>
          <span>Encrypted JWT Sessions</span>
        </div>
      </div>
    </div>
  );
};
