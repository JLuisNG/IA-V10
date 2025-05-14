import React, { useState, useEffect } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/ScheduleComponent.scss';
import VisitCompletionModal from './NotesAndSign/Evaluation/VisitCompletionModal';
import SignaturePad from './SignaturePad';

const ScheduleComponent = ({ patient, onUpdateSchedule, certPeriodDates }) => {
  // Estados para vistas y datos
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
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
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionVisitData, setCompletionVisitData] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedFile, setSelectedFile] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [signatureData, setSignatureData] = useState({
    patient: null,
    therapist: null,
    date: null,
    patientOutside: false,
    therapistOutside: false
  });
  const [missedVisitData, setMissedVisitData] = useState({
    reason: '',
    action: '',
    mdNotified: false,
    noShow: false
  });

  // Datos del formulario
  const [formData, setFormData] = useState({
    visitType: '',
    therapist: '',
    date: '',
    time: '',
    notes: '',
    status: 'SCHEDULED',
    missedReason: '',
    timeInHour: '01',
    timeInMinute: '00',
    timeInAmPm: 'PM',
    timeOutHour: '02',
    timeOutMinute: '00',
    timeOutAmPm: 'PM',
    gCode: '',
    physician: 'Dr. John Smith',
    certPeriod: '',
    documents: []
  });

  // Tipos de visita
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
    { id: 'SUPERVISION', label: 'Supervision Assessment' },
  ];

  // Estados de visita
  const visitStatus = [
    { id: 'SCHEDULED', label: 'Scheduled', color: '#10b981' },
    { id: 'COMPLETED', label: 'Completed', color: '#3b82f6' },
    { id: 'MISSED', label: 'Missed', color: '#ef4444' },
    { id: 'PENDING', label: 'Pending', color: '#f59e0b' },
    { id: 'CANCELLED', label: 'Cancelled', color: '#64748b' },
  ];

  // Tipo de acción de visita
  const visitActions = [
    { id: 'PT_EVAL', label: 'PT Evaluation' },
    { id: 'OT_EVAL', label: 'OT Evaluation' },
    { id: 'RESCHEDULE_VISIT', label: 'Reschedule Visit' },
  ];

  // Razones para visitas perdidas
  const missedReasons = [
    'Select an option',
    'Caregiver Provided Care',
    'Patient/Caregiver Refused',
    'Patient Had Physician Appointment',
    'No Answer Door/Phone',
    'Inclement Weather',
    'Medical Treatment Only',
    'Transition Recert',
    'Patient Expired',
    'Patient Declined This Discipline',
    'HH Initiation Visit Missed',
    'Patient Hospitalized',
    'Awaiting Insurance Authorization',
    'Awaiting Verbal Orders',
    'Waiting on authorization patient declined private pay',
    'Other'
  ];

  // Períodos de certificación
  const certPeriods = [
    { id: 'period1', label: '11/30/2024 - 1/28/2025' },
    { id: 'period2', label: '8/30/2024 - 10/28/2024' },
    { id: 'period3', label: '5/30/2024 - 7/28/2024' },
  ];

  // Colores para tipos de terapeutas
  const therapistTypeColors = {
    PT: { primary: '#4f46e5', secondary: '#e0e7ff' },
    PTA: { primary: '#6366f1', secondary: '#e0e7ff' },
    OT: { primary: '#0ea5e9', secondary: '#e0f2fe' },
    COTA: { primary: '#38bdf8', secondary: '#e0f2fe' },
    ST: { primary: '#14b8a6', secondary: '#d1fae5' },
    STA: { primary: '#2dd4bf', secondary: '#d1fae5' },
  };

  // Datos de terapeutas
  const therapists = [
    { id: 'pt1', name: 'Dr. Michael Chen', type: 'PT' },
    { id: 'pta1', name: 'Maria Gonzalez', type: 'PTA' },
    { id: 'ot1', name: 'Dr. Emily Parker', type: 'OT' },
    { id: 'cota1', name: 'Thomas Smith', type: 'COTA' },
    { id: 'st1', name: 'Dr. Jessica Lee', type: 'ST' },
    { id: 'sta1', name: 'Robert Williams', type: 'STA' },
  ];

  // Horas y minutos para selección de tiempo
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // API simulada para obtener visitas
  const fetchVisits = async (patientId) => {
    // Reemplazar con llamada API real
    return new Promise((resolve) => {
      setTimeout(() => {
        // Datos de visitas de ejemplo - reemplazar con respuesta de API
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
            physician: 'Dr. John Smith',
            gCode: 'G0151',
            signatures: {
              patient: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEU...',
              therapist: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEU...',
              date: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEU...'
            }
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
            physician: 'Dr. John Smith'
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
            physician: 'Dr. John Smith'
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
            physician: 'Dr. Sarah Johnson'
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
            physician: 'Dr. John Smith'
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
            physician: 'Dr. Sarah Johnson'
          },
          {
            id: 7,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-03-06',
            time: '15:30',
            notes: 'PTA follow-up session',
            status: 'SCHEDULED',
            physician: 'Dr. John Smith'
          },
          {
            id: 8,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-03-10',
            time: '13:45',
            notes: 'PTA follow-up session',
            status: 'SCHEDULED',
            physician: 'Dr. John Smith'
          },
          {
            id: 9,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-03-13',
            time: '13:45',
            notes: 'PTA follow-up session',
            status: 'SCHEDULED',
            physician: 'Dr. John Smith'
          },
          {
            id: 10,
            visitType: 'REASSESSMENT',
            therapist: 'pt1',
            date: '2025-03-18',
            time: '',
            notes: 'Reassessment for progress evaluation',
            status: 'SCHEDULED',
            physician: 'Dr. John Smith'
          },
          {
            id: 11,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-03-25',
            time: '',
            notes: 'Regular PTA session',
            status: 'SCHEDULED',
            physician: 'Dr. Sarah Johnson'
          },
          {
            id: 12,
            visitType: 'REGULAR',
            therapist: 'ot1',
            date: '2025-03-27',
            time: '',
            notes: 'Occupational therapy session',
            status: 'SCHEDULED',
            physician: 'Dr. John Smith'
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
            physician: 'Dr. Mark Wilson'
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
            physician: 'Dr. John Smith'
          },
          {
            id: 15,
            visitType: 'REGULAR',
            therapist: 'pta1',
            date: '2025-04-28',
            time: '10:30',
            notes: 'Initial evaluation with Maria Gonzalez',
            status: 'SCHEDULED',
            physician: 'Dr. John Smith'
          },
        ];
        resolve(mockVisits);
      }, 1000);
    });
  };

  // Cargar visitas al montar el componente
  useEffect(() => {
    const loadVisits = async () => {
      setIsLoading(true);
      try {
        const fetchedVisits = await fetchVisits(patient?.id);
        setVisits(fetchedVisits);
      } catch (err) {
        setError('Failed to fetch visits');
      } finally {
        setIsLoading(false);
      }
    };
    loadVisits();
  }, [patient?.id]);

  // Inicializar datos de formulario cuando cambia la visita seleccionada
  useEffect(() => {
    if (selectedVisit) {
      setFormData({
        visitType: selectedVisit.visitType || 'INITIAL',
        therapist: selectedVisit.therapist || '',
        date: selectedVisit.date || formatDateToLocalISOString(new Date()),
        time: selectedVisit.time || '',
        notes: selectedVisit.notes || '',
        status: selectedVisit.status || 'SCHEDULED',
        missedReason: selectedVisit.missedReason || '',
        timeInHour: selectedVisit.timeInHour || '01',
        timeInMinute: selectedVisit.timeInMinute || '00',
        timeInAmPm: selectedVisit.timeInAmPm || 'PM',
        timeOutHour: selectedVisit.timeOutHour || '02',
        timeOutMinute: selectedVisit.timeOutMinute || '00',
        timeOutAmPm: selectedVisit.timeOutAmPm || 'PM',
        gCode: selectedVisit.gCode || 'G0151',
        physician: selectedVisit.physician || 'Dr. John Smith',
        certPeriod: selectedVisit.certPeriod || certPeriods[0].id,
        documents: selectedVisit.documents || []
      });

      if (selectedVisit.rescheduledDate) {
        setRescheduleDate(selectedVisit.rescheduledDate);
      }

      if (selectedVisit.signatures) {
        setSignatureData({
          patient: selectedVisit.signatures.patient || null,
          therapist: selectedVisit.signatures.therapist || null,
          date: selectedVisit.signatures.date || null,
          patientOutside: selectedVisit.signatures.patientOutside || false,
          therapistOutside: selectedVisit.signatures.therapistOutside || false
        });
      }

      // Establecer pestaña activa según el estado
      if (selectedVisit.status === 'COMPLETED') {
        setActiveTab('details');
      } else {
        setActiveTab('details');
      }
    } else {
      // Visita nueva
      setFormData({
        visitType: 'INITIAL',
        therapist: '',
        date: formatDateToLocalISOString(new Date()),
        time: '',
        notes: '',
        status: 'SCHEDULED',
        missedReason: '',
        timeInHour: '01',
        timeInMinute: '00',
        timeInAmPm: 'PM',
        timeOutHour: '02',
        timeOutMinute: '00',
        timeOutAmPm: 'PM',
        gCode: 'G0151',
        physician: 'Dr. John Smith',
        certPeriod: certPeriods[0].id,
        documents: []
      });
      setSignatureData({
        patient: null,
        therapist: null,
        date: null,
        patientOutside: false,
        therapistOutside: false
      });
      setRescheduleDate('');
      setActiveTab('details');
    }
  }, [selectedVisit]);

  // API simulada para agregar una visita
  const addVisit = async (visitData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVisit = {
          id: visits.length > 0 ? Math.max(...visits.map((v) => v.id)) + 1 : 1,
          ...visitData,
          patientId: patient.id,
        };
        resolve(newVisit);
      }, 1000);
    });
  };

  // API simulada para actualizar una visita
  const updateVisit = async (visitId, visitData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedVisit = { ...visitData, id: visitId, patientId: patient.id };
        resolve(updatedVisit);
      }, 1000);
    });
  };

  // API simulada para eliminar una visita
  const deleteVisitApi = async (visitId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(visitId);
      }, 1000);
    });
  };

  // Mostrar calendario
  const handleShowCalendar = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsCalendarView(true);
      setIsLoading(false);
    }, 1000);
  };

  // Volver a la vista de visitas
  const handleBackToVisits = () => {
    setIsCalendarView(false);
    setSelectedDate(null);
  };

  // Formatear fecha a cadena ISO local
  const formatDateToLocalISOString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Manejar clic en fecha del calendario
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedVisit(null);
    setFormData({
      ...formData,
      date: formatDateToLocalISOString(date),
      time: '',
      visitType: 'INITIAL',
      therapist: '',
      notes: '',
      status: 'SCHEDULED',
      missedReason: '',
    });
    setShowVisitModal(true);
  };

  // Abrir modal de visita
  const handleOpenVisitModal = (visit = null) => {
    setSelectedVisit(visit);
    setShowVisitModal(true);
  };

  // Iniciar eliminación de visita
  const handleInitiateDelete = (visitId, e) => {
    e.stopPropagation();
    setDeleteVisitId(visitId);
    setShowDeleteConfirmModal(true);
  };

  // Eliminar una visita
  const handleDeleteVisit = async () => {
    setIsDeleting(true);
    try {
      await deleteVisitApi(deleteVisitId);
      const updatedVisits = visits.filter((visit) => visit.id !== deleteVisitId);
      setVisits(updatedVisits);
      if (onUpdateSchedule) {
        onUpdateSchedule(updatedVisits);
      }
    } catch (err) {
      setError('Failed to delete visit');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmModal(false);
      setDeleteVisitId(null);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  // Manejar cambios en el formulario de visita perdida
  const handleMissedVisitChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMissedVisitData({
      ...missedVisitData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Manejar cambios de firma
  const handleSignatureChange = (type, data) => {
    setSignatureData({
      ...signatureData,
      [type]: data
    });
  };

  // Manejar cambios en checkboxes de firma
  const handleSignatureCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSignatureData({
      ...signatureData,
      [name]: checked
    });
  };

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Manejar carga de archivo
  const handleFileUpload = () => {
    if (!selectedFile) return;

    // Simular carga de archivo
    setIsLoading(true);
    setTimeout(() => {
      const newDocuments = [...formData.documents, {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        uploadDate: new Date().toISOString()
      }];
      
      setFormData({
        ...formData,
        documents: newDocuments
      });
      
      setSelectedFile(null);
      setIsLoading(false);
    }, 1000);
  };

  // Eliminar un documento
  const handleRemoveDocument = (docId) => {
    const updatedDocs = formData.documents.filter(doc => doc.id !== docId);
    setFormData({
      ...formData,
      documents: updatedDocs
    });
  };

  // Verificar si la franja horaria está disponible
  const isTimeAvailable = (date, time, therapistId, visitId = null) => {
    const existingVisits = visits.filter(
      (visit) =>
        visit.date === date &&
        visit.time === time &&
        visit.therapist === therapistId &&
        (visitId === null || visit.id !== visitId)
    );
    return existingVisits.length === 0;
  };

  // Guardar una visita (nueva o actualizada)
  const handleSaveVisit = async () => {
    if (!formData.visitType || !formData.therapist || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.time && !isTimeAvailable(formData.date, formData.time, formData.therapist, selectedVisit?.id)) {
      setError('This time slot is already booked for the selected therapist');
      return;
    }

    // Verificar si la fecha de la visita está dentro del período de certificación
    if (certPeriodDates.startDate && certPeriodDates.endDate) {
      const visitDate = new Date(formData.date);
      const startDate = new Date(certPeriodDates.startDate);
      const endDate = new Date(certPeriodDates.endDate);
      if (visitDate < startDate || visitDate > endDate) {
        setError('Visit date must be within the current certification period');
        return;
      }
    }

    // Si la visita es reprogramada, verificar fecha de reprogramación
    if (activeTab === 'reschedule' && !rescheduleDate) {
      setError('Please select a new date for rescheduling');
      return;
    }

    setIsLoading(true);
    try {
      // Preparar datos para guardar
      let visitDataToSave = { ...formData };

      // Agregar datos adicionales según la pestaña activa
      if (activeTab === 'missedVisit') {
        visitDataToSave.status = 'MISSED';
        visitDataToSave.missedReason = missedVisitData.reason;
        visitDataToSave.missedAction = missedVisitData.action;
        visitDataToSave.mdNotified = missedVisitData.mdNotified;
        visitDataToSave.noShow = missedVisitData.noShow;
      } else if (activeTab === 'reschedule') {
        visitDataToSave.rescheduledDate = rescheduleDate;
        // Mantener el estado actual
      }

      // Agregar firmas si están disponibles
      if (signatureData.patient || signatureData.therapist || signatureData.date) {
        visitDataToSave.signatures = signatureData;
      }

      let updatedVisit;
      let updatedVisits;

      if (selectedVisit) {
        // Actualizar visita existente
        updatedVisit = await updateVisit(selectedVisit.id, visitDataToSave);
        updatedVisits = visits.map((v) => (v.id === selectedVisit.id ? updatedVisit : v));
      } else {
        // Agregar nueva visita
        updatedVisit = await addVisit(visitDataToSave);
        updatedVisits = [...visits, updatedVisit];
      }

      setVisits(updatedVisits);
      if (onUpdateSchedule) {
        onUpdateSchedule(updatedVisits);
      }

      // Si se está completando la visita, mostrar modal de finalización
      const isCompletingVisit = visitDataToSave.status === 'COMPLETED' && 
                              (selectedVisit ? selectedVisit.status !== 'COMPLETED' : true);
      
      if (isCompletingVisit) {
        setCompletionVisitData(updatedVisit);
        setShowCompletionModal(true);
      }

      // Limpiar y cerrar
      setShowVisitModal(false);
      setSelectedVisit(null);
      setActiveTab('details');
    } catch (err) {
      setError('Failed to save visit');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar guardado del formulario de finalización
  const handleCompletionFormSave = async (formData) => {
    console.log('Saving completion form data:', formData);
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedVisits = visits.map((visit) =>
          visit.id === completionVisitData.id
            ? {
                ...visit,
                evaluationCompleted: true,
                evaluationData: formData,
              }
            : visit
        );
        setVisits(updatedVisits);
        if (onUpdateSchedule) {
          onUpdateSchedule(updatedVisits);
        }
        resolve();
      }, 2000);
    });
  };

  // Obtener nombre del terapeuta por ID
  const getTherapistName = (therapistId) => {
    const therapist = therapists.find((t) => t.id === therapistId);
    return therapist ? therapist.name : 'Unknown';
  };

  // Obtener tipo de terapeuta por ID
  const getTherapistType = (therapistId) => {
    const therapist = therapists.find((t) => t.id === therapistId);
    return therapist ? therapist.type : null;
  };

  // Obtener colores para un terapeuta específico
  const getTherapistColors = (therapistId) => {
    const therapistType = getTherapistType(therapistId);
    return therapistType && therapistTypeColors[therapistType]
      ? therapistTypeColors[therapistType]
      : { primary: '#64748b', secondary: '#f1f5f9' };
  };

  // Obtener etiqueta de tipo de visita por ID
  const getVisitTypeLabel = (typeId) => {
    const type = visitTypes.find((t) => t.id === typeId);
    return type ? type.label : typeId;
  };

  // Obtener color de estado por ID
  const getStatusColor = (statusId) => {
    const status = visitStatus.find((s) => s.id === statusId);
    return status ? status.color : '#64748b';
  };

  // Obtener etiqueta de estado por ID
  const getStatusLabel = (statusId) => {
    const status = visitStatus.find((s) => s.id === statusId);
    return status ? status.label : statusId;
  };

  // Verificar si la visita está dentro del período de certificación
  const isWithinCertPeriod = (visitDateStr) => {
    if (!certPeriodDates?.startDate || !certPeriodDates?.endDate) return true;
    const visitDate = new Date(visitDateStr);
    const startDate = new Date(certPeriodDates.startDate);
    const endDate = new Date(certPeriodDates.endDate);
    return visitDate >= startDate && visitDate <= endDate;
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Filtrar visitas basadas en filtro activo, búsqueda y período de certificación
  const getFilteredVisits = () => {
    let filtered = [...visits];

    // Filtrar por período de certificación
    filtered = filtered.filter((visit) => isWithinCertPeriod(visit.date));

    // Filtrar por estado activo
    if (activeFilter !== 'ALL') {
      filtered = filtered.filter((visit) => visit.status === activeFilter);
    }

    // Filtrar por texto de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((visit) => {
        const therapistName = getTherapistName(visit.therapist).toLowerCase();
        const visitType = getVisitTypeLabel(visit.visitType).toLowerCase();
        const notes = (visit.notes || '').toLowerCase();
        return (
          therapistName.includes(query) ||
          visitType.includes(query) ||
          notes.includes(query) ||
          visit.date.includes(query)
        );
      });
    }

    return filtered;
  };

  // Agrupar visitas por mes
  const groupVisitsByMonth = () => {
    const filtered = getFilteredVisits();
    const grouped = {};

    filtered.forEach((visit) => {
      const date = new Date(visit.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }

      grouped[monthYear].push(visit);
    });

    Object.keys(grouped).forEach((month) => {
      grouped[month].sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return grouped;
  };

  // Formatear hora
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Renderizar calendario
  const renderCalendar = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysArray = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(null);
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getVisitsForDay = (date) => {
      const dateString = formatDateToLocalISOString(date);
      return visits.filter((visit) => visit.date === dateString && isWithinCertPeriod(visit.date));
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
          <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
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
            const isToday =
              day.getDate() === today.getDate() &&
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
                      const statusColor = getStatusColor(visit.status);
                      
                      return (
                        <div
                          key={vIndex}
                          className="calendar-visit-pill"
                          style={{
                            backgroundColor: therapistColors.secondary,
                            borderLeft: `3px solid ${therapistColors.primary}`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenVisitModal(visit);
                          }}
                        >
                          <span className="visit-time">{visit.time ? formatTime(visit.time) : '—'}</span>
                          <span className="visit-title" style={{ color: therapistColors.primary }}>
                            {getVisitTypeLabel(visit.visitType).substring(0, 15)}
                            {getVisitTypeLabel(visit.visitType).length > 15 ? '...' : ''}
                          </span>
                          <span 
                            className="visit-status-dot"
                            style={{ backgroundColor: statusColor }}
                            title={getStatusLabel(visit.status)}
                          ></span>
                        </div>
                      );
                    })}

                    {dayVisits.length > 3 && (
                      <div className="more-visits">+{dayVisits.length - 3} more</div>
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

  // Renderizar tarjeta de visita
  const renderVisitCard = (visit) => {
    const therapistColors = getTherapistColors(visit.therapist);
    const statusColor = getStatusColor(visit.status);
    const therapistType = getTherapistType(visit.therapist);

    const [year, month, day] = visit.date.split('-').map(Number);
    const visitDate = new Date(year, month - 1, day);

    return (
      <div
        className="visit-card"
        key={visit.id}
        onClick={() => handleOpenVisitModal(visit)}
        style={{
          borderTopColor: therapistColors.primary,
          borderTopWidth: '4px',
        }}
      >
        <div
          className="visit-card-header"
          style={{
            backgroundColor: therapistColors.secondary,
            color: therapistColors.primary,
          }}
        >
          <div className="visit-type">{getVisitTypeLabel(visit.visitType)}</div>
          <div
            className="visit-status"
            style={{
              backgroundColor: statusColor,
              color: 'white',
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
                  day: '2-digit',
                })}
              </span>
              {visit.time && <span className="visit-time">{formatTime(visit.time)}</span>}
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
            onClick={(e) => {
              e.stopPropagation();
              handleOpenVisitModal(visit);
            }}
            aria-label="Edit visit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="delete-btn"
            onClick={(e) => handleInitiateDelete(visit.id, e)}
            aria-label="Delete visit"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    );
  };

  // Renderizar lista de visitas
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
            <button
              className="quick-add-btn"
              onClick={() => {
                setSelectedVisit(null);
                setShowVisitModal(true);
              }}
            >
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
          {sortedMonths.map((month) => (
            <div key={month} className="month-group">
              <div className="month-header">
                <i className="fas fa-calendar-alt"></i>
                <h4>{month}</h4>
                <span className="visit-count">
                  {groupedVisits[month].length} {groupedVisits[month].length === 1 ? 'visit' : 'visits'}
                </span>
              </div>
              <div className="month-visits">
                {groupedVisits[month].map((visit) => renderVisitCard(visit))}
              </div>
            </div>
          ))}
        </div>

        <div className="add-visit-floating">
          <button
            className="add-visit-btn"
            onClick={() => {
              setSelectedVisit(null);
              setShowVisitModal(true);
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

  // Renderizar modal de confirmación de eliminación
  const renderDeleteConfirmModal = () => {
    const visit = visits.find((v) => v.id === deleteVisitId);
    if (!visit) return null;

    const visitDate = new Date(visit.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
                <strong>{getVisitTypeLabel(visit.visitType)}</strong> with{' '}
                {getTherapistName(visit.therapist)} on {visitDate}
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
              ) : (
                'Delete Visit'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar modal de visita
  const renderVisitModal = () => {
    if (!showVisitModal) return null;

    const isCompletedView = selectedVisit && selectedVisit.status === 'COMPLETED';

    return (
      <div className="modal-overlay">
        <div className="modal-content modal-large">
          <div className="modal-header">
            <h3>
              {selectedVisit 
                ? isCompletedView 
                  ? 'Visit Detail' 
                  : 'Edit Visit'
                : 'Schedule New Visit'}
            </h3>
            <button className="close-btn" onClick={() => setShowVisitModal(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            {isCompletedView ? (
              // Vista de visita completada
              <div className="completed-visit-view">
                {/* Columna de detalles */}
                <div className="visit-details-column">
                  <h4>Visit Details</h4>
                  
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
                      <label>Type</label>
                      <select
                        name="visitType"
                        value={formData.visitType}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        {visitTypes.map((type) => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>G-Code</label>
                    <input
                      type="text"
                      name="gCode"
                      value={formData.gCode}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row time-row">
                    <div className="form-group time-group">
                      <label>Time In</label>
                      <div className="time-inputs">
                        <select 
                          name="timeInHour"
                          value={formData.timeInHour}
                          onChange={handleInputChange}
                        >
                          {hours.map(hour => (
                            <option key={`in-hour-${hour}`} value={hour}>{hour}</option>
                          ))}
                        </select>
                        <span className="time-separator">:</span>
                        <select 
                          name="timeInMinute"
                          value={formData.timeInMinute}
                          onChange={handleInputChange}
                        >
                          {minutes.map(minute => (
                            <option key={`in-min-${minute}`} value={minute}>{minute}</option>
                          ))}
                        </select>
                        <select 
                          name="timeInAmPm"
                          value={formData.timeInAmPm}
                          onChange={handleInputChange}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group time-group">
                      <label>Time Out</label>
                      <div className="time-inputs">
                        <select 
                          name="timeOutHour"
                          value={formData.timeOutHour}
                          onChange={handleInputChange}
                        >
                          {hours.map(hour => (
                            <option key={`out-hour-${hour}`} value={hour}>{hour}</option>
                          ))}
                        </select>
                        <span className="time-separator">:</span>
                        <select 
                          name="timeOutMinute"
                          value={formData.timeOutMinute}
                          onChange={handleInputChange}
                        >
                          {minutes.map(minute => (
                            <option key={`out-min-${minute}`} value={minute}>{minute}</option>
                          ))}
                        </select>
                        <select 
                          name="timeOutAmPm"
                          value={formData.timeOutAmPm}
                          onChange={handleInputChange}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Physician</label>
                    <input
                      type="text"
                      name="physician"
                      value={formData.physician}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>


                  <div className="form-group">
                    <label>Cert Period</label>
                    <select
                      name="certPeriod"
                      value={formData.certPeriod}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      {certPeriods.map((period) => (
                        <option key={period.id} value={period.id}>{period.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="form-input"
                      rows="5"
                    ></textarea>
                  </div>

                  <button 
                    className="update-button"
                    onClick={handleSaveVisit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loading">
                        <i className="fas fa-spinner fa-spin"></i> Updating...
                      </span>
                    ) : (
                      'UPDATE'
                    )}
                  </button>
                </div>

                {/* Columna de evaluación */}
                <div className="evaluation-column">
                  <div className="evaluation-section">
                    <div className="evaluation-header">
                      <h4>OT EVALUATION</h4>
                      <div className="status-badge incomplete">Incomplete</div>
                    </div>
                    <div className="evaluation-info">
                      <p>Therapist: {getTherapistName(formData.therapist)}</p>
                    </div>
                    <div className="evaluation-actions">
                      <button className="edit-button">EDIT</button>
                      <button className="view-button">VIEW</button>
                    </div>
                  </div>

                  <div className="documents-section">
                    <h4>UPLOADED DOCUMENTS</h4>
                    
                    {formData.documents.length === 0 ? (
                      <p className="no-documents">No files uploaded</p>
                    ) : (
                      <ul className="documents-list">
                        {formData.documents.map(doc => (
                          <li key={doc.id || doc} className="document-item">
                            <div className="document-icon">
                              <i className="fas fa-file-alt"></i>
                            </div>
                            <div className="document-info">
                              <span className="document-name">{typeof doc === 'string' ? doc : doc.name}</span>
                              {doc.size && (
                                <span className="document-size">{formatFileSize(doc.size)}</span>
                              )}
                            </div>
                            <button 
                              className="remove-document"
                              onClick={() => handleRemoveDocument(doc.id || doc)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="upload-container">
                      <div className="file-input-container">
                        <input 
                          type="file" 
                          id="document-upload" 
                          className="hidden-file-input" 
                          onChange={handleFileSelect}
                        />
                        <label htmlFor="document-upload" className="file-label">
                          {selectedFile ? selectedFile.name : 'No file selected'}
                        </label>
                        <button className="choose-file-btn">CHOOSE FILE</button>
                      </div>
                      <button 
                        className="upload-btn"
                        onClick={handleFileUpload}
                        disabled={!selectedFile || isLoading}
                      >
                        {isLoading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          'UPLOAD'
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="forms-section">
                    <h4>OTHER FORMS</h4>
                    <div className="forms-buttons">
                      <button className="form-btn">ADD ADDENDUM</button>
                      <button className="form-btn">ADD SIGNATURES</button>
                      <button className="form-btn">ADD OQBI</button>
                      <button className="form-btn">ADD DC</button>
                      <button className="form-btn other-forms">OTHER FORMS</button>
                      <button className="form-btn sticky">ADD STICKY</button>
                      <button className="form-btn expense">ADD EXPENSE</button>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              // Vista de visita regular o nueva
              <div className="visit-tabs">
                <div className="tabs-header">
                  <button 
                    className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                  >
                    <i className="fas fa-info-circle"></i>
                    Details
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'missedVisit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('missedVisit')}
                  >
                    <i className="fas fa-calendar-times"></i>
                    Missed Visit
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'reschedule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reschedule')}
                  >
                    <i className="fas fa-calendar-alt"></i>
                    Reschedule
                  </button>
                </div>
                
                <div className="tab-content">
                  {activeTab === 'details' && (
                    <div className="details-tab">
                      <div className="form-group">
                        <label>Visit Type</label>
                        <select
                          name="visitType"
                          value={formData.visitType}
                          onChange={handleInputChange}
                          className="form-input"
                        >
                          <option value="">Select visit type</option>
                          {visitTypes.map((type) => (
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
                          {therapists.map((therapist) => (
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
                            min={certPeriodDates.startDate || undefined}
                            max={certPeriodDates.endDate || undefined}
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
                          {visitStatus.map((status) => (
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
                          rows="5"
                        ></textarea>
                      </div>

                      <div className="action-buttons">
                        <button 
                          className="action-button missed"
                          onClick={() => setActiveTab('missedVisit')}
                        >
                          <i className="fas fa-calendar-times"></i> Mark as Missed
                        </button>
                        <button 
                          className="action-button reschedule"
                          onClick={() => setActiveTab('reschedule')}
                        >
                          <i className="fas fa-calendar-alt"></i> Reschedule
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'missedVisit' && (
                    <div className="missed-visit-tab">
                      <h4>Missed Visit Report</h4>
                      
                      <div className="form-group">
                        <label>REASON FOR MISSED VISIT:</label>
                        <select
                          name="reason"
                          value={missedVisitData.reason}
                          onChange={handleMissedVisitChange}
                          className="form-input"
                        >
                          {missedReasons.map((reason, index) => (
                            <option key={index} value={reason}>{reason}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>ACTION TAKEN:</label>
                        <textarea
                          name="action"
                          value={missedVisitData.action}
                          onChange={handleMissedVisitChange}
                          className="form-input"
                          rows="5"
                        ></textarea>
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="mdNotified"
                          name="mdNotified"
                          checked={missedVisitData.mdNotified}
                          onChange={handleMissedVisitChange}
                        />
                        <label htmlFor="mdNotified">MD WAS NOTIFIED BY PHONE OF MISSED VISIT.</label>
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="noShow"
                          name="noShow"
                          checked={missedVisitData.noShow}
                          onChange={handleMissedVisitChange}
                        />
                        <label htmlFor="noShow">PATIENT WAS A NO-SHOW.</label>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'reschedule' && (
                    <div className="reschedule-tab">
                      <div className="info-message">
                        <i className="fas fa-info-circle"></i>
                        <p>Please select a new date for this visit. The current visit details will be preserved.</p>
                      </div>

                      <div className="form-group">
                        <label>Original Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          readOnly
                          className="form-input readonly"
                        />
                      </div>

                      <div className="form-group">
                        <label>New Date <span className="required">*</span></label>
                        <input
                          type="date"
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          className="form-input"
                          min={certPeriodDates.startDate || undefined}
                          max={certPeriodDates.endDate || undefined}
                        />
                      </div>

                      <div className="form-group">
                        <label>Reason for Rescheduling</label>
                        <textarea
                          name="rescheduleReason"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Enter reason for rescheduling"
                          className="form-input"
                          rows="4"
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="cancel-btn" onClick={() => setShowVisitModal(false)}>
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
              ) : (
                activeTab === 'missedVisit' ? 'Submit Missed Visit' :
                activeTab === 'reschedule' ? 'Reschedule Visit' :
                selectedVisit ? 'Update Visit' : 'Save Visit'
              )}
            </button>
          </div>
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

      <VisitCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        visitData={completionVisitData}
        onSave={handleCompletionFormSave}
      />

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
              <button
                className="add-visit-calendar"
                onClick={() => {
                  setSelectedVisit(null);
                  setShowVisitModal(true);
                }}
              >
                <i className="fas fa-plus"></i>
                <span>Add Visit</span>
              </button>
            </div>
            {renderCalendar()}
          </div>
        )}
      </div>

      {showVisitModal && renderVisitModal()}
      {showDeleteConfirmModal && renderDeleteConfirmModal()}
    </div>
  );
};

export default ScheduleComponent;