import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DAILY_MISSIONS, useMissionsStore } from '../store/missionsStore';
import { ArrowLeft, Flame, Check, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfDay, subDays } from 'date-fns';

const dayKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function Missions() {
  const navigate = useNavigate();
  const { completed, toggleMission } = useMissionsStore();
  const [monthOffset, setMonthOffset] = useState(0);

  const todayKey = dayKey(new Date());
  const doneToday = completed[todayKey] || [];
  const allDoneToday = DAILY_MISSIONS.length > 0 && DAILY_MISSIONS.every((m) => doneToday.includes(m.id));
  const progressToday = Math.round((doneToday.length / DAILY_MISSIONS.length) * 100);

  const streak = useMemo(() => {
    const isDayDone = (d: Date) => {
      const done = completed[dayKey(d)] || [];
      return DAILY_MISSIONS.every((m) => done.includes(m.id));
    };
    let count = 0;
    let cursor = startOfDay(new Date());
    if (!isDayDone(cursor)) {
      cursor = subDays(cursor, 1);
    }
    while (isDayDone(cursor)) {
      count++;
      cursor = subDays(cursor, 1);
    }
    return count;
  }, [completed]);

  const last7 = useMemo(() => {
    const days: { key: string; label: string; done: boolean }[] = [];
    const today = startOfDay(new Date());
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const done = completed[dayKey(d)] || [];
      days.push({
        key: dayKey(d),
        label: d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
        done: DAILY_MISSIONS.length > 0 && DAILY_MISSIONS.every((m) => done.includes(m.id)),
      });
    }
    return days;
  }, [completed]);

  const calendar = useMemo(() => {
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const firstWeekday = (base.getDay() + 6) % 7; // 0 = lunes
    const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    const todayStr = dayKey(now);

    type CellStatus = 'done' | 'partial' | 'none' | 'future';
    const cells: { key: string; day: number; status: CellStatus; isToday: boolean }[] = [];

    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ key: `pad-${i}`, day: 0, status: 'none', isToday: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(base.getFullYear(), base.getMonth(), d);
      const key = dayKey(date);
      const done = completed[key] || [];
      const allDone = DAILY_MISSIONS.length > 0 && DAILY_MISSIONS.every((m) => done.includes(m.id));
      const anyDone = done.length > 0;
      const isFuture = key > todayStr;
      cells.push({
        key,
        day: d,
        status: isFuture ? 'future' : allDone ? 'done' : anyDone ? 'partial' : 'none',
        isToday: key === todayStr,
      });
    }

    const title = base.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    return { title: title.charAt(0).toUpperCase() + title.slice(1), cells };
  }, [completed, monthOffset]);

  return (
    <div className="miss-page">
      <div className="miss-header">
        <button className="miss-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="miss-title">Misiones Diarias</h1>
        <div className="miss-streak-badge">
          <Flame size={18} />
          <span>{streak} día{streak === 1 ? '' : 's'}</span>
        </div>
      </div>

      <p className="miss-subtitle">
        Pequeñas acciones diarias, sumadas, rompen la adicción. Completá todas y mantené tu racha.
      </p>

      <div className="miss-streak-card">
        <span className="miss-streak-label">Racha actual</span>
        <div className="miss-streak-value">
          <Flame size={26} />
          {streak} {streak === 1 ? 'día' : 'días'}
        </div>
        <div className="miss-week">
          {last7.map((d) => (
            <div key={d.key} className={`miss-day ${d.done ? 'miss-day-done' : ''}`}>
              <span>{d.done ? '✓' : '·'}</span>
              <small>{d.label}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="miss-progress">
        <div className="miss-progress-track">
          <div className="miss-progress-fill" style={{ width: `${progressToday}%` }} />
        </div>
        <span className="miss-progress-label">
          {allDoneToday
            ? '🎉 ¡Misión del día completada!'
            : `${doneToday.length} de ${DAILY_MISSIONS.length} misiones hoy`}
        </span>
      </div>

      <div className="miss-calendar">
        <div className="miss-calendar-header">
          <button
            className="miss-cal-nav"
            onClick={() => setMonthOffset((m) => m - 1)}
            disabled={monthOffset <= -12}
            aria-label="Mes anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="miss-cal-title">{calendar.title}</span>
          <button
            className="miss-cal-nav"
            onClick={() => setMonthOffset((m) => m + 1)}
            disabled={monthOffset >= 0}
            aria-label="Mes siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="miss-cal-weekdays">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="miss-cal-grid">
          {calendar.cells.map((cell) => (
            <div
              key={cell.key}
              className={`miss-cal-cell ${cell.status}${cell.isToday ? ' today' : ''}`}
            >
              {cell.status === 'done' ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                cell.day > 0 && cell.day
              )}
            </div>
          ))}
        </div>

        <div className="miss-cal-legend">
          <span><span className="legend-dot done" /> Completada</span>
          <span><span className="legend-dot partial" /> Parcial</span>
          <span><span className="legend-dot today" /> Hoy</span>
        </div>
      </div>

      <div className="miss-list">
        {DAILY_MISSIONS.map((mission) => {
          const isDone = doneToday.includes(mission.id);
          return (
            <button
              key={mission.id}
              className={`miss-item ${isDone ? 'miss-item-done' : ''}`}
              onClick={() => toggleMission(todayKey, mission.id)}
            >
              <span className="miss-item-emoji">{mission.emoji}</span>
              <span className="miss-item-info">
                <span className="miss-item-title">{mission.title}</span>
                <span className="miss-item-detail">{mission.detail}</span>
              </span>
              <span className="miss-item-check">
                {isDone ? <Check size={20} /> : <span className="miss-item-checkbox" />}
              </span>
            </button>
          );
        })}
      </div>

      {allDoneToday && (
        <div className="miss-reward">
          <Trophy size={26} />
          <p>Completaste todas las misiones de hoy. Sos más fuerte que la adicción. Mañana seguimos.</p>
        </div>
      )}
    </div>
  );
}
