import React, { useState, useEffect, useRef } from 'react';
import '../../../../styles/developer/Patients/Staffing/StaffProfileModal.scss';

const TPStaffProfileModal = ({ staff, onClose, onEdit, onSave, onLoginAs, editMode }) => {
  const [editedStaff, setEditedStaff] = useState({ ...staff });
  const [activeTab, setActiveTab] = useState('info');
  const [saveLoading, setSaveLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const modalRef = useRef(null);

  // Role display mapping
  const roleDisplays = {
    'administrator': 'Administrador',
    'pt': 'PT - Physical Therapist',
    'pta': 'PTA - Physical Therapist Assistant',
    'ot': 'OT - Occupational Therapist',
    'cota': 'COTA -  Occupational Therapy Assistant',
    'st': 'ST - Speech Therapist',
    'sta': 'STA - Speech Therapy Assistant',
  };

  // Reset edited staff when staff prop changes
  useEffect(() => {
    setEditedStaff({ ...staff });
  }, [staff]);

  // Handle clicking outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStaff({
      ...editedStaff,
      [name]: value
    });
  };

  // Handle document status toggle
  const handleDocumentStatusToggle = (documentName) => {
    if (!editMode) return;
    
    setEditedStaff({
      ...editedStaff,
      documents: {
        ...editedStaff.documents,
        [documentName]: {
          ...editedStaff.documents[documentName],
          status: editedStaff.documents[documentName].status === 'obtained' ? 'pending' : 'obtained'
        }
      }
    });
  };

  // Handle save changes
  const handleSave = () => {
    setSaveLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(editedStaff);
      setSaveLoading(false);
    }, 1500);
  };

  // Handle login as user
  const handleLoginAs = () => {
    setLoginLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      onLoginAs(editedStaff.userName);
      setLoginLoading(false);
    }, 1500);
  };

  // List of documents with display names
  const documentsList = [
    { id: 'covidVaccine', name: 'Proof of COVID Vaccine' },
    { id: 'tbTest', name: 'TB Test proof (PPD/X-Ray)', description: 'PPD Test (valid for 1 year) or X-Ray TB test (valid for 5 years)' },
    { id: 'physicalExam', name: 'Annual Physical Exam Proof' },
    { id: 'liabilityInsurance', name: 'Professional Liability Insurance' },
    { id: 'driversLicense', name: 'Driver\'s License' },
    { id: 'autoInsurance', name: 'Auto Insurance' },
    { id: 'cprCertification', name: 'CPR/BLS Certification' },
    { id: 'businessLicense', name: 'Copy of Business License or EIN' },
  ];

  return (
    <div className="staff-profile-modal-overlay">
      <div className="staff-profile-modal" ref={modalRef}>
        <div className="modal-header">
          <div className="header-left">
            <div className="avatar-container">
              {editedStaff.avatar ? (
                <img src={editedStaff.avatar} alt={`${editedStaff.firstName} ${editedStaff.lastName}`} className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {editedStaff.firstName.charAt(0)}{editedStaff.lastName.charAt(0)}
                </div>
              )}
              <div className={`status-indicator ${editedStaff.status}`}></div>
            </div>
            
            <div className="profile-title">
              {editMode ? (
                <div className="edit-name-container">
                  <input
                    type="text"
                    name="firstName"
                    value={editedStaff.firstName}
                    onChange={handleInputChange}
                    className="edit-name-input"
                    placeholder="Nombre"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={editedStaff.lastName}
                    onChange={handleInputChange}
                    className="edit-name-input"
                    placeholder="Apellido"
                  />
                </div>
              ) : (
                <h2>{editedStaff.firstName} {editedStaff.lastName}</h2>
              )}
              
              <div className="profile-subtitle">
                {editMode ? (
                  <select
                    name="role"
                    value={editedStaff.role}
                    onChange={handleInputChange}
                    className="edit-role-select"
                  >
                    {Object.entries(roleDisplays).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="role-badge">{editedStaff.roleDisplay}</span>
                )}
                
                <span className={`status-badge ${editedStaff.status}`}>
                  {editMode ? (
                    <select
                      name="status"
                      value={editedStaff.status}
                      onChange={handleInputChange}
                      className="edit-status-select"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  ) : (
                    editedStaff.status === 'active' ? 'Activo' : 'Inactivo'
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            {!editMode ? (
              <>
                <button className="edit-profile-btn" onClick={onEdit}>
                  <i className="fas fa-user-edit"></i>
                  <span>Editar Perfil</span>
                </button>
                <button className="login-as-btn" onClick={handleLoginAs} disabled={loginLoading}>
                  {loginLoading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      <span>Iniciando...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i>
                      <span>Iniciar como {editedStaff.userName}</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button className="cancel-edit-btn" onClick={onClose}>
                  <i className="fas fa-times"></i>
                  <span>Cancelar</span>
                </button>
                <button className="save-profile-btn" onClick={handleSave} disabled={saveLoading}>
                  {saveLoading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </>
            )}
            
            <button className="close-modal-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        {/* Tabs for navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="fas fa-user-circle"></i>
            <span>Información Personal</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <i className="fas fa-file-medical"></i>
            <span>Documentos</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <i className="fas fa-user-injured"></i>
            <span>Pacientes Asignados</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <i className="fas fa-chart-line"></i>
            <span>Actividad</span>
          </button>
        </div>
        
        {/* Tab content */}
        <div className="tab-content">
          {/* Personal Information Tab */}
          {activeTab === 'info' && (
            <div className="info-tab-content">
              <div className="info-section">
                <h3 className="section-title">
                  <i className="fas fa-address-card"></i>
                  Información de Contacto
                </h3>
                
                <div className="info-grid">
                  <div className="info-item">
                    <label>Email</label>
                    {editMode ? (
                      <input 
                        type="email" 
                        name="email" 
                        value={editedStaff.email} 
                        onChange={handleInputChange} 
                        className="edit-input"
                      />
                    ) : (
                      <p>{editedStaff.email}</p>
                    )}
                  </div>
                  
                  <div className="info-item">
                    <label>Teléfono</label>
                    {editMode ? (
                      <input 
                        type="tel" 
                        name="phone" 
                        value={editedStaff.phone} 
                        onChange={handleInputChange} 
                        className="edit-input"
                      />
                    ) : (
                      <p>{editedStaff.phone}</p>
                    )}
                  </div>
                  
                  <div className="info-item">
                    <label>Edad</label>
                    {editMode ? (
                      <input 
                        type="number" 
                        name="age" 
                        value={editedStaff.age} 
                        onChange={handleInputChange} 
                        className="edit-input"
                        min="0"
                        max="120"
                      />
                    ) : (
                      <p>{editedStaff.age} años</p>
                    )}
                  </div>
                  
                  <div className="info-item">
                    <label>Dirección</label>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="address" 
                        value={editedStaff.address} 
                        onChange={handleInputChange} 
                        className="edit-input full-width"
                      />
                    ) : (
                      <p>{editedStaff.address}</p>
                    )}
                  </div>
                  
                  <div className="info-item">
                    <label>Código Postal</label>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="zipCode" 
                        value={editedStaff.zipCode} 
                        onChange={handleInputChange} 
                        className="edit-input"
                      />
                    ) : (
                      <p>{editedStaff.zipCode}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <h3 className="section-title">
                  <i className="fas fa-user-lock"></i>
                  Información de Usuario
                </h3>
                
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nombre de Usuario</label>
                    {editMode ? (
                      <input 
                        type="text" 
                        name="userName" 
                        value={editedStaff.userName} 
                        onChange={handleInputChange} 
                        className="edit-input"
                      />
                    ) : (
                      <p>{editedStaff.userName}</p>
                    )}
                  </div>
                  
                  <div className="info-item">
                    <label>Contraseña</label>
                    {editMode ? (
                      <div className="password-container">
                        <input 
                          type="password" 
                          name="password" 
                          defaultValue="********" 
                          className="edit-input"
                        />
                        <button className="reset-password-btn">
                          <i className="fas fa-key"></i> Restablecer
                        </button>
                      </div>
                    ) : (
                      <p>********</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="documents-tab-content">
              <div className="documents-header">
                <h3 className="section-title">
                  <i className="fas fa-file-medical"></i>
                  Documentos Requeridos
                </h3>
                
                <div className="documents-summary">
                  <div className="progress-container">
                    <div className="progress-info">
                      <span>Estado de documentación</span>
                      <span>
                        {Object.values(editedStaff.documents).filter(doc => doc.status === 'obtained').length}/
                        {Object.values(editedStaff.documents).length}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{
                          width: `${(Object.values(editedStaff.documents).filter(doc => doc.status === 'obtained').length / 
                            Object.values(editedStaff.documents).length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="documents-grid">
                {documentsList.map(doc => (
                  <div 
                    key={doc.id} 
                    className={`document-card ${editedStaff.documents[doc.id].status} ${editMode ? 'editable' : ''}`}
                    onClick={() => handleDocumentStatusToggle(doc.id)}
                  >
                    <div className="document-header">
                      <span className="document-icon">
                        <i className="fas fa-file-alt"></i>
                      </span>
                      <span className="document-name">{doc.name}</span>
                      <span className={`document-status ${editedStaff.documents[doc.id].status}`}>
                        {editedStaff.documents[doc.id].status === 'obtained' ? (
                          <><i className="fas fa-check-circle"></i> Obtenido</>
                        ) : (
                          <><i className="fas fa-clock"></i> Pendiente</>
                        )}
                      </span>
                    </div>
                    
                    {doc.description && (
                      <div className="document-description">{doc.description}</div>
                    )}
                    
                    <div className="document-actions">
                      {editedStaff.documents[doc.id].file ? (
                        <div className="file-info">
                          <i className="fas fa-paperclip"></i>
                          <span className="file-name">{editedStaff.documents[doc.id].file}</span>
                          <button className="view-file-btn">
                            <i className="fas fa-eye"></i> Ver
                          </button>
                        </div>
                      ) : (
                        <div className="no-file-info">
                          <i className="fas fa-exclamation-circle"></i>
                          <span>Sin archivo</span>
                          {editMode && (
                            <div className="file-upload">
                              <label htmlFor={`file-${doc.id}`} className="upload-btn">
                                <i className="fas fa-upload"></i> Subir archivo
                              </label>
                              <input
                                type="file"
                                id={`file-${doc.id}`}
                                className="file-input"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="patients-tab-content">
              <div className="patients-header">
                <h3 className="section-title">
                  <i className="fas fa-user-injured"></i>
                  Pacientes Asignados
                </h3>
                <span className="patients-count">{editedStaff.patients} pacientes</span>
              </div>
              
              {editedStaff.patients > 0 ? (
                <div className="patients-list-placeholder">
                  <i className="fas fa-users"></i>
                  <p>Lista de pacientes asignados disponible próximamente</p>
                </div>
              ) : (
                <div className="no-patients">
                  <i className="fas fa-user-slash"></i>
                  <h4>Sin pacientes asignados</h4>
                  <p>Este terapeuta no tiene pacientes asignados actualmente</p>
                  {editedStaff.status === 'active' && (
                    <button className="assign-btn">
                      <i className="fas fa-user-plus"></i> Asignar Pacientes
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="activity-tab-content">
              <div className="activity-header">
                <h3 className="section-title">
                  <i className="fas fa-chart-line"></i>
                  Registro de Actividad
                </h3>
              </div>
              
              <div className="activity-content-placeholder">
                <i className="fas fa-chart-bar"></i>
                <p>Registro de actividad disponible próximamente</p>
                <span className="placeholder-note">Aquí se mostrarán estadísticas de visitas, cumplimiento y otros indicadores de desempeño.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TPStaffProfileModal;