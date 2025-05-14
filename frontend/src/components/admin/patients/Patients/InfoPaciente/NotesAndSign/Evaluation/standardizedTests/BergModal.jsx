// Enhanced BergModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/BergModal.scss';

const BergModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    sittingUnsupported: initialData?.sittingUnsupported || '',
    changePositionSitToStand: initialData?.changePositionSitToStand || '',
    changePositionStandToSit: initialData?.changePositionStandToSit || '',
    transfers: initialData?.transfers || '',
    standingUnsupported: initialData?.standingUnsupported || '',
    standingWithEyesClosed: initialData?.standingWithEyesClosed || '',
    standingWithFeetTogether: initialData?.standingWithFeetTogether || '',
    tandemStanding: initialData?.tandemStanding || '',
    standingOnOneLeg: initialData?.standingOnOneLeg || '',
    turningTrunk: initialData?.turningTrunk || '',
    turning360Degrees: initialData?.turning360Degrees || '',
    retrievingObjectsFromFloor: initialData?.retrievingObjectsFromFloor || '',
    stoolStepping: initialData?.stoolStepping || '',
    reachingForward: initialData?.reachingForward || '',
    totalScore: initialData?.totalScore || 0,
    isComplete: initialData?.isComplete || false,
    isWheelchairBound: initialData?.isWheelchairBound || false
  });

  // Estado para validación
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState('sitting-position');

  // Opciones para los campos de selección
  const bergOptions = {
    sittingUnsupported: [
      { value: '0', label: '0 - unable to sit without support for 10 seconds' },
      { value: '1', label: '1 - able to sit 10 seconds' },
      { value: '2', label: '2 - able to sit 30 seconds' },
      { value: '3', label: '3 - able to sit 2 minutes under supervision' },
      { value: '4', label: '4 - able to sit safely & securely for 2 minutes' }
    ],
    changePositionSitToStand: [
      { value: '0', label: '0 - needs moderate or maximal assist to stand' },
      { value: '1', label: '1 - needs minimal aid to stand or stabilize' },
      { value: '2', label: '2 - able to stand using hands after several tries' },
      { value: '3', label: '3 - able to stand independently using hands' },
      { value: '4', label: '4 - able to stand without using hands and stabilize independently' }
    ],
    changePositionStandToSit: [
      { value: '0', label: '0 - needs assist to sit' },
      { value: '1', label: '1 - sits independently but has uncontrolled descent' },
      { value: '2', label: '2 - uses back of legs against chair to control descent' },
      { value: '3', label: '3 - controls descent by using hands' },
      { value: '4', label: '4 - sits safely with minimal use of hands' }
    ],
    transfers: [
      { value: '0', label: '0 - needs two people to assist or supervise to be safe' },
      { value: '1', label: '1 - needs one person to assist' },
      { value: '2', label: '2 - able to transfer w/ verbal cuing and/or supervision' },
      { value: '3', label: '3 - able to transfer safely definite need of hands' },
      { value: '4', label: '4 - able to transfer safely w/ minor use of hands' }
    ],
    standingUnsupported: [
      { value: '0', label: '0 - unable to stand 30 seconds unsupported' },
      { value: '1', label: '1 - needs several tries to stand 30 seconds unsupported' },
      { value: '2', label: '2 - able to stand 30 seconds unsupported' },
      { value: '3', label: '3 - able to stand 2 minutes with supervision' },
      { value: '4', label: '4 - able to stand safely for 2 minutes' }
    ],
    standingWithEyesClosed: [
      { value: '0', label: '0 - needs help to keep from falling' },
      { value: '1', label: '1 - unable to keep eyes closed 3 seconds but stays safely' },
      { value: '2', label: '2 - able to stand 3 seconds' },
      { value: '3', label: '3 - able to stand 10 seconds needs supervision' },
      { value: '4', label: '4 - able to stand 10 seconds safely' }
    ],
    standingWithFeetTogether: [
      { value: '0', label: '0 - needs help to attain position & unable to hold for 15 sec' },
      { value: '1', label: '1 - needs help to attain position, able to stand 15 sec feet together' },
      { value: '2', label: '2 - able to place feet together independently, unable to hold for 30 sec' },
      { value: '3', label: '3 - able to place feet together independently, stand 1 min with supervision' },
      { value: '4', label: '4 - able to place feet together independently, stand 1 min safely' }
    ],
    tandemStanding: [
      { value: '0', label: '0 - loses balance while stepping or standing' },
      { value: '1', label: '1 - needs help to step but can hold 15 seconds' },
      { value: '2', label: '2 - able to take small step independently and hold 30 seconds' },
      { value: '3', label: '3 - able to place foot ahead independently and hold 30 seconds' },
      { value: '4', label: '4 - able to place foot tandem independently and hold 30 seconds' }
    ],
    standingOnOneLeg: [
      { value: '0', label: '0 - unable to try or needs assist to prevent fall' },
      { value: '1', label: '1 - tries to lift leg unable to hold 3 seconds but remains standing independently' },
      { value: '2', label: '2 - able to lift leg independently and hold 3 seconds or more' },
      { value: '3', label: '3 - able to lift leg independently and hold 5-10 seconds' },
      { value: '4', label: '4 - able to lift leg independently and hold more than 10 seconds' }
    ],
    turningTrunk: [
      { value: '0', label: '0 - needs assist to keep from losing balance or falling' },
      { value: '1', label: '1 - needs supervision when turning' },
      { value: '2', label: '2 - turns sideways only but maintains balance' },
      { value: '3', label: '3 - looks behind one side only, other side shows less wight shift' },
      { value: '4', label: '4 - looks behind from both sides and weight shifts well' }
    ],
    turning360Degrees: [
      { value: '0', label: '0 - needs assistance while turning' },
      { value: '1', label: '1 - needs close supervision or verbal cuing' },
      { value: '2', label: '2 - able to turn 360 degrees safely but slowly' },
      { value: '3', label: '3 - able to turn 360 degrees safely one side only 4 seconds or less' },
      { value: '4', label: '4 - able to turn 360 degrees safely in 4 seconds or less' }
    ],
    retrievingObjectsFromFloor: [
      { value: '0', label: '0 - unable to try/needs assist to keep from losing balance or falling' },
      { value: '1', label: '1 - unable to pick up and needs supervision while trying' },
      { value: '2', label: '2 - unable to pick up but reaches 1-2 inches from object & keeps balance independently' },
      { value: '3', label: '3 - able to pick up object but needs supervision' },
      { value: '4', label: '4 - able to pick up object safely and easily' }
    ],
    stoolStepping: [
      { value: '0', label: '0 - needs assistance to keep from falling/unable to try' },
      { value: '1', label: '1 - able to complete less than 2 steps needs minimal assist' },
      { value: '2', label: '2 - able to complete 4 steps without aid with supervision' },
      { value: '3', label: '3 - able to stand independently and complete 8 steps in less than 20 seconds' },
      { value: '4', label: '4 - able to stand independently and safely and complete 8 steps in 20 seconds' }
    ],
    reachingForward: [
      { value: '0', label: '0 - loses balance while trying, requires external support' },
      { value: '1', label: '1 - reaches forward but needs supervision' },
      { value: '2', label: '2 - can reach forward (2 inches)' },
      { value: '3', label: '3 - can reach forward (5 inches)' },
      { value: '4', label: '4 - can reach forward confidently (10 inches)' }
    ]
  };

  // Instrucciones para cada ítem
  const instructions = {
    sittingUnsupported: 'Please sit with arms folded for 2 minutes.',
    changePositionSitToStand: 'Please stand up. Try not to use your hands for support.',
    changePositionStandToSit: 'Please sit down.',
    transfers: 'Arrange chair(s) for pivot transfer. Ask patient to transfer one way toward a seat with armrests and one way toward a seat without armrests. You may use two chairs (one with and one without armrests) or a bed and a chair.',
    standingUnsupported: 'Please stand for 2 minutes without holding on.',
    standingWithEyesClosed: 'Please close your eyes and stand still for 10 seconds.',
    standingWithFeetTogether: 'Place your feet together and stand without holding on.',
    tandemStanding: 'Place one foot directly in front of the other. If you feel that you cannot place your foot directly in front, try to step far enough ahead that the heel of your forward foot is ahead of the toes of the other foot. (to score 3 points, the length of the step should exceed the length of the other foot and the width of the stance should approximate the subject is normal stride width.)',
    standingOnOneLeg: 'Stand on one leg as long as you can without holding on.',
    turningTrunk: 'Please stand for 2 minutes without holding on.',
    turning360Degrees: 'Turn completely around in a full circle. Pause. Then turn a full circle in the other direction.',
    retrievingObjectsFromFloor: 'Pick up the object, which is in front of your feet.',
    stoolStepping: 'Place each foot alternately on the step/stool. Continue until each foot has touched the step/stool four times.',
    reachingForward: 'Lift arm to 90 degrees. Stretch out your fingers and reach forward as far as you can. (Examiner places a ruler at the end of the fingertips when arm is at 90 degrees. Fingers should not touch the ruler while reaching forward. The recorded measure is the distance forward that the fingers reach while the subject is in most forward lean position. When possible, ask subject to use both arms when reaching to avoid rotation of the trunk.)'
  };

  // Organización de pestañas para el formulario
  const tabs = [
    { 
      id: 'sitting-position', 
      label: 'Sitting & Position Changes', 
      icon: 'fa-chair',
      items: ['sittingUnsupported', 'changePositionSitToStand', 'changePositionStandToSit', 'transfers'] 
    },
    { 
      id: 'standing-balance', 
      label: 'Standing & Balance', 
      icon: 'fa-person-walking',
      items: ['standingUnsupported', 'standingWithEyesClosed', 'standingWithFeetTogether', 'tandemStanding', 'standingOnOneLeg'] 
    },
    { 
      id: 'dynamic-movement', 
      label: 'Dynamic Movement', 
      icon: 'fa-arrows-rotate',
      items: ['turningTrunk', 'turning360Degrees', 'retrievingObjectsFromFloor', 'stoolStepping', 'reachingForward'] 
    }
  ];

  // Calcular la puntuación total cuando cambian los datos del formulario
  useEffect(() => {
    let total = 0;
    
    // Suma los valores de todos los ítems completados
    Object.keys(formData).forEach(key => {
      if (key !== 'totalScore' && key !== 'isComplete' && key !== 'isWheelchairBound' && formData[key]) {
        total += parseInt(formData[key]);
      }
    });
    
    setFormData(prevData => ({
      ...prevData,
      totalScore: total
    }));
  }, [
    formData.sittingUnsupported,
    formData.changePositionSitToStand,
    formData.changePositionStandToSit,
    formData.transfers,
    formData.standingUnsupported,
    formData.standingWithEyesClosed,
    formData.standingWithFeetTogether,
    formData.tandemStanding,
    formData.standingOnOneLeg,
    formData.turningTrunk,
    formData.turning360Degrees,
    formData.retrievingObjectsFromFloor,
    formData.stoolStepping,
    formData.reachingForward
  ]);

  // Verificar campos obligatorios
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'sittingUnsupported',
      'changePositionSitToStand',
      'changePositionStandToSit',
      'transfers',
      'standingUnsupported',
      'standingWithEyesClosed',
      'standingWithFeetTogether',
      'tandemStanding',
      'standingOnOneLeg',
      'turningTrunk',
      'turning360Degrees',
      'retrievingObjectsFromFloor',
      'stoolStepping',
      'reachingForward'
    ];
    
    // Solo validar los campos necesarios si el paciente no está en silla de ruedas
    if (!formData.isWheelchairBound) {
      requiredFields.forEach(field => {
        if (!formData[field]) errors[field] = true;
      });
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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

  // Manejar el cambio de estado de silla de ruedas
  const handleWheelchairChange = (checked) => {
    setFormData(prevData => ({
      ...prevData,
      isWheelchairBound: checked
    }));
    
    // Si el paciente está en silla de ruedas, limpiamos los errores de validación
    if (checked) {
      setValidationErrors({});
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
      // Resaltar los campos faltantes
      window.scrollTo(0, 0);
    }
  };

  // Obtener interpretación del riesgo basada en la puntuación total
  const getRiskLevel = () => {
    if (formData.isWheelchairBound) return 'Not Applicable (Wheelchair Bound)';
    if (formData.totalScore >= 45) return 'Low Fall Risk';
    if (formData.totalScore >= 41) return 'Medium Fall Risk';
    return 'High Fall Risk';
  };

  // Obtener clase de riesgo para estilizado
  const getRiskClass = () => {
    if (formData.isWheelchairBound) return 'not-applicable';
    if (formData.totalScore >= 45) return 'low-risk';
    if (formData.totalScore >= 41) return 'medium-risk';
    return 'high-risk';
  };

  // Obtener porcentaje de progreso por pestaña
  const getTabProgress = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return 0;
    
    const tabFields = tab.items;
    const completedFields = tabFields.filter(field => formData[field]);
    
    return completedFields.length === 0 ? 0 : Math.round((completedFields.length / tabFields.length) * 100);
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="berg-modal-overlay">
      <div className="berg-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>
              <i className="fas fa-balance-scale"></i>
              <span>Berg Balance Scale</span>
            </h2>
            <p className="header-subtitle">Assessment for balance and fall risk</p>
          </div>
          <button className="close-button" onClick={() => onClose()} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="dashboard-panel">
            <div className="info-note">
              <div className="note-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="note-content">
                <p>Prior scores are for reference only. To print previous scores please type in additional boxes below.</p>
              </div>
            </div>
            
            <div className="wheelchair-toggle">
              <label className="toggle-container">
                <input
                  type="checkbox"
                  checked={formData.isWheelchairBound}
                  onChange={(e) => handleWheelchairChange(e.target.checked)}
                />
                <span className="toggle-switch"></span>
                <div className="toggle-label">
                  <i className="fas fa-wheelchair"></i>
                  <span>Patient is wheelchair bound</span>
                </div>
              </label>
              
              {formData.isWheelchairBound && (
                <div className="wheelchair-note">
                  <i className="fas fa-info-circle"></i>
                  <span>Scoring is not applicable for wheelchair bound patients. The assessment can be submitted with 0 points.</span>
                </div>
              )}
            </div>
            
            <div className={`score-summary ${getRiskClass()}`}>
              <div className="score-header">
                <div className="score-icon">
                  <i className="fas fa-chart-column"></i>
                </div>
                <div className="score-title">Risk Assessment</div>
              </div>
              <div className="score-value">
                <span className="current-score">{formData.totalScore}</span>
                <span className="total-score">/ 56</span>
              </div>
              <div className="risk-level">{getRiskLevel()}</div>
              <div className="risk-scale">
                <div className="risk-zones">
                  <span className="high-risk-zone">High</span>
                  <span className="medium-risk-zone">Medium</span>
                  <span className="low-risk-zone">Low</span>
                </div>
                <div className="scale-bar">
                  <div className="scale-indicator" style={{ left: `${Math.min(100, (formData.totalScore / 56) * 100)}%` }}></div>
                </div>
                <div className="scale-marks">
                  <span>0</span>
                  <span>20</span>
                  <span>40</span>
                  <span>56</span>
                </div>
              </div>
            </div>
          </div>
          
          {!formData.isWheelchairBound && (
            <div className="assessment-form">
              <div className="tabs-navigation">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="tab-icon">
                      <i className={`fas ${tab.icon}`}></i>
                    </div>
                    <div className="tab-info">
                      <span className="tab-label">{tab.label}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${getTabProgress(tab.id)}%` }}
                        ></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="tab-content">
                {tabs.map(tab => (
                  <div 
                    key={tab.id} 
                    className={`tab-pane ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <div className="assessment-items">
                      {tab.items.map(item => (
                        <div 
                          key={item} 
                          className={`assessment-card ${validationErrors[item] ? 'has-error' : ''}`}
                        >
                          <div className="card-header">
                            <div className="item-label">
                              {item === 'sittingUnsupported' && 'Sitting Unsupported'}
                              {item === 'changePositionSitToStand' && 'Change Position: Sit to Stand'}
                              {item === 'changePositionStandToSit' && 'Change Position: Stand to Sit'}
                              {item === 'transfers' && 'Transfers'}
                              {item === 'standingUnsupported' && 'Standing Unsupported'}
                              {item === 'standingWithEyesClosed' && 'Standing with Eyes Closed'}
                              {item === 'standingWithFeetTogether' && 'Standing with Feet Together'}
                              {item === 'tandemStanding' && 'Tandem Standing'}
                              {item === 'standingOnOneLeg' && 'Standing on One Leg'}
                              {item === 'turningTrunk' && 'Turning Trunk (Feet Fixed)'}
                              {item === 'turning360Degrees' && 'Turning 360 Degrees'}
                              {item === 'retrievingObjectsFromFloor' && 'Retrieving Objects from Floor'}
                              {item === 'stoolStepping' && 'Stool Stepping'}
                              {item === 'reachingForward' && 'Reaching Forward While Standing'}
                            </div>
                            {validationErrors[item] && (
                              <div className="validation-error">
                                <i className="fas fa-exclamation-circle"></i>
                                Required
                              </div>
                            )}
                          </div>
                          
                          <div className="card-body">
                            <div className="item-instructions">
                              <div className="instruction-icon">
                                <i className="fas fa-file-prescription"></i>
                              </div>
                              <div className="instruction-text">
                                {instructions[item]}
                              </div>
                            </div>
                            
                            <div className="score-selector">
                              {bergOptions[item].map(option => (
                                <div 
                                  key={option.value}
                                  className={`score-option ${formData[item] === option.value ? 'selected' : ''}`}
                                  onClick={() => handleChange(item, option.value)}
                                >
                                  <div className="option-score">{option.value}</div>
                                  <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="risk-interpretation">
            <div className="interpretation-header">
              <i className="fas fa-info-circle"></i>
              <h3>Interpretation Guide</h3>
            </div>
            <div className="interpretation-content">
              <div className="interpretation-item">
                <div className="risk-badge high-risk">High Risk</div>
                <div className="risk-details">
                  <div className="risk-range">Score 0-40</div>
                  <div className="risk-description">May require wheelchair for mobility</div>
                </div>
              </div>
              
              <div className="interpretation-item">
                <div className="risk-badge medium-risk">Medium Risk</div>
                <div className="risk-details">
                  <div className="risk-range">Score 41-44</div>
                  <div className="risk-description">May need assistive device</div>
                </div>
              </div>
              
              <div className="interpretation-item">
                <div className="risk-badge low-risk">Low Risk</div>
                <div className="risk-details">
                  <div className="risk-range">Score 45-56</div>
                  <div className="risk-description">Independent mobility</div>
                </div>
              </div>
              
              <div className="interpretation-note">
                A change of 8 points is required to reveal genuine change in function between assessments.
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

export default BergModal;