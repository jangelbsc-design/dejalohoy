import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, KeyRound, User } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const changePassword = useAuthStore((state) => state.changePassword);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ ok: false, text: 'Las contraseñas no coinciden.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    const result = await changePassword(currentUser ?? '', newPassword);
    setMessage(
      result.ok
        ? { ok: true, text: 'Contraseña actualizada correctamente.' }
        : { ok: false, text: result.error ?? 'Ocurrió un error.' }
    );
    setLoading(false);
    if (result.ok) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="profile-page">
      <div className="health-header">
        <button className="health-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="health-title">Mi Perfil</h1>
      </div>

      <div className="profile-card">
        <div className="profile-user">
          <div className="profile-avatar">
            <User size={34} />
          </div>
          <div className="profile-user-info">
            <span className="profile-user-label">Cuenta activa</span>
            <span className="profile-username">{currentUser}</span>
          </div>
        </div>
        <p className="profile-note">
          Tus datos se guardan en este dispositivo. Si perdés o querés cambiar tus llaves de ingreso, podés colocarlas de nuevo acá.
        </p>
      </div>

      <div className="profile-card">
        <h2 className="profile-card-title">
          <KeyRound size={18} />
          Cambiar contraseña
        </h2>
        <p className="profile-card-subtitle">
          Si te olvidaste tus llaves de ingreso, definí una nueva contraseña. Necesitás mínimo 4 caracteres.
        </p>

        <div className="input-group">
          <label>Contraseña nueva</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 4 caracteres"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Repetir contraseña nueva</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Repetí la contraseña nueva"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
        </div>

        {message && (
          <p className={`profile-message ${message.ok ? 'profile-message-ok' : 'profile-message-error'}`}>
            {message.text}
          </p>
        )}

        <button
          className="btn-primary profile-save"
          onClick={handleSave}
          disabled={loading || !newPassword || !confirmPassword}
        >
          {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
        </button>
      </div>
    </div>
  );
}
