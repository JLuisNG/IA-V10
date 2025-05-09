// components/developer/settings/SettingsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../../styles/settings/SettingsPage.scss';

const SettingsPage = () => {
  const navigate = useNavigate();
  const settingsRef = useRef(null);
  
  // Interface settings state
  const [settings, setSettings] = useState({
    // Dashboard display preferences
    dashboard: {
      showTotalPatients: true,
      showActivePatients: true,
      showDeactivatedPatients: true,
      showPendingPatients: true
    },
    // Financial display preferences
    financial: {
      defaultView: 'next', // 'next', 'total', 'pending'
    },
    // Filter preferences
    filters: {
      advancedFiltersExpanded: false,
      patientStatusFilters: ['active', 'deactive', 'pending', 'review']
    },
    // Layout preferences
    layout: {
      patientViewMode: 'cards', // 'cards', 'list'
      dashboardMetrics: 'detailed', // 'detailed', 'compact'
    },
    // Accessibility preferences
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      largerText: false,
      keyboardNavigationEnhanced: false,
    }
  });

  // Animation state for sections
  const [visibleSection, setVisibleSection] = useState('dashboard-section');
  const [animatingElements, setAnimatingElements] = useState([]);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error parsing saved settings:', e);
      }
    }
    
    // Initialize animations
    setTimeout(() => {
      setAnimatingElements(['header', 'sidebar', 'content']);
      
      // Animate each section with delay
      const sections = document.querySelectorAll('.settings-section');
      sections.forEach((section, index) => {
        setTimeout(() => {
          section.classList.add('animate-in');
        }, 200 + (index * 100));
      });
    }, 300);
    
    // Add scroll event listener for parallax effect
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Handle scroll effects
  const handleScroll = () => {
    if (settingsRef.current) {
      const scrollPosition = window.scrollY;
      const sections = settingsRef.current.querySelectorAll('.settings-section');
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const sectionId = section.id;
          setVisibleSection(sectionId);
          
          // Update active sidebar link
          const sidebarLinks = document.querySelectorAll('.settings-sidebar a');
          sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }
  };

  // Handle toggle changes for boolean settings
  const handleToggleChange = (section, setting) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [setting]: !prevSettings[section][setting]
      }
    }));
    
    // Add toggle animation
    const toggleElement = document.querySelector(`.toggle-${section}-${setting}`);
    if (toggleElement) {
      toggleElement.classList.add('pulse-animation');
      setTimeout(() => {
        toggleElement.classList.remove('pulse-animation');
      }, 600);
    }
  };

  // Handle selection changes for dropdown/radio settings
  const handleSelectChange = (section, setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [setting]: value
      }
    }));
    
    // Add selection animation
    const elementId = `${section}-${setting}-${value}`;
    setAnimatingElements(prev => [...prev, elementId]);
    setTimeout(() => {
      setAnimatingElements(prev => prev.filter(item => item !== elementId));
    }, 800);
  };

  // Handle multi-select changes (like patient status filters)
  const handleMultiSelectChange = (section, setting, value) => {
    setSettings(prevSettings => {
      const currentValues = prevSettings[section][setting];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];

      return {
        ...prevSettings,
        [section]: {
          ...prevSettings[section],
          [setting]: newValues
        }
      };
    });
  };

  // Reset all settings to default
  const handleResetSettings = () => {
    const confirmReset = () => {
      localStorage.removeItem('userSettings');
      
      // Add reset animation
      const settingsContent = document.querySelector('.settings-content');
      if (settingsContent) {
        settingsContent.classList.add('reset-animation');
        setTimeout(() => {
          settingsContent.classList.remove('reset-animation');
          window.location.reload();
        }, 800);
      } else {
        window.location.reload();
      }
    };
    
    // Custom confirmation modal animation
    const modal = document.createElement('div');
    modal.className = 'settings-confirm-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3><i class="fas fa-exclamation-triangle"></i> Reset Settings</h3>
        <p>Are you sure you want to reset all settings to default? This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="cancel-button"><i class="fas fa-times"></i> Cancel</button>
          <button class="confirm-button"><i class="fas fa-check"></i> Reset</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
      modal.classList.add('visible');
    }, 10);
    
    const cancelButton = modal.querySelector('.cancel-button');
    const confirmButton = modal.querySelector('.confirm-button');
    
    cancelButton.addEventListener('click', () => {
      modal.classList.remove('visible');
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    });
    
    confirmButton.addEventListener('click', () => {
      modal.classList.remove('visible');
      setTimeout(() => {
        document.body.removeChild(modal);
        confirmReset();
      }, 300);
    });
  };

  // Handle navigation back to home
  const handleBack = () => {
    // Add exit animation
    const settingsPage = document.querySelector('.settings-page');
    if (settingsPage) {
      settingsPage.classList.add('exit-animation');
      setTimeout(() => {
        navigate(-1);
      }, 400);
    } else {
      navigate(-1);
    }
  };

  // Handle save settings animation
  const handleSaveSettings = () => {
    const saveButton = document.querySelector('.save-button');
    if (saveButton) {
      saveButton.classList.add('save-animation');
      
      // Create and animate the success notification
      const notification = document.createElement('div');
      notification.className = 'save-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas fa-check-circle"></i>
          <span>Settings saved successfully</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('visible');
      }, 10);
      
      setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => {
          document.body.removeChild(notification);
          saveButton.classList.remove('save-animation');
        }, 300);
      }, 2000);
    }
  };

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="settings-page" ref={settingsRef}>
      <div className={`settings-backdrop ${animatingElements.includes('header') ? 'animate' : ''}`}></div>
      <div className={`settings-particles ${animatingElements.includes('particles') ? 'active' : ''}`}></div>
      
      <div className={`settings-header ${animatingElements.includes('header') ? 'animate' : ''}`}>
        <div className="back-button" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i>
          <span className="back-text">Back</span>
        </div>
        <div className="header-content">
          <h1><i className="fas fa-sliders-h"></i> Interface Settings</h1>
          <p>Customize your TherapySync experience to match your exact workflow preferences</p>
          <div className="header-decoration">
            <div className="header-line"></div>
          </div>
        </div>
      </div>

      <div className="settings-container">
        <div className={`settings-sidebar ${animatingElements.includes('sidebar') ? 'animate' : ''}`}>
          <div className="sidebar-avatar">
            <div className="avatar-image">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="avatar-info">
              <div className="avatar-name">Dr. TherapySync</div>
              <div className="avatar-role">Administrator</div>
            </div>
          </div>
          
          <ul className="sidebar-nav">
            <li>
              <a 
                href="#dashboard-section" 
                className={visibleSection === 'dashboard-section' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('dashboard-section');
                }}
              >
                <i className="fas fa-tachometer-alt"></i> 
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a 
                href="#financial-section" 
                className={visibleSection === 'financial-section' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('financial-section');
                }}
              >
                <i className="fas fa-chart-line"></i> 
                <span>Financial</span>
              </a>
            </li>
            <li>
              <a 
                href="#filters-section" 
                className={visibleSection === 'filters-section' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('filters-section');
                }}
              >
                <i className="fas fa-filter"></i> 
                <span>Filters & Search</span>
              </a>
            </li>
            <li>
              <a 
                href="#layout-section" 
                className={visibleSection === 'layout-section' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('layout-section');
                }}
              >
                <i className="fas fa-th-large"></i> 
                <span>Layout</span>
              </a>
            </li>
            <li>
              <a 
                href="#accessibility-section" 
                className={visibleSection === 'accessibility-section' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('accessibility-section');
                }}
              >
                <i className="fas fa-universal-access"></i> 
                <span>Accessibility</span>
              </a>
            </li>
            <li>
              <a 
                href="#advanced-section" 
                className={visibleSection === 'advanced-section' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('advanced-section');
                }}
              >
                <i className="fas fa-code"></i> 
                <span>Advanced</span>
              </a>
            </li>
          </ul>
          
          <div className="sidebar-footer">
            <button className="reset-button" onClick={handleResetSettings}>
              <div className="button-content">
                <i className="fas fa-undo-alt"></i>
                <span>Reset All Settings</span>
              </div>
              <div className="button-effect"></div>
            </button>
          </div>
        </div>

        <div className={`settings-content ${animatingElements.includes('content') ? 'animate' : ''}`}>
          {/* Dashboard Display Section */}
          <section id="dashboard-section" className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <div className="section-title">
                <h2>Dashboard Display</h2>
                <p>Configure which metrics and information appear on your dashboard</p>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-glass-effect"></div>
              
              <div className="card-header">
                <h3>Patient Statistics</h3>
                <div className="card-subtitle">Select which patient metrics to display on your dashboard</div>
              </div>
              
              <div className="settings-options">
                <div className="toggle-option">
                  <div className="option-label">
                    <i className="fas fa-users"></i>
                    <div className="label-text">
                      <span className="label-title">Total Patients</span>
                      <span className="label-description">Display the total number of patients in the system</span>
                    </div>
                  </div>
                  <div 
                    className={`toggle-switch toggle-dashboard-showTotalPatients ${settings.dashboard.showTotalPatients ? 'active' : ''}`}
                    onClick={() => handleToggleChange('dashboard', 'showTotalPatients')}
                  >
                    <div className="toggle-track">
                      <div className="toggle-indicator">
                        <div className="indicator-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="toggle-option">
                  <div className="option-label">
                    <i className="fas fa-user-check"></i>
                    <div className="label-text">
                      <span className="label-title">Active Patients</span>
                      <span className="label-description">Show currently active patients receiving treatment</span>
                    </div>
                  </div>
                  <div 
                    className={`toggle-switch toggle-dashboard-showActivePatients ${settings.dashboard.showActivePatients ? 'active' : ''}`}
                    onClick={() => handleToggleChange('dashboard', 'showActivePatients')}
                  >
                    <div className="toggle-track">
                      <div className="toggle-indicator">
                        <div className="indicator-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="toggle-option">
                  <div className="option-label">
                    <i className="fas fa-user-slash"></i>
                    <div className="label-text">
                      <span className="label-title">Deactivated Patients</span>
                      <span className="label-description">Display patients who are no longer active in the system</span>
                    </div>
                  </div>
                  <div 
                    className={`toggle-switch toggle-dashboard-showDeactivatedPatients ${settings.dashboard.showDeactivatedPatients ? 'active' : ''}`}
                    onClick={() => handleToggleChange('dashboard', 'showDeactivatedPatients')}
                  >
                    <div className="toggle-track">
                      <div className="toggle-indicator">
                        <div className="indicator-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="toggle-option">
                  <div className="option-label">
                    <i className="fas fa-user-clock"></i>
                    <div className="label-text">
                      <span className="label-title">Pending Patients</span>
                      <span className="label-description">Show patients waiting for approval or initial assessment</span>
                    </div>
                  </div>
                  <div 
                    className={`toggle-switch toggle-dashboard-showPendingPatients ${settings.dashboard.showPendingPatients ? 'active' : ''}`}
                    onClick={() => handleToggleChange('dashboard', 'showPendingPatients')}
                  >
                    <div className="toggle-track">
                      <div className="toggle-indicator">
                        <div className="indicator-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="example-display">
                <div className="example-header">
                  <h4>Preview</h4>
                  <div className="example-badge">Live Preview</div>
                </div>
                
                <div className="example-metrics">
                  {settings.dashboard.showTotalPatients && (
                    <div className="metric-card total">
                      <div className="metric-content">
                        <div className="metric-icon"><i className="fas fa-users"></i></div>
                        <div className="metric-details">
                          <div className="metric-value">142</div>
                          <div className="metric-label">Total Patients</div>
                        </div>
                      </div>
                      <div className="metric-decoration"></div>
                    </div>
                  )}
                  
                  {settings.dashboard.showActivePatients && (
                    <div className="metric-card active">
                      <div className="metric-content">
                        <div className="metric-icon"><i className="fas fa-user-check"></i></div>
                        <div className="metric-details">
                          <div className="metric-value">98</div>
                          <div className="metric-label">Active Patients</div>
                        </div>
                      </div>
                      <div className="metric-decoration"></div>
                    </div>
                  )}
                  
                  {settings.dashboard.showDeactivatedPatients && (
                    <div className="metric-card deactive">
                      <div className="metric-content">
                        <div className="metric-icon"><i className="fas fa-user-slash"></i></div>
                        <div className="metric-details">
                          <div className="metric-value">32</div>
                          <div className="metric-label">Deactivated Patients</div>
                        </div>
                      </div>
                      <div className="metric-decoration"></div>
                    </div>
                  )}
                  
                  {settings.dashboard.showPendingPatients && (
                    <div className="metric-card pending">
                      <div className="metric-content">
                        <div className="metric-icon"><i className="fas fa-user-clock"></i></div>
                        <div className="metric-details">
                          <div className="metric-value">12</div>
                          <div className="metric-label">Pending Patients</div>
                        </div>
                      </div>
                      <div className="metric-decoration"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Financial Display Section */}
          <section id="financial-section" className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="section-title">
                <h2>Financial Display</h2>
                <p>Customize how financial information is presented throughout the platform</p>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-glass-effect"></div>
              
              <div className="card-header">
                <h3>Default Financial View</h3>
                <div className="card-subtitle">Choose what financial data is displayed by default when you visit the financial section</div>
              </div>
              
              <div className="settings-options">
                <div className="radio-group">
                  <div 
                    className={`radio-option ${settings.financial.defaultView === 'next' ? 'active' : ''} ${animatingElements.includes('financial-defaultView-next') ? 'animating' : ''}`}
                    onClick={() => handleSelectChange('financial', 'defaultView', 'next')}
                    id="financial-defaultView-next"
                  >
                    <div className="radio-button">
                      <div className="radio-outer">
                        <div className="radio-inner"></div>
                      </div>
                    </div>
                    <div className="radio-content">
                      <div className="radio-label">
                        <i className="fas fa-calendar-alt"></i>
                        <span>Next Payment Cycle</span>
                      </div>
                      <div className="radio-description">Show expected earnings in the upcoming payment period</div>
                    </div>
                    <div className="option-highlight"></div>
                  </div>
                  
                  <div 
                    className={`radio-option ${settings.financial.defaultView === 'total' ? 'active' : ''} ${animatingElements.includes('financial-defaultView-total') ? 'animating' : ''}`}
                    onClick={() => handleSelectChange('financial', 'defaultView', 'total')}
                    id="financial-defaultView-total"
                  >
                    <div className="radio-button">
                      <div className="radio-outer">
                        <div className="radio-inner"></div>
                      </div>
                    </div>
                    <div className="radio-content">
                      <div className="radio-label">
                        <i className="fas fa-money-check-alt"></i>
                        <span>Total Payments</span>
                      </div>
                      <div className="radio-description">Display all-time earnings and comprehensive payment history</div>
                    </div>
                    <div className="option-highlight"></div>
                  </div>
                  
                  <div 
                    className={`radio-option ${settings.financial.defaultView === 'pending' ? 'active' : ''} ${animatingElements.includes('financial-defaultView-pending') ? 'animating' : ''}`}
                    onClick={() => handleSelectChange('financial', 'defaultView', 'pending')}
                    id="financial-defaultView-pending"
                  >
                    <div className="radio-button">
                      <div className="radio-outer">
                        <div className="radio-inner"></div>
                      </div>
                    </div>
                    <div className="radio-content">
                      <div className="radio-label">
                        <i className="fas fa-hourglass-half"></i>
                        <span>Pending Submissions</span>
                      </div>
                      <div className="radio-description">Show billable work that needs to be submitted for processing</div>
                    </div>
                    <div className="option-highlight"></div>
                  </div>
                </div>
              </div>
              
              <div className="example-display">
                <div className="example-header">
                  <h4>Preview</h4>
                  <div className="example-badge">Live Preview</div>
                </div>
                
                <div className="financial-preview">
                  {settings.financial.defaultView === 'next' && (
                    <div className="financial-card next-payment">
                      <div className="financial-card-content">
                        <div className="financial-header">
                          <div className="financial-title">Next Payment Cycle</div>
                          <div className="financial-period">August 15 - August 30, 2023</div>
                        </div>
                        
                        <div className="financial-amount">
                          <span className="currency">$</span>
                          <span className="value">4,850</span>
                        </div>
                        
                        <div className="financial-details">
                          <div className="detail-item">
                            <div className="detail-icon"><i className="fas fa-calendar-check"></i></div>
                            <div className="detail-content">
                              <div className="detail-label">Sessions</div>
                              <div className="detail-value">42</div>
                            </div>
                          </div>
                          
                          <div className="detail-item">
                            <div className="detail-icon"><i className="fas fa-clock"></i></div>
                            <div className="detail-content">
                              <div className="detail-label">Hours</div>
                              <div className="detail-value">37.5</div>
                            </div>
                          </div>
                          
                          <div className="detail-item">
                            <div className="detail-icon"><i className="fas fa-cogs"></i></div>
                            <div className="detail-content">
                              <div className="detail-label">Processing</div>
                              <div className="detail-value status">In Progress</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-decoration"></div>
                    </div>
                  )}
                  
                  {settings.financial.defaultView === 'total' && (
                    <div className="financial-card total-payments">
                      <div className="financial-card-content">
                        <div className="financial-header">
                          <div className="financial-title">Total Payments (2023)</div>
                          <div className="financial-period">January 1 - Present</div>
                        </div>
                        
                        <div className="financial-amount">
                          <span className="currency">$</span>
                          <span className="value">54,230</span>
                        </div>
                        
                        <div className="financial-details">
                          <div className="detail-item">
                            <div className="detail-icon"><i className="fas fa-calendar-check"></i></div>
                            <div className="detail-content">
                              <div className="detail-label">Sessions</div>
                              <div className="detail-value">487</div>
                            </div>
                          </div>
                          
                          <div className="detail-item">
                            <div className="detail-icon"><i className="fas fa-clock"></i></div>
                            <div className="detail-content">
                              <div className="detail-label">Hours</div>
                              <div className="detail-value">412.5</div>
                            </div>
                          </div>
                          
                          <div className="detail-item">
                            <div className="detail-icon"><i className="fas fa-chart-line"></i></div>
                            <div className="detail-content">
                              <div className="detail-label">YOY Change</div>
                              <div className="detail-value positive">+12.4%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-decoration"></div>
                    </div>
                  )}
                  
                  {settings.financial.defaultView === 'pending' && (
                    <div className="financial-card pending-submissions">
                      <div className="financial-card-content">
                        <div className="financial-header">
                          <div className="financial-title">Pending Submissions</div>
                          <div className="financial-period">Needs to be submitted by August 12, 2023</div>
                        </div>
                        
                        <div className="financial-amount">
                          <span className="currency">$</span>
                          <span className="value">1,820</span>
                        </div>
                        
                        <div className="financial-details">
                          <div className="detail-item">
                            <div className="detail-icon"><i className="fas fa-calendar-check"></i></div>
                            <div className="detail-content">
                              <div className="detail-label">Sessions</div>
                              <div className="detail-value">16</div>
                            </div>
                          </div>
                          
                          <div className="detail-item">
                            <div className="detail-icon"><i className="fas fa-clock"></i></div>
                            <div className="detail-content">
                              <div className="detail-label">Hours</div>
                              <div className="detail-value">14.0</div>
                            </div>
                          </div>
                          
                          <div className="detail-item urgent">
                            <div className="detail-icon"><i className="fas fa-exclamation-circle"></i></div>
                            <div className="detail-content">
                              <div className="detail-label">Status</div>
                              <div className="detail-value warning">Action Required</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-decoration"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Filters & Search Section */}
          <section id="filters-section" className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-filter"></i>
              </div>
              <div className="section-title">
                <h2>Filters & Search</h2>
                <p>Customize filter behavior and search options for optimal data exploration</p>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-glass-effect"></div>
              
              <div className="card-header">
              // Continuation of Filters Section
                <h3>Advanced Filters Behavior</h3>
                <div className="card-subtitle">Set how advanced filters appear when loading patient lists</div>
              </div>
              
              <div className="settings-options">
                <div className="toggle-option">
                  <div className="option-label">
                    <i className="fas fa-angle-down"></i>
                    <div className="label-text">
                      <span className="label-title">Expand Filters By Default</span>
                      <span className="label-description">Show all available filters when the page loads</span>
                    </div>
                  </div>
                  <div 
                    className={`toggle-switch toggle-filters-advancedFiltersExpanded ${settings.filters.advancedFiltersExpanded ? 'active' : ''}`}
                    onClick={() => handleToggleChange('filters', 'advancedFiltersExpanded')}
                  >
                    <div className="toggle-track">
                      <div className="toggle-indicator">
                        <div className="indicator-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-header mt-4">
                <h3>Patient Status Filters</h3>
                <div className="card-subtitle">Select which status filters to display in the filter section</div>
              </div>
              
              <div className="settings-options">
                <div className="checkbox-grid">
                  <div 
                    className={`checkbox-option ${settings.filters.patientStatusFilters.includes('active') ? 'active' : ''}`}
                    onClick={() => handleMultiSelectChange('filters', 'patientStatusFilters', 'active')}
                  >
                    <div className="checkbox">
                      <div className="checkbox-outer">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="checkbox-content">
                      <span className="status-badge active">Active</span>
                      <span className="checkbox-description">Patients currently in therapy</span>
                    </div>
                    <div className="option-highlight"></div>
                  </div>
                  
                  <div 
                    className={`checkbox-option ${settings.filters.patientStatusFilters.includes('deactive') ? 'active' : ''}`}
                    onClick={() => handleMultiSelectChange('filters', 'patientStatusFilters', 'deactive')}
                  >
                    <div className="checkbox">
                      <div className="checkbox-outer">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="checkbox-content">
                      <span className="status-badge deactive">Deactivated</span>
                      <span className="checkbox-description">Patients no longer in therapy</span>
                    </div>
                    <div className="option-highlight"></div>
                  </div>
                  
                  <div 
                    className={`checkbox-option ${settings.filters.patientStatusFilters.includes('pending') ? 'active' : ''}`}
                    onClick={() => handleMultiSelectChange('filters', 'patientStatusFilters', 'pending')}
                  >
                    <div className="checkbox">
                      <div className="checkbox-outer">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="checkbox-content">
                      <span className="status-badge pending">Pending</span>
                      <span className="checkbox-description">Patients awaiting approval</span>
                    </div>
                    <div className="option-highlight"></div>
                  </div>
                  
                  <div 
                    className={`checkbox-option ${settings.filters.patientStatusFilters.includes('review') ? 'active' : ''}`}
                    onClick={() => handleMultiSelectChange('filters', 'patientStatusFilters', 'review')}
                  >
                    <div className="checkbox">
                      <div className="checkbox-outer">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="checkbox-content">
                      <span className="status-badge review">Review</span>
                      <span className="checkbox-description">Patients needing clinical review</span>
                    </div>
                    <div className="option-highlight"></div>
                  </div>
                </div>
              </div>
              
              <div className="example-display">
                <div className="example-header">
                  <h4>Preview</h4>
                  <div className="example-badge">Live Preview</div>
                </div>
                
                <div className="filters-preview">
                  <div className="filters-container">
                    <div className="filters-toolbar">
                      <div className="toolbar-title">
                        <i className="fas fa-filter"></i>
                        <span>Patient Status</span>
                      </div>
                      <div className="toolbar-actions">
                        <button className="action-button clear">
                          <i className="fas fa-times-circle"></i>
                          <span>Clear All</span>
                        </button>
                        <button className="action-button expand">
                          <i className={`fas ${settings.filters.advancedFiltersExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="filters-body">
                      {settings.filters.patientStatusFilters.includes('active') && (
                        <div className="filter-pill active">
                          <span className="pill-text">Active</span>
                          <i className="fas fa-times"></i>
                        </div>
                      )}
                      
                      {settings.filters.patientStatusFilters.includes('deactive') && (
                        <div className="filter-pill deactive">
                          <span className="pill-text">Deactivated</span>
                          <i className="fas fa-times"></i>
                        </div>
                      )}
                      
                      {settings.filters.patientStatusFilters.includes('pending') && (
                        <div className="filter-pill pending">
                          <span className="pill-text">Pending</span>
                          <i className="fas fa-times"></i>
                        </div>
                      )}
                      
                      {settings.filters.patientStatusFilters.includes('review') && (
                        <div className="filter-pill review">
                          <span className="pill-text">Review</span>
                          <i className="fas fa-times"></i>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="filters-expanded" style={{display: settings.filters.advancedFiltersExpanded ? 'block' : 'none'}}>
                    <div className="expanded-header">Advanced Filters</div>
                    <div className="expanded-content">
                      <div className="filter-group">
                        <div className="filter-label">Insurance</div>
                        <div className="filter-options">
                          <div className="option-chip">Medicare</div>
                          <div className="option-chip">Medicaid</div>
                          <div className="option-chip">Blue Cross</div>
                          <div className="option-chip">Aetna</div>
                        </div>
                      </div>
                      
                      <div className="filter-group">
                        <div className="filter-label">Therapy Type</div>
                        <div className="filter-options">
                          <div className="option-chip">Physical</div>
                          <div className="option-chip">Occupational</div>
                          <div className="option-chip">Speech</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Layout Section */}
          <section id="layout-section" className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-th-large"></i>
              </div>
              <div className="section-title">
                <h2>Layout</h2>
                <p>Configure how content is presented throughout your workflow</p>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-glass-effect"></div>
              
              <div className="card-header">
                <h3>Patient View Mode</h3>
                <div className="card-subtitle">Select your preferred way to view patient information</div>
              </div>
              
              <div className="settings-options">
                <div className="view-mode-options">
                  <div 
                    className={`view-mode-option ${settings.layout.patientViewMode === 'cards' ? 'active' : ''} ${animatingElements.includes('layout-patientViewMode-cards') ? 'animating' : ''}`}
                    onClick={() => handleSelectChange('layout', 'patientViewMode', 'cards')}
                    id="layout-patientViewMode-cards"
                  >
                    <div className="option-icon-container">
                      <div className="option-icon">
                        <i className="fas fa-th-large"></i>
                      </div>
                      <div className="option-shine"></div>
                    </div>
                    <div className="option-label">Cards</div>
                    <div className="option-description">Visual card-based layout with patient details</div>
                  </div>
                  
                  <div 
                    className={`view-mode-option ${settings.layout.patientViewMode === 'list' ? 'active' : ''} ${animatingElements.includes('layout-patientViewMode-list') ? 'animating' : ''}`}
                    onClick={() => handleSelectChange('layout', 'patientViewMode', 'list')}
                    id="layout-patientViewMode-list"
                  >
                    <div className="option-icon-container">
                      <div className="option-icon">
                        <i className="fas fa-list"></i>
                      </div>
                      <div className="option-shine"></div>
                    </div>
                    <div className="option-label">List</div>
                    <div className="option-description">Compact row-based table layout</div>
                  </div>
                </div>
              </div>
              
              <div className="card-header mt-4">
                <h3>Dashboard Metrics Display</h3>
                <div className="card-subtitle">Choose how detailed your dashboard metrics should be</div>
              </div>
              
              <div className="settings-options">
                <div className="radio-group layout-radio">
                  <div 
                    className={`radio-option ${settings.layout.dashboardMetrics === 'detailed' ? 'active' : ''} ${animatingElements.includes('layout-dashboardMetrics-detailed') ? 'animating' : ''}`}
                    onClick={() => handleSelectChange('layout', 'dashboardMetrics', 'detailed')}
                    id="layout-dashboardMetrics-detailed"
                  >
                    <div className="radio-button">
                      <div className="radio-outer">
                        <div className="radio-inner"></div>
                      </div>
                    </div>
                    <div className="radio-content">
                      <div className="radio-label">
                        <i className="fas fa-chart-pie"></i>
                        <span>Detailed Metrics</span>
                      </div>
                      <div className="radio-description">Show comprehensive statistics with additional data points and trends</div>
                    </div>
                    <div className="option-highlight"></div>
                  </div>
                  
                  <div 
                    className={`radio-option ${settings.layout.dashboardMetrics === 'compact' ? 'active' : ''} ${animatingElements.includes('layout-dashboardMetrics-compact') ? 'animating' : ''}`}
                    onClick={() => handleSelectChange('layout', 'dashboardMetrics', 'compact')}
                    id="layout-dashboardMetrics-compact"
                  >
                    <div className="radio-button">
                      <div className="radio-outer">
                        <div className="radio-inner"></div>
                      </div>
                    </div>
                    <div className="radio-content">
                      <div className="radio-label">
                        <i className="fas fa-compress-alt"></i>
                        <span>Compact Metrics</span>
                      </div>
                      <div className="radio-description">Display simplified key metrics for a cleaner dashboard</div>
                    </div>
                    <div className="option-highlight"></div>
                  </div>
                </div>
              </div>
              
              <div className="example-display">
                <div className="example-header">
                  <h4>Preview</h4>
                  <div className="example-badge">Live Preview</div>
                </div>
                
                <div className="layout-preview">
                  {settings.layout.patientViewMode === 'cards' && (
                    <div className="cards-preview">
                      <div className="patient-card">
                        <div className="patient-card-header">
                          <div className="patient-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div className="patient-info">
                            <div className="patient-name">John Smith</div>
                            <div className="patient-status active">Active</div>
                          </div>
                          <div className="patient-actions">
                            <button className="action-icon">
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                          </div>
                        </div>
                        <div className="patient-card-body">
                          <div className="patient-details">
                            <div className="detail">
                              <i className="fas fa-user-md"></i>
                              <span className="detail-text">PT: Dr. Reynolds</span>
                            </div>
                            <div className="detail">
                              <i className="fas fa-phone"></i>
                              <span className="detail-text">(555) 123-4567</span>
                            </div>
                            <div className="detail">
                              <i className="fas fa-calendar"></i>
                              <span className="detail-text">Next: Aug 15</span>
                            </div>
                          </div>
                        </div>
                        <div className="patient-card-footer">
                          <button className="action-button">
                            <i className="fas fa-file-medical"></i>
                            <span>View Records</span>
                          </button>
                          <button className="action-button">
                            <i className="fas fa-calendar-plus"></i>
                            <span>Schedule</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="patient-card">
                        <div className="patient-card-header">
                          <div className="patient-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div className="patient-info">
                            <div className="patient-name">Maria Garcia</div>
                            <div className="patient-status pending">Pending</div>
                          </div>
                          <div className="patient-actions">
                            <button className="action-icon">
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                          </div>
                        </div>
                        <div className="patient-card-body">
                          <div className="patient-details">
                            <div className="detail">
                              <i className="fas fa-user-md"></i>
                              <span className="detail-text">OT: Dr. Lee</span>
                            </div>
                            <div className="detail">
                              <i className="fas fa-phone"></i>
                              <span className="detail-text">(555) 987-6543</span>
                            </div>
                            <div className="detail">
                              <i className="fas fa-calendar"></i>
                              <span className="detail-text">Next: TBD</span>
                            </div>
                          </div>
                        </div>
                        <div className="patient-card-footer">
                          <button className="action-button">
                            <i className="fas fa-file-medical"></i>
                            <span>View Records</span>
                          </button>
                          <button className="action-button">
                            <i className="fas fa-calendar-plus"></i>
                            <span>Schedule</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {settings.layout.patientViewMode === 'list' && (
                    <div className="list-preview">
                      <table className="patient-table">
                        <thead>
                          <tr>
                            <th className="column-name">Name</th>
                            <th className="column-status">Status</th>
                            <th className="column-provider">Provider</th>
                            <th className="column-contact">Contact</th>
                            <th className="column-appointment">Next Appt.</th>
                            <th className="column-actions">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="column-name">
                              <div className="patient-name-cell">
                                <div className="patient-avatar">
                                  <i className="fas fa-user"></i>
                                </div>
                                <span>John Smith</span>
                              </div>
                            </td>
                            <td className="column-status">
                              <span className="status active">Active</span>
                            </td>
                            <td className="column-provider">PT: Dr. Reynolds</td>
                            <td className="column-contact">(555) 123-4567</td>
                            <td className="column-appointment">Aug 15</td>
                            <td className="column-actions">
                              <div className="action-buttons">
                                <button className="action-icon">
                                  <i className="fas fa-file-medical"></i>
                                </button>
                                <button className="action-icon">
                                  <i className="fas fa-calendar-plus"></i>
                                </button>
                                <button className="action-icon">
                                  <i className="fas fa-ellipsis-v"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="column-name">
                              <div className="patient-name-cell">
                                <div className="patient-avatar">
                                  <i className="fas fa-user"></i>
                                </div>
                                <span>Maria Garcia</span>
                              </div>
                            </td>
                            <td className="column-status">
                              <span className="status pending">Pending</span>
                            </td>
                            <td className="column-provider">OT: Dr. Lee</td>
                            <td className="column-contact">(555) 987-6543</td>
                            <td className="column-appointment">TBD</td>
                            <td className="column-actions">
                              <div className="action-buttons">
                                <button className="action-icon">
                                  <i className="fas fa-file-medical"></i>
                                </button>
                                <button className="action-icon">
                                  <i className="fas fa-calendar-plus"></i>
                                </button>
                                <button className="action-icon">
                                  <i className="fas fa-ellipsis-v"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Accessibility Section */}
          <section id="accessibility-section" className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-universal-access"></i>
              </div>
              <div className="section-title">
                <h2>Accessibility</h2>
                <p>Customize features to make TherapySync more accessible for all users</p>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-glass-effect"></div>
              
              <div className="card-header">
                <h3>Visual Preferences</h3>
                <div className="card-subtitle">Customize visual aspects of the interface</div>
              </div>
              
              <div className="settings-options">
                <div className="toggle-option">
                  <div className="option-label">
                    <i className="fas fa-low-vision"></i>
                    <div className="label-text">
                      <span className="label-title">High Contrast Mode</span>
                      <span className="label-description">Increase contrast for better visibility</span>
                    </div>
                  </div>
                  <div 
                    className={`toggle-switch toggle-accessibility-highContrast ${settings.accessibility.highContrast ? 'active' : ''}`}
                    onClick={() => handleToggleChange('accessibility', 'highContrast')}
                  >
                    <div className="toggle-track">
                      <div className="toggle-indicator">
                        <div className="indicator-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="toggle-option">
                  <div className="option-label">
                    <i className="fas fa-text-height"></i>
                    <div className="label-text">
                      <span className="label-title">Larger Text</span>
                      <span className="label-description">Increase text size throughout the application</span>
                    </div>
                  </div>
                  <div 
                    className={`toggle-switch toggle-accessibility-largerText ${settings.accessibility.largerText ? 'active' : ''}`}
                    onClick={() => handleToggleChange('accessibility', 'largerText')}
                  >
                    <div className="toggle-track">
                      <div className="toggle-indicator">
                        <div className="indicator-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-header mt-4">
                <h3>Motion & Navigation</h3>
                <div className="card-subtitle">Configure motion and navigation settings</div>
              </div>
              
              <div className="settings-options">
                <div className="toggle-option">
                  <div className="option-label">
                    <i className="fas fa-walking"></i>
                    <div className="label-text">
                      <span className="label-title">Reduced Motion</span>
                      <span className="label-description">Minimize animations and transitions</span>
                    </div>
                  </div>
                  <div 
                    className={`toggle-switch toggle-accessibility-reducedMotion ${settings.accessibility.reducedMotion ? 'active' : ''}`}
                    onClick={() => handleToggleChange('accessibility', 'reducedMotion')}
                  >
                    <div className="toggle-track">
                      <div className="toggle-indicator">
                        <div className="indicator-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="toggle-option">
                  <div className="option-label">
                    <i className="fas fa-keyboard"></i>
                    <div className="label-text">
                      <span className="label-title">Enhanced Keyboard Navigation</span>
                      <span className="label-description">Improve keyboard focus and shortcuts</span>
                    </div>
                  </div>
                  <div 
                    className={`toggle-switch toggle-accessibility-keyboardNavigationEnhanced ${settings.accessibility.keyboardNavigationEnhanced ? 'active' : ''}`}
                    onClick={() => handleToggleChange('accessibility', 'keyboardNavigationEnhanced')}
                  >
                    <div className="toggle-track">
                      <div className="toggle-indicator">
                        <div className="indicator-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="example-display">
                <div className="example-header">
                  <h4>Demonstration</h4>
                  <div className="example-badge">Interactive</div>
                </div>
                
                <div className="accessibility-preview">
                  <div className={`preview-card ${settings.accessibility.largerText ? 'large-text' : ''} ${settings.accessibility.highContrast ? 'high-contrast' : ''}`}>
                    <div className="preview-header">
                      <h5>Patient Overview</h5>
                      <p>Sample interface with your accessibility settings</p>
                    </div>
                    
                    <div className="preview-content">
                      <div className="preview-metric">
                        <div className="metric-number">98</div>
                        <div className="metric-label">Active Patients</div>
                      </div>
                      
                      <div className={`preview-button ${settings.accessibility.reducedMotion ? 'reduced-motion' : ''}`}>
                        <i className="fas fa-plus"></i>
                        <span>Add New Patient</span>
                      </div>
                      
                      <div className={`preview-menu ${settings.accessibility.keyboardNavigationEnhanced ? 'keyboard-enhanced' : ''}`}>
                        <div className="menu-item" tabIndex={settings.accessibility.keyboardNavigationEnhanced ? 0 : -1}>
                          <i className="fas fa-user"></i>
                          <span>Patient Profile</span>
                        </div>
                        <div className="menu-item" tabIndex={settings.accessibility.keyboardNavigationEnhanced ? 0 : -1}>
                          <i className="fas fa-calendar"></i>
                          <span>Appointments</span>
                        </div>
                        <div className="menu-item" tabIndex={settings.accessibility.keyboardNavigationEnhanced ? 0 : -1}>
                          <i className="fas fa-file-medical"></i>
                          <span>Medical Records</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="preview-footer">
                      <p>Your current accessibility settings applied</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Section */}
          <section id="advanced-section" className="settings-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-code"></i>
              </div>
              <div className="section-title">
                <h2>Advanced</h2>
                <p>Configure technical settings for TherapySync</p>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-glass-effect"></div>
              
              <div className="card-header">
                <h3>Data Management</h3>
                <div className="card-subtitle">Manage your data and application settings</div>
              </div>
              
              <div className="advanced-options">
                <div className="advanced-option">
                  <div className="option-header">
                    <div className="option-icon">
                      <i className="fas fa-database"></i>
                    </div>
                    <div className="option-title">Export User Settings</div>
                  </div>
                  <div className="option-description">
                    Export your current settings configuration to a JSON file
                  </div>
                  <div className="option-action">
                    <button className="action-button">
                      <i className="fas fa-download"></i>
                      <span>Export Settings</span>
                    </button>
                  </div>
                </div>
                
                <div className="advanced-option">
                  <div className="option-header">
                    <div className="option-icon">
                      <i className="fas fa-file-import"></i>
                    </div>
                    <div className="option-title">Import User Settings</div>
                  </div>
                  <div className="option-description">
                    Import a previously exported settings configuration
                  </div>
                  <div className="option-action">
                    <button className="action-button">
                      <i className="fas fa-upload"></i>
                      <span>Import Settings</span>
                    </button>
                  </div>
                </div>
                
                <div className="advanced-option">
                  <div className="option-header">
                    <div className="option-icon">
                      <i className="fas fa-sync-alt"></i>
                    </div>
                    <div className="option-title">Data Synchronization</div>
                  </div>
                  <div className="option-description">
                    Configure how frequently TherapySync syncs data with the server
                  </div>
                  <div className="option-action">
                    <div className="select-container">
                      <select className="sync-select">
                        <option value="realtime">Real-time</option>
                        <option value="1min">Every minute</option>
                        <option value="5min">Every 5 minutes</option>
                        <option value="15min">Every 15 minutes</option>
                        <option value="manual">Manual only</option>
                      </select>
                      <div className="select-arrow">
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="advanced-option">
                  <div className="option-header">
                    <div className="option-icon danger">
                      <i className="fas fa-trash-alt"></i>
                    </div>
                    <div className="option-title">Clear Local Data</div>
                  </div>
                  <div className="option-description">
                    Clear all locally stored data and reset application to default state
                  </div>
                  <div className="option-action">
                    <button className="action-button danger">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Clear Data</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-header mt-4">
                <h3>Developer Options</h3>
                <div className="card-subtitle">Advanced options for developers and administrators</div>
              </div>
              
              <div className="developer-options">
                <div className="terminal-container">
                  <div className="terminal-header">
                    <div className="terminal-title">
                      <i className="fas fa-terminal"></i>
                      <span>System Information</span>
                    </div>
                    <div className="terminal-controls">
                      <div className="control minimize"></div>
                      <div className="control maximize"></div>
                      <div className="control close"></div>
                    </div>
                  </div>
                  
                  <div className="terminal-body">
                    <div className="terminal-line">
                      <span className="prompt">$</span>
                      <span className="command">system.info()</span>
                    </div>
                    <div className="terminal-output">
                      <div className="output-line">TherapySync Premium Edition v5.2.1</div>
                      <div className="output-line">Environment: Production</div>
                      <div className="output-line">User Role: Developer</div>
                      <div className="output-line">Last Sync: 2023-08-08 16:32:45</div>
                      <div className="output-line">Database Status: Connected</div>
                      <div className="output-line">API Status: Online</div>
                      <div className="output-line">License: Enterprise (Valid until 2025-12-31)</div>
                    </div>
                    
                    <div className="terminal-line">
                      <span className="prompt">$</span>
                      <span className="command blink">_</span>
                    </div>
                  </div>
                </div>
                
                <div className="api-keys-container">
                  <div className="api-keys-header">
                    <div className="header-title">
                      <i className="fas fa-key"></i>
                      <span>API Access</span>
                    </div>
                    <button className="generate-key-button">
                      <i className="fas fa-plus"></i>
                      <span>Generate New Key</span>
                    </button>
                  </div>
                  
                  <div className="api-keys-list">
                    <div className="api-key-item">
                      <div className="key-info">
                        <div className="key-name">Production API Key</div>
                        <div className="key-value">
                          <span className="key-mask">••••••••••••••••</span>
                          <button className="show-key-button">
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                        <div className="key-created">Created: 2023-05-12</div>
                      </div>
                      <div className="key-actions">
                        <button className="key-action copy">
                          <i className="fas fa-copy"></i>
                        </button>
                        <button className="key-action regenerate">
                          <i className="fas fa-sync-alt"></i>
                        </button>
                        <button className="key-action revoke">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="api-key-item">
                      <div className="key-info">
                        <div className="key-name">Development API Key</div>
                        <div className="key-value">
                          <span className="key-mask">••••••••••••••••</span>
                          <button className="show-key-button">
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                        <div className="key-created">Created: 2023-07-28</div>
                      </div>
                      <div className="key-actions">
                        <button className="key-action copy">
                          <i className="fas fa-copy"></i>
                        </button>
                        <button className="key-action regenerate">
                          <i className="fas fa-sync-alt"></i>
                        </button>
                        <button className="key-action revoke">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="settings-footer">
        <div className="footer-content">
          <div className="last-saved">
            <i className="fas fa-clock"></i>
            <span>Last saved: Today at 4:05 PM</span>
          </div>
          
          <button className="save-button" onClick={handleSaveSettings}>
            <div className="button-content">
              <i className="fas fa-save"></i>
              <span>Save All Settings</span>
            </div>
            <div className="button-effect"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;