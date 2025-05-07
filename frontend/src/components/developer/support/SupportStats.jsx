import React, { useState, useEffect } from 'react';
import '../../../styles/developer/support/SupportStats.scss';

const DevSupportStats = ({ stats }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    ticketsResolved: 0,
    avgResponseTime: '',
    customerSatisfaction: 0,
    openTickets: 0,
    urgentTickets: 0
  });
  
  // Animar estadísticas con efecto mejorado
  useEffect(() => {
    if (!stats) return;
    
    setIsLoading(true);
    
    // Iniciar con valores en cero
    setAnimatedStats({
      ticketsResolved: 0,
      avgResponseTime: stats.avgResponseTime,
      customerSatisfaction: 0,
      openTickets: 0,
      urgentTickets: 0
    });
    
    // Esperar un poco antes de comenzar la animación para que sea perceptible
    setTimeout(() => {
      const intervalId = setInterval(() => {
        setAnimatedStats(prevStats => {
          const newTicketsResolved = Math.min(prevStats.ticketsResolved + Math.ceil(stats.ticketsResolved / 30), stats.ticketsResolved);
          const newSatisfaction = Math.min(prevStats.customerSatisfaction + (stats.customerSatisfaction / 30), stats.customerSatisfaction);
          const newOpenTickets = Math.min(prevStats.openTickets + Math.ceil(stats.openTickets / 20), stats.openTickets);
          const newUrgentTickets = Math.min(prevStats.urgentTickets + 1, stats.urgentTickets);
          
          const isComplete = 
            newTicketsResolved === stats.ticketsResolved && 
            newSatisfaction === stats.customerSatisfaction &&
            newOpenTickets === stats.openTickets &&
            newUrgentTickets === stats.urgentTickets;
          
          if (isComplete) {
            clearInterval(intervalId);
            setIsLoading(false);
          }
          
          return {
            ticketsResolved: newTicketsResolved,
            avgResponseTime: stats.avgResponseTime,
            customerSatisfaction: newSatisfaction,
            openTickets: newOpenTickets,
            urgentTickets: newUrgentTickets
          };
        });
      }, 50); // Incremento más rápido para animación más fluida
      
      return () => clearInterval(intervalId);
    }, 300);
  }, [stats]);
  
  // Calcular porcentaje de satisfacción para gráfico circular
  const getCirclePercentage = (value) => {
    return (value / 100) * 360;
  };
  
  return (
    <div className="support-stats">
      <div className="stats-header">
        <div className="stats-title">
          <h2>Support Dashboard</h2>
          <p className="stats-subtitle">Welcome back, Luis! Here's what's happening today</p>
        </div>
        <div className="stats-period">
          <div className="period-label">Time period:</div>
          <select defaultValue="month" className="period-select">
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>
      
      <div className="stats-grid">
        {/* Tickets Resueltos */}
        <div className="stat-card tickets-resolved">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-title">Tickets Resolved</div>
              <div className="stat-value">{animatedStats.ticketsResolved.toLocaleString()}</div>
              <div className="stat-trend positive">
                <i className="fas fa-arrow-up"></i>
                <span>12.5% from last month</span>
              </div>
            </div>
          </div>
          
          <div className="stat-chart">
            <div className="bar-chart">
              <div className="bar">
                <div className="bar-fill" style={{ height: '65%' }}></div>
                <div className="bar-label">Mon</div>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ height: '85%' }}></div>
                <div className="bar-label">Tue</div>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ height: '75%' }}></div>
                <div className="bar-label">Wed</div>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ height: '95%' }}></div>
                <div className="bar-label">Thu</div>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ height: '70%' }}></div>
                <div className="bar-label">Fri</div>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ height: '40%' }}></div>
                <div className="bar-label">Sat</div>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ height: '30%' }}></div>
                <div className="bar-label">Sun</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tiempo de Respuesta */}
        <div className="stat-card response-time">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <div className="stat-title">Avg. Response Time</div>
              <div className="stat-value">{animatedStats.avgResponseTime}</div>
              <div className="stat-trend negative">
                <i className="fas fa-arrow-down"></i>
                <span>8.3% from last month</span>
              </div>
            </div>
          </div>
          
          <div className="stat-chart">
            <div className="line-chart">
              <svg viewBox="0 0 100 40">
                <path 
                  d="M0,30 L15,25 L30,28 L45,20 L60,22 L75,15 L90,10 L100,12" 
                  fill="none" 
                  stroke="url(#responseGradient)" 
                  strokeWidth="2"
                  className="path-animation"
                />
                <defs>
                  <linearGradient id="responseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4CAF50" />
                    <stop offset="100%" stopColor="#2196F3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Satisfacción del Cliente */}
        <div className="stat-card customer-satisfaction">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-smile"></i>
            </div>
            <div className="stat-content">
              <div className="stat-title">Customer Satisfaction</div>
              <div className="stat-value">{animatedStats.customerSatisfaction.toFixed(1)}%</div>
              <div className="stat-trend positive">
                <i className="fas fa-arrow-up"></i>
                <span>2.1% from last month</span>
              </div>
            </div>
          </div>
          
          <div className="stat-chart">
            <div className="circle-chart">
              <svg viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.1)" 
                  strokeWidth="10"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="url(#satisfactionGradient)" 
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={(100 - animatedStats.customerSatisfaction) * 2.512}
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="circle-chart-text-bg">96.7%</text>
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="circle-chart-text">96.7%</text>
                <defs>
                  <linearGradient id="satisfactionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4CAF50" />
                    <stop offset="100%" stopColor="#8BC34A" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Tickets Abiertos */}
        <div className="stat-card open-tickets">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-ticket-alt"></i>
            </div>
            <div className="stat-content">
              <div className="stat-title">Open Tickets</div>
              <div className="stat-value">{animatedStats.openTickets}</div>
              <div className="stat-badges">
                <div className="stat-badge urgent">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{animatedStats.urgentTickets} urgent</span>
                </div>
                <div className="stat-badge normal">
                  <i className="fas fa-hourglass-half"></i>
                  <span>{animatedStats.openTickets - animatedStats.urgentTickets} normal</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="stat-chart">
            <div className="progress-chart">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(animatedStats.urgentTickets / animatedStats.openTickets) * 100}%` }}
                ></div>
              </div>
              <div className="progress-legend">
                <div className="legend-item">
                  <div className="legend-color urgent"></div>
                  <div className="legend-label">Urgent</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color normal"></div>
                  <div className="legend-label">Normal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Eficiencia del Agente */}
        <div className="stat-card agent-efficiency">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-user-tie"></i>
            </div>
            <div className="stat-content">
              <div className="stat-title">Top Support Agents</div>
            </div>
            <div className="view-all-agents">
              <a href="#view-all">View All <i className="fas fa-chevron-right"></i></a>
            </div>
          </div>
          
          <div className="agent-list">
            <div className="agent-item">
              <div className="agent-ranking">1</div>
              <div className="agent-avatar">LN</div>
              <div className="agent-info">
                <div className="agent-name">Luis Nava</div>
                <div className="agent-tickets">138 tickets resolved</div>
              </div>
              <div className="agent-stats">
                <div className="agent-performance">
                  <div className="performance-bar">
                    <div className="performance-fill" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div className="agent-rating">
                  <div className="rating-stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <div className="rating-value">4.8</div>
                </div>
              </div>
            </div>
            <div className="agent-item">
              <div className="agent-ranking">2</div>
              <div className="agent-avatar">MC</div>
              <div className="agent-info">
                <div className="agent-name">Maria Cruz</div>
                <div className="agent-tickets">125 tickets resolved</div>
              </div>
              <div className="agent-stats">
                <div className="agent-performance">
                  <div className="performance-bar">
                    <div className="performance-fill" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="agent-rating">
                  <div className="rating-stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="rating-value">4.9</div>
                </div>
              </div>
            </div>
            <div className="agent-item">
              <div className="agent-ranking">3</div>
              <div className="agent-avatar">RJ</div>
              <div className="agent-info">
                <div className="agent-name">Robert Johnson</div>
                <div className="agent-tickets">112 tickets resolved</div>
              </div>
              <div className="agent-stats">
                <div className="agent-performance">
                  <div className="performance-bar">
                    <div className="performance-fill" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div className="agent-rating">
                  <div className="rating-stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i>
                  </div>
                  <div className="rating-value">4.2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Distribucion de Tickets */}
        <div className="stat-card ticket-distribution">
          <div className="stat-header">
            <div className="stat-icon">
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="stat-content">
              <div className="stat-title">Ticket Distribution</div>
            </div>
          </div>
          
          <div className="distribution-chart">
            <div className="pie-chart">
              <svg viewBox="0 0 100 100">
                {/* Technical (40%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#2196F3"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="150.72"
                  transform="rotate(-90 50 50)"
                  className="pie-circle tech"
                />
                {/* Billing (25%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#4CAF50"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="188.4"
                  transform="rotate(54 50 50)"
                  className="pie-circle billing"
                />
                {/* Feature (15%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#FF9800"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="213.52"
                  transform="rotate(144 50 50)"
                  className="pie-circle feature"
                />
                {/* Integration (20%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#9C27B0"
                  strokeWidth="20"
                  strokeDasharray="251.2"
                  strokeDashoffset="200.96"
                  transform="rotate(198 50 50)"
                  className="pie-circle integration"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="rgba(0, 0, 0, 0.2)"
                  className="pie-center"
                />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="pie-center-text">100%</text>
              </svg>
            </div>
            <div className="distribution-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#2196F3' }}></div>
                <div className="legend-label">Technical</div>
                <div className="legend-value">40%</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
                <div className="legend-label">Billing</div>
                <div className="legend-value">25%</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#FF9800' }}></div>
                <div className="legend-label">Feature</div>
                <div className="legend-value">15%</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#9C27B0' }}></div>
                <div className="legend-label">Integration</div>
                <div className="legend-value">20%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevSupportStats;