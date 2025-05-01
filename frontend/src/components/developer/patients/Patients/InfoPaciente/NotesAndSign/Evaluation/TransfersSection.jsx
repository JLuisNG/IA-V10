// Enhanced TransfersSection.jsx
import React, { useState } from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/TransfersSection.scss';
import StandardizedTest from './StandardizedTest';
import KatzModal from './standardizedTests/KatzModal';
import BarthelModal from './standardizedTests/BarthelModal';

const TransfersSection = ({ data, onChange, autoSaveMessage }) => {
  // State to manage modal visibility
  const [isKatzModalOpen, setIsKatzModalOpen] = useState(false);
  const [isBarthelModalOpen, setIsBarthelModalOpen] = useState(false);

  // State to store standardized test data
  const [katzData, setKatzData] = useState(data.katz || { isComplete: false });
  const [barthelData, setBarthelData] = useState(data.barthel || { isComplete: false });

  // State for active accordions
  const [activeAccordions, setActiveAccordions] = useState({
    adls: true,
    transfers: true,
    tests: true
  });

  // Handler for form changes
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  // Handler for Katz modal submission
  const handleKatzSubmit = (katzFormData) => {
    setKatzData(katzFormData);
    onChange({ ...data, katz: katzFormData });
    setIsKatzModalOpen(false);
  };

  // Handler for Barthel modal submission
  const handleBarthelSubmit = (barthelFormData) => {
    setBarthelData(barthelFormData);
    onChange({ ...data, barthel: barthelFormData });
    setIsBarthelModalOpen(false);
  };

  // Handle accordion toggle
  const toggleAccordion = (accordion) => {
    setActiveAccordions(prev => ({
      ...prev,
      [accordion]: !prev[accordion]
    }));
  };

  // Get transfer option data
  const transferOptions = [
    { id: 'sitStand', label: 'Sit / Stand' },
    { id: 'auto', label: 'Auto' },
    { id: 'bedWheelchair', label: 'Bed / Wheelchair' },
    { id: 'rollTurn', label: 'Roll / Turn' },
    { id: 'toilet', label: 'Toilet' },
    { id: 'sitSupine', label: 'Sit / Supine' },
    { id: 'tub', label: 'Tub' },
    { id: 'scootBridge', label: 'Scoot / Bridge' }
  ];

  // Assistant levels for dropdown options
  const assistLevels = [
    { value: "", label: "Select an Option" },
    { value: "Not Tested", label: "Not Tested" },
    { value: "I", label: "I (No Assist)" },
    { value: "MI", label: "MI (Uses Assistive Device)" },
    { value: "S", label: "S (Set up/Supervision)" },
    { value: "SBA", label: "SBA (Stand By Assist)" },
    { value: "MIN", label: "MIN (Requires 0-25% Assist)" },
    { value: "MOD", label: "MOD (Requires 26-50% Assist)" },
    { value: "MAX", label: "MAX (Requires 51-75% Assist)" },
    { value: "TOT", label: "TOT (Requires 76-99% Assist)" },
    { value: "DEP", label: "DEP (100% Assist)" },
    { value: "CGA", label: "CGA (Contact Guard Assist)" }
  ];

  // Get ADL skill options
  const adlSkillsLeft = [
    { id: 'selfFeeding', label: 'Self Feeding', icon: 'fas fa-utensils' },
    { id: 'swallowing', label: 'Swallowing', icon: 'fas fa-glass-water' },
    { id: 'oralHygiene', label: 'Oral Hygiene', icon: 'fas fa-tooth' },
    { id: 'grooming', label: 'Grooming / Hygiene', icon: 'fas fa-shower' },
    { id: 'toileting', label: 'Toileting', icon: 'fas fa-toilet' },
    { id: 'functionalMobility', label: 'Functional Mobility', icon: 'fas fa-walking' }
  ];

  const adlSkillsRight = [
    { id: 'bathing', label: 'Bathing', icon: 'fas fa-bath' },
    { id: 'bedMobility', label: 'Bed Mobility', icon: 'fas fa-bed' },
    { id: 'housework', label: 'Housework / Homemaking', icon: 'fas fa-broom' },
    { id: 'telephoneUse', label: 'Telephone Use', icon: 'fas fa-phone' },
    { id: 'mealPreparation', label: 'Meal Preparation', icon: 'fas fa-blender' },
    { id: 'medicationManagement', label: 'Medication Management', icon: 'fas fa-prescription-bottle-medical' }
  ];

  // Assistance level abbreviations with color mapping
  const assistLevelColors = {
    'NT': '#94a3b8', // Gray
    'DEP': '#ef4444', // Red
    'MAX': '#f97316', // Orange
    'MOD': '#f59e0b', // Amber
    'MIN': '#eab308', // Yellow
    'S': '#84cc16', // Lime
    'SBA': '#10b981', // Green
    'SUP': '#14b8a6', // Teal
    'MI': '#06b6d4', // Cyan
    'I': '#0ea5e9', // Light Blue
    'CGA': '#8b5cf6', // Violet
  };

  return (
    <div className="transfers-section-container">
      {/* Transfers Section */}
      <div className="section-card">
        <div className="section-header" onClick={() => toggleAccordion('transfers')}>
          <div className="section-title">
            <i className="fas fa-exchange-alt"></i>
            <h2>Transfers / Functional Independence</h2>
          </div>
          <div className="section-controls">
            {autoSaveMessage && (
              <span className="autosave-indicator">
                <i className="fas fa-check-circle"></i>
                {autoSaveMessage}
              </span>
            )}
            <button className="toggle-btn">
              <i className={`fas fa-chevron-${activeAccordions.transfers ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        {activeAccordions.transfers && (
          <div className="section-content">
            <div className="transfers-grid">
              {transferOptions.map(option => (
                <div className="transfer-option" key={option.id}>
                  <div className="transfer-option-header">
                    <i className="fas fa-people-carry"></i>
                    <label>{option.label}</label>
                  </div>
                  <select 
                    value={data[option.id] || ''}
                    onChange={(e) => handleChange(option.id, e.target.value)}
                    className={data[option.id] ? `selected level-${data[option.id]}` : ''}
                  >
                    {assistLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            <div className="transfers-legend">
              <div className="legend-title">
                <i className="fas fa-info-circle"></i>
                <span>Assistance Level Guide</span>
              </div>
              <div className="legend-items">
                {Object.entries(assistLevelColors).map(([abbr, color]) => (
                  <div className="legend-item" key={abbr} style={{ '--level-color': color }}>
                    <span className="level-marker">{abbr}</span>
                    <span className="level-desc">
                      {assistLevels.find(l => l.value === abbr)?.label.replace(`${abbr} `, '') || abbr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-row dual-column">
              <div className="form-group">
                <label>
                  <i className="fas fa-wheelchair"></i>
                  Does patient have a wheelchair?
                </label>
                <select 
                  value={data.hasWheelchair || ''}
                  onChange={(e) => handleChange('hasWheelchair', e.target.value)}
                  className={data.hasWheelchair ? 'highlight' : ''}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-clipboard-list"></i>
                  Additional Information
                </label>
                <textarea 
                  value={data.transfersAdditional || ''}
                  onChange={(e) => handleChange('transfersAdditional', e.target.value)}
                  rows={4}
                  placeholder="Additional information about transfers and functional independence..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* ADL Section */}
      <div className="section-card">
        <div className="section-header" onClick={() => toggleAccordion('adls')}>
          <div className="section-title">
            <i className="fas fa-hands-helping"></i>
            <h2>ADL / Self Care Skills</h2>
          </div>
          <div className="section-controls">
            <button className="toggle-btn">
              <i className={`fas fa-chevron-${activeAccordions.adls ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        {activeAccordions.adls && (
          <div className="section-content">
            <div className="adl-grid">
              <div className="adl-column">
                {adlSkillsLeft.map(skill => (
                  <div className="adl-skill" key={skill.id}>
                    <div className="skill-header">
                      <div className="skill-label">
                        <i className={skill.icon}></i>
                        <label>{skill.label}</label>
                      </div>
                      <select 
                        value={data[skill.id] || ''}
                        onChange={(e) => handleChange(skill.id, e.target.value)}
                        className={data[skill.id] ? `selected level-${data[skill.id]}` : ''}
                      >
                        <option value="">Select an option</option>
                        <option value="NT">NT</option>
                        <option value="DEP">DEP</option>
                        <option value="MAX">MAX</option>
                        <option value="MOD">MOD</option>
                        <option value="MIN">MIN</option>
                        <option value="S">S</option>
                        <option value="SBA">SBA</option>
                        <option value="SUP">SUP</option>
                        <option value="MI">MI</option>
                        <option value="I">I</option>
                        <option value="CGA">CGA</option>
                      </select>
                    </div>
                    <textarea 
                      value={data[`${skill.id}Comments`] || ''}
                      onChange={(e) => handleChange(`${skill.id}Comments`, e.target.value)}
                      placeholder="Comments"
                    />
                  </div>
                ))}
              </div>
              
              <div className="adl-column">
                {adlSkillsRight.map(skill => (
                  <div className="adl-skill" key={skill.id}>
                    <div className="skill-header">
                      <div className="skill-label">
                        <i className={skill.icon}></i>
                        <label>{skill.label}</label>
                      </div>
                      <select 
                        value={data[skill.id] || ''}
                        onChange={(e) => handleChange(skill.id, e.target.value)}
                        className={data[skill.id] ? `selected level-${data[skill.id]}` : ''}
                      >
                        <option value="">Select an option</option>
                        <option value="NT">NT</option>
                        <option value="DEP">DEP</option>
                        <option value="MAX">MAX</option>
                        <option value="MOD">MOD</option>
                        <option value="MIN">MIN</option>
                        <option value="S">S</option>
                        <option value="SBA">SBA</option>
                        <option value="SUP">SUP</option>
                        <option value="MI">MI</option>
                        <option value="I">I</option>
                        <option value="CGA">CGA</option>
                      </select>
                    </div>
                    <textarea 
                      value={data[`${skill.id}Comments`] || ''}
                      onChange={(e) => handleChange(`${skill.id}Comments`, e.target.value)}
                      placeholder="Comments"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  <i className="fas fa-comment-medical"></i>
                  Additional Information about ADL / Self Care Skills
                </label>
                <textarea 
                  value={data.adlAdditional || ''}
                  onChange={(e) => handleChange('adlAdditional', e.target.value)}
                  rows={4}
                  placeholder="Additional information about ADL / Self Care Skills..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Standardized Tests Section */}
      <div className="section-card">
        <div className="section-header" onClick={() => toggleAccordion('tests')}>
          <div className="section-title">
            <i className="fas fa-clipboard-check"></i>
            <h2>Standardized Tests</h2>
          </div>
          <div className="section-controls">
            <button className="toggle-btn">
              <i className={`fas fa-chevron-${activeAccordions.tests ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        {activeAccordions.tests && (
          <div className="section-content">
            <div className="adl-tests">
              <div className="standardized-tests-row">
                <StandardizedTest 
                  title="Katz" 
                  isComplete={katzData.isComplete}
                  score={katzData.isComplete ? katzData.totalScore : null}
                  onOpen={() => setIsKatzModalOpen(true)}
                />
                
                <StandardizedTest 
                  title="Barthel" 
                  isComplete={barthelData.isComplete}
                  score={barthelData.isComplete ? barthelData.totalScore : null}
                  onOpen={() => setIsBarthelModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals for Katz and Barthel */}
      <KatzModal 
        isOpen={isKatzModalOpen}
        onClose={(data) => {
          if (!data) setIsKatzModalOpen(false);
          else handleKatzSubmit(data);
        }}
        initialData={katzData}
      />
      
      <BarthelModal 
        isOpen={isBarthelModalOpen}
        onClose={(data) => {
          if (!data) setIsBarthelModalOpen(false);
          else handleBarthelSubmit(data);
        }}
        initialData={barthelData}
      />
    </div>
  );
};

export default TransfersSection;