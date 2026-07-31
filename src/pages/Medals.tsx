import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { calculateFreeTimeInDays, calculateCigsAvoided } from '../core/utils/calculations';
import { ArrowLeft, Trophy } from 'lucide-react';

const MEDALS = [
  { id: 1, target: 20 },
  { id: 2, target: 40 },
  { id: 3, target: 60 },
  { id: 4, target: 80 },
  { id: 5, target: 100 },
  { id: 6, target: 120 },
  { id: 7, target: 140 },
  { id: 8, target: 160 },
  { id: 9, target: 180 },
  { id: 10, target: 200 },
  { id: 11, target: 300 },
  { id: 12, target: 500 },
  { id: 13, target: 1000 },
];

function Medal({ target, unlocked }: { target: number; unlocked: boolean }) {
  return (
    <div className={`medal ${unlocked ? 'medal-gold' : ''}`}>
      <svg viewBox="0 0 64 64" width="48" height="48">
        <path
          d="M22 12 L27 22 L32 12 L37 22 L42 12"
          fill={unlocked ? '#EF5350' : '#B0BEC5'}
          stroke={unlocked ? '#C62828' : '#90A4AE'}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle
          cx="32"
          cy="41"
          r="17"
          fill={unlocked ? '#FFD700' : '#B0BEC5'}
          stroke={unlocked ? '#B8860B' : '#78909C'}
          strokeWidth="3"
        />
        <circle
          cx="32"
          cy="41"
          r="12.5"
          fill="none"
          stroke={unlocked ? '#B8860B' : '#90A4AE'}
          strokeWidth="1.5"
        />
        {unlocked && (
          <>
            <text x="32" y="45" textAnchor="middle" fontSize="11" fontWeight="900" fill="#7B5200" fontFamily="Arial, sans-serif">✓</text>
            <path d="M47 16 L48.5 20 L52.5 21.5 L48.5 23 L47 27 L45.5 23 L41.5 21.5 L45.5 20 Z" fill="#FFE082" />
            <path d="M16 10 L17 12.5 L19.5 13.5 L17 14.5 L16 17 L15 14.5 L12.5 13.5 L15 12.5 Z" fill="#FFF9C4" />
          </>
        )}
      </svg>
      <span className={`medal-number ${unlocked ? 'medal-number-gold' : ''}`}>{target}</span>
      <span className="medal-label">cigarros</span>
    </div>
  );
}

export default function Medals() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);
  const [cigs, setCigs] = useState(0);

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);

    const update = () => {
      const freeDays = calculateFreeTimeInDays(startDate, new Date());
      setCigs(Math.floor(calculateCigsAvoided(freeDays, profile.cigsPerDay)));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [profile]);

  const unlockedCount = MEDALS.filter((m) => cigs >= m.target).length;

  return (
    <div className="medals-page">
      <div className="medals-header">
        <button className="medals-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="medals-title">Medallero</h1>
        <div className="medals-count">
          <Trophy size={18} />
          <span>{unlockedCount}/{MEDALS.length}</span>
        </div>
      </div>

      <p className="medals-subtitle">
        Gana medallas doradas por cada meta de cigarros no fumados. Has evitado <strong>{cigs}</strong> hasta ahora.
      </p>

      <div className="medals-grid">
        {MEDALS.map((medal) => (
          <Medal
            key={medal.id}
            target={medal.target}
            unlocked={cigs >= medal.target}
          />
        ))}
      </div>
    </div>
  );
}
