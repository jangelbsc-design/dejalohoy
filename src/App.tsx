import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore, UserProfileData } from './store/useStore';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Health from './pages/Health';
import LifeRecovered from './pages/LifeRecovered';
import Achievements from './pages/Achievements';
import Wishlist from './pages/Wishlist';
import Medals from './pages/Medals';

function Layout() {
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const start = params.get('start');
    if (!start) return;

    const parseNum = (value: string | null, fallback: number): number => {
      if (!value) return fallback;
      const parsed = parseFloat(value.replace(',', '.'));
      return Number.isNaN(parsed) ? fallback : parsed;
    };

    const restored: UserProfileData = {
      startDate: start,
      cigsPerDay: parseNum(params.get('cigsPerDay'), 0),
      cigsPerPack: parseNum(params.get('cigsPerPack'), 20),
      pricePerPack: parseNum(params.get('pricePerPack'), 0),
      yearsSmoking: parseNum(params.get('yearsSmoking'), 0),
    };

    setProfile(restored);
    window.history.replaceState(null, '', `#${location.pathname}`);
  }, [location.search, location.pathname, setProfile]);

  if (!profile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (profile && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return (
    <div id="root">
      <div className="page-container">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/medals" element={<Medals />} />
          <Route path="/health" element={<Health />} />
          <Route path="/life" element={<LifeRecovered />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}

export default App;
