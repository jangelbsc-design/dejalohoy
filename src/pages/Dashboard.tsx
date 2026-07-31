import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Clock, DollarSign, Activity, Heart, AlertTriangle, MessageCircle, X } from 'lucide-react';
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
  const profile = useStore((state) => state.profile);
  const resetProfile = useStore((state) => state.resetProfile);
  const [showAssistant, setShowAssistant] = useState(false);

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

  return (
    <div style={{ paddingTop: '20px' }}>
      
      {/* Tarjeta Principal: Tiempo Libre */}
      <div className="card" style={{ padding: '30px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <Clock color="var(--primary)" size={24} />
          <h2 style={{ fontSize: '18px', margin: 0 }}>Tiempo Libre de Humo</h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)' }}>{time.days}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>DÍAS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)' }}>{time.hours}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>HRS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)' }}>{time.minutes}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>MIN</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)' }}>{time.seconds}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>SEG</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        {/* Tarjeta: Dinero Ahorrado */}
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px' }}>
            <DollarSign color="var(--success)" size={18} />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>Ahorrado</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)' }}>
            Bs {money.toFixed(2)}
          </div>
        </div>

        {/* Tarjeta: Cigarrillos No Fumados */}
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px' }}>
            <Activity color="var(--primary)" size={18} />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>Evitados</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)' }}>
            {cigs}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>cigarrillos</div>
        </div>
      </div>

      {/* Tarjeta: Vida Recuperada */}
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <Heart color="var(--warning)" size={24} />
          <h2 style={{ fontSize: '18px', margin: 0 }}>Vida Recuperada</h2>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--warning)', margin: '10px 0' }}>
          {life.days > 0 ? `${life.days}d ` : ''}{life.hours}h {life.minutes}m
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Estimado basado en 11 min por cigarrillo
        </div>
      </div>

      {/* Botón Caí */}
      <button className="btn-cai" onClick={handleCai} style={{ marginTop: '10px' }}>
        <AlertTriangle size={24} />
        ¡Caí!
      </button>

      {/* Botón Asistente de Caída */}
      <button className="btn-assistant" onClick={() => setShowAssistant(true)} style={{ marginTop: '10px' }}>
        <MessageCircle size={24} />
        Asistente de Caída
      </button>

      {/* Modal Asistente de Caída */}
      {showAssistant && (
        <div className="modal-overlay" onClick={() => setShowAssistant(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAssistant(false)}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>
              Asistente de Caída
            </h2>
            <p style={{ marginBottom: '16px', lineHeight: 1.6 }}>
              Si has fumado, no te preocupes. Un tropiezo no es el fin de tu camino. 
              Esto es lo que puedes hacer ahora:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><strong>Reconócelo como un tropiezo, no una derrota.</strong> No dejes que un cigarro arruine todo tu progreso. Lo importante es seguir adelante.</li>
              <li><strong>Identifica el desencadenante.</strong> ¿Estrés? ¿Alcohol? ¿Ansiedad? Saber qué lo causó te ayudará a prepararte para la próxima vez.</li>
              <li><strong>Reinicia ahora mismo.</strong> Presiona "Caí" para reiniciar el contador y vuelve a empezar. Cada minuto sin fumar cuenta.</li>
              <li><strong>Bebe agua y respira profundo.</strong> Toma un vaso de agua y haz 10 respiraciones lentas para calmar la ansiedad.</li>
              <li><strong>Busca apoyo.</strong> Habla con alguien de confianza. Compartir lo que sientes reduce la carga y te fortalece.</li>
              <li><strong>Retoma tu plan.</strong> Revisa por qué decidiste dejar de fumar. Tus razones siguen siendo válidas.</li>
            </ul>
            <p style={{ marginTop: '16px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              "El éxito no es no caer nunca, sino levantarse cada vez que caes." — Confucio
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
