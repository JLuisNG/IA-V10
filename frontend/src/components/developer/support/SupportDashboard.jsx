import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/developer/support/SupportDashboard.scss';
import SupportTickets from './SupportTickets.jsx';
import SupportKnowledgeBase from './SupportKnowledgeBase.jsx';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Tooltip, 
  Legend,
  Filler
);

const DevSupportDashboard = () => {
  // Referencias para animaciones
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafIdRef = useRef(null);
  
  // Estados
  const [dashboardData, setDashboardData] = useState({
    stats: {
      ticketsResolved: 1248,
      avgResponseTime: '1h 24m',
      customerSatisfaction: 96.7,
      openTickets: 27,
      urgentTickets: 4,
      newTicketsToday: 18
    },
    performance: {
      weeklyTickets: [145, 156, 187, 164, 172, 104, 86],
      responseTimeHistory: [86, 82, 88, 78, 86, 76, 84, 72, 70],
      satisfactionHistory: [95.2, 94.8, 95.6, 96.2, 96.4, 96.7, 96.7]
    },
    agents: [
      { id: 1, name: 'Luis Nava', avatar: 'LN', ticketsResolved: 138, rating: 4.8, performance: 91, online: true },
      { id: 2, name: 'Maria Cruz', avatar: 'MC', ticketsResolved: 125, rating: 4.9, performance: 93, online: true },
      { id: 3, name: 'Robert Johnson', avatar: 'RJ', ticketsResolved: 112, rating: 4.2, performance: 84, online: false }
    ],
    distribution: {
      technical: 40,
      billing: 25,
      feature: 15,
      integration: 20
    },
    recentActivity: [
      { id: 1, type: 'new_ticket', user: 'Jennifer Wilson', action: 'created a new ticket', time: '14 min ago', ticket: 'TK-1084' },
      { id: 2, type: 'comment', user: 'Robert Chen', action: 'commented on', time: '32 min ago', ticket: 'TK-1083' },
      { id: 3, type: 'status', user: 'Luis Nava', action: 'closed ticket', time: '1h 12m ago', ticket: 'TK-1082' },
      { id: 4, type: 'assignment', user: 'Maria Cruz', action: 'assigned to Luis Nava', time: '2h 05m ago', ticket: 'TK-1081' }
    ]
  });
  
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);
  const [hoverCard, setHoverCard] = useState(null);
  const [ticketTrend, setTicketTrend] = useState({ value: 12.5, type: 'positive' });
  const [responseTrend, setResponseTrend] = useState({ value: 8.3, type: 'negative' });
  const [satisfactionTrend, setSatisfactionTrend] = useState({ value: 2.1, type: 'positive' });
  
  // Efecto para la carga inicial con animaciones
  useEffect(() => {
    // Simulación de carga de datos con animación premium
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      // Activar animaciones después de que se complete la carga
      setTimeout(() => {
        setAnimateStats(true);
        initParticles();
      }, 300);
    }, 80);
    
    return () => {
      clearTimeout(loadingTimer);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);
  
  // Efecto para animación de partículas en el fondo
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);
  
  // Inicialización de partículas para el fondo
  const initParticles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Crear partículas
    const particleCount = 50;
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: `rgba(0, 229, 255, ${Math.random() * 0.3 + 0.1})`
      });
    }
    
    // Función de animación
    const animate = () => {
      if (!canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        // Mover partícula
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Rebotar en los bordes
        if (particle.x > canvas.width || particle.x < 0) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y > canvas.height || particle.y < 0) {
          particle.speedY = -particle.speedY;
        }
        
        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Dibujar conexiones entre partículas cercanas
        particlesRef.current.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
      
      rafIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(rafIdRef.current);
    };
  };
  
  // Obtener el día de la semana
  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };
  
  // Obtener fecha formateada
  const getFormattedDate = () => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };
  
  // Obtener hora actual formateada
  const getFormattedTime = () => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date().toLocaleTimeString('en-US', options);
  };
  
  // Obtener color según la prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--color-danger)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-muted)';
    }
  };
  
  // Obtener icono según el tipo de actividad
  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_ticket': return <i className="fas fa-ticket-alt"></i>;
      case 'comment': return <i className="fas fa-comment"></i>;
      case 'status': return <i className="fas fa-check-circle"></i>;
      case 'assignment': return <i className="fas fa-user-tag"></i>;
      default: return <i className="fas fa-bell"></i>;
    }
  };
  
  // Obtener color según el tipo de actividad
  const getActivityColor = (type) => {
    switch (type) {
      case 'new_ticket': return 'var(--color-info)';
      case 'comment': return 'var(--color-warning)';
      case 'status': return 'var(--color-success)';
      case 'assignment': return 'var(--color-secondary)';
      default: return 'var(--color-muted)';
    }
  };
  
  // Cambiar el rango de tiempo
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Aquí podrías actualizar los datos según el rango seleccionado
  };
  
  // Datos para los gráficos
  const weeklyTicketsChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tickets',
        data: dashboardData.performance.weeklyTickets,
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
        borderRadius: 8,
        maxBarThickness: 15,
      }
    ]
  };
  
  const responseTimeChartData = {
    labels: ['Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5', 'Mar 12'],
    datasets: [
      {
        label: 'Response Time (min)',
        data: dashboardData.performance.responseTimeHistory,
        fill: true,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderColor: 'rgba(33, 150, 243, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(33, 150, 243, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };
  
  const satisfactionChartData = {
    labels: ['Technical', 'Billing', 'Feature', 'Integration'],
    datasets: [
      {
        data: [
          dashboardData.distribution.technical, 
          dashboardData.distribution.billing, 
          dashboardData.distribution.feature, 
          dashboardData.distribution.integration
        ],
        backgroundColor: [
          'rgba(33, 150, 243, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(156, 39, 176, 0.7)'
        ],
        borderColor: [
          'rgba(33, 150, 243, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(156, 39, 176, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 15,
      }
    ]
  };
  
  // Opciones para los gráficos
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        usePointStyle: true,
        callbacks: {
          title: (context) => `Day: ${context[0].label}`,
          label: (context) => `Tickets Resolved: ${context.raw}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
            family: 'Inter, sans-serif',
          },
          padding: 10,
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        border: {
          dash: [4, 4],
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
            family: 'Inter, sans-serif',
          },
          padding: 10,
          stepSize: 50,
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    }
  };
  
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        usePointStyle: true,
        callbacks: {
          title: (context) => `Date: ${context[0].label}`,
          label: (context) => `Average Response Time: ${context.raw} minutes`
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
            family: 'Inter, sans-serif',
          },
          maxRotation: 45,
          minRotation: 45,
          padding: 10,
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        border: {
          dash: [4, 4],
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
            family: 'Inter, sans-serif',
          },
          padding: 10,
          stepSize: 5,
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 6,
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    }
  };
  
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          title: (context) => `${context[0].label}`,
          label: (context) => `${context.raw}% of tickets`
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeOutQuart',
    }
  };
  
  // Renderizado del dashboard
  return (
    <div className="support-dashboard">
      {/* Canvas de fondo para partículas */}
      <canvas ref={canvasRef} className="dashboard-particles-canvas"></canvas>
      
      {/* Animación de carga premium */}
      {isLoading && (
        <div className="dashboard-loader">
          <div className="loader-content">
            <div className="loader-logo-container">
              <div className="loader-logo-glow"></div>
              <div className="loader-logo">TherapySync</div>
            </div>
            <div className="loader-text">
              <span className="loader-text-message">Loading Support Dashboard</span>
              <span className="loader-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
            </div>
            <div className="loader-progress">
              <div className="progress-bar">
                <div className="progress-bar-fill"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cabecera superior con bienvenida y estadísticas rápidas */}
      <div className={`dashboard-welcome ${animateStats ? 'animate' : ''}`}>
        <div className="dashboard-welcome-left">
          <div className="welcome-greeting">
            <h1 className="welcome-title">Welcome back, Luis!</h1>
            <p className="welcome-subtitle">
              <span className="welcome-day">{getDayOfWeek()}</span>
              <span className="welcome-date">{getFormattedDate()}</span>
              <span className="welcome-time">{getFormattedTime()}</span>
            </p>
          </div>
          
          <div className="quick-stats">
            <div className="quick-stat">
              <div className="quick-stat-icon">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <div className="quick-stat-content">
                <div className="quick-stat-value">{dashboardData.stats.newTicketsToday}</div>
                <div className="quick-stat-label">New Today</div>
              </div>
            </div>
            
            <div className="quick-stat">
              <div className="quick-stat-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <div className="quick-stat-content">
                <div className="quick-stat-value">{dashboardData.stats.openTickets}</div>
                <div className="quick-stat-label">Open Tickets</div>
              </div>
            </div>
            
            <div className="quick-stat urgent">
              <div className="quick-stat-icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="quick-stat-content">
                <div className="quick-stat-value">{dashboardData.stats.urgentTickets}</div>
                <div className="quick-stat-label">Urgent</div>
              </div>
              <div className="quick-stat-badge">Priority</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-welcome-right">
          <div className="welcome-action-buttons">
            <button className="welcome-action-button primary">
              <i className="fas fa-plus"></i>
              <span>New Ticket</span>
            </button>
            <button className="welcome-action-button secondary">
              <i className="fas fa-chart-line"></i>
              <span>Analytics</span>
            </button>
            <button className="welcome-action-button tertiary">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Filtros y Controls */}
      <div className={`dashboard-controls ${animateStats ? 'animate' : ''}`}>
        <div className="dashboard-time-filter">
          <div className="filter-label">
            <i className="fas fa-calendar-alt"></i>
            <span>Time Period:</span>
          </div>
          <div className="filter-options">
            <button 
              className={`filter-option ${timeRange === 'today' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('today')}
            >
              Today
            </button>
            <button 
              className={`filter-option ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('week')}
            >
              This Week
            </button>
            <button 
              className={`filter-option ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('month')}
            >
              This Month
            </button>
            <button 
              className={`filter-option ${timeRange === 'quarter' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('quarter')}
            >
              This Quarter
            </button>
            <button 
              className={`filter-option ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('year')}
            >
              This Year
            </button>
            <button 
              className={`filter-option custom ${timeRange === 'custom' ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange('custom')}
            >
              <i className="fas fa-calendar"></i>
              Custom Range
            </button>
          </div>
        </div>
        
        <div className="dashboard-view-controls">
          <div className="view-control-label">View as:</div>
          <div className="view-control-options">
            <button className="view-option active">
              <i className="fas fa-th-large"></i>
            </button>
            <button className="view-option">
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Grid principal de estadísticas */}
      <div className="dashboard-grid">
        {/* Tarjeta de tickets resueltos */}
        <div 
          className={`dashboard-card tickets-resolved ${animateStats ? 'animate' : ''} ${hoverCard === 'tickets' ? 'hover' : ''}`}
          onMouseEnter={() => setHoverCard('tickets')}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="card-title">Tickets Resolved</div>
            <div className="card-actions">
              <button className="card-action-button">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
          
          <div className="card-content">
            <div className="content-left">
              <div className="card-value">{dashboardData.stats.ticketsResolved.toLocaleString()}</div>
              <div className={`card-trend ${ticketTrend.type}`}>
                <i className={`fas fa-arrow-${ticketTrend.type === 'positive' ? 'up' : 'down'}`}></i>
                <span>{ticketTrend.value}% from last {timeRange}</span>
              </div>
            </div>
            
            <div className="content-right">
              <div className="chart-container">
                <Bar 
                  data={weeklyTicketsChartData} 
                  options={barChartOptions}
                  className="card-chart"
                />
              </div>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="footer-stat">
              <div className="footer-stat-value">92%</div>
              <div className="footer-stat-label">First Response SLA</div>
            </div>
            <div className="footer-stat">
              <div className="footer-stat-value">87%</div>
              <div className="footer-stat-label">Resolution SLA</div>
            </div>
            <Link to="/tickets" className="card-link">
              <span>View All Tickets</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
        
        {/* Tarjeta de tiempo de respuesta */}
        <div 
          className={`dashboard-card response-time ${animateStats ? 'animate' : ''} ${hoverCard === 'response' ? 'hover' : ''}`}
          onMouseEnter={() => setHoverCard('response')}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="card-title">Avg. Response Time</div>
            <div className="card-actions">
              <button className="card-action-button">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
          
          <div className="card-content">
            <div className="content-left">
              <div className="card-value">{dashboardData.stats.avgResponseTime}</div>
              <div className={`card-trend ${responseTrend.type}`}>
                <i className={`fas fa-arrow-${responseTrend.type === 'positive' ? 'up' : 'down'}`}></i>
                <span>{responseTrend.value}% from last {timeRange}</span>
              </div>
            </div>
            
            <div className="content-right">
              <div className="chart-container">
                <Line 
                  data={responseTimeChartData} 
                  options={lineChartOptions}
                  className="card-chart"
                />
              </div>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="footer-stat">
              <div className="footer-stat-value">65m</div>
              <div className="footer-stat-label">First Response</div>
            </div>
            <div className="footer-stat">
              <div className="footer-stat-value">3.2h</div>
              <div className="footer-stat-label">Resolution Time</div>
            </div>
            <Link to="/response-metrics" className="card-link">
              <span>Detailed Metrics</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
        
        {/* Tarjeta de satisfacción del cliente */}
        <div 
          className={`dashboard-card satisfaction ${animateStats ? 'animate' : ''} ${hoverCard === 'satisfaction' ? 'hover' : ''}`}
          onMouseEnter={() => setHoverCard('satisfaction')}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-heart"></i>
            </div>
            <div className="card-title">Customer Satisfaction</div>
            <div className="card-actions">
              <button className="card-action-button">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
          
          <div className="card-content satisfaction-content">
            <div className="satisfaction-score">
              <div className="satisfaction-ring">
                <svg viewBox="0 0 100 100" className="satisfaction-svg">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#333a4d"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#satisfactionGradient)"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - dashboardData.stats.customerSatisfaction / 100)}`}
                    transform="rotate(-90, 50, 50)"
                    className={`satisfaction-circle ${animateStats ? 'animate' : ''}`}
                  />
                  <defs>
                    <linearGradient id="satisfactionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4CAF50" />
                      <stop offset="100%" stopColor="#8BC34A" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="satisfaction-value">
                  <span className="value">{dashboardData.stats.customerSatisfaction}</span>
                  <span className="percentage">%</span>
                </div>
              </div>
              <div className={`card-trend ${satisfactionTrend.type}`}>
                <i className={`fas fa-arrow-${satisfactionTrend.type === 'positive' ? 'up' : 'down'}`}></i>
                <span>{satisfactionTrend.value}% from last {timeRange}</span>
              </div>
            </div>
            
            <div className="satisfaction-details">
              <div className="rating-breakdown">
                <div className="rating-item">
                  <div className="rating-label">
                    <span className="rating-star">★★★★★</span>
                    <span className="rating-text">Excellent</span>
                  </div>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{ width: '72%' }}></div>
                  </div>
                  <div className="rating-percent">72%</div>
                </div>
                <div className="rating-item">
                  <div className="rating-label">
                    <span className="rating-star">★★★★</span>
                    <span className="rating-text">Good</span>
                  </div>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{ width: '21%' }}></div>
                  </div>
                  <div className="rating-percent">21%</div>
                </div>
                <div className="rating-item">
                  <div className="rating-label">
                    <span className="rating-star">★★★</span>
                    <span className="rating-text">Average</span>
                  </div>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{ width: '5%' }}></div>
                  </div>
                  <div className="rating-percent">5%</div>
                </div>
                <div className="rating-item">
                  <div className="rating-label">
                    <span className="rating-star">★★</span>
                    <span className="rating-text">Poor</span>
                  </div>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{ width: '2%' }}></div>
                  </div>
                  <div className="rating-percent">2%</div>
                </div>
                <div className="rating-item">
                  <div className="rating-label">
                    <span className="rating-star">★</span>
                    <span className="rating-text">Terrible</span>
                  </div>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{ width: '0%' }}></div>
                  </div>
                  <div className="rating-percent">0%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="footer-stat">
              <div className="footer-stat-value">4.7</div>
              <div className="footer-stat-label">Average Rating</div>
            </div>
            <div className="footer-stat">
              <div className="footer-stat-value">682</div>
              <div className="footer-stat-label">Total Reviews</div>
            </div>
            <Link to="/satisfaction" className="card-link">
              <span>All Feedback</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
        
        {/* Tarjeta de distribución de tickets */}
        <div 
          className={`dashboard-card distribution ${animateStats ? 'animate' : ''} ${hoverCard === 'distribution' ? 'hover' : ''}`}
          onMouseEnter={() => setHoverCard('distribution')}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="card-title">Ticket Distribution</div>
            <div className="card-actions">
              <button className="card-action-button">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
          
          <div className="card-content">
            <div className="chart-container">
              <Doughnut 
                data={satisfactionChartData} 
                options={doughnutChartOptions} 
                className="distribution-chart"
              />
            </div>
            
            <div className="distribution-legend">
              <div className="legend-item">
                <span className="legend-color technical"></span>
                <span className="legend-label">Technical Issues</span>
                <span className="legend-value">{dashboardData.distribution.technical}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color billing"></span>
                <span className="legend-label">Billing & Payments</span>
                <span className="legend-value">{dashboardData.distribution.billing}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color feature"></span>
                <span className="legend-label">Feature Requests</span>
                <span className="legend-value">{dashboardData.distribution.feature}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color integration"></span>
                <span className="legend-label">Integration</span>
                <span className="legend-value">{dashboardData.distribution.integration}%</span>
              </div>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="footer-stat">
              <div className="footer-stat-value">348</div>
              <div className="footer-stat-label">Total Tickets</div>
            </div>
            <div className="footer-stat">
              <div className="footer-stat-value">42</div>
              <div className="footer-stat-label">Weekly Average</div>
            </div>
            <Link to="/analytics" className="card-link">
              <span>Detailed Analysis</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
        
        {/* Tarjeta de agentes de soporte */}
        <div 
          className={`dashboard-card agents ${animateStats ? 'animate' : ''} ${hoverCard === 'agents' ? 'hover' : ''}`}
          onMouseEnter={() => setHoverCard('agents')}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="card-title">Top Support Agents</div>
            <div className="card-actions">
              <Link to="/agents" className="header-link">
                <span>View All</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
            </div>
          </div>
          
          <div className="card-content">
            <div className="agents-list">
              {dashboardData.agents.map((agent, index) => (
                <div key={agent.id} className="agent-item">
                  <div className="agent-rank">{index + 1}</div>
                  <div className={`agent-avatar ${agent.online ? 'online' : ''}`}>
                    {agent.avatar}
                  </div>
                  <div className="agent-info">
                    <div className="agent-name">
                      {agent.name} 
                      {index === 0 && <span className="agent-badge">Top Performer</span>}
                    </div>
                    <div className="agent-stats">
                      <div className="agent-stat tickets">
                        <i className="fas fa-ticket-alt"></i>
                        <span>{agent.ticketsResolved} tickets</span>
                      </div>
                      <div className="agent-stat rating">
                        <i className="fas fa-star"></i>
                        <span>{agent.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="agent-performance-wrapper">
                    <div className="agent-performance-label">
                      <span className="label">Performance</span>
                      <span className="value">{agent.performance}%</span>
                    </div>
                    <div className="agent-performance-bar">
                      <div 
                        className={`performance-fill ${animateStats ? 'animate' : ''}`}
                        style={{ 
                          width: `${agent.performance}%`,
                          background: `linear-gradient(90deg, ${
                            agent.performance < 70 ? 'var(--color-danger)' : 
                            agent.performance < 85 ? 'var(--color-warning)' : 
                            'var(--color-success)'
                          }, ${
                            agent.performance < 70 ? 'var(--color-warning)' : 
                            agent.performance < 85 ? 'var(--color-success)' : 
                            'var(--color-success-light)'
                          })`,
                          animationDelay: `${0.3 + index * 0.1}s`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card-footer">
            <button className="footer-button primary">
              <i className="fas fa-user-plus"></i>
              <span>Add Agent</span>
            </button>
            <button className="footer-button secondary">
              <i className="fas fa-cog"></i>
              <span>Manage Teams</span>
            </button>
          </div>
        </div>
        
        {/* Tarjeta de actividad reciente */}
        <div 
          className={`dashboard-card activity ${animateStats ? 'animate' : ''} ${hoverCard === 'activity' ? 'hover' : ''}`}
          onMouseEnter={() => setHoverCard('activity')}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-history"></i>
            </div>
            <div className="card-title">Recent Activity</div>
            <div className="card-actions">
              <Link to="/activity" className="header-link">
                <span>View All</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
            </div>
          </div>
          
          <div className="card-content">
            <div className="activity-timeline">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div 
                    className="activity-icon"
                    style={{ backgroundColor: `${getActivityColor(activity.type)}20` }}
                  >
                    <span style={{ color: getActivityColor(activity.type) }}>
                      {getActivityIcon(activity.type)}
                    </span>
                  </div>
                  <div className="activity-connector">
                    <div className="connector-line"></div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <div className="activity-user">{activity.user}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                    <div className="activity-description">
                      <span className="activity-action">{activity.action}</span>
                      <Link to={`/ticket/${activity.ticket}`} className="activity-ticket">
                        {activity.ticket}
                      </Link>
                    </div>
                    <div className="activity-actions">
                      <button className="activity-action-btn">
                        <i className="fas fa-reply"></i>
                        <span>Reply</span>
                      </button>
                      <button className="activity-action-btn">
                        <i className="fas fa-eye"></i>
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card-footer">
            <div className="footer-stat">
              <div className="footer-stat-value">24</div>
              <div className="footer-stat-label">Activities Today</div>
            </div>
            <div className="footer-stat">
              <div className="footer-stat-value">163</div>
              <div className="footer-stat-label">This Week</div>
            </div>
            <Link to="/activity-log" className="card-link">
              <span>Full Activity Log</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Sección de módulos adicionales */}
      <div className={`dashboard-modules ${animateStats ? 'animate' : ''}`}>
        <div className="module-row">
          <div className="module-card tickets-module">
            <div className="module-header">
              <div className="module-title">
                <i className="fas fa-ticket-alt"></i>
                <h3>Recent Tickets</h3>
              </div>
              <Link to="/tickets" className="module-action">
                <span>View All</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="module-content">
              <SupportTickets preview={true} />
            </div>
          </div>
          
          <div className="module-card knowledge-module">
            <div className="module-header">
              <div className="module-title">
                <i className="fas fa-book"></i>
                <h3>Knowledge Base</h3>
              </div>
              <Link to="/knowledge" className="module-action">
                <span>View All</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="module-content">
              <SupportKnowledgeBase preview={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevSupportDashboard;