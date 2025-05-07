import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../styles/developer/accounting/PaymentPeriodSelector.scss';

const DevPaymentPeriodSelector = ({ periods, selectedPeriod, onPeriodChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedPeriods, setAnimatedPeriods] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const containerRef = useRef(null);
  
  // Efecto para animación de entrada escalonada de los períodos
  useEffect(() => {
    if (periods.length > 0) {
      // Clonar períodos para no mutar los originales
      const periodsWithAnimation = [...periods];
      
      // Agregar períodos con delay para animación escalonada
      const timer = setTimeout(() => {
        setAnimatedPeriods(periodsWithAnimation);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [periods]);
  
  // Efecto para cerrar el selector al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Funciones para gestionar hover para efectos visuales mejorados
  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };
  
  const handleMouseLeave = () => {
    setHoverIndex(null);
  };
  
  // Función para determinar la clase de estado
  const getStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'status-paid';
      case 'pending':
        return 'status-pending';
      case 'upcoming':
        return 'status-upcoming';
      default:
        return '';
    }
  };
  
  // Función para obtener el icono según el estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return 'fa-check-circle';
      case 'pending':
        return 'fa-clock';
      case 'upcoming':
        return 'fa-calendar-alt';
      default:
        return 'fa-circle';
    }
  };
  
  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Unknown';
    }
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
  
  // Configuración de animaciones con framer-motion
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: { 
        delay: custom * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      x: 5,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="payment-period-selector" ref={containerRef}>
      {/* Período seleccionado actualmente con animaciones mejoradas */}
      <motion.div 
        className={`selected-period ${isExpanded ? 'expanded' : ''}`} 
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ y: -3, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.25)" }}
        whileTap={{ y: -1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {selectedPeriod ? (
          <div className="period-info">
            <div className="period-main">
              <div className={`period-status ${getStatusClass(selectedPeriod.status)}`}>
                <i className={`fas ${getStatusIcon(selectedPeriod.status)}`}></i>
                <span>{getStatusText(selectedPeriod.status)}</span>
              </div>
              <div className="period-dates">
                <span className="period-range">{selectedPeriod.period}</span>
                <span className="payment-date">
                  <i className="fas fa-calendar-check"></i>
                  Payment: {selectedPeriod.paymentDate}
                </span>
              </div>
            </div>
            <div className="period-amount">
              <span className="amount-label">Total:</span>
              <span className="amount-value">{formatCurrency(selectedPeriod.amount)}</span>
            </div>
            <div className="period-arrow">
              <motion.i 
                className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              ></motion.i>
            </div>
          </div>
        ) : (
          <div className="no-period-selected">
            <i className="fas fa-calendar-alt"></i>
            <span>Select a payment period</span>
          </div>
        )}
      </motion.div>
      
      {/* Dropdown con todos los períodos disponibles - Animado */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="period-dropdown"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="period-timeline">
              {animatedPeriods.map((period, index) => (
                <motion.div 
                  key={period.id}
                  className={`timeline-item ${getStatusClass(period.status)} ${selectedPeriod && selectedPeriod.id === period.id ? 'active' : ''}`}
                  onClick={() => {
                    onPeriodChange(period);
                    setIsExpanded(false);
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <div className="timeline-connector">
                    <div className="connector-line"></div>
                    <div className="connector-dot"></div>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-period">{period.period}</span>
                      <div className={`timeline-status ${getStatusClass(period.status)}`}>
                        <i className={`fas ${getStatusIcon(period.status)}`}></i>
                        <span>{getStatusText(period.status)}</span>
                      </div>
                    </div>
                    <div className="timeline-details">
                      <div className="payment-info">
                        <i className="fas fa-calendar-check"></i>
                        <span>Payment: {period.paymentDate}</span>
                      </div>
                      
                      <div className="amount-info">
                        <i className="fas fa-file-invoice-dollar"></i>
                        <span>Amount: {formatCurrency(period.amount)}</span>
                      </div>
                      
                      {period.status === 'paid' && (
                        <div className="paid-info">
                          <i className="fas fa-money-check-alt"></i>
                          <span>Processed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedPeriod && selectedPeriod.id === period.id && (
                    <div className="timeline-active-indicator">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="period-summary">
              <div className="summary-stats">
                <div className="summary-stat">
                  <div className="stat-label">Total Periods</div>
                  <div className="stat-value">{periods.length}</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-label">Paid</div>
                  <div className="stat-value">{periods.filter(p => p.status === 'paid').length}</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-label">Pending</div>
                  <div className="stat-value">{periods.filter(p => p.status === 'pending').length}</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-label">Upcoming</div>
                  <div className="stat-value">{periods.filter(p => p.status === 'upcoming').length}</div>
                </div>
              </div>
              
              <div className="period-legend">
                <div className="legend-item">
                  <div className="legend-color status-paid"></div>
                  <span>Paid</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color status-pending"></div>
                  <span>Pending</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color status-upcoming"></div>
                  <span>Upcoming</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevPaymentPeriodSelector;