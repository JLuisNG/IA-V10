// Enhanced Navigation.jsx
import React from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/Navigation.scss';

const Navigation = ({ currentStep, onStepChange, patientName, visitDate }) => {
  // Define los pasos con sus iconos y números
  const steps = [
    { id: 'evaluation', label: 'PT Evaluation', icon: 'fas fa-clipboard-list', number: 1 },
    { id: 'objective', label: 'Objective', icon: 'fas fa-bullseye', number: 2 },
    { id: 'assessment', label: 'Assessment', icon: 'fas fa-chart-line', number: 3 },
    { id: 'plan', label: 'Plan', icon: 'fas fa-tasks', number: 4 },
    { id: 'transfers', label: 'Transfers / ADL', icon: 'fas fa-exchange-alt', number: 5 },
    { id: 'finale', label: 'Finale', icon: 'fas fa-flag-checkered', number: 6 }
  ];
  
  // Formatear la fecha de la visita
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? dateString 
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
  };
  
  // Obtener el índice del paso actual
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };
  
  // Verificar si un paso está completo (para usar en la marca de verificación)
  const isStepComplete = (stepIndex) => {
    const currentIndex = getCurrentStepIndex();
    return stepIndex < currentIndex;
  };
  
  // Verificar si un paso está activo
  const isStepActive = (stepId) => {
    return currentStep === stepId;
  };

  return (
    <div className="navigation-container">
      <div className="navigation-content">
        <div className="patient-info">
          <div className="info-item">
            <i className="fas fa-user-alt"></i>
            <div className="info-details">
              <span className="label">Patient</span>
              <span className="value">{patientName || 'Unknown'}</span>
            </div>
          </div>
          
          <div className="info-item">
            <i className="fas fa-calendar-day"></i>
            <div className="info-details">
              <span className="label">Visit Date</span>
              <span className="value">{formatDate(visitDate)}</span>
            </div>
          </div>
        </div>
        
        <div className="steps-navigation">
          <select 
            className="steps-dropdown"
            value={currentStep}
            onChange={(e) => onStepChange(e.target.value)}
            aria-label="Select evaluation step"
          >
            {steps.map(step => (
              <option key={step.id} value={step.id}>
                {step.number}. {step.label}
              </option>
            ))}
          </select>
          
          <div className="steps-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(getCurrentStepIndex() / (steps.length - 1)) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="steps-tabs">
            {steps.map((step) => (
              <button
                key={step.id}
                className={`step-tab ${isStepActive(step.id) ? 'active' : ''} ${isStepComplete(steps.indexOf(step)) ? 'completed' : ''}`}
                onClick={() => onStepChange(step.id)}
                aria-label={`Go to ${step.label} step`}
              >
                <div className="step-indicator">
                  {isStepComplete(steps.indexOf(step)) ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <span className="step-number">{step.number}</span>
                  )}
                </div>
                <div className="step-details">
                  <i className={step.icon}></i>
                  <span className="step-label">{step.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;