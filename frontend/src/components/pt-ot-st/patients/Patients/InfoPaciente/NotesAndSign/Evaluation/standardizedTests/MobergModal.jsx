// Enhanced MobergModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/MobergModal.scss';

const MobergModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    leftHand: initialData?.leftHand || '',
    rightHand: initialData?.rightHand || '',
    leftHandObscured: initialData?.leftHandObscured || '',
    rightHandObscured: initialData?.rightHandObscured || '',
    additionalNotes: initialData?.additionalNotes || '',
    isComplete: initialData?.isComplete || false
  });
  
  // Estado para validación
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estado para animación de secciones
  const [activeSections, setActiveSections] = useState({
    unobscured: true,
    obscured: true,
    results: true,
    notes: true
  });

  // Manejar cambios en los campos del formulario
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

  // Validar el formulario
  const validateForm = () => {
    const errors = {};
    
    // Al menos una mano debe ser evaluada
    if (!formData.leftHand && !formData.rightHand && 
        !formData.leftHandObscured && !formData.rightHandObscured) {
      errors.hands = true;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para calcular el resultado global
  const calculateResult = () => {
    // Para este test, podemos retornar el mejor tiempo (el más bajo) entre ambas manos
    // o podemos simplemente retornar todos los tiempos para análisis posterior
    const times = [];
    
    if (formData.leftHand) times.push(parseFloat(formData.leftHand));
    if (formData.rightHand) times.push(parseFloat(formData.rightHand));
    if (formData.leftHandObscured) times.push(parseFloat(formData.leftHandObscured));
    if (formData.rightHandObscured) times.push(parseFloat(formData.rightHandObscured));
    
    // Para el score, podemos usar la diferencia entre manos visible/obscured
    // o el mejor tiempo global
    const bestTime = times.length > 0 ? Math.min(...times) : null;
    
    return {
      bestTime,
      difference: {
        left: formData.leftHand && formData.leftHandObscured ? 
          Math.abs(parseFloat(formData.leftHandObscured) - parseFloat(formData.leftHand)) : null,
        right: formData.rightHand && formData.rightHandObscured ? 
          Math.abs(parseFloat(formData.rightHandObscured) - parseFloat(formData.rightHand)) : null
      },
      score: bestTime // Usamos el mejor tiempo como score general
    };
  };

  // Alternar visibilidad de secciones
  const toggleSection = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      const result = calculateResult();
      
      onClose({
        ...formData,
        result,
        isComplete: true,
        score: result.bestTime ? result.bestTime.toFixed(2) : 'N/A'
      });
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="moberg-modal-overlay">
      <div className="moberg-modal">
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-hand-paper"></i>
            </div>
            <h2>Moberg Hand Function Test</h2>
          </div>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="info-banner">
            <div className="banner-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <p>Prior scores are for reference only. To print previous scores please type in additional boxes below.</p>
          </div>
          
          <div className="assessment-info">
            <div className="info-header">
              <i className="fas fa-info-circle"></i>
              <h3>About This Test</h3>
            </div>
            <div className="info-content">
              <p>The Moberg pickup test measures fine motor coordination and tactile gnosis. The test is performed with eyes open (unobscured) and with eyes closed (obscured). Record the time in seconds it takes for the patient to pick up small objects.</p>
            </div>
          </div>
          
          {validationErrors.hands && (
            <div className="validation-error">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <span>At least one hand measurement must be recorded</span>
            </div>
          )}
          
          <div className="test-sections">
            <div className="section-card unobscured-section">
              <div className="section-header" onClick={() => toggleSection('unobscured')}>
                <div className="section-title">
                  <div className="section-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3>Unobscured Vision</h3>
                </div>
                <div className="section-toggle">
                  <i className={`fas fa-chevron-${activeSections.unobscured ? 'up' : 'down'}`}></i>
                </div>
              </div>
              
              {activeSections.unobscured && (
                <div className="section-content">
                  <div className="measurement-item">
                    <div className="hand-icon left">
                      <i className="fas fa-hand-paper fa-flip-horizontal"></i>
                    </div>
                    <div className="measurement-content">
                      <label htmlFor="leftHand">Left Hand</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          id="leftHand"
                          step="0.1"
                          min="0"
                          value={formData.leftHand}
                          onChange={(e) => handleChange('leftHand', e.target.value)}
                          placeholder="0.0"
                        />
                        <span className="unit">seconds</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="measurement-item">
                    <div className="hand-icon right">
                      <i className="fas fa-hand-paper"></i>
                    </div>
                    <div className="measurement-content">
                      <label htmlFor="rightHand">Right Hand</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          id="rightHand"
                          step="0.1"
                          min="0"
                          value={formData.rightHand}
                          onChange={(e) => handleChange('rightHand', e.target.value)}
                          placeholder="0.0"
                        />
                        <span className="unit">seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="section-card obscured-section">
              <div className="section-header" onClick={() => toggleSection('obscured')}>
                <div className="section-title">
                  <div className="section-icon">
                    <i className="fas fa-eye-slash"></i>
                  </div>
                  <h3>Obscured Vision</h3>
                </div>
                <div className="section-toggle">
                  <i className={`fas fa-chevron-${activeSections.obscured ? 'up' : 'down'}`}></i>
                </div>
              </div>
              
              {activeSections.obscured && (
                <div className="section-content">
                  <div className="measurement-item">
                    <div className="hand-icon left obscured">
                      <i className="fas fa-hand-paper fa-flip-horizontal"></i>
                    </div>
                    <div className="measurement-content">
                      <label htmlFor="leftHandObscured">Left Hand (Obscured)</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          id="leftHandObscured"
                          step="0.1"
                          min="0"
                          value={formData.leftHandObscured}
                          onChange={(e) => handleChange('leftHandObscured', e.target.value)}
                          placeholder="0.0"
                        />
                        <span className="unit">seconds</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="measurement-item">
                    <div className="hand-icon right obscured">
                      <i className="fas fa-hand-paper"></i>
                    </div>
                    <div className="measurement-content">
                      <label htmlFor="rightHandObscured">Right Hand (Obscured)</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          id="rightHandObscured"
                          step="0.1"
                          min="0"
                          value={formData.rightHandObscured}
                          onChange={(e) => handleChange('rightHandObscured', e.target.value)}
                          placeholder="0.0"
                        />
                        <span className="unit">seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {(formData.leftHand || formData.rightHand || formData.leftHandObscured || formData.rightHandObscured) && (
              <div className="section-card results-section">
                <div className="section-header" onClick={() => toggleSection('results')}>
                  <div className="section-title">
                    <div className="section-icon">
                      <i className="fas fa-chart-bar"></i>
                    </div>
                    <h3>Result Analysis</h3>
                  </div>
                  <div className="section-toggle">
                    <i className={`fas fa-chevron-${activeSections.results ? 'up' : 'down'}`}></i>
                  </div>
                </div>
                
                {activeSections.results && (
                  <div className="section-content">
                    <div className="results-grid">
                      {formData.leftHand && formData.leftHandObscured && (
                        <div className="result-card">
                          <div className="result-title">
                            <i className="fas fa-exchange-alt"></i>
                            <span>Left Hand Difference</span>
                          </div>
                          <div className="result-value">
                            {Math.abs(parseFloat(formData.leftHandObscured) - parseFloat(formData.leftHand)).toFixed(2)}
                            <span className="unit">sec</span>
                          </div>
                        </div>
                      )}
                      
                      {formData.rightHand && formData.rightHandObscured && (
                        <div className="result-card">
                          <div className="result-title">
                            <i className="fas fa-exchange-alt"></i>
                            <span>Right Hand Difference</span>
                          </div>
                          <div className="result-value">
                            {Math.abs(parseFloat(formData.rightHandObscured) - parseFloat(formData.rightHand)).toFixed(2)}
                            <span className="unit">sec</span>
                          </div>
                        </div>
                      )}
                      
                      {formData.leftHand && formData.rightHand && (
                        <div className="result-card">
                          <div className="result-title">
                            <i className="fas fa-hands"></i>
                            <span>Unobscured Dominance</span>
                          </div>
                          <div className="result-value">
                            {parseFloat(formData.leftHand) < parseFloat(formData.rightHand) ? 
                              'Left Hand Faster' : 
                              parseFloat(formData.rightHand) < parseFloat(formData.leftHand) ? 
                                'Right Hand Faster' : 'Equal Performance'}
                          </div>
                        </div>
                      )}
                      
                      {formData.leftHandObscured && formData.rightHandObscured && (
                        <div className="result-card">
                          <div className="result-title">
                            <i className="fas fa-low-vision"></i>
                            <span>Obscured Dominance</span>
                          </div>
                          <div className="result-value">
                            {parseFloat(formData.leftHandObscured) < parseFloat(formData.rightHandObscured) ? 
                              'Left Hand Faster' : 
                              parseFloat(formData.rightHandObscured) < parseFloat(formData.leftHandObscured) ? 
                                'Right Hand Faster' : 'Equal Performance'}
                          </div>
                        </div>
                      )}
                      
                      {/* Best overall time */}
                      <div className="result-card highlight">
                        <div className="result-title">
                          <i className="fas fa-trophy"></i>
                          <span>Best Performance</span>
                        </div>
                        <div className="result-value">
                          {calculateResult().bestTime ? 
                            `${calculateResult().bestTime.toFixed(2)} sec` : 
                            'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="section-card notes-section">
              <div className="section-header" onClick={() => toggleSection('notes')}>
                <div className="section-title">
                  <div className="section-icon">
                    <i className="fas fa-sticky-note"></i>
                  </div>
                  <h3>Additional Notes</h3>
                </div>
                <div className="section-toggle">
                  <i className={`fas fa-chevron-${activeSections.notes ? 'up' : 'down'}`}></i>
                </div>
              </div>
              
              {activeSections.notes && (
                <div className="section-content">
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                    placeholder="Enter any additional observations or notes about the test results..."
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <div className="footer-actions">
            <button className="cancel-button" onClick={() => onClose()}>
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button className="submit-button" onClick={handleSubmit}>
              <i className="fas fa-check"></i>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobergModal;