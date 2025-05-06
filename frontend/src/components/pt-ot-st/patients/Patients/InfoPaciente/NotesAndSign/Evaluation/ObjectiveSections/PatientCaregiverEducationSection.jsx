// Enhanced PatientCaregiverEducationSection.jsx
import React, { useState } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/ObjectiveSections/PatientCaregiverEducationSection.scss';

const PatientCaregiverEducationSection = ({ data, onChange }) => {
  // Estado para categorías colapsables
  const [expandedCategories, setExpandedCategories] = useState({
    woundCare: true,
    medication: true,
    monitoring: true,
    devices: true,
    other: true
  });
  
  // Categorizar las opciones para una mejor organización visual
  const categorizedOptions = {
    woundCare: [
      { id: 'woundCare', label: 'Wound Care', icon: 'fas fa-band-aid' }
    ],
    medication: [
      { id: 'insulinAdministration', label: 'Insulin Administration', icon: 'fas fa-syringe' },
      { id: 'medicationsAdministration', label: 'Oral/Injected/Infused/Inhaled medication(s) Administration', icon: 'fas fa-pills' }
    ],
    monitoring: [
      { id: 'nutritionalManagement', label: 'Nutritional Management', icon: 'fas fa-apple-alt' },
      { id: 'painManagement', label: 'Pain Management', icon: 'fas fa-heartbeat' },
      { id: 'diabeticFootExam', label: 'Diabetic Foot Exam/Care', icon: 'fas fa-socks' },
      { id: 'glucometerUse', label: 'Glucometer Use', icon: 'fas fa-tint' }
    ],
    devices: [
      { id: 'useOfMedicalDevices', label: 'Use of Medical Devices', icon: 'fas fa-stethoscope' },
      { id: 'oxygenUse', label: 'Oxygen Use', icon: 'fas fa-lungs' }
    ],
    other: [
      { id: 'ostomyCare', label: 'Ostomy Care', icon: 'fas fa-procedures' },
      { id: 'trachCare', label: 'Trach Care', icon: 'fas fa-wind' },
      { id: 'caregiverPresent', label: 'Caregiver Present at time of visit', icon: 'fas fa-user-friends' },
      { id: 'otherCares', label: 'Other Care(s)', icon: 'fas fa-hands-helping' },
      { id: 'satisfactoryReturnDemo', label: 'Satisfactory Return Demo', icon: 'fas fa-check-circle' }
    ]
  };
  
  // Opciones para los selects
  const yesNoOptions = [
    { value: '', label: 'Select an option' },
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ];

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (field) => {
    const updatedEducation = {
      ...(data.education || {}),
      [field]: !(data.education?.[field] || false)
    };
    
    onChange({
      ...data,
      education: updatedEducation
    });
  };

  // Manejar cambios en los selects
  const handleSelectChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Manejar cambios en textarea
  const handleTextChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };
  
  // Alternar expansión de una categoría
  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Obtener la cantidad total de ítems seleccionados
  const getSelectedCount = () => {
    if (!data.education) return 0;
    return Object.values(data.education).filter(Boolean).length;
  };
  
  // Obtener la cantidad de ítems seleccionados por categoría
  const getCategorySelectedCount = (category) => {
    if (!data.education) return 0;
    let count = 0;
    categorizedOptions[category].forEach(option => {
      if (data.education[option.id]) count++;
    });
    return count;
  };
  
  // Renderizar una categoría de educación
  const renderEducationCategory = (categoryKey, title, icon) => {
    const options = categorizedOptions[categoryKey];
    const isExpanded = expandedCategories[categoryKey];
    const selectedCount = getCategorySelectedCount(categoryKey);
    
    return (
      <div className="education-category">
        <div 
          className="category-header" 
          onClick={() => toggleCategoryExpansion(categoryKey)}
        >
          <div className="category-title-container">
            <div className="category-icon">
              <i className={icon}></i>
            </div>
            <h3 className="category-title">{title}</h3>
          </div>
          <div className="category-actions">
            {selectedCount > 0 && (
              <span className="selected-badge">{selectedCount} selected</span>
            )}
            <button className="toggle-button">
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="category-content">
            <div className="education-options-grid">
              {options.map(option => (
                <div 
                  className={`checkbox-item ${data.education?.[option.id] ? 'selected' : ''}`} 
                  key={option.id}
                >
                  <input 
                    type="checkbox" 
                    id={option.id} 
                    checked={data.education?.[option.id] || false}
                    onChange={() => handleCheckboxChange(option.id)}
                  />
                  <label htmlFor={option.id}>
                    <span className="option-icon">
                      <i className={option.icon}></i>
                    </span>
                    <span className="option-text">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="patient-caregiver-education-section">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-chalkboard-teacher"></i>
          Patient / Caregiver Education
        </h2>
        <div className="section-meta">
          <div className="education-count">
            <span className="count-number">{getSelectedCount()}</span>
            <span className="count-label">items selected</span>
          </div>
        </div>
      </div>
      
      <div className="education-options-container">
        <div className="education-header">
          <h3 className="subsection-title">
            <i className="fas fa-check-square"></i>
            Patient/Caregiver Independent With:
          </h3>
          <div className="education-actions">
            <button 
              className="expand-all-button"
              onClick={() => {
                const allExpanded = Object.values(expandedCategories).every(Boolean);
                const newState = !allExpanded;
                setExpandedCategories({
                  woundCare: newState,
                  medication: newState,
                  monitoring: newState,
                  devices: newState,
                  other: newState
                });
              }}
            >
              {Object.values(expandedCategories).every(Boolean) ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>
        
        <div className="education-categories">
          {renderEducationCategory('woundCare', 'Wound Care', 'fas fa-band-aid')}
          {renderEducationCategory('medication', 'Medication Management', 'fas fa-pills')}
          {renderEducationCategory('monitoring', 'Health Monitoring', 'fas fa-chart-line')}
          {renderEducationCategory('devices', 'Medical Devices', 'fas fa-medkit')}
          {renderEducationCategory('other', 'Other Care & Support', 'fas fa-hands-helping')}
        </div>
      </div>
      
      <div className="questions-container">
        <h3 className="subsection-title">
          <i className="fas fa-clipboard-list"></i>
          Assessment Questions
        </h3>
        
        <div className="question-cards">
          <div className="question-card">
            <div className="question-header">
              <div className="question-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h4 className="question-title">Emergency Action Plan</h4>
            </div>
            <div className="question-content">
              <p className="question-text">Does the patient/caregiver have an action plan when disease symptoms exacerbate (e.g., when to call the homecare agency vs. emergency services):</p>
              <div className="answer-selector">
                {yesNoOptions.map(option => (
                  <label 
                    key={option.value}
                    className={`answer-option ${data.hasActionPlan === option.value ? 'selected' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="hasActionPlan"
                      value={option.value}
                      checked={data.hasActionPlan === option.value}
                      onChange={() => handleSelectChange('hasActionPlan', option.value)}
                    />
                    <span className="option-text">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="question-card">
            <div className="question-header">
              <div className="question-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h4 className="question-title">Information Comprehension</h4>
            </div>
            <div className="question-content">
              <p className="question-text">Does patient/caregiver appears to understand all information given:</p>
              <div className="answer-selector">
                {yesNoOptions.map(option => (
                  <label 
                    key={option.value}
                    className={`answer-option ${data.understandsInformation === option.value ? 'selected' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="understandsInformation"
                      value={option.value}
                      checked={data.understandsInformation === option.value}
                      onChange={() => handleSelectChange('understandsInformation', option.value)}
                    />
                    <span className="option-text">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="additional-info-container">
        <h3 className="subsection-title">
          <i className="fas fa-sticky-note"></i>
          Additional Information
        </h3>
        <textarea 
          value={data.additionalInformation || ''}
          onChange={(e) => handleTextChange('additionalInformation', e.target.value)}
          rows={4}
          placeholder="Add any additional information about patient/caregiver education"
          className="additional-info-textarea"
        />
      </div>
    </div>
  );
};

export default PatientCaregiverEducationSection;