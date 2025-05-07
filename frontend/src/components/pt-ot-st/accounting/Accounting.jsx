import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/login/AuthContext'; // Importar el contexto de autenticación
import '../../../styles/developer/accounting/Accounting.scss';
import logoImg from '../../../assets/LogoMHC.jpeg';
import { motion, AnimatePresence } from 'framer-motion';
import AccountingDashboard from './AccountingDashboard.jsx';
import PaymentPeriodSelector from './PaymentPeriodSelector.jsx';
import TherapistFinancialList from './TherapistFinancialList.jsx';
import TherapistPaymentModal from './TherapistPaymentModal.jsx';
import LogoutAnimation from '../../../components/LogOut/LogOut'; // Importar componente de animación

// Componente para las partículas animadas de fondo
const ParticlesBackground = () => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const generateParticles = () => {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      
      const particlesCount = Math.floor((containerWidth * containerHeight) / 15000);
      const newParticles = [];
      
      for (let i = 0; i < particlesCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * containerWidth,
          y: Math.random() * containerHeight,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: Math.random() > 0.7 
            ? 'rgba(0, 229, 255, 0.6)' 
            : Math.random() > 0.5 
              ? 'rgba(41, 121, 255, 0.6)' 
              : 'rgba(255, 255, 255, 0.6)'
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
    
    const handleResize = () => {
      generateParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animación de las partículas
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;
          
          // Rebotar en los bordes
          if (newX <= 0 || newX >= containerRef.current.offsetWidth) {
            particle.speedX *= -1;
            newX = particle.x + particle.speedX;
          }
          
          if (newY <= 0 || newY >= containerRef.current.offsetHeight) {
            particle.speedY *= -1;
            newY = particle.y + particle.speedY;
          }
          
          return {
            ...particle,
            x: newX,
            y: newY
          };
        })
      );
      
      requestAnimationFrame(animateParticles);
    };
    
    const animationId = requestAnimationFrame(animateParticles);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div ref={containerRef} className="particles-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
            backgroundColor: particle.color
          }}
        />
      ))}
    </div>
  );
};

const TPAccounting = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Usar el contexto de autenticación
  
  // Estados para gestionar la interfaz y los datos
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuTransitioning, setMenuTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [notificationCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  
  // Ref para el menú de usuario
  const userMenuRef = useRef(null);
  
  // Períodos de pago con datos más actualizados
  const paymentPeriods = [
    { id: 1, period: "Jan 1 to 15, 2025", paymentDate: "Feb 15, 2025", status: "paid", amount: 42580.50 },
    { id: 2, period: "Jan 16 to 31, 2025", paymentDate: "Feb 28, 2025", status: "paid", amount: 39750.25 },
    { id: 3, period: "Feb 1 to 15, 2025", paymentDate: "Mar 15, 2025", status: "paid", amount: 44850.75 },
    { id: 4, period: "Feb 16 to 28, 2025", paymentDate: "Mar 31, 2025", status: "paid", amount: 42980.50 },
    { id: 5, period: "Mar 1 to 15, 2025", paymentDate: "Apr 15, 2025", status: "pending", amount: 45670.25 },
    { id: 6, period: "Mar 16 to 31, 2025", paymentDate: "Apr 30, 2025", status: "upcoming", amount: 43850.00 },
    { id: 7, period: "Apr 1 to 15, 2025", paymentDate: "May 15, 2025", status: "upcoming", amount: 46200.00 },
    { id: 8, period: "Apr 16 to 30, 2025", paymentDate: "May 31, 2025", status: "upcoming", amount: 44500.00 },
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

  // Efecto para cargar datos iniciales con animación mejorada
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simular carga de datos con progreso realista
      setTimeout(() => {
        // Set dashboard statistics with enhanced data
        setDashboardStats({
          totalBilled: 127850.75,
          pendingPayments: 42500.25,
          completedPayments: 85350.50,
          averagePerVisit: 65.00,
          visitsByDiscipline: {
            PT: 650,
            OT: 420,
            ST: 310,
            PTA: 280,
            COTA: 175,
            STA: 120
          },
          revenueByMonth: [
            { month: 'Jan', revenue: 38420.50, previousRevenue: 34210.25, growth: 12.3 },
            { month: 'Feb', revenue: 42850.75, previousRevenue: 36580.50, growth: 17.1 },
            { month: 'Mar', revenue: 46580.25, previousRevenue: 40120.75, growth: 16.1 },
            { month: 'Apr', projected: true, revenue: 45200.00, previousRevenue: 41850.25, growth: 8.0 }
          ],
          topPerformers: [
            { id: 1, name: 'Regina Araquel', role: 'PT', revenue: 4050.75, growth: 15.2 },
            { id: 3, name: 'Justin Shimane', role: 'OT', revenue: 3780.00, growth: 12.8 },
            { id: 5, name: 'Elena Martinez', role: 'ST', revenue: 3600.00, growth: 10.5 }
          ],
          visitTrends: {
            weeklyGrowth: 8.5,
            monthlyGrowth: 12.3,
            averageDuration: 45,
            peakHours: '10:00 AM - 2:00 PM'
          }
        });
        
        // Set therapists with enhanced mock data
        setTherapists([
          {
            id: 1,
            name: "Regina Araquel",
            role: "PT",
            visits: 45,
            earnings: 4050.75,
            status: "verified",
            pendingVisits: 3,
            completionRate: 97,
            growth: 15.2,
            avatar: null,
            patients: [
              { id: 101, name: "Soheila Adhami", visits: 8, revenue: 680.00, lastVisit: "2025-03-14", visitTrend: "increasing" },
              { id: 102, name: "James Smith", visits: 12, revenue: 1020.00, lastVisit: "2025-03-15", visitTrend: "stable" },
              { id: 103, name: "Maria Rodriguez", visits: 10, revenue: 850.00, lastVisit: "2025-03-12", visitTrend: "stable" },
              { id: 112, name: "Anna Johnson", visits: 7, revenue: 595.00, lastVisit: "2025-03-10", visitTrend: "decreasing" },
              { id: 118, name: "Luis Chen", visits: 8, revenue: 680.00, lastVisit: "2025-03-13", visitTrend: "increasing" }
            ],
            visitDetails: [
              { id: 1001, patientId: 101, patientName: "Soheila Adhami", date: "2025-03-14", time: "09:30 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 1002, patientId: 102, patientName: "James Smith", date: "2025-03-15", time: "11:00 AM", type: "Standard", duration: 60, status: "completed", amount: 85.00 },
              { id: 1003, patientId: 103, patientName: "Maria Rodriguez", date: "2025-03-12", time: "02:30 PM", type: "Follow-up", duration: 30, status: "completed", amount: 85.00 },
              { id: 1004, patientId: 101, patientName: "Soheila Adhami", date: "2025-03-11", time: "10:15 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 1005, patientId: 102, patientName: "James Smith", date: "2025-03-10", time: "03:45 PM", type: "Initial Eval", duration: 60, status: "completed", amount: 85.00 },
              { id: 1006, patientId: 112, patientName: "Anna Johnson", date: "2025-03-10", time: "01:15 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 1007, patientId: 118, patientName: "Luis Chen", date: "2025-03-13", time: "11:30 AM", type: "Standard", duration: 45, status: "pending", amount: 85.00 }
            ]
          },
          {
            id: 2,
            name: "Jacob Staffey",
            role: "PTA",
            visits: 38,
            earnings: 3230.00,
            status: "pending",
            pendingVisits: 5,
            completionRate: 92,
            growth: -2.1,
            avatar: null,
            patients: [
              { id: 104, name: "Linda Johnson", visits: 10, revenue: 850.00, lastVisit: "2025-03-10", visitTrend: "stable" },
              { id: 105, name: "Robert Garcia", visits: 9, revenue: 765.00, lastVisit: "2025-03-13", visitTrend: "decreasing" },
              { id: 115, name: "Olivia Wilson", visits: 9, revenue: 765.00, lastVisit: "2025-03-11", visitTrend: "stable" },
              { id: 119, name: "David Martinez", visits: 10, revenue: 850.00, lastVisit: "2025-03-14", visitTrend: "increasing" }
            ],
            visitDetails: [
              { id: 2001, patientId: 104, patientName: "Linda Johnson", date: "2025-03-10", time: "10:00 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 2002, patientId: 105, patientName: "Robert Garcia", date: "2025-03-13", time: "01:30 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 2003, patientId: 115, patientName: "Olivia Wilson", date: "2025-03-11", time: "03:00 PM", type: "Follow-up", duration: 30, status: "completed", amount: 85.00 },
              { id: 2004, patientId: 119, patientName: "David Martinez", date: "2025-03-14", time: "09:45 AM", type: "Initial Eval", duration: 60, status: "pending", amount: 85.00 },
              { id: 2005, patientId: 104, patientName: "Linda Johnson", date: "2025-03-07", time: "11:15 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 }
            ]
          },
          {
            id: 3,
            name: "Justin Shimane",
            role: "OT",
            visits: 42,
            earnings: 3780.00,
            status: "verified",
            pendingVisits: 0,
            completionRate: 100,
            growth: 12.8,
            avatar: null,
            patients: [
              { id: 106, name: "Susan Wilson", visits: 7, revenue: 595.00, lastVisit: "2025-03-14", visitTrend: "increasing" },
              { id: 107, name: "Michael Brown", visits: 8, revenue: 680.00, lastVisit: "2025-03-15", visitTrend: "stable" },
              { id: 113, name: "Patricia Lee", visits: 10, revenue: 850.00, lastVisit: "2025-03-11", visitTrend: "increasing" },
              { id: 116, name: "Christopher Adams", visits: 9, revenue: 765.00, lastVisit: "2025-03-13", visitTrend: "stable" },
              { id: 120, name: "Emily Turner", visits: 8, revenue: 680.00, lastVisit: "2025-03-15", visitTrend: "increasing" }
            ],
            visitDetails: [
              { id: 3001, patientId: 106, patientName: "Susan Wilson", date: "2025-03-14", time: "10:30 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 3002, patientId: 107, patientName: "Michael Brown", date: "2025-03-15", time: "01:00 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 3003, patientId: 113, patientName: "Patricia Lee", date: "2025-03-11", time: "11:30 AM", type: "Follow-up", duration: 30, status: "completed", amount: 85.00 },
              { id: 3004, patientId: 116, patientName: "Christopher Adams", date: "2025-03-13", time: "02:15 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 3005, patientId: 120, patientName: "Emily Turner", date: "2025-03-15", time: "03:30 PM", type: "Initial Eval", duration: 60, status: "completed", amount: 85.00 }
            ]
          },
          {
            id: 4,
            name: "April Kim",
            role: "COTA",
            visits: 35,
            earnings: 2975.00,
            status: "pending",
            pendingVisits: 2,
            completionRate: 95,
            growth: 8.7,
            avatar: null,
            patients: [
              { id: 108, name: "David Anderson", visits: 6, revenue: 510.00, lastVisit: "2025-03-11", visitTrend: "stable" },
              { id: 109, name: "Jennifer Lopez", visits: 7, revenue: 595.00, lastVisit: "2025-03-13", visitTrend: "increasing" },
              { id: 114, name: "Daniel Wright", visits: 9, revenue: 765.00, lastVisit: "2025-03-12", visitTrend: "stable" },
              { id: 117, name: "Michelle Taylor", visits: 8, revenue: 680.00, lastVisit: "2025-03-15", visitTrend: "decreasing" }
            ],
            visitDetails: [
              { id: 4001, patientId: 108, patientName: "David Anderson", date: "2025-03-11", time: "09:00 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 4002, patientId: 109, patientName: "Jennifer Lopez", date: "2025-03-13", time: "10:45 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 4003, patientId: 114, patientName: "Daniel Wright", date: "2025-03-12", time: "01:45 PM", type: "Follow-up", duration: 30, status: "pending", amount: 85.00 },
              { id: 4004, patientId: 117, patientName: "Michelle Taylor", date: "2025-03-15", time: "03:00 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 }
            ]
          },
          {
            id: 5,
            name: "Elena Martinez",
            role: "ST",
            visits: 40,
            earnings: 3600.00,
            status: "verified",
            pendingVisits: 1,
            completionRate: 98,
            growth: 10.5,
            avatar: null,
            patients: [
              { id: 110, name: "Thomas White", visits: 9, revenue: 765.00, lastVisit: "2025-03-12", visitTrend: "stable" },
              { id: 111, name: "Jessica Taylor", visits: 8, revenue: 680.00, lastVisit: "2025-03-15", visitTrend: "increasing" },
              { id: 121, name: "Kevin Harris", visits: 10, revenue: 850.00, lastVisit: "2025-03-14", visitTrend: "increasing" },
              { id: 122, name: "Rachel Thompson", visits: 7, revenue: 595.00, lastVisit: "2025-03-11", visitTrend: "stable" },
              { id: 123, name: "Steven Clark", visits: 6, revenue: 510.00, lastVisit: "2025-03-13", visitTrend: "decreasing" }
            ],
            visitDetails: [
              { id: 5001, patientId: 110, patientName: "Thomas White", date: "2025-03-12", time: "11:00 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 5002, patientId: 111, patientName: "Jessica Taylor", date: "2025-03-15", time: "02:00 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 5003, patientId: 121, patientName: "Kevin Harris", date: "2025-03-14", time: "10:15 AM", type: "Follow-up", duration: 30, status: "completed", amount: 85.00 },
              { id: 5004, patientId: 122, patientName: "Rachel Thompson", date: "2025-03-11", time: "01:30 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
              { id: 5005, patientId: 123, patientName: "Steven Clark", date: "2025-03-13", time: "03:15 PM", type: "Initial Eval", duration: 60, status: "pending", amount: 85.00 }
            ]
          }
        ]);
        
        // Set default selected period
        setSelectedPeriod(paymentPeriods[4]); // March 1-15 as default
        
        setIsLoading(false);
        
        // Trigger entrance animations after loading
        setTimeout(() => {
          setAnimateIn(true);
        }, 100);
      }, 1600);
    };
    
    loadData();
    
    // Cleanup
    return () => {
      setAnimateIn(false);
    };
  }, []);

  // Efecto para cerrar menú de usuario al hacer clic fuera
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

  // Manejar cambio de período seleccionado
  const handlePeriodChange = (period) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    setSelectedPeriod(period);
  };
  
  // Manejar logout con efectos mejorados
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
  
  // Manejar clic en terapeuta para mostrar modal
  const handleTherapistClick = (therapist) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    setSelectedTherapist(therapist);
    setShowTherapistModal(true);
  };
  
  // Manejar navegación al menú principal con transición mejorada
  const handleMainMenuTransition = () => {
    if (isLoggingOut) return; // No permitir navegación durante cierre de sesión
    
    setMenuTransitioning(true);
    
    // Extraer el rol base para la navegación
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    setTimeout(() => {
      navigate(`/${baseRole}/homePage`);
    }, 400);
  };
  
  // Manejar redirección a página de paciente
  const handlePatientClick = (patientId) => {
    if (isLoggingOut) return; // No permitir navegación durante cierre de sesión
    
    // Extraer el rol base para la navegación
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    navigate(`/${baseRole}/paciente/${patientId}`);
  };

  return (
    <motion.div 
      className={`accounting-container ${animateIn ? 'animate-in' : ''} ${menuTransitioning ? 'transitioning' : ''} ${isLoggingOut ? 'logging-out' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animación de cierre de sesión - Mostrar solo cuando se está cerrando sesión */}
      {isLoggingOut && (
        <LogoutAnimation 
          isMobile={isMobile} 
          onAnimationComplete={handleLogoutAnimationComplete} 
        />
      )}
      
      {/* Fondo mejorado con parallax y partículas */}
      <div className="parallax-background">
        <div className="gradient-overlay"></div>
        <ParticlesBackground />
      </div>
      
      {/* Header con logo y perfil */}
      <header className={`main-header ${isLoggingOut ? 'logging-out' : ''}`}>
        <div className="header-container">
          <div className="logo-container">
            <div className="logo-wrapper">
              <img src={logoImg} alt="TherapySync Logo" className="logo" />
              <div className="logo-glow"></div>
            </div>
            
            {/* Navegación de menú con efectos mejorados */}
            <div className="menu-navigation">
              <motion.button 
                className="nav-button main-menu" 
                onClick={handleMainMenuTransition}
                title="Back to main menu"
                whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
                whileTap={{ y: 0, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                disabled={isLoggingOut}
              >
                <i className="fas fa-th-large"></i>
                <span>Main Menu</span>
                <div className="button-effect"></div>
              </motion.button>
              
              <motion.button 
                className="nav-button accounting-menu active" 
                title="Financial Management"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoggingOut}
              >
                <i className="fas fa-chart-pie"></i>
                <span>Accounting</span>
                <div className="button-effect"></div>
              </motion.button>
            </div>
          </div>
          
          {/* Perfil de usuario mejorado */}
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
      
      {/* Contenido principal con efectos mejorados */}
      <main className={`accounting-content ${isLoggingOut ? 'fade-out' : ''}`}>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              <div className="loading-spinner-inner"></div>
            </div>
            <div className="loading-progress">
            <div className="loading-progress-text">Loading financial data...</div>
              <div className="loading-progress-bar">
                <div className="loading-progress-fill"></div>
              </div>
            </div>
            <div className="loading-steps">
              <div className="loading-step active">
                <i className="fas fa-database"></i>
                <span>Fetching data</span>
              </div>
              <div className="loading-step">
                <i className="fas fa-chart-line"></i>
                <span>Processing metrics</span>
              </div>
              <div className="loading-step">
                <i className="fas fa-check-circle"></i>
                <span>Rendering interface</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="accounting-header">
              <div className="title-section">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <i className="fas fa-chart-line"></i>
                  Financial Management
                  <div className="title-highlight"></div>
                </motion.h1>
                <motion.p 
                  className="subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Track earnings, manage payments, and view financial metrics across your practice
                </motion.p>
              </div>
              
              <div className="global-filters">
                <div className="date-range-selector">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Current Period: {selectedPeriod?.period}</span>
                </div>
                <div className="actions-toolbar">
                  <button 
                    className="toolbar-button" 
                    title="Refresh Data"
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-sync-alt"></i>
                  </button>
                  <button 
                    className="toolbar-button" 
                    title="Export Reports"
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-file-export"></i>
                  </button>
                  <button 
                    className="toolbar-button" 
                    title="Print"
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-print"></i>
                  </button>
                  <button 
                    className="toolbar-button" 
                    title="Settings"
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-cog"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="accounting-body">
              {/* Dashboard de métricas mejorado */}
              <AccountingDashboard 
                stats={dashboardStats} 
                selectedPeriod={selectedPeriod}
              />
              
              {/* Selector de períodos de pago mejorado */}
              <motion.div 
                className="period-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2>
                  <i className="fas fa-calendar-check"></i>
                  Payment Periods
                </h2>
                <PaymentPeriodSelector 
                  periods={paymentPeriods}
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={handlePeriodChange}
                  isDisabled={isLoggingOut}
                />
              </motion.div>
              
              {/* Lista de terapeutas con datos financieros mejorada */}
              <motion.div 
                className="therapists-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2>
                  <i className="fas fa-user-md"></i>
                  Therapist Earnings
                </h2>
                <TherapistFinancialList 
                  therapists={therapists}
                  onTherapistClick={handleTherapistClick}
                  selectedPeriod={selectedPeriod}
                  isDisabled={isLoggingOut}
                />
              </motion.div>
              
              {/* Estadísticas de crecimiento - Nueva sección */}
              <motion.div 
                className="growth-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2>
                  <i className="fas fa-rocket"></i>
                  Growth Analytics
                </h2>
                <div className="growth-metrics">
                  <div className="growth-card weekly">
                    <div className="growth-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="growth-content">
                      <div className="growth-title">Weekly Growth</div>
                      <div className="growth-value">
                        +{dashboardStats.visitTrends?.weeklyGrowth}%
                        <span className="growth-trend up">
                          <i className="fas fa-arrow-up"></i>
                        </span>
                      </div>
                      <div className="growth-description">
                        Based on visits compared to last week
                      </div>
                    </div>
                  </div>
                  
                  <div className="growth-card monthly">
                    <div className="growth-icon">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div className="growth-content">
                      <div className="growth-title">Monthly Growth</div>
                      <div className="growth-value">
                        +{dashboardStats.visitTrends?.monthlyGrowth}%
                        <span className="growth-trend up">
                          <i className="fas fa-arrow-up"></i>
                        </span>
                      </div>
                      <div className="growth-description">
                        Based on visits compared to last month
                      </div>
                    </div>
                  </div>
                  
                  <div className="growth-card duration">
                    <div className="growth-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="growth-content">
                      <div className="growth-title">Avg. Session Duration</div>
                      <div className="growth-value">
                        {dashboardStats.visitTrends?.averageDuration} min
                      </div>
                      <div className="growth-description">
                        Average treatment session length
                      </div>
                    </div>
                  </div>
                  
                  <div className="growth-card peak">
                    <div className="growth-icon">
                      <i className="fas fa-business-time"></i>
                    </div>
                    <div className="growth-content">
                      <div className="growth-title">Peak Hours</div>
                      <div className="growth-value">
                        {dashboardStats.visitTrends?.peakHours}
                      </div>
                      <div className="growth-description">
                        Highest patient traffic during the day
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Top Performers - Nueva sección */}
              <motion.div 
                className="top-performers-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2>
                  <i className="fas fa-award"></i>
                  Top Performers
                </h2>
                <div className="performers-cards">
                  {dashboardStats.topPerformers?.map((performer, index) => (
                    <div 
                      key={performer.id} 
                      className="performer-card"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <div className="performer-rank">{index + 1}</div>
                      <div className="performer-avatar">
                        <div className="avatar-placeholder">
                          {performer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="performer-info">
                        <div className="performer-name">{performer.name}</div>
                        <div className="performer-role">{performer.role}</div>
                      </div>
                      <div className="performer-metrics">
                        <div className="performer-revenue">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2
                          }).format(performer.revenue)}
                        </div>
                        <div className="performer-growth">
                          <i className="fas fa-arrow-up"></i>
                          {performer.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
      
      {/* Modal de detalles del terapeuta mejorado */}
      <AnimatePresence>
        {showTherapistModal && selectedTherapist && !isLoggingOut && (
          <TherapistPaymentModal 
            therapist={selectedTherapist}
            period={selectedPeriod}
            onClose={() => setShowTherapistModal(false)}
            onPatientClick={handlePatientClick}
          />
        )}
      </AnimatePresence>
      
      {/* Añadir un botón de acción flotante para acciones rápidas */}
      {!isLoggingOut && (
        <div className="floating-action-button">
          <button className="fab-main" disabled={isLoggingOut}>
            <i className="fas fa-plus"></i>
          </button>
          <div className="fab-buttons">
            <button className="fab-button" title="New Report" disabled={isLoggingOut}>
              <i className="fas fa-file-alt"></i>
            </button>
            <button className="fab-button" title="Add Payment" disabled={isLoggingOut}>
              <i className="fas fa-money-bill-wave"></i>
            </button>
            <button className="fab-button" title="Export Data" disabled={isLoggingOut}>
              <i className="fas fa-file-export"></i>
            </button>
          </div>
        </div>
      )}
      
      {/* Snackbar para notificaciones - Nuevo componente */}
      <div className="notification-snackbar">
        <i className="fas fa-info-circle"></i>
        <span>Financial data updated successfully</span>
        <button className="snackbar-close" disabled={isLoggingOut}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </motion.div>
  );
};

export default TPAccounting;