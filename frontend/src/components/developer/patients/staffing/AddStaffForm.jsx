  import React, { useState } from 'react';
import '../../../../styles/developer/Patients/Staffing/AddStaffForm.scss';

const DevAddStaffForm = ({ onCancel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    zipCode: '',
    email: '',
    phone: '',
    altPhone: '',
    userName: '',
    password: '',
    role: '',
  });

  const [documents, setDocuments] = useState({
    covidVaccine: { status: 'pending', file: null },
    tbTest: { status: 'pending', file: null },
    physicalExam: { status: 'pending', file: null },
    liabilityInsurance: { status: 'pending', file: null },
    driversLicense: { status: 'pending', file: null },
    autoInsurance: { status: 'pending', file: null },
    cprCertification: { status: 'pending', file: null },
    businessLicense: { status: 'pending', file: null },
  });

  // Simulación de carga del formulario con mensajes dinámicos
  const [loadingMessage, setLoadingMessage] = useState('Iniciando módulo de personal...');
  
  React.useEffect(() => {
    const loadingMessages = [
      { message: 'Conectando con el sistema...', time: 800 },
      { message: 'Cargando módulos de documentación...', time: 600 },
      { message: 'Preparando formulario de registro...', time: 400 },
      { message: 'Verificando plantillas de documentos...', time: 500 },
      { message: 'Listo para registrar nuevo terapeuta', time: 1000 }
    ];
    
    loadingMessages.forEach((item, index) => {
      setTimeout(() => {
        setLoadingMessage(item.message);
        if (index === loadingMessages.length - 1) {
          setTimeout(() => setIsLoading(false), 600);
        }
      }, item.time);
    });
    
    return () => {
      loadingMessages.forEach((_, index) => clearTimeout(index));
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (documentName, e) => {
    if (e.target.files[0]) {
      setDocuments({
        ...documents,
        [documentName]: {
          status: 'obtained',
          file: e.target.files[0]
        }
      });
    }
  };

  const toggleDocumentStatus = (documentName) => {
    setDocuments({
      ...documents,
      [documentName]: {
        ...documents[documentName],
        status: documents[documentName].status === 'obtained' ? 'pending' : 'obtained'
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementar lógica para enviar los datos
    console.log('Form data:', formData);
    console.log('Documents:', documents);
    // Aquí iría la lógica para enviar al servidor
  };

  const roles = [
    { value: 'agency', label: 'Agency' },
    { value: 'support', label: 'Support' },
    { value: 'developer', label: 'Developer' },
    { value: 'administrator', label: 'Administrador' },
    { value: 'pt', label: 'PT - Physical Therapist' },
    { value: 'pta', label: 'PTA - Physical Therapist Assistant' },
    { value: 'ot', label: 'OT - Occupational Therapist' },
    { value: 'cota', label: 'COTA - Occupational Therapy Assistant' },
    { value: 'st', label: 'ST - Speech Therapist' },
    { value: 'sta', label: 'STA - Speech Therapy Assistant' },
  ];

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
    <div className="add-staff-container">
      {isLoading ? (
        <div className="loading-screen">
          <div className="loader-container">
            <div className="loader-hologram">
              <div className="hologram-ring"></div>
              <div className="hologram-circle"></div>
              <div className="hologram-bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
            <div className="loader-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
            <div className="loader-text">{loadingMessage}</div>
            <div className="loader-status">TherapySync Pro <span className="status-dot"></span></div>
          </div>
        </div>
      ) : (
        <div className="staff-form-container">
          <div className="form-header">
            <h2>Añadir Nuevo Miembro al Equipo</h2>
            <p>Complete la información para registrar un nuevo terapeuta o miembro del personal</p>
          </div>
          
          <form onSubmit={handleSubmit} className="staff-form">
            {/* Sección de Información Personal */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-user-circle"></i>
                <h3>Información Personal</h3>
              </div>
              <div className="section-content">
                <div className="form-group">
                  <label htmlFor="firstName">Nombre</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese el nombre"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Apellido</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese el apellido"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dob">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Género</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar género</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Código Postal</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese código postal"
                  />
                </div>
              </div>
            </div>
            
            {/* Sección de Contacto */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-address-book"></i>
                <h3>Información de Contacto</h3>
              </div>
              <div className="section-content">
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="altPhone">Teléfono Alternativo (Opcional)</label>
                  <input
                    type="tel"
                    id="altPhone"
                    name="altPhone"
                    value={formData.altPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
            
            {/* Sección de Usuario */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-user-lock"></i>
                <h3>Información de Usuario</h3>
              </div>
              <div className="section-content">
                <div className="form-group">
                  <label htmlFor="userName">Nombre de Usuario</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese nombre de usuario"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese contraseña"
                  />
                </div>
              </div>
            </div>
            
            {/* Sección de Roles */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-user-tag"></i>
                <h3>Rol Profesional</h3>
              </div>
              <div className="section-content role-selection">
                <div className="form-group">
                  <label htmlFor="role">Seleccionar Rol</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar un rol</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Sección de Documentos */}
            <div className="form-section documents-section">
              <div className="section-header">
                <i className="fas fa-file-medical"></i>
                <h3>Documentos Requeridos</h3>
                <p className="section-subtitle">Los documentos no son obligatorios para crear el perfil, pero serán necesarios para asignación de pacientes.</p>
              </div>
              
              <div className="section-content documents-grid">
                {documentsList.map((doc) => (
                  <div key={doc.id} className={`document-card ${documents[doc.id].status}`}>
                    <div className="document-header">
                      <span className="document-icon">
                        <i className="fas fa-file-alt"></i>
                      </span>
                      <span className="document-name">{doc.name}</span>
                      <span 
                        className={`document-status ${documents[doc.id].status}`}
                        onClick={() => toggleDocumentStatus(doc.id)}
                      >
                        {documents[doc.id].status === 'obtained' ? (
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
                      <div className="file-upload">
                        <label htmlFor={`file-${doc.id}`} className="upload-btn">
                          <i className="fas fa-upload"></i> Cargar documento
                        </label>
                        <input
                          type="file"
                          id={`file-${doc.id}`}
                          onChange={(e) => handleFileChange(doc.id, e)}
                          className="file-input"
                        />
                      </div>
                      
                      {documents[doc.id].file && (
                        <div className="file-info">
                          <i className="fas fa-paperclip"></i>
                          <span className="file-name">{documents[doc.id].file.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Opción para subir documento adicional */}
                <div className="document-card add-document">
                  <div className="add-document-content">
                    <i className="fas fa-plus-circle"></i>
                    <span>Añadir documento adicional</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onCancel}>
                <i className="fas fa-times"></i> Cancelar
              </button>
              <button type="submit" className="submit-btn">
                <i className="fas fa-save"></i> Guardar miembro
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DevAddStaffForm;