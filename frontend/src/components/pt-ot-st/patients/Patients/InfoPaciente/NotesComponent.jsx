import React, { useState, useEffect, useRef } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/NotesComponent.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAuth } from '../../../../login/AuthContext';

const NotesComponent = ({ patient, onUpdateNotes }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [newNoteType, setNewNoteType] = useState('text');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [sortBy, setSortBy] = useState('date-desc');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  
  const { currentUser } = useAuth();
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const signatureCanvasCtx = useRef(null);
  const isDrawing = useRef(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  };
  
  const confirmModalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.15 }
    }
  };

  // Initialize canvas for signature
  useEffect(() => {
    if (isAddingNote && newNoteType === 'signature' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      signatureCanvasCtx.current = ctx;
      
      // Set up the canvas
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'black';
      
      // Clear the canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isAddingNote, newNoteType]);

  // Fetch notes data
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      // In a real implementation, this would be an API call
      // For demo purposes, we'll use dummy data based on the patient prop
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (patient?.id) {
        // Generate dummy notes based on patient ID to simulate personalized data
        const dummyNotes = generateDummyNotes(patient);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(dummyNotes.map(note => note.category))];
        setCategories(['all', ...uniqueCategories]);
        
        setNotes(dummyNotes);
        setFilteredNotes(dummyNotes);
      } else {
        setNotes([]);
        setFilteredNotes([]);
        setCategories(['all']);
      }
      
      setIsLoading(false);
    };
    
    fetchNotes();
  }, [patient]);

  // Filter and sort notes
  useEffect(() => {
    let result = [...notes];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        note => note.title.toLowerCase().includes(query) || 
                note.content.toLowerCase().includes(query) ||
                note.author.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(note => note.category === selectedCategory);
    }
    
    // Sort notes
    result = sortNotes(result, sortBy);
    
    setFilteredNotes(result);
  }, [notes, searchQuery, sortBy, selectedCategory]);

  // Sort notes based on criteria
  const sortNotes = (notesToSort, sortCriteria) => {
    const sortedNotes = [...notesToSort];
    
    switch (sortCriteria) {
      case 'date-desc':
        return sortedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'date-asc':
        return sortedNotes.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'title-asc':
        return sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sortedNotes.sort((a, b) => b.title.localeCompare(a.title));
      case 'author':
        return sortedNotes.sort((a, b) => a.author.localeCompare(b.author));
      case 'category':
        return sortedNotes.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sortedNotes;
    }
  };

  // Generate dummy notes for demo
  const generateDummyNotes = (patient) => {
    const therapists = patient.disciplines.PT.isActive ? [patient.disciplines.PT.therapist?.name] : [];
    if (patient.disciplines.OT.isActive && patient.disciplines.OT.therapist) {
      therapists.push(patient.disciplines.OT.therapist.name);
    }
    if (patient.disciplines.ST.isActive && patient.disciplines.ST.therapist) {
      therapists.push(patient.disciplines.ST.therapist.name);
    }
    
    const assistants = patient.disciplines.PT.isActive ? [patient.disciplines.PT.assistant?.name] : [];
    if (patient.disciplines.OT.isActive && patient.disciplines.OT.assistant) {
      assistants.push(patient.disciplines.OT.assistant.name);
    }
    if (patient.disciplines.ST.isActive && patient.disciplines.ST.assistant) {
      assistants.push(patient.disciplines.ST.assistant.name);
    }
    
    // Filter out any undefined or null values
    const availableTherapists = therapists.filter(Boolean);
    const availableAssistants = assistants.filter(Boolean);
    
    // Create some initial notes
    return [
      {
        id: 1,
        title: 'Initial Evaluation Notes',
        content: `Patient ${patient.name} presented with right-sided weakness following left CVA in 03/2023. Patient demonstrates significant difficulty with all functional mobility tasks requiring assistance for transfers and ambulation. Will benefit from PT intervention to improve strength, balance, and functional mobility.`,
        type: 'text',
        category: 'Clinical',
        author: availableTherapists.length ? availableTherapists[0] : 'System',
        userRole: 'PT',
        date: '2025-02-11T14:30:00',
        isPinned: true,
        isEditable: true,
        tags: ['Initial Eval', 'PT', 'Mobility']
      },
      {
        id: 2,
        title: 'Follow-up: Gait Training',
        content: 'Patient showing improvement in gait pattern with assistive device. Decreased shuffling noted. Continue with current exercise plan and progress as tolerated.',
        type: 'text',
        category: 'Follow-up',
        author: availableAssistants.length ? availableAssistants[0] : 'System',
        userRole: 'PTA',
        date: '2025-02-15T10:45:00',
        isPinned: false,
        isEditable: true,
        tags: ['Gait Training', 'Progress']
      },
      {
        id: 3,
        title: 'ADL Training Session',
        content: 'Worked on upper extremity dressing tasks. Patient able to don shirt with minimal assistance. Continuing to work on button manipulation and fine motor skills.',
        type: 'text',
        category: 'Therapy Session',
        author: availableTherapists.length > 1 ? availableTherapists[1] : (availableTherapists.length ? availableTherapists[0] : 'System'),
        userRole: 'OT',
        date: '2025-02-20T13:15:00',
        isPinned: false,
        isEditable: true,
        tags: ['OT', 'ADL', 'Dressing']
      },
      {
        id: 4,
        title: 'Caregiver Education',
        content: 'Met with patient\'s son to educate on safe transfer techniques and home exercise program supervision. Caregiver demonstrated understanding and proper technique.',
        type: 'text',
        category: 'Education',
        author: 'Admin Staff',
        userRole: 'Admin',
        date: '2025-02-25T09:30:00',
        isPinned: true,
        isEditable: true,
        tags: ['Caregiver', 'Education', 'HEP']
      },
      {
        id: 5,
        title: 'Balance Assessment',
        content: 'Completed Berg Balance Assessment. Score: 32/56 indicating moderate fall risk. Will implement balance training program focusing on static and dynamic balance activities.',
        type: 'text',
        category: 'Assessment',
        author: availableTherapists.length ? availableTherapists[0] : 'System',
        userRole: 'PT',
        date: '2025-03-02T11:00:00',
        isPinned: false,
        isEditable: true,
        tags: ['Balance', 'Assessment', 'Fall Risk']
      }
    ];
  };

  // Handle note drag and drop for reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(filteredNotes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFilteredNotes(items);
    
    // In a real app, you'd also want to update the backend with the new order
    // onUpdateNotes(items);
  };

  // Toggle note pinned status
  const togglePinNote = (noteId) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    );
    
    setNotes(updatedNotes);
    
    // In a real app, you'd also want to update the backend
    // onUpdateNotes(updatedNotes);
  };

  // Handle deleting a note
  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setShowDeleteConfirm(true);
  };

  // Confirm note deletion
  const confirmDelete = () => {
    if (!noteToDelete) return;
    
    const updatedNotes = notes.filter(note => note.id !== noteToDelete.id);
    setNotes(updatedNotes);
    
    // Close the modal and reset the note to delete
    setShowDeleteConfirm(false);
    setNoteToDelete(null);
    
    // If we're viewing the note, close the view modal
    if (activeNoteId === noteToDelete.id) {
      setActiveNoteId(null);
    }
    
    // In a real app, you'd also want to update the backend
    // onUpdateNotes(updatedNotes);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setNoteToDelete(null);
  };

  // Initialize new note form
  const handleAddNote = (type = 'text') => {
    setNewNoteType(type);
    setIsAddingNote(true);
  };

  // Show note details
  const handleViewNote = (noteId) => {
    setActiveNoteId(noteId);
  };

  // Handle saving a new note
  const handleSaveNote = (e) => {
    e.preventDefault();
    
    const form = e.target;
    const title = form.title.value.trim();
    const category = form.category.value;
    const tags = form.tags.value.split(',').map(tag => tag.trim()).filter(Boolean);
    
    let content = '';
    
    // Get content based on note type
    if (newNoteType === 'text') {
      content = form.content.value.trim();
    } else if (newNoteType === 'signature') {
      if (canvasRef.current) {
        content = canvasRef.current.toDataURL();
      }
    }
    
    if (!title || !content) {
      alert('Please provide both a title and content for the note.');
      return;
    }
    
    // Get current user info
    const authorName = currentUser?.fullname || 'Current User';
    const userRole = currentUser?.role || 'Staff';
    
    // Create new note
    const newNote = {
      id: Date.now(), // simple ID generation for demo
      title,
      content,
      type: newNoteType,
      category,
      author: authorName,
      userRole: userRole,
      date: new Date().toISOString(),
      isPinned: false,
      isEditable: true,
      tags
    };
    
    // Add new note to state
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    
    // Reset form
    setIsAddingNote(false);
    
    // In a real app, you'd also want to update the backend
    // onUpdateNotes(updatedNotes);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    
    // In a real app, you'd upload the file to your server
    // For this demo, we'll just create a note with the file name
    
    // You would typically upload the file first, then get a URL back
    // We'll simulate that with a dummy URL
    
    const file = files[0];
    const fileType = file.type.split('/')[0];
    let noteType = 'file';
    
    if (fileType === 'image') {
      noteType = 'image';
    } else if (fileType === 'video') {
      noteType = 'video';
    } else if (fileType === 'audio') {
      noteType = 'audio';
    }
    
    // Get current user info
    const authorName = currentUser?.fullname || 'Current User';
    const userRole = currentUser?.role || 'Staff';
    
    // Create a new note with file information
    const newNote = {
      id: Date.now(),
      title: file.name,
      content: URL.createObjectURL(file), // In real app, this would be the server URL
      type: noteType,
      category: 'Media',
      author: authorName,
      userRole: userRole,
      date: new Date().toISOString(),
      isPinned: false,
      isEditable: true,
      tags: [fileType, 'uploaded']
    };
    
    // Add new note to state
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // In a real app, you'd also want to update the backend
    // onUpdateNotes(updatedNotes);
  };

  // Signature drawing functions
  const startDrawing = (e) => {
    if (!signatureCanvasCtx.current) return;
    
    isDrawing.current = true;
    const ctx = signatureCanvasCtx.current;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e) => {
    if (!isDrawing.current || !signatureCanvasCtx.current) return;
    
    const ctx = signatureCanvasCtx.current;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    isDrawing.current = false;
  };

  // Clear signature canvas
  const clearSignature = () => {
    if (!signatureCanvasCtx.current || !canvasRef.current) return;
    
    const ctx = signatureCanvasCtx.current;
    const canvas = canvasRef.current;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format short date helper
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    
    // Get day, month and year
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    // Get time
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    const hours12 = hours % 12 || 12;
    
    return {
      day,
      month,
      year,
      time: `${hours12}:${minutes} ${ampm}`
    };
  };

  // Get user role color
  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'PT': return '#3b82f6';
      case 'OT': return '#8b5cf6';
      case 'ST': return '#ec4899';
      case 'PTA': return '#60a5fa';
      case 'COTA': return '#a78bfa';
      case 'ADMIN': return '#64748b';
      default: return '#64748b';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase().replace(/\s+/g, '-')) {
      case 'clinical': return 'rgb(44, 123, 229)';
      case 'follow-up': return 'rgb(76, 175, 80)';
      case 'therapy-session': return 'rgb(156, 39, 176)';
      case 'assessment': return 'rgb(255, 152, 0)';
      case 'education': return 'rgb(0, 188, 212)';
      case 'administrative': return 'rgb(96, 125, 139)';
      case 'media': return 'rgb(244, 67, 54)';
      default: return 'rgb(100, 116, 139)';
    }
  };

  // Note card component
  const NoteCard = ({ note, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Format date for the card
    const dateFormatted = formatShortDate(note.date);
    
    return (
      <Draggable draggableId={note.id.toString()} index={index}>
        {(provided) => (
          <div
            className={`note-card ${note.isPinned ? 'pinned' : ''}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="note-header" {...provided.dragHandleProps}>
              <div className="note-category">
                <span 
                  className="category-indicator" 
                  style={{ backgroundColor: getCategoryColor(note.category) }}
                ></span>
                <span className="category-name">{note.category}</span>
              </div>
              <div className="note-actions">
                {isHovered && (
                  <motion.div 
                    className="action-buttons"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button 
                      className="action-btn view-btn" 
                      onClick={() => handleViewNote(note.id)}
                      title="View Note"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="action-btn pin-btn" 
                      onClick={() => togglePinNote(note.id)}
                      title={note.isPinned ? "Unpin Note" : "Pin Note"}
                    >
                      <i className={`fas ${note.isPinned ? 'fa-thumbtack' : 'fa-thumbtack'}`}></i>
                    </button>
                    {note.isEditable && (
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDeleteClick(note)}
                        title="Delete Note"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="note-content" onClick={() => handleViewNote(note.id)}>
              <h3 className="note-title">
                {note.isPinned && <i className="fas fa-thumbtack pin-icon"></i>}
                {note.title}
              </h3>
              
              {note.type === 'text' && (
                <div className="note-text">
                  <p>{note.content.length > 120 ? `${note.content.substring(0, 120)}...` : note.content}</p>
                </div>
              )}
              
              {note.type === 'image' && (
                <div className="note-image">
                  <img src={note.content} alt={note.title} />
                </div>
              )}
              
              {note.type === 'signature' && (
                <div className="note-signature">
                  <img src={note.content} alt="Signature" />
                </div>
              )}
              
              {(note.type === 'file' || note.type === 'audio' || note.type === 'video') && (
                <div className="note-file">
                  <i className={`fas ${note.type === 'audio' ? 'fa-file-audio' : 
                                      note.type === 'video' ? 'fa-file-video' : 
                                      'fa-file'}`}></i>
                  <span>{note.title}</span>
                </div>
              )}
            </div>
            
            <div className="note-footer">
              <div className="note-date-block">
                <div className="date-box">
                  <span className="date-day">{dateFormatted.day}</span>
                  <span className="date-month">{dateFormatted.month}</span>
                </div>
                <div className="date-year-time">
                  <span className="date-year">{dateFormatted.year}</span>
                  <span className="date-time">{dateFormatted.time}</span>
                </div>
              </div>
              
              <div className="note-meta">
                <div className="note-author">
                  <div 
                    className="author-icon" 
                    style={{
                      backgroundColor: getRoleColor(note.userRole)
                    }}
                  >
                    {note.author.charAt(0)}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{note.author}</span>
                    <span className="author-role">{note.userRole}</span>
                  </div>
                </div>
                
                {note.tags && note.tags.length > 0 && (
                  <div className="note-tags">
                    {note.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="tag more-tag">+{note.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className={`notes-component ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="notes-header">
        <div className="header-left">
          <div className="icon-wrapper">
            <i className="fas fa-sticky-note"></i>
          </div>
          <h2>Patient Notes</h2>
          <div className="note-count">{filteredNotes.length} notes</div>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
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
          
          <div className="filter-group">
            <div className="category-filter">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sort-filter">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="author">Author</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
          
          <div className="view-actions">
            <button 
              className="view-btn fullscreen-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            >
              <i className={`fas ${isFullscreen ? 'fa-compress-alt' : 'fa-expand-alt'}`}></i>
            </button>
            
            <div className="add-note-container">
              <button 
                className="add-note-btn"
                onClick={() => setShowQuickActions(!showQuickActions)}
                title="Add Note"
              >
                <i className="fas fa-plus"></i>
                <span>Add Note</span>
              </button>
              
              {showQuickActions && (
                <motion.div 
                  className="quick-actions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button onClick={() => { handleAddNote('text'); setShowQuickActions(false); }}>
                    <i className="fas fa-align-left"></i>
                    <span>Text Note</span>
                  </button>
                  <button onClick={() => { fileInputRef.current?.click(); setShowQuickActions(false); }}>
                    <i className="fas fa-file-upload"></i>
                    <span>Upload File</span>
                  </button>
                  <button onClick={() => { handleAddNote('signature'); setShowQuickActions(false); }}>
                    <i className="fas fa-signature"></i>
                    <span>Signature</span>
                  </button>
                </motion.div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="notes-loading">
          <div className="loading-spinner">
            <div className="spinner-icon">
              <i className="fas fa-circle-notch fa-spin"></i>
            </div>
            <div className="loading-text">
              <span>Loading notes</span>
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {filteredNotes.length === 0 ? (
            <div className="no-notes">
              <div className="empty-state">
                <i className="fas fa-sticky-note empty-icon"></i>
                <h3>No notes found</h3>
                <p>{searchQuery ? 'Try adjusting your search criteria' : 'Start by adding your first note for this patient'}</p>
                {!searchQuery && (
                  <button className="add-first-note" onClick={() => handleAddNote()}>
                    <i className="fas fa-plus"></i>
                    Add First Note
                  </button>
                )}
              </div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="notes-list">
                {(provided) => (
                  <motion.div 
                    className="notes-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {filteredNotes.map((note, index) => (
                      <motion.div 
                        key={note.id}
                        variants={itemVariants}
                        className="note-wrapper"
                      >
                        <NoteCard note={note} index={index} />
                      </motion.div>
                    ))}
                    {provided.placeholder}
                  </motion.div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </>
      )}
      
      {/* Add/Edit Note Modal */}
      <AnimatePresence>
        {isAddingNote && (
          <div className="modal-overlay">
            <motion.div 
              className="note-modal add-note-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="modal-header">
                <h3>{newNoteType === 'text' ? 'Add Text Note' : 
                    newNoteType === 'signature' ? 'Add Signature' : 
                    'Add Note'}</h3>
                <button className="close-modal" onClick={() => setIsAddingNote(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleSaveNote}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input 
                      type="text" 
                      id="title" 
                      name="title" 
                      placeholder="Enter note title"
                      required
                    />
                  </div>
                  
                  {newNoteType === 'text' && (
                    <div className="form-group">
                      <label htmlFor="content">Content</label>
                      <textarea
                        id="content"
                        name="content"
                        ref={textareaRef}
                        rows={10}
                        placeholder="Enter note content..."
                        className="custom-textarea"
                        required
                      ></textarea>
                      <div className="text-editor-toolbar">
                        <button type="button" onClick={() => {
                          if (textareaRef.current) {
                            textareaRef.current.value += '**Bold text**';
                          }
                        }}>
                          <i className="fas fa-bold"></i>
                        </button>
                        <button type="button" onClick={() => {
                          if (textareaRef.current) {
                            textareaRef.current.value += '*Italic text*';
                          }
                        }}>
                          <i className="fas fa-italic"></i>
                        </button>
                        <button type="button" onClick={() => {
                          if (textareaRef.current) {
                            textareaRef.current.value += '# Heading';
                          }
                        }}>
                          <i className="fas fa-heading"></i>
                        </button>
                        <button type="button" onClick={() => {
                          if (textareaRef.current) {
                            textareaRef.current.value += '\n- List item\n- List item\n- List item';
                          }
                        }}>
                          <i className="fas fa-list-ul"></i>
                        </button>
                        <button type="button" onClick={() => {
                          if (textareaRef.current) {
                            textareaRef.current.value += '\n1. Numbered item\n2. Numbered item\n3. Numbered item';
                          }
                        }}>
                          <i className="fas fa-list-ol"></i>
                        </button>
                      </div>
                      <div className="textarea-note">
                        <small>Tip: You can use Markdown for formatting (*italic*, **bold**, # heading, etc.)</small>
                      </div>
                    </div>
                  )}
                  
                  {newNoteType === 'signature' && (
                    <div className="form-group signature-group">
                      <label>Signature</label>
                      <div className="signature-container">
                        <canvas
                          ref={canvasRef}
                          width={500}
                          height={200}
                          className="signature-canvas"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseOut={stopDrawing}
                        />
                      </div>
                      <button type="button" className="clear-signature" onClick={clearSignature}>
                        <i className="fas fa-eraser"></i> Clear
                      </button>
                      <div className="signature-instruction">
                        <small>Sign using your mouse or touchpad in the box above</small>
                      </div>
                    </div>
                  )}
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select id="category" name="category">
                        <option value="Clinical">Clinical</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Therapy Session">Therapy Session</option>
                        <option value="Assessment">Assessment</option>
                        <option value="Education">Education</option>
                        <option value="Administrative">Administrative</option>
                        <option value="Media">Media</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="tags">Tags (comma separated)</label>
                      <input 
                        type="text" 
                        id="tags" 
                        name="tags" 
                        placeholder="e.g. important, follow-up, review"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setIsAddingNote(false)}>
                    <i className="fas fa-times"></i> Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    <i className="fas fa-save"></i> Save Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* View Note Modal */}
      <AnimatePresence>
        {activeNoteId && (
          <div className="modal-overlay" onClick={() => setActiveNoteId(null)}>
            <motion.div 
              className="note-modal view-note-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const activeNote = notes.find(note => note.id === activeNoteId);
                if (!activeNote) return null;
                
                // Simple Markdown parser
                const parseMarkdown = (text) => {
                  if (!text) return '';
                  
                  // Convert headings
                  text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');
                  text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
                  text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
                  
                  // Convert bold and italic
                  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
                  
                  // Convert unordered lists
                  text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
                  text = text.replace(/(<li>.+<\/li>(\n|$))+/g, '<ul>$&</ul>');
                  
                  // Convert ordered lists
                  text = text.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
                  text = text.replace(/(<li>.+<\/li>(\n|$))+/g, '<ol>$&</ol>');
                  
                  // Convert paragraphs
                  text = text.replace(/^(?!<[uo]l|<li|<h).+$/gm, '<p>$&</p>');
                  text = text.replace(/<\/p>\n<p>/g, '</p><p>');
                  
                  return text;
                };
                
                // Format date for the view header
                const dateFormatted = formatShortDate(activeNote.date);
                
                return (
                  <>
                    <div className="modal-header">
                      <div className="modal-title">
                        <div 
                          className="category-indicator" 
                          style={{ backgroundColor: getCategoryColor(activeNote.category) }}
                        ></div>
                        <h3>{activeNote.title}</h3>
                      </div>
                      <div className="modal-actions">
                        {activeNote.isEditable && (
                          <button 
                            className="action-btn pin-btn" 
                            onClick={() => togglePinNote(activeNote.id)}
                            title={activeNote.isPinned ? "Unpin Note" : "Pin Note"}
                          >
                            <i className={`fas ${activeNote.isPinned ? 'fa-thumbtack' : 'fa-thumbtack'}`}></i>
                          </button>
                        )}
                        <button className="close-modal" onClick={() => setActiveNoteId(null)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="modal-body">
                      <div className="view-note-info">
                        <div 
                          className="view-author-avatar"
                          style={{ backgroundColor: getRoleColor(activeNote.userRole) }}
                        >
                          {activeNote.author.charAt(0)}
                        </div>
                        <div className="view-note-metadata">
                          <div className="view-note-author">
                            <span className="view-author-name">{activeNote.author}</span>
                            <span 
                              className="view-author-role"
                              style={{ color: getRoleColor(activeNote.userRole) }}
                            >
                              {activeNote.userRole}
                            </span>
                          </div>
                          <div className="view-note-date">
                            <span className="date-display">
                              <i className="far fa-calendar-alt"></i>
                              {dateFormatted.month} {dateFormatted.day}, {dateFormatted.year} at {dateFormatted.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {activeNote.type === 'text' && (
                        <div 
                          className="note-full-text" 
                          dangerouslySetInnerHTML={{ 
                            __html: parseMarkdown(activeNote.content) 
                          }}
                        ></div>
                      )}
                      
                      {activeNote.type === 'image' && (
                        <div className="note-full-image">
                          <img src={activeNote.content} alt={activeNote.title} />
                        </div>
                      )}
                      
                      {activeNote.type === 'signature' && (
                        <div className="note-full-signature">
                          <img src={activeNote.content} alt="Signature" />
                        </div>
                      )}
                      
                      {(activeNote.type === 'file' || activeNote.type === 'audio' || activeNote.type === 'video') && (
                        <div className="note-file-preview">
                          {activeNote.type === 'audio' && (
                            <audio controls>
                              <source src={activeNote.content} />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                          
                          {activeNote.type === 'video' && (
                            <video controls>
                              <source src={activeNote.content} />
                              Your browser does not support the video element.
                            </video>
                          )}
                          
                          {activeNote.type === 'file' && (
                            <div className="file-info">
                              <i className="fas fa-file-alt file-icon"></i>
                              <span className="file-name">{activeNote.title}</span>
                              <a href={activeNote.content} className="download-link" download>
                                <i className="fas fa-download"></i> Download File
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {activeNote.tags && activeNote.tags.length > 0 && (
                        <div className="view-note-tags">
                          <div className="tags-header">
                            <i className="fas fa-tags"></i> Tags
                          </div>
                          <div className="tags-list">
                            {activeNote.tags.map((tag, idx) => (
                              <span key={idx} className="tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="modal-footer">
                      <div className="note-details">
                        <div className="category-info">
                          <span className="category-label">Category:</span>
                          <span 
                            className="category-badge"
                            style={{ 
                              backgroundColor: getCategoryColor(activeNote.category),
                              color: 'white'
                            }}
                          >
                            {activeNote.category}
                          </span>
                        </div>
                      </div>
                      
                      {activeNote.isEditable && (
                        <div className="modal-actions">
                          <button 
                            className="delete-btn" 
                            onClick={() => { 
                              handleDeleteClick(activeNote); 
                              setActiveNoteId(null); 
                            }}
                          >
                            <i className="fas fa-trash-alt"></i> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && noteToDelete && (
          <div className="modal-overlay">
            <motion.div 
              className="note-modal delete-confirm-modal"
              variants={confirmModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="modal-header delete-header">
                <h3>Delete Note</h3>
                <button className="close-modal" onClick={cancelDelete}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body delete-body">
                <div className="delete-warning-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                
                <h4 className="delete-title">Are you sure you want to delete this note?</h4>
                
                <div className="delete-note-preview">
                  <div className="preview-title">
                    <i className={`fas ${
                      noteToDelete.type === 'text' ? 'fa-align-left' : 
                      noteToDelete.type === 'image' ? 'fa-image' :
                      noteToDelete.type === 'signature' ? 'fa-signature' :
                      noteToDelete.type === 'audio' ? 'fa-file-audio' :
                      noteToDelete.type === 'video' ? 'fa-file-video' :
                      'fa-file'
                    }`}></i>
                    {noteToDelete.title}
                  </div>
                  
                  <div className="preview-details">
                    <span className="preview-author">
                      <i className="fas fa-user-md"></i> {noteToDelete.author}
                    </span>
                    <span className="preview-date">
                      <i className="fas fa-calendar-alt"></i> {formatDate(noteToDelete.date)}
                    </span>
                  </div>
                </div>
                
                <div className="delete-warning">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>This action cannot be undone.</span>
                </div>
              </div>
              
              <div className="modal-footer delete-footer">
                <button className="cancel-btn" onClick={cancelDelete}>
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button className="delete-confirm-btn" onClick={confirmDelete}>
                  <i className="fas fa-trash-alt"></i> Delete Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Floating Action Button */}
      <div className="floating-action-button">
        <button 
          className="fab-button"
          onClick={() => handleAddNote()}
        >
          <i className="fas fa-plus"></i>
          <span className="fab-tooltip">Add Note</span>
        </button>
      </div>
    </div>
  );
};

export default NotesComponent;