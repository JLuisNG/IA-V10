import React, { useEffect, useState, useRef } from 'react';

const PremiumEmailAnimation = ({ isOpen, status, message, email }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [particles, setParticles] = useState([]);
  const [showCompletionEffects, setShowCompletionEffects] = useState(false);
  const particleTimerRef = useRef(null);
  
  // Fases del proceso
  const phases = [
    { text: 'Inicializando conexión segura...', duration: 1200 },
    { text: 'Verificando dirección...', duration: 1000 },
    { text: 'Generando token único...', duration: 1400 },
    { text: 'Preparando datos de recuperación...', duration: 1200 },
    { text: 'Transmitiendo información...', duration: 1500 },
    { text: 'Finalizando proceso...', duration: 1000 }
  ];
  
  // Efecto para generar partículas de datos
  useEffect(() => {
    if (isOpen && status === 'loading' && phase >= 3) {
      // Crear partículas solo durante las últimas fases
      particleTimerRef.current = setInterval(() => {
        if (document.hidden) return; // No crear partículas si la pestaña no está visible
        
        // Generar entre 1-3 partículas nuevas
        const newParticles = Array(Math.floor(Math.random() * 3) + 1).fill().map(() => ({
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 3 + 2,
          color: getRandomColor(),
          opacity: Math.random() * 0.7 + 0.3
        }));
        
        // Actualizar partículas existentes (eliminar las que estén fuera de rango)
        setParticles(prev => [...prev.filter(p => p.y < 110), ...newParticles].slice(-40)); // Limitar a 40 partículas
      }, 200);
      
      return () => clearInterval(particleTimerRef.current);
    }
  }, [isOpen, status, phase]);
  
  // Efecto principal de animación
  useEffect(() => {
    let progressTimer;
    let phaseTimer;
    
    if (isOpen && status === 'loading') {
      // Resetear estados
      setProgress(0);
      setPhase(0);
      setParticles([]);
      setShowCompletionEffects(false);
      
      // Iniciar animación de progreso
      progressTimer = setInterval(() => {
        setProgress(prev => {
          // Avance dinámico según la fase
          const phaseProgress = phase / phases.length;
          const targetProgress = Math.min(phaseProgress * 100 + 15, 95);
          
          // Velocidad variable
          const increment = (phase < 3) 
            ? Math.random() * 2 + 0.5  // Más lento al inicio
            : Math.random() * 3 + 1;   // Más rápido al final
          
          const newProgress = Math.min(prev + increment, targetProgress);
          return newProgress;
        });
      }, 100);
      
      // Avanzar por fases
      const advancePhase = (currentPhase = 0) => {
        if (currentPhase < phases.length) {
          phaseTimer = setTimeout(() => {
            setPhase(currentPhase);
            advancePhase(currentPhase + 1);
          }, phases[currentPhase].duration);
        }
      };
      
      advancePhase();
    } else if (status === 'success') {
      setProgress(100);
      setPhase(phases.length - 1);
      setShowCompletionEffects(true);
      
      // Limpiar partículas después de completar
      setTimeout(() => {
        setParticles([]);
      }, 500);
    }
    
    return () => {
      clearInterval(progressTimer);
      clearTimeout(phaseTimer);
      if (particleTimerRef.current) {
        clearInterval(particleTimerRef.current);
      }
    };
  }, [isOpen, status, phases.length]);
  
  // Funciones de utilidad
  const getRandomColor = () => {
    const colors = ['#4285F4', '#00C2FF', '#34A853', '#FBBC05', '#EA4335', '#8E44AD', '#2E86C1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Renderizado condicional - no renderizar si no está abierto
  if (!isOpen) return null;
  
  // Determinar la clase CSS para el contenedor según el estado
  const containerClass = `premium-email-overlay ${status === 'success' ? 'success-mode' : ''}`;
  
  return (
    <div className={containerClass}>
      <div className="premium-email-modal">
        {/* Efectos de fondo */}
        <div className="background-effects">
          <div className="gradient-bg"></div>
          <div className="grid-lines"></div>
          {status === 'loading' && (
            <div className="data-particles">
              {particles.map(particle => (
                <div 
                  key={particle.id}
                  className="particle"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    opacity: particle.opacity,
                    transform: `translateY(${particle.speed}px)`,
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
        
        {/* Contenido principal */}
        <div className="content-container">
          {status === 'loading' ? (
            <>
              <div className="animation-container">
                <div className="server-container">
                  <div className="server-rack">
                    <div className="server-unit pulse"></div>
                    <div className="server-unit"></div>
                    <div className="server-unit pulse-delayed"></div>
                    <div className="server-light blink"></div>
                  </div>
                </div>
                
                <div className="connection-path">
                  <div className="data-stream">
                    <div className="data-packet" style={{ animationDelay: "0s" }}></div>
                    <div className="data-packet" style={{ animationDelay: "0.5s" }}></div>
                    <div className="data-packet" style={{ animationDelay: "1s" }}></div>
                    <div className="data-packet" style={{ animationDelay: "1.5s" }}></div>
                  </div>
                </div>
                
                <div className="device-container">
                  <div className="device-outline">
                    <div className="device-screen">
                      <div className="email-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="premium-title">Enviando Correo Seguro</h2>
              
              <div className="progress-display">
                <div className="progress-container">
                  <div className="progress-segments">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`segment ${progress >= (i+1)*10 ? 'active' : ''}`}
                        style={{ 
                          animationDelay: `${i * 0.05}s`,
                          backgroundColor: progress >= (i+1)*10 ? getSegmentColor(i) : undefined
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="progress-percentage">{Math.round(progress)}%</div>
                </div>
                
                <div className="phase-indicator">
                  <div className="phase-text">{phases[phase].text}</div>
                  <div className="activity-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
              
              <div className="email-details">
                <div className="email-header">
                  <div className="detail-line">
                    <span className="detail-label">Para:</span>
                    <span className="detail-value">{email}</span>
                  </div>
                  <div className="detail-line">
                    <span className="detail-label">Asunto:</span>
                    <span className="detail-value">Recuperación de Contraseña</span>
                  </div>
                  <div className="detail-line">
                    <span className="detail-label">Seguridad:</span>
                    <span className="detail-value">
                      <i className="fas fa-lock"></i> SSL/TLS Encrypted
                    </span>
                  </div>
                </div>
                <div className="status-codes">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="code-segment">
                      {generateStatusCode()}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="success-container">
              <div className="success-animation">
                <div className={`success-circle ${showCompletionEffects ? 'show' : ''}`}>
                  <i className="fas fa-check"></i>
                </div>
                <div className={`mail-delivered ${showCompletionEffects ? 'show' : ''}`}>
                  <i className="fas fa-envelope-open-text"></i>
                  <div className="notification-badge">1</div>
                </div>
              </div>
              
              <h2 className="premium-title success">¡Correo Enviado!</h2>
              
              <div className="success-message">
                {message || `Se ha enviado un enlace de recuperación a ${email}`}
              </div>
              
              <div className={`message-box ${showCompletionEffects ? 'show' : ''}`}>
                <div className="message-icon">
                  <i className="fas fa-info-circle"></i>
                </div>
                <div className="message-content">
                  <p>Verifique su bandeja de entrada y siga las instrucciones para recuperar su contraseña.</p>
                  <p>Si no encuentra el mensaje, revise su carpeta de spam o correo no deseado.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Funciones de utilidad
const getSegmentColor = (index) => {
  // Gradiente de azul a verde
  const colors = [
    '#00C2FF', '#00B4F0', '#00A6E0', 
    '#0098D1', '#008AC2', '#007CB3', 
    '#006EA3', '#006094', '#005285', 
    '#004475'
  ];
  return colors[index] || colors[0];
};

const generateStatusCode = () => {
  const prefixes = ['AUTH', 'SEC', 'SMTP', 'ENC'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const code = Math.floor(Math.random() * 900) + 100;
  return `${prefix}-${code}`;
};

export default PremiumEmailAnimation;