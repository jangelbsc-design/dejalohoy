import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const result = mode === 'login' ? await login(username, password) : await register(username, password);
    setError(result.ok ? null : result.error ?? 'Ocurrió un error.');
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🚭</div>
        <h1 className="login-title">Déjalo Hoy</h1>
        <p className="login-subtitle">
          {mode === 'login'
            ? 'Iniciá sesión para cargar el progreso de tu cuenta.'
            : 'Creá tu cuenta y guardá tu progreso para siempre.'}
        </p>

        <div className="login-mode">
          <button
            className={`login-mode-btn ${mode === 'login' ? 'login-mode-btn-active' : ''}`}
            onClick={() => {
              setMode('login');
              setError(null);
            }}
          >
            Iniciar sesión
          </button>
          <button
            className={`login-mode-btn ${mode === 'register' ? 'login-mode-btn-active' : ''}`}
            onClick={() => {
              setMode('register');
              setError(null);
            }}
          >
            Crear cuenta
          </button>
        </div>

        <div className="input-group">
          <label>Usuario</label>
          <input
            type="text"
            autoComplete="username"
            placeholder="Tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="btn-primary login-submit" onClick={handleSubmit} disabled={loading}>
          {loading
            ? 'Un momento...'
            : mode === 'login'
              ? 'Entrar a mi cuenta'
              : 'Crear cuenta y empezar'}
        </button>

        <p className="login-note">
          Tus datos se guardan solo en este dispositivo. {currentUser ? `Sesión: ${currentUser}` : ''}
        </p>
      </div>
    </div>
  );
}
