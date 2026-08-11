import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useRemindersStore } from '../store/remindersStore';

let permissionAsked = false;

export async function requestNotificationPermission(): Promise<string> {
  if (!('Notification' in window)) return 'unsupported';
  if (permissionAsked) return Notification.permission;
  permissionAsked = true;
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

interface ToastState {
  id: string;
  emoji: string;
  label: string;
  body: string;
}

export function ReminderScheduler() {
  const reminders = useRemindersStore((s) => s.reminders);
  const [toast, setToast] = useState<ToastState | null>(null);
  const lastFired = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      for (const key of Object.keys(lastFired.current)) {
        if (!key.endsWith(`:${todayKey}`)) delete lastFired.current[key];
      }

      for (const r of reminders) {
        if (!r.enabled) continue;
        if (!r.days.includes(now.getDay())) continue;
        if (r.time !== hm) continue;
        const fireKey = `${r.id}:${todayKey}`;
        if (lastFired.current[fireKey]) continue;
        lastFired.current[fireKey] = true;

        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(r.label, { body: r.body, icon: 'icon.png', badge: 'icon.png' });
          } catch {
            // algunos navegadores fallan al construir la notificación; se ignora
          }
        }
        setToast({ id: r.id, emoji: r.emoji, label: r.label, body: r.body });
      }
    };

    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [reminders]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 9000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="reminder-toast" role="alert">
      <span className="reminder-toast-emoji">{toast.emoji}</span>
      <div className="reminder-toast-info">
        <strong>{toast.label}</strong>
        <p>{toast.body}</p>
      </div>
      <button className="reminder-toast-close" onClick={() => setToast(null)} aria-label="Cerrar recordatorio">
        <X size={18} />
      </button>
    </div>
  );
}
