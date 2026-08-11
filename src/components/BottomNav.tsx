import { NavLink } from 'react-router-dom';
import { Home, Flag, Trophy, Zap, Users, User } from 'lucide-react';

const TABS = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/missions', label: 'Misiones', icon: Flag },
  { to: '/community', label: 'Comunidad', icon: Users },
  { to: '/achievements', label: 'Logros', icon: Trophy },
  { to: '/cravings', label: 'Antojos', icon: Zap },
  { to: '/profile', label: 'Perfil', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
