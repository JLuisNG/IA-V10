// Enhanced SlumsModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/SlumsModal.scss';

const SlumsModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    patientAlert: initialData?.patientAlert || 'Yes',
    educationLevel: initialData?.educationLevel || 'High School Education',
    dayOfWeek: initialData?.dayOfWeek || 'Correct',
    year: initialData?.year || 'Correct',
    state: initialData?.state || 'Correct',
    objectsRemembered: initialData?.objectsRemembered || '5 Objects Correct',
    moneySpent: initialData?.moneySpent || 'Correct',
    moneyLeft: initialData?.moneyLeft || 'Correct',
    animalsNamed: initialData?.animalsNamed || '0-4 animals',
    hourMarkers: initialData?.hourMarkers || 'Correct',
    timeCorrect: initialData?.timeCorrect || 'Correct',
    trianglePoint: initialData?.trianglePoint || 'Correct',
    largestFigure: initialData?.largestFigure || 'Correct',
    femalesName: initialData?.femalesName || 'Correct',
    workType: initialData?.workType || 'Correct',
    backToWork: initialData?.backToWork || 'Correct',
    stateOfResidence: initialData?.stateOfResidence || 'Correct',
    number87: initialData?.number87 || 'Correct',
    number649: initialData?.number649 || 'Correct',
    number8537: initialData?.number8537 || 'Correct',
    additionalNotes: initialData?.additionalNotes || '',
    isComplete: initialData?.isComplete || false
  });

  // Estado para el total de puntos
  const [totalScore, setTotalScore] = useState(0);
  
  // Estado para animación
  const [animateScore, setAnimateScore] = useState(false);
  
  // Estado para validación
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estado para seguimiento de secciones expandidas/colapsadas
  const [expandedSections, setExpandedSections] = useState({
    orientation: true,
    memory: true,
    math: true,
    animals: true,
    clock: true,
    figures: true,
    story: true,
    numbers: true
  });
  
  // Opciones de selección
  const educationLevels = [
    { value: 'High School Education', label: 'High School Education' },
    { value: 'Less than High School Education', label: 'Less than High School Education' }
  ];
  
  const yesNoOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ];
  
  const correctIncorrectOptions = [
    { value: 'Correct', label: 'Correct' },
    { value: 'Incorrect', label: 'Incorrect' }
  ];
  
  const animalOptions = [
    { value: '0-4 animals', label: '0-4 animals (0 points)' },
    { value: '5-9 animals', label: '5-9 animals (1 point)' },
    { value: '10-14 animals', label: '10-14 animals (2 points)' },
    { value: '15+ animals', label: '15+ animals (3 points)' }
  ];
  
  const objectsRememberedOptions = [
    { value: '5 Objects Correct', label: '5 Objects Correct (5 points)' },
    { value: '4 Objects Correct', label: '4 Objects Correct (4 points)' },
    { value: '3 Objects Correct', label: '3 Objects Correct (3 points)' },
    { value: '2 Objects Correct', label: '2 Objects Correct (2 points)' },
    { value: '1 Object Correct', label: '1 Object Correct (1 point)' },
    { value: '0 Objects Correct', label: '0 Objects Correct (0 points)' }
  ];

  // Calcular puntuación total
  useEffect(() => {
    let score = 0;
    let prevScore = totalScore;
    
    // Puntuación para cada pregunta
    if (formData.dayOfWeek === 'Correct') score += 1;
    if (formData.year === 'Correct') score += 1;
    if (formData.state === 'Correct') score += 1;
    
    // Puntuación para objetos recordados
    switch (formData.objectsRemembered) {
      case '5 Objects Correct': score += 5; break;
      case '4 Objects Correct': score += 4; break;
      case '3 Objects Correct': score += 3; break;
      case '2 Objects Correct': score += 2; break;
      case '1 Object Correct': score += 1; break;
      default: break;
    }
    
    if (formData.moneySpent === 'Correct') score += 2;
    if (formData.moneyLeft === 'Correct') score += 2;
    
    // Puntuación por animales nombrados
    switch (formData.animalsNamed) {
      case '0-4 animals': score += 0; break;
      case '5-9 animals': score += 1; break;
      case '10-14 animals': score += 2; break;
      case '15+ animals': score += 3; break;
      default: break;
    }
    
    if (formData.hourMarkers === 'Correct') score += 2;
    if (formData.timeCorrect === 'Correct') score += 2;
    if (formData.trianglePoint === 'Correct') score += 1;
    if (formData.largestFigure === 'Correct') score += 1;
    if (formData.femalesName === 'Correct') score += 2;
    if (formData.workType === 'Correct') score += 2;
    if (formData.backToWork === 'Correct') score += 2;
    if (formData.stateOfResidence === 'Correct') score += 2;
    
    // Puntuación para números en reversa
    if (formData.number87 === 'Correct') score += 1;
    if (formData.number649 === 'Correct') score += 1;
    if (formData.number8537 === 'Correct') score += 1;
    
    setTotalScore(score);
    
    // Activar animación si el puntaje cambió
    if (score !== prevScore) {
      setAnimateScore(true);
      setTimeout(() => setAnimateScore(false), 600);
    }
  }, [formData]);

  // Interpretación de la puntuación
  const getScoreInterpretation = () => {
    const highEducationCutoff = 27;
    const lowEducationCutoff = 25;
    
    if (formData.educationLevel === 'High School Education') {
      if (totalScore >= highEducationCutoff) {
        return { level: 'Normal', cutoff: highEducationCutoff };
      } else {
        return { level: 'Cognitive Impairment', cutoff: highEducationCutoff };
      }
    } else {
      if (totalScore >= lowEducationCutoff) {
        return { level: 'Normal', cutoff: lowEducationCutoff };
      } else {
        return { level: 'Cognitive Impairment', cutoff: lowEducationCutoff };
      }
    }
  };

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

  // Alternar sección expandida/colapsada
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Validar el formulario
  const validateForm = () => {
    const errors = {};
    
    // Verificar campos requeridos (en este caso asumimos que todos son requeridos)
    const requiredFields = [
      'patientAlert', 'educationLevel', 'dayOfWeek', 'year', 'state',
      'objectsRemembered', 'moneySpent', 'moneyLeft', 'animalsNamed',
      'hourMarkers', 'timeCorrect', 'trianglePoint', 'largestFigure',
      'femalesName', 'workType', 'backToWork', 'stateOfResidence',
      'number87', 'number649', 'number8537'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = true;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      const interpretation = getScoreInterpretation();
      
      onClose({
        ...formData,
        totalScore,
        interpretation: interpretation.level,
        isComplete: true,
        score: totalScore
      });
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  const interpretation = getScoreInterpretation();
  
  // Obtener el color de la interpretación
  const getInterpretationColor = () => {
    return interpretation.level === 'Normal' ? 'normal' : 'impaired';
  };

  return (
    <div className="slums-modal-overlay">
      <div className="slums-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-brain"></i>
            SLUMS Examination
          </h2>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="info-note">
            <div className="info-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <p>Prior scores are for reference only. To print previous scores please type in additional boxes below.</p>
          </div>
          
          <div className="assessment-info">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="info-text">
                <h3>About This Test</h3>
                <p>The Saint Louis University Mental Status (SLUMS) examination is a cognitive screening tool used to detect mild cognitive impairment and dementia. It assesses orientation, memory, attention, and executive functions.</p>
              </div>
            </div>
          </div>
          
          <div className="score-summary">
            <div className="score-card">
              <div className="score-header">
                <h3>Current Score</h3>
                <div className={`score-value ${getInterpretationColor()} ${animateScore ? 'animate' : ''}`}>
                  <span className="score-number">{totalScore}</span> / 30
                </div>
              </div>
              <div className="interpretation-label">
                Interpretation: <span className={getInterpretationColor()}>{interpretation.level}</span>
              </div>
              <div className="cutoff-note">
                Cutoff for {formData.educationLevel}: {interpretation.cutoff} points
              </div>
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-section patient-status">
              <div className="section-header">
                <h3>
                  <i className="fas fa-user"></i>
                  Patient Information
                </h3>
              </div>
              
              <div className="section-content">
                <div className="question-grid">
                  <div className="question-item">
                    <label htmlFor="patientAlert">IS PATIENT ALERT?</label>
                    <select
                      id="patientAlert"
                      value={formData.patientAlert}
                      onChange={(e) => handleChange('patientAlert', e.target.value)}
                      className={validationErrors.patientAlert ? 'error' : ''}
                    >
                      {yesNoOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {validationErrors.patientAlert && <div className="error-message">Required</div>}
                  </div>
                  
                  <div className="question-item">
                    <label htmlFor="educationLevel">LEVEL OF EDUCATION:</label>
                    <select
                      id="educationLevel"
                      value={formData.educationLevel}
                      onChange={(e) => handleChange('educationLevel', e.target.value)}
                      className={validationErrors.educationLevel ? 'error' : ''}
                    >
                      {educationLevels.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {validationErrors.educationLevel && <div className="error-message">Required</div>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-section orientation-section">
              <div className="section-header collapsible" onClick={() => toggleSection('orientation')}>
                <h3>
                  <i className="fas fa-compass"></i>
                  Orientation
                </h3>
                <div className="section-points">3 points</div>
                <button className="toggle-btn">
                  <i className={`fas fa-chevron-${expandedSections.orientation ? 'up' : 'down'}`}></i>
                </button>
              </div>
              
              {expandedSections.orientation && (
                <div className="section-content">
                  <div className="question-grid">
                    <div className="question-item">
                      <label htmlFor="dayOfWeek">1. What day of the week is it? <span className="points">(1 point)</span></label>
                      <select
                        id="dayOfWeek"
                        value={formData.dayOfWeek}
                        onChange={(e) => handleChange('dayOfWeek', e.target.value)}
                        className={validationErrors.dayOfWeek ? 'error' : ''}
                      >
                        {correctIncorrectOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      {validationErrors.dayOfWeek && <div className="error-message">Required</div>}
                    </div>
                    
                    <div className="question-item">
                      <label htmlFor="year">2. What is the year? <span className="points">(1 point)</span></label>
                      <select
                        id="year"
                        value={formData.year}
                        onChange={(e) => handleChange('year', e.target.value)}
                        className={validationErrors.year ? 'error' : ''}
                      >
                        {correctIncorrectOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      {validationErrors.year && <div className="error-message">Required</div>}
                    </div>
                    
                    <div className="question-item">
                      <label htmlFor="state">3. What state are we in? <span className="points">(1 point)</span></label>
                      <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className={validationErrors.state ? 'error' : ''}
                      >
                        {correctIncorrectOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      {validationErrors.state && <div className="error-message">Required</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section memory-section">
              <div className="section-header collapsible" onClick={() => toggleSection('memory')}>
                <h3>
                  <i className="fas fa-memory"></i>
                  Memory
                </h3>
                <div className="section-points">5 points</div>
                <button className="toggle-btn">
                  <i className={`fas fa-chevron-${expandedSections.memory ? 'up' : 'down'}`}></i>
                </button>
              </div>
              
              {expandedSections.memory && (
                <div className="section-content">
                  <div className="memory-instructions">
                    <div className="instruction-icon">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <p>Please remember these five objects: <strong>APPLE - PEN - TIE - HOUSE - CAR</strong>. I will ask you what they are later.</p>
                  </div>
                  
                  <div className="question-item recall-item">
                    <label htmlFor="objectsRemembered">4. Objects recalled:</label>
                    <select
                      id="objectsRemembered"
                      value={formData.objectsRemembered}
                      onChange={(e) => handleChange('objectsRemembered', e.target.value)}
                      className={validationErrors.objectsRemembered ? 'error' : ''}
                    >
                      {objectsRememberedOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {validationErrors.objectsRemembered && <div className="error-message">Required</div>}
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section math-section">
              <div className="section-header collapsible" onClick={() => toggleSection('math')}>
                <h3>
                  <i className="fas fa-calculator"></i>
                  Math Problem
                </h3>
                <div className="section-points">4 points</div>
                <button className="toggle-btn">
                  <i className={`fas fa-chevron-${expandedSections.math ? 'up' : 'down'}`}></i>
                </button>
              </div>
              
              {expandedSections.math && (
                <div className="section-content">
                  <div className="math-problem">
                    <div className="problem-statement">
                      <i className="fas fa-dollar-sign"></i>
                      <p>5. You have $100 and you go to the store and buy a dozen apples for $3 and a tricycle for $20.</p>
                    </div>
                    
                    <div className="question-grid">
                      <div className="question-item">
                        <label htmlFor="moneySpent">How much did you spend? <span className="points">(2 points)</span></label>
                        <select
                          id="moneySpent"
                          value={formData.moneySpent}
                          onChange={(e) => handleChange('moneySpent', e.target.value)}
                          className={validationErrors.moneySpent ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.moneySpent && <div className="error-message">Required</div>}
                      </div>
                      
                      <div className="question-item">
                        <label htmlFor="moneyLeft">How much do you have left? <span className="points">(2 points)</span></label>
                        <select
                          id="moneyLeft"
                          value={formData.moneyLeft}
                          onChange={(e) => handleChange('moneyLeft', e.target.value)}
                          className={validationErrors.moneyLeft ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.moneyLeft && <div className="error-message">Required</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section animals-section">
              <div className="section-header collapsible" onClick={() => toggleSection('animals')}>
                <h3>
                  <i className="fas fa-paw"></i>
                  Animal Naming
                </h3>
                <div className="section-points">3 points</div>
                <button className="toggle-btn">
                  <i className={`fas fa-chevron-${expandedSections.animals ? 'up' : 'down'}`}></i>
                </button>
              </div>
              
              {expandedSections.animals && (
                <div className="section-content">
                  <div className="question-item">
                    <label htmlFor="animalsNamed">6. Please name as many animals as you can in one minute.</label>
                    <select
                      id="animalsNamed"
                      value={formData.animalsNamed}
                      onChange={(e) => handleChange('animalsNamed', e.target.value)}
                      className={validationErrors.animalsNamed ? 'error' : ''}
                    >
                      {animalOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {validationErrors.animalsNamed && <div className="error-message">Required</div>}
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section clock-section">
              <div className="section-header collapsible" onClick={() => toggleSection('clock')}>
                <h3>
                  <i className="fas fa-clock"></i>
                  Clock Drawing
                </h3>
                <div className="section-points">4 points</div>
                <button className="toggle-btn">
                  <i className={`fas fa-chevron-${expandedSections.clock ? 'up' : 'down'}`}></i>
                </button>
              </div>
              
              {expandedSections.clock && (
                <div className="section-content">
                  <div className="clock-test">
                    <div className="instruction-note">
                      <i className="fas fa-pencil-alt"></i>
                      <p>9. This is a clock face. Please put in the hour markers and the time at ten minutes to eleven o'clock.</p>
                    </div>
                    
                    <div className="clock-diagram">
                      <div className="clock-circle">
                        <div className="clock-center"></div>
                      </div>
                    </div>
                    
                    <div className="question-grid">
                      <div className="question-item">
                        <label htmlFor="hourMarkers">Hour markers correct <span className="points">(2 points)</span></label>
                        <select
                          id="hourMarkers"
                          value={formData.hourMarkers}
                          onChange={(e) => handleChange('hourMarkers', e.target.value)}
                          className={validationErrors.hourMarkers ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.hourMarkers && <div className="error-message">Required</div>}
                      </div>
                      
                      <div className="question-item">
                        <label htmlFor="timeCorrect">Time correct <span className="points">(2 points)</span></label>
                        <select
                          id="timeCorrect"
                          value={formData.timeCorrect}
                          onChange={(e) => handleChange('timeCorrect', e.target.value)}
                          className={validationErrors.timeCorrect ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.timeCorrect && <div className="error-message">Required</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section figures-section">
              <div className="section-header collapsible" onClick={() => toggleSection('figures')}>
                <h3>
                  <i className="fas fa-shapes"></i>
                  Figure Recognition
                </h3>
                <div className="section-points">2 points</div>
                <button className="toggle-btn">
                  <i className={`fas fa-chevron-${expandedSections.figures ? 'up' : 'down'}`}></i>
                </button>
              </div>
              
              {expandedSections.figures && (
                <div className="section-content">
                  <div className="figures-test">
                    <div className="shapes-container">
                      <div className="shape square"></div>
                      <div className="shape triangle"></div>
                      <div className="shape rectangle"></div>
                    </div>
                    
                    <div className="question-grid">
                      <div className="question-item">
                        <label htmlFor="trianglePoint">10. Please point to the triangle <span className="points">(1 point)</span></label>
                        <select
                          id="trianglePoint"
                          value={formData.trianglePoint}
                          onChange={(e) => handleChange('trianglePoint', e.target.value)}
                          className={validationErrors.trianglePoint ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.trianglePoint && <div className="error-message">Required</div>}
                      </div>
                      
                      <div className="question-item">
                        <label htmlFor="largestFigure">Which of the above figures is largest? <span className="points">(1 point)</span></label>
                        <select
                          id="largestFigure"
                          value={formData.largestFigure}
                          onChange={(e) => handleChange('largestFigure', e.target.value)}
                          className={validationErrors.largestFigure ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.largestFigure && <div className="error-message">Required</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section story-section">
              <div className="section-header collapsible" onClick={() => toggleSection('story')}>
                <h3>
                  <i className="fas fa-book"></i>
                  Story Recall
                </h3>
                <div className="section-points">8 points</div>
                <button className="toggle-btn">
                  <i className={`fas fa-chevron-${expandedSections.story ? 'up' : 'down'}`}></i>
                </button>
              </div>
              
              {expandedSections.story && (
                <div className="section-content">
                  <div className="story-container">
                    <div className="story-text">
                      <i className="fas fa-quote-left"></i>
                      <p>Jill was a very successful stockbroker. She made a lot of money on the stock market. She then met Jack, a devastatingly handsome man. She married him and had three children. They lived in Chicago. She then stopped work and stayed at home to bring up her children. When they were teenagers, she went back to work. She and Jack lived happily ever after.</p>
                      <i className="fas fa-quote-right"></i>
                    </div>
                    
                    <div className="question-grid">
                      <div className="question-item">
                        <label htmlFor="femalesName">What was the female's name? <span className="points">(2 points)</span></label>
                        <select
                          id="femalesName"
                          value={formData.femalesName}
                          onChange={(e) => handleChange('femalesName', e.target.value)}
                          className={validationErrors.femalesName ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.femalesName && <div className="error-message">Required</div>}
                      </div>
                      
                      <div className="question-item">
                        <label htmlFor="workType">What work did she do? <span className="points">(2 points)</span></label>
                        <select
                          id="workType"
                          value={formData.workType}
                          onChange={(e) => handleChange('workType', e.target.value)}
                          className={validationErrors.workType ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.workType && <div className="error-message">Required</div>}
                      </div>
                      
                      <div className="question-item">
                        <label htmlFor="backToWork">When did she go back to work? <span className="points">(2 points)</span></label>
                        <select
                          id="backToWork"
                          value={formData.backToWork}
                          onChange={(e) => handleChange('backToWork', e.target.value)}
                          className={validationErrors.backToWork ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.backToWork && <div className="error-message">Required</div>}
                      </div>
                      
                      <div className="question-item">
                        <label htmlFor="stateOfResidence">What state did she live in? <span className="points">(2 points)</span></label>
                        <select
                          id="stateOfResidence"
                          value={formData.stateOfResidence}
                          onChange={(e) => handleChange('stateOfResidence', e.target.value)}
                          className={validationErrors.stateOfResidence ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.stateOfResidence && <div className="error-message">Required</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section numbers-section">
              <div className="section-header collapsible" onClick={() => toggleSection('numbers')}>
                <h3>
                  <i className="fas fa-sort-numeric-down"></i>
                  Numbers in Reverse
                </h3>
                <div className="section-points">3 points</div>
                <button className="toggle-btn">
                  <i className={`fas fa-chevron-${expandedSections.numbers ? 'up' : 'down'}`}></i>
                </button>
              </div>
              
              {expandedSections.numbers && (
                <div className="section-content">
                  <div className="numbers-test">
                    <div className="instruction-note">
                      <i className="fas fa-info-circle"></i>
                      <p>I am going to give you a series of numbers and I would like you to give them to me backwards. For example, if I say 42, you would say 24.</p>
                    </div>
                    
                    <div className="number-sequence">
                      <div className="number-pair">
                        <div className="number">87</div>
                        <div className="number-answer">→ 78</div>
                      </div>
                      <div className="number-pair">
                        <div className="number">649</div>
                        <div className="number-answer">→ 946</div>
                      </div>
                      <div className="number-pair">
                        <div className="number">8537</div>
                        <div className="number-answer">→ 7358</div>
                      </div>
                    </div>
                    
                    <div className="question-grid">
                      <div className="question-item">
                        <label htmlFor="number87">87 <span className="points">(1 point)</span></label>
                        <select
                          id="number87"
                          value={formData.number87}
                          onChange={(e) => handleChange('number87', e.target.value)}
                          className={validationErrors.number87 ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.number87 && <div className="error-message">Required</div>}
                      </div>
                      
                      <div className="question-item">
                        <label htmlFor="number649">649 <span className="points">(1 point)</span></label>
                        <select
                          id="number649"
                          value={formData.number649}
                          onChange={(e) => handleChange('number649', e.target.value)}
                          className={validationErrors.number649 ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.number649 && <div className="error-message">Required</div>}
                      </div>
                      
                      <div className="question-item">
                        <label htmlFor="number8537">8537 <span className="points">(1 point)</span></label>
                        <select
                          id="number8537"
                          value={formData.number8537}
                          onChange={(e) => handleChange('number8537', e.target.value)}
                          className={validationErrors.number8537 ? 'error' : ''}
                        >
                          {correctIncorrectOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        {validationErrors.number8537 && <div className="error-message">Required</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="additional-notes">
            <div className="notes-header">
              <h3>
                <i className="fas fa-clipboard"></i>
                Additional Notes
              </h3>
            </div>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => handleChange('additionalNotes', e.target.value)}
              placeholder="Enter any additional observations or notes"
              rows={4}
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
            CANCEL
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            <i className="fas fa-check"></i>
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlumsModal;