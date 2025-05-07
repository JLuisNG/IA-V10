import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/developer/Welcome/Welcome.scss';
import LogoutAnimation from '../../LogOut/LogOut'; 
import InfoWelcome from './infoWelcome';
import FloatingSupportButton from '../support/FloatingSupportButton';
import { useAuth } from '../../login/AuthContext';
import Header from '../../header/Header';

const AdminHomePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [parallaxPosition, setParallaxPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [welcomeAnimComplete, setWelcomeAnimComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const containerRef = useRef(null);
  
  // Check device size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate random particles for background effect with responsive count
  const generateParticles = () => {
    const particlesArray = [];
    // Adjust particle count based on device performance capabilities
    const particleCount = isMobile ? 15 : isTablet ? 20 : 25;
    
    for (let i = 0; i < particleCount; i++) {
      particlesArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (isMobile ? 3 : 5) + (isMobile ? 2 : 3),
        speed: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
        delay: Math.random() * 5
      });
    }
    
    setParticles(particlesArray);
  };
  
  // Load assistant after page is fully loaded with performance optimizations
  useEffect(() => {
    // Generate particles
    generateParticles();
    
    // Complete entrance animation
    setTimeout(() => {
      setWelcomeAnimComplete(true);
    }, isMobile ? 1000 : 1500);
    
    // Delay to ensure page loads first - shorter delay on mobile for better UX
    const timer = setTimeout(() => {
      setShowAIAssistant(true);
    }, isMobile ? 1500 : 2000);
    
    return () => clearTimeout(timer);
  }, [isMobile]);
  
  // Parallax effect with performance optimizations for mobile
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current && !isMobile) { // Disable parallax on mobile for performance
        const { clientX, clientY } = e;
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        // Calculate position relative to center with reduced movement on lower-power devices
        const multiplier = isTablet ? 15 : 20;
        const xPos = (clientX / width - 0.5) * multiplier;
        const yPos = (clientY / height - 0.5) * (isTablet ? 10 : 15);
        
        setParallaxPosition({ x: xPos, y: yPos });
      }
    };
    
    // Only add event listener if not on mobile
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isTablet]);

  // Handle logout with animation
  const handleLogout = () => {
    // Mostrar la animación de cierre de sesión
    setIsLoggingOut(true);
    
    // Ocultar el asistente AI durante el cierre de sesión
    setShowAIAssistant(false);
    
    // Agregar clases de cierre de sesión a todo el documento
    document.body.classList.add('logging-out');
    
    // No necesitamos más código aquí, ya que LogoutAnimation manejará la animación
    // y llamará al callback cuando termine
  };
  
  // Callback para cuando la animación de cierre de sesión se complete
  const handleLogoutAnimationComplete = () => {
    // Ejecutar el cierre de sesión real
    logout();
    // Redireccionar a la página de inicio de sesión
    navigate('/');
  };

  return (
    <div 
      className={`dashboard ${welcomeAnimComplete ? 'anim-complete' : ''} ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}
      ref={containerRef}
    >
      {/* Parallax background with responsive behavior */}
      <div 
        className="parallax-background"
        style={{ 
          transform: isMobile ? 'scale(1.05)' : `scale(1.1) translate(${parallaxPosition.x}px, ${parallaxPosition.y}px)` 
        }}
      >
        <div className="gradient-overlay"></div>
        
        {/* Floating particles with responsive count */}
        <div className="particles-container">
          {particles.map(particle => (
            <div 
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                backgroundColor: particle.color,
                animationDuration: `${10 + particle.speed * 20}s`,
                animationDelay: `${particle.delay}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Usando el componente LogoutAnimation reutilizable con callback */}
      {isLoggingOut && (
        <LogoutAnimation 
          isMobile={isMobile} 
          onAnimationComplete={handleLogoutAnimationComplete}
        />
      )}
      
      {/* Componente Header reutilizable con función de logout */}
      <Header onLogout={handleLogout} />
      
      {/* Enhanced main content with responsive layout */}
      <main className="main-content">
        {/* Welcome container with responsive typography */}
        <div className="welcome-container welcome-container-top">
          <h1 className="welcome-title">
            <span className="highlight">Welcome</span> to TherapySync
            <div className="title-decoration"></div>
          </h1>
          <p className="welcome-subtitle">
            Select an option from the navigation menu to get started
            <span className="cursor-blink">_</span>
          </p>
        </div>
        
        {/* Info welcome component with responsive props */}
        <InfoWelcome isMobile={isMobile} isTablet={isTablet} />
      </main>
      
      {/* Premium floating support button */}
      <FloatingSupportButton />
    </div>
  );
};

export default AdminHomePage;