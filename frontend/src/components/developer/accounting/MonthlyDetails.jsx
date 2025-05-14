import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, registerables } from 'chart.js';
import '../../../styles/developer/accounting/MonthlyDetails.scss';

// Register Chart.js components
Chart.register(...registerables);

const MonthlyDetails = ({ data, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  // Initialize filter for visits
  useEffect(() => {
    if (data && data.visitDetails) {
      setFilteredVisits(data.visitDetails);
    }
  }, [data]);
  
  // Apply search filter
  useEffect(() => {
    if (data && data.visitDetails) {
      if (searchTerm.trim() === '') {
        setFilteredVisits(data.visitDetails);
      } else {
        const term = searchTerm.toLowerCase();
        const filtered = data.visitDetails.filter(visit => 
          visit.therapistName.toLowerCase().includes(term) ||
          visit.patientName.toLowerCase().includes(term) ||
          visit.date.includes(term)
        );
        setFilteredVisits(filtered);
      }
    }
  }, [searchTerm, data]);
  
  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Request sort for a column
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    // Apply sorting
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
  
  // Get sort indicator icon
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return 'fas fa-sort';
    }
    return sortConfig.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  };
  
  // Generate mock calendar data for the month
  const generateCalendarData = () => {
    const calendarData = [];
    const daysInMonth = 31; // Assuming a month with 31 days
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    // Generate random visit counts for each day
    for (let day = 1; day <= daysInMonth; day++) {
      // Generate random visit counts for each type of therapist
      const ptVisits = Math.floor(Math.random() * 15) + 5;
      const ptaVisits = Math.floor(Math.random() * 10) + 3;
      const otVisits = Math.floor(Math.random() * 12) + 4;
      const cotaVisits = Math.floor(Math.random() * 8) + 2;
      const stVisits = Math.floor(Math.random() * 6) + 1;
      
      // Calculate total visits and create date object
      const totalVisits = ptVisits + ptaVisits + otVisits + cotaVisits + stVisits;
      const date = new Date(2025, data.monthIndex || 0, day);
      const weekday = weekdays[date.getDay()];
      
      // Create day data with breakdown by therapist type
      calendarData.push({
        day,
        weekday,
        date,
        totalVisits,
        breakdown: {
          PT: ptVisits,
          PTA: ptaVisits,
          OT: otVisits,
          COTA: cotaVisits,
          ST: stVisits
        },
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    
    return calendarData;
  };
  
  // Calculate total earnings for the selected month
  const calculateTotalEarnings = () => {
    if (!filteredVisits || filteredVisits.length === 0) return 0;
    return filteredVisits.reduce((sum, visit) => sum + visit.amount, 0);
  };
  
  // Get therapists sorted by visit count (most to least)
  const getSortedTherapists = () => {
    if (!data || !data.therapists) return [];
    
    // Sort therapists by visits in descending order
    return [...data.therapists].sort((a, b) => b.visits - a.visits);
  };
  
  // Get mock visit details if needed
  const getMockVisits = () => {
    if (data && data.visitDetails && data.visitDetails.length > 0) {
      return data.visitDetails;
    }
    
    // Generate mock visit data
    const mockVisits = [];
    const therapists = data?.therapists || [];
    const visitStatus = ['completed', 'pending', 'cancelled'];
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
    
    // Generate random patient names
    const patientFirstNames = ['John', 'Maria', 'Robert', 'Lisa', 'Michael', 'Sarah', 'James', 'Emily', 'William', 'Olivia'];
    const patientLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    // Generate 20 random visits
    for (let i = 1; i <= 20; i++) {
      const randomTherapist = therapists[Math.floor(Math.random() * therapists.length)] || { 
        name: 'Default Therapist', 
        role: 'PT' 
      };
      
      const randomFirstName = patientFirstNames[Math.floor(Math.random() * patientFirstNames.length)];
      const randomLastName = patientLastNames[Math.floor(Math.random() * patientLastNames.length)];
      
      const visitDate = new Date(2025, 0, Math.floor(Math.random() * 31) + 1); // Random day in January 2025
      const visitAmount = Math.floor(Math.random() * 200) + 50; // Random amount between $50 and $250
      
      mockVisits.push({
        id: i,
        date: visitDate.toISOString().split('T')[0],
        time: timeSlots[Math.floor(Math.random() * timeSlots.length)],
        therapistName: randomTherapist.name,
        therapistRole: randomTherapist.role,
        patientName: `${randomLastName}, ${randomFirstName}`,
        patientId: 1000 + i,
        status: visitStatus[Math.floor(Math.random() * visitStatus.length)],
        amount: visitAmount,
        notes: ''
      });
    }
    
    return mockVisits.sort((a, b) => new Date(b.date) - new Date(a.date));
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
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Get visits data - either real or mock
  const visitsData = getMockVisits();
  
  // Get sorted therapists
  const sortedTherapists = getSortedTherapists();
  
  // Get calendar data
  const calendarData = generateCalendarData();

  return (
    <motion.div 
      className="monthly-details-section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="section-header">
        <div className="header-left">
          <h2>
            <i className="fas fa-calendar-check"></i>
            {data.month} {data.year} Details
          </h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="header-actions">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-pie"></i>
              <span>Overview</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'visits' ? 'active' : ''}`}
              onClick={() => setActiveTab('visits')}
            >
              <i className="fas fa-clipboard-list"></i>
              <span>Visits</span>
            </button>
          </div>
          
          <div className="action-buttons">
            <button className="action-button" title="Download Report">
              <i className="fas fa-download"></i>
            </button>
            <button className="action-button" title="Close Details" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="monthly-details-content">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              className="overview-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stats-cards">
                <motion.div className="stat-card" variants={itemVariants}>
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-title">Total Revenue</div>
                    <div className="stat-value">{formatCurrency(data.revenue)}</div>
                    <div className="stat-change positive">
                      <i className="fas fa-arrow-up"></i>
                      <span>+12.5% from previous month</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div className="stat-card" variants={itemVariants}>
                  <div className="stat-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-title">Total Visits</div>
                    <div className="stat-value">{data.visits}</div>
                    <div className="stat-change positive">
                      <i className="fas fa-arrow-up"></i>
                      <span>+8.3% from previous month</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div className="stat-card" variants={itemVariants}>
                  <div className="stat-icon">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-title">Active Therapists</div>
                    <div className="stat-value">{data.therapists.length}</div>
                    <div className="stat-change neutral">
                      <i className="fas fa-minus"></i>
                      <span>No change from previous month</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div className="stat-card" variants={itemVariants}>
                  <div className="stat-icon">
                    <i className="fas fa-calculator"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-title">Average/Visit</div>
                    <div className="stat-value">
                      {formatCurrency(data.visits > 0 ? data.revenue / data.visits : 0)}
                    </div>
                    <div className="stat-change positive">
                      <i className="fas fa-arrow-up"></i>
                      <span>+3.7% from previous month</span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Daily Visits Calendar View */}
              <motion.div className="daily-visits-calendar" variants={itemVariants}>
                <div className="calendar-header">
                  <h3><i className="fas fa-calendar-day"></i> Daily Visits</h3>
                  <div className="therapist-types">
                    <span className="therapist-type pt">PT</span>
                    <span className="therapist-type pta">PTA</span>
                    <span className="therapist-type ot">OT</span>
                    <span className="therapist-type cota">COTA</span>
                    <span className="therapist-type st">ST</span>
                  </div>
                </div>
                
                <div className="calendar-grid">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`header-${index}`} className="calendar-header-cell">
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty cells for proper alignment - assuming first day of month starts on specific weekday */}
                  {/* In a real implementation, you would calculate this based on actual date */}
                  {[...Array(3)].map((_, index) => (
                    <div key={`empty-start-${index}`} className="calendar-cell empty"></div>
                  ))}
                  
                  {calendarData.map((day, index) => (
                    <div 
                      key={`day-${index}`} 
                      className={`calendar-cell ${day.isWeekend ? 'weekend' : ''}`}
                      title={`${day.date.toDateString()}: ${day.totalVisits} total visits`}
                    >
                      <div className="calendar-day-number">{day.day}</div>
                      <div className="calendar-visit-count">{day.totalVisits}</div>
                      <div className="calendar-visit-breakdown">
                        <div className="breakdown-bar pt" style={{ width: `${(day.breakdown.PT / day.totalVisits) * 100}%` }}></div>
                        <div className="breakdown-bar pta" style={{ width: `${(day.breakdown.PTA / day.totalVisits) * 100}%` }}></div>
                        <div className="breakdown-bar ot" style={{ width: `${(day.breakdown.OT / day.totalVisits) * 100}%` }}></div>
                        <div className="breakdown-bar cota" style={{ width: `${(day.breakdown.COTA / day.totalVisits) * 100}%` }}></div>
                        <div className="breakdown-bar st" style={{ width: `${(day.breakdown.ST / day.totalVisits) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty cells at the end for proper alignment */}
                  {[...Array(3)].map((_, index) => (
                    <div key={`empty-end-${index}`} className="calendar-cell empty"></div>
                  ))}
                </div>
                
                <div className="calendar-footer">
                  <div className="calendar-note">
                    <i className="fas fa-info-circle"></i>
                    <span>Hover over each day to see detailed breakdown by therapist type</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Therapist Visits Ranking */}
              <motion.div className="therapist-visits-ranking" variants={itemVariants}>
                <div className="ranking-header">
                  <h3><i className="fas fa-trophy"></i> Therapist Visits Ranking</h3>
                  <div className="ranking-period">{data.month} {data.year}</div>
                </div>
                
                <div className="ranking-list">
                  {sortedTherapists.map((therapist, index) => (
                    <div key={`therapist-${index}`} className="ranking-item">
                      <div className="rank-number">{index + 1}</div>
                      <div className={`therapist-avatar ${therapist.role.toLowerCase()}`}>
                        <div className="avatar-initials">
                          {therapist.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="therapist-role">{therapist.role}</div>
                      </div>
                      <div className="therapist-info">
                        <div className="therapist-name">{therapist.name}</div>
                        <div className="therapist-metrics">
                          <span className="earnings-value">{formatCurrency(therapist.earnings)}</span>
                          <span className="earnings-divider">|</span>
                          <span className="visit-avg">{formatCurrency(therapist.earnings/therapist.visits)} per visit</span>
                        </div>
                      </div>
                      <div className="visit-count">
                        <div className="count-value">{therapist.visits}</div>
                        <div className="count-label">visits</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="visits"
              className="visits-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="table-actions">
                <div className="search-filter">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search visits by therapist, patient or date..."
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
                
                <div className="table-summary">
                  <div className="summary-item">
                    <span className="summary-label">Found:</span>
                    <span className="summary-value">{filteredVisits.length} visits</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Revenue:</span>
                    <span className="summary-value">{formatCurrency(calculateTotalEarnings())}</span>
                  </div>
                </div>
              </div>
              
              <div className="visits-table-container">
                <table className="visits-table">
                  <thead>
                    <tr>
                      <th 
                        className="sortable"
                        onClick={() => requestSort('date')}
                      >
                        Date
                        <i className={getSortIndicator('date')}></i>
                      </th>
                      <th 
                        className="sortable"
                        onClick={() => requestSort('time')}
                      >
                        Time
                        <i className={getSortIndicator('time')}></i>
                      </th>
                      <th 
                        className="sortable"
                        onClick={() => requestSort('therapistName')}
                      >
                        Therapist
                        <i className={getSortIndicator('therapistName')}></i>
                      </th>
                      <th 
                        className="sortable"
                        onClick={() => requestSort('patientName')}
                      >
                        Patient
                        <i className={getSortIndicator('patientName')}></i>
                      </th>
                      <th>Status</th>
                      <th 
                        className="sortable"
                        onClick={() => requestSort('amount')}
                      >
                        Amount
                        <i className={getSortIndicator('amount')}></i>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitsData.length > 0 ? (
                      visitsData.map((visit) => (
                        <tr key={visit.id} className={visit.status}>
                          <td>{formatDate(visit.date)}</td>
                          <td>{visit.time}</td>
                          <td className="therapist-cell">
                            <div className="therapist-info">
                              <div className={`avatar ${visit.therapistRole.toLowerCase()}`}>
                                {visit.therapistName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="therapist-details">
                                <span className="name">{visit.therapistName}</span>
                                <span className="role">{visit.therapistRole}</span>
                              </div>
                            </div>
                          </td>
                          <td className="patient-cell">
                            <a href={`/patient/${visit.patientId}`} className="patient-link">
                              {visit.patientName}
                            </a>
                            <div className="patient-id">#{visit.patientId}</div>
                          </td>
                          <td>
                            <span className={`status-badge ${visit.status}`}>
                              <i className={`fas ${
                                visit.status === 'completed' ? 'fa-check-circle' : 
                                visit.status === 'pending' ? 'fa-clock' : 'fa-times-circle'
                              }`}></i>
                              {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                            </span>
                          </td>
                          <td className="amount-cell">{formatCurrency(visit.amount)}</td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <button className="action-btn view" title="View Details">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="action-btn notes" title="View Notes">
                                <i className="fas fa-sticky-note"></i>
                              </button>
                              <button className="action-btn print" title="Print Invoice">
                                <i className="fas fa-print"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="no-results">
                          <div className="no-results-content">
                            <i className="fas fa-search"></i>
                            <p>No visits found matching your search criteria.</p>
                            <button className="reset-search" onClick={() => setSearchTerm('')}>
                              Clear Search
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="pagination-controls">
                <div className="results-per-page">
                  <span>Show:</span>
                  <select>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span>per page</span>
                </div>
                
                <div className="pagination">
                  <button className="pagination-btn prev" disabled>
                    <i className="fas fa-chevron-left"></i>
                    <span>Previous</span>
                  </button>
                  
                  <div className="page-numbers">
                    <button className="page-number active">1</button>
                    <button className="page-number">2</button>
                    <button className="page-number">3</button>
                    <button className="page-number">4</button>
                    <button className="page-number">5</button>
                  </div>
                  
                  <button className="pagination-btn next">
                    <span>Next</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                
                <div className="page-info">
                  Showing <span>1-20</span> of <span>{visitsData.length}</span> visits
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MonthlyDetails;