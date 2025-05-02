// Enhanced TimedUpAndGoModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/TimedUpAndGoModal.scss';

const TimedUpAndGoModal = ({ isOpen, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    time: initialData?.time || '',
    description: initialData?.description || '',
    isComplete: initialData?.isComplete || false
  });

  // Estado para validación y animación
  const [validationErrors, setValidationErrors] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  // Manejar cambios en los campos
  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));

    // Limpiar error de validación si existe
    if (validationErrors[field]) {
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Determinar la categoría activa basada en el tiempo
  useEffect(() => {
    if (!formData.time || isNaN(parseFloat(formData.time))) {
      setActiveCategory(null);
      return;
    }
    
    const time = parseFloat(formData.time);
    
    if (time < 10) {
      setActiveCategory('normal');
    } else if (time >= 10 && time <= 20) {
      setActiveCategory('moderate');
    } else if (time > 20 && time <= 30) {
      setActiveCategory('high');
    } else {
      setActiveCategory('severe');
    }
  }, [formData.time]);

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.time) {
      errors.time = true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onClose({
        ...formData,
        isComplete: true,
        score: formData.time // Usamos el tiempo como puntuación
      });
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="timed-up-and-go-modal-overlay">
      <div className="timed-up-and-go-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-stopwatch"></i>
            Timed Up And Go
          </h2>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="header-badge">
            <span className="badge-icon"><i className="fas fa-info-circle"></i></span>
            <span className="badge-text">This test provides a reliable measure of mobility and fall risk in older adults</span>
          </div>
          
          <div className="test-instructions">
            <div className="instruction-header">
              <i className="fas fa-clipboard-list"></i>
              <h3>Test Instructions</h3>
            </div>
            <ol className="instruction-steps">
              <li>Have the patient sit in a standard arm chair</li>
              <li>Instruct them to stand up when you say "Go"</li>
              <li>Walk a distance of 10 feet (3 meters)</li>
              <li>Turn around and walk back to the chair</li>
              <li>Sit down completely</li>
              <li>Time starts on the word "Go" and stops when they are seated again</li>
            </ol>
          </div>
          
          <div className="test-form">
            <div className="form-row">
              <div className={`form-group ${validationErrors.time ? 'has-error' : ''}`}>
                <label>
                  <i className="fas fa-clock"></i>
                  Time (in seconds)
                </label>
                <div className="time-input">
                  <input 
                    type="number" 
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    className={validationErrors.time ? 'error' : ''}
                  />
                  <span className="unit">seconds</span>
                  {validationErrors.time && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i>
                      Time is required
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-comment-alt"></i>
                  Observations
                </label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter additional observations (e.g., gait pattern, balance issues, use of hands for support)"
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          <div className="risk-interpretation">
            <div className="interpretation-header">
              <i className="fas fa-chart-bar"></i>
              <h3>Risk Assessment</h3>
            </div>
            
            <div className="interpretation-card">
              <div className="risk-levels">
                <div className={`risk-level ${activeCategory === 'normal' ? 'active' : ''}`}>
                  <div className="risk-indicator low">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="risk-text">
                    <strong>&lt; 10 seconds</strong>
                    <span>Normal Mobility - Low Fall Risk</span>
                    <div className="risk-details">Freely mobile, independent in daily activities</div>
                  </div>
                </div>
                
                <div className={`risk-level ${activeCategory === 'moderate' ? 'active' : ''}`}>
                  <div className="risk-indicator moderate">
                    <i className="fas fa-exclamation-circle"></i>
                  </div>
                  <div className="risk-text">
                    <strong>10 - 20 seconds</strong>
                    <span>Good Mobility - Moderate Fall Risk</span>
                    <div className="risk-details">Can go outside alone, some gait abnormalities may be present</div>
                  </div>
                </div>
                
                <div className={`risk-level ${activeCategory === 'high' ? 'active' : ''}`}>
                  <div className="risk-indicator high">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="risk-text">
                    <strong>20 - 30 seconds</strong>
                    <span>Limited Mobility - High Fall Risk</span>
                    <div className="risk-details">Cannot go outside alone, requires assistance with mobility</div>
                  </div>
                </div>
                
                <div className={`risk-level ${activeCategory === 'severe' ? 'active' : ''}`}>
                  <div className="risk-indicator severe">
                    <i className="fas fa-ban"></i>
                  </div>
                  <div className="risk-text">
                    <strong>&gt; 30 seconds</strong>
                    <span>Dependent Mobility - Severe Risk</span>
                    <div className="risk-details">Dependent in most ADLs, requires significant assistance</div>
                  </div>
                </div>
              </div>
            </div>
            
            {activeCategory && (
              <div className={`result-banner ${activeCategory}`}>
                <div className="result-icon">
                  {activeCategory === 'normal' && <i className="fas fa-check-circle"></i>}
                  {activeCategory === 'moderate' && <i className="fas fa-exclamation-circle"></i>}
                  {activeCategory === 'high' && <i className="fas fa-exclamation-triangle"></i>}
                  {activeCategory === 'severe' && <i className="fas fa-ban"></i>}
                </div>
                <div className="result-text">
                  <span className="result-label">Current Assessment:</span>
                  <span className="result-value">
                    {activeCategory === 'normal' && 'Normal Mobility - Low Fall Risk'}
                    {activeCategory === 'moderate' && 'Good Mobility - Moderate Fall Risk'}
                    {activeCategory === 'high' && 'Limited Mobility - High Fall Risk'}
                    {activeCategory === 'severe' && 'Dependent Mobility - Severe Risk'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
            <span>Cancel</span>
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            <i className="fas fa-check"></i>
            <span>Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimedUpAndGoModal;