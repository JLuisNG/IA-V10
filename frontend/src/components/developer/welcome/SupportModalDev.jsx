import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../login/AuthContext';
import '../../../styles/developer/support/DeveloperSupportDashboard.scss';

// Componente principal del panel de soporte para developers
const DeveloperSupportDashboard = () => {
  // Estado del usuario autenticado
  const { currentUser } = useAuth();
  
  // Estados para filtros y navegación
  const [activeTab, setActiveTab] = useState('allTickets');
  const [activeTicket, setActiveTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // success, warning, error
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalTickets: 0,
    newTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    criticalTickets: 0,
    averageResponseTime: '0h',
    satisfactionRate: 0
  });
  
  // Referencias
  const replyInputRef = useRef(null);
  const ticketsContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  
  // Efecto de animación de partículas
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 20 + 10,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
      setParticles(newParticles);
    };
    
    generateParticles();
  }, []);
  
  // Simulación de agentes de soporte
  const supportAgents = [
    {
      id: 1,
      name: 'Luis Nava',
      role: 'Developer',
      avatar: 'LN',
      email: 'l.nava@therapysync.com',
      status: 'online',
      color: '#4F46E5'
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      role: 'Support Specialist',
      avatar: 'MR',
      email: 'm.rodriguez@therapysync.com',
      status: 'online',
      color: '#10B981'
    },
    {
      id: 3,
      name: 'James Wilson',
      role: 'Technical Support',
      avatar: 'JW',
      email: 'j.wilson@therapysync.com',
      status: 'away',
      color: '#F59E0B'
    },
    {
      id: 4,
      name: 'Sarah Chen',
      role: 'Billing Specialist',
      avatar: 'SC',
      email: 's.chen@therapysync.com',
      status: 'offline',
      color: '#EC4899'
    }
  ];
  
  // Carga inicial de tickets
  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);
      try {
        // Simulación de llamada a API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Datos de muestra para tickets
        const mockTickets = generateMockTickets();
        setTickets(mockTickets);
        
        // Calcular estadísticas del dashboard
        calculateDashboardStats(mockTickets);
        
        // Inicialmente filtramos según la pestaña activa
        filterTickets(mockTickets, activeTab, filterStatus, filterPriority, filterCategory, searchQuery);
      } catch (error) {
        console.error('Error loading tickets:', error);
        showNotificationAlert('Error loading tickets. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTickets();
  }, []);
  
  // Función para filtrar tickets
  const filterTickets = useCallback((ticketsToFilter, tab, status, priority, category, query) => {
    let filtered = [...ticketsToFilter];
    
    // Filtro por búsqueda de texto
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.subject.toLowerCase().includes(lowercaseQuery) ||
        ticket.id.toLowerCase().includes(lowercaseQuery) ||
        ticket.user.name.toLowerCase().includes(lowercaseQuery) ||
        ticket.user.email.toLowerCase().includes(lowercaseQuery) ||
        ticket.description.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Filtro por estado
    if (status !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === status);
    }
    
    // Filtro por prioridad
    if (priority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priority);
    }
    
    // Filtro por categoría
    if (category !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === category);
    }
    
    // Filtro por pestaña
    switch (tab) {
      case 'newTickets':
        filtered = filtered.filter(ticket => ticket.status === 'open' && !ticket.assignedTo);
        break;
      case 'myTickets':
        filtered = filtered.filter(ticket => 
          ticket.assignedTo && ticket.assignedTo.id === currentUser.id
        );
        break;
      case 'resolvedTickets':
        filtered = filtered.filter(ticket => 
          ticket.status === 'resolved' || ticket.status === 'closed'
        );
        break;
      // 'allTickets' no necesita filtro adicional
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredTickets(filtered);
  }, [currentUser]);
  
  // Efecto para actualizar los tickets filtrados cuando cambian los filtros
  useEffect(() => {
    filterTickets(tickets, activeTab, filterStatus, filterPriority, filterCategory, searchQuery);
  }, [tickets, activeTab, filterStatus, filterPriority, filterCategory, searchQuery, filterTickets]);
  
  // Función para generar datos de tickets de muestra
  const generateMockTickets = () => {
    const categories = [
      {id: 'account', name: 'Account & Access', icon: 'shield-alt'},
      {id: 'billing', name: 'Billing & Payments', icon: 'credit-card'},
      {id: 'patients', name: 'Patient Management', icon: 'user-injured'},
      {id: 'technical', name: 'Technical Support', icon: 'wrench'},
      {id: 'feature', name: 'Feature Requests', icon: 'lightbulb'}
    ];
    
    const statuses = ['open', 'in-progress', 'pending', 'resolved', 'closed'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    
    const randomDate = (start, end) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };
    
    // Generar usuarios aleatorios
    const mockUsers = [
      {
        id: 101,
        name: 'Jennifer Wilson',
        email: 'j.wilson@therapyclinic.com',
        role: 'PT',
        avatar: 'JW'
      },
      {
        id: 102,
        name: 'Robert Chen',
        email: 'r.chen@cityhealth.com',
        role: 'Administrator',
        avatar: 'RC'
      },
      {
        id: 103,
        name: 'Sarah Martinez',
        email: 's.martinez@therapycenter.net',
        role: 'OT',
        avatar: 'SM'
      },
      {
        id: 104,
        name: 'Michael Thompson',
        email: 'm.thompson@wellness.org',
        role: 'Administrator',
        avatar: 'MT'
      },
      {
        id: 105,
        name: 'Emma Davis',
        email: 'e.davis@healthgroup.com',
        role: 'PT',
        avatar: 'ED'
      },
      {
        id: 106,
        name: 'David Kim',
        email: 'd.kim@medicalcenter.org',
        role: 'Administrator',
        avatar: 'DK'
      }
    ];
    
    // Template para tickets
    const ticketTemplates = [
      {
        subject: 'Unable to access patient records',
        description: 'I can\'t access my patient records since this morning. I get an error message saying "Access denied" when I try to open any record.',
        category: categories[0],
        priority: 'high'
      },
      {
        subject: 'Billing system not calculating insurance correctly',
        description: 'The billing system is calculating incorrect amounts for insurance payments. The discounts are not being applied properly.',
        category: categories[1],
        priority: 'medium'
      },
      {
        subject: 'Calendar sync issue with Google Calendar',
        description: 'Appointments created in TherapySync are not showing up in my Google Calendar. This started happening yesterday.',
        category: categories[3],
        priority: 'medium'
      },
      {
        subject: 'Feature request: Bulk patient import',
        description: 'We need a way to import multiple patients at once from a CSV file. This would save us a lot of time.',
        category: categories[4],
        priority: 'low'
      },
      {
        subject: 'Cannot export data in CSV format',
        description: 'The export to CSV feature is not working. When I click on export, nothing happens.',
        category: categories[3],
        priority: 'high'
      },
      {
        subject: 'Question about new billing system',
        description: 'I need clarification on how the new billing system handles copayments versus deductibles.',
        category: categories[1],
        priority: 'medium'
      },
      {
        subject: 'Patient data missing after update',
        description: 'After the latest system update, some of my patient history appears to be missing. I can see their profiles but not their visit history.',
        category: categories[2],
        priority: 'critical'
      },
      {
        subject: 'Request for additional user licenses',
        description: 'Our practice has grown and we need to add 3 more therapist accounts to our subscription. How do we proceed?',
        category: categories[0],
        priority: 'medium'
      },
      {
        subject: 'System extremely slow during peak hours',
        description: 'Between 9-11am, the system becomes almost unusable. Pages take 30+ seconds to load and sometimes time out.',
        category: categories[3],
        priority: 'high'
      },
      {
        subject: 'Need to update practice information',
        description: 'We\'ve moved to a new location and need to update our address and phone number in the system. I can\'t find where to do this.',
        category: categories[0],
        priority: 'low'
      }
    ];
    
    // Generar tickets aleatorios
    const generatedTickets = [];
    
    for (let i = 0; i < 35; i++) {
      const template = ticketTemplates[Math.floor(Math.random() * ticketTemplates.length)];
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const status = statuses[Math.floor(Math.random() * (i < 10 ? 2 : statuses.length))]; // Primeros 10 tickets tienen más probabilidad de estar abiertos
      const isResolved = status === 'resolved' || status === 'closed';
      
      const createdDate = randomDate(new Date(2025, 0, 1), new Date());
      let resolvedDate = null;
      
      if (isResolved) {
        resolvedDate = new Date(createdDate);
        resolvedDate.setDate(resolvedDate.getDate() + Math.floor(Math.random() * 5) + 1);
      }
      
      // Determinar si está asignado y a quién
      let assignedTo = null;
      if (status !== 'open' || Math.random() > 0.3) {
        assignedTo = supportAgents[Math.floor(Math.random() * supportAgents.length)];
      }
      
      // Generar historial de respuestas
      const responses = [
        {
          id: 1,
          message: template.description,
          sender: 'user',
          timestamp: createdDate.toLocaleString(),
          attachments: Math.random() > 0.7 ? [{
            name: 'screenshot.png',
            type: 'image',
            size: '256 KB'
          }] : []
        }
      ];
      
      // Añadir respuestas si está asignado
      if (assignedTo) {
        const responseDate = new Date(createdDate);
        responseDate.setHours(responseDate.getHours() + Math.floor(Math.random() * 4) + 1);
        
        responses.push({
          id: 2,
          message: `Thank you for reporting this issue. I'm looking into it now. Could you provide more details about ${
            template.category.id === 'billing' ? 'which insurance provider is affected?' :
            template.category.id === 'patients' ? 'which patient records are you trying to access?' :
            template.category.id === 'technical' ? 'what browser and version you are using?' :
            'your specific requirements?'
          }`,
          sender: 'support',
          timestamp: responseDate.toLocaleString(),
          senderName: assignedTo.name
        });
        
        // Añadir respuesta del usuario
        if (Math.random() > 0.3) {
          const userResponseDate = new Date(responseDate);
          userResponseDate.setHours(userResponseDate.getHours() + Math.floor(Math.random() * 5) + 1);
          
          responses.push({
            id: 3,
            message: `Thanks for your quick response. ${
              template.category.id === 'billing' ? 'It\'s happening with BlueCross. The 15% discount that should be applied is missing from all transactions this month.' :
              template.category.id === 'patients' ? 'I\'m trying to access all patient records. The problem is system-wide.' :
              template.category.id === 'technical' ? 'I\'m using Chrome version 124.0.6367.201 on Windows 11.' :
              'We need this feature to handle the increased patient load we\'re experiencing this quarter.'
            }`,
            sender: 'user',
            timestamp: userResponseDate.toLocaleString()
          });
          
          // Añadir respuesta final del soporte para tickets resueltos
          if (isResolved) {
            const finalResponseDate = new Date(userResponseDate);
            finalResponseDate.setHours(finalResponseDate.getHours() + Math.floor(Math.random() * 8) + 1);
            
            responses.push({
              id: 4,
              message: `${
                status === 'resolved' ? 'Thanks for the information. I have identified the issue and implemented a fix. Please try again and let me know if you are still experiencing problems.' :
                'Thank you for providing those details. This issue has been resolved now. Please let us know if you need any further assistance.'
              }`,
              sender: 'support',
              timestamp: finalResponseDate.toLocaleString(),
              senderName: assignedTo.name
            });
            
            // Si está cerrado, añadir confirmación del usuario
            if (status === 'closed') {
              const closingDate = new Date(finalResponseDate);
              closingDate.setHours(closingDate.getHours() + Math.floor(Math.random() * 3) + 1);
              
              responses.push({
                id: 5,
                message: 'Confirming that this is working correctly now. Thank you for your help!',
                sender: 'user',
                timestamp: closingDate.toLocaleString()
              });
            }
          }
        }
      }
      
      // Generar ID de ticket único
      const ticketId = `TS-${100000 + i}`;
      
      generatedTickets.push({
        id: ticketId,
        subject: template.subject,
        description: template.description,
        category: template.category.name,
        categoryId: template.category.id,
        categoryIcon: template.category.icon,
        status,
        priority: template.priority,
        createdAt: createdDate.toISOString(),
        resolvedAt: isResolved ? resolvedDate.toISOString() : null,
        user,
        assignedTo,
        responses
      });
    }
    
    return generatedTickets;
  };
  
  // Calcular estadísticas para el dashboard
  const calculateDashboardStats = (ticketsList) => {
    const total = ticketsList.length;
    const newTickets = ticketsList.filter(t => t.status === 'open' && !t.assignedTo).length;
    const inProgress = ticketsList.filter(t => t.status === 'in-progress').length;
    const resolved = ticketsList.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    const critical = ticketsList.filter(t => t.priority === 'critical').length;
    
    // Calcular tiempo promedio de respuesta (primera respuesta)
    let totalResponseTime = 0;
    let ticketsWithResponse = 0;
    
    ticketsList.forEach(ticket => {
      if (ticket.responses.length >= 2) {
        const createdTime = new Date(ticket.responses[0].timestamp);
        const firstResponseTime = new Date(ticket.responses[1].timestamp);
        const responseTime = (firstResponseTime - createdTime) / (1000 * 60 * 60); // Horas
        totalResponseTime += responseTime;
        ticketsWithResponse++;
      }
    });
    
    const avgResponseTime = ticketsWithResponse > 0 
      ? `${(totalResponseTime / ticketsWithResponse).toFixed(1)}h` 
      : 'N/A';
    
    // Tasa de satisfacción simulada
    const satisfaction = Math.floor(Math.random() * 11) + 90; // 90-100%
    
    setDashboardStats({
      totalTickets: total,
      newTickets,
      inProgressTickets: inProgress,
      resolvedTickets: resolved,
      criticalTickets: critical,
      averageResponseTime: avgResponseTime,
      satisfactionRate: satisfaction
    });
  };
  
  // Mostrar notificación de alerta
  const showNotificationAlert = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };
  
  // Manejar clic en pestaña
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveTicket(null);
  };
  
  // Manejar clic en ticket
  const handleTicketClick = (ticket) => {
    setActiveTicket(ticket);
    
    // Scroll al principio de la conversación
    setTimeout(() => {
      const container = document.querySelector('.ticket-messages');
      if (container) {
        container.scrollTop = 0;
      }
      
      // Focus en el campo de respuesta
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 100);
  };
  
  // Manejar cambio de estado de ticket
  const handleStatusChange = (newStatus) => {
    if (!activeTicket) return;
    
    // Actualizar ticket activo
    const updatedTicket = {
      ...activeTicket,
      status: newStatus,
      ...(newStatus === 'resolved' || newStatus === 'closed' ? {
        resolvedAt: new Date().toISOString()
      } : {})
    };
    
    // Añadir mensaje de sistema
    const systemMessage = {
      id: activeTicket.responses.length + 1,
      message: `Ticket status changed to ${newStatus}`,
      sender: 'system',
      timestamp: new Date().toLocaleString()
    };
    
    updatedTicket.responses = [...updatedTicket.responses, systemMessage];
    
    // Actualizar ticket en el estado
    const updatedTickets = tickets.map(t => 
      t.id === activeTicket.id ? updatedTicket : t
    );
    
    setTickets(updatedTickets);
    setActiveTicket(updatedTicket);
    
    // Notificación
    showNotificationAlert(`Ticket status updated to ${newStatus}`, 'success');
  };
  
  // Manejar asignación de ticket
  const handleAssignTicket = (agent) => {
    if (!activeTicket) return;
    
    // Si ya está asignado al mismo agente, no hacer nada
    if (activeTicket.assignedTo && activeTicket.assignedTo.id === agent.id) {
      setShowAssignModal(false);
      return;
    }
    
    // Actualizar ticket activo
    const updatedTicket = {
      ...activeTicket,
      assignedTo: agent,
      // Si está abierto, cambiar a in-progress
      status: activeTicket.status === 'open' ? 'in-progress' : activeTicket.status
    };
    
    // Añadir mensaje de sistema
    const systemMessage = {
      id: activeTicket.responses.length + 1,
      message: `Ticket assigned to ${agent.name}`,
      sender: 'system',
      timestamp: new Date().toLocaleString()
    };
    
    updatedTicket.responses = [...updatedTicket.responses, systemMessage];
    
    // Actualizar ticket en el estado
    const updatedTickets = tickets.map(t => 
      t.id === activeTicket.id ? updatedTicket : t
    );
    
    setTickets(updatedTickets);
    setActiveTicket(updatedTicket);
    setShowAssignModal(false);
    
    // Notificación
    showNotificationAlert(`Ticket assigned to ${agent.name}`, 'success');
  };
  
  // Tomar un ticket (auto-asignarlo)
  const handleTakeTicket = () => {
    if (!activeTicket || !currentUser) return;
    
    // Buscar el agente que corresponde al usuario actual
    const currentAgent = supportAgents.find(agent => agent.id === currentUser.id) || {
      id: currentUser.id,
      name: currentUser.fullname || 'Support Agent',
      email: currentUser.email || 'support@therapysync.com',
      role: currentUser.role || 'Support',
      avatar: getInitials(currentUser.fullname || 'Support Agent'),
      status: 'online',
      color: '#4F46E5'
    };
    
    handleAssignTicket(currentAgent);
  };
  
  // Obtener iniciales para avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Manejar envío de respuesta
  const handleSendReply = () => {
    if (!replyText.trim() || !activeTicket) return;
    
    // Si el ticket no está asignado, asignar automáticamente
    if (!activeTicket.assignedTo) {
      handleTakeTicket();
    }
    
    // Crear nueva respuesta
    const newResponse = {
      id: activeTicket.responses.length + 1,
      message: replyText,
      sender: 'support',
      timestamp: new Date().toLocaleString(),
      senderName: currentUser?.fullname || 'Support Agent',
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    
    // Actualizar ticket activo
    const updatedTicket = {
      ...activeTicket,
      responses: [...activeTicket.responses, newResponse],
      // Si el estado es 'open', cambiarlo a 'in-progress'
      status: activeTicket.status === 'open' ? 'in-progress' : activeTicket.status
    };
    
    // Actualizar ticket en el estado
    const updatedTickets = tickets.map(t => 
      t.id === activeTicket.id ? updatedTicket : t
    );
    
    setTickets(updatedTickets);
    setActiveTicket(updatedTicket);
    
    // Limpiar entrada de respuesta y archivos adjuntos
    setReplyText('');
    setAttachments([]);
    
    // Scroll al final de los mensajes
    setTimeout(() => {
      const messagesContainer = document.querySelector('.ticket-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };
  
  // Manejar cambios en archivos adjuntos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newAttachments = files.map(file => ({
        id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        file
      }));
      
      setAttachments([...attachments, ...newAttachments]);
    }
    
    // Limpiar input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / 1048576 * 10) / 10} MB`;
  };
  
  // Eliminar archivo adjunto
  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };
  
  // Generar color por categoría
  const getCategoryColor = (categoryId) => {
    switch (categoryId) {
      case 'account':
        return '#4F46E5'; // Indigo
      case 'billing':
        return '#F59E0B'; // Amber
      case 'patients':
        return '#10B981'; // Emerald
      case 'technical':
        return '#EC4899'; // Pink
      case 'feature':
        return '#8B5CF6'; // Violet
      default:
        return '#6B7280'; // Gray
    }
  };
  
  // Generar color por prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#EF4444'; // Red
      case 'high':
        return '#F59E0B'; // Amber
      case 'medium':
        return '#3B82F6'; // Blue
      case 'low':
        return '#10B981'; // Emerald
      default:
        return '#6B7280'; // Gray
    }
  };
  
  // Generar icono por prioridad
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return 'exclamation-circle';
      case 'high':
        return 'arrow-alt-circle-up';
      case 'medium':
        return 'minus-circle';
      case 'low':
        return 'arrow-alt-circle-down';
      default:
        return 'question-circle';
    }
  };
  
  // Generar color por estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#3B82F6'; // Blue
      case 'in-progress':
        return '#8B5CF6'; // Violet
      case 'pending':
        return '#F59E0B'; // Amber
      case 'resolved':
        return '#10B981'; // Emerald
      case 'closed':
        return '#6B7280'; // Gray
      default:
        return '#6B7280'; // Gray
    }
  };
  
  // Generar icono por estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return 'door-open';
      case 'in-progress':
        return 'spinner';
      case 'pending':
        return 'clock';
      case 'resolved':
        return 'check-circle';
      case 'closed':
        return 'lock';
      default:
        return 'question-circle';
    }
  };
  
 // Formatear tiempo relativo
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 30) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  // Manejar click en exportar CSV
  const handleExportCSV = () => {
    // Generar CSV de tickets filtrados
    const headers = ["ID", "Subject", "Status", "Priority", "Category", "Assigned To", "Created", "Last Updated"];
    const rows = filteredTickets.map(ticket => [
      ticket.id,
      ticket.subject,
      ticket.status,
      ticket.priority,
      ticket.category,
      ticket.assignedTo ? ticket.assignedTo.name : "Unassigned",
      new Date(ticket.createdAt).toLocaleString(),
      ticket.responses.length > 0 
        ? new Date(ticket.responses[ticket.responses.length - 1].timestamp).toLocaleString()
        : new Date(ticket.createdAt).toLocaleString()
    ]);
    
    // Crear contenido CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tickets-export-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotificationAlert('Tickets exported successfully', 'success');
  };
  
  // Cargar datos analíticos
  const loadAnalyticsData = () => {
    setIsLoading(true);
    
    // Simulación de carga de datos analíticos
    setTimeout(() => {
      // Datos por categoría
      const categoryCounts = {};
      tickets.forEach(ticket => {
        categoryCounts[ticket.categoryId] = (categoryCounts[ticket.categoryId] || 0) + 1;
      });
      
      // Datos por prioridad
      const priorityCounts = {};
      tickets.forEach(ticket => {
        priorityCounts[ticket.priority] = (priorityCounts[ticket.priority] || 0) + 1;
      });
      
      // Tickets resueltos por día (últimos 14 días)
      const resolvedByDay = [];
      const today = new Date();
      for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().slice(0, 10);
        
        // Contar tickets resueltos en ese día
        const count = tickets.filter(ticket => {
          if (!ticket.resolvedAt) return false;
          const resolvedDate = new Date(ticket.resolvedAt).toISOString().slice(0, 10);
          return resolvedDate === dateStr;
        }).length;
        
        resolvedByDay.push({
          date: dateStr,
          count
        });
      }
      
      // Tiempo de respuesta promedio por día
      const responseTimeByDay = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().slice(0, 10);
        
        // Calcular tiempo de respuesta promedio para tickets creados ese día
        const dayTickets = tickets.filter(ticket => {
          const createdDate = new Date(ticket.createdAt).toISOString().slice(0, 10);
          return createdDate === dateStr && ticket.responses.length >= 2;
        });
        
        let totalResponseTime = 0;
        dayTickets.forEach(ticket => {
          const createdTime = new Date(ticket.responses[0].timestamp);
          const firstResponseTime = new Date(ticket.responses[1].timestamp);
          const responseTime = (firstResponseTime - createdTime) / (1000 * 60 * 60); // Horas
          totalResponseTime += responseTime;
        });
        
        const avgResponseTime = dayTickets.length > 0 
          ? totalResponseTime / dayTickets.length
          : null;
        
        responseTimeByDay.push({
          date: dateStr,
          value: avgResponseTime
        });
      }
      
      // Clasificación por usuarios (top 5)
      const userTickets = {};
      tickets.forEach(ticket => {
        const userName = ticket.user.name;
        userTickets[userName] = (userTickets[userName] || 0) + 1;
      });
      
      const topUsers = Object.entries(userTickets)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Asignar todos los datos
      setAnalyticsData({
        categoryCounts,
        priorityCounts,
        resolvedByDay,
        responseTimeByDay,
        topUsers
      });
      
      setIsLoading(false);
      setShowAnalytics(true);
    }, 1500);
  };
  
  // Renderizar diferentes secciones del dashboard
  return (
    <div className="developer-support-dashboard">
      {/* Partículas de fondo */}
      <div className="background-particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${particle.speed}s`
            }}
          />
        ))}
      </div>
      
      {/* Header del dashboard */}
      <header className="dashboard-header">
        <div className="header-title">
          <div className="title-icon">
            <i className="fas fa-headset"></i>
          </div>
          <h1>Support Center <span className="developer-badge">Developer View</span></h1>
        </div>
        
        <div className="user-info">
          <div className="user-notification">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </div>
          
          <div className="user-profile">
            <div className="user-avatar" style={{ backgroundColor: '#4F46E5' }}>
              {currentUser ? getInitials(currentUser.fullname) : 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{currentUser?.fullname || 'Developer'}</span>
              <span className="user-role">{currentUser?.role || 'Support Agent'}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Panel de estadísticas */}
      <div className="stats-panel">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
            <i className="fas fa-ticket-alt" style={{ color: '#3B82F6' }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-title">Total Tickets</div>
            <div className="stat-value">{dashboardStats.totalTickets}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
            <i className="fas fa-exclamation-circle" style={{ color: '#EF4444' }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-title">New Tickets</div>
            <div className="stat-value">{dashboardStats.newTickets}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}>
            <i className="fas fa-spinner" style={{ color: '#8B5CF6' }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-title">In Progress</div>
            <div className="stat-value">{dashboardStats.inProgressTickets}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <i className="fas fa-check-circle" style={{ color: '#10B981' }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-title">Resolved</div>
            <div className="stat-value">{dashboardStats.resolvedTickets}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
            <i className="fas fa-clock" style={{ color: '#F59E0B' }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-title">Avg. Response Time</div>
            <div className="stat-value">{dashboardStats.averageResponseTime}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <i className="fas fa-smile" style={{ color: '#10B981' }}></i>
          </div>
          <div className="stat-content">
            <div className="stat-title">Satisfaction Rate</div>
            <div className="stat-value">{dashboardStats.satisfactionRate}%</div>
          </div>
        </div>
      </div>
      
      {/* Tabs de navegación */}
      <div className="tickets-navigation">
        <div className="navigation-tabs">
          <button 
            className={`nav-tab ${activeTab === 'allTickets' ? 'active' : ''}`}
            onClick={() => handleTabClick('allTickets')}
          >
            <i className="fas fa-ticket-alt"></i>
            <span>All Tickets</span>
            <div className="tab-badge">{tickets.length}</div>
          </button>
          
          <button 
            className={`nav-tab ${activeTab === 'newTickets' ? 'active' : ''}`}
            onClick={() => handleTabClick('newTickets')}
          >
            <i className="fas fa-inbox"></i>
            <span>New Tickets</span>
            <div className="tab-badge">{tickets.filter(t => t.status === 'open' && !t.assignedTo).length}</div>
          </button>
          
          <button 
            className={`nav-tab ${activeTab === 'myTickets' ? 'active' : ''}`}
            onClick={() => handleTabClick('myTickets')}
          >
            <i className="fas fa-user-check"></i>
            <span>My Tickets</span>
            <div className="tab-badge">
              {tickets.filter(t => t.assignedTo && t.assignedTo.id === currentUser?.id).length}
            </div>
          </button>
          
          <button 
            className={`nav-tab ${activeTab === 'resolvedTickets' ? 'active' : ''}`}
            onClick={() => handleTabClick('resolvedTickets')}
          >
            <i className="fas fa-check-circle"></i>
            <span>Resolved</span>
            <div className="tab-badge">
              {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
            </div>
          </button>
        </div>
        
        <div className="navigation-actions">
          <button 
            className="action-button"
            onClick={() => loadAnalyticsData()}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Analytics</span>
          </button>
          
          <button 
            className="action-button"
            onClick={handleExportCSV}
          >
            <i className="fas fa-file-export"></i>
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      
      {/* Panel principal de tickets */}
      <div className="main-panel">
        {/* Filtros y búsqueda */}
        <div className="filter-bar">
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search tickets by ID, subject, or user..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          <div className="filters">
            <div className="filter-dropdown">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
            
            <div className="filter-dropdown">
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
            
            <div className="filter-dropdown">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="account">Account & Access</option>
                <option value="billing">Billing & Payments</option>
                <option value="patients">Patient Management</option>
                <option value="technical">Technical Support</option>
                <option value="feature">Feature Requests</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner">
              <div className="spinner-inner"></div>
              <div className="spinner-glow"></div>
            </div>
            <span>Loading tickets...</span>
          </div>
        ) : (
          <div className="tickets-container" ref={ticketsContainerRef}>
            {filteredTickets.length > 0 ? (
              <div className="split-view">
                {/* Lista de tickets */}
                <div className="tickets-list">
                  <div className="tickets-header">
                    <h3>
                      {activeTab === 'allTickets' && 'All Tickets'}
                      {activeTab === 'newTickets' && 'New Tickets'}
                      {activeTab === 'myTickets' && 'My Assigned Tickets'}
                      {activeTab === 'resolvedTickets' && 'Resolved Tickets'}
                    </h3>
                    <div className="ticket-count">
                      {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="tickets">
                    {filteredTickets.map(ticket => (
                      <div 
                        key={ticket.id}
                        className={`ticket-card ${activeTicket?.id === ticket.id ? 'active' : ''}`}
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <div 
                          className="ticket-priority" 
                          style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                        ></div>
                        
                        <div className="ticket-content">
                          <div className="ticket-header">
                            <div className="ticket-id">{ticket.id}</div>
                            <div 
                              className="ticket-status"
                              style={{ color: getStatusColor(ticket.status) }}
                            >
                              <i className={`fas fa-${getStatusIcon(ticket.status)}`}></i>
                              <span>{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                            </div>
                          </div>
                          
                          <h4 className="ticket-subject">{ticket.subject}</h4>
                          
                          <div className="ticket-meta">
                            <div className="ticket-category">
                              <i className={`fas fa-${ticket.categoryIcon}`}></i>
                              <span>{ticket.category}</span>
                            </div>
                            
                            <div className="ticket-time">
                              <i className="fas fa-clock"></i>
                              <span>{formatRelativeTime(ticket.createdAt)}</span>
                            </div>
                            
                            <div className="ticket-priority-indicator">
                              <i className={`fas fa-${getPriorityIcon(ticket.priority)}`}></i>
                              <span>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                            </div>
                          </div>
                          
                          <div className="ticket-footer">
                            <div className="ticket-user">
                              <div 
                                className="user-avatar"
                                style={{ backgroundColor: '#4F46E5' }}
                              >
                                {ticket.user.avatar}
                              </div>
                              <div className="user-info">
                                <span className="user-name">{ticket.user.name}</span>
                                <span className="user-role">{ticket.user.role}</span>
                              </div>
                            </div>
                            
                            {ticket.assignedTo ? (
                              <div className="ticket-assigned">
                                <i className="fas fa-user-check"></i>
                                <span>{ticket.assignedTo.name}</span>
                              </div>
                            ) : (
                              <div className="ticket-unassigned">
                                <i className="fas fa-user-plus"></i>
                                <span>Unassigned</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Detalle de ticket */}
                <div className="ticket-detail">
                  {activeTicket ? (
                    <div className="ticket-detail-content">
                      <div className="ticket-detail-header">
                        <div className="ticket-detail-subject">
                          <h3>{activeTicket.subject}</h3>
                          <div className="ticket-id-detail">{activeTicket.id}</div>
                        </div>
                        
                        <div className="ticket-detail-meta">
                          <div className="meta-item">
                            <span className="meta-label">Status:</span>
                            <span 
                              className="meta-value" 
                              style={{ color: getStatusColor(activeTicket.status) }}
                            >
                              <i className={`fas fa-${getStatusIcon(activeTicket.status)}`}></i>
                              {activeTicket.status.charAt(0).toUpperCase() + activeTicket.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="meta-item">
                            <span className="meta-label">Priority:</span>
                            <span 
                              className="meta-value" 
                              style={{ color: getPriorityColor(activeTicket.priority) }}
                            >
                              <i className={`fas fa-${getPriorityIcon(activeTicket.priority)}`}></i>
                              {activeTicket.priority.charAt(0).toUpperCase() + activeTicket.priority.slice(1)}
                            </span>
                          </div>
                          
                          <div className="meta-item">
                            <span className="meta-label">Category:</span>
                            <span className="meta-value">
                              <i className={`fas fa-${activeTicket.categoryIcon}`}></i>
                              {activeTicket.category}
                            </span>
                          </div>
                          
                          <div className="meta-item">
                            <span className="meta-label">Created:</span>
                            <span className="meta-value">
                              <i className="fas fa-calendar-alt"></i>
                              {new Date(activeTicket.createdAt).toLocaleString()}
                            </span>
                          </div>
                          
                          {activeTicket.resolvedAt && (
                            <div className="meta-item">
                              <span className="meta-label">Resolved:</span>
                              <span className="meta-value">
                                <i className="fas fa-check-circle"></i>
                                {new Date(activeTicket.resolvedAt).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="user-detail">
                          <div 
                            className="user-avatar-detail"
                            style={{ backgroundColor: '#4F46E5' }}
                          >
                            {activeTicket.user.avatar}
                          </div>
                          <div className="user-info-detail">
                            <span className="user-name-detail">{activeTicket.user.name}</span>
                            <span className="user-role-detail">{activeTicket.user.role}</span>
                            <span className="user-email-detail">{activeTicket.user.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ticket-actions">
                        {!activeTicket.assignedTo ? (
                          <button 
                            className="action-button take-ticket"
                            onClick={handleTakeTicket}
                          >
                            <i className="fas fa-user-plus"></i>
                            <span>Take Ticket</span>
                          </button>
                        ) : activeTicket.assignedTo.id !== currentUser?.id ? (
                          <div className="assigned-to-other">
                            <span className="assigned-label">Assigned to:</span>
                            <div className="assigned-agent">
                              <div 
                                className="agent-avatar"
                                style={{ backgroundColor: activeTicket.assignedTo.color || '#4F46E5' }}
                              >
                                {activeTicket.assignedTo.avatar}
                              </div>
                              <span className="agent-name">{activeTicket.assignedTo.name}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="assigned-to-me">
                            <i className="fas fa-user-check"></i>
                            <span>Assigned to you</span>
                          </div>
                        )}
                        
                        <div className="action-dropdown">
                          <button 
                            className="dropdown-toggle"
                            onClick={() => setShowAssignModal(!showAssignModal)}
                          >
                            <i className="fas fa-user-tag"></i>
                            <span>Assign</span>
                            <i className="fas fa-chevron-down"></i>
                          </button>
                          
                          {showAssignModal && (
                            <div className="dropdown-menu">
                              {supportAgents.map(agent => (
                                <div 
                                  key={agent.id}
                                  className="dropdown-item"
                                  onClick={() => handleAssignTicket(agent)}
                                >
                                  <div 
                                    className="agent-avatar"
                                    style={{ backgroundColor: agent.color }}
                                  >
                                    {agent.avatar}
                                  </div>
                                  <div className="agent-info">
                                    <span className="agent-name">{agent.name}</span>
                                    <span className="agent-role">{agent.role}</span>
                                  </div>
                                  <div className={`agent-status ${agent.status}`}>
                                    <i className="fas fa-circle"></i>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="status-actions">
                          {activeTicket.status !== 'open' && (
                            <button 
                              className="status-action open"
                              onClick={() => handleStatusChange('open')}
                              title="Mark as Open"
                            >
                              <i className="fas fa-door-open"></i>
                            </button>
                          )}
                          
                          {activeTicket.status !== 'in-progress' && (
                            <button 
                              className="status-action in-progress"
                              onClick={() => handleStatusChange('in-progress')}
                              title="Mark as In Progress"
                            >
                              <i className="fas fa-spinner"></i>
                            </button>
                          )}
                          
                          {activeTicket.status !== 'pending' && (
                            <button 
                              className="status-action pending"
                              onClick={() => handleStatusChange('pending')}
                              title="Mark as Pending"
                            >
                              <i className="fas fa-clock"></i>
                            </button>
                          )}
                          
                          {activeTicket.status !== 'resolved' && (
                            <button 
                              className="status-action resolved"
                              onClick={() => handleStatusChange('resolved')}
                              title="Mark as Resolved"
                            >
                              <i className="fas fa-check-circle"></i>
                            </button>
                          )}
                          
                          {activeTicket.status !== 'closed' && (
                            <button 
                              className="status-action closed"
                              onClick={() => handleStatusChange('closed')}
                              title="Mark as Closed"
                            >
                              <i className="fas fa-lock"></i>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="ticket-messages">
                        {activeTicket.responses.map((response, index) => (
                          <div 
                            key={response.id}
                            className={`message ${
                              response.sender === 'user' ? 'user' : 
                              response.sender === 'support' ? 'support' : 
                              'system'
                            }`}
                          >
                            {response.sender !== 'system' && (
                              <div 
                                className="message-avatar"
                                style={{ 
                                  backgroundColor: response.sender === 'user' 
                                    ? '#4F46E5'
                                    : '#10B981'
                                }}
                              >
                                {response.sender === 'user' 
                                  ? activeTicket.user.avatar
                                  : getInitials(response.senderName || 'Support')
                                }
                              </div>
                            )}
                            
                            <div className="message-content">
                              {response.sender !== 'system' && (
                                <div className="message-header">
                                  <span className="message-sender">
                                    {response.sender === 'user' 
                                      ? activeTicket.user.name
                                      : response.senderName || 'Support'
                                    }
                                  </span>
                                  <span className="message-time">{response.timestamp}</span>
                                </div>
                              )}
                              
                              <div className="message-body">
                                {response.message}
                              </div>
                              
                              {response.attachments && response.attachments.length > 0 && (
                                <div className="message-attachments">
                                  {response.attachments.map((attachment, i) => (
                                    <div key={i} className="attachment">
                                      <div className="attachment-icon">
                                        <i className={`fas ${
                                          attachment.type === 'image' ? 'fa-image' : 
                                          attachment.type === 'pdf' ? 'fa-file-pdf' :
                                          attachment.type === 'doc' ? 'fa-file-word' :
                                          'fa-file'
                                        }`}></i>
                                      </div>
                                      <div className="attachment-info">
                                        <span className="attachment-name">{attachment.name}</span>
                                        <span className="attachment-size">{attachment.size}</span>
                                      </div>
                                      <button className="attachment-download">
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                    ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="reply-container">
                            <textarea
                              ref={replyInputRef}
                              placeholder="Type your reply here..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                  handleSendReply();
                                }
                              }}
                            ></textarea>
                            
                            <div className="reply-toolbar">
                              <div className="toolbar-buttons">
                                <button 
                                  className="toolbar-button"
                                  onClick={() => fileInputRef.current?.click()}
                                  title="Attach File"
                                >
                                  <i className="fas fa-paperclip"></i>
                                </button>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  style={{ display: 'none' }}
                                  multiple
                                />
                                
                                <button 
                                  className="toolbar-button"
                                  title="Insert Template"
                                >
                                  <i className="fas fa-file-alt"></i>
                                </button>
                                
                                <button 
                                  className="toolbar-button"
                                  title="Insert Code Block"
                                >
                                  <i className="fas fa-code"></i>
                                </button>
                                
                                <button 
                                  className="toolbar-button"
                                  title="Insert Emoji"
                                >
                                  <i className="fas fa-smile"></i>
                                </button>
                              </div>
                              
                              <button 
                                className={`send-button ${!replyText.trim() ? 'disabled' : ''}`}
                                onClick={handleSendReply}
                                disabled={!replyText.trim()}
                              >
                                <i className="fas fa-paper-plane"></i>
                                <span>Send Reply</span>
                              </button>
                            </div>
                            
                            {attachments.length > 0 && (
                              <div className="reply-attachments">
                                <h4>Attachments</h4>
                                <div className="attachment-list">
                                  {attachments.map(attachment => (
                                    <div key={attachment.id} className="attachment-item">
                                      <div className="attachment-info">
                                        <i className={`fas ${
                                          attachment.type.startsWith('image/') ? 'fa-image' : 
                                          attachment.type === 'application/pdf' ? 'fa-file-pdf' :
                                          attachment.type.includes('word') ? 'fa-file-word' :
                                          attachment.type.includes('excel') ? 'fa-file-excel' :
                                          'fa-file'
                                        }`}></i>
                                        <span className="attachment-name">{attachment.name}</span>
                                        <span className="attachment-size">{attachment.size}</span>
                                      </div>
                                      <button 
                                        className="remove-attachment"
                                        onClick={() => handleRemoveAttachment(attachment.id)}
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="no-ticket-selected">
                          <div className="no-ticket-icon">
                            <i className="fas fa-ticket-alt"></i>
                          </div>
                          <h3>No Ticket Selected</h3>
                          <p>Select a ticket from the list to view details and respond</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="no-tickets">
                    <div className="no-tickets-icon">
                      <i className="fas fa-ticket-alt"></i>
                    </div>
                    <h3>No tickets found</h3>
                    <p>Try changing your search criteria or filters</p>
                    <button 
                      className="reset-filters"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterStatus('all');
                        setFilterPriority('all');
                        setFilterCategory('all');
                      }}
                    >
                      <i className="fas fa-redo"></i>
                      <span>Reset Filters</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Analytics Modal */}
          {showAnalytics && (
            <div className="analytics-overlay">
              <div className="analytics-modal">
                <div className="modal-header">
                  <h2>Support Analytics Dashboard</h2>
                  <button 
                    className="close-analytics"
                    onClick={() => setShowAnalytics(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                {isLoading ? (
                  <div className="loading-analytics">
                    <div className="spinner">
                      <div className="spinner-inner"></div>
                    </div>
                    <span>Loading analytics data...</span>
                  </div>
                ) : (
                  <div className="analytics-content">
                    <div className="analytics-summary">
                      <div className="summary-card">
                        <div className="summary-icon">
                          <i className="fas fa-ticket-alt"></i>
                        </div>
                        <div className="summary-content">
                          <h4>Total Tickets</h4>
                          <div className="summary-value">{dashboardStats.totalTickets}</div>
                        </div>
                      </div>
                      
                      <div className="summary-card">
                        <div className="summary-icon">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="summary-content">
                          <h4>Resolution Rate</h4>
                          <div className="summary-value">
                            {Math.round((dashboardStats.resolvedTickets / dashboardStats.totalTickets) * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="summary-card">
                        <div className="summary-icon">
                          <i className="fas fa-clock"></i>
                        </div>
                        <div className="summary-content">
                          <h4>Avg. Response Time</h4>
                          <div className="summary-value">{dashboardStats.averageResponseTime}</div>
                        </div>
                      </div>
                      
                      <div className="summary-card">
                        <div className="summary-icon">
                          <i className="fas fa-smile"></i>
                        </div>
                        <div className="summary-content">
                          <h4>Satisfaction</h4>
                          <div className="summary-value">{dashboardStats.satisfactionRate}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="analytics-charts">
                      <div className="chart-container">
                        <h3>Tickets by Category</h3>
                        <div className="chart-content categories-chart">
                          {analyticsData.categoryCounts && Object.entries(analyticsData.categoryCounts).map(([categoryId, count]) => {
                            const categoryName = {
                              'account': 'Account & Access',
                              'billing': 'Billing & Payments',
                              'patients': 'Patient Management',
                              'technical': 'Technical Support',
                              'feature': 'Feature Requests'
                            }[categoryId] || categoryId;
                            
                            const percentage = Math.round((count / dashboardStats.totalTickets) * 100);
                            
                            return (
                              <div key={categoryId} className="category-stat">
                                <div className="category-label">
                                  <div 
                                    className="category-color"
                                    style={{ backgroundColor: getCategoryColor(categoryId) }}
                                  ></div>
                                  <span>{categoryName}</span>
                                </div>
                                <div className="category-bar-container">
                                  <div 
                                    className="category-bar"
                                    style={{ 
                                      width: `${percentage}%`,
                                      backgroundColor: getCategoryColor(categoryId)
                                    }}
                                  ></div>
                                </div>
                                <div className="category-count">
                                  <span className="count-value">{count}</span>
                                  <span className="count-percent">({percentage}%)</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="chart-container">
                        <h3>Tickets by Priority</h3>
                        <div className="chart-content priorities-chart">
                          {analyticsData.priorityCounts && ['critical', 'high', 'medium', 'low'].map(priority => {
                            const count = analyticsData.priorityCounts[priority] || 0;
                            const percentage = Math.round((count / dashboardStats.totalTickets) * 100);
                            
                            return (
                              <div key={priority} className="priority-stat">
                                <div className="priority-label">
                                  <div 
                                    className="priority-color"
                                    style={{ backgroundColor: getPriorityColor(priority) }}
                                  ></div>
                                  <span>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                                </div>
                                <div className="priority-bar-container">
                                  <div 
                                    className="priority-bar"
                                    style={{ 
                                      width: `${percentage}%`,
                                      backgroundColor: getPriorityColor(priority)
                                    }}
                                  ></div>
                                </div>
                                <div className="priority-count">
                                  <span className="count-value">{count}</span>
                                  <span className="count-percent">({percentage}%)</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="analytics-charts">
                      <div className="chart-container">
                        <h3>Resolved Tickets (Last 14 Days)</h3>
                        <div className="chart-content timeline-chart">
                          <div className="chart-y-axis">
                            <div className="y-axis-label">10</div>
                            <div className="y-axis-label">5</div>
                            <div className="y-axis-label">0</div>
                          </div>
                          <div className="chart-grid">
                            {analyticsData.resolvedByDay.map((day, index) => {
                              const height = day.count > 0 ? (day.count / 10) * 100 : 0;
                              return (
                                <div key={day.date} className="chart-bar-container">
                                  <div 
                                    className="chart-tooltip"
                                    style={{ bottom: `${height + 10}%` }}
                                  >
                                    {day.count} ticket{day.count !== 1 ? 's' : ''}
                                  </div>
                                  <div 
                                    className="chart-bar"
                                    style={{ 
                                      height: `${height}%`,
                                      backgroundColor: '#10B981'
                                    }}
                                  ></div>
                                  <div className="chart-label">
                                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="chart-container">
                        <h3>Response Time (Hours)</h3>
                        <div className="chart-content timeline-chart">
                          <div className="chart-y-axis">
                            <div className="y-axis-label">8h</div>
                            <div className="y-axis-label">4h</div>
                            <div className="y-axis-label">0h</div>
                          </div>
                          <div className="chart-grid">
                            {analyticsData.responseTimeByDay.map((day, index) => {
                              const height = day.value ? (day.value / 8) * 100 : 0;
                              
                              return (
                                <div key={day.date} className="chart-bar-container">
                                  {day.value && (
                                    <div 
                                      className="chart-tooltip"
                                      style={{ bottom: `${height + 10}%` }}
                                    >
                                      {day.value.toFixed(1)}h
                                    </div>
                                  )}
                                  <div 
                                    className="chart-bar"
                                    style={{ 
                                      height: `${height}%`,
                                      backgroundColor: '#3B82F6'
                                    }}
                                  ></div>
                                  <div className="chart-label">
                                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="analytics-charts">
                      <div className="chart-container">
                        <h3>Top Users by Tickets</h3>
                        <div className="chart-content users-chart">
                          {analyticsData.topUsers.map((user, index) => (
                            <div key={user.name} className="user-stat">
                              <div className="user-rank">{index + 1}</div>
                              <div className="user-name">{user.name}</div>
                              <div className="user-bar-container">
                                <div 
                                  className="user-bar"
                                  style={{ 
                                    width: `${(user.count / analyticsData.topUsers[0].count) * 100}%`,
                                    backgroundColor: `hsl(${220 + index * 30}, 70%, 60%)`
                                  }}
                                ></div>
                              </div>
                              <div className="user-count">{user.count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="analytics-actions">
                      <button 
                        className="export-analytics"
                        onClick={() => {
                          showNotificationAlert('Analytics data exported successfully', 'success');
                          setShowAnalytics(false);
                        }}
                      >
                        <i className="fas fa-file-export"></i>
                        <span>Export Report</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Notificaciones */}
          {showNotification && (
            <div className={`notification ${notificationType}`}>
              <div className="notification-icon">
                <i className={`fas ${
                  notificationType === 'success' ? 'fa-check-circle' : 
                  notificationType === 'warning' ? 'fa-exclamation-triangle' : 
                  'fa-times-circle'
                }`}></i>
              </div>
              <div className="notification-message">
                {notificationMessage}
              </div>
              <button 
                className="close-notification"
                onClick={() => setShowNotification(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        </div>
      );
    };
    
export default DeveloperSupportDashboard;