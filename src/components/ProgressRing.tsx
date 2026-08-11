import { useId } from 'react';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0..1
  from: string;
  to: string;
  emoji: string;
  label: string;
  sublabel: string;
  onClick?: () => void;
}

export function ProgressRing({
  size = 78,
  strokeWidth = 9,
  progress,
  from,
  to,
  emoji,
  label,
  sublabel,
  onClick,
}: ProgressRingProps) {
  const gradId = useId();
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <button type="button" className="ring ring-clickable" onClick={onClick}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(0, 0, 0, 0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={clamped > 0 ? `url(#${gradId})` : 'rgba(0, 0, 0, 0.08)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="ring-emoji">{emoji}</span>
      <span className="ring-label">{label}</span>
      <span className="ring-sublabel">{sublabel}</span>
    </button>
  );
}
