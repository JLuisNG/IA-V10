import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../styles/developer/accounting/DisciplineStatistics.scss';

const DisciplineStatistics = ({ 
  stats, 
  onDisciplineSelect, 
  selectedDiscipline, 
  disciplineDetails,
  onResetDiscipline,
  onTherapistClick 
}) => {
  const [expandedDiscipline, setExpandedDiscipline] = useState(null);
  
  // Reset expanded discipline when selectedDiscipline changes
  useEffect(() => {
    if (selectedDiscipline) {
      setExpandedDiscipline(null);
    }
  }, [selectedDiscipline]);
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get discipline info
  const getDisciplineInfo = (discipline) => {
    switch(discipline) {
      case 'PT':
        return { title: 'Physical Therapy', icon: 'fa-walking' };
      case 'PTA':
        return { title: 'Physical Therapy Assistant', icon: 'fa-walking' };
      case 'OT':
        return { title: 'Occupational Therapy', icon: 'fa-hands' };
      case 'COTA':
        return { title: 'OT Assistant', icon: 'fa-hands' };
      case 'ST':
        return { title: 'Speech Therapy', icon: 'fa-comment-medical' };
      case 'STA':
        return { title: 'Speech Therapy Assistant', icon: 'fa-comment-medical' };
      default:
        return { title: discipline, icon: 'fa-user-md' };
    }
  };
  
  // Toggle discipline expanded state
  const toggleExpandDiscipline = (discipline) => {
    if (expandedDiscipline === discipline) {
      setExpandedDiscipline(null);
    } else {
      setExpandedDiscipline(discipline);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {!selectedDiscipline ? (
        <motion.div 
          className="discipline-statistics-section"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="section-header">
            <h2>
              <i className="fas fa-stethoscope"></i>
              Discipline Statistics
            </h2>
            <div className="header-actions">
              <div className="header-hint">
                <i className="fas fa-info-circle"></i>
                <span>Click a discipline for detailed statistics</span>
              </div>
            </div>
          </div>
          
          <div className="discipline-cards">
            {Object.entries(stats).map(([discipline, data], index) => {
              const disciplineInfo = getDisciplineInfo(discipline);
              
              return (
                <div key={discipline} className="discipline-card-container">
                  <motion.div 
                    className={`discipline-card ${discipline.toLowerCase()} ${expandedDiscipline === discipline ? 'expanded' : ''}`}
                    variants={cardVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
                  >
                    <div 
                      className="card-header"
                      onClick={() => toggleExpandDiscipline(discipline)}
                    >
                      <div className="discipline-icon">
                        <i className={`fas ${disciplineInfo.icon}`}></i>
                      </div>
                      <div className="discipline-content">
                        <h3 className="discipline-title">{disciplineInfo.title}</h3>
                        <div className="discipline-stats">
                          <div className="discipline-count">
                            {data.count} <span>visits</span>
                          </div>
                          {/* Eliminamos el conteo de terapeutas */}
                        </div>
                      </div>
                      <div className="discipline-percentage">
                        {data.percentage}%
                      </div>
                      <div className="expand-icon">
                        <i className={`fas fa-chevron-${expandedDiscipline === discipline ? 'up' : 'down'}`}></i>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedDiscipline === discipline && (
                        <motion.div 
                          className="card-details"
                          variants={detailsVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div className="details-summary">
                            <div className="visits-summary">
                              <div className="summary-item">
                                <div className="item-label">
                                  <i className="fas fa-calendar-check"></i> Completed Visits
                                </div>
                                <div className="item-value">{data.completedVisits || Math.floor(data.count * 0.85)}</div>
                              </div>
                              <div className="summary-item">
                                <div className="item-label">
                                  <i className="fas fa-calendar"></i> Upcoming Visits
                                </div>
                                <div className="item-value">{data.upcomingVisits || Math.floor(data.count * 0.15)}</div>
                              </div>
                            </div>
                            <div className="financial-summary">
                              <div className="summary-item">
                                <div className="item-label">Average Per Visit</div>
                                <div className="item-value">$85.00</div>
                              </div>
                              <div className="summary-item">
                                <div className="item-label">Total Revenue</div>
                                <div className="item-value">{formatCurrency(data.count * 85)}</div>
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            className="view-details-btn"
                            onClick={() => onDisciplineSelect(discipline)}
                          >
                            <i className="fas fa-chart-bar"></i>
                            <span>View Detailed Analysis</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="discipline-details-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {disciplineDetails && (
            <>
              <div className="section-header">
                <div className="header-title">
                  <button 
                    className="back-button"
                    onClick={onResetDiscipline}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <h2>
                    <i className={`fas ${getDisciplineInfo(selectedDiscipline).icon}`}></i>
                    {getDisciplineInfo(selectedDiscipline).title} Details
                  </h2>
                </div>
                
                <div className="header-stats">
                  <div className="stat-item">
                    <div className="stat-label">Total Visits</div>
                    <div className="stat-value">{disciplineDetails.count}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Percentage</div>
                    <div className="stat-value">{disciplineDetails.percentage}%</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">{formatCurrency(disciplineDetails.count * 85)}</div>
                  </div>
                </div>
              </div>
              
              <div className="discipline-details-content">
                {/* Reemplazamos la sección de terapeutas por visitas */}
                <div className="visits-section">
                  <h3>
                    <i className="fas fa-calendar-check"></i>
                    Completed Visits
                  </h3>
                  
                  <div className="visits-list">
                    {disciplineDetails.visitDetails && disciplineDetails.visitDetails
                      .filter(visit => visit.status === 'completed')
                      .slice(0, 5)
                      .map((visit) => (
                        <div key={visit.id} className="visit-card">
                          <div className="visit-date">
                            <div className="date-icon">
                              <i className="fas fa-calendar-day"></i>
                            </div>
                            <div className="date-text">{formatDate(visit.date)}</div>
                          </div>
                          <div className="visit-info">
                            <div className="patient-name">{visit.patientName}</div>
                            <div className="visit-details">
                              <span className="therapist-name">
                                <i className="fas fa-user-md"></i> {visit.therapistName}
                              </span>
                              <span className="visit-amount">{formatCurrency(visit.amount)}</span>
                            </div>
                          </div>
                          <div className="status-badge completed">
                            <i className="fas fa-check-circle"></i>
                            <span>Completed</span>
                          </div>
                        </div>
                      ))}
                      
                    {disciplineDetails.visitDetails && 
                     disciplineDetails.visitDetails.filter(visit => visit.status === 'completed').length > 5 && (
                      <div className="view-more">
                        <button className="view-more-btn">
                          <i className="fas fa-plus-circle"></i>
                          <span>View More Completed Visits</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="upcoming-visits-section">
                  <h3>
                    <i className="fas fa-calendar"></i>
                    Upcoming Visits
                  </h3>
                  
                  <div className="visits-list">
                    {disciplineDetails.visitDetails && disciplineDetails.visitDetails
                      .filter(visit => visit.status === 'pending')
                      .slice(0, 5)
                      .map((visit) => (
                        <div key={visit.id} className="visit-card">
                          <div className="visit-date">
                            <div className="date-icon">
                              <i className="fas fa-calendar-day"></i>
                            </div>
                            <div className="date-text">{formatDate(visit.date)}</div>
                          </div>
                          <div className="visit-info">
                            <div className="patient-name">{visit.patientName}</div>
                            <div className="visit-details">
                              <span className="therapist-name">
                                <i className="fas fa-user-md"></i> {visit.therapistName}
                              </span>
                              <span className="visit-amount">{formatCurrency(visit.amount)}</span>
                            </div>
                          </div>
                          <div className="status-badge pending">
                            <i className="fas fa-clock"></i>
                            <span>Pending</span>
                          </div>
                        </div>
                      ))}
                      
                    {disciplineDetails.visitDetails && 
                     disciplineDetails.visitDetails.filter(visit => visit.status === 'pending').length > 5 && (
                      <div className="view-more">
                        <button className="view-more-btn">
                          <i className="fas fa-plus-circle"></i>
                          <span>View More Upcoming Visits</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Mantenemos la sección de visitas recientes pero la renombramos */}
                <div className="all-visits-section">
                  <h3>
                    <i className="fas fa-clipboard-list"></i>
                    All Visits
                  </h3>
                  
                  <div className="visits-table-container">
                    <table className="visits-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Therapist</th>
                          <th>Patient</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {disciplineDetails.visitDetails && disciplineDetails.visitDetails.slice(0, 10).map((visit) => (
                          <tr key={visit.id}>
                            <td>{formatDate(visit.date)}</td>
                            <td className="therapist-cell">
                              <div className="therapist-info">
                                <div className="avatar">
                                  {visit.therapistName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span>{visit.therapistName}</span>
                              </div>
                            </td>
                            <td>{visit.patientName}</td>
                            <td>
                              <span className={`status-badge ${visit.status}`}>
                                <i className={`fas ${visit.status === 'completed' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                                {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                              </span>
                            </td>
                            <td className="amount-cell">{formatCurrency(visit.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {disciplineDetails.visitDetails && disciplineDetails.visitDetails.length > 10 && (
                      <div className="view-more">
                        <button className="view-more-btn">
                          <i className="fas fa-plus-circle"></i>
                          <span>View {disciplineDetails.visitDetails.length - 10} More Visits</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </>
  );
};

export default DisciplineStatistics;