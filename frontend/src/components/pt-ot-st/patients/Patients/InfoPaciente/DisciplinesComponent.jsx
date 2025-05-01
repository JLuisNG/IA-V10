import React, { useState, useEffect } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/DisciplinesComponent.scss';

const DisciplineCard = ({ 
  disciplineType, 
  disciplineLabel,
  assistantLabel,
  therapist, 
  assistant, 
  frequency, 
  isActive, 
  onToggle, 
  onChangeTherapist,
  onChangeAssistant,
  onChangeFrequency,
  therapistsList,
  assistantsList
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFrequencyEditing, setIsFrequencyEditing] = useState(false);
  const [tempFrequency, setTempFrequency] = useState(frequency);
  const [selectedTherapist, setSelectedTherapist] = useState(therapist?.id || '');
  const [selectedAssistant, setSelectedAssistant] = useState(assistant?.id || '');
  const [showTherapistInfo, setShowTherapistInfo] = useState(false);
  const [showAssistantInfo, setShowAssistantInfo] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false);
  
  // Get icon and color based on discipline type
  const getDisciplineIcon = () => {
    switch (disciplineType) {
      case 'PT':
        return 'fas fa-walking';
      case 'OT':
        return 'fas fa-hands';
      case 'ST':
        return 'fas fa-comment-medical';
      default:
        return 'fas fa-user-md';
    }
  };
  
  const getDisciplineColor = () => {
    switch (disciplineType) {
      case 'PT':
        return {
          primary: '#3b82f6',
          light: 'rgba(59, 130, 246, 0.1)',
          medium: 'rgba(59, 130, 246, 0.2)',
          border: 'rgba(59, 130, 246, 0.3)',
          shadow: 'rgba(59, 130, 246, 0.4)',
          gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa, #93c5fd)',
          glow: '0 0 20px rgba(59, 130, 246, 0.5)'
        };
      case 'OT':
        return {
          primary: '#8b5cf6',
          light: 'rgba(139, 92, 246, 0.1)',
          medium: 'rgba(139, 92, 246, 0.2)',
          border: 'rgba(139, 92, 246, 0.3)',
          shadow: 'rgba(139, 92, 246, 0.4)',
          gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa, #c4b5fd)',
          glow: '0 0 20px rgba(139, 92, 246, 0.5)'
        };
      case 'ST':
        return {
          primary: '#10b981',
          light: 'rgba(16, 185, 129, 0.1)',
          medium: 'rgba(16, 185, 129, 0.2)',
          border: 'rgba(16, 185, 129, 0.3)',
          shadow: 'rgba(16, 185, 129, 0.4)',
          gradient: 'linear-gradient(135deg, #10b981, #34d399, #6ee7b7)',
          glow: '0 0 20px rgba(16, 185, 129, 0.5)'
        };
      default:
        return {
          primary: '#64748b',
          light: 'rgba(100, 116, 139, 0.1)',
          medium: 'rgba(100, 116, 139, 0.2)',
          border: 'rgba(100, 116, 139, 0.3)',
          shadow: 'rgba(100, 116, 139, 0.4)',
          gradient: 'linear-gradient(135deg, #64748b, #94a3b8, #cbd5e1)',
          glow: '0 0 20px rgba(100, 116, 139, 0.5)'
        };
    }
  };
  
  const colors = getDisciplineColor();
  
  // Handle save therapist changes
  const handleSaveChanges = () => {
    const newTherapist = therapistsList.find(t => t.id === selectedTherapist);
    const newAssistant = assistantsList.find(a => a.id === selectedAssistant);
    
    onChangeTherapist(newTherapist);
    onChangeAssistant(newAssistant);
    setIsEditing(false);
  };
  
  // Handle save frequency changes
  const handleSaveFrequency = () => {
    onChangeFrequency(tempFrequency);
    setIsFrequencyEditing(false);
  };
  
  // Get frequency display format
  const getFrequencyDisplay = (freq) => {
    if (!freq) return 'Not set';
    
    // Parse frequency string and make it readable
    const parts = freq.match(/(\d+[wW])(\d+)/);
    if (parts && parts.length === 3) {
      const weeks = parts[1].slice(0, -1);
      const visits = parts[2];
      return `${visits} visit${visits > 1 ? 's' : ''} per ${weeks} week${weeks > 1 ? 's' : ''}`;
    }
    
    return freq;
  };
  
  return (
    <div 
      className={`discipline-card ${isActive ? 'active' : 'inactive'} ${hoverEffect ? 'hover-effect' : ''}`}
      style={{
        '--card-color': colors.primary,
        '--card-color-light': colors.light,
        '--card-color-medium': colors.medium,
        '--card-color-border': colors.border,
        '--card-color-shadow': colors.shadow,
        '--card-color-gradient': colors.gradient,
        '--card-color-glow': colors.glow
      }}
      onMouseEnter={() => setHoverEffect(true)}
      onMouseLeave={() => setHoverEffect(false)}
    >
      <div className="discipline-header">
        <div className="discipline-icon">
          <div className="icon-3d">
            <i className={getDisciplineIcon()}></i>
            <div className="icon-shadow"></div>
          </div>
          <div className="icon-glow"></div>
        </div>
        <div className="discipline-title">
          <h3>{disciplineType}</h3>
          <span className="discipline-subtitle">{disciplineLabel}</span>
          <div className="title-decoration"></div>
        </div>
        <div className="discipline-toggle">
          <button 
            className={`toggle-button glass-effect ${isActive ? 'active' : ''}`}
            onClick={onToggle}
            title={isActive ? 'Deactivate discipline' : 'Activate discipline'}
          >
            <div className="toggle-track">
              <div className="toggle-indicator">
                <div className="toggle-glow"></div>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      {!isActive && (
        <div className="inactive-overlay glass-effect">
          <span>This discipline is currently inactive</span>
          <button className="activate-btn glass-effect" onClick={onToggle}>
            <i className="fas fa-power-off"></i>
            <span>Activate</span>
            <div className="btn-shine"></div>
          </button>
        </div>
      )}
      
      <div className="discipline-content">
        {/* Therapist Section */}
        <div className="therapy-staff">
          {isEditing ? (
            <div className="edit-form glass-form">
              <div className="edit-form-decoration"></div>
              <div className="form-group">
                <label htmlFor={`therapist-select-${disciplineType}`}>
                  <i className="fas fa-user-md"></i>
                  {disciplineLabel}
                </label>
                <div className="select-wrapper">
                  <select 
                    id={`therapist-select-${disciplineType}`}
                    value={selectedTherapist}
                    onChange={(e) => setSelectedTherapist(e.target.value)}
                    disabled={!isActive}
                    className="glass-input"
                  >
                    <option value="">Select {disciplineLabel}</option>
                    {therapistsList.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down select-arrow"></i>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor={`assistant-select-${disciplineType}`}>
                  <i className="fas fa-user-nurse"></i>
                  {assistantLabel}
                </label>
                <div className="select-wrapper">
                  <select 
                    id={`assistant-select-${disciplineType}`}
                    value={selectedAssistant}
                    onChange={(e) => setSelectedAssistant(e.target.value)}
                    disabled={!isActive}
                    className="glass-input"
                  >
                    <option value="">Select {assistantLabel}</option>
                    {assistantsList.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down select-arrow"></i>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  className="cancel-btn glass-btn" 
                  onClick={() => setIsEditing(false)}
                >
                  <i className="fas fa-times"></i>
                  <span>Cancel</span>
                </button>
                <button 
                  className="save-btn glass-btn" 
                  onClick={handleSaveChanges}
                  disabled={!isActive}
                >
                  <i className="fas fa-check"></i>
                  <span>Save</span>
                  <div className="btn-shine"></div>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="staff-item therapist glass-card">
                <div className="staff-header">
                  <div className="staff-title">
                    <div className="title-icon">
                      <i className="fas fa-user-md"></i>
                      <div className="icon-glow"></div>
                    </div>
                    <span>{disciplineLabel}</span>
                  </div>
                  {isActive && (
                    <button 
                      className="edit-button glass-btn-sm" 
                      onClick={() => setIsEditing(true)}
                      title={`Change ${disciplineLabel}`}
                    >
                      <i className="fas fa-edit"></i>
                      <div className="btn-glow"></div>
                    </button>
                  )}
                </div>
                
                {therapist ? (
                  <div className="staff-details">
                    <div 
                      className="staff-name glass-highlight" 
                      onClick={() => setShowTherapistInfo(!showTherapistInfo)}
                    >
                      <div className="staff-avatar">
                        {therapist.name.charAt(0)}
                        <div className="avatar-glow"></div>
                      </div>
                      <span>{therapist.name}</span>
                      <i className={`fas fa-chevron-${showTherapistInfo ? 'up' : 'down'}`}></i>
                    </div>
                    
                    {showTherapistInfo && (
                      <div className="staff-info">
                        {therapist.phone && (
                          <div className="info-item glass-item">
                            <i className="fas fa-phone-alt"></i>
                            <span>{therapist.phone}</span>
                          </div>
                        )}
                        {therapist.email && (
                          <div className="info-item glass-item">
                            <i className="fas fa-envelope"></i>
                            <span>{therapist.email}</span>
                          </div>
                        )}
                        {therapist.licenseNumber && (
                          <div className="info-item glass-item">
                            <i className="fas fa-id-card"></i>
                            <span>License: {therapist.licenseNumber}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="staff-placeholder">
                    <div className="placeholder-icon">
                      <i className="fas fa-user-plus"></i>
                      <div className="icon-glow"></div>
                    </div>
                    <span>No {disciplineLabel} assigned</span>
                  </div>
                )}
              </div>
              
              <div className="staff-item assistant glass-card">
                <div className="staff-header">
                  <div className="staff-title">
                    <div className="title-icon">
                      <i className="fas fa-user-nurse"></i>
                      <div className="icon-glow"></div>
                    </div>
                    <span>{assistantLabel}</span>
                  </div>
                </div>
                
                {assistant ? (
                  <div className="staff-details">
                    <div 
                      className="staff-name glass-highlight" 
                      onClick={() => setShowAssistantInfo(!showAssistantInfo)}
                    >
                      <div className="staff-avatar">
                        {assistant.name.charAt(0)}
                        <div className="avatar-glow"></div>
                      </div>
                      <span>{assistant.name}</span>
                      <i className={`fas fa-chevron-${showAssistantInfo ? 'up' : 'down'}`}></i>
                    </div>
                    
                    {showAssistantInfo && (
                      <div className="staff-info">
                        {assistant.phone && (
                          <div className="info-item glass-item">
                            <i className="fas fa-phone-alt"></i>
                            <span>{assistant.phone}</span>
                          </div>
                        )}
                        {assistant.email && (
                          <div className="info-item glass-item">
                            <i className="fas fa-envelope"></i>
                            <span>{assistant.email}</span>
                          </div>
                        )}
                        {assistant.licenseNumber && (
                          <div className="info-item glass-item">
                            <i className="fas fa-id-card"></i>
                            <span>License: {assistant.licenseNumber}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="staff-placeholder">
                    <div className="placeholder-icon">
                      <i className="fas fa-user-plus"></i>
                      <div className="icon-glow"></div>
                    </div>
                    <span>No {assistantLabel} assigned</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Frequency Section */}
        <div className="therapy-frequency glass-card">
          <div className="frequency-header">
            <div className="staff-title">
              <div className="title-icon">
                <i className="fas fa-calendar-alt"></i>
                <div className="icon-glow"></div>
              </div>
              <span>Frequency</span>
            </div>
            {isActive && !isFrequencyEditing && (
              <button 
                className="edit-button glass-btn-sm" 
                onClick={() => setIsFrequencyEditing(true)}
                title="Edit frequency"
              >
                <i className="fas fa-edit"></i>
                <div className="btn-glow"></div>
              </button>
            )}
          </div>
          
          {isFrequencyEditing ? (
            <div className="frequency-edit glass-form">
              <div className="edit-form-decoration"></div>
              <div className="input-group">
                <input 
                  type="text" 
                  value={tempFrequency} 
                  onChange={(e) => setTempFrequency(e.target.value)}
                  placeholder="e.g. 2w3"
                  className="glass-input frequency-input"
                />
                <div className="format-hint">
                  <i className="fas fa-info-circle"></i>
                  <span>Format: [weeks]w[visits] (e.g. 2w3 = 3 visits every 2 weeks)</span>
                </div>
              </div>
              
              <div className="frequency-presets">
                <button onClick={() => setTempFrequency('1w1')} className="glass-chip">1w1</button>
                <button onClick={() => setTempFrequency('1w2')} className="glass-chip">1w2</button>
                <button onClick={() => setTempFrequency('1w3')} className="glass-chip">1w3</button>
                <button onClick={() => setTempFrequency('2w1')} className="glass-chip">2w1</button>
                <button onClick={() => setTempFrequency('2w3')} className="glass-chip">2w3</button>
                <button onClick={() => setTempFrequency('4w1')} className="glass-chip">4w1</button>
              </div>
              
              <div className="form-actions">
                <button 
                  className="cancel-btn glass-btn" 
                  onClick={() => {
                    setTempFrequency(frequency);
                    setIsFrequencyEditing(false);
                  }}
                >
                  <i className="fas fa-times"></i>
                  <span>Cancel</span>
                </button>
                <button 
                  className="save-btn glass-btn" 
                  onClick={handleSaveFrequency}
                >
                  <i className="fas fa-check"></i>
                  <span>Save</span>
                  <div className="btn-shine"></div>
                </button>
              </div>
            </div>
          ) : (
            <div className={`frequency-display ${!frequency ? 'no-frequency' : ''}`}>
              {frequency ? (
                <>
                  <div className="frequency-value">
                    <div className="frequency-code glass-highlight">
                      <span>{frequency}</span>
                      <div className="frequency-glow"></div>
                    </div>
                    <span className="frequency-readable">{getFrequencyDisplay(frequency)}</span>
                  </div>
                  <div className="frequency-visualization">
                    {renderFrequencyVisualization(frequency, colors)}
                  </div>
                </>
              ) : (
                <div className="no-frequency">
                  <div className="placeholder-icon">
                    <i className="fas fa-calendar-times"></i>
                    <div className="icon-glow"></div>
                  </div>
                  <span>No frequency set</span>
                  {isActive && (
                    <button 
                      className="set-frequency-btn glass-btn-sm"
                      onClick={() => setIsFrequencyEditing(true)}
                    >
                      <i className="fas fa-plus"></i>
                      <span>Set Frequency</span>
                      <div className="btn-shine"></div>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="card-bg-decoration"></div>
    </div>
  );
};

// Helper function to render frequency visualization
const renderFrequencyVisualization = (frequency, colors) => {
  if (!frequency) return null;
  
  const parts = frequency.match(/(\d+[wW])(\d+)/);
  if (!parts || parts.length < 3) return null;
  
  const weeks = parseInt(parts[1].slice(0, -1));
  const visits = parseInt(parts[2]);
  
  // Generate a visual representation of the frequency
  const daysInWeek = 7;
  const totalDays = weeks * daysInWeek;
  
  // Create an array of dots representing days
  // Distribute visits evenly throughout the period
  const dayDots = [];
  const visitInterval = Math.floor(totalDays / visits);
  
  // Generate a pattern of visits based on the frequency
  for (let day = 0; day < totalDays; day++) {
    const isVisit = day % visitInterval === Math.floor(visitInterval / 2) && dayDots.filter(d => d.isVisit).length < visits;
    const isWeekend = day % 7 === 5 || day % 7 === 6; // Saturday or Sunday
    
    dayDots.push({
      day,
      isVisit,
      isWeekend
    });
  }

  return (
    <div className="frequency-calendar glass-card-inner">
      <div className="weeks-container">
        {Array.from({ length: weeks }).map((_, weekIndex) => (
          <div key={weekIndex} className="week">
            <div className="week-label">W{weekIndex + 1}</div>
            <div className="days">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const dotIndex = weekIndex * 7 + dayIndex;
                const dot = dayDots[dotIndex];
                return (
                  <div 
                    key={dayIndex} 
                    className={`day ${dot.isVisit ? 'visit' : ''} ${dot.isWeekend ? 'weekend' : ''}`}
                    title={dot.isVisit ? `Visit day` : ''}
                  >
                    {dot.isVisit && (
                      <div className="day-indicator">
                        <i className="fas fa-check"></i>
                        <div className="day-glow"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
const DisciplinesComponent = ({ patient, onUpdateDisciplines }) => {
  const [disciplines, setDisciplines] = useState({
    PT: {
      isActive: false,
      therapist: null,
      assistant: null,
      frequency: ''
    },
    OT: {
      isActive: false,
      therapist: null,
      assistant: null,
      frequency: ''
    },
    ST: {
      isActive: false,
      therapist: null,
      assistant: null,
      frequency: ''
    }
  });
  
  // Mock therapists data
  const [therapistsList, setTherapistsList] = useState([
    { id: 'pt1', name: 'Dr. James Wilson', type: 'PT', phone: '(310) 555-1234', email: 'jwilson@therapysync.com', licenseNumber: 'PT12345' },
    { id: 'pt2', name: 'Dr. Sarah Johnson', type: 'PT', phone: '(310) 555-2345', email: 'sjohnson@therapysync.com', licenseNumber: 'PT23456' },
    { id: 'pt3', name: 'Dr. Michael Chen', type: 'PT', phone: '(310) 555-3456', email: 'mchen@therapysync.com', licenseNumber: 'PT34567' },
    { id: 'ot1', name: 'Dr. Emily Parker', type: 'OT', phone: '(310) 555-4567', email: 'eparker@therapysync.com', licenseNumber: 'OT12345' },
    { id: 'ot2', name: 'Dr. David Garcia', type: 'OT', phone: '(310) 555-5678', email: 'dgarcia@therapysync.com', licenseNumber: 'OT23456' },
    { id: 'st1', name: 'Dr. Jessica Lee', type: 'ST', phone: '(310) 555-6789', email: 'jlee@therapysync.com', licenseNumber: 'ST12345' },
    { id: 'st2', name: 'Dr. Robert Taylor', type: 'ST', phone: '(310) 555-7890', email: 'rtaylor@therapysync.com', licenseNumber: 'ST23456' }
  ]);
  
  const [assistantsList, setAssistantsList] = useState([
    { id: 'pta1', name: 'Carlos Rodriguez', type: 'PTA', phone: '(310) 555-8901', email: 'crodriguez@therapysync.com', licenseNumber: 'PTA12345' },
    { id: 'pta2', name: 'Maria Gonzalez', type: 'PTA', phone: '(310) 555-9012', email: 'mgonzalez@therapysync.com', licenseNumber: 'PTA23456' },
    { id: 'cota1', name: 'Thomas Smith', type: 'COTA', phone: '(310) 555-0123', email: 'tsmith@therapysync.com', licenseNumber: 'COTA12345' },
    { id: 'cota2', name: 'Anna Williams', type: 'COTA', phone: '(310) 555-1234', email: 'awilliams@therapysync.com', licenseNumber: 'COTA23456' },
    { id: 'slpa1', name: 'Jennifer Brown', type: 'SLPA', phone: '(310) 555-2345', email: 'jbrown@therapysync.com', licenseNumber: 'SLPA12345' },
    { id: 'slpa2', name: 'Daniel Martinez', type: 'SLPA', phone: '(310) 555-3456', email: 'dmartinez@therapysync.com', licenseNumber: 'SLPA23456' }
  ]);
  
  // Initialize with patient data
  useEffect(() => {
    if (patient?.disciplines) {
      setDisciplines(patient.disciplines);
    }
  }, [patient]);
  
  // Filter therapists by type
  const getTherapistsByType = (type) => {
    return therapistsList.filter(t => t.type === type);
  };
  
  // Filter assistants by type
  const getAssistantsByType = (type) => {
    const assistantType = type === 'PT' ? 'PTA' : (type === 'OT' ? 'COTA' : 'SLPA');
    return assistantsList.filter(a => a.type === assistantType);
  };
  
  // Toggle discipline active status
  const handleToggleDiscipline = (type) => {
    const updatedDisciplines = {
      ...disciplines,
      [type]: {
        ...disciplines[type],
        isActive: !disciplines[type].isActive
      }
    };
    
    setDisciplines(updatedDisciplines);
    
    if (onUpdateDisciplines) {
      onUpdateDisciplines(updatedDisciplines);
    }
  };
  
  // Change therapist
  const handleChangeTherapist = (type, therapist) => {
    const updatedDisciplines = {
      ...disciplines,
      [type]: {
        ...disciplines[type],
        therapist
      }
    };
    
    setDisciplines(updatedDisciplines);
    
    if (onUpdateDisciplines) {
      onUpdateDisciplines(updatedDisciplines);
    }
  };
  
  // Change assistant
  const handleChangeAssistant = (type, assistant) => {
    const updatedDisciplines = {
      ...disciplines,
      [type]: {
        ...disciplines[type],
        assistant
      }
    };
    
    setDisciplines(updatedDisciplines);
    
    if (onUpdateDisciplines) {
      onUpdateDisciplines(updatedDisciplines);
    }
  };
  
  // Change frequency
  const handleChangeFrequency = (type, frequency) => {
    const updatedDisciplines = {
      ...disciplines,
      [type]: {
        ...disciplines[type],
        frequency
      }
    };
    
    setDisciplines(updatedDisciplines);
    
    if (onUpdateDisciplines) {
      onUpdateDisciplines(updatedDisciplines);
    }
  };
  
  // Generate cards for each discipline type
  const disciplineCards = [
    {
      type: 'PT',
      label: 'Physical Therapist',
      assistantLabel: 'Physical Therapist Assistant',
      data: disciplines.PT
    },
    {
      type: 'OT',
      label: 'Occupational Therapist',
      assistantLabel: 'Certified Occupational Therapy Assistant',
      data: disciplines.OT
    },
    {
      type: 'ST',
      label: 'Speech Therapist',
      assistantLabel: 'Speech-Language Pathology Assistant',
      data: disciplines.ST
    }
  ];
  
  return (
    <div className="disciplines-component">
      <div className="card-header">
        <div className="header-title">
          <div className="header-icon-wrapper">
            <i className="fas fa-user-md"></i>
            <div className="icon-glow"></div>
          </div>
          <h3>Therapy Disciplines</h3>
        </div>
        <div className="header-decoration"></div>
      </div>
      
      <div className="card-body">
        <div className="disciplines-list">
          {disciplineCards.map((card, index) => (
            <DisciplineCard
              key={card.type}
              disciplineType={card.type}
              disciplineLabel={card.label}
              assistantLabel={card.assistantLabel}
              therapist={card.data.therapist}
              assistant={card.data.assistant}
              frequency={card.data.frequency}
              isActive={card.data.isActive}
              onToggle={() => handleToggleDiscipline(card.type)}
              onChangeTherapist={(therapist) => handleChangeTherapist(card.type, therapist)}
              onChangeAssistant={(assistant) => handleChangeAssistant(card.type, assistant)}
              onChangeFrequency={(frequency) => handleChangeFrequency(card.type, frequency)}
              therapistsList={getTherapistsByType(card.type)}
              assistantsList={getAssistantsByType(card.type)}
            />
        ))}
        </div>
        <div className="component-decoration">
          <div className="glass-orb top-left"></div>
          <div className="glass-orb bottom-right"></div>
        </div>
      </div>
    </div>
  );
};

export default DisciplinesComponent;