import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../login/AuthContext';
import logoImg from '../../../../../assets/LogoMHC.jpeg';
import '../../../../../styles/developer/Patients/InfoPaciente/PatientInfoPage.scss';

// Patient Info Header Component
const PatientInfoHeader = ({ patient, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  // Handle back to patients list
  const handleBackToPatients = () => {
    navigate('/developer/patients');
  };

  return (
    <div className="patient-info-header">
      <div className="header-left">
        <button className="back-button" onClick={handleBackToPatients}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Patients</span>
        </button>
        <h1 className="patient-name">{patient?.name || 'Patient Information'}</h1>
        <div className="patient-id">#{patient?.id || '0'}</div>
      </div>
      <div className="header-actions">
        <button className="action-button edit">
          <i className="fas fa-edit"></i>
          <span>Edit</span>
        </button>
        <button className="action-button print">
          <i className="fas fa-print"></i>
          <span>Print</span>
        </button>
      </div>
    </div>
  );
};

// Tabs Navigation Component
const TabsNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'general', label: 'General Info', icon: 'fas fa-user' },
    { id: 'medical', label: 'Medical Info', icon: 'fas fa-notes-medical' },
    { id: 'disciplines', label: 'Disciplines', icon: 'fas fa-user-md' },
    { id: 'schedule', label: 'Schedule', icon: 'fas fa-calendar-alt' },
    { id: 'exercises', label: 'Exercises', icon: 'fas fa-dumbbell' },
    { id: 'documents', label: 'Documents', icon: 'fas fa-file-alt' },
    { id: 'notes', label: 'Notes', icon: 'fas fa-sticky-note' }
  ];

  return (
    <div className="patient-tabs-navigation">
      {tabs.map(tab => (
        <div 
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="tab-icon"><i className={tab.icon}></i></div>
          <span>{tab.label}</span>
          {activeTab === tab.id && <div className="active-indicator"></div>}
          <div className="tab-hover-effect"></div>
        </div>
      ))}
    </div>
  );
};

// General Information Section Component
const GeneralInformationSection = ({ patient }) => {
  return (
    <div className="general-info-section">
      <div className="info-card personal-info">
        <div className="card-header">
          <h3><i className="fas fa-user-circle"></i> Personal Information</h3>
        </div>
        <div className="card-body">
          <div className="info-row">
            <div className="info-label">Full Name</div>
            <div className="info-value">{patient?.name || 'Not available'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Date of Birth</div>
            <div className="info-value">{patient?.dob || 'Not available'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Gender</div>
            <div className="info-value">{patient?.gender || 'Not available'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Address</div>
            <div className="info-value">
              {patient?.street ? (
                <>
                  {patient.street}<br />
                  {patient.city}, {patient.state} {patient.zip}
                </>
              ) : (
                'Not available'
              )}
            </div>
          </div>
          <div className="info-row">
            <div className="info-label">Phone</div>
            <div className="info-value">{patient?.phone || 'Not available'}</div>
          </div>
        </div>
      </div>

      <div className="info-card certification-info">
        <div className="card-header">
          <h3><i className="fas fa-certificate"></i> Certification Period</h3>
          <button className="edit-button">
            <i className="fas fa-pen"></i>
          </button>
        </div>
        <div className="card-body">
          <div className="date-range">
            <div className="date-block">
              <label>Start Date</label>
              <div className="date-value">{patient?.certPeriod?.split(' to ')[0] || '00/00/0000'}</div>
            </div>
            <div className="progress-separator">
              <div className="line"></div>
            </div>
            <div className="date-block">
              <label>End Date</label>
              <div className="date-value">{patient?.certPeriod?.split(' to ')[1] || '00/00/0000'}</div>
            </div>
          </div>
          
          <div className="cert-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: calculateCertProgress(patient?.certPeriod) }}></div>
            </div>
            <div className="progress-labels">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">Insurance</div>
            <div className="info-value">{patient?.insurance || 'Not available'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Policy Number</div>
            <div className="info-value">{patient?.policyNumber || 'Not available'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Healthcare Agency</div>
            <div className="info-value">{patient?.agency || 'Not available'}</div>
          </div>
        </div>
      </div>

      <div className="info-card emergency-contacts">
        <div className="card-header">
          <h3><i className="fas fa-phone-alt"></i> Emergency Contacts</h3>
          <button className="edit-button">
            <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className="card-body">
          {patient?.emergencyContact ? (
            <div className="contact-row">
              <div className="contact-name">
                <i className="fas fa-user"></i>
                <span>{patient.emergencyContact}</span>
              </div>
              <div className="contact-phone">
                <i className="fas fa-phone"></i>
                <span>{patient.emergencyPhone}</span>
              </div>
              <div className="contact-relation">
                <i className="fas fa-users"></i>
                <span>Family Member</span>
              </div>
              <div className="contact-actions">
                <button className="action-btn edit">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-btn delete">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="no-contacts">
              <i className="fas fa-exclamation-circle"></i>
              <p>No emergency contacts available</p>
              <button className="add-contact-btn">
                <i className="fas fa-plus"></i> Add Contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Utility function to calculate certification period progress percentage
const calculateCertProgress = (certPeriod) => {
  if (!certPeriod) return '0%';
  
  try {
    const [startDateStr, endDateStr] = certPeriod.split(' to ');
    
    const [startMonth, startDay, startYear] = startDateStr.split('-').map(Number);
    const [endMonth, endDay, endYear] = endDateStr.split('-').map(Number);
    
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const currentDate = new Date();
    
    if (currentDate < startDate) return '0%';
    if (currentDate > endDate) return '100%';
    
    const totalDuration = endDate - startDate;
    const elapsedDuration = currentDate - startDate;
    
    const progressPercentage = Math.round((elapsedDuration / totalDuration) * 100);
    return `${progressPercentage}%`;
  } catch (error) {
    console.error('Error calculating certification progress:', error);
    return '0%';
  }
};

// Main Patient Information Page Component
const PatientInfoPage = () => {
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState('general');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch patient data
  useEffect(() => {
    // Simulating API call - in a real app, this would be replaced with actual fetch
    const fetchPatient = () => {
      setLoading(true);
      
      // Mock data - replace this with actual API call
      const mockPatients = [
        {
          id: 1,
          name: "Vargas, Javier",
          therapist: "Regina Araquel",
          therapistType: "PT",
          agency: "Supportive Health Group",
          street: "1800 Camden Avenue",
          city: "Los Angeles",
          state: "CA",
          zip: "90025",
          phone: "(310) 808-5631",
          certPeriod: "04-19-2023 to 04-19-2025",
          status: "Active",
          dob: "05/12/1965",
          gender: "Male",
          insurance: "Blue Cross Blue Shield",
          policyNumber: "BCB-123456789",
          emergencyContact: "Mohammed Ali",
          emergencyPhone: "(310) 555-7890",
          notes: "Patient recovering well. Following exercise regimen as prescribed."
        },
        {
          id: 2,
          name: "Nava, Luis",
          therapist: "James Lee",
          therapistType: "OT",
          agency: "Intra Care Home Health",
          street: "1800 Camden Avenue",
          city: "Los Angeles",
          state: "CA",
          zip: "90025",
          phone: "(310) 808-5631",
          certPeriod: "04-19-2023 to 04-19-2025",
          status: "Active",
          dob: "05/12/1965",
          gender: "Male",
          insurance: "Blue Cross Blue Shield",
          policyNumber: "BCB-123456789",
          emergencyContact: "Rick Grimes",
          emergencyPhone: "(310) 555-7890",
          notes: "Patient recovering well. Following exercise regimen as prescribed."
        }
      ];
      
      const foundPatient = mockPatients.find(p => p.id.toString() === patientId);
      
      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        // Handle not found
        console.error('Patient not found');
      }
      
      setLoading(false);
    };
    
    fetchPatient();
  }, [patientId]);

  // Render loading state
  if (loading) {
    return (
      <div className="patient-info-loading">
        <div className="loading-spinner">
          <i className="fas fa-circle-notch fa-spin"></i>
        </div>
        <p>Loading patient information...</p>
      </div>
    );
  }

  // Render patient not found
  if (!patient) {
    return (
      <div className="patient-not-found">
        <div className="error-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Patient Not Found</h2>
        <p>The patient you are looking for does not exist or you don't have permission to view it.</p>
        <button 
          className="back-button"
          onClick={() => navigate('/developer/patients')}
        >
          <i className="fas fa-arrow-left"></i> Back to Patients List
        </button>
      </div>
    );
  }

  return (
    <div className="patient-info-page">
      {/* Page header */}
      <header className="main-header">
        <div className="header-container">
          {/* Logo and navigation */}
          <div className="logo-container">
            <div className="logo-wrapper">
              <img src={logoImg} alt="TherapySync Logo" className="logo" />
              <div className="logo-glow"></div>
            </div>
            
            {/* Menu navigation */}
            <div className="menu-navigation">
              <button 
                className="nav-button main-menu" 
                onClick={() => navigate('/developer/homePage')}
                title="Back to main menu"
              >
                <i className="fas fa-th-large"></i>
                <span>Main Menu</span>
                <div className="button-effect"></div>
              </button>
              
              <button 
                className="nav-button patients-menu" 
                onClick={() => navigate('/developer/patients')}
                title="Patients Menu"
              >
                <i className="fas fa-user-injured"></i>
                <span>Patients</span>
                <div className="button-effect"></div>
              </button>
            </div>
          </div>
          
          {/* User profile - simplified version */}
          <div className="user-profile">
            <div className="profile-button">
              <div className="avatar">
                {currentUser?.fullname?.[0] || 'U'}
              </div>
              <div className="profile-info">
                <span className="user-name">{currentUser?.fullname || 'User'}</span>
                <span className="user-role">{currentUser?.role || 'Developer'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="patient-info-content">
        <div className="patient-info-container">
          {/* Patient header with back button and actions */}
          <PatientInfoHeader 
            patient={patient} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
          />
          
          {/* Tabs navigation */}
          <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Tab content */}
          <div className="tab-content">
            {activeTab === 'general' && (
              <GeneralInformationSection patient={patient} />
            )}
            {activeTab === 'medical' && (
              <div className="medical-info-placeholder">
                <div className="placeholder-content">
                  <i className="fas fa-notes-medical"></i>
                  <p>Medical Information Section</p>
                  <span>This section will be developed in the next phase</span>
                </div>
              </div>
            )}
            {activeTab === 'disciplines' && (
              <div className="disciplines-placeholder">
                <div className="placeholder-content">
                  <i className="fas fa-user-md"></i>
                  <p>Disciplines Section</p>
                  <span>This section will be developed in the next phase</span>
                </div>
              </div>
            )}
            {activeTab === 'schedule' && (
              <div className="schedule-placeholder">
                <div className="placeholder-content">
                  <i className="fas fa-calendar-alt"></i>
                  <p>Schedule Section</p>
                  <span>This section will be developed in the next phase</span>
                </div>
              </div>
            )}
            {activeTab === 'exercises' && (
              <div className="exercises-placeholder">
                <div className="placeholder-content">
                  <i className="fas fa-dumbbell"></i>
                  <p>Exercises Section</p>
                  <span>This section will be developed in the next phase</span>
                </div>
              </div>
            )}
            {activeTab === 'documents' && (
              <div className="documents-placeholder">
                <div className="placeholder-content">
                  <i className="fas fa-file-alt"></i>
                  <p>Documents Section</p>
                  <span>This section will be developed in the next phase</span>
                </div>
              </div>
            )}
            {activeTab === 'notes' && (
              <div className="notes-placeholder">
                <div className="placeholder-content">
                  <i className="fas fa-sticky-note"></i>
                  <p>Notes Section</p>
                  <span>This section will be developed in the next phase</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
};

export default PatientInfoPage;