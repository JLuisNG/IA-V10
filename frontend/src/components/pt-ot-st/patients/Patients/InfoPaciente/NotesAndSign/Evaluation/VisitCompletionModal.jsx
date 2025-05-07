// VisitCompletionModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/VisitCompletionModal.scss';

// Importar todos los componentes de los pasos

import Navigation from './Navigation';
import PTEvaluation from './PTEvaluation';
import ObjectiveSection from './ObjectiveSection';
import AssessmentSection from './AssessmentSection';
import PlanSection from './PlanSection';
import TransfersSection from './TransfersSection';
import FinaleSection from './FinaleSection';
import FooterNavigation from './FooterNavigation';
import MedicationTab from './MedicationTab';

// Importar componentes de pruebas estandarizadas

import TinettiModal from './FstandardizedTests/TinettiModal';
import BergModal from './standardizedTests/BergModal.jsx';
import AceIIIModal from './standardizedTests/AceIIIModal.jsx';
import TimedUpAndGoModal from './standardizedTests/TimedUpAndGoModal.jsx';
import FunctionalReachModal from './standardizedTests/FunctionalReachModal.jsx';
import FallRiskModal from './standardizedTests/FallRiskModal.jsx';
import AdvancedBalanceModal from './standardizedTests/AdvancedBalanceModal.jsx';
import MAHC10Modal from './standardizedTests/MAHC10Modal.jsx';
import BarthelModal from './standardizedTests/BarthelModal.jsx';
import SPPBModal from './standardizedTests/SPPBModal.jsx';
import NutritionalAssessmentModal from './standardizedTests/NutritionalAssessmentModal.jsx';
import DiabeticFootModal from './standardizedTests/DiabeticFootModal.jsx';
import KatzModal from './standardizedTests/KatzModal.jsx';
import WoundAssessmentModal from './standardizedTests/WoundAssessmentModal.jsx';
import BradenScaleModal from './standardizedTests/BradenScaleModal.jsx';
import MedicationListModal from './standardizedTests/MedicationListModal.jsx';
import DiagnosisModal from './DiagnosisModal.jsx';
import MobergModal from './standardizedTests/MobergModal.jsx';
import SlumsModal from './standardizedTests/SlumsModal.jsx';
import FourStageBalanceTestModal from './standardizedTests/FourStageBalanceTestModal ';

// Constantes para los nombres de los test estandarizados
// Constantes para los nombres de los test estandarizados
const STANDARDIZED_TESTS = {
  ACE_III: 'ACE III',
  TINETTI: 'Tinetti',
  TIMED_UP_AND_GO: 'Timed Up And Go',
  FUNCTIONAL_REACH: 'Functional Reach',
  BERG: 'BERG',
  FALL_RISK: 'Fall Risk Assessment',
  ADVANCED_BALANCE: 'Advanced Balance',
  MAHC10: 'MAHC10',
  BARTHEL: 'Barthel Index',
  SPPB: 'Short Physical Performance Battery',
  NUTRITIONAL: 'Nutritional Status Assessment',
  DIABETIC_FOOT: 'Diabetic Foot Exam',
  KATZ: 'Katz',
  WOUND: 'Wound Assessment',
  BRADEN: 'Braden Scale',
  MEDICATION: 'Medication List',
  MOBERG: 'Moberg Hand Function Test',
  SLUMS: 'SLUMS Examination',
  FOUR_STAGE_BALANCE: 'Four Stage Balance Test',
};

const VisitCompletionModal = ({ isOpen, onClose, visitData, onSave }) => {
  // Estados para manejar los pasos y datos del formulario
  const [currentStep, setCurrentStep] = useState('evaluation');
  const [activeTab, setActiveTab] = useState('patient-information');
  const [formData, setFormData] = useState({
    patientInfo: {},
    objective: {},
    transfers: {},
    assessment: {},
    plan: {},
    finale: {}
  });
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTest, setActiveTest] = useState(null);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  
  // Estado para controlar el guardado automático
  const [lastSaved, setLastSaved] = useState(new Date());
  const [autoSaveMessage, setAutoSaveMessage] = useState('');
  const [showAutoSaveMessage, setShowAutoSaveMessage] = useState(false);

  // Efecto para inicializar los datos del formulario con los datos de la visita
  useEffect(() => {
    if (visitData) {
      // Inicializar el formulario con los datos existentes de la visita si están disponibles
      // o con valores por defecto si es una nueva entrada
      setFormData({
        patientInfo: visitData.patientInfo || {},
        objective: visitData.objective || {},
        transfers: visitData.transfers || {},
        assessment: visitData.assessment || {},
        plan: visitData.plan || {},
        finale: visitData.finale || {}
      });
    }
  }, [visitData]);

  // Función para manejar los cambios en los datos del formulario
  const handleFormChange = (section, data) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        ...data
      }
    }));
    setIsFormDirty(true);
  };

  // Función para el guardado automático
  const autoSave = useCallback(async () => {
    if (isFormDirty) {
      try {
        await onSave(formData);
        setLastSaved(new Date());
        setAutoSaveMessage('AUTOSAVED');
        setShowAutoSaveMessage(true);
        setTimeout(() => {
          setShowAutoSaveMessage(false);
        }, 3000);
        setIsFormDirty(false);
      } catch (error) {
        console.error('Error during auto-save:', error);
      }
    }
  }, [formData, isFormDirty, onSave]);

  // Efecto para configurar el guardado automático cada 2 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      autoSave();
    }, 120000); // 2 minutos
    
    return () => clearInterval(interval);
  }, [autoSave]);

  // Función para cambiar entre los diferentes pasos
  const handleStepChange = (step) => {
    // Auto-guardar antes de cambiar de paso
    autoSave();
    setCurrentStep(step);
    // Resetear la pestaña activa al cambiar de paso
    setActiveTab('patient-information');
  };

  // Función para cambiar entre pestañas dentro de un paso
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Función para guardar y salir
  const handleSaveAndExit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
      // Implementar mensaje de error aquí
    } finally {
      setIsSaving(false);
    }
  };

  // Manejar la apertura de una prueba estandarizada
  const handleOpenTest = (testName) => {
    setActiveTest(testName);
  };

  // Manejar el cierre de una prueba estandarizada
  const handleCloseTest = (testData) => {
    if (testData) {
      // Actualizar los datos del formulario con los resultados de la prueba
      const section = currentStep === 'evaluation' ? 'patientInfo' : 'objective';
      const updatedTests = {
        ...formData[section].standardizedTests,
        [activeTest]: testData
      };
      
      handleFormChange(section, {
        standardizedTests: updatedTests
      });
    }
    setActiveTest(null);
  };

  // Manejar la apertura del modal de diagnóstico
  const handleOpenDiagnosisModal = () => {
    setShowDiagnosisModal(true);
  };

  // Manejar el cierre del modal de diagnóstico
  const handleCloseDiagnosisModal = (diagnosisData) => {
    if (diagnosisData) {
      handleFormChange('patientInfo', {
        therapyDiagnosis: diagnosisData
      });
    }
    setShowDiagnosisModal(false);
  };

  // Obtener el texto para el paso actual
  const getStepTitle = () => {
    switch (currentStep) {
      case 'evaluation':
        return 'PT Evaluation';
      case 'objective':
        return 'Objective';
      case 'transfers':
        return 'Transfers / ADL';
      case 'assessment':
        return 'Assessment';
      case 'plan':
        return 'Plan';
      case 'finale':
        return 'Finale';
      default:
        return 'PT Evaluation';
    }
  };

  // Renderizar el componente actual basado en el paso
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'evaluation':
        return (
          <PTEvaluation
            data={formData.patientInfo}
            onChange={(data) => handleFormChange('patientInfo', data)}
            onOpenTest={handleOpenTest}
            onOpenDiagnosisModal={handleOpenDiagnosisModal}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            autoSaveMessage={showAutoSaveMessage ? autoSaveMessage : ''}
          />
        );
      case 'objective':
        return (
          <ObjectiveSection
            data={formData.objective}
            onChange={(data) => handleFormChange('objective', data)}
            onOpenTest={handleOpenTest}
            autoSaveMessage={showAutoSaveMessage ? autoSaveMessage : ''}
          />
        );
      case 'transfers':
        return (
          <TransfersSection
            data={formData.transfers || {}}
            onChange={(data) => handleFormChange('transfers', data)}
            onOpenTest={handleOpenTest}
            autoSaveMessage={showAutoSaveMessage ? autoSaveMessage : ''}
          />
        );
      case 'assessment':
        return (
          <AssessmentSection
            data={formData.assessment}
            onChange={(data) => handleFormChange('assessment', data)}
            autoSaveMessage={showAutoSaveMessage ? autoSaveMessage : ''}
          />
        );
      case 'plan':
        return (
          <PlanSection
            data={formData.plan}
            onChange={(data) => handleFormChange('plan', data)}
            autoSaveMessage={showAutoSaveMessage ? autoSaveMessage : ''}
          />
        );
      case 'finale':
        return (
          <FinaleSection
            data={formData.finale}
            onChange={(data) => handleFormChange('finale', data)}
            autoSaveMessage={showAutoSaveMessage ? autoSaveMessage : ''}
          />
        );
      default:
        return <PTEvaluation 
          data={formData.patientInfo} 
          onChange={(data) => handleFormChange('patientInfo', data)}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />;
    }
  };

  // Renderizar el modal de prueba estandarizada activo
  const renderActiveTestModal = () => {
    switch (activeTest) {
      case STANDARDIZED_TESTS.ACE_III:
        return <AceIIIModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.ACE_III]} 
        />;
      case STANDARDIZED_TESTS.TINETTI:
        return <TinettiModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.TINETTI]} 
        />;
      case STANDARDIZED_TESTS.TIMED_UP_AND_GO:
        return <TimedUpAndGoModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.TIMED_UP_AND_GO]} 
        />;
      case STANDARDIZED_TESTS.FUNCTIONAL_REACH:
        return <FunctionalReachModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.FUNCTIONAL_REACH]} 
        />;
      case STANDARDIZED_TESTS.BERG:
        return <BergModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.BERG]} 
        />;
      case STANDARDIZED_TESTS.FALL_RISK:
        return <FallRiskModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.FALL_RISK]} 
        />;
      case STANDARDIZED_TESTS.ADVANCED_BALANCE:
        return <AdvancedBalanceModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.ADVANCED_BALANCE]} 
        />;
      case STANDARDIZED_TESTS.MAHC10:
        return <MAHC10Modal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.MAHC10]} 
        />;
      case STANDARDIZED_TESTS.BARTHEL:
        return <BarthelModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.BARTHEL]} 
        />;
      case STANDARDIZED_TESTS.SPPB:
        return <SPPBModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.SPPB]} 
        />;
      case STANDARDIZED_TESTS.NUTRITIONAL:
        return <NutritionalAssessmentModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.NUTRITIONAL]} 
        />;
      case STANDARDIZED_TESTS.DIABETIC_FOOT:
        return <DiabeticFootModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.DIABETIC_FOOT]} 
        />;
      case STANDARDIZED_TESTS.KATZ:
        return <KatzModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.KATZ]} 
        />;
      case STANDARDIZED_TESTS.WOUND:
        return <WoundAssessmentModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.WOUND]} 
        />;
      case STANDARDIZED_TESTS.BRADEN:
        return <BradenScaleModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.BRADEN]} 
        />;
      case STANDARDIZED_TESTS.MEDICATION:
        return <MedicationListModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.MEDICATION]} 
        />;
      case STANDARDIZED_TESTS.MOBERG:
        return <MobergModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.MOBERG]} 
        />;
      case STANDARDIZED_TESTS.FOUR_STAGE_BALANCE:
        return <FourStageBalanceTestModal
          isOpen={!!activeTest}
          onClose={handleCloseTest}
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.FOUR_STAGE_BALANCE]}
        />;
      case STANDARDIZED_TESTS.SLUMS:
        return <SlumsModal 
          isOpen={!!activeTest} 
          onClose={handleCloseTest} 
          initialData={formData.patientInfo.standardizedTests?.[STANDARDIZED_TESTS.SLUMS]} 
        />;
      default:
        return null;
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Definir los pasos de navegación
  const navigationSteps = [
    { id: 'evaluation', label: 'PT Evaluation', number: 1 },
    { id: 'objective', label: 'Objective', number: 2 },
    { id: 'assessment', label: 'Assessment', number: 3 },
    { id: 'plan', label: 'Plan', number: 4 },
    { id: 'transfers', label: 'Transfers / ADL', number: 5 },
    { id: 'finale', label: 'Finale', number: 6 }
  ];

  return (
    <div className="visit-completion-modal-overlay">
      <div className="visit-completion-modal">
        <div className="modal-header">
          <h2>{getStepTitle()}</h2>
          <div className="patient-info">
            <div className="info-item">
              <i className="fas fa-user"></i>
              <span>Patient: {visitData?.patientName || 'Unknown'}</span>
            </div>
            <div className="info-item">
              <i className="fas fa-calendar-alt"></i>
              <span>Date: {visitData?.date || new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="navigation-container">
          <div className="step-navigation">
            {navigationSteps.map((step) => (
              <button
                key={step.id}
                className={`step-button ${currentStep === step.id ? 'active' : ''}`}
                onClick={() => handleStepChange(step.id)}
              >
                <span className="step-number">{step.number}</span>
                {step.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="modal-content">
          {renderCurrentStep()}
        </div>
        
        <div className="modal-footer">
          <div className="footer-actions">
            <button 
              className={`footer-button save-exit ${isSaving ? 'loading' : ''}`}
              onClick={handleSaveAndExit}
              disabled={isSaving}
            >
              <i className="fas fa-save"></i>
              <span>Save & Exit</span>
            </button>
          </div>
          
          <div className="footer-actions">
            {currentStep !== 'evaluation' && (
              <button 
                className="footer-button secondary"
                onClick={() => {
                  const currentIndex = navigationSteps.findIndex(step => step.id === currentStep);
                  if (currentIndex > 0) {
                    handleStepChange(navigationSteps[currentIndex - 1].id);
                  }
                }}
              >
                <i className="fas fa-arrow-left"></i>
                <span>Previous</span>
              </button>
            )}
            
            {currentStep !== 'finale' && (
              <button 
                className="footer-button primary"
                onClick={() => {
                  const currentIndex = navigationSteps.findIndex(step => step.id === currentStep);
                  if (currentIndex < navigationSteps.length - 1) {
                    handleStepChange(navigationSteps[currentIndex + 1].id);
                  }
                }}
              >
                <span>Next</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            )}
          </div>
        </div>
        
        {/* Renderizar el modal de prueba estandarizada activo */}
        {renderActiveTestModal()}
        
        {/* Modal de diagnóstico */}
        {showDiagnosisModal && (
          <DiagnosisModal
            isOpen={showDiagnosisModal}
            onClose={handleCloseDiagnosisModal}
            initialData={formData.patientInfo.therapyDiagnosis}
          />
        )}
      </div>
    </div>
  );
};

export default VisitCompletionModal;