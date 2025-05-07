import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/developer/Referrals/ReferralStats.scss';
import LoadingScreen from './CreateNF/LoadingDates';

const ReferralStats = () => {
  const navigate = useNavigate();
  
  // State for loading and UI controls
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingChanges, setViewingChanges] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Mock patient data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Vargas, Javier',
      status: 'active',
      therapist: { type: 'PT', name: 'Regina Araquel' },
      phone: '(310) 808-5631',
      address: 'Los Angeles, CA 90025',
      certPeriod: '04-19-2023 to 04-19-2025',
      changes: [
        { 
          field: 'Phone Number', 
          oldValue: '(310) 555-1234', 
          newValue: '(310) 808-5631', 
          changedBy: 'James Wilson', 
          date: '02-15-2024', 
          time: '14:32' 
        },
        { 
          field: 'Therapist', 
          oldValue: 'Sarah Parker', 
          newValue: 'Regina Araquel', 
          changedBy: 'Michael Chen', 
          date: '01-30-2024', 
          time: '09:15' 
        },
        { 
          field: 'Status', 
          oldValue: 'pending', 
          newValue: 'active', 
          changedBy: 'James Wilson', 
          date: '12-05-2023', 
          time: '11:47' 
        }
      ]
    },
    {
      id: 2,
      name: 'Nava, Luis',
      status: 'inactive',
      therapist: { type: 'OT', name: 'James Lee' },
      phone: '(310) 808-5631',
      address: 'Los Angeles, CA 90025',
      certPeriod: '04-19-2023 to 04-19-2025',
      changes: [
        { 
          field: 'Status', 
          oldValue: 'active', 
          newValue: 'inactive', 
          changedBy: 'Regina Araquel', 
          date: '03-10-2024', 
          time: '16:05' 
        },
        { 
          field: 'Address', 
          oldValue: 'Santa Monica, CA 90401', 
          newValue: 'Los Angeles, CA 90025', 
          changedBy: 'Sarah Parker', 
          date: '02-22-2024', 
          time: '10:23' 
        }
      ]
    },
    {
      id: 3,
      name: 'Thompson, Emma',
      status: 'active',
      therapist: { type: 'ST', name: 'Junni Silva' },
      phone: '(213) 456-7890',
      address: 'Beverly Hills, CA 90210',
      certPeriod: '06-01-2023 to 06-01-2025',
      changes: [
        { 
          field: 'Therapist', 
          oldValue: 'Richard Lai', 
          newValue: 'Junni Silva', 
          changedBy: 'Michael Chen', 
          date: '03-15-2024', 
          time: '13:45' 
        }
      ]
    },
    {
      id: 4,
      name: 'Martinez, Carlos',
      status: 'pending',
      therapist: { type: 'PT', name: 'Willie Blackwell' },
      phone: '(323) 987-6543',
      address: 'Glendale, CA 91204',
      certPeriod: '02-15-2024 to 02-15-2026',
      changes: [
        { 
          field: 'Cert Period', 
          oldValue: '01-15-2024 to 01-15-2026', 
          newValue: '02-15-2024 to 02-15-2026', 
          changedBy: 'Regina Araquel', 
          date: '02-10-2024', 
          time: '09:30' 
        }
      ]
    },
    {
      id: 5,
      name: 'Johnson, Robert',
      status: 'active',
      therapist: { type: 'OT', name: 'Richard Lai' },
      phone: '(424) 789-0123',
      address: 'Long Beach, CA 90802',
      certPeriod: '11-05-2023 to 11-05-2025',
      changes: []
    }
  ]);

  const modalRef = useRef(null);

  // Handle outside click for modal
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setViewingChanges(false);
      }
    };
    
    if (viewingChanges) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [viewingChanges]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Sort patients
  const sortedPatients = [...patients].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'therapist':
        aValue = a.therapist.name;
        bValue = b.therapist.name;
        break;
      default:
        aValue = a[sortField];
        bValue = b[sortField];
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Filter patients
  const filteredPatients = sortedPatients.filter(patient => {
    return (
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Paginate patients
  const patientsPerPage = 10;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle view changes
  const handleViewChanges = (patient) => {
    setSelectedPatient(patient);
    setViewingChanges(true);
  };

  // Handle edit patient (would navigate to edit page)
  const handleEditPatient = (id) => {
    navigate(`/developer/editReferral/${id}`);
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let className = "status-badge";
    
    switch (status.toLowerCase()) {
      case 'active':
        className += " status-active";
        break;
      case 'inactive':
        className += " status-inactive";
        break;
      case 'pending':
        className += " status-pending";
        break;
      default:
        break;
    }
    
    return (
      <div className={className}>
        <span className="status-dot"></span>
        <span className="status-text">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
    );
  };

  return (
    <div className="referral-stats-container">
      {isLoading ? (
        <LoadingScreen isLoading={true} />
      ) : (
        <>
          <div className="stats-header">
            <div className="header-title">
              <h2>
                <i className="fas fa-chart-bar"></i>
                Patient Referrals History
              </h2>
              <p>View and manage patient referrals and their change history</p>
            </div>
            
            <div className="search-filters">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Search patients by name, phone, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              
              <div className="view-controls">
                <button 
                  className={`view-control ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  className={`view-control ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
              
              <div className="sort-control">
                <button className="sort-button">
                  <i className="fas fa-sort-amount-down"></i>
                  <span>Sort by {sortField.charAt(0).toUpperCase() + sortField.slice(1)} ({sortDirection.toUpperCase()})</span>
                </button>
                
                <div className="sort-dropdown">
                  <div className="sort-option" onClick={() => handleSort('name')}>
                    <i className="fas fa-font"></i>
                    <span>Name</span>
                  </div>
                  <div className="sort-option" onClick={() => handleSort('id')}>
                    <i className="fas fa-hashtag"></i>
                    <span>ID</span>
                  </div>
                  <div className="sort-option" onClick={() => handleSort('status')}>
                    <i className="fas fa-toggle-on"></i>
                    <span>Status</span>
                  </div>
                  <div className="sort-option" onClick={() => handleSort('therapist')}>
                    <i className="fas fa-user-md"></i>
                    <span>Therapist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Patient List */}
          <div className={`patients-container ${viewMode}-view`}>
            {viewMode === 'grid' ? (
              <div className="patients-grid">
                {currentPatients.map(patient => (
                  <div key={patient.id} className="patient-card">
                    <div className="card-header">
                      <h3>{patient.name}</h3>
                      <StatusBadge status={patient.status} />
                    </div>
                    
                    <div className="card-id">#{patient.id}</div>
                    
                    <div className="card-details">
                      <div className="detail-item">
                        <i className="fas fa-user-md"></i>
                        <div className="detail-content">
                          <span className="detail-label">Therapist</span>
                          <span className="detail-value">
                            <span className="therapist-type">{patient.therapist.type}</span>
                            {patient.therapist.name}
                          </span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <i className="fas fa-phone-alt"></i>
                        <div className="detail-content">
                          <span className="detail-label">Phone</span>
                          <span className="detail-value">{patient.phone}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <div className="detail-content">
                          <span className="detail-label">Address</span>
                          <span className="detail-value">{patient.address}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <i className="fas fa-calendar-alt"></i>
                        <div className="detail-content">
                          <span className="detail-label">Cert Period</span>
                          <span className="detail-value">{patient.certPeriod}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-changes">
                      <span className="changes-count">
                        <i className="fas fa-history"></i>
                        {patient.changes.length} {patient.changes.length === 1 ? 'change' : 'changes'}
                      </span>
                    </div>
                    
                    <div className="card-actions">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleViewChanges(patient)}
                        disabled={patient.changes.length === 0}
                      >
                        <i className="fas fa-history"></i>
                        <span>View Changes</span>
                      </button>
                      
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditPatient(patient.id)}
                      >
                        <i className="fas fa-edit"></i>
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="patients-table">
                <table>
                  <thead>
                    <tr>
                      <th className={sortField === 'id' ? 'sorted' : ''} onClick={() => handleSort('id')}>
                        ID
                        {sortField === 'id' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th className={sortField === 'name' ? 'sorted' : ''} onClick={() => handleSort('name')}>
                        Name
                        {sortField === 'name' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th className={sortField === 'therapist' ? 'sorted' : ''} onClick={() => handleSort('therapist')}>
                        Therapist
                        {sortField === 'therapist' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th className={sortField === 'status' ? 'sorted' : ''} onClick={() => handleSort('status')}>
                        Status
                        {sortField === 'status' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Cert Period</th>
                      <th>Changes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPatients.map(patient => (
                      <tr key={patient.id}>
                        <td className="patient-id">{patient.id}</td>
                        <td className="patient-name">{patient.name}</td>
                        <td className="patient-therapist">
                          <span className="therapist-type">{patient.therapist.type}</span>
                          {patient.therapist.name}
                        </td>
                        <td className="patient-status">
                          <StatusBadge status={patient.status} />
                        </td>
                        <td className="patient-phone">{patient.phone}</td>
                        <td className="patient-address">{patient.address}</td>
                        <td className="patient-cert">{patient.certPeriod}</td>
                        <td className="patient-changes">
                          <span className="changes-count">
                            <i className="fas fa-history"></i>
                            {patient.changes.length}
                          </span>
                        </td>
                        <td className="patient-actions">
                          <button 
                            className="action-icon view-icon"
                            onClick={() => handleViewChanges(patient)}
                            disabled={patient.changes.length === 0}
                            title="View Changes"
                          >
                            <i className="fas fa-history"></i>
                          </button>
                          
                          <button 
                            className="action-icon edit-icon"
                            onClick={() => handleEditPatient(patient.id)}
                            title="Edit Patient"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination controls */}
            <div className="pagination-controls">
              <div className="pagination-info">
                Showing {indexOfFirstPatient + 1}-{Math.min(indexOfLastPatient, filteredPatients.length)} of {filteredPatients.length} patients
              </div>
              
              <div className="pagination-buttons">
                <button 
                  className="pagination-btn"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-angle-double-left"></i>
                </button>
                <button 
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-angle-left"></i>
                </button>
                
                <div className="pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    let pageNum;
                    
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }
                    
                    return (
                      <button 
                        key={pageNum}
                        className={`pagination-btn page-num ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-angle-right"></i>
                </button>
                <button 
                  className="pagination-btn"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-angle-double-right"></i>
                </button>
              </div>
            </div>
          </div>
          
          {/* Modal for viewing changes */}
          {viewingChanges && selectedPatient && (
            <div className="changes-modal-overlay">
              <div className="changes-modal" ref={modalRef}>
                <div className="modal-header">
                  <h3>
                    <i className="fas fa-history"></i>
                    Change History for {selectedPatient.name}
                  </h3>
                  <button 
                    className="close-modal"
                    onClick={() => setViewingChanges(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="modal-content">
                  {selectedPatient.changes.length === 0 ? (
                    <div className="no-changes">
                      <i className="fas fa-info-circle"></i>
                      <p>No changes have been recorded for this patient.</p>
                    </div>
                  ) : (
                    <div className="changes-timeline">
                      {selectedPatient.changes.map((change, index) => (
                        <div className="timeline-item" key={index}>
                          <div className="timeline-icon">
                            <i className="fas fa-exchange-alt"></i>
                          </div>
                          
                          <div className="timeline-content">
                            <div className="change-header">
                              <div className="change-title">
                                <span className="field-changed">{change.field}</span> was updated
                              </div>
                              <div className="change-date">
                                <i className="fas fa-calendar-day"></i>
                                {change.date}
                                <i className="fas fa-clock ml-2"></i>
                                {change.time}
                              </div>
                            </div>
                            
                            <div className="change-details">
                              <div className="change-row">
                                <div className="change-label">From:</div>
                                <div className="change-value old-value">{change.oldValue}</div>
                              </div>
                              <div className="change-row">
                                <div className="change-label">To:</div>
                                <div className="change-value new-value">{change.newValue}</div>
                              </div>
                            </div>
                            
                            <div className="change-by">
                              <i className="fas fa-user"></i>
                              Modified by <span className="user-name">{change.changedBy}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="modal-footer">
                  <button 
                    className="close-btn"
                    onClick={() => setViewingChanges(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReferralStats;