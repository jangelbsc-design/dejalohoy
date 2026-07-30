import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { calculateFreeTimeInDays, calculateMoneySaved } from '../core/utils/calculations';
import { Lock, Star } from 'lucide-react';

const BADGES = [
  { id: 't1', title: 'Primeras 24h', desc: '¡Superaste el primer día!', type: 'time', req: 1 },
  { id: 't2', title: 'Primera Semana', desc: '7 días libre de humo', type: 'time', req: 7 },
  { id: 't3', title: 'Un Mes Fuerte', desc: '30 días de victoria', type: 'time', req: 30 },
  { id: 'm1', title: 'Primeros 100 Bs', desc: 'Ahorraste 100 Bs', type: 'money', req: 100 },
  { id: 'm2', title: 'Cena Pagada', desc: 'Ahorraste 500 Bs', type: 'money', req: 500 },
];

export default function Badges() {
  const profile = useStore((state) => state.profile);
  const [daysFree, setDaysFree] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);
    
    const freeDays = calculateFreeTimeInDays(startDate);
    setDaysFree(freeDays);
    setMoneySaved(calculateMoneySaved(freeDays, profile.cigsPerDay, profile.cigsPerPack, profile.pricePerPack));
  }, [profile]);

  return (
    <div style={{ paddingTop: '20px' }}>
      <h1 className="title">Tus Logros</h1>
      <p className="subtitle">Celebra cada pequeña victoria en tu camino.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {BADGES.map((badge) => {
          const isUnlocked = badge.type === 'time' ? daysFree >= badge.req : moneySaved >= badge.req;
          
          return (
            <div key={badge.id} className="card" style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: 0,
              opacity: isUnlocked ? 1 : 0.6,
              borderColor: isUnlocked ? 'var(--warning)' : 'rgba(0,180,216,0.1)',
              borderWidth: isUnlocked ? '2px' : '1px'
            }}>
              <div style={{ marginBottom: '12px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isUnlocked ? (
                  <Star color="var(--warning)" size={36} fill="var(--warning)" />
                ) : (
                  <Lock color="var(--text-secondary)" size={32} />
                )}
              </div>
              <h3 style={{ fontSize: '14px', margin: '0 0 4px 0', color: isUnlocked ? 'var(--text)' : 'var(--text-secondary)' }}>
                {badge.title}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                {badge.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
