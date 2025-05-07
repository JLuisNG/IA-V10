import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/login/AuthContext'; // Importar el contexto de autenticación
import '../../../styles/developer/support/SupportHeader.scss';
import logoImg from '../../../assets/LogoMHC.jpeg';
import LogoutAnimation from '../../../components/LogOut/LogOut'; // Importar componente de animación

const DevSupportHeader = ({ 
  activeSection, 
  onSectionChange, 
  searchQuery, 
  setSearchQuery, 
  notificationCount 
}) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Usar el contexto de autenticación
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [headerGlow, setHeaderGlow] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Opciones del menú mejoradas con descripciones y badges
  const menuOptions = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: 'fa-chart-network', 
      subtitle: 'Analytics & Insights', 
      badge: null,
      description: 'Get a comprehensive overview of your support metrics and performance indicators.'
    },
    { 
      id: 'tickets', 
      name: 'Tickets', 
      icon: 'fa-ticket-alt', 
      subtitle: 'Case Management', 
      badge: { count: 12, type: 'warning' },
      description: 'View and manage support tickets, assign priorities, and track resolution time.'
    },
    { 
      id: 'knowledge', 
      name: 'Knowledge Base', 
      icon: 'fa-books', 
      subtitle: 'Resources Library', 
      badge: { count: 3, type: 'info', text: 'NEW' },
      description: 'Access and create help articles, tutorials, and documentation for customers.'
    }
  ];
  
  // Datos de notificaciones simuladas con más detalles
  const notifications = [
    { 
      id: 1, 
      type: 'ticket', 
      title: 'New high priority ticket assigned', 
      description: 'Customer experiencing login issues on the mobile app - requires immediate attention',
      time: '10 min ago', 
      read: false,
      priority: 'high',
      user: {
        name: 'Emily Parker',
        avatar: 'EP',
        email: 'emily.parker@company.com',
        role: 'Customer'
      },
      ticketId: 'TK-1084',
      actions: [
        { name: 'View Ticket', icon: 'fa-eye', link: '/tickets/1084' },
        { name: 'Assign', icon: 'fa-user-plus', action: 'assign' },
        { name: 'Mark as read', icon: 'fa-check', action: 'markRead' }
      ]
    },
    { 
      id: 2, 
      type: 'response', 
      title: 'Customer replied to ticket #1082', 
      description: 'Thanks for your help, the issue is now resolved. Looking forward to the next update!',
      time: '43 min ago', 
      read: false,
      priority: 'medium',
      user: {
        name: 'Michael Chang',
        avatar: 'MC',
        email: 'michael.chang@client.org',
        role: 'Premium Customer'
      },
      ticketId: 'TK-1082',
      actions: [
        { name: 'View Thread', icon: 'fa-comments', link: '/tickets/1082' },
        { name: 'Close Ticket', icon: 'fa-check-circle', action: 'closeTicket' },
        { name: 'Mark as read', icon: 'fa-check', action: 'markRead' }
      ]
    },
    { 
      id: 3, 
      type: 'system', 
      title: 'System maintenance scheduled', 
      description: 'Planned downtime tonight from 2-4 AM EST for database upgrades and performance optimizations',
      time: '2 hours ago', 
      read: false,
      priority: 'info',
      actions: [
        { name: 'View Details', icon: 'fa-info-circle', link: '/system/maintenance' },
        { name: 'Add to Calendar', icon: 'fa-calendar-plus', action: 'addCalendar' },
        { name: 'Dismiss', icon: 'fa-times', action: 'dismiss' }
      ]
    },
    { 
      id: 4, 
      type: 'mention', 
      title: 'You were mentioned in ticket #987', 
      description: '@LuisNava can you help with this integration issue? The customer is having trouble with the API endpoints.',
      time: '5 hours ago', 
      read: true,
      priority: 'medium',
      user: {
        name: 'Maria Cruz',
        avatar: 'MC',
        email: 'maria.cruz@therapysync.com',
        role: 'Support Specialist'
      },
      ticketId: 'TK-987',
      actions: [
        { name: 'Reply', icon: 'fa-reply', link: '/tickets/987' },
        { name: 'Assign to me', icon: 'fa-user-check', action: 'assignToMe' }
      ]
    },
    { 
      id: 5, 
      type: 'overdue', 
      title: 'Ticket #765 is overdue by 12 hours', 
      description: 'Billing issue requires immediate attention - customer unable to upgrade their subscription plan',
      time: 'Yesterday', 
      read: true,
      priority: 'critical',
      ticketId: 'TK-765',
      actions: [
        { name: 'View Ticket', icon: 'fa-exclamation-circle', link: '/tickets/765' },
        { name: 'Escalate', icon: 'fa-arrow-up', action: 'escalate' }
      ]
    }
  ];
  
  // Función para obtener iniciales del nombre
  function getInitials(name) {
    if (!name) return "U";
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  // Usar datos de usuario del contexto de autenticación
  const userData = {
    name: currentUser?.fullname || currentUser?.username || 'Usuario',
    avatar: getInitials(currentUser?.fullname || currentUser?.username || 'Usuario'),
    email: currentUser?.email || 'usuario@ejemplo.com',
    role: currentUser?.role || 'Usuario',
    status: 'online', // online, away, busy, offline
    stats: {
      ticketsResolved: 127,
      avgResponseTime: '14m',
      customerSatisfaction: '4.9/5',
      availabilityToday: '92%'
    }
  };
  
  // Detectar el tamaño de la pantalla para responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Comprobar inicialmente
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Efecto para activar el brillo del header al estar en la parte superior
  useEffect(() => {
    const handleScroll = () => {
      setHeaderGlow(window.scrollY < 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Invocar inmediatamente para configurar estado inicial
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          event.target.className !== 'mobile-menu-toggle') {
        setShowMobileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          !event.target.closest('.header-search-toggle')) {
        setShowSearch(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Efecto para enfocar el input de búsqueda cuando se muestra
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [showSearch]);
  
  // Manejar cierre de sesión - con animación mejorada
  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
    
    // Aplicar clase a document.body para efectos globales
    document.body.classList.add('logging-out');
  };
  
  // Callback para cuando la animación de cierre de sesión termine
  const handleLogoutAnimationComplete = () => {
    // Ejecutar el logout del contexto de autenticación
    logout();
    // Navegar a la página de inicio de sesión
    navigate('/');
  };
  
  // Manejar navegación al home
  const handleHomeClick = () => {
    if (isLoggingOut) return; // No permitir navegación durante cierre de sesión
    
    // Extraer el rol base para la navegación
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    navigate(`/${baseRole}/homePage`);
  };
  
  // Renderizar icono según tipo de notificación
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket': return 'fa-ticket-alt';
      case 'response': return 'fa-reply';
      case 'system': return 'fa-server';
      case 'mention': return 'fa-at';
      case 'overdue': return 'fa-exclamation-circle';
      default: return 'fa-bell';
    }
  };
  
  // Renderizar color según tipo de notificación
  const getNotificationColor = (type) => {
    switch (type) {
      case 'ticket': return 'linear-gradient(135deg, #4CAF50, #8BC34A)';
      case 'response': return 'linear-gradient(135deg, #2196F3, #03A9F4)';
      case 'system': return 'linear-gradient(135deg, #FF9800, #FFB74D)';
      case 'mention': return 'linear-gradient(135deg, #9C27B0, #BA68C8)';
      case 'overdue': return 'linear-gradient(135deg, #F44336, #E57373)';
      default: return 'linear-gradient(135deg, #607D8B, #90A4AE)';
    }
  };

  // Renderizar color según prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#2196F3';
      case 'low': return '#4CAF50';
      case 'info': return '#607D8B';
      default: return '#9E9E9E';
    }
  };
  
  // Manejar nuevas notificaciones
  const handleMarkAllRead = () => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    // Simular marcado de todas las notificaciones como leídas
    console.log('Marked all notifications as read');
    // Aquí normalmente actualizarías el estado y/o enviarías una petición al backend
  };
  
  // Manejar toggle de búsqueda en móvil
  const toggleSearch = () => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    setShowSearch(!showSearch);
    if (!showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  };

  // Renderizar badge para opciones de menú
  const renderMenuBadge = (badge) => {
    if (!badge) return null;
    
    return (
      <div className={`nav-item-badge ${badge.type}`}>
        {badge.text || badge.count}
      </div>
    );
  };
  
  return (
    <>
      {/* Animación de cierre de sesión - Mostrar solo cuando se está cerrando sesión */}
      {isLoggingOut && (
        <LogoutAnimation 
          isMobile={isMobile} 
          onAnimationComplete={handleLogoutAnimationComplete} 
        />
      )}
      
      <header className={`support-header ${headerGlow ? 'glow-effect' : ''} ${isLoggingOut ? 'logging-out' : ''}`}>
        <div className="support-header-container">
          {/* Logo mejorado con efecto hover */}
          <div className="support-logo-container" onClick={handleHomeClick}>
            <div className="support-logo-glow"></div>
            <img src={logoImg} alt="TherapySync Logo" className="support-logo" />
            <div className="support-logo-text">
              <span className="logo-text-primary">Support</span>
              <span className="logo-text-secondary">Center</span>
            </div>
          </div>
          
          {/* Toggle para menú móvil con animación */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => !isLoggingOut && setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
            disabled={isLoggingOut}
          >
            <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          
          {/* Navegación principal con indicadores de actividad y tooltips */}
          <nav className={`support-navigation ${showMobileMenu ? 'mobile-active' : ''}`} ref={mobileMenuRef}>
            {menuOptions.map((option) => (
              <div 
                key={option.id}
                className={`support-nav-item ${activeSection === option.id ? 'active' : ''}`}
                onClick={() => {
                  if (isLoggingOut) return; // No permitir navegación durante cierre de sesión
                  onSectionChange(option.id);
                  setShowMobileMenu(false);
                }}
                data-tooltip={option.description}
              >
                <div className="nav-item-content">
                  <i className={`fas ${option.icon}`}></i>
                  <div className="nav-item-text">
                    <span className="nav-item-name">{option.name}</span>
                    <span className="nav-item-subtitle">{option.subtitle}</span>
                  </div>
                  {renderMenuBadge(option.badge)}
                </div>
                
                {activeSection === option.id && (
                  <div className="active-indicator"></div>
                )}
              </div>
            ))}
          </nav>
          
          {/* Búsqueda y herramientas mejoradas */}
          <div className="support-tools">
            {/* Búsqueda mejorada - versión escritorio con sugerencias */}
            <div 
              className={`support-search desktop-search ${searchFocus ? 'focus' : ''}`}
              ref={searchRef}
            >
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search tickets, articles, users..." 
                value={searchQuery}
                onChange={(e) => !isLoggingOut && setSearchQuery(e.target.value)}
                onFocus={() => !isLoggingOut && setSearchFocus(true)}
                onBlur={() => !isLoggingOut && setSearchFocus(false)}
                ref={searchInputRef}
                disabled={isLoggingOut}
              />
              {searchQuery && (
                <button 
                  className="search-clear" 
                  onClick={() => !isLoggingOut && setSearchQuery('')}
                  aria-label="Clear search"
                  disabled={isLoggingOut}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
              
              {/* Sugerencias de búsqueda - aparecen cuando hay focus y texto */}
              {searchFocus && searchQuery && !isLoggingOut && (
                <div className="search-suggestions">
                  <div className="suggestion-category">
                    <div className="category-title">Tickets</div>
                    <div className="suggestion-item">
                      <i className="fas fa-ticket-alt"></i>
                      <span>Search for "{searchQuery}" in tickets</span>
                    </div>
                    <div className="suggestion-item">
                      <i className="fas fa-tag"></i>
                      <span>Tickets with tag: {searchQuery}</span>
                    </div>
                  </div>
                  <div className="suggestion-category">
                    <div className="category-title">Knowledge Base</div>
                    <div className="suggestion-item">
                      <i className="fas fa-file-alt"></i>
                      <span>Articles containing "{searchQuery}"</span>
                    </div>
                  </div>
                  <div className="suggestion-category">
                    <div className="category-title">Users</div>
                    <div className="suggestion-item">
                      <i className="fas fa-user"></i>
                      <span>Team members: {searchQuery}</span>
                    </div>
                    <div className="suggestion-item">
                      <i className="fas fa-users"></i>
                      <span>Customers: {searchQuery}</span>
                    </div>
                  </div>
                  <div className="suggestion-footer">
                    <span>Press Enter for full search results</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Búsqueda - toggle móvil */}
            <button 
              className="header-search-toggle"
              onClick={toggleSearch}
              aria-label="Toggle search"
              disabled={isLoggingOut}
            >
              <i className="fas fa-search"></i>
            </button>
            
            {/* Búsqueda - versión móvil expandible */}
            {showSearch && !isLoggingOut && (
              <div className="mobile-search-overlay">
                <div className="mobile-search-container">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search tickets, articles, users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    ref={searchInputRef}
                    disabled={isLoggingOut}
                  />
                  <button 
                    className="mobile-search-close" 
                    onClick={() => setShowSearch(false)}
                    aria-label="Close search"
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                {/* Sugerencias de búsqueda móvil */}
                {searchQuery && (
                  <div className="mobile-search-suggestions">
                    <div className="suggestions-title">Quick Suggestions</div>
                    <div className="suggestion-item">
                      <i className="fas fa-ticket-alt"></i>
                      <span>Search tickets: {searchQuery}</span>
                    </div>
                    <div className="suggestion-item">
                      <i className="fas fa-file-alt"></i>
                      <span>Search articles: {searchQuery}</span>
                    </div>
                    <div className="suggestion-item">
                      <i className="fas fa-users"></i>
                      <span>Search users: {searchQuery}</span>
                    </div>
                    <div className="suggestion-item">
                      <i className="fas fa-tags"></i>
                      <span>Search tags: {searchQuery}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Botón de ayuda con tooltip */}
            <button 
              className="support-help-button" 
              aria-label="Get help"
              data-tooltip="Access help resources and guides"
              disabled={isLoggingOut}
            >
              <i className="fas fa-question-circle"></i>
            </button>
            
            {/* Notificaciones mejoradas con categorías y filtros */}
            <div className="support-notifications" ref={notificationsRef}>
              <button 
                className={`notifications-button ${showNotifications ? 'active' : ''}`}
                onClick={() => !isLoggingOut && setShowNotifications(!showNotifications)}
                aria-label={`Notifications - ${notificationCount} unread`}
                data-tooltip={`${notificationCount} unread notifications`}
                disabled={isLoggingOut}
              >
                <i className="fas fa-bell"></i>
                {notificationCount > 0 && (
                  <span className="notifications-badge">{notificationCount}</span>
                )}
              </button>
              
              {/* Panel de notificaciones mejorado con filtros y categorías */}
              {showNotifications && !isLoggingOut && (
                <div className="notifications-panel">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button 
                      className="mark-all-read"
                      onClick={handleMarkAllRead}
                      disabled={isLoggingOut}
                    >
                      <i className="fas fa-check-double"></i>
                      <span>Mark all as read</span>
                    </button>
                  </div>
                  
                  {/* Filtros de notificaciones */}
                  <div className="notifications-filters">
                    <button className="filter-btn active" disabled={isLoggingOut}>
                      <span>All</span>
                      <div className="filter-count">{notifications.length}</div>
                    </button>
                    <button className="filter-btn" disabled={isLoggingOut}>
                      <span>Unread</span>
                      <div className="filter-count">{notifications.filter(n => !n.read).length}</div>
                    </button>
                    <button className="filter-btn" disabled={isLoggingOut}>
                      <span>Tickets</span>
                      <div className="filter-count">{notifications.filter(n => n.type === 'ticket' || n.type === 'response' || n.type === 'overdue').length}</div>
                    </button>
                    <button className="filter-btn" disabled={isLoggingOut}>
                      <span>System</span>
                      <div className="filter-count">{notifications.filter(n => n.type === 'system').length}</div>
                    </button>
                  </div>
                  
                  <div className="notifications-list">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <div 
                          className="notification-icon" 
                          style={{ background: getNotificationColor(notification.type) }}
                        >
                          <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
                        </div>
                        
                        <div className="notification-content">
                          <div className="notification-header">
                            <div className="notification-title">{notification.title}</div>
                            {notification.priority && (
                              <div 
                                className={`notification-priority ${notification.priority}`}
                                style={{ backgroundColor: getPriorityColor(notification.priority) }}
                              >
                                {notification.priority.toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          {notification.description && (
                            <div className="notification-description">{notification.description}</div>
                          )}
                          
                          <div className="notification-meta">
                            <span className="notification-time">{notification.time}</span>
                            {notification.user && (
                              <span className="notification-user">
                                <span className="user-avatar">{notification.user.avatar}</span>
                                <span className="user-name">{notification.user.name}</span>
                              </span>
                            )}
                            {notification.ticketId && (
                              <span className="notification-ticketid">{notification.ticketId}</span>
                            )}
                          </div>
                          
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="notification-action-buttons">
                              {notification.actions.map((action, index) => (
                                <button 
                                  key={index}
                                  className="action-button"
                                  onClick={() => console.log(`Action ${action.name} clicked for notification ${notification.id}`)}
                                  disabled={isLoggingOut}
                                >
                                  <i className={`fas ${action.icon}`}></i>
                                  <span>{action.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="notification-actions">
                          <button 
                            className="notification-action-btn mark-read" 
                            aria-label="Mark as read"
                            disabled={isLoggingOut}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button 
                            className="notification-action-btn options" 
                            aria-label="More options"
                            disabled={isLoggingOut}
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="notifications-footer">
                    <button className="view-all" disabled={isLoggingOut}>View all notifications</button>
                    <div className="notifications-settings">
                      <i className="fas fa-cog"></i>
                      <span>Notification Settings</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Perfil de usuario mejorado con estadísticas */}
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
              
              {/* Menú desplegable del usuario mejorado con estadísticas */}
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
                    
                    {/* Stats cards */}
                    <div className="support-user-stats">
                      <div className="stat-card">
                        <div className="stat-value">{userData.stats.ticketsResolved}</div>
                        <div className="stat-label">Tickets Resolved</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{userData.stats.avgResponseTime}</div>
                        <div className="stat-label">Avg. Response</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{userData.stats.customerSatisfaction}</div>
                        <div className="stat-label">Satisfaction</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{userData.stats.availabilityToday}</div>
                        <div className="stat-label">Availability</div>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                  </div>
                  
                  <div className="support-menu-section">
                    <div className="section-title">Account</div>
                    <div className="support-menu-items">
                      <div className="support-menu-item">
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
                      <div className="support-menu-item">
                        <i className="fas fa-chart-line"></i>
                        <span>My Performance</span>
                        <div className="menu-item-badge">
                          <i className="fas fa-arrow-up"></i>
                          <span>12%</span>
                        </div>
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
                      <div className="support-menu-item toggle-item">
                        <div className="toggle-item-content">
                          <i className="fas fa-desktop"></i>
                          <span>Desktop Notifications</span>
                        </div>
                        <div className="toggle-switch">
                          <div className="toggle-handle active"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="support-menu-section">
                    <div className="section-title">Support</div>
                    <div className="support-menu-items">
                      <div className="support-menu-item help">
                        <i className="fas fa-question-circle"></i>
                        <span>Help Center</span>
                      </div>
                      <div className="support-menu-item">
                        <i className="fas fa-book"></i>
                        <span>Documentation</span>
                        <div className="menu-item-badge new">
                          <span>NEW</span>
                        </div>
                      </div>
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
        </div>
        
        {/* Búsqueda móvil expandida - aparece cuando showSearch es true */}
        {showSearch && !isLoggingOut && (
          <div className="mobile-search-container">
            <div className="mobile-search-form">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search tickets, articles, users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
                disabled={isLoggingOut}
              />
              <button 
                className="mobile-search-close" 
                onClick={() => setShowSearch(false)}
                disabled={isLoggingOut}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {searchQuery && (
              <div className="mobile-search-suggestions">
                <div className="suggestions-title">Quick Suggestions</div>
                <div className="suggestion-item">
                  <i className="fas fa-ticket-alt"></i>
                  <span>Open tickets</span>
                </div>
                <div className="suggestion-item">
                  <i className="fas fa-file-alt"></i>
                  <span>Recent documents</span>
                </div>
                <div className="suggestion-item">
                  <i className="fas fa-users"></i>
                  <span>My team</span>
                </div>
                <div className="suggestion-item">
                  <i className="fas fa-star"></i>
                  <span>Favorites</span>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default DevSupportHeader;