import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function Onboarding() {
  const setProfile = useStore((state) => state.setProfile);

  const [packsPerDay, setPacksPerDay] = useState('1');
  const [cigsPerPack, setCigsPerPack] = useState('20');
  const [pricePerPack, setPricePerPack] = useState('20');
  const [yearsSmoking, setYearsSmoking] = useState('5');

  const perPack = Math.max(1, parseFloat(cigsPerPack) || 1);
  const packs = parseFloat(packsPerDay) || 0;
  const cigsPerDay = Math.round(packs * perPack);
  const canSave = packs > 0 && perPack >= 1;

  const handleSave = () => {
    setProfile({
      startDate: new Date().toISOString(),
      cigsPerDay,
      cigsPerPack: perPack,
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
        <label>Cajetillas por día</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={packsPerDay}
          onChange={(e) => setPacksPerDay(e.target.value)}
        />
        <span className="input-hint">
          Ej: media cajetilla = 0.5 · {cigsPerDay > 0 ? `${cigsPerDay} cigarrillos al día` : ''}
        </span>
      </div>

      <div className="input-group">
        <label>Cigarrillos por cajetilla</label>
        <input
          type="number"
          min="1"
          step="1"
          value={cigsPerPack}
          onChange={(e) => setCigsPerPack(e.target.value)}
        />
        <span className="input-hint">Mínimo 1 cigarrillo por cajetilla</span>
      </div>

      <div className="input-group">
        <label>Precio por cajetilla (Bs)</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={pricePerPack}
          onChange={(e) => setPricePerPack(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Años fumando</label>
        <input
          type="number"
          min="0"
          step="1"
          value={yearsSmoking}
          onChange={(e) => setYearsSmoking(e.target.value)}
        />
      </div>

      <button className="btn-primary" onClick={handleSave} style={{ marginTop: '20px' }} disabled={!canSave}>
        ¡Empezar mi nueva vida!
      </button>
    </div>
  );
}
