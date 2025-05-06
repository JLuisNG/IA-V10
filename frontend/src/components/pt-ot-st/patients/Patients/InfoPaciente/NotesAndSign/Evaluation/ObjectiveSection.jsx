// Enhanced ObjectiveSection.jsx
import React, { useState } from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/ObjectiveSection.scss';
import StandardizedTest from './StandardizedTest';

// Importar los componentes de secciones
import CognitiveStatusSection from './ObjectiveSections/CognitiveStatusSection';
import SensorySection from './ObjectiveSections/SensorySection';
import EquipmentSection from './ObjectiveSections/EquipmentSection';
import ProstheticOrthoticSection from './ObjectiveSections/ProstheticOrthoticSection';
import PatientCaregiverEducationSection from './ObjectiveSections/PatientCaregiverEducationSection';
import WoundCareSection from './ObjectiveSections/WoundCareSection';

const ObjectiveSection = ({ data, onChange, onOpenTest, autoSaveMessage }) => {
  // Estados locales
  const [activeTab, setActiveTab] = useState('subjective');
  
  // Manejador para los cambios en los campos
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };
  
  // Manejador para los cambios en subsecciones completas
  const handleSectionChange = (section, sectionData) => {
    onChange({
      ...data,
      [section]: sectionData
    });
  };

  // Definir las pestañas con sus iconos
  const tabs = [
    { id: 'subjective', label: 'Subjective', icon: 'fas fa-comment-alt' },
    { id: 'cognitive', label: 'Cognitive Status', icon: 'fas fa-brain' },
    { id: 'sensory', label: 'Sensory', icon: 'fas fa-eye' },
    { id: 'living', label: 'Living Arrangements', icon: 'fas fa-home' },
    { id: 'mobility', label: 'Gait / Mobility', icon: 'fas fa-walking' },
    { id: 'muscle', label: 'Muscle Strength/ROM', icon: 'fas fa-dumbbell' },
    { id: 'balance', label: 'Balance', icon: 'fas fa-balance-scale' },
    { id: 'equipment', label: 'Equipment', icon: 'fas fa-wheelchair' },
    { id: 'prosthetic', label: 'Prosthetic/Orthotic', icon: 'fas fa-crutch' },
    { id: 'education', label: 'Patient Education', icon: 'fas fa-chalkboard-teacher' },
    { id: 'woundcare', label: 'Wound Care', icon: 'fas fa-band-aid' },
  ];
  
  return (
    <div className="objective-section-container">
      <div className="section-header">
        <h2 className="section-title">Objective</h2>
        <span className={`autosaved-badge ${autoSaveMessage ? 'visible' : ''}`}>
          <i className="fas fa-check-circle"></i>
          {autoSaveMessage || 'AUTOSAVED'}
        </span>
      </div>
      
      <div className="tabs-container">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={tab.icon}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {activeTab === 'subjective' && (
          <div className="subjective-tab">
            <div className="form-section">
              <div className="section-title">
                <h3>
                  <i className="fas fa-comment-alt"></i>
                  Subjective
                </h3>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-file-alt"></i>
                    Patient's Subjective Experience
                  </label>
                  <textarea 
                    value={data.subjective || ''}
                    onChange={(e) => handleChange('subjective', e.target.value)}
                    rows={6}
                    placeholder="Enter patient's subjective experience and complaints"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'cognitive' && (
          <CognitiveStatusSection 
            data={data.cognitive || {}}
            onChange={(sectionData) => handleSectionChange('cognitive', sectionData)}
          />
        )}
        
        {activeTab === 'sensory' && (
          <SensorySection 
            data={data.sensory || {}}
            onChange={(sectionData) => handleSectionChange('sensory', sectionData)}
          />
        )}
        
        {activeTab === 'living' && (
          <div className="living-tab">
            <div className="form-section">
              <div className="section-title">
                <h3>
                  <i className="fas fa-home"></i>
                  Living Arrangements
                </h3>
              </div>
              
              <div className="card-grid two-columns">
                <div className="feature-card">
                  <div className="card-header">
                    <h4>Home Features</h4>
                    <i className="fas fa-house-user"></i>
                  </div>
                  <div className="card-content">
                    <div className="checkbox-grid">
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="clutter" 
                          checked={data.clutter || false}
                          onChange={(e) => handleChange('clutter', e.target.checked)}
                        />
                        <label htmlFor="clutter">Clutter</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="throwRugs" 
                          checked={data.throwRugs || false}
                          onChange={(e) => handleChange('throwRugs', e.target.checked)}
                        />
                        <label htmlFor="throwRugs">Throw Rugs</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="steps" 
                          checked={data.steps || false}
                          onChange={(e) => handleChange('steps', e.target.checked)}
                        />
                        <label htmlFor="steps">Steps</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="stairs" 
                          checked={data.stairs || false}
                          onChange={(e) => handleChange('stairs', e.target.checked)}
                        />
                        <label htmlFor="stairs">Stairs</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="railing" 
                          checked={data.railing || false}
                          onChange={(e) => handleChange('railing', e.target.checked)}
                        />
                        <label htmlFor="railing">Railing</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="card-header">
                    <h4>Housing Type</h4>
                    <i className="fas fa-building"></i>
                  </div>
                  <div className="card-content">
                    <div className="checkbox-grid">
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="house" 
                          checked={data.house || false}
                          onChange={(e) => handleChange('house', e.target.checked)}
                        />
                        <label htmlFor="house">House</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="apartment" 
                          checked={data.apartment || false}
                          onChange={(e) => handleChange('apartment', e.target.checked)}
                        />
                        <label htmlFor="apartment">Apartment</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="mobileHome" 
                          checked={data.mobileHome || false}
                          onChange={(e) => handleChange('mobileHome', e.target.checked)}
                        />
                        <label htmlFor="mobileHome">Mobile Home</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="assistedLiving" 
                          checked={data.assistedLiving || false}
                          onChange={(e) => handleChange('assistedLiving', e.target.checked)}
                        />
                        <label htmlFor="assistedLiving">Assisted Living</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="governmentHousing" 
                          checked={data.governmentHousing || false}
                          onChange={(e) => handleChange('governmentHousing', e.target.checked)}
                        />
                        <label htmlFor="governmentHousing">Government Housing</label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="nursingHome" 
                          checked={data.nursingHome || false}
                          onChange={(e) => handleChange('nursingHome', e.target.checked)}
                        />
                        <label htmlFor="nursingHome">Nursing Home</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-info-circle"></i>
                    Additional Information
                  </label>
                  <textarea 
                    value={data.livingAdditional || ''}
                    onChange={(e) => handleChange('livingAdditional', e.target.value)}
                    rows={4}
                    placeholder="Additional information about living arrangements"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'mobility' && (
          <div className="mobility-tab">
            <div className="form-section">
              <div className="section-title">
                <h3>
                  <i className="fas fa-walking"></i>
                  Gait / Mobility Training
                </h3>
              </div>
              
              <div className="alert-box">
                <div className="checkbox-item highlight">
                  <input 
                    type="checkbox" 
                    id="mobilityNotApplicable" 
                    checked={data.mobilityNotApplicable || false}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      handleChange('mobilityNotApplicable', isChecked);
                      // Clear other fields when "Not Applicable" is checked
                      if (isChecked) {
                        handleChange('levelSurface', false);
                        handleChange('unlevelSurface', false);
                        handleChange('carpetedSurface', false);
                        handleChange('gaitQualities', '');
                        handleChange('stairsCurb', '');
                        handleChange('sixMinuteWalk', '');
                        // Optionally clear standardized test data if needed
                        if (data.standardizedTests?.['Tinetti']) {
                          onChange({
                            ...data,
                            standardizedTests: {
                              ...data.standardizedTests,
                              'Tinetti': { ...data.standardizedTests['Tinetti'], isComplete: false }
                            }
                          });
                        }
                        if (data.standardizedTests?.['Timed Up And Go']) {
                          onChange({
                            ...data,
                            standardizedTests: {
                              ...data.standardizedTests,
                              'Timed Up And Go': { ...data.standardizedTests['Timed Up And Go'], isComplete: false }
                            }
                          });
                        }
                      }
                    }}
                  />
                  <label htmlFor="mobilityNotApplicable">Not Applicable</label>
                  {data.mobilityNotApplicable && (
                    <div className="alert-message">
                      <i className="fas fa-info-circle"></i>
                      <span>All mobility fields will be disabled</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card-grid">
                <div className="feature-card">
                  <div className="card-header">
                    <h4>Surface Types</h4>
                    <i className="fas fa-road"></i>
                  </div>
                  <div className="card-content">
                    <div className="checkbox-grid three-columns">
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="levelSurface" 
                          checked={data.levelSurface || false}
                          onChange={(e) => handleChange('levelSurface', e.target.checked)}
                          disabled={data.mobilityNotApplicable}
                        />
                        <label htmlFor="levelSurface" className={data.mobilityNotApplicable ? 'disabled' : ''}>
                          Level Surface
                        </label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="unlevelSurface" 
                          checked={data.unlevelSurface || false}
                          onChange={(e) => handleChange('unlevelSurface', e.target.checked)}
                          disabled={data.mobilityNotApplicable}
                        />
                        <label htmlFor="unlevelSurface" className={data.mobilityNotApplicable ? 'disabled' : ''}>
                          Unlevel Surface
                        </label>
                      </div>
                      
                      <div className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id="carpetedSurface" 
                          checked={data.carpetedSurface || false}
                          onChange={(e) => handleChange('carpetedSurface', e.target.checked)}
                          disabled={data.mobilityNotApplicable}
                        />
                        <label htmlFor="carpetedSurface" className={data.mobilityNotApplicable ? 'disabled' : ''}>
                          Carpeted Surface
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-row dual-column">
                <div className="form-group">
                  <label className={data.mobilityNotApplicable ? 'disabled' : ''}>
                    <i className="fas fa-shoe-prints"></i>
                    Qualities / Deviations / Postures
                  </label>
                  <textarea 
                    value={data.gaitQualities || ''}
                    onChange={(e) => handleChange('gaitQualities', e.target.value)}
                    rows={4}
                    placeholder="Describe gait qualities, deviations and postures"
                    disabled={data.mobilityNotApplicable}
                  />
                </div>
                
                <div className="form-group">
                  <label className={data.mobilityNotApplicable ? 'disabled' : ''}>
                    <i className="fas fa-angle-double-up"></i>
                    Stairs / Curb
                  </label>
                  <textarea 
                    value={data.stairsCurb || ''}
                    onChange={(e) => handleChange('stairsCurb', e.target.value)}
                    rows={4}
                    placeholder="Notes on stairs and curb navigation"
                    disabled={data.mobilityNotApplicable}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className={data.mobilityNotApplicable ? 'disabled' : ''}>
                    <i className="fas fa-stopwatch"></i>
                    Six Minute Walk
                  </label>
                  <div className="input-with-unit">
                    <input 
                      type="text" 
                      value={data.sixMinuteWalk || ''}
                      onChange={(e) => handleChange('sixMinuteWalk', e.target.value)}
                      placeholder="Enter distance covered"
                      disabled={data.mobilityNotApplicable}
                    />
                    <span className="unit">feet</span>
                  </div>
                </div>
              </div>
              
              <div className="standardized-tests-section">
                <div className="section-title">
                  <h4>Standardized Tests</h4>
                </div>
                <div className="tests-grid two-columns">
                  <StandardizedTest 
                    title="Tinetti" 
                    isComplete={data?.standardizedTests?.['Tinetti']?.isComplete || false}
                    onOpen={() => !data.mobilityNotApplicable && onOpenTest('Tinetti')}
                    status={data.mobilityNotApplicable ? 'Not Required' : undefined}
                    score={data?.standardizedTests?.['Tinetti']?.score}
                  />
                  
                  <StandardizedTest 
                    title="Timed Up And Go" 
                    isComplete={data?.standardizedTests?.['Timed Up And Go']?.isComplete || false}
                    onOpen={() => !data.mobilityNotApplicable && onOpenTest('Timed Up And Go')}
                    status={data.mobilityNotApplicable ? 'Not Required' : undefined}
                    score={data?.standardizedTests?.['Timed Up And Go']?.score}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'muscle' && (
          <div className="muscle-tab">
            <div className="form-section">
              <div className="section-title">
                <h3>
                  <i className="fas fa-dumbbell"></i>
                  Muscle Strength/ROM
                </h3>
              </div>
              
              <div className="card-grid two-columns">
                <div className="feature-card">
                  <div className="card-header">
                    <h4>Upper Extremities (UE)</h4>
                    <i className="fas fa-hand-paper"></i>
                  </div>
                  <div className="card-content">
                    <textarea 
                      value={data.upperExtremities || ''}
                      onChange={(e) => handleChange('upperExtremities', e.target.value)}
                      rows={5}
                      placeholder="Describe upper extremities strength and ROM"
                    />
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="card-header">
                    <h4>Lower Extremities (LE)</h4>
                    <i className="fas fa-socks"></i>
                  </div>
                  <div className="card-content">
                    <textarea 
                      value={data.lowerExtremities || ''}
                      onChange={(e) => handleChange('lowerExtremities', e.target.value)}
                      rows={5}
                      placeholder="Describe lower extremities strength and ROM"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-info-circle"></i>
                    Additional Information
                  </label>
                  <textarea 
                    value={data.muscleAdditional || ''}
                    onChange={(e) => handleChange('muscleAdditional', e.target.value)}
                    rows={3}
                    placeholder="Additional information about muscle strength and ROM"
                  />
                </div>
              </div>
              
              <div className="standardized-tests-section">
                <div className="section-title">
                  <h4>Standardized Tests</h4>
                </div>
                <div className="tests-grid">
                  <StandardizedTest 
                    title="Functional Reach" 
                    isComplete={data?.standardizedTests?.['Functional Reach']?.isComplete || false}
                    onOpen={() => onOpenTest('Functional Reach')}
                    score={data?.standardizedTests?.['Functional Reach']?.score}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'balance' && (
          <div className="balance-tab">
            <div className="form-section">
              <div className="section-title">
                <h3>
                  <i className="fas fa-balance-scale"></i>
                  Balance
                </h3>
              </div>
              
              <div className="scale-reference">
                <button className="info-button" onClick={() => console.log('Show GFP Scale')}>
                  <i className="fas fa-info-circle"></i>
                  <span>Show GFP Scale Reference</span>
                </button>
              </div>
              
              <div className="card-grid two-columns">
                <div className="feature-card">
                  <div className="card-header">
                    <h4>Sitting Balance</h4>
                    <i className="fas fa-chair"></i>
                  </div>
                  <div className="card-content balance-content">
                    <div className="balance-option">
                      <label>Static</label>
                      <select 
                        value={data.sittingStatic || ''}
                        onChange={(e) => handleChange('sittingStatic', e.target.value)}
                        className={data.sittingStatic ? 
                          `score-${data.sittingStatic.charAt(0).toLowerCase()}` : ''}
                      >
                        <option value="">Select an option</option>
                        <option value="Not Tested">Not Tested</option>
                        <option value="P-">P-</option>
                        <option value="P">P</option>
                        <option value="P+">P+</option>
                        <option value="F-">F-</option>
                        <option value="F">F</option>
                        <option value="F+">F+</option>
                        <option value="G-">G-</option>
                        <option value="G">G</option>
                        <option value="G+">G+</option>
                      </select>
                    </div>
                    
                    <div className="balance-option">
                      <label>Dynamic</label>
                      <select 
                        value={data.sittingDynamic || ''}
                        onChange={(e) => handleChange('sittingDynamic', e.target.value)}
                        className={data.sittingDynamic ? 
                          `score-${data.sittingDynamic.charAt(0).toLowerCase()}` : ''}
                      >
                        <option value="">Select an option</option>
                        <option value="Not Tested">Not Tested</option>
                        <option value="P-">P-</option>
                        <option value="P">P</option>
                        <option value="P+">P+</option>
                        <option value="F-">F-</option>
                        <option value="F">F</option>
                        <option value="F+">F+</option>
                        <option value="G-">G-</option>
                        <option value="G">G</option>
                        <option value="G+">G+</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="card-header">
                    <h4>Standing Balance</h4>
                    <i className="fas fa-male"></i>
                  </div>
                  <div className="card-content balance-content">
                    <div className="balance-option">
                      <label>Static</label>
                      <select 
                        value={data.standingStatic || ''}
                        onChange={(e) => handleChange('standingStatic', e.target.value)}
                        className={data.standingStatic ? 
                          `score-${data.standingStatic.charAt(0).toLowerCase()}` : ''}
                      >
                        <option value="">Select an option</option>
                        <option value="Not Tested">Not Tested</option>
                        <option value="P-">P-</option>
                        <option value="P">P</option>
                        <option value="P+">P+</option>
                        <option value="F-">F-</option>
                        <option value="F">F</option>
                        <option value="F+">F+</option>
                        <option value="G-">G-</option>
                        <option value="G">G</option>
                        <option value="G+">G+</option>
                      </select>
                    </div>
                    
                    <div className="balance-option">
                      <label>Dynamic</label>
                      <select 
                        value={data.standingDynamic || ''}
                        onChange={(e) => handleChange('standingDynamic', e.target.value)}
                        className={data.standingDynamic ? 
                          `score-${data.standingDynamic.charAt(0).toLowerCase()}` : ''}
                      >
                        <option value="">Select an option</option>
                        <option value="Not Tested">Not Tested</option>
                        <option value="P-">P-</option>
                        <option value="P">P</option>
                        <option value="P+">P+</option>
                        <option value="F-">F-</option>
                        <option value="F">F</option>
                        <option value="F+">F+</option>
                        <option value="G-">G-</option>
                        <option value="G">G</option>
                        <option value="G+">G+</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-info-circle"></i>
                    Additional Information
                  </label>
                  <textarea 
                    value={data.balanceAdditional || ''}
                    onChange={(e) => handleChange('balanceAdditional', e.target.value)}
                    rows={3}
                    placeholder="Additional information about balance"
                  />
                </div>
              </div>
              
              <div className="standardized-tests-section">
                <div className="section-title">
                  <h4>Standardized Tests</h4>
                </div>
                <div className="tests-grid three-columns">
                  <StandardizedTest 
                    title="Berg" 
                    isComplete={data?.standardizedTests?.['BERG']?.isComplete || false}
                    onOpen={() => onOpenTest('BERG')}
                    score={data?.standardizedTests?.['BERG']?.score}
                  />
                  
                  <StandardizedTest 
                    title="Fall Risk Assessment" 
                    isComplete={data?.standardizedTests?.['Fall Risk Assessment']?.isComplete || false}
                    onOpen={() => onOpenTest('Fall Risk Assessment')}
                    score={data?.standardizedTests?.['Fall Risk Assessment']?.score}
                  />
                  
                  <StandardizedTest 
                    title="Tinetti" 
                    isComplete={data?.standardizedTests?.['Tinetti']?.isComplete || false}
                    onOpen={() => onOpenTest('Tinetti')}
                    score={data?.standardizedTests?.['Tinetti']?.score}
                  />
                  
                  <StandardizedTest 
                    title="Advanced Balance" 
                    isComplete={data?.standardizedTests?.['Advanced Balance']?.isComplete || false}
                    onOpen={() => onOpenTest('Advanced Balance')}
                    score={data?.standardizedTests?.['Advanced Balance']?.score}
                  />
                  
                  <StandardizedTest 
                    title="Four Stage Balance Test" 
                    isComplete={data?.standardizedTests?.['Four Stage Balance Test']?.isComplete || false}
                    onOpen={() => onOpenTest('Four Stage Balance Test')}
                    score={data?.standardizedTests?.['Four Stage Balance Test']?.score}
                  />
                  
                  <StandardizedTest 
                    title="MAHC10" 
                    isComplete={data?.standardizedTests?.['MAHC10']?.isComplete || false}
                    onOpen={() => onOpenTest('MAHC10')}
                    score={data?.standardizedTests?.['MAHC10']?.score}
                  />
                  
                  <StandardizedTest 
                    title="Short Physical Performance Battery" 
                    isComplete={data?.standardizedTests?.['Short Physical Performance Battery']?.isComplete || false}
                    onOpen={() => onOpenTest('Short Physical Performance Battery')}
                    score={data?.standardizedTests?.['Short Physical Performance Battery']?.score}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'equipment' && (
          <EquipmentSection 
            data={data.equipment || {}}
            onChange={(sectionData) => handleSectionChange('equipment', sectionData)}
          />
        )}
        
        {activeTab === 'prosthetic' && (
          <ProstheticOrthoticSection 
            data={data.prostheticOrthotic || {}}
            onChange={(sectionData) => handleSectionChange('prostheticOrthotic', sectionData)}
          />
        )}
        
        {activeTab === 'education' && (
          <PatientCaregiverEducationSection 
            data={data.patientEducation || {}}
            onChange={(sectionData) => handleSectionChange('patientEducation', sectionData)}
          />
        )}
        
        {activeTab === 'woundcare' && (
          <WoundCareSection 
            data={data.woundCare || {}}
            onChange={(sectionData) => handleSectionChange('woundCare', sectionData)}
            onOpenTest={onOpenTest}
          />
        )}
      </div>

</div>
);
};

export default ObjectiveSection;