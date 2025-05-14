// Enhanced MAHC10Modal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/MAHC10Modal.scss';

const MAHC10Modal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    age65Plus: initialData?.age65Plus || 'No',
    threeOrMoreDiagnoses: initialData?.threeOrMoreDiagnoses || 'No',
    fallHistory: initialData?.fallHistory || 'No',
    incontinence: initialData?.incontinence || 'No',
    visualImpairment: initialData?.visualImpairment || 'No',
    impairedFunctionalMobility: initialData?.impairedFunctionalMobility || 'No',
    environmentalHazards: initialData?.environmentalHazards || 'No',
    polyPharmacy: initialData?.polyPharmacy || 'No',
    painAffectingFunction: initialData?.painAffectingFunction || 'No',
    cognitiveImpairment: initialData?.cognitiveImpairment || 'No',
    totalScore: initialData?.totalScore || 0,
    isComplete: initialData?.isComplete || false
  });

  // Estado para animación cuando cambia el puntaje
  const [animateScore, setAnimateScore] = useState(false);

  // Opciones para los campos de selección
  const yesNoOptions = [
    { value: 'No', label: 'No', icon: 'fa-times-circle' },
    { value: 'Yes', label: 'Yes', icon: 'fa-check-circle' }
  ];

  // Configuración de los elementos de evaluación
  const assessmentItems = [
    {
      id: 'age65Plus',
      label: 'AGE 65+',
      icon: 'fa-user-clock',
      description: 'Patient is 65 years or older'
    },
    {
      id: 'impairedFunctionalMobility',
      label: 'IMPAIRED FUNCTIONAL MOBILITY',
      icon: 'fa-walking',
      description: 'Requires assistance when moving, transferring, or walking'
    },
    {
      id: 'threeOrMoreDiagnoses',
      label: 'DIAGNOSIS (3 OR MORE CO-EXISTING)',
      icon: 'fa-file-medical',
      description: 'Patient has three or more medical conditions'
    },
    {
      id: 'environmentalHazards',
      label: 'ENVIRONMENTAL HAZARDS',
      icon: 'fa-home',
      description: 'Cluttered pathways, poor lighting, slippery floors, etc.'
    },
    {
      id: 'fallHistory',
      label: 'PRIOR HISTORY OF FALLS WITHIN 3 MONTHS',
      icon: 'fa-exclamation-triangle',
      description: 'Has fallen one or more times in the past 3 months'
    },
    {
      id: 'polyPharmacy',
      label: 'POLY PHARMACY (4 OR MORE PRESCRIPTIONS - ANY TYPE)',
      icon: 'fa-pills',
      description: 'Takes four or more prescribed or OTC medications'
    },
    {
      id: 'incontinence',
      label: 'INCONTINENCE',
      icon: 'fa-tint',
      description: 'Inability to make it to the bathroom in time'
    },
    {
      id: 'painAffectingFunction',
      label: 'PAIN AFFECTING LEVEL OF FUNCTION',
      icon: 'fa-heartbeat',
      description: 'Pain that limits mobility or daily activities'
    },
    {
      id: 'visualImpairment',
      label: 'VISUAL IMPAIRMENT',
      icon: 'fa-eye',
      description: 'Decreased visual acuity, declining peripheral vision, etc.'
    },
    {
      id: 'cognitiveImpairment',
      label: 'COGNITIVE IMPAIRMENT',
      icon: 'fa-brain',
      description: 'Altered awareness of surroundings, impaired judgment, impaired memory'
    }
  ];

  // Calcular la puntuación total cuando cambian los datos del formulario
  useEffect(() => {
    let total = 0;
    
    // Cada "Yes" suma 1 punto
    Object.keys(formData).forEach(key => {
      if (key !== 'totalScore' && key !== 'isComplete' && formData[key] === 'Yes') {
        total += 1;
      }
    });
    
    // Si el score ha cambiado y no es la carga inicial, triggerea animación
    if (formData.totalScore !== total && Object.values(formData).some(val => val !== initialData?.val)) {
      setAnimateScore(true);
      setTimeout(() => setAnimateScore(false), 800);
    }
    
    setFormData(prevData => ({
      ...prevData,
      totalScore: total
    }));
  }, [
    formData.age65Plus,
    formData.threeOrMoreDiagnoses,
    formData.fallHistory,
    formData.incontinence,
    formData.visualImpairment,
    formData.impairedFunctionalMobility,
    formData.environmentalHazards,
    formData.polyPharmacy,
    formData.painAffectingFunction,
    formData.cognitiveImpairment
  ]);

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
      score: formData.totalScore
    });
  };

  // Obtener nivel de riesgo basado en la puntuación total
  const getRiskLevel = () => {
    if (formData.totalScore >= 4) return 'High Fall Risk';
    return 'Low Fall Risk';
  };

  // Obtener clase CSS basada en el nivel de riesgo
  const getRiskClass = () => {
    if (formData.totalScore >= 4) return 'high-risk';
    return 'low-risk';
  };

  // Obtener porcentaje para la visualización del medidor
  const getRiskPercentage = () => {
    return (formData.totalScore / 10) * 100;
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="mahc10-modal-overlay">
      <div className="mahc10-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-clipboard-check"></i>
            MAHC10 - Missouri Alliance for Home Care
          </h2>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="info-banner">
            <div className="banner-content">
              <div className="banner-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="banner-text">
                <p>The MAHC-10 is a comprehensive fall risk assessment tool to identify patients at risk for falls in the home setting. A score of 4 or higher indicates a high fall risk.</p>
              </div>
            </div>
          </div>
          
          <div className="risk-score-container">
            <div className={`risk-gauge ${getRiskClass()} ${animateScore ? 'animate' : ''}`}>
              <div className="gauge-background">
                <div className="gauge-fill" style={{ width: `${getRiskPercentage()}%` }}></div>
              </div>
              <div className="gauge-markers">
                <div className="marker low" data-value="Low (0-3)"></div>
                <div className="marker high" data-value="High (4-10)"></div>
                <div className="divider"></div>
              </div>
              <div className="gauge-pointer" style={{ left: `${getRiskPercentage()}%` }}>
                <div className="pointer"></div>
                <div className="pointer-label">{formData.totalScore}</div>
              </div>
            </div>
            
            <div className="risk-summary">
              <div className={`risk-level ${getRiskClass()}`}>
                <div className="level-icon">
                  <i className={`fas ${formData.totalScore >= 4 ? 'fa-exclamation-triangle' : 'fa-shield-alt'}`}></i>
                </div>
                <div className="level-details">
                  <h3>{getRiskLevel()}</h3>
                  <p>{formData.totalScore >= 4 ? 
                    'Implement fall prevention interventions' : 
                    'Continue to monitor and reassess as needed'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="assessment-grid">
            {assessmentItems.map(item => (
              <div key={item.id} className={`assessment-card ${formData[item.id] === 'Yes' ? 'active' : ''}`}>
                <div className="card-header">
                  <div className="header-icon">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3>{item.label}</h3>
                </div>
                
                <div className="card-content">
                  <p className="item-description">{item.description}</p>
                  
                  <div className="selection-buttons">
                    {yesNoOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        className={`selection-btn ${option.value.toLowerCase()} ${formData[item.id] === option.value ? 'selected' : ''}`}
                        onClick={() => handleChange(item.id, option.value)}
                      >
                        <i className={`fas ${option.icon}`}></i>
                        <span>{option.label}</span>
                        {option.value === 'Yes' && <span className="points-value">+1</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="assessment-note">
            <div className="note-icon">
              <i className="fas fa-sticky-note"></i>
            </div>
            <p>This tool is to be used in conjunction with your agency's fall prevention program and clinical judgment. Complete this assessment at the start of care and at recertification or following a significant change in condition.</p>
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

export default MAHC10Modal;