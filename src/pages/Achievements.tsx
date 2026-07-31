import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { differenceInMinutes } from 'date-fns';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { StarIcon, SunIcon } from '../components/CartoonIcons';

interface Achievement {
  id: number;
  kind: 'star' | 'sun';
  count: number;
  hours: number;
}

const STAR_COLORS = ['#FF5A79', '#4FC3F7', '#FFB703', '#8E44AD', '#2ECC71', '#FF6B35', '#00BCD4', '#E91E63', '#7E57C2', '#26A69A'];

const buildAchievements = (): Achievement[] => {
  const list: Achievement[] = [];
  let id = 0;

  let h = 1;
  list.push({ id: id++, kind: 'star', count: 1, hours: h });
  h = 3;
  while (h < 24) {
    list.push({ id: id++, kind: 'star', count: 1, hours: h });
    h += 3;
  }

  let stars = 2;
  h = 24;
  while (stars <= 5) {
    list.push({ id: id++, kind: 'star', count: stars, hours: h });
    stars += 1;
    h += 48;
  }

  h = 216;
  let suns = 1;
  const maxHours = 365.25 * 24;
  while (h <= maxHours) {
    list.push({ id: id++, kind: 'sun', count: suns, hours: h });
    suns += 1;
    h += 168;
  }

  return list;
};

const ACHIEVEMENTS = buildAchievements();

const formatTime = (hours: number): string => {
  if (hours < 24) return hours === 1 ? '1 hora' : `${hours} horas`;
  const days = hours / 24;
  if (days % 7 === 0) {
    const w = days / 7;
    return w === 1 ? '1 semana' : `${w} semanas`;
  }
  return days === 1 ? '1 día' : `${days} días`;
};

export default function Achievements() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);
  const [elapsedHours, setElapsedHours] = useState(0);

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);

    const update = () => {
      setElapsedHours(differenceInMinutes(new Date(), startDate) / 60);
    };

    update();
    const interval = setInterval(update, 60 * 1000);
    return () => clearInterval(interval);
  }, [profile]);

  const currentIndex = ACHIEVEMENTS.reduce(
    (acc, a, i) => (elapsedHours >= a.hours ? i : acc),
    -1
  );
  const current = currentIndex >= 0 ? ACHIEVEMENTS[currentIndex] : null;
  const next = ACHIEVEMENTS[currentIndex + 1] ?? null;

  const progress = current && next
    ? Math.min(((elapsedHours - current.hours) / (next.hours - current.hours)) * 100, 100)
    : current
      ? 100
      : Math.min((elapsedHours / (ACHIEVEMENTS[0]?.hours ?? 1)) * 100, 100);

  const renderSymbol = (a: Achievement, size: number) => {
    const icons = [];
    for (let j = 0; j < a.count; j++) {
      if (a.kind === 'star') {
        const color = STAR_COLORS[(a.id * 3 + j) % STAR_COLORS.length];
        icons.push(<StarIcon key={j} size={size} color={color} />);
      } else {
        icons.push(<SunIcon key={j} size={size} />);
      }
    }
    return icons;
  };

  return (
    <div className="ach-page">
      <div className="ach-header">
        <button className="health-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="health-title">Logros Alcanzados</h1>
      </div>

      <p className="health-subtitle" style={{ textAlign: 'center' }}>
        Cada estrella y sol representa tiempo de libertad. ¡Seguí sumando!
      </p>

      <div className="ach-current-card">
        <span className="ach-current-label">
          {current ? 'Tu logro actual' : 'Primer logro en camino'}
        </span>
        <div className="ach-current-symbols">
          {current ? (
            renderSymbol(current, 40)
          ) : (
            <StarIcon size={40} color={STAR_COLORS[0]} />
          )}
        </div>
        {current ? (
          <span className="ach-current-time">
            {current.kind === 'star'
              ? `${current.count} ${current.count === 1 ? 'estrella' : 'estrellas'} · ${formatTime(current.hours)}`
              : `${current.count} ${current.count === 1 ? 'sol' : 'soles'} · ${formatTime(current.hours)}`}
          </span>
        ) : (
          <span className="ach-current-time">Estrella · {formatTime(ACHIEVEMENTS[0].hours)}</span>
        )}

        <div className="ach-progress-track">
          <div className="ach-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="ach-progress-label">
          {next
            ? `Falta ${formatTime(next.hours)} para el próximo logro`
            : '¡Completaste todos los logros!'}
        </span>
      </div>

      <div className="ach-grid">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = elapsedHours >= a.hours;
          const isCurrent = currentIndex >= 0 && a.id === current?.id;
          return (
            <div
              key={a.id}
              className={`ach-card ${unlocked ? 'ach-card-unlocked' : ''} ${
                isCurrent ? 'ach-card-current' : ''
              }`}
            >
              {unlocked && (
                <div className="ach-card-check">
                  <CheckCircle2 size={16} color="#4CAF50" />
                </div>
              )}
              <div className="ach-card-symbols">{renderSymbol(a, 26)}</div>
              <span className="ach-card-time">{formatTime(a.hours)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
