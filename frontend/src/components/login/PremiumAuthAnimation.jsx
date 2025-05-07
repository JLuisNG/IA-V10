import React, { useEffect, useState, useRef } from 'react';

const PremiumAuthAnimation = ({ isOpen, status, message, onClose, username }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [securityScan, setSecurityScan] = useState(false);
  const [dataMatrixEffect, setDataMatrixEffect] = useState(false);
  const [showCompletionEffects, setShowCompletionEffects] = useState(false);
  const matrixRef = useRef(null);
  const containerRef = useRef(null);
  
  // Fases del proceso de autenticación
  const phases = [
    { text: 'Verificando credenciales...', duration: 1000 },
    { text: 'Autenticando sesión...', duration: 1200 },
    { text: 'Validando permisos...', duration: 1100 },
    { text: 'Obteniendo perfil de usuario...', duration: 1300 },
    { text: 'Configurando acceso...', duration: 900 }
  ];
  
  // Efecto para la matriz de datos (efecto "Matrix")
  useEffect(() => {
    if (isOpen && status === 'loading' && phase >= 1 && dataMatrixEffect && matrixRef.current) {
      const ctx = matrixRef.current.getContext('2d');
      if (!ctx) return;
      
      // Configurar canvas
      const width = matrixRef.current.width = matrixRef.current.offsetWidth;
      const height = matrixRef.current.height = matrixRef.current.offsetHeight;
      
      // Caracteres para la lluvia de datos
      const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
      const fontSize = 14;
      const columns = Math.floor(width / fontSize);
      const drops = Array(columns).fill(1);
      
      // Color de fondo
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      
      const matrixRain = () => {
        // Crear efecto de transparencia
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, width, height);
        
        // Caracteres verdes
        ctx.fillStyle = "#0f0";
        ctx.font = `${fontSize}px monospace`;
        
        // Ciclo por cada columna
        for (let i = 0; i < drops.length; i++) {
          // Carácter aleatorio
          const text = characters[Math.floor(Math.random() * characters.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          // Reiniciar o mover hacia abajo
          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };
      
      // Animar
      const matrixInterval = setInterval(matrixRain, 80);
      return () => clearInterval(matrixInterval);
    }
  }, [isOpen, status, phase, dataMatrixEffect]);
  
  // Efecto principal de animación
  useEffect(() => {
    let progressTimer;
    let phaseTimer;
    
    if (isOpen && status === 'loading') {
      // Resetear estados
      setProgress(0);
      setPhase(0);
      setSecurityScan(false);
      setDataMatrixEffect(false);
      setShowCompletionEffects(false);
      
      // Activar efecto de matriz de datos después de un momento
      setTimeout(() => {
        setDataMatrixEffect(true);
      }, 1000);
      
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
          
          // Activar escaneo de seguridad cerca del 50%
          if (prev < 45 && prev + increment >= 45) {
            setSecurityScan(true);
            setTimeout(() => {
              setSecurityScan(false);
            }, 1500);
          }
          
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
      // Completar progreso
      setProgress(100);
      setPhase(phases.length - 1);
      
      // Mostrar efectos de éxito
      setTimeout(() => {
        setShowCompletionEffects(true);
      }, 300);
    }
    
    return () => {
      clearInterval(progressTimer);
      clearTimeout(phaseTimer);
    };
  }, [isOpen, status, phases.length]);
  
  // Función para generar ID de sesión
  const generateSessionId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Función para generar visualización de encriptación
  const generateEncryptionVisual = (progress) => {
    // Generar código que cambia con el progreso
    const length = Math.floor((progress / 100) * 24) + 8;
    const chars = '0123456789ABCDEFabcdef*#@!+';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // No renderizar si no está abierto
  if (!isOpen) return null;
  
  return (
    <div className={`premium-auth-overlay ${status === 'success' ? 'success-mode' : ''}`} ref={containerRef}>
      <div className="premium-auth-modal">
        {/* Efectos de fondo */}
        <div className="background-effects">
          <div className="gradient-bg"></div>
          <div className="grid-lines"></div>
          <canvas ref={matrixRef} className="matrix-rain"></canvas>
        </div>
        
        {/* Contenido principal */}
        <div className="content-container">
          {status === 'loading' ? (
            <>
              <div className="auth-header">
                <div className="security-shield">
                  <i className="fas fa-shield-alt"></i>
                  <div className="scanning-line" style={{ opacity: securityScan ? 1 : 0 }}></div>
                </div>
                <h2 className="auth-title">
                  Autenticación Segura
                  <div className="title-underline"></div>
                </h2>
              </div>
              
              <div className="biometric-simulation">
                <div className="fingerprint-container">
                  <div className="fingerprint-scanner">
                    <div className="scan-line" style={{ opacity: phase >= 1 ? 1 : 0 }}></div>
                    <div className="fingerprint-icon">
                      <i className="fas fa-fingerprint"></i>
                    </div>
                  </div>
                </div>
                
                <div className="user-verification">
                  <div className="avatar-container">
                    <div className="avatar-circle">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="verification-check" style={{ opacity: phase >= 2 ? 1 : 0 }}>
                      <i className="fas fa-check"></i>
                    </div>
                  </div>
                  <div className="user-info">
                    <div className="username">{username || 'Usuario'}</div>
                    <div className="status">
                      {phase < 2 ? 'Verificando...' : 'Verificado'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="auth-progress-display">
                <div className="auth-progress-container">
                  <div className="auth-progress-segments">
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
                  <div className="auth-progress-bar">
                    <div className="auth-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="auth-progress-percentage">{Math.round(progress)}%</div>
                </div>
                
                <div className="auth-phase-indicator">
                  <div className="auth-phase-text">{phases[phase].text}</div>
                  <div className="auth-activity-indicator">
                    <div className="auth-dot"></div>
                    <div className="auth-dot"></div>
                    <div className="auth-dot"></div>
                  </div>
                </div>
              </div>
              
              <div className="security-details">
                <div className="security-header">
                  <i className="fas fa-lock"></i>
                  <span>Detalles de seguridad</span>
                </div>
                <div className="security-info">
                  <div className="security-item">
                    <span className="security-label">Protocolo:</span>
                    <span className="security-value">SSL/TLS 1.3</span>
                  </div>
                  <div className="security-item">
                    <span className="security-label">Método:</span>
                    <span className="security-value">JWT + 2FA</span>
                  </div>
                  <div className="security-item">
                    <span className="security-label">Sesión:</span>
                    <span className="security-value">{generateSessionId()}</span>
                  </div>
                </div>
                <div className="encryption-indicator">
                  <div className="encryption-code">
                    {generateEncryptionVisual(progress)}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-success-container">
              <div className="auth-success-animation">
                <div className={`auth-concentric-circles ${showCompletionEffects ? 'show' : ''}`}>
                  <div className="circle circle1"></div>
                  <div className="circle circle2"></div>
                  <div className="circle circle3"></div>
                </div>
                <div className={`auth-success-checkmark ${showCompletionEffects ? 'show' : ''}`}>
                  <i className="fas fa-check"></i>
                </div>
                <div className={`auth-user-badge ${showCompletionEffects ? 'show' : ''}`}>
                  <div className="badge-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="badge-pulse"></div>
                </div>
              </div>
              
              <h2 className="auth-success-title">¡Autenticación Exitosa!</h2>
              
              <div className="auth-success-message">
                {message || `Bienvenido ${username || 'Usuario'}. Acceso autorizado al sistema.`}
              </div>
              
              <div className={`auth-info-box ${showCompletionEffects ? 'show' : ''}`}>
                <div className="auth-info-header">
                  <i className="fas fa-info-circle"></i>
                  <span>Información de sesión</span>
                </div>
                <div className="auth-info-content">
                  <div className="auth-info-item">
                    <i className="fas fa-clock"></i>
                    <span>Sesión iniciada: {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="auth-info-item">
                    <i className="fas fa-shield-alt"></i>
                    <span>Nivel de seguridad: Alto</span>
                  </div>
                </div>
              </div>
              
              <div className={`auth-redirect-message ${showCompletionEffects ? 'show' : ''}`}>
                <div className="redirect-spinner"></div>
                <span>Redirigiendo al panel principal...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Funciones auxiliares
const getSegmentColor = (index) => {
  // Gradiente de azul a violeta
  const colors = [
    '#1890ff', '#2b85ec', '#3e7ad9', 
    '#506ec6', '#6263b3', '#7557a0', 
    '#874c8d', '#9a407a', '#ad3567', 
    '#c02954'
  ];
  return colors[index] || colors[0];
};

export default PremiumAuthAnimation;