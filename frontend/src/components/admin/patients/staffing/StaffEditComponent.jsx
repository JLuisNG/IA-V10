import React, { useState, useEffect } from 'react';
import '../../../../styles/developer/Patients/Staffing/StaffEditComponent.scss';

const AdminStaffEditComponent = ({ onBackToOptions }) => {
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
  
  // Simulación de carga con mensajes dinámicos
  useEffect(() => {
    setIsLoading(true);
    setLoadingMessage('Conectando con la base de datos...');
    
    const loadingMessages = [
      { message: 'Verificando permisos de usuario...', time: 800 },
      { message: 'Recuperando lista de personal...', time: 1600 },
      { message: 'Cargando documentos asociados...', time: 2400 },
      { message: 'Preparando interfaz de edición...', time: 3200 },
      { message: 'Optimizando rendimiento...', time: 4000 }
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

  // Datos simulados de personal
  const fetchStaffData = () => {
    // Simulación de datos del servidor
    const mockData = [
      {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@therapysync.com',
        phone: '(310) 555-1234',
        role: 'pt',
        roleDisplay: 'Physical Therapist',
        avatar: null,
        age: 35,
        status: 'active',
        zipCode: '90210',
        address: 'Beverly Hills, CA',
        documents: {
          covidVaccine: { status: 'obtained', file: 'covid_vac_jp.pdf' },
          tbTest: { status: 'obtained', file: 'tb_test_jp.pdf' },
          physicalExam: { status: 'obtained', file: 'phys_exam_jp.pdf' },
          liabilityInsurance: { status: 'obtained', file: 'liability_jp.pdf' },
          driversLicense: { status: 'obtained', file: 'license_jp.pdf' },
          autoInsurance: { status: 'obtained', file: 'auto_ins_jp.pdf' },
          cprCertification: { status: 'obtained', file: 'cpr_cert_jp.pdf' },
          businessLicense: { status: 'pending', file: null }
        },
        userName: 'juanp',
        password: '********',
        patients: 12
      },
      {
        id: 2,
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@therapysync.com',
        phone: '(562) 555-6789',
        role: 'ot',
        roleDisplay: 'Occupational Therapist',
        avatar: null,
        age: 29,
        status: 'active',
        zipCode: '90802',
        address: 'Long Beach, CA',
        documents: {
          covidVaccine: { status: 'obtained', file: 'covid_vac_mg.pdf' },
          tbTest: { status: 'obtained', file: 'tb_test_mg.pdf' },
          physicalExam: { status: 'obtained', file: 'phys_exam_mg.pdf' },
          liabilityInsurance: { status: 'obtained', file: 'liability_mg.pdf' },
          driversLicense: { status: 'obtained', file: 'license_mg.pdf' },
          autoInsurance: { status: 'obtained', file: 'auto_ins_mg.pdf' },
          cprCertification: { status: 'obtained', file: 'cpr_cert_mg.pdf' },
          businessLicense: { status: 'obtained', file: 'business_mg.pdf' }
        },
        userName: 'mariag',
        password: '********',
        patients: 8
      },
      {
        id: 3,
        firstName: 'Carlos',
        lastName: 'López',
        email: 'carlos.lopez@therapysync.com',
        phone: '(213) 555-4321',
        role: 'pt',
        roleDisplay: 'Physical Therapist',
        avatar: null,
        age: 41,
        status: 'active',
        zipCode: '90001',
        address: 'Los Angeles, CA',
        documents: {
          covidVaccine: { status: 'obtained', file: 'covid_vac_cl.pdf' },
          tbTest: { status: 'pending', file: null },
          physicalExam: { status: 'obtained', file: 'phys_exam_cl.pdf' },
          liabilityInsurance: { status: 'obtained', file: 'liability_cl.pdf' },
          driversLicense: { status: 'obtained', file: 'license_cl.pdf' },
          autoInsurance: { status: 'obtained', file: 'auto_ins_cl.pdf' },
          cprCertification: { status: 'pending', file: null },
          businessLicense: { status: 'obtained', file: 'business_cl.pdf' }
        },
        userName: 'carlosl',
        password: '********',
        patients: 15
      },
      {
        id: 4,
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@therapysync.com',
        phone: '(714) 555-9876',
        role: 'st',
        roleDisplay: 'Speech Therapist',
        avatar: null,
        age: 33,
        status: 'active',
        zipCode: '92805',
        address: 'Anaheim, CA',
        documents: {
          covidVaccine: { status: 'obtained', file: 'covid_vac_am.pdf' },
          tbTest: { status: 'obtained', file: 'tb_test_am.pdf' },
          physicalExam: { status: 'obtained', file: 'phys_exam_am.pdf' },
          liabilityInsurance: { status: 'obtained', file: 'liability_am.pdf' },
          driversLicense: { status: 'obtained', file: 'license_am.pdf' },
          autoInsurance: { status: 'pending', file: null },
          cprCertification: { status: 'obtained', file: 'cpr_cert_am.pdf' },
          businessLicense: { status: 'obtained', file: 'business_am.pdf' }
        },
        userName: 'anam',
        password: '********',
        patients: 10
      },
      {
        id: 5,
        firstName: 'Roberto',
        lastName: 'Sánchez',
        email: 'roberto.sanchez@therapysync.com',
        phone: '(949) 555-5432',
        role: 'pta',
        roleDisplay: 'Physical Therapist Assistant',
        avatar: null,
        age: 27,
        status: 'inactive',
        zipCode: '92602',
        address: 'Irvine, CA',
        documents: {
          covidVaccine: { status: 'obtained', file: 'covid_vac_rs.pdf' },
          tbTest: { status: 'obtained', file: 'tb_test_rs.pdf' },
          physicalExam: { status: 'pending', file: null },
          liabilityInsurance: { status: 'obtained', file: 'liability_rs.pdf' },
          driversLicense: { status: 'obtained', file: 'license_rs.pdf' },
          autoInsurance: { status: 'obtained', file: 'auto_ins_rs.pdf' },
          cprCertification: { status: 'obtained', file: 'cpr_cert_rs.pdf' },
          businessLicense: { status: 'pending', file: null }
        },
        userName: 'robertos',
        password: '********',
        patients: 0
      },
      {
        id: 6,
        firstName: 'Laura',
        lastName: 'Hernández',
        email: 'laura.hernandez@therapysync.com',
        phone: '(626) 555-2468',
        role: 'cota',
        roleDisplay: 'Occupational Therapy Assistant',
        avatar: null,
        age: 31,
        status: 'active',
        zipCode: '91106',
        address: 'Pasadena, CA',
        documents: {
          covidVaccine: { status: 'obtained', file: 'covid_vac_lh.pdf' },
          tbTest: { status: 'obtained', file: 'tb_test_lh.pdf' },
          physicalExam: { status: 'obtained', file: 'phys_exam_lh.pdf' },
          liabilityInsurance: { status: 'obtained', file: 'liability_lh.pdf' },
          driversLicense: { status: 'obtained', file: 'license_lh.pdf' },
          autoInsurance: { status: 'obtained', file: 'auto_ins_lh.pdf' },
          cprCertification: { status: 'obtained', file: 'cpr_cert_lh.pdf' },
          businessLicense: { status: 'obtained', file: 'business_lh.pdf' }
        },
        userName: 'laurah',
        password: '********',
        patients: 6
      },
      {
        id: 7,
        firstName: 'Luis',
        lastName: 'Nava',
        email: 'luis.nava@therapysync.com',
        phone: '(323) 555-3698',
        role: 'Developer',
        roleDisplay: 'Developer',
        avatar: null,
        age: 38,
        status: 'active',
        zipCode: '90012',
        address: 'Los Angeles, CA',
        documents: {
          covidVaccine: { status: 'obtained', file: 'covid_vac_ln.pdf' },
          tbTest: { status: 'obtained', file: 'tb_test_ln.pdf' },
          physicalExam: { status: 'obtained', file: 'phys_exam_ln.pdf' },
          liabilityInsurance: { status: 'obtained', file: 'liability_ln.pdf' },
          driversLicense: { status: 'obtained', file: 'license_ln.pdf' },
          autoInsurance: { status: 'obtained', file: 'auto_ins_ln.pdf' },
          cprCertification: { status: 'obtained', file: 'cpr_cert_ln.pdf' },
          businessLicense: { status: 'obtained', file: 'business_ln.pdf' }
        },
        userName: 'luisn',
        password: '********',
        patients: 0
      },
      {
        id: 8,
        firstName: 'Sofia',
        lastName: 'Torres',
        email: 'sofia.torres@therapysync.com',
        phone: '(818) 555-7531',
        role: 'st',
        roleDisplay: 'Speech Therapist',
        avatar: null,
        age: 35,
        status: 'active',
        zipCode: '91367',
        address: 'Woodland Hills, CA',
        documents: {
          covidVaccine: { status: 'obtained', file: 'covid_vac_st.pdf' },
          tbTest: { status: 'obtained', file: 'tb_test_st.pdf' },
          physicalExam: { status: 'obtained', file: 'phys_exam_st.pdf' },
          liabilityInsurance: { status: 'pending', file: null },
          driversLicense: { status: 'obtained', file: 'license_st.pdf' },
          autoInsurance: { status: 'obtained', file: 'auto_ins_st.pdf' },
          cprCertification: { status: 'obtained', file: 'cpr_cert_st.pdf' },
          businessLicense: { status: 'pending', file: null }
        },
        userName: 'sofiat',
        password: '********',
        patients: 9
      }
    ];
    
    setStaffList(mockData);
    setFilteredStaff(mockData);
  };

  // Filtrar y ordenar personal
  useEffect(() => {
    let filtered = [...staffList];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(staff => 
        `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm)
      );
    }
    
    // Filtrar por rol
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

  const handleOpenProfile = (staff) => {
    setSelectedStaff(staff);
    setShowProfileModal(true);
    setEditMode(true);
    setActiveTab('info');
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedStaff(null);
    setEditMode(false);
  };

  const handleSaveProfile = (updatedStaff) => {
    // Actualizar el personal en la lista
    const updatedStaffList = staffList.map(item => 
      item.id === updatedStaff.id ? updatedStaff : item
    );
    
    setStaffList(updatedStaffList);
    handleCloseProfile();
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
    // Simulación de visualización de documento
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

  const handleUpdateStaffData = (staffId, field, value) => {
    const updatedStaffList = staffList.map(staff => {
      if (staff.id === staffId) {
        return {
          ...staff,
          [field]: value
        };
      }
      return staff;
    });
    
    setStaffList(updatedStaffList);
    
    if (selectedStaff && selectedStaff.id === staffId) {
      setSelectedStaff({
        ...selectedStaff,
        [field]: value
      });
    }
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

  // Calcular documentos completos por terapeuta
  const getCompletedDocsPercentage = (documents) => {
    const total = Object.keys(documents).length;
    const completed = Object.values(documents).filter(doc => doc.status === 'obtained').length;
    return Math.round((completed / total) * 100);
  };

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
      
      {/* Modal de edición de perfil mejorado */}
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
                        onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'firstName', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Apellido</label>
                      <input 
                        type="text" 
                        value={selectedStaff.lastName} 
                        onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="role-status-selects">
                    <div className="input-group">
                      <label>Rol</label>
                      <select 
                        value={selectedStaff.role} 
                        onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'role', e.target.value)}
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Estado</label>
                      <select 
                        value={selectedStaff.status} 
                        onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'status', e.target.value)}
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
                  <div className="info-section">
                    <h3>Información de Contacto</h3>
                    
                    <div className="contact-form">
                      <div className="form-row">
                        <div className="input-group">
                          <label>Email</label>
                          <input 
                            type="email" 
                            value={selectedStaff.email}
                            onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'email', e.target.value)}
                          />
                        </div>
                        
                        <div className="input-group">
                          <label>Teléfono</label>
                          <input 
                            type="tel" 
                            value={selectedStaff.phone}
                            onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'phone', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="input-group">
                          <label>Edad</label>
                          <input 
                            type="number" 
                            value={selectedStaff.age}
                            onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'age', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div className="input-group">
                          <label>Código Postal</label>
                          <input 
                            type="text" 
                            value={selectedStaff.zipCode}
                            onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'zipCode', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="input-group full-width">
                          <label>Dirección</label>
                          <input 
                            type="text" 
                            value={selectedStaff.address}
                            onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'address', e.target.value)}
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
                              onChange={(e) => handleUpdateStaffData(selectedStaff.id, 'userName', e.target.value)}
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
                              readOnly
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
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffEditComponent;