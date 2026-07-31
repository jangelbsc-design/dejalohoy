import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useStore } from '../store/useStore';
import { ArrowLeft, KeyRound, User, Cigarette } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const changePassword = useAuthStore((state) => state.changePassword);
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [packsPerDay, setPacksPerDay] = useState(() => {
    if (!profile || !profile.cigsPerPack || profile.cigsPerPack <= 0) return '1';
    const calculated = profile.cigsPerDay / profile.cigsPerPack;
    return String(Math.round(calculated * 100) / 100);
  });
  const [cigsPerPack, setCigsPerPack] = useState(String(profile?.cigsPerPack && profile.cigsPerPack > 0 ? profile.cigsPerPack : 20));
  const [pricePerPack, setPricePerPack] = useState(String(profile?.pricePerPack ?? 0));
  const [yearsSmoking, setYearsSmoking] = useState(String(profile?.yearsSmoking ?? 0));
  const [dataMessage, setDataMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const perPack = Math.max(1, parseFloat(cigsPerPack) || 1);
  const packs = parseFloat(packsPerDay) || 0;
  const cigsPerDay = Math.round(packs * perPack);

  const handleSaveData = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      cigsPerDay,
      cigsPerPack: perPack,
      pricePerPack: parseFloat(pricePerPack) || 0,
      yearsSmoking: parseInt(yearsSmoking) || 0,
    });
    setDataMessage({ ok: true, text: 'Tus datos se actualizaron correctamente.' });
  };

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ ok: false, text: 'Las contraseñas no coinciden.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    const result = await changePassword(newPassword);
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
          <Cigarette size={18} />
          Mis datos de fumador
        </h2>
        <p className="profile-card-subtitle">
          Si tus cálculos de ahorro no son correctos, revisá estos datos. El contador de tiempo no se reinicia.
        </p>

        <div className="input-group">
          <label>Cajetillas por día</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={packsPerDay}
            onChange={(e) => setPacksPerDay(e.target.value)}
          />
          <span className="input-hint">
            Ej: media cajetilla = 0.5 · {cigsPerDay > 0 ? `${cigsPerDay} cigarrillos al día` : ''}
          </span>
        </div>

        <div className="input-group">
          <label>Cigarrillos por cajetilla</label>
          <input
            type="number"
            min="1"
            step="1"
            value={cigsPerPack}
            onChange={(e) => setCigsPerPack(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Precio por cajetilla (Bs)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={pricePerPack}
            onChange={(e) => setPricePerPack(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Años fumando</label>
          <input
            type="number"
            min="0"
            step="1"
            value={yearsSmoking}
            onChange={(e) => setYearsSmoking(e.target.value)}
          />
        </div>

        {dataMessage && (
          <p className={`profile-message ${dataMessage.ok ? 'profile-message-ok' : 'profile-message-error'}`}>
            {dataMessage.text}
          </p>
        )}

        <button
          className="btn-primary profile-save"
          onClick={handleSaveData}
          disabled={!profile || perPack <= 0}
        >
          Guardar mis datos
        </button>
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
