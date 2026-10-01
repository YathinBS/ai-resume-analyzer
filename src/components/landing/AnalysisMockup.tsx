import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { ThinkingOrb } from '../ui/ThinkingOrb';

export const AnalysisMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'suggestions'>('overview');
  const [atsScore, setAtsScore] = useState(0);
  const [jobMatch, setJobMatch] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAtsScore(87);
      setJobMatch(91);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Top Header Mockup Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800">
            <ThinkingOrb state="searching" size={20} />
            <span>AI Thinking Engine</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ATS Verified</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Score Overview
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'skills'
              ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Skills Breakdown (18/21)
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'suggestions'
              ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          High-Impact Fixes (7)
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Metric Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">ATS Score</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {atsScore}%
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">Top 8% Tier</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Job Match</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {jobMatch}%
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium block mt-0.5">Strong Alignment</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Skills Matched</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  18<span className="text-xs text-slate-400 font-normal">/21</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">3 missing skills</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Suggestions</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  7
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block mt-0.5">Actionable fixes</span>
              </div>
            </div>

            {/* Quick Preview Progress */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Keyword Parity</span>
                <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">91%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: '91%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Experience Impact Metrics</span>
                <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">82%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block mb-1.5">
                Matched In Target Job (18)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'REST APIs', 'AWS', 'Redis', 'Git'].map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block mb-1.5">
                Missing Keywords (3)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Kubernetes', 'Celery', 'GraphQL'].map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Add Measurable Impact</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">+5% Score</span>
              </div>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <p className="line-through text-slate-400">"Developed a REST API using FastAPI."</p>
                <p className="font-medium text-slate-900 dark:text-white flex items-start gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>"Developed a FastAPI REST API that reduced request processing time by 42% through async I/O."</span>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Inject Missing Skill: Kubernetes</span>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">+6% Match</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Mention staging environment deployment or Minikube containerization under your recent CloudScale role.
              </p>
            </div>
          </div>
        )}

        {/* Live CTA button on mockup */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Analyzed with Gemini 3.8 Flash
          </span>
          <span className="font-mono text-slate-600 dark:text-slate-300">0.8s latency</span>
        </div>
      </div>
    </div>
  );
};
