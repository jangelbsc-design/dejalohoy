import React, { useState } from 'react';
import { useStore } from '../store/useStore';

export default function Onboarding() {
  const setProfile = useStore((state) => state.setProfile);
  
  const [cigsPerDay, setCigsPerDay] = useState('10');
  const [cigsPerPack, setCigsPerPack] = useState('20');
  const [pricePerPack, setPricePerPack] = useState('20');
  const [yearsSmoking, setYearsSmoking] = useState('5');

  const handleSave = () => {
    setProfile({
      startDate: new Date().toISOString(),
      cigsPerDay: parseInt(cigsPerDay) || 0,
      cigsPerPack: parseInt(cigsPerPack) || 20,
      pricePerPack: parseFloat(pricePerPack) || 0,
      yearsSmoking: parseInt(yearsSmoking) || 0,
    });
  };

  return (
    <div style={{ paddingTop: '40px' }}>
      <h1 className="title" style={{ textAlign: 'center' }}>¡Felicidades por tu decisión!</h1>
      <p className="subtitle" style={{ textAlign: 'center' }}>
        Configura tus datos para comenzar tu nueva vida libre de humo.
      </p>
      
      <div className="input-group">
        <label>Cigarrillos por día</label>
        <input type="number" value={cigsPerDay} onChange={(e) => setCigsPerDay(e.target.value)} />
      </div>

      <div className="input-group">
        <label>Cigarrillos por cajetilla</label>
        <input type="number" value={cigsPerPack} onChange={(e) => setCigsPerPack(e.target.value)} />
      </div>

      <div className="input-group">
        <label>Precio por cajetilla (Bs)</label>
        <input type="number" value={pricePerPack} onChange={(e) => setPricePerPack(e.target.value)} />
      </div>

      <div className="input-group">
        <label>Años fumando</label>
        <input type="number" value={yearsSmoking} onChange={(e) => setYearsSmoking(e.target.value)} />
      </div>

      <button className="btn-primary" onClick={handleSave} style={{ marginTop: '20px' }}>
        ¡Empezar mi nueva vida!
      </button>
    </div>
  );
}
