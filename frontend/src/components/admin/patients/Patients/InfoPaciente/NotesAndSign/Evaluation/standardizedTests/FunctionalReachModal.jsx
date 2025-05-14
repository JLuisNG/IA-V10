// Enhanced FunctionalReachModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/FunctionalReachModal.scss';

const FunctionalReachModal = ({ isOpen, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    trialAttempt: initialData?.trialAttempt || '',
    firstMeasurement: initialData?.firstMeasurement || '',
    secondMeasurement: initialData?.secondMeasurement || '',
    averageReach: initialData?.averageReach || '',
    notes: initialData?.notes || '',
    isComplete: initialData?.isComplete || false
  });

  // Estado para validación
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estado para animaciones
  const [fadeIn, setFadeIn] = useState(false);
  const [measurementAnimation, setMeasurementAnimation] = useState(false);

  // Efecto para animación inicial
  useEffect(() => {
    setFadeIn(true);
    setTimeout(() => {
      setMeasurementAnimation(true);
    }, 300);
  }, []);

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

  // Calcular el promedio cuando cambian las mediciones
  useEffect(() => {
    if (formData.firstMeasurement && formData.secondMeasurement) {
      const firstVal = parseFloat(formData.firstMeasurement) || 0;
      const secondVal = parseFloat(formData.secondMeasurement) || 0;
      const average = ((firstVal + secondVal) / 2).toFixed(1);
      
      setFormData(prevData => ({
        ...prevData,
        averageReach: average
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        averageReach: ''
      }));
    }
  }, [formData.firstMeasurement, formData.secondMeasurement]);

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstMeasurement) {
      errors.firstMeasurement = true;
    }
    
    if (!formData.secondMeasurement) {
      errors.secondMeasurement = true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Determinar el nivel de riesgo basado en el promedio
  const getRiskLevel = () => {
    const avg = parseFloat(formData.averageReach);
    
    if (isNaN(avg)) return null;
    
    if (avg >= 10) return 'low';
    if (avg >= 6) return 'moderate';
    return 'high';
  };
  
  // Get risk level text
  const getRiskLevelText = () => {
    const level = getRiskLevel();
    
    if (level === 'high') return 'High Risk of Falls';
    if (level === 'moderate') return 'Moderate Risk of Falls';
    if (level === 'low') return 'Low Risk of Falls';
    return 'Not Determined';
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      // Animación de salida
      setFadeIn(false);
      
      setTimeout(() => {
        onClose({
          ...formData,
          isComplete: true,
          score: formData.averageReach // Usamos el promedio como puntuación
        });
      }, 300);
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className={`functional-reach-modal-overlay ${fadeIn ? 'fade-in' : 'fade-out'}`}>
      <div className="functional-reach-modal">
        <div className="modal-header">
          <h2>
            <div className="header-icon">
              <i className="fas fa-ruler-horizontal"></i>
            </div>
            <span>Functional Reach Test</span>
          </h2>
          <div className={`risk-badge-header ${getRiskLevel() || ''}`}>
            {formData.averageReach ? `${formData.averageReach} inches` : '-'}
          </div>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="test-description">
            <div className="description-card">
              <div className="card-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="card-content">
                <h3>About this Test</h3>
                <p>The Functional Reach Test measures the maximum distance a person can reach forward while standing in a fixed position. Patient stands next to a wall with arm raised to 90 degrees and reaches forward as far as possible without losing balance.</p>
              </div>
            </div>
          </div>
          
          <div className="test-visualization">
            <div className={`visualization-container ${measurementAnimation ? 'animate' : ''}`}>
              <div className="person-figure">
                <div className="person-body"></div>
                <div className="person-arm"></div>
                <div className="person-head"></div>
              </div>
              <div className="reach-measurement">
                <div className="reach-line"></div>
                <div className="reach-arrow"></div>
                <div className="reach-value">{formData.averageReach ? `${formData.averageReach}"` : ''}</div>
              </div>
            </div>
          </div>
          
          <div className="measurements-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-ruler"></i>
                Measurements
              </h3>
            </div>
            
            <div className="measurements-grid">
              <div className="measurement-card">
                <div className="measurement-header">
                  <span className="measurement-label">Trial Attempt</span>
                  <span className="measurement-optional">(Optional)</span>
                </div>
                <div className="measurement-input">
                  <input 
                    type="number" 
                    value={formData.trialAttempt}
                    onChange={(e) => handleChange('trialAttempt', e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />
                  <span className="input-unit">inches</span>
                </div>
              </div>
              
              <div className={`measurement-card ${validationErrors.firstMeasurement ? 'has-error' : ''}`}>
                <div className="measurement-header">
                  <span className="measurement-label">First Measurement</span>
                  <span className="measurement-required">*</span>
                </div>
                <div className="measurement-input">
                  <input 
                    type="number" 
                    value={formData.firstMeasurement}
                    onChange={(e) => handleChange('firstMeasurement', e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    className={validationErrors.firstMeasurement ? 'error' : ''}
                  />
                  <span className="input-unit">inches</span>
                </div>
                {validationErrors.firstMeasurement && (
                  <div className="error-message">Required</div>
                )}
              </div>
              
              <div className={`measurement-card ${validationErrors.secondMeasurement ? 'has-error' : ''}`}>
                <div className="measurement-header">
                  <span className="measurement-label">Second Measurement</span>
                  <span className="measurement-required">*</span>
                </div>
                <div className="measurement-input">
                  <input 
                    type="number" 
                    value={formData.secondMeasurement}
                    onChange={(e) => handleChange('secondMeasurement', e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    className={validationErrors.secondMeasurement ? 'error' : ''}
                  />
                  <span className="input-unit">inches</span>
                </div>
                {validationErrors.secondMeasurement && (
                  <div className="error-message">Required</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="results-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-chart-bar"></i>
                Results
              </h3>
            </div>
            
            <div className="results-content">
              <div className="average-card">
                <div className="average-info">
                  <div className="average-label">Average Functional Reach:</div>
                  <div className={`average-value ${getRiskLevel()}`}>
                    {formData.averageReach ? `${formData.averageReach} inches` : '-'}
                  </div>
                </div>
                
                <div className={`risk-assessment ${getRiskLevel() || ''}`}>
                  <div className="risk-icon">
                    {getRiskLevel() === 'high' && <i className="fas fa-exclamation-triangle"></i>}
                    {getRiskLevel() === 'moderate' && <i className="fas fa-exclamation"></i>}
                    {getRiskLevel() === 'low' && <i className="fas fa-check-circle"></i>}
                  </div>
                  <div className="risk-text">{getRiskLevelText()}</div>
                </div>
              </div>
              
              <div className="risk-interpretation">
                <div className={`risk-level ${getRiskLevel() === 'high' ? 'active' : ''}`}>
                  <div className="risk-marker high"></div>
                  <div className="risk-description">
                    <span className="risk-range">&lt; 6 inches</span>
                    <span className="risk-name">High Risk of Falls</span>
                  </div>
                </div>
                
                <div className={`risk-level ${getRiskLevel() === 'moderate' ? 'active' : ''}`}>
                  <div className="risk-marker moderate"></div>
                  <div className="risk-description">
                    <span className="risk-range">6 - 10 inches</span>
                    <span className="risk-name">Moderate Risk of Falls</span>
                  </div>
                </div>
                
                <div className={`risk-level ${getRiskLevel() === 'low' ? 'active' : ''}`}>
                  <div className="risk-marker low"></div>
                  <div className="risk-description">
                    <span className="risk-range">&gt; 10 inches</span>
                    <span className="risk-name">Low Risk of Falls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="notes-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-comment-alt"></i>
                Additional Notes
              </h3>
            </div>
            
            <div className="notes-content">
              <textarea 
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Enter any additional notes or observations..."
                rows={4}
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <div className="assessment-summary">
            <div className={`risk-indicator ${getRiskLevel() || 'no-risk'}`}>
              <span className="risk-dot"></span>
              <span className="risk-text">{getRiskLevelText()}</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="cancel-btn" onClick={() => onClose()}>
              <i className="fas fa-times"></i>
              <span>Cancel</span>
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              <i className="fas fa-check"></i>
              <span>Submit Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionalReachModal;