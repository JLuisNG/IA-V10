// Enhanced AdvancedBalanceModal.jsx
import React, { useState } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/AdvancedBalanceModal.scss';

const AdvancedBalanceModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    // Sharp-Pursar Test
    sharpPursarTest: initialData?.sharpPursarTest || 'Neg',
    
    // Oculomotor Tests
    smoothPursuit: initialData?.smoothPursuit || 'Neg',
    saccades: initialData?.saccades || 'Neg',
    nystagmusPresent: initialData?.nystagmusPresent || 'Neg',
    
    // Vestibular Tests
    headShakeNystagmus: initialData?.headShakeNystagmus || 'Neg',
    headThrustRight: initialData?.headThrustRight || 'Neg',
    headThrustLeft: initialData?.headThrustLeft || 'Neg',
    
    // Additional Testing
    dynamicVisualAcuity: initialData?.dynamicVisualAcuity || 'Neg',
    linesOfDeficit: initialData?.linesOfDeficit || '',
    gazeStabilizationDeficits: initialData?.gazeStabilizationDeficits || 'No',
    otherTesting: initialData?.otherTesting || '',
    
    // MCTSIB (Modified Clinical Test of Sensory Integration for Balance)
    eyesOpenFirmSurface: initialData?.eyesOpenFirmSurface || '',
    eyesClosedFirmSurface: initialData?.eyesClosedFirmSurface || '',
    eyesOpenCompliantSurface: initialData?.eyesOpenCompliantSurface || '',
    eyesClosedCompliantSurface: initialData?.eyesClosedCompliantSurface || '',
    
    // Additional Scores
    tinettiPOMA: initialData?.tinettiPOMA || '',
    dynamicGait4Step: initialData?.dynamicGait4Step || '',
    dynamicGait8Step: initialData?.dynamicGait8Step || '',
    
    // Additional Fields
    otherBalanceTests: initialData?.otherBalanceTests || '',
    interpretation: initialData?.interpretation || '',
    
    isComplete: initialData?.isComplete || false
  });

  // Opciones para los campos de selección
  const posNegOptions = [
    { value: 'Pos', label: 'Pos' },
    { value: 'Neg', label: 'Neg' }
  ];

  const yesNoOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ];

  // Manejar cambios en los campos
  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    // Marcar como completo y cerrar el modal
    setFormData(prevData => ({
      ...prevData,
      isComplete: true
    }));
    
    // Devolver los datos al componente padre
    onClose({
      ...formData,
      isComplete: true,
      // El puntaje no es relevante para esta evaluación
      score: null
    });
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="advanced-balance-modal-overlay">
      <div className="advanced-balance-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>
              <i className="fas fa-balance-scale-right"></i>
              <span>Advanced Balance Assessment</span>
            </h2>
            <p className="header-subtitle">Comprehensive vestibular and balance evaluation</p>
          </div>
          <button className="close-button" onClick={() => onClose()} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="info-note">
            <div className="note-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <div className="note-content">
              <p>Prior scores are for reference only. To print previous scores please type in additional boxes below.</p>
            </div>
          </div>
          
          <div className="assessment-section">
            <div className="section-card">
              <div className="card-header">
                <div className="header-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Cervical Instability Assessment</h3>
              </div>
              <div className="card-content">
                <div className="test-item">
                  <div className="test-label">
                    <label>SHARP-PURSAR TEST:</label>
                    <span className="label-hint">Tests for cervical instability</span>
                  </div>
                  <div className="test-options">
                    <div className="toggle-option-group">
                      {posNegOptions.map(option => (
                        <div 
                          key={option.value}
                          className={`toggle-option ${formData.sharpPursarTest === option.value ? 'active' : ''} ${option.value === 'Pos' ? 'positive' : 'negative'}`}
                          onClick={() => handleChange('sharpPursarTest', option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dual-section">
              <div className="section-card">
                <div className="card-header">
                  <div className="header-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3>Oculomotor Assessment</h3>
                </div>
                <div className="card-content">
                  <div className="test-item">
                    <div className="test-label">
                      <label>SMOOTH PURSUIT:</label>
                      <span className="label-hint">Eye tracking of moving targets</span>
                    </div>
                    <div className="test-options">
                      <div className="toggle-option-group">
                        {posNegOptions.map(option => (
                          <div 
                            key={option.value}
                            className={`toggle-option ${formData.smoothPursuit === option.value ? 'active' : ''} ${option.value === 'Pos' ? 'positive' : 'negative'}`}
                            onClick={() => handleChange('smoothPursuit', option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="test-item">
                    <div className="test-label">
                      <label>SACCADES:</label>
                      <span className="label-hint">Rapid eye movements between fixed points</span>
                    </div>
                    <div className="test-options">
                      <div className="toggle-option-group">
                        {posNegOptions.map(option => (
                          <div 
                            key={option.value}
                            className={`toggle-option ${formData.saccades === option.value ? 'active' : ''} ${option.value === 'Pos' ? 'positive' : 'negative'}`}
                            onClick={() => handleChange('saccades', option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="test-item">
                    <div className="test-label">
                      <label>NYSTAGMUS PRESENT:</label>
                      <span className="label-hint">Involuntary eye movements</span>
                    </div>
                    <div className="test-options">
                      <div className="toggle-option-group">
                        {posNegOptions.map(option => (
                          <div 
                            key={option.value}
                            className={`toggle-option ${formData.nystagmusPresent === option.value ? 'active' : ''} ${option.value === 'Pos' ? 'positive' : 'negative'}`}
                            onClick={() => handleChange('nystagmusPresent', option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section-card">
                <div className="card-header">
                  <div className="header-icon">
                    <i className="fas fa-deaf"></i>
                  </div>
                  <h3>Vestibular Assessment</h3>
                </div>
                <div className="card-content">
                  <div className="test-item">
                    <div className="test-label">
                      <label>HEAD SHAKE NYSTAGMUS:</label>
                    </div>
                    <div className="test-options">
                      <div className="toggle-option-group">
                        {posNegOptions.map(option => (
                          <div 
                            key={option.value}
                            className={`toggle-option ${formData.headShakeNystagmus === option.value ? 'active' : ''} ${option.value === 'Pos' ? 'positive' : 'negative'}`}
                            onClick={() => handleChange('headShakeNystagmus', option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="test-item">
                    <div className="test-label">
                      <label>HEAD THRUST (R):</label>
                      <span className="label-hint">Right side</span>
                    </div>
                    <div className="test-options">
                      <div className="toggle-option-group">
                        {posNegOptions.map(option => (
                          <div 
                            key={option.value}
                            className={`toggle-option ${formData.headThrustRight === option.value ? 'active' : ''} ${option.value === 'Pos' ? 'positive' : 'negative'}`}
                            onClick={() => handleChange('headThrustRight', option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="test-item">
                    <div className="test-label">
                      <label>HEAD THRUST (L):</label>
                      <span className="label-hint">Left side</span>
                    </div>
                    <div className="test-options">
                      <div className="toggle-option-group">
                        {posNegOptions.map(option => (
                          <div 
                            key={option.value}
                            className={`toggle-option ${formData.headThrustLeft === option.value ? 'active' : ''} ${option.value === 'Pos' ? 'positive' : 'negative'}`}
                            onClick={() => handleChange('headThrustLeft', option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="section-card">
              <div className="card-header">
                <div className="header-icon">
                  <i className="fas fa-low-vision"></i>
                </div>
                <h3>Dynamic Visual Acuity</h3>
              </div>
              <div className="card-content">
                <div className="test-item">
                  <div className="test-label">
                    <label>DYNAMIC VISUAL ACUITY (DVA):</label>
                  </div>
                  <div className="test-options">
                    <div className="toggle-option-group">
                      {posNegOptions.map(option => (
                        <div 
                          key={option.value}
                          className={`toggle-option ${formData.dynamicVisualAcuity === option.value ? 'active' : ''} ${option.value === 'Pos' ? 'positive' : 'negative'}`}
                          onClick={() => handleChange('dynamicVisualAcuity', option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="test-item">
                  <div className="test-label">
                    <label>LINES OF DEFICIT:</label>
                    <span className="label-hint">0-2 lines indicates vestibular hypofunction</span>
                  </div>
                  <div className="test-options">
                    <div className="input-field">
                      <input
                        type="text"
                        value={formData.linesOfDeficit}
                        onChange={(e) => handleChange('linesOfDeficit', e.target.value)}
                        placeholder="Enter number of lines"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="test-item">
                  <div className="test-label">
                    <label>GAZE STABILIZATION DEFICITS:</label>
                    <span className="label-hint">Based on oculomotor and vestibular testing</span>
                  </div>
                  <div className="test-options">
                    <div className="toggle-option-group">
                      {yesNoOptions.map(option => (
                        <div 
                          key={option.value}
                          className={`toggle-option ${formData.gazeStabilizationDeficits === option.value ? 'active' : ''} ${option.value === 'Yes' ? 'positive' : 'negative'}`}
                          onClick={() => handleChange('gazeStabilizationDeficits', option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="test-item full-width">
                  <div className="test-label">
                    <label>OTHER TESTING:</label>
                  </div>
                  <div className="test-options">
                    <div className="input-field">
                      <textarea
                        value={formData.otherTesting}
                        onChange={(e) => handleChange('otherTesting', e.target.value)}
                        rows={3}
                        placeholder="Describe any other tests performed"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="section-card">
              <div className="card-header">
                <div className="header-icon">
                  <i className="fas fa-standing-balance"></i>
                </div>
                <h3>Modified Clinical Test of Sensory Integration for Balance (MCTSIB)</h3>
              </div>
              <div className="card-content mctsib-content">
                <div className="mctsib-grid">
                  <div className="grid-section balance-tests">
                    <div className="section-title">Balance Testing</div>
                    <div className="test-grid-item">
                      <div className="test-grid-label">EYES OPEN - FIRM SURFACE:</div>
                      <div className="test-grid-input">
                        <div className="input-with-unit">
                          <input
                            type="text"
                            value={formData.eyesOpenFirmSurface}
                            onChange={(e) => handleChange('eyesOpenFirmSurface', e.target.value)}
                            placeholder=""
                          />
                          <span className="unit">/ 30 sec</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="test-grid-item">
                      <div className="test-grid-label">EYES CLOSED - FIRM SURFACE:</div>
                      <div className="test-grid-input">
                        <div className="input-with-unit">
                          <input
                            type="text"
                            value={formData.eyesClosedFirmSurface}
                            onChange={(e) => handleChange('eyesClosedFirmSurface', e.target.value)}
                            placeholder=""
                          />
                          <span className="unit">/ 30 sec</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="test-grid-item">
                      <div className="test-grid-label">EYES OPEN - COMPLIANT SURFACE:</div>
                      <div className="test-grid-input">
                        <div className="input-with-unit">
                          <input
                            type="text"
                            value={formData.eyesOpenCompliantSurface}
                            onChange={(e) => handleChange('eyesOpenCompliantSurface', e.target.value)}
                            placeholder=""
                          />
                          <span className="unit">/ 30 sec</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="test-grid-item">
                      <div className="test-grid-label">EYES CLOSED - COMPLIANT SURFACE:</div>
                      <div className="test-grid-input">
                        <div className="input-with-unit">
                          <input
                            type="text"
                            value={formData.eyesClosedCompliantSurface}
                            onChange={(e) => handleChange('eyesClosedCompliantSurface', e.target.value)}
                            placeholder=""
                          />
                          <span className="unit">/ 30 sec</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid-section functional-tests">
                    <div className="section-title">Functional Assessments</div>
                    <div className="test-grid-item">
                      <div className="test-grid-label">TINETTI (POMA):</div>
                      <div className="test-grid-input">
                        <div className="input-with-unit">
                          <input
                            type="text"
                            value={formData.tinettiPOMA}
                            onChange={(e) => handleChange('tinettiPOMA', e.target.value)}
                            placeholder=""
                          />
                          <span className="unit">/ 28</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="test-grid-item">
                      <div className="test-grid-label">DYNAMIC GAIT (DGI) 4 STEP:</div>
                      <div className="test-grid-input">
                        <div className="input-with-unit">
                          <input
                            type="text"
                            value={formData.dynamicGait4Step}
                            onChange={(e) => handleChange('dynamicGait4Step', e.target.value)}
                            placeholder=""
                          />
                          <span className="unit">/ 12</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="test-grid-item">
                      <div className="test-grid-label">DYNAMIC GAIT (DGI) 8 STEP:</div>
                      <div className="test-grid-input">
                        <div className="input-with-unit">
                          <input
                            type="text"
                            value={formData.dynamicGait8Step}
                            onChange={(e) => handleChange('dynamicGait8Step', e.target.value)}
                            placeholder=""
                          />
                          <span className="unit">/ 24</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="test-item full-width">
                  <div className="test-label">
                    <label>OTHER BALANCE TESTS:</label>
                  </div>
                  <div className="test-options">
                    <div className="input-field">
                      <textarea
                        value={formData.otherBalanceTests}
                        onChange={(e) => handleChange('otherBalanceTests', e.target.value)}
                        rows={3}
                        placeholder="Describe any other balance tests performed"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="section-card">
              <div className="card-header">
                <div className="header-icon">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <h3>Interpretation</h3>
              </div>
              <div className="card-content">
                <div className="test-item full-width">
                  <div className="test-label">
                    <label>INTERPRETATION OF STANDARDIZED TESTING AND IMPACT ON FUNCTION:</label>
                  </div>
                  <div className="test-options">
                    <div className="input-field">
                      <textarea
                        value={formData.interpretation}
                        onChange={(e) => handleChange('interpretation', e.target.value)}
                        rows={4}
                        placeholder="Provide interpretation of test results and impact on function"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
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
  );
};

export default AdvancedBalanceModal;