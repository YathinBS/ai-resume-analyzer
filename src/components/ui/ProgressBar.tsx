import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  label: string;
  score: number;
  explanation?: string;
  status?: 'excellent' | 'good' | 'warning' | 'needs-improvement';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  score,
  explanation,
  status = 'good',
}) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  const statusConfig = {
    excellent: {
      bar: 'bg-emerald-500 dark:bg-emerald-400',
      label: 'Optimal',
      text: 'text-emerald-700 dark:text-emerald-300',
    },
    good: {
      bar: 'bg-indigo-500 dark:bg-indigo-400',
      label: 'Good',
      text: 'text-indigo-700 dark:text-indigo-300',
    },
    warning: {
      bar: 'bg-amber-500 dark:bg-amber-400',
      label: 'Moderate',
      text: 'text-amber-700 dark:text-amber-300',
    },
    'needs-improvement': {
      bar: 'bg-rose-500 dark:bg-rose-400',
      label: 'Needs Work',
      text: 'text-rose-700 dark:text-rose-300',
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="space-y-1.5 py-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{label}</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">·</span>
          <span className={`text-[11px] font-medium ${currentStatus.text}`}>{currentStatus.label}</span>
        </div>
        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
          {score}%
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${currentStatus.bar}`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
      {explanation && (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {explanation}
        </p>
      )}
    </div>
  );
};
