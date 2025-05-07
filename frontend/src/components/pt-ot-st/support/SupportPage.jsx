import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../login/AuthContext';
import Header from '../../header/Header';
import FloatingSupportButton from './FloatingSupportButton';
import '../../../styles/developer/support/SupportPage.scss';

const SupportPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // Estados para animaciones y efectos
  const [isLoaded, setIsLoaded] = useState(false);
  const [particlesCount, setParticlesCount] = useState(0);
  const [showArrowAnimation, setShowArrowAnimation] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Referencias para animaciones
  const pageRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);
  const timerRefs = useRef([]);
  
  // Obtener el rol del usuario desde el contexto
  const userRole = currentUser?.role || '';
  
  // Determinar la URL del panel según el rol
  const getDashboardUrl = () => {
    const rolePrefix = userRole.toLowerCase().split(' ')[0]; // Obtener primera parte del rol (ej. "PT" de "PT - Administrator")
    return `/${rolePrefix}/homePage`;
  };
  
  // Efecto de carga y animaciones
  useEffect(() => {
    // Limpiar timers anteriores
    timerRefs.current.forEach(timer => clearTimeout(timer));
    timerRefs.current = [];
    
    // Secuencia de animación de entrada
    const loadSequence = async () => {
      // Fase 1: Aparecer la página
      const timer1 = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      timerRefs.current.push(timer1);
      
      // Fase 2: Generar partículas gradualmente
      await new Promise(resolve => {
        const timer2 = setTimeout(resolve, 400);
        timerRefs.current.push(timer2);
      });
      
      for (let i = 0; i < 50; i++) {
        await new Promise(resolve => {
          const timer = setTimeout(() => {
            setParticlesCount(prev => prev + 1);
            resolve();
          }, 20);
          timerRefs.current.push(timer);
        });
      }
      
      // Fase 3: Mostrar flecha animada
      await new Promise(resolve => {
        const timer3 = setTimeout(resolve, 1500);
        timerRefs.current.push(timer3);
      });
      
      setShowArrowAnimation(true);
    };
    
    loadSequence();
    
    return () => {
      // Limpiar timers al desmontar
      timerRefs.current.forEach(timer => clearTimeout(timer));
    };
  }, []);
  
  // Manejar clic en el botón de regreso
  const handleReturnClick = () => {
    // Animación de salida
    setIsLoaded(false);
    setHasInteracted(true);
    
    // Navegar después de la animación
    setTimeout(() => {
      navigate(getDashboardUrl());
    }, 300);
  };
  
  // Manejar cierre de sesión
  const handleLogout = () => {
    // Animación de salida
    setIsLoaded(false);
    
    setTimeout(() => {
      logout();
      navigate('/');
    }, 300);
  };
  
  // Generar partículas aleatorias para el fondo
  const renderParticles = () => {
    const particles = [];
    
    for (let i = 0; i < particlesCount; i++) {
      const size = Math.random() * 4 + 2;
      const opacity = Math.random() * 0.4 + 0.1;
      const animationDuration = Math.random() * 60 + 40;
      const animationDelay = Math.random() * 10;
      
      particles.push(
        <div 
          key={i}
          className="background-particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            opacity: opacity,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`
          }}
        ></div>
      );
    }
    
    return particles;
  };

  return (
    <div 
      className={`support-page ${isLoaded ? 'loaded' : ''} ${hasInteracted ? 'exit' : ''}`}
      ref={pageRef}
    >
      {/* Fondo con efecto paralaje y partículas */}
      <div className="support-page-background">
        <div className="gradient-overlay"></div>
        <div className="particles-container">
          {renderParticles()}
        </div>
      </div>
      
      {/* Header con funcionalidad de logout */}
      <Header onLogout={handleLogout} />
      
      {/* Contenido principal */}
      <main className="support-content">
        {/* Botón de regreso al dashboard */}
        <div className="return-home">
          <button 
            className="return-button"
            onClick={handleReturnClick}
            aria-label="Return to Dashboard"
          >
            <div className="button-icon">
              <i className="fas fa-arrow-left"></i>
            </div>
            <span>Return to Dashboard</span>
            <div className="button-background"></div>
          </button>
        </div>
        
        {/* Sección central con mensaje de soporte */}
        <div className="support-placeholder">
          <div className="content-container">
            {/* Icono animado */}
            <div className="support-icon" ref={iconRef}>
              <div className="icon-outer-ring"></div>
              <div className="icon-inner-ring"></div>
              <div className="icon-wrapper">
                <i className="fas fa-headset"></i>
              </div>
              <div className="icon-particles">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="icon-particle"
                    style={{
                      '--rotation': `${45 * i}deg`,
                      '--delay': `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Texto principal */}
            <div className="support-text" ref={textRef}>
              <h2>Support Center</h2>
              <div className="title-underline">
                <div className="underline-dot"></div>
                <div className="underline-line"></div>
                <div className="underline-dot"></div>
              </div>
              <p>
                Our support team is ready to assist you with any questions or issues. 
                Click the floating support button to open our premium support center 
                and get the help you need.
              </p>
              
              {/* Características de soporte */}
              <div className="support-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <div className="feature-text">
                    <h4>Fast Response</h4>
                    <p>Average response time of 30 minutes during business hours</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="feature-text">
                    <h4>Expert Support</h4>
                    <p>Direct access to our experienced technical team</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-history"></i>
                  </div>
                  <div className="feature-text">
                    <h4>24/7 Availability</h4>
                    <p>Support available around the clock for critical issues</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indicador de flecha animada */}
            {showArrowAnimation && (
              <div className="arrow-indicator">
                <div className="arrow-content">
                  <div className="arrow-animation">
                    <i className="fas fa-long-arrow-alt-down"></i>
                  </div>
                  <p>Click the support button</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Botón flotante de soporte */}
        <FloatingSupportButton />
      </main>
    </div>
  );
};

export default SupportPage;