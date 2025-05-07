import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../styles/developer/accounting/TherapistFinancialList.scss';

const DevTherapistFinancialList = ({ therapists, onTherapistClick, selectedPeriod }) => {
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'earnings', direction: 'desc' });
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [growthFilter, setGrowthFilter] = useState('all');
  const [animatedItems, setAnimatedItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const tableRef = useRef(null);
  
  // Efecto para aplicar filtros y ordenamiento
  useEffect(() => {
    setIsLoading(true);
    let result = [...therapists];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(therapist => 
        therapist.name.toLowerCase().includes(lowercasedSearch) ||
        therapist.role.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Aplicar filtro de rol
    if (roleFilter !== 'all') {
      result = result.filter(therapist => therapist.role === roleFilter);
    }
    
    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      result = result.filter(therapist => therapist.status === statusFilter);
    }
    
    // Aplicar filtro de crecimiento
    if (growthFilter !== 'all') {
      switch (growthFilter) {
        case 'positive':
          result = result.filter(therapist => therapist.growth > 0);
          break;
        case 'negative':
          result = result.filter(therapist => therapist.growth < 0);
          break;
        case 'neutral':
          result = result.filter(therapist => therapist.growth === 0);
          break;
      }
    }
    
    // Aplicar ordenamiento
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Simular carga de datos para mostrar efectos de carga
    setTimeout(() => {
      setFilteredTherapists(result);
      setIsLoading(false);
      
      // Animación escalonada de entrada
      const timer = setTimeout(() => {
        setAnimatedItems(result.map(t => t.id));
      }, 100);
      
      return () => clearTimeout(timer);
    }, 300);
  }, [therapists, searchTerm, sortConfig, roleFilter, statusFilter, growthFilter]);
  
  // Efecto para manejar selección de todo cuando cambia el filtro
  useEffect(() => {
    if (selectAll) {
      setSelectedRows(filteredTherapists.map(t => t.id));
    } else if (selectedRows.length === filteredTherapists.length) {
      // Si todos están seleccionados pero no por el toggle, actualizar el estado del toggle
      setSelectAll(true);
    }
  }, [filteredTherapists]);
  
  // Función para cambiar ordenamiento con efectos visuales
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Función para obtener clase para título de columna ordenable
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return 'fas fa-sort';
    }
    return sortConfig.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  };
  
  // Función para calcular porcentaje de progreso visual
  const calculateProgressPercentage = (value, max = 100) => {
    return Math.min(Math.max((value / max) * 100, 0), 100);
  };
  
  // Función para formatear valor monetario
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value);
  };
  
  // Manejar selección de fila
  const handleRowSelect = (id) => {
    setSelectedRows(prevSelectedRows => {
      const isSelected = prevSelectedRows.includes(id);
      const newSelectedRows = isSelected
        ? prevSelectedRows.filter(rowId => rowId !== id)
        : [...prevSelectedRows, id];
      
      // Verificar si todos están seleccionados
      setSelectAll(newSelectedRows.length === filteredTherapists.length);
      
      return newSelectedRows;
    });
  };
  
  // Manejar selección de todas las filas
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(!selectAll ? filteredTherapists.map(t => t.id) : []);
  };
  
  // Verificar si una fila está seleccionada
  const isRowSelected = (id) => selectedRows.includes(id);
  
  // Obtener roles disponibles para el filtro
  const availableRoles = ['all', ...new Set(therapists.map(t => t.role))];
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };
  
  // Opciones para el filtro de crecimiento
  const growthOptions = [
    { value: 'all', label: 'All Growth' },
    { value: 'positive', label: 'Positive Growth' },
    { value: 'negative', label: 'Negative Growth' },
    { value: 'neutral', label: 'Neutral Growth' }
  ];

  return (
    <motion.div 
      className="therapist-financial-list"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Barra de filtros mejorada */}
      <div className="list-filters">
        <div className="search-filter">
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
                className="clear-search" 
                onClick={() => setSearchTerm('')}
                title="Clear search"
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
        
        <div className="dropdown-filters">
          <div className="filter-group">
            <label>Role:</label>
            <div className="select-wrapper">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                {availableRoles.filter(role => role !== 'all').map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <div className="select-wrapper">
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
          
          <div className="filter-group">
            <label>Growth:</label>
            <div className="select-wrapper">
              <select 
                value={growthFilter}
                onChange={(e) => setGrowthFilter(e.target.value)}
              >
                {growthOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
        
        <div className="list-actions">
          <button className="export-btn">
            <i className="fas fa-file-export"></i>
            <span>Export</span>
          </button>
          <button 
            className="refresh-btn"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 600);
            }}
          >
            <i className="fas fa-sync-alt"></i>
            <span>Refresh</span>
          </button>
          
          <AnimatePresence>
            {selectedRows.length > 0 && (
              <motion.div 
                className="batch-actions"
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: 'auto', marginLeft: 8 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button className="batch-action verify-selected">
                  <i className="fas fa-check-circle"></i>
                  <span>Verify Selected</span>
                </button>
                <button className="batch-action clear-selected" onClick={() => setSelectedRows([])}>
                  <i className="fas fa-times"></i>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Lista de terapeutas mejorada */}
      <div className="therapists-table-container" ref={tableRef}>
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading therapist data...</p>
          </div>
        ) : filteredTherapists.length > 0 ? (
          <table className="therapists-table">
            <thead>
              <tr>
                <th className="select-column">
                  <div className="checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="select-all" 
                      checked={selectAll} 
                      onChange={handleSelectAll} 
                    />
                    <label htmlFor="select-all" className="checkbox-custom">
                      <i className="fas fa-check"></i>
                    </label>
                  </div>
                </th>
                <th>Therapist</th>
                <th 
                  className="sortable"
                  onClick={() => requestSort('visits')}
                >
                  Visits
                  <i className={getSortIndicator('visits')}></i>
                </th>
                <th 
                  className="sortable"
                  onClick={() => requestSort('earnings')}
                >
                  Earnings
                  <i className={getSortIndicator('earnings')}></i>
                </th>
                <th 
                  className="sortable"
                  onClick={() => requestSort('growth')}
                >
                  Growth
                  <i className={getSortIndicator('growth')}></i>
                </th>
                <th 
                  className="sortable"
                  onClick={() => requestSort('completionRate')}
                >
                  Completion Rate
                  <i className={getSortIndicator('completionRate')}></i>
                </th>
                <th>Status</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTherapists.map((therapist, index) => (
                <motion.tr 
                  key={therapist.id}
                  className={`${animatedItems.includes(therapist.id) ? 'animate-in' : ''} ${isRowSelected(therapist.id) ? 'selected-row' : ''}`}
                  style={{ '--animation-order': index }}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <td className="select-column">
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        id={`select-row-${therapist.id}`}
                        checked={isRowSelected(therapist.id)}
                        onChange={() => handleRowSelect(therapist.id)}
                      />
                      <label htmlFor={`select-row-${therapist.id}`} className="checkbox-custom">
                        <i className="fas fa-check"></i>
                      </label>
                    </div>
                  </td>
                  <td className="therapist-info">
                    <div className="therapist-avatar">
                      {therapist.avatar ? (
                        <img src={therapist.avatar} alt={therapist.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {therapist.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div className={`role-indicator ${therapist.role.toLowerCase()}`}>{therapist.role}</div>
                    </div>
                    <div className="therapist-details">
                      <div className="therapist-name">{therapist.name}</div>
                      <div className="patient-count">
                        <i className="fas fa-user-injured"></i>
                        <span>{therapist.patients ? therapist.patients.length : 0} patients</span>
                      </div>
                    </div>
                  </td>
                  <td className="visits-cell">
                    <div className="value-with-indicator">
                      <span className="primary-value">{therapist.visits}</span>
                      {therapist.pendingVisits > 0 && (
                        <span className="indicator pending-indicator" title={`${therapist.pendingVisits} pending visits`}>
                          +{therapist.pendingVisits}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="earnings-cell">
                    <div className="earnings-value">{formatCurrency(therapist.earnings)}</div>
                  </td>
                  <td className="growth-cell">
                    <div className={`growth-indicator ${therapist.growth > 0 ? 'positive' : therapist.growth < 0 ? 'negative' : 'neutral'}`}>
                      <i className={`fas fa-arrow-${therapist.growth > 0 ? 'up' : therapist.growth < 0 ? 'down' : 'right'}`}></i>
                      <span>{Math.abs(therapist.growth)}%</span>
                    </div>
                  </td>
                  <td className="completion-cell">
                    <div className="completion-wrapper">
                      <div className="completion-bar">
                        <div 
                          className="completion-progress"
                          style={{ width: `${calculateProgressPercentage(therapist.completionRate)}%` }}
                        ></div>
                      </div>
                      <div className="completion-value">{therapist.completionRate}%</div>
                    </div>
                  </td>
                  <td className="status-cell">
                    <div className={`status-badge ${therapist.status}`}>
                      <i className={`fas ${therapist.status === 'verified' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                      <span>{therapist.status === 'verified' ? 'Verified' : 'Pending'}</span>
                    </div>
                  </td>
                  <td className="actions-cell">
                    <motion.button 
                      className="view-details-btn"
                      onClick={() => onTherapistClick(therapist)}
                      whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0, 229, 255, 0.3)" }}
                      whileTap={{ y: 0 }}
                    >
                      <i className="fas fa-file-invoice-dollar"></i>
                      <span>Details</span>
                    </motion.button>
                    <motion.button 
                      className="action-btn print"
                      whileHover={{ y: -2, backgroundColor: "rgba(41, 121, 255, 0.2)" }}
                      whileTap={{ y: 0 }}
                    >
                      <i className="fas fa-print"></i>
                    </motion.button>
                    <motion.button 
                      className="action-btn verify"
                      whileHover={{ y: -2, backgroundColor: "rgba(76, 175, 80, 0.2)" }}
                      whileTap={{ y: 0 }}
                    >
                      <i className="fas fa-check"></i>
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <motion.div 
            className="no-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="no-results-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No therapists found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
                setGrowthFilter('all');
              }}
            >
              <i className="fas fa-undo"></i>
              <span>Reset All Filters</span>
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Resumen de filtros y resultados mejorado */}
      {filteredTherapists.length > 0 && (
        <div className="results-summary">
          <div className="summary-text">
            <div className="results-count">
              <strong>{filteredTherapists.length}</strong> of <strong>{therapists.length}</strong> therapists
            </div>
            
            <AnimatePresence>
              {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || growthFilter !== 'all') && (
                <motion.div 
                  className="active-filters"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <span className="filters-label">Active filters: </span>
                  {searchTerm && (
                    <div className="filter-pill search">
                      <i className="fas fa-search"></i>
                      <span>{searchTerm}</span>
                      <button onClick={() => setSearchTerm('')}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                  
                  {roleFilter !== 'all' && (
                    <div className="filter-pill role">
                      <i className="fas fa-user-md"></i>
                      <span>{roleFilter}</span>
                      <button onClick={() => setRoleFilter('all')}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                  
                  {statusFilter !== 'all' && (
                    <div className="filter-pill status">
                      <i className={`fas ${statusFilter === 'verified' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                      <span>{statusFilter === 'verified' ? 'Verified' : 'Pending'}</span>
                      <button onClick={() => setStatusFilter('all')}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                  
                  {growthFilter !== 'all' && (
                    <div className="filter-pill growth">
                      <i className={`fas ${
                        growthFilter === 'positive' 
                          ? 'fa-arrow-up' 
                          : growthFilter === 'negative' 
                            ? 'fa-arrow-down' 
                            : 'fa-arrow-right'
                      }`}></i>
                      <span>{growthOptions.find(o => o.value === growthFilter)?.label}</span>
                      <button onClick={() => setGrowthFilter('all')}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                  
                  <button 
                    className="clear-filters"
                    onClick={() => {
                      setSearchTerm('');
                      setRoleFilter('all');
                      setStatusFilter('all');
                      setGrowthFilter('all');
                    }}
                  >
                    <i className="fas fa-times"></i>
                    <span>Clear all</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {selectedPeriod && (
            <div className="period-reminder">
              <i className="fas fa-calendar-alt"></i>
              <span>Data for period: <strong>{selectedPeriod.period}</strong></span>
            </div>
          )}
          
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="pagination-info">Page 1 of 1</div>
            <button className="pagination-btn" disabled>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
      
      {/* Estadísticas totales */}
      {filteredTherapists.length > 0 && (
        <div className="summary-statistics">
          <div className="summary-stat">
            <div className="stat-title">Total Earnings</div>
            <div className="stat-value">
              {formatCurrency(filteredTherapists.reduce((sum, t) => sum + t.earnings, 0))}
            </div>
          </div>
          <div className="summary-stat">
            <div className="stat-title">Total Visits</div>
            <div className="stat-value">
              {filteredTherapists.reduce((sum, t) => sum + t.visits, 0)}
            </div>
          </div>
          <div className="summary-stat">
            <div className="stat-title">Avg. Completion Rate</div>
            <div className="stat-value">
              {Math.round(filteredTherapists.reduce((sum, t) => sum + t.completionRate, 0) / filteredTherapists.length)}%
            </div>
          </div>
          <div className="summary-stat">
            <div className="stat-title">Pending Verification</div>
            <div className="stat-value">
              {filteredTherapists.filter(t => t.status === 'pending').length}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DevTherapistFinancialList;