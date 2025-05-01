import React, { useState, useEffect } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/MedicalInfoComponent.scss';

const MedicalInfoComponent = ({ patient, onUpdateMedicalInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [medicalData, setMedicalData] = useState({
    weight: 0,
    nursingDiagnosis: '',
    pmh: '',
    wbs: '',
    clinicalGrouping: '',
    homebound: ''
  });
  
  // Initialize with patient data
  useEffect(() => {
    if (patient?.medicalInfo) {
      setMedicalData({
        weight: patient.medicalInfo.weight || 0,
        nursingDiagnosis: patient.medicalInfo.nursingDiagnosis || '',
        pmh: patient.medicalInfo.pmh || '',
        wbs: patient.medicalInfo.wbs || '',
        clinicalGrouping: patient.medicalInfo.clinicalGrouping || '',
        homebound: patient.medicalInfo.homebound || ''
      });
    }
  }, [patient]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedicalData({
      ...medicalData,
      [name]: value
    });
  };
  
  // Handle weight input specifically
  const handleWeightChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setMedicalData({
      ...medicalData,
      weight: value
    });
  };
  
  // Save changes
  const handleSaveChanges = () => {
    // Show saving animation
    setIsSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Notify parent component
      if (onUpdateMedicalInfo) {
        onUpdateMedicalInfo(medicalData);
      }
      
      // Hide saving animation and exit edit mode
      setIsSaving(false);
      setIsEditing(false);
    }, 1500); // 1.5 seconds for animation to be visible
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    // Restore original data
    if (patient?.medicalInfo) {
      setMedicalData({
        weight: patient.medicalInfo.weight || 0,
        nursingDiagnosis: patient.medicalInfo.nursingDiagnosis || '',
        pmh: patient.medicalInfo.pmh || '',
        wbs: patient.medicalInfo.wbs || '',
        clinicalGrouping: patient.medicalInfo.clinicalGrouping || '',
        homebound: patient.medicalInfo.homebound || ''
      });
    } else {
      // Reset to defaults if no patient data
      setMedicalData({
        weight: 0,
        nursingDiagnosis: '',
        pmh: '',
        wbs: '',
        clinicalGrouping: '',
        homebound: ''
      });
    }
    
    // Exit edit mode
    setIsEditing(false);
  };

  // Get icon for clinical grouping
  const getClinicalGroupingIcon = (grouping) => {
    if (!grouping) return 'fas fa-layer-group';
    
    if (grouping.includes('Cardiac') || grouping.includes('Circulatory')) 
      return 'fas fa-heartbeat';
    if (grouping.includes('Respiratory')) 
      return 'fas fa-lungs';
    if (grouping.includes('Neuro')) 
      return 'fas fa-brain';
    if (grouping.includes('Wound')) 
      return 'fas fa-band-aid';
    if (grouping.includes('Musculoskeletal')) 
      return 'fas fa-bone';
    if (grouping.includes('Behavioral')) 
      return 'fas fa-brain';
    if (grouping.includes('Endocrine')) 
      return 'fas fa-pills';
    
    return 'fas fa-layer-group';
  };
  
  // Get color for clinical grouping
  const getClinicalGroupingColor = (grouping) => {
    if (!grouping) return '#64748b';
    
    if (grouping.includes('Cardiac') || grouping.includes('Circulatory')) 
      return '#ef4444';
    if (grouping.includes('Respiratory')) 
      return '#3b82f6';
    if (grouping.includes('Neuro')) 
      return '#8b5cf6';
    if (grouping.includes('Wound')) 
      return '#f97316';
    if (grouping.includes('Musculoskeletal')) 
      return '#14b8a6';
    if (grouping.includes('Behavioral')) 
      return '#a855f7';
    if (grouping.includes('Endocrine')) 
      return '#eab308';
    
    return '#64748b';
  };
  
  return (
    <div className="medical-info-component">
      <div className="card-header">
        <div className="header-title">
          <i className="fas fa-notes-medical"></i>
          <h3>Medical Information</h3>
        </div>
        <div className="header-actions">
          {!isEditing && (
            <button 
              className="edit-button" 
              onClick={() => setIsEditing(true)}
              title="Edit medical information"
            >
              <i className="fas fa-edit"></i>
            </button>
          )}
        </div>
      </div>
      
      <div className="card-body">
        {isEditing ? (
          // Edit form
          <div className="edit-form">
            <h4>
              <i className="fas fa-pen-fancy"></i>
              Edit Medical Information
            </h4>
            
            {isSaving && (
              <div className="saving-overlay">
                <div className="saving-animation">
                  <div className="loader">
                    <svg className="circular" viewBox="25 25 50 50">
                      <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="3" strokeMiterlimit="10"/>
                    </svg>
                  </div>
                  <div className="saving-text">
                    <span>Saving</span>
                    <span className="dots"><span>.</span><span>.</span><span>.</span></span>
                  </div>
                </div>
                <div className="backdrop-blur"></div>
              </div>
            )}
            
            <div className="form-row">
              <div className="form-group weight-input">
                <label>
                  <i className="fas fa-weight"></i>
                  Weight (lbs)
                </label>
                <div className="input-with-icon">
                  <input 
                    type="number" 
                    name="weight"
                    value={medicalData.weight} 
                    onChange={handleWeightChange}
                    min="0"
                    step="0.1"
                  />
                  <span className="unit-indicator">lbs</span>
                </div>
              </div>
              
              <div className="form-group clinical-group-select">
                <label>
                  <i className="fas fa-layer-group"></i>
                  Clinical Grouping
                </label>
                <select 
                  name="clinicalGrouping"
                  value={medicalData.clinicalGrouping} 
                  onChange={handleInputChange}
                >
    <option value="">Select Wound Bed Status</option>
    <option value="No wounds present">No wounds present</option>
    <option value="Wound healing well, no signs of infection">Wound healing well, no signs of infection</option>
    <option value="Clean wound, granulating tissue present">Clean wound, granulating tissue present</option>
    <option value="Red, inflamed wound edges">Red, inflamed wound edges</option>
    <option value="Wound with serous drainage">Wound with serous drainage</option>
    <option value="Wound with purulent drainage">Wound with purulent drainage</option>
    <option value="Wound with necrotic tissue">Wound with necrotic tissue</option>
    <option value="Pressure ulcer, Stage 1">Pressure ulcer, Stage 1</option>
    <option value="Pressure ulcer, Stage 2">Pressure ulcer, Stage 2</option>
    <option value="Pressure ulcer, Stage 3">Pressure ulcer, Stage 3</option>
    <option value="Pressure ulcer, Stage 4">Pressure ulcer, Stage 4</option>
    <option value="Unstageable pressure ulcer">Unstageable pressure ulcer</option>
    <option value="Deep tissue pressure injury">Deep tissue pressure injury</option>
    <option value="Venous ulcer">Venous ulcer</option>
    <option value="Arterial ulcer">Arterial ulcer</option>
    <option value="Diabetic ulcer">Diabetic ulcer</option>
    <option value="Surgical wound, well-healing">Surgical wound, well-healing</option>
    <option value="Surgical wound, dehiscence present">Surgical wound, dehiscence present</option>
    <option value="Abrasion/Skin tear">Abrasion/Skin tear</option>
    <option value="To be assessed">To be assessed</option>
    <option value="TBD">TBD</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-heartbeat"></i>
                Nursing Diagnosis
              </label>
              <textarea 
                name="nursingDiagnosis"
                value={medicalData.nursingDiagnosis} 
                onChange={handleInputChange}
                placeholder="Enter nursing diagnosis"
                rows="2"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-history"></i>
                PMH (Past Medical History)
              </label>
              <textarea 
                name="pmh"
                value={medicalData.pmh} 
                onChange={handleInputChange}
                placeholder="Enter past medical history"
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-band-aid"></i>
                WBS (Wound Bed Status)
              </label>
              <textarea 
                name="wbs"
                value={medicalData.wbs} 
                onChange={handleInputChange}
                placeholder="Enter wound bed status"
                rows="2"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-home"></i>
                Homebound Status
              </label>
              <textarea 
                name="homebound"
                value={medicalData.homebound} 
                onChange={handleInputChange}
                placeholder="Enter homebound reason"
                rows="2"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button className="cancel-btn" onClick={handleCancelEdit}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                <i className="fas fa-check"></i>
                Save Changes
              </button>
            </div>

          </div>
        ) : (
          // View mode
          <div className="medical-info-display">
            <div className="info-section weight-section">
              <div className="info-icon">
                <i className="fas fa-weight"></i>
              </div>
              <div className="info-content">
                <div className="info-label">Weight</div>
                <div className="info-value weight-value">
                  {medicalData.weight > 0 ? (
                    <div className="data-display">
                      <span className="primary-data">{medicalData.weight}</span>
                      <span className="secondary-data">lbs</span>
                    </div>
                  ) : (
                    <span className="no-data">Not recorded</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="info-content">
                <div className="info-label">Nursing Diagnosis</div>
                <div className="info-value">
                  {medicalData.nursingDiagnosis ? (
                    <div className="data-box nursing-diagnosis">
                      {medicalData.nursingDiagnosis}
                    </div>
                  ) : (
                    <span className="no-data">Not available</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-history"></i>
              </div>
              <div className="info-content">
                <div className="info-label">PMH (Past Medical History)</div>
                <div className="info-value">
                  {medicalData.pmh ? (
                    <div className="data-box pmh-data">
                      {medicalData.pmh}
                    </div>
                  ) : (
                    <span className="no-data">Not available</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-band-aid"></i>
              </div>
              <div className="info-content">
                <div className="info-label">WBS (Wound Bed Status)</div>
                <div className="info-value">
                  {medicalData.wbs ? (
                    <div className="data-box wbs-data">
                      {medicalData.wbs}
                    </div>
                  ) : (
                    <span className="no-data">Not available</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="info-section clinical-section">
              <div className="info-icon" style={{ 
                color: getClinicalGroupingColor(medicalData.clinicalGrouping),
                background: `${getClinicalGroupingColor(medicalData.clinicalGrouping)}15` 
              }}>
                <i className={getClinicalGroupingIcon(medicalData.clinicalGrouping)}></i>
              </div>
              <div className="info-content">
                <div className="info-label">Clinical Grouping</div>
                <div className="info-value">
                  {medicalData.clinicalGrouping ? (
                    <div className="clinical-grouping-badge" style={{ 
                      color: getClinicalGroupingColor(medicalData.clinicalGrouping),
                      borderColor: `${getClinicalGroupingColor(medicalData.clinicalGrouping)}50`,
                      background: `${getClinicalGroupingColor(medicalData.clinicalGrouping)}10`
                    }}>
                      <i className={getClinicalGroupingIcon(medicalData.clinicalGrouping)}></i>
                      <span>{medicalData.clinicalGrouping}</span>
                    </div>
                  ) : (
                    <span className="no-data">Not assigned</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="info-section">
              <div className="info-icon">
                <i className="fas fa-home"></i>
              </div>
              <div className="info-content">
                <div className="info-label">Homebound Status</div>
                <div className="info-value">
                  {medicalData.homebound ? (
                    <div className="data-box homebound-data">
                      {medicalData.homebound}
                    </div>
                  ) : (
                    <span className="no-data">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalInfoComponent;