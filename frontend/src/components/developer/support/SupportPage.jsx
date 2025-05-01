import React, { useState, useEffect, useRef } from 'react';
import '../../../styles/developer/support/Support.scss';
import SupportHeader from './SupportHeader.jsx';
import SupportTickets from './SupportTickets.jsx';
import SupportKnowledgeBase from './SupportKnowledgeBase.jsx';
import SupportDashboard from './SupportDashboard.jsx';
// Importar logo correctamente para asegurar que se muestre
import logoImg from '../../../assets/LogoMHC.jpeg';
import { useAuth } from '../../login/AuthContext';

const DevSupportPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(7);
  const backgroundVideoRef = useRef(null);
  const { currentUser } = useAuth();
  const [debugMode, setDebugMode] = useState(false); // Debug mode enabled by default
  
  // Console log for debugging
  useEffect(() => {
    console.log('DevSupportPage component mounted');
    console.log('Current user role:', currentUser?.role);
    
    return () => {
      console.log('DevSupportPage component unmounted');
    };
  }, [currentUser]);
  
  // Error handler for background image
  const handleImageError = (e) => {
    console.error("Failed to load background image, using fallback");
    e.target.style.display = 'none'; // Hide the broken image
    document.querySelector('.support-background').classList.add('fallback-bg');
  };
  
  // Efecto para cargar la página con animación mejorada
  useEffect(() => {
    // Simulación de progreso de carga
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      setLoadingProgress(Math.floor(progress));
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Pequeño retraso para mostrar el 100% antes de desaparecer
      }
    }, 150);
    
    return () => clearInterval(progressInterval);
  }, []);

  // Controlar el parallax del fondo
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!backgroundVideoRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Suave efecto parallax en el fondo
      backgroundVideoRef.current.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Manejo de cambio de sección
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  
  // Renderizar contenido de la sección activa
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'tickets':
        return <SupportTickets />;
      case 'knowledge':
        return <SupportKnowledgeBase />;
      default:
        return <SupportDashboard />;
    }
  };
  
  // Renderizar partículas de fondo más eficientes y elegantes
  const renderParticles = () => {
    const particles = [];
    const particleCount = 25; // Optimizado para rendimiento
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 4 + 1;
      const opacity = Math.random() * 0.12 + 0.03;
      const delay = Math.random() * 5;
      const duration = Math.random() * 15 + 10;
      
      particles.push(
        <div
          key={i}
          className="support-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: opacity,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        ></div>
      );
    }
    
    return particles;
  };
  
  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };
  
  // Force loading to complete
  const forceLoadComplete = () => {
    setIsLoading(false);
  };
  
  return (
    <>
      {/* Debug panel - only visible when debug mode is on */}
      {debugMode && (
        <div style={{ 
          color: 'white', 
          padding: '20px', 
          backgroundColor: 'rgba(0,0,0,0.8)',
          position: 'fixed',
          zIndex: 9999,
          top: 0,
          left: 0,
          width: '100%',
          maxHeight: '300px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <h2 style={{margin: '0 0 10px 0'}}>Debug Panel</h2>
          <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
            <div>
              <p><strong>Status:</strong></p>
              <p>User: {currentUser?.username || 'Not logged in'}</p>
              <p>Role: {currentUser?.role || 'None'}</p>
              <p>Active section: {activeSection}</p>
              <p>Is loading: {isLoading.toString()}</p>
              <p>Loading progress: {loadingProgress}%</p>
            </div>
            <div>
              <p><strong>Controls:</strong></p>
              <button 
                onClick={forceLoadComplete} 
                style={{padding: '8px', margin: '5px 0', display: 'block', cursor: 'pointer'}}>
                Force Load Complete
              </button>
              <button 
                onClick={() => setActiveSection('dashboard')} 
                style={{padding: '8px', margin: '5px 0', display: 'block', cursor: 'pointer'}}>
                Show Dashboard
              </button>
              <button 
                onClick={() => setActiveSection('tickets')} 
                style={{padding: '8px', margin: '5px 0', display: 'block', cursor: 'pointer'}}>
                Show Tickets
              </button>
              <button 
                onClick={() => setActiveSection('knowledge')} 
                style={{padding: '8px', margin: '5px 0', display: 'block', cursor: 'pointer'}}>
                Show Knowledge Base
              </button>
            </div>
          </div>
          <button 
            onClick={toggleDebugMode} 
            style={{padding: '8px', marginTop: '10px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none'}}>
            Hide Debug Panel
          </button>
        </div>
      )}
      
      <div 
        className={`support-page ${isLoading ? 'is-loading' : 'is-loaded'}`}
        style={{visibility: 'visible', opacity: 1}} // Force visibility
      >
        {/* Fallback display if components fail */}
        <div className="support-fallback" style={{ display: 'none', padding: '20px', textAlign: 'center' }}>
          <h2>Support Center</h2>
          <p>We're experiencing technical difficulties loading the Support interface.</p>
          <button onClick={() => window.location.reload()}>
            Retry Loading
          </button>
        </div>
        
        {/* Fondo premium con imagen HD y efectos */}
        <div className="support-background" style={{visibility: 'visible', opacity: 0.8}}>
          {/* Imagen de fondo HD con blur controlado */}
          <div 
            className="background-image" 
            ref={backgroundVideoRef}
            style={{
              backgroundImage: "url('/assets/support-background.jpg')",
              backgroundColor: "#0a101f", // Fallback color
              visibility: 'visible'
            }}
            onError={handleImageError}
          ></div>
          
          {/* Overlay con gradiente refinado */}
          <div className="support-gradient-overlay" style={{visibility: 'visible', opacity: 0.9}}></div>
          
          {/* Partículas flotantes elegantes */}
          <div className="support-particles-container" style={{visibility: 'visible'}}>
            {renderParticles()}
          </div>

          {/* Efecto de viñeta en las esquinas */}
          <div className="corner-vignette top-left" style={{visibility: 'visible'}}></div>
          <div className="corner-vignette top-right" style={{visibility: 'visible'}}></div>
          <div className="corner-vignette bottom-left" style={{visibility: 'visible'}}></div>
          <div className="corner-vignette bottom-right" style={{visibility: 'visible'}}></div>
        </div>
        
        {/* Animación de carga premium */}
        {isLoading && (
          <div className="support-loader" style={{visibility: 'visible', zIndex: 1000}}>
            <div className="loader-content">
              <div className="loader-logo">
                <div className="logo-pulse"></div>
                {/* Usar el logo importado correctamente */}
                <img src={logoImg} alt="TherapySync Logo" style={{maxWidth: '100px', height: 'auto'}} />
              </div>
              
              <div className="loader-title">
                <h2>TherapySync Support</h2>
              </div>
              
              <div className="loader-progress">
                <div className="progress-track">
                  <div 
                    className="progress-fill"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <div className="progress-percentage">{loadingProgress}%</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenido principal con transiciones refinadas */}
        <div 
          className={`support-content ${isLoading ? 'hidden' : ''}`}
          style={{visibility: 'visible', zIndex: 2}}
        >
          <SupportHeader 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            notificationCount={notificationCount}
          />
          
          <main className="support-main" style={{minHeight: '500px', padding: '20px'}}>
            {/* Debug content - simple static content to verify rendering */}
            <div style={{
              background: 'rgba(255,255,255,0.1)', 
              padding: '20px', 
              marginBottom: '20px', 
              borderRadius: '8px',
              display: !debugMode ? 'none' : 'block'
            }}>
              <h2 style={{color: 'white'}}>Debug Content Area</h2>
              <p style={{color: 'rgba(255,255,255,0.8)'}}>
                If you can see this text, the component is rendering but there might be an issue with the actual dashboard components.
              </p>
              <button 
                onClick={toggleDebugMode} 
                style={{padding: '8px', marginTop: '10px', cursor: 'pointer'}}>
                Show Debug Panel
              </button>
            </div>
            
            {/* Actual content components */}
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </>
  );
};

export default DevSupportPage;