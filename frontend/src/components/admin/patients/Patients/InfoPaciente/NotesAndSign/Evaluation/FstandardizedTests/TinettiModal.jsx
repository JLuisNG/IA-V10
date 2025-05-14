// Enhanced TinettiModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/TinettiModal.scss';

const TinettiModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    // Balance section
    sittingBalance: initialData?.sittingBalance || '',
    risesFromChair: initialData?.risesFromChair || '',
    attemptToRise: initialData?.attemptToRise || '',
    immediateStandingBalance: initialData?.immediateStandingBalance || '',
    standingBalance: initialData?.standingBalance || '',
    nudged: initialData?.nudged || '',
    eyesClosed: initialData?.eyesClosed || '',
    turning360Steps: initialData?.turning360Steps || '',
    turning360Stability: initialData?.turning360Stability || '',
    sittingDown: initialData?.sittingDown || '',
    
    // Gait section
    initiationOfGait: initialData?.initiationOfGait || '',
    rightStepLength: initialData?.rightStepLength || '',
    rightStepHeight: initialData?.rightStepHeight || '',
    leftStepLength: initialData?.leftStepLength || '',
    leftStepHeight: initialData?.leftStepHeight || '',
    stepSymmetry: initialData?.stepSymmetry || '',
    stepContinuity: initialData?.stepContinuity || '',
    path: initialData?.path || '',
    trunk: initialData?.trunk || '',
    walkingStance: initialData?.walkingStance || '',
    
    // Totals
    balanceTotal: initialData?.balanceTotal || 0,
    gaitTotal: initialData?.gaitTotal || 0,
    totalScore: initialData?.totalScore || 0,
    isComplete: initialData?.isComplete || false
  });
  
  // Estado para secciones colapsables
  const [sectionsOpen, setSectionsOpen] = useState({
    balance: true,
    gait: true
  });

  // Estado para la validación
  const [validationErrors, setValidationErrors] = useState({});

  // Estado para mostrar ayuda
  const [showHelp, setShowHelp] = useState(false);
  
  // Opciones para los campos de selección
  const balanceOptions = {
    sittingBalance: [
      { value: '0', label: '0 - Leans/Slides in Chair' },
      { value: '1', label: '1 - Steady, Safe' }
    ],
    risesFromChair: [
      { value: '0', label: '0 - Unable (without help)' },
      { value: '1', label: '1 - Able (uses arms)' },
      { value: '2', label: '2 - Able (w/out using arms)' }
    ],
    attemptToRise: [
      { value: '0', label: '0 - Unable (without help)' },
      { value: '1', label: '1 - Able (requires > 1 attempt)' },
      { value: '2', label: '2 - Able (1 attempt)' }
    ],
    immediateStandingBalance: [
      { value: '0', label: '0 - Unsteady (staggers, moves feet, trunk sway)' },
      { value: '1', label: '1 - Steady (but uses walker or other support)' },
      { value: '2', label: '2 - Steady (but w/out walker or other support)' }
    ],
    standingBalance: [
      { value: '0', label: '0 - Unsteady' },
      { value: '1', label: '1 - Steady (but with wide stance and uses support)' },
      { value: '2', label: '2 - Narrow Stance (w/out support)' }
    ],
    nudged: [
      { value: '0', label: '0 - Begins to fall' },
      { value: '1', label: '1 - Staggers, Grabs, Catches Self' },
      { value: '2', label: '2 - Steady' }
    ],
    eyesClosed: [
      { value: '0', label: '0 - Unsteady' },
      { value: '1', label: '1 - Steady' }
    ],
    turning360Steps: [
      { value: '0', label: '0 - Discontinuous Steps' },
      { value: '1', label: '1 - Continuous' }
    ],
    turning360Stability: [
      { value: '0', label: '0 - Unsteady (grab, staggers)' },
      { value: '1', label: '1 - Steady' }
    ],
    sittingDown: [
      { value: '0', label: '0 - Unsafe (misjudged distance, falls in chair)' },
      { value: '1', label: '1 - Uses Arms (not a smooth motion)' },
      { value: '2', label: '2 - Safe (smooth motion)' }
    ]
  };
    
  const gaitOptions = {
    initiationOfGait: [
      { value: '0', label: '0 - Any hesitancy or several attempts to start' },
      { value: '1', label: '1 - No hesitancy' }
    ],
    rightStepLength: [
      { value: '0', label: '0 - Fails to pass left stance foot w/ step' },
      { value: '1', label: '1 - Passes left stance foot' }
    ],
    rightStepHeight: [
      { value: '0', label: '0 - Fails to clear floor completely w/ step' },
      { value: '1', label: '1 - Completely clears floor' }
    ],
    leftStepLength: [
      { value: '0', label: '0 - Fails to pass right stance foot w/ step' },
      { value: '1', label: '1 - Passes right stance foot' }
    ],
    leftStepHeight: [
      { value: '0', label: '0 - Fails to clear floor completely w/ step' },
      { value: '1', label: '1 - Completely clears floor' }
    ],
    stepSymmetry: [
      { value: '0', label: '0 - Right and left step length unequal' },
      { value: '1', label: '1 - Right and left step equal' }
    ],
    stepContinuity: [
      { value: '0', label: '0 - Stopping or discontinuity between steps' },
      { value: '1', label: '1 - Steps appear continuous' }
    ],
    path: [
      { value: '0', label: '0 - Marked deviation' },
      { value: '1', label: '1 - Mid to moderate deviation or uses walking aid' },
      { value: '2', label: '2 - Walks straight without aid' }
    ],
    trunk: [
      { value: '0', label: '0 - Marked sway or uses walking aid' },
      { value: '1', label: '1 - No sway but flexion of knees or back or spreads arms out while walking' },
      { value: '2', label: '2 - No sway, flexion, use of arms, or use of walking aid' }
    ],
    walkingStance: [
      { value: '0', label: '0 - Heels apart' },
      { value: '1', label: '1 - Heels almost touch while walking' }
    ]
  };
  
  // Calcular totales cuando cambian los datos del formulario
  useEffect(() => {
    let balancePoints = 0;
    let gaitPoints = 0;
    
    // Balance subtotal
    if (formData.sittingBalance) balancePoints += parseInt(formData.sittingBalance);
    if (formData.risesFromChair) balancePoints += parseInt(formData.risesFromChair);
    if (formData.attemptToRise) balancePoints += parseInt(formData.attemptToRise);
    if (formData.immediateStandingBalance) balancePoints += parseInt(formData.immediateStandingBalance);
    if (formData.standingBalance) balancePoints += parseInt(formData.standingBalance);
    if (formData.nudged) balancePoints += parseInt(formData.nudged);
    if (formData.eyesClosed) balancePoints += parseInt(formData.eyesClosed);
    if (formData.turning360Steps) balancePoints += parseInt(formData.turning360Steps);
    if (formData.turning360Stability) balancePoints += parseInt(formData.turning360Stability);
    if (formData.sittingDown) balancePoints += parseInt(formData.sittingDown);
    
    // Gait subtotal
    if (formData.initiationOfGait) gaitPoints += parseInt(formData.initiationOfGait);
    if (formData.rightStepLength) gaitPoints += parseInt(formData.rightStepLength);
    if (formData.rightStepHeight) gaitPoints += parseInt(formData.rightStepHeight);
    if (formData.leftStepLength) gaitPoints += parseInt(formData.leftStepLength);
    if (formData.leftStepHeight) gaitPoints += parseInt(formData.leftStepHeight);
    if (formData.stepSymmetry) gaitPoints += parseInt(formData.stepSymmetry);
    if (formData.stepContinuity) gaitPoints += parseInt(formData.stepContinuity);
    if (formData.path) gaitPoints += parseInt(formData.path);
    if (formData.trunk) gaitPoints += parseInt(formData.trunk);
    if (formData.walkingStance) gaitPoints += parseInt(formData.walkingStance);
    
    // Actualizar el estado
    setFormData(prevData => ({
      ...prevData,
      balanceTotal: balancePoints,
      gaitTotal: gaitPoints,
      totalScore: balancePoints + gaitPoints
    }));
  }, [
    formData.sittingBalance, formData.risesFromChair, formData.attemptToRise,
    formData.immediateStandingBalance, formData.standingBalance, formData.nudged,
    formData.eyesClosed, formData.turning360Steps, formData.turning360Stability,
    formData.sittingDown, formData.initiationOfGait, formData.rightStepLength,
    formData.rightStepHeight, formData.leftStepLength, formData.leftStepHeight,
    formData.stepSymmetry, formData.stepContinuity, formData.path,
    formData.trunk, formData.walkingStance
  ]);
  
  // Verificar campos obligatorios
  const validateForm = () => {
    const errors = {};
    const requiredBalanceFields = [
      'sittingBalance', 'risesFromChair', 'attemptToRise', 
      'immediateStandingBalance', 'standingBalance', 'nudged', 
      'eyesClosed', 'turning360Steps', 'turning360Stability', 'sittingDown'
    ];
    
    const requiredGaitFields = [
      'initiationOfGait', 'rightStepLength', 'rightStepHeight',
      'leftStepLength', 'leftStepHeight', 'stepSymmetry',
      'stepContinuity', 'path', 'trunk', 'walkingStance'
    ];
    
    requiredBalanceFields.forEach(field => {
      if (!formData[field]) errors[field] = true;
    });
    
    requiredGaitFields.forEach(field => {
      if (!formData[field]) errors[field] = true;
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Verificar progreso del formulario
  const getCompletionPercentage = () => {
    const totalFields = 20; // Total de campos a completar
    const requiredFields = [
      'sittingBalance', 'risesFromChair', 'attemptToRise', 
      'immediateStandingBalance', 'standingBalance', 'nudged', 
      'eyesClosed', 'turning360Steps', 'turning360Stability', 'sittingDown',
      'initiationOfGait', 'rightStepLength', 'rightStepHeight',
      'leftStepLength', 'leftStepHeight', 'stepSymmetry',
      'stepContinuity', 'path', 'trunk', 'walkingStance'
    ];
    
    const completedFields = requiredFields.filter(field => formData[field]).length;
    return Math.round((completedFields / totalFields) * 100);
  };
    
  // Manejar cambios en los campos
  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
    
    // Borrar error de validación si existe
    if (validationErrors[field]) {
      setValidationErrors(prevErrors => {
        const newErrors = {...prevErrors};
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      // Marcar como completo y cerrar el modal
      setFormData(prevData => ({
        ...prevData,
        isComplete: true
      }));
      
      // Devolver los datos al componente padre
      onClose({
        ...formData,
        isComplete: true,
        score: formData.totalScore
      });
    } else {
      // Mostrar un mensaje de error y hacer scroll hacia arriba
      window.scrollTo(0, 0);
    }
  };

  // Alternar secciones colapsables
  const toggleSection = (section) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Obtener clase de riesgo basada en la puntuación total
  const getRiskClass = () => {
    if (formData.totalScore >= 24) return 'low-risk';
    if (formData.totalScore >= 19) return 'moderate-risk';
    return 'high-risk';
  };

  // Obtener mensaje de riesgo
  const getRiskMessage = () => {
    if (formData.totalScore >= 24) return 'Low Fall Risk';
    if (formData.totalScore >= 19) return 'Moderate Fall Risk';
    return 'High Fall Risk';
  };

  // Obtener indicaciones de intervención
  const getInterventionGuideline = () => {
    if (formData.totalScore <= 18) {
      return 'Consider comprehensive fall prevention program';
    } else if (formData.totalScore <= 23) {
      return 'Balance training and gait assessment recommended';
    } else {
      return 'General mobility maintenance';
    }
  };
  
  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;
  
  // Calcular porcentaje de progreso
  const completionPercentage = getCompletionPercentage();
  
  return (
    <div className="tinetti-modal-overlay">
      <div className="tinetti-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>
              <i className="fas fa-balance-scale"></i>
              Tinetti Balance & Gait Assessment
            </h2>
            <div className="header-actions">
              <button className="help-button" onClick={() => setShowHelp(!showHelp)}>
                <i className="fas fa-question-circle"></i>
                <span>Help</span>
              </button>
              <button className="close-button" onClick={() => onClose()}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="progress-text">
              <span>{completionPercentage}% Complete</span>
              {Object.keys(validationErrors).length > 0 && (
                <span className="error-count">
                  <i className="fas fa-exclamation-triangle"></i>
                  {Object.keys(validationErrors).length} items need attention
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-content">
          {showHelp && (
            <div className="help-panel">
              <div className="help-header">
                <h3>About the Tinetti Assessment</h3>
                <button onClick={() => setShowHelp(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="help-content">
                <p>The Tinetti Balance and Gait Assessment is a simple, easily administered test that measures a patient's gait and balance abilities.</p>
                <div className="help-sections">
                  <div className="help-section">
                    <h4>What it measures</h4>
                    <p>The test assesses 10 balance components and 8 gait components. Each component receives a score, with a maximum score of 28 points.</p>
                  </div>
                  <div className="help-section">
                    <h4>Interpreting results</h4>
                    <ul>
                      <li><span className="score high-risk">≤18 points</span>: High fall risk</li>
                      <li><span className="score moderate-risk">19-23 points</span>: Moderate fall risk</li>
                      <li><span className="score low-risk">≥24 points</span>: Low fall risk</li>
                    </ul>
                  </div>
                </div>
                <div className="help-footer">
                  <p>All fields in this assessment are required. Complete each section to generate a final score.</p>
                  <button className="help-close-btn" onClick={() => setShowHelp(false)}>
                    Close Help
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="assessment-info">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="info-text">
                <p>The Tinetti Assessment evaluates a person's balance and gait to determine fall risk. Complete all items below for an accurate assessment.</p>
              </div>
              <button className="info-button" onClick={() => setShowHelp(!showHelp)}>
                <i className="fas fa-lightbulb"></i>
                <span>Learn More</span>
              </button>
            </div>
          </div>

          <div className={`tinetti-section balance-section ${!sectionsOpen.balance ? 'collapsed' : ''}`}>
            <div 
              className="section-header" 
              onClick={() => toggleSection('balance')}
            >
              <div className="section-title">
                <h3>
                  <i className="fas fa-standing-person"></i>
                  Balance Section
                </h3>
                <span className="section-score">
                  Score: {formData.balanceTotal}/16
                </span>
              </div>
              <button className="toggle-btn">
                <i className={`fas fa-chevron-${sectionsOpen.balance ? 'up' : 'down'}`}></i>
              </button>
            </div>
            
            {sectionsOpen.balance && (
              <div className="section-content">
                <div className="tinetti-items">
                  <div className={`tinetti-item ${validationErrors.sittingBalance ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">1</span>
                      Sitting Balance
                    </label>
                    <select 
                      value={formData.sittingBalance}
                      onChange={(e) => handleChange('sittingBalance', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {balanceOptions.sittingBalance.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.sittingBalance && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.risesFromChair ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">2</span>
                      Rises From Chair
                    </label>
                    <select 
                      value={formData.risesFromChair}
                      onChange={(e) => handleChange('risesFromChair', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {balanceOptions.risesFromChair.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.risesFromChair && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.attemptToRise ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">3</span>
                      Attempt To Rise
                    </label>
                    <select 
                      value={formData.attemptToRise}
                      onChange={(e) => handleChange('attemptToRise', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {balanceOptions.attemptToRise.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.attemptToRise && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.immediateStandingBalance ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">4</span>
                      Immediate Standing Balance (5 sec.)
                    </label>
                    <select 
                      value={formData.immediateStandingBalance}
                      onChange={(e) => handleChange('immediateStandingBalance', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {balanceOptions.immediateStandingBalance.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.immediateStandingBalance && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.standingBalance ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">5</span>
                      Standing Balance
                    </label>
                    <select 
                      value={formData.standingBalance}
                      onChange={(e) => handleChange('standingBalance', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {balanceOptions.standingBalance.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.standingBalance && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.nudged ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">6</span>
                      Nudged
                    </label>
                    <select 
                      value={formData.nudged}
                      onChange={(e) => handleChange('nudged', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {balanceOptions.nudged.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.nudged && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.eyesClosed ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">7</span>
                      Eyes Closed
                    </label>
                    <select 
                      value={formData.eyesClosed}
                      onChange={(e) => handleChange('eyesClosed', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {balanceOptions.eyesClosed.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.eyesClosed && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item turning-item ${validationErrors.turning360Steps || validationErrors.turning360Stability ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">8</span>
                      Turning 360°
                    </label>
                    <div className="dual-select">
                      <div className="sub-item">
                        <label>Steps</label>
                        <select 
                          value={formData.turning360Steps}
                          onChange={(e) => handleChange('turning360Steps', e.target.value)}
                        >
                          <option value="">Select steps</option>
                          {balanceOptions.turning360Steps.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {validationErrors.turning360Steps && (
                          <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            Required
                          </div>
                        )}
                      </div>
                      
                      <div className="sub-item">
                        <label>Stability</label>
                        <select 
                          value={formData.turning360Stability}
                          onChange={(e) => handleChange('turning360Stability', e.target.value)}
                        >
                          <option value="">Select stability</option>
                          {balanceOptions.turning360Stability.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {validationErrors.turning360Stability && (
                          <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            Required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.sittingDown ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">9</span>
                      Sitting Down
                    </label>
                    <select 
                      value={formData.sittingDown}
                      onChange={(e) => handleChange('sittingDown', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {balanceOptions.sittingDown.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.sittingDown && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="section-footer">
              <div className="section-score-summary">
                <div className="score-label">Balance Score:</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${(formData.balanceTotal / 16) * 100}%` }}
                  ></div>
                </div>
                <div className="score-value">{formData.balanceTotal}/16 points</div>
              </div>
            </div>
          </div>
          
          <div className={`tinetti-section gait-section ${!sectionsOpen.gait ? 'collapsed' : ''}`}>
            <div 
              className="section-header" 
              onClick={() => toggleSection('gait')}
            >
              <div className="section-title">
                <h3>
                  <i className="fas fa-person-walking"></i>
                  Gait Section
                </h3>
                <span className="section-score">
                  Score: {formData.gaitTotal}/12
                </span>
              </div>
              <button className="toggle-btn">
              <i className={`fas fa-chevron-${sectionsOpen.gait ? 'up' : 'down'}`}></i>
              </button>
            </div>
            
            {sectionsOpen.gait && (
              <div className="section-content">
                <div className="tinetti-items">
                  <div className={`tinetti-item ${validationErrors.initiationOfGait ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">10</span>
                      Initiation of Gait
                    </label>
                    <select 
                      value={formData.initiationOfGait}
                      onChange={(e) => handleChange('initiationOfGait', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {gaitOptions.initiationOfGait.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.initiationOfGait && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className="tinetti-item step-item">
                    <label>
                      <span className="item-number">11</span>
                      Step Length & Height
                    </label>
                    <div className="multi-select">
                      <div className={`sub-item ${validationErrors.rightStepLength || validationErrors.rightStepHeight ? 'has-error' : ''}`}>
                        <div className="sub-item-header">
                          <i className="fas fa-shoe-prints"></i>
                          <label>Right swing foot</label>
                        </div>
                        <div className="sub-select-group">
                          <div className="select-with-label">
                            <span className="select-label">Length</span>
                            <select 
                              value={formData.rightStepLength}
                              onChange={(e) => handleChange('rightStepLength', e.target.value)}
                            >
                              <option value="">Select</option>
                              {gaitOptions.rightStepLength.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {validationErrors.rightStepLength && (
                              <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                Required
                              </div>
                            )}
                          </div>
                          
                          <div className="select-with-label">
                            <span className="select-label">Height</span>
                            <select 
                              value={formData.rightStepHeight}
                              onChange={(e) => handleChange('rightStepHeight', e.target.value)}
                            >
                              <option value="">Select</option>
                              {gaitOptions.rightStepHeight.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {validationErrors.rightStepHeight && (
                              <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                Required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`sub-item ${validationErrors.leftStepLength || validationErrors.leftStepHeight ? 'has-error' : ''}`}>
                        <div className="sub-item-header">
                          <i className="fas fa-shoe-prints fa-flip-horizontal"></i>
                          <label>Left swing foot</label>
                        </div>
                        <div className="sub-select-group">
                          <div className="select-with-label">
                            <span className="select-label">Length</span>
                            <select 
                              value={formData.leftStepLength}
                              onChange={(e) => handleChange('leftStepLength', e.target.value)}
                            >
                              <option value="">Select</option>
                              {gaitOptions.leftStepLength.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {validationErrors.leftStepLength && (
                              <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                Required
                              </div>
                            )}
                          </div>
                          
                          <div className="select-with-label">
                            <span className="select-label">Height</span>
                            <select 
                              value={formData.leftStepHeight}
                              onChange={(e) => handleChange('leftStepHeight', e.target.value)}
                            >
                              <option value="">Select</option>
                              {gaitOptions.leftStepHeight.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {validationErrors.leftStepHeight && (
                              <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                Required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.stepSymmetry ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">12</span>
                      Step Symmetry
                    </label>
                    <select 
                      value={formData.stepSymmetry}
                      onChange={(e) => handleChange('stepSymmetry', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {gaitOptions.stepSymmetry.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.stepSymmetry && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.stepContinuity ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">13</span>
                      Step Continuity
                    </label>
                    <select 
                      value={formData.stepContinuity}
                      onChange={(e) => handleChange('stepContinuity', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {gaitOptions.stepContinuity.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.stepContinuity && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.path ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">14</span>
                      Path
                    </label>
                    <select 
                      value={formData.path}
                      onChange={(e) => handleChange('path', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {gaitOptions.path.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.path && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.trunk ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">15</span>
                      Trunk
                    </label>
                    <select 
                      value={formData.trunk}
                      onChange={(e) => handleChange('trunk', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {gaitOptions.trunk.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.trunk && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                  
                  <div className={`tinetti-item ${validationErrors.walkingStance ? 'has-error' : ''}`}>
                    <label>
                      <span className="item-number">16</span>
                      Walking Stance
                    </label>
                    <select 
                      value={formData.walkingStance}
                      onChange={(e) => handleChange('walkingStance', e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {gaitOptions.walkingStance.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.walkingStance && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        This field is required
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="section-footer">
              <div className="section-score-summary">
                <div className="score-label">Gait Score:</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${(formData.gaitTotal / 12) * 100}%` }}
                  ></div>
                </div>
                <div className="score-value">{formData.gaitTotal}/12 points</div>
              </div>
            </div>
          </div>
          
          <div className="total-score">
            <div className={`score-card ${getRiskClass()}`}>
              <div className="score-header">
                <div className="score-title">
                  <h4>Total Tinetti Score</h4>
                  <span className="score-interpretation">{getRiskMessage()}</span>
                </div>
                <div className="score-badge-container">
                  <span className="score-badge">{formData.totalScore}</span>
                  <span className="score-max">/28</span>
                </div>
              </div>
              <div className="score-visualization">
                <div className="score-gauge">
                  <div className="gauge-sections">
                    <div className="gauge-section high-risk">
                      <span className="gauge-label">High Risk</span>
                      <span className="gauge-range">≤18</span>
                    </div>
                    <div className="gauge-section moderate-risk">
                      <span className="gauge-label">Moderate Risk</span>
                      <span className="gauge-range">19-23</span>
                    </div>
                    <div className="gauge-section low-risk">
                      <span className="gauge-label">Low Risk</span>
                      <span className="gauge-range">≥24</span>
                    </div>
                  </div>
                  <div className="gauge-indicator" style={{ 
                    left: `${Math.min(100, Math.max(0, (formData.totalScore / 28) * 100))}%` 
                  }}>
                    <div className="indicator-point"></div>
                    <div className="indicator-value">{formData.totalScore}</div>
                  </div>
                </div>
              </div>
              <div className="score-interpretation">
                <div className="risk-levels">
                  <div className={`risk-level ${formData.totalScore <= 18 ? 'active' : ''}`}>
                    <div className="risk-indicator high"></div>
                    <div className="risk-text">
                      <strong>High Risk (≤18)</strong>
                      <span>Increased fall risk</span>
                    </div>
                  </div>
                  <div className={`risk-level ${formData.totalScore >= 19 && formData.totalScore <= 23 ? 'active' : ''}`}>
                    <div className="risk-indicator moderate"></div>
                    <div className="risk-text">
                      <strong>Moderate Risk (19-23)</strong>
                      <span>Moderate fall risk</span>
                    </div>
                  </div>
                  <div className={`risk-level ${formData.totalScore >= 24 ? 'active' : ''}`}>
                    <div className="risk-indicator low"></div>
                    <div className="risk-text">
                      <strong>Low Risk (≥24)</strong>
                      <span>Lower fall risk</span>
                    </div>
                  </div>
                </div>
                <div className="guidelines">
                  <div className="guideline-header">
                    <i className="fas fa-clipboard-list"></i>
                    <h5>Intervention Guidelines</h5>
                  </div>
                  <div className="guideline-content">
                    <div className="guideline-item">
                      <div className="guideline-bullet"></div>
                      <p>{getInterventionGuideline()}</p>
                    </div>
                    <div className="guideline-item">
                      <div className="guideline-bullet"></div>
                      <p>Document results in patient's medical record</p>
                    </div>
                    <div className="guideline-item">
                      <div className="guideline-bullet"></div>
                      <p>Implement fall prevention protocols as appropriate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <div className="footer-status">
            {Object.keys(validationErrors).length > 0 ? (
              <div className="validation-status error">
                <i className="fas fa-exclamation-triangle"></i>
                <span>Please complete all required fields</span>
              </div>
            ) : (
              <div className="validation-status success">
                <i className="fas fa-check-circle"></i>
                <span>Ready to submit</span>
              </div>
            )}
          </div>
          <div className="footer-actions">
            <button className="cancel-btn" onClick={() => onClose()}>
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button 
              className={`submit-btn ${Object.keys(validationErrors).length > 0 ? 'disabled' : ''}`} 
              onClick={handleSubmit}
            >
              <i className="fas fa-check"></i>
              SUBMIT ASSESSMENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinettiModal;