import React, { useState, useEffect, useRef } from 'react';
import '../../../styles/developer/support/SupportTickets.scss';

const DevSupportTickets = ({ preview = false }) => {
  // States
  const [tickets, setTickets] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketHistory, setTicketHistory] = useState([]);
  const replyInputRef = useRef(null);
  const scrollRef = useRef(null);
  
  // Animation states for premium effects
  const [animateSections, setAnimateSections] = useState({
    filters: false,
    ticketsList: false,
    ticketDetails: false
  });
  
  // Mock templates for reply feature
  const replyTemplates = [
    { id: 1, name: 'General Greeting', content: 'Hello, thank you for reaching out to TherapySync support. I WIll be happy to help you with this issue.' },
    { id: 2, name: 'Technical Acknowledgment', content: 'I understand you are experiencing technical difficulties. I am looking into this right now and will get back to you as soon as possible.' },
    { id: 3, name: 'Resolution Confirmation', content: 'I have applied the fix to your account. Please try logging out and logging back in, then let me know if the issue persists.' },
    { id: 4, name: 'Escalation Notice', content: 'I am escalating this issue to our specialized technical team. They will review your case and respond within 4 business hours.' }
  ];
  
  // Simulated ticket data
  const mockTickets = [
    {
      id: 'TK-1094',
      subject: 'Unable to access patient records after recent update',
      status: 'open',
      priority: 'high',
      customer: 'Jennifer Wilson',
      avatar: 'JW',
      customerEmail: 'jennifer.w@healthcare.org',
      date: '2023-03-14 09:32',
      lastUpdate: '2h ago',
      department: 'Technical',
      responses: 3,
      assigned: 'Luis Nava',
      tags: ['bug', 'access', 'patient records'],
      messages: [
        {
          id: 1,
          sender: 'Jennifer Wilson',
          avatar: 'JW',
          role: 'client',
          time: '09:32 AM',
          date: 'Mar 14, 2023',
          content: 'After updating to the latest version of TherapySync, I am unable to access patient records. The system shows an error message stating "Unauthorized access" even though I have the proper credentials. This is urgent as I need to review patient information for upcoming appointments.',
          attachments: [
            { id: 1, name: 'error_screenshot.png', size: '356 KB', type: 'image' }
          ]
        },
        {
          id: 2,
          sender: 'Support Team',
          avatar: 'ST',
          role: 'support',
          time: '10:15 AM',
          date: 'Mar 14, 2023',
          content: 'Hello Jennifer, thank you for reporting this issue. We are sorry for the inconvenience. Could you please provide your username and the exact error message you are seeing? Also, could you let us know which browser and device you are using? This will help us troubleshoot the problem more effectively.',
          attachments: []
        },
        {
          id: 3,
          sender: 'Jennifer Wilson',
          avatar: 'JW',
          role: 'client',
          time: '10:47 AM',
          date: 'Mar 14, 2023',
          content: 'My username is jwilson2023. The exact error is: "Error 403: Unauthorized access to patient database". I am using Chrome on a Windows 11 laptop. I have tried clearing cache and cookies, but the issue persists.',
          attachments: [
            { id: 2, name: 'detailed_error.png', size: '512 KB', type: 'image' }
          ]
        },
        {
          id: 4,
          sender: 'Luis Nava',
          avatar: 'LN',
          role: 'agent',
          time: '11:30 AM',
          date: 'Mar 14, 2023',
          content: 'Hello Jennifer, this is Luis taking over your case. I have checked your account permissions and found that during the update, your access level was reset. I have restored the proper authorization level for your account. Could you please try logging out and logging back in? The issue should be resolved now. If you continue experiencing problems, please let us know immediately.',
          attachments: []
        }
      ],
      history: [
        { action: 'Ticket created', timestamp: 'Mar 14, 2023 - 09:32 AM', user: 'Jennifer Wilson' },
        { action: 'Assigned to Support Team', timestamp: 'Mar 14, 2023 - 09:45 AM', user: 'System' },
        { action: 'First response sent', timestamp: 'Mar 14, 2023 - 10:15 AM', user: 'Support Team' },
        { action: 'Reassigned to Luis Nava', timestamp: 'Mar 14, 2023 - 11:15 AM', user: 'Support Lead' },
        { action: 'Solution provided', timestamp: 'Mar 14, 2023 - 11:30 AM', user: 'Luis Nava' }
      ]
    },
    {
      id: 'TK-1093',
      subject: 'Calendar sync issue with external scheduling system',
      status: 'in-progress',
      priority: 'medium',
      customer: 'Robert Chen',
      avatar: 'RC',
      customerEmail: 'r.chen@cityhealth.com',
      date: '2023-03-13 16:45',
      lastUpdate: '1d ago',
      department: 'Integration',
      responses: 2,
      assigned: 'Luis Nava',
      tags: ['integration', 'calendar', 'sync'],
      messages: [
        {
          id: 1,
          sender: 'Robert Chen',
          avatar: 'RC',
          role: 'client',
          time: '16:45 PM',
          date: 'Mar 13, 2023',
          content: 'We are experiencing issues with the calendar synchronization between TherapySync and our external scheduling system (Google Calendar). Appointments created in Google Calendar are not appearing in TherapySync, and vice versa. This started happening after the latest integration update.',
          attachments: []
        },
        {
          id: 2,
          sender: 'Luis Nava',
          avatar: 'LN',
          role: 'agent',
          time: '09:30 AM',
          date: 'Mar 14, 2023',
          content: 'Hello Robert, thank you for reporting this issue. I understand how critical calendar synchronization is for your operations. I have looked into your integration settings and noticed that the API connection token has expired. I will generate a new token and update your settings. Could you please test the sync functionality again in about 15 minutes?',
          attachments: []
        },
        {
          id: 3,
          sender: 'Robert Chen',
          avatar: 'RC',
          role: 'client',
          time: '11:15 AM',
          date: 'Mar 14, 2023',
          content: 'Thanks for the quick response, Luis. I tested the sync after waiting 15 minutes, but we are still experiencing issues. Now, appointments created in TherapySync appear in Google Calendar after a significant delay (about 1 hour), but appointments created in Google still do not show up in TherapySync at all.',
          attachments: [
            { id: 1, name: 'sync_log.txt', size: '124 KB', type: 'text' }
          ]
        }
      ],
      history: [
        { action: 'Ticket created', timestamp: 'Mar 13, 2023 - 16:45 PM', user: 'Robert Chen' },
        { action: 'Assigned to Luis Nava', timestamp: 'Mar 14, 2023 - 09:00 AM', user: 'System' },
        { action: 'First response sent', timestamp: 'Mar 14, 2023 - 09:30 AM', user: 'Luis Nava' },
        { action: 'Status changed to In Progress', timestamp: 'Mar 14, 2023 - 11:20 AM', user: 'Luis Nava' }
      ]
    },
    {
      id: 'TK-1092',
      subject: 'Payment processing failure for monthly subscription',
      status: 'pending',
      priority: 'medium',
      customer: 'Sarah Martinez',
      avatar: 'SM',
      customerEmail: 's.martinez@therapycenter.net',
      date: '2023-03-13 14:20',
      lastUpdate: '1d ago',
      department: 'Billing',
      responses: 2,
      assigned: 'Luis Nava',
      tags: ['billing', 'payment', 'subscription'],
      messages: []
    },
    {
      id: 'TK-1091',
      subject: 'Feature request: Add bulk patient import option',
      status: 'open',
      priority: 'low',
      customer: 'Michael Thompson',
      avatar: 'MT',
      customerEmail: 'm.thompson@wellness.org',
      date: '2023-03-12 11:05',
      lastUpdate: '3d ago',
      department: 'Product',
      responses: 1,
      assigned: 'Unassigned',
      tags: ['feature request', 'patient management', 'import'],
      messages: []
    },
    {
      id: 'TK-1090',
      subject: 'Export data in CSV format not working',
      status: 'resolved',
      priority: 'high',
      customer: 'Emma Davis',
      avatar: 'ED',
      customerEmail: 'e.davis@healthgroup.com',
      date: '2023-03-10 08:15',
      lastUpdate: '4d ago',
      department: 'Technical',
      responses: 5,
      assigned: 'Luis Nava',
      tags: ['export', 'data', 'csv'],
      messages: []
    },
    {
      id: 'TK-1089',
      subject: 'Confusion about new billing system',
      status: 'closed',
      priority: 'medium',
      customer: 'David Wilson',
      avatar: 'DW',
      customerEmail: 'david.w@medicalcenter.org',
      date: '2023-03-09 15:30',
      lastUpdate: '5d ago',
      department: 'Billing',
      responses: 4,
      assigned: 'Luis Nava',
      tags: ['billing', 'question', 'training'],
      messages: []
    }
  ];
  
  // Load tickets with premium animation sequence
  useEffect(() => {
    // Simulate API loading
    const loadTickets = setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
      
      // Trigger sequential animations
      const animateFilters = setTimeout(() => {
        setAnimateSections(prev => ({ ...prev, filters: true }));
      }, 200);
      
      const animateTicketsList = setTimeout(() => {
        setAnimateSections(prev => ({ ...prev, ticketsList: true }));
      }, 400);
      
      const animateTicketDetails = setTimeout(() => {
        setAnimateSections(prev => ({ ...prev, ticketDetails: true }));
      }, 600);
      
      // Set default selected ticket in preview mode
      if (preview && mockTickets.length > 0) {
        setSelectedTicket(mockTickets[0]);
      }
      
      return () => {
        clearTimeout(animateFilters);
        clearTimeout(animateTicketsList);
        clearTimeout(animateTicketDetails);
      };
    }, 800);
    
    return () => clearTimeout(loadTickets);
  }, [preview]);
  
  // Auto-scroll to bottom of messages when a new message is added or ticket is selected
  useEffect(() => {
    if (scrollRef.current && selectedTicket) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedTicket]);
  
  // Load ticket history when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      setTicketHistory(selectedTicket.history || []);
    }
  }, [selectedTicket]);
  
  // Filter tickets based on current filter and search query
  const getFilteredTickets = () => {
    let filtered = [...tickets];
    
    // Apply main filter
    if (currentFilter === 'my-tickets') {
      filtered = filtered.filter(ticket => ticket.assigned === 'Luis Nava');
    } else if (currentFilter === 'high-priority') {
      filtered = filtered.filter(ticket => ticket.priority === 'high');
    } else if (currentFilter === 'unassigned') {
      filtered = filtered.filter(ticket => ticket.assigned === 'Unassigned');
    } else if (currentFilter === 'resolved') {
      filtered = filtered.filter(ticket => ticket.status === 'resolved' || ticket.status === 'closed');
    } else if (['technical', 'billing', 'product', 'integration'].includes(currentFilter)) {
      filtered = filtered.filter(ticket => ticket.department.toLowerCase() === currentFilter);
    }
    
    // Apply search query if present
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.subject.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query) ||
        ticket.id.toLowerCase().includes(query) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };
  
  // Change current filter
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    if (!preview) setSelectedTicket(null);
  };
  
  // Select a ticket
  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    if (preview) {
      setIsExpanded(true);
    }
    
    // Focus on reply input after a short delay (for animation to complete)
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 500);
  };
  
  // Handle sending a reply
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    // In a real app, you would send this to your API
    // This is just a simulation
    const newMessage = {
      id: selectedTicket.messages ? selectedTicket.messages.length + 1 : 1,
      sender: 'Luis Nava',
      avatar: 'LN',
      role: 'agent',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      content: replyText,
      attachments: []
    };
    
    // Update the ticket with the new message
    const updatedTicket = {
      ...selectedTicket,
      messages: selectedTicket.messages ? [...selectedTicket.messages, newMessage] : [newMessage],
      lastUpdate: 'Just now',
      responses: selectedTicket.responses + 1
    };
    
    // Update tickets array with the updated ticket
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      )
    );
    
    // Update selected ticket
    setSelectedTicket(updatedTicket);
    
    // Clear the reply text
    setReplyText('');
    
    // Add to history
    const newHistoryItem = {
      action: 'Reply sent',
      timestamp: `${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} - ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`,
      user: 'Luis Nava'
    };
    
    setTicketHistory(prev => [...prev, newHistoryItem]);
  };
  
  // Apply a template to the reply
  const applyTemplate = (template) => {
    setReplyText(template.content);
    setTemplatesDropdownOpen(false);
    
    // Focus and place cursor at the end
    if (replyInputRef.current) {
      replyInputRef.current.focus();
      replyInputRef.current.setSelectionRange(template.content.length, template.content.length);
    }
  };
  
  // Change ticket status
  const changeTicketStatus = (status) => {
    if (!selectedTicket) return;
    
    // Update the ticket status
    const updatedTicket = {
      ...selectedTicket,
      status
    };
    
    // Update tickets array
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      )
    );
    
    // Update selected ticket
    setSelectedTicket(updatedTicket);
    
    // Close dropdown
    setStatusDropdownOpen(false);
    
    // Add to history
    const newHistoryItem = {
      action: `Status changed to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      timestamp: `${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} - ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`,
      user: 'Luis Nava'
    };
    
    setTicketHistory(prev => [...prev, newHistoryItem]);
  };
  
  // Handle ticket assignment
  const assignTicket = () => {
    if (!selectedTicket || selectedTicket.assigned !== 'Unassigned') return;
    
    // Simulate assigning the ticket to the current user
    const updatedTicket = {
      ...selectedTicket,
      assigned: 'Luis Nava'
    };
    
    // Update tickets array
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      )
    );
    
    // Update selected ticket
    setSelectedTicket(updatedTicket);
    
    // Add to history
    const newHistoryItem = {
      action: 'Assigned to Luis Nava',
      timestamp: `${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} - ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`,
      user: 'Luis Nava'
    };
    
    setTicketHistory(prev => [...prev, newHistoryItem]);
  };
  
  // View ticket history
  const viewTicketHistory = () => {
    // In a real app, this would probably open a modal or side panel
    console.log('View history for ticket:', selectedTicket.id, ticketHistory);
  };
  
  // Format ticket time (relative time)
  const formatTime = (timeString) => {
    // This is a simplified version - in production use a library like date-fns or moment
    return timeString;
  };
  
  // Get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'linear-gradient(135deg, #FF5252, #F44336)';
      case 'medium':
        return 'linear-gradient(135deg, #FFB74D, #FF9800)';
      case 'low':
        return 'linear-gradient(135deg, #66BB6A, #4CAF50)';
      default:
        return 'linear-gradient(135deg, #BDBDBD, #9E9E9E)';
    }
  };
  
  // Get background color for status badges
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#2196F3';
      case 'in-progress':
        return '#9C27B0';
      case 'pending':
        return '#FF9800';
      case 'resolved':
        return '#4CAF50';
      case 'closed':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };
  
  // Render status badge with icon
  const renderStatusBadge = (status, large = false) => {
    const color = getStatusColor(status);
    let icon, label;
    
    switch (status) {
      case 'open':
        icon = 'door-open';
        label = 'Open';
        break;
      case 'in-progress':
        icon = 'spinner';
        label = 'In Progress';
        break;
      case 'pending':
        icon = 'pause-circle';
        label = 'Pending';
        break;
      case 'resolved':
        icon = 'check-circle';
        label = 'Resolved';
        break;
      case 'closed':
        icon = 'lock';
        label = 'Closed';
        break;
      default:
        icon = 'question-circle';
        label = 'Unknown';
    }
    
    return (
      <div 
        className={`ticket-status-badge ${large ? 'large' : ''}`}
        style={{ backgroundColor: color }}
      >
        <span className="status-icon">
          <i className={`fas fa-${icon}`}></i>
        </span>
        <span className="status-text">{label}</span>
      </div>
    );
  };
  
  // Generate initials from a name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Get colors for avatar based on name (deterministic)
  const getAvatarColors = (name) => {
    // Simple hash function for name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Color palettes for avatars
    const colorPalettes = [
      ['#FF5252', '#F44336'], // Red
      ['#FF6E40', '#FF3D00'], // Deep Orange
      ['#FFAB40', '#FF9100'], // Orange
      ['#FFD740', '#FFC400'], // Amber
      ['#FFFF00', '#FFEA00'], // Yellow
      ['#EEFF41', '#C6FF00'], // Lime
      ['#B2FF59', '#76FF03'], // Light Green
      ['#69F0AE', '#00E676'], // Green
      ['#40C4FF', '#00B0FF'], // Light Blue
      ['#448AFF', '#2979FF'], // Blue
      ['#536DFE', '#3D5AFE'], // Indigo
      ['#7C4DFF', '#651FFF'], // Deep Purple
      ['#E040FB', '#D500F9'], // Purple
      ['#FF4081', '#C51162'], // Pink
    ];
    
    // Select palette based on hash
    const paletteIndex = hash % colorPalettes.length;
    return `linear-gradient(135deg, ${colorPalettes[paletteIndex][0]}, ${colorPalettes[paletteIndex][1]})`;
  };
  
  // Generate background for user avatar
  const getAvatarStyle = (name) => {
    return {
      background: getAvatarColors(name)
    };
  };
  
  // Main component render
  return (
    <div className={`support-tickets ${preview ? 'preview-mode' : ''} ${isExpanded ? 'expanded' : ''}`}>
      {/* Header section - only show in full mode */}
      {!preview && (
        <div className="tickets-header">
          <div className="tickets-title">
            <h2>Support Tickets</h2>
            <p className="tickets-subtitle">Manage and respond to customer support requests</p>
          </div>
          <div className="tickets-actions">
            <button className="ticket-action new-ticket">
              <i className="fas fa-plus-circle"></i>
              <span>New Ticket</span>
            </button>
            <button className="ticket-action">
              <i className="fas fa-filter"></i>
              <span>Filter</span>
            </button>
            <button className="ticket-action">
              <i className="fas fa-sort"></i>
              <span>Sort</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Main container */}
      <div className="tickets-container">
        {/* Left sidebar: Filters */}
        {!preview && (
          <div className={`tickets-filters ${animateSections.filters ? 'animate' : ''}`}>
            <div className="filters-header">
              <div className="filters-title">
                <h3>Filter Tickets</h3>
              </div>
              <div className="search-container">
                <div className="search-input-wrapper">
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
                      aria-label="Clear search"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="filters-list">
              <div 
                className={`filter-item ${currentFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                <i className="fas fa-ticket-alt"></i>
                <span>All Tickets</span>
                <div className="filter-count">{tickets.length}</div>
              </div>
              <div 
                className={`filter-item ${currentFilter === 'my-tickets' ? 'active' : ''}`}
                onClick={() => handleFilterChange('my-tickets')}
              >
                <i className="fas fa-user-check"></i>
                <span>My Tickets</span>
                <div className="filter-count">
                  {tickets.filter(t => t.assigned === 'Luis Nava').length}
                </div>
              </div>
              <div 
                className={`filter-item ${currentFilter === 'high-priority' ? 'active' : ''}`}
                onClick={() => handleFilterChange('high-priority')}
              >
                <i className="fas fa-exclamation-circle"></i>
                <span>High Priority</span>
                <div className="filter-count priority-count">
                  {tickets.filter(t => t.priority === 'high').length}
                </div>
              </div>
              <div 
                className={`filter-item ${currentFilter === 'unassigned' ? 'active' : ''}`}
                onClick={() => handleFilterChange('unassigned')}
              >
                <i className="fas fa-user-slash"></i>
                <span>Unassigned</span>
                <div className="filter-count unassigned-count">
                  {tickets.filter(t => t.assigned === 'Unassigned').length}
                </div>
              </div>
              <div 
                className={`filter-item ${currentFilter === 'resolved' ? 'active' : ''}`}
                onClick={() => handleFilterChange('resolved')}
              >
                <i className="fas fa-check-circle"></i>
                <span>Resolved/Closed</span>
                <div className="filter-count resolved-count">
                  {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
                </div>
              </div>
            </div>
            
            <div className="filters-section">
              <h4 className="section-title">
                <i className="fas fa-bookmark"></i>
                <span>Departments</span>
              </h4>
              <div className="section-items">
                <div 
                  className={`section-item ${currentFilter === 'technical' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('technical')}
                >
                  <span>Technical</span>
                  <div className="item-count">
                    {tickets.filter(t => t.department === 'Technical').length}
                  </div>
                </div>
                <div 
                  className={`section-item ${currentFilter === 'billing' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('billing')}
                >
                  <span>Billing</span>
                  <div className="item-count">
                    {tickets.filter(t => t.department === 'Billing').length}
                  </div>
                </div>
                <div 
                  className={`section-item ${currentFilter === 'product' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('product')}
                >
                  <span>Product</span>
                  <div className="item-count">
                    {tickets.filter(t => t.department === 'Product').length}
                  </div>
                </div>
                <div 
                  className={`section-item ${currentFilter === 'integration' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('integration')}
                >
                  <span>Integration</span>
                  <div className="item-count">
                    {tickets.filter(t => t.department === 'Integration').length}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional filters section - can be expanded */}
            <div className="filters-section">
              <h4 className="section-title">
                <i className="fas fa-tag"></i>
                <span>Quick Filters</span>
              </h4>
              <div className="quick-filters">
                <div className="filter-tag">
                  <i className="fas fa-clock"></i>
                  <span>Today</span>
                </div>
                <div className="filter-tag">
                  <i className="fas fa-exclamation"></i>
                  <span>Urgent</span>
                </div>
                <div className="filter-tag">
                  <i className="fas fa-star"></i>
                  <span>Favorites</span>
                </div>
                <div className="filter-tag">
                  <i className="fas fa-clock-rotate-left"></i>
                  <span>Recent</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Middle section: Tickets list */}
        <div className={`tickets-list ${animateSections.ticketsList ? 'animate' : ''}`}>
          {/* Header for tickets list */}
          {preview ? (
            <div className="preview-header">
              <h3>Recent Tickets</h3>
              <button 
                className="preview-action" 
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Collapse view" : "Expand view"}
              >
                <i className={`fas fa-${isExpanded ? 'compress-alt' : 'expand-alt'}`}></i>
              </button>
            </div>
          ) : (
            <div className="tickets-list-header">
              <div className="list-title">
                <h3>{currentFilter === 'all' 
                  ? 'All Tickets' 
                  : currentFilter === 'my-tickets' 
                    ? 'My Tickets' 
                    : currentFilter === 'high-priority' 
                      ? 'High Priority'
                      : currentFilter === 'unassigned'
                        ? 'Unassigned'
                        : currentFilter === 'resolved'
                          ? 'Resolved/Closed'
                          : `${currentFilter.charAt(0).toUpperCase()}${currentFilter.slice(1)} Department`
                }</h3>
                <span className="tickets-count">{getFilteredTickets().length} tickets</span>
              </div>
              <div className="list-actions">
                <div className="sort-by">
                  <select defaultValue="newest">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                  </select>
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {loading ? (
            <div className="tickets-loading">
              <div className="loading-spinner"></div>
              <span>Loading tickets...</span>
            </div>
          ) : getFilteredTickets().length > 0 ? (
            <div className="tickets-list-content">
              {/* Map through filtered tickets */}
              {getFilteredTickets().slice(0, preview ? 3 : undefined).map((ticket, index) => (
                <div 
                  key={ticket.id}
                  className={`ticket-item ${selectedTicket && selectedTicket.id === ticket.id ? 'selected' : ''}`}
                  onClick={() => handleTicketSelect(ticket)}
                  style={{
                    animationDelay: `${0.05 * index}s`
                  }}
                >
                  <div 
                    className="ticket-priority" 
                    style={{ background: getPriorityColor(ticket.priority) }}
                  ></div>
                  
                  <div className="ticket-main">
                    <div className="ticket-header">
                      <div className="ticket-id">{ticket.id}</div>
                      {renderStatusBadge(ticket.status)}
                    </div>
                    
                    <div className="ticket-subject">{ticket.subject}</div>
                    
                    <div className="ticket-info">
                      <div className="ticket-customer">
                        <div 
                          className="customer-avatar"
                          style={getAvatarStyle(ticket.customer)}
                        >
                          {ticket.avatar}
                        </div>
                        <span className="customer-name">{ticket.customer}</span>
                      </div>
                      
                      <div className="ticket-meta">
                        <span className="ticket-time">
                          <i className="fas fa-clock"></i> {formatTime(ticket.lastUpdate)}
                        </span>
                        <span className="ticket-responses">
                          <i className="fas fa-reply"></i> {ticket.responses}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ticket-tags">
                      {ticket.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="ticket-tag">{tag}</span>
                      ))}
                      {ticket.tags.length > 3 && (
                        <span className="ticket-tag more">+{ticket.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ticket-assignment">
                    {ticket.assigned === 'Unassigned' ? (
                      <div className="unassigned">
                        <i className="fas fa-user-slash"></i>
                        <span>Unassigned</span>
                      </div>
                    ) : (
                      <div className="assigned">
                        <div 
                          className="assignee-avatar"
                          style={getAvatarStyle(ticket.assigned)}
                        >
                          {getInitials(ticket.assigned)}
                        </div>
                        <span>{ticket.assigned}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* View all link in preview mode */}
              {preview && tickets.length > 3 && (
                <div className="view-all-link">
                  <a href="#tickets">
                    <span>View all tickets</span>
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              )}
            </div>
          ) : (
            // No tickets found state
            <div className="no-tickets">
              <div className="no-data-icon">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <h3>No tickets found</h3>
              <p>
                {searchQuery 
                  ? `No tickets match your search for "${searchQuery}"` 
                  : `There are no tickets matching your current filters`
                }
              </p>
              <div className="no-tickets-actions">
                <button 
                  className="reset-filters-button"
                  onClick={() => {
                    setCurrentFilter('all');
                    setSearchQuery('');
                  }}
                >
                  <i className="fas fa-sync"></i>
                  <span>Reset Filters</span>
                </button>
                <button className="create-ticket-button">
                  <i className="fas fa-plus"></i>
                  <span>Create New Ticket</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right section: Ticket details */}
        <div className={`ticket-details ${animateSections.ticketDetails ? 'animate' : ''}`}>
          {selectedTicket ? (
            <div className="ticket-details-content">
              {/* Ticket header */}
              <div className="ticket-details-header">
                <div className="ticket-details-top">
                  <div className="ticket-header-left">
                    <div className="ticket-details-id">{selectedTicket.id}</div>
                    {renderStatusBadge(selectedTicket.status, true)}
                  </div>
                  <div className="ticket-header-actions">
                    <button className="action-button">
                      <i className="fas fa-star"></i>
                    </button>
                    <button className="action-button">
                      <i className="fas fa-bell"></i>
                    </button>
                    <button className="action-button">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                  </div>
                </div>
                
                <h2 className="ticket-details-subject">{selectedTicket.subject}</h2>
                
                <div className="ticket-details-meta">
                  <div className="ticket-meta-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Created: {selectedTicket.date}</span>
                  </div>
                  <div className="ticket-meta-item">
                    <i className="fas fa-clock"></i>
                    <span>Last update: {selectedTicket.lastUpdate}</span>
                  </div>
                  <div className="ticket-meta-item">
                    <i className="fas fa-tag"></i>
                    <div className="ticket-tags">
                      {selectedTicket.tags.map((tag, index) => (
                        <span key={index} className="ticket-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="ticket-details-actions">
                  <button className="ticket-action-button primary">
                    <i className="fas fa-reply"></i>
                    <span>Reply</span>
                  </button>
                  
                  {selectedTicket.assigned === 'Unassigned' ? (
                    <button 
                      className="ticket-action-button"
                      onClick={assignTicket}
                    >
                      <i className="fas fa-user-plus"></i>
                      <span>Assign to me</span>
                    </button>
                  ) : (
                    <button className="ticket-action-button">
                      <i className="fas fa-exchange-alt"></i>
                      <span>Transfer</span>
                    </button>
                  )}
                  
                  <div className="ticket-action-dropdown">
                    <button 
                      className="ticket-action-button"
                      onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    >
                      <i className="fas fa-tag"></i>
                      <span>Status</span>
                      <i className="fas fa-chevron-down"></i>
                    </button>
                    
                    {statusDropdownOpen && (
                      <div className="dropdown-menu status-dropdown">
                        <div 
                          className="dropdown-item"
                          onClick={() => changeTicketStatus('open')}
                        >
                          <div className="status-dot" style={{ backgroundColor: '#2196F3' }}></div>
                          <span>Open</span>
                        </div>
                        <div 
                          className="dropdown-item"
                          onClick={() => changeTicketStatus('in-progress')}
                        >
                          <div className="status-dot" style={{ backgroundColor: '#9C27B0' }}></div>
                          <span>In Progress</span>
                        </div>
                        <div 
                          className="dropdown-item"
                          onClick={() => changeTicketStatus('pending')}
                        >
                          <div className="status-dot" style={{ backgroundColor: '#FF9800' }}></div>
                          <span>Pending</span>
                        </div>
                        <div 
                          className="dropdown-item"
                          onClick={() => changeTicketStatus('resolved')}
                        >
                          <div className="status-dot" style={{ backgroundColor: '#4CAF50' }}></div>
                          <span>Resolved</span>
                        </div>
                        <div 
                          className="dropdown-item"
                          onClick={() => changeTicketStatus('closed')}
                        >
                          <div className="status-dot" style={{ backgroundColor: '#9E9E9E' }}></div>
                          <span>Closed</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="ticket-action-button secondary"
                    onClick={viewTicketHistory}
                  >
                    <i className="fas fa-history"></i>
                  </button>
                </div>
              </div>
              
              {/* Customer information card */}
              <div className="ticket-customer-info">
                <div 
                  className="customer-avatar"
                  style={getAvatarStyle(selectedTicket.customer)}
                >
                  <span>{selectedTicket.avatar}</span>
                </div>
                
                <div className="customer-details">
                  <div className="customer-name">{selectedTicket.customer}</div>
                  <div className="customer-email">{selectedTicket.customerEmail}</div>
                </div>
                
                <div 
                  className="ticket-priority-badge" 
                  style={{ background: getPriorityColor(selectedTicket.priority) }}
                >
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)} Priority</span>
                </div>
                
                <div className="customer-actions">
                  <button className="customer-action-button">
                    <i className="fas fa-user"></i>
                    <span>View Profile</span>
                  </button>
                  <button 
                    className="customer-action-button"
                    onClick={viewTicketHistory}
                  >
                    <i className="fas fa-history"></i>
                    <span>View History</span>
                  </button>
                </div>
              </div>
              
              {/* Conversation thread */}
              <div 
                className="ticket-conversation" 
                ref={scrollRef}
              >
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  <div className="conversation-thread">
                    {selectedTicket.messages.map((message, index) => (
                      <div 
                        key={message.id} 
                        className={`conversation-message ${message.role}`}
                        style={{
                          animationDelay: `${0.1 * index}s`
                        }}
                      >
                        <div 
                          className="message-avatar"
                          style={getAvatarStyle(message.sender)}
                        >
                          <span>{message.avatar}</span>
                        </div>
                        
                        <div className="message-content">
                          <div className="message-header">
                            <div className="message-sender">
                              <span className="sender-name">{message.sender}</span>
                              {message.role === 'agent' && (
                                <span className="sender-badge">Support Agent</span>
                              )}
                              {message.role === 'support' && (
                                <span className="sender-badge system">Support Team</span>
                              )}
                            </div>
                            <div className="message-time">
                              <span className="time">{message.time}</span>
                              <span className="date">{message.date}</span>
                            </div>
                          </div>
                          
                          <div className="message-text">{message.content}</div>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="message-attachments">
                              {message.attachments.map((attachment) => (
                                <div key={attachment.id} className="message-attachment">
                                  <div className="attachment-icon">
                                    <i className={`fas fa-${attachment.type === 'image' ? 'image' : 'file'}`}></i>
                                  </div>
                                  <div className="attachment-info">
                                    <span className="attachment-name">{attachment.name}</span>
                                    <span className="attachment-size">{attachment.size}</span>
                                  </div>
                                  <div className="attachment-actions">
                                    <button className="attachment-action" title="Download">
                                      <i className="fas fa-download"></i>
                                    </button>
                                    <button className="attachment-action" title="Preview">
                                      <i className="fas fa-eye"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="message-actions">
                            <button className="message-action-btn">
                              <i className="fas fa-reply"></i>
                              <span>Reply</span>
                            </button>
                            <button className="message-action-btn">
                              <i className="fas fa-thumbs-up"></i>
                            </button>
                            <button className="message-action-btn">
                              <i className="fas fa-ellipsis-h"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-messages">
                    <div className="no-data-icon">
                      <i className="fas fa-comments"></i>
                    </div>
                    <h3>No conversation history</h3>
                    <p>Start the conversation by sending a reply</p>
                  </div>
                )}
              </div>
              
              {/* Reply form */}
              <div className="ticket-reply-form">
                <div className="reply-form-header">
                  <h4>Add Reply</h4>
                  <div className="form-actions">
                    <div className="attachment-dropdown">
                      <button 
                        className="form-action-button"
                        onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                      >
                        <i className="fas fa-paperclip"></i>
                        <span>Attach</span>
                        <i className="fas fa-chevron-down"></i>
                      </button>
                      
                      {showAttachmentOptions && (
                        <div className="dropdown-menu attachment-options">
                          <div className="dropdown-item">
                            <i className="fas fa-file"></i>
                            <span>File</span>
                          </div>
                          <div className="dropdown-item">
                            <i className="fas fa-image"></i>
                            <span>Image</span>
                          </div>
                          <div className="dropdown-item">
                            <i className="fas fa-file-pdf"></i>
                            <span>PDF</span>
                          </div>
                          <div className="dropdown-item">
                            <i className="fas fa-link"></i>
                            <span>Link</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button className="form-action-button">
                      <i className="fas fa-code"></i>
                      <span>Code</span>
                    </button>
                    
                    <button className="form-action-button">
                      <i className="fas fa-image"></i>
                      <span>Image</span>
                    </button>
                    
                    <div className="templates-dropdown">
                      <button 
                        className="form-action-button"
                        onClick={() => setTemplatesDropdownOpen(!templatesDropdownOpen)}
                      >
                        <i className="fas fa-file-alt"></i>
                        <span>Template</span>
                        <i className="fas fa-chevron-down"></i>
                      </button>
                      
                      {templatesDropdownOpen && (
                        <div className="dropdown-menu templates-options">
                          {replyTemplates.map(template => (
                            <div 
                              key={template.id} 
                              className="dropdown-item"
                              onClick={() => applyTemplate(template)}
                            >
                              <i className="fas fa-file-alt"></i>
                              <span>{template.name}</span>
                            </div>
                          ))}
                          <div className="dropdown-divider"></div>
                          <div className="dropdown-item">
                            <i className="fas fa-plus"></i>
                            <span>Create New Template</span>
                          </div>
                          <div className="dropdown-item">
                            <i className="fas fa-cog"></i>
                            <span>Manage Templates</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="reply-form-content">
                  <textarea 
                    placeholder="Type your reply here..."
                    rows="5"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    ref={replyInputRef}
                  ></textarea>
                  
                  <div className="formatting-toolbar">
                    <button className="formatting-button" title="Bold">
                      <i className="fas fa-bold"></i>
                    </button>
                    <button className="formatting-button" title="Italic">
                      <i className="fas fa-italic"></i>
                    </button>
                    <button className="formatting-button" title="Underline">
                      <i className="fas fa-underline"></i>
                    </button>
                    <button className="formatting-button" title="Strike">
                      <i className="fas fa-strikethrough"></i>
                    </button>
                    <span className="divider"></span>
                    <button className="formatting-button" title="Bullet List">
                      <i className="fas fa-list-ul"></i>
                    </button>
                    <button className="formatting-button" title="Numbered List">
                      <i className="fas fa-list-ol"></i>
                    </button>
                    <span className="divider"></span>
                    <button className="formatting-button" title="Link">
                      <i className="fas fa-link"></i>
                    </button>
                    <button className="formatting-button" title="Code">
                      <i className="fas fa-code"></i>
                    </button>
                  </div>
                </div>
                
                <div className="reply-form-footer">
                  <div className="reply-options">
                    <div className="reply-option">
                      <input type="checkbox" id="notification" defaultChecked />
                      <label htmlFor="notification">Send notification to customer</label>
                    </div>
                    <div className="reply-option">
                      <input type="checkbox" id="internal-note" />
                      <label htmlFor="internal-note">Internal note (not visible to customer)</label>
                    </div>
                  </div>
                  
                  <div className="reply-buttons">
                    <button className="reply-button secondary">Save as Draft</button>
                    <button 
                      className="reply-button primary"
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                    >
                      <i className="fas fa-paper-plane"></i>
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // No ticket selected state
            <div className="ticket-details-empty">
              <div className="empty-state-content">
                <div className="empty-icon">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <h3>No Ticket Selected</h3>
                <p>Select a ticket from the list to view details</p>
                <button className="create-ticket-button">
                  <i className="fas fa-plus"></i>
                  <span>Create New Ticket</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevSupportTickets;