// Modificaciones a AuthLoadingModal.jsx para hacerlo más responsive

import React, { useEffect, useState, useCallback } from 'react';

const AuthLoadingModal = ({ isOpen, status, message, onClose, modalType = 'auth', userData = null }) => {
  const [progress, setProgress] = useState(0);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showStatusIcon, setShowStatusIcon] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animateBg, setAnimateBg] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar dispositivo móvil para ajustar contenido
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Pasos del proceso según el tipo de modal y dispositivo
  const getSteps = useCallback(() => {
    if (modalType === 'auth') {
      return isMobile 
        ? [
          'Verifying credentials...',
          'Authenticating...',
          'Validating permissions...',
          'Loading profile...'
        ]
        : [
          'Establishing secure connection...',
          'Verifying credentials...',
          'Generating session token...',
          'Validating permissions...',
          'Preparing workspace environment...'
        ];
    } else {
      return isMobile
        ? [
          'Validating email...',
          'Creating token...',
          'Finalizing recovery...'
        ]
        : [
          'Validating email address...',
          'Creating secure token...',
          'Preparing recovery link...',
          'Configuring email delivery...',
          'Finalizing secure recovery...'
        ];
    }
  }, [modalType, isMobile]);
  
  // Efecto para animar el fondo
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setAnimateBg(true);
      }, 100);
    } else {
      setAnimateBg(false);
    }
  }, [isOpen]);
  
  // Efecto para manejar la animación de progreso
  useEffect(() => {
    let interval;
    
    if (isOpen && status === 'loading') {
      // Resetear estados al abrirse
      setProgress(0);
      setShowSpinner(true);
      setShowStatusIcon(false);
      setCurrentStep(0);
      
      // Animar el progreso - más realista con variaciones de velocidad
      interval = setInterval(() => {
        setProgress(prev => {
          // Algoritmo mejorado para progreso más natural
          const remainingProgress = 95 - prev;
          // Velocidad variable basada en el progreso actual
          const baseIncrement = prev < 30 ? 7 : prev < 60 ? 5 : prev < 80 ? 3 : 1.5;
          // Añadir variación aleatoria para que se vea orgánico
          const variableComponent = Math.random() * 2 - 1;
          // Ralentización cuando se acerca al final
          const slowdownFactor = Math.max(0.3, (95 - prev) / 95);
          
          const increment = (baseIncrement + variableComponent) * slowdownFactor;
          const newProgress = prev + increment;
          
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);
      
      // Cambiar el paso actual de forma más orgánica
      const steps = getSteps();
      let stepTimes = Array(steps.length).fill(0).map(() => 
        Math.floor(Math.random() * 800 + 1600)
      ); // Tiempos variados para cada paso
      
      const scheduleNextStep = (currentStepIndex) => {
        if (currentStepIndex < steps.length - 1) {
          setTimeout(() => {
            setCurrentStep(currentStepIndex + 1);
            scheduleNextStep(currentStepIndex + 1);
          }, stepTimes[currentStepIndex]);
        }
      };
      
      scheduleNextStep(0);
      
    } else if (status === 'success' || status === 'error') {
      // Completar el progreso
      setProgress(100);
      
      // Mostrar el ícono correspondiente después de completar la animación
      const timeout = setTimeout(() => {
        setShowSpinner(false);
        setShowStatusIcon(true);
        
        // Si es error, cerrar automáticamente después de un tiempo
        if (status === 'error') {
          setTimeout(() => {
            if (onClose) onClose();
          }, 2500);
        }
      }, 500);
      
      return () => clearTimeout(timeout);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [isOpen, status, getSteps, onClose]);
  
  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;
  
  const steps = getSteps();
  
  // Determinar el mensaje a mostrar con formato condicional
  const displayMessage = status === 'loading' 
    ? (message || steps[currentStep])
    : message;
  
  // Obtener el nombre del usuario si está disponible
  const getUserName = () => {
    if (!userData) return 'User';
    
    // Primero intenta usar fullname si está disponible
    if (userData.fullname) return userData.fullname;
    
    // Si no, usa el username o email
    return userData.username || userData.email || 'User';
  };
  
  // Generar ID único para el servidor (simulación)
  const generateServerId = () => {
    return `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };
  
  // Calcular el tiempo restante estimado (simulación)
  const getEstimatedTime = () => {
    const remainingProgress = 100 - progress;
    if (remainingProgress < 5) return "Almost done...";
    if (remainingProgress < 20) return "Less than 5 sec";
    if (remainingProgress < 50) return "About 10 sec";
    return "Less than 15 sec";
  };
  
  return (
    <div className={`auth-loading-overlay ${isOpen ? 'show' : ''} ${animateBg ? 'animate-bg' : ''} ${status === 'error' ? 'error-bg' : status === 'success' ? 'success-bg' : ''}`}>
      {/* Elementos decorativos */}
      <div className="auth-decoration deco-1"></div>
      <div className="auth-decoration deco-2"></div>
      <div className="auth-decoration deco-3"></div>
      
      <div className="auth-loading-content">
        <div className="glow-effect"></div>
        
        <div className="auth-loading-spinner">
          {showSpinner && (
            <>
              {/* Spinner SVG mejorado con degradado */}
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0062ff" />
                    <stop offset="100%" stopColor="#00c2ff" />
                  </linearGradient>
                </defs>
                <circle className="circle-bg" cx="50" cy="50" r="45" />
                <circle className="circle-progress" cx="50" cy="50" r="45" />
              </svg>
              
              {/* Anillos de pulso */}
              <div className="pulse-rings">
                <div className="pulse-ring ring1"></div>
                <div className="pulse-ring ring2"></div>
                <div className="pulse-ring ring3"></div>
              </div>
            </>
          )}
          
          {showStatusIcon && status === 'success' && (
            <div className="check-icon show">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="icon-fill" cx="12" cy="12" r="10" />
                <path className="icon-path" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {showStatusIcon && status === 'error' && (
            <div className="error-icon show">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="icon-fill" cx="12" cy="12" r="10" />
                <path className="icon-path" d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <h3 className={status !== 'loading' ? status : ''}>
          {status === 'loading' ? (
            modalType === 'auth' ? 
              (isMobile ? 'Authentication' : 'Authentication in Progress') : 
              (isMobile ? 'Recovery' : 'Recovery in Progress')
          ) : status === 'success' ? 
            'Authentication Successful' : 
            'Authentication Failed'}
        </h3>
        
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
        
        <div className={`status-message ${status !== 'loading' ? status : ''}`}>
          {displayMessage}
        </div>
        
        {status === 'loading' && modalType === 'auth' && (
          <>
            <div className="auth-loading-steps">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`step-indicator ${index === currentStep ? 'current' : index < currentStep ? 'completed' : ''}`}
                >
                  <div className="step-dot">
                    {index < currentStep && <i className="fas fa-check"></i>}
                  </div>
                  <div className="step-name">{step}</div>
                </div>
              ))}
            </div>
            
            <div className="security-panel">
              <div className="security-panel-title">
                <i className="fas fa-shield-alt"></i>
                <span>Security Information</span>
              </div>
              <div className="security-item">
                <i className="fas fa-lock"></i>
                <span>Protocol: <span className="security-code">TLS 1.3</span></span>
              </div>
              <div className="security-item">
                <i className="fas fa-fingerprint"></i>
                <span>Auth: <span className="security-code">JWT</span></span>
              </div>
              {!isMobile && (
                <div className="security-item">
                  <i className="fas fa-server"></i>
                  <span>Server: <span className="security-code">{generateServerId()}</span></span>
                </div>
              )}
              <div className="security-item">
                <i className="fas fa-clock"></i>
                <span>Est. Time: <span className="security-code">{getEstimatedTime()}</span></span>
              </div>
            </div>
          </>
        )}
        
        {status === 'loading' && modalType === 'recovery' && (
          <div className="security-panel">
            <div className="security-panel-title">
              <i className="fas fa-shield-alt"></i>
              <span>Recovery Information</span>
            </div>
            <div className="security-item">
              <i className="fas fa-lock"></i>
              <span>Security: <span className="security-code">{isMobile ? 'Encrypted' : 'End-to-End Encrypted'}</span></span>
            </div>
            <div className="security-item">
              <i className="fas fa-clock"></i>
              <span>Expires: <span className="security-code">30 minutes</span></span>
            </div>
            {!isMobile && (
              <div className="security-item">
                <i className="fas fa-server"></i>
                <span>Server: <span className="security-code">{generateServerId()}</span></span>
              </div>
            )}
            {!isMobile && (
              <div className="security-item">
                <i className="fas fa-shield-alt"></i>
                <span>Protection: <span className="security-code">Brute-Force Prevention</span></span>
              </div>
            )}
          </div>
        )}
        
        {status === 'success' && modalType === 'auth' && (
          <div className="auth-user-welcome">
            <div className="welcome-message">
              <i className="fas fa-user-check"></i>
              <span>Welcome back, <strong>{getUserName()}</strong>. {!isMobile && 'Redirecting to your dashboard...'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLoadingModal;