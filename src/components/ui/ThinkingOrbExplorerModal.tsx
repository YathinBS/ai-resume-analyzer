import React, { useState } from 'react';
import { ThinkingOrb, OrbState } from './ThinkingOrb';
import { Modal } from './Modal';
import { Button } from './Button';
import { Play, Pause, Sun, Moon, Gauge, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThinkingOrbExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_STATES: { state: OrbState; label: string; description: string }[] = [
  { state: 'working', label: 'Working', description: 'Particles on tilted orbits' },
  { state: 'searching', label: 'Searching', description: 'A scan meridian sweeps a dotted globe' },
  { state: 'solving', label: 'Solving', description: 'Bands scramble in quarter turns, then click back' },
  { state: 'listening', label: 'Listening', description: 'A waveform rolls through latitude rings' },
  { state: 'connecting', label: 'Connecting', description: 'A constellation wires itself, packets running edges' },
  { state: 'weaving', label: 'Weaving', description: 'Three strands plait around the sphere' },
  { state: 'composing', label: 'Composing', description: 'An undulating multi-band sash' },
  { state: 'breathing', label: 'Breathing', description: 'A face-on ring slowly morphing' },
  { state: 'shaping', label: 'Shaping', description: 'Dotted outline morphs circle → triangle → square' },
];

export const ThinkingOrbExplorerModal: React.FC<ThinkingOrbExplorerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedState, setSelectedState] = useState<OrbState>('searching');
  const [size, setSize] = useState<64 | 20>(64);
  const [speed, setSpeed] = useState<number>(1);
  const [paused, setPaused] = useState<boolean>(false);
  const [forceDark, setForceDark] = useState<boolean | undefined>(undefined);

  const activeThemeDark = forceDark !== undefined ? forceDark : theme === 'dark';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Libraries.dev ThinkingOrb Explorer"
      description="Nine hand-tuned particle physics animation states designed for AI thinking states."
      maxWidth="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Main Preview Stage */}
        <div className={`rounded-2xl p-8 border flex flex-col items-center justify-center transition-colors relative overflow-hidden ${
          activeThemeDark
            ? 'bg-slate-950 border-slate-800 text-white'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className="flex flex-col items-center justify-center min-h-[140px] gap-4">
            <ThinkingOrb
              state={selectedState}
              size={size}
              speed={speed}
              dark={activeThemeDark}
              paused={paused}
            />

            <div className="text-center">
              <span className="font-mono text-sm font-bold tracking-tight px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                state="{selectedState}" · size={size}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {ALL_STATES.find((s) => s.state === selectedState)?.description}
              </p>
            </div>
          </div>

          {/* Quick controls bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 mt-2 border-t border-slate-200/50 dark:border-slate-800/80 w-full text-xs">
            {/* Size Switcher */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSize(64)}
                className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
                  size === 64
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                64px (Avatar)
              </button>
              <button
                onClick={() => setSize(20)}
                className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
                  size === 20
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                20px (Inline)
              </button>
            </div>

            {/* Pause / Play */}
            <button
              onClick={() => setPaused(!paused)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              {paused ? <Play className="w-3.5 h-3.5 text-emerald-500" /> : <Pause className="w-3.5 h-3.5 text-amber-500" />}
              <span>{paused ? 'Resume' : 'Pause'}</span>
            </button>

            {/* Dark / Light toggle */}
            <button
              onClick={() => setForceDark(!activeThemeDark)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              {activeThemeDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>{activeThemeDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>

            {/* Speed slider */}
            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-mono text-[11px]">{speed}x</span>
              <input
                type="range"
                min="0.25"
                max="2.5"
                step="0.25"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-16 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 9 Hand-tuned State Selectors Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Select Hand-Tuned State</span>
            <span className="font-mono text-[11px] font-normal text-slate-400">9 animations available</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {ALL_STATES.map((item) => {
              const isSelected = selectedState === item.state;
              return (
                <button
                  key={item.state}
                  onClick={() => setSelectedState(item.state)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <ThinkingOrb
                      state={item.state}
                      size={20}
                      dark={theme === 'dark'}
                      paused={!isSelected}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold capitalize">{item.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 text-xs font-mono text-slate-300 space-y-1 overflow-x-auto">
          <div className="text-[11px] text-slate-500">{'// Quick usage'}</div>
          <div>
            <span className="text-pink-400">import</span> {'{'} <span className="text-amber-300">ThinkingOrb</span> {'}'}{' '}
            <span className="text-pink-400">from</span> <span className="text-emerald-400">'thinking-orbs'</span>;
          </div>
          <div className="text-slate-400 pt-1">
            {'<'}<span className="text-indigo-400">ThinkingOrb</span> <span className="text-sky-300">state</span>=<span className="text-emerald-400">"{selectedState}"</span> <span className="text-sky-300">size</span>={'{'}<span className="text-amber-300">{size}</span>{'}'} <span className="text-sky-300">speed</span>={'{'}<span className="text-amber-300">{speed}</span>{'}'} {paused ? 'paused ' : ''}{'/>'}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Explorer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
