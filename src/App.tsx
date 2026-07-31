import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore, UserProfileData } from './store/useStore';
import { useAuthStore } from './store/authStore';
import './core/sync';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Guide from './pages/Guide';
import Health from './pages/Health';
import LifeRecovered from './pages/LifeRecovered';
import Achievements from './pages/Achievements';
import Wishlist from './pages/Wishlist';
import Medals from './pages/Medals';
import Profile from './pages/Profile';

function parseProfileFromUrl(): UserProfileData | null {
  const params = new URLSearchParams(window.location.search);
  const start = params.get('start');
  if (!start) return null;

  const parseNum = (value: string | null, fallback: number): number => {
    if (!value) return fallback;
    const parsed = parseFloat(value.replace(',', '.'));
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  return {
    startDate: start,
    cigsPerDay: parseNum(params.get('cigsPerDay'), 0),
    cigsPerPack: parseNum(params.get('cigsPerPack'), 20),
    pricePerPack: parseNum(params.get('pricePerPack'), 0),
    yearsSmoking: parseNum(params.get('yearsSmoking'), 0),
  };
}

const restoredFromUrl = parseProfileFromUrl();
if (restoredFromUrl) {
  useStore.setState({ profile: restoredFromUrl });
}

const urlParams = new URLSearchParams(window.location.search);
const spaPath = urlParams.get('p');
const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '');

function Layout() {
  const profile = useStore((state) => state.profile);
  const currentUser = useAuthStore((state) => state.currentUser);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (spaPath) {
      const route = spaPath.replace(basePath, '') || '/';
      navigate(route, { replace: true });
    } else if (restoredFromUrl) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [navigate]);

  if (!currentUser) {
    return <Login />;
  }

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
          <Route path="/guide" element={<Guide />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/medals" element={<Medals />} />
          <Route path="/health" element={<Health />} />
          <Route path="/life" element={<LifeRecovered />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={basePath || '/'}>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
