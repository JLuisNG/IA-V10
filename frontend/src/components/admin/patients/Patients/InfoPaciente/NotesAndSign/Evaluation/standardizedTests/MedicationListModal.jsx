// Enhanced MedicationListModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/MedicationListModal.scss';

const MedicationListModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    medications: initialData?.medications || [],
    sideEffects: initialData?.sideEffects || 'No',
    knowledgeDeficit: initialData?.knowledgeDeficit || 'No',
    nonCompliance: initialData?.nonCompliance || 'No',
    medicationQuestions: initialData?.medicationQuestions || 'No',
    adverseEffects: initialData?.adverseEffects || 'No',
    problemsExplanation: initialData?.problemsExplanation || '',
    medicationsReconciled: initialData?.medicationsReconciled || 'No',
    allergies: initialData?.allergies || '',
    noKnownAllergies: initialData?.noKnownAllergies || false,
    pharmacy: initialData?.pharmacy || '',
    administeredBy: initialData?.administeredBy || 'Patient',
    isComplete: initialData?.isComplete || false
  });

  // Estado para nuevo medicamento que se está agregando
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    route: '',
    prescriber: '',
    purpose: '',
    startDate: '',
    endDate: ''
  });

  // Estado para edición de medicamento
  const [editingIndex, setEditingIndex] = useState(null);

  // Estado para navegación entre tabs
  const [activeTab, setActiveTab] = useState('medications');

  // Estado para validación
  const [validationErrors, setValidationErrors] = useState({});
  const [medicationErrors, setMedicationErrors] = useState({});

  // Estado para mostrar/ocultar formulario de medicamento
  const [showMedicationForm, setShowMedicationForm] = useState(false);

  // Opciones para selección
  const yesNoOptions = [
    { value: 'No', label: 'No' },
    { value: 'Yes', label: 'Yes' }
  ];

  const administeredByOptions = [
    { value: 'Patient', label: 'Patient' },
    { value: 'Nurse', label: 'Nurse' },
    { value: 'Family', label: 'Family' },
    { value: 'Caregiver', label: 'Caregiver' }
  ];

  const routeOptions = [
    { value: 'Oral', label: 'Oral' },
    { value: 'Topical', label: 'Topical' },
    { value: 'Inhalation', label: 'Inhalation' },
    { value: 'Injection', label: 'Injection' },
    { value: 'Sublingual', label: 'Sublingual' },
    { value: 'Rectal', label: 'Rectal' },
    { value: 'Transdermal', label: 'Transdermal' },
    { value: 'Other', label: 'Other' }
  ];

  const frequencyOptions = [
    { value: 'Once daily', label: 'Once daily' },
    { value: 'Twice daily', label: 'Twice daily' },
    { value: 'Three times daily', label: 'Three times daily' },
    { value: 'Four times daily', label: 'Four times daily' },
    { value: 'Every morning', label: 'Every morning' },
    { value: 'Every evening', label: 'Every evening' },
    { value: 'Every 4 hours', label: 'Every 4 hours' },
    { value: 'Every 6 hours', label: 'Every 6 hours' },
    { value: 'Every 8 hours', label: 'Every 8 hours' },
    { value: 'Every 12 hours', label: 'Every 12 hours' },
    { value: 'As needed', label: 'As needed (PRN)' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Other', label: 'Other' }
  ];

  // Manejar cambios en los campos del formulario principal
  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));

    // Si cambiamos noKnownAllergies a true, limpiamos el campo de alergias
    if (field === 'noKnownAllergies' && value === true) {
      setFormData(prevData => ({
        ...prevData,
        allergies: ''
      }));
    }

    // Limpiar error de validación si existe
    if (validationErrors[field]) {
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Manejar cambios en los campos del nuevo medicamento
  const handleMedicationChange = (field, value) => {
    setNewMedication(prevMed => ({
      ...prevMed,
      [field]: value
    }));

    // Limpiar error de validación si existe
    if (medicationErrors[field]) {
      setMedicationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validar campos del nuevo medicamento
  const validateMedication = () => {
    const errors = {};
    const requiredFields = ['name', 'dosage', 'frequency', 'route'];

    requiredFields.forEach(field => {
      if (!newMedication[field]) errors[field] = true;
    });

    setMedicationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Agregar nuevo medicamento
  const handleAddMedication = () => {
    if (validateMedication()) {
      if (editingIndex !== null) {
        // Actualizar medicamento existente
        const updatedMedications = [...formData.medications];
        updatedMedications[editingIndex] = newMedication;
        
        setFormData(prevData => ({
          ...prevData,
          medications: updatedMedications
        }));
        
        setEditingIndex(null);
      } else {
        // Agregar nuevo medicamento
        setFormData(prevData => ({
          ...prevData,
          medications: [...prevData.medications, newMedication]
        }));
      }

      // Limpiar formulario de medicamento
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        route: '',
        prescriber: '',
        purpose: '',
        startDate: '',
        endDate: ''
      });
      
      // Ocultar formulario
      setShowMedicationForm(false);
    }
  };

  // Cancelar adición/edición de medicamento
  const handleCancelMedication = () => {
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      route: '',
      prescriber: '',
      purpose: '',
      startDate: '',
      endDate: ''
    });
    setEditingIndex(null);
    setMedicationErrors({});
    setShowMedicationForm(false);
  };

  // Editar medicamento existente
  const handleEditMedication = (index) => {
    setNewMedication(formData.medications[index]);
    setEditingIndex(index);
    setShowMedicationForm(true);
  };

  // Eliminar medicamento
  const handleDeleteMedication = (index) => {
    const updatedMedications = formData.medications.filter((_, i) => i !== index);
    
    setFormData(prevData => ({
      ...prevData,
      medications: updatedMedications
    }));

    // Si estábamos editando este medicamento, cancelamos la edición
    if (editingIndex === index) {
      setEditingIndex(null);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        route: '',
        prescriber: '',
        purpose: '',
        startDate: '',
        endDate: ''
      });
      setShowMedicationForm(false);
    }
  };

  // Validar formulario completo antes de enviar
  const validateForm = () => {
    // Para este formulario, no hacemos obligatorio ningún campo específico
    // excepto si el paciente tiene efectos secundarios, conocimientos deficientes, etc.
    const errors = {};

    if (formData.sideEffects === 'Yes' || 
        formData.knowledgeDeficit === 'Yes' || 
        formData.nonCompliance === 'Yes' || 
        formData.medicationQuestions === 'Yes' || 
        formData.adverseEffects === 'Yes') {
      if (!formData.problemsExplanation) {
        errors.problemsExplanation = true;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onClose({
        ...formData,
        isComplete: true
      });
    }
  };

  // Obtener resumen de medicamentos
  const getMedicationSummary = () => {
    return `${formData.medications.length} medication${formData.medications.length !== 1 ? 's' : ''} added`;
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="medication-list-modal-overlay">
      <div className="medication-list-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-pills"></i>
            Medication List
          </h2>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'medications' ? 'active' : ''}`} 
            onClick={() => setActiveTab('medications')}
          >
            <i className="fas fa-pills"></i>
            <span>Medications</span>
            <div className="tab-badge">{formData.medications.length}</div>
          </button>
          <button 
            className={`tab-button ${activeTab === 'assessment' ? 'active' : ''}`} 
            onClick={() => setActiveTab('assessment')}
          >
            <i className="fas fa-clipboard-check"></i>
            <span>Assessment</span>
            {(formData.sideEffects === 'Yes' || 
              formData.knowledgeDeficit === 'Yes' || 
              formData.nonCompliance === 'Yes' || 
              formData.medicationQuestions === 'Yes' || 
              formData.adverseEffects === 'Yes') && (
              <div className="tab-badge alert">!</div>
            )}
          </button>
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} 
            onClick={() => setActiveTab('details')}
          >
            <i className="fas fa-info-circle"></i>
            <span>Details</span>
          </button>
        </div>
        
        <div className="modal-content">
          {activeTab === 'medications' && (
            <div className="medications-tab">
              <div className="section-header">
                <h3>
                  <i className="fas fa-pills"></i>
                  Current Medications
                </h3>
                {formData.medications.length > 0 && (
                  <div className="medication-count">
                    {getMedicationSummary()}
                  </div>
                )}
              </div>
              
              {!showMedicationForm ? (
                <div className="add-medication-container">
                  <button 
                    className="add-medication-btn" 
                    onClick={() => setShowMedicationForm(true)}
                  >
                    <i className="fas fa-plus"></i>
                    Add Medication
                  </button>
                </div>
              ) : (
                <div className="medication-form-container">
                  <div className="form-header">
                    <h4>{editingIndex !== null ? 'Edit Medication' : 'Add New Medication'}</h4>
                    <button className="collapse-form-btn" onClick={handleCancelMedication}>
                      <i className="fas fa-chevron-up"></i>
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <i className="fas fa-prescription-bottle-alt"></i>
                        Medication Name*
                      </label>
                      <input
                        type="text"
                        placeholder="Enter medication name"
                        value={newMedication.name}
                        onChange={(e) => handleMedicationChange('name', e.target.value)}
                        className={medicationErrors.name ? 'error' : ''}
                      />
                      {medicationErrors.name && <div className="error-message">Required</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <i className="fas fa-weight"></i>
                        Dosage*
                      </label>
                      <input
                        type="text"
                        placeholder="Enter dosage"
                        value={newMedication.dosage}
                        onChange={(e) => handleMedicationChange('dosage', e.target.value)}
                        className={medicationErrors.dosage ? 'error' : ''}
                      />
                      {medicationErrors.dosage && <div className="error-message">Required</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <i className="fas fa-clock"></i>
                        Frequency*
                      </label>
                      <select
                        value={newMedication.frequency}
                        onChange={(e) => handleMedicationChange('frequency', e.target.value)}
                        className={medicationErrors.frequency ? 'error' : ''}
                      >
                        <option value="">Select frequency</option>
                        {frequencyOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {medicationErrors.frequency && <div className="error-message">Required</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <i className="fas fa-route"></i>
                        Route*
                      </label>
                      <select
                        value={newMedication.route}
                        onChange={(e) => handleMedicationChange('route', e.target.value)}
                        className={medicationErrors.route ? 'error' : ''}
                      >
                        <option value="">Select route</option>
                        {routeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {medicationErrors.route && <div className="error-message">Required</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <i className="fas fa-user-md"></i>
                        Prescriber
                      </label>
                      <input
                        type="text"
                        placeholder="Prescribing doctor"
                        value={newMedication.prescriber}
                        onChange={(e) => handleMedicationChange('prescriber', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <i className="fas fa-info-circle"></i>
                        Purpose
                      </label>
                      <input
                        type="text"
                        placeholder="Purpose of medication"
                        value={newMedication.purpose}
                        onChange={(e) => handleMedicationChange('purpose', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <i className="fas fa-calendar-plus"></i>
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={newMedication.startDate}
                        onChange={(e) => handleMedicationChange('startDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <i className="fas fa-calendar-minus"></i>
                        End Date
                      </label>
                      <input
                        type="date"
                        value={newMedication.endDate}
                        onChange={(e) => handleMedicationChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="cancel-action-btn"
                      onClick={handleCancelMedication}
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                    <button 
                      className="save-action-btn"
                      onClick={handleAddMedication}
                    >
                      <i className="fas fa-check"></i>
                      {editingIndex !== null ? 'Update Medication' : 'Add Medication'}
                    </button>
                  </div>
                </div>
              )}
              
              {formData.medications.length > 0 ? (
                <div className="medications-table-container">
                  <div className="medications-table">
                    <div className="table-header">
                      <div className="column-name">Medication</div>
                      <div className="column-dosage">Dosage</div>
                      <div className="column-frequency">Frequency</div>
                      <div className="column-route">Route</div>
                      <div className="column-actions">Actions</div>
                    </div>
                    <div className="table-body">
                      {formData.medications.map((medication, index) => (
                        <div className="table-row" key={index}>
                          <div className="column-name">
                            <div className="med-name">{medication.name}</div>
                            {medication.purpose && (
                              <div className="med-purpose">{medication.purpose}</div>
                            )}
                          </div>
                          <div className="column-dosage">{medication.dosage}</div>
                          <div className="column-frequency">{medication.frequency}</div>
                          <div className="column-route">{medication.route}</div>
                          <div className="column-actions">
                            <button 
                              className="edit-btn"
                              onClick={() => handleEditMedication(index)}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteMedication(index)}
                              title="Delete"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-medications">
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="fas fa-prescription-bottle"></i>
                    </div>
                    <h4>No Medications Added</h4>
                    <p>Click "Add Medication" to begin creating the medication list.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'assessment' && (
            <div className="assessment-tab">
              <div className="section-header">
                <h3>
                  <i className="fas fa-clipboard-check"></i>
                  Medication Assessment
                </h3>
              </div>
              
              <div className="assessment-questions">
                <div className="question-card">
                  <div className="question-header">
                    <span className="question-letter">A</span>
                    <h4>Side Effects</h4>
                  </div>
                  <div className="question-content">
                    <p>Does the patient report experiencing 1 or more significant side effects to current drug regimen?</p>
                    <div className="option-buttons">
                      {yesNoOptions.map(option => (
                        <button
                          key={option.value}
                          className={`option-btn ${option.value.toLowerCase()} ${formData.sideEffects === option.value ? 'selected' : ''}`}
                          onClick={() => handleChange('sideEffects', option.value)}
                        >
                          {option.value === 'Yes' ? (
                            <i className="fas fa-check-circle"></i>
                          ) : (
                            <i className="fas fa-times-circle"></i>
                          )}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="question-card">
                  <div className="question-header">
                    <span className="question-letter">B</span>
                    <h4>Knowledge Deficit</h4>
                  </div>
                  <div className="question-content">
                    <p>Does the patient and/or caregiver demonstrate a knowledge deficit related to current medication use?</p>
                    <div className="option-buttons">
                      {yesNoOptions.map(option => (
                        <button
                          key={option.value}
                          className={`option-btn ${option.value.toLowerCase()} ${formData.knowledgeDeficit === option.value ? 'selected' : ''}`}
                          onClick={() => handleChange('knowledgeDeficit', option.value)}
                        >
                          {option.value === 'Yes' ? (
                            <i className="fas fa-check-circle"></i>
                          ) : (
                            <i className="fas fa-times-circle"></i>
                          )}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="question-card">
                  <div className="question-header">
                    <span className="question-letter">C</span>
                    <h4>Noncompliance</h4>
                  </div>
                  <div className="question-content">
                    <p>Does the patient demonstrate noncompliance with medication use, as prescribed by physician?</p>
                    <div className="option-buttons">
                      {yesNoOptions.map(option => (
                        <button
                          key={option.value}
                          className={`option-btn ${option.value.toLowerCase()} ${formData.nonCompliance === option.value ? 'selected' : ''}`}
                          onClick={() => handleChange('nonCompliance', option.value)}
                        >
                          {option.value === 'Yes' ? (
                            <i className="fas fa-check-circle"></i>
                          ) : (
                            <i className="fas fa-times-circle"></i>
                          )}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="question-card">
                  <div className="question-header">
                    <span className="question-letter">D</span>
                    <h4>Medication Questions</h4>
                  </div>
                  <div className="question-content">
                    <p>Does the patient and/or caregiver have any questions related to current medications including purpose, dosage, or administration?</p>
                    <div className="option-buttons">
                      {yesNoOptions.map(option => (
                        <button
                          key={option.value}
                          className={`option-btn ${option.value.toLowerCase()} ${formData.medicationQuestions === option.value ? 'selected' : ''}`}
                          onClick={() => handleChange('medicationQuestions', option.value)}
                        >
                          {option.value === 'Yes' ? (
                            <i className="fas fa-check-circle"></i>
                          ) : (
                            <i className="fas fa-times-circle"></i>
                          )}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="question-card">
                  <div className="question-header">
                    <span className="question-letter">E</span>
                    <h4>Potential Adverse Effects</h4>
                  </div>
                  <div className="question-content">
                    <p>Have potential adverse effects, significant drug interactions, duplicate ineffective drug therapy and potential contraindications been identified?</p>
                    <div className="option-buttons">
                      {yesNoOptions.map(option => (
                        <button
                          key={option.value}
                          className={`option-btn ${option.value.toLowerCase()} ${formData.adverseEffects === option.value ? 'selected' : ''}`}
                          onClick={() => handleChange('adverseEffects', option.value)}
                        >
                          {option.value === 'Yes' ? (
                            <i className="fas fa-check-circle"></i>
                          ) : (
                            <i className="fas fa-times-circle"></i>
                          )}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="question-card problems-explanation">
                  <div className="question-header">
                    <span className="question-letter">F</span>
                    <h4>Problems & Actions</h4>
                  </div>
                  <div className="question-content">
                    <p>Describe problems and action for "Yes" responses:</p>
                    <textarea
                      value={formData.problemsExplanation}
                      onChange={(e) => handleChange('problemsExplanation', e.target.value)}
                      placeholder="Describe any identified problems and actions taken"
                      rows={4}
                      className={validationErrors.problemsExplanation ? 'error' : ''}
                    />
                    {validationErrors.problemsExplanation && (
                      <div className="error-message">Required for "Yes" responses</div>
                    )}
                  </div>
                </div>
                
                <div className="question-card">
                  <div className="question-header">
                    <span className="question-letter">G</span>
                    <h4>Medications Reconciled</h4>
                  </div>
                  <div className="question-content">
                    <p>Medications reconciled (per agency policy):</p>
                    <div className="option-buttons">
                      {yesNoOptions.map(option => (
                        <button
                          key={option.value}
                          className={`option-btn ${option.value.toLowerCase()} ${formData.medicationsReconciled === option.value ? 'selected' : ''}`}
                          onClick={() => handleChange('medicationsReconciled', option.value)}
                        >
                          {option.value === 'Yes' ? (
                            <i className="fas fa-check-circle"></i>
                          ) : (
                            <i className="fas fa-times-circle"></i>
                          )}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="details-tab">
              <div className="section-header">
                <h3>
                  <i className="fas fa-info-circle"></i>
                  Additional Information
                </h3>
              </div>
              
              <div className="details-content">
                <div className="detail-card allergies">
                  <div className="card-header">
                    <div className="header-icon">
                      <i className="fas fa-allergies"></i>
                    </div>
                    <h4>Allergies</h4>
                  </div>
                  <div className="card-content">
                    <div className="allergies-field">
                      <input
                        type="text"
                        placeholder="List medication allergies"
                        value={formData.allergies}
                        onChange={(e) => handleChange('allergies', e.target.value)}
                        disabled={formData.noKnownAllergies}
                      />
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id="noKnownAllergies"
                          checked={formData.noKnownAllergies}
                          onChange={(e) => handleChange('noKnownAllergies', e.target.checked)}
                        />
                        <label htmlFor="noKnownAllergies">No Known Drug Allergies</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-card pharmacy">
                  <div className="card-header">
                    <div className="header-icon">
                      <i className="fas fa-mortar-pestle"></i>
                    </div>
                    <h4>Pharmacy</h4>
                  </div>
                  <div className="card-content">
                    <input
                      type="text"
                      placeholder="Pharmacy name and contact information"
                      value={formData.pharmacy}
                      onChange={(e) => handleChange('pharmacy', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="detail-card administration">
                  <div className="card-header">
                    <div className="header-icon">
                      <i className="fas fa-user-nurse"></i>
                    </div>
                    <h4>Administration</h4>
                  </div>
                  <div className="card-content">
                    <label>Medications administered by:</label>
                    <select
                      value={formData.administeredBy}
                      onChange={(e) => handleChange('administeredBy', e.target.value)}
                    >
                      {administeredByOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            <i className="fas fa-check"></i>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationListModal;