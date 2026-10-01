import React from 'react';
import { ThinkingOrb as BaseThinkingOrb, OrbState, OrbSize } from 'thinking-orbs';
import { useTheme } from '../../context/ThemeContext';

export type { OrbState, OrbSize };

export interface ThinkingOrbProps {
  /**
   * One of nine hand-tuned animated states:
   * - "working"    — particles on tilted orbits
   * - "searching"  — a scan meridian sweeps a dotted globe
   * - "solving"    — bands scramble in quarter turns, then click back
   * - "listening"  — a waveform rolls through latitude rings
   * - "connecting" — a constellation wires itself, packets running the edges
   * - "weaving"    — three strands plait around the sphere
   * - "composing"  — an undulating multi-band sash
   * - "breathing"  — a face-on ring slowly morphing
   * - "shaping"    — a dotted outline morphs circle → triangle → square
   */
  state?: "working" | "searching" | "solving" | "listening" | "connecting" | "weaving" | "composing" | "breathing" | "shaping";
  /** 64 (chat-avatar scale) or 20 (inline-text scale) — each is separately tuned */
  size?: 64 | 20 | 32;
  /** Multiplies the animation clock, default 1 */
  speed?: number;
  /** Picks light or dark tuning. Defaults to active app theme if omitted */
  dark?: boolean;
  /** Freezes the animation */
  paused?: boolean;
  /** Optional custom ink color tint (e.g. '#6366f1') */
  color?: string;
  className?: string;
}

export const ThinkingOrb: React.FC<ThinkingOrbProps> = ({
  state = 'working',
  size = 64,
  speed = 1,
  dark,
  paused = false,
  color,
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = dark !== undefined ? dark : theme === 'dark';

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <BaseThinkingOrb
        state={state as OrbState}
        size={size as OrbSize}
        theme={isDark ? 'dark' : 'light'}
        speed={speed}
        paused={paused}
        color={color}
      />
    </div>
  );
};
