// Enhanced FourStageBalanceTestModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/FourStageBalanceTestModal.scss';

const FourStageBalanceTestModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    sideByStandTime: initialData?.sideByStandTime || '',
    semiTandemTime: initialData?.semiTandemTime || '',
    tandemTime: initialData?.tandemTime || '',
    oneLegtandTime: initialData?.oneLegtandTime || '',
    stageCompleted: initialData?.stageCompleted || 0,
    additionalNotes: initialData?.additionalNotes || '',
    fallRisk: initialData?.fallRisk || '',
    isComplete: initialData?.isComplete || false
  });

  // Estado para la validación
  const [validationErrors, setValidationErrors] = useState({});

  // Estado para posición activa en la animación
  const [activePosition, setActivePosition] = useState(1);
  
  // Estado para animaciones
  const [fadeIn, setFadeIn] = useState(false);
  const [activeStage, setActiveStage] = useState(null);

  // Estado para el cronómetro
  const [timerRunning, setTimerRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerStage, setTimerStage] = useState(null);

  // Efecto para animación inicial
  useEffect(() => {
    setFadeIn(true);
    
    // Animación secuencial para las posiciones
    let currentStage = 1;
    const interval = setInterval(() => {
      setActiveStage(currentStage);
      currentStage = (currentStage % 4) + 1;
      
      setTimeout(() => {
        setActiveStage(null);
      }, 300);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  // Calcular el nivel de riesgo de caída
  useEffect(() => {
    let risk = '';
    const stage = formData.stageCompleted;

    if (stage === 0) {
      risk = 'Not determined';
    } else if (stage === 1) {
      risk = 'High fall risk';
    } else if (stage === 2) {
      risk = 'Moderate fall risk';
    } else if (stage === 3) {
      risk = 'Moderate fall risk';
    } else if (stage === 4) {
      risk = 'Low fall risk';
    }

    setFormData(prev => ({ ...prev, fallRisk: risk }));
  }, [formData.stageCompleted]);

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

    // Actualizar la etapa completada basada en los tiempos
    if (field.includes('Time')) {
      updateCompletedStage();
    }
  };

  // Actualizar la etapa completada basada en los tiempos ingresados
  const updateCompletedStage = () => {
    let stageCompleted = 0;

    if (formData.sideByStandTime && parseFloat(formData.sideByStandTime) >= 10) {
      stageCompleted = 1;
      
      if (formData.semiTandemTime && parseFloat(formData.semiTandemTime) >= 10) {
        stageCompleted = 2;
        
        if (formData.tandemTime && parseFloat(formData.tandemTime) >= 10) {
          stageCompleted = 3;
          
          if (formData.oneLegtandTime && parseFloat(formData.oneLegtandTime) >= 10) {
            stageCompleted = 4;
          }
        }
      }
    }

    setFormData(prevData => ({
      ...prevData,
      stageCompleted
    }));
  };

  // Iniciar el cronómetro para una etapa específica
  const startTimer = (stage) => {
    if (timerRunning) {
      stopTimer();
      return;
    }

    setTimerStage(stage);
    setTimerRunning(true);
    setTimer(0);
    
    // Activar la animación para la etapa correspondiente
    setActiveStage(stage);
  };

// Detener el cronómetro y guardar el resultado
const stopTimer = () => {
  setTimerRunning(false);
  
  if (timerStage) {
    const fieldMap = {
      1: 'sideByStandTime',
      2: 'semiTandemTime',
      3: 'tandemTime',
      4: 'oneLegtandTime'
    };
    
    handleChange(fieldMap[timerStage], (timer / 10).toFixed(1));
  }
  
  setTimerStage(null);
  setActiveStage(null);
};

// Actualizar el cronómetro cada 100ms
useEffect(() => {
  let interval = null;
  
  if (timerRunning) {
    interval = setInterval(() => {
      setTimer(prevTime => prevTime + 1);
    }, 100);
  } else if (!timerRunning && timer !== 0) {
    clearInterval(interval);
  }
  
  return () => clearInterval(interval);
}, [timerRunning, timer]);

// Formatear tiempo para mostrar
const formatTime = (time) => {
  const seconds = Math.floor(time / 10);
  const tenths = time % 10;
  return `${seconds}.${tenths}`;
};

// Validar el formulario
const validateForm = () => {
  const errors = {};
  
  // Verificar que al menos la primera etapa tenga un tiempo
  if (!formData.sideByStandTime) {
    errors.sideByStandTime = true;
  }
  
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};

// Obtener clase de riesgo basada en el nivel de riesgo
const getRiskClass = () => {
  if (formData.fallRisk.toLowerCase().includes('high')) return 'high';
  if (formData.fallRisk.toLowerCase().includes('moderate')) return 'moderate';
  if (formData.fallRisk.toLowerCase().includes('low')) return 'low';
  return '';
};

// Manejar el envío del formulario
const handleSubmit = () => {
  if (validateForm()) {
    // Animación de salida
    setFadeIn(false);
    
    setTimeout(() => {
      onClose({
        ...formData,
        isComplete: true,
        score: formData.stageCompleted
      });
    }, 300);
  }
};

// Cambiar la posición activa en la animación
useEffect(() => {
  const interval = setInterval(() => {
    setActivePosition(prev => (prev % 4) + 1);
  }, 2000);
  
  return () => clearInterval(interval);
}, []);

// Si el modal no está abierto, no renderizar nada
if (!isOpen) return null;

return (
  <div className={`four-stage-modal-overlay ${fadeIn ? 'fade-in' : 'fade-out'}`}>
    <div className="four-stage-modal">
      <div className="modal-header">
        <h2>
          <div className="header-icon">
            <i className="fas fa-balance-scale"></i>
          </div>
          <span>Four Stage Balance Test</span>
        </h2>
        <div className={`risk-badge-header ${getRiskClass()}`}>
          Stage {formData.stageCompleted} / 4
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
              <p>The Four Stage Balance Test assesses static balance by testing the patient's ability to maintain four increasingly difficult stances. Each position should be held for 10 seconds to be considered successful.</p>
            </div>
          </div>
        </div>
        
        <div className="balance-visualization">
          <div className="stages-container">
            <div className={`balance-stage ${activePosition === 1 ? 'active' : ''} ${activeStage === 1 ? 'highlight' : ''} ${formData.stageCompleted >= 1 ? 'completed' : ''}`}>
              <div className="stage-number">1</div>
              <div className="stage-content">
                <h4>Side-by-Side Stand</h4>
                <div className="figure-container">
                  <div className="stage-figure side-by-side"></div>
                </div>
                <div className="stage-time">
                  {formData.sideByStandTime ? `${formData.sideByStandTime} sec` : 'Not completed'}
                </div>
              </div>
            </div>
            
            <div className={`balance-stage ${activePosition === 2 ? 'active' : ''} ${activeStage === 2 ? 'highlight' : ''} ${formData.stageCompleted >= 2 ? 'completed' : ''}`}>
              <div className="stage-number">2</div>
              <div className="stage-content">
                <h4>Semi-Tandem Stand</h4>
                <div className="figure-container">
                  <div className="stage-figure semi-tandem"></div>
                </div>
                <div className="stage-time">
                  {formData.semiTandemTime ? `${formData.semiTandemTime} sec` : 'Not completed'}
                </div>
              </div>
            </div>
            
            <div className={`balance-stage ${activePosition === 3 ? 'active' : ''} ${activeStage === 3 ? 'highlight' : ''} ${formData.stageCompleted >= 3 ? 'completed' : ''}`}>
              <div className="stage-number">3</div>
              <div className="stage-content">
                <h4>Tandem Stand</h4>
                <div className="figure-container">
                  <div className="stage-figure tandem"></div>
                </div>
                <div className="stage-time">
                  {formData.tandemTime ? `${formData.tandemTime} sec` : 'Not completed'}
                </div>
              </div>
            </div>
            
            <div className={`balance-stage ${activePosition === 4 ? 'active' : ''} ${activeStage === 4 ? 'highlight' : ''} ${formData.stageCompleted >= 4 ? 'completed' : ''}`}>
              <div className="stage-number">4</div>
              <div className="stage-content">
                <h4>One Leg Stand</h4>
                <div className="figure-container">
                  <div className="stage-figure one-leg"></div>
                </div>
                <div className="stage-time">
                  {formData.oneLegtandTime ? `${formData.oneLegtandTime} sec` : 'Not completed'}
                </div>
              </div>
            </div>
          </div>
          
          {timerRunning && (
            <div className="timer-display">
              <div className="timer-stage">Stage {timerStage}</div>
              <div className="timer-value">{formatTime(timer)}</div>
              <div className="timer-controls">
                <button className="stop-timer" onClick={stopTimer}>
                  <i className="fas fa-stop"></i>
                  <span>Stop</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="measurements-section">
          <div className="section-header">
            <h3>
              <i className="fas fa-ruler"></i>
              Measurements
            </h3>
          </div>
          
          <div className="stages-grid">
            <div className={`stage-measurement-card ${validationErrors.sideByStandTime ? 'has-error' : ''} ${formData.stageCompleted >= 1 ? 'completed' : ''}`}>
              <div className="stage-info">
                <div className="stage-badge">1</div>
                <div className="stage-name">Side-by-Side Stand</div>
              </div>
              <div className="measurement-input">
                <input 
                  type="number" 
                  value={formData.sideByStandTime}
                  onChange={(e) => handleChange('sideByStandTime', e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  className={validationErrors.sideByStandTime ? 'error' : ''}
                />
                <span className="input-unit">sec</span>
                <button 
                  className="timer-button"
                  onClick={() => startTimer(1)}
                  disabled={timerRunning && timerStage !== 1}
                >
                  {timerRunning && timerStage === 1 ? (
                    <i className="fas fa-stop"></i>
                  ) : (
                    <i className="fas fa-stopwatch"></i>
                  )}
                </button>
              </div>
              {validationErrors.sideByStandTime && (
                <div className="error-message">Required</div>
              )}
            </div>
            
            <div className={`stage-measurement-card ${formData.stageCompleted >= 2 ? 'completed' : ''}`}>
              <div className="stage-info">
                <div className="stage-badge">2</div>
                <div className="stage-name">Semi-Tandem Stand</div>
              </div>
              <div className="measurement-input">
                <input 
                  type="number" 
                  value={formData.semiTandemTime}
                  onChange={(e) => handleChange('semiTandemTime', e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                />
                <span className="input-unit">sec</span>
                <button 
                  className="timer-button"
                  onClick={() => startTimer(2)}
                  disabled={timerRunning && timerStage !== 2}
                >
                  {timerRunning && timerStage === 2 ? (
                    <i className="fas fa-stop"></i>
                  ) : (
                    <i className="fas fa-stopwatch"></i>
                  )}
                </button>
              </div>
            </div>
            
            <div className={`stage-measurement-card ${formData.stageCompleted >= 3 ? 'completed' : ''}`}>
              <div className="stage-info">
                <div className="stage-badge">3</div>
                <div className="stage-name">Tandem Stand</div>
              </div>
              <div className="measurement-input">
                <input 
                  type="number" 
                  value={formData.tandemTime}
                  onChange={(e) => handleChange('tandemTime', e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                />
                <span className="input-unit">sec</span>
                <button 
                  className="timer-button"
                  onClick={() => startTimer(3)}
                  disabled={timerRunning && timerStage !== 3}
                >
                  {timerRunning && timerStage === 3 ? (
                    <i className="fas fa-stop"></i>
                  ) : (
                    <i className="fas fa-stopwatch"></i>
                  )}
                </button>
              </div>
            </div>
            
            <div className={`stage-measurement-card ${formData.stageCompleted >= 4 ? 'completed' : ''}`}>
              <div className="stage-info">
                <div className="stage-badge">4</div>
                <div className="stage-name">One Leg Stand</div>
              </div>
              <div className="measurement-input">
                <input 
                  type="number" 
                  value={formData.oneLegtandTime}
                  onChange={(e) => handleChange('oneLegtandTime', e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                />
                <span className="input-unit">sec</span>
                <button 
                  className="timer-button"
                  onClick={() => startTimer(4)}
                  disabled={timerRunning && timerStage !== 4}
                >
                  {timerRunning && timerStage === 4 ? (
                    <i className="fas fa-stop"></i>
                  ) : (
                    <i className="fas fa-stopwatch"></i>
                  )}
                </button>
              </div>
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
            <div className={`result-card ${getRiskClass()}`}>
              <div className="result-header">
                <div className="result-title">Fall Risk Assessment</div>
                <div className="result-badge">Stage {formData.stageCompleted} Completed</div>
              </div>
              
              <div className="risk-level-indication">
                <div className="risk-label">Risk Level:</div>
                <div className="risk-value">{formData.fallRisk}</div>
              </div>
              
              <div className="risk-interpretation">
                <div className="interpretation-header">Interpretation Guide</div>
                <div className="risk-levels">
                  <div className={`risk-level ${formData.stageCompleted === 0 ? 'active' : ''}`}>
                    <div className="level-indicator not-determined"></div>
                    <div className="level-description">
                      <strong>Stage 0:</strong> Unable to complete any position
                    </div>
                  </div>
                  
                  <div className={`risk-level ${formData.stageCompleted === 1 ? 'active' : ''}`}>
                    <div className="level-indicator high"></div>
                    <div className="level-description">
                      <strong>Stage 1:</strong> Completed Side-by-Side Stand only
                    </div>
                  </div>
                  
                  <div className={`risk-level ${formData.stageCompleted === 2 ? 'active' : ''}`}>
                    <div className="level-indicator moderate"></div>
                    <div className="level-description">
                      <strong>Stage 2:</strong> Completed Semi-Tandem Stand
                    </div>
                  </div>
                  
                  <div className={`risk-level ${formData.stageCompleted === 3 ? 'active' : ''}`}>
                    <div className="level-indicator moderate"></div>
                    <div className="level-description">
                      <strong>Stage 3:</strong> Completed Tandem Stand
                    </div>
                  </div>
                  
                  <div className={`risk-level ${formData.stageCompleted === 4 ? 'active' : ''}`}>
                    <div className="level-indicator low"></div>
                    <div className="level-description">
                      <strong>Stage 4:</strong> Completed One Leg Stand
                    </div>
                  </div>
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
              value={formData.additionalNotes}
              onChange={(e) => handleChange('additionalNotes', e.target.value)}
              placeholder="Enter any additional observations or notes about the test..."
              rows={4}
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="modal-footer">
        <div className="assessment-summary">
          <div className={`risk-indicator ${getRiskClass()}`}>
            <span className="risk-dot"></span>
            <span className="risk-text">{formData.fallRisk || 'Not determined'}</span>
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

export default FourStageBalanceTestModal;