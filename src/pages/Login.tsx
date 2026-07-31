import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    const result = mode === 'login' ? await login(username, password) : await register(username, password);
    setError(result.ok ? null : result.error ?? 'Ocurrió un error.');
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!username.trim()) {
      setError('Ingresá tu usuario o email para recuperar la contraseña.');
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    const result = await resetPassword(username);
    setError(result.ok ? null : result.error ?? 'Ocurrió un error.');
    if (result.ok) {
      setInfo('Si la cuenta existe, te enviamos un correo para restablecer tu contraseña.');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🚭</div>
        <h1 className="login-title">Déjalo Hoy</h1>
        <p className="login-subtitle">
          {mode === 'login'
            ? 'Ingresá tus credenciales para cargar tu progreso desde cualquier dispositivo.'
            : 'Creá tu cuenta y guardá tu progreso en la nube.'}
        </p>

        <div className="login-mode">
          <button
            className={`login-mode-btn ${mode === 'login' ? 'login-mode-btn-active' : ''}`}
            onClick={() => {
              setMode('login');
              setError(null);
              setInfo(null);
            }}
          >
            Iniciar sesión
          </button>
          <button
            className={`login-mode-btn ${mode === 'register' ? 'login-mode-btn-active' : ''}`}
            onClick={() => {
              setMode('register');
              setError(null);
              setInfo(null);
            }}
          >
            Crear cuenta
          </button>
        </div>

        <div className="input-group">
          <label>Usuario o email</label>
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
            placeholder="Mínimo 4 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
        </div>

        {error && <p className="login-error">{error}</p>}
        {info && <p className="login-info">{info}</p>}

        <button className="btn-primary login-submit" onClick={handleSubmit} disabled={loading}>
          {loading
            ? 'Un momento...'
            : mode === 'login'
              ? 'Entrar a mi cuenta'
              : 'Crear cuenta y empezar'}
        </button>

        {mode === 'login' && (
          <button className="login-forgot" onClick={handleForgot} disabled={loading}>
            ¿Olvidaste tu contraseña?
          </button>
        )}

        <p className="login-note">
          {currentUser ? `Sesión: ${currentUser}` : 'Tu progreso se sincroniza con la nube.'}
        </p>
      </div>
    </div>
  );
}
