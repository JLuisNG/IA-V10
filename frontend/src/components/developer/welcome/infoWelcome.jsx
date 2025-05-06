import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { useAuth } from '../../login/AuthContext'; // Importar useAuth para obtener currentUser
import '../../../styles/developer/Welcome/InfoWelcome.scss';

const DevInfoWelcome = ({ isMobile, isTablet }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Obtener el usuario actual
  
  // Enhanced state for animations with performance optimizations
  const [animatedStats, setAnimatedStats] = useState({
    activePatients: 0
  });
  const [isHovering, setIsHovering] = useState({
    patients: false,
    support: false,
    guide: false
  });
  const [isFocused, setIsFocused] = useState(null);
  const [hoveredParticles, setHoveredParticles] = useState([]);
  const [cardRefs] = useState({
    patients: useRef(null),
    support: useRef(null),
    guide: useRef(null)
  });
  
  // Base de datos estática de pacientes (simulando que viene de una API)
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Vargas, Javier",
      therapist: "Regina Araquel",
      therapistType: "PT",
      agency: "Supportive Health Group",
      street: "1800 Camden Avenue",
      city: "Los Angeles",
      state: "CA",
      zip: "90025",
      phone: "(310) 808-5631",
      certPeriod: "04-19-2023 to 04-19-2025",
      status: "Active",
      dob: "05/12/1965",
      insurance: "Blue Cross Blue Shield",
      policyNumber: "BCB-123456789",
      emergencyContact: "Mohammed Ali",
      emergencyPhone: "(310) 555-7890",
      notes: "Patient recovering well. Following exercise regimen as prescribed.",
    },
    {
      id: 2,
      name: "Nava, Luis",
      therapist: "James Lee",
      therapistType: "OT",
      agency: "Intra Care Home Health",
      street: "1800 Camden Avenue",
      city: "Los Angeles",
      state: "CA",
      zip: "90025",
      phone: "(310) 808-5631",
      certPeriod: "04-19-2023 to 04-19-2025",
      status: "Desactive",
      dob: "05/12/1965",
      insurance: "Blue Cross Blue Shield",
      policyNumber: "BCB-123456789",
      emergencyContact: "Rick Grimes",
      emergencyPhone: "(310) 555-7890",
      notes: "Patient recovering well. Following exercise regimen as prescribed.",
    }
  ]);
  
  // Calcular estadísticas dinámicamente
  const [stats, setStats] = useState({
    activePatients: 0,
    pendingPatients: 0,
    totalPatients: 0,
    newPatientsToday: 0
  });
  
  // Efecto para calcular estadísticas cuando cambian los pacientes
  useEffect(() => {
    const calculateStats = () => {
      const totalPatients = patients.length;
      const activePatients = patients.filter(p => p.status === "Active").length;
      const pendingPatients = patients.filter(p => p.status === "Pending").length;
      // Simulamos pacientes nuevos hoy (en una app real, esto vendría de datos reales)
      const newPatientsToday = 5;
      
      setStats({
        activePatients,
        pendingPatients,
        totalPatients,
        newPatientsToday
      });
    };
    
    calculateStats();
  }, [patients]);
  
  // Enhanced counter animation with optimized timing for mobile
  useEffect(() => {
    // Shorter animation duration on mobile for better UX
    const duration = isMobile ? 1800 : 2500;
    // Fewer steps on mobile for better performance
    const steps = isMobile ? 50 : 70;
    const stepTime = duration / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      
      // Custom easing function with lighter computation for mobile
      const eased = isMobile 
        ? Math.min(1, 1 - Math.pow(1 - progress, 2)) 
        : (progress < 0.9 
          ? 1 - Math.pow(1 - progress, 3) 
          : 1 + Math.sin((progress - 0.9) * Math.PI * 10) * 0.05);
      
      setAnimatedStats({
        activePatients: Math.round(eased * stats.activePatients)
      });
      
      if (current >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [stats.activePatients, isMobile]);
  
  // Enhanced card hover handlers with mobile optimizations
  const handleCardHover = (card, isHovering) => {
    // Only apply hover effects on non-mobile devices
    if (!isMobile) {
      setIsHovering(prev => ({
        ...prev,
        [card]: isHovering
      }));
      
      if (isHovering) {
        generateParticles(card);
      } else {
        // Clear particles when hover ends
        setHoveredParticles([]);
      }
    }
  };
  
  // Enhanced card focus handler for all devices
  const handleCardFocus = (card) => {
    setIsFocused(card);
    
    // Apply focus class to all cards
    Object.keys(cardRefs).forEach(key => {
      if (cardRefs[key].current) {
        if (key === card) {
          cardRefs[key].current.classList.add('focus');
        } else {
          cardRefs[key].current.classList.add('blur');
        }
      }
    });
  };
  
  // Remove focus handler with animation cleanup
  const handleRemoveFocus = () => {
    setIsFocused(null);
    
    // Remove all focus/blur classes
    Object.keys(cardRefs).forEach(key => {
      if (cardRefs[key].current) {
        cardRefs[key].current.classList.remove('focus', 'blur');
      }
    });
  };
  
  // Generate particles with count optimization for mobile
  const generateParticles = (card) => {
    // Fewer particles on mobile/tablet for better performance
    const particlesCount = isMobile ? 8 : isTablet ? 12 : 15;
    const particles = [];
    
    // Optimized color palettes
    let colors;
    switch(card) {
      case 'patients':
        colors = ['#36D1DC', '#5B86E5', '#4FC3F7'];
        break;
      case 'support':
        colors = ['#FF9966', '#FF5E62', '#FF7043'];
        break;
      case 'guide':
        colors = ['#56CCF2', '#2F80ED', '#64B5F6'];
        break;
      default:
        colors = ['#64B5F6', '#4FC3F7', '#81D4FA'];
    }
    
    // Generate particles with size scaling for different devices
    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (isMobile ? 5 : 8) + (isMobile ? 2 : 2),
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 0.5
      });
    }
    
    setHoveredParticles(particles);
  };

  // Función para navegar a la página de pacientes
  const handleViewPatientsList = () => {
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    navigate(`/${baseRole}/patients?scrollTo=patients`);
  };

  return (
    <div className={`info-welcome-container ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}>
      {/* Premium dashboard cards with responsive layout */}
      <div className="dashboard-cards">
        {/* Patients card with enhanced responsive design */}
        <div 
          className={`dashboard-card ${isHovering.patients ? 'hover' : ''} ${isFocused === 'patients' ? 'focus' : isFocused ? 'blur' : ''}`}
          onMouseEnter={() => handleCardHover('patients', true)}
          onMouseLeave={() => handleCardHover('patients', false)}
          onClick={() => handleCardFocus('patients')}
          ref={cardRefs.patients}
        >
          <div className="card-content">
            <div className="card-header">
              <div className="icon-container patients-icon">
                <div className="icon-background"></div>
                <i className="fas fa-user-injured"></i>
              </div>
              <h3>Pacientes Activos</h3>
            </div>
            <div className="card-value">
              <span className="counter">{animatedStats.activePatients}</span>
              <div className="counter-badge">
                <i className="fas fa-arrow-up"></i>
                <span>12%</span>
              </div>
            </div>
            <div className="card-stats">
              <div className="stat-item">
                <div className="stat-label">Nuevos (hoy)</div>
                <div className="stat-value">+{stats.newPatientsToday}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Citas pendientes</div>
                <div className="stat-value">23</div>
              </div>
            </div>
            <div className="card-footer">
              <button 
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation(); // Evitar que se ejecute el onClick del card
                  handleViewPatientsList();
                }}
              >
                <div className="button-content">
                  <i className="fas fa-clipboard-list"></i>
                  <span>Ver listado</span>
                </div>
                <div className="button-hover-effect"></div>
              </button>
            </div>
          </div>
          
          {/* Optimized particles with conditional rendering for performance */}
          {isHovering.patients && !isMobile && (
            <div className="particles-container">
              {hoveredParticles.map(particle => (
                <div 
                  key={particle.id}
                  className="particle"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                ></div>
              ))}
            </div>
          )}
          
          {/* Enhanced background decorations */}
          <div className="card-bg-decoration"></div>
          <div className="card-grid-lines"></div>
          <div className="card-decoration">
            <span className="deco-circle"></span>
            <span className="deco-square"></span>
            <span className="deco-triangle"></span>
          </div>
        </div>
        
        {/* Support card with enhanced responsive design */}
        <div 
          className={`dashboard-card ${isHovering.support ? 'hover' : ''} ${isFocused === 'support' ? 'focus' : isFocused ? 'blur' : ''}`}
          onMouseEnter={() => handleCardHover('support', true)}
          onMouseLeave={() => handleCardHover('support', false)}
          onClick={() => handleCardFocus('support')}
          ref={cardRefs.support}
        >
          <div className="card-content">
            <div className="card-header">
              <div className="icon-container support-icon">
                <div className="icon-background"></div>
                <i className="fas fa-headset"></i>
              </div>
              <h3>Soporte Prioritario</h3>
            </div>
            <div className="card-description">
              <p>Asistencia técnica inmediata con respuesta garantizada</p>
              <div className="support-status">
                <div className="status-pulse"></div>
                <span className="status-dot"></span>
                <span>Disponible 24/7</span>
              </div>
            </div>
            <div className="support-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <span>Tiempo de respuesta: 10 min</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <span>Acceso a especialistas senior</span>
              </div>
            </div>
            <div className="card-footer">
              <button className="action-button pulse-animation">
                <div className="button-content">
                  <i className="fas fa-comments"></i>
                  <span>Iniciar chat</span>
                </div>
                <div className="button-hover-effect"></div>
              </button>
            </div>
          </div>
          
          {/* Optimized particles with conditional rendering */}
          {isHovering.support && !isMobile && (
            <div className="particles-container">
              {hoveredParticles.map(particle => (
                <div 
                  key={particle.id}
                  className="particle"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                ></div>
              ))}
            </div>
          )}
          
          {/* Enhanced background decorations */}
          <div className="card-bg-decoration"></div>
          <div className="card-grid-lines"></div>
          <div className="card-decoration">
            <span className="deco-circle"></span>
            <span className="deco-square"></span>
            <span className="deco-triangle"></span>
          </div>
        </div>
        
        {/* Learning center card with enhanced responsive design */}
        <div 
          className={`dashboard-card ${isHovering.guide ? 'hover' : ''} ${isFocused === 'guide' ? 'focus' : isFocused ? 'blur' : ''}`}
          onMouseEnter={() => handleCardHover('guide', true)}
          onMouseLeave={() => handleCardHover('guide', false)}
          onClick={() => handleCardFocus('guide')}
          ref={cardRefs.guide}
        >
          <div className="card-content">
            <div className="card-header">
              <div className="icon-container guide-icon">
                <div className="icon-background"></div>
                <i className="fas fa-book-open"></i>
              </div>
              <h3>Centro de Aprendizaje</h3>
            </div>
            <div className="card-description">
              <p>Recursos y tutoriales para optimizar su experiencia</p>
            </div>
            <div className="learning-progress">
              <div className="progress-header">
                <span>Progreso de aprendizaje</span>
                <span className="progress-percent">65%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '65%' }}>
                  <div className="progress-glow"></div>
                </div>
              </div>
            </div>
            <div className="card-footer tutorial-options">
              <button className="tutorial-button">
                <div className="button-content">
                  <i className="fas fa-play-circle"></i>
                  <span>Video tutorial</span>
                </div>
                <div className="button-hover-effect"></div>
              </button>
              <button className="tutorial-button">
                <div className="button-content">
                  <i className="fas fa-file-alt"></i>
                  <span>Guía PDF</span>
                </div>
                <div className="button-hover-effect"></div>
              </button>
            </div>
          </div>
          
          {/* Optimized particles with conditional rendering */}
          {isHovering.guide && !isMobile && (
            <div className="particles-container">
              {hoveredParticles.map(particle => (
                <div 
                  key={particle.id}
                  className="particle"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                ></div>
              ))}
            </div>
          )}
          
          {/* Enhanced background decorations */}
          <div className="card-bg-decoration"></div>
          <div className="card-grid-lines"></div>
          <div className="card-decoration">
            <span className="deco-circle"></span>
            <span className="deco-square"></span>
            <span className="deco-triangle"></span>
          </div>
        </div>
      </div>
      
      {/* Reset view button with enhanced position for mobile */}
      {isFocused && (
        <button className="reset-view-button" onClick={handleRemoveFocus}>
          <i className="fas fa-th-large"></i>
          <span>Ver todas las tarjetas</span>
        </button>
      )}
    </div>
  );
};

export default DevInfoWelcome;