import React, { useEffect, useState } from 'react';

const AuthLoadingModal = ({ isOpen, status, message, onClose, modalType = 'auth' }) => {
  const [progress, setProgress] = useState(0);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showStatusIcon, setShowStatusIcon] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animateBg, setAnimateBg] = useState(false);
  
  // Pasos del proceso según el tipo de modal
  const steps = modalType === 'auth' ? [
    'Verifying credentials...',
    'Authenticating session...',
    'Validating permissions...',
    'Fetching user profile...',
    'Preparing secure connection...'
  ] : [
    'Preparing request...',
    'Verifying email address...',
    'Generating secure link...',
    'Finalizing process...'
  ];
  
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
    let stepInterval;
    
    if (isOpen && status === 'loading') {
      // Resetear estados al abrirse
      setProgress(0);
      setShowSpinner(true);
      setShowStatusIcon(false);
      setCurrentStep(0);
      
      // Animar el progreso - más fluido
      interval = setInterval(() => {
        setProgress(prev => {
          // Incrementar progreso con velocidad variable
          const increment = Math.random() * 8 + (prev < 40 ? 7 : prev < 70 ? 5 : 3);
          const newProgress = prev + increment;
          return newProgress > 95 ? 95 : newProgress; // Mantener en 95% hasta completar
        });
      }, 250);
      
      // Cambiar el paso actual periódicamente
      stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1800);
      
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
          }, 2000);
        }
      }, 400);
      
      return () => clearTimeout(timeout);
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [isOpen, status, steps.length, onClose]);
  
  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;
  
  // Determinar el mensaje a mostrar
  const displayMessage = status === 'loading' 
    ? steps[currentStep] 
    : message;
  
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
              {/* Spinner SVG moderno */}
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
                <path className="icon-path" d="M5 13l4 4L19 7" />
                <circle className="icon-fill" cx="12" cy="12" r="10" />
              </svg>
            </div>
          )}
          
          {showStatusIcon && status === 'error' && (
            <div className="error-icon show">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path className="icon-path" d="M18 6L6 18M6 6l12 12" />
                <circle className="icon-fill" cx="12" cy="12" r="10" />
              </svg>
            </div>
          )}
        </div>
        
        <h3 className={status !== 'loading' ? status : ''}>
          {status === 'loading' ? 'Authentication' : status === 'success' ? 'Success!' : 'Error'}
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
        
        {status === 'loading' && (
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
                <span>Auth Method: <span className="security-code">JWT</span></span>
              </div>
              <div className="security-item">
                <i className="fas fa-server"></i>
                <span>Server: <span className="security-code">SEC-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></span>
              </div>
            </div>
          </>
        )}
        
        {status === 'success' && (
          <div className="auth-user-welcome">
            <div className="welcome-message">
              <i className="fas fa-user-check"></i>
              <span>Welcome back, <strong>User</strong>. Redirecting...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLoadingModal;