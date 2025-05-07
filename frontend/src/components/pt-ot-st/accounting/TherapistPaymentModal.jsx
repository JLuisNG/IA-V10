import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../styles/developer/accounting/TherapistPaymentModal.scss';

const TPTherapistPaymentModal = ({ therapist, period, onClose, onPatientClick }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [modalTransitionClass, setModalTransitionClass] = useState('entering');
  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateSort, setDateSort] = useState('desc');
  const [patientStats, setPatientStats] = useState(null);
  const [comparedToLastPeriod, setComparedToLastPeriod] = useState({
    earnings: 5.4,
    visits: 3.2,
    patients: 1.5
  });
  
  const modalRef = useRef(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const itemsPerPage = 3;
  
  // Calcular datos de pacientes y visitas
  useEffect(() => {
    if (therapist) {
      // Calcular estadísticas de pacientes
      const patients = therapist.patients || [];
      const totalPatients = patients.length;
      const totalRevenue = patients.reduce((sum, p) => sum + p.revenue, 0);
      const avgRevenuePerPatient = totalPatients ? totalRevenue / totalPatients : 0;
      const totalVisits = patients.reduce((sum, p) => sum + p.visits, 0);
      const avgVisitsPerPatient = totalPatients ? totalVisits / totalPatients : 0;
      
      // Tendencias de pacientes
      const increasingPatients = patients.filter(p => p.visitTrend === 'increasing').length;
      const decreasingPatients = patients.filter(p => p.visitTrend === 'decreasing').length;
      const stablePatients = patients.filter(p => p.visitTrend === 'stable').length;
      
      setPatientStats({
        totalPatients,
        totalRevenue,
        avgRevenuePerPatient,
        totalVisits,
        avgVisitsPerPatient,
        increasingPatients,
        decreasingPatients,
        stablePatients
      });
    }
  }, [therapist]);
  
  // Animar entrada del modal
  useEffect(() => {
    // Primero establecer entering para iniciar la animación
    setModalTransitionClass('entering');
    // Luego establecer active después de un pequeño retraso para permitir la transición
    const timer = setTimeout(() => {
      setModalTransitionClass('active');
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Detectar clics fuera del modal para cerrarlo
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
  
  // Manejar la salida animada del modal
  const handleClose = () => {
    setModalTransitionClass('exiting');
    setTimeout(() => {
      onClose();
    }, 300); // Tiempo suficiente para que se complete la animación
  };
  
  // Manejar verificación de pago con animación mejorada
  const handleVerifyPayment = () => {
    setProcessing(true);
    
    // Simular procesamiento de verificación
    setTimeout(() => {
      setProcessing(false);
      setShowVerifyConfirm(true);
      
      // Cerrar la confirmación después de un tiempo
      setTimeout(() => {
        setShowVerifyConfirm(false);
      }, 2000);
    }, 1200);
  };
  
  // Formatear valores monetarios
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
  
  // Obtener el color e ícono según el rol
  const getRoleStyle = (role) => {
    switch (role) {
      case 'PT':
        return { icon: 'fa-walking', color: 'var(--pt-color, #36D1DC)' };
      case 'PTA':
        return { icon: 'fa-walking', color: 'var(--pta-color, #5B86E5)' };
      case 'OT':
        return { icon: 'fa-hands', color: 'var(--ot-color, #FF9966)' };
      case 'COTA':
        return { icon: 'fa-hands', color: 'var(--cota-color, #FF5E62)' };
      case 'ST':
        return { icon: 'fa-comment-medical', color: 'var(--st-color, #56CCF2)' };
      case 'STA':
        return { icon: 'fa-comment-medical', color: 'var(--sta-color, #2F80ED)' };
      default:
        return { icon: 'fa-user-md', color: 'var(--default-color, #64B5F6)' };
    }
  };
  
  // Calcular estadísticas adicionales
  const averageRevenuePerVisit = therapist ? therapist.earnings / therapist.visits : 0;
  const completedVisits = therapist ? therapist.visits - therapist.pendingVisits : 0;
  
  // Filtrar y paginar pacientes
  const getFilteredPatients = () => {
    if (!therapist || !therapist.patients) return [];
    
    let filtered = [...therapist.patients];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(term) || 
        patient.id.toString().includes(term)
      );
    }
    
    return filtered;
  };
  
  const getPaginatedPatients = () => {
    const filtered = getFilteredPatients();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };
  
  const totalPages = Math.ceil(getFilteredPatients().length / itemsPerPage);
  
  // Filtrar y ordenar visitas
  const getFilteredVisits = () => {
    if (!therapist || !therapist.visitDetails) return [];
    
    let filtered = [...therapist.visitDetails];
    
    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(visit => visit.status === statusFilter);
    }
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(visit => 
        visit.patientName.toLowerCase().includes(term) || 
        visit.type.toLowerCase().includes(term)
      );
    }
    
    // Aplicar ordenamiento por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  };
  
  // Configuración de animaciones
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }
    }
  };
  
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: { 
        delay: custom * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <div className={`therapist-payment-modal-overlay ${modalTransitionClass}`}>
      <motion.div 
        className="therapist-payment-modal"
        ref={modalRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button 
          className="close-button" 
          onClick={handleClose}
          title="Close"
        >
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-header">
          <div className="therapist-info">
            <div 
              className="therapist-avatar"
              style={{ 
                '--role-color': therapist ? getRoleStyle(therapist.role).color : 'rgba(0, 229, 255, 0.5)'
              }}
            >
              {therapist?.avatar ? (
                <img src={therapist.avatar} alt={therapist.name} />
              ) : (
                <div className="avatar-placeholder">
                  {therapist?.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div className="role-badge">
                <i className={`fas ${therapist ? getRoleStyle(therapist.role).icon : 'fa-user-md'}`}></i>
                {therapist?.role}
              </div>
            </div>
            
            <div className="therapist-details">
              <h2>{therapist?.name}</h2>
              <div className="status-info">
                <div className="visits-info">
                  <i className="fas fa-calendar-check"></i>
                  <span>{therapist?.visits} visits</span>
                </div>
                <div className={`status-badge ${therapist?.status}`}>
                  <i className={`fas ${therapist?.status === 'verified' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                  <span>{therapist?.status === 'verified' ? 'Verified' : 'Pending Verification'}</span>
                </div>
                <div className={`growth-badge ${therapist?.growth > 0 ? 'positive' : therapist?.growth < 0 ? 'negative' : 'neutral'}`}>
                  <i className={`fas fa-arrow-${therapist?.growth > 0 ? 'up' : therapist?.growth < 0 ? 'down' : 'right'}`}></i>
                  <span>{Math.abs(therapist?.growth || 0)}% from last period</span>
                </div>
              </div>
            </div>
            
            <div className="earnings-summary">
              <div className="earnings-value">
                {formatCurrency(therapist?.earnings || 0)}
              </div>
              <div className="earnings-period">
                {period ? period.period : 'Current Period'}
              </div>
              <div className="earnings-trend">
                {comparedToLastPeriod.earnings > 0 ? (
                  <div className="trend-positive">
                    <i className="fas fa-arrow-up"></i>
                    {comparedToLastPeriod.earnings}% vs previous
                  </div>
                ) : (
                  <div className="trend-negative">
                    <i className="fas fa-arrow-down"></i>
                    {Math.abs(comparedToLastPeriod.earnings)}% vs previous
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-tabs">
            <button 
              className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              <i className="fas fa-chart-pie"></i>
              <span>Summary</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
              onClick={() => setActiveTab('patients')}
            >
              <i className="fas fa-user-injured"></i>
              <span>Patients</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'visits' ? 'active' : ''}`}
              onClick={() => setActiveTab('visits')}
            >
              <i className="fas fa-clipboard-list"></i>
              <span>Visits</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              <i className="fas fa-lightbulb"></i>
              <span>Insights</span>
            </button>
          </div>
        </div>
        
        <div className="modal-body">
          <AnimatePresence mode="wait">
            {activeTab === 'summary' && (
              <motion.div 
                className="summary-tab"
                key="summary"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="metrics-row">
                  <motion.div 
                    className="metric-box"
                    variants={itemVariants}
                    custom={0}
                  >
                    <div className="metric-icon">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="metric-content">
                      <div className="metric-value">{formatCurrency(therapist?.earnings || 0)}</div>
                      <div className="metric-label">Total Earnings</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="metric-box"
                    variants={itemVariants}
                    custom={1}
                  >
                    <div className="metric-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="metric-content">
                      <div className="metric-value">{therapist?.visits || 0}</div>
                      <div className="metric-label">Total Visits</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="metric-box"
                    variants={itemVariants}
                    custom={2}
                  >
                    <div className="metric-icon">
                      <i className="fas fa-calculator"></i>
                    </div>
                    <div className="metric-content">
                      <div className="metric-value">{formatCurrency(averageRevenuePerVisit)}</div>
                      <div className="metric-label">Average Per Visit</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="metric-box"
                    variants={itemVariants}
                    custom={3}
                  >
                    <div className="metric-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="metric-content">
                      <div className="metric-value">{therapist?.patients?.length || 0}</div>
                      <div className="metric-label">Unique Patients</div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="stats-cards">
                  <motion.div 
                    className="stats-card visits-stats"
                    variants={itemVariants}
                    custom={4}
                  >
                    <h3>Visit Completion</h3>
                    <div className="stats-content">
                      <div className="stats-chart">
                        <div className="progress-circle">
                          <svg viewBox="0 0 36 36" className="circular-chart">
                            <path
                              className="circle-bg"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="circle"
                              strokeDasharray={`${therapist?.completionRate || 0}, 100`}
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              style={{ 
                                '--progress': therapist?.completionRate || 0,
                                stroke: `url(#gradientStroke-${therapist?.id || 0})`
                              }}
                            />
                            <defs>
                              <linearGradient id={`gradientStroke-${therapist?.id || 0}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#36D1DC" />
                                <stop offset="100%" stopColor="#5B86E5" />
                              </linearGradient>
                            </defs>
                            <text x="18" y="18.5" className="percentage">{therapist?.completionRate || 0}%</text>
                          </svg>
                        </div>
                      </div>
                      <div className="stats-details">
                        <div className="stat-item">
                          <div className="stat-label">Completed Visits</div>
                          <div className="stat-value">{completedVisits}</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-label">Pending Visits</div>
                          <div className="stat-value">{therapist?.pendingVisits || 0}</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-label">Completion Rate</div>
                          <div className="stat-value">{therapist?.completionRate || 0}%</div>
                        </div>
                        <div className="stat-item growth-indicator">
                          <div className="stat-label">Visit Growth</div>
                          <div className={`stat-value ${comparedToLastPeriod.visits > 0 ? 'positive' : comparedToLastPeriod.visits < 0 ? 'negative' : 'neutral'}`}>
                            <i className={`fas fa-arrow-${comparedToLastPeriod.visits > 0 ? 'up' : comparedToLastPeriod.visits < 0 ? 'down' : 'right'}`}></i>
                            {Math.abs(comparedToLastPeriod.visits)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="stats-card payment-stats"
                    variants={itemVariants}
                    custom={5}
                  >
                    <h3>Payment Status</h3>
                    <div className="stats-content">
                      <div className="payment-status">
                        <div className={`status-icon ${therapist?.status}`}>
                          <i className={`fas ${therapist?.status === 'verified' ? 'fa-check-circle' : 'fa-hourglass-half'}`}></i>
                        </div>
                        <div className="status-details">
                          <div className="status-label">
                            {therapist?.status === 'verified' ? 'Payment Verified' : 'Pending Verification'}
                          </div>
                          <div className="status-description">
                            {therapist?.status === 'verified' 
                              ? 'Payment has been verified and processed for the current period.' 
                              : 'This payment requires verification before it can be processed.'}
                          </div>
                        </div>
                      </div>
                      
                      {therapist?.status !== 'verified' && (
                        <>
                          <button 
                            className={`verify-button ${processing ? 'processing' : ''}`}
                            onClick={handleVerifyPayment}
                            disabled={processing}
                          >
                            {processing ? (
                              <>
                                <div className="spinner"></div>
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check-circle"></i>
                                <span>Verify Payment</span>
                              </>
                            )}
                          </button>
                          
                          <AnimatePresence>
                            {showVerifyConfirm && (
                              <motion.div 
                                className="verification-confirmation"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                              >
                                <i className="fas fa-check-circle"></i>
                                <span>Payment Verified Successfully</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                      
                      <div className="payment-detail-list">
                        <div className="payment-detail-item">
                          <span className="detail-label">Period:</span>
                          <span className="detail-value">{period?.period || 'Current Period'}</span>
                        </div>
                        <div className="payment-detail-item">
                          <span className="detail-label">Payment Date:</span>
                          <span className="detail-value">{period?.paymentDate || 'N/A'}</span>
                        </div>
                        <div className="payment-detail-item">
                          <span className="detail-label">Amount:</span>
                          <span className="detail-value earnings">{formatCurrency(therapist?.earnings || 0)}</span>
                        </div>
                        <div className="payment-detail-item">
                          <span className="detail-label">Method:</span>
                          <span className="detail-value">Direct Deposit</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Patient Trend Summary Cards */}
                {patientStats && (
                  <motion.div 
                    className="patient-trend-summary"
                    variants={itemVariants}
                    custom={6}
                  >
                    <h3>Patient Trends</h3>
                    <div className="trend-cards">
                      <div className="trend-card">
                        <div className="trend-icon increasing">
                          <i className="fas fa-arrow-up"></i>
                        </div>
                        <div className="trend-content">
                          <div className="trend-value">{patientStats.increasingPatients}</div>
                          <div className="trend-label">Increasing Visits</div>
                        </div>
                      </div>
                      
                      <div className="trend-card">
                        <div className="trend-icon stable">
                          <i className="fas fa-minus"></i>
                        </div>
                        <div className="trend-content">
                          <div className="trend-value">{patientStats.stablePatients}</div>
                          <div className="trend-label">Stable Visits</div>
                        </div>
                      </div>
                      
                      <div className="trend-card">
                        <div className="trend-icon decreasing">
                          <i className="fas fa-arrow-down"></i>
                        </div>
                        <div className="trend-content">
                          <div className="trend-value">{patientStats.decreasingPatients}</div>
                          <div className="trend-label">Decreasing Visits</div>
                        </div>
                      </div>
                      
                      <div className="trend-card highlight">
                        <div className="trend-icon">
                          <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="trend-content">
                          <div className="trend-value">{patientStats.avgVisitsPerPatient.toFixed(1)}</div>
                          <div className="trend-label">Avg. Visits/Patient</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {activeTab === 'patients' && (
              <motion.div 
                className="patients-tab"
                key="patients"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="tab-header">
                  <h3>Patient Visits & Revenue</h3>
                  <div className="search-filter">
                    <i className="fas fa-search"></i>
                    <input 
                      type="text" 
                      placeholder="Search patients..."
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
                  <div className="header-actions">
                    <button className="action-button export-btn">
                      <i className="fas fa-file-export"></i>
                      <span>Export</span>
                    </button>
                  </div>
                </div>
                
                {therapist?.patients && therapist.patients.length > 0 ? (
                  <div className="patients-list">
                    <div className="table-header">
                      <div className="header-cell">Patient</div>
                      <div className="header-cell">Visits</div>
                      <div className="header-cell">Revenue</div>
                      <div className="header-cell">Last Visit</div>
                      <div className="header-cell">Trend</div>
                      <div className="header-cell">Actions</div>
                    </div>
                    
                    <div className="table-body">
                      <AnimatePresence>
                        {getPaginatedPatients().map((patient, index) => (
                          <motion.div 
                            key={patient.id}
                            className="patient-row"
                            variants={itemVariants}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20 }}
                            layout
                          >
                            <div className="cell patient-info">
                              <div className="patient-avatar">
                                <div className="avatar-placeholder">
                                  {patient.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              </div>
                              <div className="patient-details">
                                <div className="patient-name">{patient.name}</div>
                                <div className="patient-id">ID: {patient.id}</div>
                              </div>
                            </div>
                            <div className="cell visits-cell">
                              <div className="value">{patient.visits}</div>
                            </div>
                            <div className="cell revenue-cell">
                              <div className="value">{formatCurrency(patient.revenue)}</div>
                            </div>
                            <div className="cell last-visit-cell">
                              <div className="value">{formatDate(patient.lastVisit)}</div>
                            </div>
                            <div className="cell trend-cell">
                              <div className={`trend-badge ${patient.visitTrend}`}>
                                <i className={`fas ${
                                  patient.visitTrend === 'increasing' 
                                    ? 'fa-arrow-up' 
                                    : patient.visitTrend === 'decreasing' 
                                      ? 'fa-arrow-down' 
                                      : 'fa-minus'
                                }`}></i>
                                <span>{patient.visitTrend}</span>
                              </div>
                            </div>
                            <div className="cell actions-cell">
                              <button 
                                className="view-patient-btn"
                                onClick={() => onPatientClick(patient.id)}
                              >
                                <i className="fas fa-external-link-alt"></i>
                                <span>View Profile</span>
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="pagination-controls">
                        <button 
                          className="pagination-btn"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <div className="pagination-info">
                          Page {currentPage} of {totalPages}
                        </div>
                        <button 
                          className="pagination-btn"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-patients">
                    <div className="no-data-icon">
                      <i className="fas fa-user-injured"></i>
                    </div>
                    <h4>No patients found</h4>
                    <p>There are no patients assigned to this therapist for the selected period.</p>
                  </div>
                )}
                
                {/* Patient Statistics Summary */}
                {patientStats && (
                  <div className="patient-stats-summary">
                    <div className="summary-stat">
                      <div className="stat-value">{patientStats.totalPatients}</div>
                      <div className="stat-label">Total Patients</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-value">{formatCurrency(patientStats.totalRevenue)}</div>
                      <div className="stat-label">Total Revenue</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-value">{formatCurrency(patientStats.avgRevenuePerPatient)}</div>
                      <div className="stat-label">Avg. Revenue/Patient</div>
                    </div>
                    <div className="summary-stat">
                      <div className="stat-value">{patientStats.totalVisits}</div>
                      <div className="stat-label">Total Visits</div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === 'visits' && (
              <motion.div 
                className="visits-tab"
                key="visits"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="tab-header">
                  <h3>Visit Details</h3>
                  <div className="filter-controls">
                    <div className="search-box">
                      <i className="fas fa-search"></i>
                      <input 
                        type="text" 
                        placeholder="Search visits..." 
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
                    <div className="status-filter">
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                      </select>
                      <i className="fas fa-filter"></i>
                    </div>
                    <div className="date-sort">
                      <button 
                        className={`sort-btn ${dateSort === 'desc' ? 'active' : ''}`}
                        onClick={() => setDateSort('desc')}
                      >
                        <i className="fas fa-sort-amount-down"></i>
                        <span>Newest</span>
                      </button>
                      <button 
                        className={`sort-btn ${dateSort === 'asc' ? 'active' : ''}`}
                        onClick={() => setDateSort('asc')}
                      >
                        <i className="fas fa-sort-amount-up"></i>
                        <span>Oldest</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="visit-details-table">
                  <div className="table-header">
                    <div className="header-cell">Date & Time</div>
                    <div className="header-cell">Patient</div>
                    <div className="header-cell">Visit Type</div>
                    <div className="header-cell">Duration</div>
                    <div className="header-cell">Status</div>
                    <div className="header-cell">Amount</div>
                  </div>
                  
                  <div className="table-body visits-list">
                    <AnimatePresence>
                      {getFilteredVisits().map((visit, index) => (
                        <motion.div 
                          key={visit.id}
                          className="visit-row"
                          variants={itemVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -20 }}
                          layout
                        >
                          <div className="cell date-cell">
                            <div className="visit-datetime">
                              <div className="visit-date">{formatDate(visit.date)}</div>
                              <div className="visit-time">{visit.time}</div>
                            </div>
                          </div>
                          <div className="cell patient-cell">
                            <div className="patient-info">
                              <div className="patient-name">{visit.patientName}</div>
                              <div className="patient-id">ID: {visit.patientId}</div>
                            </div>
                          </div>
                          <div className="cell visit-type-cell">
                            <div className="visit-type">
                              {visit.type}
                            </div>
                          </div>
                          <div className="cell duration-cell">
                            <div className="duration">{visit.duration} min</div>
                          </div>
                          <div className="cell status-cell">
                            <div className={`status-badge ${visit.status}`}>
                              <i className={`fas ${visit.status === 'completed' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                              <span>{visit.status === 'completed' ? 'Completed' : 'Pending'}</span>
                            </div>
                          </div>
                          <div className="cell amount-cell">
                            <div className="amount">{formatCurrency(visit.amount)}</div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {getFilteredVisits().length === 0 && (
                      <div className="no-visits-message">
                        <i className="fas fa-search"></i>
                        <p>No visits match your filters. Try adjusting your search criteria.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Visit Statistics */}
                <div className="visit-stats">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{therapist?.visits || 0}</div>
                      <div className="stat-label">Total Visits</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {therapist?.visitDetails ? 
                          Math.round(therapist.visitDetails.reduce((sum, visit) => sum + visit.duration, 0) / therapist.visitDetails.length) :
                          0} min
                      </div>
                      <div className="stat-label">Avg. Duration</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{formatCurrency(averageRevenuePerVisit)}</div>
                      <div className="stat-label">Avg. Revenue/Visit</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-hourglass-half"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{therapist?.pendingVisits || 0}</div>
                      <div className="stat-label">Pending Visits</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* New Insights Tab */}
            {activeTab === 'insights' && (
              <motion.div 
                className="insights-tab"
                key="insights"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="tab-header">
                  <h3>Performance Insights</h3>
                </div>
                
                <div className="insights-content">
                  <div className="insight-cards">
                    <div className="insight-card">
                      <div className="insight-header">
                        <div className="insight-icon">
                          <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="insight-title">Revenue Trend</div>
                      </div>
                      <div className="insight-body">
                        <div className="insight-value">
                          <i className={`fas ${comparedToLastPeriod.earnings >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                          <span>{Math.abs(comparedToLastPeriod.earnings)}%</span>
                        </div>
                        <div className="insight-description">
                          {comparedToLastPeriod.earnings >= 0 
                            ? `Revenue has increased by ${comparedToLastPeriod.earnings}% compared to the previous period.` 
                            : `Revenue has decreased by ${Math.abs(comparedToLastPeriod.earnings)}% compared to the previous period.`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="insight-card">
                      <div className="insight-header">
                        <div className="insight-icon">
                          <i className="fas fa-user-clock"></i>
                        </div>
                        <div className="insight-title">Visit Efficiency</div>
                      </div>
                      <div className="insight-body">
                        <div className="insight-value">95%</div>
                        <div className="insight-description">
                          This therapist maintains high efficiency with visits typically completed within scheduled time.
                        </div>
                      </div>
                    </div>
                    
                    <div className="insight-card">
                      <div className="insight-header">
                        <div className="insight-icon">
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="insight-title">Patient Retention</div>
                      </div>
                      <div className="insight-body">
                        <div className="insight-value">
                          <i className="fas fa-arrow-up"></i>
                          <span>{comparedToLastPeriod.patients}%</span>
                        </div>
                        <div className="insight-description">
                          Patient retention rate has improved by {comparedToLastPeriod.patients}% from the previous period.
                        </div>
                      </div>
                    </div>
                    
                    <div className="insight-card">
                      <div className="insight-header">
                        <div className="insight-icon">
                          <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div className="insight-title">Schedule Utilization</div>
                      </div>
                      <div className="insight-body">
                        <div className="insight-value">92%</div>
                        <div className="insight-description">
                          This therapist maintains high schedule utilization with minimal gaps between appointments.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="recommendations-section">
                    <h4>
                      <i className="fas fa-lightbulb"></i>
                      Recommendations
                    </h4>
                    <ul className="recommendations-list">
                      <li className="recommendation-item">
                        <div className="recommendation-icon">
                          <i className="fas fa-chart-pie"></i>
                        </div>
                        <div className="recommendation-content">
                          <div className="recommendation-title">Optimize Patient Mix</div>
                          <div className="recommendation-description">
                            Consider increasing focus on initial evaluations which have shown higher revenue per visit.
                          </div>
                        </div>
                      </li>
                      <li className="recommendation-item">
                        <div className="recommendation-icon">
                          <i className="fas fa-clock"></i>
                        </div>
                        <div className="recommendation-content">
                          <div className="recommendation-title">Improve Documentation Time</div>
                          <div className="recommendation-description">
                            Documentation is taking longer than average. Consider templates to improve efficiency.
                          </div>
                        </div>
                      </li>
                      <li className="recommendation-item">
                        <div className="recommendation-icon">
                        <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="recommendation-content">
                          <div className="recommendation-title">Focus on Retention</div>
                          <div className="recommendation-description">
                            Identify patients with decreasing visit trends and implement retention strategies.
                          </div>
                        </div>
                      </li>
                      <li className="recommendation-item">
                        <div className="recommendation-icon">
                          <i className="fas fa-dollar-sign"></i>
                        </div>
                        <div className="recommendation-content">
                          <div className="recommendation-title">Revenue Optimization</div>
                          <div className="recommendation-description">
                            Consider adjusting session lengths for complex cases to optimize billing.
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="performance-highlights">
                    <h4>
                      <i className="fas fa-star"></i>
                      Performance Highlights
                    </h4>
                    <div className="highlights-list">
                      <div className="highlight-item">
                        <div className="highlight-badge">
                          <i className="fas fa-thumbs-up"></i>
                        </div>
                        <div className="highlight-text">
                          Highest completion rate among all {therapist?.role} therapists
                        </div>
                      </div>
                      <div className="highlight-item">
                        <div className="highlight-badge">
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="highlight-text">
                          Above average number of patients per period
                        </div>
                      </div>
                      <div className="highlight-item">
                        <div className="highlight-badge">
                          <i className="fas fa-calendar-check"></i>
                        </div>
                        <div className="highlight-text">
                          Consistent visit schedule with minimal cancellations
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="modal-footer">
          <div className="payment-period-info">
            <i className="fas fa-calendar-alt"></i>
            <span>Payment Period: {period ? period.period : 'Current Period'}</span>
          </div>
          
          <div className="footer-actions">
            <button className="secondary-btn" onClick={handleClose}>
              <i className="fas fa-times"></i>
              <span>Close</span>
            </button>
            <button className="primary-btn print-btn">
              <i className="fas fa-print"></i>
              <span>Print Report</span>
            </button>
            <button className="primary-btn export-btn">
              <i className="fas fa-file-export"></i>
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TPTherapistPaymentModal;