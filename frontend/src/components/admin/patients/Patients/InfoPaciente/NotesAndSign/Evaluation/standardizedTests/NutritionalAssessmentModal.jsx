// Enhanced NutritionalAssessmentModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/NutritionalAssessmentModal.scss';

const NutritionalAssessmentModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    illnessChangedDiet: initialData?.illnessChangedDiet || false,
    lessThanTwoMeals: initialData?.lessThanTwoMeals || false,
    fewFruitsVeggiesDairy: initialData?.fewFruitsVeggiesDairy || false,
    alcoholThreeDrinks: initialData?.alcoholThreeDrinks || false,
    teethOrMouthProblems: initialData?.teethOrMouthProblems || false,
    notEnoughMoney: initialData?.notEnoughMoney || false,
    eatsAlone: initialData?.eatsAlone || false,
    threeOrMoreMedications: initialData?.threeOrMoreMedications || false,
    weightLoss: initialData?.weightLoss || false,
    cannotShopCookFeed: initialData?.cannotShopCookFeed || false,
    totalScore: initialData?.totalScore || 0,
    riskLevel: initialData?.riskLevel || 'Good',
    intervention: initialData?.intervention || '',
    isComplete: initialData?.isComplete || false
  });

  // Estado para animación
  const [animateTotal, setAnimateTotal] = useState(false);

  // Opciones para el cuestionario nutricional
  const nutritionalQuestions = [
    { 
      id: 'illnessChangedDiet',
      label: 'Has an illness or a condition that changed the kind and/or amount of food eaten.',
      points: 2,
      icon: 'fas fa-disease'
    },
    { 
      id: 'lessThanTwoMeals', 
      label: 'Eats fewer than 2 meals per day.',
      points: 3,
      icon: 'fas fa-utensils'
    },
    { 
      id: 'fewFruitsVeggiesDairy', 
      label: 'Eats few fruits, vegetables or milk products.',
      points: 2,
      icon: 'fas fa-apple-alt'
    },
    { 
      id: 'alcoholThreeDrinks', 
      label: 'Has 3 or more drinks of beer, liquor or wine almost every day.',
      points: 2,
      icon: 'fas fa-wine-glass-alt'
    },
    { 
      id: 'teethOrMouthProblems', 
      label: 'Has tooth or mouth problems that make it hard to eat.',
      points: 2,
      icon: 'fas fa-tooth'
    },
    { 
      id: 'notEnoughMoney', 
      label: 'Does not always have enough money to buy the food needed.',
      points: 4,
      icon: 'fas fa-coins'
    },
    { 
      id: 'eatsAlone', 
      label: 'Eats alone most of the time.',
      points: 1,
      icon: 'fas fa-user'
    },
    { 
      id: 'threeOrMoreMedications', 
      label: 'Takes 3 or more different prescribed or over-the-counter drugs a day.',
      points: 1,
      icon: 'fas fa-pills'
    },
    { 
      id: 'weightLoss', 
      label: 'Without wanting to, has lost or gained 10 pounds in the last 6 months.',
      points: 2,
      icon: 'fas fa-weight'
    },
    { 
      id: 'cannotShopCookFeed', 
      label: 'Not always physically able to shop, cook, and/or feed self.',
      points: 2,
      icon: 'fas fa-shopping-basket'
    }
  ];

  // Calcular el total cuando cambian los checkboxes
  useEffect(() => {
    let total = 0;
    let riskLevel = 'Good';
    
    nutritionalQuestions.forEach(question => {
      if (formData[question.id]) {
        total += question.points;
      }
    });
    
    if (total >= 6) {
      riskLevel = 'High Risk';
    } else if (total >= 3) {
      riskLevel = 'Moderate Risk';
    } else {
      riskLevel = 'Good';
    }
    
    setFormData(prevData => ({
      ...prevData,
      totalScore: total,
      riskLevel: riskLevel
    }));
    
    // Activar animación cuando cambia el total
    if (total !== formData.totalScore) {
      setAnimateTotal(true);
      setTimeout(() => setAnimateTotal(false), 600);
    }
  }, [
    formData.illnessChangedDiet,
    formData.lessThanTwoMeals,
    formData.fewFruitsVeggiesDairy,
    formData.alcoholThreeDrinks,
    formData.teethOrMouthProblems,
    formData.notEnoughMoney,
    formData.eatsAlone,
    formData.threeOrMoreMedications,
    formData.weightLoss,
    formData.cannotShopCookFeed
  ]);

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (id) => {
    setFormData(prevData => ({
      ...prevData,
      [id]: !prevData[id]
    }));
  };

  // Manejar cambios en el campo de intervención
  const handleInterventionChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      intervention: e.target.value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    // Marcar como completo y cerrar el modal
    const updatedData = {
      ...formData,
      isComplete: true
    };
    
    onClose({
      ...updatedData,
      score: updatedData.totalScore
    });
  };

  // Color y clase según nivel de riesgo
  const getRiskColor = () => {
    switch(formData.riskLevel) {
      case 'High Risk':
        return 'high-risk';
      case 'Moderate Risk':
        return 'moderate-risk';
      default:
        return 'good';
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="nutritional-assessment-modal-overlay">
      <div className="nutritional-assessment-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-utensils"></i>
            Nutritional Status Assessment
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
          
          <div className="assessment-instructions">
            <div className="instruction-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div className="instruction-text">
              <h3>Instructions</h3>
              <p>Check each area with "yes" to assess; then view total score to determine additional risk.</p>
            </div>
          </div>
          
          <div className="assessment-form">
            <div className="form-header">
              <h3>Risk Factors</h3>
              <div className="total-badge">
                <span className={`score-value ${getRiskColor()} ${animateTotal ? 'animate' : ''}`}>
                  {formData.totalScore} points
                </span>
              </div>
            </div>
            
            <div className="checklist">
              {nutritionalQuestions.map(question => (
                <div 
                  className={`checklist-item ${formData[question.id] ? 'checked' : ''}`} 
                  key={question.id}
                  onClick={() => handleCheckboxChange(question.id)}
                >
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={formData[question.id]}
                      onChange={() => handleCheckboxChange(question.id)}
                    />
                    <span className="checkmark"></span>
                    <div className="question-content">
                      <i className={question.icon}></i>
                      <div className="question-text-wrapper">
                        <span className="question-text">{question.label}</span>
                        <span className="question-points">({question.points} {question.points === 1 ? 'point' : 'points'})</span>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="score-summary">
              <div className={`total-score ${getRiskColor()}`}>
                <div className="score-label">
                  <i className="fas fa-calculator"></i>
                  <span>TOTAL:</span>
                </div>
                <div className={`score-value ${animateTotal ? 'animate' : ''}`}>
                  {formData.totalScore} out of 21
                </div>
                <div className="risk-badge">
                  {formData.riskLevel}
                </div>
              </div>
            </div>
            
            <div className="risk-levels">
              <div className={`risk-level ${formData.riskLevel === 'Good' ? 'active' : ''}`}>
                <div className="risk-level-header good">
                  <i className="fas fa-check-circle"></i>
                  <span>0-2 (Good)</span>
                </div>
                <p>As appropriate reassess and/or provide information based on situation.</p>
              </div>
              
              <div className={`risk-level ${formData.riskLevel === 'Moderate Risk' ? 'active' : ''}`}>
                <div className="risk-level-header moderate">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>3-5 (Moderate Risk)</span>
                </div>
                <p>Educate, refer, monitor and reevaluate based on patient situation and organization policy.</p>
              </div>
              
              <div className={`risk-level ${formData.riskLevel === 'High Risk' ? 'active' : ''}`}>
                <div className="risk-level-header high">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>6 or more (High Risk)</span>
                </div>
                <p>Coordinate with physician, dietitian, social service professional or nurse about how to improve nutritional health. Reassess nutritional status and educate based on plan of care.</p>
              </div>
            </div>
            
            <div className="intervention-section">
              <div className="section-header">
                <h3>
                  <i className="fas fa-file-medical"></i>
                  Intervention and Plan
                </h3>
              </div>
              <textarea 
                value={formData.intervention}
                onChange={handleInterventionChange}
                rows={5}
                placeholder="Document nutritional interventions and care plan"
              />
            </div>
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

export default NutritionalAssessmentModal;