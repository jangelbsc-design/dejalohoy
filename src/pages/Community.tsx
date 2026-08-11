import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, RefreshCw, Send, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useCommunityStore, COMMUNITY_QUOTES } from '../store/communityStore';
import { calculateFreeTimeInDays, calculateMoneySaved, calculateCigsAvoided } from '../core/utils/calculations';

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export default function Community() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);
  const myQuotes = useCommunityStore((state) => state.myQuotes);
  const addQuote = useCommunityStore((state) => state.addQuote);
  const removeQuote = useCommunityStore((state) => state.removeQuote);

  const [featuredIndex, setFeaturedIndex] = useState(() => dayOfYear() % COMMUNITY_QUOTES.length);
  const [copied, setCopied] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [published, setPublished] = useState(false);

  const stats = useMemo(() => {
    if (!profile?.startDate) return null;
    const freeDays = calculateFreeTimeInDays(new Date(profile.startDate));
    const money = calculateMoneySaved(freeDays, profile.cigsPerDay, profile.cigsPerPack, profile.pricePerPack);
    const cigs = Math.floor(calculateCigsAvoided(freeDays, profile.cigsPerDay));
    const days = Math.floor(freeDays);
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const title =
      years >= 1
        ? `${years} ${years === 1 ? 'año' : 'años'}${months > 0 ? ` ${months} ${months === 1 ? 'mes' : 'meses'}` : ''}`
        : months >= 1
          ? `${months} ${months === 1 ? 'mes' : 'meses'}`
          : days >= 1
            ? `${days} ${days === 1 ? 'día' : 'días'}`
            : `${Math.floor(freeDays * 24)} ${Math.floor(freeDays * 24) === 1 ? 'hora' : 'horas'}`;
    return { title, money, cigs };
  }, [profile]);

  const shareText = stats
    ? `🚭 ¡Llevo ${stats.title} sin fumar! No fumé ${stats.cigs} cigarrillos, ahorré Bs ${stats.money.toFixed(2)} y estoy recuperando mi vida, un día a la vez. #DejaloHoy`
    : '🚭 Empecé mi camino para dejar de fumar con #DejaloHoy. Cada día cuenta.';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mi progreso sin fumar', text: shareText });
        return;
      } catch {
        // el usuario canceló; no hacemos nada
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleShuffle = () => {
    setFeaturedIndex((i) => (i + 1 + Math.floor(Math.random() * (COMMUNITY_QUOTES.length - 1))) % COMMUNITY_QUOTES.length);
  };

  const handlePublish = () => {
    const text = quoteText.trim();
    if (text.length < 5) return;
    addQuote(text);
    setQuoteText('');
    setPublished(true);
    window.setTimeout(() => setPublished(false), 3000);
  };

  const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

  return (
    <div className="miss-page community-page">
      <div className="miss-header">
        <button className="miss-back" onClick={() => navigate('/')} aria-label="Volver">
          <ArrowLeft size={24} />
        </button>
        <h1 className="miss-title">Comunidad</h1>
        <span className="community-header-badge">🤝</span>
      </div>
      <p className="miss-subtitle">Tu progreso inspira a otros. Compartí tu logro y recibí apoyo.</p>

      <div className="community-share-card">
        <div className="community-share-title">🚀 Compartí tu logro</div>
        <p className="community-share-sub">Enviá tu avance por WhatsApp, redes o donde quieras.</p>

        <div className="community-share-preview">
          <span className="community-share-preview-mark">“</span>
          {shareText}
        </div>

        <div className="community-share-actions">
          <button className="btn-assistant community-share-btn" onClick={handleShare}>
            <Share2 size={18} />
            Compartir
          </button>
          {copied && <span className="community-share-copied">¡Copiado! Pegálo donde quieras. 📋</span>}
        </div>
      </div>

      <div className="community-quotes">
        <div className="community-quotes-head">
          <h2>Frases de la comunidad</h2>
          <button className="community-shuffle" onClick={handleShuffle}>
            <RefreshCw size={14} />
            Otra
          </button>
        </div>

        <div className="community-quote-featured">
          <span className="community-quote-mark">“</span>
          <p>{COMMUNITY_QUOTES[featuredIndex]}</p>
          <span className="community-quote-author">Anónimo</span>
        </div>

        {myQuotes.length > 0 && (
          <div className="community-my-quotes">
            <h3>Tus mensajes</h3>
            {myQuotes.map((q) => (
              <div key={q.id} className="community-quote-item">
                <span className="community-quote-item-badge">Tú</span>
                <p>{q.text}</p>
                <span className="community-quote-date">{formatDate(q.createdAt)}</span>
                <button
                  className="community-quote-delete"
                  onClick={() => removeQuote(q.id)}
                  aria-label="Eliminar mensaje"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="community-quote-form">
          <label>Dejá una frase anónima que ayude a alguien</label>
          <textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            placeholder="Ej: Dejar de fumar me devolvió el aire, el dinero y la calma. Se puede."
            rows={3}
            maxLength={280}
          />
          <div className="community-quote-form-footer">
            <span className="community-quote-count">{quoteText.length}/280</span>
            <button className="btn-assistant" onClick={handlePublish} disabled={quoteText.trim().length < 5}>
              <Send size={16} />
              Publicar mi frase
            </button>
          </div>
          {published && <p className="community-published">¡Gracias por sumarte! Tu frase ya está publicada. 💚</p>}
        </div>
      </div>
    </div>
  );
}
