import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const resetPassword = useAuthStore((state) => state.resetPassword);

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
        <div className="login-logo-wrap">
          <span className="login-logo-emoji">🚭</span>
        </div>
        <h1 className="login-title">Déjalo Hoy</h1>
        <p className="login-subtitle">
          {mode === 'login'
            ? 'Iniciá sesión para continuar con tu progreso.'
            : 'Creá un nuevo perfil para empezar desde cero.'}
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
            Crear perfil
          </button>
        </div>

        <div className="input-group">
          <label className="login-input-label">Usuario o Email</label>
          <input
            className="login-input"
            type="text"
            autoComplete="username"
            placeholder="Tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="login-input-label">Contraseña</label>
          <input
            className="login-input"
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

        {error && <div className="login-error-card">{error}</div>}
        {info && <div className="login-info-card">{info}</div>}

        <button className="login-submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading
            ? 'Un momento...'
            : mode === 'login'
              ? 'Entrar a mi perfil'
              : 'Crear perfil y empezar'}
        </button>

        {mode === 'login' && (
          <button className="login-forgot-btn" onClick={handleForgot} disabled={loading}>
            ¿Olvidaste tu contraseña?
          </button>
        )}

        <div className="login-credential-tip">
          <span className="login-credential-tip-title">ℹ️ Nota de perfil:</span>
          <p>Para conservar tu avance usa:</p>
          <p>Usuario: <strong>Juange</strong> | Contraseña: <strong>julizam</strong></p>
        </div>
      </div>
    </div>
  );
}
