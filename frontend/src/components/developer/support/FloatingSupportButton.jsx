// components/developer/support/FloatingSupportButton.jsx
import React, { useState, useEffect } from 'react';
import '../../../styles/developer/support/FloatingSupportButton.scss';
import SupportModal from '../welcome/SupportModal';

const FloatingSupportButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animate the button periodically to draw attention
  useEffect(() => {
    if (unreadCount > 0 && !isModalOpen) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [unreadCount, isModalOpen]);
  
  // Reset animation when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setIsAnimating(false);
    }
  }, [isModalOpen]);
  
  // Open the support modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Reset unread count when opening modal
    // In a real app, this would be handled via API
    setUnreadCount(0);
  };
  
  // Close the support modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <button 
        className={`floating-support-button ${isAnimating ? 'animate' : ''}`}
        onClick={handleOpenModal}
        aria-label="Open Support"
      >
        <div className="button-icon">
          <i className="fas fa-headset"></i>
        </div>
        
        {unreadCount > 0 && (
          <div className="unread-badge">{unreadCount}</div>
        )}
        
        <div className="button-tooltip">
          <span>Support Center</span>
        </div>
      </button>
      
      <SupportModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default FloatingSupportButton;