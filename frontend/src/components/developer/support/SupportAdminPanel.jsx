import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/developer/support/SupportAdminPanel.scss';
import { useAuth } from '../../login/AuthContext';

// Componente principal del panel de administración de soporte técnico
const SupportAdminPanel = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [ticketsStats, setTicketsStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    high: 0,
    responseTime: '30 min'
  });
  
  // Verificar si el usuario tiene permisos para acceder a esta página
  useEffect(() => {
    const userRole = currentUser?.role || '';
    if (!userRole.includes('Administrator') && !userRole.includes('Developer') && !userRole.includes('Support')) {
      navigate('/unauthorized');
      return;
    }
    
    // Simulación de carga de datos
    const loadData = async () => {
      // Simulación de llamada a API para obtener tickets
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Datos simulados para desarrollo
      const mockTickets = generateMockTickets(50);
      const mockTeamMembers = generateMockTeamMembers();
      
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setTeamMembers(mockTeamMembers);
      calculateTicketStats(mockTickets);
      setIsLoaded(true);
    };
    
    loadData();
  }, [currentUser, navigate]);
  
  // Actualizar tickets filtrados cuando cambian los filtros
  useEffect(() => {
    filterTickets();
  }, [selectedCategory, selectedStatus, selectedPriority, searchQuery, tickets]);
  
  // Función para generar tickets de prueba
  const generateMockTickets = (count) => {
    const categories = ['access', 'patients', 'billing', 'technical', 'feature'];
    const statuses = ['new', 'assigned', 'in_progress', 'resolved', 'closed'];
    const priorities = ['critical', 'high', 'medium', 'low'];
    const titles = [
      'Cannot log in to system', 
      'Patient data not showing correctly',
      'Billing export fails',
      'System crash on report generation',
      'Need to merge duplicate patient records',
      'Slow performance on patient search',
      'Payment gateway integration error',
      'New feature request: calendar sync',
      'Password reset not working',
      'Error when printing invoices'
    ];
    
    return Array.from({ length: count }, (_, i) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      // Crear fecha aleatoria en los últimos 30 días
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      return {
        id: `TS-${100000 + i}`,
        title,
        category,
        subcategory: getSubcategoryForCategory(category),
        status,
        priority,
        userId: `USER-${1000 + Math.floor(Math.random() * 100)}`,
        userName: getRandomName(),
        userEmail: `user${1000 + Math.floor(Math.random() * 100)}@example.com`,
        assignedTo: status === 'new' ? null : getRandomAssignee(),
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        description: `This is a sample description for ticket ${i + 1}. It contains details about the issue the user is experiencing. This would be much longer in a real ticket.`,
        messages: generateRandomMessages(Math.floor(Math.random() * 5)),
        attachments: Math.random() > 0.7 ? generateRandomAttachments() : []
      };
    });
  };
  
  // Generar subcategoría basada en la categoría
  const getSubcategoryForCategory = (category) => {
    const subcategories = {
      access: ['login', 'permissions', 'password'],
      patients: ['patient-data', 'records-removal', 'merge-records'],
      billing: ['payment-issue', 'invoice', 'subscription'],
      technical: ['error', 'performance', 'compatibility'],
      feature: ['new-feature', 'enhancement', 'integration']
    };
    
    const options = subcategories[category] || ['general'];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  // Generar nombre aleatorio para tickets de prueba
  const getRandomName = () => {
    const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava', 'David', 'Isabella'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  };
  
  // Generar asignado aleatorio
  const getRandomAssignee = () => {
    const assignees = ['javier.vargas', 'maria.tech', 'support.admin', 'dev.team'];
    return assignees[Math.floor(Math.random() * assignees.length)];
  };
  
  // Generar mensajes aleatorios para la conversación de tickets
  const generateRandomMessages = (count) => {
    const messages = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      // Simular mensajes en diferentes momentos
      const messageDate = new Date(now);
      messageDate.setHours(now.getHours() - (count - i) * 2);
      
      messages.push({
        id: `msg-${Date.now()}-${i}`,
        sender: i % 2 === 0 ? 'user' : 'support',
        senderName: i % 2 === 0 ? 'Cliente' : 'Soporte Técnico',
        message: i % 2 === 0 
          ? 'Estoy teniendo problemas con esta función. ¿Pueden ayudarme a solucionarlo lo antes posible?'
          : 'Estamos revisando su problema. ¿Podría proporcionarnos más detalles sobre los pasos para reproducir el error?',
        timestamp: messageDate.toISOString(),
        read: true
      });
    }
    
    return messages;
  };
  
  // Generar archivos adjuntos aleatorios
  const generateRandomAttachments = () => {
    const fileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    const fileNames = ['screenshot.jpg', 'error_log.txt', 'report.pdf', 'system_info.png'];
    
    return Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
      const type = fileTypes[Math.floor(Math.random() * fileTypes.length)];
      const name = fileNames[Math.floor(Math.random() * fileNames.length)];
      
      return {
        id: `file-${Date.now()}-${i}`,
        name,
        type,
        size: Math.floor(Math.random() * 5000000), // Tamaño aleatorio hasta 5MB
        url: '#'
      };
    });
  };
  
  // Generar miembros del equipo de soporte
  const generateMockTeamMembers = () => {
    return [
      {
        id: 'javier.vargas',
        name: 'Javier Vargas',
        role: 'Support Lead',
        avatar: null,
        activeTickets: 5,
        status: 'online'
      },
      {
        id: 'maria.tech',
        name: 'María López',
        role: 'Technical Support',
        avatar: null,
        activeTickets: 8,
        status: 'busy'
      },
      {
        id: 'support.admin',
        name: 'Carlos Rodríguez',
        role: 'Support Admin',
        avatar: null,
        activeTickets: 3,
        status: 'online'
      },
      {
        id: 'dev.team',
        name: 'Ana García',
        role: 'Developer',
        avatar: null,
        activeTickets: 2,
        status: 'away'
      }
    ];
  };
  
  // Calcular estadísticas de tickets
  const calculateTicketStats = (ticketData) => {
    const stats = {
      total: ticketData.length,
      open: ticketData.filter(t => t.status === 'new').length,
      inProgress: ticketData.filter(t => ['assigned', 'in_progress'].includes(t.status)).length,
      resolved: ticketData.filter(t => ['resolved', 'closed'].includes(t.status)).length,
      critical: ticketData.filter(t => t.priority === 'critical').length,
      high: ticketData.filter(t => t.priority === 'high').length,
      responseTime: '30 min'
    };
    
    setTicketsStats(stats);
  };
  
  // Filtrar tickets según los criterios seleccionados
  const filterTickets = () => {
    let filtered = [...tickets];
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === selectedCategory);
    }
    
    // Filtrar por estado
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === selectedStatus);
    }
    
    // Filtrar por prioridad
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === selectedPriority);
    }
    
    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query) ||
        ticket.userName.toLowerCase().includes(query) ||
        ticket.userEmail.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredTickets(filtered);
  };
  
  // Cambiar vista actual
  const handleViewChange = (view) => {
    setActiveView(view);
    if (view !== 'ticket-detail') {
      setSelectedTicket(null);
      setIsTicketDetailOpen(false);
    }
  };
  
  // Seleccionar un ticket para ver detalles
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDetailOpen(true);
    setActiveView('ticket-detail');
  };
  
  // Actualizar estado de un ticket
  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus, updatedAt: new Date().toISOString() });
    }
  };
  
  // Asignar ticket a un miembro del equipo
  const handleAssignTicket = (ticketId, assigneeId) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { 
          ...ticket, 
          assignedTo: assigneeId, 
          status: ticket.status === 'new' ? 'assigned' : ticket.status,
          updatedAt: new Date().toISOString() 
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        assignedTo: assigneeId,
        status: selectedTicket.status === 'new' ? 'assigned' : selectedTicket.status,
        updatedAt: new Date().toISOString()
      });
    }
  };
  
  // Añadir un mensaje a un ticket
  const handleAddMessage = (ticketId, message) => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'support',
      senderName: 'Soporte Técnico',
      message,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          updatedAt: new Date().toISOString(),
          status: ticket.status === 'new' ? 'in_progress' : ticket.status
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
        updatedAt: new Date().toISOString(),
        status: selectedTicket.status === 'new' ? 'in_progress' : selectedTicket.status
      });
    }
  };
  
  // Renderizar diferentes vistas según el estado activo
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView stats={ticketsStats} tickets={filteredTickets} onSelectTicket={handleSelectTicket} />;
      case 'tickets':
        return <TicketsView tickets={filteredTickets} onSelectTicket={handleSelectTicket} />;
      case 'team':
        return <TeamView members={teamMembers} />;
      case 'ticket-detail':
        return (
          <TicketDetailView 
            ticket={selectedTicket} 
            onUpdateStatus={handleUpdateTicketStatus}
            onAssign={handleAssignTicket}
            onAddMessage={handleAddMessage}
            onClose={() => handleViewChange('tickets')}
            teamMembers={teamMembers}
          />
        );
      default:
        return <DashboardView stats={ticketsStats} tickets={filteredTickets} onSelectTicket={handleSelectTicket} />;
    }
  };
  
  // Obtener el título de la página según la vista activa
  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Panel de Control';
      case 'tickets': return 'Gestión de Tickets';
      case 'team': return 'Equipo de Soporte';
      case 'ticket-detail': return `Ticket ${selectedTicket?.id || ''}`;
      default: return 'Panel de Control';
    }
  };
  
  return (
    <div className={`support-admin-panel ${isLoaded ? 'loaded' : ''}`}>
      {/* Barra de navegación lateral */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="support-logo">
            <i className="fas fa-headset"></i>
            <span>TherapySync</span>
          </div>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-section">
            <div className="menu-title">Principal</div>
            <ul className="menu-items">
              <li 
                className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleViewChange('dashboard')}
              >
                <div className="menu-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <span className="menu-text">Panel de Control</span>
              </li>
              <li 
                className={`menu-item ${activeView === 'tickets' ? 'active' : ''}`}
                onClick={() => handleViewChange('tickets')}
              >
                <div className="menu-icon">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <span className="menu-text">Tickets</span>
                <div className="menu-badge">{tickets.filter(t => t.status === 'new').length}</div>
              </li>
              <li 
                className={`menu-item ${activeView === 'team' ? 'active' : ''}`}
                onClick={() => handleViewChange('team')}
              >
                <div className="menu-icon">
                  <i className="fas fa-users"></i>
                </div>
                <span className="menu-text">Equipo</span>
              </li>
            </ul>
          </div>
          
          <div className="menu-section">
            <div className="menu-title">Categorías</div>
            <ul className="menu-items">
              <li 
                className={`menu-item ${selectedCategory === 'access' ? 'active' : ''}`}
                onClick={() => {setSelectedCategory('access'); handleViewChange('tickets');}}
              >
                <div className="menu-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <span className="menu-text">Cuenta & Acceso</span>
              </li>
              <li 
                className={`menu-item ${selectedCategory === 'patients' ? 'active' : ''}`}
                onClick={() => {setSelectedCategory('patients'); handleViewChange('tickets');}}
              >
                <div className="menu-icon">
                  <i className="fas fa-user-injured"></i>
                </div>
                <span className="menu-text">Pacientes</span>
              </li>
              <li 
                className={`menu-item ${selectedCategory === 'billing' ? 'active' : ''}`}
                onClick={() => {setSelectedCategory('billing'); handleViewChange('tickets');}}
              >
                <div className="menu-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <span className="menu-text">Facturación</span>
              </li>
              <li 
                className={`menu-item ${selectedCategory === 'technical' ? 'active' : ''}`}
                onClick={() => {setSelectedCategory('technical'); handleViewChange('tickets');}}
              >
                <div className="menu-icon">
                  <i className="fas fa-tools"></i>
                </div>
                <span className="menu-text">Soporte Técnico</span>
              </li>
              <li 
                className={`menu-item ${selectedCategory === 'feature' ? 'active' : ''}`}
                onClick={() => {setSelectedCategory('feature'); handleViewChange('tickets');}}
              >
                <div className="menu-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <span className="menu-text">Solicitudes</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-details">
              <div className="user-name">{currentUser?.name || 'Admin'}</div>
              <div className="user-role">{currentUser?.role || 'Developer'}</div>
            </div>
          </div>
          <div className="sidebar-actions">
            <button className="action-button" onClick={() => navigate('/')}>
              <i className="fas fa-home"></i>
            </button>
            <button className="action-button" onClick={() => navigate('/settings')}>
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="main-content">
        {/* Cabecera */}
        <div className="content-header">
          <div className="page-title">
            <h1>{getPageTitle()}</h1>
            <div className="breadcrumbs">
              <span>Soporte</span>
              <i className="fas fa-chevron-right"></i>
              <span>{getPageTitle()}</span>
            </div>
          </div>
          
          <div className="header-actions">
            {activeView !== 'ticket-detail' && (
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Buscar tickets..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="search-icon">
                  <i className="fas fa-search"></i>
                </div>
                {searchQuery && (
                  <button className="clear-search" onClick={() => setSearchQuery('')}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            )}
            
            {activeView === 'tickets' && (
              <div className="filter-actions">
                <div className="filter-dropdown">
                  <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="new">Nuevos</option>
                    <option value="assigned">Asignados</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="resolved">Resueltos</option>
                    <option value="closed">Cerrados</option>
                  </select>
                </div>
                
                <div className="filter-dropdown">
                  <select 
                    value={selectedPriority} 
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Todas las prioridades</option>
                    <option value="critical">Crítica</option>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Área de contenido */}
        <div className="content-area">
          {isLoaded ? (
            renderView()
          ) : (
            <div className="loading-content">
              <div className="loader">
                <div className="loader-spinner"></div>
              </div>
              <p>Cargando datos de soporte...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de la vista del Panel de Control
const DashboardView = ({ stats, tickets, onSelectTicket }) => {
  // Obtener los tickets más recientes para mostrar
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  // Obtener tickets críticos
  const criticalTickets = [...tickets]
    .filter(ticket => ticket.priority === 'critical' && !['resolved', 'closed'].includes(ticket.status))
    .slice(0, 3);
  
  return (
    <div className="dashboard-view">
      {/* Estadísticas */}
      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-value">{stats.total}</div>
            <div className="stats-label">Total Tickets</div>
          </div>
          <div className="stats-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="stats-chart">
            {/* Aquí podría ir un mini gráfico */}
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-value">{stats.open}</div>
            <div className="stats-label">Nuevos</div>
          </div>
          <div className="stats-icon new">
            <i className="fas fa-inbox"></i>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-value">{stats.inProgress}</div>
            <div className="stats-label">En Progreso</div>
          </div>
          <div className="stats-icon progress">
            <i className="fas fa-spinner"></i>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-value">{stats.resolved}</div>
            <div className="stats-label">Resueltos</div>
          </div>
          <div className="stats-icon resolved">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-value">{stats.critical}</div>
            <div className="stats-label">Críticos</div>
          </div>
          <div className="stats-icon critical">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-value">{stats.responseTime}</div>
            <div className="stats-label">Tiempo Promedio</div>
          </div>
          <div className="stats-icon time">
            <i className="fas fa-clock"></i>
          </div>
        </div>
      </div>
      
      {/* Alertas de prioridad alta */}
      {criticalTickets.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Alertas Críticas</h2>
            <div className="section-actions">
              <button className="section-action">
                Ver Todas <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
          
          <div className="critical-alerts">
            {criticalTickets.map(ticket => (
              <div key={ticket.id} className="critical-alert-card" onClick={() => onSelectTicket(ticket)}>
                <div className="alert-indicator"></div>
                <div className="alert-content">
                  <div className="alert-title">
                    <span className="alert-id">{ticket.id}</span>
                    {ticket.title}
                  </div>
                  <div className="alert-meta">
                    <span className="alert-user">
                      <i className="fas fa-user"></i> {ticket.userName}
                    </span>
                    <span className="alert-time">
                      <i className="fas fa-clock"></i> {formatTimeAgo(ticket.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="alert-action">
                  <button className="view-button">
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
              </div>
            ))}
            
            {criticalTickets.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <p>No hay tickets críticos pendientes</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Tickets Recientes */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Tickets Recientes</h2>
        </div>
        
        <div className="tickets-table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Asunto</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Tiempo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map(ticket => (
                <tr key={ticket.id} onClick={() => onSelectTicket(ticket)}>
                  <td className="ticket-id">{ticket.id}</td>
                  <td className="ticket-title">
                    <div className="ticket-title-text">{ticket.title}</div>
                  </td>
                  <td className="ticket-user">
                    <div className="user-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="user-info">
                      <div className="user-name">{ticket.userName}</div>
                      <div className="user-email">{ticket.userEmail}</div>
                    </div>
                  </td>
                  <td className="ticket-status">
                    <div className={`status-badge ${ticket.status}`}>
                      {formatStatus(ticket.status)}
                    </div>
                  </td>
                  <td className="ticket-priority">
                    <div className={`priority-indicator ${ticket.priority}`}>
                      {formatPriority(ticket.priority)}
                    </div>
                  </td>
                  <td className="ticket-time">
                    {formatTimeAgo(ticket.createdAt)}
                  </td>
                  <td className="ticket-actions">
                    <button className="action-button" onClick={(e) => { e.stopPropagation(); onSelectTicket(ticket); }}>
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
              
              {recentTickets.length === 0 && (
                <tr className="empty-row">
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <i className="fas fa-inbox"></i>
                      </div>
                      <p>No hay tickets recientes</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Sección para gráficas o métricas adicionales */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Distribución de Tickets</h3>
          </div>
          <div className="chart-content">
            <div className="chart-placeholder">
              <div className="chart-illustration">
                <i className="fas fa-chart-pie"></i>
              </div>
              <p>Aquí se mostraría una gráfica de distribución de tickets por categoría</p>
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          <div className="chart-header">
            <h3>Tiempos de Respuesta</h3>
          </div>
          <div className="chart-content">
            <div className="chart-placeholder">
              <div className="chart-illustration">
                <i className="fas fa-chart-line"></i>
              </div>
              <p>Aquí se mostraría una gráfica de tiempos de respuesta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de la vista de Tickets
const TicketsView = ({ tickets, onSelectTicket }) => {
  return (
    <div className="tickets-view">
      <div className="tickets-header">
        <div className="tickets-count">
          <span className="count-number">{tickets.length}</span>
          <span className="count-label">tickets totales</span>
        </div>
        
        <div className="tickets-filters">
          {/* Componentes de filtro adicionales podrían agregarse aquí */}
        </div>
      </div>
      
      <div className="tickets-table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asunto</th>
              <th>Usuario</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Fecha</th>
              <th>Asignado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} onClick={() => onSelectTicket(ticket)}>
                <td className="ticket-id">{ticket.id}</td>
                <td className="ticket-title">
                  <div className="ticket-title-text">{ticket.title}</div>
                  {ticket.messages.length > 0 && (
                    <div className="message-count">
                      <i className="fas fa-comment"></i> {ticket.messages.length}
                    </div>
                  )}
                  {ticket.attachments.length > 0 && (
                    <div className="attachment-indicator">
                      <i className="fas fa-paperclip"></i>
                    </div>
                  )}
                </td>
                <td className="ticket-user">
                  <div className="user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="user-name">{ticket.userName}</div>
                </td>
                <td className="ticket-category">
                  <div className={`category-badge ${ticket.category}`}>
                    {formatCategory(ticket.category)}
                  </div>
                </td>
                <td className="ticket-status">
                  <div className={`status-badge ${ticket.status}`}>
                    {formatStatus(ticket.status)}
                  </div>
                </td>
                <td className="ticket-priority">
                  <div className={`priority-indicator ${ticket.priority}`}>
                    {formatPriority(ticket.priority)}
                  </div>
                </td>
                <td className="ticket-date">
                  {formatDate(ticket.createdAt)}
                </td>
                <td className="ticket-assigned">
                  {ticket.assignedTo ? (
                    <div className="assigned-user">
                      <div className="user-avatar small">
                        <i className="fas fa-user-circle"></i>
                      </div>
                      <span>{formatAssignee(ticket.assignedTo)}</span>
                    </div>
                  ) : (
                    <div className="unassigned">No asignado</div>
                  )}
                </td>
                <td className="ticket-actions">
                  <button className="action-button" onClick={(e) => { e.stopPropagation(); onSelectTicket(ticket); }}>
                    <i className="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
            
            {tickets.length === 0 && (
              <tr className="empty-row">
                <td colSpan="9">
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <p>No se encontraron tickets que coincidan con los filtros</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente de la vista del Equipo
const TeamView = ({ members }) => {
  return (
    <div className="team-view">
      <div className="team-header">
        <h2>Equipo de Soporte</h2>
        <p>Gestiona los miembros del equipo y sus asignaciones</p>
      </div>
      
      <div className="team-cards">
        {members.map(member => (
          <div key={member.id} className="team-member-card">
            <div className="member-header">
              <div className="member-avatar">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
                <div className={`status-indicator ${member.status}`}></div>
              </div>
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <div className="member-role">{member.role}</div>
              </div>
            </div>
            
            <div className="member-stats">
              <div className="stat-item">
                <div className="stat-label">Tickets activos</div>
                <div className="stat-value">{member.activeTickets}</div>
              </div>
            </div>
            
            <div className="member-actions">
              <button className="member-action-button">
                Ver Tickets <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de la vista detallada de un Ticket
const TicketDetailView = ({ ticket, onUpdateStatus, onAssign, onAddMessage, onClose, teamMembers }) => {
  const [messageText, setMessageText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll hacia abajo cuando hay nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.messages]);
  
  if (!ticket) return null;
  
  // Manejar envío de nuevo mensaje
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    onAddMessage(ticket.id, messageText);
    setMessageText('');
    setIsReplying(false);
  };
  
  return (
    <div className="ticket-detail-view">
      <div className="ticket-detail-header">
        <button className="back-button" onClick={onClose}>
          <i className="fas fa-arrow-left"></i>
        </button>
        
        <div className="ticket-main-info">
          <div className="ticket-id-container">
            <span className="ticket-id">{ticket.id}</span>
            <div className={`status-badge ${ticket.status}`}>
              {formatStatus(ticket.status)}
            </div>
            <div className={`priority-indicator ${ticket.priority}`}>
              {formatPriority(ticket.priority)}
            </div>
          </div>
          <h2 className="ticket-title">{ticket.title}</h2>
        </div>
        
        <div className="ticket-actions-menu">
          <div className="dropdown">
            <button className="dropdown-toggle">
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => onUpdateStatus(ticket.id, 'resolved')}>
                <i className="fas fa-check"></i> Marcar como resuelto
              </button>
              <button className="dropdown-item" onClick={() => onUpdateStatus(ticket.id, 'closed')}>
                <i className="fas fa-times"></i> Cerrar ticket
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item">
                <i className="fas fa-print"></i> Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="ticket-detail-content">
        <div className="ticket-info-panel">
          <div className="info-section">
            <h3 className="section-title">Información del Ticket</h3>
            
            <div className="info-items">
              <div className="info-item">
                <div className="info-label">Categoría</div>
                <div className="info-value">
                  <div className={`category-badge ${ticket.category}`}>
                    {formatCategory(ticket.category)}
                  </div>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Subcategoría</div>
                <div className="info-value">
                  {formatSubcategory(ticket.subcategory)}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Creado</div>
                <div className="info-value">
                  {formatDate(ticket.createdAt)}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Última actualización</div>
                <div className="info-value">
                  {formatDate(ticket.updatedAt)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="info-section">
            <h3 className="section-title">Usuario</h3>
            
            <div className="user-card">
              <div className="user-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="user-details">
                <div className="user-name">{ticket.userName}</div>
                <div className="user-email">{ticket.userEmail}</div>
                <div className="user-id">ID: {ticket.userId}</div>
              </div>
            </div>
          </div>
          
          <div className="info-section">
            <h3 className="section-title">Asignación</h3>
            
            <div className="assignment-section">
              {ticket.assignedTo ? (
                <div className="assigned-user">
                  <div className="assigned-user-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="assigned-user-info">
                    <div className="assigned-user-name">
                      {formatAssignee(ticket.assignedTo)}
                    </div>
                    <div className="assigned-user-status">
                      <span className="status-dot active"></span> Activo
                    </div>
                  </div>
                  <div className="assigned-user-actions">
                    <div className="dropdown">
                      <button className="dropdown-toggle">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <div className="dropdown-menu">
                        <button className="dropdown-item">Reasignar</button>
                        <button className="dropdown-item" onClick={() => onAssign(ticket.id, null)}>
                          Quitar asignación
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="unassigned-section">
                  <p>Este ticket no está asignado</p>
                  <div className="assign-dropdown">
                    <select 
                      onChange={(e) => onAssign(ticket.id, e.target.value)}
                      className="assign-select"
                      value=""
                    >
                      <option value="" disabled>Asignar a un técnico</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {ticket.attachments.length > 0 && (
            <div className="info-section">
              <h3 className="section-title">Archivos Adjuntos</h3>
              
              <div className="attachments-list">
                {ticket.attachments.map(attachment => (
                  <div key={attachment.id} className="attachment-item">
                    <div className="attachment-icon">
                      <i className={getFileIcon(attachment.type)}></i>
                    </div>
                    <div className="attachment-details">
                      <div className="attachment-name">{attachment.name}</div>
                      <div className="attachment-size">{formatFileSize(attachment.size)}</div>
                    </div>
                    <div className="attachment-actions">
                      <button className="attachment-action">
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="ticket-conversation-panel">
          <div className="ticket-description">
            <div className="description-header">
              <h3>Descripción del Problema</h3>
              <span className="timestamp">{formatDate(ticket.createdAt)}</span>
            </div>
            <div className="description-content">
              <p>{ticket.description}</p>
            </div>
          </div>
          
          <div className="conversation-container">
            <div className="conversation-header">
              <h3>Conversación</h3>
              {ticket.messages.length > 0 && (
                <div className="message-count">{ticket.messages.length} mensajes</div>
              )}
            </div>
            
            <div className="messages-container">
              {ticket.messages.length > 0 ? (
                <div className="message-list">
                  {ticket.messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`message-item ${message.sender === 'user' ? 'user-message' : 'support-message'}`}
                    >
                      <div className="message-avatar">
                        <i className={`fas ${message.sender === 'user' ? 'fa-user' : 'fa-headset'}`}></i>
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <span className="message-sender">{message.senderName}</span>
                          <span className="message-time">{formatDate(message.timestamp)}</span>
                        </div>
                        <div className="message-text">
                          {message.message}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef}></div>
                </div>
              ) : (
                <div className="empty-messages">
                  <div className="empty-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <p>No hay mensajes en la conversación</p>
                </div>
              )}
            </div>
            
            <div className="reply-container">
              {isReplying ? (
                <div className="reply-form">
                  <div className="reply-input-container">
                    <textarea 
                      className="reply-input"
                      placeholder="Escribe una respuesta..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="reply-actions">
                    <button className="cancel-button" onClick={() => { setIsReplying(false); setMessageText(''); }}>
                      Cancelar
                    </button>
                    <button 
                      className="send-button"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <i className="fas fa-paper-plane"></i> Enviar
                    </button>
                  </div>
                </div>
              ) : (
                <button className="start-reply-button" onClick={() => setIsReplying(true)}>
                  <i className="fas fa-reply"></i> Responder
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Funciones de formateo para datos de tickets
const formatStatus = (status) => {
  const statusMap = {
    'new': 'Nuevo',
    'assigned': 'Asignado',
    'in_progress': 'En Progreso',
    'resolved': 'Resuelto',
    'closed': 'Cerrado'
  };
  
  return statusMap[status] || status;
};

const formatPriority = (priority) => {
  const priorityMap = {
    'critical': 'Crítica',
    'high': 'Alta',
    'medium': 'Media',
    'low': 'Baja'
  };
  
  return priorityMap[priority] || priority;
};

const formatCategory = (category) => {
  const categoryMap = {
    'access': 'Cuenta & Acceso',
    'patients': 'Pacientes',
    'billing': 'Facturación',
    'technical': 'Técnico',
    'feature': 'Solicitudes'
  };
  
  return categoryMap[category] || category;
};

const formatSubcategory = (subcategory) => {
  const subcategoryMap = {
    'login': 'Iniciar Sesión',
    'permissions': 'Permisos',
    'password': 'Contraseña',
    'patient-data': 'Datos de Pacientes',
    'records-removal': 'Eliminación de Registros',
    'merge-records': 'Fusionar Registros',
    'payment-issue': 'Problemas de Pago',
    'invoice': 'Facturas',
    'subscription': 'Suscripción',
    'error': 'Error de Sistema',
    'performance': 'Rendimiento',
    'compatibility': 'Compatibilidad',
    'new-feature': 'Nueva Funcionalidad',
    'enhancement': 'Mejora',
    'integration': 'Integración'
  };
  
  return subcategoryMap[subcategory] || subcategory;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return `${diffSecs} seg`;
  } else if (diffMins < 60) {
    return `${diffMins} min`;
  } else if (diffHours < 24) {
    return `${diffHours} h`;
  } else if (diffDays < 30) {
    return `${diffDays} d`;
  } else {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  }
};

const formatAssignee = (assigneeId) => {
  const assigneeMap = {
    'javier.vargas': 'Javier Vargas',
    'maria.tech': 'María López',
    'support.admin': 'Carlos Rodríguez',
    'dev.team': 'Ana García'
  };
  
  return assigneeMap[assigneeId] || assigneeId;
};

const getFileIcon = (fileType) => {
  if (fileType.includes('image')) {
    return 'fa-file-image';
  } else if (fileType.includes('pdf')) {
    return 'fa-file-pdf';
  } else if (fileType.includes('word')) {
    return 'fa-file-word';
  } else if (fileType.includes('excel') || fileType.includes('sheet')) {
    return 'fa-file-excel';
  } else if (fileType.includes('text')) {
    return 'fa-file-alt';
  } else {
    return 'fa-file';
  }
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1048576) {
    return `${Math.round(bytes / 1024)} KB`;
  } else {
    return `${Math.round((bytes / 1048576) * 10) / 10} MB`;
  }
};

export default SupportAdminPanel;