import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCravingsStore } from '../store/cravingsStore';
import { ArrowLeft, Plus, Trash2, Flame, Activity, TrendingUp, X } from 'lucide-react';
import { startOfDay, subDays, differenceInCalendarDays } from 'date-fns';

const dayKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const intensityColor = (n: number): string => {
  if (n <= 3) return '#4CAF50';
  if (n <= 6) return '#FFB703';
  if (n <= 8) return '#FB8C00';
  return '#EF233C';
};

export default function Cravings() {
  const navigate = useNavigate();
  const { entries, addEntry, removeEntry } = useCravingsStore();

  const [showForm, setShowForm] = useState(false);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');

  const todayCount = entries.filter((e) => dayKey(new Date(e.createdAt)) === dayKey(new Date())).length;
  const avgIntensity = entries.length > 0
    ? (entries.reduce((acc, e) => acc + e.intensity, 0) / entries.length).toFixed(1)
    : '0';

  const last7 = useMemo(() => {
    const days: { label: string; count: number; avg: number }[] = [];
    const today = startOfDay(new Date());
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const key = dayKey(d);
      const dayEntries = entries.filter((e) => dayKey(new Date(e.createdAt)) === key);
      days.push({
        label: d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
        count: dayEntries.length,
        avg: dayEntries.length > 0
          ? dayEntries.reduce((acc, e) => acc + e.intensity, 0) / dayEntries.length
          : 0,
      });
    }
    return days;
  }, [entries]);

  const maxCount = Math.max(...last7.map((d) => d.count), 1);

  const grouped = useMemo(() => {
    const groups: { date: string; label: string; items: typeof entries }[] = [];
    for (const e of entries) {
      const key = dayKey(new Date(e.createdAt));
      const g = groups.find((x) => x.date === key);
      const label = (() => {
        const days = differenceInCalendarDays(new Date(), new Date(e.createdAt));
        if (days === 0) return 'Hoy';
        if (days === 1) return 'Ayer';
        return new Date(e.createdAt).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
      })();
      if (g) {
        g.items.push(e);
      } else {
        groups.push({ date: key, label, items: [e] });
      }
    }
    return groups;
  }, [entries]);

  const handleSave = () => {
    addEntry(intensity, note);
    setNote('');
    setIntensity(5);
    setShowForm(false);
  };

  return (
    <div className="crave-page">
      <div className="crave-header">
        <button className="crave-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="crave-title">Antojos</h1>
        <div className="crave-today">
          <Flame size={18} />
          <span>{todayCount} hoy</span>
        </div>
      </div>

      <p className="crave-subtitle">
        Registrar cada antojo te ayuda a conocer su intensidad y a saber que pasan. Nada es más fuerte que un antojo observado.
      </p>

      <div className="crave-stats">
        <div className="crave-stat">
          <span className="crave-stat-icon"><Activity size={18} /></span>
          <span className="crave-stat-label">Antojos registrados</span>
          <span className="crave-stat-value">{entries.length}</span>
        </div>
        <div className="crave-stat">
          <span className="crave-stat-icon"><TrendingUp size={18} /></span>
          <span className="crave-stat-label">Intensidad promedio</span>
          <span className="crave-stat-value">{avgIntensity}<small>/10</small></span>
        </div>
      </div>

      {!showForm ? (
        <button className="crave-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={20} />
          Registrar antojo ahora
        </button>
      ) : (
        <div className="crave-form">
          <div className="crave-form-head">
            <span className="crave-form-title">¿Qué tan fuerte es el antojo?</span>
            <span className="crave-form-level" style={{ color: intensityColor(intensity) }}>
              {intensity} / 10
            </span>
          </div>
          <input
            className="crave-slider"
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            style={{ accentColor: intensityColor(intensity) }}
          />
          <div className="crave-scale">
            <span>Suave</span>
            <span>Moderado</span>
            <span>Muy fuerte</span>
          </div>
          <textarea
            className="crave-note"
            placeholder="¿Qué lo provocó? (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
          <div className="crave-form-actions">
            <button className="crave-save-btn" onClick={handleSave}>
              Guardar antojo
            </button>
            <button className="crave-cancel-btn" onClick={() => setShowForm(false)}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="crave-chart-section">
          <h3 className="crave-section-title">Últimos 7 días</h3>
          <div className="crave-chart">
            {last7.map((d) => (
              <div key={d.label} className="crave-chart-col">
                <span className="crave-chart-count">{d.count > 0 ? d.count : ''}</span>
                <div className="crave-chart-bar-wrap">
                  <div
                    className="crave-chart-bar"
                    style={{ height: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="crave-chart-label">{d.label}</span>
              </div>
            ))}
          </div>
          <p className="crave-chart-hint">Antojos por día. La altura es la cantidad; el color es la intensidad promedio.</p>
        </div>
      )}

      {grouped.length > 0 && (
        <div className="crave-history">
          <h3 className="crave-section-title">Historial</h3>
          {grouped.map((g) => (
            <div key={g.date} className="crave-group">
              <span className="crave-group-label">{g.label}</span>
              {g.items.map((entry) => (
                <div key={entry.id} className="crave-item">
                  <div
                    className="crave-item-dot"
                    style={{ background: intensityColor(entry.intensity) }}
                  />
                  <div className="crave-item-info">
                    <span className="crave-item-level">
                      Intensidad {entry.intensity}/10
                    </span>
                    {entry.note && <span className="crave-item-note">"{entry.note}"</span>}
                    <span className="crave-item-time">
                      {new Date(entry.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button
                    className="diary-entry-delete"
                    onClick={() => removeEntry(entry.id)}
                    aria-label="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && (
        <p className="crave-empty">
          Aún no registraste antojos. Cada uno que anotes es un antojo que no te controló. 💪
        </p>
      )}
    </div>
  );
}
