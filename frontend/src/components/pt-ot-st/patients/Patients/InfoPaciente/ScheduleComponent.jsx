import React, { useState, useEffect } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/ScheduleComponent.scss';

const ScheduleComponent = ({ patient, onUpdateSchedule }) => {
  // Estados para controlar las vistas y datos
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [showEditVisitModal, setShowEditVisitModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteVisitId, setDeleteVisitId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Datos para formularios
  const [formData, setFormData] = useState({
    visitType: '',
    therapist: '',
    date: '',
    time: '',
    notes: '',
    status: 'SCHEDULED', // Por defecto
    missedReason: ''
  });
  
  // Tipos de visitas disponibles
  const visitTypes = [
    { id: 'INITIAL', label: 'Initial Eval' },
    { id: 'REGULAR', label: 'Regular therapy session' },
    { id: 'RECERT', label: 'Recertification evaluation' },
    { id: 'DISCHARGE', label: 'Discharge (DC w/o a visit)' },
    { id: 'POST_HOSPITAL', label: 'Post-Hospital Eval' },
    { id: 'REASSESSMENT', label: 'Reassessment' },
    { id: 'SOC_OASIS', label: 'SOC OASIS' },
    { id: 'ROC_OASIS', label: 'ROC OASIS' },
    { id: 'RECERT_OASIS', label: 'ReCert OASIS' },
    { id: 'FOLLOWUP_OASIS', label: 'Follow-Up OASIS' },
    { id: 'DC_OASIS', label: 'DC OASIS' },
    { id: 'SUPERVISION', label: 'Supervision Assessment' }
  ];
  
  // Estados de visitas
  const visitStatus = [
    { id: 'SCHEDULED', label: 'Scheduled', color: '#10b981' },
    { id: 'COMPLETED', label: 'Completed', color: '#3b82f6' },
    { id: 'MISSED', label: 'Missed', color: '#ef4444' },
    { id: 'PENDING', label: 'Pending', color: '#f59e0b' },
    { id: 'CANCELLED', label: 'Cancelled', color: '#64748b' }
  ];
  
  // Color psychology para disciplinas terapéuticas
  const therapistTypeColors = {
    PT: { primary: '#4f46e5', secondary: '#e0e7ff' },   // Morado - fuerza, disciplina
    PTA: { primary: '#6366f1', secondary: '#e0e7ff' },  // Morado más claro
    OT: { primary: '#0ea5e9', secondary: '#e0f2fe' },   // Azul - calma, adaptabilidad
    COTA: { primary: '#38bdf8', secondary: '#e0f2fe' }, // Azul más claro
    ST: { primary: '#14b8a6', secondary: '#d1fae5' },   // Verde-azulado - comunicación
    STA: { primary: '#2dd4bf', secondary: '#d1fae5' }   // Verde-azulado más claro
  };
  
  // Datos de terapeutas
  const therapists = [
    { id: 'pt1', name: 'Dr. Michael Chen', type: 'PT' },
    { id: 'pta1', name: 'Maria Gonzalez', type: 'PTA' },
    { id: 'ot1', name: 'Dr. Emily Parker', type: 'OT' },
    { id: 'cota1', name: 'Thomas Smith', type: 'COTA' },
    { id: 'st1', name: 'Dr. Jessica Lee', type: 'ST' },
    { id: 'sta1', name: 'Robert Williams', type: 'STA' }
  ];
  
  // Datos de visitas de ejemplo (simulando datos de la API)
  useEffect(() => {
    // Simular carga de datos
    const mockVisits = [
      {
        id: 1,
        visitType: 'INITIAL',
        therapist: 'pt1',
        date: '2025-02-11',
        time: '14:15',
        notes: 'Initial evaluation for physical therapy',
        status: 'COMPLETED',
        documents: ['evaluation_form.pdf']
      },
      {
        id: 2,
        visitType: 'REGULAR',
        therapist: 'pt1',
        date: '2025-02-13',
        time: '15:45',
        notes: 'Follow-up session for gait training',
        status: 'MISSED',
        missedReason: 'Patient was not available'
      },
      {
        id: 3,
        visitType: 'RECERT',
        therapist: 'pt1',
        date: '2025-02-18',
        time: '',
        notes: 'Recertification evaluation for continued therapy',
        status: 'SCHEDULED',
        documents: []
      },
      {
        id: 4,
        visitType: 'REGULAR',
        therapist: 'pt1',
        date: '2025-02-24',
        time: '15:30',
        notes: 'Regular therapy session',
        status: 'COMPLETED',
        documents: ['progress_note.pdf']
      },
      {
        id: 5,
        visitType: 'REGULAR',
        therapist: 'pta1',
        date: '2025-02-26',
        time: '14:45',
        notes: 'PTA follow-up session',
        status: 'COMPLETED',
        documents: ['progress_note.pdf']
      },
      {
        id: 6,
        visitType: 'REGULAR',
        therapist: 'pta1',
        date: '2025-03-04',
        time: '13:45',
        notes: 'PTA follow-up session',
        status: 'COMPLETED',
        documents: ['progress_note.pdf']
      },
      {
        id: 7,
        visitType: 'REGULAR',
        therapist: 'pta1',
        date: '2025-03-06',
        time: '15:30',
        notes: 'PTA follow-up session',
        status: 'SCHEDULED'
      },
      {
        id: 8,
        visitType: 'REGULAR',
        therapist: 'pta1',
        date: '2025-03-10',
        time: '13:45',
        notes: 'PTA follow-up session',
        status: 'SCHEDULED'
      },
      {
        id: 9,
        visitType: 'REGULAR',
        therapist: 'pta1',
        date: '2025-03-13',
        time: '13:45',
        notes: 'PTA follow-up session',
        status: 'SCHEDULED'
      },
      {
        id: 10,
        visitType: 'REASSESSMENT',
        therapist: 'pt1',
        date: '2025-03-18',
        time: '',
        notes: 'Reassessment for progress evaluation',
        status: 'SCHEDULED'
      },
      {
        id: 11,
        visitType: 'REGULAR',
        therapist: 'pta1',
        date: '2025-03-25',
        time: '',
        notes: 'Regular PTA session',
        status: 'SCHEDULED'
      },
      {
        id: 12,
        visitType: 'REGULAR',
        therapist: 'ot1',
        date: '2025-03-27',
        time: '',
        notes: 'Occupational therapy session',
        status: 'SCHEDULED'
      },
      {
        id: 13,
        visitType: 'REGULAR',
        therapist: 'cota1',
        date: '2025-04-01',
        time: '13:15',
        notes: 'COTA session',
        status: 'PENDING',
        pendingReason: 'Pending cosignature'
      },
      {
        id: 14,
        visitType: 'REGULAR',
        therapist: 'st1',
        date: '2025-04-03',
        time: '14:45',
        notes: 'Speech therapy session',
        status: 'PENDING',
        pendingReason: 'Pending cosignature'
      },
      {
        id: 15,
        visitType: 'REGULAR',
        therapist: 'sta1',
        date: '2025-04-05',
        time: '10:30',
        notes: 'Speech therapy assistant session',
        status: 'SCHEDULED'
      }
    ];
    
    setVisits(mockVisits);
  }, []);
  
  // Función para mostrar el calendario
  const handleShowCalendar = () => {
    setIsLoading(true);
    // Simular tiempo de carga
    setTimeout(() => {
      setIsCalendarView(true);
      setIsLoading(false);
    }, 1000);
  };
  
  // Función para volver a la vista de visitas
  const handleBackToVisits = () => {
    setIsCalendarView(false);
    setSelectedDate(null);
  };
  
  // Función para formatear fecha correctamente y evitar problemas de zona horaria
  const formatDateToLocalISOString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Función para seleccionar una fecha en el calendario
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowAddVisitModal(true);
    
    // Inicializar el formulario con la fecha seleccionada usando el nuevo método de formateo
    setFormData({
      ...formData,
      date: formatDateToLocalISOString(date),
      time: '',
      visitType: '',
      therapist: '',
      notes: '',
      status: 'SCHEDULED',
      missedReason: ''
    });
  };
  
  // Función para abrir el modal de edición
  const handleEditVisit = (visit) => {
    setSelectedVisit(visit);
    setFormData({
      visitType: visit.visitType,
      therapist: visit.therapist,
      date: visit.date,
      time: visit.time || '',
      notes: visit.notes || '',
      status: visit.status,
      missedReason: visit.missedReason || ''
    });
    setShowEditVisitModal(true);
  };
  
  // Función para iniciar el proceso de eliminación de una visita
  const handleInitiateDelete = (visitId) => {
    setDeleteVisitId(visitId);
    setShowDeleteConfirmModal(true);
  };
  
  // Función para eliminar una visita
  const handleDeleteVisit = () => {
    setIsDeleting(true);
    
    // Simular tiempo de carga para la eliminación
    setTimeout(() => {
      // Filtrar las visitas para eliminar la seleccionada
      const updatedVisits = visits.filter(visit => visit.id !== deleteVisitId);
      setVisits(updatedVisits);
      
      // Notificar al componente padre
      if (onUpdateSchedule) {
        onUpdateSchedule(updatedVisits);
      }
      
      setIsDeleting(false);
      setShowDeleteConfirmModal(false);
      setDeleteVisitId(null);
    }, 1500);
  };
  
  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores previos
    setError('');
  };
  
  // Función para validar si la hora está disponible
  const isTimeAvailable = (date, time, therapistId, visitId = null) => {
    const existingVisits = visits.filter(visit => 
      visit.date === date && 
      visit.time === time && 
      visit.therapist === therapistId &&
      (visitId === null || visit.id !== visitId) // Ignorar la visita actual si estamos editando
    );
    
    return existingVisits.length === 0;
  };
  
  // Función para guardar una nueva visita
  const handleSaveVisit = () => {
    // Validar que todos los campos requeridos estén completos
    if (!formData.visitType || !formData.therapist || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Validar si la hora está disponible
    if (formData.time && !isTimeAvailable(formData.date, formData.time, formData.therapist)) {
      setError('This time slot is already booked for the selected therapist');
      return;
    }
    
    // Simular carga al guardar
    setIsLoading(true);
    
    setTimeout(() => {
      // Crear nueva visita
      const newVisit = {
        id: visits.length > 0 ? Math.max(...visits.map(v => v.id)) + 1 : 1,
        ...formData
      };
      
      // Agregar la visita a la lista
      const updatedVisits = [...visits, newVisit];
      setVisits(updatedVisits);
      
      // Notificar al componente padre
      if (onUpdateSchedule) {
        onUpdateSchedule(updatedVisits);
      }
      
      // Cerrar el modal
      setShowAddVisitModal(false);
      setFormData({
        visitType: '',
        therapist: '',
        date: '',
        time: '',
        notes: '',
        status: 'SCHEDULED',
        missedReason: ''
      });
      setIsLoading(false);
    }, 1000);
  };
  
  // Función para actualizar una visita existente
  const handleUpdateVisit = () => {
    // Validar que todos los campos requeridos estén completos
    if (!formData.visitType || !formData.therapist || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Validar si la hora está disponible (ignorando la visita actual)
    if (formData.time && !isTimeAvailable(formData.date, formData.time, formData.therapist, selectedVisit.id)) {
      setError('This time slot is already booked for the selected therapist');
      return;
    }
    
    // Simular carga al actualizar
    setIsLoading(true);
    
    setTimeout(() => {
      // Actualizar la visita
      const updatedVisits = visits.map(visit => 
        visit.id === selectedVisit.id ? { ...visit, ...formData } : visit
      );
      setVisits(updatedVisits);
      
      // Notificar al componente padre
      if (onUpdateSchedule) {
        onUpdateSchedule(updatedVisits);
      }
      
      // Cerrar el modal
      setShowEditVisitModal(false);
      setSelectedVisit(null);
      setFormData({
        visitType: '',
        therapist: '',
        date: '',
        time: '',
        notes: '',
        status: 'SCHEDULED',
        missedReason: ''
      });
      setIsLoading(false);
    }, 1000);
  };
  
  // Obtener el nombre del terapeuta por ID
  const getTherapistName = (therapistId) => {
    const therapist = therapists.find(t => t.id === therapistId);
    return therapist ? therapist.name : 'Unknown';
  };
  
  // Obtener el tipo del terapeuta por ID
  const getTherapistType = (therapistId) => {
    const therapist = therapists.find(t => t.id === therapistId);
    return therapist ? therapist.type : null;
  };
  
  // Obtener colores para un terapeuta específico
  const getTherapistColors = (therapistId) => {
    const therapistType = getTherapistType(therapistId);
    return therapistType && therapistTypeColors[therapistType] 
      ? therapistTypeColors[therapistType] 
      : { primary: '#64748b', secondary: '#f1f5f9' };
  };
  
  // Obtener la etiqueta del tipo de visita por ID
  const getVisitTypeLabel = (typeId) => {
    const type = visitTypes.find(t => t.id === typeId);
    return type ? type.label : typeId;
  };
  
  // Obtener el color de estado por ID
  const getStatusColor = (statusId) => {
    const status = visitStatus.find(s => s.id === statusId);
    return status ? status.color : '#64748b';
  };
  
  // Obtener la etiqueta de estado por ID
  const getStatusLabel = (statusId) => {
    const status = visitStatus.find(s => s.id === statusId);
    return status ? status.label : statusId;
  };
  
  // Filtrar visitas basado en el estado activo
  const getFilteredVisits = () => {
    let filtered = [...visits];
    
    // Aplicar filtro por estado
    if (activeFilter !== 'ALL') {
      filtered = filtered.filter(visit => visit.status === activeFilter);
    }
    
    // Aplicar búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(visit => {
        const therapistName = getTherapistName(visit.therapist).toLowerCase();
        const visitType = getVisitTypeLabel(visit.visitType).toLowerCase();
        const notes = (visit.notes || '').toLowerCase();
        return therapistName.includes(query) || 
               visitType.includes(query) || 
               notes.includes(query) ||
               visit.date.includes(query);
      });
    }
    
    return filtered;
  };
  
  // Función para renderizar el calendario
  const renderCalendar = () => {
    // Obtener el primer y último día del mes actual
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Obtener el día de la semana del primer día del mes (0-6, donde 0 es domingo)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Crear un arreglo para todos los días del mes, incluyendo espacios vacíos para los días anteriores al primer día
    const daysArray = [];
    
    // Agregar espacios vacíos para los días anteriores al primer día del mes
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(null);
    }
    
    // Agregar todos los días del mes
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }
    
    // Nombres de los días de la semana
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Obtener visitas para un día específico
    const getVisitsForDay = (date) => {
      const dateString = formatDateToLocalISOString(date);
      return visits.filter(visit => visit.date === dateString);
    };
    
    return (
      <div className="schedule-calendar">
        <div className="calendar-header">
          <button 
            className="month-nav-btn"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            className="month-nav-btn"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="calendar-weekdays">
          {weekDays.map((day, index) => (
            <div key={index} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {daysArray.map((day, index) => {
            if (!day) return <div key={index} className="calendar-day empty"></div>;
            
            const dayVisits = getVisitsForDay(day);
            const today = new Date();
            const isToday = day.getDate() === today.getDate() && 
                           day.getMonth() === today.getMonth() && 
                           day.getFullYear() === today.getFullYear();
            
            return (
              <div 
                key={index} 
                className={`calendar-day ${dayVisits.length > 0 ? 'has-visits' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="day-number">{day.getDate()}</div>
                
                {dayVisits.length > 0 && (
                  <div className="day-visits-preview">
                    {dayVisits.slice(0, 3).map((visit, vIndex) => {
                      const therapistColors = getTherapistColors(visit.therapist);
                      return (
                        <div 
                          key={vIndex} 
                          className="calendar-visit-pill"
                          style={{ 
                            backgroundColor: therapistColors.secondary,
                            borderLeft: `3px solid ${therapistColors.primary}`
                          }}
                        >
                          <span className="visit-time">{visit.time ? formatTime(visit.time) : '—'}</span>
                          <span className="visit-title" style={{ color: therapistColors.primary }}>
                            {getVisitTypeLabel(visit.visitType).substring(0, 15)}
                            {getVisitTypeLabel(visit.visitType).length > 15 ? '...' : ''}
                          </span>
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

  // Función para renderizar la visita
  const renderVisitCard = (visit) => {
    const therapistColors = getTherapistColors(visit.therapist);
    const statusColor = getStatusColor(visit.status);
    const therapistType = getTherapistType(visit.therapist);
  
    // Descomponer la fecha en partes para evitar problemas de zona horaria
    const [year, month, day] = visit.date.split('-').map(Number);
    const visitDate = new Date(year, month - 1, day); // month es 0-based en JavaScript
  
    return (
      <div 
        className="visit-card" 
        key={visit.id}
        style={{ 
          borderTopColor: therapistColors.primary,
          borderTopWidth: '4px'
        }}
      >
        <div 
          className="visit-card-header" 
          style={{ 
            backgroundColor: therapistColors.secondary,
            color: therapistColors.primary 
          }}
        >
          <div className="visit-type">{getVisitTypeLabel(visit.visitType)}</div>
          <div 
            className="visit-status"
            style={{ 
              backgroundColor: statusColor,
              color: 'white'
            }}
          >
            {getStatusLabel(visit.status)}
          </div>
        </div>
        
        <div className="visit-card-body">
          <div className="visit-date-time">
            <i className="fas fa-calendar"></i>
            <div className="date-time-details">
              <span className="visit-date">
                {visitDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit'
                })}
              </span>
              {visit.time && (
                <span className="visit-time">{formatTime(visit.time)}</span>
              )}
            </div>
          </div>
          
          <div className="visit-therapist">
            <div 
              className="therapist-icon"
              style={{ backgroundColor: therapistColors.primary }}
            >
              {therapistType}
            </div>
            <span>{getTherapistName(visit.therapist)}</span>
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
        
        <div className="visit-card-actions">
          <button 
            className="edit-btn"
            onClick={() => handleEditVisit(visit)}
            aria-label="Edit visit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="delete-btn"
            onClick={() => handleInitiateDelete(visit.id)}
            aria-label="Delete visit"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    );
  };

  // Función para formatear la hora
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Agrupar visitas por mes
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
    
    // Ordenar visitas dentro de cada mes por fecha
    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    
    return grouped;
  };
  
  // Renderizar modal para agregar visita
  const renderAddVisitModal = () => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Schedule New Visit</h3>
            <button className="close-btn" onClick={() => setShowAddVisitModal(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Visit Type</label>
              <select 
                name="visitType" 
                value={formData.visitType} 
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select visit type</option>
                {visitTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Therapist</label>
              <select 
                name="therapist" 
                value={formData.therapist} 
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select therapist</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.id}>{therapist.name} ({therapist.type})</option>
                ))}
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  name="time" 
                  value={formData.time} 
                  onChange={handleInputChange}
                  className="form-input"
                /></div>
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    {visitStatus.map(status => (
                      <option key={status.id} value={status.id}>{status.label}</option>
                    ))}
                  </select>
                </div>
                
                {formData.status === 'MISSED' && (
                  <div className="form-group">
                    <label>Reason for Missing</label>
                    <input 
                      type="text" 
                      name="missedReason" 
                      value={formData.missedReason} 
                      onChange={handleInputChange}
                      placeholder="Enter reason"
                      className="form-input"
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label>Notes</label>
                  <textarea 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleInputChange}
                    placeholder="Add visit notes"
                    className="form-input"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowAddVisitModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn" 
                  onClick={handleSaveVisit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="btn-loading">
                      <i className="fas fa-spinner fa-spin"></i> Saving...
                    </span>
                  ) : 'Save Visit'}
                </button>
              </div>
            </div>
          </div>
        );
      };
      
      // Renderizar modal para editar visita
      const renderEditVisitModal = () => {
        return (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Edit Visit</h3>
                <button className="close-btn" onClick={() => setShowEditVisitModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label>Visit Type</label>
                  <select 
                    name="visitType" 
                    value={formData.visitType} 
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select visit type</option>
                    {visitTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Therapist</label>
                  <select 
                    name="therapist" 
                    value={formData.therapist} 
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select therapist</option>
                    {therapists.map(therapist => (
                      <option key={therapist.id} value={therapist.id}>
                        {therapist.name} ({therapist.type})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Time</label>
                    <input 
                      type="time" 
                      name="time" 
                      value={formData.time} 
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    {visitStatus.map(status => (
                      <option key={status.id} value={status.id}>{status.label}</option>
                    ))}
                  </select>
                </div>
                
                {formData.status === 'MISSED' && (
                  <div className="form-group">
                    <label>Reason for Missing</label>
                    <input 
                      type="text" 
                      name="missedReason" 
                      value={formData.missedReason} 
                      onChange={handleInputChange}
                      placeholder="Enter reason"
                      className="form-input"
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label>Notes</label>
                  <textarea 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleInputChange}
                    placeholder="Add visit notes"
                    className="form-input"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowEditVisitModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn" 
                  onClick={handleUpdateVisit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="btn-loading">
                      <i className="fas fa-spinner fa-spin"></i> Updating...
                    </span>
                  ) : 'Update Visit'}
                </button>
              </div>
            </div>
          </div>
        );
      };
      
      // Renderizar modal de confirmación de eliminación
      const renderDeleteConfirmModal = () => {
        const visit = visits.find(v => v.id === deleteVisitId);
        if (!visit) return null;
        
        const visitDate = new Date(visit.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        return (
          <div className="modal-overlay">
            <div className="modal-content delete-confirm-modal">
              <div className="modal-header delete-header">
                <h3>Delete Visit</h3>
                <button 
                  className="close-btn" 
                  onClick={() => setShowDeleteConfirmModal(false)}
                  disabled={isDeleting}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body delete-body">
                <div className="delete-warning-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                
                <div className="delete-message">
                  <h4>Are you sure you want to delete this visit?</h4>
                  <p>
                    <strong>{getVisitTypeLabel(visit.visitType)}</strong> with {getTherapistName(visit.therapist)} on {visitDate}
                    {visit.time ? ` at ${formatTime(visit.time)}` : ''}
                  </p>
                  <p className="delete-warning">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="modal-footer delete-footer">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowDeleteConfirmModal(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  className="delete-confirm-btn" 
                  onClick={handleDeleteVisit}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="btn-loading">
                      <i className="fas fa-spinner fa-spin"></i> Deleting...
                    </span>
                  ) : 'Delete Visit'}
                </button>
              </div>
            </div>
          </div>
        );
      };
      
      // Renderizar pantalla de carga
      const renderLoadingScreen = () => {
        return (
          <div className="loading-overlay">
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner-orbit"></div>
                <div className="spinner-orbit-secondary"></div>
                <svg className="spinner-circle" viewBox="0 0 50 50">
                  <defs>
                    <linearGradient id="gradient-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <circle 
                    className="path" 
                    cx="25" 
                    cy="25" 
                    r="20" 
                    fill="none" 
                    strokeWidth="4"
                  />
                </svg>
                <div className="loading-particles">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="particle"></div>
                  ))}
                </div>
              </div>
              <div className="loading-text">
                <span data-text="Loading">Loading</span>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        );
      };
    
      // Renderizar el listado de visitas
      const renderVisitsList = () => {
        const groupedVisits = groupVisitsByMonth();
        const sortedMonths = Object.keys(groupedVisits).sort((a, b) => {
          // Convertir los nombres de mes y año a objetos Date para ordenarlos
          const [monthA, yearA] = a.split(' ');
          const [monthB, yearB] = b.split(' ');
          const dateA = new Date(`${monthA} 1, ${yearA}`);
          const dateB = new Date(`${monthB} 1, ${yearB}`);
          return dateA - dateB;
        });
    
        if (sortedMonths.length === 0) {
          return (
            <div className="empty-visits-container">
              <div className="empty-state">
                <i className="fas fa-calendar-times"></i>
                <h3>No Visits Found</h3>
                <p>No therapy visits match the current filters or no visits have been scheduled yet.</p>
                <button className="add-visit-btn" onClick={() => handleShowCalendar()}>
                  <i className="fas fa-plus-circle"></i>
                  <span>Schedule First Visit</span>
                </button>
              </div>
            </div>
          );
        }
    
        return (
          <div className="visits-list-container">
            <div className="visits-header">
              <h3>Scheduled Therapy Visits</h3>
              <div className="header-actions">
                <button className="quick-add-btn" onClick={() => {
                  setShowAddVisitModal(true);
                  setFormData({
                    ...formData,
                    date: formatDateToLocalISOString(new Date())
                  });
                }}>
                  <i className="fas fa-plus"></i>
                  <span>Quick Add</span>
                </button>
                <button className="view-calendar-btn" onClick={() => handleShowCalendar()}>
                  <i className="fas fa-calendar-alt"></i>
                  <span>View Calendar</span>
                </button>
              </div>
            </div>
    
            <div className="visits-filter">
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
                  <button 
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
    
            <div className="visits-timeline">
              {sortedMonths.map(month => (
                <div key={month} className="month-group">
                  <div className="month-header">
                    <i className="fas fa-calendar-alt"></i>
                    <h4>{month}</h4>
                    <span className="visit-count">
                      {groupedVisits[month].length} {groupedVisits[month].length === 1 ? 'visit' : 'visits'}
                    </span>
                  </div>
                  <div className="month-visits">
                    {groupedVisits[month].map(visit => renderVisitCard(visit))}
                  </div>
                </div>
              ))}
            </div>
    
            <div className="add-visit-floating">
              <button 
                className="add-visit-btn" 
                onClick={() => {
                  setShowAddVisitModal(true);
                  setFormData({
                    ...formData,
                    date: formatDateToLocalISOString(new Date())
                  });
                }}
                aria-label="Add new visit"
              >
                <i className="fas fa-plus"></i>
              </button>
              <div className="tooltip">Add New Visit</div>
            </div>
          </div>
        );
      };
    
      // Renderizar un día en la vista detallada del calendario
      const renderCalendarDay = (date, visits) => {
        const dayVisits = visits.filter(visit => visit.date === formatDateToLocalISOString(date));
        
        if (dayVisits.length === 0) return null;
        
        return (
          <div className="calendar-day-detail">
            <div className="day-date">
              <span className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="day-number">{date.getDate()}</span>
            </div>
            
            <div className="day-visits">
              {dayVisits.map(visit => {
                const therapistColors = getTherapistColors(visit.therapist);
                return (
                  <div 
                    key={visit.id}
                    className="calendar-visit-item"
                    style={{ 
                      borderLeft: `4px solid ${therapistColors.primary}`,
                      backgroundColor: therapistColors.secondary
                    }}
                  >
                    <div className="visit-time">
                      {visit.time ? formatTime(visit.time) : 'No time set'}
                    </div>
                    <div className="visit-details">
                      <div className="visit-title">{getVisitTypeLabel(visit.visitType)}</div>
                      <div className="visit-therapist">{getTherapistName(visit.therapist)}</div>
                      {visit.notes && <div className="visit-notes">{visit.notes}</div>}
                    </div>
                    <div 
                      className="visit-status-indicator"
                      style={{ backgroundColor: getStatusColor(visit.status) }}
                    >
                      {getStatusLabel(visit.status)}
                    </div>
                    <div className="visit-actions">
                      <button 
                        className="edit-visit-btn"
                        onClick={() => handleEditVisit(visit)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="delete-visit-btn"
                        onClick={() => handleInitiateDelete(visit.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      };
    
      return (
        <div className="schedule-component">
          <div className="card-header">
            <div className="header-title">
              <i className="fas fa-calendar-alt"></i>
              <h3>Patient Schedule</h3>
            </div>
          </div>
    
          <div className="card-body">
            {isLoading && renderLoadingScreen()}
            
            {!isCalendarView ? (
              renderVisitsList()
            ) : (
              <div className="calendar-view">
                <div className="calendar-nav">
                  <button className="back-to-visits" onClick={handleBackToVisits}>
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Visits</span>
                  </button>
                  <button className="add-visit-calendar" onClick={() => {
                    setShowAddVisitModal(true);
                    setFormData({
                      ...formData,
                      date: formatDateToLocalISOString(new Date())
                    });
                  }}>
                    <i className="fas fa-plus"></i>
                    <span>Add Visit</span>
                  </button>
                </div>
                {renderCalendar()}
              </div>
            )}
          </div>
    
          {/* Modales */}
          {showAddVisitModal && renderAddVisitModal()}
          {showEditVisitModal && renderEditVisitModal()}
          {showDeleteConfirmModal && renderDeleteConfirmModal()}
        </div>
      );
};
    
export default ScheduleComponent;