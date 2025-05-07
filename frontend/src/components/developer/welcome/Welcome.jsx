import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/developer/Welcome/Welcome.scss';
import LogoutAnimation from '../../LogOut/LogOut';
import InfoWelcome from './infoWelcome';
import { useAuth } from '../../login/AuthContext';
import Header from '../../header/Header';

const DevHomePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [parallaxPosition, setParallaxPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [welcomeAnimComplete, setWelcomeAnimComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  
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
  
  // Generate optimized particles for background effect
  const generateParticles = () => {
    const particlesArray = [];
    // Adjust particle count based on device for better performance
    const particleCount = isMobile ? 15 : isTablet ? 25 : 35;
    
    for (let i = 0; i < particleCount; i++) {
      // Create more sophisticated particles with varied properties
      particlesArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (isMobile ? 2 : 4) + (isMobile ? 1 : 2),
        speed: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        color: `rgba(${Math.floor(Math.random() * 200 + 55)}, ${Math.floor(Math.random() * 200 + 55)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.2 + 0.1})`,
        delay: Math.random() * 5,
        blurAmount: Math.random() * 2 + 1
      });
    }
    
    setParticles(particlesArray);
  };
  
  // Custom cursor effect - only for desktop
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isMobile && cursorRef.current) {
        // Smooth cursor following with slight delay
        const { clientX, clientY } = e;
        setMousePosition({ x: clientX, y: clientY });
      }
    };
    
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);
  
  // Apply cursor position with smooth animation
  useEffect(() => {
    if (cursorRef.current && !isMobile) {
      cursorRef.current.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px)`;
    }
  }, [mousePosition, isMobile]);
  
  // Load animations and components with optimized timing
  useEffect(() => {
    // Generate particles
    generateParticles();
    
    // Complete entrance animation with responsive timing
    setTimeout(() => {
      setWelcomeAnimComplete(true);
    }, isMobile ? 800 : 1200);
    
    // Staggered loading for better perceived performance
    const timer = setTimeout(() => {
      setShowAIAssistant(true);
    }, isMobile ? 1200 : 1800);
    
    return () => clearTimeout(timer);
  }, [isMobile]);
  
  // Enhanced parallax effect with performance optimizations
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current && !isMobile) {
        const { clientX, clientY } = e;
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        // Dynamic parallax intensity based on device capability
        const multiplier = isTablet ? 10 : 15;
        const xPos = (clientX / width - 0.5) * multiplier;
        const yPos = (clientY / height - 0.5) * (isTablet ? 8 : 12);
        
        // Smooth transition for parallax movement
        setParallaxPosition({ 
          x: xPos, 
          y: yPos 
        });
      }
    };
    
    // Only enable parallax on capable devices
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isTablet]);

  // Handle logout with enhanced animation
  const handleLogout = () => {
    // Show the logout animation
    setIsLoggingOut(true);
    
    // Hide AI assistant during logout
    setShowAIAssistant(false);
    
    // Add logout classes to entire document
    document.body.classList.add('logging-out');
  };
  
  // Callback for when the logout animation completes
  const handleLogoutAnimationComplete = () => {
    // Execute actual logout
    logout();
    // Redirect to login page
    navigate('/');
  };

  return (
    <div 
      className={`dashboard premium ${welcomeAnimComplete ? 'anim-complete' : ''} ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}
      ref={containerRef}
    >
      {/* Custom cursor for desktop only */}
      {!isMobile && (
        <div className="custom-cursor" ref={cursorRef}>
          <div className="cursor-dot"></div>
          <div className="cursor-ring"></div>
        </div>
      )}
      
      {/* Enhanced parallax background with dynamic behavior */}
      <div 
        className="parallax-background"
        style={{ 
          transform: isMobile ? 'scale(1.05)' : `translate3d(${parallaxPosition.x}px, ${parallaxPosition.y}px, 0) scale(1.1)` 
        }}
      >
        {/* Gradient overlay with enhanced depth */}
        <div className="gradient-overlay"></div>
        
        {/* Premium floating particles with varied properties */}
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
                filter: `blur(${particle.blurAmount}px)`,
                animationDuration: `${15 + particle.speed * 25}s`,
                animationDelay: `${particle.delay}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Enhanced nebula effects for depth */}
        <div className="nebula-effect nebula-1"></div>
        <div className="nebula-effect nebula-2"></div>
        <div className="nebula-effect nebula-3"></div>
      </div>
      
      {/* Animated gradient mesh for added depth */}
      <div className="gradient-mesh">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`mesh-line mesh-line-${i + 1}`}></div>
        ))}
      </div>
      
      {/* Logout animation component */}
      {isLoggingOut && (
        <LogoutAnimation 
          isMobile={isMobile} 
          onAnimationComplete={handleLogoutAnimationComplete}
        />
      )}
      
      {/* Header component */}
      <Header onLogout={handleLogout} />
      
      {/* Enhanced main content with premium animations */}
      <main className="main-content">
        {/* Welcome container with dynamic typography */}
        <div className="welcome-container welcome-container-top">
          <div className="title-container">
            <h1 className="welcome-title">
              <span className="highlight">Welcome</span> to TherapySync
              <div className="title-decoration"></div>
            </h1>
            <div className="title-glow"></div>
          </div>
          <p className="welcome-subtitle">
            Select an option from the navigation menu to get started
            <span className="cursor-blink">_</span>
          </p>
        </div>
        
        {/* Info welcome component with responsive props */}
        <InfoWelcome isMobile={isMobile} isTablet={isTablet} />
      </main>
      
      {/* AI Assistant component with conditional loading */}
      {/* {showAIAssistant && <AIAssistant isMobile={isMobile} />} */}
    </div>
  );
};

export default DevHomePage;