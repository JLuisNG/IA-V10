// Enhanced DiagnosisModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/DiagnosisModal.scss';

const DiagnosisModal = ({ isOpen, onClose, initialData = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(initialData ? parseInitialData(initialData) : null);
  const [secondaryDiagnoses, setSecondaryDiagnoses] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [customCode, setCustomCode] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  
  // Parse initial data if it exists
  function parseInitialData(data) {
    if (!data) return null;
    
    try {
      // Assuming format "CODE - Description | Secondary: CODE - Description, CODE - Description"
      const parts = data.split(' | Secondary: ');
      const primary = parts[0];
      
      // Parse the primary diagnosis
      const primaryMatch = primary.match(/^([A-Z0-9.]+) - (.+)$/);
      if (primaryMatch) {
        const primaryDiagnosis = {
          code: primaryMatch[1],
          description: primaryMatch[2]
        };
        
        // Parse secondary diagnoses if they exist
        if (parts.length > 1) {
          const secondaryPart = parts[1];
          const secondaryList = secondaryPart.split(', ').map(item => {
            const match = item.match(/^([A-Z0-9.]+) - (.+)$/);
            if (match) {
              return {
                code: match[1],
                description: match[2]
              };
            }
            return null;
          }).filter(item => item !== null);
          
          setSecondaryDiagnoses(secondaryList);
        }
        
        return primaryDiagnosis;
      }
    } catch (error) {
      console.error('Error parsing diagnosis data:', error);
    }
    
    return null;
  }
  
  // Lista de diagnósticos comunes (seleccionados de los más frecuentes en la imagen)
  const commonDiagnoses = [
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M79.602', description: 'Pain in left arm' },
    { code: 'M79.601', description: 'Pain in right arm' },
    { code: 'M62.81', description: 'Muscle weakness (generalized)' },
    { code: 'R26.2', description: 'Difficulty in walking, not elsewhere classified' },
    { code: 'M25.512', description: 'Pain in left shoulder' },
    { code: 'M25.511', description: 'Pain in right shoulder' },
    { code: 'G81.90', description: 'Hemiplegia, unspecified affecting unspecified side' },
    { code: 'G81.93', description: 'Hemiplegia, unspecified affecting right nondominant side' },
    { code: 'M54.6', description: 'Pain in thoracic spine' }
  ];
  
  // Lista completa de diagnósticos (todos los de la imagen + adicionales)
  const allDiagnoses = [
    ...commonDiagnoses,
    { code: 'M25.562', description: 'Pain in left knee' },
    { code: 'M79.605', description: 'Pain in left leg' },
    { code: 'M25.561', description: 'Pain in right knee' },
    { code: 'M79.609', description: 'Pain in unspecified limb' },
    { code: 'M79.604', description: 'Pain right leg' },
    { code: 'G82.21', description: 'Paraplegia, complete' },
    { code: 'G82.22', description: 'Paraplegia, incomplete' },
    { code: 'G82.20', description: 'Paraplegia, unspecified' },
    { code: 'G83.83', description: 'Posterior cord syndrome' },
    { code: 'I97.2', description: 'Postmastectomy lymphedema syndrome' },
    { code: 'G82.51', description: 'Quadriplegia C1-C4 complete' },
    { code: 'G82.50', description: 'Quadriplegia, unspecified' },
    { code: 'M54.12', description: 'Radiculopathy, cervical region' },
    { code: 'M54.11', description: 'Radiculopathy, occipito-atlanto-axial region' },
    { code: 'M54.13', description: 'Radiculopathy, cervicothoracic region' },
    { code: 'G60.0', description: 'Hereditary motor and sensory neuropathy' },
    { code: 'I89.0', description: 'Lymphedema not elsewhere classified' },
    { code: 'G11.34', description: 'MAD' },
    { code: 'M62.572', description: 'Muscle wasting and atrophy, not elsewhere classified, left ankle and foot' },
    { code: 'M62.532', description: 'Muscle wasting and atrophy, not elsewhere classified, left forearm' },
    { code: 'M62.542', description: 'Muscle wasting and atrophy, not elsewhere classified, left hand' },
    { code: 'M62.562', description: 'Muscle wasting and atrophy, not elsewhere classified, left lower leg' },
    { code: 'M62.512', description: 'Muscle wasting and atrophy, not elsewhere classified, left shoulder' },
    { code: 'M62.552', description: 'Muscle wasting and atrophy, not elsewhere classified, left thigh' },
    { code: 'M62.522', description: 'Muscle wasting and atrophy, not elsewhere classified, left upper arm' },
    { code: 'M62.59', description: 'Muscle wasting and atrophy, not elsewhere classified, multiple sites' },
    { code: 'M62.58', description: 'Muscle wasting and atrophy, not elsewhere classified, other site' },
    { code: 'M62.571', description: 'Muscle wasting and atrophy, not elsewhere classified, right ankle and foot' },
    { code: 'M62.531', description: 'Muscle wasting and atrophy, not elsewhere classified, right forearm' },
    { code: 'M62.541', description: 'Muscle wasting and atrophy, not elsewhere classified, right hand' },
    { code: 'M62.561', description: 'Muscle wasting and atrophy, not elsewhere classified, right lower leg' },
    { code: 'M62.511', description: 'Muscle wasting and atrophy, not elsewhere classified, right shoulder' },
    { code: 'M62.551', description: 'Muscle wasting and atrophy, not elsewhere classified, right thigh' },
    { code: 'M62.521', description: 'Muscle wasting and atrophy, not elsewhere classified, right upper arm' },
    // Additional diagnoses
    { code: 'M25.559', description: 'Pain in unspecified hip' },
    { code: 'M54.9', description: 'Dorsalgia, unspecified' },
    { code: 'G82.52', description: 'Quadriplegia, C5-C7 complete' },
    { code: 'G82.53', description: 'Quadriplegia, C5-C7 incomplete' },
    { code: 'M17.9', description: 'Osteoarthritis of knee, unspecified' },
    { code: 'M47.812', description: 'Spondylosis without myelopathy or radiculopathy, cervical region' },
    { code: 'G62.9', description: 'Polyneuropathy, unspecified' },
    { code: 'R53.1', description: 'Weakness' }
  ];
  
  // Filtrar diagnósticos basados en el término de búsqueda
  const filteredDiagnoses = allDiagnoses.filter(diagnosis => 
    diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    diagnosis.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Manejar la selección de un diagnóstico
  const handleSelectDiagnosis = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
  };
  
  // Manejar la adición de un diagnóstico secundario
  const handleAddSecondaryDiagnosis = (diagnosis) => {
    if (!secondaryDiagnoses.some(d => d.code === diagnosis.code)) {
      setSecondaryDiagnoses([...secondaryDiagnoses, diagnosis]);
    }
  };
  
  // Manejar la eliminación de un diagnóstico secundario
  const handleRemoveSecondaryDiagnosis = (code) => {
    setSecondaryDiagnoses(secondaryDiagnoses.filter(d => d.code !== code));
  };
  
  // Manejar la adición de un diagnóstico personalizado
  const handleAddCustomDiagnosis = () => {
    if (customCode && customDescription) {
      const customDiagnosis = {
        code: customCode,
        description: customDescription
      };
      
      setSelectedDiagnosis(customDiagnosis);
      setCustomCode('');
      setCustomDescription('');
    }
  };
  
  // Manejar la confirmación y cierre del modal
  const handleConfirm = () => {
    // Crear un string formateado con todos los diagnósticos
    let diagnosisText = selectedDiagnosis.code + ' - ' + selectedDiagnosis.description;
    
    if (secondaryDiagnoses.length > 0) {
      diagnosisText += ' | Secondary: ' + secondaryDiagnoses.map(d => d.code + ' - ' + d.description).join(', ');
    }
    
    onClose(diagnosisText);
  };
  
  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;
  
  return (
    <div className="diagnosis-modal-overlay">
      <div className="diagnosis-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-heartbeat"></i>
            Select Therapy Diagnosis
          </h2>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <i className="fas fa-search"></i>
            Search
          </button>
          <button 
            className={`tab-button ${activeTab === 'common' ? 'active' : ''}`}
            onClick={() => setActiveTab('common')}
          >
            <i className="fas fa-star"></i>
            Common Diagnoses
          </button>
          <button 
            className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            <i className="fas fa-history"></i>
            Recent
          </button>
          <button 
            className={`tab-button ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            <i className="fas fa-edit"></i>
            Custom
          </button>
        </div>
        
        <div className="modal-content">
          {activeTab === 'search' && (
            <div className="search-tab">
              <div className="search-bar">
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input 
                    type="text"
                    placeholder="Search by code or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="clear-btn"
                      onClick={() => setSearchTerm('')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="diagnosis-list">
                {filteredDiagnoses.map(diagnosis => (
                  <div 
                    key={diagnosis.code} 
                    className={`diagnosis-item ${selectedDiagnosis?.code === diagnosis.code ? 'selected' : ''}`}
                    onClick={() => handleSelectDiagnosis(diagnosis)}
                  >
                    <div className="diagnosis-info">
                      <div className="diagnosis-code">{diagnosis.code}</div>
                      <div className="diagnosis-description">{diagnosis.description}</div>
                    </div>
                    <div className="diagnosis-actions">
                      <button 
                        className="add-secondary-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSecondaryDiagnosis(diagnosis);
                        }}
                        title="Add as secondary diagnosis"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredDiagnoses.length === 0 && (
                  <div className="no-results">
                    <i className="fas fa-search"></i>
                    <span>No diagnoses found matching "{searchTerm}"</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'common' && (
            <div className="common-tab">
              <div className="diagnosis-list">
                {commonDiagnoses.map(diagnosis => (
                  <div 
                    key={diagnosis.code} 
                    className={`diagnosis-item ${selectedDiagnosis?.code === diagnosis.code ? 'selected' : ''}`}
                    onClick={() => handleSelectDiagnosis(diagnosis)}
                  >
                    <div className="diagnosis-info">
                      <div className="diagnosis-code">{diagnosis.code}</div>
                      <div className="diagnosis-description">{diagnosis.description}</div>
                    </div>
                    <div className="diagnosis-actions">
                      <button 
                        className="add-secondary-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSecondaryDiagnosis(diagnosis);
                        }}
                        title="Add as secondary diagnosis"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'recent' && (
            <div className="recent-tab">
              <div className="diagnosis-list">
                {/* Aquí normalmente cargaríamos los diagnósticos recientes del usuario */}
                <div className="no-results">
                  <i className="fas fa-history"></i>
                  <span>No recent diagnoses found</span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'custom' && (
            <div className="custom-tab">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-tag"></i>
                    Diagnosis Code
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter ICD-10 code"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-align-left"></i>
                    Diagnosis Description
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter diagnosis description"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                className="add-custom-btn"
                onClick={handleAddCustomDiagnosis}
                disabled={!customCode || !customDescription}
              >
                <i className="fas fa-plus"></i>
                <span>Add Custom Diagnosis</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="selected-diagnoses">
          <div className="primary-diagnosis">
            <div className="diagnosis-header">
              <h3>
                <i className="fas fa-star"></i>
                Primary Diagnosis
              </h3>
            </div>
            {selectedDiagnosis ? (
              <div className="selected-diagnosis-item">
                <div className="diagnosis-info">
                  <div className="diagnosis-code">{selectedDiagnosis.code}</div>
                  <div className="diagnosis-description">{selectedDiagnosis.description}</div>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => setSelectedDiagnosis(null)}
                  title="Remove primary diagnosis"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <div className="no-diagnosis">
                <i className="fas fa-info-circle"></i>
                <span>No primary diagnosis selected</span>
              </div>
            )}
          </div>
          
          <div className="secondary-diagnoses">
            <div className="diagnosis-header">
              <h3>
                <i className="fas fa-list-ul"></i>
                Secondary Diagnoses
              </h3>
              {secondaryDiagnoses.length > 0 && (
                <div className="count-badge">
                  {secondaryDiagnoses.length}
                </div>
              )}
            </div>
            {secondaryDiagnoses.length > 0 ? (
              <div className="secondary-list">
                {secondaryDiagnoses.map(diagnosis => (
                  <div key={diagnosis.code} className="selected-diagnosis-item">
                    <div className="diagnosis-info">
                      <div className="diagnosis-code">{diagnosis.code}</div>
                      <div className="diagnosis-description">{diagnosis.description}</div>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveSecondaryDiagnosis(diagnosis.code)}
                      title="Remove secondary diagnosis"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-diagnosis">
                <i className="fas fa-info-circle"></i>
                <span>No secondary diagnoses selected</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
            Cancel
          </button>
          <button 
            className="confirm-btn" 
            onClick={handleConfirm}
            disabled={!selectedDiagnosis}
          >
            <i className="fas fa-check"></i>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisModal;