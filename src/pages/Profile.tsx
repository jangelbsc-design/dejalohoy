import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useStore } from '../store/useStore';
import { useRemindersStore, DAY_LABELS, formatReminderTime } from '../store/remindersStore';
import { requestNotificationPermission } from '../components/ReminderScheduler';
import {
  ArrowLeft,
  Bell,
  BellRing,
  Cigarette,
  KeyRound,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  User,
} from 'lucide-react';

const REMINDER_EMOJIS = ['🌅', '🧘', '🌙', '☀️', '💪', '🍎', '💧', '😴', '🎯', '🔔'];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

function toggleDay(days: number[], day: number): number[] {
  return days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort();
}

function daysSummary(days: number[]): string {
  if (days.length === 7) return 'Todos los días';
  if (days.length === 0) return 'Sin días';
  return days.map((d) => DAY_LABELS[d]).join(' ');
}

export default function Profile() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const changePassword = useAuthStore((state) => state.changePassword);
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);

  const reminders = useRemindersStore((state) => state.reminders);
  const addReminder = useRemindersStore((state) => state.addReminder);
  const updateReminder = useRemindersStore((state) => state.updateReminder);
  const removeReminder = useRemindersStore((state) => state.removeReminder);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/');
  };

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

  const [notifState, setNotifState] = useState(() =>
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState('');
  const [editDays, setEditDays] = useState<number[]>(ALL_DAYS);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmoji, setNewEmoji] = useState('🔔');
  const [newLabel, setNewLabel] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newDays, setNewDays] = useState<number[]>(ALL_DAYS);

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

  const handleEnableNotifications = async () => {
    setNotifState(await requestNotificationPermission());
  };

  const handleAdd = () => {
    if (!newLabel.trim() || !newTime) return;
    addReminder({
      emoji: newEmoji,
      label: newLabel.trim(),
      body: newBody.trim() || 'Es hora de cuidarte. 🚭',
      time: newTime,
      days: newDays,
      enabled: true,
    });
    setShowAdd(false);
    setNewLabel('');
    setNewBody('');
  };

  const handleSaveEdit = (id: string) => {
    if (!editTime) return;
    updateReminder(id, { time: editTime, days: editDays });
    setEditingId(null);
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
            <span className="profile-username">{currentUser || 'Cuenta local'}</span>
          </div>
        </div>
        <p className="profile-note">
          Tus datos se guardan en este dispositivo. Si perdés o querés cambiar tus llaves de ingreso, podés colocarlas de nuevo acá.
        </p>

        <button className="btn-logout profile-logout" onClick={handleLogout}>
          <LogOut size={20} />
          Cerrar sesión
        </button>
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
          <BellRing size={18} />
          Recordatorios
        </h2>
        <p className="profile-card-subtitle">
          Recibí mensajes a lo largo del día para no perder el rumbo. Se muestran mientras la app está abierta.
        </p>

        {notifState !== 'granted' && notifState !== 'unsupported' && (
          <button className="reminder-enable-btn" onClick={handleEnableNotifications}>
            <Bell size={16} />
            {notifState === 'denied' ? 'Notificaciones bloqueadas en el navegador' : 'Activar notificaciones del navegador'}
          </button>
        )}
        {notifState === 'granted' && (
          <p className="reminder-perm-ok">Notificaciones del navegador activadas.</p>
        )}

        {reminders.map((r) => (
          <div key={r.id} className={`reminder-item${r.enabled ? '' : ' reminder-item-off'}`}>
            <div className="reminder-item-top">
              <span className="reminder-item-emoji">{r.emoji}</span>
              <div className="reminder-item-info">
                <strong className="reminder-item-label">{r.label}</strong>
                <span className="reminder-item-meta">
                  {formatReminderTime(r.time)} · {daysSummary(r.days)}
                </span>
              </div>
              <label className="reminder-switch">
                <input
                  type="checkbox"
                  checked={r.enabled}
                  onChange={() => updateReminder(r.id, { enabled: !r.enabled })}
                />
                <span className="reminder-switch-track" />
              </label>
            </div>
            {editingId === r.id ? (
              <div className="reminder-edit">
                <div className="reminder-edit-row">
                  <label>Hora</label>
                  <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                </div>
                <div className="reminder-days">
                  {ALL_DAYS.map((d) => (
                    <button
                      key={d}
                      className={`reminder-day-chip${editDays.includes(d) ? ' reminder-day-chip-on' : ''}`}
                      onClick={() => setEditDays(toggleDay(editDays, d))}
                    >
                      {DAY_LABELS[d]}
                    </button>
                  ))}
                </div>
                <div className="reminder-edit-actions">
                  <button className="btn-primary reminder-save-btn" onClick={() => handleSaveEdit(r.id)}>
                    Guardar
                  </button>
                  <button className="reminder-cancel-btn" onClick={() => setEditingId(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="reminder-item-actions">
                <button
                  className="reminder-icon-btn"
                  onClick={() => {
                    setEditingId(r.id);
                    setEditTime(r.time);
                    setEditDays(r.days);
                    setShowAdd(false);
                  }}
                  aria-label="Editar recordatorio"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="reminder-icon-btn reminder-icon-btn-danger"
                  onClick={() => removeReminder(r.id)}
                  aria-label="Eliminar recordatorio"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}

        {showAdd && (
          <div className="reminder-add">
            <div className="reminder-add-emoji">
              {REMINDER_EMOJIS.map((e) => (
                <button
                  key={e}
                  className={`reminder-emoji-option${newEmoji === e ? ' reminder-emoji-option-on' : ''}`}
                  onClick={() => setNewEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="input-group">
              <label>Título</label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Ej: Pausa para respirar"
              />
            </div>
            <div className="input-group">
              <label>Mensaje</label>
              <input
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Ej: Tomate 10 respiraciones profundas"
              />
            </div>
            <div className="input-group">
              <label>Hora</label>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
            <div className="reminder-days">
              {ALL_DAYS.map((d) => (
                <button
                  key={d}
                  className={`reminder-day-chip${newDays.includes(d) ? ' reminder-day-chip-on' : ''}`}
                  onClick={() => setNewDays(toggleDay(newDays, d))}
                >
                  {DAY_LABELS[d]}
                </button>
              ))}
            </div>
            <div className="reminder-edit-actions">
              <button
                className="btn-primary reminder-save-btn"
                onClick={handleAdd}
                disabled={!newLabel.trim() || !newTime}
              >
                Agregar recordatorio
              </button>
              <button className="reminder-cancel-btn" onClick={() => setShowAdd(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <button className="goal-add-btn" onClick={() => { setShowAdd((v) => !v); setEditingId(null); }}>
          <Plus size={18} />
          Nuevo recordatorio
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
