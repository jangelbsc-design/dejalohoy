import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertTriangle, Frown, X, ChevronLeft } from 'lucide-react';

export default function Guide() {
  const navigate = useNavigate();
  const resetProfile = useStore((state) => state.resetProfile);
  const [showAnxiety, setShowAnxiety] = useState(false);

  const handleCai = () => {
    const confirmed = window.confirm('¿Has fumado? Esto reiniciará todo tu progreso. ¿Estás seguro?');
    if (confirmed) {
      resetProfile();
    }
  };

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
    </div>
  );
}
