// Enhanced KatzModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/KatzModal.scss';

const KatzModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    bathing: initialData?.bathing || '',
    dressing: initialData?.dressing || '',
    toileting: initialData?.toileting || '',
    transferring: initialData?.transferring || '',
    continence: initialData?.continence || '',
    feeding: initialData?.feeding || '',
    additionalNotes: initialData?.additionalNotes || '',
    isComplete: initialData?.isComplete || false
  });
  
  // Estado para el total calculado
  const [totalScore, setTotalScore] = useState(0);

  // Validación de errores
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estado de animación para el score
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);

  // Opciones para cada actividad
  const activities = [
    { 
      id: 'bathing', 
      name: 'Bathing',
      icon: 'fa-shower',
      independenceText: 'Bathes self completely or needs help in bathing only a single part of the body such as the back, genital area or disabled extremity.',
      dependenceText: 'Needs help with bathing more than one part of the body, getting in or out of the tub or shower or requires total bathing.'
    },
    { 
      id: 'dressing', 
      name: 'Dressing',
      icon: 'fa-tshirt',
      independenceText: 'Gets clothes from closets and drawers and puts on clothes and outer garments complete with fasteners. May have help tying shoes.',
      dependenceText: 'Has help dressing self or needs to be completely dressed.'
    },
    { 
      id: 'toileting', 
      name: 'Toileting',
      icon: 'fa-toilet',
      independenceText: 'Goes to toilet, gets on and off, arranges clothes, and cleans genital area without help.',
      dependenceText: 'Needs help transferring to the toilet, cleaning self or uses bedpan or commode.'
    },
    { 
      id: 'transferring', 
      name: 'Transferring',
      icon: 'fa-exchange-alt',
      independenceText: 'Moves in and out of bed or chair unassisted. Mechanical transfer aids are acceptable.',
      dependenceText: 'Needs help in moving from bed to chair or requires a complete transfer.'
    },
    { 
      id: 'continence', 
      name: 'Continence',
      icon: 'fa-tint',
      independenceText: 'Exercises complete self control over urination and defecation.',
      dependenceText: 'Is partially or totally incontinent of bowel or bladder.'
    },
    { 
      id: 'feeding', 
      name: 'Feeding',
      icon: 'fa-utensils',
      independenceText: 'Gets food from plate into mouth without help. Preparation of food may be done by another person.',
      dependenceText: 'Needs partial or total help with feeding or requires parenteral feeding.'
    }
  ];

  // Calcular total basado en las selecciones
  useEffect(() => {
    let score = 0;
    
    activities.forEach(activity => {
      if (formData[activity.id] === 'independence') {
        score += 1;
      }
    });
    
    // Si el score ha cambiado y no es la carga inicial
    if (score !== totalScore && Object.values(formData).some(val => val !== '')) {
      // Activar animación
      setShowScoreAnimation(true);
      
      // Desactivar animación después de 1 segundo
      setTimeout(() => {
        setShowScoreAnimation(false);
      }, 1000);
    }
    
    setTotalScore(score);
  }, [formData]);

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
    
    // Verificar que todas las actividades tengan una selección
    activities.forEach(activity => {
      if (!formData[activity.id]) {
        errors[activity.id] = true;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onClose({
        ...formData,
        totalScore,
        isComplete: true,
        score: totalScore
      });
    } else {
      // Mensaje de error y desplazamiento al inicio del formulario
      window.scrollTo(0, 0);
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Determinar la clase del nivel de independencia
  const getIndependenceClass = () => {
    if (totalScore >= 5) return 'high';
    if (totalScore >= 3) return 'moderate';
    return 'low';
  };

  return (
    <div className="katz-modal-overlay">
      <div className="katz-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-tasks"></i>
            Katz Index of Independence in ADL
          </h2>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="info-banner">
            <div className="banner-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <div className="banner-content">
              <h3>Assessment Overview</h3>
              <p>The Katz Index of Independence in Activities of Daily Living assesses functional status as a measurement of the patient's ability to perform activities of daily living independently. The score ranges from 0 (very dependent) to 6 (independent).</p>
            </div>
          </div>
          
          <div className="score-dashboard">
            <div className={`score-display ${getIndependenceClass()} ${showScoreAnimation ? 'pulse' : ''}`}>
              <div className="score-value">{totalScore}</div>
              <div className="score-label">out of 6</div>
            </div>
            
            <div className="score-scale">
              <div className="scale-labels">
                <span>Dependent</span>
                <span>Independent</span>
              </div>
              <div className="scale-bar">
                <div className="scale-fill" style={{ width: `${(totalScore / 6) * 100}%` }}></div>
              </div>
              <div className="scale-markers">
                {[0, 1, 2, 3, 4, 5, 6].map(marker => (
                  <div 
                    key={marker} 
                    className={`marker ${totalScore >= marker ? 'active' : ''}`}
                  >
                    {marker}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="independence-levels">
              <div className={`level ${getIndependenceClass() === 'high' ? 'active' : ''}`}>
                <div className="level-indicator high"></div>
                <div className="level-details">
                  <h4>High Independence (5-6)</h4>
                  <p>Patient is independent in all or most ADL activities</p>
                </div>
              </div>
              <div className={`level ${getIndependenceClass() === 'moderate' ? 'active' : ''}`}>
                <div className="level-indicator moderate"></div>
                <div className="level-details">
                  <h4>Moderate Independence (3-4)</h4>
                  <p>Patient needs assistance with some ADL activities</p>
                </div>
              </div>
              <div className={`level ${getIndependenceClass() === 'low' ? 'active' : ''}`}>
                <div className="level-indicator low"></div>
                <div className="level-details">
                  <h4>Low Independence (0-2)</h4>
                  <p>Patient is dependent in most ADL activities</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="assessment-container">
            <h3>
              <i className="fas fa-clipboard-check"></i>
              Activities Assessment
            </h3>
            
            {activities.map((activity, index) => (
              <div 
                key={activity.id}
                className={`activity-card ${validationErrors[activity.id] ? 'has-error' : ''} ${formData[activity.id] ? 'completed' : ''}`}
              >
                <div className="activity-header">
                  <div className="activity-icon">
                    <i className={`fas ${activity.icon}`}></i>
                  </div>
                  <h4 className="activity-name">{activity.name}</h4>
                  {validationErrors[activity.id] && (
                    <div className="error-badge">
                      <i className="fas fa-exclamation-triangle"></i>
                      Required
                    </div>
                  )}
                  <div className="activity-number">{index + 1}</div>
                </div>
                
                <div className="activity-options">
                  <label className={`option-card independence ${formData[activity.id] === 'independence' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={activity.id} 
                      value="independence" 
                      checked={formData[activity.id] === 'independence'}
                      onChange={() => handleChange(activity.id, 'independence')}
                    />
                    <div className="card-content">
                      <div className="option-header">
                        <div className="option-icon">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <h5>Independence</h5>
                        <div className="option-value">1 point</div>
                      </div>
                      <p className="option-description">{activity.independenceText}</p>
                    </div>
                  </label>
                  
                  <label className={`option-card dependence ${formData[activity.id] === 'dependence' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={activity.id} 
                      value="dependence" 
                      checked={formData[activity.id] === 'dependence'}
                      onChange={() => handleChange(activity.id, 'dependence')}
                    />
                    <div className="card-content">
                      <div className="option-header">
                        <div className="option-icon">
                          <i className="fas fa-times-circle"></i>
                        </div>
                        <h5>Dependence</h5>
                        <div className="option-value">0 points</div>
                      </div>
                      <p className="option-description">{activity.dependenceText}</p>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
          
          <div className="additional-notes">
            <h3>
              <i className="fas fa-sticky-note"></i>
              Additional Notes
            </h3>
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
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            <i className="fas fa-check"></i>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default KatzModal;