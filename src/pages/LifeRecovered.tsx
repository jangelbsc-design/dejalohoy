import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { differenceInSeconds } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

interface Recovered {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CHAIN_LINKS = Array.from({ length: 9 }, (_, i) => i);

export default function LifeRecovered() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);
  const [recovered, setRecovered] = useState<Recovered>({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);

    const update = () => {
      const elapsed = Math.max(0, differenceInSeconds(new Date(), startDate));
      const recoveredSeconds = (elapsed / 86400) * (profile.cigsPerDay ?? 0) * 660;
      const total = Math.floor(recoveredSeconds);

      const years = Math.floor(total / (365.25 * 86400));
      const rem1 = total % (365.25 * 86400);
      const days = Math.floor(rem1 / 86400);
      const rem2 = rem1 % 86400;
      const hours = Math.floor(rem2 / 3600);
      const minutes = Math.floor((rem2 % 3600) / 60);
      const seconds = rem2 % 60;

      setRecovered({ years, days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [profile]);

  const totalSeconds =
    recovered.years * 365.25 * 86400 + recovered.days * 86400 + recovered.hours * 3600 + recovered.minutes * 60 + recovered.seconds;
  const cigsRecovered = (totalSeconds / 660).toFixed(0);

  return (
    <div className="life-page">
      <div className="life-header">
        <button className="health-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="health-title">Vida Recuperada</h1>
      </div>

      <p className="health-subtitle" style={{ textAlign: 'center' }}>
        Cada cigarro evitado recupera ~11 minutos de vida.
        <br />
        Estás rompiendo la cadena de la adicción.
      </p>

      <div className="life-chain-wrap">
        <div className="life-chain">
          {CHAIN_LINKS.map((i) => {
            const isBroken = i === 3 || i === 4 || i === 5;
            return (
              <div
                key={i}
                className={`chain-link ${i % 2 === 1 ? 'chain-link-h' : ''} ${
                  isBroken ? 'chain-link-broken' : ''
                }`}
                style={{ animationDelay: `${(i - 2) * 0.25}s` }}
              />
            );
          })}
        </div>
        <div className="life-chain-sparks">
          <span className="life-spark life-spark-1">✦</span>
          <span className="life-spark life-spark-2">✦</span>
          <span className="life-spark life-spark-3">✦</span>
        </div>
      </div>

      <div className="life-counter-card">
        <span className="life-counter-label">Tiempo de vida recuperado</span>
        <div className="life-boxes">
          <div className="life-box">
            <span className="life-box-num">{recovered.years}</span>
            <span className="life-box-label">años</span>
          </div>
          <div className="life-box">
            <span className="life-box-num">{recovered.days}</span>
            <span className="life-box-label">días</span>
          </div>
          <div className="life-box">
            <span className="life-box-num">{recovered.hours}</span>
            <span className="life-box-label">horas</span>
          </div>
          <div className="life-box">
            <span className="life-box-num">{recovered.minutes}</span>
            <span className="life-box-label">min</span>
          </div>
          <div className="life-box life-box-seconds">
            <span className="life-box-num">{recovered.seconds}</span>
            <span className="life-box-label">seg</span>
          </div>
        </div>
        <p className="life-note">
          Equivalente a <strong>{cigsRecovered}</strong> cigarros que nunca fumaste
        </p>
      </div>

      <p className="life-source">Fuente: cada cigarro reduce la expectativa de vida ~11 minutos (WHO / Harvard Health)</p>
    </div>
  );
}
