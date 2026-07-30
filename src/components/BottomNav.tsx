import { Link, useLocation } from 'react-router-dom';
import { Activity, Heart, Award } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Activity size={24} />
        <span>Progreso</span>
      </Link>
      <Link to="/health" className={`nav-item ${location.pathname === '/health' ? 'active' : ''}`}>
        <Heart size={24} />
        <span>Salud</span>
      </Link>
      <Link to="/badges" className={`nav-item ${location.pathname === '/badges' ? 'active' : ''}`}>
        <Award size={24} />
        <span>Logros</span>
      </Link>
    </div>
  );
}
