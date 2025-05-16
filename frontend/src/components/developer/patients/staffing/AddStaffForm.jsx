import React, { useState, useEffect } from 'react';
import '../../../../styles/developer/Patients/Staffing/AddStaffForm.scss';

const AddStaffForm = ({ onCancel, onViewAllStaff }) => {
  // Estados para control de carga y guardado
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedStaffName, setSavedStaffName] = useState('');
  const [currentStep, setCurrentStep] = useState('role'); // 'role', 'details'

  // Estado principal del formulario
  const [formData, setFormData] = useState({
    role: '',
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
    agency: 'motive-home-care',
    
    // Campos específicos para agencias
    agencyFields: {
      fullName: '',
      contactNumber: '',
      address: '',
      fax: '',
      branches: [{ name: '', address: '', phone: '' }]
    },
  });

  // Lista de agencies disponibles
  const agencies = [
    {
      id: 'motive-home-care',
      name: 'Motive Home Care',
      address: '1234 Healthcare Blvd, Los Angeles, CA 90001',
      phone: '(323) 555-7890'
    },
    {
      id: 'wellness-therapy',
      name: 'Wellness Therapy Services',
      address: '567 Sunset Blvd, Beverly Hills, CA 90210',
      phone: '(310) 555-1234'
    },
    {
      id: 'healing-hands',
      name: 'Healing Hands Rehabilitation',
      address: '890 Ocean Ave, Long Beach, CA 90802',
      phone: '(562) 555-6789'
    }
  ];

  // Estado para los documentos requeridos
  const [documents, setDocuments] = useState({
    covidVaccine: { status: 'pending', file: null },
    tbTest: { status: 'pending', file: null },
    physicalExam: { status: 'pending', file: null },
    liabilityInsurance: { status: 'pending', file: null },
    driversLicense: { status: 'pending', file: null },
    autoInsurance: { status: 'pending', file: null },
    cprCertification: { status: 'pending', file: null },
    businessLicense: { status: 'pending', file: null },
    // Documento específico para agencias
    contractDocument: { status: 'pending', file: null },
  });

  // Mensajes de carga dinámicos
  const [loadingMessage, setLoadingMessage] = useState('Initializing staff module...');
  const [savingMessage, setSavingMessage] = useState('Processing staff data...');
  
  // Simulación de carga inicial
  useEffect(() => {
    const loadingMessages = [
      { message: 'Connecting to system...', time: 800 },
      { message: 'Loading registration modules...', time: 600 },
      { message: 'Preparing role selection...', time: 400 },
      { message: 'Verifying permissions...', time: 500 },
      { message: 'Ready to register new team member', time: 1000 }
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

  // Handle para cambios en inputs del formulario principal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle para campos específicos de agencia
  const handleAgencyFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      agencyFields: {
        ...formData.agencyFields,
        [name]: value
      }
    });
  };

  // Manejar cambios en sucursales de agencia
  const handleBranchChange = (index, field, value) => {
    const updatedBranches = [...formData.agencyFields.branches];
    updatedBranches[index] = {
      ...updatedBranches[index],
      [field]: value
    };

    setFormData({
      ...formData,
      agencyFields: {
        ...formData.agencyFields,
        branches: updatedBranches
      }
    });
  };

  // Añadir nueva sucursal
  const addNewBranch = () => {
    setFormData({
      ...formData,
      agencyFields: {
        ...formData.agencyFields,
        branches: [
          ...formData.agencyFields.branches,
          { name: '', address: '', phone: '' }
        ]
      }
    });
  };

  // Eliminar sucursal
  const removeBranch = (index) => {
    const updatedBranches = [...formData.agencyFields.branches];
    updatedBranches.splice(index, 1);

    setFormData({
      ...formData,
      agencyFields: {
        ...formData.agencyFields,
        branches: updatedBranches
      }
    });
  };

  // Handle para carga de archivos (documentos)
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

  // Toggle de estado de documentos
  const toggleDocumentStatus = (documentName) => {
    setDocuments({
      ...documents,
      [documentName]: {
        ...documents[documentName],
        status: documents[documentName].status === 'obtained' ? 'pending' : 'obtained'
      }
    });
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      role: '',
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
      agency: 'motive-home-care',
      agencyFields: {
        fullName: '',
        contactNumber: '',
        address: '',
        fax: '',
        branches: [{ name: '', address: '', phone: '' }]
      }
    });
    
    setDocuments({
      covidVaccine: { status: 'pending', file: null },
      tbTest: { status: 'pending', file: null },
      physicalExam: { status: 'pending', file: null },
      liabilityInsurance: { status: 'pending', file: null },
      driversLicense: { status: 'pending', file: null },
      autoInsurance: { status: 'pending', file: null },
      cprCertification: { status: 'pending', file: null },
      businessLicense: { status: 'pending', file: null },
      contractDocument: { status: 'pending', file: null },
    });

    setCurrentStep('role');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedStaffName(`${formData.firstName} ${formData.lastName}`);
  
    try {
      const staffBody = {
        name: `${formData.firstName} ${formData.lastName}`,
        postal_code: formData.zipCode,
        email: formData.email,
        phone: formData.phone,
        alt_phone: formData.altPhone,
        username: formData.userName,
        password: formData.password,
        role: formData.role,
        is_active: true
      };

      if (formData.dob) {
        staffBody.birthday = formData.dob;
      }

      if (formData.gender) {
        staffBody.gender = formData.gender;
      }
  
      const res = await fetch('http://localhost:8000/staff/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffBody)
      });
  
      if (!res.ok) {
        const error = await res.json();
        const readable = error?.detail
          ? Array.isArray(error.detail)
            ? error.detail.map((e) => `${e.loc?.join('.')} → ${e.msg}`).join('\n')
            : error.detail
          : 'Unknown error';
        throw new Error(`Backend validation error:\n${readable}`);
      }
  
      const staffData = await res.json();
      const newStaffId = staffData.id;
  
      for (const key in documents) {
        const doc = documents[key];
        if (doc.file) {
          const formData = new FormData();
          formData.append("file", doc.file);
          formData.append("staff_id", newStaffId);
  
          const uploadRes = await fetch("http://localhost:8000/documents/upload", {
            method: "POST",
            body: formData
          });
  
          if (!uploadRes.ok) {
            const uploadError = await uploadRes.json();
            console.warn(`⚠️ Document '${key}' failed to upload:`, uploadError);
          }
        }
      }
  
      setIsSaving(false);
      setShowSuccessModal(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
      setIsSaving(false);
    }
  };

  // Seleccionar rol y avanzar al siguiente paso
  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role: role
    });
    setCurrentStep('details');
  };

  // Volver a la selección de rol
  const handleBackToRoleSelection = () => {
    setCurrentStep('role');
  };

  // Acciones para el modal de éxito
  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    resetForm();
  };

  const handleViewAllStaff = () => {
    if (onViewAllStaff) {
      onViewAllStaff();
    } else {
      onCancel();
    }
  };

  // Lista de roles disponibles con iconos mejorados
  const roles = [
    { value: 'developer', label: 'Developer', icon: 'fa-laptop-code', description: 'System development and technical support' },
    { value: 'administrator', label: 'Administrator', icon: 'fa-user-shield', description: 'System administration and user management' },
    { value: 'agency', label: 'Agency', icon: 'fa-hospital-alt', description: 'Healthcare provider organization' },
    { value: 'pt', label: 'Physical Therapist (PT)', icon: 'fa-user-md', description: 'Evaluates and treats physical mobility disorders' },
    { value: 'pta', label: 'Physical Therapist Assistant (PTA)', icon: 'fa-user-nurse', description: 'Assists physical therapists in treatment delivery' },
    { value: 'ot', label: 'Occupational Therapist (OT)', icon: 'fa-hand-holding-medical', description: 'Helps patients improve daily living activities' },
    { value: 'cota', label: 'Occupational Therapy Assistant (COTA)', icon: 'fa-hand-holding', description: 'Assists occupational therapists with treatment' },
    { value: 'st', label: 'Speech Therapist (ST)', icon: 'fa-comment-medical', description: 'Evaluates and treats communication disorders' },
    { value: 'sta', label: 'Speech Therapy Assistant (STA)', icon: 'fa-comment-dots', description: 'Assists speech therapists with therapy sessions' },
  ];

  // Lista de documentos requeridos para terapeutas con descripciones mejoradas
  const therapistDocuments = [
    { id: 'covidVaccine', name: 'Proof of COVID Vaccine', icon: 'fa-syringe', description: 'Vaccination record or certificate' },
    { id: 'tbTest', name: 'TB Test proof (PPD/X-Ray)', description: 'PPD Test (valid for 1 year) or X-Ray TB test (valid for 5 years)', icon: 'fa-lungs' },
    { id: 'physicalExam', name: 'Annual Physical Exam Proof', icon: 'fa-stethoscope', description: 'Medical clearance for healthcare duties' },
    { id: 'liabilityInsurance', name: 'Professional Liability Insurance', icon: 'fa-shield-alt', description: 'Malpractice insurance coverage document' },
    { id: 'driversLicense', name: 'Driver\'s License', icon: 'fa-id-card', description: 'Valid state-issued driver\'s license' },
    { id: 'autoInsurance', name: 'Auto Insurance', icon: 'fa-car-alt', description: 'Proof of current auto insurance coverage' },
    { id: 'cprCertification', name: 'CPR/BLS Certification', icon: 'fa-heartbeat', description: 'Current CPR or Basic Life Support certification' },
    { id: 'businessLicense', name: 'Copy of Business License or EIN', icon: 'fa-certificate', description: 'Business license or Employer Identification Number document' },
  ];

  // Documentos para agencias
  const agencyDocuments = [
    { id: 'businessLicense', name: 'Business License', icon: 'fa-building', description: 'Valid business operation license' },
    { id: 'contractDocument', name: 'Contract with TherapySync', icon: 'fa-file-contract', description: 'Signed service agreement' },
    { id: 'liabilityInsurance', name: 'Liability Insurance', icon: 'fa-shield-alt', description: 'Organization liability coverage documentation' },
  ];

  // Determinar qué documentos mostrar según el rol
  const getDocumentsForRole = () => {
    switch(formData.role) {
      case 'agency':
        return agencyDocuments;
      case 'pt':
      case 'pta':
      case 'ot':
      case 'cota':
      case 'st':
      case 'sta':
        return therapistDocuments;
      default:
        return [];
    }
  };

// Verificar si es terapeuta o administrador (para mostrar agencia)
const isTherapistOrAdmin = () => {
  return ['pt', 'pta', 'ot', 'cota', 'st', 'sta', 'administrator'].includes(formData.role);
};

  // Verificar si debe mostrar documentos
  const shouldShowDocuments = () => {
    return ['pt', 'pta', 'ot', 'cota', 'st', 'sta', 'agency'].includes(formData.role);
  };

  // Pantalla de selección de rol
  const renderRoleSelection = () => (
    <div className="role-selection-container">
      <div className="role-selection-header">
        <h2>Select Team Member Role</h2>
        <p>Choose the appropriate role for the new team member to continue with registration</p>
      </div>
      
      <div className="roles-grid">
        {roles.map(role => (
          <div 
            key={role.value} 
            className="role-card"
            onClick={() => handleRoleSelect(role.value)}
          >
            <div className="role-icon">
              <i className={`fas ${role.icon}`}></i>
            </div>
            <h3>{role.label}</h3>
            <p>{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Pantalla de carga
  if (isLoading) {
    return (
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
    );
  }

  // Pantalla de guardado
  if (isSaving) {
    return (
      <div className="loading-screen saving-screen">
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
          <div className="loader-text">{savingMessage}</div>
          <div className="loader-status">TherapySync Pro <span className="status-dot"></span></div>
        </div>
      </div>
    );
  }

  // Calcular porcentaje de documentos completados
  const getCompletedDocsPercentage = () => {
    const docList = getDocumentsForRole();
    if (!docList || docList.length === 0) return 0;
    
    let completed = 0;
    let total = docList.length;
    
    docList.forEach(doc => {
      if (documents[doc.id]?.status === 'obtained') {
        completed++;
      }
    });
    
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="add-staff-container">
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 className="success-title">
              {formData.role === 'agency' ? 'Agency Added Successfully!' : 'Staff Member Added Successfully!'}
            </h2>
            <p className="success-message">
              <strong>{savedStaffName}</strong> has been successfully registered in the system
              {formData.role !== 'agency' && formData.role !== 'developer' && isTherapistOrAdmin() && (
                <> and linked to <strong>{agencies.find(a => a.id === formData.agency)?.name}</strong></>
              )}.
            </p>
            <div className="success-actions">
              <button className="create-another-btn" onClick={handleCreateAnother}>
                <i className="fas fa-plus-circle"></i>
                Create Another {formData.role === 'agency' ? 'Agency' : 'Staff Member'}
              </button>
              <button className="view-all-btn" onClick={handleViewAllStaff}>
                <i className="fas fa-users"></i>
                View All {formData.role === 'agency' ? 'Agencies' : 'Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenedor principal del formulario */}
      <div className="staff-form-container">
        {currentStep === 'role' ? (
          renderRoleSelection()
        ) : (
          <>
            <div className="form-header">
              <div className="form-header-top">
                <button className="back-button" onClick={handleBackToRoleSelection}>
                  <i className="fas fa-arrow-left"></i>
                  <span>Back to Role Selection</span>
                </button>
                <h2>
                  {formData.role === 'agency' 
                    ? 'Add New Agency' 
                    : 'Add New Team Member'}
                </h2>
              </div>
              <p>
                {formData.role === 'agency'
                  ? 'Complete the information to register a new healthcare agency'
                  : `Complete the information to register a new ${roles.find(r => r.value === formData.role)?.label}`}
              </p>
              
              <div className="selected-role-badge">
                <i className={`fas ${roles.find(r => r.value === formData.role)?.icon}`}></i>
                <span>{roles.find(r => r.value === formData.role)?.label}</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="staff-form">
              {/* Formulario específico para agencias */}
              {formData.role === 'agency' ? (
                <>
                  {/* Información de la agencia */}
                  <div className="form-section">
                    <div className="section-header">
                      <i className="fas fa-hospital-alt"></i>
                      <h3>Agency Information</h3>
                    </div>
                    <div className="section-content">
                      <div className="form-group">
                        <label htmlFor="fullName">Agency Full Name</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.agencyFields.fullName}
                          onChange={handleAgencyFieldChange}
                          required
                          placeholder="Enter agency full name"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number</label>
                        <input
                          type="tel"
                          id="contactNumber"
                          name="contactNumber"
                          value={formData.agencyFields.contactNumber}
                          onChange={handleAgencyFieldChange}
                          required
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label htmlFor="address">Main Address</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.agencyFields.address}
                          onChange={handleAgencyFieldChange}
                          required
                          placeholder="Enter main office address"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="fax">Fax Number (Optional)</label>
                        <input
                          type="tel"
                          id="fax"
                          name="fax"
                          value={formData.agencyFields.fax}
                          onChange={handleAgencyFieldChange}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sucursales de la agencia */}
                  <div className="form-section">
                    <div className="section-header">
                      <i className="fas fa-code-branch"></i>
                      <h3>Branches</h3>
                      <p className="section-subtitle">Add all branches for this agency (if applicable)</p>
                    </div>
                      <div className="section-content branches-container">
                        {formData.agencyFields.branches.map((branch, index) => (
                          <div key={index} className="branch-card">
                            <div className="branch-header">
                              <h4>Branch #{index + 1}</h4>
                              {index > 0 && (
                                <button 
                                  type="button" 
                                  className="remove-branch-btn"
                                  onClick={() => removeBranch(index)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              )}
                            </div>
                            
                            <div className="branch-form">
                              <div className="branch-form-row">
                                <div className="form-group full-width">
                                  <label>Branch Name</label>
                                  <input
                                    type="text"
                                    value={branch.name}
                                    onChange={(e) => handleBranchChange(index, 'name', e.target.value)}
                                    placeholder="Branch name or identifier"
                                  />
                                </div>
                              </div>
                              
                              <div className="branch-form-row">
                                <div className="form-group full-width">
                                  <label>Address</label>
                                  <input
                                    type="text"
                                    value={branch.address}
                                    onChange={(e) => handleBranchChange(index, 'address', e.target.value)}
                                    placeholder="Branch address"
                                  />
                                </div>
                              </div>
                              
                              <div className="branch-form-row">
                                <div className="form-group">
                                  <label>Phone</label>
                                  <input
                                    type="tel"
                                    value={branch.phone}
                                    onChange={(e) => handleBranchChange(index, 'phone', e.target.value)}
                                    placeholder="(555) 123-4567"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {formData.agencyFields.branches.length < 15 && (
                        <div className="add-another-branch-container">
                          <button 
                            type="button" 
                            className="add-another-branch-btn"
                            onClick={addNewBranch}
                          >
                            <i className="fas fa-plus-circle"></i>
                            <span>Add Another Branch</span>
                          </button>
                        </div>
                        )}
                      </div>
                  </div>

                  {/* Información de usuario para la agencia */}
                  <div className="form-section">
                    <div className="section-header">
                      <i className="fas fa-lock"></i>
                      <h3>Account Credentials</h3>
                    </div>
                    <div className="section-content">
                      <div className="form-group">
                        <label htmlFor="userName">Username</label>
                        <input
                          type="text"
                          id="userName"
                          name="userName"
                          value={formData.userName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter username for agency login"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter password"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Información personal para roles no-agencia */}
                  <div className="form-section">
                    <div className="section-header">
                      <i className="fas fa-user-circle"></i>
                      <h3>Personal Information</h3>
                    </div>
                    <div className="section-content">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter first name"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter last name"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
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
                        <label htmlFor="gender">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="zipCode">Zip Code</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter zip code"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Información de contacto */}
                  <div className="form-section">
                    <div className="section-header">
                      <i className="fas fa-address-card"></i>
                      <h3>Contact Information</h3>
                    </div>
                    <div className="section-content">
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="email@example.com"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
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
                        <label htmlFor="altPhone">Alternative Phone (Optional)</label>
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
                  
                  {/* Información de usuario */}
                  <div className="form-section">
                    <div className="section-header">
                      <i className="fas fa-lock"></i>
                      <h3>User Information</h3>
                    </div>
                    <div className="section-content">
                      <div className="form-group">
                        <label htmlFor="userName">Username</label>
                        <input
                          type="text"
                          id="userName"
                          name="userName"
                          value={formData.userName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter username"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-container">
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            className="generate-password-btn"
                            onClick={() => {
                              // Generar contraseña aleatoria más segura
                              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
                              let newPassword = '';
                              for (let i = 0; i < 12; i++) {
                                newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
                              }
                              setFormData({
                                ...formData,
                                password: newPassword
                              });
                            }}
                          >
                            <i className="fas fa-key"></i>
                            <span>Generate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
{/* Afiliación de agencia - para terapeutas, administradores Y también para agencias */}
{(isTherapistOrAdmin() || formData.role === 'agency') && (
  <div className="form-section">
    <div className="section-header">
      <i className="fas fa-hospital-user"></i>
      <h3>
        {formData.role === 'agency' ? 'Parent Organization' : 'Agency Affiliation'}
      </h3>
      <p className="section-subtitle">
        {formData.role === 'administrator' 
          ? 'Select the primary agency this administrator will manage' 
          : formData.role === 'agency'
            ? 'Select the parent healthcare organization this agency belongs to (if applicable)'
            : 'Select the healthcare agency this therapist belongs to'
        }
      </p>
    </div>
    <div className="section-content">
      <div className="form-group">
        <label htmlFor="agency">
          {formData.role === 'agency' ? 'Select Parent Organization' : 'Select Host Agency'}
        </label>
        <select
          id="agency"
          name="agency"
          value={formData.agency}
          onChange={handleInputChange}
          required={formData.role !== 'agency'} // No es obligatorio para agencias
        >
          {formData.role === 'agency' && (
            <option value="">-- None (Independent Agency) --</option>
          )}
          {formData.role !== 'agency' && (
            <option value="">-- Select an Agency --</option>
          )}
          {agencies.map((agency) => (
            <option key={agency.id} value={agency.id}>
              {agency.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Mostrar detalles de la agencia seleccionada */}
      {formData.agency && (
        <div className="agency-details-card">
          <h4 className="agency-details-title">
            {formData.role === 'agency' ? 'Parent Organization Details:' : 'Agency Details:'}
          </h4>
          {agencies.filter(a => a.id === formData.agency).map(agency => (
            <div key={agency.id} className="agency-details-info">
              <div className="agency-detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{agency.name}</span>
              </div>
              <div className="agency-detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{agency.address}</span>
              </div>
              <div className="agency-detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{agency.phone}</span>
              </div>
            </div>
          ))}
          <div className="agency-confirmation-box">
            <div className="confirmation-content">
              <i className="fas fa-info-circle"></i> 
              <p>
                {formData.role === 'administrator'
                  ? "Administrator will have primary management rights for this agency's resources and staff."
                  : formData.role === 'agency'
                    ? "This agency will be linked to the parent organization and operate under its guidelines."
                    : "Staff member will be linked to this agency and can only access its patients and resources."
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}
              
{/* Documentos requeridos - solo para terapeutas y agencias */}
{shouldShowDocuments() && (
  <div className="form-section documents-section">
    <div className="section-header">
      <i className="fas fa-file-medical-alt"></i>
      <h3>Required Documents</h3>
      <p className="section-subtitle">Documents are not mandatory to create the profile, but will be necessary for {formData.role === 'agency' ? 'agency operations' : 'patient assignments'}.</p>
    </div>
    
    <div className="section-content documents-grid">
      {getDocumentsForRole().map((doc) => (
        <div key={doc.id} className={`document-card ${documents[doc.id].status}`}>
          <div className="document-header">
            <span className="document-icon">
              <i className={`fas ${doc.icon}`}></i>
            </span>
            <span className="document-name">{doc.name}</span>
            <span 
              className={`document-status ${documents[doc.id].status}`}
              onClick={() => toggleDocumentStatus(doc.id)}
            >
              {documents[doc.id].status === 'obtained' ? (
                <><i className="fas fa-check-circle"></i> Obtained</>
              ) : (
                <><i className="fas fa-clock"></i> Pending</>
              )}
            </span>
          </div>
          
          {doc.description && (
            <div className="document-description">{doc.description}</div>
          )}
          
          <div className="document-actions">
            <div className="file-upload">
              <label htmlFor={`file-${doc.id}`} className="upload-btn">
                <i className="fas fa-cloud-upload-alt"></i> Upload document
              </label>
              <input
                type="file"
                id={`file-${doc.id}`}
                onChange={(e) => handleFileChange(doc.id, e)}
                className="file-input"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </div>
            
            {documents[doc.id].file && (
              <div className="file-info">
                <i className="fas fa-file-pdf"></i>
                <span className="file-name">{documents[doc.id].file.name}</span>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Opción para cargar documento adicional */}
      <div className="document-card add-document">
        <div className="add-document-content">
          <i className="fas fa-plus-circle"></i>
          <span>Add additional document</span>
        </div>
      </div>
    </div>
  </div>
)}
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onCancel}>
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <i className="fas fa-save"></i> Save {formData.role === 'agency' ? 'Agency' : 'Member'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddStaffForm;