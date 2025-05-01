// components/developer/support/SupportModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../../../styles/developer/support/SupportModalDev.scss';
import { useAuth } from '../../login/AuthContext';

const SupportModal = ({ isOpen, onClose }) => {
  // Authentication context for user info
  const { currentUser } = useAuth();
  
  // States
  const [activeTab, setActiveTab] = useState('inbox');
  const [activeTicket, setActiveTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [isAssigningTicket, setIsAssigningTicket] = useState(false);
  const [modalPage, setModalPage] = useState(1);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // References
  const modalRef = useRef(null);
  const replyInputRef = useRef(null);
  
  // Mock data - in a real app, this would come from an API
  const mockTickets = [
    {
      id: 'TS-439513',
      subject: 'Unable to access patient records',
      description: 'I can\'t access my patient records since this morning. I get an error message saying "Access denied" when I try to open any record.',
      category: 'Account & Access',
      type: 'Login Issues',
      status: 'open',
      priority: 'high',
      createdAt: '2025-04-20 08:32 a.m.',
      user: {
        name: 'Jennifer Wilson',
        email: 'j.wilson@therapyclinic.com',
        role: 'PT',
        avatar: 'JW'
      },
      assignedTo: null,
      responses: [
        {
          id: 1,
          message: "I can't access my patient records since this morning. I get an error message saying 'Access denied' when I try to open any record.",
          sender: 'user',
          timestamp: '2025-04-20 08:32 a.m.',
          attachments: [{
            name: 'error_screenshot.png',
            type: 'image',
            size: '256 KB'
          }]
        }
      ]
    },
    {
      id: 'TS-439510',
      subject: 'Billing system not calculating insurance correctly',
      description: 'The billing system is calculating incorrect amounts for insurance payments. The discounts are not being applied properly.',
      category: 'Billing & Payments',
      type: 'Payment Problems',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2025-04-19 14:15 p.m.',
      user: {
        name: 'Robert Chen',
        email: 'r.chen@cityhealth.com',
        role: 'Administrator',
        avatar: 'RC'
      },
      assignedTo: {
        name: 'Maria Cruz',
        email: 'm.cruz@therapysync.com',
        role: 'Support Specialist',
        avatar: 'MC'
      },
      responses: [
        {
          id: 1,
          message: "The billing system is calculating incorrect amounts for insurance payments. The discounts are not being applied properly.",
          sender: 'user',
          timestamp: '2025-04-19 14:15 p.m.'
        },
        {
          id: 2,
          message: "Thank you for reporting this issue. I'm looking into it now. Could you provide more details about which insurance provider is affected?",
          sender: 'support',
          timestamp: '2025-04-19 14:30 p.m.',
          senderName: 'Maria Cruz'
        },
        {
          id: 3,
          message: "It's happening with BlueCross. The 15% discount that should be applied is missing from all transactions this month.",
          sender: 'user',
          timestamp: '2025-04-19 15:45 p.m.'
        }
      ]
    },
    {
      id: 'TS-439505',
      subject: 'Calendar sync issue with Google Calendar',
      description: 'Appointments created in TherapySync are not showing up in my Google Calendar. This started happening yesterday.',
      category: 'Technical Support',
      type: 'Performance Issues',
      status: 'pending',
      priority: 'medium',
      createdAt: '2025-04-18 11:20 a.m.',
      user: {
        name: 'Sarah Martinez',
        email: 's.martinez@therapycenter.net',
        role: 'OT',
        avatar: 'SM'
      },
      assignedTo: {
        name: 'Luis Nava',
        email: 'l.nava@therapysync.com',
        role: 'Developer',
        avatar: 'LN'
      },
      responses: [
        {
          id: 1,
          message: "Appointments created in TherapySync are not showing up in my Google Calendar. This started happening yesterday.",
          sender: 'user',
          timestamp: '2025-04-18 11:20 a.m.'
        },
        {
          id: 2,
          message: "I'll look into this right away. Could you tell me if you've recently changed any settings in your Google Calendar or revoked any permissions?",
          sender: 'support',
          timestamp: '2025-04-18 11:35 a.m.',
          senderName: 'Luis Nava'
        },
        {
          id: 3,
          message: "No, I haven't changed any settings. It was working fine until yesterday afternoon.",
          sender: 'user',
          timestamp: '2025-04-18 12:10 p.m.'
        },
        {
          id: 4,
          message: "Thanks for confirming. I've identified an issue with our Google Calendar API integration. We're working on a fix and should have it resolved within the next few hours. I'll update you once it's fixed.",
          sender: 'support',
          timestamp: '2025-04-18 13:45 p.m.',
          senderName: 'Luis Nava'
        }
      ]
    },
    {
      id: 'TS-439498',
      subject: 'Feature request: Bulk patient import',
      description: 'We need a way to import multiple patients at once from a CSV file. This would save us a lot of time.',
      category: 'Feature Requests',
      type: 'New Feature',
      status: 'open',
      priority: 'low',
      createdAt: '2025-04-17 10:05 a.m.',
      user: {
        name: 'Michael Thompson',
        email: 'm.thompson@wellness.org',
        role: 'Administrator',
        avatar: 'MT'
      },
      assignedTo: null,
      responses: [
        {
          id: 1,
          message: "We need a way to import multiple patients at once from a CSV file. This would save us a lot of time.",
          sender: 'user',
          timestamp: '2025-04-17 10:05 a.m.'
        }
      ]
    },
    {
      id: 'TS-439490',
      subject: 'Cannot export data in CSV format',
      description: 'The export to CSV feature is not working. When I click on export, nothing happens.',
      category: 'Technical Support',
      type: 'System Errors',
      status: 'resolved',
      priority: 'high',
      createdAt: '2025-04-16 08:15 a.m.',
      resolvedAt: '2025-04-16 15:30 p.m.',
      user: {
        name: 'Emma Davis',
        email: 'e.davis@healthgroup.com',
        role: 'PT',
        avatar: 'ED'
      },
      assignedTo: {
        name: 'Luis Nava',
        email: 'l.nava@therapysync.com',
        role: 'Developer',
        avatar: 'LN'
      },
      responses: [
        {
          id: 1,
          message: "The export to CSV feature is not working. When I click on export, nothing happens.",
          sender: 'user',
          timestamp: '2025-04-16 08:15 a.m.'
        },
        {
          id: 2,
          message: "I'm going to look into this right away. Can you tell me which browser you're using?",
          sender: 'support',
          timestamp: '2025-04-16 08:30 a.m.',
          senderName: 'Luis Nava'
        },
        {
          id: 3,
          message: "I'm using Google Chrome version 124.0.6367.201.",
          sender: 'user',
          timestamp: '2025-04-16 09:15 a.m.'
        },
        {
          id: 4,
          message: "Thank you for the information. We've identified a bug in our export functionality that affects Chrome. I'm implementing a fix now and will let you know once it's deployed.",
          sender: 'support',
          timestamp: '2025-04-16 10:00 a.m.',
          senderName: 'Luis Nava'
        },
        {
          id: 5,
          message: "The fix has been deployed. Please try exporting again and let me know if it works now.",
          sender: 'support',
          timestamp: '2025-04-16 14:45 p.m.',
          senderName: 'Luis Nava'
        },
        {
          id: 6,
          message: "It's working now! Thank you for the quick fix.",
          sender: 'user',
          timestamp: '2025-04-16 15:20 p.m.'
        },
        {
          id: 7,
          message: "You're welcome! I'm glad it's working now. I'll mark this issue as resolved. Please don't hesitate to reach out if you have any other issues.",
          sender: 'support',
          timestamp: '2025-04-16 15:30 p.m.',
          senderName: 'Luis Nava'
        }
      ]
    },
    {
      id: 'TS-439480',
      subject: 'Question about new billing system',
      description: 'I need clarification on how the new billing system handles copayments versus deductibles.',
      category: 'Billing & Payments',
      type: 'Invoice Questions',
      status: 'closed',
      priority: 'medium',
      createdAt: '2025-04-15 15:30 p.m.',
      resolvedAt: '2025-04-16 10:15 a.m.',
      user: {
        name: 'David Wilson',
        email: 'david.w@medicalcenter.org',
        role: 'Administrator',
        avatar: 'DW'
      },
      assignedTo: {
        name: 'Maria Cruz',
        email: 'm.cruz@therapysync.com',
        role: 'Support Specialist',
        avatar: 'MC'
      },
      responses: [
        {
          id: 1,
          message: "I need clarification on how the new billing system handles copayments versus deductibles.",
          sender: 'user',
          timestamp: '2025-04-15 15:30 p.m.'
        },
        {
          id: 2,
          message: "Happy to help clarify this. In the new system, copayments are entered on the first screen of the billing form under 'Patient Responsibility', while deductibles should be entered on the second screen under 'Insurance Details'. The system will automatically calculate which applies first based on the insurance policy details you've entered for the patient.",
          sender: 'support',
          timestamp: '2025-04-16 09:10 a.m.',
          senderName: 'Maria Cruz'
        },
        {
          id: 3,
          message: "That makes sense, thank you for the clear explanation!",
          sender: 'user',
          timestamp: '2025-04-16 10:05 a.m.'
        },
        {
          id: 4,
          message: "You're welcome! Is there anything else you'd like to know about the new billing system?",
          sender: 'support',
          timestamp: '2025-04-16 10:15 a.m.',
          senderName: 'Maria Cruz'
        }
      ]
    }
  ];
  
  // Mock support agents
  const mockAgents = [
    {
      id: 1,
      name: 'Luis Nava',
      email: 'l.nava@therapysync.com',
      role: 'Developer',
      avatar: 'LN',
      status: 'online'
    },
    {
      id: 2,
      name: 'Maria Cruz',
      email: 'm.cruz@therapysync.com',
      role: 'Support Specialist',
      avatar: 'MC',
      status: 'online'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'r.johnson@therapysync.com',
      role: 'Technical Support',
      avatar: 'RJ',
      status: 'away'
    },
    {
      id: 4,
      name: 'Amanda Lee',
      email: 'a.lee@therapysync.com',
      role: 'Billing Specialist',
      avatar: 'AL',
      status: 'offline'
    }
  ];
  
  // Load data
  useEffect(() => {
    if (isOpen) {
      // Simulate API call
      setIsLoading(true);
      setTimeout(() => {
        setTickets(mockTickets);
        setAgents(mockAgents);
        setIsLoading(false);
      }, 800);
    } else {
      // Reset states when closing
      setActiveTicket(null);
      setModalPage(1);
    }
  }, [isOpen]);
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);
  
  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // Scroll to bottom of chat when a new message is added
  useEffect(() => {
    if (activeTicket) {
      const chatContainer = document.querySelector('.ticket-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [activeTicket]);
  
  // Focus reply input when ticket is selected
  useEffect(() => {
    if (activeTicket && replyInputRef.current) {
      setTimeout(() => {
        replyInputRef.current.focus();
      }, 300);
    }
  }, [activeTicket]);
  
  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Priority filter
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    
    // Category filter
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    
    // Tab filter
    if (activeTab === 'inbox') {
      return matchesSearch && matchesPriority && matchesStatus && matchesCategory && !ticket.assignedTo;
    } else if (activeTab === 'assigned') {
      return matchesSearch && matchesPriority && matchesStatus && matchesCategory && 
        ticket.assignedTo && ticket.assignedTo.name === currentUser?.fullname;
    } else if (activeTab === 'resolved') {
      return matchesSearch && matchesPriority && matchesCategory && 
        (ticket.status === 'resolved' || ticket.status === 'closed');
    } else {
      return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
    }
  });
  
  // Handle close
  const handleClose = () => {
    // If we're viewing a ticket, go back to the list
    if (activeTicket && modalPage === 1) {
      setActiveTicket(null);
    } else if (modalPage > 1) {
      // If we're on a different page, go back to the main page
      setModalPage(1);
    } else {
      // Otherwise close the modal
      onClose();
    }
  };
  
  // Handle selecting a ticket
  const handleSelectTicket = (ticket) => {
    setActiveTicket(ticket);
  };
  
  // Handle sending a reply
  const handleSendReply = () => {
    if (!replyText.trim() || !activeTicket) return;
    
    // Create new response
    const newResponse = {
      id: activeTicket.responses.length + 1,
      message: replyText,
      sender: 'support',
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      senderName: currentUser?.fullname || 'Support Agent'
    };
    
    // Update ticket with new response
    const updatedTicket = {
      ...activeTicket,
      responses: [...activeTicket.responses, newResponse],
      // If ticket is open, set to in-progress
      status: activeTicket.status === 'open' ? 'in-progress' : activeTicket.status,
      // If ticket is not assigned, assign to current user
      assignedTo: activeTicket.assignedTo || {
        name: currentUser?.fullname || 'Support Agent',
        email: currentUser?.email || 'support@therapysync.com',
        role: currentUser?.role || 'Support',
        avatar: getInitials(currentUser?.fullname || 'Support Agent')
      }
    };
    
    // Update tickets array
    setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t));
    
    // Update active ticket
    setActiveTicket(updatedTicket);
    
    // Clear reply text
    setReplyText('');
  };
  
  // Handle changing ticket status
  const handleStatusChange = (newStatus) => {
    if (!activeTicket) return;
    
    // Update ticket status
    const updatedTicket = {
      ...activeTicket,
      status: newStatus,
      // If resolving or closing, add resolved timestamp
      ...(newStatus === 'resolved' || newStatus === 'closed' ? {
        resolvedAt: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      } : {})
    };
    
    // Update tickets array
    setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t));
    
    // Update active ticket
    setActiveTicket(updatedTicket);
    
    // Add system message about status change
    const statusMessage = {
      id: activeTicket.responses.length + 1,
      message: `Ticket status changed to ${newStatus}`,
      sender: 'system',
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
    
    // Update active ticket with status message
    setActiveTicket(prevTicket => ({
      ...prevTicket,
      responses: [...prevTicket.responses, statusMessage]
    }));
  };
  
  // Handle assigning ticket
  const handleAssignTicket = (agent) => {
    if (!activeTicket) return;
    
    // Update ticket with new assignee
    const updatedTicket = {
      ...activeTicket,
      assignedTo: agent
    };
    
    // Update tickets array
    setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t));
    
    // Update active ticket
    setActiveTicket(updatedTicket);
    
    // Add system message about assignment
    const assignmentMessage = {
      id: activeTicket.responses.length + 1,
      message: `Ticket assigned to ${agent.name}`,
      sender: 'system',
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
    
    // Update active ticket with assignment message
    setActiveTicket(prevTicket => ({
      ...prevTicket,
      responses: [...prevTicket.responses, assignmentMessage]
    }));
    
    // Close assignment dialog
    setIsAssigningTicket(false);
  };
  
  // Handle taking a ticket
  const handleTakeTicket = () => {
    if (!activeTicket || !currentUser) return;
    
    // Create agent object from current user
    const currentAgent = {
      name: currentUser.fullname || 'Support Agent',
      email: currentUser.email || 'support@therapysync.com',
      role: currentUser.role || 'Support',
      avatar: getInitials(currentUser.fullname || 'Support Agent')
    };
    
    // Update ticket with current user as assignee
    const updatedTicket = {
      ...activeTicket,
      assignedTo: currentAgent
    };
    
    // Update tickets array
    setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t));
    
    // Update active ticket
    setActiveTicket(updatedTicket);
    
    // Add system message about assignment
    const assignmentMessage = {
      id: activeTicket.responses.length + 1,
      message: `Ticket taken by ${currentAgent.name}`,
      sender: 'system',
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
    
    // Update active ticket with assignment message
    setActiveTicket(prevTicket => ({
      ...prevTicket,
      responses: [...prevTicket.responses, assignmentMessage]
    }));
  };
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#FF3B30';
      case 'high':
        return '#FF9500';
      case 'medium':
        return '#5856D6';
      case 'low':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };
  
  // Get icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Account & Access':
        return 'fa-user-shield';
      case 'Billing & Payments':
        return 'fa-credit-card';
      case 'Technical Support':
        return 'fa-wrench';
      case 'Patient Management':
        return 'fa-user-injured';
      case 'Feature Requests':
        return 'fa-lightbulb';
      default:
        return 'fa-question-circle';
    }
  };
  
  // Get color based on category
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Account & Access':
        return '#5856D6';
      case 'Billing & Payments':
        return '#FF9500';
      case 'Technical Support':
        return '#FF2D55';
      case 'Patient Management':
        return '#34C759';
      case 'Feature Requests':
        return '#007AFF';
      default:
        return '#8E8E93';
    }
  };
  
  // Get icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return 'fa-door-open';
      case 'in-progress':
        return 'fa-spinner';
      case 'pending':
        return 'fa-clock';
      case 'resolved':
        return 'fa-check-circle';
      case 'closed':
        return 'fa-lock';
      default:
        return 'fa-question-circle';
    }
  };
  
  // Get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#007AFF';
      case 'in-progress':
        return '#5856D6';
      case 'pending':
        return '#FF9500';
      case 'resolved':
        return '#34C759';
      case 'closed':
        return '#8E8E93';
      default:
        return '#8E8E93';
    }
  };
  
  // Get avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      '#5856D6', '#FF2D55', '#FF9500', '#FFCC00', 
      '#34C759', '#007AFF', '#5AC8FA', '#AF52DE'
    ];
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get color from hash
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Format date to relative time (e.g. "2 hours ago")
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
      return dateString;
    }
  };
  
  // Render different views based on current modal page
  const renderModalContent = () => {
    switch (modalPage) {
      case 1:
        return renderMainPage();
      case 2:
        return renderCreateTicketPage();
      case 3:
        return renderKnowledgeBasePage();
      default:
        return renderMainPage();
    }
  };
  
  // Render main page (ticket list & detail view)
  const renderMainPage = () => {
    return (
      <div className="modal-content">
        <div className="support-modal-header">
          <div className="modal-title">
            <div className="title-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h2>Support Center</h2>
          </div>
          
          <div className="modal-tabs">
            <div 
              className={`modal-tab ${activeTab === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveTab('inbox')}
            >
              <i className="fas fa-inbox"></i>
              <span>Inbox</span>
              <div className="tab-count">
                {tickets.filter(t => !t.assignedTo).length}
              </div>
            </div>
            
            <div 
              className={`modal-tab ${activeTab === 'assigned' ? 'active' : ''}`}
              onClick={() => setActiveTab('assigned')}
            >
              <i className="fas fa-user-check"></i>
              <span>My Tickets</span>
              <div className="tab-count">
                {tickets.filter(t => 
                  t.assignedTo && t.assignedTo.name === (currentUser?.fullname || '')).length}
              </div>
            </div>
            
            <div 
              className={`modal-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <i className="fas fa-ticket-alt"></i>
              <span>All Tickets</span>
              <div className="tab-count">{tickets.length}</div>
            </div>
            
            <div 
              className={`modal-tab ${activeTab === 'resolved' ? 'active' : ''}`}
              onClick={() => setActiveTab('resolved')}
            >
              <i className="fas fa-check-circle"></i>
              <span>Resolved</span>
              <div className="tab-count">
              {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <div className="search-container">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search tickets..." 
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
            
            <button 
              className="action-button create-ticket"
              onClick={() => setModalPage(2)}
            >
              <i className="fas fa-plus"></i>
              <span>Create</span>
            </button>
            
            <button 
              className="action-button kb-button"
              onClick={() => setModalPage(3)}
            >
              <i className="fas fa-book"></i>
              <span>Knowledge Base</span>
            </button>
            
            <button 
              className="action-button close-button"
              onClick={handleClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="support-modal-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <span>Loading tickets...</span>
            </div>
          ) : (
            <div className="split-view">
              <div className="tickets-list-panel">
                <div className="tickets-header">
                  <div className="ticket-filters">
                    <div className="filter-dropdown">
                      <select 
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                      >
                        <option value="all">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                      <i className="fas fa-chevron-down"></i>
                    </div>
                    
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
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        <option value="Account & Access">Account & Access</option>
                        <option value="Billing & Payments">Billing & Payments</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Patient Management">Patient Management</option>
                        <option value="Feature Requests">Feature Requests</option>
                      </select>
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                  
                  <div className="ticket-count">
                    {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="tickets-list">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map(ticket => (
                      <div 
                        key={ticket.id}
                        className={`ticket-item ${activeTicket?.id === ticket.id ? 'active' : ''}`}
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        <div className="ticket-priority" style={{ backgroundColor: getPriorityColor(ticket.priority) }}></div>
                        
                        <div className="ticket-content">
                          <div className="ticket-header">
                            <div className="ticket-id">{ticket.id}</div>
                            <div className="ticket-status" style={{ color: getStatusColor(ticket.status) }}>
                              <i className={`fas ${getStatusIcon(ticket.status)}`}></i>
                              <span>{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                            </div>
                          </div>
                          
                          <div className="ticket-subject">{ticket.subject}</div>
                          
                          <div className="ticket-meta">
                            <div className="ticket-category" style={{ backgroundColor: getCategoryColor(ticket.category) }}>
                              <i className={`fas ${getCategoryIcon(ticket.category)}`}></i>
                              <span>{ticket.category}</span>
                            </div>
                            
                            <div className="ticket-time">
                              <i className="fas fa-clock"></i>
                              <span>{formatRelativeTime(ticket.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div className="ticket-user">
                            <div 
                              className="user-avatar"
                              style={{ backgroundColor: getAvatarColor(ticket.user.name) }}
                            >
                              {ticket.user.avatar}
                            </div>
                            <div className="user-info">
                              <div className="user-name">{ticket.user.name}</div>
                              <div className="user-role">{ticket.user.role}</div>
                            </div>
                          </div>
                          
                          {ticket.assignedTo ? (
                            <div className="ticket-assigned">
                              <i className="fas fa-user-check"></i>
                              <span>Assigned to {ticket.assignedTo.name}</span>
                            </div>
                          ) : (
                            <div className="ticket-unassigned">
                              <i className="fas fa-user-plus"></i>
                              <span>Unassigned</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-tickets">
                      <i className="fas fa-ticket-alt"></i>
                      <p>No tickets match your filters</p>
                      <button onClick={() => {
                        setFilterPriority('all');
                        setFilterStatus('all');
                        setFilterCategory('all');
                        setSearchQuery('');
                      }}>
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="ticket-details-panel">
                {activeTicket ? (
                  <div className="ticket-details">
                    <div className="ticket-header">
                      <div className="ticket-subject-header">
                        <h3>{activeTicket.subject}</h3>
                        <div className="ticket-id-details">{activeTicket.id}</div>
                      </div>
                      
                      <div className="ticket-info-header">
                        <div className="ticket-meta-details">
                          <div className="meta-item">
                            <span className="meta-label">Status:</span>
                            <span className="meta-value" style={{ color: getStatusColor(activeTicket.status) }}>
                              <i className={`fas ${getStatusIcon(activeTicket.status)}`}></i>
                              {activeTicket.status.charAt(0).toUpperCase() + activeTicket.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="meta-item">
                            <span className="meta-label">Priority:</span>
                            <span className="meta-value" style={{ color: getPriorityColor(activeTicket.priority) }}>
                              <i className="fas fa-flag"></i>
                              {activeTicket.priority.charAt(0).toUpperCase() + activeTicket.priority.slice(1)}
                            </span>
                          </div>
                          
                          <div className="meta-item">
                            <span className="meta-label">Category:</span>
                            <span className="meta-value">
                              <i className={`fas ${getCategoryIcon(activeTicket.category)}`}></i>
                              {activeTicket.category}
                            </span>
                          </div>
                          
                          <div className="meta-item">
                            <span className="meta-label">Created:</span>
                            <span className="meta-value">
                              <i className="fas fa-calendar-alt"></i>
                              {activeTicket.createdAt}
                            </span>
                          </div>
                          
                          {activeTicket.resolvedAt && (
                            <div className="meta-item">
                              <span className="meta-label">Resolved:</span>
                              <span className="meta-value">
                                <i className="fas fa-check-circle"></i>
                                {activeTicket.resolvedAt}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="ticket-user-details">
                          <div className="user-info-header">
                            <div 
                              className="user-avatar-detail"
                              style={{ backgroundColor: getAvatarColor(activeTicket.user.name) }}
                            >
                              {activeTicket.user.avatar}
                            </div>
                            <div className="user-details">
                              <div className="user-name-detail">{activeTicket.user.name}</div>
                              <div className="user-role-detail">{activeTicket.user.role}</div>
                              <div className="user-email-detail">{activeTicket.user.email}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ticket-actions-header">
                        {!activeTicket.assignedTo ? (
                          <button 
                            className="ticket-action take-ticket"
                            onClick={handleTakeTicket}
                          >
                            <i className="fas fa-user-plus"></i>
                            <span>Take Ticket</span>
                          </button>
                        ) : activeTicket.assignedTo.name !== (currentUser?.fullname || '') ? (
                          <div className="assigned-to">
                            <div className="assigned-label">Assigned to:</div>
                            <div className="assigned-user">
                              <div 
                                className="assigned-avatar"
                                style={{ backgroundColor: getAvatarColor(activeTicket.assignedTo.name) }}
                              >
                                {activeTicket.assignedTo.avatar}
                              </div>
                              <div className="assigned-name">{activeTicket.assignedTo.name}</div>
                            </div>
                          </div>
                        ) : null}
                        
                        <div className="action-dropdown">
                          <button 
                            className="dropdown-toggle"
                            onClick={() => setIsAssigningTicket(!isAssigningTicket)}
                          >
                            <i className="fas fa-user-tag"></i>
                            <span>Assign</span>
                            <i className="fas fa-chevron-down"></i>
                          </button>
                          
                          {isAssigningTicket && (
                            <div className="dropdown-menu">
                              {agents.map(agent => (
                                <div 
                                  key={agent.id}
                                  className="dropdown-item"
                                  onClick={() => handleAssignTicket(agent)}
                                >
                                  <div 
                                    className="agent-avatar"
                                    style={{ backgroundColor: getAvatarColor(agent.name) }}
                                  >
                                    {agent.avatar}
                                  </div>
                                  <div className="agent-info">
                                    <div className="agent-name">{agent.name}</div>
                                    <div className="agent-role">{agent.role}</div>
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
                    </div>
                    
                    <div className="ticket-messages">
                      {activeTicket.responses.map((response, index) => (
                        <div 
                          key={response.id}
                          className={`message ${response.sender === 'user' ? 'user' : response.sender === 'support' ? 'support' : 'system'}`}
                        >
                          {response.sender !== 'system' && (
                            <div 
                              className="message-avatar"
                              style={{ 
                                backgroundColor: response.sender === 'user' 
                                  ? getAvatarColor(activeTicket.user.name)
                                  : getAvatarColor(response.senderName || 'Support')
                              }}
                            >
                              {response.sender === 'user' 
                                ? activeTicket.user.avatar
                                : getInitials(response.senderName || 'Support')}
                            </div>
                          )}
                          
                          <div className="message-content">
                            {response.sender !== 'system' && (
                              <div className="message-header">
                                <div className="message-sender">
                                  {response.sender === 'user' 
                                    ? activeTicket.user.name
                                    : response.senderName || 'Support Agent'}
                                </div>
                                <div className="message-time">{response.timestamp}</div>
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
                                      <i className={`fas ${attachment.type === 'image' ? 'fa-image' : 'fa-file'}`}></i>
                                    </div>
                                    <div className="attachment-info">
                                      <div className="attachment-name">{attachment.name}</div>
                                      <div className="attachment-size">{attachment.size}</div>
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
                      
                      <div className="reply-actions">
                        <div className="reply-tools">
                          <button className="tool-button" title="Attach File">
                            <i className="fas fa-paperclip"></i>
                          </button>
                          <button className="tool-button" title="Insert Template">
                            <i className="fas fa-file-alt"></i>
                          </button>
                          <button className="tool-button" title="Insert Emoji">
                            <i className="fas fa-smile"></i>
                          </button>
                          <button className="tool-button" title="Format Text">
                            <i className="fas fa-paragraph"></i>
                          </button>
                        </div>
                        
                        <button 
                          className="send-button"
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                        >
                          <i className="fas fa-paper-plane"></i>
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-ticket-selected">
                    <div className="empty-state">
                      <i className="fas fa-ticket-alt"></i>
                      <h3>No Ticket Selected</h3>
                      <p>Select a ticket from the list to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render create ticket page (placeholder for now)
  const renderCreateTicketPage = () => {
    return (
      <div className="create-ticket-page">
        <div className="create-ticket-header">
          <button className="back-button" onClick={() => setModalPage(1)}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2>Create Support Ticket</h2>
          <button className="close-button" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="create-ticket-content">
          <div className="step-indicator">
            <div className="step active">
              <div className="step-circle">
                <i className="fas fa-check"></i>
              </div>
              <span>Category</span>
            </div>
            <div className="step-connector"></div>
            <div className="step active">
              <div className="step-circle">3</div>
              <span>Details</span>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-circle">3</div>
              <span>Submit</span>
            </div>
          </div>
          
          <div className="ticket-form">
            <div className="form-category">
              <div className="category-label">
                <div className="category-icon" style={{ backgroundColor: '#5856D6' }}>
                  <i className="fas fa-key"></i>
                </div>
                <div className="category-text">
                  <h3>Login Issues</h3>
                  <p>Account & Access</p>
                </div>
              </div>
            </div>
            
            <div className="form-field">
              <label>Describe your issue <span className="required">*</span></label>
              <textarea 
                placeholder="Please provide as much detail as possible to help us understand and resolve your issue quickly..."
              ></textarea>
            </div>
            
            <div className="form-field priority-field">
              <label>Priority Level</label>
              <div className="priority-options">
                <div className="priority-option active">
                  <div className="priority-radio">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="priority-icon low">
                    <i className="fas fa-arrow-down"></i>
                  </div>
                  <div className="priority-details">
                    <div className="priority-name">Low</div>
                    <div className="priority-description">Minor issue, not urgent</div>
                  </div>
                </div>
                
                <div className="priority-option active">
                  <div className="priority-radio">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="priority-icon medium">
                    <i className="fas fa-minus"></i>
                  </div>
                  <div className="priority-details">
                    <div className="priority-name">Medium</div>
                    <div className="priority-description">Standard priority</div>
                  </div>
                </div>
                
                <div className="priority-option">
                  <div className="priority-radio"></div>
                  <div className="priority-icon high">
                    <i className="fas fa-arrow-up"></i>
                  </div>
                  <div className="priority-details">
                    <div className="priority-name">High</div>
                    <div className="priority-description">Urgent issue</div>
                  </div>
                </div>
                
                <div className="priority-option">
                  <div className="priority-radio"></div>
                  <div className="priority-icon critical">
                    <i className="fas fa-exclamation"></i>
                  </div>
                  <div className="priority-details">
                    <div className="priority-name">Critical</div>
                    <div className="priority-description">System down/blocking</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-field">
              <label>Attachments</label>
              <div className="attachment-dropzone">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop files here or <span className="browse-link">browse files</span></p>
                <p className="file-note">Maximum 5 files, 10MB each (Images, PDFs, Documents)</p>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="cancel-button" onClick={() => setModalPage(1)}>Cancel</button>
            <button className="submit-button">Submit Ticket</button>
          </div>
          
          <div className="support-status">
            <div className="support-status-indicator online"></div>
            <span>Support team online</span>
            <div className="response-time">
              <i className="fas fa-clock"></i>
              <span>Average response time: 30 minutes</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render knowledge base page (placeholder for now)
  const renderKnowledgeBasePage = () => {
    return (
      <div className="knowledge-base-page">
        <div className="kb-header">
          <button className="back-button" onClick={() => setModalPage(1)}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2>Knowledge Base</h2>
          <button className="close-button" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="kb-content">
          <div className="kb-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search for help, FAQs, or solutions..." />
          </div>
          
          <div className="kb-categories">
            <h3>Select a category below to get help with your issue or request:</h3>
            
            <div className="categories-grid">
              <div className="category-card">
                <div className="category-icon" style={{ backgroundColor: '#5856D6' }}>
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="category-info">
                  <h4>Account & Access</h4>
                  <ul className="category-topics">
                    <li>
                      <i className="fas fa-key"></i>
                      <span>Login Issues</span>
                    </li>
                    <li>
                      <i className="fas fa-lock"></i>
                      <span>Permission Problems</span>
                    </li>
                    <li className="more-topics">+1 more</li>
                  </ul>
                </div>
              </div>
              
              <div className="category-card">
                <div className="category-icon" style={{ backgroundColor: '#34C759' }}>
                  <i className="fas fa-user-injured"></i>
                </div>
                <div className="category-info">
                  <h4>Patient Management</h4>
                  <ul className="category-topics">
                    <li>
                      <i className="fas fa-database"></i>
                      <span>Patient Data</span>
                    </li>
                    <li>
                      <i className="fas fa-trash-alt"></i>
                      <span>Delete Records</span>
                    </li>
                    <li className="more-topics">+1 more</li>
                  </ul>
                </div>
              </div>
              
              <div className="category-card">
                <div className="category-icon" style={{ backgroundColor: '#FF9500' }}>
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="category-info">
                  <h4>Billing & Payments</h4>
                  <ul className="category-topics">
                    <li>
                      <i className="fas fa-money-bill-wave"></i>
                      <span>Payment Problems</span>
                    </li>
                    <li>
                      <i className="fas fa-file-invoice-dollar"></i>
                      <span>Invoice Questions</span>
                    </li>
                    <li className="more-topics">+1 more</li>
                  </ul>
                </div>
              </div>
              
              <div className="category-card">
                <div className="category-icon" style={{ backgroundColor: '#FF2D55' }}>
                  <i className="fas fa-wrench"></i>
                </div>
                <div className="category-info">
                  <h4>Technical Support</h4>
                  <ul className="category-topics">
                    <li>
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>System Errors</span>
                    </li>
                    <li>
                      <i className="fas fa-tachometer-alt"></i>
                      <span>Performance Issues</span>
                    </li>
                    <li className="more-topics">+1 more</li>
                  </ul>
                </div>
              </div>
              
              <div className="category-card">
                <div className="category-icon" style={{ backgroundColor: '#007AFF' }}>
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div className="category-info">
                  <h4>Feature Requests</h4>
                  <ul className="category-topics">
                    <li>
                      <i className="fas fa-plus-circle"></i>
                      <span>New Feature</span>
                    </li>
                    <li>
                      <i className="fas fa-star"></i>
                      <span>Enhancement</span>
                    </li>
                    <li className="more-topics">+1 more</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="popular-articles">
            <h3>Popular Articles</h3>
            
            <div className="articles-list">
              <div className="article-item">
                <div className="article-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="article-content">
                  <h4>How to reset your password</h4>
                  <p>Learn how to reset your password if you've forgotten it or need to change it for security reasons.</p>
                  <div className="article-meta">
                    <span className="article-views">
                      <i className="fas fa-eye"></i> 1,245 views
                    </span>
                    <span className="article-helpful">
                      <i className="fas fa-thumbs-up"></i> 98% found this helpful
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="article-item">
                <div className="article-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="article-content">
                  <h4>Understanding billing cycles and subscription options</h4>
                  <p>A comprehensive guide to billing cycles, payment methods, and available subscription plans.</p>
                  <div className="article-meta">
                    <span className="article-views">
                      <i className="fas fa-eye"></i> 982 views
                    </span>
                    <span className="article-helpful">
                      <i className="fas fa-thumbs-up"></i> 95% found this helpful
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="article-item">
                <div className="article-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="article-content">
                <h4>Troubleshooting common login issues</h4>
                  <p>Solutions for common login problems including account verification, password recovery, and authentication errors.</p>
                  <div className="article-meta">
                    <span className="article-views">
                      <i className="fas fa-eye"></i> 1,548 views
                    </span>
                    <span className="article-helpful">
                      <i className="fas fa-thumbs-up"></i> 97% found this helpful
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="support-contact">
            <div className="contact-info">
              <i className="fas fa-headset"></i>
              <h3>Still need help?</h3>
              <p>Can't find what you're looking for? Our support team is here to help.</p>
              <button className="contact-button" onClick={() => setModalPage(2)}>
                <i className="fas fa-ticket-alt"></i>
                <span>Create Support Ticket</span>
              </button>
            </div>
            
            <div className="support-status">
              <div className="support-status-indicator online"></div>
              <span>Support team online</span>
              <div className="response-time">
                <i className="fas fa-clock"></i>
                <span>Average response time: 30 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Main render method
  return isOpen ? (
    <div className="support-modal-overlay">
      <div 
        className={`support-modal ${modalPage > 1 ? 'full-page' : ''}`}
        ref={modalRef}
      >
        {renderModalContent()}
      </div>
    </div>
  ) : null;
};

export default SupportModal;