import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import BottomNav from './components/BottomNav';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Health from './pages/Health';
import Badges from './pages/Badges';

function Layout() {
  const profile = useStore((state) => state.profile);
  const location = useLocation();

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
          <Route path="/health" element={<Health />} />
          <Route path="/badges" element={<Badges />} />
        </Routes>
      </div>
      {profile && <BottomNav />}
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
