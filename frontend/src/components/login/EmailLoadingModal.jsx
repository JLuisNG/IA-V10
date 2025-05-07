import React, { useEffect, useState } from 'react';

const EmailLoadingModal = ({ isOpen, status, message, email }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [flyAnimation, setFlyAnimation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Fases del envío de correo
  const phases = [
    'Preparando solicitud...',
    'Verificando dirección de correo...',
    'Generando enlace seguro...',
    'Enviando correo...',
    '¡Correo enviado!'
  ];
  
  // Efecto para manejar la animación de progreso
  useEffect(() => {
    let progressInterval;
    let phaseInterval;
    
    if (isOpen && status === 'loading') {
      // Resetear estados
      setProgress(0);
      setCurrentPhase(0);
      setFlyAnimation(false);
      setShowSuccess(false);
      
      // Animar el progreso
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 6 + (prev < 40 ? 6 : prev < 65 ? 4 : prev < 85 ? 2 : 1);
          const newProgress = prev + increment;
          
          // Cuando llega a 75%, activar la animación de vuelo
          if (prev < 75 && newProgress >= 75) {
            setFlyAnimation(true);
          }
          
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 250);
      
      // Cambiar la fase periódicamente
      phaseInterval = setInterval(() => {
        setCurrentPhase(prev => {
          // Si estamos en la fase 3 (Enviando correo), mantener por más tiempo
          if (prev === 3) {
            setTimeout(() => {
              setFlyAnimation(true); // Asegura que la animación de vuelo se active
              setCurrentPhase(4);    // Avanzar a la última fase después de un tiempo
            }, 2000);
            return prev;
          }
          return prev < phases.length - 1 ? prev + 1 : prev;
        });
      }, 1800);
      
    } else if (status === 'success') {
      // Completar progreso
      setProgress(100);
      setCurrentPhase(4);
      
      // Mostrar animación de éxito
      setTimeout(() => {
        setShowSuccess(true);
      }, 300);
    }
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [isOpen, status, phases.length]);
  
  // Si no está abierto, no renderizar
  if (!isOpen) return null;
  
  return (
    <div className={`email-loading-overlay ${isOpen ? 'show' : ''} ${status === 'success' ? 'success-bg' : ''}`}>
      <div className="email-loading-content">
        {/* Efecto de brillo */}
        <div className="glow-effect"></div>
        
        {status === 'loading' ? (
          <>
            <div className="email-animation-container">
              <div className="email-scene">
                {/* Computadora/Dispositivo origen */}
                <div className="device sender">
                  <div className="device-screen"></div>
                  <div className="device-base"></div>
                </div>
                
                {/* Animación de correo volando */}
                <div className={`flying-email ${flyAnimation ? 'animate' : ''}`}>
                  <div className="email-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  
                  {/* Estela del correo */}
                  <div className="email-trail"></div>
                </div>
                
                {/* Servidor/Nube de recepción */}
                <div className="server-cloud">
                  <i className="fas fa-cloud"></i>
                </div>
              </div>
            </div>
            
            <h3>Enviando Correo de Recuperación</h3>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-bar-inner" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="progress-percentage">
                {Math.round(progress)}%
              </div>
            </div>
            
            <div className="status-message">
              {phases[currentPhase]}
            </div>
            
            <div className="email-details">
              <div className="email-to">
                <span>Para:</span> {email || 'usuario@ejemplo.com'}
              </div>
              <div className="email-subject">
                <span>Asunto:</span> Recuperación de contraseña
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="email-success-animation">
              <div className={`success-icon ${showSuccess ? 'show' : ''}`}>
                <i className="fas fa-check-circle"></i>
              </div>
              
              <div className={`mail-sent-icon ${showSuccess ? 'show' : ''}`}>
                <i className="fas fa-envelope-open-text"></i>
                <div className="notification-badge">1</div>
              </div>
            </div>
            
            <h3 className="success">¡Correo Enviado!</h3>
            
            <div className="status-message success">
              {message || 'Se ha enviado un correo con instrucciones para recuperar su contraseña.'}
            </div>
            
            <div className={`email-info-box ${showSuccess ? 'show' : ''}`}>
              <p>
                <i className="fas fa-info-circle"></i> 
                Revise su bandeja de entrada y siga las instrucciones del correo.
              </p>
              <p>
                <i className="fas fa-exclamation-circle"></i> 
                Si no encuentra el correo, revise su carpeta de spam.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailLoadingModal;