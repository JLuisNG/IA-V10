import React, { useState, useEffect } from 'react';
import '../../../../styles/developer/Patients/Staffing/AddStaffForm.scss';

const DevAddStaffForm = ({ onCancel, onViewAllStaff }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedStaffName, setSavedStaffName] = useState('');

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
    // New field for agency affiliation
    agency: 'motive-home-care' // Default agency
  });

  // List of available agencies
  const agencies = [
    {
      id: 'motive-home-care',
      name: 'Motive Home Care',
      address: '1234 Healthcare Blvd, Los Angeles, CA 90001',
      phone: '(323) 555-7890'
    },
    // More agencies can be added here in the future
  ];

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

  // Loading simulation with dynamic messages
  const [loadingMessage, setLoadingMessage] = useState('Initializing staff module...');
  const [savingMessage, setSavingMessage] = useState('Processing staff data...');
  
  React.useEffect(() => {
    const loadingMessages = [
      { message: 'Connecting to system...', time: 800 },
      { message: 'Loading documentation modules...', time: 600 },
      { message: 'Preparing registration form...', time: 400 },
      { message: 'Verifying document templates...', time: 500 },
      { message: 'Ready to register new therapist', time: 1000 }
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

  const resetForm = () => {
    setFormData({
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
      agency: 'motive-home-care'
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
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Save the name for the success message
    setSavedStaffName(`${formData.firstName} ${formData.lastName}`);
    
    // Simulate saving process with dynamic messages
    const savingMessages = [
      { message: 'Processing staff data...', time: 600 },
      { message: 'Validating information...', time: 800 },
      { message: 'Uploading documents...', time: 1200 },
      { message: 'Creating user credentials...', time: 700 },
      { message: 'Linking to Motive Home Care agency...', time: 900 },
      { message: 'Finalizing registration...', time: 1000 }
    ];
    
    let totalTime = 0;
    
    savingMessages.forEach((item, index) => {
      totalTime += item.time;
      
      setTimeout(() => {
        setSavingMessage(item.message);
        
        // When reaching the last message, complete the saving process
        if (index === savingMessages.length - 1) {
          setTimeout(() => {
            // Implement logic for sending data
            console.log('Form data:', formData);
            console.log('Documents:', documents);
            
            // Simulate API response
            setIsSaving(false);
            setShowSuccessModal(true);
          }, 800);
        }
      }, totalTime);
    });
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    resetForm();
  };

  const handleViewAllStaff = () => {
    if (onViewAllStaff) {
      onViewAllStaff();
    } else {
      // Fallback if the function is not provided
      onCancel();
    }
  };

  const roles = [
    { value: 'agency', label: 'Agency' },
    { value: 'support', label: 'Support' },
    { value: 'developer', label: 'Developer' },
    { value: 'administrator', label: 'Administrator' },
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
      ) : isSaving ? (
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
      ) : (
        <div className="staff-form-container">
          {showSuccessModal && (
            <div className="success-modal-overlay">
              <div className="success-modal">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h2 className="success-title">Staff Member Added Successfully!</h2>
                <p className="success-message">
                  <strong>{savedStaffName}</strong> has been successfully registered in the system and linked to <strong>{agencies.find(a => a.id === formData.agency)?.name}</strong>.
                </p>
                <div className="success-actions">
                  <button className="create-another-btn" onClick={handleCreateAnother}>
                    <i className="fas fa-plus-circle"></i>
                    Create Another Staff Member
                  </button>
                  <button className="view-all-btn" onClick={handleViewAllStaff}>
                    <i className="fas fa-users"></i>
                    View All Staff
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="form-header">
            <h2>Add New Team Member</h2>
            <p>Complete the information to register a new therapist or staff member</p>
          </div>
          
          <form onSubmit={handleSubmit} className="staff-form">
            {/* Personal Information Section */}
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
            
            {/* Contact Information Section */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-address-book"></i>
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
            
            {/* User Information Section */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-user-lock"></i>
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
            
            {/* Agency Affiliation Section - NEW */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-building"></i>
                <h3>Agency Affiliation</h3>
              </div>
              <div className="section-content">
                <div className="form-group">
                  <label htmlFor="agency">Select Agency</label>
                  <select
                    id="agency"
                    name="agency"
                    value={formData.agency}
                    onChange={handleInputChange}
                    required
                  >
                    {agencies.map((agency) => (
                      <option key={agency.id} value={agency.id}>
                        {agency.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Display details of the selected agency */}
                {formData.agency && (
                  <div className="agency-details">
                    <h4>Agency Details:</h4>
                    {agencies.filter(a => a.id === formData.agency).map(agency => (
                      <div key={agency.id} className="agency-info">
                        <p><strong>Name:</strong> {agency.name}</p>
                        <p><strong>Address:</strong> {agency.address}</p>
                        <p><strong>Phone:</strong> {agency.phone}</p>
                      </div>
                    ))}
                    <div className="agency-confirmation">
                      <p className="confirmation-text">
                        <i className="fas fa-info-circle"></i> Staff member will be linked to this agency and can only access its patients and resources.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Professional Role Section */}
            <div className="form-section">
              <div className="section-header">
                <i className="fas fa-user-tag"></i>
                <h3>Professional Role</h3>
              </div>
              <div className="section-content role-selection">
                <div className="form-group">
                  <label htmlFor="role">Select Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Required Documents Section */}
            <div className="form-section documents-section">
              <div className="section-header">
                <i className="fas fa-file-medical"></i>
                <h3>Required Documents</h3>
                <p className="section-subtitle">Documents are not mandatory to create the profile, but will be necessary for patient assignments.</p>
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
                          <i className="fas fa-upload"></i> Upload document
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
                
                {/* Option to upload additional document */}
                <div className="document-card add-document">
                  <div className="add-document-content">
                    <i className="fas fa-plus-circle"></i>
                    <span>Add additional document</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onCancel}>
                <i className="fas fa-times"></i> Cancel
              </button>
              <button type="submit" className="submit-btn">
                <i className="fas fa-save"></i> Save Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DevAddStaffForm;