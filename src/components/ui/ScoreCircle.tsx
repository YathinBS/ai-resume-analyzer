import React, { useEffect, useState } from 'react';

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  sublabel?: string;
  colorScheme?: 'primary' | 'emerald' | 'indigo' | 'amber';
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  maxScore = 100,
  label,
  size = 130,
  strokeWidth = 9,
  sublabel,
  colorScheme = 'primary',
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / maxScore) * circumference;

  const colorStyles = {
    primary: 'text-slate-900 dark:text-white',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    amber: 'text-amber-600 dark:text-amber-400',
  };

  const getScoreBadge = (val: number) => {
    if (val >= 85) return 'Excellent';
    if (val >= 75) return 'Competitive';
    if (val >= 60) return 'Average';
    return 'Needs Work';
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorStyles[colorScheme]} transition-all duration-300 ease-out`}
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            {animatedScore}
            <span className="text-sm font-normal text-slate-400 dark:text-slate-500">/{maxScore}</span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
            {getScoreBadge(score)}
          </span>
        </div>
      </div>
      <div className="mt-2.5">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">{label}</h4>
        {sublabel && <p className="text-[11px] text-slate-500 dark:text-slate-400">{sublabel}</p>}
      </div>
    </div>
  );
};
