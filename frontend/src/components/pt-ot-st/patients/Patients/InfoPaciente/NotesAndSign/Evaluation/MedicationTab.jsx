// Enhanced MedicationTab.jsx
import React from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/MedicationTab.scss';

const MedicationTab = ({ data, onChange, onOpenMedicationList, autoSaveMessage }) => {
  // Manejador para los cambios en los campos
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };
  
  // Lista de posibles medicamentos frecuentes (solo como ejemplo)
  const commonMedications = [
    { name: 'Lisinopril', category: 'Blood Pressure' },
    { name: 'Metformin', category: 'Diabetes' },
    { name: 'Simvastatin', category: 'Cholesterol' },
    { name: 'Omeprazole', category: 'Heartburn' },
    { name: 'Aspirin', category: 'Pain Relief' },
    { name: 'Gabapentin', category: 'Neuropathic Pain' },
    { name: 'Furosemide', category: 'Diuretic' },
    { name: 'Prednisone', category: 'Anti-inflammatory' }
  ];
  
  // Obtener el número de medicamentos si están disponibles
  const getMedicationCount = () => {
    if (data?.standardizedTests?.['Medication List']?.medications) {
      return data.standardizedTests['Medication List'].medications.length;
    }
    return 0;
  };
  
  return (
    <div className="medication-tab">
      <div className="form-section">
        <div className="section-title">
          <h3>
            <i className="fas fa-pills"></i>
            Medication Information
          </h3>
          <span className={`autosaved-badge ${autoSaveMessage ? 'visible' : ''}`}>
            <i className="fas fa-check-circle"></i>
            {autoSaveMessage || 'AUTOSAVED'}
          </span>
        </div>
        
        <div className="medication-status-card">
          <div className="card-header">
            <h4>Medication Status</h4>
            <i className="fas fa-clipboard-check"></i>
          </div>
          <div className="card-content">
            <div className="radio-group-premium">
              <div className="radio-option-title">Has Medication Changed Since Last Visit?</div>
              <div className="radio-options">
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="medicationChangedNA" 
                    name="medicationChanged"
                    checked={data.medicationChanged === 'N/A'}
                    onChange={() => handleChange('medicationChanged', 'N/A')}
                  />
                  <label htmlFor="medicationChangedNA">
                    <div className="radio-circle"></div>
                    <span>N/A</span>
                  </label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="medicationChangedYes" 
                    name="medicationChanged"
                    checked={data.medicationChanged === 'Yes'}
                    onChange={() => handleChange('medicationChanged', 'Yes')}
                  />
                  <label htmlFor="medicationChangedYes">
                    <div className="radio-circle"></div>
                    <span>Yes</span>
                  </label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="medicationChangedNo" 
                    name="medicationChanged"
                    checked={data.medicationChanged === 'No'}
                    onChange={() => handleChange('medicationChanged', 'No')}
                  />
                  <label htmlFor="medicationChangedNo">
                    <div className="radio-circle"></div>
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
            
            {data.medicationChanged === 'Yes' && (
              <div className="medication-changes-note">
                <div className="note-header">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>Changes Detected</span>
                </div>
                <p>Please update the medication list and add notes about changes below.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card-grid two-columns">
          <div className="feature-card">
            <div className="card-header">
              <h4>Medication List</h4>
              <div className="badge">{getMedicationCount()}</div>
            </div>
            <div className="card-content">
              <div className="medication-list-summary">
                {getMedicationCount() > 0 ? (
                  <div className="medications-preview">
                    <p>
                      <i className="fas fa-check-circle"></i>
                      Medication list has been recorded
                    </p>
                    <button className="view-button" onClick={onOpenMedicationList}>
                      <i className="fas fa-eye"></i>
                      <span>View/Edit List</span>
                    </button>
                  </div>
                ) : (
                  <div className="no-medications">
                    <p>
                      <i className="fas fa-exclamation-triangle"></i>
                      No medications have been recorded yet
                    </p>
                    <button className="add-button" onClick={onOpenMedicationList}>
                      <i className="fas fa-plus"></i>
                      <span>Add Medications</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="card-header">
              <h4>Common Medications</h4>
              <i className="fas fa-star"></i>
            </div>
            <div className="card-content">
              <div className="common-medications-list">
                {commonMedications.map((med, index) => (
                  <div key={index} className="common-med-item">
                    <div className="med-name">{med.name}</div>
                    <div className="med-category">{med.category}</div>
                    <button 
                      className="quick-add"
                      onClick={() => onOpenMedicationList()}
                      title={`Add ${med.name} to medication list`}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>
              <i className="fas fa-clipboard-list"></i>
              Additional Information / Notes
            </label>
            <textarea 
              value={data.medicationAdditional || ''}
              onChange={(e) => handleChange('medicationAdditional', e.target.value)}
              rows={4}
              placeholder="Enter additional information about medications, changes, side effects, etc."
            />
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="medication-list-btn"
            onClick={onOpenMedicationList}
          >
            <i className="fas fa-clipboard-list"></i>
            <span>Open Complete Medication List</span>
          </button>
          
          <button 
            className="medication-print-btn"
            onClick={() => console.log('Print medication list')}
          >
            <i className="fas fa-print"></i>
            <span>Print List</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationTab;