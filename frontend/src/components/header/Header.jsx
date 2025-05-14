// components/header/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../login/AuthContext';
import logoImg from '../../assets/LogoMHC.jpeg';
import '../../styles/Header/Header.scss';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(1); // Comenzamos con Referrals activo
  const [menuTransitioning, setMenuTransitioning] = useState(false);
  const [headerGlow, setHeaderGlow] = useState(false);
  const [parallaxPosition, setParallaxPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Referencias DOM
  const userMenuRef = useRef(null);
  const menuRef = useRef(null);
  
  // Extraer el rol base y el rol completo para usar en las rutas
  const roleData = getRoleInfo(currentUser?.role);
  const baseRole = roleData.baseRole;
  const roleType = roleData.roleType;
  
  // Detectar si estamos en la página de referrals
  const isReferralsPage = location.pathname.includes('/referrals') || 
                          location.pathname.includes('/createNewReferral');
  
  // Función para obtener información del rol y determinar qué tipo de usuario es
  function getRoleInfo(role) {
    if (!role) return { baseRole: 'developer', roleType: 'admin' };
    
    const roleLower = role.toLowerCase();
    let baseRole = roleLower.split(' - ')[0];
    let roleType = 'therapist';
    
    // Determinar tipo de rol
    if (baseRole === 'developer') {
      roleType = 'developer';
    } else if (baseRole === 'administrator') {
      roleType = 'admin';
    } else if (['pt', 'ot', 'st', 'pta', 'cota', 'sta'].includes(baseRole)) {
      roleType = 'therapist';
    } else if (['supportive', 'support', 'agency'].includes(baseRole)) {
      roleType = 'support';
    }
    
    return { baseRole, roleType };
  }
  
  // Función para filtrar menú según el rol del usuario
  function getFilteredMenuOptions() {
    // Opciones completas del menú
    const allMenuOptions = [
      { id: 1, name: "Patients", icon: "fa-user-injured", route: `/${baseRole}/patients`, color: "#36D1DC" },
      { id: 2, name: "Referrals", icon: "fa-file-medical", route: `/${baseRole}/referrals`, color: "#FF9966" },
      { id: 3, name: "Accounting", icon: "fa-chart-pie", route: `/${baseRole}/accounting`, color: "#4CAF50" }
    ];
    
    // Filtrar según el tipo de rol
    if (roleType === 'developer' || roleType === 'admin') {
      // Developer y Admin ven todas las opciones
      return allMenuOptions;
    } else if (roleType === 'therapist' || roleType === 'support') {
      // Terapistas y support solo ven Patients y Referrals
      return allMenuOptions.filter(option => 
        option.name === "Patients" || option.name === "Referrals"
      );
    }
    
    // Por defecto, mostrar solo Patients y Referrals
    return allMenuOptions.filter(option => 
      option.name === "Patients" || option.name === "Referrals"
    );
  }
  
  // Opciones del menú principal filtradas por rol
  const defaultMenuOptions = getFilteredMenuOptions();
  
  // Opciones del menú de referrals
  const referralsMenuOptions = [
    { id: 1, name: "Admin Referral Inbox", icon: "fa-inbox", route: `/${baseRole}/referrals/inbox`, color: "#4facfe" },
    { id: 2, name: "Create New Referral", icon: "fa-file-medical", route: `/${baseRole}/createNewReferral`, color: "#ff9966" },
    { id: 3, name: "Resend Referral", icon: "fa-paper-plane", route: `/${baseRole}/referrals/resend`, color: "#00e5ff" },
    { id: 4, name: "View Referral History", icon: "fa-history", route: `/${baseRole}/referrals/history`, color: "#8c54ff" },
    { id: 5, name: "Referral Stats", icon: "fa-chart-bar", route: `/${baseRole}/referrals/stats`, color: "#4CAF50" }
  ];
  
  // Elegir qué menú mostrar según la ruta actual y permisos
  const menuOptions = isReferralsPage && (roleType === 'developer' || roleType === 'admin') 
    ? referralsMenuOptions 
    : defaultMenuOptions;
  
  // Datos de usuario
  const userData = currentUser ? {
    name: currentUser.fullname || currentUser.username,
    avatar: getInitials(currentUser.fullname || currentUser.username),
    email: currentUser.email,
    role: currentUser.role,
    status: 'online'
  } : {
    name: '',
    avatar: '',
    email: '',
    role: '',
    status: 'online'
  };
  
  // Función para obtener iniciales del nombre
  function getInitials(name) {
    if (!name) return "U";
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
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
  
  // Auto-rotation carousel effect with responsive timing
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoggingOut && !menuTransitioning && menuOptions.length > 1) {
        setActiveMenuIndex((prevIndex) => 
          prevIndex >= menuOptions.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, isMobile ? 8000 : 6000);
    
    return () => clearInterval(interval);
  }, [menuOptions.length, menuTransitioning, isLoggingOut, isMobile]);
  
  // Parallax effect with performance optimizations
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isMobile && !isLoggingOut) {
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const multiplier = isTablet ? 15 : 20;
        const xPos = (clientX / width - 0.5) * multiplier;
        const yPos = (clientY / height - 0.5) * (isTablet ? 10 : 15);
        
        setParallaxPosition({ x: xPos, y: yPos });
        
        if (clientY < 100) {
          setHeaderGlow(true);
        } else {
          setHeaderGlow(false);
        }
      }
    };
    
    if (!isMobile && !isLoggingOut) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isTablet, isLoggingOut]);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle left carousel navigation
  const handlePrevious = () => {
    if (isLoggingOut || menuOptions.length <= 1) return;
    
    setActiveMenuIndex((prevIndex) => 
      prevIndex <= 0 ? menuOptions.length - 1 : prevIndex - 1
    );
  };
  
  // Handle right carousel navigation
  const handleNext = () => {
    if (isLoggingOut || menuOptions.length <= 1) return;
    
    setActiveMenuIndex((prevIndex) => 
      prevIndex >= menuOptions.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
    setShowAIAssistant(false);
    
    document.body.classList.add('logging-out');
    
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    }
  };
  
  // Handle menu option click
  const handleMenuOptionClick = (option) => {
    if (isLoggingOut) return;
    
    setActiveMenuIndex(menuOptions.findIndex(o => o.id === option.id));
    setMenuTransitioning(true);
    
    setTimeout(() => {
      navigate(option.route);
    }, isMobile ? 300 : 500);
  };
  
  // Handle navigation to profile page
  const handleNavigateToProfile = () => {
    if (isLoggingOut) return;
    
    setShowUserMenu(false);
    setMenuTransitioning(true);
    
    setTimeout(() => {
      navigate(`/${baseRole}/profile`);
    }, isMobile ? 300 : 500);
  };
  
  // Handle navigation to settings page
  const handleNavigateToSettings = () => {
    if (isLoggingOut) return;
    
    setShowUserMenu(false);
    setMenuTransitioning(true);
    
    setTimeout(() => {
      navigate(`/${baseRole}/settings`);
    }, isMobile ? 300 : 500);
  };
  
  // Handle navigation to main menu
  const handleMainMenuTransition = () => {
    navigate(`/${baseRole}/homePage`);
  };
  
  // Función para calcular qué posiciones mostrar para cada elemento
  // Esta es la clave para eliminar el espacio a la izquierda
  const getCarouselPositions = () => {
    // Para 3 opciones, mostramos todas a la vez con un orden específico
    if (menuOptions.length === 3) {
      // Arreglo para mapear índices a posiciones de visualización
      // Usamos: left, center, right (sin far-left ni far-right)
      const positions = ['left', 'center', 'right'];
      
      // Rotate positions based on activeMenuIndex
      // Esto asegura que el elemento activo siempre esté en el centro
      // y los otros elementos estén a los lados correspondientes
      let rotatedPositions = [...positions];
      for (let i = 0; i < activeMenuIndex; i++) {
        rotatedPositions.unshift(rotatedPositions.pop());
      }
      
      // Retornar mapeo de índices a posiciones visuales
      return menuOptions.map((option, index) => {
        return {
          ...option,
          position: rotatedPositions[index]
        };
      });
    }
    
    // Para otros números de opciones, usamos el sistema original
    // (pero esto no debería ocurrir en tu caso específico)
    const result = [];
    const totalOptions = menuOptions.length;
    
    for (let i = 0; i < totalOptions; i++) {
      let position;
      const relativePos = (i - activeMenuIndex + totalOptions) % totalOptions;
      
      if (relativePos === 0) {
        position = "center";
      } else if (relativePos === 1 || (relativePos === totalOptions - 1 && totalOptions === 2)) {
        position = "right";
      } else if (relativePos === totalOptions - 1) {
        position = "left";
      } else {
        position = relativePos < totalOptions / 2 ? "far-right" : "far-left";
      }
      
      result.push({
        ...menuOptions[i],
        position
      });
    }
    
    return result;
  };

  // Verificar si el usuario es un terapeuta
  const isTherapist = ['pt', 'ot', 'st', 'pta', 'cota', 'sta'].includes(baseRole);

  // Mostrar/ocultar flechas de navegación basado en cantidad de opciones
  const showCarouselArrows = menuOptions.length > 1;

  return (
    <>
      <header className={`main-header ${headerGlow ? 'glow-effect' : ''} ${menuTransitioning ? 'transitioning' : ''} ${isLoggingOut ? 'logging-out' : ''}`}>
        <div className="header-container">
          {/* Logo con efectos */}
          <div className="logo-container">
            <div className="logo-glow"></div>
            <img src={logoImg} alt="TherapySync Logo" className="logo" onClick={() => !isLoggingOut && handleMainMenuTransition()} />
            
            {/* Botones de navegación en página de referrals */}
            {isReferralsPage && (roleType === 'developer' || roleType === 'admin') && (
              <div className="menu-navigation">
                <button 
                  className="nav-button main-menu" 
                  onClick={handleMainMenuTransition}
                  title="Volver al menú principal"
                >
                  <i className="fas fa-th-large"></i>
                  <span>Main Menu</span>
                </button>
                
                <button 
                  className="nav-button referrals-menu active" 
                  title="Menú de Referrals"
                >
                  <i className="fas fa-file-medical"></i>
                  <span>Referrals</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Carousel mejorado sin espacios vacíos */}
          <div className="top-carousel" ref={menuRef}>
            {showCarouselArrows && (
              <button className="carousel-arrow left" onClick={handlePrevious} aria-label="Previous" disabled={isLoggingOut}>
                <div className="arrow-icon">
                  <i className="fas fa-chevron-left"></i>
                </div>
              </button>
            )}
            
            <div className="carousel-options">
              {getCarouselPositions().map((item) => (
                <div 
                  key={item.id} 
                  className={`carousel-option ${item.position}`}
                  onClick={() => handleMenuOptionClick(item)}
                >
                  <div className="option-content">
                    <div 
                      className="option-icon" 
                      style={{ 
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`,
                        opacity: item.position === 'center' ? 1 : 0
                      }}
                    >
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <span>{item.name}</span>
                    {item.position === 'center' && (
                      <div className="active-underline"></div>
                    )}
                  </div>
                  {item.position === 'center' && (
                    <div className="option-glow"></div>
                  )}
                </div>
              ))}
            </div>
            
            {showCarouselArrows && (
              <button className="carousel-arrow right" onClick={handleNext} aria-label="Next" disabled={isLoggingOut}>
                <div className="arrow-icon">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </button>
            )}
          </div>
          
          {/* Enhanced user profile with responsive layout */}
          <div className="support-user-profile" ref={userMenuRef}>
            <div 
              className={`support-profile-button ${showUserMenu ? 'active' : ''}`} 
              onClick={() => !isLoggingOut && setShowUserMenu(!showUserMenu)}
              data-tooltip="Your profile and settings"
            >
              <div className="support-avatar">
                <div className="support-avatar-text">{userData.avatar}</div>
                <div className={`support-avatar-status ${userData.status}`}></div>
              </div>
              
              <div className="support-profile-info">
                <span className="support-user-name">{userData.name}</span>
                <span className="support-user-role">{userData.role}</span>
              </div>
              
              <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
            </div>
            
            {/* Enhanced dropdown menu with responsive layout */}
            {showUserMenu && !isLoggingOut && (
              <div className="support-user-menu">
                <div className="support-menu-header">
                  <div className="support-user-info">
                    <div className="support-user-avatar">
                      <span>{userData.avatar}</span>
                      <div className={`avatar-status ${userData.status}`}></div>
                    </div>
                    <div className="support-user-details">
                      <h4>{userData.name}</h4>
                      <span className="support-user-email">{userData.email}</span>
                      <span className={`support-user-status ${userData.status}`}>
                        <i className="fas fa-circle"></i> 
                        {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="support-menu-section">
                  <div className="section-title">Account</div>
                  <div className="support-menu-items">
                    <div 
                      className="support-menu-item"
                      onClick={handleNavigateToProfile}
                    >
                      <i className="fas fa-user-circle"></i>
                      <span>My Profile</span>
                    </div>
                    <div 
                      className="support-menu-item"
                      onClick={handleNavigateToSettings}
                    >
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </div>
                    {/* Mostrar "My Schedule" solo para roles de terapeutas */}
                    {isTherapist && (
                      <div className="support-menu-item">
                        <i className="fas fa-calendar-alt"></i>
                        <span>My Schedule</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Mostrar sección de soporte solo para usuarios que no sean developers */}
                {roleType !== 'developer' && (
                  <div className="support-menu-section">
                    <div className="section-title">Support</div>
                    <div className="support-menu-items">
                      <div className="support-menu-item">
                        <i className="fas fa-headset"></i>
                        <span>Contact Support</span>
                      </div>
                      <div className="support-menu-item">
                        <i className="fas fa-bug"></i>
                        <span>Report Issue</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="support-menu-footer">
                  <div className="support-menu-item logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Log Out</span>
                  </div>
                  <div className="version-info">
                    <span>TherapySync™</span>
                    <span>v2.7.0</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
     
    </>
  );
};

export default Header;