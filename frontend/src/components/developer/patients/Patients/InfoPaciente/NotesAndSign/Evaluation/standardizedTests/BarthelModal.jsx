// Enhanced BarthelModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/BarthelModal.scss';

const BarthelModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    feeding: initialData?.feeding || '',
    bathing: initialData?.bathing || '',
    grooming: initialData?.grooming || '',
    dressing: initialData?.dressing || '',
    bowels: initialData?.bowels || '',
    bladder: initialData?.bladder || '',
    toiletUse: initialData?.toiletUse || '',
    transfers: initialData?.transfers || '',
    mobility: initialData?.mobility || '',
    stairs: initialData?.stairs || '',
    totalScore: initialData?.totalScore || 0,
    dependencyLevel: initialData?.dependencyLevel || '',
    isComplete: initialData?.isComplete || false
  });

  // Estado para validación
  const [validationErrors, setValidationErrors] = useState({});

  // Opciones para los campos de selección
  const barthelOptions = {
    feeding: [
      { value: '0', label: '0 - unable' },
      { value: '5', label: '5 - needs help cutting, spreading butter, etc., or requires modified diet' },
      { value: '10', label: '10 - independent' }
    ],
    bathing: [
      { value: '0', label: '0 - dependent' },
      { value: '5', label: '5 - independent (or in shower)' }
    ],
    grooming: [
      { value: '0', label: '0 - needs help with personal care' },
      { value: '5', label: '5 - independent face/hair/teeth/shaving (implements provided)' }
    ],
    dressing: [
      { value: '0', label: '0 - dependent' },
      { value: '5', label: '5 - needs help but can do about half unaided' },
      { value: '10', label: '10 - independent (including buttons, zips, laces, etc.)' }
    ],
    bowels: [
      { value: '0', label: '0 - incontinent (or needs to be given enemas)' },
      { value: '5', label: '5 - occasional accident' },
      { value: '10', label: '10 - continent' }
    ],
    bladder: [
      { value: '0', label: '0 - incontinent, or catheterized and unable to manage alone' },
      { value: '5', label: '5 - occasional accident' },
      { value: '10', label: '10 - continent' }
    ],
    toiletUse: [
      { value: '0', label: '0 - dependent' },
      { value: '5', label: '5 - needs some help but can do something alone' },
      { value: '10', label: '10 - independent (on and off, dressing, wiping)' }
    ],
    transfers: [
      { value: '0', label: '0 - unable, no sitting balance' },
      { value: '5', label: '5 - major help (one or two people, physical), can sit' },
      { value: '10', label: '10 - minor help (verbal or physical)' },
      { value: '15', label: '15 - independent' }
    ],
    mobility: [
      { value: '0', label: '0 - immobile or less than 50 yards' },
      { value: '5', label: '5 - wheelchair independent, including corners, more than 50 yards' },
      { value: '10', label: '10 - walks with help of one person (verbal or physical), more than 50 yards' },
      { value: '15', label: '15 - independent (but may use aid, for example, stick), more than 50 yards' }
    ],
    stairs: [
      { value: '0', label: '0 - unable' },
      { value: '5', label: '5 - needs help (verbal, physical, carrying aid)' },
      { value: '10', label: '10 - independent' }
    ]
  };

  // Calcular el nivel de dependencia basado en la puntuación total
  const calculateDependencyLevel = (score) => {
    if (score <= 20) return 'Total Dependency';
    if (score <= 35) return 'Severe Dependency';
    if (score <= 55) return 'Moderate Dependency';
    if (score <= 90) return 'Slight Dependency';
    return 'Independence';
  };

  // Calcular el total cuando cambian los datos del formulario
  useEffect(() => {
    const feedingPoints = formData.feeding ? parseInt(formData.feeding) : 0;
    const bathingPoints = formData.bathing ? parseInt(formData.bathing) : 0;
    const groomingPoints = formData.grooming ? parseInt(formData.grooming) : 0;
    const dressingPoints = formData.dressing ? parseInt(formData.dressing) : 0;
    const bowelsPoints = formData.bowels ? parseInt(formData.bowels) : 0;
    const bladderPoints = formData.bladder ? parseInt(formData.bladder) : 0;
    const toiletUsePoints = formData.toiletUse ? parseInt(formData.toiletUse) : 0;
    const transfersPoints = formData.transfers ? parseInt(formData.transfers) : 0;
    const mobilityPoints = formData.mobility ? parseInt(formData.mobility) : 0;
    const stairsPoints = formData.stairs ? parseInt(formData.stairs) : 0;

    const total = feedingPoints + bathingPoints + groomingPoints + dressingPoints + 
                 bowelsPoints + bladderPoints + toiletUsePoints + transfersPoints + 
                 mobilityPoints + stairsPoints;
    
    setFormData(prevData => ({
      ...prevData,
      totalScore: total,
      dependencyLevel: calculateDependencyLevel(total)
    }));
  }, [
    formData.feeding,
    formData.bathing,
    formData.grooming,
    formData.dressing,
    formData.bowels,
    formData.bladder,
    formData.toiletUse,
    formData.transfers,
    formData.mobility,
    formData.stairs
  ]);

  // Verificar campos obligatorios
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'feeding',
      'bathing',
      'grooming',
      'dressing',
      'bowels',
      'bladder',
      'toiletUse',
      'transfers',
      'mobility',
      'stairs'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) errors[field] = true;
    });

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

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="barthel-modal-overlay">
      <div className="barthel-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>
              <i className="fas fa-tasks"></i>
              <span>Barthel Index</span>
            </h2>
            <p className="header-subtitle">Activities of Daily Living Assessment</p>
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
          
          <div className="barthel-layout">
            <div className="assessment-section">
              <div className="category-section">
                <div className="category-card">
                  <div className="card-header">
                    <div className="header-icon">
                      <i className="fas fa-utensils"></i>
                    </div>
                    <h3>Self-Care Activities</h3>
                  </div>
                  <div className="card-content">
                    <div className={`assessment-item ${validationErrors.feeding ? 'has-error' : ''}`}>
                      <div className="item-header">
                        <h4>Feeding</h4>
                        {validationErrors.feeding && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                      </div>
                      <div className="option-list">
                        {barthelOptions.feeding.map(option => (
                          <div 
                            key={option.value}
                            className={`option-item ${formData.feeding === option.value ? 'active' : ''}`}
                            onClick={() => handleChange('feeding', option.value)}
                          >
                            <div className="option-radio">
                              <div className="radio-outer">
                                <div className="radio-inner"></div>
                              </div>
                            </div>
                            <div className="option-content">
                              <div className="option-score">{option.value}</div>
                              <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={`assessment-item ${validationErrors.bathing ? 'has-error' : ''}`}>
                      <div className="item-header">
                        <h4>Bathing</h4>
                        {validationErrors.bathing && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                      </div>
                      <div className="option-list">
                        {barthelOptions.bathing.map(option => (
                          <div 
                            key={option.value}
                            className={`option-item ${formData.bathing === option.value ? 'active' : ''}`}
                            onClick={() => handleChange('bathing', option.value)}
                          >
                            <div className="option-radio">
                              <div className="radio-outer">
                                <div className="radio-inner"></div>
                              </div>
                            </div>
                            <div className="option-content">
                              <div className="option-score">{option.value}</div>
                              <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={`assessment-item ${validationErrors.grooming ? 'has-error' : ''}`}>
                      <div className="item-header">
                        <h4>Grooming</h4>
                        {validationErrors.grooming && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                      </div>
                      <div className="option-list">
                        {barthelOptions.grooming.map(option => (
                          <div 
                            key={option.value}
                            className={`option-item ${formData.grooming === option.value ? 'active' : ''}`}
                            onClick={() => handleChange('grooming', option.value)}
                          >
                            <div className="option-radio">
                              <div className="radio-outer">
                                <div className="radio-inner"></div>
                              </div>
                            </div>
                            <div className="option-content">
                              <div className="option-score">{option.value}</div>
                              <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={`assessment-item ${validationErrors.dressing ? 'has-error' : ''}`}>
                      <div className="item-header">
                        <h4>Dressing</h4>
                        {validationErrors.dressing && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                      </div>
                      <div className="option-list">
                        {barthelOptions.dressing.map(option => (
                          <div 
                            key={option.value}
                            className={`option-item ${formData.dressing === option.value ? 'active' : ''}`}
                            onClick={() => handleChange('dressing', option.value)}
                          >
                            <div className="option-radio">
                              <div className="radio-outer">
                                <div className="radio-inner"></div>
                              </div>
                            </div>
                            <div className="option-content">
                              <div className="option-score">{option.value}</div>
                              <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="category-card">
                  <div className="card-header">
                    <div className="header-icon">
                      <i className="fas fa-toilet"></i>
                    </div>
                    <h3>Continence & Toileting</h3>
                  </div>
                  <div className="card-content">
                    <div className={`assessment-item ${validationErrors.bowels ? 'has-error' : ''}`}>
                      <div className="item-header">
                        <h4>Bowels</h4>
                        {validationErrors.bowels && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                      </div>
                      <div className="option-list">
                        {barthelOptions.bowels.map(option => (
                          <div 
                          key={option.value}
                          className={`option-item ${formData.bowels === option.value ? 'active' : ''}`}
                          onClick={() => handleChange('bowels', option.value)}
                        >
                          <div className="option-radio">
                            <div className="radio-outer">
                              <div className="radio-inner"></div>
                            </div>
                          </div>
                          <div className="option-content">
                            <div className="option-score">{option.value}</div>
                            <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`assessment-item ${validationErrors.bladder ? 'has-error' : ''}`}>
                    <div className="item-header">
                      <h4>Bladder</h4>
                      {validationErrors.bladder && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                    </div>
                    <div className="option-list">
                      {barthelOptions.bladder.map(option => (
                        <div 
                          key={option.value}
                          className={`option-item ${formData.bladder === option.value ? 'active' : ''}`}
                          onClick={() => handleChange('bladder', option.value)}
                        >
                          <div className="option-radio">
                            <div className="radio-outer">
                              <div className="radio-inner"></div>
                            </div>
                          </div>
                          <div className="option-content">
                            <div className="option-score">{option.value}</div>
                            <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`assessment-item ${validationErrors.toiletUse ? 'has-error' : ''}`}>
                    <div className="item-header">
                      <h4>Toilet Use</h4>
                      {validationErrors.toiletUse && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                    </div>
                    <div className="option-list">
                      {barthelOptions.toiletUse.map(option => (
                        <div 
                          key={option.value}
                          className={`option-item ${formData.toiletUse === option.value ? 'active' : ''}`}
                          onClick={() => handleChange('toiletUse', option.value)}
                        >
                          <div className="option-radio">
                            <div className="radio-outer">
                              <div className="radio-inner"></div>
                            </div>
                          </div>
                          <div className="option-content">
                            <div className="option-score">{option.value}</div>
                            <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="category-card">
                <div className="card-header">
                  <div className="header-icon">
                    <i className="fas fa-walking"></i>
                  </div>
                  <h3>Mobility & Transfers</h3>
                </div>
                <div className="card-content">
                  <div className={`assessment-item ${validationErrors.transfers ? 'has-error' : ''}`}>
                    <div className="item-header">
                      <h4>Transfers (Bed to Chair and Back)</h4>
                      {validationErrors.transfers && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                    </div>
                    <div className="option-list">
                      {barthelOptions.transfers.map(option => (
                        <div 
                          key={option.value}
                          className={`option-item ${formData.transfers === option.value ? 'active' : ''}`}
                          onClick={() => handleChange('transfers', option.value)}
                        >
                          <div className="option-radio">
                            <div className="radio-outer">
                              <div className="radio-inner"></div>
                            </div>
                          </div>
                          <div className="option-content">
                            <div className="option-score">{option.value}</div>
                            <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`assessment-item ${validationErrors.mobility ? 'has-error' : ''}`}>
                    <div className="item-header">
                      <h4>Mobility (On Level Surfaces)</h4>
                      {validationErrors.mobility && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                    </div>
                    <div className="option-list">
                      {barthelOptions.mobility.map(option => (
                        <div 
                          key={option.value}
                          className={`option-item ${formData.mobility === option.value ? 'active' : ''}`}
                          onClick={() => handleChange('mobility', option.value)}
                        >
                          <div className="option-radio">
                            <div className="radio-outer">
                              <div className="radio-inner"></div>
                            </div>
                          </div>
                          <div className="option-content">
                            <div className="option-score">{option.value}</div>
                            <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`assessment-item ${validationErrors.stairs ? 'has-error' : ''}`}>
                    <div className="item-header">
                      <h4>Stairs</h4>
                      {validationErrors.stairs && <div className="validation-error"><i className="fas fa-exclamation-circle"></i> Required</div>}
                    </div>
                    <div className="option-list">
                      {barthelOptions.stairs.map(option => (
                        <div 
                          key={option.value}
                          className={`option-item ${formData.stairs === option.value ? 'active' : ''}`}
                          onClick={() => handleChange('stairs', option.value)}
                        >
                          <div className="option-radio">
                            <div className="radio-outer">
                              <div className="radio-inner"></div>
                            </div>
                          </div>
                          <div className="option-content">
                            <div className="option-score">{option.value}</div>
                            <div className="option-label">{option.label.substring(option.label.indexOf('-') + 1).trim()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="results-section">
            <div className="results-card">
              <div className="card-header">
                <div className="header-icon">
                  <i className="fas fa-chart-pie"></i>
                </div>
                <h3>Assessment Results</h3>
              </div>
              <div className="card-content">
                <div className="score-display">
                  <div className="total-score">
                    <div className="score-value">{formData.totalScore}</div>
                    <div className="score-label">Total Score</div>
                    <div className="score-max">Out of 100 points</div>
                  </div>
                  
                  <div className="dependency-display">
                    <div className="dependency-label">Dependency Level:</div>
                    <div className={`dependency-value ${formData.dependencyLevel.toLowerCase().replace(' ', '-')}`}>
                      {formData.dependencyLevel}
                    </div>
                  </div>
                </div>
                
                <div className="score-interpretation">
                  <h4>Interpretation Guide</h4>
                  <div className="interpretation-scale">
                    <div className="scale-item total-dependency">
                      <div className="scale-range">0-20</div>
                      <div className="scale-label">Total Dependency</div>
                    </div>
                    <div className="scale-item severe-dependency">
                      <div className="scale-range">21-35</div>
                      <div className="scale-label">Severe Dependency</div>
                    </div>
                    <div className="scale-item moderate-dependency">
                      <div className="scale-range">36-55</div>
                      <div className="scale-label">Moderate Dependency</div>
                    </div>
                    <div className="scale-item slight-dependency">
                      <div className="scale-range">56-90</div>
                      <div className="scale-label">Slight Dependency</div>
                    </div>
                    <div className="scale-item independence">
                      <div className="scale-range">91-100</div>
                      <div className="scale-label">Independence</div>
                    </div>
                  </div>
                </div>
                
                <div className="validation-summary">
                  {Object.keys(validationErrors).length > 0 && (
                    <div className="validation-message">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Please complete all required items to submit the assessment.</span>
                    </div>
                  )}
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

export default BarthelModal;