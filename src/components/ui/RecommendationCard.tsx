import React, { useState } from 'react';
import { Recommendation } from '../../types';
import { Copy, Check, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recommendation.suggestedImprovement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const categoryColors: Record<string, string> = {
    'Impact & Metrics': 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    'Keywords & ATS': 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    'Formatting & Structure': 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    'Experience Relevance': 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    'Grammar & Clarity': 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
  };

  const badgeStyle = categoryColors[recommendation.category] || 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
            {recommendation.category}
          </span>
          {recommendation.impactScore && (
            <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
              {recommendation.impactScore}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
          title="Copy suggested bullet point"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Suggestion</span>
            </>
          )}
        </button>
      </div>

      {/* Problem & Why it matters */}
      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Problem: <span className="font-normal text-slate-700 dark:text-slate-300">{recommendation.problem}</span>
            </h4>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 pl-6 leading-relaxed">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Why it matters: </span>
          {recommendation.whyItMatters}
        </p>
      </div>

      {/* Comparison: Current vs Suggested */}
      <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        {recommendation.currentBullet && (
          <div className="rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
              Current phrasing
            </span>
            <p className="text-slate-700 dark:text-slate-300 italic">"{recommendation.currentBullet}"</p>
          </div>
        )}

        <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-3 text-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
              Suggested AI Improvement
            </span>
          </div>
          <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            "{recommendation.suggestedImprovement}"
          </p>
        </div>
      </div>
    </div>
  );
};
