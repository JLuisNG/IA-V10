import React, { useEffect, useState, useRef } from 'react';
import '../../../styles/developer/Welcome/LogoutAnimation.scss';

const AdminLogoutAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [particles, setParticles] = useState([]);
  const [matrixChars, setMatrixChars] = useState([]);
  const consoleRef = useRef(null);
  
  // Mensajes de proceso para el cierre de sesión - más profesionales
  const logoutSteps = [
    "Finalizando sesión...",
    "Cerrando puertos seguros...",
    "Cerrando conexiones de BD...",
    "Eliminando tokens temporales...",
    "Verificando integridad de datos...",
    "Completando proceso..."
  ];
  
  // Personajes aleatorios para efecto matrix
  const generateMatrixChars = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const columns = 60; // Número de columnas para el efecto matrix
    const charsPerColumn = 25; // Caracteres por columna
    
    const matrixGrid = [];
    
    for (let i = 0; i < columns; i++) {
      const column = {
        id: i,
        x: Math.floor(Math.random() * 100),
        speed: Math.random() * 2 + 1,
        chars: []
      };
      
      for (let j = 0; j < charsPerColumn; j++) {
        column.chars.push({
          id: `${i}-${j}`,
          char: chars.charAt(Math.floor(Math.random() * chars.length)),
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 5
        });
      }
      
      matrixGrid.push(column);
    }
    
    setMatrixChars(matrixGrid);
  };
  
  // Generar partículas aleatorias para el efecto de éxito
  const generateParticles = () => {
    const particlesArray = [];
    const particleColors = ['#4CAF50', '#8BC34A', '#CDDC39', '#2196F3', '#00BCD4'];
    
    for (let i = 0; i < 60; i++) {
      particlesArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.8 + 0.2,
        delay: Math.random() * 500
      });
    }
    
    setParticles(particlesArray);
  };
  
  useEffect(() => {
    // Generar caracteres matrix al inicio
    generateMatrixChars();
    
    // Incrementar progreso continuamente
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 - prev) / 15;
        return newProgress > 99 ? 99 : newProgress;
      });
    }, 100);
    
    // Cambiar paso cada intervalo variable (más rápido al final)
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        
        // Al llegar al penúltimo paso, asegurar que el progreso llegue a 99%
        if (next >= logoutSteps.length - 1) {
          clearInterval(progressInterval);
          setProgress(99);
          
          // Mostrar pantalla de éxito después de un breve retraso
          setTimeout(() => {
            setProgress(100);
            setShowSuccess(true);
            generateParticles();
          }, 800);
        }
        
        return next < logoutSteps.length ? next : prev;
      });
    }, 700); // Tiempo entre pasos
    
    // Auto-scroll para la consola
    if (consoleRef.current) {
      const scrollInterval = setInterval(() => {
        if (consoleRef.current) {
          consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
      }, 100);
      
      return () => clearInterval(scrollInterval);
    }
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [logoutSteps.length]);
  
  return (
    <div className={`logout-animation-container ${showSuccess ? 'success-mode' : ''}`}>
      {/* Fondo oscuro con desenfoque y efecto matrix */}
      <div className="backdrop">
        <div className="matrix-effect">
          {matrixChars.map(column => (
            <div 
              key={column.id} 
              className="matrix-column"
              style={{ 
                left: `${column.x}%`,
                animationDuration: `${column.speed}s`
              }}
            >
              {column.chars.map(charObj => (
                <span 
                  key={charObj.id} 
                  style={{ 
                    opacity: charObj.opacity,
                    animationDelay: `${charObj.animationDelay}s`
                  }}
                >
                  {charObj.char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Partículas para el efecto de éxito */}
      {showSuccess && (
        <div className="success-particles">
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
                animationDelay: `${particle.delay}ms`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="logout-modal">
        {!showSuccess ? (
          <>
            {/* Ícono superior con efecto de scanning */}
            <div className="logout-icon">
              <div className="icon-ring"></div>
              <div className="icon-scanner"></div>
              <i className="fas fa-power-off"></i>
            </div>
            
            {/* Título */}
            <h2 className="logout-title">Cerrando Sesión</h2>
            
            {/* Mensaje de estado */}
            <div className="status-message">
              {logoutSteps[currentStep]}
            </div>
            
            {/* Barra de progreso avanzada */}
            <div className="progress-container">
              <div className="progress-segments">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`segment ${i <= currentStep ? 'active' : ''}`}
                    style={{
                      '--delay': `${i * 0.2}s`,
                      '--hue': `${200 + i * 20}`
                    }}
                  ></div>
                ))}
              </div>
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              >
                <div className="progress-glow"></div>
              </div>
              <div className="progress-percentage">
                {Math.round(progress)}%
              </div>
            </div>
            
            {/* Consola minimalista */}
            <div className="console-window">
              <div className="console-header">
                <span className="console-title">system_logout.sh</span>
                <div className="console-controls">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="console-body" ref={consoleRef}>
                <div className="console-line">$ initiating_session_termination</div>
                {currentStep >= 1 && (
                  <div className="console-line">$ closing_secure_ports: <span className="highlight">443</span>, <span className="highlight">8080</span>, <span className="highlight">3306</span> <span className="success">SUCCESS</span></div>
                )}
                {currentStep >= 2 && (
                  <div className="console-line">$ disconnecting_database: <span className="loading">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span> <span className="success">COMPLETE</span></div>
                )}
                {currentStep >= 3 && (
                  <div className="console-line">$ removing_auth_tokens: <span className="token">xJ9.a3F_dk39</span> <span className="success">REMOVED</span></div>
                )}
                {currentStep >= 4 && (
                  <div className="console-line">$ data_integrity_check: <span className="loading">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span> <span className="success">VERIFIED</span></div>
                )}
                {currentStep >= 5 && (
                  <div className="console-line terminal-success">$ session_terminated: <span className="highlight">REDIRECTING</span> <span className="blinking-cursor">_</span></div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Pantalla de éxito */
          <div className="logout-success">
            <div className="success-icon">
              <div className="success-ring"></div>
              <div className="checkmark">
                <i className="fas fa-check"></i>
              </div>
            </div>
            <h2 className="success-title">Sesión Finalizada</h2>
            <p className="success-message">Has cerrado sesión exitosamente del sistema</p>
            <div className="redirect-message">
              <div className="redirect-loader"></div>
              <span>Redirigiendo a la página de inicio...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogoutAnimation;