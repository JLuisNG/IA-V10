import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import '../../../styles/developer/accounting/TopPerformers.scss';

const TopPerformers = ({ performers }) => {
  const [activeTab, setActiveTab] = useState('earnings'); // earnings, visits, efficiency
  
  // Format currency with appropriate symbol
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate efficiency ratio (completed vs missed visits)
  const calculateEfficiency = (completed, missed) => {
    const total = completed + missed;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };
  
  // Get role color, icon and background
  const getRoleStyle = (role) => {
    switch(role) {
      case 'PT':
        return { 
          icon: 'fa-walking', 
          color: 'var(--pt-color, #36D1DC)',
          gradient: 'linear-gradient(135deg, #36D1DC, #5B86E5)'
        };
      case 'PTA':
        return { 
          icon: 'fa-walking', 
          color: 'var(--pta-color, #5B86E5)',
          gradient: 'linear-gradient(135deg, #5B86E5, #3B4FA2)'
        };
      case 'OT':
        return { 
          icon: 'fa-hands', 
          color: 'var(--ot-color, #FF9966)',
          gradient: 'linear-gradient(135deg, #FF9966, #FF5E62)'
        };
      case 'COTA':
        return { 
          icon: 'fa-hands', 
          color: 'var(--cota-color, #FF5E62)',
          gradient: 'linear-gradient(135deg, #FF5E62, #FF2D55)'
        };
      case 'ST':
        return { 
          icon: 'fa-comment-medical', 
          color: 'var(--st-color, #56CCF2)',
          gradient: 'linear-gradient(135deg, #56CCF2, #2F80ED)'
        };
      case 'STA':
        return { 
          icon: 'fa-comment-medical', 
          color: 'var(--sta-color, #2F80ED)',
          gradient: 'linear-gradient(135deg, #2F80ED, #1A56DB)'
        };
      default:
        return { 
          icon: 'fa-user-md', 
          color: 'var(--default-color, #64B5F6)',
          gradient: 'linear-gradient(135deg, #64B5F6, #0052CC)'
        };
    }
  };
  
  // Get medal for top 3 positions
  const getMedalIcon = (position) => {
    switch(position) {
      case 0: return <i className="fas fa-medal position-first"></i>;
      case 1: return <i className="fas fa-medal position-second"></i>;
      case 2: return <i className="fas fa-medal position-third"></i>;
      default: return null;
    }
  };
  
  // Sort performers based on active tab
  const sortedPerformers = [...performers].sort((a, b) => {
    if (activeTab === 'earnings') {
      return b.earnings - a.earnings;
    } else if (activeTab === 'visits') {
      return b.completedVisits - a.completedVisits;
    } else {
      return calculateEfficiency(b.completedVisits, b.missedVisits) - 
             calculateEfficiency(a.completedVisits, a.missedVisits);
    }
  }).slice(0, 9); // Limit to top 9
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="top-performers-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-trophy"></i>
          Top Performers
        </h2>
        <div className="view-toggles">
          <button 
            className={`toggle-btn ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            <i className="fas fa-dollar-sign"></i>
            Earnings
          </button>
          <button 
            className={`toggle-btn ${activeTab === 'visits' ? 'active' : ''}`}
            onClick={() => setActiveTab('visits')}
          >
            <i className="fas fa-calendar-check"></i>
            Visits
          </button>
          <button 
            className={`toggle-btn ${activeTab === 'efficiency' ? 'active' : ''}`}
            onClick={() => setActiveTab('efficiency')}
          >
            <i className="fas fa-chart-line"></i>
            Efficiency
          </button>
        </div>
      </div>
      
      <motion.div 
        className="performers-grid"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        key={activeTab} // Rerun animation when tab changes
      >
        {sortedPerformers.map((performer, index) => {
          const roleStyle = getRoleStyle(performer.role);
          const efficiency = calculateEfficiency(performer.completedVisits, performer.missedVisits);
          const totalVisits = performer.completedVisits + performer.missedVisits;
          
          return (
            <motion.div 
              key={performer.id}
              className="performer-card"
              variants={cardVariants}
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
              style={{
                backgroundImage: `radial-gradient(circle at top right, 
                                 rgba(255, 255, 255, 0.03), 
                                 transparent)`
              }}
              data-tooltip-id={`performer-tooltip-${performer.id}`}
            >
              <div 
                className="rank-badge"
                style={{
                  background: index < 3 ? roleStyle.gradient : 'rgba(30, 41, 59, 0.8)'
                }}
              >
                {index + 1}
                {getMedalIcon(index)}
              </div>
              
              <div className="performer-header">
                <div 
                  className="performer-avatar"
                  style={{ 
                    background: `linear-gradient(135deg, ${roleStyle.color}30, ${roleStyle.color}10)`,
                    borderColor: `${roleStyle.color}40`
                  }}
                >
                  <div className="avatar-placeholder">
                    {performer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div 
                    className="role-badge"
                    style={{ 
                      backgroundColor: `${roleStyle.color}20`, 
                      color: roleStyle.color,
                      borderColor: `${roleStyle.color}40`
                    }}
                    data-tooltip-id={`role-tooltip-${performer.id}`}
                    data-tooltip-content={performer.roleTitle}
                  >
                    <i className={`fas ${roleStyle.icon}`}></i>
                    {performer.role}
                  </div>
                </div>
                
                <div className="performer-info">
                  <h3 className="performer-name">{performer.name}</h3>
                  <div className="performer-metrics">
                    <div className="metric">
                      <i className="fas fa-calendar-check"></i>
                      <span className="value">{performer.completedVisits}</span>
                    </div>
                    <div className="metric missed">
                      <i className="fas fa-calendar-times"></i>
                      <span className="value">{performer.missedVisits}</span>
                    </div>
                    <div className="metric">
                      <i className="fas fa-percentage"></i>
                      <span className={`value ${efficiency >= 80 ? 'high' : efficiency >= 60 ? 'medium' : 'low'}`}>
                        {efficiency}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="performance-metrics">
                {/* Primary Metric based on active tab */}
                <div className="primary-metric">
                  {activeTab === 'earnings' && (
                    <>
                      <div className="metric-value earnings">
                        {formatCurrency(performer.earnings)}
                      </div>
                      <div className="metric-label">Total Earnings</div>
                    </>
                  )}
                  
                  {activeTab === 'visits' && (
                    <>
                      <div className="metric-value visits">
                        <span className="completed">{performer.completedVisits}</span>
                        <span className="separator">/</span>
                        <span className="total">{totalVisits}</span>
                      </div>
                      <div className="metric-label">Completed/Total Visits</div>
                    </>
                  )}
                  
                  {activeTab === 'efficiency' && (
                    <>
                      <div className={`metric-value efficiency ${
                        efficiency >= 80 ? 'high' : 
                        efficiency >= 60 ? 'medium' : 'low'
                      }`}>
                        {efficiency}%
                      </div>
                      <div className="metric-label">Completion Rate</div>
                    </>
                  )}
                </div>
                
                {/* Growth indicator - always show */}
                <div className="growth-indicator">
                  <div className={`growth-value ${performer.growth >= 0 ? 'positive' : 'negative'}`}>
                    <i className={`fas fa-arrow-${performer.growth >= 0 ? 'up' : 'down'}`}></i>
                    <span>{Math.abs(performer.growth)}%</span>
                  </div>
                  <div className="growth-label">vs Last Month</div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="visit-progress">
                <div className="progress-label">
                  <span>Visit Completion</span>
                  <span className="progress-percentage">{efficiency}%</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{
                      width: `${efficiency}%`,
                      background: roleStyle.gradient
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Monthly distribution mini-chart */}
              {performer.weeklyData && (
                <div className="weekly-distribution">
                  <div className="distribution-label">Weekly Distribution</div>
                  <div className="mini-chart">
                    {performer.weeklyData.map((week, idx) => (
                      <div 
                        key={idx} 
                        className="bar-column"
                        data-tooltip-content={`Week ${idx + 1}: ${week} visits`}
                        data-tooltip-id={`week-tooltip-${performer.id}-${idx}`}
                      >
                        <div 
                          className="bar" 
                          style={{
                            height: `${(week / Math.max(...performer.weeklyData)) * 100}%`,
                            background: roleStyle.color
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tooltips */}
              <Tooltip id={`performer-tooltip-${performer.id}`} place="top">
                <div className="performer-details-tooltip">
                  <div className="tooltip-header">{performer.name}</div>
                  <div className="tooltip-stats">
                    <div>Earnings: {formatCurrency(performer.earnings)}</div>
                    <div>Completed Visits: {performer.completedVisits}</div>
                    <div>Missed Visits: {performer.missedVisits}</div>
                    <div>Efficiency: {efficiency}%</div>
                    <div>Growth: {performer.growth}%</div>
                  </div>
                </div>
              </Tooltip>
              
              <Tooltip id={`role-tooltip-${performer.id}`} place="top">
                {performer.roleTitle}
              </Tooltip>
              
              {performer.weeklyData && performer.weeklyData.map((week, idx) => (
                <Tooltip 
                  key={idx}
                  id={`week-tooltip-${performer.id}-${idx}`}
                  place="top"
                >
                  Week {idx + 1}: {week} visits
                </Tooltip>
              ))}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TopPerformers;