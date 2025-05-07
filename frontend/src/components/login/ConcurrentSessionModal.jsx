import React, { useState, useEffect } from 'react';

const ConcurrentSessionModal = ({ isOpen, deviceInfo, onStaySigned, onSignOut }) => {
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(30);
  
  // Effect to handle visibility animation
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setShowModal(true);
      }, 100);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);
  
  // Effect to handle auto logout countdown
  useEffect(() => {
    if (!isOpen) {
      setTimer(30);
      return;
    }
    
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          // Auto logout when timer reaches zero
          if (onSignOut) onSignOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  }, [isOpen, onSignOut]);
  
  if (!isOpen) return null;
  
  return (
    <div className={`concurrent-session-overlay ${showModal ? 'show' : ''}`}>
      <div className="concurrent-session-modal">
        <div className="session-warning-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        
        <h2 className="session-title">Account Active on Another Device</h2>
        
        <div className="session-message">
          <p>
            Your account has been signed in on another device. For security reasons, 
            only one active session is allowed at a time.
          </p>
          
          {deviceInfo && (
            <div className="device-info-box">
              <div className="device-info-title">New login detected from:</div>
              <div className="device-info-details">
                <div className="device-detail">
                  <i className="fas fa-laptop"></i>
                  <span>Device: {deviceInfo.device || 'Unknown'}</span>
                </div>
                <div className="device-detail">
                  <i className="fas fa-globe"></i>
                  <span>Browser: {deviceInfo.browser || 'Unknown'}</span>
                </div>
                <div className="device-detail">
                  <i className="fas fa-clock"></i>
                  <span>Time: {new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="session-timer">
          <div className="timer-circle">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle 
                className="timer-bg" 
                cx="50" 
                cy="50" 
                r="45"
              />
              <circle 
                className="timer-progress" 
                cx="50" 
                cy="50" 
                r="45"
                style={{
                  strokeDashoffset: `${283 - (283 * timer / 30)}`
                }}
              />
            </svg>
            <div className="timer-text">{timer}</div>
          </div>
          <div className="timer-label">
            Signing out automatically in {timer} seconds...
          </div>
        </div>
        
        <div className="session-actions">
          <button 
            className="session-button stay-signed-in" 
            onClick={onStaySigned}
          >
            Stay Signed In Here
          </button>
          <button 
            className="session-button sign-out" 
            onClick={onSignOut}
          >
            Sign Out
          </button>
        </div>
        
        <div className="session-footer">
          <p>
            <i className="fas fa-info-circle"></i> Choosing "Stay Signed In Here" will sign you out on the other device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConcurrentSessionModal;