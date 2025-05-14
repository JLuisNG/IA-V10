import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../styles/developer/accounting/TherapistEarnings.scss';

// Datos estáticos simulados - en una aplicación real vendrían de una API
const STATIC_THERAPISTS = [
  {
    id: 1,
    name: "Regina Araquel",
    role: "PT",
    visits: 45,
    pendingVisits: 3,
    earnings: 4050.75,
    status: "verified",
    completionRate: 97,
    growth: 15.2,
    patients: [
      { id: 101, name: "Soheila Adhami", visits: 8, revenue: 680.00, lastVisit: "2025-03-14" },
      { id: 102, name: "James Smith", visits: 12, revenue: 1020.00, lastVisit: "2025-03-15" },
      { id: 103, name: "Maria Rodriguez", visits: 10, revenue: 850.00, lastVisit: "2025-03-12" },
      { id: 112, name: "Anna Johnson", visits: 7, revenue: 595.00, lastVisit: "2025-03-10" },
      { id: 118, name: "Luis Chen", visits: 8, revenue: 680.00, lastVisit: "2025-03-13" }
    ]
  },
  {
    id: 2,
    name: "Justin Shimane",
    role: "OT",
    visits: 42,
    pendingVisits: 0,
    earnings: 3780.00,
    status: "verified",
    completionRate: 100,
    growth: 12.8,
    patients: [
      { id: 106, name: "Susan Wilson", visits: 7, revenue: 595.00, lastVisit: "2025-03-14" },
      { id: 107, name: "Michael Brown", visits: 8, revenue: 680.00, lastVisit: "2025-03-15" },
      { id: 113, name: "Patricia Lee", visits: 10, revenue: 850.00, lastVisit: "2025-03-11" },
      { id: 116, name: "Christopher Adams", visits: 9, revenue: 765.00, lastVisit: "2025-03-13" },
      { id: 120, name: "Emily Turner", visits: 8, revenue: 680.00, lastVisit: "2025-03-15" }
    ]
  },
  {
    id: 3,
    name: "Elena Martinez",
    role: "ST",
    visits: 40,
    pendingVisits: 1,
    earnings: 3600.00,
    status: "verified",
    completionRate: 98,
    growth: 10.5,
    patients: [
      { id: 110, name: "Thomas White", visits: 9, revenue: 765.00, lastVisit: "2025-03-12" },
      { id: 111, name: "Jessica Taylor", visits: 8, revenue: 680.00, lastVisit: "2025-03-15" },
      { id: 121, name: "Kevin Harris", visits: 10, revenue: 850.00, lastVisit: "2025-03-14" },
      { id: 122, name: "Rachel Thompson", visits: 7, revenue: 595.00, lastVisit: "2025-03-11" },
      { id: 123, name: "Steven Clark", visits: 6, revenue: 510.00, lastVisit: "2025-03-13" }
    ]
  },
  {
    id: 4,
    name: "Jacob Staffey",
    role: "PTA",
    visits: 38,
    pendingVisits: 5,
    earnings: 3230.00,
    status: "verified",
    completionRate: 92,
    growth: -2.1,
    patients: [
      { id: 104, name: "Linda Johnson", visits: 10, revenue: 850.00, lastVisit: "2025-03-10" },
      { id: 105, name: "Robert Garcia", visits: 9, revenue: 765.00, lastVisit: "2025-03-13" },
      { id: 115, name: "Olivia Wilson", visits: 9, revenue: 765.00, lastVisit: "2025-03-11" },
      { id: 119, name: "David Martinez", visits: 10, revenue: 850.00, lastVisit: "2025-03-14" }
    ]
  },
  {
    id: 5,
    name: "April Kim",
    role: "COTA",
    visits: 35,
    pendingVisits: 2,
    earnings: 2975.00,
    status: "pending",
    completionRate: 95,
    growth: 8.7,
    patients: [
      { id: 108, name: "David Anderson", visits: 6, revenue: 510.00, lastVisit: "2025-03-11" },
      { id: 109, name: "Jennifer Lopez", visits: 7, revenue: 595.00, lastVisit: "2025-03-13" },
      { id: 114, name: "Daniel Wright", visits: 9, revenue: 765.00, lastVisit: "2025-03-12" },
      { id: 117, name: "Michelle Taylor", visits: 8, revenue: 680.00, lastVisit: "2025-03-15" }
    ]
  },
  {
    id: 6,
    name: "Michael Johnson",
    role: "STA",
    visits: 32,
    pendingVisits: 3,
    earnings: 2720.00,
    status: "pending",
    completionRate: 93,
    growth: 5.4,
    patients: [
      { id: 124, name: "Amanda Wilson", visits: 8, revenue: 680.00, lastVisit: "2025-03-14" },
      { id: 125, name: "Brian Thomas", visits: 7, revenue: 595.00, lastVisit: "2025-03-12" },
      { id: 126, name: "Catherine Lee", visits: 9, revenue: 765.00, lastVisit: "2025-03-15" },
      { id: 127, name: "Derek Johnson", visits: 8, revenue: 680.00, lastVisit: "2025-03-11" }
    ]
  },
  {
    id: 7,
    name: "Sarah Phillips",
    role: "PT",
    visits: 41,
    pendingVisits: 2,
    earnings: 3485.00,
    status: "verified",
    completionRate: 96,
    growth: 7.8,
    patients: [
      { id: 128, name: "George Wilson", visits: 11, revenue: 935.00, lastVisit: "2025-03-13" },
      { id: 129, name: "Hannah Davis", visits: 9, revenue: 765.00, lastVisit: "2025-03-15" },
      { id: 130, name: "Ian Matthews", visits: 8, revenue: 680.00, lastVisit: "2025-03-14" },
      { id: 131, name: "Julia Baker", visits: 13, revenue: 1105.00, lastVisit: "2025-03-12" }
    ]
  },
  {
    id: 8,
    name: "David Chang",
    role: "OT",
    visits: 37,
    pendingVisits: 1,
    earnings: 3145.00,
    status: "verified",
    completionRate: 99,
    growth: 9.3,
    patients: [
      { id: 132, name: "Karen Lewis", visits: 9, revenue: 765.00, lastVisit: "2025-03-15" },
      { id: 133, name: "Lucas Roberts", visits: 10, revenue: 850.00, lastVisit: "2025-03-14" },
      { id: 134, name: "Melinda Chen", visits: 8, revenue: 680.00, lastVisit: "2025-03-13" },
      { id: 135, name: "Nathan Scott", visits: 10, revenue: 850.00, lastVisit: "2025-03-11" }
    ]
  },
  {
    id: 9,
    name: "Olivia Parker",
    role: "STA",
    visits: 30,
    pendingVisits: 4,
    earnings: 2550.00,
    status: "pending",
    completionRate: 91,
    growth: 6.2,
    patients: [
      { id: 136, name: "Paul Turner", visits: 7, revenue: 595.00, lastVisit: "2025-03-15" },
      { id: 137, name: "Quinn Evans", visits: 8, revenue: 680.00, lastVisit: "2025-03-12" },
      { id: 138, name: "Rachel Brooks", visits: 6, revenue: 510.00, lastVisit: "2025-03-10" },
      { id: 139, name: "Samuel Carter", visits: 9, revenue: 765.00, lastVisit: "2025-03-14" }
    ]
  },
  {
    id: 10,
    name: "Robert Williams",
    role: "ST",
    visits: 39,
    pendingVisits: 0,
    earnings: 3315.00,
    status: "verified",
    completionRate: 100,
    growth: 11.7,
    patients: [
      { id: 140, name: "Tina Marshall", visits: 10, revenue: 850.00, lastVisit: "2025-03-15" },
      { id: 141, name: "Ulysses King", visits: 9, revenue: 765.00, lastVisit: "2025-03-14" },
      { id: 142, name: "Victoria Adams", visits: 11, revenue: 935.00, lastVisit: "2025-03-13" },
      { id: 143, name: "William Foster", visits: 9, revenue: 765.00, lastVisit: "2025-03-11" }
    ]
  }
];

// Componente principal
const TherapistEarnings = ({ selectedPeriod, onTherapistClick, onVerifyPayment }) => {
  // Estados
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'earnings', direction: 'desc' });
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalVisits: 0,
    avgCompletionRate: 0,
    pendingVerification: 0
  });
  
  // Obtener todos los terapeutas (simulando una API)
  const [therapists, setTherapists] = useState(STATIC_THERAPISTS);
  
  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let filtered = [...therapists];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(therapist => 
        therapist.name.toLowerCase().includes(term) ||
        therapist.role.toLowerCase().includes(term)
      );
    }
    
    // Aplicar filtro de rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(therapist => therapist.role === roleFilter);
    }
    
    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(therapist => therapist.status === statusFilter);
    }
    
    // Aplicar ordenamiento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredTherapists(filtered);
    
    // Calcular estadísticas
    const totalEarnings = filtered.reduce((sum, t) => sum + t.earnings, 0);
    const totalVisits = filtered.reduce((sum, t) => sum + t.visits, 0);
    const avgCompletionRate = filtered.length > 0 
      ? Math.round(filtered.reduce((sum, t) => sum + t.completionRate, 0) / filtered.length) 
      : 0;
    const pendingVerification = filtered.filter(t => t.status === 'pending').length;
    
    setStats({
      totalEarnings,
      totalVisits,
      avgCompletionRate,
      pendingVerification
    });
  }, [therapists, searchTerm, roleFilter, statusFilter, sortConfig]);
  
  // Obtener roles disponibles de los terapeutas
  const availableRoles = useMemo(() => {
    const roles = [...new Set(therapists.map(t => t.role))];
    return roles;
  }, [therapists]);
  
  // Manejar selección de fila
  const handleRowSelect = (id) => {
    setSelectedRows(prevSelectedRows => {
      const isSelected = prevSelectedRows.includes(id);
      const newSelectedRows = isSelected
        ? prevSelectedRows.filter(rowId => rowId !== id)
        : [...prevSelectedRows, id];
      
      // Verificar si todas las filas están seleccionadas
      setSelectAll(newSelectedRows.length === filteredTherapists.length);
      
      return newSelectedRows;
    });
  };
  
  // Manejar selección de todas las filas
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(!selectAll ? filteredTherapists.map(t => t.id) : []);
  };
  
  // Cambiar configuración de orden
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Obtener indicador de orden
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return 'fas fa-sort';
    }
    return sortConfig.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
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
  
  // Verificar pagos seleccionados
  const verifySelectedPayments = () => {
    selectedRows.forEach(id => {
      onVerifyPayment(id);
      
      // Actualizar estado local
      setTherapists(prevTherapists => 
        prevTherapists.map(therapist => 
          therapist.id === id 
            ? { ...therapist, status: 'verified' } 
            : therapist
        )
      );
    });
    
    // Limpiar selección después de verificación
    setSelectedRows([]);
    setSelectAll(false);
  };
  
  // Manejar refresco de datos
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simular un refresco de datos
    setTimeout(() => {
      // Simplemente actualizar la lista con los mismos datos (en una app real, esto haría una llamada a la API)
      setTherapists([...STATIC_THERAPISTS]);
      setIsRefreshing(false);
    }, 800);
  };

  // Obtener el color del rol
  const getRoleColor = (role) => {
    switch(role) {
      case 'PT': return '#36D1DC';
      case 'PTA': return '#5B86E5';
      case 'OT': return '#FF9966';
      case 'COTA': return '#FF5E62';
      case 'ST': return '#56CCF2';
      case 'STA': return '#2F80ED';
      default: return '#64B5F6';
    }
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="therapist-earnings-section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="therapist-earnings-header">
        <h2>
          <i className="fas fa-user-md"></i>
          Therapist Earnings
        </h2>
        <div className="therapist-period-badge">
          <i className="fas fa-calendar-alt"></i>
          <span>Period: {selectedPeriod?.period}</span>
        </div>
      </div>
      
      <div className="therapist-earnings-filters">
        <div className="therapist-earnings-search">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search therapist by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button 
                className="therapist-earnings-clear-search" 
                onClick={() => setSearchTerm('')}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <i className="fas fa-times"></i>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <div className="therapist-earnings-filter-controls">
          <div className="therapist-earnings-filter-group">
            <label>Role:</label>
            <div className="therapist-earnings-select-wrapper">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          
          <div className="therapist-earnings-filter-group">
            <label>Status:</label>
            <div className="therapist-earnings-select-wrapper">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
        
        <div className="therapist-earnings-actions">
          <AnimatePresence>
            {selectedRows.length > 0 && (
              <motion.div 
                className="therapist-earnings-batch-actions"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button 
                  className="therapist-earnings-action-button verify-selected"
                  onClick={verifySelectedPayments}
                >
                  <i className="fas fa-check-circle"></i>
                  <span>Verify Selected ({selectedRows.length})</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            className={`therapist-earnings-action-button refresh ${isRefreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <i className="fas fa-sync-alt"></i>
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
      
      <div className="therapist-earnings-table-container">
        {filteredTherapists.length > 0 ? (
          <table className="therapist-earnings-table">
            <thead>
              <tr>
                <th className="therapist-earnings-select-column">
                  <div className="therapist-earnings-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="select-all" 
                      checked={selectAll}
                      onChange={handleSelectAll} 
                    />
                    <label htmlFor="select-all" className="therapist-earnings-checkbox-custom">
                      <i className="fas fa-check"></i>
                    </label>
                  </div>
                </th>
                <th>Therapist</th>
                <th 
                  className="therapist-earnings-sortable"
                  onClick={() => requestSort('visits')}
                >
                  Visits
                  <i className={getSortIndicator('visits')}></i>
                </th>
                <th 
                  className="therapist-earnings-sortable"
                  onClick={() => requestSort('earnings')}
                >
                  Earnings
                  <i className={getSortIndicator('earnings')}></i>
                </th>
                <th 
                  className="therapist-earnings-sortable"
                  onClick={() => requestSort('growth')}
                >
                  Growth
                  <i className={getSortIndicator('growth')}></i>
                </th>
                <th 
                  className="therapist-earnings-sortable"
                  onClick={() => requestSort('completionRate')}
                >
                  Completion Rate
                  <i className={getSortIndicator('completionRate')}></i>
                </th>
                <th>Status</th>
                <th className="therapist-earnings-actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTherapists.map((therapist) => {
                const isSelected = selectedRows.includes(therapist.id);
                
                return (
                  <tr 
                    key={therapist.id}
                    className={isSelected ? 'therapist-earnings-selected-row' : ''}
                  >
                    <td className="therapist-earnings-select-column">
                      <div className="therapist-earnings-checkbox-wrapper">
                        <input
                          type="checkbox"
                          id={`select-row-${therapist.id}`}
                          checked={isSelected}
                          onChange={() => handleRowSelect(therapist.id)}
                        />
                        <label htmlFor={`select-row-${therapist.id}`} className="therapist-earnings-checkbox-custom">
                          <i className="fas fa-check"></i>
                        </label>
                      </div>
                    </td>
                    <td className="therapist-earnings-therapist-info">
                      <div className="therapist-earnings-therapist-avatar">
                        <div 
                          className="therapist-earnings-avatar-placeholder"
                          style={{ borderColor: getRoleColor(therapist.role) }}
                        >
                          {therapist.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div 
                          className="therapist-earnings-role-indicator"
                          style={{ backgroundColor: `${getRoleColor(therapist.role)}20`, color: getRoleColor(therapist.role) }}
                        >
                          {therapist.role}
                        </div>
                      </div>
                      <div className="therapist-earnings-therapist-details">
                        <div className="therapist-earnings-therapist-name">{therapist.name}</div>
                        <div className="therapist-earnings-patient-count">
                          <i className="fas fa-user-injured"></i>
                          <span>{therapist.patients ? therapist.patients.length : 0} patients</span>
                        </div>
                      </div>
                    </td>
                    <td className="therapist-earnings-visits-cell">
                      <div className="therapist-earnings-value-with-indicator">
                        <span className="therapist-earnings-primary-value">{therapist.visits}</span>
                        {therapist.pendingVisits > 0 && (
                          <span className="therapist-earnings-indicator pending-indicator" title={`${therapist.pendingVisits} pending visits`}>
                            +{therapist.pendingVisits}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="therapist-earnings-earnings-cell">
                      <div className="therapist-earnings-earnings-value">{formatCurrency(therapist.earnings)}</div>
                    </td>
                    <td className="therapist-earnings-growth-cell">
                      <div className={`therapist-earnings-growth-indicator ${therapist.growth > 0 ? 'positive' : therapist.growth < 0 ? 'negative' : 'neutral'}`}>
                        <i className={`fas fa-arrow-${therapist.growth > 0 ? 'up' : therapist.growth < 0 ? 'down' : 'right'}`}></i>
                        <span>{Math.abs(therapist.growth)}%</span>
                      </div>
                    </td>
                    <td className="therapist-earnings-completion-cell">
                      <div className="therapist-earnings-completion-wrapper">
                        <div className="therapist-earnings-completion-bar">
                          <div 
                            className="therapist-earnings-completion-progress"
                            style={{ width: `${therapist.completionRate}%` }}
                          ></div>
                        </div>
                        <div className="therapist-earnings-completion-value">{therapist.completionRate}%</div>
                      </div>
                    </td>
                    <td className="therapist-earnings-status-cell">
                      <div className={`therapist-earnings-status-badge ${therapist.status}`}>
                        <i className={`fas ${therapist.status === 'verified' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                        <span>{therapist.status === 'verified' ? 'Verified' : 'Pending'}</span>
                      </div>
                    </td>
                    <td className="therapist-earnings-actions-cell">
                      <button 
                        className="therapist-earnings-view-details-btn"
                        onClick={() => onTherapistClick(therapist)}
                      >
                        <i className="fas fa-file-invoice-dollar"></i>
                        <span>Details</span>
                      </button>
                      {therapist.status === 'pending' && (
                        <button 
                          className="therapist-earnings-verify-btn"
                          onClick={() => {
                            onVerifyPayment(therapist.id);
                            // Actualizar también el estado local
                            setTherapists(prevTherapists => 
                              prevTherapists.map(t => 
                                t.id === therapist.id 
                                  ? { ...t, status: 'verified' } 
                                  : t
                              )
                            );
                          }}
                          title="Verify Payment"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="therapist-earnings-no-results">
            <div className="therapist-earnings-no-results-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No therapists found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              className="therapist-earnings-reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
            >
              <i className="fas fa-undo"></i>
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
      
      {filteredTherapists.length > 0 && (
        <div className="therapist-earnings-summary">
          <div className="therapist-earnings-summary-stat">
            <div className="therapist-earnings-stat-title">Total Earnings</div>
            <div className="therapist-earnings-stat-value">
              {formatCurrency(stats.totalEarnings)}
            </div>
          </div>
          <div className="therapist-earnings-summary-stat">
            <div className="therapist-earnings-stat-title">Total Visits</div>
            <div className="therapist-earnings-stat-value">
              {stats.totalVisits}
            </div>
          </div>
          <div className="therapist-earnings-summary-stat">
            <div className="therapist-earnings-stat-title">Avg. Completion Rate</div>
            <div className="therapist-earnings-stat-value">
              {stats.avgCompletionRate}%
            </div>
          </div>
          <div className="therapist-earnings-summary-stat">
            <div className="therapist-earnings-stat-title">Pending Verification</div>
            <div className="therapist-earnings-stat-value">
              {stats.pendingVerification}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TherapistEarnings;