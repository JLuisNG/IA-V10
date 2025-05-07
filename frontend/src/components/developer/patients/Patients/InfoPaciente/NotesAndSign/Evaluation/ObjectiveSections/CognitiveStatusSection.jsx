// Enhanced CognitiveStatusSection.jsx
import React, { useState } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/ObjectiveSections/CognitiveStatusSection.scss';

const CognitiveStatusSection = ({ data, onChange }) => {
  // Estado para tooltips
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  // Opciones para los dropdowns
  const statusOptions = [
    { value: '', label: 'Select an option' },
    { value: 'Intact', label: 'Intact' },
    { value: 'Impaired', label: 'Impaired' },
    { value: 'Functional', label: 'Functional' }
  ];
  
  const yesNoOptions = [
    { value: '', label: 'Select an option' },
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ];

  // Definir información para tooltips
  const tooltips = {
    orientation: "Indicates if the patient is oriented to person (knows who they are), place (knows where they are), and time (knows when it is).",
    shortTerm: "Ability to recall recent information, typically within minutes to hours.",
    longTerm: "Ability to recall information from the distant past, such as childhood memories or important life events.",
    attention: "Ability to focus on specific stimuli and remain concentrated on tasks.",
    auditoryComp: "Ability to understand verbal communication.",
    visualComp: "Ability to understand visual information or instructions.",
    selfControl: "Ability to regulate emotions and behavior appropriately.",
    sequencing: "Ability to arrange and execute steps in a logical order.",
    problemSolving: "Ability to identify problems and develop solutions.",
    coping: "Ability to deal with stressful situations and adapt to challenges.",
    expressNeeds: "Ability to communicate needs, wants, and concerns effectively.",
    safety: "Judgment related to safety awareness and recognizing dangerous situations.",
    initiation: "Ability to start activities independently without prompting."
  };

  // Manejar cambios en los checkboxes de orientación
  const handleOrientationChange = (field) => {
    const updatedOrientation = {
      ...data.orientation,
      [field]: !data.orientation?.[field]
    };
    
    onChange({
      ...data,
      orientation: updatedOrientation
    });
  };

  // Manejar cambios en textarea
  const handleTextChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Manejar cambios en los dropdowns
  const handleSelectChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Mostrar tooltip
  const showTooltip = (tooltipId) => {
    setActiveTooltip(tooltipId);
  };

  // Ocultar tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return (
    <div className="cognitive-status-section">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-brain"></i>
          Cognitive Status / Comprehension
        </h2>
        <div className="section-actions">
          <button 
            className="info-button"
            onClick={() => window.alert('This section assesses the patient\'s cognitive abilities and comprehension skills.')}
          >
            <i className="fas fa-info-circle"></i>
            <span>Info</span>
          </button>
        </div>
      </div>
      
      <div className="section-card">
        <div className="orientation-container">
          <div className="orientation-header">
            <h3>
              <i className="fas fa-compass"></i>
              Orientation
            </h3>
            <div className="tooltip-container">
              <button 
                className="tooltip-trigger"
                onMouseEnter={() => showTooltip('orientation')}
                onMouseLeave={hideTooltip}
              >
                <i className="fas fa-question-circle"></i>
              </button>
              {activeTooltip === 'orientation' && (
                <div className="tooltip-content">
                  <p>{tooltips.orientation}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="orientation-checkboxes">
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="orientedPerson" 
                checked={data.orientation?.person || false}
                onChange={() => handleOrientationChange('person')}
              />
              <label htmlFor="orientedPerson">
                <span className="checkbox-icon">
                  <i className="fas fa-user"></i>
                </span>
                Person
              </label>
            </div>
            
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="orientedPlace" 
                checked={data.orientation?.place || false}
                onChange={() => handleOrientationChange('place')}
              />
              <label htmlFor="orientedPlace">
                <span className="checkbox-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                Place
              </label>
            </div>
            
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="orientedTime" 
                checked={data.orientation?.time || false}
                onChange={() => handleOrientationChange('time')}
              />
              <label htmlFor="orientedTime">
                <span className="checkbox-icon">
                  <i className="fas fa-clock"></i>
                </span>
                Time
              </label>
            </div>
          </div>
        </div>
        
        <div className="reason-container">
          <h3>
            <i className="fas fa-clipboard-list"></i>
            Reason for Therapy
          </h3>
          <textarea 
            value={data.reasonForTherapy || ''}
            onChange={(e) => handleTextChange('reasonForTherapy', e.target.value)}
            rows={3}
            placeholder="Explain the reason for therapy"
          />
        </div>
      </div>
      
      <div className="cognitive-grid">
        <div className="cognitive-column">
          <div className="cognitive-card memory-card">
            <div className="card-header">
              <h3>
                <i className="fas fa-memory"></i>
                Memory
              </h3>
            </div>
            <div className="card-content">
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="shortTermMemory">Short Term Memory</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('shortTerm')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'shortTerm' && (
                      <div className="tooltip-content">
                        <p>{tooltips.shortTerm}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="shortTermMemory"
                  value={data.shortTermMemory || ''}
                  onChange={(e) => handleSelectChange('shortTermMemory', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="longTermMemory">Long Term Memory</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('longTerm')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'longTerm' && (
                      <div className="tooltip-content">
                        <p>{tooltips.longTerm}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="longTermMemory"
                  value={data.longTermMemory || ''}
                  onChange={(e) => handleSelectChange('longTermMemory', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="cognitive-card comprehension-card">
            <div className="card-header">
              <h3>
                <i className="fas fa-comment-alt"></i>
                Comprehension
              </h3>
            </div>
            <div className="card-content">
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="auditoryComprehension">Auditory Comprehension</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('auditoryComp')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'auditoryComp' && (
                      <div className="tooltip-content">
                        <p>{tooltips.auditoryComp}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="auditoryComprehension"
                  value={data.auditoryComprehension || ''}
                  onChange={(e) => handleSelectChange('auditoryComprehension', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="visualComprehension">Visual Comprehension</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('visualComp')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'visualComp' && (
                      <div className="tooltip-content">
                        <p>{tooltips.visualComp}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="visualComprehension"
                  value={data.visualComprehension || ''}
                  onChange={(e) => handleSelectChange('visualComprehension', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="selfControl">Self-Control</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('selfControl')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'selfControl' && (
                      <div className="tooltip-content">
                        <p>{tooltips.selfControl}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="selfControl"
                  value={data.selfControl || ''}
                  onChange={(e) => handleSelectChange('selfControl', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="cognitive-column">
          <div className="cognitive-card attention-card">
            <div className="card-header">
              <h3>
                <i className="fas fa-bullseye"></i>
                Attention & Processing
              </h3>
            </div>
            <div className="card-content">
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="attention">Attention / Concentration</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('attention')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'attention' && (
                      <div className="tooltip-content">
                        <p>{tooltips.attention}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="attention"
                  value={data.attention || ''}
                  onChange={(e) => handleSelectChange('attention', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="sequencing">Sequencing</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('sequencing')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'sequencing' && (
                      <div className="tooltip-content">
                        <p>{tooltips.sequencing}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="sequencing"
                  value={data.sequencing || ''}
                  onChange={(e) => handleSelectChange('sequencing', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="cognitive-card skills-card">
            <div className="card-header">
              <h3>
                <i className="fas fa-cogs"></i>
                Skills & Abilities
              </h3>
            </div>
            <div className="card-content">
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="problemSolving">Problem Solving</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('problemSolving')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'problemSolving' && (
                      <div className="tooltip-content">
                        <p>{tooltips.problemSolving}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="problemSolving"
                  value={data.problemSolving || ''}
                  onChange={(e) => handleSelectChange('problemSolving', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="copingSkills">Coping Skills</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('coping')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'coping' && (
                      <div className="tooltip-content">
                        <p>{tooltips.coping}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="copingSkills"
                  value={data.copingSkills || ''}
                  onChange={(e) => handleSelectChange('copingSkills', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="expressNeeds">Able to Express Needs</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('expressNeeds')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'expressNeeds' && (
                      <div className="tooltip-content">
                        <p>{tooltips.expressNeeds}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="expressNeeds"
                  value={data.expressNeeds || ''}
                  onChange={(e) => handleSelectChange('expressNeeds', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="cognitive-column">
          <div className="cognitive-card safety-card">
            <div className="card-header">
              <h3>
                <i className="fas fa-shield-alt"></i>
                Safety & Independence
              </h3>
            </div>
            <div className="card-content">
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="safetyJudgement">Safety / Judgement</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('safety')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'safety' && (
                      <div className="tooltip-content">
                        <p>{tooltips.safety}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="safetyJudgement"
                  value={data.safetyJudgement || ''}
                  onChange={(e) => handleSelectChange('safetyJudgement', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="initiationOfActivity">Initiation of Activity</label>
                  <div className="tooltip-container">
                    <button 
                      className="tooltip-trigger"
                      onMouseEnter={() => showTooltip('initiation')}
                      onMouseLeave={hideTooltip}
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                    {activeTooltip === 'initiation' && (
                      <div className="tooltip-content">
                        <p>{tooltips.initiation}</p>
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  id="initiationOfActivity"
                  value={data.initiationOfActivity || ''}
                  onChange={(e) => handleSelectChange('initiationOfActivity', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <div className="field-header">
                  <label htmlFor="hardOfHearing">Hard of Hearing</label>
                </div>
                <select 
                  id="hardOfHearing"
                  value={data.hardOfHearing || ''}
                  onChange={(e) => handleSelectChange('hardOfHearing', e.target.value)}
                >
                  {yesNoOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="additional-info-container">
        <h3>
          <i className="fas fa-sticky-note"></i>
          Additional Information
        </h3>
        <textarea 
          value={data.additionalInformation || ''}
          onChange={(e) => handleTextChange('additionalInformation', e.target.value)}
          rows={4}
          placeholder="Add any additional information about cognitive status"
        />
      </div>
    </div>
  );
};

export default CognitiveStatusSection;