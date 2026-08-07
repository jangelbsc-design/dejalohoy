import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useDiaryStore } from '../store/diaryStore';
import { useMotivationStore } from '../store/motivationStore';
import { useTriggersStore } from '../store/triggersStore';
import { X, Save, Trash2, Camera, XCircle, Heart, User, ChevronDown, ChevronUp } from 'lucide-react';
import { MoneyBagIcon, BrokenCigaretteIcon, SmilingHeartIcon, ClockFaceIcon, TargetIcon, OpenBookIcon, StopHandIcon, BrainIcon, GamepadIcon, TriggerEyesIcon } from '../components/CartoonIcons';
import { 
  calculateFreeTime, 
  calculateFreeTimeInDays, 
  calculateMoneySaved, 
  calculateCigsAvoided, 
  calculateLifeRecovered,
  FreeTime,
  LifeRecovered
} from '../core/utils/calculations';

// ── Disparadores ─────────────────────────────────────────────────────────────
const TRIGGER_OPTIONS = [
  { key: 'estres',        label: '😤 Estrés',                  tip: 'Respira: inhala 4 seg, retén 7, exhala 8. El antojo pasa en 3-5 min. Una caminata rápida libera la tensión al instante.' },
  { key: 'despues_comer', label: '🍽️ Después de comer',         tip: 'Levántate de la mesa enseguida. Cepíllate los dientes o tomá un vaso de agua fría. El nuevo ritual rompe la asociación.' },
  { key: 'cafe',          label: '☕ Café',                      tip: 'Probá tomarlo en otro lugar o con la otra mano. El contexto nuevo rompe la asociación. Añadí un chicle sin azúcar.' },
  { key: 'alcohol',       label: '🍺 Cerveza / Alcohol',         tip: 'El alcohol baja la guardia. Cambiá tu bebida esta semana o avisale a alguien de confianza tu plan.' },
  { key: 'aburrimiento',  label: '😴 Aburrimiento',              tip: 'Mantén manos y mente ocupadas. Jugá al Tetris, llamá a alguien, hacé algo físico. El aburrimiento dura segundos si lo atacás.' },
  { key: 'trabajo',       label: '💼 Problemas laborales',       tip: 'Salí del lugar 3 minutos. Anotalo en el Diario antes de que el impulso suba. El cigarro no resuelve nada — escribirlo sí.' },
  { key: 'ver_fumar',     label: '👀 Ver a alguien fumar',       tip: 'Alejate físicamente. Recordá: ellos están atrapados, vos estás libre. La imagen pasa, el antojo también.' },
  { key: 'ansiedad',      label: '😰 Ansiedad / Nervios',        tip: 'Técnica 5-4-3-2-1: nombrá 5 cosas que ves, 4 que tocás, 3 que escuchás, 2 que olés, 1 que saboreás. Te ancla al presente.' },
  { key: 'noche',         label: '🌙 Noche / Insomnio',          tip: 'Tomá agua fría, salí al balcón o abrí la ventana, poné música tranquila. El antojo nocturno es corto si no te quedás quieto.' },
  { key: 'redes',         label: '📱 Redes sociales / Pantallas', tip: 'Tomá el teléfono con intención. Poné una alarma de 5 min y hacé otra cosa. El scroll activa el piloto automático.' },
  { key: 'otro',          label: '✏️ Otro...',                    tip: 'Anotaste algo específico. Revisalo en tu historial — ese detalle es clave para conocer tu mapa personal de ansiedad.' },
] as const;

type TriggerKey = (typeof TRIGGER_OPTIONS)[number]['key'];
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);
  const [showDiary, setShowDiary] = useState(false);
  const [showNoFumes, setShowNoFumes] = useState(false);
  const [diaryEntry, setDiaryEntry] = useState('');
  const diaryEntries = useDiaryStore((state) => state.entries);
  const addDiaryEntry = useDiaryStore((state) => state.addEntry);
  const removeDiaryEntry = useDiaryStore((state) => state.removeEntry);
  const motivationPhoto = useMotivationStore((state) => state.photo);
  const setMotivationPhoto = useMotivationStore((state) => state.setPhoto);
  const motivationText = useMotivationStore((state) => state.text);
  const setMotivationText = useMotivationStore((state) => state.setText);
  const photoPos = useMotivationStore((state) => state.photoPos);
  const setPhotoPos = useMotivationStore((state) => state.setPhotoPos);

  // Triggers state
  const triggerEntries = useTriggersStore((state) => state.entries);
  const addTriggerEntry = useTriggersStore((state) => state.addEntry);
  const removeTriggerEntry = useTriggersStore((state) => state.removeEntry);
  const [showTrigger, setShowTrigger] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerKey | null>(null);
  const [customTriggerText, setCustomTriggerText] = useState('');
  const [savedTip, setSavedTip] = useState<string | null>(null);
  const [showRanking, setShowRanking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const triggerRanking = TRIGGER_OPTIONS
    .map((opt) => ({ ...opt, count: triggerEntries.filter((e) => e.trigger === opt.key).length }))
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count);

  const handleSaveTrigger = () => {
    if (!selectedTrigger) return;
    const option = TRIGGER_OPTIONS.find((o) => o.key === selectedTrigger)!;
    const customText = selectedTrigger === 'otro' ? customTriggerText.trim() : undefined;
    if (selectedTrigger === 'otro' && !customText) return;
    addTriggerEntry(selectedTrigger, option.label, customText);
    setSavedTip(option.tip);
  };

  const handleCloseTrigger = () => {
    setShowTrigger(false);
    setSelectedTrigger(null);
    setCustomTriggerText('');
    setSavedTip(null);
    setShowRanking(false);
    setShowHistory(false);
  };

  const [time, setTime] = useState<FreeTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [money, setMoney] = useState(0);
  const [cigs, setCigs] = useState(0);
  const [life, setLife] = useState<LifeRecovered>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);

    const updateStats = () => {
      const now = new Date();
      setTime(calculateFreeTime(startDate, now));
      
      const freeDays = calculateFreeTimeInDays(startDate, now);
      setMoney(calculateMoneySaved(freeDays, profile.cigsPerDay, profile.cigsPerPack, profile.pricePerPack));
      
      const avoided = calculateCigsAvoided(freeDays, profile.cigsPerDay);
      setCigs(Math.floor(avoided));
      setLife(calculateLifeRecovered(avoided));
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [profile]);

  const handleSaveDiary = () => {
    const text = diaryEntry.trim();
    if (!text) return;
    addDiaryEntry(text);
    setDiaryEntry('');
  };

  const formatDiaryDate = (iso: string): string => {
    const date = new Date(iso);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePhotoUpload = (file: File | undefined | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 640;
        let width = img.width;
        let height = img.height;
        if (!width || !height) return;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);
        setMotivationPhoto(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => {
        alert('No se pudo leer la imagen. Probá con otra foto.');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const safeNumber = (val: number | undefined | null): number => val ?? 0;

  const years = Math.floor(time.days / 365);
  const months = Math.floor((time.days % 365) / 30);

  const mainTitle = years >= 1
    ? `${years} ${years === 1 ? 'año' : 'años'}${months > 0 ? ` ${months} ${months === 1 ? 'mes' : 'meses'}` : ''}`
    : months >= 1
      ? `${months} ${months === 1 ? 'mes' : 'meses'}`
      : time.days >= 1
        ? `${time.days} ${time.days === 1 ? 'día' : 'días'}`
        : time.hours >= 1
          ? `${time.hours} ${time.hours === 1 ? 'hora' : 'horas'}`
          : `${time.minutes} ${time.minutes === 1 ? 'minuto' : 'minutos'}`;

  const pad = (n: number): string => String(n).padStart(2, '0');

  return (
    <div className="dashboard">

      <button className="dash-profile-btn" onClick={() => navigate('/profile')} aria-label="Mi perfil">
        <User size={20} />
      </button>

      <h1 className="dash-title">Dejalo Hoy</h1>
      <p className="dash-subtitle">Cada segundo sin fumar es una victoria</p>

      <div className="counter-hero">
        <span className="counter-hero-label">Tiempo sin fumar</span>
        <h2 className="counter-hero-title">{mainTitle}</h2>
        <div className="counter-hero-units">
          <div className="counter-unit">
            <span className="counter-unit-number">{time.days}</span>
            <span className="counter-unit-label">Días</span>
          </div>
          <div className="counter-unit">
            <span className="counter-unit-number">{pad(time.hours)}</span>
            <span className="counter-unit-label">Horas</span>
          </div>
          <div className="counter-unit">
            <span className="counter-unit-number">{pad(time.minutes)}</span>
            <span className="counter-unit-label">Minutos</span>
          </div>
          <div className="counter-unit counter-unit-seconds">
            <span className="counter-unit-number">{pad(time.seconds)}</span>
            <span className="counter-unit-label">Segundos</span>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card dash-card-clickable" onClick={() => navigate('/guide')}>
          <span className="dash-label">Guía Asistida</span>
          <BrainIcon size={48} />
          <span className="dash-value">Ver ahora</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/wishlist')}>
          <span className="dash-label">Dinero Ahorrado</span>
          <MoneyBagIcon size={48} />
          <span className="dash-value">Bs {safeNumber(money).toFixed(2)}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/medals')}>
          <span className="dash-label">Cigarros No Fumados</span>
          <BrokenCigaretteIcon size={48} />
          <span className="dash-value">{safeNumber(cigs)}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/health')}>
          <span className="dash-label">Salud Ganada</span>
          <SmilingHeartIcon size={48} />
          <span className="dash-value">{life.days > 0 ? `${life.days}d` : `${life.hours}h`}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/life')}>
          <span className="dash-label">Vida Recuperada</span>
          <ClockFaceIcon size={48} />
          <span className="dash-value">{life.days > 0 ? `${life.days}d ` : ''}{life.hours}h {life.minutes}m</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/achievements')}>
          <span className="dash-label">Logros Alcanzados</span>
          <TargetIcon size={48} />
          <span className="dash-value">{time.days >= 1 ? 1 : 0}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => setShowDiary(true)}>
          <span className="dash-label">Diario</span>
          <OpenBookIcon size={48} />
          <span className="dash-value">Escribe</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => setShowNoFumes(true)}>
          <span className="dash-label">No lo hagas</span>
          <StopHandIcon size={48} />
          <span className="dash-value">Leeme primero</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/games')}>
          <span className="dash-label">Juegos</span>
          <GamepadIcon size={48} />
          <span className="dash-value">Ver ahora</span>
        </div>

        <div
          className="dash-card dash-card-clickable dash-card-trigger"
          onClick={() => { setShowTrigger(true); setSavedTip(null); setSelectedTrigger(null); }}
        >
          <span className="dash-label">Identificar disparador</span>
          <TriggerEyesIcon size={48} />
          <span className="dash-value">
            {triggerEntries.length > 0
              ? `${triggerEntries.length} registrado${triggerEntries.length === 1 ? '' : 's'}`
              : 'Para prepararte mejor'}
          </span>
        </div>
      </div>

      {/* Modal Diario */}
      {showDiary && (
        <div className="modal-overlay" onClick={() => setShowDiary(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDiary(false)}>
              <X size={20} />
            </button>
            <h2 className="modal-title">Mi Diario</h2>
            <p className="modal-body">Escribe cómo te sientes en este momento y guarda tu registro. Desahogarte ayuda a liberar la ansiedad.</p>
            <textarea
              className="diary-textarea"
              placeholder="Hoy me siento..."
              value={diaryEntry}
              onChange={(e) => setDiaryEntry(e.target.value)}
              rows={4}
            />
            <button className="diary-save-btn" onClick={handleSaveDiary} disabled={!diaryEntry.trim()}>
              <Save size={18} />
              Guardar registro
            </button>

            {diaryEntries.length > 0 ? (
              <div className="diary-list">
                <h3 className="diary-list-title">Mis registros ({diaryEntries.length})</h3>
                {diaryEntries.map((entry) => (
                  <div key={entry.id} className="diary-entry">
                    <span className="diary-entry-date">
                      <strong>{formatDiaryDate(entry.createdAt)}</strong>
                    </span>
                    <p className="diary-entry-text">{entry.text}</p>
                    <button
                      className="diary-entry-delete"
                      onClick={() => removeDiaryEntry(entry.id)}
                      aria-label="Eliminar registro"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="modal-quote" style={{ marginTop: '16px' }}>
                Aún no tienes registros. Guarda el primero y empieza a desahogarte. ✨
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal No lo hagas */}
      {showNoFumes && (
        <div className="modal-overlay" onClick={() => setShowNoFumes(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNoFumes(false)}>
              <X size={20} />
            </button>
            <h2 className="modal-title">No lo hagas</h2>
            <p className="modal-body">Antes de fumarlo, lee esto:</p>
            <ul className="modal-list">
              <li><strong>¿Realmente lo necesitas?</strong> El craving es solo una señal de tu cerebro acostumbrado a la nicotina. Pasa en minutos. No le des poder.</li>
              <li><strong>¿Qué vas a perder?</strong> Cada cigarro reinicia tu progreso. El tiempo, el dinero, la salud y el orgullo de haberlo logrado.</li>
              <li><strong>¿Qué pasará después?</strong> La culpa y la frustración serán peores que el alivio de 3 minutos. No vale la pena.</li>
              <li><strong>Haz esto primero:</strong> Bebe agua. Respira 4-7-8. Camina 5 minutos. Si después de eso aún quieres fumarlo, vuelve a leer esto.</li>
              <li><strong>Mereces estar libre.</strong> Tomaste la mejor decisión de tu vida. No dejes que un momento de debilidad la arruine.</li>
            </ul>

            <div className="motivation-section">
              <h3 className="motivation-title">Tu porqué</h3>

              {motivationPhoto ? (
                <div className="motivation-photo-wrap">
                  <img 
                    src={motivationPhoto} 
                    alt="Tu motivación" 
                    className="motivation-photo" 
                    style={{ objectPosition: `50% ${photoPos}%` }}
                  />
                  <label className="photo-adjust-label">Ajustar encuadre</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={photoPos}
                    onChange={(e) => setPhotoPos(Number(e.target.value))}
                    className="photo-adjust-slider"
                  />
                  <button
                    className="motivation-photo-remove"
                    onClick={() => setMotivationPhoto(null)}
                    aria-label="Quitar foto"
                  >
                    <XCircle size={22} />
                  </button>
                </div>
              ) : (
                <label className="motivation-upload">
                  <Camera size={22} />
                  <span>Sube una foto que te motive</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                    style={{ display: 'none' }}
                  />
                </label>
              )}

              <textarea
                className="diary-textarea motivation-textarea"
                placeholder="Escribe aquí por qué estás dejando de fumar (tu familia, tu salud, tus sueños)..."
                value={motivationText}
                onChange={(e) => setMotivationText(e.target.value)}
                rows={3}
              />
              <button
                className="motivation-save"
                onClick={() => setMotivationText(motivationText)}
                disabled={!motivationText.trim()}
              >
                <Heart size={16} />
                Guardar mi motivo
              </button>
            </div>

            <p className="modal-quote">"Un antojo es solo un pensamiento. Tú eres más grande que tus pensamientos."</p>
          </div>
        </div>
      )}

      {/* ── Modal Disparadores ───────────────────────────────────────────── */}
      {showTrigger && (
        <div className="modal-overlay" onClick={handleCloseTrigger}>
          <div className="modal-content trigger-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseTrigger}>
              <X size={20} />
            </button>

            <div className="trigger-modal-header">
              <TriggerEyesIcon size={40} />
              <div>
                <h2 className="modal-title trigger-modal-title">Identificar disparador</h2>
                <p className="trigger-modal-subtitle">Para prepararte mejor la próxima vez.</p>
              </div>
            </div>

            {!savedTip ? (
              <>
                <p className="modal-body">¿Qué ocurrió justo antes de sentir el impulso?</p>
                <div className="trigger-options">
                  {TRIGGER_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      className={`trigger-option-btn${selectedTrigger === opt.key ? ' selected' : ''}`}
                      onClick={() => { setSelectedTrigger(opt.key); setCustomTriggerText(''); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {selectedTrigger === 'otro' && (
                  <textarea
                    className="diary-textarea trigger-custom-textarea"
                    placeholder="Describí qué pasó justo antes del impulso..."
                    value={customTriggerText}
                    onChange={(e) => setCustomTriggerText(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                )}
                <button
                  className="diary-save-btn trigger-save-btn"
                  onClick={handleSaveTrigger}
                  disabled={
                    !selectedTrigger ||
                    (selectedTrigger === 'otro' && !customTriggerText.trim())
                  }
                >
                  <Save size={18} />
                  Guardar disparador
                </button>
              </>
            ) : (
              <div className="trigger-tip-wrap">
                <div className="trigger-tip">
                  <span className="trigger-tip-label">💡 Sugerencia para este momento</span>
                  <p className="trigger-tip-text">{savedTip}</p>
                </div>
                <button
                  className="diary-save-btn trigger-save-btn"
                  style={{ background: 'linear-gradient(90deg,#8E7AF0,#F06292)', marginTop: '12px' }}
                  onClick={() => { setSelectedTrigger(null); setSavedTip(null); setCustomTriggerText(''); }}
                >
                  + Registrar otro
                </button>
              </div>
            )}

            {/* ── Ranking de disparadores ───────────────── */}
            {triggerEntries.length > 0 && (
              <div className="trigger-stats-section">
                <button
                  className="trigger-stats-toggle"
                  onClick={() => setShowRanking((v) => !v)}
                >
                  <span>📊 Disparadores registrados ({triggerEntries.length})</span>
                  {showRanking ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showRanking && (
                  <>
                    <div className="trigger-ranking">
                      {triggerRanking.map((item, idx) => (
                        <div key={item.key} className="trigger-rank-row">
                          <span className="trigger-rank-medal">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                          </span>
                          <span className="trigger-rank-label">{item.label}</span>
                          <div className="trigger-rank-bar-wrap">
                            <div
                              className="trigger-rank-bar"
                              style={{ width: `${Math.round((item.count / triggerRanking[0].count) * 100)}%` }}
                            />
                          </div>
                          <span className="trigger-rank-count">{item.count}x</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className="trigger-history-toggle"
                      onClick={() => setShowHistory((v) => !v)}
                    >
                      {showHistory ? 'Ocultar historial completo' : 'Ver historial completo'}
                    </button>

                    {showHistory && (
                      <div className="trigger-history">
                        {triggerEntries.map((entry) => (
                          <div key={entry.id} className="trigger-history-item">
                            <div className="trigger-history-left">
                              <span className="trigger-history-label">{entry.label}</span>
                              {entry.customText && (
                                <span className="trigger-history-custom">"{entry.customText}"</span>
                              )}
                              <span className="trigger-history-date">
                                {new Date(entry.createdAt).toLocaleString('es-ES', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <button
                              className="diary-entry-delete"
                              onClick={() => removeTriggerEntry(entry.id)}
                              aria-label="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
