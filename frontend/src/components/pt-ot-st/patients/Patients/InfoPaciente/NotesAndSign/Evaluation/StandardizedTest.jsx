// StandardizedTest.jsx
import React from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/StandardizedTest.scss';

const StandardizedTest = ({ title, isComplete, score, onOpen }) => {
  // Determinar qué icono mostrar según el tipo de prueba
  const getTestIcon = () => {
    switch (title) {
      case 'ACE III':
      case 'SLUMS Examination':
        return 'fas fa-brain';
      case 'Tinetti':
      case 'Timed Up And Go':
      case 'Functional Reach':
      case 'BERG':
      case 'Fall Risk Assessment':
      case 'Advanced Balance':
      case 'Four Stage Balance Test':
        return 'fas fa-walking';
      case 'MAHC10':
        return 'fas fa-home';
      case 'Barthel Index':
      case 'Katz':
        return 'fas fa-tasks';
      case 'Short Physical Performance Battery':
        return 'fas fa-running';
      case 'Nutritional Status Assessment':
        return 'fas fa-apple-alt';
      case 'Diabetic Foot Exam':
        return 'fas fa-socks';
      case 'Wound Assessment':
        return 'fas fa-band-aid';
      case 'Braden Scale':
        return 'fas fa-chart-bar';
      case 'Medication List':
        return 'fas fa-pills';
      case 'Moberg Hand Function Test':
        return 'fas fa-hand-paper';
      default:
        return 'fas fa-clipboard-check';
    }
  };

  // Obtener etiqueta de estado
  const getStatusLabel = () => {
    if (isComplete) return 'Complete';
    return 'Incomplete';
  };

  // Obtener color de la tarjeta basado en el estado
  const getStatusClass = () => {
    return isComplete ? 'complete' : 'incomplete';
  };

  return (
    <div className="test-card">
      <div className="test-info">
        <div className="test-icon">
          <i className={getTestIcon()}></i>
        </div>
        <div className="test-details">
          <h4>{title}</h4>
          <div className={`test-status ${getStatusClass()}`}>
            <span className={`badge ${getStatusClass()}`}>
              {getStatusLabel()}
            </span>
            {score !== null && score !== undefined && (
              <span className="test-score">Score: {score}</span>
            )}
          </div>
        </div>
      </div>
      <div className="test-action">
        <button onClick={onOpen} title="Open Test">
          <i className="fas fa-external-link-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default StandardizedTest;