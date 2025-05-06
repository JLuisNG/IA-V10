// Enhanced DiabeticFootModal.jsx
import React, { useState } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/DiabeticFootModal.scss';

const DiabeticFootModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    frequency: initialData?.frequency || '',
    examBy: initialData?.examBy || 'RN/PT',
    examByClinician: initialData?.examByClinician || 'No',
    integumentFindings: initialData?.integumentFindings || '',
    
    pedalPulsesPresent: {
      right: initialData?.pedalPulsesPresent?.right || false,
      left: initialData?.pedalPulsesPresent?.left || false
    },
    pedalPulsesAbsent: {
      right: initialData?.pedalPulsesAbsent?.right || false,
      left: initialData?.pedalPulsesAbsent?.left || false
    },
    pedalPulsesNotes: initialData?.pedalPulsesNotes || '',
    
    lossOfSenseWarm: {
      right: initialData?.lossOfSenseWarm?.right || false,
      left: initialData?.lossOfSenseWarm?.left || false
    },
    lossOfSenseCold: {
      right: initialData?.lossOfSenseCold?.right || false,
      left: initialData?.lossOfSenseCold?.left || false
    },
    lossOfSenseNotes: initialData?.lossOfSenseNotes || '',
    
    neuropathy: {
      right: initialData?.neuropathy?.right || false,
      left: initialData?.neuropathy?.left || false
    },
    
    ascendingCalf: {
      right: initialData?.ascendingCalf?.right || '',
      left: initialData?.ascendingCalf?.left || ''
    },
    
    legHairPresent: {
      right: initialData?.legHairPresent?.right || false,
      left: initialData?.legHairPresent?.left || false
    },
    legHairAbsent: {
      right: initialData?.legHairAbsent?.right || false,
      left: initialData?.legHairAbsent?.left || false
    },
    
    tingling: {
      right: initialData?.tingling?.right || false,
      left: initialData?.tingling?.left || false
    },
    
    isComplete: initialData?.isComplete || false
  });

  // Opciones para el examinador
  const examinerOptions = [
    'Patient',
    'Caregiver',
    'RN/PT',
    'Other'
  ];

  // Manejar cambios en los campos de texto
  const handleTextChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Manejar cambios en el examinador
  const handleExaminerChange = (value) => {
    setFormData(prevData => ({
      ...prevData,
      examBy: value
    }));
  };

  // Manejar cambios en las medidas del músculo de la pantorrilla
  const handleCalfMeasureChange = (side, value) => {
    setFormData(prevData => ({
      ...prevData,
      ascendingCalf: {
        ...prevData.ascendingCalf,
        [side]: value
      }
    }));
  };

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (category, side) => {
    setFormData(prevData => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        [side]: !prevData[category][side]
      }
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    onClose({
      ...formData,
      isComplete: true
    });
  };

  // Función para calcular el número de hallazgos seleccionados
  const calculateFindings = () => {
    let count = 0;
    
    // Contar los pulsos pedales
    if (formData.pedalPulsesPresent.right) count++;
    if (formData.pedalPulsesPresent.left) count++;
    if (formData.pedalPulsesAbsent.right) count++;
    if (formData.pedalPulsesAbsent.left) count++;
    
    // Contar pérdida de sensación
    if (formData.lossOfSenseWarm.right) count++;
    if (formData.lossOfSenseWarm.left) count++;
    if (formData.lossOfSenseCold.right) count++;
    if (formData.lossOfSenseCold.left) count++;
    
    // Contar neuropatía
    if (formData.neuropathy.right) count++;
    if (formData.neuropathy.left) count++;
    
    // Contar hormigueo
    if (formData.tingling.right) count++;
    if (formData.tingling.left) count++;
    
    // Contar vello en la pierna
    if (formData.legHairPresent.right) count++;
    if (formData.legHairPresent.left) count++;
    if (formData.legHairAbsent.right) count++;
    if (formData.legHairAbsent.left) count++;
    
    return count;
  };
  
  // Calcular el porcentaje de finalización
  const completionPercentage = () => {
    const totalFields = 6; // Número de secciones en el formulario
    let completedFields = 0;
    
    if (formData.frequency) completedFields++;
    if (formData.examBy) completedFields++;
    if (formData.integumentFindings) completedFields++;
    if (calculateFindings() > 0) completedFields++;
    if (formData.pedalPulsesNotes || formData.lossOfSenseNotes) completedFields++;
    if (formData.ascendingCalf.right || formData.ascendingCalf.left) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="diabetic-foot-modal-overlay">
      <div className="diabetic-foot-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-shoe-prints"></i>
            Diabetic Foot Exam
          </h2>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="exam-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Exam Frequency</div>
                <div className="summary-value">{formData.frequency || 'Not specified'}</div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Examiner</div>
                <div className="summary-value">{formData.examBy}</div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-search"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Findings</div>
                <div className="summary-value">{calculateFindings()} observations</div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Completion</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${completionPercentage()}%` }}
                  ></div>
                  <span className="progress-text">{completionPercentage()}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="exam-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-info-circle"></i>
                Exam Information
              </h3>
            </div>
            
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-calendar-day"></i>
                    Frequency of Diabetic Foot Exam
                  </label>
                  <input
                    type="text"
                    value={formData.frequency}
                    onChange={(e) => handleTextChange('frequency', e.target.value)}
                    placeholder="E.g., Weekly, Monthly, etc."
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-user-md"></i>
                    Exam Performed By
                  </label>
                  <div className="option-cards">
                    {examinerOptions.map(option => (
                      <div 
                        key={option} 
                        className={`option-card ${formData.examBy === option ? 'selected' : ''}`}
                        onClick={() => handleExaminerChange(option)}
                      >
                        <div className="option-icon">
                          {option === 'Patient' && <i className="fas fa-user"></i>}
                          {option === 'Caregiver' && <i className="fas fa-user-nurse"></i>}
                          {option === 'RN/PT' && <i className="fas fa-user-md"></i>}
                          {option === 'Other' && <i className="fas fa-user-plus"></i>}
                        </div>
                        <div className="option-label">{option}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-clipboard-check"></i>
                    Exam By Clinician This Visit
                  </label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="examByClinician"
                      checked={formData.examByClinician === 'Yes'}
                      onChange={() => handleTextChange('examByClinician', formData.examByClinician === 'Yes' ? 'No' : 'Yes')}
                    />
                    <label htmlFor="examByClinician">
                      <span className="toggle-label">{formData.examByClinician}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="exam-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-clipboard-list"></i>
                Integument Findings
              </h3>
            </div>
            
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <textarea
                    value={formData.integumentFindings}
                    onChange={(e) => handleTextChange('integumentFindings', e.target.value)}
                    rows={4}
                    placeholder="Document any integument findings here (color, temperature, texture, moisture, etc.)"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="exam-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-heartbeat"></i>
                Pedal Pulses
              </h3>
            </div>
            
            <div className="section-content">
              <div className="foot-selection">
                <div className="foot-option">
                  <div className="foot-header">Present</div>
                  <div className="foot-toggles">
                    <div 
                      className={`foot-toggle ${formData.pedalPulsesPresent.right ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('pedalPulsesPresent', 'right')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                      </div>
                      <div className="foot-label">Right</div>
                    </div>
                    <div 
                      className={`foot-toggle ${formData.pedalPulsesPresent.left ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('pedalPulsesPresent', 'left')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints"></i>
                      </div>
                      <div className="foot-label">Left</div>
                    </div>
                  </div>
                </div>
                
                <div className="foot-option">
                  <div className="foot-header">Absent</div>
                  <div className="foot-toggles">
                    <div 
                      className={`foot-toggle ${formData.pedalPulsesAbsent.right ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('pedalPulsesAbsent', 'right')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                      </div>
                      <div className="foot-label">Right</div>
                    </div>
                    <div 
                      className={`foot-toggle ${formData.pedalPulsesAbsent.left ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('pedalPulsesAbsent', 'left')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints"></i>
                      </div>
                      <div className="foot-label">Left</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="notes-field">
                <label>
                  <i className="fas fa-pencil-alt"></i>
                  Additional Notes
                </label>
                <textarea
                  value={formData.pedalPulsesNotes}
                  onChange={(e) => handleTextChange('pedalPulsesNotes', e.target.value)}
                  placeholder="Add notes about pedal pulses findings"
                  rows={3}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          <div className="exam-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-temperature-low"></i>
                Loss of Sense
              </h3>
            </div>
            
            <div className="section-content">
              <div className="foot-selection">
                <div className="foot-option">
                  <div className="foot-header">Warm</div>
                  <div className="foot-toggles">
                    <div 
                      className={`foot-toggle ${formData.lossOfSenseWarm.right ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('lossOfSenseWarm', 'right')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                      </div>
                      <div className="foot-label">Right</div>
                    </div>
                    <div 
                      className={`foot-toggle ${formData.lossOfSenseWarm.left ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('lossOfSenseWarm', 'left')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints"></i>
                      </div>
                      <div className="foot-label">Left</div>
                    </div>
                  </div>
                </div>
                
                <div className="foot-option">
                  <div className="foot-header">Cold</div>
                  <div className="foot-toggles">
                    <div 
                      className={`foot-toggle ${formData.lossOfSenseCold.right ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('lossOfSenseCold', 'right')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                      </div>
                      <div className="foot-label">Right</div>
                    </div>
                    <div 
                      className={`foot-toggle ${formData.lossOfSenseCold.left ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('lossOfSenseCold', 'left')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints"></i>
                      </div>
                      <div className="foot-label">Left</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="notes-field">
                <label>
                  <i className="fas fa-pencil-alt"></i>
                  Additional Notes
                </label>
                <textarea
                  value={formData.lossOfSenseNotes}
                  onChange={(e) => handleTextChange('lossOfSenseNotes', e.target.value)}
                  placeholder="Add notes about loss of sense findings"
                  rows={3}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          <div className="exam-grid">
            <div className="exam-section mini">
              <div className="section-header">
                <h3>
                  <i className="fas fa-network-wired"></i>
                  Neuropathy
                </h3>
              </div>
              
              <div className="section-content">
                <div className="foot-toggles">
                  <div 
                    className={`foot-toggle ${formData.neuropathy.right ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange('neuropathy', 'right')}
                  >
                    <div className="foot-icon">
                      <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                    </div>
                    <div className="foot-label">Right</div>
                  </div>
                  <div 
                    className={`foot-toggle ${formData.neuropathy.left ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange('neuropathy', 'left')}
                  >
                    <div className="foot-icon">
                      <i className="fas fa-shoe-prints"></i>
                    </div>
                    <div className="foot-label">Left</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="exam-section mini">
              <div className="section-header">
                <h3>
                  <i className="fas fa-bolt"></i>
                  Tingling
                </h3>
              </div>
              
              <div className="section-content">
                <div className="foot-toggles">
                  <div 
                    className={`foot-toggle ${formData.tingling.right ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange('tingling', 'right')}
                  >
                    <div className="foot-icon">
                      <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                    </div>
                    <div className="foot-label">Right</div>
                  </div>
                  <div 
                    className={`foot-toggle ${formData.tingling.left ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange('tingling', 'left')}
                  >
                    <div className="foot-icon">
                      <i className="fas fa-shoe-prints"></i>
                    </div>
                    <div className="foot-label">Left</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="exam-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-ruler"></i>
                Ascending Calf Measurements
              </h3>
            </div>
            
            <div className="section-content">
              <div className="measurement-row">
                <div className="measurement-group">
                  <label>
                    <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                    Right Foot
                  </label>
                  <div className="measurement-input">
                    <input
                      type="text"
                      value={formData.ascendingCalf.right}
                      onChange={(e) => handleCalfMeasureChange('right', e.target.value)}
                      placeholder="0"
                      className="form-control"
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                
                <div className="measurement-group">
                  <label>
                    <i className="fas fa-shoe-prints"></i>
                    Left Foot
                  </label>
                  <div className="measurement-input">
                    <input
                      type="text"
                      value={formData.ascendingCalf.left}
                      onChange={(e) => handleCalfMeasureChange('left', e.target.value)}
                      placeholder="0"
                      className="form-control"
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="exam-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-user"></i>
                Leg Hair
              </h3>
            </div>
            
            <div className="section-content">
              <div className="foot-selection">
                <div className="foot-option">
                  <div className="foot-header">Present</div>
                  <div className="foot-toggles">
                    <div 
                      className={`foot-toggle ${formData.legHairPresent.right ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('legHairPresent', 'right')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                      </div>
                      <div className="foot-label">Right</div>
                    </div>
                    <div 
                      className={`foot-toggle ${formData.legHairPresent.left ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('legHairPresent', 'left')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints"></i>
                      </div>
                      <div className="foot-label">Left</div>
                    </div>
                  </div>
                </div>
                
                <div className="foot-option">
                  <div className="foot-header">Absent</div>
                  <div className="foot-toggles">
                    <div 
                      className={`foot-toggle ${formData.legHairAbsent.right ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('legHairAbsent', 'right')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                      </div>
                      <div className="foot-label">Right</div>
                    </div>
                    <div 
                      className={`foot-toggle ${formData.legHairAbsent.left ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange('legHairAbsent', 'left')}
                    >
                      <div className="foot-icon">
                        <i className="fas fa-shoe-prints"></i>
                      </div>
                      <div className="foot-label">Left</div>
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
            <span>Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiabeticFootModal;