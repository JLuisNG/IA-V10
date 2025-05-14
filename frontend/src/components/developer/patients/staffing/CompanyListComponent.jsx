import React, { useState, useEffect } from 'react';
import '../../../../styles/developer/Patients/Staffing/CompanyListComponent.scss';

const CompanyListComponent = ({ onBackToOptions }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Connecting to database...');
  const [companyList, setCompanyList] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  
  // Simulación de carga con mensajes dinámicos
  useEffect(() => {
    setIsLoading(true);
    setLoadingMessage('Connecting to database...');
    
    const loadingMessages = [
      { message: 'Verifying user permissions...', time: 800 },
      { message: 'Retrieving company list...', time: 500 },
      { message: 'Loading associated records...', time: 700 },
      { message: 'Preparing company interface...', time: 1200 },
      { message: 'Optimizing performance...', time: 400 }
    ];
    
    const timeouts = [];
    
    loadingMessages.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setLoadingMessage(item.message);
        if (index === loadingMessages.length - 1) {
          const finalTimeout = setTimeout(() => {
            setIsLoading(false);
            fetchCompanyData();
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
  
  // Datos simulados de compañías
  const fetchCompanyData = () => {
    // Simulación de datos del servidor
    const mockData = [
      {
        id: 1,
        companyName: 'Motive Home Care',
        fullCompanyName: 'Motive Home Care, LLC',
        address: {
          street: '123 Healthcare Ave',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
        },
        contact: {
          managerName: 'Jessica Thompson',
          position: 'CEO',
          phone: '(312) 555-7890',
          email: 'jthompson@motivehomecare.com',
        },
        website: 'www.motivehomecare.com',
        taxID: '87-1234567',
        foundedYear: '2018',
        companyType: 'Home Healthcare',
        specialties: ['Physical Therapy', 'Occupational Therapy', 'Speech Therapy'],
        logo: null,
        status: 'active',
        staffCount: 28,
        activePatients: 145
      },
      {
        id: 2,
        companyName: 'Healing Hands Therapy',
        fullCompanyName: 'Healing Hands Therapy Services, Inc.',
        address: {
          street: '456 Wellness Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        contact: {
          managerName: 'Robert Johnson',
          position: 'Director',
          phone: '(212) 555-1234',
          email: 'robert@healinghands.com',
        },
        website: 'www.healinghandstherapy.com',
        taxID: '82-7654321',
        foundedYear: '2010',
        companyType: 'Rehabilitation Center',
        specialties: ['Physical Therapy', 'Occupational Therapy'],
        logo: null,
        status: 'active',
        staffCount: 35,
        activePatients: 210
      },
      {
        id: 3,
        companyName: 'RehabCare Plus',
        fullCompanyName: 'RehabCare Plus, Inc.',
        address: {
          street: '789 Recovery Road',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
        },
        contact: {
          managerName: 'Sarah Miller',
          position: 'Managing Director',
          phone: '(323) 555-6789',
          email: 'sarah@rehabcareplus.com',
        },
        website: 'www.rehabcareplus.com',
        taxID: '91-4567890',
        foundedYear: '2015',
        companyType: 'Multi-Specialty Care Center',
        specialties: ['Physical Therapy', 'Speech Therapy', 'Pediatric Care'],
        logo: null,
        status: 'active',
        staffCount: 42,
        activePatients: 178
      },
      {
        id: 4,
        companyName: 'Elderly Comfort Care',
        fullCompanyName: 'Elderly Comfort Care Services, LLC',
        address: {
          street: '321 Senior Avenue',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101',
          country: 'USA',
        },
        contact: {
          managerName: 'David Garcia',
          position: 'CEO',
          phone: '(305) 555-9876',
          email: 'david@elderlycomfort.com',
        },
        website: 'www.elderlycomfortcare.com',
        taxID: '73-8901234',
        foundedYear: '2012',
        companyType: 'Home Healthcare',
        specialties: ['Elderly Care', 'Nursing Care', 'Rehabilitative Care'],
        logo: null,
        status: 'inactive',
        staffCount: 0,
        activePatients: 0
      }
    ];
    
    setCompanyList(mockData);
    setFilteredCompanies(mockData);
  };
  
  // Filtrar y ordenar compañías
  useEffect(() => {
    let filtered = [...companyList];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.fullCompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contact.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por tipo de compañía
    if (filterType !== 'all') {
      filtered = filtered.filter(company => company.companyType === filterType);
    }
    
    setFilteredCompanies(filtered);
  }, [companyList, searchTerm, filterType]);
  
  // Tipos de compañía para el filtro
  const companyTypes = [
    'Home Healthcare',
    'Hospital',
    'Medical Center',
    'Rehabilitation Center',
    'Nursing Home',
    'Physical Therapy Clinic',
    'Occupational Therapy Clinic',
    'Speech Therapy Clinic',
    'Multi-Specialty Care Center'
  ];
  
  // Abrir modal de compañía
  const handleOpenCompany = (company) => {
    setSelectedCompany(company);
    setShowCompanyModal(true);
  };
  
  // Cerrar modal de compañía
  const handleCloseCompany = () => {
    setShowCompanyModal(false);
    setSelectedCompany(null);
  };
  
  // Función para manejar el clic en el botón de retroceso
  const handleBackClick = () => {
    if (typeof onBackToOptions === 'function') {
      onBackToOptions();
    } else {
      console.error("onBackToOptions prop is not provided or not a function");
    }
  };
  
  // Renderizado de la pantalla de carga
  if (isLoading) {
    return (
      <div className="company-list-loading">
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
    <div className="company-list-container">
      {/* Header mejorado */}
      <div className="company-list-header">
        <div className="header-content">
          {/* Botón de retroceso con manejador explícito */}
          <button className="back-button" onClick={handleBackClick}>
            <i className="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <div className="header-title-container">
            <h2>Company Management</h2>
            <p>View and manage healthcare companies and agencies in the system</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="refresh-btn" onClick={() => {
            setIsLoading(true);
            setLoadingMessage('Updating data...');
            setTimeout(() => {
              fetchCompanyData();
              setIsLoading(false);
            }, 2000);
          }}>
            <i className="fas fa-sync-alt"></i> 
            <span>Refresh</span>
          </button>
          <button className="export-btn">
            <i className="fas fa-file-export"></i> 
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Barra de filtros y búsqueda */}
      <div className="search-filter-container">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search by name, location or manager..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          <div className="type-filter">
            <span className="filter-label">Filter by type:</span>
            <div className="type-options">
              <button 
                className={`type-option ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                <span>All</span>
              </button>
              
              {companyTypes.map(type => (
                <button 
                  key={type}
                  className={`type-option ${filterType === type ? 'active' : ''}`}
                  onClick={() => setFilterType(type)}
                >
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tarjetas de compañías */}
      <div className="company-cards-container">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <div 
              key={company.id} 
              className={`company-card ${company.status}`}
              onClick={() => handleOpenCompany(company)}
            >
              <div className="company-card-header">
                <div className="company-logo">
                  {company.logo ? (
                    <img src={company.logo} alt={company.companyName} />
                  ) : (
                    <div className="logo-placeholder">
                      {company.companyName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className={`status-indicator ${company.status}`}></span>
                </div>
                
                <div className="company-identity">
                  <h3>{company.companyName}</h3>
                  <span className="company-type">{company.companyType}</span>
                </div>
                
                <div className="edit-action">
                  <button className="edit-btn">
                    <i className="fas fa-pen"></i>
                  </button>
                </div>
              </div>
              
              <div className="company-card-body">
                <div className="company-details">
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{company.address.city}, {company.address.state}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-user-tie"></i>
                    <span>{company.contact.managerName}, {company.contact.position}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-phone-alt"></i>
                    <span>{company.contact.phone}</span>
                  </div>
                </div>
                
                <div className="company-stats">
                  <div className="stat-item">
                    <div className="stat-label">Staff</div>
                    <div className="stat-value">{company.staffCount}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Patients</div>
                    <div className="stat-value">{company.activePatients}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Founded</div>
                    <div className="stat-value">{company.foundedYear}</div>
                  </div>
                </div>
                
                <div className="specialties-list">
                  {company.specialties.slice(0, 3).map((specialty, index) => (
                    <span key={index} className="specialty-tag">{specialty}</span>
                  ))}
                  {company.specialties.length > 3 && (
                    <span className="more-tag">+{company.specialties.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              <i className="fas fa-building"></i>
            </div>
            <h3>No companies found</h3>
            <p>Try different search criteria or change filters</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
            >
              <i className="fas fa-redo-alt"></i>
              <span>Reset filters</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de detalle de compañía (simplificado) */}
      {showCompanyModal && selectedCompany && (
        <div className="company-modal-overlay" onClick={handleCloseCompany}>
          <div className="company-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <h2>{selectedCompany.companyName}</h2>
                <span className={`company-status ${selectedCompany.status}`}>
                  {selectedCompany.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button className="close-modal" onClick={handleCloseCompany}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="company-info-section">
                <h3>Company Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Legal Name</label>
                    <p>{selectedCompany.fullCompanyName}</p>
                  </div>
                  <div className="info-item">
                    <label>Company Type</label>
                    <p>{selectedCompany.companyType}</p>
                  </div>
                  <div className="info-item">
                    <label>Tax ID / EIN</label>
                    <p>{selectedCompany.taxID}</p>
                  </div>
                  <div className="info-item">
                    <label>Year Founded</label>
                    <p>{selectedCompany.foundedYear}</p>
                  </div>
                  <div className="info-item">
                    <label>Website</label>
                    <p>
                      <a href={`https://${selectedCompany.website}`} target="_blank" rel="noopener noreferrer">
                        {selectedCompany.website}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="company-info-section">
                <h3>Address</h3>
                <div className="info-grid">
                  <div className="info-item full-width">
                    <label>Street</label>
                    <p>{selectedCompany.address.street}</p>
                  </div>
                  <div className="info-item">
                    <label>City</label>
                    <p>{selectedCompany.address.city}</p>
                  </div>
                  <div className="info-item">
                    <label>State</label>
                    <p>{selectedCompany.address.state}</p>
                  </div>
                  <div className="info-item">
                    <label>Zip Code</label>
                    <p>{selectedCompany.address.zipCode}</p>
                  </div>
                  <div className="info-item">
                    <label>Country</label>
                    <p>{selectedCompany.address.country}</p>
                  </div>
                </div>
              </div>
              
              <div className="company-info-section">
                <h3>Primary Contact</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name</label>
                    <p>{selectedCompany.contact.managerName}</p>
                  </div>
                  <div className="info-item">
                    <label>Position</label>
                    <p>{selectedCompany.contact.position}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>
                      <a href={`mailto:${selectedCompany.contact.email}`}>
                        {selectedCompany.contact.email}
                      </a>
                    </p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>{selectedCompany.contact.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="company-info-section">
                <h3>Specialties & Services</h3>
                <div className="specialties-container">
                  {selectedCompany.specialties.map((specialty, index) => (
                    <div key={index} className="specialty-badge">{specialty}</div>
                  ))}
                </div>
              </div>
              
              <div className="company-stats-section">
                <h3>Performance Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="stat-value">{selectedCompany.staffCount}</div>
                    <div className="stat-label">Total Staff</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{selectedCompany.activePatients}</div>
                    <div className="stat-label">Active Patients</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">92%</div>
                    <div className="stat-label">Satisfaction Rate</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">24h</div>
                    <div className="stat-label">Avg. Response Time</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="action-btn view-staff">
                <i className="fas fa-users"></i> View Staff
              </button>
              <button className="action-btn view-patients">
                <i className="fas fa-user-injured"></i> View Patients
              </button>
              <button className="action-btn edit-company">
                <i className="fas fa-edit"></i> Edit Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyListComponent;