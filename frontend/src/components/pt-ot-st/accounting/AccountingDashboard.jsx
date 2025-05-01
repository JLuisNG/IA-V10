import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../../../styles/developer/accounting/AccountingDashboard.scss';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const TPAccountingDashboard = ({ stats, selectedPeriod }) => {
  const [animateMetrics, setAnimateMetrics] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [revenueChartType, setRevenueChartType] = useState('bar');
  const [animatedValues, setAnimatedValues] = useState({
    totalBilled: 0,
    pendingPayments: 0,
    completedPayments: 0,
    averagePerVisit: 0
  });
  
  // Referencias para los gráficos
  const revenueChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const disciplineChartRef = useRef(null);
  const disciplineChartInstance = useRef(null);
  
  // Activar animaciones al montar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateMetrics(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animar valores de las métricas con efecto de contador gradual
  useEffect(() => {
    if (animateMetrics && stats) {
      const duration = 1500; // Duración total de la animación
      const steps = 60; // Número de pasos de la animación (para 60fps)
      const stepTime = duration / steps;
      let step = 0;
      
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        
        // Función de easing para hacer la animación más natural (cubic-bezier)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedValues({
          totalBilled: Math.round(easedProgress * stats.totalBilled * 100) / 100,
          pendingPayments: Math.round(easedProgress * stats.pendingPayments * 100) / 100,
          completedPayments: Math.round(easedProgress * stats.completedPayments * 100) / 100,
          averagePerVisit: Math.round(easedProgress * stats.averagePerVisit * 100) / 100
        });
        
        if (step >= steps) {
          clearInterval(interval);
        }
      }, stepTime);
      
      return () => clearInterval(interval);
    }
  }, [animateMetrics, stats]);
  
  // Renderizar gráfico de ingresos cuando cambian los datos o el canvas
  useEffect(() => {
    if (revenueChartRef.current && stats?.revenueByMonth && activeTab === 'overview') {
      renderRevenueChart();
    }
    
    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
    };
  }, [stats, revenueChartRef.current, activeTab, revenueChartType]);
  
  // Renderizar gráfico de disciplinas
  useEffect(() => {
    if (disciplineChartRef.current && stats?.visitsByDiscipline && activeTab === 'overview') {
      renderDisciplineChart();
    }
    
    return () => {
      if (disciplineChartInstance.current) {
        disciplineChartInstance.current.destroy();
      }
    };
  }, [stats, disciplineChartRef.current, activeTab]);
  
  // Función para renderizar gráfico de ingresos mejorado
  const renderRevenueChart = () => {
    const canvas = revenueChartRef.current;
    const ctx = canvas.getContext('2d');
    
    // Limpiar canvas y destruir instancia anterior si existe
    if (revenueChartInstance.current) {
      revenueChartInstance.current.destroy();
    }
    
    // Preparar datos para el gráfico
    const labels = stats.revenueByMonth.map(item => item.month);
    const currentData = stats.revenueByMonth.map(item => item.revenue);
    const previousData = stats.revenueByMonth.map(item => item.previousRevenue);
    const growthData = stats.revenueByMonth.map(item => item.growth);
    
    // Crear configuración para el gráfico
    const chartConfig = {
      type: revenueChartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Current Period',
            data: currentData,
            backgroundColor: function(context) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              if (!chartArea) {
                return null;
              }
              const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
              gradient.addColorStop(0, 'rgba(0, 229, 255, 0.6)');
              gradient.addColorStop(1, 'rgba(41, 121, 255, 0.6)');
              return gradient;
            },
            borderColor: 'rgba(0, 229, 255, 1)',
            borderWidth: 2,
            borderRadius: 6,
            hoverBackgroundColor: function(context) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              if (!chartArea) {
                return null;
              }
              const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
              gradient.addColorStop(0, 'rgba(0, 229, 255, 0.8)');
              gradient.addColorStop(1, 'rgba(41, 121, 255, 0.8)');
              return gradient;
            },
            hoverBorderColor: 'rgba(0, 229, 255, 1)',
            tension: 0.4
          },
          {
            label: 'Previous Period',
            data: previousData,
            backgroundColor: 'rgba(160, 174, 192, 0.2)',
            borderColor: 'rgba(160, 174, 192, 0.6)',
            borderWidth: 2,
            borderRadius: 6,
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              color: 'rgba(255, 255, 255, 0.8)'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: 'rgba(255, 255, 255, 0.9)',
            bodyColor: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            boxPadding: 4,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                  }).format(context.parsed.y);
                }
                return label;
              },
              afterBody: function(tooltipItems) {
                const dataIndex = tooltipItems[0].dataIndex;
                return `Growth: ${growthData[dataIndex]}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              callback: function(value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value);
              }
            }
          }
        }
      }
    };
    
    // Ajustes específicos según el tipo de gráfico
    if (revenueChartType === 'line') {
      // Para gráfico de línea, ajustar el fill y el orden
      chartConfig.data.datasets[0].fill = true;
      chartConfig.data.datasets[0].backgroundColor = function(context) {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) {
          return null;
        }
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(41, 121, 255, 0.3)');
        return gradient;
      };
      
      // Mover el conjunto de datos anterior al fondo
      chartConfig.data.datasets.reverse();
    }
    
    // Crear instancia del gráfico
    revenueChartInstance.current = new Chart(ctx, chartConfig);
  };
  
  // Función para renderizar gráfico de disciplinas (gráfico circular)
  const renderDisciplineChart = () => {
    const canvas = disciplineChartRef.current;
    const ctx = canvas.getContext('2d');
    
    // Limpiar canvas y destruir instancia anterior si existe
    if (disciplineChartInstance.current) {
      disciplineChartInstance.current.destroy();
    }
    
    // Preparar datos para el gráfico
    const disciplines = Object.keys(stats.visitsByDiscipline);
    const values = Object.values(stats.visitsByDiscipline);
    const total = values.reduce((acc, val) => acc + val, 0);
    const percentages = values.map(value => ((value / total) * 100).toFixed(1));
    
    // Colores para cada disciplina
    const disciplineColors = {
      PT: {
        backgroundColor: 'rgba(54, 209, 220, 0.8)',
        borderColor: '#36D1DC'
      },
      PTA: {
        backgroundColor: 'rgba(91, 134, 229, 0.8)',
        borderColor: '#5B86E5'
      },
      OT: {
        backgroundColor: 'rgba(255, 153, 102, 0.8)',
        borderColor: '#FF9966'
      },
      COTA: {
        backgroundColor: 'rgba(255, 94, 98, 0.8)',
        borderColor: '#FF5E62'
      },
      ST: {
        backgroundColor: 'rgba(86, 204, 242, 0.8)',
        borderColor: '#56CCF2'
      },
      STA: {
        backgroundColor: 'rgba(47, 128, 237, 0.8)',
        borderColor: '#2F80ED'
      }
    };
    
    // Preparar colores
    const backgroundColors = disciplines.map(discipline => disciplineColors[discipline]?.backgroundColor || 'rgba(160, 174, 192, 0.8)');
    const borderColors = disciplines.map(discipline => disciplineColors[discipline]?.borderColor || 'rgba(160, 174, 192, 1)');
    
    // Crear configuración para el gráfico
    const chartConfig = {
      type: 'doughnut',
      data: {
        labels: disciplines,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverBackgroundColor: backgroundColors.map(color => color.replace('0.8', '0.9')),
          hoverBorderColor: borderColors,
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              padding: 15,
              color: 'rgba(255, 255, 255, 0.8)',
              font: {
                size: 12
              },
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const meta = chart.getDatasetMeta(0);
                    const style = meta.controller.getStyle(i);
                    
                    return {
                      text: `${label}: ${percentages[i]}%`,
                      fillStyle: style.backgroundColor,
                      strokeStyle: style.borderColor,
                      lineWidth: style.borderWidth,
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: 'rgba(255, 255, 255, 0.9)',
            bodyColor: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const percentage = percentages[context.dataIndex];
                return `${label}: ${value} visits (${percentage}%)`;
              }
            }
          }
        },
      }
    };
    
    // Crear instancia del gráfico
    disciplineChartInstance.current = new Chart(ctx, chartConfig);
  };
  
  // Función para formatear valores monetarios
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Calcular porcentaje completado
  const calculateCompletionPercentage = () => {
    const total = stats.totalBilled;
    return total > 0 ? (stats.completedPayments / total * 100).toFixed(1) : 0;
  };
  
  // Animación de entrada secuencial
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className={`accounting-dashboard ${animateMetrics ? 'animate-in' : ''}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="dashboard-header">
        <h2>Financial Overview</h2>
        
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-line"></i>
            <span>Overview</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            <i className="fas fa-dollar-sign"></i>
            <span>Revenue</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'visits' ? 'active' : ''}`}
            onClick={() => setActiveTab('visits')}
          >
            <i className="fas fa-calendar-check"></i>
            <span>Visits</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'therapists' ? 'active' : ''}`}
            onClick={() => setActiveTab('therapists')}
          >
            <i className="fas fa-user-md"></i>
            <span>Therapists</span>
          </button>
        </div>
        
        {selectedPeriod && (
          <div className="period-badge">
            <i className="fas fa-calendar-alt"></i>
            <span>{selectedPeriod.period}</span>
          </div>
        )}
      </div>
      
      <div className="dashboard-content">
        {/* Métricas principales mejoradas */}
        <motion.div 
          className="metrics-section"
          variants={containerVariants}
        >
          <motion.div className="metric-card total-billed" variants={itemVariants}>
            <div className="metric-icon">
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
            <div className="metric-content">
              <h3 className="metric-title">Total Billed</h3>
              <div className="metric-value">
                {formatCurrency(animatedValues.totalBilled)}
              </div>
              <div className="metric-footer">
                {selectedPeriod && (
                  <span>Period: {selectedPeriod.period}</span>
                )}
              </div>
            </div>
            <div className="metric-decoration"></div>
          </motion.div>
          
          <motion.div className="metric-card pending-payments" variants={itemVariants}>
            <div className="metric-icon">
              <i className="fas fa-hourglass-half"></i>
            </div>
            <div className="metric-content">
              <h3 className="metric-title">Pending Payments</h3>
              <div className="metric-value">
                {formatCurrency(animatedValues.pendingPayments)}
              </div>
              <div className="metric-footer">
                <div className="badge awaiting">
                <i className="fas fa-clock"></i>
                  <span>Awaiting Verification</span>
                </div>
              </div>
            </div>
            <div className="metric-decoration"></div>
          </motion.div>
          
          <motion.div className="metric-card completed-payments" variants={itemVariants}>
            <div className="metric-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="metric-content">
              <h3 className="metric-title">Completed Payments</h3>
              <div className="metric-value">
                {formatCurrency(animatedValues.completedPayments)}
              </div>
              <div className="metric-footer">
                <div className="completion-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${calculateCompletionPercentage()}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{calculateCompletionPercentage()}% of total</span>
                </div>
              </div>
            </div>
            <div className="metric-decoration"></div>
          </motion.div>
          
          <motion.div className="metric-card average-visit" variants={itemVariants}>
            <div className="metric-icon">
              <i className="fas fa-calculator"></i>
            </div>
            <div className="metric-content">
              <h3 className="metric-title">Average Per Visit</h3>
              <div className="metric-value">
                {formatCurrency(animatedValues.averagePerVisit)}
              </div>
              <div className="metric-footer">
                <span>Based on all completed visits</span>
              </div>
            </div>
            <div className="metric-decoration"></div>
          </motion.div>
        </motion.div>
        
        {/* Gráfico de ingresos mejorado con opciones de visualización */}
        <motion.div 
          className="chart-section revenue-chart-section"
          variants={itemVariants}
        >
          <div className="chart-header">
            <h3>
              <i className="fas fa-chart-bar"></i>
              Revenue by Month
            </h3>
            <div className="chart-controls">
              <div className="chart-type-selector">
                <button 
                  className={`chart-type-btn ${revenueChartType === 'bar' ? 'active' : ''}`}
                  onClick={() => setRevenueChartType('bar')}
                  title="Bar Chart"
                >
                  <i className="fas fa-chart-bar"></i>
                </button>
                <button 
                  className={`chart-type-btn ${revenueChartType === 'line' ? 'active' : ''}`}
                  onClick={() => setRevenueChartType('line')}
                  title="Line Chart"
                >
                  <i className="fas fa-chart-line"></i>
                </button>
              </div>
              <div className="chart-actions">
                <button className="chart-action" title="Download Chart">
                  <i className="fas fa-download"></i>
                </button>
                <button className="chart-action" title="Refresh Data">
                  <i className="fas fa-sync-alt"></i>
                </button>
                <button className="chart-action" title="View Full Screen">
                  <i className="fas fa-expand"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="chart-container">
            <canvas 
              ref={revenueChartRef}
              className="revenue-chart"
            ></canvas>
          </div>
          
          <div className="chart-insights">
            <div className="insight-item positive">
              <i className="fas fa-arrow-up"></i>
              <span>Revenue increased by <strong>16.1%</strong> compared to previous period</span>
            </div>
            <div className="insight-item neutral">
              <i className="fas fa-info-circle"></i>
              <span>Projected April revenue: <strong>{formatCurrency(45200.00)}</strong></span>
            </div>
          </div>
        </motion.div>
        
        {/* Contenedor flexible para los gráficos de disciplina y tendencias */}
        <div className="charts-flex-container">
          {/* Gráfico de disciplinas mejorado */}
          <motion.div 
            className="chart-section discipline-chart-section"
            variants={itemVariants}
          >
            <div className="chart-header">
              <h3>
                <i className="fas fa-users"></i>
                Visits by Discipline
              </h3>
              <div className="chart-actions">
                <button className="chart-action" title="Download Chart">
                  <i className="fas fa-download"></i>
                </button>
                <button className="chart-action" title="Refresh Data">
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>
            
            <div className="chart-container">
              <canvas 
                ref={disciplineChartRef}
                className="discipline-chart"
              ></canvas>
            </div>
            
            <div className="chart-insights">
              <div className="insight-item positive">
                <i className="fas fa-arrow-up"></i>
                <span><strong>PT</strong> visits have the highest volume this period</span>
              </div>
            </div>
          </motion.div>
          
          {/* Nueva sección de tendencias mensuales */}
          <motion.div 
            className="chart-section trends-section"
            variants={itemVariants}
          >
            <div className="chart-header">
              <h3>
                <i className="fas fa-chart-line"></i>
                Monthly Trends
              </h3>
              <div className="chart-actions">
                <button className="chart-action" title="View Details">
                  <i className="fas fa-eye"></i>
                </button>
              </div>
            </div>
            
            <div className="trends-container">
              {stats.revenueByMonth && stats.revenueByMonth.map((month, index) => (
                <div key={month.month} className="trend-item">
                  <div className="trend-header">
                    <div className="trend-month">{month.month}</div>
                    <div className={`trend-growth ${month.growth >= 0 ? 'positive' : 'negative'}`}>
                      <i className={`fas fa-arrow-${month.growth >= 0 ? 'up' : 'down'}`}></i>
                      {month.growth}%
                    </div>
                  </div>
                  
                  <div className="trend-value">
                    {formatCurrency(month.revenue)}
                  </div>
                  
                  <div className="trend-progress-bar">
                    <div 
                      className="trend-progress-fill"
                      style={{ 
                        width: `${(month.revenue / Math.max(...stats.revenueByMonth.map(m => m.revenue))) * 100}%`,
                        backgroundColor: month.projected 
                          ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.8), rgba(99, 102, 241, 0.4))'
                          : undefined
                      }}
                    ></div>
                  </div>
                  
                  {month.projected && (
                    <div className="trend-projected">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Projected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Estadísticas por disciplina mejoradas */}
        {stats.visitsByDiscipline && (
          <motion.div 
            className="discipline-breakdown"
            variants={containerVariants}
          >
            <h3>
              <i className="fas fa-stethoscope"></i>
              Discipline Statistics
            </h3>
            <div className="discipline-cards">
              {Object.entries(stats.visitsByDiscipline).map(([discipline, count], index) => {
                const total = Object.values(stats.visitsByDiscipline).reduce((sum, val) => sum + val, 0);
                const percentage = Math.round((count / total) * 100);
                
                let icon, title;
                switch(discipline) {
                  case 'PT':
                    icon = 'fa-walking';
                    title = 'Physical Therapy';
                    break;
                  case 'PTA':
                    icon = 'fa-walking';
                    title = 'Physical Therapy Assistant';
                    break;
                  case 'OT':
                    icon = 'fa-hands';
                    title = 'Occupational Therapy';
                    break;
                  case 'COTA':
                    icon = 'fa-hands';
                    title = 'OT Assistant';
                    break;
                  case 'ST':
                    icon = 'fa-comment-medical';
                    title = 'Speech Therapy';
                    break;
                  case 'STA':
                    icon = 'fa-comment-medical';
                    title = 'Speech Therapy Assistant';
                    break;
                  default:
                    icon = 'fa-user-md';
                    title = discipline;
                }
                
                return (
                  <motion.div 
                    key={discipline}
                    className={`discipline-card ${discipline.toLowerCase()}`}
                    variants={itemVariants}
                  >
                    <div className="discipline-icon">
                      <i className={`fas ${icon}`}></i>
                    </div>
                    <div className="discipline-content">
                      <h4>{title}</h4>
                      <div className="discipline-count">
                        {count} <span>visits</span>
                      </div>
                      <div className="discipline-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="discipline-percentage">
                      {percentage}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TPAccountingDashboard;