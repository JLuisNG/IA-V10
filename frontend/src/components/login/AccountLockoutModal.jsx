import React, { useEffect, useState } from 'react';

const AccountLockoutModal = ({ isOpen, username, remainingTime, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(remainingTime || 0);
  const [showModal, setShowModal] = useState(false);
  
  // Format seconds into minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Effect to handle countdown
  useEffect(() => {
    if (isOpen && remainingTime > 0) {
      setTimeLeft(remainingTime);
      setShowModal(true);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Close modal after countdown ends
            setTimeout(() => {
              setShowModal(false);
              if (onClose) onClose();
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (!isOpen) {
      setShowModal(false);
    }
  }, [isOpen, remainingTime, onClose]);
  
  // Animation effect
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setShowModal(true);
      }, 100);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className={`account-lockout-overlay ${showModal ? 'show' : ''}`}>
      <div className="account-lockout-modal">
        <div className="lockout-icon-container">
          <div className="lockout-icon">
            <i className="fas fa-lock"></i>
            <div className="lockout-pulse"></div>
          </div>
        </div>
        
        <h2 className="lockout-title">Account Temporarily Locked</h2>
        
        <div className="lockout-message">
          <p>
            For your security, the account <strong>{username}</strong> has been temporarily 
            locked due to multiple failed login attempts.
          </p>
        </div>
        
        <div className="lockout-timer">
          <div className="timer-label">Account will unlock in:</div>
          <div className="timer-display">
            <div className="timer-value">{formatTime(timeLeft)}</div>
            <div className="timer-progress">
              <div 
                className="timer-progress-fill"
                style={{ width: `${(timeLeft / remainingTime) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="lockout-options">
          <button className="lockout-button secondary" onClick={onClose}>
            Try Another Account
          </button>
          <button className="lockout-button primary" onClick={() => window.location.href = '/#/forgotPassword'}>
            Reset Password
          </button>
        </div>
        
        <div className="lockout-footer">
          <p>
            <i className="fas fa-info-circle"></i> If you need immediate assistance, 
            please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountLockoutModal;