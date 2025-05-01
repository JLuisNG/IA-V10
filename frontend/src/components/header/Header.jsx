// components/header/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../login/AuthContext';
import logoImg from '../../assets/LogoMHC.jpeg';
import '../../styles/Header/Header.scss';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar la ruta actual
  const { currentUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [menuTransitioning, setMenuTransitioning] = useState(false);
  const [headerGlow, setHeaderGlow] = useState(false);
  const [parallaxPosition, setParallaxPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const notificationCount = 5;
  
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
  
  // Función para filtrar menú según el rol del usuario - MODIFICADA PARA QUITAR SUPPORT
  function getFilteredMenuOptions() {
    // Opciones completas del menú (sin Support)
    const allMenuOptions = [
      { id: 1, name: "Patients", icon: "fa-user-injured", route: `/${baseRole}/patients`, color: "#36D1DC" },
      { id: 2, name: "Referrals", icon: "fa-file-medical", route: `/${baseRole}/referrals`, color: "#FF9966" },
      { id: 4, name: "System Management", icon: "fa-cogs", route: `/${baseRole}/management`, color: "#8B5CF6" },
      { id: 5, name: "Accounting", icon: "fa-chart-pie", route: `/${baseRole}/accounting`, color: "#4CAF50" }
    ];
    
    // Filtrar según el tipo de rol
    if (roleType === 'developer' || roleType === 'admin') {
      // Developer y Admin ven todas las opciones excepto Support
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
  
  // Opciones del menú de referrals con iconos y colores personalizados
  // Solo se mostrarán si el usuario tiene acceso a referrals
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
  
  // Configurar el índice activo basado en la ruta actual
  useEffect(() => {
    if (isReferralsPage && (roleType === 'developer' || roleType === 'admin')) {
      // Encontrar qué opción del menú de referrals coincide mejor con la ruta actual
      const matchingOptionIndex = referralsMenuOptions.findIndex(option => 
        location.pathname.includes(option.route) || 
        (option.name === "Create New Referral" && location.pathname.includes('createNewReferral'))
      );
      
      if (matchingOptionIndex !== -1) {
        setActiveMenuIndex(matchingOptionIndex);
      } else {
        // Si no hay coincidencia, establecer "Create New Referral" como activo por defecto
        const createNewReferralIndex = referralsMenuOptions.findIndex(option => 
          option.name === "Create New Referral"
        );
        setActiveMenuIndex(createNewReferralIndex !== -1 ? createNewReferralIndex : 0);
      }
    } else {
      // Para el menú principal, encontrar qué opción coincide con la ruta actual
      const matchingOptionIndex = defaultMenuOptions.findIndex(option => 
        location.pathname.includes(option.route.split('/').pop())
      );
      
      if (matchingOptionIndex !== -1) {
        setActiveMenuIndex(matchingOptionIndex);
      } else {
        setActiveMenuIndex(0); // Default para página principal
      }
    }
  }, [location.pathname, isReferralsPage, baseRole, roleType]);
  
  // Usar datos de usuario del contexto de autenticación
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
    // Slower rotation on mobile for better readability
    const interval = setInterval(() => {
      if (!isLoggingOut && !menuTransitioning && menuOptions.length > 1) {
        setActiveMenuIndex((prevIndex) => 
          prevIndex >= menuOptions.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, isMobile ? 8000 : 6000);
    
    return () => clearInterval(interval);
  }, [menuOptions.length, menuTransitioning, isLoggingOut, isMobile]);
  
  // Parallax effect with performance optimizations for mobile
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isMobile && !isLoggingOut) { // Disable parallax on mobile and during logout
        const { clientX, clientY } = e;
        // Para obtener el width y height correctamente, usamos document.body
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Calculate position relative to center with reduced movement
        const multiplier = isTablet ? 15 : 20;
        const xPos = (clientX / width - 0.5) * multiplier;
        const yPos = (clientY / height - 0.5) * (isTablet ? 10 : 15);
        
        setParallaxPosition({ x: xPos, y: yPos });
        
        // Activate header glow when mouse is near the top
        if (clientY < 100) {
          setHeaderGlow(true);
        } else {
          setHeaderGlow(false);
        }
      }
    };
    
    // Only add event listener if not on mobile and not during logout
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
    if (isLoggingOut || menuOptions.length <= 1) return; // No permitir cambios durante el cierre de sesión o si solo hay 1 opción
    
    setActiveMenuIndex((prevIndex) => 
      prevIndex <= 0 ? menuOptions.length - 1 : prevIndex - 1
    );
  };
  
  // Handle right carousel navigation
  const handleNext = () => {
    if (isLoggingOut || menuOptions.length <= 1) return; // No permitir cambios durante el cierre de sesión o si solo hay 1 opción
    
    setActiveMenuIndex((prevIndex) => 
      prevIndex >= menuOptions.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Handle logout - ahora delegamos al componente padre
  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
    setShowAIAssistant(false);
    
    // Agregar clases de cierre de sesión al header
    document.body.classList.add('logging-out');
    
    // Llamar a la función onLogout que recibimos como prop
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    }
  };
  
  // Handle menu option click with responsive transitions
  const handleMenuOptionClick = (option) => {
    if (isLoggingOut) return; // No permitir cambios durante el cierre de sesión
    
    setActiveMenuIndex(menuOptions.findIndex(o => o.id === option.id));
    setMenuTransitioning(true);
    
    // Faster transition on mobile for better UX
    setTimeout(() => {
      navigate(option.route);
    }, isMobile ? 300 : 500);
  };
  
  // Handle navigation to profile page
  const handleNavigateToProfile = () => {
    if (isLoggingOut) return; // No permitir cambios durante el cierre de sesión
    
    setShowUserMenu(false);
    setMenuTransitioning(true);
    
    // Add transition effect before navigation
    setTimeout(() => {
      navigate(`/${baseRole}/profile`);
    }, isMobile ? 300 : 500);
  };
  
  // Handle navigation to main menu
  const handleMainMenuTransition = () => {
    navigate(`/${baseRole}/homePage`);
  };
  
  // Get visible menu options for carousel with responsive considerations
  const getVisibleMenuOptions = () => {
    const result = [];
    const totalOptions = menuOptions.length;
    
    // Si solo hay una opción, solo mostrar esa
    if (totalOptions === 1) {
      return [{ ...menuOptions[0], position: 'center' }];
    }
    
    // For mobile, show only 3 elements; for tablets and up, show 5
    const visibleItems = isMobile ? 3 : 5;
    const offset = Math.floor(visibleItems / 2);
    
    // Get indices with the active in the center
    for (let i = -offset; i <= offset; i++) {
      // Skip far elements on mobile
      if (isMobile && (i === -2 || i === 2)) continue;
      
      // Si no hay suficientes opciones, no mostrar espacios vacíos
      if (totalOptions <= visibleItems && (activeMenuIndex + i < 0 || activeMenuIndex + i >= totalOptions)) {
        continue;
      }
      
      const actualIndex = (activeMenuIndex + i + totalOptions) % totalOptions;
      
      // Determine position based on distance to active element
      let position;
      if (i === -2) position = 'far-left';
      else if (i === -1) position = 'left';
      else if (i === 0) position = 'center';
      else if (i === 1) position = 'right';
      else position = 'far-right';
      
      result.push({
        ...menuOptions[actualIndex],
        position
      });
    }
    
    return result;
  };

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
            
            {/* Mostrar botones de navegación en la página de referrals si el usuario tiene acceso */}
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
          
          {/* Enhanced carousel with responsive layout */}
          <div className="top-carousel" ref={menuRef}>
            {showCarouselArrows && (
              <button className="carousel-arrow left" onClick={handlePrevious} aria-label="Previous" disabled={isLoggingOut}>
                <div className="arrow-icon">
                  <i className="fas fa-chevron-left"></i>
                </div>
              </button>
            )}
            
            <div className="carousel-options">
              {getVisibleMenuOptions().map((item) => (
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
                    <div className="support-menu-item">
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </div>
                    <div className="support-menu-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>My Schedule</span>
                    </div>
                  </div>
                </div>
                
                <div className="support-menu-section">
                  <div className="section-title">Preferences</div>
                  <div className="support-menu-items">
                  <div className="support-menu-item">
                      <i className="fas fa-bell"></i>
                      <span>Notifications</span>
                      <div className="support-notification-badge">{notificationCount}</div>
                    </div>
                    <div className="support-menu-item toggle-item">
                      <div className="toggle-item-content">
                        <i className="fas fa-moon"></i>
                        <span>Dark Mode</span>
                      </div>
                      <div className="toggle-switch">
                        <div className="toggle-handle active"></div>
                      </div>
                    </div>
                    <div className="support-menu-item toggle-item">
                      <div className="toggle-item-content">
                        <i className="fas fa-volume-up"></i>
                        <span>Sound Alerts</span>
                      </div>
                      <div className="toggle-switch">
                        <div className="toggle-handle"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
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
                
                <div className="support-menu-footer">
                  <div className="support-menu-item logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Log Out</span>
                  </div>
                  <div className="version-info">
                    <span>TherapySync™ Support</span>
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