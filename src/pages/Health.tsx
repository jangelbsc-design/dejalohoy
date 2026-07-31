import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { differenceInMinutes } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';

const MILESTONES = [
  { id: 1, timeReq: 20, title: 'Presión Arterial', desc: 'Tu ritmo cardíaco y presión arterial vuelven a niveles normales. — American Cancer Society' },
  { id: 2, timeReq: 720, title: 'Monóxido de Carbono (12h)', desc: 'El nivel de CO en sangre baja a lo normal y el oxígeno aumenta. — Cleveland Clinic' },
  { id: 3, timeReq: 1440, title: 'Nicotina Eliminada (24h)', desc: 'La nicotina se elimina completamente de tu cuerpo. — CDC' },
  { id: 4, timeReq: 2880, title: 'Gusto y Olfato (48h)', desc: 'Las terminaciones nerviosas se regeneran. Mejoran el gusto y el olfato.' },
  { id: 5, timeReq: 4320, title: 'Respiración (72h)', desc: 'Los bronquios se relajan. Respirar se vuelve más fácil y aumenta tu energía. — Medical News Today' },
  { id: 6, timeReq: 20160, title: 'Circulación (2 sem)', desc: 'La circulación y función pulmonar mejoran hasta un 30%. — Cleveland Clinic' },
  { id: 7, timeReq: 43200, title: 'Cilias Pulmonares (1 mes)', desc: 'Las cilias se regeneran, limpiando los pulmones. Menos tos y riesgo de infecciones. — SolutionHealth' },
  { id: 8, timeReq: 525600, title: 'Corazón (1 año)', desc: 'El riesgo de enfermedad coronaria se reduce a la mitad. — American Cancer Society' },
  { id: 9, timeReq: 2629800, title: 'ACV (5 años)', desc: 'El riesgo de accidente cerebrovascular iguala al de un no fumador. — UnitedHealthcare' },
];

export default function Health() {
  const profile = useStore((state) => state.profile);
  const [minutesFree, setMinutesFree] = useState(0);

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);
    
    const update = () => {
      setMinutesFree(differenceInMinutes(new Date(), startDate));
    };
    
    update();
    const interval = setInterval(update, 1000 * 60); // Update every minute
    return () => clearInterval(interval);
  }, [profile]);

  return (
    <div style={{ paddingTop: '20px' }}>
      <h1 className="title">Hitos de Salud</h1>
      <p className="subtitle">Mira cómo se recupera tu cuerpo con el tiempo.</p>

      {MILESTONES.map((milestone) => {
        let progress = (minutesFree / milestone.timeReq) * 100;
        if (progress > 100) progress = 100;
        const isComplete = progress === 100;

        return (
          <div key={milestone.id} className="card" style={{ borderColor: isComplete ? 'var(--success)' : 'rgba(0,180,216,0.1)', backgroundColor: isComplete ? '#F9FFF9' : 'var(--surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', margin: '0 0 4px 0' }}>{milestone.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{milestone.desc}</p>
              </div>
              {isComplete ? (
                <CheckCircle2 color="var(--success)" size={24} />
              ) : (
                <Circle color="var(--text-secondary)" size={24} />
              )}
            </div>

            <div style={{ height: '8px', backgroundColor: '#E0E0E0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: `${progress}%`, backgroundColor: isComplete ? 'var(--success)' : 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 'bold' }}>
              {progress.toFixed(1)}% Completado
            </div>
          </div>
        );
      })}
    </div>
  );
}
