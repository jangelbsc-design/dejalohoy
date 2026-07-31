import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { differenceInMinutes } from 'date-fns';
import { ArrowLeft, X, CheckCircle2, Circle, Share2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { SmilingHeartIcon, LungsIcon, DropletIcon, TasteFaceIcon, BreathingIcon, HeartbeatIcon, CleanLungsIcon, ShieldHeartIcon, BrainIcon } from '../components/CartoonIcons';

interface HealthMilestone {
  id: number;
  title: string;
  timeReq: number;
  timeLabel: string;
  icon: ComponentType<{ size?: number }>;
  description: string;
  source: string;
}

const MILESTONES: HealthMilestone[] = [
  {
    id: 1,
    title: 'Presión Sanguínea',
    timeReq: 20,
    timeLabel: '20 min',
    icon: SmilingHeartIcon,
    description: 'Solo 20 minutos sin fumar: tu ritmo cardíaco baja y tu presión arterial vuelve a niveles normales. Tu corazón empieza a descansar del esfuerzo constante que le exige la nicotina.',
    source: 'American Cancer Society',
  },
  {
    id: 2,
    title: 'Oxigenación',
    timeReq: 720,
    timeLabel: '12 horas',
    icon: LungsIcon,
    description: 'Después de 12 horas, el monóxido de carbono de tu sangre baja a niveles normales. Tu sangre vuelve a transportar oxígeno de forma eficiente hacia todo tu cuerpo.',
    source: 'Cleveland Clinic',
  },
  {
    id: 3,
    title: 'Nicotina Eliminada',
    timeReq: 1440,
    timeLabel: '24 horas',
    icon: DropletIcon,
    description: 'A las 24 horas la nicotina se elimina por completo de tu cuerpo. Comienzas a estar físicamente libre de la sustancia adictiva que te mantenía esclavizado al cigarro.',
    source: 'CDC',
  },
  {
    id: 4,
    title: 'Gusto y Olfato',
    timeReq: 2880,
    timeLabel: '48 horas',
    icon: TasteFaceIcon,
    description: 'A las 48 horas, las terminaciones nerviosas se regeneran. La comida vuelve a saber mejor y percibes los olores con mucha más intensidad. ¡Disfruta de nuevo los sabores!',
    source: 'NHS',
  },
  {
    id: 5,
    title: 'Respiración',
    timeReq: 4320,
    timeLabel: '72 horas',
    icon: BreathingIcon,
    description: 'A las 72 horas los bronquios se relajan. Respirar se vuelve más fácil, sientes más energía y las actividades cotidianas requieren menos esfuerzo.',
    source: 'Medical News Today',
  },
  {
    id: 6,
    title: 'Circulación',
    timeReq: 20160,
    timeLabel: '2 semanas',
    icon: HeartbeatIcon,
    description: 'Entre 2 semanas y 3 meses, la circulación y la función pulmonar mejoran hasta un 30%. Notarás menos cansancio al caminar, subir escaleras o hacer ejercicio.',
    source: 'Cleveland Clinic',
  },
  {
    id: 7,
    title: 'Cilias Pulmonares',
    timeReq: 43200,
    timeLabel: '1 mes',
    icon: CleanLungsIcon,
    description: 'Al mes, las cilias (pelos microscópicos de tus pulmones) se regeneran y comienzan a limpiar tus vías respiratorias. Disminuye la tos, el moco y el riesgo de infecciones.',
    source: 'SolutionHealth',
  },
  {
    id: 8,
    title: 'Corazón Protegido',
    timeReq: 525600,
    timeLabel: '1 año',
    icon: ShieldHeartIcon,
    description: 'Al cumplir 1 año sin fumar, el riesgo de enfermedad coronaria se reduce a la mitad comparado con el de una persona fumadora. Tu corazón está mucho más seguro.',
    source: 'American Cancer Society',
  },
];

const formatElapsed = (minutes: number): string => {
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
};

const DEPENDENCE_FULL_TIME = 525600;

const DEPENDENCE_STAGES = [
  {
    timeReq: 20,
    timeLabel: '20 min',
    title: 'Primer paso',
    text: 'Tu ritmo cardíaco ya empieza a bajar. La urgencia física de fumando comienza a controlarse.',
  },
  {
    timeReq: 480,
    timeLabel: '8 horas',
    title: 'Nicotina en caída',
    text: 'La nicotina de tu sangre baja un 93%. Tu cuerpo empieza a sentir la ausencia y a reclamar, es señal de que se está limpiando.',
  },
  {
    timeReq: 1440,
    timeLabel: '24 horas',
    title: 'Nicotina eliminada',
    text: 'La nicotina se elimina por completo de tu organismo. Ya no hay sustancia adictiva en tu cuerpo.',
  },
  {
    timeReq: 4320,
    timeLabel: '72 horas',
    title: 'Cuerpo libre de nicotina',
    text: 'Tu cuerpo está 100% libre de nicotina. Los síntomas de abstinencia llegan a su punto máximo: es la señal de que estás venciendo la adicción.',
  },
  {
    timeReq: 20160,
    timeLabel: '2 semanas',
    title: 'Dependencia física cede',
    text: 'La dependencia física va desapareciendo. Los antojos intensos se hacen menos frecuentes y más manejables.',
  },
  {
    timeReq: 43200,
    timeLabel: '1 mes',
    title: 'Adicción física superada',
    text: 'La adicción física a la nicotina queda prácticamente superada. Lo que queda es la costumbre, que también se irá.',
  },
  {
    timeReq: 525600,
    timeLabel: '1 año',
    title: 'Dependencia superada',
    text: 'Un año sin fumar: tu riesgo de enfermedad coronaria se reduce a la mitad y los antojos son casi inexistentes. Estás libre.',
  },
];

export default function Health() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);
  const [minutesFree, setMinutesFree] = useState(0);
  const [selected, setSelected] = useState<HealthMilestone | null>(null);
  const [sharing, setSharing] = useState(false);
  const [sharePreview, setSharePreview] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [showDependence, setShowDependence] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);

    const update = () => {
      setMinutesFree(differenceInMinutes(new Date(), startDate));
    };

    update();
    const interval = setInterval(update, 1000 * 60);
    return () => clearInterval(interval);
  }, [profile]);

  const selectedProgress = selected ? Math.min((minutesFree / selected.timeReq) * 100, 100) : 0;
  const selectedComplete = selected ? minutesFree >= selected.timeReq : false;

  const dependenceProgress = Math.min((minutesFree / DEPENDENCE_FULL_TIME) * 100, 100);
  const currentStage = DEPENDENCE_STAGES.reduce(
    (acc, stage) => (minutesFree >= stage.timeReq ? stage : acc),
    DEPENDENCE_STAGES[0]
  );

  const handleShare = async () => {
    if (!selected || sharing) return;
    setSharing(true);
    setShareError(null);

    try {
      await new Promise((r) => setTimeout(r, 100));

      if (!shareCardRef.current) throw new Error('share-card-missing');

      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#667eea',
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('blob-failed');

      const fileName = `logro-${selected.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      const nav = navigator as Navigator & {
        canShare?: (data: { files?: File[] }) => boolean;
        share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
      };

      if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({
          files: [file],
          title: 'Déjalo Hoy - Logro alcanzado',
          text: `¡Alcancé el logro "${selected.title}" sin fumar! 🌱`,
        });
      } else {
        const previewUrl = URL.createObjectURL(blob);
        setSharePreview(previewUrl);
      }
    } catch (err) {
      if (err && (err as Error).name === 'AbortError') {
        setShareError('Compartir cancelado');
      } else {
        setShareError('No se pudo generar la imagen. Intentá de nuevo.');
      }
    } finally {
      setSharing(false);
    }
  };

  const downloadShareImage = () => {
    if (!sharePreview) return;
    const a = document.createElement('a');
    a.href = sharePreview;
    a.download = 'logro-dejalo-hoy.png';
    a.click();
  };

  const closeSharePreview = () => {
    if (sharePreview) URL.revokeObjectURL(sharePreview);
    setSharePreview(null);
    setShareError(null);
  };

  const shareDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="health-page">
      <div className="health-header">
        <button className="health-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="health-title">Salud Ganada</h1>
        <div className="health-time-badge">
          <span>{formatElapsed(minutesFree)}</span>
        </div>
      </div>

      <p className="health-subtitle">
        Tocá cada tarjeta para descubrir cómo se recupera tu cuerpo con el tiempo sin fumar.
      </p>

      <div className="health-grid">
        {MILESTONES.map((milestone) => {
          const progress = Math.min((minutesFree / milestone.timeReq) * 100, 100);
          const isComplete = minutesFree >= milestone.timeReq;
          const Icon = milestone.icon;

          return (
            <button
              key={milestone.id}
              className={`health-card ${isComplete ? 'health-card-complete' : ''}`}
              onClick={() => setSelected(milestone)}
            >
              <div className="health-card-check">
                {isComplete ? (
                  <CheckCircle2 size={16} color="#4CAF50" />
                ) : (
                  <Circle size={16} color="#B0BEC5" />
                )}
              </div>
              <Icon size={42} />
              <span className="health-card-title">{milestone.title}</span>
              <span className="health-card-time">{milestone.timeLabel}</span>
              <div className="health-bar-track">
                <div className="health-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="health-card-percent">{progress.toFixed(0)}%</span>
            </button>
          );
        })}

        <button
          className={`health-card ${dependenceProgress >= 100 ? 'health-card-complete' : ''}`}
          onClick={() => setShowDependence(true)}
        >
          <div className="health-card-check">
            {dependenceProgress >= 100 ? (
              <CheckCircle2 size={16} color="#4CAF50" />
            ) : (
              <Circle size={16} color="#B0BEC5" />
            )}
          </div>
          <BrainIcon size={42} />
          <span className="health-card-title">Dependencia a la Nicotina</span>
          <span className="health-card-time">Libérate</span>
          <div className="health-bar-track">
            <div className="health-bar-fill" style={{ width: `${dependenceProgress}%` }} />
          </div>
          <span className="health-card-percent">{dependenceProgress.toFixed(0)}%</span>
        </button>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              <X size={20} />
            </button>
            <div className="health-modal-icon">
              <selected.icon size={56} />
            </div>
            <h2 className="modal-title" style={{ textAlign: 'center' }}>{selected.title}</h2>

            <div className="health-modal-stats">
              <div className="health-modal-stat">
                <span className="health-modal-stat-label">Tiempo sin fumar</span>
                <span className="health-modal-stat-value">{formatElapsed(minutesFree)}</span>
              </div>
              <div className="health-modal-stat">
                <span className="health-modal-stat-label">Meta de este beneficio</span>
                <span className="health-modal-stat-value">{selected.timeLabel}</span>
              </div>
            </div>

            <div className="health-bar-track" style={{ height: '12px', margin: '12px 0 8px' }}>
              <div
                className={`health-bar-fill ${selectedComplete ? 'health-bar-complete' : ''}`}
                style={{ width: `${selectedProgress}%` }}
              />
            </div>
            <div className="health-modal-progress-text">
              {selectedComplete ? '✓ Beneficio alcanzado' : `${selectedProgress.toFixed(1)}% completado`}
            </div>

            <p className="modal-body" style={{ marginTop: '16px' }}>{selected.description}</p>
            <p className="health-modal-source">Fuente: {selected.source}</p>

            <button className="health-share-btn" onClick={handleShare} disabled={sharing}>
              {sharing ? <Share2 size={18} className="health-share-spin" /> : <Share2 size={18} />}
              {sharing ? 'Generando imagen...' : 'Compartir este logro'}
            </button>
            {shareError && <p className="health-share-error">{shareError}</p>}
          </div>
        </div>
      )}

      {selected && (
        <div
          ref={shareCardRef}
          className="health-share-card"
          aria-hidden="true"
        >
          <div className="health-share-card-header">
            <span className="health-share-brand">Déjalo Hoy 🌱</span>
          </div>
          <div className="health-share-card-body">
            <div className="health-share-icon-circle">
              <selected.icon size={64} />
            </div>
            <span className="health-share-label">¡LOGRO ALCANZADO!</span>
            <h3 className="health-share-title">{selected.title}</h3>
            <div className="health-share-time">
              <span className="health-share-time-value">{formatElapsed(minutesFree)}</span>
              <span className="health-share-time-label">sin fumar</span>
            </div>
            <div className="health-bar-track health-share-bar">
              <div
                className={`health-bar-fill ${selectedComplete ? 'health-bar-complete' : ''}`}
                style={{ width: `${selectedProgress}%` }}
              />
            </div>
            <span className="health-share-date">{shareDate}</span>
          </div>
          <div className="health-share-card-footer">Hecho con Déjalo Hoy</div>
        </div>
      )}

      {showDependence && (
        <div className="modal-overlay" onClick={() => setShowDependence(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDependence(false)}>
              <X size={20} />
            </button>
            <div className="health-modal-icon">
              <BrainIcon size={56} />
            </div>
            <h2 className="modal-title" style={{ textAlign: 'center' }}>Dependencia a la Nicotina</h2>

            <div className="health-modal-stats">
              <div className="health-modal-stat">
                <span className="health-modal-stat-label">Tiempo sin fumar</span>
                <span className="health-modal-stat-value">{formatElapsed(minutesFree)}</span>
              </div>
              <div className="health-modal-stat">
                <span className="health-modal-stat-label">Camino a la libertad</span>
                <span className="health-modal-stat-value">{dependenceProgress.toFixed(0)}%</span>
              </div>
            </div>

            <div className="health-bar-track" style={{ height: '12px', margin: '12px 0 8px' }}>
              <div className="health-bar-fill" style={{ width: `${dependenceProgress}%` }} />
            </div>
            <div className="health-modal-progress-text">
              {dependenceProgress >= 100
                ? '✓ Dependencia superada'
                : `Etapa actual: ${currentStage.title}`}
            </div>

            <p className="modal-body" style={{ marginTop: '12px' }}>{currentStage.text}</p>

            <div className="health-stages-list">
              {DEPENDENCE_STAGES.map((stage, index) => {
                const reached = minutesFree >= stage.timeReq;
                return (
                  <div
                    key={stage.timeReq}
                    className={`health-stage-item ${reached ? 'health-stage-reached' : ''} ${
                      stage === currentStage && !reached ? 'health-stage-current' : ''
                    }`}
                  >
                    <div className="health-stage-check">
                      {reached ? (
                        <CheckCircle2 size={18} color="#4CAF50" />
                      ) : (
                        <Circle size={18} color="#B0BEC5" />
                      )}
                    </div>
                    <div className="health-stage-info">
                      <span className="health-stage-title">
                        {index + 1}. {stage.title}
                      </span>
                      <span className="health-stage-time">{stage.timeLabel} sin fumar</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="health-modal-source">Fuente: American Cancer Society, Smokefree.gov (NCI)</p>
          </div>
        </div>
      )}

      {sharePreview && (
        <div className="modal-overlay" onClick={closeSharePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeSharePreview}>
              <X size={20} />
            </button>
            <h2 className="modal-title" style={{ textAlign: 'center' }}>Tu logro en imagen</h2>
            <p className="modal-body" style={{ textAlign: 'center', marginBottom: '12px' }}>
              Tu dispositivo no permite compartir imágenes directamente. Descargá la tarjeta y
              compartila desde la app que prefieras.
            </p>
            <div className="health-share-preview-wrap">
              <img src={sharePreview} alt="Tarjeta del logro" className="health-share-preview" />
            </div>
            <button className="health-share-btn" onClick={downloadShareImage}>
              <Download size={18} />
              Descargar imagen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
