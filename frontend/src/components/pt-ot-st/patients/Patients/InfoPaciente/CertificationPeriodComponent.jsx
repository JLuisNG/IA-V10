import React, { useState, useEffect } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/CertificationPeriodComponent.scss';

const CertificationPeriodComponent = ({ patient, onUpdateCertPeriod }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editData, setEditData] = useState({
    startDate: '',
    endDate: '',
    insurance: '',
    policyNumber: '',
    agency: ''
  });
  const [certPeriods, setCertPeriods] = useState([]);
  const [activePeriodId, setActivePeriodId] = useState(null);
  
  // Initialize with patient data
  useEffect(() => {
    if (patient?.certPeriod) {
      // Extract dates from "MM-DD-YYYY to MM-DD-YYYY" format
      const [startDateStr, endDateStr] = patient.certPeriod.split(' to ');
      
      setEditData({
        startDate: formatDateForInput(startDateStr),
        endDate: formatDateForInput(endDateStr),
        insurance: patient.insurance || '',
        policyNumber: patient.policyNumber || '',
        agency: patient.agency || ''
      });
      
      // Simulate certification history with sample data
      const mockPeriods = [
        {
          id: 1,
          period: '03-05-2025 to 05-04-2025',
          status: 'active',
          insurance: patient.insurance,
          policyNumber: patient.policyNumber,
          agency: patient.agency
        },
        {
          id: 2,
          period: '04-19-2023 to 04-19-2025',
          status: 'expired',
          insurance: 'Blue Cross Blue Shield',
          policyNumber: 'BCB-123456789',
          agency: 'Supportive Health Group'
        },
        {
          id: 3,
          period: '04-19-2021 to 04-19-2023',
          status: 'expired',
          insurance: 'Blue Cross Blue Shield',
          policyNumber: 'BCB-123456789',
          agency: 'Valley Home Health Services'
        }
      ];
      
      setCertPeriods(mockPeriods);
      setActivePeriodId(1); // Set the active period ID
    }
  }, [patient]);
  
  // Calculate days remaining and progress
  const calculateDaysRemaining = (certPeriod) => {
    if (!certPeriod) return { percentage: 0, daysRemaining: 0, totalDays: 0 };
    
    try {
      const [startDateStr, endDateStr] = certPeriod.split(' to ');
      
      const [startMonth, startDay, startYear] = startDateStr.split('-').map(Number);
      const [endMonth, endDay, endYear] = endDateStr.split('-').map(Number);
      
      const startDate = new Date(startYear, startMonth - 1, startDay);
      const endDate = new Date(endYear, endMonth - 1, endDay);
      const currentDate = new Date();
      
      // Calculate total duration and days remaining
      const totalDuration = endDate - startDate;
      const daysTotal = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));
      
      if (currentDate > endDate) {
        return { percentage: 100, daysRemaining: 0, totalDays: daysTotal, daysElapsed: daysTotal };
      }
      
      if (currentDate < startDate) {
        return { percentage: 0, daysRemaining: daysTotal, totalDays: daysTotal, daysElapsed: 0 };
      }
      
      const remainingDuration = endDate - currentDate;
      const daysRemaining = Math.ceil(remainingDuration / (1000 * 60 * 60 * 24));
      const daysElapsed = daysTotal - daysRemaining;
      
      const percentage = Math.round((daysElapsed / daysTotal) * 100);
      
      return { percentage, daysRemaining, totalDays: daysTotal, daysElapsed };
    } catch (error) {
      console.error('Error calculating certification progress:', error);
      return { percentage: 0, daysRemaining: 0, totalDays: 0, daysElapsed: 0 };
    }
  };
  
  // Format date for input fields
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [month, day, year] = dateStr.split('-').map(Number);
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  // Format date from input for display
  const formatDateFromInput = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  // Handle changes in input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
    
    // Automatically calculate 60 days after start date
    if (name === 'startDate' && value) {
      try {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 60);
        
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        setEditData(prev => ({
          ...prev,
          endDate: formattedEndDate
        }));
      } catch (error) {
        console.error('Error calculating end date:', error);
      }
    }
  };
  
  // Save changes to certification period
  const handleSaveChanges = () => {
    // In a real app, this would send data to the backend
    const newCertPeriod = `${formatDateFromInput(editData.startDate)} to ${formatDateFromInput(editData.endDate)}`;
    
    // Simulate data update
    if (isAddingNew) {
      // Add new period and set as active
      const newPeriod = {
        id: Math.max(...certPeriods.map(p => p.id)) + 1,
        period: newCertPeriod,
        status: 'active',
        insurance: editData.insurance,
        policyNumber: editData.policyNumber,
        agency: editData.agency
      };
      
      // Set all other periods to expired
      const updatedPeriods = certPeriods.map(p => ({
        ...p,
        status: 'expired'
      }));
      
      const newPeriods = [...updatedPeriods, newPeriod];
      setCertPeriods(newPeriods);
      setActivePeriodId(newPeriod.id);
    } else {
      // Update existing period
      const updatedPeriods = certPeriods.map(p => 
        p.id === activePeriodId
          ? { 
              ...p, 
              period: newCertPeriod,
              insurance: editData.insurance,
              policyNumber: editData.policyNumber,
              agency: editData.agency
            } 
          : p
      );
      
      setCertPeriods(updatedPeriods);
    }
    
    // Notify parent component
    if (onUpdateCertPeriod) {
      onUpdateCertPeriod({
        certPeriod: newCertPeriod,
        insurance: editData.insurance,
        policyNumber: editData.policyNumber,
        agency: editData.agency,
        startDate: editData.startDate,
        endDate: editData.endDate   
      });
    }
    
    // Reset states
    setIsEditing(false);
    setIsAddingNew(false);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    // Restore original data
    const activePeriod = certPeriods.find(p => p.id === activePeriodId);
    if (activePeriod) {
      const [startDateStr, endDateStr] = activePeriod.period.split(' to ');
      
      setEditData({
        startDate: formatDateForInput(startDateStr),
        endDate: formatDateForInput(endDateStr),
        insurance: activePeriod.insurance || '',
        policyNumber: activePeriod.policyNumber || '',
        agency: activePeriod.agency || ''
      });
    }
    
    setIsEditing(false);
    setIsAddingNew(false);
  };
  
  // Start adding a new period
  const handleAddNewPeriod = () => {
    setIsAddingNew(true);
    setIsEditing(false);
    
    // Set start date to today
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    
    // Calculate end date (60 days later)
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 60);
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    setEditData({
      startDate: formattedToday,
      endDate: formattedEndDate,
      insurance: patient?.insurance || '',
      policyNumber: patient?.policyNumber || '',
      agency: patient?.agency || ''
    });
  };
  
  // Switch to a different certification period
  const handleSelectPeriod = (periodId) => {
    // Find the selected period
    const selectedPeriod = certPeriods.find(p => p.id === periodId);
    if (!selectedPeriod) return;
    
    // Update active period
    const updatedPeriods = certPeriods.map(p => ({
      ...p,
      status: p.id === periodId ? 'active' : 'expired'
    }));
    
    setCertPeriods(updatedPeriods);
    setActivePeriodId(periodId);
    
    // Notify parent component
    if (onUpdateCertPeriod) {
      onUpdateCertPeriod({
        certPeriod: selectedPeriod.period,
        insurance: selectedPeriod.insurance,
        policyNumber: selectedPeriod.policyNumber,
        agency: selectedPeriod.agency
      });
    }
    
    setIsViewingHistory(false);
  };
  
  // Start delete confirmation process
  const handleConfirmDelete = (periodId) => {
    setConfirmDelete(periodId);
  };
  
  // Delete a certification period
  const handleDeletePeriod = (periodId) => {
    // Cannot delete the only period
    if (certPeriods.length <= 1) {
      setConfirmDelete(null);
      return;
    }
    
    // Remove the period
    const periodToDelete = certPeriods.find(p => p.id === periodId);
    const updatedPeriods = certPeriods.filter(p => p.id !== periodId);
    
    // If we're deleting the active period, set another one as active
    if (periodToDelete.status === 'active' && updatedPeriods.length > 0) {
      // Set the most recent period as active
      const sortedPeriods = [...updatedPeriods].sort((a, b) => {
        const aEndDate = a.period.split(' to ')[1].split('-').map(Number);
        const bEndDate = b.period.split(' to ')[1].split('-').map(Number);
        
        const aDate = new Date(aEndDate[2], aEndDate[0] - 1, aEndDate[1]);
        const bDate = new Date(bEndDate[2], bEndDate[0] - 1, bEndDate[1]);
        
        return bDate - aDate; // Sort descending (most recent first)
      });
      
      const newActivePeriod = sortedPeriods[0];
      updatedPeriods.forEach(p => {
        if (p.id === newActivePeriod.id) {
          p.status = 'active';
        }
      });
      
      setActivePeriodId(newActivePeriod.id);
      
      // Notify parent component
      if (onUpdateCertPeriod) {
        onUpdateCertPeriod({
          certPeriod: newActivePeriod.period,
          insurance: newActivePeriod.insurance,
          policyNumber: newActivePeriod.policyNumber,
          agency: newActivePeriod.agency
        });
      }
    }
    
    setCertPeriods(updatedPeriods);
    setConfirmDelete(null);
  };
  
  // Cancel delete confirmation
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  // Get the active certification period
  const getActivePeriod = () => {
    const activePeriod = certPeriods.find(p => p.status === 'active');
    return activePeriod ? activePeriod.period : null;
  };
  
  const selectedPeriod = getActivePeriod();
  const selectedPeriodData = certPeriods.find(p => p.status === 'active');
  const certInfo = calculateDaysRemaining(selectedPeriod);
  
  // Determine progress color based on days remaining
  const progressColor = 
    certInfo.daysRemaining < 12 ? '#ef4444' : 
    certInfo.daysRemaining < 30 ? '#f59e0b' : 
    '#10b981';
  
  return (
    <div className="certification-period-component">
      <div className="card-header">
        <div className="header-title">
          <i className="fas fa-certificate"></i>
          <h3>Certification Period</h3>
        </div>
        <div className="header-actions">
          {!isEditing && !isAddingNew && (
            <>
              <button 
                className="refresh-button" 
                onClick={() => setIsViewingHistory(!isViewingHistory)}
                title="View certification history"
              >
                <i className="fas fa-sync-alt"></i>
              </button>
              <button 
                className="edit-button" 
                onClick={() => setIsEditing(true)}
                title="Edit current period"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="add-button" 
                onClick={handleAddNewPeriod}
                title="Add new certification period"
              >
                <i className="fas fa-plus"></i>
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="card-body">
        {(isEditing || isAddingNew) ? (
          // Edit/Add form
          <div className="edit-form">
            <h4>{isAddingNew ? 'Add New Certification Period' : 'Edit Certification Period'}</h4>
            
            <div className="date-range-edit">
              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  name="startDate"
                  value={editData.startDate} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="date-separator">
                <i className="fas fa-arrow-right"></i>
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  name="endDate"
                  value={editData.endDate} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Insurance</label>
              <input 
                type="text" 
                name="insurance"
                value={editData.insurance} 
                onChange={handleInputChange}
                placeholder="Insurance Provider"
              />
            </div>
            
            <div className="form-group">
              <label>Policy Number</label>
              <input 
                type="text" 
                name="policyNumber"
                value={editData.policyNumber} 
                onChange={handleInputChange}
                placeholder="Policy Number"
              />
            </div>
            
            <div className="form-group">
              <label>Healthcare Agency</label>
              <input 
                type="text" 
                name="agency"
                value={editData.agency} 
                onChange={handleInputChange}
                placeholder="Healthcare Agency"
              />
            </div>
            
            <div className="form-actions">
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleSaveChanges}
                disabled={!editData.startDate || !editData.endDate}
              >
                {isAddingNew ? 'Add Period' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {isViewingHistory ? (
              // Certification periods history view
              <div className="cert-periods-history">
                <h4>Certification Periods History</h4>
                <div className="history-list">
                  {certPeriods.map((period) => (
                    <div 
                      key={period.id} 
                      className={`history-item ${period.status}`}
                    >
                      <div className="period-dates">
                        <span>{period.period}</span>
                      </div>
                      <div className="period-actions">
                        <div className="status-badge">
                          {period.status === 'active' ? 'Current' : 'Expired'}
                        </div>
                        
                        {period.status !== 'active' && (
                          <button
                            className="select-btn"
                            onClick={() => handleSelectPeriod(period.id)}
                            title="Use this period"
                          >
                            <i className="fas fa-check-circle"></i>
                          </button>
                        )}
                        
                        {confirmDelete === period.id ? (
                          <div className="delete-confirmation">
                            <span>Delete?</span>
                            <button 
                              className="confirm-btn"
                              onClick={() => handleDeletePeriod(period.id)}
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button 
                              className="cancel-btn"
                              onClick={handleCancelDelete}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="delete-btn"
                            onClick={() => handleConfirmDelete(period.id)}
                            disabled={certPeriods.length <= 1}
                            title={certPeriods.length <= 1 ? "Cannot delete the only period" : "Delete this period"}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="back-btn"
                  onClick={() => setIsViewingHistory(false)}
                >
                  <i className="fas fa-arrow-left"></i>
                  Back to Current Period
                </button>
              </div>
            ) : (
              // Normal display view
              <>
                <div className="date-range">
                  <div className="date-block">
                    <label>Start Date</label>
                    <div className="date-value">
                      {selectedPeriod?.split(' to ')[0] || '00/00/0000'}
                    </div>
                  </div>
                  <div className="progress-separator">
                    <div className="line"></div>
                  </div>
                  <div className="date-block">
                    <label>End Date</label>
                    <div className="date-value">
                      {selectedPeriod?.split(' to ')[1] || '00/00/0000'}
                    </div>
                  </div>
                </div>
                
                <div className="cert-progress-container">
                  <div className="cert-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${certInfo.percentage}%`, 
                          background: `linear-gradient(to right, ${progressColor}, ${progressColor}CC)` 
                        }}
                      >
                        <span className="progress-text">{certInfo.percentage}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="cert-details">
                    <div className="cert-detail-item">
                      <div className="detail-label">Days Elapsed</div>
                      <div className="detail-value">{certInfo.daysElapsed}</div>
                    </div>
                    <div className="cert-detail-item remaining">
                      <div className="detail-label">Days Remaining</div>
                      <div className="detail-value" style={{ color: progressColor }}>
                        {certInfo.daysRemaining}
                        <i className="fas fa-clock" style={{ color: progressColor }}></i>
                      </div>
                    </div>
                    <div className="cert-detail-item">
                      <div className="detail-label">Total Days</div>
                      <div className="detail-value">{certInfo.totalDays}</div>
                    </div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-label">Insurance</div>
                  <div className="info-value insurance-value">
                    <i className="fas fa-id-card"></i>
                    {selectedPeriodData?.insurance || 'Not available'}
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-label">Policy Number</div>
                  <div className="info-value">
                    <span className="policy-number">{selectedPeriodData?.policyNumber || 'Not available'}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-label">Healthcare Agency</div>
                  <div className="info-value agency-value">
                    <i className="fas fa-hospital"></i>
                    {selectedPeriodData?.agency || 'Not available'}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CertificationPeriodComponent;