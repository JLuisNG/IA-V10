import React, { useState, useEffect } from 'react';

const SessionTimeoutWarning = ({ isOpen, remainingTime, onStayLoggedIn, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(remainingTime || 60);
  const [showModal, setShowModal] = useState(false);
  
  // Effect to handle animation and visibility
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setShowModal(true);
      }, 100);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);
  
  // Effect to handle countdown
  useEffect(() => {
    if (!isOpen || !remainingTime) return;
    
    setTimeLeft(remainingTime);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto logout when timer reaches zero
          if (onLogout) onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, remainingTime, onLogout]);
  
  if (!isOpen) return null;
  
  return (
    <div className={`session-timeout-overlay ${showModal ? 'show' : ''}`}>
      <div className="session-timeout-modal">
        <div className="timeout-icon">
          <i className="fas fa-clock"></i>
        </div>
        
        <h3 className="timeout-title">Session Timeout</h3>
        
        <div className="timeout-message">
          <p>
            Your session will expire in <span className="timeout-countdown">{timeLeft}</span> seconds due to inactivity.
          </p>
          <p>
            Do you want to stay logged in?
          </p>
        </div>
        
        <div className="timeout-timer">
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
                  strokeDashoffset: `${283 - (283 * timeLeft / remainingTime)}`
                }}
              />
            </svg>
            <div className="timer-text">{timeLeft}</div>
          </div>
        </div>
        
        <div className="timeout-actions">
          <button 
            className="timeout-button stay-logged-in" 
            onClick={onStayLoggedIn}
          >
            Stay Logged In
          </button>
          <button 
            className="timeout-button logout" 
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;