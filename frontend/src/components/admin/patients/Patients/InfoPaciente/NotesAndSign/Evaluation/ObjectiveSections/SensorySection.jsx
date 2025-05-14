// Enhanced SensorySection.jsx
import React from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/ObjectiveSections/SensorySection.scss';

const SensorySection = ({ data, onChange }) => {
  // Opciones para los dropdowns
  const normalAbnormalOptions = [
    { value: '', label: 'Select an option' },
    { value: 'Normal', label: 'Normal (N)' },
    { value: 'Abnormal', label: 'Abnormal (AB)' },
    { value: 'Not Tested', label: 'Not Tested (NT)' }
  ];
  
  const handDominanceOptions = [
    { value: '', label: 'Select an option' },
    { value: 'N/A', label: 'N/A' },
    { value: 'Right', label: 'Right' },
    { value: 'Left', label: 'Left' }
  ];

  // Manejar cambios en los dropdowns
  const handleSelectChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };
  
  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (section, field) => {
    // Inicializar la sección si no existe
    const sectionData = data[section] || {};
    
    // Actualizar el valor del checkbox
    const updatedSection = {
      ...sectionData,
      [field]: !sectionData[field]
    };
    
    onChange({
      ...data,
      [section]: updatedSection
    });
  };

  // Manejar cambios en textarea
  const handleTextChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Obtener estado de un campo
  const getStatusClass = (value) => {
    if (!value) return '';
    if (value === 'Normal') return 'status-normal';
    if (value === 'Abnormal') return 'status-abnormal';
    return 'status-nottested';
  };

  // Función para renderizar cada campo del sensory grid
  const renderSensoryField = (label, field, icon) => (
    <div className={`sensory-card ${getStatusClass(data[field])}`}>
      <div className="card-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="card-content">
        <label className="card-label">{label}</label>
        <select 
          value={data[field] || ''}
          onChange={(e) => handleSelectChange(field, e.target.value)}
          className="card-select"
        >
          {normalAbnormalOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {data[field] && (
        <div className="status-indicator">
          {data[field] === 'Normal' && <i className="fas fa-check"></i>}
          {data[field] === 'Abnormal' && <i className="fas fa-exclamation"></i>}
          {data[field] === 'Not Tested' && <i className="fas fa-minus"></i>}
        </div>
      )}
    </div>
  );

  return (
    <div className="sensory-section">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-brain"></i>
          Sensory Assessment
        </h2>
      </div>
      
      <div className="sensory-cards-grid">
        {renderSensoryField('SKIN', 'skin', 'fa-hand-paper')}
        {renderSensoryField('EDEMA', 'edema', 'fa-syringe')}
        {renderSensoryField('VISION', 'vision', 'fa-eye')}
        {renderSensoryField('SENSATION', 'sensation', 'fa-fingerprint')}
        {renderSensoryField('COMMUNICATION', 'communication', 'fa-comments')}
        {renderSensoryField('HEARING', 'hearing', 'fa-assistive-listening-systems')}
        {renderSensoryField('POSTURE', 'posture', 'fa-walking')}
        {renderSensoryField('ACTIVITY TOLERANCE', 'activityTolerance', 'fa-running')}
        
        <div className="sensory-card hand-dominance">
          <div className="card-icon">
            <i className="fas fa-hand-pointer"></i>
          </div>
          <div className="card-content">
            <label className="card-label">HAND DOMINANCE</label>
            <select 
              value={data.handDominance || ''}
              onChange={(e) => handleSelectChange('handDominance', e.target.value)}
              className="card-select"
            >
              {handDominanceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {data.handDominance && (
            <div className="status-indicator hand-dominance-indicator">
              {data.handDominance === 'Right' && <span className="hand-tag">R</span>}
              {data.handDominance === 'Left' && <span className="hand-tag">L</span>}
              {data.handDominance === 'N/A' && <span className="hand-tag">N/A</span>}
            </div>
          )}
        </div>
      </div>
      
      <div className="assessment-panels">
        <div className="assessment-panel cognition">
          <div className="panel-header">
            <div className="panel-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="panel-title">COGNITION</h3>
          </div>
          <div className="panel-content">
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="cognitionOriented" 
                  checked={data.cognition?.oriented || false}
                  onChange={() => handleCheckboxChange('cognition', 'oriented')}
                />
                <label htmlFor="cognitionOriented">
                  <i className="fas fa-check-circle"></i>
                  Oriented
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="cognitionDisoriented" 
                  checked={data.cognition?.disoriented || false}
                  onChange={() => handleCheckboxChange('cognition', 'disoriented')}
                />
                <label htmlFor="cognitionDisoriented">
                  <i className="fas fa-times-circle"></i>
                  Disoriented
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="cognitionConfused" 
                  checked={data.cognition?.confused || false}
                  onChange={() => handleCheckboxChange('cognition', 'confused')}
                />
                <label htmlFor="cognitionConfused">
                  <i className="fas fa-question-circle"></i>
                  Confused
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="cognitionForgetful" 
                  checked={data.cognition?.forgetful || false}
                  onChange={() => handleCheckboxChange('cognition', 'forgetful')}
                />
                <label htmlFor="cognitionForgetful">
                  <i className="fas fa-memory"></i>
                  Forgetful
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="cognitionDepressed" 
                  checked={data.cognition?.depressed || false}
                  onChange={() => handleCheckboxChange('cognition', 'depressed')}
                />
                <label htmlFor="cognitionDepressed">
                  <i className="fas fa-frown"></i>
                  Depressed
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="cognitionSafetyJudgement" 
                  checked={data.cognition?.safetyJudgement || false}
                  onChange={() => handleCheckboxChange('cognition', 'safetyJudgement')}
                />
                <label htmlFor="cognitionSafetyJudgement">
                  <i className="fas fa-shield-alt"></i>
                  Safety Judgement
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="assessment-panel behavior">
          <div className="panel-header">
            <div className="panel-icon">
              <i className="fas fa-user"></i>
            </div>
            <h3 className="panel-title">BEHAVIOR/MENTAL STATUS</h3>
          </div>
          <div className="panel-content">
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="behaviorAlert" 
                  checked={data.behavior?.alert || false}
                  onChange={() => handleCheckboxChange('behavior', 'alert')}
                />
                <label htmlFor="behaviorAlert">
                  <i className="fas fa-bell"></i>
                  Alert
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="behaviorOriented" 
                  checked={data.behavior?.oriented || false}
                  onChange={() => handleCheckboxChange('behavior', 'oriented')}
                />
                <label htmlFor="behaviorOriented">
                  <i className="fas fa-compass"></i>
                  Oriented
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="behaviorCooperative" 
                  checked={data.behavior?.cooperative || false}
                  onChange={() => handleCheckboxChange('behavior', 'cooperative')}
                />
                <label htmlFor="behaviorCooperative">
                  <i className="fas fa-handshake"></i>
                  Cooperative
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="behaviorConfused" 
                  checked={data.behavior?.confused || false}
                  onChange={() => handleCheckboxChange('behavior', 'confused')}
                />
                <label htmlFor="behaviorConfused">
                  <i className="fas fa-random"></i>
                  Confused
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="behaviorImpairedJudgement" 
                  checked={data.behavior?.impairedJudgement || false}
                  onChange={() => handleCheckboxChange('behavior', 'impairedJudgement')}
                />
                <label htmlFor="behaviorImpairedJudgement">
                  <i className="fas fa-balance-scale"></i>
                  Impaired Judgement
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="behaviorSTMDeficits" 
                  checked={data.behavior?.stmDeficits || false}
                  onChange={() => handleCheckboxChange('behavior', 'stmDeficits')}
                />
                <label htmlFor="behaviorSTMDeficits">
                  <i className="fas fa-history"></i>
                  STM Deficits
                </label>
              </div>
              
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  id="behaviorLTMDeficits" 
                  checked={data.behavior?.ltmDeficits || false}
                  onChange={() => handleCheckboxChange('behavior', 'ltmDeficits')}
                />
                <label htmlFor="behaviorLTMDeficits">
                  <i className="fas fa-landmark"></i>
                  LTM Deficits
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="additional-notes-container">
        <div className="notes-header">
          <div className="notes-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <h3 className="notes-title">ADDITIONAL INFORMATION</h3>
        </div>
        <div className="notes-content">
          <textarea 
            value={data.additionalInformation || ''}
            onChange={(e) => handleTextChange('additionalInformation', e.target.value)}
            rows={3}
            placeholder="Add any additional information about sensory status"
          />
        </div>
      </div>
    </div>
  );
};

export default SensorySection;