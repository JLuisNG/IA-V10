import React, { useState } from 'react';
import AddStaffForm from './AddStaffForm';
import StaffListComponent from './StaffListComponent';
import StaffEditComponent from './StaffEditComponent';

const AdminStaffingManagerContainer = () => {
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [showStaffList, setShowStaffList] = useState(false);
  const [showStaffEdit, setShowStaffEdit] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const handleAddStaffClick = () => {
    setShowAddStaffForm(true);
    setShowStaffList(false);
    setShowStaffEdit(false);
    setSelectedContent('add-staff');
  };

  const handleViewAllStaffClick = () => {
    setShowStaffList(true);
    setShowAddStaffForm(false);
    setShowStaffEdit(false);
    setSelectedContent('view-staff');
  };

  const handleEditStaffClick = () => {
    setShowStaffEdit(true);
    setShowAddStaffForm(false);
    setShowStaffList(false);
    setSelectedContent('edit-staff');
  };

  const handleCancelForm = () => {
    setShowAddStaffForm(false);
    setShowStaffList(false);
    setShowStaffEdit(false);
    setSelectedContent(null);
  };

  const handleBackToOptions = () => {
    setShowStaffList(false);
    setShowAddStaffForm(false);
    setShowStaffEdit(false);
    setSelectedContent('therapists');
  };

  return (
    <div className="selected-content-area">
      {showAddStaffForm ? (
        <AddStaffForm onCancel={handleCancelForm} />
      ) : showStaffList ? (
        <StaffListComponent onBackToOptions={handleBackToOptions} />
      ) : showStaffEdit ? (
        <StaffEditComponent onBackToOptions={handleBackToOptions} />
      ) : (
        <>
          {selectedContent ? (
            <div className="selected-content-card">
              <div className="content-header">
                <h2>
                  Therapists & Office Staff
                </h2>
                <p>
                  View and manage your therapy and office staff team members.
                </p>
              </div>
              
              <div className="content-body">
                <div className="placeholder-content">
                  <i className="fas fa-users"></i>
                  <p>Select an action to continue with staff management</p>
                  
                  <div className="action-buttons">
                    <button className="action-btn add" onClick={handleAddStaffClick}>
                      <i className="fas fa-user-plus"></i> Add New Staff
                    </button>
                    <button className="action-btn view" onClick={handleViewAllStaffClick}>
                      <i className="fas fa-list"></i> View All Staff
                    </button>
                    <button className="action-btn edit" onClick={handleEditStaffClick}>
                      <i className="fas fa-user-edit"></i> Edit Existing Staff
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="welcome-select-message">
              <i className="fas fa-hand-point-up"></i>
              <h3>Please Select an Option Above</h3>
              <p>Choose "Therapists & Office Staff" or "Scheduling & Assignments" to get started</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminStaffingManagerContainer;