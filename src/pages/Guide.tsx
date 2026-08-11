import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertTriangle, Frown, X, ChevronLeft, MessageCircle, BookOpen } from 'lucide-react';

interface Technique {
  id: string;
  category: string;
  emoji: string;
  title: string;
  text: string;
  source: string;
}

const CATEGORIES = ['Todas', 'Ansiedad', 'Antojo', 'Estrés', 'Hábito', 'Motivación'] as const;

const TECHNIQUES: Technique[] = [
  // Ansiedad
  { id: '478', category: 'Ansiedad', emoji: '🌬️', title: 'Respiración 4-7-8', text: 'Inhalá por la nariz 4 segundos, retené 7 segundos y exhalá por la boca 8 segundos. Repetí 4 veces. Activa el sistema nervioso parasimpático y reduce la ansiedad al instante.', source: 'Mayo Clinic' },
  { id: '54321', category: 'Ansiedad', emoji: '🧠', title: 'Anclaje 5-4-3-2-1', text: 'Nombrá 5 cosas que ves, 4 que tocás, 3 que escuchás, 2 que olés y 1 que saboreás. Te ancla al presente y apaga la alarma mental.', source: 'Terapia Cognitivo-Conductual' },
  { id: 'relax', category: 'Ansiedad', emoji: '🫳', title: 'Relajación muscular progresiva', text: 'Tensá cada grupo muscular 5 segundos y soltá 10: manos, brazos, hombros, cara, abdomen, piernas. El cuerpo tenso no puede estar ansioso.', source: 'American Psychological Association' },
  { id: 'agua-fria', category: 'Ansiedad', emoji: '💧', title: 'Agua fría / reflejo de inmersión', text: 'Bebé un vaso de agua fría o lavate la cara. El choque térmico activa el reflejo de inmersión, baja el ritmo cardíaco y la ansiedad.', source: 'American Cancer Society' },
  { id: 'exhalacion', category: 'Ansiedad', emoji: '🌊', title: 'Exhalación larga 2:1', text: 'Inhalá por la nariz y exhalá el doble de tiempo (ej. 4 in, 8 out). La exhalación prolongada activa la calma y desactiva la respuesta de pánico.', source: 'Harvard Health' },
  // Antojo
  { id: '10min', category: 'Antojo', emoji: '⏳', title: 'Regla de los 10 minutos', text: 'El craving dura 15-20 minutos. Decí "voy a esperar 10 minutos" y hacé otra cosa. Cuando vuelvas, el impulso habrá bajado de intensidad.', source: 'Smokefree.gov (NCI)' },
  { id: 'contexto', category: 'Antojo', emoji: '🚶', title: 'Cambiá de contexto', text: 'Levantate del lugar, salí a la calle o cambiá de habitación. Romper el contexto (café + pausa) rompe la asociación automática.', source: 'NHS' },
  { id: 'manos', category: 'Antojo', emoji: '🤲', title: 'Manos ocupadas', text: 'Apretá una pelota antiestrés, armá algo, jugá al Tetris o escribí. Las manos ocupadas dejan de buscar el cigarro.', source: 'CDC' },
  { id: 'chicle', category: 'Antojo', emoji: '🍬', title: 'Chicle o caramelo sin azúcar', text: 'La necesidad de llevar algo a la boca se satisface con chicle, caramelo sin azúcar o un mondadientes. Sin nicotina y sin culpa.', source: 'Smokefree.gov' },
  { id: 'visualiza', category: 'Antojo', emoji: '🛡️', title: 'Visualizá el cigarro como enemigo', text: 'Imaginá el cigarro como una trampa, no como un premio. Cada antojo vencido es una victoria: estás desprogramando años de hábito.', source: 'Terapia de aversión' },
  // Estrés
  { id: 'camina5', category: 'Estrés', emoji: '🏃', title: 'Caminata de 5 minutos', text: 'Caminá rápido, subí escaleras o hacé saltos. El ejercicio libera endorfinas, los analgésicos naturales que reducen el deseo de fumar.', source: 'Cleveland Clinic' },
  { id: 'escribe', category: 'Estrés', emoji: '✍️', title: 'Escribí el problema', text: 'Anotalo en el Diario antes de que el impulso suba. Escribir organiza la mente y saca la tensión del cuerpo. El cigarro no resuelve nada; escribirlo sí.', source: 'American Journal of Health' },
  { id: 'diafragma', category: 'Estrés', emoji: '🎈', title: 'Respiración diafragmática', text: 'Poné una mano en el abdomen: al inhalar, el vientre se infla como globo; al exhalar, se desinfla. 10 respiraciones lentas relajan todo el sistema.', source: 'Mayo Clinic' },
  { id: 'estiros', category: 'Estrés', emoji: '🙆', title: 'Estiramientos de cuello y hombros', text: 'La tensión se guarda en hombros y cuello. Rotá los hombros, incliná la cabeza a cada lado 10 segundos. El cuerpo suelto, mente suelta.', source: 'Cleveland Clinic' },
  // Hábito
  { id: 'dientes', category: 'Hábito', emoji: '🪥', title: 'Cepillate los dientes', text: 'Cepillarse los dientes cambia el sabor de la boca y corta el ritual del cigarro, especialmente después de comer o con el café.', source: 'NHS' },
  { id: 'otra-mano', category: 'Hábito', emoji: '☕', title: 'Cambiá de mano el café', text: 'Tomá el café con la otra mano o en otro lugar. El contexto nuevo rompe la asociación automática café + cigarro.', source: 'Smokefree.gov' },
  { id: 'ducha', category: 'Hábito', emoji: '🚿', title: 'Ducha o cambio de ambiente', text: 'Una ducha rápida o cambiarte de ropa resetea el estado de ánimo y corta el circuito del hábito en los momentos de rutina.', source: 'Terapia conductual' },
  { id: 'evita', category: 'Hábito', emoji: '🚫', title: 'Evitá los desencadenantes', text: 'Si el café o el alcohol te disparan el antojo, evitálos esta semana. Cambiar la rutina unos días debilita la cadena del hábito.', source: 'American Cancer Society' },
  // Motivación
  { id: 'porque', category: 'Motivación', emoji: '💗', title: 'Leé tu porqué', text: 'Abrí "No lo hagas" y releé tu motivo: tu familia, tu salud, tus sueños. Tus razones siguen siendo más fuertes que un antojo de 3 minutos.', source: 'Déjalo Hoy' },
  { id: 'logros', category: 'Motivación', emoji: '🏅', title: 'Revisá tus logros y medallas', text: 'Mirá cuántas estrellas, soles y medallas ganaste. Ese progreso es real y tuyo. No lo reinicies por un momento de debilidad.', source: 'Déjalo Hoy' },
  { id: 'apoyo', category: 'Motivación', emoji: '📣', title: 'Mensaje a alguien de confianza', text: 'Escribí a un amigo o familiar: "Estoy con antojo y lo estoy venciendo". Compartir la lucha reduce su intensidad y te fortalece.', source: 'WHO' },
  { id: 'ahorro', category: 'Motivación', emoji: '💰', title: 'Recordá tu dinero ahorrado', text: 'Mirá cuánto ahorraste y qué meta de tus "Mis Metas" se acerca. Ese cigarro cuesta más que su precio: cuesta tu objetivo.', source: 'Déjalo Hoy' },
];

export default function Guide() {
  const navigate = useNavigate();
  const resetProfile = useStore((state) => state.resetProfile);
  const [showAnxiety, setShowAnxiety] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Todas');

  const handleCai = () => {
    const confirmed = window.confirm('¿Has fumado? Esto reiniciará todo tu progreso. ¿Estás seguro?');
    if (confirmed) {
      resetProfile();
    }
  };

  const visible = TECHNIQUES.filter((t) => category === 'Todas' || t.category === category);

  return (
    <div className="guide-page">
      <div className="guide-header">
        <button className="guide-back" onClick={() => navigate('/')} aria-label="Volver">
          <ChevronLeft size={24} />
        </button>
        <h1 className="guide-title">Guía Asistida</h1>
      </div>

      <p className="guide-subtitle">
        Herramientas de apoyo para los momentos difíciles. Elegí lo que necesitás ahora mismo.
      </p>

      <div className="guide-actions">
        <button className="btn-cai" onClick={handleCai}>
          <AlertTriangle size={24} />
          ¡Caí!
        </button>

        <button className="btn-anxiety" onClick={() => setShowAnxiety(true)}>
          <Frown size={24} />
          ¡Tengo ansiedad!
        </button>

        <button className="btn-cai" onClick={() => setShowAssistant(true)} style={{ background: 'rgba(255,255,255,0.15)' }}>
          <MessageCircle size={24} />
          Asistente de Caída
        </button>
      </div>

      <div className="guide-library">
        <div className="guide-library-head">
          <BookOpen size={20} />
          <span>Biblioteca de técnicas</span>
        </div>
        <p className="guide-library-sub">
          {TECHNIQUES.length} técnicas probadas científicamente, organizadas por situación.
        </p>

        <div className="guide-chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`guide-chip${category === c ? ' guide-chip-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="guide-techniques">
          {visible.map((t) => (
            <div key={t.id} className="guide-technique">
              <span className="guide-technique-emoji">{t.emoji}</span>
              <div className="guide-technique-body">
                <span className="guide-technique-title">{t.title}</span>
                <p className="guide-technique-text">{t.text}</p>
                <span className="guide-technique-source">Fuente: {t.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAnxiety && (
        <div className="modal-overlay" onClick={() => setShowAnxiety(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAnxiety(false)}>
              <X size={20} />
            </button>
            <h2 className="modal-title">¡Tranquilo! Aquí tienes 6 consejos</h2>
            <p className="modal-body">La ansiedad al dejar de fumar es normal y pasajera. Prueba estas técnicas avaladas por organizaciones de salud:</p>
            <ul className="modal-list">
              <li><strong>Respiración 4-7-8 (Mayo Clinic):</strong> Inhala por la nariz 4 segundos, retén 7 segundos, exhala por la boca 8 segundos. Repite 4 veces. Activa el sistema nervioso parasimpático y reduce la ansiedad al instante.</li>
              <li><strong>Distráete 10 minutos (CDC - Smokefree.gov):</strong> El craving dura solo 15-20 minutos. Mantén tus manos ocupadas: aprieta una pelota antiestrés, escribe, o arma algo. La urgencia pasará.</li>
              <li><strong>Agua fría (American Cancer Society):</strong> Bebe un vaso de agua fría o lávate la cara. El choque térmico activa el reflejo de inmersión, disminuyendo el ritmo cardíaco y la ansiedad.</li>
              <li><strong>5 minutos de movimiento (Cleveland Clinic):</strong> Camina rápido, sube escaleras o haz saltos. El ejercicio libera endorfinas (analgésicos naturales) y reduce el deseo de fumar.</li>
              <li><strong>Identifica tu disparador (NHS):</strong> ¿Café? ¿Estrés? ¿Después de comer? Identificar qué activó el craving te permite anticiparte y romper el ciclo.</li>
              <li><strong>Apoyo social inmediato (WHO):</strong> Llama a un amigo, manda un mensaje o repite en voz alta: "Esto es pasajero, yo puedo con esto". Compartir reduce la intensidad del craving.</li>
            </ul>
            <p className="modal-quote">"La ansiedad es una señal de que estás creciendo, no de que estás fracasando."</p>
          </div>
        </div>
      )}

      {showAssistant && (
        <div className="modal-overlay" onClick={() => setShowAssistant(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAssistant(false)}>
              <X size={20} />
            </button>
            <h2 className="modal-title">Asistente de Caída</h2>
            <p className="modal-body">Si has fumado, no te preocupes. Un tropiezo no es el fin de tu camino. Esto es lo que puedes hacer ahora:</p>
            <ul className="modal-list">
              <li><strong>Reconócelo como un tropiezo, no una derrota.</strong> No dejes que un cigarro arruine todo tu progreso. Lo importante es seguir adelante.</li>
              <li><strong>Identifica el desencadenante.</strong> ¿Estrés? ¿Alcohol? ¿Ansiedad? Saber qué lo causó te ayudará a prepararte para la próxima vez.</li>
              <li><strong>Reinicia ahora mismo.</strong> Presiona "¡Caí!" para reiniciar el contador y vuelve a empezar. Cada minuto sin fumar cuenta.</li>
              <li><strong>Bebe agua y respira profundo.</strong> Toma un vaso de agua y haz 10 respiraciones lentas para calmar la ansiedad.</li>
              <li><strong>Busca apoyo.</strong> Habla con alguien de confianza. Compartir lo que sientes reduce la carga y te fortalece.</li>
              <li><strong>Retoma tu plan.</strong> Revisa por qué decidiste dejar de fumar. Tus razones siguen siendo válidas.</li>
            </ul>
            <p className="modal-quote">"El éxito no es no caer nunca, sino levantarse cada vez que caes." — Confucio</p>
          </div>
        </div>
      )}
    </div>
  );
}
