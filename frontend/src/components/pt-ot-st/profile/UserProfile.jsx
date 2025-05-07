import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/developer/Profile/UserProfile.scss';

const TPUserProfile = () => {
  // User data state
  const [userData, setUserData] = useState({
    name: 'Luis Nava',
    avatar: 'LN',
    email: 'luis.nava@therapysync.com',
    phone: '+58 424 280 0884',
    role: 'Developer',
    createdAt: '2023-07-15',
    status: 'online',
    address: '123 Tech Avenue, San Francisco, CA',
    specialization: 'Frontend Development',
    languages: ['English', 'Spanish'],
    timezone: 'UTC-5 (Eastern Time)',
    lastActive: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString() // 13 hours ago
  });

  // States for animations and interactions
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({...userData});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loadingState, setLoadingState] = useState({
    saving: false,
    loading: true,
    verifyingEmail: false,
    verifyingSms: false
  });
  
  // State for security verification
  const [securityState, setSecurityState] = useState({
    emailVerified: true,
    smsVerified: false,
    twoFactorEnabled: true,
    lastPasswordChange: '2025-02-10',
    securityLevel: 'high',
    activeSessions: 1,
    recentActivity: [
      { action: 'Login', device: 'Chrome on Windows', location: 'San Francisco, CA', time: '09:12 AM' },
      { action: 'Password Change', device: 'Chrome on Windows', location: 'San Francisco, CA', time: 'Feb 10, 11:45 AM' },
      { action: 'Login', device: 'Mobile App on iPhone', location: 'San Francisco, CA', time: 'Feb 05, 08:30 AM' }
    ]
  });
  
  // State for UI effects
  const [animationState, setAnimationState] = useState({
    avatarPulse: false,
    cardHover: null,
    hasInteracted: false,
    showParticles: true,
    notificationsBadge: 3,
    activeGlow: true,
    backgroundAnimating: true
  });
  
  // Refs for animations
  const profileCardRef = useRef(null);
  const securityCardRef = useRef(null);
  const preferencesCardRef = useRef(null);
  const avatarRef = useRef(null);
  const particlesRef = useRef([]);
  const backgroundParticlesRef = useRef([]);
  const waveformRef = useRef();
  const containerRef = useRef();
  
  // Simulate loading on mount with premium animation sequence
  useEffect(() => {
    // Staggered animation loading sequence
    setTimeout(() => {
      setLoadingState(prev => ({...prev, loading: false}));
    }, 1200);

    // Generate random particles
    generateParticles();
    generateBackgroundParticles();
    
    // Start avatar pulse effect
    const pulseInterval = setInterval(() => {
      setAnimationState(prev => ({...prev, avatarPulse: !prev.avatarPulse}));
    }, 5000);
    
    // Generate animated waveform effect
    generateWaveform();
    
    
    return () => clearInterval(pulseInterval);
  }, []);
  
  // Generate animated waveform effect
  const generateWaveform = () => {
    if (!waveformRef.current) {
      waveformRef.current = [];
      
      for (let i = 0; i < 3; i++) {
        waveformRef.current.push({
          amplitude: 25 + Math.random() * 15,
          frequency: 0.005 + Math.random() * 0.005,
          speed: 0.1 + Math.random() * 0.1,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.05 + Math.random() * 0.05
        });
      }
    }
  };
  
  // Generate decorative particles
  const generateParticles = () => {
    if (particlesRef.current.length > 0) return;
    
    const colors = ['#36D1DC', '#5B86E5', '#4FC3F7', '#90CAF9', '#42A5F5'];
    
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
      });
    }
  };
  
  // Generate background particles
  const generateBackgroundParticles = () => {
    if (backgroundParticlesRef.current.length > 0) return;
    
    const colors = [
      'rgba(54, 209, 220, 0.3)', 
      'rgba(91, 134, 229, 0.3)', 
      'rgba(79, 195, 247, 0.3)',
      'rgba(144, 202, 249, 0.3)',
      'rgba(66, 165, 245, 0.3)'
    ];
    
    for (let i = 0; i < 50; i++) {
      backgroundParticlesRef.current.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 50 + 20,
        delay: Math.random() * 5
      });
    }
  };
  
  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({...prev, [name]: value}));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form before saving
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\(\)\-]{10,15}$/;
    
    if (!editData.name.trim()) errors.name = "Name is required";
    if (!emailRegex.test(editData.email)) errors.email = "Valid email is required";
    if (!phoneRegex.test(editData.phone)) errors.phone = "Valid phone number is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle save changes
  const handleSave = () => {
    if (!validateForm()) return;
    
    setLoadingState(prev => ({...prev, saving: true}));
    
    // Simulate API call
    setTimeout(() => {
      setUserData({...editData});
      setIsEditing(false);
      setLoadingState(prev => ({...prev, saving: false}));
      
      // Show success indicator
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1500);
  };
  
  // Handle cancel edit
  const handleCancel = () => {
    setEditData({...userData});
    setIsEditing(false);
    setFormErrors({});
  };
  
  // Handle section change with animation
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setAnimationState(prev => ({...prev, hasInteracted: true}));
  };
  
  // Handle card hover animation
  const handleCardHover = (card) => {
    setAnimationState(prev => ({...prev, cardHover: card}));
  };
  
  // Send verification email
  const handleVerifyEmail = () => {
    setLoadingState(prev => ({...prev, verifyingEmail: true}));
    
    // Simulate API call
    setTimeout(() => {
      setLoadingState(prev => ({...prev, verifyingEmail: false}));
      // Success notification would go here
    }, 1500);
  };
  
  // Send verification SMS
  const handleVerifySMS = () => {
    setLoadingState(prev => ({...prev, verifyingSms: true}));
    
    // Simulate API call
    setTimeout(() => {
      setLoadingState(prev => ({...prev, verifyingSms: false}));
      setSecurityState(prev => ({...prev, smsVerified: true}));
    }, 1500);
  };
  
  // Toggle two-factor authentication
  const handleToggleTwoFactor = () => {
    setSecurityState(prev => ({
      ...prev, 
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate time since last active
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  };

  // Toggle particles effect
  const toggleParticles = () => {
    setAnimationState(prev => ({
      ...prev,
      showParticles: !prev.showParticles,
      backgroundAnimating: !prev.backgroundAnimating
    }));
  };

  return (
    <div className="user-profile-container" ref={containerRef}>
      {/* Premium animated background */}
      <div className="profile-background">
        <div className="background-gradient"></div>
        <div className="background-noise"></div>
        
        {/* Animated waveforms */}
        <div className="background-waveforms">
          {waveformRef.current && waveformRef.current.map((wave, index) => (
            <div 
              key={`wave-${index}`}
              className="waveform"
              style={{
                '--wave-amplitude': `${wave.amplitude}px`,
                '--wave-frequency': wave.frequency,
                '--wave-speed': wave.speed,
                '--wave-phase': wave.phase,
                '--wave-opacity': wave.opacity,
                animationPlayState: animationState.backgroundAnimating ? 'running' : 'paused'
              }}
            ></div>
          ))}
        </div>
        
        {/* Background particles */}
        <div className="background-particles">
          {animationState.showParticles && backgroundParticlesRef.current.map(particle => (
            <div 
              key={`bg-particle-${particle.id}`}
              className="background-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                animationDuration: `${particle.speed}s`,
                animationDelay: `${particle.delay}s`,
                animationPlayState: animationState.backgroundAnimating ? 'running' : 'paused'
              }}
            ></div>
          ))}
        </div>
        
        <div className="background-overlay"></div>
      </div>
      
      {/* Premium decorative foreground particles */}
      <div className="profile-particles">
        {animationState.showParticles && particlesRef.current.map(particle => (
          <div 
            key={`particle-${particle.id}`}
            className="profile-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animation: `floatParticle ${particle.duration}s infinite ${particle.delay}s`,
              animationPlayState: animationState.backgroundAnimating ? 'running' : 'paused'
            }}
          />
        ))}
      </div>
      
      {loadingState.loading ? (
        // Premium loading animation
        <div className="profile-loading">
          <div className="loading-container">
            <div className="loading-ring-container">
              <div className="loading-ring"></div>
              <div className="loading-ring"></div>
              <div className="loading-ring"></div>
            </div>
            <div className="loading-text">
              <div className="loading-title">Loading Profile</div>
              <div className="loading-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Page header with title and actions */}
          <div className="profile-header">
            <div className="header-title">
              <h1>My Profile</h1>
              <div className="title-decoration"></div>
            </div>
            
            <div className="header-actions">
              {isEditing ? (
                <>
                  <button 
                    className={`action-button save ${formErrors && Object.keys(formErrors).length > 0 ? 'disabled' : ''}`}
                    onClick={handleSave}
                    disabled={loadingState.saving || (formErrors && Object.keys(formErrors).length > 0)}
                  >
                    <div className="button-background"></div>
                    <div className="button-content">
                      {loadingState.saving ? (
                        <>
                          <div className="button-spinner"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          <span>Save Changes</span>
                        </>
                      )}
                    </div>
                  </button>
                  
                  <button 
                    className="action-button cancel"
                    onClick={handleCancel}
                    disabled={loadingState.saving}
                  >
                    <div className="button-content">
                      <i className="fas fa-times"></i>
                      <span>Cancel</span>
                    </div>
                  </button>
                </>
              ) : (
                <button 
                  className="action-button edit"
                  onClick={() => setIsEditing(true)}
                >
                  <div className="button-background"></div>
                  <div className="button-content">
                    <i className="fas fa-pencil-alt"></i>
                    <span>Edit Profile</span>
                  </div>
                </button>
              )}
            </div>
          </div>
          
          {/* Main content grid */}
          <div className="profile-content">
            {/* Sidebar with user info and navigation */}
            <div className="profile-sidebar">
              {/* User avatar and status */}
              <div 
                className={`profile-avatar-container ${animationState.avatarPulse ? 'pulse' : ''}`}
                ref={avatarRef}
              >
                <div className="card-glow"></div>
                <div className="card-background"></div>
                
                <div className="profile-avatar-wrapper">
                  <div className="avatar-outer-ring"></div>
                  <div className="avatar-ring"></div>
                  <div className="profile-avatar">
                    <span>{userData.avatar}</span>
                    <div className="avatar-highlight"></div>
                  </div>
                  <div className={`avatar-status ${userData.status}`}>
                    <div className="status-pulse"></div>
                  </div>
                </div>
                
                <div className="profile-name-container">
                  <h2 className="profile-name">{userData.name}</h2>
                  <div className="profile-role">
                    <span className="role-badge">{userData.role}</span>
                  </div>
                  
                  <div className="profile-meta">
                    <div className="meta-item">
                      <i className="fas fa-envelope"></i>
                      <span>{userData.email}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-phone"></i>
                      <span>{userData.phone}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-clock"></i>
                      <span>Member since {formatDate(userData.createdAt)}</span>
                    </div>
                    <div className="meta-item">
                      <div className={`status-indicator ${userData.status}`}></div>
                      <span>Last active: {getTimeAgo(userData.lastActive)}</span>
                    </div>
                  </div>
                  
                  {savedSuccess && (
                    <div className="save-success-message">
                      <i className="fas fa-check-circle"></i>
                      <span>Profile updated successfully!</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navigation menu */}
              <div className="profile-nav">
                <div 
                  className={`nav-item ${activeSection === 'personal' ? 'active' : ''}`} 
                  onClick={() => handleSectionChange('personal')}
                >
                  <div className="nav-item-background"></div>
                  <i className="fas fa-user"></i>
                  <span>Personal Information</span>
                  {activeSection === 'personal' && <div className="active-indicator"></div>}
                </div>
                
                <div 
                  className={`nav-item ${activeSection === 'security' ? 'active' : ''}`} 
                  onClick={() => handleSectionChange('security')}
                >
                  <div className="nav-item-background"></div>
                  <i className="fas fa-shield-alt"></i>
                  <span>Security & Login</span>
                  {activeSection === 'security' && <div className="active-indicator"></div>}
                </div>
                
                <div 
                  className={`nav-item ${activeSection === 'preferences' ? 'active' : ''}`} 
                  onClick={() => handleSectionChange('preferences')}
                >
                  <div className="nav-item-background"></div>
                  <i className="fas fa-sliders-h"></i>
                  <span>Preferences</span>
                  {activeSection === 'preferences' && <div className="active-indicator"></div>}
                  
                  {animationState.notificationsBadge > 0 && (
                    <div className="notification-badge">
                      {animationState.notificationsBadge}
                      <div className="badge-pulse"></div>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`nav-item ${activeSection === 'activity' ? 'active' : ''}`} 
                  onClick={() => handleSectionChange('activity')}
                >
                  <div className="nav-item-background"></div>
                  <i className="fas fa-chart-line"></i>
                  <span>Activity Log</span>
                  {activeSection === 'activity' && <div className="active-indicator"></div>}
                </div>
                
                <div className="nav-footer">
                  <button 
                    className={`toggle-effects ${!animationState.showParticles ? 'disabled' : ''}`}
                    onClick={toggleParticles}
                    title="Toggle visual effects"
                  >
                    <i className={`fas ${animationState.showParticles ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    <span>Visual Effects</span>
                  </button>
                  
                  <Link to="/homepage" className="back-home">
                    <i className="fas fa-home"></i>
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="profile-main-content">
              {/* Personal information section */}
              {activeSection === 'personal' && (
                <div 
                  className={`profile-card ${animationState.cardHover === 'personal' ? 'hover' : ''}`}
                  ref={profileCardRef}
                  onMouseEnter={() => handleCardHover('personal')}
                  onMouseLeave={() => handleCardHover(null)}
                >
                  <div className="card-glow"></div>
                  <div className="card-background"></div>
                  
                  <div className="card-header">
                    <div className="card-icon">
                      <div className="icon-background"></div>
                      <i className="fas fa-user"></i>
                    </div>
                    <h3>Personal Information</h3>
                  </div>
                  
                  <div className="card-content">
                    <div className="input-grid">
                      <div className="input-group">
                        <label>Full Name</label>
                        {isEditing ? (
                          <>
                            <input 
                              type="text" 
                              name="name" 
                              value={editData.name} 
                              onChange={handleChange}
                              className={formErrors.name ? 'error' : ''}
                            />
                            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                          </>
                        ) : (
                          <div className="input-value">{userData.name}</div>
                        )}
                      </div>
                      
                      <div className="input-group">
                        <label>Email Address</label>
                        {isEditing ? (
                          <>
                            <input 
                              type="email" 
                              name="email" 
                              value={editData.email} 
                              onChange={handleChange}
                              className={formErrors.email ? 'error' : ''}
                            />
                            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                          </>
                        ) : (
                          <div className="input-value">
                            {userData.email}
                            {securityState.emailVerified && (
                              <div className="verified-badge">
                                <i className="fas fa-check-circle"></i>
                                <span>Verified</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="input-group">
                        <label>Phone Number</label>
                        {isEditing ? (
                          <>
                            <input 
                              type="tel" 
                              name="phone" 
                              value={editData.phone} 
                              onChange={handleChange}
                              className={formErrors.phone ? 'error' : ''}
                            />
                            {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
                          </>
                        ) : (
                          <div className="input-value">
                            {userData.phone}
                            {securityState.smsVerified ? (
                              <div className="verified-badge">
                                <i className="fas fa-check-circle"></i>
                                <span>Verified</span>
                              </div>
                            ) : (
                              <button 
                                className="verify-button"
                                onClick={handleVerifySMS}
                                disabled={loadingState.verifyingSms}
                              >
                                {loadingState.verifyingSms ? (
                                  <>
                                    <div className="button-spinner"></div>
                                    <span>Verifying...</span>
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Verify</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="input-group">
                        <label>Job Title</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            name="role" 
                            value={editData.role} 
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="input-value">{userData.role}</div>
                        )}
                      </div>
                      
                      <div className="input-group">
                        <label>Address</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            name="address" 
                            value={editData.address} 
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="input-value">{userData.address}</div>
                        )}
                      </div>
                      
                      <div className="input-group">
                        <label>Specialization</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            name="specialization" 
                            value={editData.specialization} 
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="input-value">{userData.specialization}</div>
                        )}
                      </div>
                      
                      <div className="input-group full-width">
                        <label>Languages</label>
                        {isEditing ? (
                          <div className="language-selector">
                            {['English', 'Spanish', 'French', 'German', 'Portuguese'].map(lang => (
                              <div 
                                key={lang}
                                className={`language-chip ${editData.languages.includes(lang) ? 'selected' : ''}`}
                                onClick={() => {
                                  setEditData(prev => {
                                    if (prev.languages.includes(lang)) {
                                      return {...prev, languages: prev.languages.filter(l => l !== lang)};
                                    } else {
                                      return {...prev, languages: [...prev.languages, lang]};
                                    }
                                  });
                                }}
                              >
                                <span>{lang}</span>
                                {editData.languages.includes(lang) && <i className="fas fa-check"></i>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="input-value languages-list">
                            {userData.languages.map(lang => (
                              <div key={lang} className="language-badge">
                                <span>{lang}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="input-group">
                        <label>Timezone</label>
                        {isEditing ? (
                          <select 
                            name="timezone" 
                            value={editData.timezone}
                            onChange={handleChange}
                          >
                            <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                            <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                            <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                            <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                            <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                            <option value="UTC+1 (Central European)">UTC+1 (Central European)</option>
                            <option value="UTC+2 (Eastern European)">UTC+2 (Eastern European)</option>
                          </select>
                        ) : (
                          <div className="input-value">{userData.timezone}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-decoration">
                    <div className="decoration-circle"></div>
                    <div className="decoration-square"></div>
                    <div className="decoration-line"></div>
                  </div>
                </div>
              )}
              
              {/* Security section */}
              {activeSection === 'security' && (
                <div 
                className={`profile-card security-card ${animationState.cardHover === 'security' ? 'hover' : ''}`}
                ref={securityCardRef}
                onMouseEnter={() => handleCardHover('security')}
                onMouseLeave={() => handleCardHover(null)}
              >
                <div className="card-glow security-glow"></div>
                <div className="card-background security-background"></div>
                
                <div className="card-header">
                  <div className="card-icon security-icon">
                    <div className="icon-background"></div>
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Security & Login</h3>
                </div>
                
                <div className="card-content">
                  <div className="security-status">
                    <div className="security-level">
                      <div className="security-shield-graphic">
                        <i className="fas fa-shield-alt"></i>
                        <div className="security-pulse"></div>
                      </div>
                      <div className="level-info">
                        <div className="level-label">Security Level</div>
                        <div className={`level-indicator ${securityState.securityLevel}`}>
                          <div className="level-bar">
                            <div className="level-sparkle"></div>
                          </div>
                          <span className="level-text">{securityState.securityLevel.charAt(0).toUpperCase() + securityState.securityLevel.slice(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="active-sessions">
                      <div className="session-icon">
                        <i className="fas fa-desktop"></i>
                        <div className="icon-ring"></div>
                      </div>
                      <div className="session-details">
                        <div className="session-count">
                          {securityState.activeSessions} Active {securityState.activeSessions === 1 ? 'Session' : 'Sessions'}
                        </div>
                        <div className="session-message">You're currently logged in on this device</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="security-sections">
                    <div className="security-section">
                      <h4>Login Methods</h4>
                      
                      <div className="security-item">
                        <div className="item-highlight"></div>
                        <div className="item-icon">
                          <i className="fas fa-key"></i>
                        </div>
                        <div className="item-details">
                          <div className="item-title">Password</div>
                          <div className="item-description">
                            Last changed {formatDate(securityState.lastPasswordChange)}
                          </div>
                        </div>
                        <div className="item-actions">
                          <button className="security-button">
                            <div className="button-background"></div>
                            <span>Change</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="security-item">
                        <div className="item-highlight"></div>
                        <div className="item-icon">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div className="item-details">
                          <div className="item-title">Email Verification</div>
                          <div className="item-description">
                            {userData.email}
                          </div>
                        </div>
                        <div className="item-actions">
                          {securityState.emailVerified ? (
                            <div className="verified-status">
                              <i className="fas fa-check-circle"></i>
                              <span>Verified</span>
                            </div>
                          ) : (
                            <button 
                              className="security-button"
                              onClick={handleVerifyEmail}
                              disabled={loadingState.verifyingEmail}
                            >
                              <div className="button-background"></div>
                              {loadingState.verifyingEmail ? 'Sending...' : 'Verify'}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="security-item">
                        <div className="item-highlight"></div>
                        <div className="item-icon">
                          <i className="fas fa-mobile-alt"></i>
                        </div>
                        <div className="item-details">
                          <div className="item-title">Phone Verification</div>
                          <div className="item-description">
                            {userData.phone}
                          </div>
                        </div>
                        <div className="item-actions">
                          {securityState.smsVerified ? (
                            <div className="verified-status">
                              <i className="fas fa-check-circle"></i>
                              <span>Verified</span>
                            </div>
                          ) : (
                            <button 
                              className="security-button"
                              onClick={handleVerifySMS}
                              disabled={loadingState.verifyingSms}
                            >
                              <div className="button-background"></div>
                              {loadingState.verifyingSms ? 'Sending...' : 'Verify'}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="security-item">
                        <div className="item-highlight"></div>
                        <div className="item-icon">
                          <i className="fas fa-lock"></i>
                        </div>
                        <div className="item-details">
                          <div className="item-title">Two-Factor Authentication</div>
                          <div className="item-description">
                            Additional security for your account
                          </div>
                        </div>
                        <div className="item-actions">
                          <div className="toggle-switch">
                            <input 
                              type="checkbox" 
                              id="twoFactorToggle" 
                              checked={securityState.twoFactorEnabled} 
                              onChange={handleToggleTwoFactor}
                            />
                            <label htmlFor="twoFactorToggle">
                              <div className="toggle-handle"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="security-section">
                      <h4>Recent Activity</h4>
                      <div className="activity-timeline">
                        {securityState.recentActivity.map((activity, index) => (
                          <div className="activity-item" key={index}>
                            <div className="timeline-line"></div>
                            <div className="activity-icon">
                              <i className={`fas ${activity.action === 'Login' ? 'fa-sign-in-alt' : 'fa-user-shield'}`}></i>
                            </div>
                            <div className="activity-details">
                              <div className="activity-action">{activity.action}</div>
                              <div className="activity-meta">
                                <span className="device">
                                  <i className="fas fa-laptop"></i> {activity.device}
                                </span>
                                <span className="location">
                                  <i className="fas fa-map-marker-alt"></i> {activity.location}
                                </span>
                                <span className="time">
                                  <i className="fas fa-clock"></i> {activity.time}
                                </span>
                              </div>
                            </div>
                            {index === 0 && (
                              <div className="current-session-badge">
                                <div className="badge-glow"></div>
                                <span>Current</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="view-all-link">
                        <a href="#">
                          <span>View all activity</span>
                          <i className="fas fa-chevron-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-decoration">
                  <div className="decoration-circle"></div>
                  <div className="decoration-square"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>
            )}
            
            {/* Preferences section */}
            {activeSection === 'preferences' && (
              <div 
                className={`profile-card preferences-card ${animationState.cardHover === 'preferences' ? 'hover' : ''}`}
                ref={preferencesCardRef}
                onMouseEnter={() => handleCardHover('preferences')}
                onMouseLeave={() => handleCardHover(null)}
              >
                <div className="card-glow preferences-glow"></div>
                <div className="card-background preferences-background"></div>
                
                <div className="card-header">
                  <div className="card-icon preferences-icon">
                    <div className="icon-background"></div>
                    <i className="fas fa-sliders-h"></i>
                  </div>
                  <h3>Preferences</h3>
                </div>
                
                <div className="card-content">
                  <div className="preference-sections">
                    <div className="preference-section">
                      <h4>Interface Settings</h4>
                      
                      <div className="preference-item">
                        <div className="item-highlight"></div>
                        <div className="item-icon">
                          <i className="fas fa-moon"></i>
                        </div>
                        <div className="item-details">
                          <div className="item-title">Dark Mode</div>
                          <div className="item-description">
                            Use dark theme for better viewing experience in low-light environments
                          </div>
                        </div>
                        <div className="item-actions">
                          <div className="toggle-switch">
                            <input type="checkbox" id="darkModeToggle" checked={true} />
                            <label htmlFor="darkModeToggle">
                              <div className="toggle-handle"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="preference-item">
                        <div className="item-highlight"></div>
                        <div className="item-icon">
                          <i className="fas fa-bell"></i>
                        </div>
                        <div className="item-details">
                          <div className="item-title">Notifications</div>
                          <div className="item-description">
                            Receive important alerts and updates
                          </div>
                        </div>
                        <div className="item-actions">
                          <div className="toggle-switch">
                            <input type="checkbox" id="notificationsToggle" checked={true} />
                            <label htmlFor="notificationsToggle">
                              <div className="toggle-handle"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="preference-item">
                        <div className="item-highlight"></div>
                        <div className="item-icon">
                          <i className="fas fa-volume-up"></i>
                        </div>
                        <div className="item-details">
                          <div className="item-title">Sound Alerts</div>
                          <div className="item-description">
                            Play sound for important notifications
                          </div>
                        </div>
                        <div className="item-actions">
                          <div className="toggle-switch">
                            <input type="checkbox" id="soundToggle" checked={false} />
                            <label htmlFor="soundToggle">
                              <div className="toggle-handle"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="preference-item">
                        <div className="item-highlight"></div>
                        <div className="item-icon">
                          <i className="fas fa-tachometer-alt"></i>
                        </div>
                        <div className="item-details">
                          <div className="item-title">Animation Effects</div>
                          <div className="item-description">
                            Enable motion effects throughout the interface
                          </div>
                        </div>
                        <div className="item-actions">
                          <div className="toggle-switch">
                            <input 
                              type="checkbox" 
                              id="animationsToggle" 
                              checked={animationState.showParticles} 
                              onChange={toggleParticles}
                            />
                            <label htmlFor="animationsToggle">
                              <div className="toggle-handle"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="preference-section">
                      <h4>Notification Settings</h4>
                      
                      <div className="notification-options">
                        <div className="notification-option">
                          <div className="option-header">
                            <h5>Email Notifications</h5>
                            <div className="badge-update">
                              <span>New</span>
                              <div className="badge-ripple"></div>
                            </div>
                          </div>
                          <div className="option-items">
                            <div className="option-item">
                              <div className="item-label">System Updates</div>
                              <div className="toggle-switch small">
                                <input type="checkbox" id="emailSystemToggle" checked={true} />
                                <label htmlFor="emailSystemToggle">
                                  <div className="toggle-handle"></div>
                                </label>
                              </div>
                            </div>
                            
                            <div className="option-item">
                              <div className="item-label">Security Alerts</div>
                              <div className="toggle-switch small">
                                <input type="checkbox" id="emailSecurityToggle" checked={true} />
                                <label htmlFor="emailSecurityToggle">
                                  <div className="toggle-handle"></div>
                                </label>
                              </div>
                            </div>
                            
                            <div className="option-item">
                              <div className="item-label">Patient Reminders</div>
                              <div className="toggle-switch small">
                                <input type="checkbox" id="emailPatientToggle" checked={true} />
                                <label htmlFor="emailPatientToggle">
                                  <div className="toggle-handle"></div>
                                </label>
                              </div>
                            </div>
                            
                            <div className="option-item">
                              <div className="item-label">Marketing & News</div>
                              <div className="toggle-switch small">
                                <input type="checkbox" id="emailMarketingToggle" checked={false} />
                                <label htmlFor="emailMarketingToggle">
                                  <div className="toggle-handle"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="notification-option">
                          <div className="option-header">
                            <h5>In-App Notifications</h5>
                          </div>
                          <div className="option-items">
                            <div className="option-item">
                              <div className="item-label">Patient Messages</div>
                              <div className="toggle-switch small">
                                <input type="checkbox" id="appMessagesToggle" checked={true} />
                                <label htmlFor="appMessagesToggle">
                                  <div className="toggle-handle"></div>
                                </label>
                              </div>
                            </div>
                            
                            <div className="option-item">
                              <div className="item-label">Appointment Alerts</div>
                              <div className="toggle-switch small">
                                <input type="checkbox" id="appAppointmentToggle" checked={true} />
                                <label htmlFor="appAppointmentToggle">
                                  <div className="toggle-handle"></div>
                                </label>
                              </div>
                            </div>
                            
                            <div className="option-item">
                              <div className="item-label">Team Mentions</div>
                              <div className="toggle-switch small">
                                <input type="checkbox" id="appTeamToggle" checked={true} />
                                <label htmlFor="appTeamToggle">
                                  <div className="toggle-handle"></div>
                                </label>
                              </div>
                            </div>
                            
                            <div className="option-item">
                              <div className="item-label">System Updates</div>
                              <div className="toggle-switch small">
                                <input type="checkbox" id="appSystemToggle" checked={false} />
                                <label htmlFor="appSystemToggle">
                                  <div className="toggle-handle"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="preferences-footer">
                    <button className="restore-defaults">
                      <div className="button-background"></div>
                      <div className="button-content">
                        <i className="fas fa-undo"></i>
                        <span>Restore Default Settings</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="card-decoration">
                  <div className="decoration-circle"></div>
                  <div className="decoration-square"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>
            )}
            
            {/* Activity Log section */}
            {activeSection === 'activity' && (
              <div 
                className={`profile-card activity-card ${animationState.cardHover === 'activity' ? 'hover' : ''}`}
                onMouseEnter={() => handleCardHover('activity')}
                onMouseLeave={() => handleCardHover(null)}
              >
                <div className="card-glow activity-glow"></div>
                <div className="card-background activity-background"></div>
                
                <div className="card-header">
                  <div className="card-icon activity-icon">
                    <div className="icon-background"></div>
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3>Activity Log</h3>
                </div>
                
                <div className="card-content">
                  <div className="activity-filters">
                    <div className="filter-group">
                      <label>Filter By</label>
                      <div className="filter-buttons">
                        <button className="filter-button active">
                          <div className="button-background"></div>
                          <span>All Activity</span>
                        </button>
                        <button className="filter-button">
                          <div className="button-background"></div>
                          <span>System</span>
                        </button>
                        <button className="filter-button">
                          <div className="button-background"></div>
                          <span>Security</span>
                        </button>
                        <button className="filter-button">
                          <div className="button-background"></div>
                          <span>Patients</span>
                        </button>
                        <button className="filter-button">
                          <div className="button-background"></div>
                          <span>Messages</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="search-activity">
                      <div className="search-input">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Search activity..." />
                      </div>
                    </div>
                  </div>
                  
                  <div className="activity-log-container">
                    <div className="date-group">
                      <div className="date-header">Today</div>
                      
                      <div className="activity-log-item">
                        <div className="activity-time">09:15 AM</div>
                        <div className="activity-icon login">
                          <i className="fas fa-sign-in-alt"></i>
                        </div>
                        <div className="activity-details">
                          <div className="activity-title">System Login</div>
                          <div className="activity-description">
                            Successfully logged in from Chrome on Windows
                          </div>
                        </div>
                        <div className="activity-meta">
                          <div className="meta-ip">192.168.1.105</div>
                          <div className="meta-location">San Francisco, CA</div>
                        </div>
                      </div>
                      
                      <div className="activity-log-item">
                        <div className="activity-time">09:18 AM</div>
                        <div className="activity-icon view">
                          <i className="fas fa-eye"></i>
                        </div>
                        <div className="activity-details">
                          <div className="activity-title">Viewed Patient List</div>
                          <div className="activity-description">
                            Accessed patient directory
                          </div>
                        </div>
                        <div className="activity-meta">
                          <div className="meta-ip">192.168.1.105</div>
                          <div className="meta-location">San Francisco, CA</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="date-group">
                      <div className="date-header">Yesterday</div>
                      
                      <div className="activity-log-item">
                        <div className="activity-time">03:45 PM</div>
                        <div className="activity-icon message">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div className="activity-details">
                          <div className="activity-title">Sent Message</div>
                          <div className="activity-description">
                            Message sent to Dr. Sarah Johnson
                          </div>
                        </div>
                        <div className="activity-meta">
                          <div className="meta-ip">192.168.1.105</div>
                          <div className="meta-location">San Francisco, CA</div>
                        </div>
                      </div>
                      
                      <div className="activity-log-item">
                        <div className="activity-time">01:22 PM</div>
                        <div className="activity-icon update">
                          <i className="fas fa-edit"></i>
                        </div>
                        <div className="activity-details">
                          <div className="activity-title">Updated Patient Record</div>
                          <div className="activity-description">
                            Modified information for patient #12458
                          </div>
                        </div>
                        <div className="activity-meta">
                          <div className="meta-ip">192.168.1.105</div>
                          <div className="meta-location">San Francisco, CA</div>
                        </div>
                      </div>
                      
                      <div className="activity-log-item">
                        <div className="activity-time">09:32 AM</div>
                        <div className="activity-icon login">
                          <i className="fas fa-sign-in-alt"></i>
                        </div>
                        <div className="activity-details">
                          <div className="activity-title">System Login</div>
                          <div className="activity-description">
                            Successfully logged in from Chrome on Windows
                          </div>
                        </div>
                        <div className="activity-meta">
                          <div className="meta-ip">192.168.1.105</div>
                          <div className="meta-location">San Francisco, CA</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="date-group">
                      <div className="date-header">March 21, 2025</div>
                      
                      <div className="activity-log-item">
                        <div className="activity-time">04:17 PM</div>
                        <div className="activity-icon logout">
                          <i className="fas fa-sign-out-alt"></i>
                        </div>
                        <div className="activity-details">
                          <div className="activity-title">System Logout</div>
                          <div className="activity-description">
                            Successfully logged out
                          </div>
                        </div>
                        <div className="activity-meta">
                          <div className="meta-ip">192.168.1.105</div>
                          <div className="meta-location">San Francisco, CA</div>
                        </div>
                      </div>
                      
                      <div className="activity-log-item">
                        <div className="activity-time">02:45 PM</div>
                        <div className="activity-icon calendar">
                          <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div className="activity-details">
                          <div className="activity-title">Appointment Scheduled</div>
                          <div className="activity-description">
                            Created new appointment for patient #23657
                          </div>
                        </div>
                        <div className="activity-meta">
                          <div className="meta-ip">192.168.1.105</div>
                          <div className="meta-location">San Francisco, CA</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="activity-pagination">
                    <button className="pagination-button prev disabled">
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="pagination-button page active">
                      <div className="page-highlight"></div>
                      <span>1</span>
                    </button>
                    <button className="pagination-button page">
                      <div className="page-highlight"></div>
                      <span>2</span>
                    </button>
                    <button className="pagination-button page">
                      <div className="page-highlight"></div>
                      <span>3</span>
                    </button>
                    <span className="pagination-ellipsis">...</span>
                    <button className="pagination-button page">
                      <div className="page-highlight"></div>
                      <span>12</span>
                    </button>
                    <button className="pagination-button next">
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
                
                <div className="card-decoration">
                  <div className="decoration-circle"></div>
                  <div className="decoration-square"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
);
};

export default TPUserProfile;