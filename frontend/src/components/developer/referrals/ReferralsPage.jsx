import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/login/AuthContext';
import '../../../styles/developer/Referrals/ReferralsPage.scss';
import '../../../styles/developer/Referrals/IntegratedReferralStyles.scss';
import logoImg from '../../../assets/LogoMHC.jpeg';
import LogoutAnimation from '../../../components/LogOut/LogOut';
import CustomDatePicker from './CreateNF/DatePicker';
import DOBDatePicker from './CreateNF/DOBDatePicker';
import LoadingScreen from './CreateNF/LoadingDates';
import ReferralStats from './ReferralStats';

const DevReferralsPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // State for UI controls
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuTransitioning, setMenuTransitioning] = useState(false);
  const [parallaxPosition, setParallaxPosition] = useState({ x: 0, y: 0 });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for view management
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'createReferral', 'stats'
  const [referralFormLoading, setReferralFormLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Refs for elements
  const userMenuRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Form data state with added weight and height fields
  const [formData, setFormData] = useState({
    // Patient personal data
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
    weight: '',
    weightUnit: 'lbs', // Default unit for weight
    height: '',
    heightUnit: 'ft', // Default unit for height
    
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
  
  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // State for disciplines selection
  const [selectedDisciplines, setSelectedDisciplines] = useState({
    PT: false,
    PTA: false,
    OT: false,
    COTA: false,
    ST: false,
    STA: false
  });
  
  // State for therapist selection
  const [selectedTherapists, setSelectedTherapists] = useState({
    PT: null,
    PTA: null,
    OT: null,
    COTA: null,
    ST: null,
    STA: null
  });
  
  // State for adding new nurse manager
  const [addingNewManager, setAddingNewManager] = useState(false);

  // Function to get initials from name
  function getInitials(name) {
    if (!name) return "U";
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  // User data from authentication context
  const userData = {
    name: currentUser?.fullname || currentUser?.username || 'User',
    avatar: getInitials(currentUser?.fullname || currentUser?.username || 'User'),
    email: currentUser?.email || 'user@example.com',
    role: currentUser?.role || 'User',
    status: 'online', // online, away, busy, offline
  };
  
  // Mock data for selects
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
  
  // Effect for simulating loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Effect for handling clicks outside user menu
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
  
  // Detect screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Effect to update certPeriodEnd based on certPeriodStart
  useEffect(() => {
    if (formData.certPeriodStart) {
      const startDate = new Date(formData.certPeriodStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 60);
      
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        certPeriodEnd: formattedEndDate
      }));
    }
  }, [formData.certPeriodStart]);
  
  // Handle logout with animation
  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
    
    document.body.classList.add('logging-out');
  };
  
  // Callback for when the logout animation completes
  const handleLogoutAnimationComplete = () => {
    logout();
    navigate('/');
  };
  
  // Handle navigation to main menu
  const handleMainMenuTransition = () => {
    if (isLoggingOut) return;
    
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    navigate(`/${baseRole}/homePage`);
  };

  // Handle starting create new referral process
  const handleStartCreateReferral = () => {
    if (isLoggingOut) return;
    
    setReferralFormLoading(true);
    setTimeout(() => {
      setCurrentView('createReferral');
      setReferralFormLoading(false);
    }, 1500);
  };

  // Handle navigation to referral stats
  const handleReferralStats = () => {
    if (isLoggingOut) return;
    
    setCurrentView('stats');
  };
  
  // Handle click on PDF upload area
  const handlePdfAreaClick = () => {
    if (isLoggingOut) return;
    fileInputRef.current.click();
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    if (isLoggingOut) return;
    
    const files = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
    
    if (files.length === 0) {
      alert('Please upload PDF files only.');
      return;
    }
    
    setUploadedFiles(files);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    if (isLoggingOut) return;
    
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle contact number changes-started here
  const handleContactNumberChange = (index, value) => {
    if (isLoggingOut) return;
    
    const updatedNumbers = [...formData.contactNumbers];
    updatedNumbers[index] = value;
    
    setFormData(prev => ({
      ...prev,
      contactNumbers: updatedNumbers
    }));
  };
  
  // Add a new contact number
  const addContactNumber = () => {
    if (isLoggingOut) return;
    
    setFormData(prev => ({
      ...prev,
      contactNumbers: [...prev.contactNumbers, '']
    }));
  };
  
  // Remove a contact number
  const removeContactNumber = (index) => {
    if (isLoggingOut) return;
    
    if (formData.contactNumbers.length > 1) {
      const updatedNumbers = [...formData.contactNumbers];
      updatedNumbers.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        contactNumbers: updatedNumbers
      }));
    }
  };
  
  // Handle physician selection
  const handlePhysicianChange = (e) => {
    if (isLoggingOut) return;
    
    const physicianId = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      physicianId,
      newPhysician: physicianId === 'new',
      newPhysicianName: ''
    }));
  };
  
  // Handle agency selection
  const handleAgencyChange = (e) => {
    if (isLoggingOut) return;
    
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

  // Handle nurse manager selection
  const handleNurseManagerChange = (e) => {
    if (isLoggingOut) return;
    
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
  
  // Handle homebound option changes
  const handleHomeboundChange = (optionId, isChecked) => {
    if (isLoggingOut) return;
    
    setFormData(prev => ({
      ...prev,
      homebound: {
        ...prev.homebound,
        [optionId]: isChecked
      }
    }));
  };
  
  // Handle reasons for referral changes
  const handleReasonChange = (reasonId, isChecked) => {
    if (isLoggingOut) return;
    
    setFormData(prev => ({
      ...prev,
      reasonsForReferral: {
        ...prev.reasonsForReferral,
        [reasonId]: isChecked
      }
    }));
  };
  
  // Handle discipline selection
  const handleDisciplineChange = (discipline) => {
    if (isLoggingOut) return;
    
    const updatedDisciplines = {
      ...selectedDisciplines,
      [discipline]: !selectedDisciplines[discipline]
    };
    
    setSelectedDisciplines(updatedDisciplines);
    
    const selectedDisciplinesList = Object.keys(updatedDisciplines).filter(key => updatedDisciplines[key]);
    
    setFormData(prev => ({
      ...prev,
      disciplines: selectedDisciplinesList
    }));
  };
  
  // Handle therapist selection
  const handleTherapistSelection = (discipline, therapistId) => {
    if (isLoggingOut) return;
    
    setSelectedTherapists(prev => ({
      ...prev,
      [discipline]: therapistId
    }));
  };
  
  // Validate that at least one discipline is selected
  const validateDisciplines = () => {
    return Object.values(selectedDisciplines).some(discipline => discipline);
  };
  
  // Get selected agency
  const getSelectedAgency = () => {
    return agencies.find(agency => agency.id.toString() === formData.agencyId);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLoggingOut) return;
    
    // Validate that at least one discipline is selected
    if (!validateDisciplines()) {
      alert('Please select at least one discipline (PT, PTA, OT, COTA, ST, or STA)');
      return;
    }
    
    // Validate that therapists are selected for all selected disciplines
    const hasAllTherapistsSelected = Object.keys(selectedDisciplines)
      .filter(discipline => selectedDisciplines[discipline])
      .every(discipline => selectedTherapists[discipline] !== null);
    
    if (!hasAllTherapistsSelected) {
      alert('Please select a therapist for each selected discipline');
      return;
    }
    
    // Validate weight and height
    if (formData.weight && isNaN(formData.weight)) {
      alert('Please enter a valid number for Weight');
      return;
    }
    if (formData.height && isNaN(formData.height)) {
      alert('Please enter a valid number for Height');
      return;
    }
    
    // Show loading screen
    setFormSubmitting(true);
    
    // Simulate backend processing
    console.log('Form data:', formData);
    console.log('Selected therapists:', selectedTherapists);
    console.log('Uploaded PDF files:', uploadedFiles);
    
    // Handle form submission success
    setTimeout(() => {
      setFormSubmitting(false);
      setCurrentView('menu');
    }, 2000);
  };

  // Cancel creating referral and go back to menu
  const handleCancelCreateReferral = () => {
    if (isLoggingOut) return;
    
    const hasFormData = Object.values(formData).some(value => {
      if (typeof value === 'string') return value !== '';
      if (Array.isArray(value)) return value.length > 0 && value[0] !== '';
      if (typeof value === 'object') return Object.values(value).some(v => v !== false && v !== '');
      return false;
    });
    
    if (hasFormData && !window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      return;
    }
    
    // Reset form and go back to menu
    setCurrentView('menu');
    
    // Reset form data
    setFormData({
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      address: '',
      city: '',
      zipCode: '',
      contactNumbers: [''],
      payorType: '',
      certPeriodStart: '',
      certPeriodEnd: '',
      urgencyLevel: 'normal',
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
      weight: '',
      weightUnit: 'lbs',
      height: '',
      heightUnit: 'ft',
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
    
    setSelectedDisciplines({
      PT: false,
      PTA: false,
      OT: false,
      COTA: false,
      ST: false,
      STA: false
    });
    
    setSelectedTherapists({
      PT: null,
      PTA: null,
      OT: null,
      COTA: null,
      ST: null,
      STA: null
    });
    
    setUploadedFiles([]);
  };

  // Homebound options
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

  // Prior Level of Function options
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

  // Reasons for Referral options
  const referralOptions = [
    { id: 'strength_balance', label: 'Decreased Strength / Balance' },
    { id: 'gait', label: 'Decreased Gait Ability' },
    { id: 'adls', label: 'ADLs' },
    { id: 'orthopedic', label: 'Orthopedic Operation' },
    { id: 'neurological', label: 'Neurological / Cognitive' },
    { id: 'wheelchair', label: 'Wheelchair Evaluation' }
  ];

  return (
    <div 
      className={`referrals-dashboard ${menuTransitioning ? 'transitioning' : ''} 
                  ${isLoggingOut ? 'logging-out' : ''} 
                  ${currentView === 'createReferral' ? 'form-active' : ''}`}
      ref={containerRef}
    >
      {/* Logout animation - Show only when logging out */}
      {isLoggingOut && (
        <LogoutAnimation 
          isMobile={isMobile} 
          onAnimationComplete={handleLogoutAnimationComplete} 
        />
      )}
      
      {/* Form submission loading screen */}
      {formSubmitting && (
        <LoadingScreen isLoading={true} onComplete={() => setFormSubmitting(false)} />
      )}
      
      {/* Parallax background */}
      <div 
        className="parallax-background"
        style={{ 
          transform: `scale(1.1) translate(${parallaxPosition.x}px, ${parallaxPosition.y}px)` 
        }}
      >
        <div className="gradient-overlay"></div>
      </div>
      
      {/* Header with logo and profile */}
      <header className={`main-header ${isLoggingOut ? 'logging-out' : ''}`}>
        <div className="header-container">
          {/* Logo with neon effect */}
          <div className="logo-container">
            <div className="logo-glow"></div>
            <img src={logoImg} alt="TherapySync Logo" className="logo" />
          </div>
          
          {/* Main navigation buttons */}
          <div className="menu-navigation">
            <button 
              className="nav-button main-menu" 
              onClick={handleMainMenuTransition}
              title="Back to main menu"
              disabled={isLoggingOut}
            >
              <i className="fas fa-th-large"></i>
              <span>Main Menu</span>
            </button>
            
            <button 
              className="nav-button referrals-menu active" 
              title="Referrals Menu"
              disabled={isLoggingOut}
            >
              <i className="fas fa-file-medical"></i>
              <span>Referrals</span>
            </button>
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
            
            {/* User dropdown menu */}
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
      
      {/* Main content */}
      <main className={`main-content ${isLoggingOut ? 'fade-out' : ''}`}>
        {/* Referral Form Loading Animation */}
        {referralFormLoading && (
          <div className="referral-form-loading">
            <div className="loading-container">
              <div className="loader-wrapper">
                <div className="loader-ring"></div>
                <div className="loader-pulse"></div>
                <div className="loader-icon">
                  <i className="fas fa-file-medical"></i>
                </div>
              </div>
              <p>Preparing referral form<span className="dots"><span>.</span><span>.</span><span>.</span></span></p>
            </div>
          </div>
        )}
        
        {/* Main Referrals Menu */}
        {currentView === 'menu' && !referralFormLoading && (
          <div className="referrals-container menu-container">
            <h1 className="referrals-title">Referral Management</h1>
            <p className="referrals-subtitle">Select an option from the menu below to manage referrals</p>
            
            {isLoading ? (
              <div className="loading-container">
                <div className="loader-wrapper">
                  <div className="loader-ring"></div>
                  <div className="loader-pulse"></div>
                  <div className="loader-icon">
                    <i className="fas fa-file-medical"></i>
                  </div>
                </div>
                <p>Loading referral options<span className="dots"><span>.</span><span>.</span><span>.</span></span></p>
              </div>
            ) : (
              <div className="options-container">
                <div className="option-card" onClick={handleStartCreateReferral}>
                  <div className="card-glow"></div>
                  <div className="option-icon-container">
                    <div className="icon-pulse"></div>
                    <i className="fas fa-file-medical"></i>
                    <div className="icon-badge">
                      <i className="fas fa-plus"></i>
                    </div>
                  </div>
                  <h2>Create New Referral</h2>
                  <div className="title-underline"></div>
                  <p>Create and submit a new patient referral form</p>
                  <div className="option-footer">
                    <button className="action-button">
                      <span>Get Started</span>
                      <div className="button-icon">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="option-card" onClick={handleReferralStats}>
                  <div className="card-glow stats-glow"></div>
                  <div className="option-icon-container stats">
                    <div className="icon-pulse stats-pulse"></div>
                    <i className="fas fa-chart-bar"></i>
                    <div className="mini-charts">
                      <div className="mini-chart"></div>
                      <div className="mini-chart"></div>
                      <div className="mini-chart"></div>
                    </div>
                  </div>
                  <h2>Referral Stats</h2>
                  <div className="title-underline stats-underline"></div>
                  <p>View statistics and history of all referrals</p>
                  <div className="option-footer">
                    <button className="action-button stats-button">
                      <span>View Stats</span>
                      <div className="button-icon">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Create Referral Form */}
        {currentView === 'createReferral' && !referralFormLoading && (
          <div className="create-referral-container">
            <div className="form-header">
              <div className="title-section">
                <h2>
                  <i className="fas fa-plus-circle"></i>
                  New Referral Information
                </h2>
                <p>Complete the form below to create a new patient referral</p>
              </div>
              <button 
                className="cancel-button" 
                onClick={handleCancelCreateReferral} 
                disabled={isLoggingOut}
              >
                <i className="fas fa-times"></i>
                <span>Cancel</span>
              </button>
            </div>
            
            {/* Patient Referral Form */}
            <form className="patient-referral-form" onSubmit={handleSubmit}>
              {/* Patient Information Section */}
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
              
              {/* Care Period Section */}
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
                            onChange={() => {}} // No manual changes allowed
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
              
              {/* Medical Information Section */}
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
                  
                  {/* Weight field with unit selection */}
                  <div className="form-group">
                    <label htmlFor="weight">Weight</label>
                    <div className="measurement-input">
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Enter weight"
                        min="0"
                        step="0.1"
                        disabled={isLoggingOut}
                      />
                      <select
                        name="weightUnit"
                        value={formData.weightUnit}
                        onChange={handleInputChange}
                        disabled={isLoggingOut}
                      >
                        <option value="lbs">lbs</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Height field with unit selection */}
                  <div className="form-group">
                    <label htmlFor="height">Height</label>
                    <div className="measurement-input">
                      <input
                        type="number"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="Enter height"
                        min="0"
                        step="0.1"
                        disabled={isLoggingOut}
                      />
                      <select
                        name="heightUnit"
                        value={formData.heightUnit}
                        onChange={handleInputChange}
                        disabled={isLoggingOut}
                      >
                        <option value="ft">ft</option>
                        <option value="cm">cm</option>
                      </select>
                    </div>
                    {formData.heightUnit === 'ft' && (
                      <small className="form-text text-muted">
                        Enter height in feet (e.g., 5.5 for 5 feet 6 inches)
                      </small>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Therapy Information Section */}
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

                          {/* PT Therapist selection */}
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

                          {/* PTA Therapist selection */}
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

                          {/* OT Therapist selection */}
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

                          {/* COTA Therapist selection */}
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

                          {/* ST Therapist selection */}
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

                          {/* STA Therapist selection */}
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
                        <p><i className="fas fa-info-circle"></i> At least one discipline must be selected (PT, PTA, OT, COTA, ST, or STA)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Documents Upload Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-file-pdf"></i>
                  <h3>Supporting Documents</h3>
                </div>

                <div className="document-upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".pdf"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isLoggingOut}
                  />
                  
                  <div 
                    className={`upload-zone ${uploadedFiles.length > 0 ? 'has-files' : ''}`} 
                    onClick={handlePdfAreaClick}
                  >
                    {uploadedFiles.length === 0 ? (
                      <>
                        <div className="upload-icon">
                          <i className="fas fa-cloud-upload-alt"></i>
                        </div>
                        <h4>Upload Patient Documents</h4>
                        <p>Click to upload or drag PDF files here</p>
                        <button type="button" className="browse-btn">
                          <i className="fas fa-folder-open"></i> Browse Files
                        </button>
                      </>
                    ) : (
                      <div className="uploaded-files">
                        <div className="files-header">
                          <div className="files-icon">
                            <i className="fas fa-file-pdf"></i>
                            <div className="files-count">{uploadedFiles.length}</div>
                          </div>
                          <h4>{uploadedFiles.length} {uploadedFiles.length === 1 ? 'File' : 'Files'} Selected</h4>
                        </div>
                        
                        <div className="file-list">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="file-item">
                              <i className="fas fa-file-pdf"></i>
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="upload-actions">
                          <button 
                            type="button" 
                            className="change-files-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current.click();
                            }}
                          >
                            <i className="fas fa-exchange-alt"></i> Change Files
                          </button>
                          <button 
                            type="button" 
                            className="clear-files-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFiles([]);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i> Clear Files
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="upload-guidelines">
                      <p><i className="fas fa-info-circle"></i> Supported formats: PDF only. Max file size: 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submit Section */}
              <div className="form-section submit-section">
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
            </form>
          </div>
        )}
        
        {/* Referral Stats */}
        {currentView === 'stats' && !referralFormLoading && (
          <div className="referrals-container stats-container">
            <div className="form-header">
              <div className="title-section">
                <h2>
                  <i className="fas fa-chart-bar"></i>
                  Referral Statistics
                </h2>
                <p>View and manage patient referrals and their change history</p>
              </div>
              <button 
                className="cancel-button" 
                onClick={() => setCurrentView('menu')} 
                disabled={isLoggingOut}
              >
                <i className="fas fa-times"></i>
                <span>Back to Menu</span>
              </button>
            </div>
            <ReferralStats />
          </div>
        )}
      </main>
    </div>
  );
};

export default DevReferralsPage;