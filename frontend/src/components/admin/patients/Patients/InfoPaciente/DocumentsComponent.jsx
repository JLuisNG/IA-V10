import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFile, faFileAlt, faFilePdf, faFileImage, faFileArchive, 
  faFileExcel, faFilePowerpoint, faFileWord, faFileCode,
  faDownload, faTrashAlt, faEye, faPlus, faUpload, faSearch,
  faTimes, faCheck, faInfoCircle, faSpinner, faSort, faSortUp, faSortDown
} from '@fortawesome/free-solid-svg-icons';
import '../../../../../styles/developer/Patients/InfoPaciente/DocumentsComponent.scss';

const DocumentsComponent = ({ patient, onUpdateDocuments }) => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const fileInputRef = useRef(null);
  
  // Document categories
  const categories = [
    'All',
    'Medical Reports',
    'Assessments',
    'Progress Notes',
    'Insurance',
    'Prescriptions',
    'Discharge Forms',
    'Other'
  ];

  // Fetch documents data when component mounts
  useEffect(() => {
    if (patient?.documents) {
      setDocuments(patient.documents || []);
    } else {
      // Mock data for demonstration purposes
      const mockDocuments = [
        {
          id: 1,
          name: 'Evaluation Report.pdf',
          type: 'pdf',
          size: 2456000,
          category: 'Medical Reports',
          uploadedBy: 'Dr. Michael Chen',
          uploadDate: '2025-02-15T14:30:00',
          description: 'Initial evaluation report by PT',
          url: '/documents/eval-report.pdf'
        },
        {
          id: 2,
          name: 'Insurance Approval.pdf',
          type: 'pdf',
          size: 1240000,
          category: 'Insurance',
          uploadedBy: 'Admin Staff',
          uploadDate: '2025-02-10T09:15:00',
          description: 'Insurance approval for therapy sessions',
          url: '/documents/insurance-approval.pdf'
        },
        {
          id: 3,
          name: 'Progress Notes - Week 1.docx',
          type: 'docx',
          size: 350000,
          category: 'Progress Notes',
          uploadedBy: 'Dr. Michael Chen',
          uploadDate: '2025-02-20T16:45:00',
          description: 'Weekly progress notes after first week of therapy',
          url: '/documents/progress-notes-w1.docx'
        },
        {
          id: 4,
          name: 'Exercise Program.jpg',
          type: 'jpg',
          size: 1750000,
          category: 'Assessments',
          uploadedBy: 'Maria Gonzalez',
          uploadDate: '2025-02-25T10:20:00',
          description: 'Custom exercise program illustration',
          url: '/documents/exercise-program.jpg'
        }
      ];
      
      setDocuments(mockDocuments);
    }
  }, [patient]);

  // Reset success states after animation completes
  useEffect(() => {
    let timer;
    if (uploadSuccess) {
      timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }
    
    return () => clearTimeout(timer);
  }, [uploadSuccess]);
  
  useEffect(() => {
    let timer;
    if (deleteSuccess) {
      timer = setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    }
    
    return () => clearTimeout(timer);
  }, [deleteSuccess]);

  const getFileIcon = (fileType) => {
    switch(fileType.toLowerCase()) {
      case 'pdf':
        return <FontAwesomeIcon icon={faFilePdf} className="file-icon pdf" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FontAwesomeIcon icon={faFileImage} className="file-icon image" />;
      case 'doc':
      case 'docx':
        return <FontAwesomeIcon icon={faFileWord} className="file-icon word" />;
      case 'xls':
      case 'xlsx':
        return <FontAwesomeIcon icon={faFileExcel} className="file-icon excel" />;
      case 'ppt':
      case 'pptx':
        return <FontAwesomeIcon icon={faFilePowerpoint} className="file-icon powerpoint" />;
      case 'zip':
      case 'rar':
        return <FontAwesomeIcon icon={faFileArchive} className="file-icon archive" />;
      case 'js':
      case 'html':
      case 'css':
      case 'json':
        return <FontAwesomeIcon icon={faFileCode} className="file-icon code" />;
      default:
        return <FontAwesomeIcon icon={faFileAlt} className="file-icon default" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    try {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleString('en-US', options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelected = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
  
    handleFileUpload(files[0]);
    e.target.value = null; // Limpiar el input
  };
  
  const handleFileUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);
  
    // Verificar si el archivo ya existe
    const fileExists = documents.some(doc => doc.name === file.name);
    if (fileExists) {
      setIsUploading(false);
      alert('Este archivo ya ha sido subido.');
      return;
    }
  
    // Simular progreso de subida
    const interval = setInterval(() => {
      setUploadProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Crear el nuevo documento
            const newDocument = {
              id: Date.now(), // Usar timestamp para ID único
              name: file.name,
              type: file.name.split('.').pop(),
              size: file.size,
              category: 'Other',
              uploadedBy: 'Current User',
              uploadDate: new Date().toISOString(),
              description: '',
              url: URL.createObjectURL(file),
            };
            
            // Actualizar documentos locales primero
            const updatedDocs = [newDocument, ...documents];
            setDocuments(updatedDocs);
            
            // Notificar al componente padre después
            if (onUpdateDocuments) {
              onUpdateDocuments(updatedDocs);
            }
            
            setIsUploading(false);
            setUploadSuccess(true);
          }, 500);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 100);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (document) => {
    setSelectedDocument(document);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const updatedDocuments = documents.filter(doc => doc.id !== selectedDocument.id);
    setDocuments(updatedDocuments);
    setIsDeleteModalOpen(false);
    setDeleteSuccess(true);
    
    // Notify parent component
    if (onUpdateDocuments) {
      onUpdateDocuments(updatedDocuments);
    }
  };

  const handleDownload = (document) => {
    // In a real app, this would be a proper download link
    const link = document.url;
    window.open(link, '_blank');
  };

  const filterDocuments = () => {
    let filteredDocs = [...documents];
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      filteredDocs = filteredDocs.filter(doc => doc.category === categoryFilter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        doc.name.toLowerCase().includes(term) || 
        (doc.description && doc.description.toLowerCase().includes(term)) ||
        (doc.uploadedBy && doc.uploadedBy.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    filteredDocs.sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filteredDocs;
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') {
      return <FontAwesomeIcon icon={faSortUp} />;
    } else {
      return <FontAwesomeIcon icon={faSortDown} />;
    }
  };

  const filteredDocuments = filterDocuments();

  return (
    <div className="documents-component premium">
      <div className="documents-header">
        <div className="header-content">
          <div className="header-icon">
            <FontAwesomeIcon icon={faFile} />
          </div>
          <h2 className="header-title">Patient Documents</h2>
        </div>
        <div className="header-actions">
          <button className="action-button upload-btn" onClick={handleFileUploadClick}>
            <FontAwesomeIcon icon={faUpload} />
            <span>Upload Document</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileSelected}
          />
        </div>
      </div>
      
      <div className="documents-toolbar">
        <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        
        <div className="filter-container">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <div className="sort-container">
            <label>Sort by:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
            <button className="sort-order-btn" onClick={toggleSortOrder} aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}>
              {getSortIcon()}
            </button>
          </div>
        </div>
      </div>
      
      {isUploading && (
        <div className="upload-progress-container">
          <div className="upload-info">
            <div className="upload-icon-wrapper">
              <FontAwesomeIcon icon={faUpload} className="upload-icon pulse" />
            </div>
            <div className="upload-details">
              <div className="upload-title">
                <span>Uploading document...</span>
                <span className="progress-percentage">{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {uploadSuccess && (
        <div className="notification-container success">
          <div className="notification-icon">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="notification-message">
            <div className="notification-title">Upload Complete</div>
            <div className="notification-description">Document has been successfully uploaded</div>
          </div>
          <button className="notification-close" onClick={() => setUploadSuccess(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      
      {deleteSuccess && (
        <div className="notification-container delete">
          <div className="notification-icon">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="notification-message">
            <div className="notification-title">Document Deleted</div>
            <div className="notification-description">Document has been permanently removed</div>
          </div>
          <button className="notification-close" onClick={() => setDeleteSuccess(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      
      <div className="documents-list-container">
        <div className="documents-list">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((document, index) => (
              <div 
                className="document-card" 
                key={document.id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="document-icon">
                  {getFileIcon(document.type)}
                </div>
                <div className="document-details">
                  <div className="document-name-row">
                    <div className="document-name">{document.name}</div>
                    <div className="document-category">{document.category}</div>
                  </div>
                  <div className="document-meta">
                    <span className="document-size">{formatFileSize(document.size)}</span>
                    <span className="document-date">
                      <span className="meta-label">Uploaded:</span> {formatDate(document.uploadDate)}
                    </span>
                  </div>
                  <div className="document-uploader">
                    <span className="meta-label">By:</span>
                    <strong>{document.uploadedBy}</strong>
                  </div>
                  {document.description && (
                    <div className="document-description">{document.description}</div>
                  )}
                </div>
                <div className="document-actions">
                  <button 
                    className="action-btn view-btn" 
                    onClick={() => handleViewDocument(document)}
                    title="View Document"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    <span className="action-label">View</span>
                  </button>
                  <button 
                    className="action-btn download-btn" 
                    onClick={() => handleDownload(document)}
                    title="Download Document"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    <span className="action-label">Download</span>
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDeleteClick(document)}
                    title="Delete Document"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                    <span className="action-label">Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-documents">
              <FontAwesomeIcon icon={faFile} className="no-documents-icon" />
              <p className="no-documents-text">No documents found</p>
              <button className="upload-document-btn" onClick={handleFileUploadClick}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Upload New Document</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* View Document Modal */}
      {isViewModalOpen && selectedDocument && (
        <div className="modal-overlay">
          <div className="document-view-modal">
            <div className="modal-header">
              <div className="modal-title">
                {getFileIcon(selectedDocument.type)}
                <h3>{selectedDocument.name}</h3>
              </div>
              <button 
                className="close-modal-btn"
                onClick={() => setIsViewModalOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="document-preview">
                {selectedDocument.type === 'pdf' ? (
                  <iframe 
                    src={selectedDocument.url} 
                    title={selectedDocument.name} 
                    width="100%" 
                    height="500px"
                  />
                ) : selectedDocument.type.match(/jpe?g|png|gif/i) ? (
                  <img 
                    src={selectedDocument.url} 
                    alt={selectedDocument.name} 
                    className="preview-image" 
                  />
                ) : (
                  <div className="no-preview">
                    <FontAwesomeIcon icon={faFile} className="no-preview-icon" />
                    <p>Preview not available for this file type</p>
                    <button 
                      className="download-btn"
                      onClick={() => handleDownload(selectedDocument)}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      <span>Download to View</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="document-info">
                <div className="info-section">
                  <h4 className="info-section-title">File Information</h4>
                  <div className="info-grid">
                    <div className="info-row">
                      <div className="info-label">File Type:</div>
                      <div className="info-value">{selectedDocument.type.toUpperCase()}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Size:</div>
                      <div className="info-value">{formatFileSize(selectedDocument.size)}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Category:</div>
                      <div className="info-value">
                        <span className="info-badge">{selectedDocument.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="info-section">
                  <h4 className="info-section-title">Upload Information</h4>
                  <div className="info-grid">
                    <div className="info-row">
                      <div className="info-label">Uploaded By:</div>
                      <div className="info-value">{selectedDocument.uploadedBy}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Upload Date:</div>
                      <div className="info-value">{formatDate(selectedDocument.uploadDate)}</div>
                    </div>
                  </div>
                </div>
                
                {selectedDocument.description && (
                  <div className="info-section">
                    <h4 className="info-section-title">Description</h4>
                    <div className="info-description">{selectedDocument.description}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn cancel-btn"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
              <button 
                className="modal-btn download-btn"
                onClick={() => handleDownload(selectedDocument)}
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedDocument && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <div className="modal-header">
              <div className="modal-title warning">
                <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" />
                <h3>Delete Document</h3>
              </div>
              <button 
                className="close-modal-btn"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-file-info">
                <div className="delete-file-icon">
                  {getFileIcon(selectedDocument.type)}
                </div>
                <div className="delete-file-details">
                  <div className="delete-file-name">{selectedDocument.name}</div>
                  <div className="delete-file-meta">
                    {formatFileSize(selectedDocument.size)} • {selectedDocument.category}
                  </div>
                </div>
              </div>
              
              <div className="delete-warning">
                <FontAwesomeIcon icon={faInfoCircle} className="warning-icon" />
                <p>Are you sure you want to delete this document? This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn cancel-btn"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn delete-btn"
                onClick={handleConfirmDelete}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsComponent;