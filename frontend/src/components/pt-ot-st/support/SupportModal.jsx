import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../../styles/developer/support/SupportModal.scss';

const SupportModal = ({ isOpen, onClose, userRole }) => {
  // Estados para controlar los pasos y animaciones
  const [activeStep, setActiveStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(null);
  const [ticketType, setTicketType] = useState(null);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [closeAnimation, setCloseAnimation] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Referencias para manipulación del DOM y animaciones
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const descriptionRef = useRef(null);
  const searchInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const confettiRef = useRef(null);
  const animationTimerRef = useRef(null);
  const searchTimerRef = useRef(null);
  
  // Opciones de soporte - categorizadas con diseño premium
  const supportCategories = [
    {
      id: 'access',
      title: 'Account & Access',
      icon: 'shield-alt',
      color: '#4F46E5',
      gradient: 'linear-gradient(135deg, #4F46E5, #818CF8)',
      options: [
        {
          id: 'login',
          title: 'Login Issues',
          icon: 'key',
          description: 'Problems with logging into your account',
          color: '#4F46E5'
        },
        {
          id: 'permissions',
          title: 'Permission Problems',
          icon: 'lock',
          description: 'Access denied or missing permissions',
          color: '#6366F1'
        },
        {
          id: 'password',
          title: 'Password Reset',
          icon: 'sync',
          description: 'Help with resetting your password',
          color: '#818CF8'
        }
      ]
    },
    {
      id: 'patients',
      title: 'Patient Management',
      icon: 'user-injured',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981, #34D399)',
      options: [
        {
          id: 'patient-data',
          title: 'Patient Data',
          icon: 'database',
          description: 'Issues with patient records or information',
          color: '#059669'
        },
        {
          id: 'records-removal',
          title: 'Delete Records',
          icon: 'trash-alt',
          description: 'Request removal of patient data',
          color: '#10B981'
        },
        {
          id: 'merge-records',
          title: 'Merge Records',
          icon: 'object-group',
          description: 'Combine duplicate patient records',
          color: '#34D399'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: 'credit-card',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
      options: [
        {
          id: 'payment-issue',
          title: 'Payment Problems',
          icon: 'money-bill-wave',
          description: 'Issues with processing payments',
          color: '#D97706'
        },
        {
          id: 'invoice',
          title: 'Invoice Questions',
          icon: 'file-invoice-dollar',
          description: 'Help with invoice details or corrections',
          color: '#F59E0B'
        },
        {
          id: 'subscription',
          title: 'Subscription Issues',
          icon: 'sync-alt',
          description: 'Problems with your service subscription',
          color: '#FBBF24'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: 'tools',
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
      options: [
        {
          id: 'error',
          title: 'System Errors',
          icon: 'exclamation-triangle',
          description: 'Error messages or system crashes',
          color: '#DB2777'
        },
        {
          id: 'performance',
          title: 'Performance Issues',
          icon: 'tachometer-alt',
          description: 'System running slowly or timing out',
          color: '#EC4899'
        },
        {
          id: 'compatibility',
          title: 'Compatibility Problems',
          icon: 'laptop',
          description: 'Issues with browser or device compatibility',
          color: '#F472B6'
        }
      ]
    },
    {
      id: 'feature',
      title: 'Feature Requests',
      icon: 'lightbulb',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
      options: [
        {
          id: 'new-feature',
          title: 'New Feature',
          icon: 'plus-circle',
          description: 'Suggest a new feature or functionality',
          color: '#7C3AED'
        },
        {
          id: 'enhancement',
          title: 'Enhancement',
          icon: 'arrow-up',
          description: 'Improvements to existing features',
          color: '#8B5CF6'
        },
        {
          id: 'integration',
          title: 'Integration Request',
          icon: 'plug',
          description: 'Request for new third-party integrations',
          color: '#A78BFA'
        }
      ]
    }
  ];
  
  // FAQ items para búsqueda rápida
  const faqItems = [
    {
      id: 'faq-1',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login screen and follow the instructions sent to your email. If you don\'t receive the email, check your spam folder or contact support.',
      category: 'access'
    },
    {
      id: 'faq-2',
      question: 'Why can\'t I access certain patient records?',
      answer: 'Access to patient records is based on your role permissions. Contact your administrator if you need additional access for your role.',
      category: 'access'
    },
    {
      id: 'faq-3',
      question: 'How do I export patient data for reporting?',
      answer: 'Navigate to Patients > Reports > Export. Select your desired format and date range, then click "Generate Report".',
      category: 'patients'
    },
    {
      id: 'faq-4',
      question: 'The system is running slowly. What should I do?',
      answer: 'Try clearing your browser cache, checking your internet connection, or restarting your browser. If issues persist, contact technical support.',
      category: 'technical'
    },
    {
      id: 'faq-5',
      question: 'How do I update patient insurance information?',
      answer: 'Navigate to the patient profile, select the "Insurance" tab, and click "Edit" to update the information. Don\'t forget to save your changes.',
      category: 'patients'
    },
    {
      id: 'faq-6',
      question: 'Can I delete a patient record?',
      answer: 'For compliance reasons, patient records cannot be fully deleted. However, they can be archived or marked as inactive. Contact support for assistance.',
      category: 'patients'
    },
    {
      id: 'faq-7',
      question: 'How do I generate an invoice?',
      answer: 'Go to Billing > New Invoice, select the patient, add services, and click "Generate". You can then send it via email or print it.',
      category: 'billing'
    },
    {
      id: 'faq-8',
      question: 'What browsers are supported?',
      answer: 'TherapySync works best with Chrome, Firefox, Edge, and Safari (latest 2 versions). Internet Explorer is not supported.',
      category: 'technical'
    }
  ];
  
  // Filtrar resultados de búsqueda basados en la consulta
  const getFilteredResults = useCallback((query) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    
    return faqItems.filter(item => 
      item.question.toLowerCase().includes(lowerQuery) || 
      item.answer.toLowerCase().includes(lowerQuery)
    );
  }, []);
  
  // Manejar cambios en la búsqueda con debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    clearTimeout(searchTimerRef.current);
    
    if (value.trim()) {
      // Activar isSearching inmediatamente para UI responsiva
      if (!isSearching) setIsSearching(true);
      
      // Debounce para evitar demasiadas búsquedas
      searchTimerRef.current = setTimeout(() => {
        const results = getFilteredResults(value);
        setSearchResults(results);
      }, 300);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };
  
  // Reiniciar búsqueda
  const handleResetSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Efectos para manejar el estado del modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Reiniciar estados cuando se abre el modal
      setCloseAnimation(false);
      
      // Focus trap para accesibilidad
      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          // Implementar focus trap...
        } else if (e.key === 'Escape') {
          handleClose();
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleTabKey);
        
        // Limpiar temporizadores
        clearTimeout(animationTimerRef.current);
        clearTimeout(searchTimerRef.current);
      };
    }
  }, [isOpen]);
  
  // Efecto para focus en el campo de descripción
  useEffect(() => {
    if (activeStep === 2 && descriptionRef.current) {
      setTimeout(() => {
        descriptionRef.current.focus();
      }, 300); // Retraso para animaciones
    }
  }, [activeStep]);
  
  // Manejar cierre del modal con animación
  const handleClose = () => {
    if (isSubmitting) return;
    
    setCloseAnimation(true);
    
    // Esperar a que termine la animación
    animationTimerRef.current = setTimeout(() => {
      onClose();
      
      // Reiniciar estados después de cerrar
      setTimeout(() => {
        setActiveStep(0);
        setPreviousStep(null);
        setTicketType(null);
        setDescription('');
        setPriority('medium');
        setAttachments([]);
        setIsSuccess(false);
        setTicketId('');
        setSearchQuery('');
        setIsSearching(false);
        setSearchResults([]);
        setShowConfetti(false);
      }, 300);
    }, 300);
  };
  
  // Manejar clic fuera del modal para cerrar
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };
  
  // Navegar al paso anterior
  const handleBack = () => {
    if (activeStep > 0) {
      setPreviousStep(activeStep);
      setTransitioning(true);
      
      setTimeout(() => {
        setActiveStep(prev => prev - 1);
        
        // Scroll hacia arriba con animación
        if (modalContentRef.current) {
          modalContentRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
        
        setTimeout(() => {
          setTransitioning(false);
        }, 300);
      }, 200);
    } else {
      handleClose();
    }
  };
  
  // Seleccionar una categoría
  const handleSelectCategory = (category) => {
    setTicketType(category);
    navigateToStep(1);
  };
  
  // Seleccionar un tipo de ticket específico
  const handleSelectOption = (option) => {
    setTicketType({
      ...ticketType,
      selectedOption: option
    });
    navigateToStep(2);
  };
  
  // Función para navegar entre pasos con animación
  const navigateToStep = (step) => {
    setPreviousStep(activeStep);
    setTransitioning(true);
    
    setTimeout(() => {
      setActiveStep(step);
      
      // Scroll hacia arriba con animación
      if (modalContentRef.current) {
        modalContentRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      setTimeout(() => {
        setTransitioning(false);
      }, 300);
    }, 200);
  };
  
  // Manejar cambio de prioridad
  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
  };
  
  // Manejar archivos adjuntos
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    if (newFiles.length > 0) {
      // Validar tamaño y tipo de archivo
      const validFiles = newFiles.filter(file => {
        // Validar tamaño (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" exceeds the 10MB size limit.`);
          return false;
        }
        
        // Validar tipo (permitir documentos e imágenes)
        const allowedTypes = [
          'image/jpeg', 'image/png', 'image/gif',
          'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          alert(`File type "${file.type}" is not supported.`);
          return false;
        }
        
        return true;
      });
      
      // Agregar metadatos para visualización
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
    setAttachments(prev => {
      const updatedFiles = prev.filter(file => file.id !== fileId);
      return updatedFiles;
    });
  };
  
  // Ver previsualización de archivo adjunto
  const handleViewAttachment = (file) => {
    setSelectedAttachment(file);
  };
  
  // Cerrar previsualización
  const handleClosePreview = () => {
    setSelectedAttachment(null);
  };
  
  // Manejar eventos de arrastrar y soltar
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Manejar soltar archivos
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const event = { target: { files: droppedFiles } };
      handleFileChange(event);
    }
  };
  
  // Simular clic en input de archivo
  const handleBrowseFiles = () => {
    fileInputRef.current.click();
  };
  
  // Enviar ticket
  const handleSubmitTicket = () => {
    if (!description.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simular envío al servidor
    setTimeout(() => {
      // Generar ID de ticket
      const randomId = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(randomId);
      
      // Actualizar estados
      setIsSubmitting(false);
      
      // Mostrar animación de éxito con retraso para permitir la transición
      setTimeout(() => {
        setIsSuccess(true);
        setShowConfetti(true);
        
        // Ocultar confetti después de 6 segundos
        setTimeout(() => {
          setShowConfetti(false);
        }, 6000);
      }, 300);
    }, 2000);
  };
  
  // Iniciar un nuevo ticket
  const handleStartNewTicket = () => {
    setActiveStep(0);
    setPreviousStep(null);
    setTicketType(null);
    setDescription('');
    setPriority('medium');
    setAttachments([]);
    setIsSuccess(false);
    setTicketId('');
  };
  
  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;
  
  // Clases dinámicas para animaciones
  const modalClasses = [
    'support-modal-overlay',
    closeAnimation ? 'closing' : '',
    isSuccess ? 'success-mode' : ''
  ].filter(Boolean).join(' ');
  
  const contentClasses = [
    'support-modal-content',
    transitioning ? 'transitioning' : '',
    activeStep === 0 ? 'step-categories' : '',
    activeStep === 1 ? 'step-options' : '',
    activeStep === 2 ? 'step-details' : '',
    isSuccess ? 'success-view' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={modalClasses} onClick={handleOutsideClick}>
      {/* Efecto de confeti al completar */}
      {showConfetti && (
        <div className="confetti-container" ref={confettiRef}>
          {[...Array(150)].map((_, i) => (
            <div 
              key={i} 
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 6 + 3}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Modal principal */}
      <div className="support-modal" ref={modalRef}>
        {/* Decoración de fondo */}
        <div className="modal-background-decoration">
          <div className="modal-bg-gradient"></div>
          <div className="modal-bg-dots"></div>
          <div className="modal-bg-waves"></div>
        </div>
        
        {/* Cabecera del modal */}
        <div className="support-modal-header">
          <div className="header-controls">
            <button 
              className="header-button back-button" 
              onClick={handleBack}
              aria-label={activeStep > 0 ? "Go back" : "Close"}
            >
              <div className="button-icon-wrapper">
                <i className={`fas fa-${activeStep > 0 ? 'arrow-left' : 'times'}`}></i>
              </div>
            </button>
            
            {/* Indicador de pasos */}
            {!isSuccess && (
              <div className="step-indicator">
                <div className="step-dots">
                  {[0, 1, 2].map(step => (
                    <div 
                      key={step} 
                      className={`step-dot ${step === activeStep ? 'active' : step < activeStep ? 'completed' : ''}`}
                    >
                      {step < activeStep ? (
                        <i className="fas fa-check"></i>
                      ) : (
                        <span>{step + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="step-progress">
                  <div 
                    className="step-progress-bar" 
                    style={{ width: `${activeStep * 50}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="header-title">
            {isSuccess ? (
              <h2>Support Ticket Submitted</h2>
            ) : (
              <h2>
                {activeStep === 0 && "Help & Support Center"}
                {activeStep === 1 && ticketType && ticketType.title}
                {activeStep === 2 && "Create Support Ticket"}
              </h2>
            )}
          </div>
          
          <div className="header-decoration">
            <div className="header-decoration-icon">
              <i className="fas fa-headset"></i>
            </div>
          </div>
        </div>
        
        {/* Contenido principal del modal */}
        <div className={contentClasses} ref={modalContentRef}>
          {/* Paso 0: Seleccionar categoría */}
          {activeStep === 0 && (
            <div className="support-step support-categories-step">
              {/* Búsqueda */}
              <div className="search-container">
                <div className={`search-input-wrapper ${isSearching ? 'searching' : ''}`}>
                  <div className="search-icon">
                    <i className="fas fa-search"></i>
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for help, FAQs, or solutions..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button 
                      className="search-clear-button" 
                      onClick={handleResetSearch}
                      aria-label="Clear search"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                
                {!isSearching && (
                  <div className="categories-intro">
                    <p>Select a category below to get help with your issue or request:</p>
                  </div>
                )}
              </div>
              
              {/* Resultados de búsqueda */}
              {isSearching && (
                <div className="search-results">
                  <h3>
                    <i className="fas fa-search-plus"></i>
                    Search Results 
                    <span className="result-count">
                      ({searchResults.length} {searchResults.length === 1 ? 'result' : 'results'})
                    </span>
                  </h3>
                  
                  {searchResults.length > 0 ? (
                    <div className="faq-results">
                      {searchResults.map((item) => (
                        <div key={item.id} className="faq-item">
                          <div className="faq-question">
                            <div className="question-icon">
                              <i className="fas fa-question-circle"></i>
                            </div>
                            <h4>{item.question}</h4>
                          </div>
                          <div className="faq-answer">
                            <p>{item.answer}</p>
                          </div>
                          <div className="faq-item-footer">
                            {item.category && (
                              <div className="faq-category">
                                <span className="category-label">Category:</span>
                                <span className="category-value">
                                  {supportCategories.find(c => c.id === item.category)?.title || 'General'}
                                </span>
                              </div>
                            )}
                            <button 
                              className="related-ticket-button"
                              onClick={() => {
                                const category = supportCategories.find(c => c.id === item.category);
                                if (category) {
                                  handleSelectCategory(category);
                                }
                              }}
                            >
                              <i className="fas fa-ticket-alt"></i>
                              <span>Create Related Ticket</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-results">
                      <div className="no-results-icon">
                        <i className="fas fa-search-minus"></i>
                      </div>
                      <h4>No results found for "{searchQuery}"</h4>
                      <p>Try different keywords or browse the categories below.</p>
                    </div>
                  )}
                  
                  <div className="search-footer">
                    <button className="reset-search-button" onClick={handleResetSearch}>
                      <i className="fas fa-arrow-left"></i>
                      <span>Back to Categories</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Categorías de soporte */}
              {!isSearching && (
                <div className="support-categories">
                  {supportCategories.map((category) => (
                    <div 
                      key={category.id}
                      className="category-card"
                      onClick={() => handleSelectCategory(category)}
                      style={{ '--category-color': category.color, '--category-gradient': category.gradient }}
                    >
                      <div className="category-icon">
                        <i className={`fas fa-${category.icon}`}></i>
                      </div>
                      <div className="category-content">
                        <h3>{category.title}</h3>
                        <ul className="category-examples">
                          {category.options.slice(0, 2).map((option) => (
                            <li key={option.id}>
                              <i className={`fas fa-${option.icon}`}></i>
                              <span>{option.title}</span>
                            </li>
                          ))}
                          {category.options.length > 2 && (
                            <li className="more-options">
                              <span>+{category.options.length - 2} more</span>
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="category-arrow">
                        <i className="fas fa-chevron-right"></i>
                      </div>
                      <div className="card-glare"></div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Contacto directo */}
              <div className="direct-contact-section">
                <div className="section-separator">
                  <span>OR</span>
                </div>
                <div className="contact-methods">
                  <h4>Contact us directly</h4>
                  <div className="contact-options">
                    <a href="mailto:support@therapysync.com" className="contact-option">
                      <div className="contact-option-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="contact-option-details">
                        <span className="contact-method">Email Support</span>
                        <span className="contact-value">support@therapysync.com</span>
                      </div>
                    </a>
                    <a href="tel:+18005551234" className="contact-option">
                      <div className="contact-option-icon">
                        <i className="fas fa-phone-alt"></i>
                      </div>
                      <div className="contact-option-details">
                        <span className="contact-method">Technical Support</span>
                        <span className="contact-value">+1 (800) 555-1234</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Paso 1: Seleccionar opción específica */}
          {activeStep === 1 && ticketType && (
            <div className="support-step support-options-step">
              <div className="selected-category">
                <div 
                  className="category-header"
                  style={{ '--category-color': ticketType.color, '--category-gradient': ticketType.gradient }}
                ><div className="category-icon-large">
                <i className={`fas fa-${ticketType.icon}`}></i>
              </div>
              <h3>{ticketType.title}</h3>
            </div>
            <p className="category-description">
              Please select the specific issue you're experiencing:
            </p>
          </div>
          
          <div className="support-options">
            {ticketType.options.map((option) => (
              <div 
                key={option.id}
                className="option-card"
                onClick={() => handleSelectOption(option)}
                style={{ '--option-color': option.color }}
              >
                <div className="option-content">
                  <div className="option-icon">
                    <i className={`fas fa-${option.icon}`}></i>
                  </div>
                  <div className="option-details">
                    <h4>{option.title}</h4>
                    <p>{option.description}</p>
                  </div>
                </div>
                <div className="option-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
                <div className="option-glow"></div>
              </div>
            ))}
            
            <div 
              className="option-card custom-option"
              onClick={() => {
                // Crear una opción personalizada
                handleSelectOption({
                  id: 'custom',
                  title: 'Custom Request',
                  icon: 'comment-alt',
                  description: 'Other issue not listed above',
                  color: ticketType.color
                });
              }}
            >
              <div className="option-content">
                <div className="option-icon">
                  <i className="fas fa-comment-alt"></i>
                </div>
                <div className="option-details">
                  <h4>Other Issue</h4>
                  <p>Have a different issue? Tell us about it</p>
                </div>
              </div>
              <div className="option-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button className="back-button" onClick={handleBack}>
              <i className="fas fa-arrow-left"></i>
              <span>Back to Categories</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Paso 2: Detalles del ticket */}
      {activeStep === 2 && ticketType && ticketType.selectedOption && (
        <div className="support-step support-details-step">
          <div className="ticket-header">
            <div 
              className="ticket-type"
              style={{ 
                '--ticket-color': ticketType.selectedOption.color || ticketType.color
              }}
            >
              <div className="ticket-icon">
                <i className={`fas fa-${ticketType.selectedOption.icon || ticketType.icon}`}></i>
              </div>
              <div className="ticket-type-details">
                <h3>{ticketType.selectedOption.title}</h3>
                <p className="ticket-category">{ticketType.title}</p>
              </div>
            </div>
          </div>
          
          <div className="ticket-form">
            {/* Descripción del problema */}
            <div className="form-group description-group">
              <label htmlFor="ticketDescription">
                <i className="fas fa-pencil-alt"></i>
                <span>Describe your issue</span>
                <span className="required-indicator">*</span>
              </label>
              <div className="textarea-wrapper">
                <textarea 
                  id="ticketDescription"
                  ref={descriptionRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide as much detail as possible to help us understand and resolve your issue quickly..."
                  rows={5}
                  required
                ></textarea>
                <div className="textarea-decoration"></div>
              </div>
              {description.length > 0 && (
                <div className="character-count">
                  <span>{description.length} characters</span>
                </div>
              )}
            </div>
            
            {/* Prioridad */}
            <div className="form-group priority-group">
              <label>
                <i className="fas fa-flag"></i>
                <span>Priority Level</span>
              </label>
              <div className="priority-options">
                <div 
                  className={`priority-option ${priority === 'low' ? 'active' : ''}`}
                  onClick={() => handlePriorityChange('low')}
                >
                  <div className="priority-icon low">
                    <i className="fas fa-angle-down"></i>
                  </div>
                  <div className="priority-details">
                    <span className="priority-name">Low</span>
                    <span className="priority-description">Minor issue, not urgent</span>
                  </div>
                </div>
                <div 
                  className={`priority-option ${priority === 'medium' ? 'active' : ''}`}
                  onClick={() => handlePriorityChange('medium')}
                >
                  <div className="priority-icon medium">
                    <i className="fas fa-equals"></i>
                  </div>
                  <div className="priority-details">
                    <span className="priority-name">Medium</span>
                    <span className="priority-description">Standard priority</span>
                  </div>
                </div>
                <div 
                  className={`priority-option ${priority === 'high' ? 'active' : ''}`}
                  onClick={() => handlePriorityChange('high')}
                >
                  <div className="priority-icon high">
                    <i className="fas fa-angle-up"></i>
                  </div>
                  <div className="priority-details">
                    <span className="priority-name">High</span>
                    <span className="priority-description">Urgent issue</span>
                  </div>
                </div>
                <div 
                  className={`priority-option ${priority === 'critical' ? 'active' : ''}`}
                  onClick={() => handlePriorityChange('critical')}
                >
                  <div className="priority-icon critical">
                    <i className="fas fa-exclamation"></i>
                  </div>
                  <div className="priority-details">
                    <span className="priority-name">Critical</span>
                    <span className="priority-description">System down/blocking</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Archivos adjuntos */}
            <div className="form-group attachments-group">
              <label>
                <i className="fas fa-paperclip"></i>
                <span>Attachments</span>
                <span className="optional-indicator">(Optional)</span>
              </label>
              
              {/* Área de arrastrar y soltar */}
              <div 
                className={`dropzone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className="dropzone-content">
                  <div className="dropzone-icon">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <div className="dropzone-text">
                    <p>Drag & drop files here or</p>
                    <button 
                      type="button" 
                      className="browse-button"
                      onClick={handleBrowseFiles}
                    >
                      Browse Files
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      style={{ display: 'none' }}
                      accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain"
                    />
                  </div>
                  <p className="dropzone-help">
                    Max 5 files, 10MB each (Images, PDFs, Documents)
                  </p>
                </div>
              </div>
              
              {/* Lista de archivos adjuntos */}
              {attachments.length > 0 && (
                <div className="attachments-list">
                  <h4>Attached Files ({attachments.length})</h4>
                  <div className="attachment-items">
                    {attachments.map((file) => (
                      <div key={file.id} className="attachment-item">
                        <div className="attachment-preview">
                          {file.preview ? (
                            <img 
                              src={file.preview} 
                              alt={file.name}
                              onClick={() => handleViewAttachment(file)}
                            />
                          ) : (
                            <div className="file-icon">
                              <i className={`fas ${
                                file.type.includes('pdf') ? 'fa-file-pdf' :
                                file.type.includes('word') ? 'fa-file-word' :
                                file.type.includes('excel') || file.type.includes('sheet') ? 'fa-file-excel' :
                                file.type.includes('text') ? 'fa-file-alt' :
                                'fa-file'
                              }`}></i>
                            </div>
                          )}
                        </div>
                        <div className="attachment-details">
                          <span className="attachment-name" title={file.name}>
                            {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
                          </span>
                          <span className="attachment-size">
                            {file.size < 1024 ? `${file.size} B` :
                            file.size < 1048576 ? `${Math.round(file.size / 1024)} KB` :
                            `${Math.round(file.size / 1048576 * 10) / 10} MB`}
                          </span>
                        </div>
                        <div className="attachment-actions">
                          {file.preview && (
                            <button 
                              type="button"
                              className="view-button"
                              onClick={() => handleViewAttachment(file)}
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          )}
                          <button 
                            type="button"
                            className="remove-button"
                            onClick={() => handleRemoveFile(file.id)}
                            title="Remove"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Acciones del formulario */}
            <div className="form-actions">
              <button 
                type="button"
                className="back-button"
                onClick={handleBack}
              >
                <i className="fas fa-arrow-left"></i>
                <span>Back</span>
              </button>
              
              <button 
                type="button"
                className={`submit-button ${isSubmitting ? 'submitting' : ''} ${!description.trim() ? 'disabled' : ''}`}
                onClick={handleSubmitTicket}
                disabled={isSubmitting || !description.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner">
                      <div className="spinner-icon"></div>
                    </div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>Submit Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Vista de éxito */}
      {isSuccess && (
        <div className="support-step success-step">
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark-circle-bg"></div>
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </div>
          
          <div className="success-content">
            <h3>Your support ticket has been successfully submitted!</h3>
            
            <div className="ticket-summary">
              <div className="ticket-id-container">
                <div className="ticket-id-label">Ticket ID</div>
                <div className="ticket-id-value">
                  <span>{ticketId}</span>
                  <button 
                    className="copy-button" 
                    onClick={() => {
                      navigator.clipboard.writeText(ticketId);
                      // Mostrar feedback visual
                      document.querySelector('.copy-button').classList.add('copied');
                      setTimeout(() => {
                        document.querySelector('.copy-button').classList.remove('copied');
                      }, 2000);
                    }}
                  >
                    <i className="fas fa-copy"></i>
                    <span className="tooltip-text">Copy</span>
                  </button>
                </div>
              </div>
              
              <div className="ticket-details">
                <div className="ticket-detail">
                  <div className="detail-label">Category</div>
                  <div className="detail-value">
                    <i className={`fas fa-${ticketType.icon}`} style={{ color: ticketType.color }}></i>
                    <span>{ticketType.title}</span>
                  </div>
                </div>
                
                <div className="ticket-detail">
                  <div className="detail-label">Issue Type</div>
                  <div className="detail-value">
                    <i className={`fas fa-${ticketType.selectedOption.icon}`} style={{ color: ticketType.selectedOption.color }}></i>
                    <span>{ticketType.selectedOption.title}</span>
                  </div>
                </div>
                
                <div className="ticket-detail">
                  <div className="detail-label">Priority</div>
                  <div className="detail-value">
                    <div className={`priority-indicator ${priority}`}>
                      <i className={`fas ${
                        priority === 'low' ? 'fa-angle-down' :
                        priority === 'medium' ? 'fa-equals' :
                        priority === 'high' ? 'fa-angle-up' :
                        'fa-exclamation'
                      }`}></i>
                      <span>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="ticket-detail">
                  <div className="detail-label">Submission Time</div>
                  <div className="detail-value">
                    <i className="fas fa-clock"></i>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="ticket-description">
                <div className="description-label">Description</div>
                <div className="description-value">
                  {description}
                </div>
              </div>
              
              {attachments.length > 0 && (
                <div className="ticket-attachments">
                  <div className="attachments-label">
                    <i className="fas fa-paperclip"></i>
                    <span>Attachments</span>
                  </div>
                  <div className="attachments-value">
                    {attachments.map((file, index) => (
                      <span key={file.id} className="attachment-name">
                        {file.name}
                        {index < attachments.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="what-happens-next">
              <h4>What Happens Next?</h4>
              <div className="steps-container">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h5>Confirmation Email</h5>
                    <p>You'll receive a confirmation email with your ticket details.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h5>Support Review</h5>
                    <p>Our support team will review your ticket and begin working on a solution.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h5>Resolution</h5>
                    <p>We'll contact you via email with updates or to request additional information.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="support-response-time">
              <div className="response-time-icon">
                <i className="fas fa-stopwatch"></i>
              </div>
              <div className="response-time-details">
                <h5>Expected Response Time</h5>
                <p>
                  {priority === 'critical' ? 'Within 1 hour' :
                   priority === 'high' ? 'Within 4 hours' :
                   priority === 'medium' ? 'Within 24 hours' :
                   'Within 48 hours'}
                </p>
              </div>
            </div>
            
            <div className="success-actions">
              <button 
                className="close-button"
                onClick={handleClose}
              >
                <i className="fas fa-check"></i>
                <span>Done</span>
              </button>
              
              <button 
                className="new-ticket-button"
                onClick={handleStartNewTicket}
              >
                <i className="fas fa-plus"></i>
                <span>Submit Another Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Previsualización de archivo adjunto */}
      {selectedAttachment && (
        <div className="attachment-preview-modal">
          <div className="preview-header">
            <h4>{selectedAttachment.name}</h4>
            <button 
              className="close-preview-button"
              onClick={handleClosePreview}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="preview-content">
            {selectedAttachment.preview ? (
              <img 
                src={selectedAttachment.preview} 
                alt={selectedAttachment.name}
                className="preview-image"
              />
            ) : (
              <div className="preview-file-icon">
                <i className={`fas ${
                  selectedAttachment.type.includes('pdf') ? 'fa-file-pdf' :
                  selectedAttachment.type.includes('word') ? 'fa-file-word' :
                  selectedAttachment.type.includes('excel') || selectedAttachment.type.includes('sheet') ? 'fa-file-excel' :
                  selectedAttachment.type.includes('text') ? 'fa-file-alt' :
                  'fa-file'
                }`}></i>
                <p>Preview not available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    
    {/* Footer del modal */}
    <div className="support-modal-footer">
      <div className="footer-decoration">
        <div className="footer-dots">
          <span className="footer-dot"></span>
          <span className="footer-dot"></span>
          <span className="footer-dot"></span>
        </div>
      </div>
      
      <div className="support-status">
        <div className="status-indicator">
          <div className="status-dot online"></div>
          <span>Support team online</span>
        </div>
        
        <div className="response-time">
          <i className="fas fa-clock"></i>
          <span>Average response time: <strong>30 minutes</strong></span>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default SupportModal;