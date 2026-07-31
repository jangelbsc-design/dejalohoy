import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useDiaryStore } from '../store/diaryStore';
import { useMotivationStore } from '../store/motivationStore';
import { useAuthStore } from '../store/authStore';
import { MessageCircle, X, Save, Trash2, Camera, XCircle, Heart, LogOut, User } from 'lucide-react';
import { MoneyBagIcon, BrokenCigaretteIcon, SmilingHeartIcon, ClockFaceIcon, TargetIcon, OpenBookIcon, StopHandIcon, BrainIcon } from '../components/CartoonIcons';
import { 
  calculateFreeTime, 
  calculateFreeTimeInDays, 
  calculateMoneySaved, 
  calculateCigsAvoided, 
  calculateLifeRecovered,
  FreeTime,
  LifeRecovered
} from '../core/utils/calculations';

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);
  const [showAssistant, setShowAssistant] = useState(false);
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

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/');
  };

  const handlePhotoUpload = (file: File | undefined | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
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
        setMotivationPhoto(canvas.toDataURL('image/jpeg', 0.75));
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
          <BrainIcon size={64} />
          <span className="dash-value">Ver ahora</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/wishlist')}>
          <span className="dash-label">Dinero Ahorrado</span>
          <MoneyBagIcon size={64} />
          <span className="dash-value">Bs {safeNumber(money).toFixed(2)}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/medals')}>
          <span className="dash-label">Cigarros No Fumados</span>
          <BrokenCigaretteIcon size={64} />
          <span className="dash-value">{safeNumber(cigs)}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/health')}>
          <span className="dash-label">Salud Ganada</span>
          <SmilingHeartIcon size={64} />
          <span className="dash-value">{life.days > 0 ? `${life.days}d` : `${life.hours}h`}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/life')}>
          <span className="dash-label">Vida Recuperada</span>
          <ClockFaceIcon size={64} />
          <span className="dash-value">{life.days > 0 ? `${life.days}d ` : ''}{life.hours}h {life.minutes}m</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/achievements')}>
          <span className="dash-label">Logros Alcanzados</span>
          <TargetIcon size={64} />
          <span className="dash-value">{time.days >= 1 ? 1 : 0}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => setShowDiary(true)}>
          <span className="dash-label">Diario</span>
          <OpenBookIcon size={64} />
          <span className="dash-value">Escribe</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => setShowNoFumes(true)}>
          <span className="dash-label">No lo hagas</span>
          <StopHandIcon size={64} />
          <span className="dash-value">Leeme primero</span>
        </div>
      </div>

      <div className="dash-actions">
        <button className="btn-assistant" onClick={() => setShowAssistant(true)}>
          <MessageCircle size={24} />
          Asistente de Caída
        </button>

        <button className="btn-assistant" onClick={() => navigate('/profile')}>
          <User size={24} />
          Mi perfil
        </button>

        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={24} />
          Cerrar sesión
        </button>
      </div>

      {/* Modal Asistente de Caída */}
      {showAssistant && (
        <div className="modal-overlay" onClick={() => setShowAssistant(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAssistant(false)}>
              <X size={20} />
            </button>
            <h2 className="modal-title">Asistente de Caída</h2>
            <p className="modal-body">Si has fumado, no te preocupes. Un tropiezo no es el fin de tu camino. Esto es lo que puedes hacer ahora:</p>
            <ul className="modal-list">
              <li><strong>Reconócelo como un tropiezo, no una derrota.</strong> No dejes que un cigarro arruine todo tu progreso. Lo importante es seguir adelante.</li>
              <li><strong>Identifica el desencadenante.</strong> ¿Estrés? ¿Alcohol? ¿Ansiedad? Saber qué lo causó te ayudará a prepararte para la próxima vez.</li>
              <li><strong>Reinicia ahora mismo.</strong> Presiona "Caí" para reiniciar el contador y vuelve a empezar. Cada minuto sin fumar cuenta.</li>
              <li><strong>Bebe agua y respira profundo.</strong> Toma un vaso de agua y haz 10 respiraciones lentas para calmar la ansiedad.</li>
              <li><strong>Busca apoyo.</strong> Habla con alguien de confianza. Compartir lo que sientes reduce la carga y te fortalece.</li>
              <li><strong>Retoma tu plan.</strong> Revisa por qué decidiste dejar de fumar. Tus razones siguen siendo válidas.</li>
            </ul>
            <p className="modal-quote">"El éxito no es no caer nunca, sino levantarse cada vez que caes." — Confucio</p>
          </div>
        </div>
      )}

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
                  <img src={motivationPhoto} alt="Tu motivación" className="motivation-photo" />
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

    </div>
  );
}
