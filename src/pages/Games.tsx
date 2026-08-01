import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { GamepadIcon } from '../components/CartoonIcons';

export default function Games() {
  const navigate = useNavigate();

  return (
    <div className="games-page">
      <div className="health-header">
        <button className="health-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="health-title">Juegos</h1>
      </div>

      <p className="health-subtitle">
        Desconéctate un momento y gana más tiempo libre sin fumar.
      </p>

      <div className="games-list">
        <button className="game-card" onClick={() => navigate('/games/tetris')}>
          <span className="game-card-icon">
            <GamepadIcon size={30} />
          </span>
          <span className="game-card-info">
            <span className="game-card-name">Tetris</span>
            <span className="game-card-desc">
              Encaja las piezas y completa líneas. Simple, adictivo y relajante.
            </span>
          </span>
          <ChevronRight className="game-card-arrow" size={22} />
        </button>
      </div>
    </div>
  );
}
