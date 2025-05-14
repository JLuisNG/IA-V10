import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import '../../../styles/developer/accounting/MonthlyRevenueStats.scss';

const MonthlyRevenueStats = ({ data, onMonthSelect, selectedMonth }) => {
  const containerRef = useRef(null);
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [highlightedMonth, setHighlightedMonth] = useState(null);
  
  // Check visibility for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start('visible');
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [controls]);
  
  // Format currency values with enhanced formatting
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format compact currency (K/M/B)
  const formatCompactCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };
  
  // Format percentage values with improved styling
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };
  
  // Calculate total revenue for current and previous periods
  const calculateTotalRevenue = (isPrevious = false) => {
    if (!data || data.length === 0) return 0;
    
    if (isPrevious) {
      return data.reduce((sum, item) => sum + (item.previousRevenue || 0), 0);
    } else {
      return data.reduce((sum, item) => sum + (item.revenue || 0), 0);
    }
  };
  
  // Calculate total visits for current and previous periods
  const calculateTotalVisits = (isPrevious = false) => {
    if (!data || data.length === 0) return 0;
    
    if (isPrevious) {
      return data.reduce((sum, item) => sum + (item.previousVisits || 0), 0);
    } else {
      return data.reduce((sum, item) => sum + (item.visits || 0), 0);
    }
  };
  
  // Generate therapist visit data ordered from most to least visits
  const getTherapistVisitData = () => {
    if (!data || !selectedMonth) return [];
    
    // Example: we'll assume the selected month has therapist data
    // In a real app, you would get this from your API or database
    const therapistData = selectedMonth.therapists || [
      { name: "Dr. Smith", visits: 125, revenue: 12500 },
      { name: "Dr. Jones", visits: 85, revenue: 8500 },
      { name: "Dr. Williams", visits: 110, revenue: 11000 },
      { name: "Dr. Brown", visits: 95, revenue: 9500 },
      { name: "Dr. Garcia", visits: 115, revenue: 11500 },
    ];
    
    // Sort by visits in descending order
    return therapistData.sort((a, b) => b.visits - a.visits);
  };
  
  // Animation variants with enhanced transitions
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
  
  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: item => ({ 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: item.index * 0.08
      }
    }),
    hover: { 
      scale: 1.03, 
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 229, 255, 0.3)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10
      }
    },
    tap: { 
      scale: 0.98,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10
      }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0, rotate: -30 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 0.3
      }
    },
    hover: {
      rotate: [0, -15, 15, -5, 0],
      transition: { 
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };
  
  const titleBarVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: "40%",
      transition: { 
        duration: 0.7,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  return (
    <motion.div 
      className="monthly-revenue-section"
      ref={containerRef}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {/* Header with improved metric toggles */}
      <div className="section-header">
        <div className="header-title-container">
          <motion.h2 variants={childVariants}>
            <motion.i 
              className="fas fa-chart-line"
              variants={iconVariants}
              whileHover="hover"
            ></motion.i>
            Monthly Revenue
          </motion.h2>
          <motion.div 
            className="title-underline" 
            variants={titleBarVariants}
          ></motion.div>
          
          <div className="metric-toggles">
            <motion.button 
              className={`metric-toggle ${activeMetric === 'revenue' ? 'active' : ''}`}
              onClick={() => setActiveMetric('revenue')}
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-dollar-sign"></i>
              <span>Revenue</span>
            </motion.button>
            
            <motion.button 
              className={`metric-toggle ${activeMetric === 'visits' ? 'active' : ''}`}
              onClick={() => setActiveMetric('visits')}
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-user-friends"></i>
              <span>Visits</span>
            </motion.button>
          </div>
        </div>
        
        <motion.div 
          className="header-actions"
          variants={childVariants}
        >
          <div className="action-hint">
            <i className="fas fa-info-circle"></i>
            <span>Click on a month to view detailed data</span>
          </div>
        </motion.div>
      </div>
      
      {/* Comparison Panels (Previous vs Current) */}
      <motion.div 
        className="period-comparison"
        variants={childVariants}
      >
        <div className="previous-period">
          <div className="period-header">
            <h3>Previous Period</h3>
            <div className="period-dates">Jan - Apr 2024</div>
          </div>
          
          {activeMetric === 'revenue' ? (
            <div className="period-total">
              <div className="total-value">{formatCurrency(calculateTotalRevenue(true))}</div>
              <div className="total-label">Total Revenue</div>
            </div>
          ) : (
            <div className="period-total">
              <div className="total-value visits">{calculateTotalVisits(true)}</div>
              <div className="total-label">Total Visits</div>
            </div>
          )}
          
          <div className="period-avg">
            {activeMetric === 'revenue' ? (
              <>
                <div className="avg-value">{formatCurrency(calculateTotalRevenue(true) / 4)}</div>
                <div className="avg-label">Monthly Average</div>
              </>
            ) : (
              <>
                <div className="avg-value">{Math.round(calculateTotalVisits(true) / 4)}</div>
                <div className="avg-label">Monthly Average</div>
              </>
            )}
          </div>
        </div>
        
        <div className="current-period">
          <div className="period-header">
            <h3>Current Period</h3>
            <div className="period-dates">Jan - Apr 2025</div>
          </div>
          
          {activeMetric === 'revenue' ? (
            <div className="period-total">
              <div className="total-value">{formatCurrency(calculateTotalRevenue(false))}</div>
              <div className="total-label">Total Revenue</div>
              <div className="change-indicator">
                {calculateTotalRevenue(false) > calculateTotalRevenue(true) ? (
                  <span className="positive">
                    <i className="fas fa-arrow-up"></i>
                    {formatPercentage(Math.round((calculateTotalRevenue(false) - calculateTotalRevenue(true)) / calculateTotalRevenue(true) * 100))}
                  </span>
                ) : (
                  <span className="negative">
                    <i className="fas fa-arrow-down"></i>
                    {formatPercentage(Math.round((calculateTotalRevenue(false) - calculateTotalRevenue(true)) / calculateTotalRevenue(true) * 100))}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="period-total">
              <div className="total-value visits">{calculateTotalVisits(false)}</div>
              <div className="total-label">Total Visits</div>
              <div className="change-indicator">
                {calculateTotalVisits(false) > calculateTotalVisits(true) ? (
                  <span className="positive">
                    <i className="fas fa-arrow-up"></i>
                    {formatPercentage(Math.round((calculateTotalVisits(false) - calculateTotalVisits(true)) / calculateTotalVisits(true) * 100))}
                  </span>
                ) : (
                  <span className="negative">
                    <i className="fas fa-arrow-down"></i>
                    {formatPercentage(Math.round((calculateTotalVisits(false) - calculateTotalVisits(true)) / calculateTotalVisits(true) * 100))}
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="period-avg">
            {activeMetric === 'revenue' ? (
              <>
                <div className="avg-value">{formatCurrency(calculateTotalRevenue(false) / 4)}</div>
                <div className="avg-label">Monthly Average</div>
              </>
            ) : (
              <>
                <div className="avg-value">{Math.round(calculateTotalVisits(false) / 4)}</div>
                <div className="avg-label">Monthly Average</div>
              </>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Month cards with improved layout and visibility */}
      <motion.div 
        className="month-cards"
        variants={childVariants}
      >
        {data && data.map((monthData, index) => (
          <motion.div 
            key={`${monthData.month}-${monthData.year}`}
            className={`month-card ${monthData.projected ? 'projected' : ''} ${
              selectedMonth && 
              selectedMonth.month === monthData.month && 
              selectedMonth.year === monthData.year ? 'selected' : ''
            }`}
            onClick={() => {
              onMonthSelect(monthData);
              setHighlightedMonth(index);
            }}
            variants={cardVariants}
            custom={{ index }}
            whileHover="hover"
            whileTap="tap"
            initial="hidden"
            animate="visible"
          >
            <div className="month-card-inner">
              <div className="month-header">
                <span className="month-name">{monthData.month}</span>
                <motion.span 
                  className={`month-growth ${monthData.growth >= 0 ? 'positive' : 'negative'}`}
                  whileHover={{ scale: 1.1 }}
                >
                  <i className={`fas fa-arrow-${monthData.growth >= 0 ? 'up' : 'down'}`}></i>
                  {formatPercentage(monthData.growth)}
                </motion.span>
              </div>
              
              <div className="month-revenue">{formatCurrency(monthData.revenue)}</div>
              
              <div className="month-details">
                <div className="detail-item">
                  <span className="detail-label">Previous:</span>
                  <span className="detail-value">{formatCurrency(monthData.previousRevenue)}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Visits:</span>
                  <span className="detail-value">{monthData.visits}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Avg/Visit:</span>
                  <span className="detail-value">
                    {formatCurrency(monthData.revenue / monthData.visits)}
                  </span>
                </div>
              </div>
              
              {monthData.projected && (
                <motion.div 
                  className="projected-badge"
                  whileHover={{ scale: 1.1 }}
                >
                  <i className="fas fa-chart-line"></i>
                  Projected
                </motion.div>
              )}
              
              {selectedMonth && 
               selectedMonth.month === monthData.month && 
               selectedMonth.year === monthData.year && (
                <div className="selection-indicator">
                  <div className="indicator-dot"></div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Data Summary Panel - Shows on selection with detailed therapist data */}
      <AnimatePresence>
        {selectedMonth && (
          <motion.div 
            className="data-summary-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto',
              transition: {
                height: { duration: 0.4, ease: "easeOut" },
                opacity: { duration: 0.3, delay: 0.2 }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: {
                height: { duration: 0.3, delay: 0.1 },
                opacity: { duration: 0.2 }
              }
            }}
          >
            <div className="summary-header">
              <h3>
                <i className="fas fa-calendar-alt"></i>
                {selectedMonth.month} {selectedMonth.year} Summary
              </h3>
              <motion.button 
                className="close-button"
                onClick={() => onMonthSelect(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-times"></i>
              </motion.button>
            </div>
            
            <div className="summary-content">
              <div className="summary-overview">
                <div className="summary-metric">
                  <div className="metric-title">Revenue</div>
                  <div className="metric-value">{formatCurrency(selectedMonth.revenue)}</div>
                  <div className="metric-comparison">
                    <span className={selectedMonth.growth >= 0 ? 'positive' : 'negative'}>
                      <i className={`fas fa-arrow-${selectedMonth.growth >= 0 ? 'up' : 'down'}`}></i>
                      {formatPercentage(selectedMonth.growth)} from previous period
                    </span>
                  </div>
                </div>
                
                <div className="summary-metric">
                  <div className="metric-title">Visits</div>
                  <div className="metric-value">{selectedMonth.visits}</div>
                  <div className="metric-comparison">
                    <span className="secondary-text">
                      <i className="fas fa-calculator"></i>
                      Avg. {formatCurrency(selectedMonth.revenue / selectedMonth.visits)} per visit
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Therapist Performance - Ranked list instead of bars */}
              <div className="therapist-performance">
                <h4>Therapist Performance</h4>
                <div className="therapist-list">
                  {getTherapistVisitData().map((therapist, index) => (
                    <div key={`therapist-${index}`} className="therapist-item">
                      <div className="therapist-rank">{index + 1}</div>
                      <div className="therapist-info">
                        <div className="therapist-name">{therapist.name}</div>
                        <div className="therapist-metrics">
                          <span className="visits-count">
                            <i className="fas fa-user-friends"></i>
                            {therapist.visits} visits
                          </span>
                          <span className="revenue-amount">
                            <i className="fas fa-dollar-sign"></i>
                            {formatCurrency(therapist.revenue)}
                          </span>
                        </div>
                      </div>
                      <div className="therapist-value">
                        {formatCurrency(therapist.revenue / therapist.visits)}
                        <span className="per-visit">per visit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedMonth.projected && (
                <div className="summary-note projected">
                  <i className="fas fa-info-circle"></i>
                  <span>This is a projected estimate based on current trends and may vary.</span>
                </div>
              )}
              
              <div className="summary-actions">
                <motion.button 
                  className="action-button primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-file-download"></i>
                  Export Data
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MonthlyRevenueStats;