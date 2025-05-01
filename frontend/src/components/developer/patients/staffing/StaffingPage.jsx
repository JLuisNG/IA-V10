import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../components/login/AuthContext';
import logoImg from '../../../../assets/LogoMHC.jpeg';
import '../../../../styles/developer/Patients/Staffing/StaffingPage.scss';
import PremiumTabs from '../Patients/PremiunTabs.jsx';
import AddStaffForm from './AddStaffForm';
import StaffListComponent from './StaffListComponent';
import StaffEditComponent from './StaffEditComponent';
import LogoutAnimation from '../../../../components/LogOut/LogOut';

const DevStaffingPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuTransitioning, setMenuTransitioning] = useState(false);
  const [showMenuSwitch, setShowMenuSwitch] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [showStaffList, setShowStaffList] = useState(false);
  const [showStaffEdit, setShowStaffEdit] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const userMenuRef = useRef(null);

  function getInitials(name) {
    if (!name) return "U";
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  const userData = {
    name: currentUser?.fullname || currentUser?.username || 'Usuario',
    avatar: getInitials(currentUser?.fullname || currentUser?.username || 'Usuario'),
    email: currentUser?.email || 'usuario@ejemplo.com',
    role: currentUser?.role || 'Usuario',
    status: 'online',
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleMainMenuTransition = () => {
    if (isLoggingOut) return;

    setMenuTransitioning(true);
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';

    setTimeout(() => {
      navigate(`/${baseRole}/homePage`);
    }, 300);
  };

  const handleTabChange = (tab) => {
    if (isLoggingOut) return;

    if (tab === 'Patients') {
      setMenuTransitioning(true);
      const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';

      setTimeout(() => {
        navigate(`/${baseRole}/patients`);
      }, 300);
    }
  };

  const handleOptionSelect = (option) => {
    if (isLoggingOut) return;

    setSelectedOption(option);
    setShowAddStaffForm(false);
    setShowStaffList(false);
    setShowStaffEdit(false);
  };

  const handleAddStaffClick = (e) => {
    if (isLoggingOut) return;
    if (e) e.stopPropagation();

    setSelectedOption('therapists');
    setShowAddStaffForm(true);
    setShowStaffList(false);
    setShowStaffEdit(false);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
    document.body.classList.add('logging-out');
  };

  const handleLogoutAnimationComplete = () => {
    logout();
    navigate('/');
  };

  const notificationCount = 5;

  const handleViewAllStaffClick = (e) => {
    if (isLoggingOut) return;
    if (e) e.stopPropagation();

    setSelectedOption('therapists');
    setShowStaffList(true);
    setShowAddStaffForm(false);
    setShowStaffEdit(false);
  };

  const handleEditStaffClick = (e) => {
    if (isLoggingOut) return;
    if (e) e.stopPropagation();

    setSelectedOption('therapists');
    setShowStaffEdit(true);
    setShowAddStaffForm(false);
    setShowStaffList(false);
  };

  const handleCancelForm = () => {
    if (isLoggingOut) return;

    setShowAddStaffForm(false);
    setShowStaffList(false);
    setShowStaffEdit(false);
  };

  const handleBackToOptions = () => {
    if (isLoggingOut) return;

    setShowStaffList(false);
    setShowAddStaffForm(false);
    setShowStaffEdit(false);
  };

  // Datos simulados para las estadísticas (en un escenario real, vendrían de una API o del estado)
  const staffList = [
    { role: 'pt' },
    { role: 'pta' },
    { role: 'ot' },
    { role: 'administrator' },
    { role: 'support' },
    // Agrega más datos simulados si es necesario
  ];

  const therapistCounts = {
    PT: staffList.filter(staff => staff.role === 'pt').length,
    PTA: staffList.filter(staff => staff.role === 'pta').length,
    OT: staffList.filter(staff => staff.role === 'ot').length,
    COTA: staffList.filter(staff => staff.role === 'cota').length,
    ST: staffList.filter(staff => staff.role === 'st').length,
    STA: staffList.filter(staff => staff.role === 'sta').length,
  };

  const totalTherapists = Object.values(therapistCounts).reduce((sum, count) => sum + count, 0);

  const internalStaffCounts = {
    Admin: staffList.filter(staff => staff.role === 'administrator').length,
    Agency: staffList.filter(staff => staff.role === 'agency').length,
    Support: staffList.filter(staff => staff.role === 'support').length,
    Developer: staffList.filter(staff => staff.role === 'developer').length,
  };

  const totalInternalStaff = Object.values(internalStaffCounts).reduce((sum, count) => sum + count, 0);

  const monthlyIncorporations = {
    currentMonth: 0,
    previousMonth: 100,
  };

  let incorporationChange = 0;
  let changeDirection = '';
  if (monthlyIncorporations.previousMonth === 0) {
    incorporationChange = monthlyIncorporations.currentMonth > 0 ? 100 : 0;
    changeDirection = monthlyIncorporations.currentMonth > 0 ? 'increase' : 'no-change';
  } else {
    incorporationChange = Math.round(
      ((monthlyIncorporations.currentMonth - monthlyIncorporations.previousMonth) / monthlyIncorporations.previousMonth) * 100
    );
    changeDirection = incorporationChange > 0 ? 'increase' : incorporationChange < 0 ? 'decrease' : 'no-change';
  }

  const handleNavigateToCreateReferral = () => {
    if (isLoggingOut) return;
    navigate('/developer/referrals', { state: { initialView: 'createReferral' } });
  };

  return (
    <div className={`staffing-dashboard ${menuTransitioning ? 'transitioning' : ''} ${isLoggingOut ? 'logging-out' : ''}`}>
      {isLoggingOut && (
        <LogoutAnimation 
          isMobile={isMobile} 
          onAnimationComplete={handleLogoutAnimationComplete} 
        />
      )}
      
      <div className="parallax-background">
        <div className="gradient-overlay"></div>
        <div className="animated-particles"></div>
      </div>
      
      {showMenuSwitch && !isLoggingOut && (
        <div 
          className="menu-switch-indicator"
          onClick={handleMainMenuTransition}
          title="Back to main menu"
        >
          <i className="fas fa-chevron-left"></i>
        </div>
      )}
      
      <header className={`main-header ${isLoggingOut ? 'logging-out' : ''}`}>
        <div className="header-container">
          <div className="logo-container">
            <div className="logo-wrapper">
              <img src={logoImg} alt="TherapySync Logo" className="logo" />
              <div className="logo-glow"></div>
            </div>
            
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
                className="nav-button staffing-menu active" 
                title="Staffing Menu"
                disabled={isLoggingOut}
              >
                <i className="fas fa-user-md"></i>
                <span>Staffing</span>
                <div className="button-effect"></div>
              </button>
            </div>
          </div>
          
          <div className="tabs-section">
            <PremiumTabs activeTab="Staffing" onTabChange={handleTabChange} />
          </div>
          
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
      
      <main className={`staffing-content ${isLoggingOut ? 'fade-out' : ''}`}>
        <div className="staffing-container">
          <div className="staffing-header">
            <div className="staffing-title-container">
              <h1 className="staffing-title">Staffing Management Center</h1>
              <p className="staffing-subtitle">
                Manage your therapy team, track performance and optimize schedules
              </p>
              <div className="header-actions">
                <button className="header-action-btn" disabled={isLoggingOut}>
                  <i className="fas fa-info-circle"></i> Quick Tour
                </button>
                <button 
                  className="header-action-btn"
                  onClick={handleAddStaffClick}
                  disabled={isLoggingOut}
                >
                  <i className="fas fa-plus"></i> New Staff Member
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

          <div className="staffing-options">
            <div 
              className={`staffing-option-card ${selectedOption === 'therapists' ? 'selected' : ''}`}
              onClick={() => handleOptionSelect('therapists')}
            >
              <div className="option-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="option-content">
                <h3>Therapists & Office Staff</h3>
                <p>Add or edit therapist and office staff users</p>
                <div className="option-actions">
                  <button 
                    className="option-btn" 
                    onClick={(e) => handleViewAllStaffClick(e)}
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-eye"></i> View All
                  </button>
                  <button 
                    className="option-btn" 
                    onClick={(e) => handleAddStaffClick(e)}
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-plus"></i> Add New
                  </button>
                </div>
              </div>
              <div className="option-glow"></div>
              <div className="option-bg-icon">
                <i className="fas fa-user-md"></i>
              </div>
            </div>
            
           
          </div>
          
          {/* Nueva sección de estadísticas */}
          <div className="stats-container">
            <h2>Staffing Overview</h2>
            <div className="staffing-stats">
              {/* Total Therapists con desglose */}
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h3 className="stat-value">{totalTherapists}</h3>
                  <p>Total Therapists</p>
                  <div className="therapist-breakdown">
                    <span>PT: {therapistCounts.PT}</span>
                    <span>PTA: {therapistCounts.PTA}</span>
                    <span>OT: {therapistCounts.OT}</span>
                    <span>COTA: {therapistCounts.COTA}</span>
                    <span>ST: {therapistCounts.ST}</span>
                    <span>STA: {therapistCounts.STA}</span>
                  </div>
                </div>
              </div>

              {/* Incorporación mensual */}
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="stat-info">
                  <h3 className="stat-value">{monthlyIncorporations.currentMonth}</h3>
                  <p>Monthly Incorporations</p>
                  <div className={`change-indicator ${changeDirection}`}>
                    {changeDirection !== 'no-change' ? (
                      <>
                        {Math.abs(incorporationChange)}% {changeDirection === 'increase' ? '↑' : '↓'}
                      </>
                    ) : (
                      'No Change'
                    )}
                  </div>
                </div>
              </div>

              {/* Personal interno */}
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="stat-info">
                  <h3 className="stat-value">{totalInternalStaff}</h3>
                  <p>Internal Staff</p>
                  <div className="internal-staff-breakdown">
                    <span>Admin: {internalStaffCounts.Admin}</span>
                    <span>Agency: {internalStaffCounts.Agency}</span>
                    <span>Support: {internalStaffCounts.Support}</span>
                    <span>Developer: {internalStaffCounts.Developer}</span>
                  </div>
                </div>
              </div>

              {/* Botón para crear un nuevo paciente */}
              <div className="stat-card action-card" onClick={handleNavigateToCreateReferral}>
                <div className="stat-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="stat-info">
                  <h3 className="stat-value">Create Patient</h3>
                  <p>Start a new patient referral</p>
                </div>
              </div>
            </div>
          </div>
          
          {selectedOption === 'therapists' && showAddStaffForm ? (
            <AddStaffForm onCancel={handleCancelForm} />
          ) : selectedOption === 'therapists' && showStaffList ? (
            <StaffListComponent onBackToOptions={handleBackToOptions} />
          ) : selectedOption === 'therapists' && showStaffEdit ? (
            <StaffEditComponent onBackToOptions={handleBackToOptions} />
          ) : (
            <div className="selected-content-area">
              {selectedOption && (
                <div className="selected-content-card">
                  <div className="content-header">
                    <h2>
                      {selectedOption === 'therapists' ? 'Therapists & Office Staff' : 'Scheduling & Assignments'}
                    </h2>
                    <p>
                      {selectedOption === 'therapists' 
                        ? 'View and manage your therapy and office staff team members.' 
                        : 'Manage scheduling and patient assignments for your therapy team.'}
                    </p>
                  </div>
                  
                  <div className="content-body">
                    <div className="placeholder-content">
                      <i className={`fas fa-${selectedOption === 'therapists' ? 'users' : 'calendar-alt'}`}></i>
                      <p>Select an action to continue with {selectedOption === 'therapists' ? 'staff management' : 'scheduling'}</p>
                      
                      {selectedOption === 'therapists' && (
                        <div className="action-buttons">
                          <button 
                            className="action-btn add" 
                            onClick={(e) => handleAddStaffClick(e)}
                            disabled={isLoggingOut}
                          >
                            <i className="fas fa-user-plus"></i> Add New Staff
                          </button>
                          <button 
                            className="action-btn view" 
                            onClick={(e) => handleViewAllStaffClick(e)}
                            disabled={isLoggingOut}
                          >
                            <i className="fas fa-list"></i> View All Staff
                          </button>
                          <button 
                            className="action-btn edit" 
                            onClick={(e) => handleEditStaffClick(e)}
                            disabled={isLoggingOut}
                          >
                            <i className="fas fa-user-edit"></i> Edit Existing Staff
                          </button>
                        </div>
                      )}
                      
                      {selectedOption === 'scheduling' && (
                        <div className="action-buttons">
                          <button className="action-btn calendar" disabled={isLoggingOut}>
                            <i className="fas fa-calendar-plus"></i> Create New Schedule
                          </button>
                          <button className="action-btn view" disabled={isLoggingOut}>
                            <i className="fas fa-calendar-week"></i> View Calendar
                          </button>
                          <button className="action-btn assign" disabled={isLoggingOut}>
                            <i className="fas fa-user-check"></i> Assign Patients
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {!selectedOption && (
                <div className="welcome-select-message">
                  <i className="fas fa-hand-point-up"></i>
                  <h3>Please Select an Option Above</h3>
                  <p>Choose "Therapists & Office Staff" or "Scheduling & Assignments" to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {!isLoggingOut && (
        <div className="quick-action-btn">
          <button 
            className="add-staff-btn" 
            onClick={(e) => handleAddStaffClick(e)}
            disabled={isLoggingOut}
          >
            <i className="fas fa-plus"></i>
            <span className="btn-tooltip">Add New Staff</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DevStaffingPage;