import React, { useState, useEffect } from 'react';
import StaffProfileModal from './StaffProfileModal';
import '../../../../styles/developer/Patients/Staffing/StaffList.scss';
import '../../../../styles/developer/Patients/Staffing/LoadingAnimation.scss';

const AdminStaffListComponent = ({ onBackToOptions }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Cargando personal...');
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterRole, setFilterRole] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Simular la carga de datos con mensajes dinámicos
  useEffect(() => {
    // Reiniciar el estado de carga cuando el componente se monta
    setIsLoading(true);
    setLoadingMessage('Cargando personal...');
    
    const loadingMessages = [
      { message: 'Conectando con la base de datos...', time: 800 },
      { message: 'Recuperando lista de personal...', time: 1600 },
      { message: 'Cargando datos de inicio de sesión...', time: 2400 },
      { message: 'Verificando permisos y roles...', time: 3200 },
      { message: 'Preparando interfaz de usuario...', time: 4000 }
    ];
    
    // Limpiar timeouts previos
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

  // Datos de ejemplo para personal
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
        patients: 0
      },
      {
        id: 6,
        firstName: 'Laura',
        lastName: 'Hernández',
        email: 'laura.hernandez@therapysync.com',
        phone: '(626) 555-2468',
        role: 'cota',
        roleDisplay: ' Occupational Therapy Assistant',
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
        patients: 9
      }
    ];
    
    setStaffList(mockData);
  };

  // Filtrar y ordenar personal
  const getFilteredAndSortedStaff = () => {
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
    
    // Ordenar según la opción seleccionada
    switch (sortOption) {
      case 'name-asc':
        filtered.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      case 'name-desc':
        filtered.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
        break;
      case 'role':
        filtered.sort((a, b) => a.roleDisplay.localeCompare(b.roleDisplay));
        break;
      case 'patients-desc':
        filtered.sort((a, b) => b.patients - a.patients);
        break;
      default:
        break;
    }
    
    return filtered;
  };

  // Manejadores de eventos
  const handleOpenProfile = (staff) => {
    setSelectedStaff(staff);
    setShowProfileModal(true);
    setEditMode(false);
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedStaff(null);
    setEditMode(false);
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = (updatedStaff) => {
    // Aquí iría la lógica para guardar en el backend
    setStaffList(staffList.map(item => item.id === updatedStaff.id ? updatedStaff : item));
    setSelectedStaff(updatedStaff);
    setEditMode(false);
  };

  const handleLoginAsUser = (userName) => {
    // Simulación de inicio de sesión como el usuario seleccionado
    console.log(`Iniciando sesión como ${userName}...`);
    alert(`Iniciando sesión como ${userName}. Esta función estará disponible en la próxima actualización.`);
  };

  // Calcular métricas generales
  const calculateMetrics = () => {
    const total = staffList.length;
    const active = staffList.filter(s => s.status === 'active').length;
    const documentsComplete = staffList.filter(s => {
      return Object.values(s.documents).every(doc => doc.status === 'obtained');
    }).length;
    
    return {
      total,
      active,
      documentsComplete,
      documentsCompletePercentage: Math.round((documentsComplete / total) * 100) || 0
    };
  };

  const metrics = calculateMetrics();

  // Renderizar pantalla de carga
  if (isLoading) {
    return (
      <div className="staff-list-loading">
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

  const filteredStaff = getFilteredAndSortedStaff();

  return (
    <div className="staff-list-container">
      {/* Cabecera */}
      <div className="staff-list-header">
        <div className="header-left">
          <button className="back-button" onClick={onBackToOptions}>
            <i className="fas fa-arrow-left"></i>
            <span>Volver</span>
          </button>
          <div className="header-title">
            <h2>Equipo de Terapeutas y Personal</h2>
            <p>Gestione su equipo, vea detalles y administre documentos</p>
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
            <i className="fas fa-sync-alt"></i> Actualizar
          </button>
          <button className="export-btn">
            <i className="fas fa-file-export"></i> Exportar
          </button>
        </div>
      </div>
      
      {/* Métricas de resumen */}
      <div className="staff-metrics">
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="metric-data">
            <h3>{metrics.total}</h3>
            <p>Total personal</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="metric-data">
            <h3>{metrics.active}</h3>
            <p>Activos</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-file-medical"></i>
          </div>
          <div className="metric-data">
            <h3>{metrics.documentsCompletePercentage}%</h3>
            <p>Documentación completa</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="metric-data">
            <h3>{staffList.reduce((sum, staff) => sum + staff.patients, 0)}</h3>
            <p>Pacientes asignados</p>
          </div>
        </div>
      </div>
      
      {/* Barra de filtros y búsqueda */}
      <div className="staff-filters">
        <div className="search-filter">
          <div className="search-input">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o teléfono..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          <div className="filter-by-role">
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Todos los roles</option>
              <option value="pt">Physical Therapist</option>
              <option value="pta">Physical Therapist Assistant</option>
              <option value="ot">Occupational Therapist</option>
              <option value="cota">Occupational Therapy Assistant</option>
              <option value="st">Speech Therapist</option>
              <option value="sta">Speech Therapy Assistant</option>
              <option value="agency">Agency</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
        </div>
        
        <div className="view-options">
          <div className="sort-by">
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="role">Rol</option>
              <option value="patients-desc">Pacientes (Mayor a Menor)</option>
            </select>
          </div>
          
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} 
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} 
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Lista de personal */}
      <div className={`staff-list ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
        {filteredStaff.length > 0 ? (
          <>
            {filteredStaff.map(staff => (
              <div 
                key={staff.id} 
                className={`staff-card ${staff.status}`}
                onClick={() => handleOpenProfile(staff)}
              >
                <div className="card-header">
                  <div className="avatar">
                    {staff.avatar ? (
                      <img src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} />
                    ) : (
                      <div className="avatar-placeholder">
                        {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="staff-info">
                    <h3>{staff.firstName} {staff.lastName}</h3>
                    <span className="role-badge">{staff.roleDisplay}</span>
                    <span className={`status-badge ${staff.status}`}>
                      {staff.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="contact-info">
                    <div className="info-item">
                      <i className="fas fa-envelope"></i>
                      <span>{staff.email}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-phone"></i>
                      <span>{staff.phone}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-birthday-cake"></i>
                      <span>{staff.age} años</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{staff.address}</span>
                    </div>
                  </div>
                  
                  <div className="documents-status">
                    <div className="doc-progress">
                      <div className="progress-label">
                        <span>Documentos</span>
                        <span>
                          {Object.values(staff.documents).filter(doc => doc.status === 'obtained').length}/
                          {Object.values(staff.documents).length}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{
                            width: `${(Object.values(staff.documents).filter(doc => doc.status === 'obtained').length / 
                              Object.values(staff.documents).length) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-footer">
                  <div className="patients-info">
                    <i className="fas fa-user-injured"></i>
                    <span>{staff.patients} pacientes asignados</span>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="view-profile-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProfile(staff);
                      }}
                    >
                      <i className="fas fa-id-card"></i>
                      <span>Ver Perfil</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No se encontraron resultados</h3>
            <p>Intente con diferentes términos de búsqueda o filtros</p>
            <button className="reset-filters" onClick={() => {
              setSearchTerm('');
              setFilterRole('all');
            }}>
              <i className="fas fa-redo"></i> Restablecer filtros
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de perfil */}
      {showProfileModal && selectedStaff && (
        <StaffProfileModal 
          staff={selectedStaff}
          onClose={handleCloseProfile}
          onEdit={handleEditProfile}
          onSave={handleSaveProfile}
          onLoginAs={handleLoginAsUser}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default AdminStaffListComponent;