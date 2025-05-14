// Enhanced FooterNavigation.jsx
import React from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/FooterNavigation.scss';

const FooterNavigation = ({
  onSaveAndExit,
  currentStep,
  onStepChange,
  isSaving
}) => {
  const steps = [
    { id: 'evaluation', label: 'PT Evaluation', icon: 'fa-clipboard-check' },
    { id: 'objective', label: 'Objective', icon: 'fa-bullseye' },
    { id: 'assessment', label: 'Assessment', icon: 'fa-chart-bar' },
    { id: 'plan', label: 'Plan', icon: 'fa-tasks' },
    { id: 'transfers', label: 'Transfers / ADL', icon: 'fa-exchange-alt' },
    { id: 'finale', label: 'Finale', icon: 'fa-flag-checkered' }
  ];
  
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;
  
  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = steps[currentIndex + 1].id;
      onStepChange(nextStep);
    }
  };
  
  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = steps[currentIndex - 1].id;
      onStepChange(prevStep);
    }
  };
  
  return (
    <div className="footer-navigation">
      <div className="action-buttons">
        <button 
          className="action-btn save-exit-btn" 
          onClick={onSaveAndExit}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              <span>Save & Exit</span>
            </>
          )}
        </button>
      </div>
      
      <div className="step-selector">
        {!isFirstStep && (
          <button 
            className="navigation-btn prev-btn"
            onClick={handlePrevious}
          >
            <i className="fas fa-arrow-left"></i>
            <span>Previous</span>
          </button>
        )}
        
        <select 
          className="step-dropdown"
          value={currentStep}
          onChange={(e) => onStepChange(e.target.value)}
        >
          {steps.map(step => (
            <option key={step.id} value={step.id}>
              {step.label}
            </option>
          ))}
        </select>
        
        {!isLastStep && (
          <button 
            className="navigation-btn next-btn"
            onClick={handleNext}
          >
            <span>Next</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default FooterNavigation;