import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../login/AuthContext';
import '../../../styles/developer/support/TicketResponsePage.scss';


const TicketResponsePage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [internalNotes, setInternalNotes] = useState('');
  const [showInternalNotes, setShowInternalNotes] = useState(false);
  
  const responseInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Definir estados posibles del ticket
  const allStatuses = [
    { value: 'new', label: 'Nuevo', color: '#3B82F6' },
    { value: 'assigned', label: 'Asignado', color: '#8B5CF6' },
    { value: 'in_progress', label: 'En Progreso', color: '#F59E0B' },
    { value: 'awaiting_response', label: 'Esperando Respuesta', color: '#6366F1' },
    { value: 'resolved', label: 'Resuelto', color: '#10B981' },
    { value: 'closed', label: 'Cerrado', color: '#6B7280' }
  ];
  
  // Cargar datos del ticket
  useEffect(() => {
    const loadTicket = async () => {
      try {
        // En un entorno real, esto sería una llamada a API
        // Simulamos datos para desarrollo
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Ticket simulado
        const mockTicket = {
          id: ticketId || 'TS-123456',
          title: 'Problema al acceder al sistema de facturación',
          status: 'in_progress',
          priority: 'high',
          category: 'billing',
          subcategory: 'payment-issue',
          createdAt: new Date(Date.now() - 60 * 60 * 24 * 2 * 1000).toISOString(), // 2 días atrás
          updatedAt: new Date(Date.now() - 60 * 60 * 3 * 1000).toISOString(), // 3 horas atrás
          userId: 'USER-1234',
          userName: 'María González',
          userEmail: 'maria.gonzalez@example.com',
          assignedTo: currentUser?.id || 'agent-1',
          description: 'Estoy intentando acceder al módulo de facturación pero recibo un error 403 "Acceso Denegado". Necesito generar facturas para mis pacientes urgentemente.',
          attachments: [
            {
              id: 'file-1',
              name: 'error_screenshot.jpg',
              type: 'image/jpeg',
              size: 456789,
              url: '#'
            }
          ],
          messages: [
            {
              id: 'msg-1',
              sender: 'user',
              senderName: 'María González',
              message: 'Estoy intentando acceder al módulo de facturación pero recibo un error 403 "Acceso Denegado". Necesito generar facturas para mis pacientes urgentemente.',
              timestamp: new Date(Date.now() - 60 * 60 * 24 * 2 * 1000).toISOString(),
              isInternal: false,
              read: true
            },
            {
              id: 'msg-2',
              sender: 'support',
              senderName: 'Carlos Rodríguez',
              message: 'Hola María, lamento los inconvenientes. Estamos revisando el problema con el módulo de facturación. ¿Podría indicarme desde qué navegador está intentando acceder y si este error ocurre en todos los dispositivos?',
              timestamp: new Date(Date.now() - 60 * 60 * 24 * 1.5 * 1000).toISOString(),
              isInternal: false,
              read: true
            },
            {
              id: 'msg-3',
              sender: 'user',
              senderName: 'María González',
              message: 'Estoy usando Chrome versión 98 en Windows 10. También intenté desde mi iPad y ocurre lo mismo.',
              timestamp: new Date(Date.now() - 60 * 60 * 24 * 1 * 1000).toISOString(),
              isInternal: false,
              read: true
            },
            {
              id: 'msg-4',
              sender: 'support',
              senderName: 'Ana García',
              message: 'He revisado los permisos de la cuenta y parece que hay un problema con el rol asignado. Debemos escalar esto al equipo de desarrollo.',
              timestamp: new Date(Date.now() - 60 * 60 * 12 * 1000).toISOString(),
              isInternal: true,
              read: true
            }
          ],
          internalNotes: 'Usuario reporta problemas frecuentes de acceso. Revisar configuración de permisos a nivel de base de datos. Posible conflicto con actualización reciente del sistema de roles.'
        };
        
        setTicket(mockTicket);
        setInternalNotes(mockTicket.internalNotes || '');
        
        // Determinar los estados permitidos basados en el estado actual
        const currentStatusIndex = allStatuses.findIndex(s => s.value === mockTicket.status);
        if (currentStatusIndex !== -1) {
          // Permitir cambiar solo a estados adyacentes o al estado actual
          const availableStatusOptions = allStatuses.filter((_, index) => {
            return Math.abs(index - currentStatusIndex) <= 1 || index === currentStatusIndex;
          });
          setAvailableStatuses(availableStatusOptions);
          setSelectedStatus(mockTicket.status);
        }
        
        setIsLoaded(true);
        
        // Scroll al final de los mensajes
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } catch (error) {
        console.error('Error loading ticket:', error);
        // Manejo de error
      }
    };
    
    loadTicket();
  }, [ticketId, currentUser]);
  
  // Enviar una respuesta
  const handleSendResponse = async () => {
    if (!responseText.trim()) return;
    
    setIsSending(true);
    
    try {
      // En un entorno real, aquí se haría la llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear nuevo mensaje
      const newMessage = {
        id: `msg-${Date.now()}`,
        sender: 'support',
        senderName: currentUser?.name || 'Soporte Técnico',
        message: responseText,
        timestamp: new Date().toISOString(),
        isInternal: false,
        read: true
      };
      
      // Actualizar el ticket local
      setTicket(prev => {
        if (!prev) return null;
        
        const updatedTicket = {
          ...prev,
          messages: [...prev.messages, newMessage],
          updatedAt: new Date().toISOString(),
          status: selectedStatus !== prev.status ? selectedStatus : prev.status
        };
        
        return updatedTicket;
      });
      
      // Procesar adjuntos si existen
      if (attachments.length > 0) {
        // Simulación de subida de archivos
        console.log('Uploading attachments:', attachments);
      }
      
      // Actualizar notas internas si se modificaron
      if (internalNotes !== ticket?.internalNotes) {
        console.log('Updated internal notes:', internalNotes);
      }
      
      // Resetear estados
      setResponseText('');
      setAttachments([]);
      setShowSuccessAlert(true);
      
      // Ocultar alerta de éxito después de 3 segundos
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      
      // Scroll al final de los mensajes
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Error sending response:', error);
      // Manejo de error
    } finally {
      setIsSending(false);
    }
  };
  
  // Manejar cambio de estado
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  
  // Manejar archivos adjuntos
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    if (newFiles.length > 0) {
      // Validar archivos
      const validFiles = newFiles.filter(file => {
        // Límite de 10MB
        if (file.size > 10 * 1024 * 1024) {
          alert(`El archivo "${file.name}" excede el límite de 10MB.`);
          return false;
        }
        
        // Tipos permitidos
        const allowedTypes = [
          'image/jpeg', 'image/png', 'image/gif',
          'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          alert(`El tipo de archivo "${file.type}" no es compatible.`);
          return false;
        }
        
        return true;
      });
      
      // Agregar metadatos
      const filesWithPreview = validFiles.map(file => {
        // Crear URL de previsualización para imágenes
        const isImage = file.type.startsWith('image/');
        const preview = isImage ? URL.createObjectURL(file) : null;
        
        return {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview,
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        };
      });
      
      setAttachments(prev => [...prev, ...filesWithPreview]);
    }
  };
  
  // Eliminar un archivo adjunto
  const handleRemoveFile = (fileId) => {
    setAttachments(prev => prev.filter(file => file.id !== fileId));
  };
  
  // Función para formatear fechas
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
  
  // Función para formatear tiempo relativo
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return `${diffSecs} segundos atrás`;
    } else if (diffMins < 60) {
      return `${diffMins} minutos atrás`;
    } else if (diffHours < 24) {
      return `${diffHours} horas atrás`;
    } else if (diffDays < 30) {
      return `${diffDays} días atrás`;
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
  };
  
  // Obtener color por prioridad
  const getPriorityColor = (priority) => {
    const priorityColors = {
      critical: '#EF4444',
      high: '#F59E0B',
      medium: '#3B82F6',
      low: '#10B981'
    };
    
    return priorityColors[priority] || '#3B82F6';
  };
  
  // Formatear categoría
  const formatCategory = (category) => {
    const categories = {
      access: 'Acceso',
      patients: 'Pacientes',
      billing: 'Facturación',
      technical: 'Técnico',
      feature: 'Funcionalidades'
    };
    
    return categories[category] || category;
  };
  
  // Formatear subcategoría
  const formatSubcategory = (subcategory) => {
    const subcategories = {
      'login': 'Inicio de sesión',
      'permissions': 'Permisos',
      'password': 'Contraseña',
      'patient-data': 'Datos de pacientes',
      'records-removal': 'Eliminación de registros',
      'merge-records': 'Fusión de registros',
      'payment-issue': 'Problemas de pago',
      'invoice': 'Facturas',
      'subscription': 'Suscripción'
    };
    
    return subcategories[subcategory] || subcategory;
  };
  
  // Manejar navegación de regreso
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (!isLoaded) {
    return (
      <div className="ticket-response-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando ticket...</p>
        </div>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div className="ticket-response-page error">
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2>Ticket no encontrado</h2>
          <p>El ticket solicitado no existe o no tiene permisos para acceder a él.</p>
          <button className="back-button" onClick={handleGoBack}>
            <i className="fas fa-arrow-left"></i> Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-response-page">
      {/* Cabecera */}
      <div className="response-header">
        <div className="header-actions">
          <button className="back-button" onClick={handleGoBack}>
            <i className="fas fa-arrow-left"></i>
          </button>
          
          <div className="ticket-id">
            <span className="id-label">Ticket</span>
            <span className="id-value">{ticket.id}</span>
          </div>
        </div>
        
        <div className="ticket-status-controls">
          <div className="status-selector">
            <select 
              value={selectedStatus} 
              onChange={handleStatusChange}
              className={`status-select ${selectedStatus}`}
            >
              {availableStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="ticket-priority" style={{ '--priority-color': getPriorityColor(ticket.priority) }}>
            <i className="fas fa-flag"></i>
            <span>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="response-container">
        {/* Panel lateral de información */}
        <div className="info-sidebar">
          <div className="ticket-title-card">
            <h1>{ticket.title}</h1>
            <div className="ticket-meta">
              <div className="meta-item">
                <i className="fas fa-calendar-alt"></i>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>Actualizado {formatTimeAgo(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-header">
              <h3>Información del Usuario</h3>
            </div>
            <div className="info-content">
              <div className="user-profile">
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="user-details">
                  <div className="user-name">{ticket.userName}</div>
                  <div className="user-email">{ticket.userEmail}</div>
                  <div className="user-id">ID: {ticket.userId}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-header">
              <h3>Detalles del Ticket</h3>
            </div>
            <div className="info-content">
              <div className="info-grid">
                <div className="info-item">
                  <div className="item-label">Categoría</div>
                  <div className="item-value">{formatCategory(ticket.category)}</div>
                </div>
                <div className="info-item">
                  <div className="item-label">Subcategoría</div>
                  <div className="item-value">{formatSubcategory(ticket.subcategory)}</div>
                </div>
                <div className="info-item">
                  <div className="item-label">Prioridad</div>
                  <div className="item-value" style={{ color: getPriorityColor(ticket.priority) }}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </div>
                </div>
                <div className="info-item">
                  <div className="item-label">Asignado a</div>
                  <div className="item-value">
                    {ticket.assignedTo === currentUser?.id ? 'Tú' : 'Otro agente'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-header">
              <h3>Notas Internas</h3>
              <button 
                className="toggle-button"
                onClick={() => setShowInternalNotes(!showInternalNotes)}
              >
                <i className={`fas fa-chevron-${showInternalNotes ? 'up' : 'down'}`}></i>
              </button>
            </div>
            {showInternalNotes && (
              <div className="info-content">
                <textarea
                  className="internal-notes-input"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Añadir notas privadas sobre este ticket (solo visibles para el equipo de soporte)"
                  rows={6}
                />
                <div className="notes-hint">
                  <i className="fas fa-info-circle"></i>
                  <span>Las notas internas no son visibles para el usuario</span>
                </div>
              </div>
            )}
          </div>
          
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="info-card">
              <div className="info-header">
                <h3>Archivos Adjuntos</h3>
              </div>
              <div className="info-content">
                <div className="attachments-list">
                  {ticket.attachments.map(file => (
                    <div key={file.id} className="attachment-item">
                      <div className="attachment-icon">
                        <i className={`fas ${
                          file.type.includes('image') ? 'fa-file-image' :
                          file.type.includes('pdf') ? 'fa-file-pdf' :
                          file.type.includes('word') ? 'fa-file-word' :
                          file.type.includes('excel') ? 'fa-file-excel' :
                          'fa-file'
                        }`}></i>
                      </div>
                      <div className="attachment-details">
                        <div className="attachment-name">{file.name}</div>
                        <div className="attachment-size">
                          {(file.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                      <div className="attachment-actions">
                        <button className="attachment-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Área de mensajes y respuesta */}
        <div className="conversation-area">
          {/* Alerta de éxito */}
          {showSuccessAlert && (
            <div className="success-alert">
              <i className="fas fa-check-circle"></i>
              <span>Respuesta enviada correctamente</span>
            </div>
          )}
          
          {/* Mensajes */}
          <div className="messages-container">
            {ticket.messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'support' ? 'support-message' : 'user-message'} ${message.isInternal ? 'internal-message' : ''}`}
              >
                <div className="message-avatar">
                  <i className={`fas ${message.sender === 'support' ? 'fa-headset' : 'fa-user'}`}></i>
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <div className="message-sender">
                      <span className="sender-name">{message.senderName}</span>
                      {message.isInternal && (
                        <span className="internal-badge">
                          <i className="fas fa-lock"></i> Interno
                        </span>
                      )}
                    </div>
                    <div className="message-time">{formatDate(message.timestamp)}</div>
                  </div>
                  <div className="message-body">
                    {message.message}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          
          {/* Formulario de respuesta */}
          <div className="response-form">
            <div className="response-tabs">
              <button 
                className={`tab-button ${!showInternalNotes ? 'active' : ''}`}
                onClick={() => setShowInternalNotes(false)}
              >
                <i className="fas fa-reply"></i>
                <span>Responder al Usuario</span>
              </button>
              <button 
                className={`tab-button ${showInternalNotes ? 'active' : ''}`}
                onClick={() => setShowInternalNotes(true)}
              >
                <i className="fas fa-lock"></i>
                <span>Notas Internas</span>
              </button>
            </div>
            
            {!showInternalNotes ? (
              <div className="public-response">
                <textarea
                  ref={responseInputRef}
                  className="response-input"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Escribe tu respuesta al usuario..."
                  rows={6}
                />
                
                {/* Archivos adjuntos */}
                {attachments.length > 0 && (
                  <div className="response-attachments">
                    <div className="attachments-header">
                      <h4>Archivos adjuntos</h4>
                    </div>
                    <div className="attachments-grid">
                      {attachments.map(file => (
                        <div key={file.id} className="attached-file">
                          <div className="file-preview">
                            {file.preview ? (
                              <img src={file.preview} alt={file.name} />
                            ) : (
                              <i className={`fas ${
                                file.type.includes('pdf') ? 'fa-file-pdf' :
                                file.type.includes('word') ? 'fa-file-word' :
                                file.type.includes('excel') ? 'fa-file-excel' :
                                'fa-file'
                              }`}></i>
                            )}
                          </div>
                          <div className="file-info">
                            <div className="file-name">{file.name}</div>
                            <div className="file-size">
                              {(file.size / 1024).toFixed(0)} KB
                            </div>
                          </div>
                          <button 
                            className="remove-file-button"
                            onClick={() => handleRemoveFile(file.id)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="response-actions">
                  <div className="action-buttons">
                    <button 
                      className="attach-button"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <i className="fas fa-paperclip"></i>
                      <span>Adjuntar</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        multiple
                        onChange={handleFileChange}
                      />
                    </button>
                    
                    <button 
                      className="template-button"
                      title="Insertar plantilla de respuesta"
                    >
                      <i className="fas fa-clipboard-list"></i>
                      <span>Plantilla</span>
                    </button>
                  </div>
                  
                  <button 
                    className="send-button"
                    onClick={handleSendResponse}
                    disabled={!responseText.trim() || isSending}
                  >
                    {isSending ? (
                      <>
                        <span className="spinner-icon"></span>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Enviar Respuesta</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="internal-notes-editor">
                <textarea
                  className="notes-input"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Añadir notas privadas sobre este ticket (solo visibles para el equipo de soporte)"
                  rows={6}
                />
                <div className="notes-actions">
                  <button 
                    className="save-notes-button"
                    onClick={() => {
                      // Guardar notas (simulado)
                      setShowSuccessAlert(true);
                      setTimeout(() => setShowSuccessAlert(false), 3000);
                    }}
                  >
                    <i className="fas fa-save"></i>
                    <span>Guardar Notas</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};