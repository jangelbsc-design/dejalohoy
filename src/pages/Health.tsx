import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { differenceInMinutes } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';

const MILESTONES = [
  { id: 1, timeReq: 20, title: 'Presión Arterial', desc: 'Tu presión arterial y ritmo cardíaco vuelven a la normalidad.' },
  { id: 2, timeReq: 480, title: 'Oxigenación (8h)', desc: 'Los niveles de oxígeno en tu sangre se normalizan.' },
  { id: 3, timeReq: 720, title: 'Monóxido de Carbono (12h)', desc: 'El monóxido de carbono cae a niveles normales.' },
  { id: 4, timeReq: 2880, title: 'Gusto y Olfato (48h)', desc: 'Las terminaciones nerviosas comienzan a regenerarse.' },
  { id: 5, timeReq: 4320, title: 'Respiración (72h)', desc: 'Los bronquios se relajan, es más fácil respirar.' },
  { id: 6, timeReq: 20160, title: 'Pulmones (2 sem)', desc: 'Mejora notable en la circulación y función pulmonar.' },
  { id: 7, timeReq: 525600, title: 'Corazón (1 año)', desc: 'El riesgo de enfermedad coronaria es la mitad del de un fumador.' },
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
