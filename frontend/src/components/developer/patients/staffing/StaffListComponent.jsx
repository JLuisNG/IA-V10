import React, { useState, useEffect } from 'react';
import '../../../../styles/developer/Patients/Staffing/StaffEditComponent.scss';

// Plantilla para un nuevo miembro del personal
const STAFF_TEMPLATE = {
  personalInfo: {
    firstName: '',
    lastName: '',
    dob: '',
    gender: ''
  },
  contactInfo: {
    email: '',
    phone: '',
    alternatePhone: '',
    zipCode: '',
    address: ''
  },
  userInfo: {
    userName: '',
    password: ''
  },
  professionalInfo: {
    role: ''
  },
  documents: {
    covidVaccine: { status: 'pending', file: null },
    tbTest: { status: 'pending', file: null },
    physicalExam: { status: 'pending', file: null },
    liabilityInsurance: { status: 'pending', file: null },
    driversLicense: { status: 'pending', file: null },
    autoInsurance: { status: 'pending', file: null },
    cprCertification: { status: 'pending', file: null },
    businessLicense: { status: 'pending', file: null }
  },
  status: 'active' // Estado por defecto para nuevos miembros
};

const DevStaffEditComponent = ({ onBackToOptions }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Conectando con la base de datos...');
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [isCreating, setIsCreating] = useState(false); // Nuevo estado para distinguir entre creación y edición

  // Simulación de carga con mensajes dinámicos
  useEffect(() => {
    setIsLoading(true);
    setLoadingMessage('Conectando con la base de datos...');
    
    const loadingMessages = [
      { message: 'Verificando permisos de usuario...', time: 800 },
      { message: 'Recuperando lista de personal...', time: 800 },
      { message: 'Cargando documentos asociados...', time: 500 },
      { message: 'Preparando interfaz de edición...', time: 1500 },
      { message: 'Optimizando rendimiento...', time: 1000 }
    ];
    
    const timeouts = [];
    
    loadingMessages.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setLoadingMessage(item.message);
        if (index === loadingMessages.length - 1) {
          const finalTimeout = setTimeout(() => {
            setIsLoading(false);
            fetchStaffData();
          }, 800);
          timeouts.push(finalTimeout);
        }
      }, item.time);
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Obtener datos del personal desde la API
  const fetchStaffData = async () => {
    try {
      const response = await fetch('https://api.therapysync.com/v1/staff', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token-here'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del personal');
      }

      const data = await response.json();
      // Ajustamos los datos para que coincidan con la estructura esperada por el componente
      const adjustedData = data.map(staff => ({
        id: staff.id,
        firstName: staff.personalInfo.firstName,
        lastName: staff.personalInfo.lastName,
        dob: staff.personalInfo.dob,
        gender: staff.personalInfo.gender,
        email: staff.contactInfo.email,
        phone: staff.contactInfo.phone,
        alternatePhone: staff.contactInfo.alternatePhone,
        zipCode: staff.contactInfo.zipCode,
        address: staff.contactInfo.address,
        userName: staff.userInfo.userName,
        password: staff.userInfo.password,
        role: staff.professionalInfo.role,
        roleDisplay: roles.find(r => r.value === staff.professionalInfo.role)?.label || staff.professionalInfo.role,
        status: staff.status,
        documents: staff.documents
      }));
      setStaffList(adjustedData);
      setFilteredStaff(adjustedData);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      alert('Hubo un error al cargar los datos del personal. Por favor, intenta de nuevo.');
      setStaffList([]);
      setFilteredStaff([]);
    }
  };

  // Filtrar y ordenar personal
  useEffect(() => {
    let filtered = [...staffList];
    
    if (searchTerm) {
      filtered = filtered.filter(staff => 
        `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm)
      );
    }
    
    if (filterRole !== 'all') {
      filtered = filtered.filter(staff => staff.role === filterRole);
    }
    
    setFilteredStaff(filtered);
  }, [staffList, searchTerm, filterRole]);

  // Roles disponibles
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

  // Lista de documentos requeridos
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

  // Abrir modal para editar un miembro existente
  const handleOpenProfile = (staff) => {
    setSelectedStaff(staff);
    setShowProfileModal(true);
    setEditMode(true);
    setIsCreating(false);
    setActiveTab('info');
  };

  // Abrir modal para crear un nuevo miembro
  const handleOpenCreateProfile = () => {
    const newStaff = {
      ...STAFF_TEMPLATE,
      id: `temp-${Date.now()}`, // ID temporal para evitar errores de clave única
      firstName: STAFF_TEMPLATE.personalInfo.firstName,
      lastName: STAFF_TEMPLATE.personalInfo.lastName,
      dob: STAFF_TEMPLATE.personalInfo.dob,
      gender: STAFF_TEMPLATE.personalInfo.gender,
      email: STAFF_TEMPLATE.contactInfo.email,
      phone: STAFF_TEMPLATE.contactInfo.phone,
      alternatePhone: STAFF_TEMPLATE.contactInfo.alternatePhone,
      zipCode: STAFF_TEMPLATE.contactInfo.zipCode,
      address: STAFF_TEMPLATE.contactInfo.address,
      userName: STAFF_TEMPLATE.userInfo.userName,
      password: STAFF_TEMPLATE.userInfo.password,
      role: STAFF_TEMPLATE.professionalInfo.role,
      roleDisplay: '',
      status: STAFF_TEMPLATE.status,
      documents: STAFF_TEMPLATE.documents
    };
    setSelectedStaff(newStaff);
    setShowProfileModal(true);
    setEditMode(true);
    setIsCreating(true);
    setActiveTab('info');
  };

  // Cerrar el modal
  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedStaff(null);
    setEditMode(false);
    setIsCreating(false);
  };

  // Guardar cambios (crear o actualizar)
  const handleSaveProfile = async (updatedStaff) => {
    if (isCreating) {
      // Modo creación: enviar a la API
      try {
        const staffToCreate = {
          personalInfo: {
            firstName: updatedStaff.firstName,
            lastName: updatedStaff.lastName,
            dob: updatedStaff.dob,
            gender: updatedStaff.gender
          },
          contactInfo: {
            email: updatedStaff.email,
            phone: updatedStaff.phone,
            alternatePhone: updatedStaff.alternatePhone,
            zipCode: updatedStaff.zipCode,
            address: updatedStaff.address
          },
          userInfo: {
            userName: updatedStaff.userName,
            password: updatedStaff.password
          },
          professionalInfo: {
            role: updatedStaff.role
          },
          documents: updatedStaff.documents,
          status: updatedStaff.status
        };

        const response = await fetch('https://api.therapysync.com/v1/staff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-auth-token-here'
          },
          body: JSON.stringify(staffToCreate)
        });

        if (!response.ok) {
          throw new Error('Error al crear el nuevo miembro del personal');
        }

        const newStaff = await response.json();
        // Ajustamos el nuevo miembro para que coincida con la estructura de staffList
        const adjustedNewStaff = {
          id: newStaff.id,
          firstName: newStaff.personalInfo.firstName,
          lastName: newStaff.personalInfo.lastName,
          dob: newStaff.personalInfo.dob,
          gender: newStaff.personalInfo.gender,
          email: newStaff.contactInfo.email,
          phone: newStaff.contactInfo.phone,
          alternatePhone: newStaff.contactInfo.alternatePhone,
          zipCode: newStaff.contactInfo.zipCode,
          address: newStaff.contactInfo.address,
          userName: newStaff.userInfo.userName,
          password: newStaff.userInfo.password,
          role: newStaff.professionalInfo.role,
          roleDisplay: roles.find(r => r.value === newStaff.professionalInfo.role)?.label || newStaff.professionalInfo.role,
          status: newStaff.status,
          documents: newStaff.documents
        };

        setStaffList([...staffList, adjustedNewStaff]);
        handleCloseProfile();
        alert('Nuevo miembro del personal creado exitosamente.');
      } catch (error) {
        console.error('Error creating staff:', error);
        alert('Hubo un error al crear el nuevo miembro del personal. Por favor, intenta de nuevo.');
      }
    } else {
      // Modo edición: actualizar la lista localmente
      const updatedStaffList = staffList.map(item => 
        item.id === updatedStaff.id ? updatedStaff : item
      );
      setStaffList(updatedStaffList);
      handleCloseProfile();
    }
  };

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };

  const handleResetPassword = (staffId) => {
    alert(`Contraseña restablecida para el usuario con ID ${staffId}. Un correo ha sido enviado con las instrucciones.`);
  };

  const handleDocumentStatusToggle = (staffId, documentId) => {
    const updatedStaffList = staffList.map(staff => {
      if (staff.id === staffId) {
        return {
          ...staff,
          documents: {
            ...staff.documents,
            [documentId]: {
              ...staff.documents[documentId],
              status: staff.documents[documentId].status === 'obtained' ? 'pending' : 'obtained'
            }
          }
        };
      }
      return staff;
    });
    
    setStaffList(updatedStaffList);
    
    if (selectedStaff && selectedStaff.id === staffId) {
      setSelectedStaff(updatedStaffList.find(staff => staff.id === staffId));
    }
  };

  const handleDocumentViewClick = (documentName, fileName) => {
    alert(`Visualizando documento: ${documentName} - ${fileName}`);
  };

  const handleDocumentUpload = (staffId, documentId, e) => {
    if (e.target.files[0]) {
      const updatedStaffList = staffList.map(staff => {
        if (staff.id === staffId) {
          return {
            ...staff,
            documents: {
              ...staff.documents,
              [documentId]: {
                status: 'obtained',
                file: e.target.files[0].name
              }
            }
          };
        }
        return staff;
      });
      
      setStaffList(updatedStaffList);
      
      if (selectedStaff && selectedStaff.id === staffId) {
        setSelectedStaff(updatedStaffList.find(staff => staff.id === staffId));
      }
      
      alert(`Documento ${documentId} actualizado para ID ${staffId}`);
    }
  };

  const handleUpdateStaffData = (field, value, nestedField = null) => {
    if (nestedField) {
      // Actualizar campos anidados (como personalInfo.firstName)
      setSelectedStaff(prev => ({
        ...prev,
        [nestedField]: {
          ...prev[nestedField],
          [field]: value
        }
      }));
    } else {
      // Actualizar campos directos
      setSelectedStaff(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Calcular porcentaje de documentos completados
  const getCompletedDocsPercentage = (documents) => {
    const total = Object.keys(documents).length;
    const completed = Object.values(documents).filter(doc => doc.status === 'obtained').length;
    return Math.round((completed / total) * 100);
  };

  // Renderizado de la pantalla de carga
  if (isLoading) {
    return (
      <div className="staff-edit-loading">
        <div className="loading-container">
          <div className="loading-hologram">
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
          
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
          
          <div className="loading-text">{loadingMessage}</div>
          <div className="loading-status">TherapySync Pro <span className="status-dot"></span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-edit-container">
      {/* Cabecera mejorada */}
      <div className="staff-edit-header">
        <div className="header-content">
          <button className="back-button" onClick={onBackToOptions}>
            <i className="fas fa-arrow-left"></i>
            <span>Volver</span>
          </button>
          <div className="header-title-container">
            <h2>Edición de Personal</h2>
            <p>Gestiona y actualiza la información del personal terapéutico</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="create-btn" onClick={handleOpenCreateProfile}>
            <i className="fas fa-plus"></i>
            <span>Crear Nuevo</span>
          </button>
          <button className="refresh-btn" onClick={() => {
            setIsLoading(true);
            setLoadingMessage('Actualizando datos...');
            setTimeout(() => {
              fetchStaffData();
              setIsLoading(false);
            }, 2000);
          }}>
            <i className="fas fa-sync-alt"></i> 
            <span>Actualizar</span>
          </button>
          <button className="export-btn">
            <i className="fas fa-file-export"></i> 
            <span>Exportar</span>
          </button>
        </div>
      </div>
      
      {/* Barra de filtros y búsqueda mejorada */}
      <div className="search-filter-container">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Buscar por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          <div className="role-filter">
            <span className="filter-label">Filtrar por rol:</span>
            <div className="role-options">
              <button 
                className={`role-option ${filterRole === 'all' ? 'active' : ''}`}
                onClick={() => setFilterRole('all')}
              >
                <span>Todos</span>
              </button>
              
              {roles.map(role => (
                <button 
                  key={role.value}
                  className={`role-option ${filterRole === role.value ? 'active' : ''}`}
                  onClick={() => setFilterRole(role.value)}
                >
                  <span>{role.value.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenedor de tarjetas de personal rediseñadas */}
      <div className="staff-cards-container">
        {filteredStaff.length > 0 ? (
          filteredStaff.map(staff => (
            <div 
              key={staff.id} 
              className={`staff-card ${staff.status}`}
              onClick={() => handleOpenProfile(staff)}
            >
              <div className="staff-card-header">
                <div className="avatar-status">
                  <div className={`avatar-container ${staff.role}`}>
                    <div className="avatar-inner">
                      {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                    </div>
                    <span className={`status-indicator ${staff.status}`}></span>
                  </div>
                </div>
                
                <div className="staff-identity">
                  <h3>{staff.firstName} {staff.lastName}</h3>
                  <span className="staff-role">{staff.roleDisplay}</span>
                </div>
                
                <div className="edit-action">
                  <button className="edit-btn">
                    <i className="fas fa-pen"></i>
                  </button>
                </div>
              </div>
              
              <div className="staff-card-body">
                <div className="contact-details">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>{staff.email}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone-alt"></i>
                    <span>{staff.phone}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{staff.address}</span>
                  </div>
                </div>
                
                <div className="documents-progress">
                  <div className="progress-label">
                    <span>Documentación</span>
                    <span className="percentage">{getCompletedDocsPercentage(staff.documents)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getCompletedDocsPercentage(staff.documents)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No se encontraron resultados</h3>
            <p>Intenta con diferentes criterios de búsqueda o cambia los filtros</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
              }}
            >
              <i className="fas fa-redo-alt"></i>
              <span>Restablecer filtros</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de edición/creación de perfil */}
      {showProfileModal && selectedStaff && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <div className="staff-profile-header">
                <div className={`modal-avatar ${selectedStaff.role}`}>
                  <span className="avatar-text">
                    {selectedStaff.firstName.charAt(0)}{selectedStaff.lastName.charAt(0)}
                  </span>
                  <span className={`modal-status ${selectedStaff.status}`}></span>
                </div>
                
                <div className="staff-details">
                  <div className="name-inputs">
                    <div className="input-group">
                      <label>Nombre</label>
                      <input 
                        type="text" 
                        value={selectedStaff.firstName} 
                        onChange={(e) => handleUpdateStaffData('firstName', e.target.value, 'personalInfo')}
                      />
                    </div>
                    <div className="input-group">
                      <label>Apellido</label>
                      <input 
                        type="text" 
                        value={selectedStaff.lastName} 
                        onChange={(e) => handleUpdateStaffData('lastName', e.target.value, 'personalInfo')}
                      />
                    </div>
                  </div>
                  
                  <div className="role-status-selects">
                    <div className="input-group">
                      <label>Rol</label>
                      <select 
                        value={selectedStaff.role} 
                        onChange={(e) => handleUpdateStaffData('role', e.target.value, 'professionalInfo')}
                      >
                        <option value="">Seleccionar rol</option>
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Estado</label>
                      <select 
                        value={selectedStaff.status} 
                        onChange={(e) => handleUpdateStaffData('status', e.target.value)}
                        className={`status-select ${selectedStaff.status}`}
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="close-modal-btn" onClick={handleCloseProfile}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="modal-tabs">
              <button 
                className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => handleChangeTab('info')}
              >
                <i className="fas fa-user"></i>
                <span>Información Personal</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => handleChangeTab('documents')}
              >
                <i className="fas fa-file-alt"></i>
                <span>Documentos</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => handleChangeTab('security')}
              >
                <i className="fas fa-shield-alt"></i>
                <span>Seguridad</span>
              </button>
            </div>
            
            <div className="modal-content">
              {activeTab === 'info' && (
                <div className="info-tab-content">
                  {/* Información Personal */}
                  <div className="info-section">
                    <h3>Información Personal</h3>
                    <div className="contact-form">
                      <div className="form-row">
                        <div className="input-group">
                          <label>Fecha de Nacimiento</label>
                          <input 
                            type="date" 
                            value={selectedStaff.dob} 
                            onChange={(e) => handleUpdateStaffData('dob', e.target.value, 'personalInfo')}
                          />
                        </div>
                        <div className="input-group">
                          <label>Género</label>
                          <select 
                            value={selectedStaff.gender} 
                            onChange={(e) => handleUpdateStaffData('gender', e.target.value, 'personalInfo')}
                          >
                            <option value="">Seleccionar género</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                            <option value="other">Otro</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="info-section">
                    <h3>Información de Contacto</h3>
                    <div className="contact-form">
                      <div className="form-row">
                        <div className="input-group">
                          <label>Email</label>
                          <input 
                            type="email" 
                            value={selectedStaff.email} 
                            onChange={(e) => handleUpdateStaffData('email', e.target.value, 'contactInfo')}
                          />
                        </div>
                        <div className="input-group">
                          <label>Teléfono</label>
                          <input 
                            type="tel" 
                            value={selectedStaff.phone} 
                            onChange={(e) => handleUpdateStaffData('phone', e.target.value, 'contactInfo')}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="input-group">
                          <label>Teléfono Alternativo (Opcional)</label>
                          <input 
                            type="tel" 
                            value={selectedStaff.alternatePhone} 
                            onChange={(e) => handleUpdateStaffData('alternatePhone', e.target.value, 'contactInfo')}
                          />
                        </div>
                        <div className="input-group">
                          <label>Código Postal</label>
                          <input 
                            type="text" 
                            value={selectedStaff.zipCode} 
                            onChange={(e) => handleUpdateStaffData('zipCode', e.target.value, 'contactInfo')}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="input-group full-width">
                          <label>Dirección</label>
                          <input 
                            type="text" 
                            value={selectedStaff.address} 
                            onChange={(e) => handleUpdateStaffData('address', e.target.value, 'contactInfo')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'documents' && (
                <div className="documents-tab-content">
                  <div className="documents-header">
                    <h3>Documentos Requeridos</h3>
                    <div className="documents-summary">
                      <div className="completed-percentage">
                        <div className="circular-progress" data-percentage={getCompletedDocsPercentage(selectedStaff.documents)}>
                          <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path className="circle"
                              strokeDasharray={`${getCompletedDocsPercentage(selectedStaff.documents)}, 100`}
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage">{getCompletedDocsPercentage(selectedStaff.documents)}%</text>
                          </svg>
                        </div>
                        <span className="documents-text">Documentos Completados</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="documents-grid">
                    {documentsList.map(doc => (
                      <div 
                        key={doc.id} 
                        className={`document-card ${selectedStaff.documents[doc.id].status}`}
                      >
                        <div className="document-card-header">
                          <div className="document-icon">
                            <i className="fas fa-file-alt"></i>
                          </div>
                          <div className="document-info">
                            <h4>{doc.name}</h4>
                            {doc.description && <p>{doc.description}</p>}
                          </div>
                          <div 
                            className={`status-toggle ${selectedStaff.documents[doc.id].status}`}
                            onClick={() => handleDocumentStatusToggle(selectedStaff.id, doc.id)}
                          >
                            <div className="toggle-slider">
                              <div className="toggle-circle"></div>
                            </div>
                            <span className="toggle-text">
                              {selectedStaff.documents[doc.id].status === 'obtained' ? 'Obtenido' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="document-card-body">
                          {selectedStaff.documents[doc.id].file ? (
                            <div className="file-preview">
                              <div className="file-info">
                                <i className="fas fa-file-pdf"></i>
                                <span className="file-name">{selectedStaff.documents[doc.id].file}</span>
                              </div>
                              <div className="file-actions">
                                <button 
                                  className="view-file-btn"
                                  onClick={() => handleDocumentViewClick(doc.name, selectedStaff.documents[doc.id].file)}
                                >
                                  <i className="fas fa-eye"></i>
                                  <span>Ver</span>
                                </button>
                                <div className="upload-new">
                                  <label htmlFor={`file-${selectedStaff.id}-${doc.id}`}>
                                    <i className="fas fa-sync-alt"></i>
                                    <span>Actualizar</span>
                                  </label>
                                  <input
                                    type="file"
                                    id={`file-${selectedStaff.id}-${doc.id}`}
                                    onChange={(e) => handleDocumentUpload(selectedStaff.id, doc.id, e)}
                                    className="file-input"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="no-file">
                              <div className="upload-container">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <p>No hay archivo. Haga clic para subir documento.</p>
                                <label htmlFor={`file-${selectedStaff.id}-${doc.id}`} className="upload-btn">
                                  <i className="fas fa-plus"></i>
                                  <span>Subir Archivo</span>
                                </label>
                                <input
                                  type="file"
                                  id={`file-${selectedStaff.id}-${doc.id}`}
                                  onChange={(e) => handleDocumentUpload(selectedStaff.id, doc.id, e)}
                                  className="file-input"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="security-tab-content">
                  <div className="security-section">
                    <h3>Información de Acceso</h3>
                    
                    <div className="security-form">
                      <div className="form-row">
                        <div className="input-group">
                          <label>Nombre de Usuario</label>
                          <div className="input-with-icon">
                            <input 
                              type="text" 
                              value={selectedStaff.userName} 
                              onChange={(e) => handleUpdateStaffData('userName', e.target.value, 'userInfo')}
                            />
                            <button className="icon-button">
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="input-group">
                          <label>Contraseña</label>
                          <div className="input-with-action">
                            <input 
                              type="password" 
                              value={selectedStaff.password} 
                              onChange={(e) => handleUpdateStaffData('password', e.target.value, 'userInfo')}
                            />
                            <button 
                              className="reset-password-btn"
                              onClick={() => handleResetPassword(selectedStaff.id)}
                            >
                              <i className="fas fa-key"></i>
                              <span>Resetear Contraseña</span>
                            </button>
                          </div>
                          <p className="help-text">
                            Al restablecer la contraseña, se enviará un correo electrónico con instrucciones de recuperación.
                          </p>
                        </div>
                      </div>
                      
                      <div className="permissions-section">
                        <h4>Permisos de Usuario</h4>
                        <div className="permissions-grid">
                          <div className="permission-category">
                            <h5>Acceso a Pacientes</h5>
                            <div className="permission-option">
                              <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>Ver información de pacientes</span>
                            </div>
                            <div className="permission-option">
                              <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>Editar información de pacientes</span>
                            </div>
                            <div className="permission-option">
                              <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>Crear nuevos pacientes</span>
                            </div>
                          </div>
                          
                          <div className="permission-category">
                            <h5>Acceso a Documentos</h5>
                            <div className="permission-option">
                              <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>Ver documentos</span>
                            </div>
                            <div className="permission-option">
                              <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>Subir documentos</span>
                            </div>
                            <div className="permission-option">
                              <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>Eliminar documentos</span>
                            </div>
                          </div>
                          
                          <div className="permission-category">
                            <h5>Acceso Administrativo</h5>
                            <div className="permission-option">
                              <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>Acceso al panel administrativo</span>
                            </div>
                            <div className="permission-option">
                              <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>Administrar personal</span>
                            </div>
                            <div className="permission-option">
                              <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>Ver reportes financieros</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseProfile}>
                <i className="fas fa-times"></i>
                <span>Cancelar</span>
              </button>
              <button className="save-btn" onClick={() => handleSaveProfile(selectedStaff)}>
                <i className="fas fa-save"></i>
                <span>{isCreating ? 'Crear' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevStaffEditComponent;