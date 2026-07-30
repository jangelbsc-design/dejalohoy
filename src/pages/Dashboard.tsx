import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Clock, DollarSign, Activity, AlertCircle, Heart } from 'lucide-react';
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

      {/* Botón de Pánico */}
      <button className="btn-danger" style={{ marginTop: '10px' }}>
        <AlertCircle size={24} />
        ¡Tengo Ansiedad!
      </button>

    </div>
  );
}
