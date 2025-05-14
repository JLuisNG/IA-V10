// components/developer/support/FloatingSupportButton.jsx
import React, { useState, useEffect } from 'react';
import '../../../styles/developer/support/FloatingSupportButtonDev.scss';
import SupportModal from '../welcome/SupportModalDev';

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
  
  // Toggle the support modal
  const handleToggleModal = () => {
    setIsModalOpen(prev => !prev);
    
    // Reset unread count when opening modal
    if (!isModalOpen) {
      setUnreadCount(0);
    }
  };
  
  return (
    <>
      <button 
        className={`floating-support-button ${isAnimating ? 'animate' : ''}`}
        onClick={handleToggleModal}
        aria-label="Toggle Support"
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
      
      {isModalOpen && <SupportModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default FloatingSupportButton;