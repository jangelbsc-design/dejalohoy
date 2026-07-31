import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { differenceInMinutes } from 'date-fns';
import { ArrowLeft, X, CheckCircle2, Circle } from 'lucide-react';
import { SmilingHeartIcon, LungsIcon, DropletIcon, TasteFaceIcon, BreathingIcon, HeartbeatIcon, CleanLungsIcon, ShieldHeartIcon } from '../components/CartoonIcons';

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

export default function Health() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);
  const [minutesFree, setMinutesFree] = useState(0);
  const [selected, setSelected] = useState<HealthMilestone | null>(null);

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
          </div>
        </div>
      )}
    </div>
  );
}
