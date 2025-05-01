import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../components/login/AuthContext'; // Importar el contexto de autenticación
import '../../../../styles/developer/Referrals/CreateNF/CreateNF.scss';
import '../../../../styles/developer/Referrals/CreateNF/CreateReferralForm.scss';
import logoImg from '../../../../assets/LogoMHC.jpeg';
import CustomDatePicker from './DatePicker';
import '../../../../styles/developer/Referrals/CreateNF/DatePicker.scss';
import LoadingScreen from './LoadingDates';
import '../../../../styles/developer/Referrals/CreateNF/LoadingDates.scss';
import DOBDatePicker from './DOBDatePicker';
import LogoutAnimation from '../../../../components/LogOut/LogOut'; // Importar el componente de animación

const TPCreateNF = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Usar el contexto de autenticación
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  
  const fileInputRef = useRef(null);
  const userMenuRef = useRef(null);
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    // Datos personales del paciente
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    zipCode: '',
    contactNumbers: [''],
    
    // Care Period
    payorType: '',
    certPeriodStart: '',
    certPeriodEnd: '',
    urgencyLevel: 'normal',
    
    // Medical
    physicianId: '',
    newPhysician: false,
    newPhysicianName: '',
    agencyId: '',
    agencyBranch: '',
    nurseManager: '',
    newNurseManager: '',
    nursingDiagnosis: '',
    pmh: '',
    priorLevelOfFunction: 'To Be Obtained at Evaluation',
    homebound: {},
    wbs: '',
    
    // Therapy
    reasonsForReferral: {
      strength_balance: false,
      gait: false,
      adls: false,
      orthopedic: false,
      neurological: false,
      wheelchair: false,
      additional: ''
    },
    disciplines: []
  });

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
  
  // Datos simulados para selects
  const physicians = [
    { id: 1, name: 'James Wilson' },
    { id: 2, name: 'Sarah Parker' },
    { id: 3, name: 'Michael Chen' }
  ];
  
  const agencies = [
    { id: 1, name: 'Destiny Home Health', branches: ['Branch A', 'Branch B'], managers: ['Manager 1', 'Manager 2'] },
    { id: 2, name: 'Unison Health Services', branches: ['Branch C', 'Branch D'], managers: ['Manager 3', 'Manager 4'] },
    { id: 3, name: 'Supportive Home Health', branches: ['Branch E', 'Branch F'], managers: ['Manager 5', 'Manager 6'] }
  ];
  
  const therapists = {
    PT: [{ id: 1, name: 'Willie Blackwell' }, { id: 2, name: 'Emily Rounds' }],
    PTA: [{ id: 3, name: 'Carlo Gianzon' }, { id: 4, name: 'Anna Lamport' }],
    OT: [{ id: 5, name: 'James Lee' }, { id: 6, name: 'Richard Lai' }],
    COTA: [{ id: 7, name: 'Carla Gianzon' }, { id: 8, name: 'Michelle De La Cruz' }],
    ST: [{ id: 9, name: 'Junni...' }, { id: 10, name: 'Arya ...' }],
    STA: [{ id: 11, name: 'Thomas Garcia (STA)' }, { id: 12, name: 'Elizabeth Taylor (STA)' }]
  };
  
  // Estado para selección de disciplinas
  const [selectedDisciplines, setSelectedDisciplines] = useState({
    PT: false,
    PTA: false,
    OT: false,
    COTA: false,
    ST: false,
    STA: false
  });
  
  // Estado para terapeutas seleccionados
  const [selectedTherapists, setSelectedTherapists] = useState({
    PT: null,
    PTA: null,
    OT: null,
    COTA: null,
    ST: null,
    STA: null
  });

  // Estado para controlar la adición de un nuevo manager
  const [addingNewManager, setAddingNewManager] = useState(false);
  
  // Detectar el tamaño de la pantalla para responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Comprobar inicialmente
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
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
  
  useEffect(() => {
    if (formData.certPeriodStart) {
      const startDate = new Date(formData.certPeriodStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 60);
      
      // Formatear la fecha como YYYY-MM-DD para el input date
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        certPeriodEnd: formattedEndDate
      }));
    }
  }, [formData.certPeriodStart]);
  
  // Manejar transición al menú principal
  const handleMainMenuTransition = () => {
    if (isLoggingOut) return; // No permitir navegación durante cierre de sesión
    
    // Extraer el rol base para la navegación
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    navigate(`/${baseRole}/homePage`);
  };

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
  
  // Manejar transición al menú de referrals
  const handleReferralsMenuTransition = () => {
    if (isLoggingOut) return; // No permitir navegación durante cierre de sesión
    
    // Extraer el rol base para la navegación
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    navigate(`/${baseRole}/referrals`);
  };
  
  // Manejador para volver a la lista de referrals
  const handleBackToReferrals = () => {
    if (isLoggingOut) return; // No permitir navegación durante cierre de sesión
    
    // Extraer el rol base para la navegación
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    navigate(`/${baseRole}/referrals`);
  };
  
  // Manejar clic en el área de subida de PDF
  const handlePdfAreaClick = () => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    if (!showForm) {
      fileInputRef.current.click();
    }
  };
  
  // Manejar la subida de archivos
  const handleFileUpload = (e) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    const files = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
    
    if (files.length === 0) {
      alert('Por favor, sube únicamente archivos PDF.');
      return;
    }
    
    setUploadedFiles(files);
    setShowForm(true);
  };
  
  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Manejar cambio en contactNumbers
  const handleContactNumberChange = (index, value) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    const updatedNumbers = [...formData.contactNumbers];
    updatedNumbers[index] = value;
    
    setFormData(prev => ({
      ...prev,
      contactNumbers: updatedNumbers
    }));
  };
  
  // Agregar un nuevo número de contacto
  const addContactNumber = () => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    setFormData(prev => ({
      ...prev,
      contactNumbers: [...prev.contactNumbers, '']
    }));
  };
  
  // Eliminar un número de contacto
  const removeContactNumber = (index) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    if (formData.contactNumbers.length > 1) {
      const updatedNumbers = [...formData.contactNumbers];
      updatedNumbers.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        contactNumbers: updatedNumbers
      }));
    }
  };
  
  // Manejar selección de médico
  const handlePhysicianChange = (e) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    const physicianId = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      physicianId,
      newPhysician: physicianId === 'new',
      newPhysicianName: ''
    }));
  };
  
  // Manejar selección de agencia
  const handleAgencyChange = (e) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    const agencyId = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      agencyId,
      agencyBranch: '',
      nurseManager: '',
      newNurseManager: ''
    }));
    
    setAddingNewManager(false);
  };

  // Manejar selección de nurse manager
  const handleNurseManagerChange = (e) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    const value = e.target.value;
    
    if (value === 'new') {
      setAddingNewManager(true);
      setFormData(prev => ({
        ...prev,
        nurseManager: 'new',
        newNurseManager: ''
      }));
    } else {
      setAddingNewManager(false);
      setFormData(prev => ({
        ...prev,
        nurseManager: value,
        newNurseManager: ''
      }));
    }
  };
  
  // Manejar cambios en opciones de Homebound
  const handleHomeboundChange = (optionId, isChecked) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    setFormData(prev => ({
      ...prev,
      homebound: {
        ...prev.homebound,
        [optionId]: isChecked
      }
    }));
  };
  
  // Manejar cambios en opciones de Reasons for Referral
  const handleReasonChange = (reasonId, isChecked) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    setFormData(prev => ({
      ...prev,
      reasonsForReferral: {
        ...prev.reasonsForReferral,
        [reasonId]: isChecked
      }
    }));
  };
  
  // Manejar selección de disciplinas
  const handleDisciplineChange = (discipline) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    let updatedDisciplines = { ...selectedDisciplines };
    
    updatedDisciplines[discipline] = !updatedDisciplines[discipline];
    
    // Aplicar reglas de emparejamiento
    if (discipline === 'PT' && updatedDisciplines.PT) {
      updatedDisciplines.PTA = true;
    } else if (discipline === 'PT' && !updatedDisciplines.PT) {
      updatedDisciplines.PTA = false;
    } else if (discipline === 'PTA' && updatedDisciplines.PTA) {
      updatedDisciplines.PT = true;
    } else if (discipline === 'PTA' && !updatedDisciplines.PTA) {
      updatedDisciplines.PT = false;
    }
    
    if (discipline === 'OT' && updatedDisciplines.OT) {
      updatedDisciplines.COTA = true;
    } else if (discipline === 'OT' && !updatedDisciplines.OT) {
      updatedDisciplines.COTA = false;
    } else if (discipline === 'COTA' && updatedDisciplines.COTA) {
      updatedDisciplines.OT = true;
    } else if (discipline === 'COTA' && !updatedDisciplines.COTA) {
      updatedDisciplines.OT = false;
    }
    
    if (discipline === 'ST' && updatedDisciplines.ST) {
      updatedDisciplines.STA = true;
    } else if (discipline === 'ST' && !updatedDisciplines.ST) {
      updatedDisciplines.STA = false;
    } else if (discipline === 'STA' && updatedDisciplines.STA) {
      updatedDisciplines.ST = true;
    } else if (discipline === 'STA' && !updatedDisciplines.STA) {
      updatedDisciplines.ST = false;
    }
    
    setSelectedDisciplines(updatedDisciplines);
    
    // Actualizar formData.disciplines
    const selectedDisciplinesList = Object.keys(updatedDisciplines).filter(key => updatedDisciplines[key]);
    
    setFormData(prev => ({
      ...prev,
      disciplines: selectedDisciplinesList
    }));
  };
  
  // Manejar selección de terapeuta
  const handleTherapistSelection = (discipline, therapistId) => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    setSelectedTherapists(prev => ({
      ...prev,
      [discipline]: therapistId
    }));
  };
  
  // Validar que se cumpla la regla de emparejamiento (PT+PTA, OT+COTA, ST+STA)
  const validateDisciplines = () => {
    const hasPTPair = selectedDisciplines.PT && selectedDisciplines.PTA;
    const hasOTPair = selectedDisciplines.OT && selectedDisciplines.COTA;
    const hasSTAPair = selectedDisciplines.ST && selectedDisciplines.STA;
    
    return hasPTPair || hasOTPair || hasSTAPair;
  };
  
  // Obtener agencia seleccionada
  const getSelectedAgency = () => {
    return agencies.find(agency => agency.id.toString() === formData.agencyId);
  };
  
  // Manejar finalización del proceso de carga
  const handleLoadingComplete = () => {
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    setIsLoading(false);
    
    // Extraer el rol base para la navegación
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    // Mostrar mensaje de éxito y redirigir
    setTimeout(() => {
      navigate(`/${baseRole}/referrals`);
    }, 500);
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLoggingOut) return; // No permitir acciones durante cierre de sesión
    
    // Validar que se seleccionó al menos un par de disciplinas
    if (!validateDisciplines()) {
      alert('Por favor, selecciona al menos un par de disciplinas (PT+PTA, OT+COTA, o ST+STA)');
      return;
    }
    
    // Validar que se seleccionaron terapeutas para todas las disciplinas seleccionadas
    const hasAllTherapistsSelected = Object.keys(selectedDisciplines)
      .filter(discipline => selectedDisciplines[discipline])
      .every(discipline => selectedTherapists[discipline] !== null);
    
    if (!hasAllTherapistsSelected) {
      alert('Por favor, selecciona un terapeuta para cada disciplina elegida');
      return;
    }
    
    // Mostrar pantalla de carga
    setIsLoading(true);
    
    // Aquí iría la lógica para enviar los datos al backend
    console.log('Datos del formulario:', formData);
    console.log('Terapeutas seleccionados:', selectedTherapists);
    console.log('Archivos PDF:', uploadedFiles);
    
    // La pantalla de carga permanecerá visible hasta que el proceso termine
    // No necesitamos hacer nada más aquí, ya que la animación de carga
    // se encargará de mostrar el progreso y luego llamará a handleLoadingComplete
  };

  // Opciones de Homebound según la imagen 4
  const homeboundOptions = [
    { id: 'na', label: 'N/A', icon: 'fa-times-circle' },
    { id: 'needs_assistance', label: 'Needs assistance for all activities', icon: 'fa-hands-helping' },
    { id: 'residual_weakness', label: 'Residual Weakness', icon: 'fa-battery-quarter' },
    { id: 'requires_assistance_ambulate', label: 'Requires assistance to ambulate', icon: 'fa-walking' },
    { id: 'confusion', label: 'Confusion, unable to go out of home alone', icon: 'fa-brain' },
    { id: 'safely_leave', label: 'Unable to safely leave home unassisted', icon: 'fa-door-open' },
    { id: 'sob', label: 'Severe SOB, SOB upon exertion', icon: 'fa-lungs' },
    { id: 'adaptive_devices', label: 'Dependent upon adaptive device(s)', icon: 'fa-wheelchair' },
    { id: 'medical_restrictions', label: 'Medical restrictions', icon: 'fa-ban' },
    { id: 'taxing_effort', label: 'Requires taxing effort to leave home', icon: 'fa-dumbbell' },
    { id: 'bedbound', label: 'Bedbound', icon: 'fa-bed' },
    { id: 'transfers', label: 'Requires assistance with transfers', icon: 'fa-exchange-alt' },
    { id: 'other', label: 'Other (Explain)', icon: 'fa-plus-circle' }
  ];

  // Opciones de Prior Level of Function según la imagen 5
  const priorLevelOptions = [
    'To Be Obtained at Evaluation',
    'I (No Assist)',
    'MI (Uses Assistive Device)',
    'S (Set up/Supervision)',
    'SBA (Stand By Assist)',
    'MIN (Requires 0-25% Assist)',
    'MOD (Requires 26-50% Assist)',
    'MAX (Requires 51-75% Assist)',
    'TOT (Requires 76-99% Assist)',
    'DEP (100% Assist)'
  ];

  // Opciones de Reasons for Referral según la imagen 6
  const referralOptions = [
    { id: 'strength_balance', label: 'Decreased Strength / Balance' },
    { id: 'gait', label: 'Decreased Gait Ability' },
    { id: 'adls', label: 'ADLs' },
    { id: 'orthopedic', label: 'Orthopedic Operation' },
    { id: 'neurological', label: 'Neurological / Cognitive' },
    { id: 'wheelchair', label: 'Wheelchair Evaluation' }
  ];

  return (
    <div className={`create-referral-dashboard ${isLoggingOut ? 'logging-out' : ''}`}>
      {/* Animación de cierre de sesión - Mostrar solo cuando se está cerrando sesión */}
      {isLoggingOut && (
        <LogoutAnimation 
          isMobile={isMobile} 
          onAnimationComplete={handleLogoutAnimationComplete} 
        />
      )}
      
      {/* Pantalla de carga */}
      <LoadingScreen isLoading={isLoading} onComplete={handleLoadingComplete} />
      
      {/* Fondo con efecto parallax */}
      <div className="parallax-background">
        <div className="gradient-overlay"></div>
      </div>
      
      {/* Header con logo y perfil */}
      <header className={`main-header ${isLoggingOut ? 'logging-out' : ''}`}>
        <div className="header-container">
          {/* Logo y navegación de menús */}
          <div className="logo-container">
            <img src={logoImg} alt="TherapySync Logo" className="logo" />
            
            {/* Navegación entre menús */}
            <div className="menu-navigation">
              <button 
                className="nav-button main-menu" 
                onClick={handleMainMenuTransition}
                title="Volver al menú principal"
                disabled={isLoggingOut}
              >
                <i className="fas fa-th-large"></i>
                <span>Menú Principal</span>
              </button>
              
              <button 
                className="nav-button referrals-menu active" 
                onClick={handleReferralsMenuTransition}
                title="Menú de Referrals"
                disabled={isLoggingOut}
              >
                <i className="fas fa-file-medical"></i>
                <span>Referrals</span>
              </button>
            </div>
          </div>
          
          {/* Título de la sección actual */}
          <div className="current-section">
            <h2>Create New Referral</h2>
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
      <main className={`main-content ${isLoggingOut ? 'fade-out' : ''}`}>
        <div className="create-referral-container">
          {/* Navegación de miga de pan */}
          <div className="breadcrumb-navigation">
            <button 
              className="back-button" 
              onClick={handleBackToReferrals}
              disabled={isLoggingOut}
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back to Referrals</span>
            </button>
            <div className="breadcrumb-path">
              <span>Referrals</span>
              <i className="fas fa-chevron-right"></i>
              <span className="current">Create New Referral</span>
            </div>
          </div>
          
          {/* Contenedor para el formulario */}
          <div className="form-container">
            <div className="form-header">
              <h2>
                <i className="fas fa-plus-circle"></i>
                New Referral Information
              </h2>
              <p>Complete the form below to create a new patient referral</p>
            </div>
            
            {/* Área interactiva para subir PDFs */}
            <div 
              className="form-placeholder" 
              onClick={handlePdfAreaClick}
              style={{ cursor: !isLoggingOut ? 'pointer' : 'default' }}
            >
              {/* Input oculto para la selección de archivos */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf"
                multiple
                onChange={handleFileUpload}
                disabled={isLoggingOut}
              />
              
              {!showForm ? (
                <>
                  <div className="placeholder-icon">
                    <i className="fas fa-plus-circle"></i>
                  </div>
                  <h3>New Referral Form</h3>
                  <p>Click to upload patient PDF documents</p>
                </>
              ) : (
                <>
                  <div className="pdf-files-indicator">
                    <i className="fas fa-file-pdf"></i>
                    <h3>{uploadedFiles.length} PDF Document{uploadedFiles.length > 1 ? 's' : ''} Uploaded</h3>
                    <div className="files-list">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Si hay archivos subidos, mostrar el formulario */}
            {showForm && !isLoggingOut && (
              <form className="patient-referral-form" onSubmit={handleSubmit}>
                {/* Sección de datos del paciente */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-user-injured"></i>
                    <h3>Patient Information</h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggingOut}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggingOut}
                      />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                          type="date"
                          id="dob"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          required
                          disabled={isLoggingOut}
                        />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggingOut}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggingOut}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggingOut}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="zipCode">Zip Code</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggingOut}
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Contact Numbers</label>
                      <div className="contact-numbers">
                        {formData.contactNumbers.map((number, index) => (
                          <div key={index} className="contact-number-row">
                            <input
                              type="tel"
                              value={number}
                              onChange={(e) => handleContactNumberChange(index, e.target.value)}
                              placeholder="Phone number"
                              disabled={isLoggingOut}
                            />
                            
                            <div className="contact-actions">
                              {index === formData.contactNumbers.length - 1 && (
                                <button
                                  type="button"
                                  className="add-contact"
                                  onClick={addContactNumber}
                                  disabled={isLoggingOut}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              )}
                              
                              {formData.contactNumbers.length > 1 && (
                                <button
                                  type="button"
                                  className="remove-contact"
                                  onClick={() => removeContactNumber(index)}
                                  disabled={isLoggingOut}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sección de Care Period - con el formato actualizado */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-calendar-alt"></i>
                    <h3>Care Period</h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="payorType">Payor Type</label>
                      <select
                        id="payorType"
                        name="payorType"
                        value={formData.payorType}
                        onChange={handleInputChange}
                        required
                        disabled={isLoggingOut}
                      >
                        <option value="">Select Payor Type</option>
                        <option value="medicare">Medicare</option>
                        <option value="medicaid">Medicaid</option>
                        <option value="private">Private Insurance</option>
                        <option value="self">Self Pay</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    {/* Campo de Cert Period actualizado con dos fechas */}
                    <div className="form-group full-width">
                      <label>Cert Period</label>
                      <div className="cert-period-container">
                        <div className="date-inputs">
                          <div className="date-input start-date">
                            <CustomDatePicker
                              selectedDate={formData.certPeriodStart}
                              onChange={(date) => {
                                if (isLoggingOut) return;
                                setFormData(prev => ({
                                  ...prev,
                                  certPeriodStart: date
                                }));
                              }}
                              name="certPeriodStart"
                              required={true}
                              disabled={isLoggingOut}
                            />
                          </div>
                          <span className="date-separator">-</span>
                          <div className="date-input end-date">
                            <CustomDatePicker
                              selectedDate={formData.certPeriodEnd}
                              onChange={() => {}} // No permitimos cambios manuales
                              name="certPeriodEnd"
                              disabled={true}
                            />
                          </div>
                        </div>
                        <small className="form-text text-muted">
                          End date is automatically calculated as SOC + 60 days
                        </small>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="urgencyLevel">Urgency Level</label>
                      <select
                        id="urgencyLevel"
                        name="urgencyLevel"
                        value={formData.urgencyLevel}
                        onChange={handleInputChange}
                        disabled={isLoggingOut}
                      >
                        <option value="low">Low Priority</option>
                        <option value="normal">Normal</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Sección Médica - con campos actualizados */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-stethoscope"></i>
                    <h3>Medical Information</h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="physicianId">Physician</label>
                      <select
                        id="physicianId"
                        name="physicianId"
                        value={formData.physicianId}
                        onChange={handlePhysicianChange}
                        required
                        disabled={isLoggingOut}
                      >
                        <option value="">Select Physician</option>
                        {physicians.map(physician => (
                          <option key={physician.id} value={physician.id}>
                            {physician.name}
                          </option>
                        ))}
                        <option value="new">Add New Physician</option>
                      </select>
                    </div>
                    
                    {formData.newPhysician && (
                      <div className="form-group">
                        <label htmlFor="newPhysicianName">New Physician Name</label>
                        <input
                          type="text"
                          id="newPhysicianName"
                          name="newPhysicianName"
                          value={formData.newPhysicianName}
                          onChange={handleInputChange}
                          required
                          disabled={isLoggingOut}
                        />
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label htmlFor="agencyId">Agency</label>
                      <select
                        id="agencyId"
                        name="agencyId"
                        value={formData.agencyId}
                        onChange={handleAgencyChange}
                        required
                        disabled={isLoggingOut}
                      >
                        <option value="">Select Agency</option>
                        {agencies.map(agency => (
                          <option key={agency.id} value={agency.id}>
                            {agency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {formData.agencyId && (
                      <>
                        <div className="form-group">
                          <label htmlFor="agencyBranch">Agency Branch</label>
                          <select
                            id="agencyBranch"
                            name="agencyBranch"
                            value={formData.agencyBranch}
                            onChange={handleInputChange}
                            required
                            disabled={isLoggingOut}
                          >
                            <option value="">Select Branch</option>
                            {getSelectedAgency()?.branches.map((branch, index) => (
                              <option key={index} value={branch}>
                                {branch}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="nurseManager">Nurse Manager</label>
                          <select
                            id="nurseManager"
                            name="nurseManager"
                            value={formData.nurseManager}
                            onChange={handleNurseManagerChange}
                            required
                            disabled={isLoggingOut}
                          >
                            <option value="">Select Nurse Manager</option>
                            {getSelectedAgency()?.managers.map((manager, index) => (
                              <option key={index} value={manager}>
                                {manager}
                              </option>
                            ))}
                            <option value="new">Add New Nurse Manager</option>
                          </select>
                        </div>
                        
                        {addingNewManager && (
                          <div className="form-group">
                            <label htmlFor="newNurseManager">New Nurse Manager Name</label>
                            <input
                              type="text"
                              id="newNurseManager"
                              name="newNurseManager"
                              value={formData.newNurseManager}
                              onChange={handleInputChange}
                              required
                              disabled={isLoggingOut}
                            />
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="form-group full-width">
                      <label htmlFor="nursingDiagnosis">Nursing Diagnosis</label>
                      <textarea
                        id="nursingDiagnosis"
                        name="nursingDiagnosis"
                        value={formData.nursingDiagnosis}
                        onChange={handleInputChange}
                        rows="3"
                        required
                        disabled={isLoggingOut}
                      ></textarea>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="pmh">PMH (Past Medical History)</label>
                      <textarea
                        id="pmh"
                        name="pmh"
                        value={formData.pmh}
                        onChange={handleInputChange}
                        rows="3"
                        disabled={isLoggingOut}
                      ></textarea>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="priorLevelOfFunction">Prior Level of Function</label>
                      <select
                        id="priorLevelOfFunction"
                        name="priorLevelOfFunction"
                        value={formData.priorLevelOfFunction}
                        onChange={handleInputChange}
                        disabled={isLoggingOut}
                      >
                        {priorLevelOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Homebound</label>
                      <div className="homebound-options">
                        {homeboundOptions.map(option => (
                          <div key={option.id} className="option-item">
                            <label className="checkbox-container">
                              <input
                                type="checkbox"
                                checked={!!formData.homebound[option.id]}
                                onChange={(e) => handleHomeboundChange(option.id, e.target.checked)}
                                disabled={isLoggingOut}
                              />
                              <span className="checkbox-label">{option.label}</span>
                            </label>
                            
                            {option.id === 'other' && formData.homebound['other'] && (
                              <input
                                type="text"
                                className="form-control other-reason mt-1"
                                placeholder="Explain other reason"
                                value={formData.homebound.otherReason || ''}
                                onChange={(e) => {
                                  if (isLoggingOut) return;
                                  setFormData(prev => ({
                                    ...prev,
                                    homebound: {
                                      ...prev.homebound,
                                      otherReason: e.target.value
                                    }
                                  }));
                                }}
                                disabled={isLoggingOut}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="wbs">WBS</label>
                      <input
                        type="text"
                        id="wbs"
                        name="wbs"
                        value={formData.wbs}
                        onChange={handleInputChange}
                        placeholder="XX-XXX-X-XXXX (e.g., 01-123-4-5678)"
                        disabled={isLoggingOut}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sección de Therapy - con campos actualizados */}
                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-heartbeat"></i>
                    <h3>Therapy Information</h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Reasons for Referral</label>
                      <div className="reason-options">
                        {referralOptions.map(reason => (
                          <div key={reason.id} className="option-item">
                            <label className="checkbox-container">
                              <input
                                type="checkbox"
                                checked={!!formData.reasonsForReferral[reason.id]}
                                onChange={(e) => handleReasonChange(reason.id, e.target.checked)}
                                disabled={isLoggingOut}
                              />
                              <span className="checkbox-label">{reason.label}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="additional-reasons mt-3">
                        <label>Additional Reasons:</label>
                        <textarea
                          name="additionalReasons"
                          value={formData.reasonsForReferral.additional || ''}
                          onChange={(e) => {
                            if (isLoggingOut) return;
                            setFormData(prev => ({
                              ...prev,
                              reasonsForReferral: {
                                ...prev.reasonsForReferral,
                                additional: e.target.value
                              }
                            }));
                          }}
                          className="form-control"
                          rows="3"
                          disabled={isLoggingOut}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Disciplines Needed</label>
                      <div className="disciplines-container">
                        <div className="disciplines-pairs">
                          {/* PT & PTA */}
                          <div className="discipline-pair">
                            <div className="discipline-checkboxes">
                              <label className={`discipline-checkbox ${selectedDisciplines.PT ? 'selected' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={selectedDisciplines.PT}
                                  onChange={() => handleDisciplineChange('PT')}
                                  disabled={isLoggingOut}
                                />
                                <span>PT</span>
                              </label>
                              <label className={`discipline-checkbox ${selectedDisciplines.PTA ? 'selected' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={selectedDisciplines.PTA}
                                  onChange={() => handleDisciplineChange('PTA')}
                                  disabled={isLoggingOut}
                                />
                                <span>PTA</span>
                              </label>
                            </div>

                            {/* Selección de terapeuta PT */}
                            {selectedDisciplines.PT && (
                              <div className="therapist-select">
                                <label htmlFor="pt-therapist">PT Therapist</label>
                                <select
                                  id="pt-therapist"
                                  value={selectedTherapists.PT || ''}
                                  onChange={(e) => handleTherapistSelection('PT', e.target.value)}
                                  required
                                  disabled={isLoggingOut}
                                >
                                  <option value="">Select PT Therapist</option>
                                  {therapists.PT.map(therapist => (
                                    <option key={therapist.id} value={therapist.id}>
                                      {therapist.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Selección de terapeuta PTA */}
                            {selectedDisciplines.PTA && (
                              <div className="therapist-select">
                                <label htmlFor="pta-therapist">PTA Therapist</label>
                                <select
                                  id="pta-therapist"
                                  value={selectedTherapists.PTA || ''}
                                  onChange={(e) => handleTherapistSelection('PTA', e.target.value)}
                                  required
                                  disabled={isLoggingOut}
                                >
                                  <option value="">Select PTA Therapist</option>
                                  {therapists.PTA.map(therapist => (
                                    <option key={therapist.id} value={therapist.id}>
                                      {therapist.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* OT & COTA */}
                          <div className="discipline-pair">
                            <div className="discipline-checkboxes">
                              <label className={`discipline-checkbox ${selectedDisciplines.OT ? 'selected' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={selectedDisciplines.OT}
                                  onChange={() => handleDisciplineChange('OT')}
                                  disabled={isLoggingOut}
                                />
                                <span>OT</span>
                              </label>
                              <label className={`discipline-checkbox ${selectedDisciplines.COTA ? 'selected' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={selectedDisciplines.COTA}
                                  onChange={() => handleDisciplineChange('COTA')}
                                  disabled={isLoggingOut}
                                />
                                <span>COTA</span>
                              </label>
                            </div>

                            {/* Selección de terapeuta OT */}
                            {selectedDisciplines.OT && (
                              <div className="therapist-select">
                                <label htmlFor="ot-therapist">OT Therapist</label>
                                <select
                                  id="ot-therapist"
                                  value={selectedTherapists.OT || ''}
                                  onChange={(e) => handleTherapistSelection('OT', e.target.value)}
                                  required
                                  disabled={isLoggingOut}
                                >
                                  <option value="">Select OT Therapist</option>
                                  {therapists.OT.map(therapist => (
                                    <option key={therapist.id} value={therapist.id}>
                                      {therapist.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Selección de terapeuta COTA */}
                            {selectedDisciplines.COTA && (
                              <div className="therapist-select">
                                <label htmlFor="cota-therapist">COTA Therapist</label>
                                <select
                                  id="cota-therapist"
                                  value={selectedTherapists.COTA || ''}
                                  onChange={(e) => handleTherapistSelection('COTA', e.target.value)}
                                  required
                                  disabled={isLoggingOut}
                                >
                                  <option value="">Select COTA Therapist</option>
                                  {therapists.COTA.map(therapist => (
                                    <option key={therapist.id} value={therapist.id}>
                                      {therapist.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* ST & STA */}
                          <div className="discipline-pair">
                            <div className="discipline-checkboxes">
                              <label className={`discipline-checkbox ${selectedDisciplines.ST ? 'selected' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={selectedDisciplines.ST}
                                  onChange={() => handleDisciplineChange('ST')}
                                  disabled={isLoggingOut}
                                />
                                <span>ST</span>
                              </label>
                              <label className={`discipline-checkbox ${selectedDisciplines.STA ? 'selected' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={selectedDisciplines.STA}
                                  onChange={() => handleDisciplineChange('STA')}
                                  disabled={isLoggingOut}
                                />
                                <span>STA</span>
                              </label>
                            </div>

                            {/* Selección de terapeuta ST */}
                            {selectedDisciplines.ST && (
                              <div className="therapist-select">
                                <label htmlFor="st-therapist">ST Therapist</label>
                                <select
                                  id="st-therapist"
                                  value={selectedTherapists.ST || ''}
                                  onChange={(e) => handleTherapistSelection('ST', e.target.value)}
                                  required
                                  disabled={isLoggingOut}
                                >
                                  <option value="">Select ST Therapist</option>
                                  {therapists.ST.map(therapist => (
                                    <option key={therapist.id} value={therapist.id}>
                                      {therapist.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Selección de terapeuta STA */}
                            {selectedDisciplines.STA && (
                              <div className="therapist-select">
                                <label htmlFor="sta-therapist">STA Therapist</label>
                                <select
                                  id="sta-therapist"
                                  value={selectedTherapists.STA || ''}
                                  onChange={(e) => handleTherapistSelection('STA', e.target.value)}
                                  required
                                  disabled={isLoggingOut}
                                >
                                  <option value="">Select STA Therapist</option>
                                  {therapists.STA.map(therapist => (
                                    <option key={therapist.id} value={therapist.id}>
                                      {therapist.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="discipline-note">
                          <p><i className="fas fa-info-circle"></i> At least one pair of disciplines must be selected (PT+PTA, OT+COTA, or ST+STA)</p>
                        </div>
                      </div>
                    </div>

                    <div className="form-group full-width submit-group">
                      <button 
                        type="submit" 
                        className="save-referral-btn"
                        disabled={isLoggingOut}
                      >
                        <i className="fas fa-save"></i>
                        Save Patient Referral
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TPCreateNF;