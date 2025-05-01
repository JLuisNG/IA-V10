import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/login/AuthContext'; // Importar el contexto de autenticación
import logoImg from '../../../assets/LogoMHC.jpeg';
import '../../../styles/developer/Patients/PatientsPage.scss';
import AIAssistant from '../welcome/AIAssistant';
import LogoutAnimation from '../../../components/LogOut/LogOut'; // Importa el componente de animación de cierre de sesión

// Componente de Tabs Premium con animaciones mejoradas
const PremiumTabs = ({ activeTab, onChangeTab }) => {
  return (
    <div className="premium-tabs">
      <div 
        className={`tab-button ${activeTab === 'Patients' ? 'active' : ''}`}
        onClick={() => onChangeTab('Patients')}
      >
        <div className="tab-icon"><i className="fas fa-user-injured"></i></div>
        <span>Patients</span>
        {activeTab === 'Patients' && <div className="active-indicator"></div>}
        <div className="tab-hover-effect"></div>
      </div>
      <div 
        className={`tab-button ${activeTab === 'Staffing' ? 'active' : ''}`}
        onClick={() => onChangeTab('Staffing')}
      >
        <div className="tab-icon"><i className="fas fa-user-md"></i></div>
        <span>Staffing</span>
        {activeTab === 'Staffing' && <div className="active-indicator"></div>}
        <div className="tab-hover-effect"></div>
      </div>
    </div>
  );
};

// Componente de tarjeta de paciente animada
const PatientCard = ({ patient, onView, onEdit, onNotes }) => {
  const getStatusClass = (status) => {
    switch(status) {
      case 'Active': return 'status-active';
      case 'Pending': return 'status-pending';
      case 'Review': return 'status-review';
      case 'Expired': return 'status-expired';
      default: return '';
    }
  };
  
  return (
    <div className={`patient-card ${getStatusClass(patient.status)}`}>
      <div className="status-indicator">
        <span>{patient.status}</span>
      </div>
      <div className="patient-card-header">
        <div className="patient-info">
          <h3>{patient.name}</h3>
          <span className={`status-badge ${patient.status.toLowerCase()}`}>
            {patient.status}
          </span>
        </div>
        <div className="patient-id">#{patient.id}</div>
      </div>
      
      <div className="patient-card-body">
        <div className="info-row">
          <i className="fas fa-user-md"></i>
          <span className="therapist-badge">{patient.therapistType}</span>
          <span>{patient.therapist}</span>
        </div>
        <div className="info-row">
          <i className="fas fa-phone"></i>
          <span>{patient.phone}</span>
        </div>
        <div className="info-row">
          <i className="fas fa-map-marker-alt"></i>
          <span>{`${patient.city}, ${patient.state} ${patient.zip}`}</span>
        </div>
        <div className="info-row">
          <i className="fas fa-calendar-alt"></i>
          <span>{patient.certPeriod}</span>
        </div>
      </div>
      
      <div className="patient-card-footer">
        <button className="card-btn view" title="View Details" onClick={() => onView(patient)}>
          <i className="fas fa-eye"></i> View
          <span className="btn-highlight"></span>
        </button>
        <button className="card-btn edit" title="Edit Patient" onClick={() => onEdit(patient)}>
          <i className="fas fa-edit"></i> Edit
          <span className="btn-highlight"></span>
        </button>
        <button className="card-btn notes" title="Patient Notes" onClick={() => onNotes(patient)}>
          <i className="fas fa-clipboard"></i> Notes
          <span className="btn-highlight"></span>
        </button>
      </div>
    </div>
  );
};

// Componente de tarjeta de estadísticas con animación
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-info">
        <h3 className="stat-value">{value}</h3>
        <p>{title}</p>
      </div>
      <div className="stat-bg-icon">
        <i className={`fas ${icon}`}></i>
      </div>
    </div>
  );
};

const AdminPatientsPage = () => {
  const navigate = useNavigate();
  // Usar el contexto de autenticación para obtener el usuario actual
  const { currentUser, logout } = useAuth();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeMenuOption, setActiveMenuOption] = useState('Patients');
  const [menuTransitioning, setMenuTransitioning] = useState(false);
  const [showMenuSwitch, setShowMenuSwitch] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list' o 'grid'
  const [showFilters, setShowFilters] = useState(true);
  const [sortOption, setSortOption] = useState('nameAsc');
  const [showQuickTour, setShowQuickTour] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [isMobile, setIsMobile] = useState(false); // Para responsive en LogoutAnimation
  const notificationCount = 0; // Define notificationCount with a default value
  
  // Función para obtener iniciales del nombre
  function getInitials(name) {
    if (!name) return "U";
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  // Datos de usuario del contexto de autenticación
  const userData = {
    name: currentUser?.fullname || currentUser?.username || 'Usuario',
    avatar: getInitials(currentUser?.fullname || currentUser?.username || 'Usuario'),
    email: currentUser?.email || 'usuario@ejemplo.com',
    role: currentUser?.role || 'Usuario',
    status: 'online', // online, away, busy, offline
    stats: {},
    quickActions: []
  };
  
  // Opciones de ordenamiento
  const sortOptions = [
    { id: 'nameAsc', text: 'Sort by Name (A-Z)', icon: 'fa-sort-alpha-down' },
    { id: 'nameDesc', text: 'Sort by Name (Z-A)', icon: 'fa-sort-alpha-up' },
    { id: 'statusActive', text: 'Active Certification', icon: 'fa-calendar-check' },
    { id: 'statusExpired', text: 'Expired Certification', icon: 'fa-calendar-times' }
  ];
  
  // Estados de búsqueda
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [agencySearchTerm, setAgencySearchTerm] = useState('');
  const [selectedTherapistType, setSelectedTherapistType] = useState('all');
  const [selectedTherapist, setSelectedTherapist] = useState('all');
  const [selectedAgency, setSelectedAgency] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Referencias
  const userMenuRef = useRef(null);
  const menuRef = useRef(null);
  const filterMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Opciones de menú
  const menuOptions = ["Patients", "Therapist"];
  
  // Opciones de tipo de terapeuta
  const therapistTypes = ['all', 'PT', 'PTA', 'OT', 'COTA', 'ST', 'STA'];
  
  // Estados de paciente
  const statusOptions = ['all', 'Active', 'Pending', 'Review', 'Expired'];
  
  // Datos de muestra de pacientes con información de terapeuta
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Adhami, Soheila",
      therapist: "John Smith",
      therapistType: "PT",
      agency: "Supportive Health Group",
      street: "1800 Camden Avenue",
      city: "Los Angeles",
      state: "CA",
      zip: "90025",
      phone: "(310) 808-5631",
      certPeriod: "04-19-2023 to 04-19-2025",
      status: "Active"
    },
    {
      id: 2,
      name: "Adkin, Wayne Jason Jr",
      therapist: "Maria Rodriguez",
      therapistType: "OT",
      agency: "Destiny Home Health Services, Inc",
      street: "334 E Louise St, #2",
      city: "Long Beach",
      state: "CA",
      zip: "90805",
      phone: "(562) 981-2014",
      certPeriod: "04-19-2023 to 04-19-2025",
      status: "Active"
    },
    {
      id: 3,
      name: "Aguilar, Bertha",
      therapist: "John Smith",
      therapistType: "PT",
      agency: "Supportive Health Group",
      street: "6142 McKinley Avenue",
      city: "South Gate",
      state: "CA",
      zip: "90280",
      phone: "(562) 290-8009",
      certPeriod: "04-24-2023 to 04-24-2025",
      status: "Active"
    },
    {
      id: 4,
      name: "Aguilar, Irma",
      therapist: "Sarah Johnson",
      therapistType: "COTA",
      agency: "Intra Care Home Health Providers, Inc",
      street: "6331 Pacific Drive",
      city: "Commerce",
      state: "CA",
      zip: "90040",
      phone: "(562) 405-2896",
      certPeriod: "12-06-2022 to 10-09-2024",
      status: "Review"
    },
    {
      id: 5,
      name: "Aguilar De Garcia, Sara",
      therapist: "David Wilson",
      therapistType: "ST",
      agency: "Supportive Health Group",
      street: "3413 West 111th Place",
      city: "Inglewood",
      state: "CA",
      zip: "90303",
      phone: "(310) 666-3212",
      certPeriod: "04-28-2023 to 04-28-2025",
      status: "Active"
    },
    {
      id: 6,
      name: "Aguilera, Lilia",
      therapist: "James Martinez",
      therapistType: "PT",
      agency: "Unison Health Services, Inc",
      street: "12743 Adelphia Ave",
      city: "San Fernando",
      state: "CA",
      zip: "91340",
      phone: "(818) 424-9591",
      certPeriod: "04-19-2023 to 04-19-2025",
      status: "Active"
    },
    {
      id: 7,
      name: "Alas Gonzalez, Mayita",
      therapist: "Emma Thompson",
      therapistType: "PTA",
      agency: "Supportive Health Group",
      street: "11613 Mac Govern Avenue",
      city: "Downey",
      state: "CA",
      zip: "90241",
      phone: "(562) 644-6929",
      certPeriod: "04-22-2023 to 04-22-2025",
      status: "Pending"
    },
    {
      id: 8,
      name: "Albert, David Steven",
      therapist: "Michael Brown",
      therapistType: "STA",
      agency: "All Americans Choice Home Health Inc",
      street: "8651 Foothill BL",
      city: "Rancho Cucamonga",
      state: "CA",
      zip: "91730",
      phone: "(951) 233-2677",
      certPeriod: "04-18-2023 to 04-18-2025",
      status: "Expired"
    },
    {
      id: 9,
      name: "Allen, Rebecca",
      therapist: "John Smith",
      therapistType: "PT",
      agency: "Supportive Health Group",
      street: "427 Willow Drive",
      city: "Santa Monica",
      state: "CA",
      zip: "90403",
      phone: "(310) 555-7832",
      certPeriod: "05-11-2023 to 05-11-2025",
      status: "Active"
    },
    {
      id: 10,
      name: "Alvarez, Miguel",
      therapist: "Sarah Johnson",
      therapistType: "COTA",
      agency: "Intra Care Home Health Providers, Inc",
      street: "1824 Ocean Avenue",
      city: "San Francisco",
      state: "CA",
      zip: "94112",
      phone: "(415) 683-1942",
      certPeriod: "03-22-2023 to 03-22-2025",
      status: "Pending"
    },
    {
      id: 11,
      name: "Andrews, Thomas",
      therapist: "Michael Brown",
      therapistType: "STA",
      agency: "All Americans Choice Home Health Inc",
      street: "562 Maple Street",
      city: "Pasadena",
      state: "CA",
      zip: "91106",
      phone: "(626) 355-9087",
      certPeriod: "01-14-2023 to 01-14-2025",
      status: "Active"
    },
    {
      id: 12,
      name: "Barnes, Jennifer",
      therapist: "Emma Thompson",
      therapistType: "PTA",
      agency: "Supportive Health Group",
      street: "783 Pine Avenue",
      city: "Long Beach",
      state: "CA",
      zip: "90802",
      phone: "(562) 441-3876",
      certPeriod: "02-08-2022 to 02-08-2024",
      status: "Expired"
    }
  ]);
  
  // Extraer agencias únicas para los filtros
  const agencies = [...new Set(patients.map(patient => patient.agency))];
  
  // Obtener terapeutas basados en el tipo seleccionado
  const getFilteredTherapists = () => {
    if (selectedTherapistType === 'all') {
      return [...new Set(patients.map(patient => patient.therapist))];
    }
    
    return [...new Set(patients
      .filter(patient => patient.therapistType === selectedTherapistType)
      .map(patient => patient.therapist))];
  };
  
  // Terapeutas filtrados basados en el tipo seleccionado
  const filteredTherapists = getFilteredTherapists();
  
  // Filtrar agencias basadas en la búsqueda
  const filteredAgencies = agencies.filter(agency => 
    agency.toLowerCase().includes(agencySearchTerm.toLowerCase())
  );
  
  // Ordenar pacientes según la opción seleccionada
  const sortPatients = (patients) => {
    let sortedPatients = [...patients];
    
    switch(sortOption) {
      case 'nameAsc':
        sortedPatients.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        sortedPatients.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'statusActive':
        sortedPatients.sort((a, b) => 
          a.status === 'Active' && b.status !== 'Active' ? -1 : 
          a.status !== 'Active' && b.status === 'Active' ? 1 : 
          a.name.localeCompare(b.name)
        );
        break;
      case 'statusExpired':
        sortedPatients.sort((a, b) => 
          a.status === 'Expired' && b.status !== 'Expired' ? -1 : 
          a.status !== 'Expired' && b.status === 'Expired' ? 1 : 
          a.name.localeCompare(b.name)
        );
        break;
      default:
        break;
    }
    
    return sortedPatients;
  };
  
  // Filtrar pacientes basados en todos los criterios
  const getFilteredPatients = useCallback(() => {
    const filtered = patients.filter(patient => {
      // Coincidencia con la búsqueda de paciente
      const matchesPatientSearch = patientSearchTerm === '' || 
        patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        patient.phone.includes(patientSearchTerm) ||
        patient.street.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        patient.city.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        patient.zip.includes(patientSearchTerm);
      
      // Coincidencia con el filtro de agencia
      const matchesAgency = selectedAgency === 'all' || 
        patient.agency === selectedAgency;
      
      // Coincidencia con el filtro de tipo de terapeuta
      const matchesTherapistType = selectedTherapistType === 'all' || 
        patient.therapistType === selectedTherapistType;
      
      // Coincidencia con el terapeuta específico
      const matchesTherapist = selectedTherapist === 'all' || 
        patient.therapist === selectedTherapist;
        
      // Coincidencia con el estado
      const matchesStatus = selectedStatus === 'all' || 
        patient.status === selectedStatus;
      
      return matchesPatientSearch && matchesAgency && matchesTherapistType && matchesTherapist && matchesStatus;
    });
    
    return sortPatients(filtered);
  }, [patientSearchTerm, selectedAgency, selectedTherapistType, selectedTherapist, selectedStatus, sortOption, patients]);
  
  // Obtener pacientes filtrados
  const filteredPatients = getFilteredPatients();
  
  // Paginación
  const patientsPerPage = 8;
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  
  const getPaginatedPatients = () => {
    const startIndex = (activePage - 1) * patientsPerPage;
    return filteredPatients.slice(startIndex, startIndex + patientsPerPage);
  };
  
  const paginatedPatients = getPaginatedPatients();
  
  // Estadísticas para el dashboard
  const stats = [
    { title: "Total Patients", value: patients.length, icon: "fa-users", color: "blue" },
    { title: "Active Patients", value: patients.filter(p => p.status === "Active").length, icon: "fa-user-check", color: "green" },
    { title: "Pending Approvals", value: patients.filter(p => p.status === "Pending").length, icon: "fa-user-clock", color: "orange" },
    { title: "Expired Certifications", value: patients.filter(p => p.status === "Expired").length, icon: "fa-user-times", color: "red" },
  ];
  
  // Detectar el tamaño de la pantalla para responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Comprobar inicialmente
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Efecto para cerrar menú de filtros al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
      
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Efecto para mostrar el indicador de cambio de menú cuando el mouse está cerca del borde izquierdo
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX < 50) {
        setShowMenuSwitch(true);
      } else if (e.clientX > 100) {
        setShowMenuSwitch(false);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Efecto para poner el foco en el campo de búsqueda cuando se presiona Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  
  // Manejar navegación al menú principal
  const handleMainMenuTransition = () => {
    setMenuTransitioning(true);
    setShowAIAssistant(false);
    
    // Extraer el rol base para la navegación
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    // Simular animación de transición y luego navegar
    setTimeout(() => {
      navigate(`/${baseRole}/homePage`);
    }, 300);
  };
  
  // Manejar cambio de pestaña
  const handleTabChange = (tab) => {
    if (tab === 'Staffing') {
      // Navegar a la página de Staffing
      setMenuTransitioning(true);
      setShowAIAssistant(false);
      
      // Extraer el rol base para la navegación
      const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
      
      setTimeout(() => {
        navigate(`/${baseRole}/staffing`);
      }, 300);
    }
  };
  
  // Manejar clic en una opción de menú
  const handleMenuOptionClick = (option) => {
    setActiveMenuOption(option);
    
    // Navegar según la opción seleccionada (en una app real)
    if (option === 'Therapist') { // Therapist
      setMenuTransitioning(true);
      
      setTimeout(() => {
        // Esto navegaría a la página de terapeutas en una app real
        // Por ahora, permanecer en la misma página
        setMenuTransitioning(false);
      }, 300);
    }
  };
  
  // Manejar selección de agencia
  const handleAgencySelect = (agency) => {
    setSelectedAgency(agency);
    setAgencySearchTerm('');
    setActivePage(1);
  };
  
  // Manejar selección de tipo de terapeuta
  const handleTherapistTypeSelect = (type) => {
    setSelectedTherapistType(type);
    setSelectedTherapist('all'); // Reiniciar terapeuta cuando cambia el tipo
    setActivePage(1);
  };
  
  // Manejar selección de terapeuta
  const handleTherapistSelect = (therapist) => {
    setSelectedTherapist(therapist);
    setActivePage(1);
  };
  
  // Manejar selección de estado
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setActivePage(1);
  };
  
  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setPatientSearchTerm('');
    setAgencySearchTerm('');
    setSelectedTherapistType('all');
    setSelectedTherapist('all');
    setSelectedAgency('all');
    setSelectedStatus('all');
    setSortOption('nameAsc');
    setActivePage(1);
  };
  
  // Manejar cierre de sesión - con animación mejorada
  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
    setShowAIAssistant(false);
    
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

  // Cambiar vista entre lista y cuadrícula
  const toggleView = (view) => {
    setCurrentView(view);
  };
  
  // Alternar mostrar/ocultar filtros
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Manejar búsqueda de pacientes
  const handlePatientSearch = (e) => {
    setPatientSearchTerm(e.target.value);
    setActivePage(1);
  };
  
  // Manejar selección de opción de ordenamiento
  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    setShowFilterMenu(false);
  };
  
  // Manejar clic en botón de acción
  const handleActionClick = (action, patient) => {
    console.log(`${action} clicked for patient:`, patient);
    
    // Extraer el rol base para la navegación
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    switch(action) {
      case 'view':
        // Navegar a la página de información del paciente
        setMenuTransitioning(true);
        
        setTimeout(() => {
          navigate(`/${baseRole}/paciente/${patient.id}`);
        }, 300);
        break;
      case 'edit':
        // Aquí iría la lógica para editar el paciente
        console.log('Editar paciente:', patient);
        break;
      case 'notes':
        // Aquí iría la lógica para ver/editar notas del paciente
        console.log('Notas del paciente:', patient);
        break;
      default:
        break;
    }
  };
  
  // Manejar cambio de página
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setActivePage(pageNumber);
  };
  
  // Obtener números de página para mostrar
  const getPageNumbers = () => {
    let pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (activePage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (activePage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = activePage - 2; i <= activePage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  // Mostrar/ocultar tour rápido
  const toggleQuickTour = () => {
    setShowQuickTour(!showQuickTour);
  };

  return (
    <div className={`patients-dashboard ${menuTransitioning ? 'transitioning' : ''} ${isLoggingOut ? 'logging-out' : ''}`}>
      {/* Animación de cierre de sesión - Mostrar solo cuando se está cerrando sesión */}
      {isLoggingOut && (
        <LogoutAnimation 
          isMobile={isMobile} 
          onAnimationComplete={handleLogoutAnimationComplete} 
        />
      )}
      
      {/* Fondo parallax */}
      <div className="parallax-background">
        <div className="gradient-overlay"></div>
        <div className="animated-particles"></div>
      </div>
      
      {/* Indicador flotante para cambiar al menú principal */}
      {showMenuSwitch && !isLoggingOut && (
        <div 
          className="menu-switch-indicator"
          onClick={handleMainMenuTransition}
          title="Back to main menu"
        >
          <i className="fas fa-chevron-left"></i>
        </div>
      )}
      
      {/* Header con logo y perfil */}
      <header className={`main-header ${isLoggingOut ? 'logging-out' : ''}`}>
        <div className="header-container">
          {/* Logo y navegación */}
          <div className="logo-container">
            <div className="logo-wrapper">
            <img src={logoImg} alt="TherapySync Logo" className="logo" />
              <div className="logo-glow"></div>
            </div>
            
            {/* Navegación de menú */}
            <div className="menu-navigation">
              <button 
                className="nav-button main-menu" 
                onClick={handleMainMenuTransition}
                title="Back to main menu"
                disabled={isLoggingOut}
              >
                <i className="fas fa-th-large"></i>
                <span>Main Menu</span>
                <div className="button-effect"></div>
              </button>
              
              <button 
                className="nav-button patients-menu active" 
                title="Patients Menu"
                disabled={isLoggingOut}
              >
                <i className="fas fa-user-injured"></i>
                <span>Patients</span>
                <div className="button-effect"></div>
              </button>
            </div>
          </div>
          
          {/* Sección de pestañas premium */}
          <div className="tabs-section">
            <PremiumTabs activeTab="Patients" onChangeTab={handleTabChange} />
          </div>
          
          {/* Perfil de usuario */}
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
      
      {/* Contenido principal */}
      <main className={`patients-content ${isLoggingOut ? 'fade-out' : ''}`}>
        <div className="patients-container">
          {/* Header del dashboard */}
          <div className="patients-header">
            <div className="patients-title-container">
              <h1 className="patients-title">Patient Management Center</h1>
              <p className="patients-subtitle">
                Streamline your therapy workflow with complete patient information at your fingertips
              </p>
              <div className="header-actions">
                <button className="header-action-btn" onClick={toggleQuickTour} disabled={isLoggingOut}>
                  <i className="fas fa-info-circle"></i> Quick Tour
                </button>
                <button className="header-action-btn" disabled={isLoggingOut}>
                  <i className="fas fa-plus"></i> New Patient
                </button>
              </div>
            </div>
            
            <div className="assistant-message">
              <div className="message-content">
                <i className="fas fa-robot"></i>
                <p>Need assistance? Our AI assistant is available 24/7 to help you! <span className="ask-question">Ask a question</span></p>
              </div>
              <div className="message-glow"></div>
            </div>
          </div>

          {/* Estadísticas del Dashboard */}
          <div className="stats-dashboard">
            {stats.map((stat, index) => (
              <StatCard 
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>
          
          {/* Contenedor de filtros mejorado */}
          <div className={`filter-container ${showFilters ? 'expanded' : 'collapsed'}`}>
            <div className="filter-card">
              <div className="filter-header">
                <h3><i className="fas fa-filter"></i> Advanced Filters</h3>
                <div className="filter-header-actions">
                  <span className="filter-count">
                    Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> patients
                  </span>
                  <button 
                    className="toggle-filters-btn" 
                    onClick={toggleFilters}
                    title={showFilters ? "Collapse filters" : "Expand filters"}
                    disabled={isLoggingOut}
                  >
                    <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'}`}></i>
                  </button>
                </div>
              </div>
              
              {showFilters && (
                <>
                  <div className="filter-section">
                    <div className="agency-filter">
                      <h4>Healthcare Agencies</h4>
                      <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input 
                          type="text" 
                          placeholder="Search agencies..." 
                          value={agencySearchTerm}
                          onChange={(e) => setAgencySearchTerm(e.target.value)}
                          disabled={isLoggingOut}
                        />
                      </div>
                      
                      <div className="agency-list">
                        <div 
                          className={`agency-item ${selectedAgency === 'all' ? 'active' : ''}`}
                          onClick={() => !isLoggingOut && handleAgencySelect('all')}
                        >
                          <i className="fas fa-hospital-alt"></i> All Agencies
                        </div>
                        {filteredAgencies.map((agency, index) => (
                          <div 
                            key={index} 
                            className={`agency-item ${selectedAgency === agency ? 'active' : ''}`}
                            onClick={() => !isLoggingOut && handleAgencySelect(agency)}
                          >
                            <i className="fas fa-building"></i> {agency}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="therapist-filter">
                      <h4>Therapist Filters</h4>
                      <div className="therapist-type-filter">
                        <p>Filter by qualification:</p>
                        <div className="type-buttons">
                          {therapistTypes.map((type, index) => (
                            <button 
                              key={index} 
                              className={`type-button ${selectedTherapistType === type ? 'active' : ''}`}
                              onClick={() => !isLoggingOut && handleTherapistTypeSelect(type)}
                              disabled={isLoggingOut}
                            >
                              {type === 'all' ? 'All' : type}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="therapist-list">
                        <div 
                          className={`therapist-item ${selectedTherapist === 'all' ? 'active' : ''}`}
                          onClick={() => !isLoggingOut && handleTherapistSelect('all')}
                        >
                          <i className="fas fa-user-md"></i> All Therapists
                        </div>
                        {filteredTherapists.map((therapist, index) => (
                          <div 
                            key={index} 
                            className={`therapist-item ${selectedTherapist === therapist ? 'active' : ''}`}
                            onClick={() => !isLoggingOut && handleTherapistSelect(therapist)}
                          >
                            <i className="fas fa-user"></i> {therapist}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="status-filter">
                      <h4>Patient Status</h4>
                      <div className="status-buttons">
                        {statusOptions.map((status, index) => (
                          <button 
                            key={index} 
                            className={`status-button ${selectedStatus === status ? 'active' : ''} ${status.toLowerCase()}`}
                            onClick={() => !isLoggingOut && handleStatusSelect(status)}
                            disabled={isLoggingOut}
                          >
                            {status === 'all' ? 'All Statuses' : status}
                            {status !== 'all' && (
                              <span className="status-count">
                                {patients.filter(p => p.status === status).length}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="filter-footer">
                    <button 
                      className="clear-filters" 
                      onClick={handleClearFilters}
                      disabled={isLoggingOut}
                    >
                      <i className="fas fa-times-circle"></i> Clear Filters
                    </button>
                    
                    <div className="filter-tips">
                      <div className="tip-icon"><i className="fas fa-lightbulb"></i></div>
                      <p>Tip: Press <kbd>Ctrl</kbd> + <kbd>F</kbd> to quickly search patients</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Área de tabla de pacientes con vistas mejoradas */}
          <div className="patients-table-area">
            <div className="table-header">
              <div className="patient-search">
                <i className="fas fa-search"></i>
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search patients by name, phone, or address..." 
                  value={patientSearchTerm}
                  onChange={handlePatientSearch}
                  disabled={isLoggingOut}
                />
                {patientSearchTerm && (
                  <button 
                    className="clear-search" 
                    onClick={() => setPatientSearchTerm('')}
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              
              <div className="view-options">
                <button 
                  className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
                  onClick={() => toggleView('list')}
                  title="List View"
                  disabled={isLoggingOut}
                >
                  <i className="fas fa-list"></i>
                </button>
                <button 
                  className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
                  onClick={() => toggleView('grid')}
                  title="Grid View"
                  disabled={isLoggingOut}
                >
                  <i className="fas fa-th-large"></i>
                </button>
              </div>
              
              <div className="table-actions" ref={filterMenuRef}>
                <button 
                  className={`sort-button ${showFilterMenu ? 'active' : ''}`}
                  onClick={() => !isLoggingOut && setShowFilterMenu(!showFilterMenu)}
                  disabled={isLoggingOut}
                >
                  <i className="fas fa-sort"></i> 
                  <span>
                    {sortOptions.find(option => option.id === sortOption)?.text || 'Sort'}
                  </span>
                </button>
                
                {showFilterMenu && !isLoggingOut && (
                  <div className="filter-dropdown">
                    {sortOptions.map((option, index) => (
                      <div 
                        key={index}
                        className={`filter-option ${sortOption === option.id ? 'active' : ''}`}
                        onClick={() => handleSortOptionSelect(option.id)}
                      >
                        <i className={`fas ${option.icon}`}></i>
                        <span>{option.text}</span>
                        {sortOption === option.id && <i className="fas fa-check"></i>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {currentView === 'list' ? (
              // Vista de lista
              <div className="patients-table-wrapper">
                <table className="patients-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Therapist</th>
                      <th>Status</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Cert Period</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPatients.length > 0 ? (
                      paginatedPatients.map(patient => (
                        <tr key={patient.id} className={`status-${patient.status.toLowerCase()}`}>
                          <td>{patient.id}</td>
                          <td className="patient-name-cell">{patient.name}</td>
                          <td>
                            <span className="therapist-badge">{patient.therapistType}</span>
                            {patient.therapist}
                          </td>
                          <td>
                            <span className={`status-badge ${patient.status.toLowerCase()}`}>
                              {patient.status}
                            </span>
                          </td>
                          <td>{patient.phone}</td>
                          <td className="address-cell">{`${patient.city}, ${patient.state} ${patient.zip}`}</td>
                          <td>{patient.certPeriod}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="action-btn view" 
                                title="View Details"
                                onClick={() => handleActionClick('view', patient)}
                                disabled={isLoggingOut}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                className="action-btn edit" 
                                title="Edit Patient"
                                onClick={() => handleActionClick('edit', patient)}
                                disabled={isLoggingOut}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="action-btn notes" 
                                title="Patient Notes"
                                onClick={() => handleActionClick('notes', patient)}
                                disabled={isLoggingOut}
                              >
                                <i className="fas fa-clipboard"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="no-results">
                        <td colSpan="8">
                          <div className="no-results-message">
                            <i className="fas fa-search"></i>
                            <p>No patients found matching your search criteria</p>
                            <button 
                              className="reset-search" 
                              onClick={handleClearFilters}
                              disabled={isLoggingOut}
                            >
                              Reset Search
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              // Vista de cuadrícula
              <div className="patients-grid-wrapper">
                {paginatedPatients.length > 0 ? (
                  <div className="patients-grid">
                    {paginatedPatients.map(patient => (
                      <PatientCard 
                        key={patient.id} 
                        patient={patient}
                        onView={() => !isLoggingOut && handleActionClick('view', patient)}
                        onEdit={() => !isLoggingOut && handleActionClick('edit', patient)}
                        onNotes={() => !isLoggingOut && handleActionClick('notes', patient)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <div className="no-results-message">
                      <i className="fas fa-search"></i>
                      <p>No patients found matching your search criteria</p>
                      <button 
                        className="reset-search" 
                        onClick={handleClearFilters}
                        disabled={isLoggingOut}
                      >
                        Reset Search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Paginación mejorada */}
            {filteredPatients.length > 0 && (
              <div className="table-footer">
                <div className="pagination">
                  <button 
                    className="pagination-btn" 
                    onClick={() => handlePageChange(activePage - 1)}
                    disabled={activePage === 1 || isLoggingOut}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  
                  <div className="page-numbers">
                    {getPageNumbers().map(pageNumber => (
                      <button 
                        key={pageNumber}
                        className={`page-number ${activePage === pageNumber ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={isLoggingOut}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className="pagination-btn"
                    onClick={() => handlePageChange(activePage + 1)}
                    disabled={activePage === totalPages || isLoggingOut}
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                
                <div className="pagination-info">
                  Showing <strong>{Math.min(((activePage - 1) * patientsPerPage) + 1, filteredPatients.length)}-{Math.min(activePage * patientsPerPage, filteredPatients.length)}</strong> of <strong>{filteredPatients.length}</strong> patients
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Asistente de IA - ocultarlo durante el logout */}
      {showAIAssistant && !isLoggingOut && <AIAssistant />}
      
      {/* Botón de Acción Rápida Flotante con Menú */}
      {!isLoggingOut && (
        <div className="quick-action-btn">
          <button className="add-patient-btn">
            <i className="fas fa-plus"></i>
            <span className="btn-tooltip">Add New Patient</span>
          </button>
        </div>
      )}
      
      {/* Tour Rápido */}
      {showQuickTour && !isLoggingOut && (
        <div className="quick-tour">
          <div className="tour-overlay" onClick={toggleQuickTour}></div>
          <div className="tour-modal">
            <div className="tour-header">
              <h3><i className="fas fa-info-circle"></i> Welcome to Patient Management</h3>
              <button className="close-tour" onClick={toggleQuickTour}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="tour-content">
              <div className="tour-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Search Patients</h4>
                  <p>Use the search bar to find patients by name, phone number, or address. Press <kbd>Ctrl+F</kbd> to focus on search.</p>
                </div>
              </div>
              <div className="tour-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Advanced Filters</h4>
                  <p>Filter patients by agency, therapist type, and status to narrow down your results.</p>
                </div>
              </div>
              <div className="tour-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Change Views</h4>
                  <p>Switch between list and grid views based on your preference.</p>
                </div>
              </div>
              <div className="tour-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Quick Actions</h4>
                  <p>Use the floating action button to add new patients quickly from anywhere.</p>
                </div>
              </div>
            </div>
            <div className="tour-footer">
              <button className="tour-btn dont-show">Don't show again</button>
              <button className="tour-btn close" onClick={toggleQuickTour}>Got it!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPatientsPage;