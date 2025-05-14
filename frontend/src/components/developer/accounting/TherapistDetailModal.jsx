import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '..//../../styles/developer/accounting/TherapistDetailModal.scss';

// Tipos de visita para la pestaña de visitas
const VISIT_TYPES = [
  "Regular therapy session",
  "Initial Eval",
  "Recertification evaluation",
  "Discharge (DC w/o a visit)",
  "Post-Hospital Eval",
  "Reassessment",
  "SOC OASIS",
  "ROC OASIS",
  "ReCert OASIS",
  "Follow-Up OASIS",
  "DC OASIS",
  "Supervision Assessment"
];

const TherapistDetailModal = ({ therapist, period, onClose, onPatientClick }) => {
  // States
  const [activeTab, setActiveTab] = useState('summary');
  const [modalTransition, setModalTransition] = useState('entering');
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Refs
  const modalRef = useRef(null);
  
  // Datos de visitas del terapeuta (simulados)
  const visitDetails = useMemo(() => ([
    { id: 1001, patientId: 101, patientName: "Soheila Adhami", date: "2025-03-14", time: "09:30 AM", type: "Regular therapy session", duration: 45, status: "completed", amount: 85.00, notes: "Continued with strength and mobility exercises. Patient showing improvement in gait pattern." },
    { id: 1002, patientId: 102, patientName: "James Smith", date: "2025-03-15", time: "11:00 AM", type: "Initial Eval", duration: 60, status: "completed", amount: 105.00, notes: "Comprehensive assessment completed. Beginning treatment for rotator cuff injury." },
    { id: 1003, patientId: 103, patientName: "Maria Rodriguez", date: "2025-03-12", time: "02:30 PM", type: "Follow-Up OASIS", duration: 30, status: "completed", amount: 65.00, notes: "OASIS reassessment completed. Patient showing significant improvement in all metrics." },
    { id: 1004, patientId: 101, patientName: "Soheila Adhami", date: "2025-03-11", time: "10:15 AM", type: "Regular therapy session", duration: 45, status: "completed", amount: 85.00, notes: "Focused on balance and proprioception exercises. Patient reports decreased pain." },
    { id: 1005, patientId: 102, patientName: "James Smith", date: "2025-03-09", time: "03:45 PM", type: "Post-Hospital Eval", duration: 60, status: "completed", amount: 105.00, notes: "Post-surgical assessment following knee replacement. Establishing home exercise program." },
    { id: 1006, patientId: 112, patientName: "Anna Johnson", date: "2025-03-10", time: "01:15 PM", type: "ROC OASIS", duration: 45, status: "completed", amount: 85.00, notes: "Resumption of care assessment completed. Updated care plan to address new limitations." },
    { id: 1007, patientId: 118, patientName: "Luis Chen", date: "2025-03-13", time: "11:30 AM", type: "Regular therapy session", duration: 45, status: "pending", amount: 85.00, notes: "Scheduled for functional mobility assessment and gait training." }
  ]), []);
  
  // Inicializar animaciones del modal
  useEffect(() => {
    setModalTransition('entering');
    setTimeout(() => {
      setModalTransition('active');
    }, 50);
    
    // Cerrar modal al presionar Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);
  
  // Inicializar visitas filtradas
  useEffect(() => {
    if (therapist) {
      setFilteredVisits(visitDetails);
    }
  }, [therapist, visitDetails]);
  
  // Aplicar filtro de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVisits(visitDetails);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = visitDetails.filter(visit => 
        visit.patientName.toLowerCase().includes(term) ||
        visit.date.includes(term) ||
        visit.type.toLowerCase().includes(term) ||
        visit.notes.toLowerCase().includes(term)
      );
      setFilteredVisits(filtered);
    }
  }, [searchTerm, visitDetails]);
  
  // Manejar clic fuera del modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Cerrar modal con animación
  const handleClose = () => {
    setModalTransition('exiting');
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Solicitar ordenamiento de una columna
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    // Aplicar ordenamiento
    const sortedVisits = [...filteredVisits].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredVisits(sortedVisits);
  };
  
  // Obtener indicador de ordenamiento
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return 'fas fa-sort';
    }
    return sortConfig.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  };
  
  // Manejar refresco de datos
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simular refresco de datos
    setTimeout(() => {
      setFilteredVisits([...visitDetails]);
      setIsRefreshing(false);
    }, 800);
  };
  
  // Manejar clic en paciente
  const handlePatientClick = (patientId) => {
    if (onPatientClick) {
      onPatientClick(patientId);
    }
  };
  
  // Obtener estilo según el rol
  const getRoleStyle = (role) => {
    switch(role) {
      case 'PT':
        return { icon: 'fa-walking', color: '#36D1DC' };
      case 'PTA':
        return { icon: 'fa-walking', color: '#5B86E5' };
      case 'OT':
        return { icon: 'fa-hands', color: '#FF9966' };
      case 'COTA':
        return { icon: 'fa-hands', color: '#FF5E62' };
      case 'ST':
        return { icon: 'fa-comment-medical', color: '#56CCF2' };
      case 'STA':
        return { icon: 'fa-comment-medical', color: '#2F80ED' };
      default:
        return { icon: 'fa-user-md', color: '#64B5F6' };
    }
  };
  
  // Calcular cambio de rendimiento
  const calculatePerformanceChange = () => {
    if (!therapist) return { value: 0, isPositive: true };
    
    // Simulamos datos históricos para comparación
    const previousMonthEarnings = therapist.earnings / (1 + therapist.growth / 100);
    const change = therapist.growth;
    
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
      previousEarnings: previousMonthEarnings
    };
  };
  
  // Obtener total de ganancias por visitas
  const getTotalVisitsEarning = () => {
    if (!filteredVisits.length) return 0;
    return filteredVisits.reduce((sum, visit) => sum + visit.amount, 0);
  };
  
  // Calcular visitas completadas, pendientes y perdidas
  const calculateVisitStats = () => {
    if (!therapist) return { completed: 0, pending: 0, lost: 0 };
    
    const pendingVisits = therapist.pendingVisits || 0;
    // Simulamos visitas perdidas como un pequeño porcentaje
    const lostVisits = Math.round(therapist.visits * 0.05);
    const completedVisits = therapist.visits - pendingVisits - lostVisits;
    
    return { 
      completed: completedVisits, 
      pending: pendingVisits, 
      lost: lostVisits,
      completionRate: therapist.completionRate || 0
    };
  };
  
  // Variantes de animación
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.4, 
        ease: [0.19, 1, 0.22, 1]
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20, 
      transition: { 
        duration: 0.3, 
        ease: [0.6, -0.05, 0.01, 0.99]
      } 
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4, 
        ease: "easeOut" 
      } 
    }
  };

  // Datos para la comparación de rendimiento
  const performanceComparison = calculatePerformanceChange();
  
  // Estadísticas de visitas
  const visitStats = calculateVisitStats();
  
  // Estilo según el rol del terapeuta
  const roleStyle = getRoleStyle(therapist?.role || 'PT');

  // No renderizar nada si no hay terapeuta
  if (!therapist) return null;

  return (
    <div className={`therapist-detail-modal-backdrop ${modalTransition}`}>
      <motion.div 
        className="therapist-detail-modal-container"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="therapist-detail-modal-content"
          ref={modalRef}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button 
            className="therapist-detail-modal-close-button" 
            onClick={handleClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
          
          <div className="therapist-detail-modal-header">
            <div className="therapist-detail-profile">
              <div 
                className="therapist-detail-avatar"
                style={{ borderColor: roleStyle.color }}
              >
                <div className="therapist-detail-avatar-placeholder">
                  {therapist.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div 
                  className="therapist-detail-role-badge"
                  style={{ backgroundColor: `${roleStyle.color}16`, color: roleStyle.color }}
                >
                  <i className={`fas ${roleStyle.icon}`}></i>
                  {therapist.role}
                </div>
              </div>
              
              <div className="therapist-detail-info">
                <h2>{therapist.name}</h2>
                <div className="therapist-detail-stats">
                  <div className="therapist-detail-stat-badge visits">
                    <i className="fas fa-calendar-check"></i>
                    <span>{therapist.visits} visits</span>
                  </div>
                  <div className={`therapist-detail-stat-badge growth ${therapist.growth >= 0 ? 'positive' : 'negative'}`}>
                    <i className={`fas fa-arrow-${therapist.growth >= 0 ? 'up' : 'down'}`}></i>
                    <span>{Math.abs(therapist.growth)}% growth</span>
                  </div>
                  <div className={`therapist-detail-stat-badge status ${therapist.status}`}>
                    <i className={`fas ${therapist.status === 'verified' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                    <span>{therapist.status === 'verified' ? 'Verified' : 'Pending'}</span>
                  </div>
                </div>
              </div>
              
              <div className="therapist-detail-earnings-summary">
                <div className="therapist-detail-earnings-amount">{formatCurrency(therapist.earnings)}</div>
                <div className="therapist-detail-earnings-period">{period?.period}</div>
              </div>
            </div>
            
            <div className="therapist-detail-tab-navigation">
              <button 
                className={`therapist-detail-tab-button ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                <i className="fas fa-chart-pie"></i>
                <span>Summary</span>
              </button>
              <button 
                className={`therapist-detail-tab-button ${activeTab === 'patients' ? 'active' : ''}`}
                onClick={() => setActiveTab('patients')}
              >
                <i className="fas fa-user-injured"></i>
                <span>Patients</span>
              </button>
              <button 
                className={`therapist-detail-tab-button ${activeTab === 'visits' ? 'active' : ''}`}
                onClick={() => setActiveTab('visits')}
              >
                <i className="fas fa-clipboard-list"></i>
                <span>Visits</span>
              </button>
            </div>
          </div>
          
          <div className="therapist-detail-modal-body">
            <AnimatePresence mode="wait">
              {activeTab === 'summary' && (
                <motion.div 
                  key="summary"
                  className="therapist-detail-summary-tab"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={contentVariants}
                >
                  <div className="therapist-detail-metrics-row">
                    <motion.div className="therapist-detail-metric-card" variants={itemVariants}>
                      <div className="therapist-detail-metric-icon">
                        <i className="fas fa-dollar-sign"></i>
                      </div>
                      <div className="therapist-detail-metric-content">
                        <div className="therapist-detail-metric-value">{formatCurrency(therapist.earnings)}</div>
                        <div className="therapist-detail-metric-label">Total Earnings</div>
                      </div>
                    </motion.div>
                    
                    <motion.div className="therapist-detail-metric-card" variants={itemVariants}>
                      <div className="therapist-detail-metric-icon">
                        <i className="fas fa-calendar-check"></i>
                      </div>
                      <div className="therapist-detail-metric-content">
                        <div className="therapist-detail-metric-value">{therapist.visits}</div>
                        <div className="therapist-detail-metric-label">Total Visits</div>
                      </div>
                    </motion.div>
                    
                    <motion.div className="therapist-detail-metric-card" variants={itemVariants}>
                      <div className="therapist-detail-metric-icon">
                        <i className="fas fa-calculator"></i>
                      </div>
                      <div className="therapist-detail-metric-content">
                        <div className="therapist-detail-metric-value">{formatCurrency(therapist.earnings / therapist.visits)}</div>
                        <div className="therapist-detail-metric-label">Avg. Per Visit</div>
                      </div>
                    </motion.div>
                    
                    <motion.div className="therapist-detail-metric-card" variants={itemVariants}>
                      <div className="therapist-detail-metric-icon">
                        <i className="fas fa-user-injured"></i>
                      </div>
                      <div className="therapist-detail-metric-content">
                        <div className="therapist-detail-metric-value">{therapist.patients?.length || 0}</div>
                        <div className="therapist-detail-metric-label">Unique Patients</div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div className="therapist-detail-stats-card" variants={itemVariants}>
                    <h3>
                      <i className="fas fa-tasks"></i>
                      Visit Statistics
                    </h3>
                    <div className="therapist-detail-stats-content">
                      <div className="therapist-detail-stats-progress">
                        <svg viewBox="0 0 36 36" className="therapist-detail-stats-circular-chart">
                          <defs>
                            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#00e5ff" />
                              <stop offset="100%" stopColor="#2979ff" />
                            </linearGradient>
                          </defs>
                          <path
                            className="therapist-detail-stats-circle-bg"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="therapist-detail-stats-circle"
                            strokeDasharray={`${visitStats.completionRate || 0}, 100`}
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            stroke="url(#circleGradient)"
                          />
                          <text x="18" y="18.5" className="therapist-detail-stats-percentage">
                            {visitStats.completionRate || 0}%
                          </text>
                        </svg>
                      </div>
                      
                      <div className="therapist-detail-stats-details">
                        <div className="therapist-detail-stats-item">
                          <div className="therapist-detail-stats-label">Completed Visits</div>
                          <div className="therapist-detail-stats-value">{visitStats.completed}</div>
                        </div>
                        <div className="therapist-detail-stats-item">
                          <div className="therapist-detail-stats-label">Pending Visits</div>
                          <div className="therapist-detail-stats-value">{visitStats.pending}</div>
                        </div>
                        <div className="therapist-detail-stats-item">
                          <div className="therapist-detail-stats-label">Lost Visits</div>
                          <div className="therapist-detail-stats-value">{visitStats.lost}</div>
                        </div>
                        <div className="therapist-detail-stats-item">
                          <div className="therapist-detail-stats-label">Completion Rate</div>
                          <div className="therapist-detail-stats-value">{visitStats.completionRate}%</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div className="therapist-detail-performance-card" variants={itemVariants}>
                    <h3>
                      <i className="fas fa-chart-line"></i>
                      Performance Analysis
                    </h3>
                    <div className="therapist-detail-performance-content">
                      <div className={`therapist-detail-performance-indicator ${performanceComparison.isPositive ? 'positive' : 'negative'}`}>
                        <i className={`fas fa-arrow-${performanceComparison.isPositive ? 'up' : 'down'}`}></i>
                        <span>{performanceComparison.value}%</span>
                      </div>
                      <div className="therapist-detail-performance-description">
                        {performanceComparison.isPositive 
                          ? `Therapist has shown a ${performanceComparison.value}% increase in performance compared to previous period (${formatCurrency(performanceComparison.previousEarnings)}).` 
                          : `Therapist has shown a ${performanceComparison.value}% decrease in performance compared to previous period (${formatCurrency(performanceComparison.previousEarnings)}).`
                        }
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              {activeTab === 'patients' && (
                <motion.div 
                  key="patients"
                  className="therapist-detail-patients-tab"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={contentVariants}
                >
                  <motion.div className="therapist-detail-patients-header" variants={itemVariants}>
                    <h3>
                      <i className="fas fa-user-injured"></i>
                      Patient List
                    </h3>
                    <div className="therapist-detail-patients-count">
                      <span>Total: </span>
                      <strong>{therapist.patients?.length || 0} patients</strong>
                    </div>
                  </motion.div>
                  
                  {therapist.patients && therapist.patients.length > 0 ? (
                    <motion.div className="therapist-detail-patients-grid" variants={itemVariants}>
                      {therapist.patients.map((patient) => (
                        <div 
                          key={patient.id} 
                          className="therapist-detail-patient-card"
                          onClick={() => handlePatientClick(patient.id)}
                        >
                          <div className="therapist-detail-patient-avatar">
                            <div className="therapist-detail-patient-avatar-placeholder">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                          <div className="therapist-detail-patient-info">
                            <div className="therapist-detail-patient-name">{patient.name}</div>
                            <div className="therapist-detail-patient-id">ID: {patient.id}</div>
                          </div>
                          <div className="therapist-detail-patient-stats">
                            <div className="therapist-detail-patient-stat-item">
                              <i className="fas fa-calendar-check"></i>
                              <span>{patient.visits} visits</span>
                            </div>
                            <div className="therapist-detail-patient-stat-item">
                              <i className="fas fa-dollar-sign"></i>
                              <span>{formatCurrency(patient.revenue)}</span>
                            </div>
                            <div className="therapist-detail-patient-stat-item">
                              <i className="fas fa-clock"></i>
                              <span>Last: {formatDate(patient.lastVisit)}</span>
                            </div>
                          </div>
                          <div className={`therapist-detail-patient-trend-badge ${patient.visitTrend || 'stable'}`}>
                            <i className={`fas ${
                              patient.visitTrend === 'increasing' 
                                ? 'fa-arrow-up' 
                                : patient.visitTrend === 'decreasing' 
                                  ? 'fa-arrow-down' 
                                  : 'fa-minus'
                            }`}></i>
                            <span>{patient.visitTrend || 'stable'}</span>
                          </div>
                          <div className="therapist-detail-patient-profile-link">
                            <i className="fas fa-external-link-alt"></i>
                            <span>View Profile</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div className="therapist-detail-no-data" variants={itemVariants}>
                      <div className="therapist-detail-no-data-icon">
                        <i className="fas fa-user-injured"></i>
                      </div>
                      <p>No patient data available for this therapist.</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {activeTab === 'visits' && (
                <motion.div 
                  key="visits"
                  className="therapist-detail-visits-tab"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={contentVariants}
                >
                  <motion.div className="therapist-detail-visits-header" variants={itemVariants}>
                    <div className="therapist-detail-visits-search">
                      <i className="fas fa-search"></i>
                      <input 
                        type="text" 
                        placeholder="Search by patient, visit type, or notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button 
                          className="therapist-detail-visits-clear-search" 
                          onClick={() => setSearchTerm('')}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                    
                    <div className="therapist-detail-visits-summary">
                      <div className="therapist-detail-visits-summary-item">
                        <span>Total: </span>
                        <strong>{filteredVisits.length} visits</strong>
                      </div>
                      <div className="therapist-detail-visits-summary-item">
                        <span>Earnings: </span>
                        <strong>{formatCurrency(getTotalVisitsEarning())}</strong>
                      </div>
                    </div>
                  </motion.div>
                  
<motion.div className="therapist-detail-visits-table-wrapper" variants={itemVariants}>
  {filteredVisits.length > 0 ? (
    <table className="therapist-detail-visits-table">
      <thead>
        <tr>
          <th 
            className="therapist-detail-visits-sortable"
            onClick={() => requestSort('date')}
          >
            Date
            <i className={getSortIndicator('date')}></i>
          </th>
          <th 
            className="therapist-detail-visits-sortable"
            onClick={() => requestSort('patientName')}
          >
            Patient
            <i className={getSortIndicator('patientName')}></i>
          </th>
          <th 
            className="therapist-detail-visits-sortable"
            onClick={() => requestSort('type')}
          >
            Visit Type
            <i className={getSortIndicator('type')}></i>
          </th>
          <th 
            className="therapist-detail-visits-sortable"
            onClick={() => requestSort('duration')}
          >
            Duration
            <i className={getSortIndicator('duration')}></i>
          </th>
          <th>Status</th>
          <th 
            className="therapist-detail-visits-sortable"
            onClick={() => requestSort('amount')}
          >
            Amount
            <i className={getSortIndicator('amount')}></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredVisits.map((visit) => (
          <tr key={visit.id} className={visit.status === 'pending' ? 'therapist-detail-visits-pending-row' : ''}>
            <td>{formatDate(visit.date)}</td>
            <td>
              <div className="therapist-detail-visits-patient-cell" onClick={() => handlePatientClick(visit.patientId)}>
                <span>{visit.patientName}</span>
                <i className="fas fa-external-link-alt"></i>
              </div>
            </td>
            <td>
              <span className="therapist-detail-visits-type-badge">{visit.type}</span>
            </td>
            <td>{visit.duration} min</td>
            <td>
              <div className={`therapist-detail-visits-status-badge ${visit.status}`}>
                <i className={`fas ${visit.status === 'completed' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                <span>{visit.status}</span>
              </div>
            </td>
            <td className="therapist-detail-visits-amount-cell">{formatCurrency(visit.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="therapist-detail-no-results">
      <div className="therapist-detail-no-results-icon">
        <i className="fas fa-search"></i>
      </div>
      <p>No visits found matching your search criteria.</p>
      {searchTerm && (
        <button 
          className="therapist-detail-clear-filters-btn"
          onClick={() => setSearchTerm('')}
        >
          <i className="fas fa-undo"></i>
          <span>Clear Search</span>
        </button>
      )}
    </div>
  )}
</motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="therapist-detail-modal-footer">
            <div className="therapist-detail-period-info">
              <i className="fas fa-calendar-alt"></i>
              <span>Payment Period: {period?.period}</span>
            </div>
            
            <div className="therapist-detail-modal-actions">
              <button 
                className={`therapist-detail-refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <i className="fas fa-sync-alt"></i>
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <button 
                className="therapist-detail-close-btn" 
                onClick={handleClose}
              >
                <i className="fas fa-times"></i>
                <span>Close</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TherapistDetailModal;