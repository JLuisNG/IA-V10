import React, { useState, useEffect } from 'react';
import SignaturePad from './SignaturePad';
import '../../../../../styles/developer/Patients/InfoPaciente/VisitModalComponent.scss';

const VisitModalComponent = ({ 
  isOpen, 
  onClose, 
  visitData, 
  onSave, 
  certPeriodDates, 
  patientInfo,
  visitStatus
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    visitType: '',
    therapist: '',
    date: '',
    time: '',
    notes: '',
    status: 'SCHEDULED',
    missedReason: '',
    physician: '',
    timeInHour: '03',
    timeInMinute: '00',
    timeInAmPm: 'PM',
    timeOutHour: '04',
    timeOutMinute: '00',
    timeOutAmPm: 'PM',
    gCode: '',
    certPeriod: '',
    documents: []
  });
  const [missedVisitData, setMissedVisitData] = useState({
    reason: '',
    action: '',
    mdNotified: false,
    noShow: false
  });
  const [signatureData, setSignatureData] = useState({
    patient: null,
    therapist: null,
    date: null,
    patientOutside: false,
    therapistOutside: false
  });
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  
  // Simulated data for therapists
  const therapists = [
    { id: 'pt1', name: 'Dr. Michael Chen', type: 'PT' },
    { id: 'pta1', name: 'Maria Gonzalez', type: 'PTA' },
    { id: 'ot1', name: 'Dr. Emily Parker', type: 'OT' },
    { id: 'cota1', name: 'Thomas Smith', type: 'COTA' },
    { id: 'st1', name: 'Dr. Jessica Lee', type: 'ST' },
    { id: 'sta1', name: 'Robert Williams', type: 'STA' },
  ];

  // Visit types
  const visitTypes = [
    { id: 'INITIAL', label: 'Initial Eval' },
    { id: 'REGULAR', label: 'Regular therapy session' },
    { id: 'RECERT', label: 'Recertification evaluation' },
    { id: 'DISCHARGE', label: 'Discharge (DC w/o a visit)' },
    { id: 'POST_HOSPITAL', label: 'Post-Hospital Eval' },
    { id: 'REASSESSMENT', label: 'Reassessment' },
    { id: 'SOC_OASIS', label: 'SOC OASIS' },
    { id: 'ROC_OASIS', label: 'ROC OASIS' },
    { id: 'RECERT_OASIS', label: 'ReCert OASIS' },
    { id: 'FOLLOWUP_OASIS', label: 'Follow-Up OASIS' },
    { id: 'DC_OASIS', label: 'DC OASIS' },
    { id: 'SUPERVISION', label: 'Supervision Assessment' },
  ];

  // Visit actions
  const visitActions = [
    { id: 'OT_EVAL', label: 'OT Evaluation' },
    { id: 'PT_EVAL', label: 'PT Evaluation' },
    { id: 'MISSED_VISIT', label: 'Missed Visit' },
    { id: 'RESCHEDULE', label: 'Reschedule Visit' },
  ];

  // Missed visit reasons
  const missedReasons = [
    'Select an option',
    'Caregiver Provided Care',
    'Patient/Caregiver Refused',
    'Patient Had Physician Appointment',
    'No Answer Door/Phone',
    'Inclement Weather',
    'Medical Treatment Only',
    'Transition Recert',
    'Patient Expired',
    'Patient Declined This Discipline',
    'HH Initiation Visit Missed',
    'Patient Hospitalized',
    'Awaiting Insurance Authorization',
    'Awaiting Verbal Orders',
    'Waiting on authorization patient declined private pay',
    'Other'
  ];

  // Progress note types
  const progressNoteTypes = [
    { id: 'OT_PROGRESS', label: 'OT Therapy Progress Note' },
    { id: 'OT_SOAP', label: 'OT SOAP Note' },
    { id: 'MISSED_VISIT', label: 'Missed Visit' },
    { id: 'PAPER_COMPLETED', label: 'Completed on Paper' },
    { id: 'RESCHEDULE_REPORT', label: 'Reschedule visit w/ comm. report' },
    { id: 'RESCHEDULE', label: 'Reschedule visit' },
  ];

  // Certification periods
  const certPeriods = [
    { id: 'period1', label: '11/30/2024 - 1/28/2025' },
    { id: 'period2', label: '8/30/2024 - 10/28/2024' },
    { id: 'period3', label: '5/30/2024 - 7/28/2024' },
  ];

  // Hours and minutes for time selection
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Initialize form data when visit data changes
  useEffect(() => {
    if (visitData) {
      setFormData({
        visitType: visitData.visitType || 'INITIAL',
        therapist: visitData.therapist || therapists[0].id,
        date: visitData.date || formatDateToLocalISOString(new Date()),
        time: visitData.time || '15:00',
        notes: visitData.notes || '',
        status: visitData.status || 'SCHEDULED',
        missedReason: visitData.missedReason || '',
        physician: visitData.physician || 'Dr. John Smith',
        timeInHour: visitData.timeInHour || '03',
        timeInMinute: visitData.timeInMinute || '00',
        timeInAmPm: visitData.timeInAmPm || 'PM',
        timeOutHour: visitData.timeOutHour || '04',
        timeOutMinute: visitData.timeOutMinute || '00',
        timeOutAmPm: visitData.timeOutAmPm || 'PM',
        gCode: visitData.gCode || 'G0151',
        certPeriod: visitData.certPeriod || certPeriods[0].id,
        documents: visitData.documents || []
      });

      // Set reschedule date if available
      if (visitData.rescheduledDate) {
        setRescheduleDate(visitData.rescheduledDate);
      }

      // Set signature data if available
      if (visitData.signatures) {
        setSignatureData({
          patient: visitData.signatures.patient || null,
          therapist: visitData.signatures.therapist || null,
          date: visitData.signatures.date || null,
          patientOutside: visitData.signatures.patientOutside || false,
          therapistOutside: visitData.signatures.therapistOutside || false
        });
      }
    }
  }, [visitData]);

  // Format date to local ISO string
  const formatDateToLocalISOString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  // Handle missed visit input changes
  const handleMissedVisitChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMissedVisitData({
      ...missedVisitData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle signature changes
  const handleSignatureChange = (type, data) => {
    setSignatureData({
      ...signatureData,
      [type]: data
    });
  };

  // Handle signature checkbox changes
  const handleSignatureCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSignatureData({
      ...signatureData,
      [name]: checked
    });
  };

  // Save visit data
  const handleSave = () => {
    if (!formData.visitType || !formData.therapist || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    // Combine all data
    const combinedData = {
      ...formData,
      signatures: signatureData,
      missedVisit: activeTab === 'missedVisit' ? missedVisitData : null,
      rescheduledDate: activeTab === 'reschedule' ? rescheduleDate : null
    };

    // Simulate API call
    setTimeout(() => {
      onSave(combinedData);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!selectedFile) return;

    // Simulate file upload
    setIsLoading(true);
    setTimeout(() => {
      const newDocuments = [...formData.documents, {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        uploadDate: new Date().toISOString()
      }];
      
      setFormData({
        ...formData,
        documents: newDocuments
      });
      
      setSelectedFile(null);
      setIsLoading(false);
    }, 1000);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Handle removing a document
  const handleRemoveDocument = (docId) => {
    const updatedDocs = formData.documents.filter(doc => doc.id !== docId);
    setFormData({
      ...formData,
      documents: updatedDocs
    });
  };

  // Render the appropriate content based on active tab and visit status
  const renderContent = () => {
    // If visit status is completed, show completed visit view
    if (visitStatus === 'COMPLETED') {
      return renderCompletedVisitView();
    }

    // For scheduled visits, show appropriate tab based on action
    switch (activeTab) {
      case 'details':
        return renderVisitDetails();
      case 'missedVisit':
        return renderMissedVisitForm();
      case 'reschedule':
        return renderRescheduleForm();
      case 'signatures':
        return renderSignaturesTab();
      case 'documents':
        return renderDocumentsTab();
      default:
        return renderVisitDetails();
    }
  };

  // Render visit details form
  const renderVisitDetails = () => {
    return (
      <div className="visit-details-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Visit Type</label>
          <select
            name="visitType"
            value={formData.visitType}
            onChange={handleInputChange}
            className="form-input"
          >
            {visitTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Therapist</label>
          <select
            name="therapist"
            value={formData.therapist}
            onChange={handleInputChange}
            className="form-input"
          >
            {therapists.map((therapist) => (
              <option key={therapist.id} value={therapist.id}>
                {therapist.name} ({therapist.type})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="form-input"
              min={certPeriodDates?.startDate || undefined}
              max={certPeriodDates?.endDate || undefined}
            />
          </div>

          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="MISSED">Missed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {formData.status === 'MISSED' && (
          <div className="form-group">
            <label>Reason for Missing</label>
            <input
              type="text"
              name="missedReason"
              value={formData.missedReason}
              onChange={handleInputChange}
              placeholder="Enter reason"
              className="form-input"
            />
          </div>
        )}

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add visit notes"
            className="form-input"
            rows="5"
          ></textarea>
        </div>

        <div className="action-buttons">
          <button type="button" className="action-button missed-button" onClick={() => setActiveTab('missedVisit')}>
            <i className="fas fa-calendar-times"></i> Mark as Missed
          </button>
          <button type="button" className="action-button reschedule-button" onClick={() => setActiveTab('reschedule')}>
            <i className="fas fa-calendar-alt"></i> Reschedule
          </button>
        </div>
      </div>
    );
  };

  // Render completed visit view (details and evaluation)
  const renderCompletedVisitView = () => {
    return (
      <div className="completed-visit-view">
        <div className="details-section">
          <h3>Visit Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                name="visitType"
                value={formData.visitType}
                onChange={handleInputChange}
                className="form-input"
              >
                {visitTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>G-Code</label>
            <input
              type="text"
              name="gCode"
              value={formData.gCode}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-row time-row">
            <div className="form-group time-group">
              <label>Time In</label>
              <div className="time-selectors">
                <select 
                  name="timeInHour"
                  value={formData.timeInHour}
                  onChange={handleInputChange}
                >
                  {hours.map(hour => (
                    <option key={`in-hour-${hour}`} value={hour}>{hour}</option>
                  ))}
                </select>
                <span className="time-separator">:</span>
                <select 
                  name="timeInMinute"
                  value={formData.timeInMinute}
                  onChange={handleInputChange}
                >
                  {minutes.map(minute => (
                    <option key={`in-min-${minute}`} value={minute}>{minute}</option>
                  ))}
                </select>
                <select 
                  name="timeInAmPm"
                  value={formData.timeInAmPm}
                  onChange={handleInputChange}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <div className="form-group time-group">
              <label>Time Out</label>
              <div className="time-selectors">
                <select 
                  name="timeOutHour"
                  value={formData.timeOutHour}
                  onChange={handleInputChange}
                >
                  {hours.map(hour => (
                    <option key={`out-hour-${hour}`} value={hour}>{hour}</option>
                  ))}
                </select>
                <span className="time-separator">:</span>
                <select 
                  name="timeOutMinute"
                  value={formData.timeOutMinute}
                  onChange={handleInputChange}
                >
                  {minutes.map(minute => (
                    <option key={`out-min-${minute}`} value={minute}>{minute}</option>
                  ))}
                </select>
                <select 
                  name="timeOutAmPm"
                  value={formData.timeOutAmPm}
                  onChange={handleInputChange}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Note Header Physician</label>
            <input
              type="text"
              name="physician"
              value={formData.physician}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>Missed Visit</label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="missedVisit"
                  checked={formData.status === 'MISSED'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({...formData, status: 'MISSED'});
                    } else {
                      setFormData({...formData, status: 'SCHEDULED'});
                    }
                  }}
                  id="missedVisit"
                />
                <label htmlFor="missedVisit" className="checkbox-label"></label>
              </div>
            </div>
            

          </div>

          <div className="form-group">
            <label>Cert Period</label>
            <select
              name="certPeriod"
              value={formData.certPeriod}
              onChange={handleInputChange}
              className="form-input"
            >
              {certPeriods.map((period) => (
                <option key={period.id} value={period.id}>{period.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-input"
              rows="5"
            ></textarea>
          </div>

          <button 
            className="update-button"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading">
                <i className="fas fa-spinner fa-spin"></i> Updating...
              </span>
            ) : (
              'UPDATE'
            )}
          </button>
        </div>

        <div className="evaluation-section">
          <div className="evaluation-header">
            <h3>OT EVALUATION</h3>
            <div className="evaluation-status">
              <span className="status-label">Status:</span>
              <span className="status-value incomplete">Incomplete</span>
            </div>
          </div>

          <div className="evaluation-therapist">
            <span>Therapist: Barrios, Veronica</span>
          </div>

          <div className="evaluation-actions">
            <button className="edit-button">
              EDIT
            </button>
            <button className="view-button">
              VIEW
            </button>
          </div>

          <div className="documents-section">
            <h3>UPLOADED DOCUMENTS</h3>
            
            {formData.documents.length === 0 ? (
              <div className="no-documents">
                <p>No Files Uploaded</p>
              </div>
            ) : (
              <div className="documents-list">
                {formData.documents.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="document-info">
                      <span className="document-name">{doc.name}</span>
                      <span className="document-details">
                        {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                    <button 
                      className="document-remove"
                      onClick={() => handleRemoveDocument(doc.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="file-upload">
              <div className="file-select">
                <input
                  type="file"
                  id="fileUpload"
                  className="file-input"
                  onChange={handleFileSelect}
                />
                <label htmlFor="fileUpload" className="choose-file-btn">
                  CHOOSE FILE
                </label>
                <span className="file-name">
                  {selectedFile ? selectedFile.name : 'No file selected'}
                </span>
              </div>
              <button 
                className="upload-btn"
                onClick={handleFileUpload}
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  'UPLOAD'
                )}
              </button>
            </div>
          </div>

          <div className="other-forms-section">
            <h3>OTHER FORMS</h3>
            <div className="form-buttons">
              <button className="form-button">ADD ADDENDUM</button>
              <button className="form-button">ADD SIGNATURES</button>
              <button className="form-button">ADD OQBI</button>
              <button className="form-button">ADD DC</button>
              <button className="form-button other-forms-btn">OTHER FORMS</button>
              <button className="form-button add-sticky-btn">ADD STICKY</button>
              <button className="form-button add-expense-btn">ADD EXPENSE</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render missed visit form
  const renderMissedVisitForm = () => {
    return (
      <div className="missed-visit-form">
        <h3>Missed Visit Report</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>REASON FOR MISSED VISIT:</label>
          <select
            name="reason"
            value={missedVisitData.reason}
            onChange={handleMissedVisitChange}
            className="form-input"
          >
            {missedReasons.map((reason, index) => (
              <option key={index} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>ACTION TAKEN:</label>
          <textarea
            name="action"
            value={missedVisitData.action}
            onChange={handleMissedVisitChange}
            className="form-input"
            rows="5"
          ></textarea>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="mdNotified"
            checked={missedVisitData.mdNotified}
            onChange={handleMissedVisitChange}
            id="mdNotified"
          />
          <label htmlFor="mdNotified">MD WAS NOTIFIED BY PHONE OF MISSED VISIT.</label>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="noShow"
            checked={missedVisitData.noShow}
            onChange={handleMissedVisitChange}
            id="noShow"
          />
          <label htmlFor="noShow">PATIENT WAS A NO-SHOW.</label>
        </div>
      </div>
    );
  };

  // Render reschedule form
  const renderRescheduleForm = () => {
    return (
      <div className="reschedule-form">
        <h3>Reschedule Visit</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-info">
          <p>
            <i className="fas fa-info-circle"></i>
            Please select a new date for this visit. The current visit details will be preserved.
          </p>
        </div>

        <div className="form-group">
          <label>Original Date</label>
          <input
            type="date"
            value={formData.date}
            readOnly
            className="form-input readonly"
          />
        </div>

        <div className="form-group">
          <label>New Date <span className="required">*</span></label>
          <input
            type="date"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
            className="form-input"
            min={certPeriodDates?.startDate || undefined}
            max={certPeriodDates?.endDate || undefined}
            required
          />
        </div>

        <div className="form-group">
          <label>Reason for Rescheduling</label>
          <textarea
            name="rescheduleReason"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Enter reason for rescheduling"
            className="form-input"
            rows="4"
          ></textarea>
        </div>
      </div>
    );
  };

  // Render signatures tab
  const renderSignaturesTab = () => {
    return (
      <div className="signatures-tab">
        <div className="signatures-container">
          <div className="signature-section">
            <h3>Patient Signature</h3>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="patientOutside"
                checked={signatureData.patientOutside}
                onChange={handleSignatureCheckboxChange}
                id="patientOutside"
              />
              <label htmlFor="patientOutside">Captured signature outside of system</label>
            </div>
            
            <div className="signature-pad-container">
              <SignaturePad 
                label="PATIENT SIGNATURE" 
                onSignatureChange={(data) => handleSignatureChange('patient', data)}
                initialSignature={signatureData.patient}
                disabled={signatureData.patientOutside}
              />
            </div>
          </div>

          <div className="signature-section">
            <h3>Therapist Signature</h3>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="therapistOutside"
                checked={signatureData.therapistOutside}
                onChange={handleSignatureCheckboxChange}
                id="therapistOutside"
              />
              <label htmlFor="therapistOutside">Captured signature outside of system</label>
            </div>
            
            <div className="signature-pad-container">
              <SignaturePad 
                label="THERAPIST SIGNATURE" 
                onSignatureChange={(data) => handleSignatureChange('therapist', data)}
                initialSignature={signatureData.therapist}
                disabled={signatureData.therapistOutside}
              />
            </div>
          </div>

          <div className="signature-section">
            <h3>Date Signature</h3>
            
            <div className="signature-pad-container">
              <SignaturePad 
                label="DATE SIGNATURE" 
                onSignatureChange={(data) => handleSignatureChange('date', data)}
                initialSignature={signatureData.date}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render documents tab
  const renderDocumentsTab = () => {
    return (
      <div className="documents-tab">
        <h3>Uploaded Documents</h3>
        
        {formData.documents.length === 0 ? (
          <div className="no-documents">
            <div className="empty-state">
              <i className="fas fa-file-upload"></i>
              <p>No documents uploaded yet</p>
            </div>
          </div>
        ) : (
          <div className="documents-list">
            {formData.documents.map(doc => (
              <div key={doc.id} className="document-item">
                <div className="document-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="document-info">
                  <span className="document-name">{doc.name}</span>
                  <span className="document-details">
                    {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  className="document-remove"
                  onClick={() => handleRemoveDocument(doc.id)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="file-upload">
          <div className="file-select">
            <input
              type="file"
              id="fileUpload"
              className="file-input"
              onChange={handleFileSelect}
            />
            <label htmlFor="fileUpload" className="choose-file-btn">
              CHOOSE FILE
            </label>
            <span className="file-name">
              {selectedFile ? selectedFile.name : 'No file selected'}
            </span>
          </div>
          <button 
            className="upload-btn"
            onClick={handleFileUpload}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              'UPLOAD'
            )}
          </button>
        </div>
      </div>
    );
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="visit-modal-overlay">
      <div className="visit-modal">
        <div className="modal-header">
          <h2>
            {visitStatus === 'COMPLETED' ? 'Visit Detail' : 'Visit Information'}
            {formData.date && <span className="visit-date"> - {new Date(formData.date).toLocaleDateString()}</span>}
          </h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {renderContent()}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-indicator">
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </span>
            ) : (
              activeTab === 'missedVisit' ? 'Submit Missed Visit' : 
              activeTab === 'reschedule' ? 'Reschedule' : 
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitModalComponent;