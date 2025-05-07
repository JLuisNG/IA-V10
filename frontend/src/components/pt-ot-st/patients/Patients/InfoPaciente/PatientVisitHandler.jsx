import React, { useState, useEffect } from 'react';
import VisitModalComponent from './VisitModalComponent';
import '../../../../../styles/developer/Patients/InfoPaciente/PatientVisitHandler.scss';

const PatientVisitHandler = ({ patient }) => {
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [certPeriodDates, setCertPeriodDates] = useState({
    startDate: '2024-11-30',
    endDate: '2025-01-28',
  });

  // Fetch visits on component mount
  useEffect(() => {
    const loadVisits = async () => {
      setIsLoading(true);
      try {
        const fetchedVisits = await fetchVisits(patient.id);
        setVisits(fetchedVisits);
      } catch (err) {
        console.error('Failed to fetch visits:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (patient?.id) {
      loadVisits();
    }
  }, [patient?.id]);

  // Simulated API for fetching visits
  const fetchVisits = async (patientId) => {
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock visits data - replace with API response
        const mockVisits = [
          {
            id: 1,
            visitType: 'INITIAL',
            therapist: 'pt1',
            date: '2025-02-11',
            time: '14:15',
            notes: 'Initial evaluation for physical therapy',
            status: 'COMPLETED',
            documents: ['evaluation_form.pdf'],
          },
          {
            id: 2,
            visitType: 'REGULAR',
            therapist: 'pt1',
            date: '2025-02-13',
            time: '15:45',
            notes: 'Follow-up session for gait training',
            status: 'MISSED',
            missedReason: 'Patient was not available',
          },
          {
            id: 3,
            visitType: 'RECERT',
            therapist: 'pt1',
            date: '2025-02-18',
            time: '',
            notes: 'Recertification evaluation for continued therapy',
            status: 'SCHEDULED',
            documents: [],
          },
          {
            id: 4,
            visitType: 'REGULAR',
            therapist: 'pt1',
            date: '2025-02-24',
            time: '15:30',
            notes: 'Regular therapy session',
            status: 'COMPLETED',
            documents: ['progress_note.pdf'],
          },
          {
            id: 5,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-02-26',
            time: '14:45',
            notes: 'PTA follow-up session',
            status: 'COMPLETED',
            documents: ['progress_note.pdf'],
          },
          {
            id: 6,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-03-04',
            time: '13:45',
            notes: 'PTA follow-up session',
            status: 'COMPLETED',
            documents: ['progress_note.pdf'],
          },
          {
            id: 7,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-03-06',
            time: '15:30',
            notes: 'PTA follow-up session',
            status: 'SCHEDULED',
          },
          {
            id: 8,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-03-10',
            time: '13:45',
            notes: 'PTA follow-up session',
            status: 'SCHEDULED',
          },
          {
            id: 9,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-03-13',
            time: '13:45',
            notes: 'PTA follow-up session',
            status: 'SCHEDULED',
          },
          {
            id: 10,
            visitType: 'REASSESSMENT',
            therapist: 'pt1',
            date: '2025-03-18',
            time: '',
            notes: 'Reassessment for progress evaluation',
            status: 'SCHEDULED',
          },
          {
            id: 11,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-03-25',
            time: '',
            notes: 'Regular PTA session',
            status: 'SCHEDULED',
          },
          {
            id: 12,
            visitType: 'REGULAR',
            therapist: 'ot1',
            date: '2025-03-27',
            time: '',
            notes: 'Occupational therapy session',
            status: 'SCHEDULED',
          },
          {
            id: 13,
            visitType: 'REGULAR',
            therapist: 'cota1',
            date: '2025-04-01',
            time: '13:15',
            notes: 'COTA session',
            status: 'PENDING',
            pendingReason: 'Pending cosignature',
          },
          {
            id: 14,
            visitType: 'REGULAR',
            therapist: 'st1',
            date: '2025-04-03',
            time: '14:45',
            notes: 'Speech therapy session',
            status: 'PENDING',
            pendingReason: 'Pending cosignature',
          },
          {
            id: 15,
            visitType: 'INITIAL',
            therapist: 'pta1',
            date: '2025-04-28',
            time: '10:30',
            notes: 'Initial evaluation with Maria Gonzalez',
            status: 'SCHEDULED',
          },
        ];
        resolve(mockVisits);
      }, 1000);
    });
  };

  // Simulated API for adding/updating visits
  const saveVisit = async (visitData) => {
    setIsLoading(true);
    
    try {
      if (selectedVisit) {
        // Update existing visit
        const updatedVisits = visits.map(visit => 
          visit.id === selectedVisit.id ? { ...visit, ...visitData } : visit
        );
        setVisits(updatedVisits);
      } else {
        // Add new visit
        const newVisit = {
          id: visits.length > 0 ? Math.max(...visits.map(v => v.id)) + 1 : 1,
          ...visitData,
        };
        setVisits([...visits, newVisit]);
      }
    } catch (err) {
      console.error('Failed to save visit:', err);
    } finally {
      setIsLoading(false);
      setModalOpen(false);
      setSelectedVisit(null);
    }
  };

  // Open modal for creating a new visit
  const handleAddVisit = () => {
    setSelectedVisit(null);
    setModalOpen(true);
  };

  // Open modal for viewing/editing an existing visit
  const handleViewVisit = (visit) => {
    setSelectedVisit(visit);
    setModalOpen(true);
  };

  // Format date to local string
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Handle showing calendar view
  const handleShowCalendar = () => {
    setIsCalendarView(true);
  };

  // Handle going back to list view
  const handleBackToList = () => {
    setIsCalendarView(false);
  };

  // Format date for calendar
  const formatDateToLocalISOString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get visits for a specific day
  const getVisitsForDay = (date) => {
    const dateString = formatDateToLocalISOString(date);
    return visits.filter(visit => visit.date === dateString);
  };

  // Filter visits based on active filter and search query
  const getFilteredVisits = () => {
    let filtered = [...visits];
    
    // Filter by status
    if (activeFilter !== 'ALL') {
      filtered = filtered.filter(visit => visit.status === activeFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(visit => {
        return (
          visit.notes?.toLowerCase().includes(query) ||
          visit.date?.includes(query) ||
          visit.visitType?.toLowerCase().includes(query)
        );
      });
    }
    
    return filtered;
  };

  // Group visits by month
  const groupVisitsByMonth = () => {
    const filtered = getFilteredVisits();
    const grouped = {};
    
    filtered.forEach(visit => {
      const date = new Date(visit.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(visit);
    });
    
    // Sort visits within each month by date
    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    
    return grouped;
  };

  // Get therapist info
  const getTherapistInfo = (therapistId) => {
    const therapists = {
      'pt1': { name: 'Dr. Michael Chen', type: 'PT' },
      'pta1': { name: 'Maria Gonzalez', type: 'PTA' },
      'ot1': { name: 'Dr. Emily Parker', type: 'OT' },
      'cota1': { name: 'Thomas Smith', type: 'COTA' },
      'st1': { name: 'Dr. Jessica Lee', type: 'ST' },
      'sta1': { name: 'Robert Williams', type: 'STA' },
    };
    
    return therapists[therapistId] || { name: 'Unknown Therapist', type: 'N/A' };
  };

  // Get visit type label
  const getVisitTypeLabel = (typeId) => {
    const visitTypes = {
      'INITIAL': 'Initial Eval',
      'REGULAR': 'Regular therapy session',
      'RECERT': 'Recertification evaluation',
      'DISCHARGE': 'Discharge',
      'POST_HOSPITAL': 'Post-Hospital Eval',
      'REASSESSMENT': 'Reassessment',
      'SOC_OASIS': 'SOC OASIS',
      'ROC_OASIS': 'ROC OASIS',
      'RECERT_OASIS': 'ReCert OASIS',
      'FOLLOWUP_OASIS': 'Follow-Up OASIS',
      'DC_OASIS': 'DC OASIS',
      'SUPERVISION': 'Supervision Assessment',
    };
    
    return visitTypes[typeId] || typeId;
  };

  // Get status label and color
  const getStatusInfo = (statusId) => {
    const statusMap = {
      'SCHEDULED': { label: 'Scheduled', color: '#10b981' },
      'COMPLETED': { label: 'Completed', color: '#3b82f6' },
      'MISSED': { label: 'Missed', color: '#ef4444' },
      'PENDING': { label: 'Pending', color: '#f59e0b' },
      'CANCELLED': { label: 'Cancelled', color: '#64748b' },
    };
    
    return statusMap[statusId] || { label: statusId, color: '#64748b' };
  };

  // Therapist type colors
  const getTherapistColors = (therapistId) => {
    const therapistType = getTherapistInfo(therapistId).type;
    const colorMap = {
      'PT': { primary: '#4f46e5', secondary: '#e0e7ff' },
      'PTA': { primary: '#6366f1', secondary: '#e0e7ff' },
      'OT': { primary: '#0ea5e9', secondary: '#e0f2fe' },
      'COTA': { primary: '#38bdf8', secondary: '#e0f2fe' },
      'ST': { primary: '#14b8a6', secondary: '#d1fae5' },
      'STA': { primary: '#2dd4bf', secondary: '#d1fae5' },
    };
    
    return colorMap[therapistType] || { primary: '#64748b', secondary: '#f1f5f9' };
  };

  // Render visit list view
  const renderVisitsList = () => {
    const groupedVisits = groupVisitsByMonth();
    const sortedMonths = Object.keys(groupedVisits).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA - dateB;
    });
    
    if (sortedMonths.length === 0) {
      return (
        <div className="empty-visits">
          <div className="empty-icon">
            <i className="fas fa-calendar-times"></i>
          </div>
          <h3>No Visits Found</h3>
          <p>No therapy visits match the current filters or no visits have been scheduled yet.</p>
          <button className="schedule-first-visit" onClick={handleAddVisit}>
            <i className="fas fa-plus-circle"></i>
            <span>Schedule First Visit</span>
          </button>
        </div>
      );
    }
    
    return (
      <div className="visits-timeline">
        {sortedMonths.map(month => (
          <div key={month} className="month-group">
            <div className="month-header">
              <div className="month-title">
                <i className="fas fa-calendar-alt"></i>
                <h4>{month}</h4>
              </div>
              <span className="visit-count">
                {groupedVisits[month].length} {groupedVisits[month].length === 1 ? 'visit' : 'visits'}
              </span>
            </div>
            <div className="month-visits">
              {groupedVisits[month].map(visit => {
                const therapistInfo = getTherapistInfo(visit.therapist);
                const statusInfo = getStatusInfo(visit.status);
                const therapistColors = getTherapistColors(visit.therapist);
                
                return (
                  <div 
                    key={visit.id} 
                    className="visit-card"
                    onClick={() => handleViewVisit(visit)}
                    style={{
                      borderTopColor: therapistColors.primary,
                    }}
                  >
                    <div 
                      className="visit-header"
                      style={{
                        backgroundColor: therapistColors.secondary,
                        color: therapistColors.primary,
                      }}
                    >
                      <div className="visit-type">
                        {getVisitTypeLabel(visit.visitType)}
                      </div>
                      <div 
                        className="visit-status"
                        style={{
                          backgroundColor: statusInfo.color,
                          color: 'white',
                        }}
                      >
                        {statusInfo.label}
                      </div>
                    </div>
                    
                    <div className="visit-body">
                      <div className="visit-date-time">
                        <i className="fas fa-calendar"></i>
                        <div className="date-time-details">
                          <span className="visit-date">{formatDate(visit.date)}</span>
                          {visit.time && <span className="visit-time">{formatTime(visit.time)}</span>}
                        </div>
                      </div>
                      
                      <div className="visit-therapist">
                        <div 
                          className="therapist-icon"
                          style={{ backgroundColor: therapistColors.primary }}
                        >
                          {therapistInfo.type}
                        </div>
                        <span>{therapistInfo.name}</span>
                      </div>
                      
                      {visit.notes && (
                        <div className="visit-notes">
                          <i className="fas fa-sticky-note"></i>
                          <span>{visit.notes}</span>
                        </div>
                      )}
                      
                      {visit.missedReason && (
                        <div className="visit-missed-reason">
                          <i className="fas fa-exclamation-circle"></i>
                          <span>{visit.missedReason}</span>
                        </div>
                      )}
                      
                      {visit.documents && visit.documents.length > 0 && (
                        <div className="visit-documents">
                          <i className="fas fa-file-alt"></i>
                          <span>
                            {visit.documents.length} {visit.documents.length === 1 ? 'Document' : 'Documents'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render calendar view
  const renderCalendarView = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysArray = [];

    // Add empty days for padding
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="calendar-view">
        <div className="calendar-header">
          <button
            className="month-nav-btn prev"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <button
            className="month-nav-btn next"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="weekdays">
          {weekDays.map((day, index) => (
            <div key={index} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {daysArray.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="calendar-day empty"></div>;
            }

            const dayVisits = getVisitsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const hasVisits = dayVisits.length > 0;

            return (
              <div
                key={day.getTime()}
                className={`calendar-day ${hasVisits ? 'has-visits' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => {
                  setSelectedVisit(null);
                  setModalOpen(true);
                }}
              >
                <div className="day-number">{day.getDate()}</div>

                {hasVisits && (
                  <div className="day-visits">
                    {dayVisits.slice(0, 3).map((visit, vIndex) => {
                      const therapistColors = getTherapistColors(visit.therapist);
                      const statusInfo = getStatusInfo(visit.status);
                      
                      return (
                        <div
                          key={visit.id}
                          className="visit-preview"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewVisit(visit);
                          }}
                          style={{
                            backgroundColor: therapistColors.secondary,
                            borderLeft: `3px solid ${therapistColors.primary}`,
                          }}
                        >
                          <span className="visit-time">{visit.time ? formatTime(visit.time) : '—'}</span>
                          <span 
                            className="visit-title"
                            style={{ color: therapistColors.primary }}
                          >
                            {getVisitTypeLabel(visit.visitType).substring(0, 15)}
                            {getVisitTypeLabel(visit.visitType).length > 15 ? '...' : ''}
                          </span>
                          <span 
                            className="visit-status-dot"
                            style={{ backgroundColor: statusInfo.color }}
                            title={statusInfo.label}
                          ></span>
                        </div>
                      );
                    })}
                    
                    {dayVisits.length > 3 && (
                      <div className="more-visits">
                        +{dayVisits.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="patient-visit-handler">
      <div className="handler-header">
        <div className="header-title">
          <i className="fas fa-calendar-alt"></i>
          <h2>Patient Schedule</h2>
        </div>
        
        <div className="header-actions">
          {isCalendarView ? (
            <button className="back-btn" onClick={handleBackToList}>
              <i className="fas fa-arrow-left"></i>
              <span>Back to List</span>
            </button>
          ) : (
            <>
              <button className="quick-add-btn" onClick={handleAddVisit}>
                <i className="fas fa-plus"></i>
                <span>Quick Add</span>
              </button>
              <button className="calendar-view-btn" onClick={handleShowCalendar}>
                <i className="fas fa-calendar-alt"></i>
                <span>View Calendar</span>
              </button>
            </>
          )}
        </div>
      </div>
      
      {!isCalendarView && (
        <div className="filter-bar">
          <div className="filter-pills">
            <button
              className={`filter-pill ${activeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ALL')}
            >
              All
            </button>
            <button
              className={`filter-pill ${activeFilter === 'SCHEDULED' ? 'active' : ''}`}
              onClick={() => setActiveFilter('SCHEDULED')}
            >
              Upcoming
            </button>
            <button
              className={`filter-pill ${activeFilter === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => setActiveFilter('COMPLETED')}
            >
              Completed
            </button>
            <button
              className={`filter-pill ${activeFilter === 'MISSED' ? 'active' : ''}`}
              onClick={() => setActiveFilter('MISSED')}
            >
              Missed
            </button>
            <button
              className={`filter-pill ${activeFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setActiveFilter('PENDING')}
            >
              Pending
            </button>
          </div>
          
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search visits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="content-area">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Loading visits...</span>
          </div>
        ) : (
          isCalendarView ? renderCalendarView() : renderVisitsList()
        )}
      </div>
      
      <div className="floating-add-btn">
        <button onClick={handleAddVisit}>
          <i className="fas fa-plus"></i>
        </button>
        <div className="tooltip">Add New Visit</div>
      </div>
      
      <VisitModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        visitData={selectedVisit}
        onSave={saveVisit}
        certPeriodDates={certPeriodDates}
        patientInfo={patient}
        visitStatus={selectedVisit?.status || 'SCHEDULED'}
      />
    </div>
  );
};

export default PatientVisitHandler;