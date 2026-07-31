import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useDiaryStore } from '../store/diaryStore';
import { AlertTriangle, MessageCircle, Frown, X, Save, Trash2, Link2 } from 'lucide-react';
import { MoneyBagIcon, BrokenCigaretteIcon, SmilingHeartIcon, ClockFaceIcon, TargetIcon, OpenBookIcon, HourglassIcon, StopHandIcon } from '../components/CartoonIcons';
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
  const resetProfile = useStore((state) => state.resetProfile);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showAnxiety, setShowAnxiety] = useState(false);
  const [showDiary, setShowDiary] = useState(false);
  const [showNoFumes, setShowNoFumes] = useState(false);
  const [diaryEntry, setDiaryEntry] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const diaryEntries = useDiaryStore((state) => state.entries);
  const addDiaryEntry = useDiaryStore((state) => state.addEntry);
  const removeDiaryEntry = useDiaryStore((state) => state.removeEntry);

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

  const handleCai = () => {
    const confirmed = window.confirm('¿Has fumado? Esto reiniciará todo tu progreso. ¿Estás seguro?');
    if (confirmed) {
      resetProfile();
    }
  };

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

  const buildShareLink = (): string => {
    const base = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams();
    if (profile?.startDate) params.set('start', profile.startDate);
    params.set('cigsPerDay', String(safeNumber(profile?.cigsPerDay)));
    params.set('cigsPerPack', String(safeNumber(profile?.cigsPerPack)));
    params.set('pricePerPack', String(safeNumber(profile?.pricePerPack)));
    params.set('yearsSmoking', String(safeNumber(profile?.yearsSmoking)));
    return `${base}#/?${params.toString()}`;
  };

  const handleShareLink = async () => {
    const link = buildShareLink();
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = link;
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand('copy');
      document.body.removeChild(fallback);
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const safeNumber = (val: number | undefined | null): number => val ?? 0;

  return (
    <div className="dashboard">

      <h1 className="dash-title">Dejalo Hoy</h1>
      <p className="dash-subtitle">Cada segundo sin fumar es una victoria</p>

      <div className="dash-grid">
        <div className="dash-card dash-card-clickable" onClick={() => navigate('/wishlist')}>
          <span className="dash-label">Dinero Ahorrado</span>
          <MoneyBagIcon size={40} />
          <span className="dash-value">Bs {safeNumber(money).toFixed(2)}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/medals')}>
          <span className="dash-label">Cigarros No Fumados</span>
          <BrokenCigaretteIcon size={40} />
          <span className="dash-value">{safeNumber(cigs)}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/health')}>
          <span className="dash-label">Salud Ganada</span>
          <SmilingHeartIcon size={40} />
          <span className="dash-value">{life.days > 0 ? `${life.days}d` : `${life.hours}h`}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/life')}>
          <span className="dash-label">Vida Recuperada</span>
          <ClockFaceIcon size={40} />
          <span className="dash-value">{life.days > 0 ? `${life.days}d ` : ''}{life.hours}h {life.minutes}m</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => navigate('/achievements')}>
          <span className="dash-label">Logros Alcanzados</span>
          <TargetIcon size={40} />
          <span className="dash-value">{time.days >= 1 ? 1 : 0}</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => setShowDiary(true)}>
          <span className="dash-label">Diario</span>
          <OpenBookIcon size={40} />
          <span className="dash-value">Escribe</span>
        </div>

        <div className="dash-card">
          <span className="dash-label">Tiempo Sin Fumar</span>
          <HourglassIcon size={40} />
          <span className="dash-value">{time.days}d {time.hours}h {time.minutes}m {time.seconds}s</span>
        </div>

        <div className="dash-card dash-card-clickable" onClick={() => setShowNoFumes(true)}>
          <span className="dash-label">No lo hagas</span>
          <StopHandIcon size={40} />
          <span className="dash-value">Leeme primero</span>
        </div>
      </div>

      <div className="dash-actions">
        <button className="btn-cai" onClick={handleCai}>
          <AlertTriangle size={24} />
          ¡Caí!
        </button>

        <button className="btn-anxiety" onClick={() => setShowAnxiety(true)}>
          <Frown size={24} />
          ¡Tengo ansiedad!
        </button>

        <button className="btn-assistant" onClick={() => setShowAssistant(true)}>
          <MessageCircle size={24} />
          Asistente de Caída
        </button>

        <button className="btn-share-link" onClick={handleShareLink}>
          <Link2 size={24} />
          {linkCopied ? '¡Enlace copiado!' : 'Compartir mi enlace'}
        </button>
      </div>

      {linkCopied && (
        <p className="dash-link-hint">
          Abrí este enlace en tu teléfono y verás tu progreso sin volver a pedir datos.
        </p>
      )}

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

      {/* Modal Ansiedad */}
      {showAnxiety && (
        <div className="modal-overlay" onClick={() => setShowAnxiety(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAnxiety(false)}>
              <X size={20} />
            </button>
            <h2 className="modal-title">¡Tranquilo! Aquí tienes 6 consejos</h2>
            <p className="modal-body">La ansiedad al dejar de fumar es normal y pasajera. Prueba estas técnicas avaladas por organizaciones de salud:</p>
            <ul className="modal-list">
              <li><strong>Respiración 4-7-8 (Mayo Clinic):</strong> Inhala por la nariz 4 segundos, retén 7 segundos, exhala por la boca 8 segundos. Repite 4 veces. Activa el sistema nervioso parasimpático y reduce la ansiedad al instante.</li>
              <li><strong>Distráete 10 minutos (CDC - Smokefree.gov):</strong> El craving dura solo 15-20 minutos. Mantén tus manos ocupadas: aprieta una pelota antiestrés, escribe, o arma algo. La urgencia pasará.</li>
              <li><strong>Agua fría (American Cancer Society):</strong> Bebe un vaso de agua fría o lávate la cara. El choque térmico activa el reflejo de inmersión, disminuyendo el ritmo cardíaco y la ansiedad.</li>
              <li><strong>5 minutos de movimiento (Cleveland Clinic):</strong> Camina rápido, sube escaleras o haz saltos. El ejercicio libera endorfinas (analgésicos naturales) y reduce el deseo de fumar.</li>
              <li><strong>Identifica tu disparador (NHS):</strong> ¿Café? ¿Estrés? ¿Después de comer? Identificar qué activó el craving te permite anticiparte y romper el ciclo.</li>
              <li><strong>Apoyo social inmediato (WHO):</strong> Llama a un amigo, manda un mensaje o repite en voz alta: "Esto es pasajero, yo puedo con esto". Compartir reduce la intensidad del craving.</li>
            </ul>
            <p className="modal-quote">"La ansiedad es una señal de que estás creciendo, no de que estás fracasando."</p>
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
            <p className="modal-quote">"Un antojo es solo un pensamiento. Tú eres más grande que tus pensamientos."</p>
          </div>
        </div>
      )}

    </div>
  );
}
