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
  const [showInactive, setShowInactive] = useState(true);
  const [editedCompany, setEditedCompany] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  
  // Available company types
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
  
  // Available specialties
  const specialtyOptions = [
    'Physical Therapy',
    'Occupational Therapy',
    'Speech Therapy',
    'Nursing Care',
    'Elderly Care',
    'Pediatric Care',
    'Rehabilitative Care',
    'Post-Surgery Care',
    'Chronic Disease Management',
    'Disability Support'
  ];
  
  // Simulated loading with dynamic messages
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
  
  // Simulated company data
  const fetchCompanyData = () => {
    // Mock data from server
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
  
  // Filter and sort companies
  useEffect(() => {
    let filtered = [...companyList];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.fullCompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contact.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by company type
    if (filterType !== 'all') {
      filtered = filtered.filter(company => company.companyType === filterType);
    }

    // Filter by status if not showing inactive
    if (!showInactive) {
      filtered = filtered.filter(company => company.status === 'active');
    }
    
    setFilteredCompanies(filtered);
  }, [companyList, searchTerm, filterType, showInactive]);
  
  // Open company modal
  const handleOpenCompany = (company) => {
    setSelectedCompany(company);
    // Create a deep copy of the company for editing
    setEditedCompany(JSON.parse(JSON.stringify(company)));
    setShowCompanyModal(true);
  };
  
  // Close company modal
  const handleCloseCompany = () => {
    setShowCompanyModal(false);
    setSelectedCompany(null);
    setEditedCompany(null);
    setLogoFile(null);
    setActiveTab('info');
  };
  
  // Handle back button click
  const handleBackClick = () => {
    if (typeof onBackToOptions === 'function') {
      onBackToOptions();
    } else {
      console.error("onBackToOptions prop is not provided or not a function");
    }
  };
  
  // Handle input change for company details
  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    
    if (section) {
      setEditedCompany({
        ...editedCompany,
        [section]: {
          ...editedCompany[section],
          [field]: value
        }
      });
    } else {
      setEditedCompany({
        ...editedCompany,
        [field]: value
      });
    }
  };
  
  // Handle company logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setEditedCompany({
          ...editedCompany,
          logo: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove uploaded logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setEditedCompany({
      ...editedCompany,
      logo: null
    });
  };
  
  // Handle specialty toggle
  const handleSpecialtyToggle = (specialty) => {
    const specialties = [...editedCompany.specialties];
    
    if (specialties.includes(specialty)) {
      const updatedSpecialties = specialties.filter(s => s !== specialty);
      setEditedCompany({
        ...editedCompany,
        specialties: updatedSpecialties
      });
    } else {
      specialties.push(specialty);
      setEditedCompany({
        ...editedCompany,
        specialties: specialties
      });
    }
  };
  
  // Handle status toggle
  const handleStatusToggle = () => {
    setEditedCompany({
      ...editedCompany,
      status: editedCompany.status === 'active' ? 'inactive' : 'active'
    });
  };
  
  // Save company changes
  const handleSaveChanges = () => {
    // Update the company in the list
    const updatedList = companyList.map(company => 
      company.id === editedCompany.id ? editedCompany : company
    );
    
    setCompanyList(updatedList);
    setFilteredCompanies(updatedList);
    
    // Show success message or notification here
    handleCloseCompany();
  };
  
  // Create new company button
  const handleAddNewCompany = () => {
    const newCompany = {
      id: Math.max(...companyList.map(c => c.id)) + 1,
      companyName: '',
      fullCompanyName: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      },
      contact: {
        managerName: '',
        position: '',
        phone: '',
        email: '',
      },
      website: '',
      taxID: '',
      foundedYear: '',
      companyType: '',
      specialties: [],
      logo: null,
      status: 'active',
      staffCount: 0,
      activePatients: 0
    };
    
    setSelectedCompany(newCompany);
    setEditedCompany(newCompany);
    setShowCompanyModal(true);
  };
  
  // Render loading screen
  if (isLoading) {
    return (
      <div className="company-list-loading">
        <div className="loading-container">
          <div className="hologram-effect">
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
      {/* Enhanced Header */}
      <div className="company-list-header">
        <div className="header-content">
          {/* Back button with explicit handler */}
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
          <button className="add-new-btn" onClick={handleAddNewCompany}>
            <i className="fas fa-plus-circle"></i>
            <span>Add New Company</span>
          </button>
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
      
      {/* Search and Filter Bar */}
      <div className="search-filter-container">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search by company name, location or manager..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          <div className="filter-options">
            <div className="type-filter">
              <div className="filter-label">
                <i className="fas fa-filter"></i>
                <span>Filter by type:</span>
              </div>
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
            
            {/* Toggle for showing inactive */}
            <div className="inactive-filter">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={showInactive}
                  onChange={() => setShowInactive(!showInactive)}
                />
                <span className="toggle-slider"></span>
                <div className="toggle-label">
                  <i className="fas fa-building-circle-xmark"></i>
                  <span>Show Inactive Companies</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Company Cards */}
      <div className="company-cards-container">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <div 
              key={company.id} 
              className={`company-card ${company.status}`}
              onClick={() => handleOpenCompany(company)}
            >
              <div className="card-highlight"></div>
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
                  <div className="company-meta">
                    <span className="company-type">{company.companyType}</span>
                    {company.status === 'inactive' && (
                      <span className="status-badge inactive">
                        <i className="fas fa-building-circle-xmark"></i> Inactive
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="edit-action">
                  <button className="edit-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCompany(company);
                  }}>
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
                  <div className="detail-item">
                    <i className="fas fa-envelope"></i>
                    <span>{company.contact.email}</span>
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
                setShowInactive(true);
              }}
            >
              <i className="fas fa-redo-alt"></i>
              <span>Reset filters</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Improved Company Form Modal */}
      {showCompanyModal && editedCompany && (
        <div className="company-modal-overlay" onClick={handleCloseCompany}>
          <div className="company-modal company-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="company-profile-header">
                <div className="modal-logo">
                  {editedCompany.logo ? (
                    <div className="logo-image-container">
                      <img src={editedCompany.logo} alt={editedCompany.companyName} />
                      <button className="remove-logo-btn" onClick={handleRemoveLogo}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="logo-upload-container">
                      <div className="logo-placeholder">
                        {editedCompany.companyName ? 
                          editedCompany.companyName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase() :
                          'CO'
                        }
                      </div>
                      <div className="logo-overlay">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Upload Logo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload}
                          className="logo-input"
                        />
                      </div>
                    </div>
                  )}
                  <span className={`modal-status ${editedCompany.status}`}></span>
                </div>
                <div className="company-details">
                  <div className="name-fields">
                    <div className="input-group full-width">
                      <label>Company Name</label>
                      <input 
                        type="text" 
                        value={editedCompany.companyName}
                        onChange={(e) => handleInputChange(e, null, 'companyName')}
                        placeholder="Enter company name"
                      />
                    </div>
                  </div>
                  <div className="type-status-selects">
                    <div className="input-group">
                      <label>Company Type</label>
                      <select 
                        value={editedCompany.companyType}
                        onChange={(e) => handleInputChange(e, null, 'companyType')}
                      >
                        <option value="">Select company type</option>
                        {companyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Status</label>
                      <div className="status-toggle-container">
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={editedCompany.status === 'active'}
                            onChange={handleStatusToggle}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <span className={`status-text ${editedCompany.status}`}>
                          {editedCompany.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="close-modal" onClick={handleCloseCompany}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-tabs">
              <button 
                className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <i className="fas fa-info-circle"></i>
                <span>Company Information</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'address' ? 'active' : ''}`}
                onClick={() => setActiveTab('address')}
              >
                <i className="fas fa-map-marker-alt"></i>
                <span>Address</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                <i className="fas fa-user-tie"></i>
                <span>Contact</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                <i className="fas fa-stethoscope"></i>
                <span>Services</span>
              </button>
            </div>
            
            <div className="modal-body">
              {/* Company Information Section */}
              {activeTab === 'info' && (
                <div className="company-form-section">
                  <h3>Company Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Legal Company Name</label>
                      <input 
                        type="text" 
                        value={editedCompany.fullCompanyName}
                        onChange={(e) => handleInputChange(e, null, 'fullCompanyName')}
                        placeholder="Enter full legal name (including LLC, Inc, etc.)"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tax ID / EIN</label>
                      <input 
                        type="text" 
                        value={editedCompany.taxID}
                        onChange={(e) => handleInputChange(e, null, 'taxID')}
                        placeholder="XX-XXXXXXX"
                      />
                    </div>
                    <div className="form-group">
                      <label>Year Founded</label>
                      <input 
                        type="text" 
                        value={editedCompany.foundedYear}
                        onChange={(e) => handleInputChange(e, null, 'foundedYear')}
                        placeholder="YYYY"
                      />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input 
                        type="text" 
                        value={editedCompany.website}
                        onChange={(e) => handleInputChange(e, null, 'website')}
                        placeholder="www.company.com"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Company Logo</label>
                      <div className="logo-upload-field">
                        <label className="upload-button">
                          <i className="fas fa-cloud-upload-alt"></i>
                          <span>Upload company logo</span>
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                        </label>
                        <span className="file-name">
                          {logoFile ? logoFile.name : 'No file selected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Address Section */}
              {activeTab === 'address' && (
                <div className="company-form-section">
                  <h3>Company Address</h3>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Street Address</label>
                      <input 
                        type="text" 
                        value={editedCompany.address.street}
                        onChange={(e) => handleInputChange(e, 'address', 'street')}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input 
                        type="text" 
                        value={editedCompany.address.city}
                        onChange={(e) => handleInputChange(e, 'address', 'city')}
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input 
                        type="text" 
                        value={editedCompany.address.state}
                        onChange={(e) => handleInputChange(e, 'address', 'state')}
                        placeholder="State"
                      />
                    </div>
                    <div className="form-group">
                      <label>Zip Code</label>
                      <input 
                        type="text" 
                        value={editedCompany.address.zipCode}
                        onChange={(e) => handleInputChange(e, 'address', 'zipCode')}
                        placeholder="Zip Code"
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input 
                        type="text" 
                        value={editedCompany.address.country}
                        onChange={(e) => handleInputChange(e, 'address', 'country')}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contact Section */}
              {activeTab === 'contact' && (
                <div className="company-form-section">
                  <h3>Primary Contact Person</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Contact Name</label>
                      <input 
                        type="text" 
                        value={editedCompany.contact.managerName}
                        onChange={(e) => handleInputChange(e, 'contact', 'managerName')}
                        placeholder="Full name of primary contact"
                      />
                    </div>
                    <div className="form-group">
                      <label>Position</label>
                      <input 
                        type="text" 
                        value={editedCompany.contact.position}
                        onChange={(e) => handleInputChange(e, 'contact', 'position')}
                        placeholder="Job title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        value={editedCompany.contact.phone}
                        onChange={(e) => handleInputChange(e, 'contact', 'phone')}
                        placeholder="(XXX) XXX-XXXX"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        value={editedCompany.contact.email}
                        onChange={(e) => handleInputChange(e, 'contact', 'email')}
                        placeholder="email@company.com"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Services & Specialties Section */}
              {activeTab === 'services' && (
                <div className="company-form-section">
                  <h3>Services & Specialties</h3>
                  <div className="form-label">Select services offered by this company (select all that apply)</div>
                  <div className="specialties-grid">
                    {specialtyOptions.map(specialty => (
                      <div key={specialty} className="specialty-option">
                        <label className="checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={editedCompany.specialties.includes(specialty)}
                            onChange={() => handleSpecialtyToggle(specialty)}
                          />
                          <span className="checkmark"></span>
                          <span className="specialty-name">{specialty}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="company-status-section">
                    <h3>Company Status</h3>
                    <div className="status-toggle-wrapper">
                      <span className="status-label">Company Status:</span>
                      <div className="toggle-switch-container">
                        <label className="toggle-switch status-toggle">
                          <input 
                            type="checkbox" 
                            checked={editedCompany.status === 'active'}
                            onChange={handleStatusToggle}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <span className={`status-text ${editedCompany.status}`}>
                          {editedCompany.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <p className="status-description">
                      {editedCompany.status === 'active' 
                        ? 'Active companies are visible to users and can be assigned to patients.' 
                        : 'Inactive companies are not visible to users and cannot be assigned to patients.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="action-btn cancel-btn" onClick={handleCloseCompany}>
                <i className="fas fa-times"></i> Cancel
              </button>
              <button className="action-btn save-btn" onClick={handleSaveChanges}>
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyListComponent;