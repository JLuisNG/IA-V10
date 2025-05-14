import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../login/AuthContext';
import '../../../styles/developer/support/UserSupportModule.scss';

const UserSupportModule = ({ isOpen, onClose }) => {
  // Authentication context for user info
  const { currentUser } = useAuth();
  
  // States for managing the support interface
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('faq');
  const [activeTicket, setActiveTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [faqItems, setFaqItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState('medium');
  const [attachments, setAttachments] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // success, warning, error
  const [animating, setAnimating] = useState(false);
  const [ticketsCount, setTicketsCount] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });
  
  // References for DOM elements
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const descriptionRef = useRef(null);
  const fileInputRef = useRef(null);
  const replyInputRef = useRef(null);
  const confettiRef = useRef(null);
  
  // Support categories - complete list of potential support issues
  const supportCategories = [
    {
      id: 'account',
      title: 'Account & Access',
      icon: 'shield-alt',
      color: '#4F46E5',
      gradient: 'linear-gradient(135deg, #4F46E5, #818CF8)',
      subCategories: [
        {
          id: 'login',
          title: 'Login Issues',
          icon: 'key',
          description: 'Problems logging into your account',
          examples: [
            'Password not working',
            'Two-factor authentication problems',
            'Account lockouts'
          ]
        },
        {
          id: 'permissions',
          title: 'Permission Problems',
          icon: 'lock',
          description: 'Accessing features or data you should have access to',
          examples: [
            'Missing menu options',
            'Cannot view patient records',
            'Permission denied errors'
          ]
        },
        {
          id: 'account-management',
          title: 'Account Management',
          icon: 'user-cog',
          description: 'Issues with your account settings or profile',
          examples: [
            'Cannot update profile information',
            'Subscription or billing settings',
            'Role or department changes'
          ]
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: 'credit-card',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
      subCategories: [
        {
          id: 'payment',
          title: 'Payment Issues',
          icon: 'money-bill-wave',
          description: 'Problems processing payments or charges',
          examples: [
            'Payment declined',
            'Incorrect charges',
            'Missing payment options'
          ]
        },
        {
          id: 'invoice',
          title: 'Invoice Questions',
          icon: 'file-invoice-dollar',
          description: 'Help with invoice details or corrections',
          examples: [
            'Request invoice copy',
            'Incorrect invoice details',
            'Tax documentation'
          ]
        },
        {
          id: 'insurance',
          title: 'Insurance & Claims',
          icon: 'file-medical',
          description: 'Issues with insurance processing or claims',
          examples: [
            'Insurance rejection',
            'Claim status questions',
            'Insurance integration problems'
          ]
        }
      ]
    },
    {
      id: 'patients',
      title: 'Patient Management',
      icon: 'user-injured',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981, #34D399)',
      subCategories: [
        {
          id: 'patient-records',
          title: 'Patient Records',
          icon: 'folder-open',
          description: 'Issues with patient data or medical records',
          examples: [
            'Cannot create new patient',
            'Missing patient information',
            'Records not showing up'
          ]
        },
        {
          id: 'scheduling',
          title: 'Appointment Scheduling',
          icon: 'calendar-alt',
          description: 'Problems with the calendar or scheduling system',
          examples: [
            'Cannot book appointments',
            'Calendar synchronization issues',
            'Recurring appointments'
          ]
        },
        {
          id: 'patient-portal',
          title: 'Patient Portal',
          icon: 'laptop-medical',
          description: 'Issues with the patient-facing portal',
          examples: [
            'Patient login problems',
            'Document sharing issues',
            'Patient communication'
          ]
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: 'laptop-code',
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
      subCategories: [
        {
          id: 'errors',
          title: 'System Errors',
          icon: 'exclamation-triangle',
          description: 'Error messages or system crashes',
          examples: [
            'Error codes or messages',
            'System freezes or crashes',
            'Data not saving'
          ]
        },
        {
          id: 'performance',
          title: 'Performance Issues',
          icon: 'tachometer-alt',
          description: 'System running slowly or timing out',
          examples: [
            'Pages loading slowly',
            'Timeout errors',
            'Search not working'
          ]
        },
        {
          id: 'integrations',
          title: 'Integrations & APIs',
          icon: 'plug',
          description: 'Problems with connected services or systems',
          examples: [
            'EHR integration issues',
            'Calendar sync problems',
            'External service connections'
          ]
        }
      ]
    },
    {
      id: 'feature',
      title: 'Feature Requests',
      icon: 'lightbulb',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
      subCategories: [
        {
          id: 'new-feature',
          title: 'New Feature',
          icon: 'plus-circle',
          description: 'Suggest a new feature or functionality',
          examples: [
            'System enhancement ideas',
            'Missing functionality',
            'New integrations needed'
          ]
        },
        {
          id: 'enhancement',
          title: 'Enhancement',
          icon: 'arrow-up',
          description: 'Improvements to existing features',
          examples: [
            'User interface improvements',
            'Workflow optimization',
            'Reporting enhancements'
          ]
        },
        {
          id: 'documentation',
          title: 'Documentation Request',
          icon: 'book',
          description: 'Request for documentation or training materials',
          examples: [
            'User guides',
            'Video tutorials',
            'API documentation'
          ]
        }
      ]
    }
  ];
  
  // Effect to initialize data when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Reset some states when opening
      setActiveStep(0);
      setActiveTab('faq');
      setSearchQuery('');
      setIsSearching(false);
      
      // Load FAQ items
      loadFaqItems();
      
      // Load user tickets
      loadUserTickets();
      
      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);
  
  // Effect to focus on appropriate elements when steps change
  useEffect(() => {
    if (activeStep === 2 && descriptionRef.current) {
      setTimeout(() => {
        descriptionRef.current.focus();
      }, 300);
    }
    
    if (activeTicket && replyInputRef.current) {
      setTimeout(() => {
        replyInputRef.current.focus();
      }, 300);
    }
  }, [activeStep, activeTicket]);
  
  // Load FAQ items
  const loadFaqItems = () => {
    setIsLoadingFaqs(true);
    
    // Simulated API call
    setTimeout(() => {
      // Generate sample FAQ items
      const sampleFaqs = [
        {
          id: 'faq-1',
          question: 'How do I reset my password?',
          answer: 'To reset your password, click on the "Forgot Password" link on the login screen. You will receive an email with instructions to reset your password. If you don\'t receive the email, check your spam folder or contact support.',
          category: 'account',
          subCategory: 'login'
        },
        {
          id: 'faq-2',
          question: 'Why am I unable to access certain patient records?',
          answer: 'Access to patient records is based on your role permissions. If you\'re unable to access records you believe you should have access to, please contact your administrator to review your role settings. For security reasons, some sensitive records may require additional permissions.',
          category: 'account',
          subCategory: 'permissions'
        },
        {
          id: 'faq-3',
          question: 'How do I export patient data for reporting?',
          answer: 'To export patient data, navigate to Reports > Export in the main menu. Select the date range and data fields you want to include, then choose your preferred format (CSV, Excel, or PDF). Click "Generate Report" to download the file. Please note that exports containing PHI are logged for compliance purposes.',
          category: 'patients',
          subCategory: 'patient-records'
        },
        {
          id: 'faq-4',
          question: 'The system is running slowly. What should I do?',
          answer: 'If the system is running slowly, first try clearing your browser cache and cookies. Ensure you\'re using a supported browser (Chrome, Firefox, Edge, or Safari). Check your internet connection speed. If problems persist, note the specific actions that are slow and contact technical support with these details.',
          category: 'technical',
          subCategory: 'performance'
        },
        {
          id: 'faq-5',
          question: 'How do I update patient insurance information?',
          answer: 'To update insurance information, open the patient\'s profile and select the "Insurance" tab. Click "Edit" to modify existing information or "Add New" to enter additional insurance. Be sure to complete all required fields and save your changes. The system will automatically verify coverage if the insurer is integrated with our system.',
          category: 'patients',
          subCategory: 'patient-records'
        },
        {
          id: 'faq-6',
          question: 'Can I delete a patient record?',
          answer: 'For compliance with healthcare regulations, patient records cannot be fully deleted. However, you can mark a patient as inactive by opening their profile, clicking the "Status" dropdown, and selecting "Inactive." This will hide them from your active patients list while preserving their data as required by law.',
          category: 'patients',
          subCategory: 'patient-records'
        },
        {
          id: 'faq-7',
          question: 'How do I generate an invoice for a patient?',
          answer: 'To create an invoice, go to Billing > Create Invoice, select the patient from the dropdown, and add services. You can apply insurance if applicable. Preview the invoice to check for accuracy, then click "Generate." The invoice can be printed, emailed to the patient, or saved for later processing.',
          category: 'billing',
          subCategory: 'invoice'
        },
        {
          id: 'faq-8',
          question: 'What browsers are supported by TherapySync?',
          answer: 'TherapySync officially supports the latest two versions of Chrome, Firefox, Edge, and Safari. Internet Explorer is not supported. For optimal performance, we recommend using Google Chrome with automatic updates enabled. Mobile devices are supported through responsive design, but some advanced features work best on desktop.',
          category: 'technical',
          subCategory: 'performance'
        },
        {
          id: 'faq-9',
          question: 'How do I set up recurring appointments?',
          answer: 'To create recurring appointments, start by creating a new appointment and check the "Recurring" box. Set the frequency (weekly, bi-weekly, monthly), the day of the week, and the number of occurrences or end date. Review the generated dates before saving. You can later edit individual occurrences without affecting the series.',
          category: 'patients',
          subCategory: 'scheduling'
        },
        {
          id: 'faq-10',
          question: 'How are insurance claims submitted?',
          answer: 'Insurance claims are automatically generated when you complete a visit and finalize billing. Go to Billing > Claims to review pending claims. Click "Submit" to send electronically to supported payers. For non-integrated insurers, you can export a CMS-1500 form. Track claim status in the Claims Dashboard.',
          category: 'billing',
          subCategory: 'insurance'
        },
        {
          id: 'faq-11',
          question: 'How do I enable two-factor authentication?',
          answer: 'To enable two-factor authentication, go to your user profile and select "Security Settings." Click "Enable 2FA" and choose your preferred method (SMS or authenticator app). Follow the setup instructions to complete the process. Once enabled, you\'ll need your second factor when logging in from new devices.',
          category: 'account',
          subCategory: 'account-management'
        },
        {
          id: 'faq-12',
          question: 'Can I use TherapySync on my mobile device?',
          answer: 'Yes, TherapySync is designed to work on mobile devices through your browser. For the best experience, we recommend using our mobile app available for iOS and Android. The app provides additional features like push notifications, offline mode for certain functions, and optimized touch controls.',
          category: 'technical',
          subCategory: 'performance'
        }
      ];
      
      setFaqItems(sampleFaqs);
      setIsLoadingFaqs(false);
    }, 1000);
  };
  
  // Load user tickets
  const loadUserTickets = () => {
    setIsLoadingTickets(true);
    
    // Simulated API call
    setTimeout(() => {
      // Generate sample user tickets
      const userId = currentUser?.id || Math.floor(Math.random() * 1000);
      const sampleTickets = generateSampleTickets(userId);
      
      setTickets(sampleTickets);
      
      // Count tickets by status
      const counts = {
        total: sampleTickets.length,
        open: sampleTickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
        inProgress: sampleTickets.filter(t => t.status === 'in-progress').length,
        resolved: sampleTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
      };
      
      setTicketsCount(counts);
      setIsLoadingTickets(false);
    }, 1200);
  };
  
  // Generate sample tickets
  const generateSampleTickets = (userId) => {
    const statuses = ['open', 'in-progress', 'pending', 'resolved', 'closed'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    
    // Select random categories and subcategories
    const getRandomCategory = () => {
      const category = supportCategories[Math.floor(Math.random() * supportCategories.length)];
      const subCategory = category.subCategories[Math.floor(Math.random() * category.subCategories.length)];
      return { category, subCategory };
    };
    
    // Generate random date in the past 30 days
    const getRandomDate = (daysAgo = 30) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
      return date.toISOString();
    };
    
    // Sample ticket subjects
    const sampleSubjects = [
      "Cannot access patient records after update",
      "Billing system calculating incorrect amounts",
      "Need help with custom report generation",
      "Calendar sync not working with Google Calendar",
      "Error message when trying to create new appointment",
      "Patient portal login issue for patients",
      "Feature request: Bulk patient import",
      "Dashboard statistics showing incorrect data",
      "Need additional user training for new staff",
      "Mobile app crashing on appointment creation"
    ];
    
    // Sample ticket descriptions
    const sampleDescriptions = [
      "Since the latest update, I've been unable to access patient records. I get an 'Access Denied' error when trying to open them.",
      "The system is calculating incorrect amounts for insurance payments. The discounts aren't being applied correctly to BlueCross patients.",
      "I need help creating a custom report that shows patient attendance rates by therapist over the last quarter.",
      "My appointments created in TherapySync aren't showing up in my Google Calendar even though sync is enabled.",
      "Whenever I try to create a new appointment for recurring visits, I get an error saying 'Date validation failed'.",
      "Several patients have reported they can't log into the patient portal. The reset password feature doesn't seem to be working.",
      "We need a way to import multiple patients at once from our old system. Can you add a CSV import feature?",
      "The dashboard statistics for monthly visits don't match our actual appointment count in the calendar.",
      "We have five new therapists starting next week. Can you provide additional training resources or a live session?",
      "The mobile app keeps crashing when I try to upload document attachments to patient notes."
    ];
    
    // Generate sample support agent responses
    const generateAgentResponses = (ticketCreatedDate, status) => {
      const responses = [];
      
      // If not open, add at least one agent response
      if (status !== 'open') {
        // Add first response 1-8 hours after creation
        const firstResponseHours = Math.floor(Math.random() * 7) + 1;
        const firstResponseDate = new Date(new Date(ticketCreatedDate).getTime() + firstResponseHours * 60 * 60 * 1000);
        
        responses.push({
          id: Math.floor(Math.random() * 10000),
          sender: 'agent',
          agentName: 'Support Team',
          message: "Thank you for contacting TherapySync support. I'm looking into your issue now and will get back to you as soon as possible. Could you please provide more details about what you were doing when this occurred?",
          timestamp: firstResponseDate.toISOString(),
          isSystemMessage: false
        });
        
        // If resolved or closed, add resolution message
        if (status === 'resolved' || status === 'closed') {
          // Add resolution 1-3 days after first response
          const resolutionDays = Math.floor(Math.random() * 2) + 1;
          const resolutionDate = new Date(firstResponseDate.getTime() + resolutionDays * 24 * 60 * 60 * 1000);
          
          responses.push({
            id: Math.floor(Math.random() * 10000),
            sender: 'agent',
            agentName: 'Support Team',
            message: "I'm happy to inform you that we've resolved the issue. It was caused by [technical explanation]. We've implemented a fix and everything should be working correctly now. Please let me know if you experience any further problems.",
            timestamp: resolutionDate.toISOString(),
            isSystemMessage: false
          });
          
          // Add closed system message if closed
          if (status === 'closed') {
            const closedDate = new Date(resolutionDate.getTime() + 12 * 60 * 60 * 1000);
            
            responses.push({
              id: Math.floor(Math.random() * 10000),
              sender: 'system',
              message: "This ticket has been closed. If you continue to experience issues, please create a new support request.",
              timestamp: closedDate.toISOString(),
              isSystemMessage: true
            });
          }
        }
      }
      
      return responses;
    };
    
    // Generate random tickets
    const tickets = [];
    const ticketCount = 5 + Math.floor(Math.random() * 6); // 5-10 tickets
    
    for (let i = 0; i < ticketCount; i++) {
      const { category, subCategory } = getRandomCategory();
      const status = statuses[Math.floor(Math.random() * (i < 2 ? 2 : statuses.length))]; // First few tickets are more likely to be open
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const createdDate = getRandomDate();
      
      // Create initial user message
      const userMessageIndex = i % sampleDescriptions.length;
      const initialMessage = {
        id: Math.floor(Math.random() * 10000),
        sender: 'user',
        message: sampleDescriptions[userMessageIndex],
        timestamp: createdDate,
        isSystemMessage: false
      };
      
      // Generate agent responses based on status
      const agentResponses = generateAgentResponses(createdDate, status);
      
      // Combine all messages
      const messages = [initialMessage, ...agentResponses];
      
      tickets.push({
        id: `TS-${100000 + i}`,
        subject: sampleSubjects[i % sampleSubjects.length],
        category: category.id,
        categoryName: category.title,
        categoryIcon: category.icon,
        categoryColor: category.color,
        subCategory: subCategory.id,
        subCategoryName: subCategory.title,
        status,
        priority,
        createdAt: createdDate,
        updatedAt: messages.length > 1 ? messages[messages.length - 1].timestamp : createdDate,
        messages,
        userId
      });
    }
    
    return tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  
  // Handle closing the modal
  const handleClose = () => {
    // Animate out before actually closing
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      onClose();
      
      // Reset states after closing
      setActiveTicket(null);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setTicketSubject('');
      setTicketDescription('');
      setTicketPriority('medium');
      setAttachments([]);
      setSubmitSuccess(false);
    }, 300);
  };
  
  // Handle click outside modal to close
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };
  
  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveTicket(null);
  };
  
  // Handle step navigation
  const handleNavigateToStep = (step) => {
    setAnimating(true);
    setTimeout(() => {
      setActiveStep(step);
      setAnimating(false);
    }, 300);
  };
  
  // Handle going back to previous step
  const handleBack = () => {
    if (activeStep > 0) {
      setAnimating(true);
      setTimeout(() => {
        setActiveStep(prev => prev - 1);
        setAnimating(false);
      }, 300);
    } else if (activeTicket) {
      setActiveTicket(null);
    } else {
      handleClose();
    }
  };
  
  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      setIsSearching(true);
      
      // Debounce search
      setTimeout(() => {
        const results = [...faqItems.filter(item => 
          item.question.toLowerCase().includes(query.toLowerCase()) || 
          item.answer.toLowerCase().includes(query.toLowerCase())
        )];
        
        setSearchResults(results);
      }, 300);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleNavigateToStep(1);
  };
  
  // Handle subcategory selection
  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
    handleNavigateToStep(2);
  };
  
  // Handle ticket priority selection
  const handlePrioritySelect = (priority) => {
    setTicketPriority(priority);
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // Validate file size and type
      const validFiles = files.filter(file => {
        // Check size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          showNotificationAlert(`File "${file.name}" exceeds the 10MB size limit.`, 'warning');
          return false;
        }
        
        // Check type (images, documents, PDFs)
        const validTypes = [
          'image/jpeg', 'image/png', 'image/gif',
          'application/pdf',
          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain'
        ];
        
        if (!validTypes.includes(file.type)) {
          showNotificationAlert(`File type "${file.type}" is not supported.`, 'warning');
          return false;
        }
        
        return true;
      });
      
      // Add metadata for UI display
      const newAttachments = validFiles.map(file => {
        const isImage = file.type.startsWith('image/');
        return {
          id: `attachment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type,
          preview: isImage ? URL.createObjectURL(file) : null
        };
      });
      
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };
  
  // Handle removing an attachment
  const handleRemoveAttachment = (id) => {
    setAttachments(prev => {
      const updated = prev.filter(attachment => attachment.id !== id);
      
      // Revoke object URL if it's an image
      const removedAttachment = prev.find(attachment => attachment.id === id);
      if (removedAttachment && removedAttachment.preview) {
        URL.revokeObjectURL(removedAttachment.preview);
      }
      
      return updated;
    });
  };
  
  // Handle drag and drop for files
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle file drop
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
  
  // Handle ticket submission
  const handleSubmitTicket = () => {
    // Validate form
    if (!ticketSubject.trim()) {
      showNotificationAlert('Please enter a subject for your ticket.', 'warning');
      return;
    }
    
    if (!ticketDescription.trim()) {
      showNotificationAlert('Please describe your issue in detail.', 'warning');
      return;
    }
    
    // Show submitting state
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate a random ticket ID
      const ticketId = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
      setCreatedTicketId(ticketId);
      
      // Create new ticket
      const newTicket = {
        id: ticketId,
        subject: ticketSubject,
        category: selectedCategory.id,
        categoryName: selectedCategory.title,
        categoryIcon: selectedCategory.icon,
        categoryColor: selectedCategory.color,
        subCategory: selectedSubCategory.id,
        subCategoryName: selectedSubCategory.title,
        status: 'open',
        priority: ticketPriority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: Math.floor(Math.random() * 10000),
            sender: 'user',
            message: ticketDescription,
            timestamp: new Date().toISOString(),
            isSystemMessage: false,
            attachments: attachments.length > 0 ? [...attachments] : undefined
          },
          {
            id: Math.floor(Math.random() * 10000),
            sender: 'system',
            message: 'Ticket created successfully. Our support team will review your request and respond shortly.',
            timestamp: new Date().toISOString(),
            isSystemMessage: true
          }
        ],
        userId: currentUser?.id || 0
      };
      
      // Add to tickets list
      setTickets([newTicket, ...tickets]);
      
      // Update ticket counts
      setTicketsCount(prev => ({
        ...prev,
        total: prev.total + 1,
        open: prev.open + 1
      }));
      
      // Show success state
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Show confetti animation
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      // Show success notification
      showNotificationAlert('Your support ticket has been submitted successfully!', 'success');
    }, 2000);
  };
  
  // Handle send reply
  const handleSendReply = () => {
    if (!replyText.trim() || !activeTicket) return;
    
    // Create updated ticket with new message
    const updatedTicket = {
      ...activeTicket,
      updatedAt: new Date().toISOString(),
      messages: [
        ...activeTicket.messages,
        {
          id: Math.floor(Math.random() * 10000),
          sender: 'user',
          message: replyText,
          timestamp: new Date().toISOString(),
          isSystemMessage: false,
          attachments: attachments.length > 0 ? [...attachments] : undefined
        }
      ]
    };
    
    // Update tickets list
    setTickets(tickets.map(ticket => 
      ticket.id === activeTicket.id ? updatedTicket : ticket
    ));
    
    // Update active ticket
    setActiveTicket(updatedTicket);
    
    // Reset form
    setReplyText('');
    setAttachments([]);
    
    // Show success notification
    showNotificationAlert('Your reply has been sent successfully!', 'success');
    
    // Scroll to bottom of messages
    setTimeout(() => {
      const messagesContainer = document.querySelector('.ticket-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };
  
  // Show notification alert
  const showNotificationAlert = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };
  
  // Handle view ticket
  const handleViewTicket = (ticket) => {
    setActiveTicket(ticket);
    
    // Scroll to top of messages
    setTimeout(() => {
      const messagesContainer = document.querySelector('.ticket-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = 0;
      }
      
      // Focus reply input if ticket is open
      if (replyInputRef.current && ticket.status !== 'closed') {
        replyInputRef.current.focus();
      }
    }, 100);
  };
  
  // Format relative time
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
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 30) {
      return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  // Get color for ticket status
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
        return '#6B7280';
    }
  };
  
  // Get icon for ticket status
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
  
  // Get color for ticket priority
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
  
  // Get icon for ticket priority
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
  
  // Create new ticket button click handler
  const handleCreateTicket = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setTicketSubject('');
    setTicketDescription('');
    setTicketPriority('medium');
    setAttachments([]);
    setSubmitSuccess(false);
    handleNavigateToStep(0);
  };
  
  // Handle after successful submission
  const handleAfterSubmit = () => {
    // Reset form
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setTicketSubject('');
    setTicketDescription('');
    setTicketPriority('medium');
    setAttachments([]);
    setSubmitSuccess(false);
    
    // Navigate to tickets tab
    setActiveTab('tickets');
    handleNavigateToStep(0);
    
    // Find and select the newly created ticket
    const newTicket = tickets.find(ticket => ticket.id === createdTicketId);
    if (newTicket) {
      handleViewTicket(newTicket);
    }
  };
  
  // Handle browser file input click
  const handleBrowseFiles = () => {
    fileInputRef.current.click();
  };
  
  // If not open, don't render
  if (!isOpen) return null;
  
  return (
    <div 
      className={`support-module-overlay ${animating ? 'animating' : ''}`} 
      onClick={handleOutsideClick}
    >
      {/* Confetti animation for success */}
      {showConfetti && (
        <div className="confetti-container" ref={confettiRef}>
          {Array.from({ length: 150 }).map((_, i) => (
            <div 
              key={`confetti-${i}`}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 6 + 3}px`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main modal container */}
      <div 
        className={`support-module ${animating ? 'animating' : ''}`}
        ref={modalRef}
      >
        {/* Decorative background elements */}
        <div className="background-decoration">
          <div className="bg-gradient"></div>
          <div className="bg-dots"></div>
          <div className="bg-waves"></div>
        </div>
        
        {/* Modal header */}
        <div className="support-header">
          <div className="header-left">
            <button 
              className="back-button" 
              onClick={handleBack}
            >
              <i className={`fas fa-${activeStep > 0 || activeTicket ? 'arrow-left' : 'times'}`}></i>
            </button>
            
            <div className="header-title">
              <div className="title-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h2>
                {activeTicket ? 'Ticket Details' : 
                 activeStep === 0 ? 'Help & Support Center' :
                 activeStep === 1 ? (selectedCategory ? selectedCategory.title : 'Select Category') :
                 activeStep === 2 ? 'Create Support Ticket' :
                 'Support Center'}
              </h2>
            </div>
          </div>
          
          <div className="header-right">
            <div className="support-info">
              <div className="support-status online">
                <span className="status-indicator"></span>
                <span className="status-text">Support Available</span>
              </div>
              
              <a href="mailto:support@therapysync.com" className="support-contact">
                <i className="fas fa-envelope"></i>
                <span>support@therapysync.com</span>
              </a>
              
              <a href="tel:+18001234567" className="support-contact">
                <i className="fas fa-phone-alt"></i>
                <span>1-800-123-4567</span>
              </a>
            </div>
            
            <button 
              className="close-button" 
              onClick={handleClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        {/* Main content - varies based on activeStep */}
        <div className={`support-content step-${activeStep} ${activeTicket ? 'viewing-ticket' : ''} ${animating ? 'animating' : ''}`}>
          {/* Step 0: Main tabs and initial selection */}
          {activeStep === 0 && !activeTicket && (
            <>
              {/* Navigation tabs */}
              <div className="support-tabs">
                <button 
                  className={`tab ${activeTab === 'faq' ? 'active' : ''}`}
                  onClick={() => handleTabChange('faq')}
                >
                  <i className="fas fa-question-circle"></i>
                  <span>FAQs & Knowledge Base</span>
                </button>
                
                <button 
                  className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
                  onClick={() => handleTabChange('tickets')}
                >
                  <i className="fas fa-ticket-alt"></i>
                  <span>My Tickets</span>
                  {ticketsCount.total > 0 && (
                    <span className="badge">{ticketsCount.total}</span>
                  )}
                </button>
                
                <button 
                  className="tab create-ticket-tab"
                  onClick={handleCreateTicket}
                >
                  <i className="fas fa-plus-circle"></i>
                  <span>Create New Ticket</span>
                </button>
              </div>
              
              {/* Tab content */}
              <div className="tab-content">
                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="faq-section">
                    {/* Search bar */}
                    <div className="search-container">
                      <div className="search-input-wrapper">
                        <i className="fas fa-search"></i>
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search for help, FAQs, or solutions..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        {searchQuery && (
                          <button 
                            className="clear-search"
                            onClick={() => {
                              setSearchQuery('');
                              setIsSearching(false);
                              setSearchResults([]);
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Search results or categories */}
                    {isSearching ? (
                      <div className="search-results">
                        <h3>
                          <i className="fas fa-search"></i>
                          Search Results 
                          <span className="result-count">({searchResults.length})</span>
                        </h3>
                        
                        {searchResults.length > 0 ? (
                          <div className="faq-items">
                            {searchResults.map(faq => (
                              <div key={faq.id} className="faq-item">
                                <div className="faq-question" onClick={() => {
                                  document.getElementById(faq.id).classList.toggle('expanded');
                                }}>
                                  <i className="fas fa-question-circle"></i>
                                  <h4>{faq.question}</h4>
                                  <i className="fas fa-chevron-down expand-icon"></i>
                                </div>
                                <div id={faq.id} className="faq-answer">
                                  <p>{faq.answer}</p>
                                  
                                  {/* Related category and create ticket button */}
                                  <div className="faq-footer">
                                    {faq.category && (
                                      <div className="faq-category">
                                        <i className={`fas fa-${supportCategories.find(c => c.id === faq.category)?.icon || 'folder'}`}></i>
                                        <span>{supportCategories.find(c => c.id === faq.category)?.title || 'General'}</span>
                                      </div>
                                    )}
                                    
                                    <button 
                                      className="related-ticket-button"
                                      onClick={() => {
                                        const category = supportCategories.find(c => c.id === faq.category);
                                        if (category) {
                                          handleCategorySelect(category);
                                          const subCategory = category.subCategories.find(sc => sc.id === faq.subCategory);
                                          if (subCategory) {
                                            setTimeout(() => {
                                              handleSubCategorySelect(subCategory);
                                            }, 500);
                                          }
                                        }
                                      }}
                                    >
                                      <i className="fas fa-ticket-alt"></i>
                                      <span>Create Related Ticket</span>
                                    </button>
                                  </div>
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
                            <p>Try different keywords or create a support ticket with your question.</p>
                            <button 
                              className="create-ticket-button"
                              onClick={handleCreateTicket}
                            >
                              <i className="fas fa-plus-circle"></i>
                              <span>Create New Ticket</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <h3>Browse Support Categories</h3>
                        
                        <div className="categories-grid">
                          {supportCategories.map(category => (
                            <div 
                              key={category.id}
                              className="category-card"
                              onClick={() => handleCategorySelect(category)}
                              style={{ 
                                '--category-color': category.color,
                                '--category-gradient': category.gradient
                              }}
                            >
                              <div className="category-icon">
                                <i className={`fas fa-${category.icon}`}></i>
                              </div>
                              <div className="category-content">
                                <h4>{category.title}</h4>
                                <ul className="subcategory-list">
                                {category.subCategories.slice(0, 2).map(sub => (
                                    <li key={sub.id}>
                                      <i className={`fas fa-${sub.icon}`}></i>
                                      <span>{sub.title}</span>
                                    </li>
                                  ))}
                                  {category.subCategories.length > 2 && (
                                    <li className="more-items">
                                      +{category.subCategories.length - 2} more options
                                    </li>
                                  )}
                                </ul>
                              </div>
                              <div className="category-arrow">
                                <i className="fas fa-chevron-right"></i>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <h3>Popular FAQs</h3>
                        
                        <div className="faq-items">
                          {isLoadingFaqs ? (
                            <div className="loading-container">
                              <div className="spinner">
                                <div className="spinner-inner"></div>
                              </div>
                              <span>Loading FAQ items...</span>
                            </div>
                          ) : (
                            faqItems.slice(0, 5).map(faq => (
                              <div key={faq.id} className="faq-item">
                                <div className="faq-question" onClick={() => {
                                  document.getElementById(faq.id).classList.toggle('expanded');
                                }}>
                                  <i className="fas fa-question-circle"></i>
                                  <h4>{faq.question}</h4>
                                  <i className="fas fa-chevron-down expand-icon"></i>
                                </div>
                                <div id={faq.id} className="faq-answer">
                                  <p>{faq.answer}</p>
                                  
                                  <div className="faq-footer">
                                    {faq.category && (
                                      <div className="faq-category">
                                        <i className={`fas fa-${supportCategories.find(c => c.id === faq.category)?.icon || 'folder'}`}></i>
                                        <span>{supportCategories.find(c => c.id === faq.category)?.title || 'General'}</span>
                                      </div>
                                    )}
                                    
                                    <button 
                                      className="related-ticket-button"
                                      onClick={() => {
                                        const category = supportCategories.find(c => c.id === faq.category);
                                        if (category) {
                                          handleCategorySelect(category);
                                          const subCategory = category.subCategories.find(sc => sc.id === faq.subCategory);
                                          if (subCategory) {
                                            setTimeout(() => {
                                              handleSubCategorySelect(subCategory);
                                            }, 500);
                                          }
                                        }
                                      }}
                                    >
                                      <i className="fas fa-ticket-alt"></i>
                                      <span>Create Related Ticket</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        <div className="contact-section">
                          <div className="section-divider">
                            <span>OR</span>
                          </div>
                          
                          <h3>Contact Us Directly</h3>
                          
                          <div className="contact-options">
                            <a href="mailto:support@therapysync.com" className="contact-option">
                              <div className="contact-icon">
                                <i className="fas fa-envelope"></i>
                              </div>
                              <div className="contact-details">
                                <h4>Email Support</h4>
                                <span>support@therapysync.com</span>
                              </div>
                            </a>
                            
                            <a href="tel:+18001234567" className="contact-option">
                              <div className="contact-icon">
                                <i className="fas fa-phone-alt"></i>
                              </div>
                              <div className="contact-details">
                                <h4>Phone Support</h4>
                                <span>1-800-123-4567</span>
                                <span className="availability">Mon-Fri, 8am-6pm ET</span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {/* Tickets Tab */}
                {activeTab === 'tickets' && (
                  <div className="tickets-section">
                    {/* Tickets stats */}
                    <div className="tickets-stats">
                      <div className="stat-card">
                        <div className="stat-icon">
                          <i className="fas fa-ticket-alt"></i>
                        </div>
                        <div className="stat-content">
                          <span className="stat-value">{ticketsCount.total}</span>
                          <span className="stat-label">Total Tickets</span>
                        </div>
                      </div>
                      
                      <div className="stat-card">
                        <div className="stat-icon">
                          <i className="fas fa-spinner"></i>
                        </div>
                        <div className="stat-content">
                          <span className="stat-value">{ticketsCount.open}</span>
                          <span className="stat-label">Open Tickets</span>
                        </div>
                      </div>
                      
                      <div className="stat-card">
                        <div className="stat-icon">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="stat-content">
                          <span className="stat-value">{ticketsCount.resolved}</span>
                          <span className="stat-label">Resolved</span>
                        </div>
                      </div>
                      
                      <div className="stat-card create-ticket-card" onClick={handleCreateTicket}>
                        <div className="stat-icon">
                          <i className="fas fa-plus-circle"></i>
                        </div>
                        <div className="stat-content">
                          <span className="stat-action">Create New Ticket</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tickets list */}
                    <div className="tickets-container">
                      <h3>My Support Tickets</h3>
                      
                      {isLoadingTickets ? (
                        <div className="loading-container">
                          <div className="spinner">
                            <div className="spinner-inner"></div>
                          </div>
                          <span>Loading your tickets...</span>
                        </div>
                      ) : tickets.length > 0 ? (
                        <div className="tickets-list">
                          {tickets.map(ticket => (
                            <div 
                              key={ticket.id}
                              className="ticket-item"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              <div className="ticket-status-indicator" style={{ backgroundColor: getStatusColor(ticket.status) }}></div>
                              
                              <div className="ticket-content">
                                <div className="ticket-header">
                                  <div className="ticket-id">{ticket.id}</div>
                                  <div className="ticket-date">{formatRelativeTime(ticket.updatedAt)}</div>
                                </div>
                                
                                <h4 className="ticket-subject">{ticket.subject}</h4>
                                
                                <div className="ticket-meta">
                                  <div className="ticket-category">
                                    <i className={`fas fa-${ticket.categoryIcon}`}></i>
                                    <span>{ticket.categoryName}</span>
                                  </div>
                                  
                                  <div className="ticket-status" style={{ color: getStatusColor(ticket.status) }}>
                                    <i className={`fas fa-${getStatusIcon(ticket.status)}`}></i>
                                    <span>
                                      {ticket.status === 'in-progress' ? 'In Progress' : 
                                       ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                    </span>
                                  </div>
                                  
                                  <div className="ticket-priority" style={{ color: getPriorityColor(ticket.priority) }}>
                                    <i className={`fas fa-${getPriorityIcon(ticket.priority)}`}></i>
                                    <span>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                                  </div>
                                </div>
                                
                                <div className="ticket-preview">
                                  {ticket.messages[ticket.messages.length - 1].isSystemMessage ? 
                                    <i className="fas fa-info-circle system-icon"></i> :
                                    ticket.messages[ticket.messages.length - 1].sender === 'user' ?
                                    <i className="fas fa-user user-icon"></i> :
                                    <i className="fas fa-headset agent-icon"></i>
                                  }
                                  <p>
                                    {ticket.messages[ticket.messages.length - 1].message.length > 100 ?
                                      ticket.messages[ticket.messages.length - 1].message.substring(0, 100) + '...' :
                                      ticket.messages[ticket.messages.length - 1].message
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-tickets">
                          <div className="no-tickets-icon">
                            <i className="fas fa-ticket-alt"></i>
                          </div>
                          <h4>No Support Tickets</h4>
                          <p>You haven't created any support tickets yet.</p>
                          <button 
                            className="create-ticket-button"
                            onClick={handleCreateTicket}
                          >
                            <i className="fas fa-plus-circle"></i>
                            <span>Create New Ticket</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Step 1: Select subcategory after selecting main category */}
          {activeStep === 1 && selectedCategory && (
            <div className="subcategory-selection">
              <div className="selected-category">
                <div 
                  className="category-header"
                  style={{ 
                    '--category-color': selectedCategory.color,
                    '--category-gradient': selectedCategory.gradient
                  }}
                >
                  <div className="category-icon">
                    <i className={`fas fa-${selectedCategory.icon}`}></i>
                  </div>
                  <h3>{selectedCategory.title}</h3>
                </div>
                <p className="selection-instruction">Please select the specific issue you're experiencing:</p>
              </div>
              
              <div className="subcategories-list">
                {selectedCategory.subCategories.map(subCategory => (
                  <div 
                    key={subCategory.id}
                    className="subcategory-card"
                    onClick={() => handleSubCategorySelect(subCategory)}
                  >
                    <div className="subcategory-icon" style={{ color: selectedCategory.color }}>
                      <i className={`fas fa-${subCategory.icon}`}></i>
                    </div>
                    <div className="subcategory-content">
                      <h4>{subCategory.title}</h4>
                      <p>{subCategory.description}</p>
                      
                      {subCategory.examples && (
                        <div className="subcategory-examples">
                          <div className="examples-title">Examples:</div>
                          <ul>
                            {subCategory.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="subcategory-arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                ))}
                
                <div 
                  className="subcategory-card other-issue"
                  onClick={() => handleSubCategorySelect({
                    id: 'other',
                    title: 'Other Issue',
                    icon: 'question-circle',
                    description: 'My issue is not listed here'
                  })}
                >
                  <div className="subcategory-icon">
                    <i className="fas fa-question-circle"></i>
                  </div>
                  <div className="subcategory-content">
                    <h4>Other Issue</h4>
                    <p>My issue doesn't fit into any of the categories above</p>
                  </div>
                  <div className="subcategory-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Create ticket form */}
          {activeStep === 2 && selectedCategory && selectedSubCategory && (
            <div className="create-ticket-form">
              {!submitSuccess ? (
                <>
                  <div className="form-header">
                    <div 
                      className="selected-issue"
                      style={{ 
                        '--category-color': selectedCategory.color
                      }}
                    >
                      <div className="issue-icon">
                        <i className={`fas fa-${selectedSubCategory.icon}`}></i>
                      </div>
                      <div className="issue-details">
                        <h4>{selectedSubCategory.title}</h4>
                        <div className="issue-category">{selectedCategory.title}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-fields">
                    <div className="form-group">
                      <label htmlFor="ticketSubject">
                        Subject
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="ticketSubject"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="Briefly describe your issue"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="ticketDescription">
                        Description
                        <span className="required">*</span>
                      </label>
                      <textarea
                        id="ticketDescription"
                        ref={descriptionRef}
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        placeholder="Please provide detailed information about your issue. Include steps to reproduce, error messages, and any other relevant details."
                        rows={6}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="form-group">
                      <label>Priority Level</label>
                      <div className="priority-options">
                        <div 
                          className={`priority-option ${ticketPriority === 'low' ? 'selected' : ''}`}
                          onClick={() => handlePrioritySelect('low')}
                        >
                          <div className="priority-radio"></div>
                          <div className="priority-icon" style={{ color: getPriorityColor('low') }}>
                            <i className="fas fa-arrow-down"></i>
                          </div>
                          <div className="priority-details">
                            <span className="priority-name">Low</span>
                            <span className="priority-desc">Minor issue, not urgent</span>
                          </div>
                        </div>
                        
                        <div 
                          className={`priority-option ${ticketPriority === 'medium' ? 'selected' : ''}`}
                          onClick={() => handlePrioritySelect('medium')}
                        >
                          <div className="priority-radio"></div>
                          <div className="priority-icon" style={{ color: getPriorityColor('medium') }}>
                            <i className="fas fa-minus"></i>
                          </div>
                          <div className="priority-details">
                            <span className="priority-name">Medium</span>
                            <span className="priority-desc">Standard priority</span>
                          </div>
                        </div>
                        
                        <div 
                          className={`priority-option ${ticketPriority === 'high' ? 'selected' : ''}`}
                          onClick={() => handlePrioritySelect('high')}
                        >
                          <div className="priority-radio"></div>
                          <div className="priority-icon" style={{ color: getPriorityColor('high') }}>
                            <i className="fas fa-arrow-up"></i>
                          </div>
                          <div className="priority-details">
                            <span className="priority-name">High</span>
                            <span className="priority-desc">Urgent issue</span>
                          </div>
                        </div>
                        
                        <div 
                          className={`priority-option ${ticketPriority === 'critical' ? 'selected' : ''}`}
                          onClick={() => handlePrioritySelect('critical')}
                        >
                          <div className="priority-radio"></div>
                          <div className="priority-icon" style={{ color: getPriorityColor('critical') }}>
                            <i className="fas fa-exclamation"></i>
                          </div>
                          <div className="priority-details">
                            <span className="priority-name">Critical</span>
                            <span className="priority-desc">System down/blocking</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Attachments</label>
                      <div 
                        className={`attachments-dropzone ${dragActive ? 'dragging' : ''}`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className="dropzone-content">
                          <i className="fas fa-cloud-upload-alt"></i>
                          <p>Drag and drop files here or <button type="button" onClick={handleBrowseFiles}>browse files</button></p>
                          <p className="file-note">Max 5 files, 10MB each (Images, PDFs, Documents)</p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            style={{ display: 'none' }}
                          />
                        </div>
                      </div>
                      
                      {attachments.length > 0 && (
                        <div className="attachments-list">
                          <h4>Attached Files ({attachments.length})</h4>
                          <div className="attachment-items">
                            {attachments.map(attachment => (
                              <div key={attachment.id} className="attachment-item">
                                <div className="attachment-preview">
                                  {attachment.preview ? (
                                    <img src={attachment.preview} alt={attachment.name} />
                                  ) : (
                                    <i className={`fas ${
                                      attachment.type.includes('pdf') ? 'fa-file-pdf' :
                                      attachment.type.includes('word') ? 'fa-file-word' :
                                      attachment.type.includes('excel') ? 'fa-file-excel' :
                                      attachment.type.includes('text') ? 'fa-file-alt' :
                                      'fa-file'
                                    }`}></i>
                                  )}
                                </div>
                                <div className="attachment-details">
                                  <div className="attachment-name" title={attachment.name}>
                                    {attachment.name.length > 20 ? 
                                     attachment.name.substring(0, 18) + '...' : 
                                     attachment.name}
                                  </div>
                                  <div className="attachment-size">{attachment.size}</div>
                                </div>
                                <button 
                                  className="remove-attachment"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAttachment(attachment.id);
                                  }}
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
                  
                  <div className="form-actions">
                    <button 
                      className="back-button"
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-arrow-left"></i>
                      <span>Back</span>
                    </button>
                    
                    <button 
                      className={`submit-button ${
                        isSubmitting ? 'submitting' : 
                        !ticketSubject.trim() || !ticketDescription.trim() ? 'disabled' : ''
                      }`}
                      onClick={handleSubmitTicket}
                      disabled={isSubmitting || !ticketSubject.trim() || !ticketDescription.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner-small"></div>
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
                </>
              ) : (
                <div className="submission-success">
                  <div className="success-animation">
                    <div className="checkmark-container">
                      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="23" fill="none" />
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="success-content">
                    <h3>Your support ticket has been submitted successfully!</h3>
                    
                    <div className="ticket-reference">
                      <div className="reference-label">Reference Number:</div>
                      <div className="reference-value">{createdTicketId}</div>
                    </div>
                    
                    <div className="success-details">
                      <p>Our support team has been notified and will respond to your ticket shortly.</p>
                      
                      <div className="expected-response">
                        <div className="response-icon">
                          <i className="fas fa-clock"></i>
                        </div>
                        <div className="response-text">
                          <h4>Expected Response Time</h4>
                          <p>
                            {ticketPriority === 'critical' ? 'Within 1 hour' :
                             ticketPriority === 'high' ? 'Within 4 hours' :
                             ticketPriority === 'medium' ? 'Within 24 hours' :
                             'Within 2 business days'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="next-steps">
                        <h4>What Happens Next?</h4>
                        <ul>
                          <li>You'll receive a confirmation email with your ticket details</li>
                          <li>A support agent will review your ticket and respond</li>
                          <li>You can check the status and respond to your ticket at any time</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="success-actions">
                      <button 
                        className="view-ticket-button"
                        onClick={handleAfterSubmit}
                      >
                        <i className="fas fa-eye"></i>
                        <span>View Your Ticket</span>
                      </button>
                      
                      <button 
                        className="close-button"
                        onClick={handleClose}
                      >
                        <i className="fas fa-check"></i>
                        <span>Done</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Ticket Details View */}
          {activeTicket && (
            <div className="ticket-details-view">
              <div className="ticket-details-header">
                <div className="ticket-details-id">
                  <div className="ticket-ref">{activeTicket.id}</div>
                  <div 
                    className="ticket-status-badge"
                    style={{ 
                      backgroundColor: getStatusColor(activeTicket.status),
                      color: '#fff'
                    }}
                  >
                    <i className={`fas fa-${getStatusIcon(activeTicket.status)}`}></i>
                    <span>
                      {activeTicket.status === 'in-progress' ? 'In Progress' : 
                       activeTicket.status.charAt(0).toUpperCase() + activeTicket.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <h3 className="ticket-details-subject">{activeTicket.subject}</h3>
                
                <div className="ticket-details-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">
                      <i className={`fas fa-${activeTicket.categoryIcon}`}></i>
                      <span>{activeTicket.categoryName}</span>
                    </span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Priority:</span>
                    <span 
                      className="meta-value"
                      style={{ color: getPriorityColor(activeTicket.priority) }}
                    >
                      <i className={`fas fa-${getPriorityIcon(activeTicket.priority)}`}></i>
                      <span>{activeTicket.priority.charAt(0).toUpperCase() + activeTicket.priority.slice(1)}</span>
                    </span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">
                      <i className="fas fa-calendar-alt"></i>
                      <span>{new Date(activeTicket.createdAt).toLocaleString()}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="ticket-messages">
                {activeTicket.messages.map((message, index) => (
                  <div 
                    key={message.id}
                    className={`message ${
                      message.isSystemMessage ? 'system' :
                      message.sender === 'user' ? 'user' : 'agent'
                    }`}
                  >
                    {!message.isSystemMessage && (
                      <div className="message-avatar">
                        {message.sender === 'user' ? (
                          <i className="fas fa-user"></i>
                        ) : (
                          <i className="fas fa-headset"></i>
                        )}
                      </div>
                    )}
                    
                    <div className="message-content">
                      {!message.isSystemMessage && (
                        <div className="message-header">
                          <div className="message-sender">
                            {message.sender === 'user' ? 'You' : message.agentName || 'Support Agent'}
                          </div>
                          <div className="message-time">
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                        </div>
                      )}
                      
                      <div className="message-body">
                        {message.message}
                      </div>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="message-attachments">
                          {message.attachments.map(attachment => (
                            <div key={attachment.id} className="attachment">
                              <div className="attachment-icon">
                                <i className={`fas ${
                                  attachment.type.includes('image') ? 'fa-image' :
                                  attachment.type.includes('pdf') ? 'fa-file-pdf' :
                                  attachment.type.includes('word') ? 'fa-file-word' :
                                  attachment.type.includes('excel') ? 'fa-file-excel' :
                                  'fa-file'
                                }`}></i>
                              </div>
                              <div className="attachment-info">
                                <div className="attachment-name">{attachment.name}</div>
                                <div className="attachment-size">{attachment.size}</div>
                              </div>
                              <button className="attachment-action">
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
              
              {activeTicket.status !== 'closed' && (
                <div className="ticket-reply">
                  <textarea
                    ref={replyInputRef}
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  
                  <div className="reply-actions">
                    <div className="attachment-tools">
                      <button 
                        className="attach-button"
                        onClick={handleBrowseFiles}
                      >
                        <i className="fas fa-paperclip"></i>
                        <span>Attach Files</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        style={{ display: 'none' }}
                      />
                      
                      {attachments.length > 0 && (
                        <div className="attachments-count">
                          {attachments.length} file{attachments.length !== 1 ? 's' : ''} attached
                        </div>
                      )}
                    </div>
                    
                    <button 
                    className={`send-button ${!replyText.trim() ? 'disabled' : ''}`}
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <i className="fas fa-paper-plane"></i>
                    <span>Send</span>
                  </button>
                </div>
                
                {attachments.length > 0 && (
                  <div className="reply-attachments">
                    {attachments.map(attachment => (
                      <div key={attachment.id} className="attachment-chip">
                        <i className={`fas ${
                          attachment.type.includes('image') ? 'fa-image' :
                          attachment.type.includes('pdf') ? 'fa-file-pdf' :
                          attachment.type.includes('word') ? 'fa-file-word' :
                          attachment.type.includes('excel') ? 'fa-file-excel' :
                          'fa-file'
                        }`}></i>
                        <span className="attachment-name">{
                          attachment.name.length > 20 ? 
                          attachment.name.substring(0, 18) + '...' :
                          attachment.name
                        }</span>
                        <button 
                          className="remove-chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAttachment(attachment.id);
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTicket.status === 'closed' && (
              <div className="ticket-closed-message">
                <i className="fas fa-lock"></i>
                <p>This ticket is closed. If you still need help, please create a new ticket.</p>
                <button 
                  className="new-ticket-button"
                  onClick={handleCreateTicket}
                >
                  <i className="fas fa-plus-circle"></i>
                  <span>Create New Ticket</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    
    {/* Notification toast */}
    {showNotification && (
      <div className={`notification-toast ${notificationType}`}>
        <div className="notification-icon">
          <i className={`fas ${
            notificationType === 'success' ? 'fa-check-circle' :
            notificationType === 'warning' ? 'fa-exclamation-triangle' :
            'fa-times-circle'
          }`}></i>
        </div>
        <div className="notification-message">{notificationMessage}</div>
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

export default UserSupportModule;