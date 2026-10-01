import React, { useEffect, useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Target,
  Sparkles,
  History,
  Lock,
  Zap,
  ArrowRight,
  Upload,
  Search,
  CheckCircle,
  FileCheck2,
  ChevronRight,
  Layers,
  Cpu,
} from 'lucide-react';
import { AnalysisMockup } from './AnalysisMockup';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onExploreDemo,
}) => {
  const [publicStats, setPublicStats] = useState({
    resumesChecked: 1,
    resumesStored: 1,
    avgAtsScore: 87,
    skillsEvaluated: 21,
    aiEngine: 'Gemini 3.8 Flash',
  });

  useEffect(() => {
    api.getPublicStats()
      .then((data) => {
        if (data) setPublicStats(data);
      })
      .catch((err) => console.warn('Could not fetch public stats', err));
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: 'AI Resume Analysis',
      description: 'Analyze your resume with intelligent models evaluating engineering depth, metric density, and grammar.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'ATS Compatibility',
      description: 'Identify formatting traps, table parsing issues, and keyword optimization opportunities before recruiters see it.',
    },
    {
      icon: <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: 'Job Match Score',
      description: 'Benchmark your real experience against specific target job descriptions with concrete percentage parity.',
    },
    {
      icon: <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Skill Gap Analysis',
      description: 'Pinpoint missing technical frameworks, tools, and domain proficiencies required by your dream role.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      title: 'Resume Suggestions',
      description: 'Actionable bullet-point rewrites with measurable outcomes, active technical verbs, and 1-click copying.',
    },
    {
      icon: <History className="w-5 h-5 text-slate-700 dark:text-slate-300" />,
      title: 'Analysis History',
      description: 'Maintain a persistent historical archive of all analyzed roles and re-evaluate resumes as positions evolve.',
    },
    {
      icon: <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      title: 'Secure Authentication',
      description: 'Enterprise-grade JWT authentication and encrypted session management keeping your data private.',
    },
    {
      icon: <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      title: 'Fast API Processing',
      description: 'Sub-second asynchronous backend request handling and text parsing designed for high throughput.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Resume',
      desc: 'Upload your PDF or DOCX resume, or paste plain text directly into our secure parser.',
      icon: <Upload className="w-5 h-5 text-slate-900 dark:text-white" />,
    },
    {
      number: '02',
      title: 'Add Job Description',
      desc: "Paste the exact job description you're targeting or choose from curated industry briefs.",
      icon: <FileText className="w-5 h-5 text-slate-900 dark:text-white" />,
    },
    {
      number: '03',
      title: 'AI Analysis',
      desc: 'Our intelligence pipeline audits your background, ATS compatibility, and keyword density.',
      icon: <Search className="w-5 h-5 text-slate-900 dark:text-white" />,
    },
    {
      number: '04',
      title: 'Improve & Apply',
      desc: 'Apply targeted bullet point rewrites, fill skill gaps, and apply with high confidence.',
      icon: <FileCheck2 className="w-5 h-5 text-slate-900 dark:text-white" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>AI-Powered Resume Intelligence</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
                Turn Your Resume Into a <span className="underline decoration-slate-300 dark:decoration-slate-700 underline-offset-8">Job-Winning</span> Resume.
              </h1>

              {/* Supporting text */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                Upload your resume, add a target job description, and get AI-powered insights, ATS analysis, skill-gap detection, and personalized improvement recommendations.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={onGetStarted}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Analyze My Resume
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  See How It Works
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={onExploreDemo}
                >
                  Explore Sample Analysis
                </Button>
              </div>

              {/* Feature Highlights */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Real-time ATS & keyword scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Supports PDF & DOCX formats</span>
                </div>
              </div>
            </div>

            {/* Right Hero Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <AnalysisMockup />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 border-b border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Straightforward Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How ResumeAI Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              From uploading your document to receiving surgical, tailored interview-ready rewrites in under 60 seconds.
            </p>
          </div>

          {/* Timeline: Desktop horizontal, Mobile vertical */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((s, idx) => (
              <div
                key={s.number}
                className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-700">
                      {s.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {s.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                      {s.desc}
                    </p>
                  </div>
                </div>

                {idx < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Built for Technical Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Intelligent Tools for Top-Tier Candidates
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Comprehensive auditing across ATS parseability, technical keyword parity, and quantitative impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Platform Live Data Section */}
      <section className="py-16 bg-slate-900 text-white dark:bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Live Verified Activity
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white block tabular-nums">
                {publicStats.resumesChecked}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Resumes Checked</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white block tabular-nums">
                {publicStats.resumesStored}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Uploaded Resumes</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white block tabular-nums">
                {publicStats.avgAtsScore > 0 ? `${publicStats.avgAtsScore}%` : '—'}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Average ATS Compatibility</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">
                {publicStats.aiEngine}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Active AI Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 text-center bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Ready to Land More Engineering Interviews?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
            Stop guessing why recruiters aren't responding. Run your resume through our automated intelligence suite now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" onClick={onGetStarted}>
              Get Started for Free
            </Button>
            <Button size="lg" variant="outline" onClick={onSignIn}>
              Sign In to Your Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm">ResumeAI</span>
            <span>·</span>
            <span>AI Resume Intelligence & ATS Optimization Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <span>© 2026 ResumeAI Inc. All rights reserved.</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-900 dark:hover:text-white">
              Back to top
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
