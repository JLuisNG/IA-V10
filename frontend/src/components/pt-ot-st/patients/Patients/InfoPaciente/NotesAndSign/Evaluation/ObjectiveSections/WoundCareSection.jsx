// Enhanced WoundCareSection.jsx
import React from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/ObjectiveSections/WoundCareSection.scss';
import StandardizedTest from '../StandardizedTest';

const WoundCareSection = ({ data, onChange, onOpenTest }) => {
  // Opciones para los tests estandarizados
  const testNames = {
    BRADEN: 'Braden Scale',
    WOUND: 'Wound Assessment'
  };

  // Manejar cambios en textarea
  const handleTextChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Verificar si una prueba está completa
  const isTestComplete = (testName) => {
    return data?.standardizedTests?.[testName]?.isComplete || false;
  };

  // Obtener la puntuación de un test
  const getTestScore = (testName) => {
    return data?.standardizedTests?.[testName]?.score || null;
  };

  return (
    <div className="wound-care-section">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-first-aid"></i>
          Wound Care
        </h2>
        <span className="optional-badge">Optional</span>
      </div>
      
      <div className="wound-description-container">
        <div className="card-header">
          <div className="header-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <h3 className="header-title">Wound Description</h3>
        </div>
        <div className="card-body">
          <div className="description-guidelines">
            <div className="guideline-item">
              <div className="guideline-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <span>Location</span>
            </div>
            <div className="guideline-item">
              <div className="guideline-icon">
                <i className="fas fa-ruler-combined"></i>
              </div>
              <span>Measurements</span>
            </div>
            <div className="guideline-item">
              <div className="guideline-icon">
                <i className="fas fa-eye"></i>
              </div>
              <span>Appearance</span>
            </div>
            <div className="guideline-item">
              <div className="guideline-icon">
                <i className="fas fa-procedures"></i>
              </div>
              <span>Treatment</span>
            </div>
          </div>
          <div className="description-textarea">
            <textarea 
              value={data.woundDescription || ''}
              onChange={(e) => handleTextChange('woundDescription', e.target.value)}
              rows={6}
              placeholder="Enter wound description, location, measurements, treatment plan, and any other relevant information"
            />
          </div>
        </div>
      </div>
      
      <div className="tests-container">
        <div className="card-header">
          <div className="header-icon">
            <i className="fas fa-vial"></i>
          </div>
          <h3 className="header-title">Standardized Tests</h3>
        </div>
        <div className="card-body">
          <div className="tests-grid">
            <div className="test-card-wrapper">
              <StandardizedTest 
                title={testNames.BRADEN}
                isComplete={isTestComplete(testNames.BRADEN)}
                score={getTestScore(testNames.BRADEN)}
                onOpen={() => onOpenTest(testNames.BRADEN)}
              />
            </div>
            
            <div className="test-card-wrapper">
              <StandardizedTest 
                title={testNames.WOUND}
                isComplete={isTestComplete(testNames.WOUND)}
                score={getTestScore(testNames.WOUND)}
                onOpen={() => onOpenTest(testNames.WOUND)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="quick-reference-container">
        <div className="reference-header">
          <i className="fas fa-info-circle"></i>
          <h4>Wound Assessment Quick Reference</h4>
        </div>
        <div className="reference-content">
          <div className="reference-items">
            <div className="reference-item">
              <div className="reference-icon red">
                <i className="fas fa-tint"></i>
              </div>
              <div className="reference-info">
                <h5>Exudate</h5>
                <p>Document color, consistency, and amount</p>
              </div>
            </div>
            <div className="reference-item">
              <div className="reference-icon yellow">
                <i className="fas fa-ruler"></i>
              </div>
              <div className="reference-info">
                <h5>Measurements</h5>
                <p>Length, width, depth in cm</p>
              </div>
            </div>
            <div className="reference-item">
              <div className="reference-icon green">
                <i className="fas fa-palette"></i>
              </div>
              <div className="reference-info">
                <h5>Tissue Type</h5>
                <p>Granulation, slough, eschar, epithelial</p>
              </div>
            </div>
            <div className="reference-item">
              <div className="reference-icon blue">
                <i className="fas fa-temperature-high"></i>
              </div>
              <div className="reference-info">
                <h5>Periwound</h5>
                <p>Check for warmth, redness, edema</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WoundCareSection;